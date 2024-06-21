const nodemailer = require("nodemailer");
const JobSeeker = require("../models/jobseeker");
const Job = require("../models/job");
const Notifications = require("../models/notifications");
const Subscription = require("../models/subscription");
const webpush = require("web-push");
const publicVapidKey ="BIV58D6JB2lxp2IOANhGaORZ-2s30At83cIGxjmZYfRXy53k7R1sE22j8vQ_Jg6G4znxh0JDebXw7isu6lN3RU4";

const postJob = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return res.status(400).json({
        success: false,
        message: "Job Seeker not allowed to access this resource.",
      });
    }

    const {
      title,
      description,
      industry,
      subIndustry,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      jobPostedOn,
    } = req.body;

    const postedBy = req.user._id;

    const job = await Job.create({
      title,
      description,

      industry,
      subIndustry,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      jobPostedOn,
      postedBy: req.user._id,
    });

    console.log(job);
    const notifications = await Notifications.create({
      job_id: job._id,
    });

    const users = await JobSeeker.find({
      industry: industry,
      subIndustry: subIndustry,
    });

    const payload = JSON.stringify({
      title: "New job available!",
      body: `A new job in ${subIndustry} industry has been posted in ${industry} sector.`,
    });
    users.forEach(async (user) => {
      try {
        const subscription = await Subscription.findOne({ userId: user._id });
        if (subscription && subscription.endpoint) {
          console.log("user.pushSubscription " + subscription);
          await webpush
            .sendNotification(subscription, payload)
            .catch(async (err) => {
              if (err.statusCode === 410) {
                await Subscription.deleteOne({ _id: subscription._id });
                console.log("Subscription deleted:", subscription._id);
              } else {
                console.error("Error sending notification:", err);
              }
            });
        }
      } catch (err) {
        console.log(err);
      }
    });

    const jobSeekers = await JobSeeker.find({
      industry: job.industry,
      subIndustry: job.subIndustry,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sf61035@gmail.com",
        pass: "sndv jfnh szdm tmzs",
      },
    });

    const emailTemplate = (job, jobSeeker) => `
      <h2>New Job Posting: ${job.title}</h2>
      <p>Industry: ${job.industry}</p>
      <p>Subindustry: ${job.subIndustry}</p>
      <p>Description: ${job.description}</p>
      <p><a href="http://localhost:8000/api/job/${job._id}"> Job Details</a></p>
    `;

    jobSeekers.forEach((jobSeeker) => {
      const mailOptions = {
        from: " sf61035@gmail.com",
        to: jobSeeker.userEmail,
        subject: `New Job Posting: ${job.title}`,
        html: emailTemplate(job, jobSeeker),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Error sending email to ${jobSeeker.userEmail}:`, error);
        } else {
          console.log(`Email sent to ${jobSeeker.userEmail}:`, info.response);
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Job posted successfully!",
      job,
    });
  } catch (err) {
    console.error("Error posting job:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getMyJobs = async (req, res, next) => {
  const { role } = req.user;
  console.log(role);
  if (role === "jobseeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "jobseeker") {
      res.status(400).json({
        success: false,
        message: "Job Seeker not allowed to access this resource.",
      });
      return;
    }

    const { id } = req.params;
    const updatedJob = req.body;

    console.log(updatedJob);

    const job = await Job.findByIdAndUpdate(id, updatedJob, { new: true });

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteJob = async (req, res, next) => {
  const { role } = req.user;
  if (role === "jobseeker") {
    return res.status(400).json({
      success: false,
      message: "Job Seeker not allowed to access this resource.",
    });
  }

  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "OOPS! Job not found.",
    });
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
};

const getLastJobs=async (req, res) => {
  try {
    const latestJobs = await Job.find().sort({ jobPostedOn: -1 }).limit(4);
    res.json(latestJobs);
  } catch (err) {
    console.error('Error fetching latest jobs:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
const searchJob=async (req, res) => {
  try {
    const { title, salary, location } = req.query;
    const conditions = [];

    if (title) conditions.push({ title: new RegExp(title, 'i') });
    if (location) conditions.push({ location: new RegExp(location, 'i') });

    if (salary) {
      const salaryQuery = {
        $or: [
          { fixedSalary: { $gte: parseInt(salary) } },
          { $and: [
            { salaryFrom: { $lte: parseInt(salary) } }, 
            { salaryTo: { $gte: parseInt(salary) } }
          ]}
        ]
      };
      conditions.push(salaryQuery);
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};
      console.log("query "+query);

    const jobs = await Job.find(query);
    console.log("jobs "+jobs);

    res.json(jobs);
    if(!jobs) {}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  postJob,
  getAllJobs,
  getMyJobs,
  updateJob,
  deleteJob,
  getSingleJob,
  getLastJobs,
  searchJob
};
