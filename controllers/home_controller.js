/* Responsible for different actions within a Route */

//Root route action
module.exports.home = function(req,res){
    //Rendering Home.ejs from the views folder
    return res.render('Home', {
        title: "Home"
    });
};

//404 
exports.handle404 = function(req, res, next) {
    res.status(404).render('404', { title: "404 Error"});
};