/* Imports */
const express = require('express');                     //Require Express from Node Module
const cookieParser = require('cookie-parser');           //Importing cookie parser module for managing cookies 
const app = express();                                  //Creating Express app
const port = 3000;                                      //Default Port
const expressLayouts = require('express-ejs-layouts');  //Importing Express ejs Layout module
const db = require('./config/mongoose');                 //Importing the Database


//Using middleware express.urlencoded() for POST requests
app.use(express.urlencoded({extended:false}));

//Telling the app to use Cookie Parser
app.use(cookieParser());

//Setting View Engine
app.set('view engine', 'ejs');
app.set('views', './views'); //Setting views in the 'views' folder

//Setting Layouts
app.use(expressLayouts);

//Importing router from routes folder index file and telling express app to use those routes
app.use('/', require('./routes'));


//Making the app to listen/run on default port
app.listen(port, function(err) /*Callback Function*/{
    if(err){
        console.log(`Error : ${err}`);
    }
    else{
        console.log("App Running on Port:", port);
    }
});