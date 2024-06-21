const mongoose = require('mongoose');

const JobSeekerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "17160603104168847419.png"
    },
    Bio: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        required: true,
        default: ""
    },
    industry: {
        type: String,
        default: ""
    },
    subIndustry: {
        type: String,
        default: ""
    },
    age: {
        type: Number,
    },
    address: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    experiences: [{
        title: String,
        company: String,
        from: Date,
        to: Date
    }],
    education: [{
        school: String,
        degree: String,
        from: Date,
        to: Date
    }],
    certifications: [{
        name: String,
        institution: String,
        date: Date
    }],
    resume: {
        type: String,
        default: ""
    },
});
const JobSeeker = mongoose.model('JobSeeker', JobSeekerSchema);
module.exports = JobSeeker;
