const mongoose = require('mongoose');   //Importing mongoose.js

//Creating Schema for User's Posts
const postsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

//Telling mongoose it is a mongoDB model
const Posts = mongoose.model('Posts', postsSchema);

//Exporting Posts model
module.exports = Posts;