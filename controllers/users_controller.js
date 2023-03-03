/* Responsible for different actions within user Route */

//Imports
const User = require('../models/user');                                 //Database Model user
const Friends = require('../models/friendships');
const ResetuserPassword = require('../models/reset_password_token');
require('dotenv').config();                                             //env module for hiding sensitive info
const { avatarQueue } = require('../queues/Image_queue');
const imageWorker = require('../workers/image_worker');
/* Required when using local storage*/
// const fs = require('fs');
// const path = require('path');
const { resetPassEmail } = require('../queues/Email_Queues');           //Queue for sending mail on reset password
const emailWorker = require('../workers/emails_worker');                //Workers for sending mails
const crypto = require('node:crypto');                                  //crypto module for generating random String

module.exports.profile = async function (req, res) {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: 'friends',
          populate: {
            path: 'from_user to_user',
            select: 'name'
          }
        });
  
      return res.render('profile', {
        title: 'Profile',
        user_profile: user
      });
    } catch (error) {
      console.log(error);
    }
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
    // Setting a flash message by passing the key, followed by the value, to req.flash().
    req.flash('success', 'Logged in Successfully');

    return res.redirect('/');
};

//Action for signing out a user and destroying the session
module.exports.destroySession = function(req, res){
    req.logout(function(err){           //Included function in passport js for destroying session
        if(err){console.log(err)};

        req.flash('success', 'Logged Out');
        return res.redirect('/');
    });               
};

//Action for updating user data
module.exports.update = async function(req, res){
    //Update condition available only if logged in user id matches with the user data form id 
    if(req.user.id == req.params.id){

        //Mongo function to update user data
        try{
            let user = await User.findById(req.params.id);

            //Using Mongo user model static function
            User.uploadedAvatar(req, res, async (err) => {
                if (err) {
                    console.log('Error: ', err);
                }

                //updating user name and email if provided
                user.name = req.body.name;
                user.email = req.body.email;

                //Checking if file is present in the request or not
                if(req.file){
                //enqueue job for avatar upload
                    avatarQueue.add('avatarImage',{
                        userId: req.params.id,
                        file: req.file
                    });
                }
            });
            await user.save();
            return res.redirect('back');

        } catch(err) {
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        }

    /*###--UNCOMMENT FOR USING THE LOCAL STORAGE--###*/
    /*
      try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log('Error: ', err);}

                user.name = req.body.name;
                user.email = req.body.email;

                //Checking if any file is being uploaded
                if(req.file){

                    if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))){
                        //If Avatar is already present then deleting the avatar
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //Saving the uploaded file path to avatar field in the user db
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        } catch(err) {
            console.log(err);
            req.flash('error', err);
            return res.redirect('back');
        }
    */
    } else {
        //If user id doesn't matches but tries to edit
        req.flash('error', 'Unauthorized!');
        return res.status(401).send("Unauthorized Access");
    }

}

//Action for the clicking link Forgot Password
module.exports.forgotPassword = (req, res) => {
    return res.render('ForgotPassword', {title: 'Forgot Password'});
}

//Action for requesting Reset Password
module.exports.resetPasswordLink = async function(req, res){
    try{

        let user = await User.findOne({ email: req.body.email});        //Finding the user with given email
        
        //If found then send Email with link
        if(user){

            //Finding resetuserpassword DB if exists for the user
            let resetuserpassword = await ResetuserPassword.findOne({user : user});
            
            //If resetuserpassword DB for the user exists
            if(resetuserpassword ){

                //checking expires field in the db to make sure valid link
                if((resetuserpassword.expires < Date.now())){
                    console.log("Token Expired Generating new");
                    resetuserpassword.resetPassToken = crypto.randomBytes(20).toString("hex");      //updating the token
                    resetuserpassword.expires = Date.now() + (1000 * 60 * 10);                      //updating expiry
                    await resetuserpassword.save();
                }
            }
            else {
                //If resetuserpassword DB for the user doesnot exists then creating one
                resetuserpassword = await ResetuserPassword.create({
                    user: user,
                    resetPassToken: crypto.randomBytes(20).toString("hex"),                     //Generating the token
                    expires: Date.now() + (1000 * 60 * 10)                                      //10 minute
                });
            }
            resetuserpassword = await resetuserpassword.populate('user', 'email name');         //Populating user's email field for sending the mail
            await resetuserpassword.save();

            await resetPassEmail.add('resetPass', resetuserpassword);                           //Calling the emailworker

            req.flash('success', 'Email sent');
            return res.redirect('back');
        }
        //If user not found then error
        else{
            req.flash('error', 'User Not Found !!');
            return res.redirect('back');
        }
    } catch(err) {
        console.log(`Error: ${err}`);
        return;
    }
}

//Action for rendering the reset password page
module.exports.reset_Password = async function(req, res){
    
    try {
        //Finding in resetuserpassword DB for the user using the token from the params
        let resetuserpassword = await ResetuserPassword.findOne({
            resetPassToken: req.params.resetPassToken,
        });

        //If there is no DB
        if (!resetuserpassword) {
            req.flash('error', 'Link not found');
            return res.redirect('/user/login');
        }
        //If there is DB then checking expires field
        if(resetuserpassword.expires < Date.now()){
            req.flash('error', 'Link Expired');
            await resetuserpassword.remove();
            return res.redirect('/user/login');
        }

        //If above conditions are false then rendering the page
        res.render("ResetPassword", { 
            resetPassToken: resetuserpassword.resetPassToken,
            title: 'Reset Password' 
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        return;
    }
}

module.exports.updatePassword = async function(req, res){

    try{
        //Verifying User's Entered password and confirm password
        if(req.body.password != req.body.confirm_password){
            req.flash('error',"Password Doesn't match");
            return res.redirect('back');
        }

        //If password matches then finding the DB with valid token and expiry
        let resetuserpassword = await ResetuserPassword.findOne({
            resetPassToken: req.params.resetPassToken,
            expires: { $gt: Date.now() }
        });

        //If resetuserpassword DB found then finding user with the id from it's user field
        let user = await User.findById(resetuserpassword.user);

        if (!user){
            console.log('Link not found or expired');
            return res.redirect('/user/login');
        }
        //Updating and saving the user's new password
        user.password = req.body.password;
        await user.save();
        await resetuserpassword.remove();

        req.flash('success', 'Password reset successfully');
        return res.redirect('/user/login');
        
    } catch(err){
        console.log(`Error: ${err}`);
        return;
    }
}