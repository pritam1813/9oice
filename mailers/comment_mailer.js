const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log("inside newComment mailer", comment);

    //sendMail is inbuilt function for specifying fields required for sending mails
    nodemailer.transporter.sendMail({
        from: 'sammy2@ethereal.email',
        to: comment.user.email,
        subject: "User Commented on your post",
        html: 'Your comment is added'
    }, (err, info) => {
        if(err){console.log("Error in Sending mail", err); return;}

        console.log("Message Sent: ", info);
        return;
    });
}