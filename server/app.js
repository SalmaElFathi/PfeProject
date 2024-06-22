const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/routes');
const app = express();
const mongoose = require('./database/bdd');
const cookieParser = require('cookie-parser');
const webpush = require("web-push");

require('dotenv').config();
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'https://pfeproject-9955.onrender.com', // Le domaine de votre frontend
  credentials: true // Si vous utilisez des cookies
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use('/api', routes);
app.use(cookieParser());
app.use(express.static('public'));

const publicVapidKey = "BIV58D6JB2lxp2IOANhGaORZ-2s30At83cIGxjmZYfRXy53k7R1sE22j8vQ_Jg6G4znxh0JDebXw7isu6lN3RU4";
const privateVapidKey ="F-DV4_SBSUvp3zmA64kw18DIevpR5KVXuQNRr5_GSZA";
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);









module.exports = { app };
