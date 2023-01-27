const Comment = require('../models/comment'); //Importing Comment model
const Posts = require('../models/posts');       //Importing post model

//Action for handling user Comments
module.exports.create = function(req,res){
    //Since comment is made on a post so first finding the post

    Posts.findById(req.body.post, function(err, post){      
        if(err){console.log(`Error in finding post: ${err}`); return;}      //Handling Error

        if(post){                                           //If post is found then we create the comment
            Comment.create({
                content: req.body.content,                  //From the form name=content
                post: req.body.post,                    
                user: req.user._id
            },
            function(err, comment){
                if(err){console.log(`Error in Adding Comment: ${err}`); return;}
                
                post.comment.push(comment);                 //Using mongo's function to push the comment into the post database
                post.save();
                return res.redirect('/');
            });
        }
    });
};