const Posts = require('../../../models/posts'); //Importing Post Schema
const Comment = require('../../../models/comment');   //Importing the Comment Schema

module.exports.index = async (req, res) => {    //.index for listing the data

    // .find() function to find all the Posts. Populate each post with user data(from model)
    let posts = await Posts.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comment',
        populate: {
            path: 'user'
        }
    });

    return res.status(200).json({
        message: "Posts List",
        posts: posts
    });
}

//Action for deleting a user post
module.exports.destroy = async function(req, res){
    try{
        let post = await Posts.findById(req.params.id);  //Fetching post id from url param

        //post.user is the user from posts schema which returns the user id.
        /*Comparing if the currently authorized user id is same as the post.user 
        So that, deleting permission for other users are restricted*/  
        // if(post.user == req.user.id){
            post.remove();          //Deleting the post

            //Deleting all/ the Comments of the post
            await Comment.deleteMany({post: req.params.id});

            // if (req.xhr){
            //     return res.status(200).json({
            //         data: {
            //             post_id: req.params.id
            //         },
            //         message: "Post deleted"
            //     });
            // }
            //req.flash('success', 'Post Deleted');
            return res.status(200).json({
                message: "Post and associated comments Deleted"
            });
        // }
        // else{
        //     req.flash('error', 'You cannot delete this post!');
        //     return res.redirect('back');
        // }
        
    } catch(err){
        console.log(err);
        //req.flash('error', err);
        return res.status(500).json({
            message: "Internal Server Error !!"
        });
    }
};