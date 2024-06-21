const mongoose = require("mongoose");
const validator = require("validator");

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please enter your Cover Letter!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  resume: {
    type:String,
    default:'',
    required:true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobseeker",
    required: true,
  },
  applicantRole: {
    type: String,
    enum: ["jobseeker"],
    required: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
    required: true,
  },
  employerRole: {
    type: String,
    enum: ["employer"],
    required: true,
  },
}, { timestamps: true });

 const Application = mongoose.model("Application", applicationSchema);
 module.exports=Application;
