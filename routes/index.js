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

var productViewController = require('../controller/productViewController');
var cartController = require('../controller/cartController');

/* GET home page. */
router.get('/', productViewController.productSite);

//Vi laver vores add-to-cart route
router.get('/add-to-cart/:id', cartController.cartUpdate);

//Henter vores indkøbskurv, med vores forskille produkter og dets priser
router.get('/shopping-cart', function (req,res,next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// Vi laver en get-route der henter /checkout pathen og som referer til routen vi har lavet i checkout.hbs
router.get('/checkout', isLoggedIn, function(req, res, next) {
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
});

//Vi laver en post route, med pathen /checkout (den route vi prøver at komme ind på når vi får valideret vores kreditinfo). Vi skal bruge denne rute til at lave en charge i Stripe.
//Vi checker om personen er logged ind

router.post('/checkout',  isLoggedIn, function(req, res, next) {
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
});


module.exports = router;

function isLoggedIn(req,res, next) {
  // passport holder styr på autoriseringen
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}


