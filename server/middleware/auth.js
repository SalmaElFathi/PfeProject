
/*const jwt = require('jsonwebtoken');
const JobSeeker = require('../models/jobseeker');
const Employer = require('../models/employer');

const isAuthentificated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       } 
      catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    let user;
    if (decoded.role === 'jobseeker') {
      user = await JobSeeker.findById(decoded.userId);
    } else if (decoded.role === 'employer') {
      user = await Employer.findById(decoded.userId);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = isAuthentificated;*/

const jwt = require('jsonwebtoken');
const JobSeeker = require('../models/jobseeker');
const Employer = require('../models/employer');

const isAuthentificated = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user;
    if (decoded.role === 'jobseeker') {
      user = await JobSeeker.findById(decoded.userId);
    } else if (decoded.role === 'employer') {
      user = await Employer.findById(decoded.userId);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = isAuthentificated;


