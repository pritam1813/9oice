/* Imports */
const express = require('express');                     //Require Express from Node Module
const cookieParser = require('cookie-parser');           //Importing cookie parser module for managing cookies 
const app = express();                                  //Creating Express app
const port = 3000;                                      //Default Port
const expressLayouts = require('express-ejs-layouts');  //Importing Express ejs Layout module
const db = require('./config/mongoose');                 //Importing the Database
const session = require('express-session');             //Library for creating Session and storing encrypted Session ID
const passport = require('passport');                   //Importing passport js library
const passportLocal = require('./config/passport-local'); //Passport local strategy from config folder
const passportJWT = require('./config/passport-jwt');    //Passport JWT strategy from config folder
const passportGoogleOauth = require('./config/passport-google-oauth2');         //Passport Google Oauth2 strategy from config folder
const MongoStore = require('connect-mongo');            //required fo storing the session cookie
const sassMiddleware = require('express-dart-sass');    //Middleware for using scss
const flash = require('connect-flash');                 //For displaying flash messages
const cstmFlashMware = require('./config/middleware');  //Custom middleware for flash messages

//compiling scss into css before the server runs
app.use(sassMiddleware({
    src: './public/assets/scss',
    dest: './public/assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/assets/css'
}));

//Using middleware express.urlencoded() for POST requests
app.use(express.urlencoded({extended:false}));

//Telling the app to use Cookie Parser
app.use(cookieParser());

app.use(express.static('./public'));
//app.use('/uploads', express.static(__dirname + '/uploads'));    //Making uploads path available to the browser

//Setting View Engine
app.set('view engine', 'ejs');
app.set('views', './views'); //Setting views in the 'views' folder

/* Cookie Sessions */
//Defining session and cookie properties
app.use(session({
    name: '9oice',
    secret: '007sectretservice',                //used to encrypt the cookie
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100),              //cookie expires after this time
    },
    store: MongoStore.create({                  //Storing the session cookie in the database
        mongoUrl: process.env.MONGODB_URI       
    })
}));

app.use(passport.initialize());     //middle-ware that initialises Passport
app.use(passport.session());        /* acts as a middleware to alter the req object and change the 'user' value that is currently 
                                    the session id (from the client cookie) into the true deserialized user object.*/

app.use(passport.setAuthentication);

//Since flash messages are stored in session cookie so using flash after the session
app.use(flash());
app.use(cstmFlashMware.setFlash);

//Setting Layouts
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


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