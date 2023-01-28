const Posts = require('../models/posts');       //Importing Post Schema
const Comment = require('../models/comment');   //Importing the Comment Schema

//Action for handling user's Feed Post creation
module.exports.create = function(req, res){
    Posts.create({
        content: req.body.content,
        user: req.user._id
    }, 
    function(err, post){
        if(err){console.log(`Error in Post Creation: ${err}`); return;}

        return res.redirect('back');
    });
};

//Action for deleting a user post
module.exports.destroy = function(req, res){

    Posts.findById(req.params.id, function(err, post){  //Fetching post id from url param
        if(err){console.log(err)};

        //post.user is the user from posts schema which returns the user id.
        /*Comparing if the currently authorized user id is same as the post.user 
        So that, deleting permission for other users are restricted*/  
        if(post.user == req.user.id){
            post.remove();          //Deleting the post

            //Deleting all/ the Comments of the post
            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });
        }
        else{
            return res.redirect('back');
        }

    });
};