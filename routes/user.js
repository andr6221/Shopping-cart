var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user')
var Order = require('../models/order');
var Cart = require('../models/cart');

var userController = require('../controller/userController');


router.get('/profile', isLoggedIn, userController.userProfileOrderList);

router.get('/logout', isLoggedIn, userController.logOut);

router.get('/about', function (req, res, next) {
    res.render('user/about')
});

//Printer vores userList på admin siden
router.get('/admin', userController.userListPrint);

//Hvis man ikke er logged in bliver redirected til startsiden
router.use('/', notLoggedIn, function(req, res, next){
    next();
});

//Render vores signup view
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup');
});


//
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
    //Vi laver en funktion der håndtere en succesfuld login forsøg
}), userController.oldUrlCheck);


router.get('/signin', function (req,res) {
    var messages = req.flash('error');
    res.render('user/signin'/*, {csrfToken: req.csrfToken()}*/)
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), userController.oldUrlCheck);

module.exports = router;

//Vi laver en hjæple-funktion til at undersøge om brugeren er logged ind
function isLoggedIn(req,res, next) {
    // passport holder styr på autoriseringen
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//Vi opretter en hjælpe-funktion, der sørger for at se om brugeren IKKE er authenticated (vi bruger passport som middleware her)
function notLoggedIn(req,res, next) {
    // passport holder styr på autoriseringen
    if (!req.isAuthenticated()) {
        return next();
    }
    //Vi redirecter herefter til startsiden
    res.redirect('/');
}



