// Vi laver et Schema ved hjælp af mongoose til at håndtere vores products på vores produkt-side.
// Hvert af vores skemaer referer til en mongoDB kollektion.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Skemaet indeholder følgende attributter: billede, titel, beskrivelse og pris
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

// Vi eksporterer skemaet
module.exports = mongoose.model('Product', schema);
