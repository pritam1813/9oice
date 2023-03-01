/* Responsible for different actions within a Route */
const Posts = require('../models/posts'); //Importing Post Schema
const User = require('../models/user');     //Importing User Schema

//Root route action
module.exports.home = async function(req,res){
    //Rendering Home.ejs from the views folder

    try{
        // .find() function to find all the Posts. Populate each post with user data(from model)
        let posts = await Posts.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        })
        .populate('comment')
        .populate('likes');
        
        let users = await User.find({});
        
        return res.render('Home', { //Finding and returning all the user for displaying
            title: "Home",
            posts: posts,
            all_users: users
        });
    }
    catch(err){
        console.log("Error : ", err);
        return;
    }

};

//404
exports.handle404 = function(req, res, next) {
    res.status(404).render('404', { title: "404 Error"});
};