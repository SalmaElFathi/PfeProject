const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JobSeeker = require("../models/jobseeker");
const Employer = require("../models/employer");
const nodemailer = require("nodemailer");
const Subscription = require("../models/subscription");

const register = async (req, res) => {
  try {
    const { userEmail, password, role } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required." });
    }
    const jobSeekerExists = await JobSeeker.findOne({ userEmail });
    const employerExists = await Employer.findOne({ userEmail });

    if (jobSeekerExists || employerExists) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (role === "jobseeker") {
      newUser = new JobSeeker({
        userEmail,
        password: hashedPassword,
        role,
      });
    } else if (role === "employer") {
      newUser = new Employer({
        userEmail,
        password: hashedPassword,
        role,
      });
    } else {
      return res.status(400).json({ message: "Invalid role." });
    }

    await newUser.save();

    const accessToken = jwt.sign(
      { userEmail: newUser.userEmail, userId: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const sendWelcomeEmail = async (user, accessToken) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sf61035@gmail.com",
          pass: "sndv jfnh szdm tmzs",
        },
      });

      const mailOptions = {
        from: "sf61035@gmail.com",
        to: user.userEmail,
        subject: "Welcome to our platform",
        text: `Bienvenue sur notre plateforme! Vous pouvez vous connecter en utilisant le lien suivant : http://localhost:3000/login/${accessToken}`,
      };

      return transporter.sendMail(mailOptions);
    };

    await sendWelcomeEmail(newUser, accessToken);

    return res
      .status(201)
      .json({ message: "User created successfully", accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

const getUser = async (req, res) => {
  try {
    const user =
      (await Employer.findById(req.params._id)) ||
      (await JobSeeker.findById(req.params._id));
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).send({ message: "Failed to fetch user profile" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { role } = req.user;
    const { username, Bio, age, address, phoneNumber, industry, subIndustry } =
      req.body;

    let profilePicture = "";
    let resume = "";
    let entreprise = "";

    if (req.files) {
      if (req.files["profilePicture"]) {
        profilePicture = req.files["profilePicture"][0].filename;
      }
      if (req.files["resume"]) {
        resume = req.files["resume"][0].filename;
      }
    }

    const sanitizedAge = age ? Number(age) : null;

    const updatedFields = {
      username,
      Bio,
      age: sanitizedAge,
      address,
      phoneNumber,
      industry,
      subIndustry,
      ...(profilePicture && { profilePicture }),
    };

    if (role === "jobseeker") {
      updatedFields.resume = resume;
      updatedFields.experiences = req.body.experiences
        ? JSON.parse(req.body.experiences)
        : [];
      updatedFields.education = req.body.education
        ? JSON.parse(req.body.education)
        : [];
      updatedFields.certifications = req.body.certifications
        ? JSON.parse(req.body.certifications)
        : [];
    } else if (role === "employer") {
      updatedFields.entreprise = req.body.entreprise;
    }

    const Model = role === "jobseeker" ? JobSeeker : Employer;
    const updatedUser = await Model.findOneAndUpdate(
      { _id },
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    console.log("Profile updated successfully for user:", updatedUser);
    return res.json({
      msg: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res
      .status(500)
      .json({ msg: "Failed to update profile. Please try again later." });
  }
};

const login = async (req, res) => {
  const { userEmail, password } = req.body;
  if (!userEmail || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const foundUser =
      (await Employer.findOne({ userEmail }).exec()) ||
      (await JobSeeker.findOne({ userEmail }).exec());
    if (!foundUser) {
      console.log("User not found:", userEmail);
      return res.status(401).json({ message: "User not found" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      console.log("Password incorrect for user:", userEmail);
      return res.status(401).json({ message: "Incorrect password" });
    }
    console.log("User logged in successfully:", foundUser);
    const accessToken = jwt.sign(
      {
        userEmail: foundUser.userEmail,
        role: foundUser.role,
        userId: foundUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ accessToken, userId: foundUser._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: error.message });
  }
};

const forgetPassword = (req, res) => {
  const { email } = req.body;

  console.log(email);
  Promise.all([
    JobSeeker.findOne({ userEmail: email }),
    Employer.findOne({ userEmail: email }),
  ])
    .then(([jobSeeker, employer]) => {
      const user = jobSeeker || employer;
      console.log("user est " + user);
      if (!user) {
        return res.send({ Status: "User not existed" });
      }

      const role = jobSeeker ? "jobseeker" : "employer";

      const token = jwt.sign(
        { id: user._id, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sf61035@gmail.com",
          pass: "sndv jfnh szdm tmzs",
        },
      });

      var mailOptions = {
        from: "sf61035@gmail.com",
        to: user.userEmail,
        subject: "Reset Password Link",
        text: `http://localhost:3000/reset-password/${user._id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("error sending email" + error);
        } else {
          console.log("email sent" + email);
          return res.send({ Status: "Success" });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.send({ Status: "Error finding user" });
    });
};
const resetPassword = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log("id is " + id);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          const { role } = decoded;
          console.log("role est " + role);
          const Model = role === "jobseeker" ? JobSeeker : Employer;
          console.log(Model);
          Model.findByIdAndUpdate(id, { password: hash, new: true })
            .then(() => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err.message }));
        })
        .catch((err) => res.send({ Status: err.message }));
    }
  });
};

const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
const subscribeToNotifications = async (req, res) => {
  const { subscription, industry, subIndustry } = req.body;
  const userId = req.user._id;
  console.log("Received subscription:", subscription);
  console.log("Received industry:", industry);
  console.log("Received subIndustry:", subIndustry);

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ message: "Invalid subscription object" });
  }
  try {
    await Subscription.create({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId,
      industry,
      subIndustry,
    });
  } catch (err) {
    console.log(err);
  }
  res.status(201).json({});
};

const getUserIndustryAndSubIndustry = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await JobSeeker.findById(userId).select(
      "industry subIndustry"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ industry: user.industry, subIndustry: user.subIndustry });
  } catch (error) {
    console.error("Error retrieving user industry and subIndustry:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteAccount = async (req, res) => {
  try {
    const userId = req.params._id;
    const user =
      (await JobSeeker.findByIdAndDelete(userId)) ||
      (await Employer.findByIdAndDelete(userId));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sf61035@gmail.com",
        pass: "sndv jfnh szdm tmzs",
      },
    });

    const mailOptions = {
      from: "sf61035@gmail.com",
      to: user.userEmail,
      subject: "Account Deleted",
      text: `Your account has been deleted successfully. If you have any questions, please contact us at support@example.com.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("error sending email" + error);
      } else {
        console.log("email sent" + email);
        req.flash("success", "Your account has been deleted successfully.");
        return res.redirect("/login");
      }
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account" });
  }
};

module.exports = {
  login,
  register,
  logout,
  forgetPassword,
  resetPassword,
  getUser,
  updateUser,
  getUserIndustryAndSubIndustry,
  subscribeToNotifications,
  deleteAccount,
};
