const Posts = require('../models/posts');       //Importing Post Schema
const Comment = require('../models/comment');   //Importing the Comment Schema
const Like = require('../models/like');         //Importing the Likes Schema

//Action for handling user's Feed Post creation
module.exports.create = async function (req, res) {
    try {
        let post = await Posts.create({
            content: req.body.content,
            user: req.user._id
        });



        if (req.xhr) {                             //Checking if the request is of xml http request(AJAX req)
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post                     //Key post, value post(from Post.create)
                },
                message: "Post Created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
};

//Action for deleting a user post
module.exports.destroy = async function (req, res) {
    try {
        let post = await Posts.findById(req.params.id);  //Fetching post id from url param

        //post.user is the user from posts schema which returns the user id.
        /*Comparing if the currently authorized user id is same as the post.user 
        So that, deleting permission for other users are restricted*/
        if (post.user == req.user.id) {

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({ likeable: post, onModel: 'Posts' });
            await Like.deleteMany({ _id: { $in: post.comment } });

            post.remove();          //Deleting the post

            //Deleting all/ the Comments of the post
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Post Deleted');
            return res.redirect('back');
        }
        else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
};