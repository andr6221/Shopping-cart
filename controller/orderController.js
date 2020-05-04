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


exports.placeOrder = function(req, res) {
    // Vi checker først og redirecter hvis vi ikke har en cart
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    // Hvis vi har en indkøbskurv laver vi et nyt objekt "Cart"
    var cart = new Cart(req.session.cart);

    //Vi bruger Stripe til at lave et charge objekt. Først henter vi vores "sercret key"
    var stripe = require('stripe')('sk_test_JyE5beHbUnKaEP7KMkgXYTw000pHDki1wX');

    // Nu laver vi selve betalingen ved hjælp af Stripes API: se https://stripe.com/docs/api/charges/create
    stripe.charges.create({
        //Vigtigt: Stripe bruger den mindste enhed i valutaen (dvs. i euro er det cent og i DKK er det øre), derfor ganger vi vores totalprice med 100
        amount: cart.totalPrice * 100,
        // Vi definerer valutaen
        currency: "usd",
        // Vi request vores stripeToken, som vi har defineret som navnet på vores hidden input field fra checkout.js
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"

        //Vi laver en funktion til at check om vi har fået en fejl i vores charge
    }, function(err, charge) {
        //Hvis vi har en fejl flash vi fejl beskeden ved hjælp af flash (som vi har hentet tidligere)
        if (err) {
            // Vi gemmer fejlen som error objektet og displayer error messagen
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        // Vi laver en ny order
        var order = new Order ({
            //Vi gemmer vores user. Da vi har brugt passport bliver user gemt i vores request, hvilket betyder at vi tilgå user i hele vores applikation
            user: req.user,
            //Vi gemmer vores cart, som vi har defineret tidligere
            cart: cart,
            //Vi kan hente vores addrese ved hjælp af express request. Req.body er jo hvor express gemmer værdierne der er sendt med en post request
            address: req.body.address,
            // Vi kan hente navnet ved hjælp af express req.body, da navnet er gemt her.
            name: req.body.name,
            //Vi kan hente vores payment Id ved hjælp af vores Charge objekt, der kommer fra vores callback funktion. Vi kan finde det ved .id, da Stripe gemmer det således.
            paymentId: charge.id
        });
        //Vi kan nu gemme vores order til databasen
        order.save(function (err, result) {
            // Hvis vi har en succesfuldt køb flasher vi Købet er gennemført
            req.flash('success', 'Køb succesfuldt');
            // Vi sætter nu indkøbskurven til nul (vi har lige gennemført et køb)
            req.session.cart = null;
            // Vi redirecter til startsiden
            res.redirect('/');
        });
    });
};
