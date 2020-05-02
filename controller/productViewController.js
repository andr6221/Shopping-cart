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

exports.productSite = function (req, res) {
    //Hvis vi har en succes message (når vi gennemført et køb, vil den blive vist, ved hjælp af vores flash storage
    var successMsg = req.flash('success')[0];
    //Vi laver en call-back, der enten finder vores dokumenter (produkter) eller en fejl
    Product.find(function (err, docs) {
        //Laver en variabel productChunks som en tom array. Dette skal vi bruge til at styre hvor mange products vi skal have vist på vores produkt side.
        var productChunks = [];
        //Vi fortæller at der skal være maks 3 produkter per række
        var chunkSize = 3;
        //Vi laver et for-loop, der sørger for at loope igennem vores produkter op til vores chunksize (3)
        for (var i = 0; i < docs.length; i+= chunkSize) {
            //Herefter laver vi et nyt array, hvor vi pusher en ny række ind.
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        // Vi render vores index view, med Vores products og succes og fejl meddelser
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
};