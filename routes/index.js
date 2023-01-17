//Require Express from Node Module 
const express = require('express');

//Including express.Router function for better routing
const router = express.Router();

//Importing home_controller from the controller folder
const homeController = require('../contollers/home_conroller'); 

//Defining GET actions for different Routes
router.get('/', homeController.home);

//Export router to use in main index.js
module.exports = router;