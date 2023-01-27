const mongoose = require('mongoose');   //Importing mongoose.js
const User = require('./user');         //user model
const Posts = require('./posts');       //Posts model

//Creating Schema for User's Comments
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    post: {                                         //Referencing Each Comments to a Post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,       //Referencing Each Comments to a User
        ref: 'User'
    }
},{
    timestamps: true
});

//Telling mongoose it is a mongoDB model
const Comment = mongoose.model('Comment', commentSchema);

//Exporting Comment model
module.exports = Comment;