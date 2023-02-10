const emailQueue = require('../config/bull');
const commentsMailer = require('../mailers/comment_mailer');

emailQueue.process('emails', function(job, done){
    console.log("worker is processing a job ", job.data);

    commentsMailer.newComment(job.data);
    console.log(job.id);
    done();

    // or give an error if error
    done(new Error('error processing'));

    throw new Error('some unexpected error');
});