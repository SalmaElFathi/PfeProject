const Application = require("../models/application.js");
const  Job = require("../models/job.js");
const mongoose = require("mongoose");
const Subscription=require('../models/subscription');
const webpush = require('web-push');


const postApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume File Required!",
      });
    }
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantId = {
      user: req.user._id,
      role: "jobseeker",
    };

    if (!jobId) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }
    console.log("jobId "+jobId);
    const jobDetails = await Job.findById(jobId);

    if (!jobDetails) {
      return res.status(404).json({
        success: false,
        message: "Job not found!",
      });
    }

    const employerId = {
      user: jobDetails.postedBy,
      role: "employer",
    };

    if (!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    const applicantObjectId = new mongoose.Types.ObjectId(applicantId.user);
    const employerObjectId = new mongoose.Types.ObjectId(employerId.user);

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantId: applicantObjectId,
      employerId: employerObjectId,
      resume: req.file.filename,
      applicantRole: "jobseeker",
      employerRole: "employer",
    });

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};



const employerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "jobseeker") {
      return res.status(400).json({
        success: false,
        message: "Job Seeker not allowed to access this resource.",
      });
    }

    const { _id } = req.user;
    const applications = await Application.find({ employerId: _id });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const jobseekerGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "employer") {
      return res.status(400).json({
        success: false,
        message: "Employer not allowed to access this resource.",
      });
    }

    const { _id } = req.user;
    const applications =await Application.find({ applicantId: _id });  
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const jobseekerDeleteApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "employer") {
      return res.status(400).json({
        success: false,
        message: "Employer not allowed to access this resource.",
      });
    }

    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found!",
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const acceptApplication=async (req, res) => {
  const { id } = req.params;

  try {
    await Application.findByIdAndUpdate(id, { status: 'accepted' });

    const application = await Application.findById(id);
    console.log('application '+application);
    const jobSeekerId = application.applicantId;
    console.log('jobSeekerId '+jobSeekerId);

    const subscriptions = await Subscription.find({ userId: jobSeekerId });
      console.log('subscriptions '+subscriptions);
    const pushNotificationData = {
      title: 'Your application has been accepted! !',
      body: 'Congratulations! Your application has been accepted for the position.'
    };

    for (const subscription of subscriptions) {
      await webpush.sendNotification(subscription, JSON.stringify(pushNotificationData));
    }

    return res.status(200).json({ success: true, message: 'Application accepted successfully.' });
  } catch (error) {
    console.error('Error accepting application:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const rejectApplication= async (req, res) => {
  const { id } = req.params;

  try {
    await Application.findByIdAndUpdate(id, { status: 'rejected' });

    const application = await Application.findById(id);
    console.log('Application:', application);

    const jobSeekerId = application.applicantId;
    console.log('Job Seeker ID:', jobSeekerId);

    const subscriptions = await Subscription.find({ userId: jobSeekerId });
    console.log('Subscriptions:', subscriptions);

    const pushNotificationData = {
      title: 'Your application has been rejected',
      body: 'Unfortunately, your application has been rejected. Better luck next time.'
    };

    for (const subscription of subscriptions) {
      await webpush.sendNotification(subscription, JSON.stringify(pushNotificationData));
    }

    return res.status(200).json({ success: true, message: 'Application rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
module.exports={ postApplication, employerGetAllApplications, jobseekerGetAllApplications, jobseekerDeleteApplication,acceptApplication,rejectApplication };
