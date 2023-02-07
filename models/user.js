// Importing mongoose.js for creating mongoDB schemas
const mongoose = require('mongoose');
const multer  = require('multer');                      // Middleware for uploading files

/* Required when using Local storage */
//const path = require('path');
//const AVATAR_PATH = path.join('/uploads/user/Avatars');

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
    },
    rawAvatar : {
        type: String
    }
}, {
    timestamps: true
});

/*###--UNCOMMENT FOR USING THE LOCAL STORAGE--###*/
/*
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
*/

const storage = multer.memoryStorage();

//Static Functions
userSchema.statics.uploadedAvatar = multer({ storage : storage }).single('avatar');
//userSchema.statics.avatarPath = AVATAR_PATH;                        //To make the path publicily available

//Telling mongoose it is a mongoDB model
const User = mongoose.model('User',userSchema);

//Exporting the model
module.exports = User;