const nodemailer = require('../config/nodemailer');

exports.resetPasswordEmail = (resetuserpassword) => {
    //Caliing nodemailer's function from config folder, passing the email and relativePath
    let htmlString = nodemailer.renderTemplate({resetuserpassword: resetuserpassword}, '/password/reset_password_link.ejs')

    //sendMail is inbuilt function for specifying fields required for sending mails
    nodemailer.transporter.sendMail({
        from: 'sammy2@ethereal.email',
        to: resetuserpassword.user.email,
        subject: "Reset Password Link",
        html: htmlString
    }, (err, info) => {
        if(err){console.log("Error in Sending mail", err); return;}

        // console.log("Message Sent: ", info);
        return;
    });
}