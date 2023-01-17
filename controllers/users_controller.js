/* Responsible for different actions within user Route */

//user profile route
module.exports.profile = function(req,res){
    return res.render('profile', { title : 'Profile'});
};

//User Sign Up route for rendering Sign Up page
module.exports.signup = function(req,res){
    return res.render('SignUp', { title : 'Sign Up'});
};

//User Sign In route for rendering Sign In page
module.exports.login = function(req,res){
    return res.render('Login', { title : 'Sign In'});
};

//Action for Creating/Signing Up a user and storing the Data in the Database
module.exports.create = function(req, res){
    
};

//Action for Logging in a user and creating a Session
module.exports.create_session = function(req, res){
    
};