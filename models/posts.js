const mongoose = require('mongoose');   //Importing mongoose.js
const User = require('./user');         //user model
const Comment = require('./comment');   //Comment model

//Creating Schema for User's Posts
const postsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {                                         //Referencing Each Posts to a User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: [                                      //Each post containing array of comments
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
});

//Telling mongoose it is a mongoDB model
const Posts = mongoose.model('Posts', postsSchema);

//Exporting Posts model
module.exports = Posts;