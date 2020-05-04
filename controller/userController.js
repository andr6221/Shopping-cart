var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user')
var Order = require('../models/order');
var Cart = require('../models/cart');




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

exports.logOut = function (req,res,next) {
    req.logout();
    res.redirect('/')
};


exports.userListPrint = async (req, res) => {
    try {
        var users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({msg: 'Fejl: ' + err});
    }
};



exports.oldUrlCheck = function (req,res,next) {
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
};