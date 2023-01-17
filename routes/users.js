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


//Exporting this router to make it accessible by main index Router
module.exports = router;