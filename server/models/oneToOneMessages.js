const mongoose = require('mongoose');

const oneToOneMessages = mongoose.Schema({
    message: {
        type: String
    },
    messageType: {
        type: String
    },
    messageTime: {
        type: String
    },
    chatId: {
        type: String
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    },
    createdBy: {
        type: String
    },
}, { versionKey: false });

const OneToOneMessages = mongoose.model('OneToOneMessages', oneToOneMessages)

module.exports = OneToOneMessages;