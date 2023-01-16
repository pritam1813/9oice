//Require Express from Node Module 
const express = require('express');

//Default Port
const port = 3000;

//Creating Express app
const app = express();






//Making the app to listen/run on default port
app.listen(port, function(err) /*Callback Function*/{
    if(err){
        console.log(`Error : ${err}`);
    }
    else{
        console.log("App Running on Port:", port);
    }
});