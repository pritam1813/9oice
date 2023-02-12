const Queue = require('bull');                                          //Importing Bull mofule for creating Queue

//Queues
const newCommentEmail = new Queue('Send Email on New Comments');        //Queue for sending email on new comment
const resetPassEmail = new Queue('Send reset password link email');     //Queue for sending email for reset password link

module.exports = {
    newCommentEmail,
    resetPassEmail
}