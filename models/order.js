var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Vi laver et nyt skema til vores orderes
var schema = new Schema({
    //Skemaet indeholder vores user der laver orderen. Dette skal være af typen objectId, der skal refere til vores User
    //Vi fortæller altså user skal refere til vores User kollektion og model
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    //Skemaet skal også indeholde indkøbskurven, som type objekt. Dette er oplagt da MongoDB gemmer i JSON format i forvejen.
    cart: {type: Object, required: true},
    //Vi gemmer adressen
    address: {type: String, required: true},
    // Vi gemmer navnet
    name: {type: String, required: true},
    // Vi vil også gemme payment ID, som vi kan finde i Stripe. Vi skal bruge payment Id til at se, hvilken payment Id der hører til hvilken Order
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);
