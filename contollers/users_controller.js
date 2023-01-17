/* Responsible for different actions within user Route */

//user profile route
module.exports.profile = function(req,res){
    return res.render('profile', { title : 'Profile'});
};

module.exports.signup = function(req,res){
    return res.render('SignUp', { title : 'Sign Up'});
};

module.exports.login = function(req,res){
    return res.render('Login', { title : 'Sign In'});
};