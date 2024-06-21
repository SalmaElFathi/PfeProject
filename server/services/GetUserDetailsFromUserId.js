const JobSeeker = require('../models/jobseeker');
const Employer = require('../models/employer');

const GetUserDetailsFromUserId = async (userId) => {
    try {
        const user1 = await JobSeeker.findOne({ _id: userId }).select('-password');
        const user2 = await Employer.findOne({ _id: userId }).select('-password');
        if (user1) {
            return user1;
        } else if (user2) {
            return user2;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = GetUserDetailsFromUserId;