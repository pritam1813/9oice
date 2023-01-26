/* For Handling User Routes */

const express = require('express');
const router = express.Router(); 
const postsController = require('../controllers/posts_controller'); //Importing Post Controller

router.post('/create', postsController.create); //Creating Feed post for user

module.exports = router;