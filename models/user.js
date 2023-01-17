// Importing mongoose.js for creating mongoDB schemas
const mongoose = require('mongoose');

//Creating User Schema
const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//Telling mongoose it is a mongoDB model
const User = mongoose.model('User',userSchema);

//Exporting the model
module.exports = User;