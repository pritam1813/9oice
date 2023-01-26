const Posts = require('../models/posts'); //Importing Post Schema


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