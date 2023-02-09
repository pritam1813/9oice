/* Imports */
const passport = require('passport');                                     //Import passport module
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;   //Passport google strategy module for google authentication
const crypto = require('node:crypto');                                    //crypto module for generating random password
const User = require('../models/user');                                   //User db model
require('dotenv').config();                                               //dotenv for hiding sensitive info

//Defining the strategy for login/signup using user's google account
passport.use(new GoogleStrategy({
    /* Various option fields required by the strategy */
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/user/auth/google/callback',
  },

  /*accessToken used for API access(sent in the header), 
    refreshToken is used for generating another accessToken once the previous one expires 
    profile has user data and cb is the callback*/
  function verify(accessToken, refreshToken, profile, cb) {

    //Finding user with the same email as the google account eamil in the User db
    User.findOne({email: profile.emails[0].value}).exec((err, user) => {
      //Error handling
      if(err) { console.log("Error in google auth : ", err); return; }

      console.log(profile);

      //If user is found return user
      if(user){
        return cb(null, user);
      }
      //Else Create user with the google account email and name 
      else {
        User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
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