const User = require('../../../models/user');   //User DB
const jwt = require('jsonwebtoken');            //JWT Library

module.exports.createSession = async (req, res) => {
    try{
        //Finding user with the given email
        let user = await User.findOne({email: req.body.email});

        //If user is not present or password doesn't match
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid Email/Password"
            });
        }

        //else user sign in token
        return res.status(200).json({
            message: "Signed in",
            data: {
                token: jwt.sign(user.toJSON(), '9oice', {expiresIn: "7d"})
            }
        });

    } catch(err) {
        return res.status(500).json({
            message: "Internal Server Error !!"
        });
    }
}