//Vi henter express, og passport
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');


//Vi henter vores controller mappe
var userController = require('../controller/userController');

//Vi laver vores route på /profile der checker om personen er logged in og bruger generer vores Order list
router.get('/profile', isLoggedIn, userController.userProfileOrderList);

//Vi laver vores router på /logout, der logger personen ud. Vi bruger passport's indbyggede logout() til dette i vores controller
router.get('/logout', isLoggedIn, userController.logOut);

//Vi render vores about-side
router.get('/about', function (req, res) {
    res.render('user/about')
});

//Printer vores userList på admin siden
router.get('/admin', function (req,res) {
    User.find(function (err, docs) {
        res.render('user/admin', {title: 'Brugere!', users: docs})
    });
});



//Hvis man ikke er logged in bliver redirected til startsiden
router.use('/', notLoggedIn, function(req, res, next){
    next();
});

//Vi laver en get route, der håndterer vores /signup view.
router.get('/signup', function (req, res) {
    var messages = req.flash('error');
    res.render('user/signup');
});


//Vi laver en post route, der sørger for at brugeren blive redirectet til signup view
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
    //Vi laver en funktion der håndtere en succesfuld login forsøg
}));


router.get('/signin', function (req,res) {
    var messages = req.flash('error');
    res.render('user/signin')
});

//
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signup',
    failureFlash: true
}));

//Vi eksporterer routeren
module.exports = router;

//Vi laver en hjæple-funktion til at undersøge om brugeren er logged ind
function isLoggedIn(req,res, next) {
    //Vi bruger passport isAuthenticated metode til at undersøge om brugeren er logged in.
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//Vi opretter en hjælpe-funktion, der undersøger hvorvidt brugeren IKKE er authenticated (vi bruger passport som middleware her)
function notLoggedIn(req,res, next) {
    // Vi bruger passport metode isAuthenticated med omvendt logik
    if (!req.isAuthenticated()) {
        return next();
    }
    //Vi redirecter herefter til startsiden
    res.redirect('/');
}


