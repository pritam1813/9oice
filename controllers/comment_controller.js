const Comment = require('../models/comment'); //Importing Comment model
const Posts = require('../models/posts');       //Importing post model

//Action for handling user Comments
module.exports.create = async function(req,res){
    try{
        //Since comment is made on a post so first finding the post
        let post = await Posts.findById(req.body.post);

        if(post){                                           //If post is found then we create the comment
            let comment = await Comment.create({
                content: req.body.content,                  //From the form name=content
                post: req.body.post,                    
                user: req.user._id
            });

            post.comment.push(comment);                 //Using mongo's function to push the comment into the post database
            post.save();

            return res.redirect('/');
        }
    } catch(err){
        console.log(`Error: ${err}`);
        return;
    }
};

//Action for deleting Comments
module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;  //Saving the post id of the respective comment(defined in db model)
            
            comment.remove();          //Deleting the comment

            /*Since the comment was also saved in the post model(as per the schema)
            so deleting from there too*/
            let post = Posts.findByIdAndUpdate(postId, {$pull: req.params.id});
            return res.redirect('back');

        } else {
            return res.redirect('back');
        }

    } catch(err) {
        console.log(`Error: ${err}`);
        return;
    }
};