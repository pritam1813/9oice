"use strict";
const nodemailer = require("nodemailer");
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

//Html Templates folder setup for sending personalized content to each user
let renderTemplate = (data, relativePath) => {
    let mailHTML;                                                   //For storing which html will be sent
    ejs.renderFile(                                                 //Using ejs to render the html
        path.join(__dirname, '../views/mailers', relativePath),     //mention path from where it will be rendered
        data,                                                       //Corresponding data
        function(err, template){                                    //Callback function
            if(err){console.log("error in rendering template"); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}