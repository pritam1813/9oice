/* For Handling User Routes */

//Creating Express Router using express.Router() function
const express = require('express');
const router = express.Router();

//Importing User Controller
const userController = require('../contollers/users_controller');

//Using GET Method to access Profile Route
router.get('/profile', userController.profile);

//Exporting this router to make it accessible by main index Router
module.exports = router;