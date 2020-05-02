var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user')
var Order = require('../models/order');
var Cart = require('../models/cart');

/*var csrfProtection = csrf();
router.use(csrfProtection);*/


router.get('/profile', isLoggedIn, function (req, res, next) {
    //Vi bruger den loggende ind user (som passport har gemt) til at sammenligne med vores user i vores database. Mongoose sørger for at sammenligne ID'erne fra logged ind bruger med brugeren fra databasen.
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', {orders: orders});
    });
});

router.get('/logout', isLoggedIn, function (req,res,next) {
    req.logout();
    res.redirect('/')
});

router.get('/about', function (req, res, next) {
    res.render('user/about')
});

router.get('/admin',   async (req, res) => {
    try {
        var users = await User.find();
        res.json(users);
        res.render('user/admin');
    } catch (err) {
        res.json({msg: 'Fejl: ' + err});
    }
});


router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup');
});



router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
    //Vi laver en funktion der håndtere en succesfuld login forsøg
}), function (req,res,next) {
    //Vi tjekker om vi har en gammel Url i vores session
    if (req.session.oldUrl) {
        //Først gemmer vi den gamle URL
        var oldUrl = req.session.oldUrl;
        //Nu clearer vi den
        req.session.oldUrl = null;
        //Herefter redirecter vi til den gamle Url
        res.redirect(oldUrl);
    } else {
        res.render('/user/profile');
    }
});


router.get('/signin', function (req,res,) {
    var messages = req.flash('error');
    res.render('user/signin'/*, {csrfToken: req.csrfToken()}*/)
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    //Vi tjekker om vi har en gammel Url i vores session
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        //Hvis det er tilfældet redirecter vi til oldUrl
        res.redirect(oldUrl);
    } else {
        res.render('/user/profile');
    }
});

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


