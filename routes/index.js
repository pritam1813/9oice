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

//Access posts.js for handling "/posts" route Requests
router.use('/posts', require('./posts'));

//Access comment.js for handling "/comment" route Requests
router.use('/comment', require('./comment'));

//For undefined Routes/404 error
router.use(homeController.handle404);

//Export router to use in main index.js
module.exports = router;