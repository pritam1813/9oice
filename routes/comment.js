/* For Handling Comment Routes */

const express = require('express');
const router = express.Router(); 
const commentController = require('../controllers/comment_controller'); //Importing comment Controller
const passport = require('passport');                               //Import Passport.js

router.post('/create', passport.checkAuthentication, commentController.create); //Creating comment for user
router.delete('/destroy/:id', passport.checkAuthentication, commentController.destroy);  //Deleting user Comment

module.exports = router;