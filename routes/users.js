/* For Handling User Routes */

//Creating Express Router using express.Router() function
const express = require('express');
const router = express.Router();

//Importing User Controller
const userController = require('../controllers/users_controller');

//Using GET Method to access Different User Routes
router.get('/profile', userController.profile);
router.get('/signup', userController.signup);
router.get('/login', userController.login);

//Using POST Method to control different actions of sending the data to the server
router.post('/create', userController.create);  // Creating a user/Sending registration data to the server


//Exporting this router to make it accessible by main index Router
module.exports = router;