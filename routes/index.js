//Require Express from Node Module 
const express = require('express');

//Including express.Router function for better routing
const router = express.Router();

//Importing home_controller from the controller folder
const homeController = require('../controllers/home_controller'); 

//Defining GET actions for different Routes
router.get('/', homeController.home);

//Access users.js for handling "/user" route Requests
router.use('/user', require('./users'));

//Export router to use in main index.js
module.exports = router;