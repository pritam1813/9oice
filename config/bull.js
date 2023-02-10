const Queue = require('bull');
const emailQueue = new Queue('email sending');

module.exports = emailQueue;