/* Responsible for Authentication using passport Jwt library */

/*Imports*/
//Required for the passport jwt strategy
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//For authentication User db is required
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,  //Extract the key from authorisation header
    secretOrKey: "9oice"
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //Finding User in db. The payload cotains user info
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {                             //If user found return user
            return done(null, user);
        } else {
            return done(null, false);           //else user not found
        }
    });
}));

module.exports = passport;