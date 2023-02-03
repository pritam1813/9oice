const Posts = require('../models/posts');       //Importing Post Schema
const Comment = require('../models/comment');   //Importing the Comment Schema

//Action for handling user's Feed Post creation
module.exports.create = async function(req, res){
    try{
        await Posts.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    } catch(err) {
        console.log(`Error: ${err}}`);
        return;
    }
};

//Action for deleting a user post
module.exports.destroy = async function(req, res){
    try{
        let post = await Posts.findById(req.params.id);  //Fetching post id from url param

        //post.user is the user from posts schema which returns the user id.
        /*Comparing if the currently authorized user id is same as the post.user 
        So that, deleting permission for other users are restricted*/  
        if(post.user == req.user.id){
            await post.remove();          //Deleting the post

            //Deleting all/ the Comments of the post
            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
        
    } catch(err){
        console.log(`Error: ${err}}`);
        return;
    }
};