const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    //Caliing nodemailer's function from config folder, passing the comment and relativePath
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    //sendMail is inbuilt function for specifying fields required for sending mails
    nodemailer.transporter.sendMail({
        from: 'sammy2@ethereal.email',
        to: comment.user.email,
        subject: "User Commented on your post",
        html: htmlString
    }, (err, info) => {
        if(err){console.log("Error in Sending mail", err); return;}

        // console.log("Message Sent: ", info);
        return;
    });
}