//Vi henter vores produkt skema
var Product = require('../models/product');

//Vi henter mongoose
var mongoose = require('mongoose');

//Vi connecter til vores databasen
mongoose.connect('mongodb://127.0.0.1:27017/shopping', { useNewUrlParser: true, useUnifiedTopology: true });

//Vi seeder vores produkter i en variabel kaldet products
var products = [
    new Product({
       imagePath: 'https://i.pinimg.com/474x/1b/73/80/1b738096a305befa82f3550519979ebe.jpg',
        title: 'Brune ris',
        description: 'Elsker elsker elsker brune ris',
        price: 10
    }),
    new Product({
        imagePath: 'https://www.olgainthekitchen.com/wp-content/uploads/2019/08/Perfect-White-Rice-Recipe-1-500x375.jpg',
        title: 'Hvide ris',
        description: 'Hvide ris MÅMS',
        price: 10
    }),
    new Product({
        imagePath: 'https://feed-your-sole.com/wp-content/uploads/2019/12/Coconut-Basmati-Wild-Rice-800x687.png',
        title: 'Vilde ris',
        description: 'Wild rice watch out',
        price: 20
    }),
    new Product({
        imagePath: 'https://images.interactives.dk/istock-184842128-ilAFOUXlmHd8wAxofg1LLg.jpg?auto=compress&ch=Width%2CDPR&dpr=2.63&ixjsv=2.2.4&q=38&rect=104%2C0%2C5408%2C3744&w=430',
        title: 'Sorte ris',
        description: 'Vidste ikke en gang at der fandtes sorte ris',
        price: 10
    })
];

//Vi gemmer vores products i en array
var done = 0;
for (var i=0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        //Vi checker om vi har fået alle products med
        if (done === products.length) {
            exit();
        }
    });
}

//Vi laver vores disconnect funktion
function exit() {
    mongoose.disconnect();
}

