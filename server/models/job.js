const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    default: ""
  },
  subIndustry: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    required: true
  },
  fixedSalary: {
    type: Number
  },
  salaryFrom: {
    type: Number,
  },
  salaryTo: {
    type: Number,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Employer",
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;