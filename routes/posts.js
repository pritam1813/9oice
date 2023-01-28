/* For Handling User Routes */

const express = require('express');
const router = express.Router(); 
const postsController = require('../controllers/posts_controller'); //Importing Post Controller
const passport = require('passport');                               //Import Passport.js

router.post('/create', passport.checkAuthentication, postsController.create);       //Creating Feed post for user
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);  //Deleting user post

module.exports = router;