const mongoose = require('mongoose');   //Importing mongoose.js
const User = require('./user');         //user model

//Creating Schema for User's Reset Password Token
const resetPasswordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resetPassToken: {
        type: String
    },
    expires: {
        type: Date,
    }
},{
    timestamps: true
});

//Telling mongoose it is a mongoDB model
const ResetuserPassword = mongoose.model('ResetuserPassword', resetPasswordSchema);

//Exporting ResetPassword model
module.exports = ResetuserPassword;