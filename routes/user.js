var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function (req,res,next) {
    req.logout();
    res.redirect('/')
});


router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken()})
});


router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));


router.get('/signin', function (req,res,) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken()})
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


module.exports = router;

function isLoggedIn(req,res, next) {
    // passport holder styr på autoriseringen
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req,res, next) {
    // passport holder styr på autoriseringen
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}