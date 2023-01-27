/* For Handling Comment Routes */

const express = require('express');
const router = express.Router(); 
const commentController = require('../controllers/comment_controller'); //Importing comment Controller
const passport = require('passport');                               //Import Passport.js

router.post('/create', passport.checkAuthentication, commentController.create); //Creating Feed post for user

module.exports = router;