const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jobseeker',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    },
},
    industry: {
        type: String,
        default: ''
      },
      subIndustry: {
        type: String,
        default: ''
      }
  
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
