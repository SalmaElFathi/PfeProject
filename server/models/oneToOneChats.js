const mongoose = require('mongoose');

const oneToOneChats = mongoose.Schema({
    user_id_1: {
        type: String
    },
    user_id_2: {
        type: String
    },
    createdBy: {
        type: String
    },
    lastMessage: {
        type: String
    },
    messageCount: {
        type: Number
    }
}, { versionKey: false });

const OneToOneChats = mongoose.model('OneToOneChats', oneToOneChats)

module.exports = OneToOneChats;