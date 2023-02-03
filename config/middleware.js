//To send the flash messages as response
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {                    //Accessing the flash from locals
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
};