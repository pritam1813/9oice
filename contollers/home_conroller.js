/* Responsible for different actions within a Route */

//Root route action
module.exports.home = function(req,res){
    return res.end("<h1>For Express App</h1>");
};