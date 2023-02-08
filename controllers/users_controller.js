/* Responsible for different actions within user Route */

//Imports
const User = require('../models/user');                 //Database Model user
require('dotenv').config();                             //env module for hiding sensitive info
const AWS = require('aws-sdk');                         //aws-sdk for s3 bucket storage access
const { v4: uuidv4 } = require('uuid');                 //To Generate RFC-compliant UUIDs for file names
const AVATAR_BUCKET = '9oice';                          //s3 bucket name
const AVATAR_FOLDER = 'uploads/Avatars';                //s3 folder path
/* Required when using local storage*/
// const fs = require('fs');
// const path = require('path');

// Configuring the AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: process.env.ENDPOINT,
    signatureVersion: 'v4'
});

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

                    const file = req.file;
                    
                    //For unique file name generation and storing location
                    const key = `${user.name}/${AVATAR_FOLDER}/${uuidv4()}-${file.originalname}`;

                    //Parameters required for uploading the file
                    const params = {
                        Bucket: AVATAR_BUCKET,
                        Key: key,
                        Body: file.buffer
                    };

                    //If user has already an avatar then deleting it
                    if(user.avatar){
                        //Function to delete s3 object
                        s3.deleteObject({Bucket: AVATAR_BUCKET, Key: user.rawAvatar}, 
                            function(err ,data){
                            if (err) console.log(err, err.stack); // an error occurred
                            console.log(data);                    // successful response
                        });
                    }

                    //Uploading the file
                    s3.upload(params, function(err, data){
                        if (err) {
                            console.log('Error uploading file: ', err);
                            req.flash('error', err);
                            return res.redirect('back');
                        }

                        user.avatar = process.env.PUBURL + `/${data.key}`;       //Saving object public url in db
                        user.rawAvatarURL = data.key;                              //Saving the key for deleting the object later
                        user.save();
                        return res.redirect('back');
                    });
                } else {
                    user.save();
                    return res.redirect('back');
                }
            });

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