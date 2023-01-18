/* For Conneting to MongoDB Database */

//Importing mongoose library
const mongoose = require('mongoose');

//Importing Dotenv module to hide the DB URI String
require('dotenv').config();

//Defining mongoose to connect to the database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 });

//Getting the connected DB
const db = mongoose.connection;

//Handling the error for DB connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB!");
});

//Exporting
module.exports = db;