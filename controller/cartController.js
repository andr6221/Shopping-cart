//Vi bruger nodes require funktion til at kunne bruge express
var express = require('express');

//Vi laver en variabel router på baggrund express route håndteringsmodul. Dette middleware gør at vi let kan lave nye routes.
var router = express.Router();

//Vi henter vores indkøbskurv model/skema, således vi kan bruge den senere
var Cart = require('../models/cart');

//Vi henter vores product model
var Product = require('../models/product');

//Vi henter vores order model
var Order = require('../models/order');



exports.cartUpdate = function (req,res) {
    var productId = req.params.id;
    //Vi laver en ny kurv, hver gang vi tilføjer et item.
    //Vi gøre dette ved gennem adgang til vores session. Hvis vi allerede har en kurv tilføjer vi den ellers bruger vi et tomt objekt.
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    //Vi bruger mongoose til at finde produkt ID'et (gennem parametren ':id"), og tjekker om vi har en fejl
    Product.findById(productId, function (err, product) {
        //Hvis vi har en fejl, redirecter til startsiden
        if(err) {
            return res.redirect('/');
        }
        //Hvis vi ikke har fejl tilføjer vi produktet til vores kurv. Vi bruger parametren produkt (som vi har hentet databasen, og vores produkt ID til at identificere det)
        cart.add(product, product.id);
        //Vi gemmer nu vores cart objekt i vores session
        req.session.cart = cart;
        console.log(req.session.cart);
        //Vi redirecter til vores produkt side
        res.redirect('/');
    });
};


exports.getCart = function (req,res) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
};


exports.cartCheckout = function(req, res, next) {
    // Vi check om indkøbskurven "eksiterer", eller om brugeren bare har skrevet /checkout manuelt, ellers redirecter vi til shopping-cart siden
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    // Hvis vi har en indkøbskurv laver vi et nyt objekt "Cart"
    var cart = new Cart(req.session.cart);
    // Vi laver vores variabel errMsg til at håndtere fejlbeskeder, ved hjælp af flash. Vi vælger den første fejlbesked, da vi kun gemmer den første fejl.
    var errMsg = req.flash('error')[0];
    // Herefter render vi vores checkout view, hvor vi giver den et JS objekt med variabler, som vi skal bruge i dette view. I dette tilfælde giver vi den vores totalpris, som vi kan hente fra shopping-carten.
    //Vi bruger også vores error besked, hvis der er en errorMsg vil den blive vist, og hvis der er ikke er en vil noError blive true
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
};