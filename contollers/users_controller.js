/* Responsible for different actions within user Route */

//user profile route
module.exports.profile = function(req,res){
    return res.render('profile', { title : 'Profile'});
};