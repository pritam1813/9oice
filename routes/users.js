/* For Handling User Routes */

//Creating Express Router using express.Router() function
const express = require('express');
const router = express.Router();                                    //Funtion to specify different routes 
const userController = require('../controllers/users_controller');  //Importing User Controller
const passport = require('passport');                               //Importing passport module
const friendsController = require('../controllers/friends_controller');
//Using GET Method to access Different User Routes (defined in user_controller.js)
router.get('/profile/:id', passport.checkAuthentication ,userController.profile);   //Only visible to Authenticated User
router.get('/signup', userController.signup);
router.get('/login', userController.login);
router.get('/logout', userController.destroySession);

//Authentication using Google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', 
{failureRedirect: '/user/login'}
),userController.create_session);

//Authentication using Facebook
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', 
{ failureRedirect: '/user/login' }),
userController.create_session);

//Using POST Method to control different actions of sending the data to the server
router.post('/create', userController.create);  // Creating a user/Sending registration data to the server

//Using Passport as mddleware to authenticate
router.post('/create_session',passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},       //If authentication fail then redirect to login page
),userController.create_session);           // If successful then this action gets called

//Route for editing profile
router.post('/update/:id', passport.checkAuthentication, userController.update);

//Route for Forgot password Link
router.get('/forgot-password', userController.forgotPassword);

//Route for reset password Link Generation
router.post('/resetpasswordlink', userController.resetPasswordLink);

//Route for Resetting Password page
router.get('/reset_password/:resetPassToken', userController.reset_Password)

//Route for Updating password action
router.post('/updatePassword/:resetPassToken', userController.updatePassword);

router.post('/addFriend/:id', friendsController.addFriend);
router.post('/removeFriend/:id', friendsController.removeFriend);
//Exporting this router to make it accessible by main index Router
module.exports = router;