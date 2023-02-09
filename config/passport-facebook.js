/* Imports */
const passport = require('passport');                     //Import passport module
const FacebookStrategy = require('passport-facebook');   //Passport facebook strategy module for login/signup using facebook
const crypto = require('node:crypto');                   //crypto module for generating random password
const User = require('../models/user');                  //User db model
require('dotenv').config();                              //dotenv for hiding sensitive info

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/user/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

    /*Finding user with the facebookId as the facebook account id in the User db
     (In Development mode Facebook does not allow user's email access) */
    User.findOne({facebookId: profile.id}).exec((err, user) =>{
        //Error handling
      if(err) { console.log("Error in google auth : ", err); return; }

      //If user is found return user
      if(user){
        return cb(null, user);
      }
      //Else Create user with the google account email and name 
      else {
        User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: crypto.randomBytes(8).toString('hex') + '@' + 'example.com',  //Generating random email for the user
          password: crypto.randomBytes(20).toString('hex')                    //Generating random password using crypto module of nodejs
        }, (err, user) => {                                                   //callback function
          if(err) { console.log("Error in creating user : ", err); return; }

          return cb(null, user);
        });
      }
    });
  }
));

module.exports = passport;