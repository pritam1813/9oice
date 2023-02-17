const Queue = require('bull');                                          //Importing Bull mofule for creating Queue

//Queues
const avatarQueue = new Queue('Avatar Queue');        //Queue for sending email on new comment

module.exports = { avatarQueue }
