//Importing Queues
const { newCommentEmail } = require('../queues/Email_Queues');
const { resetPassEmail } = require('../queues/Email_Queues');

//Mailers for sending mail tasks
const commentsMailer = require('../mailers/comment_mailer');
const forgotPasswordMailer = require('../mailers/forgot_password_mailer');

//Send Mail on new comment proccess
//takes process name and job to be proccessed in the argument
newCommentEmail.process('comments', function(job, done){
    console.log("worker is processing job ", job.id);

    //Calling the mailer task
    commentsMailer.newComment(job.data);

    // call done when finished
    done();

    // or give an error if error
    done(new Error('error processing'));

    // If the job throws an unhandled exception it is also handled correctly
    throw new Error('some unexpected error');
});

//Send mail for resetting password
resetPassEmail.process('resetPass', function(job, done){
    console.log("worker is processing a job ", job.id);

    forgotPasswordMailer.resetPasswordEmail(job.data);

    done();

    done(new Error('error processing'));

    throw new Error('some unexpected error');
});