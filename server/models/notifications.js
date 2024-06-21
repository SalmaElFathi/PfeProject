const mongoose = require('mongoose');

const Notification = new mongoose.Schema({
    user_id: {
        type: String
    },
    job_id: {
        type: String
    }
}, { versionKey: false });

const Notifications = mongoose.model('Notifications', Notification);

module.exports = Notifications;
