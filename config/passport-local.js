/* Responsible for Authentication using passport local library */

/*Imports*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //passport-local is used for local Authentication
const User = require('../models/user');                   //Import User schema


//Strategy for local authentication
passport.use(new LocalStrategy(
    { 
      usernameField: 'email',     //Passing the email as username
      passReqToCallback: true     //req is passed as the first argument to the verify callback
    },       

    function(req, email, password, done) {        //req recieved from passReqToCallback (It is required to display flash messages)

      User.findOne({ email : email }, function (err, user) {  // email(from User model schema) : email(passed from previous line usernamefield)
        if (err) {                // handling error
          req.flash('error:', err);
          return done(err); 
        }

        if (!user) {                                          //If user is not found
          req.flash('error', 'Invalid Username/Password');    //Diplay error flash on unsuccessful attempt
          return done(null, false); 
        }    

        if (user.password != password) {                      // If the password doesn't match
          req.flash('error', 'Invalid Username/Password');
          return done(null, false);
        }

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

/* Authentication Properties */

// Function to check Authentication
passport.checkAuthentication = function(req, res, next){
  if(req.isAuthenticated()){            //If the user is authenticated then sending/allowing user to the next page
    return next();
  }

  return res.redirect('/user/login');   //If user is not authenticated then redirecting user to login page
}

// Funtion to set Authenticated views for the user
passport.setAuthentication = function(req, res, next){
  if(req.isAuthenticated()){
    res.locals.user = req.user;     //req.user contains current authenticated user from the session cookie;
  }                                 //transfering it to passport locals for the views

  next();
}

module.exports = passport;