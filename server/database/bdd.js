const mongoose = require('mongoose');
/*
const onlineURL = process.env.MONGODB_ONLINE_URI;
//const offlineURL = 'mongodb://localhost:27017/Rejoin';
mongoose.connect(onlineURL)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

module.exports = mongoose;*/
require('dotenv').config();

const onlineURL = 'mongodb+srv://Salma:Salma2004@mycluster.7sjzkyx.mongodb.net/my_bdd';
const offlineURL = 'mongodb://localhost:27017/Rejoin';

// Utiliser l'URL en ligne par défaut, sauf si l'URL hors ligne est spécifiquement nécessaire
const mongoURI = onlineURL || offlineURL;

if (!mongoURI) {
  console.error('No MongoDB URI provided in environment variables');
  process.exit(1);
}

console.log('Connecting to MongoDB with URI:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

module.exports = mongoose;



/*
require('dotenv').config();

const onlineURL = process.env.MONGODB_ONLINE_URI;
const offlineURL = process.env.MONGODB_OFFLINE_URI;
console.log(onlineURL);
mongoose.connect(onlineURL)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });
*/
module.exports = mongoose;