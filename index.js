/* Imports and const */

//Require Express from Node Module 
const express = require('express');

//Default Port
const port = 3000;

//Creating Express app
const app = express();

//Importing Express ejs Layout module
const expressLayouts = require('express-ejs-layouts');



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