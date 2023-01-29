/* Responsible for different actions within a Route */
const Posts = require('../models/posts'); //Importing Post Schema
const User = require('../models/user');     //Importing User Schema
const { populate } = require('../models/user');

//Root route action
module.exports.home = function(req,res){
    //Rendering Home.ejs from the views folder

    // .find() function to find all the Posts. Populate each post with user data(from model)
    Posts.find({})
    .populate('user')
    .populate({
        path: 'comment',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        if(err){console.log(`Error Getting Posts: ${err}`)};

        User.find({}, function(err, users){     //Finding and returning all the user for displaying
            return res.render('Home', {
                title: "Home",
                posts: posts,
                all_users: users
            });
        });
    });
};

//404
exports.handle404 = function(req, res, next) {
    res.status(404).render('404', { title: "404 Error"});
};