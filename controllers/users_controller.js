/* Responsible for different actions within user Route */

//Importing Database Models
const User = require('../models/user');

//user profile route
module.exports.profile = function(req,res){

    User.findById(req.params.id , function(err, user){
        
        return res.render('profile', { 
            title : 'Profile',
            user_profile: user
        });
    });
};

//User Sign Up route for rendering Sign Up page
module.exports.signup = function(req,res){

    if(req.isAuthenticated()){                  //isAuthenticated is inbuilt function to check Authentication 
        return res.redirect('/user/profile');          //If user is alredy Authenticated then sign up page is not accessible
    }
    return res.render('SignUp', { title : 'Sign Up'});
};

//User Sign In route for rendering Sign In page
module.exports.login = function(req,res){
    if(req.isAuthenticated()){                  
        return res.redirect('/user/profile');          //If user is alredy Authenticated then sign in page is not accessible
    }
    return res.render('Login', { title : 'Sign In'});
};


//Action for Creating/Signing Up a user and storing the Data in the Database
module.exports.create = async function(req, res){
    try{

        //If the password and confirm password doesn't match then we will not create user
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        //Trying to find if the user with same email already exists in the database
        let user = await User.findOne({ email: req.body.email});

        if(!user){                                  //If User doesn't exist then creating the User
            let user = await User.create(req.body);
            return res.redirect('/user/login'); //If user is successfully created then redirecting user to Sign In page
        } else {
            return res.redirect('/user/login'); //If user already exists then redirecting to sign in page
        }

    } catch(err){
        console.log(`Error: ${err}`);
        return;
    }

};

//Action for Logging in a user and creating a Session
module.exports.create_session = function(req, res){
    return res.redirect('/');
};

//Action for signing out a user and destroying the session
module.exports.destroySession = function(req, res){
    req.logout(function(err){           //Included function in passport js for destroying session
        if(err){console.log(err)};
        return res.redirect('/');
    });               
};

//Action for updating user data
module.exports.update = function(req, res){
    //Update condition available only if logged in user id matches with the user data form id 
    if(req.user.id == req.params.id){

        //Mongo function to update user data
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        });
    } else {
        //If user id doesn't matches but tries to edit
        return res.status(401).send("Unauthorised Access");
    }

}