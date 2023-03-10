const Comment = require('../models/comment');                   //Importing Comment model
const Posts = require('../models/posts');                       //Importing post model
const { newCommentEmail } = require('../queues/Email_Queues');  //Queue for sending mail on new comment
const emailWorker = require('../workers/emails_worker');        //Workers for sending mails
const Like = require('../models/like');

//Action for handling user Comments
module.exports.create = async function (req, res) {
    try {
        //Since comment is made on a post so first finding the post
        let post = await Posts.findById(req.body.post);

        if (post) {                                           //If post is found then we create the comment
            let comment = await Comment.create({
                content: req.body.content,                  //From the form name=content
                post: req.body.post,
                user: req.user._id
            });

            post.comment.push(comment);                 //Using mongo's function to push the comment into the post database
            post.save();

            comment = await comment.populate('user', 'name email');     //Populating the user's name and email in the newly created comment
            //commentMailer.newComment(comment);                          //calling the mailer function to send the email

            //Adding the comment mailer process to the queue
            newCommentEmail.add('comments', comment);

            if (req.xhr) {

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Added!"
                });
            }

            req.flash('success', 'Comment Added!');
            return res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err);
        console.log(`Error: ${err}`);
        return;
    }
};

//Action for deleting Comments
module.exports.destroy = async function (req, res) {

    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {

            let postId = comment.post;  //Saving the post id of the respective comment(defined in db model)

            comment.remove();          //Deleting the comment

            /*Since the comment was also saved in the post model(as per the schema)
            so deleting from there too*/
            let post = Posts.findByIdAndUpdate(postId, { $pull: { comment: req.params.id } });

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }
            req.flash('success', 'Comment Deleted');
            return res.redirect('back');

        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }

    } catch (err) {
        console.log(`Error: ${err}`);
        return;
    }
};