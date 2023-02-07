// Importing mongoose.js for creating mongoDB schemas
const mongoose = require('mongoose');
const multer  = require('multer');                      // Middleware for uploading files
const path = require('path');
const AVATAR_PATH = path.join('/uploads/user/Avatars');
//const upload = multer({ dest: 'uploads/' });            //Path for the file uploads

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
    },
    avatar : {
        type: String,
    }
}, {
    timestamps: true
});

//Multer disk storage engine for storing and controlling files to disk.
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..' , AVATAR_PATH ));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

//Static Function
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;                        //To make the path publicily available

//Telling mongoose it is a mongoDB model
const User = mongoose.model('User',userSchema);

//Exporting the model
module.exports = User;