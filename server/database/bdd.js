const mongoose = require('mongoose');

const onlineURL = "mongodb+srv://Salma:Salma2004@mycluster.7sjzkyx.mongodb.net/my_bdd";
const offlineURL = 'mongodb://localhost:27017/Rejoin';
mongoose.connect(offlineURL)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

module.exports = mongoose;
