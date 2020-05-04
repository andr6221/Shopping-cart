//Vi henter express, så vi kan bruge det
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//Vi henter vores forskellige modeller
var User = require('../models/user');
var Order = require('../models/order');
var Cart = require('../models/cart');



//Vi laver en modul-funktion til at finde brugerens userList
exports.userProfileOrderList = function (req, res, next) {
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
};

//Vi laver en logOut funktion
exports.logOut = function (req,res,next) {
    //
    req.logout();
    res.redirect('/')
};


//Printer userList
exports.userListPrint = async (req, res) => {
    try {
        var users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({msg: 'Fejl: ' + err});
    }
};


//Vi laver en funktion der redirecter til vores gamle URL. Denne funktion skal hjælpe os med at når vi vil vil betale, og bliver tvunget til at logge ind. Så efter vi er logget ind kommer vi direkte hen til vores check-out page.
exports.oldUrlCheck = function (req,res,next) {
    //Vi tjekker om vi har en gammel Url i vores session
    if (req.session.oldUrl) {
        //Først gemmer vi den gamle URL
        var oldUrl = req.session.oldUrl;
        //Nu clearer vi den
        req.session.oldUrl = null;
        //Herefter redirecter vi til den gamle Url
        res.redirect(oldUrl);
    //Eller redirecter vi user profile'en
    } else {
        res.render('/user/profile');
    }
};
