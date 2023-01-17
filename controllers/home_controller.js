/* Responsible for different actions within a Route */

//Root route action
module.exports.home = function(req,res){
    //Rendering Home.ejs from the views folder
    return res.render('Home', {
        title: "Home"
    });
};