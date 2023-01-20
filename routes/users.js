/* For Handling User Routes */

//Creating Express Router using express.Router() function
const express = require('express');
const router = express.Router();                                    //Funtion to specify different routes 
const userController = require('../controllers/users_controller');  //Importing User Controller
const passport = require('passport');                               //Importing passport module

//Using GET Method to access Different User Routes
router.get('/profile', userController.profile);
router.get('/signup', userController.signup);
router.get('/login', userController.login);

//Using POST Method to control different actions of sending the data to the server
router.post('/create', userController.create);  // Creating a user/Sending registration data to the server

//Using Passport as mddleware to authenticate
router.post('/create_session',passport.authenticate(
    'local',
    {failureRedirect: '/user/login'},       //If authentication fail then redirect to login page
),userController.create_session);           // If successful then this action gets called

//Exporting this router to make it accessible by main index Router
module.exports = router;