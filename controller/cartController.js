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