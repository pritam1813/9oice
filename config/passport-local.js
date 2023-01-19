/* Responsible for Authentication using passport local library */

/*Imports*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //passport-local is used for local Authentication
const User = require('../models/user'); //Import User schema


//Strategy for local authentication
passport.use(new LocalStrategy(
    {usernameField: 'email'},       //Passing the email as username

    function(email, password, done) {
      User.findOne({ email : email }, function (err, user) {  // email(from User model schema) : email(passed from previous line usernamefield)
        if (err) { return done(err); }      // handling error

        if (!user) { return done(null, false); }    //If user is not found

        if (!user.verifyPassword(password)) { return done(null, false); }   // If the password doesn't match

        return done(null, user); // else part i.e. when user is found
      });
    }
  ));


/* Serialize Function (To store only the required fields into the cookie i.e. User.id).
Determines which data of the user object should be stored in the session. */
passport.serializeUser(function(user, done){
    done(null, user.id);    // done function is used to encrypt and store only the specified key(user.id) into the cookie
});


/*Deserialize Function (When cookie is sent to the server, the User.id field is extracted)
The first argument of deserializeUser corresponds to the key of the user object that was given to the done function. 
So the whole object is retrieved with help of that key. That key here is the user id */
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){

        if (err) { return done(err); }      // handling error
        return done(null, user);  //Returnig the user as user is found
    });
});

module.exports = passport;