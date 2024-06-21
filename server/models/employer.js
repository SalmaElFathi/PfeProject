const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
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
    entreprise: {
        type: String,
        default: ''
    },
});
const Employer = mongoose.model('Employer', EmployerSchema);
module.exports = Employer;