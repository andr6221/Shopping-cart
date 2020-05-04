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

//Vi henter vores productViewController mappe
var productViewController = require('../controller/productViewController');

//Vi henter vores cartController mappe
var cartController = require('../controller/cartController');

//Vi henter vores orderController mappe
var orderController = require('../controller/orderController');

/* GET home page. */
router.get('/', productViewController.productSite);

//Vi laver vores add-to-cart route
router.get('/add-to-cart/:id', cartController.cartUpdate);

//Henter vores indkøbskurv, med vores forskille produkter og dets priser
router.get('/shopping-cart',cartController.getCart);

// Vi laver en get-route der henter /checkout pathen og som referer til routen vi har lavet i checkout.hbs
router.get('/checkout', isLoggedIn, cartController.cartCheckout);

//Vi laver en post route, med pathen /checkout (den route vi prøver at komme ind på når vi får valideret vores kreditinfo). Vi skal bruge denne rute til at lave en charge i Stripe.
//Vi checker om personen er logged ind
router.post('/checkout',  isLoggedIn, orderController.placeOrder);

//Vi eksporterer vores routers
module.exports = router;

function isLoggedIn(req,res, next) {
  // passport holder styr på autoriseringen
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
};



