
//Vi laver en funktion, som vi skal bruge til lave indkøbskurv-objekter
//Bemærk at vi laver en "ny" kurv hver gang du tilføjer et item. Derfor skal vi bruge den gamle kurv for at opdatere den med det nye item. Altså bliver kurven gendannet på ny for hvert item tilføjet.
module.exports = function Cart(oldCart) {
    //Vores kurv skal indholde vores items fra den gamle kurv. Dette har vi brug for da vi laver kurven på ny.
    // Vi laver || (OR operator), der fortæller at vi ellers skal vidergive et tomt objekt. Dette gør kurven fleksibel i forhold til om den er helt ny (tom) eller gammel
  this.items = oldCart.items || {};
  // Kurven skal indeholde en total mængde fra tidligere. Vi bruger || operatoren af samme grund som beskrevet ovenfor.
  this.totalQty = oldCart.totalQty || 0;
  //En total pris fra tidligere er også lige den gamle totalpris. Vi bruger || operatoren af samme grund som beskrevet ovenfor.
  this.totalPrice = oldCart.totalPrice || 0;

  // Vi laver en funktion til at tilføje elementer til vores kurv. Funktionen skal tale item'ed og id nummeret som parametre
  this.add = function (item, id) {
      //Vi vil gruppere vores items, så når du køber flere af samme type enhed, så stiger antallet blot i kurven.
      //Vi laver først en storedItem, der ser om det tilføjede item allerede eksiterer
      var storedItem = this.items[id];
      //Hvis det ikke er tilfældet (altså et nyt type item), så tilføjer vi dette som et nyt item i kurven.
      if (!storedItem) {
          storedItem = this.items[id] = {item: item, qty: 0, price: 0};
      }
      //Vi øger mængden af vores item med en (hvis det er et allerede eksisterende item)
      storedItem.qty++;
      //Vi ændrer også prisen, så den er lig vores items pris gange mængden
      storedItem.price = storedItem.item.price * storedItem.qty;
      //Vi øger også den totale mængde (da vi har tilføjet et element til kurven)
      this.totalQty++;
      // Vi øger også den totale pris med det valgte items pris
      this.totalPrice += storedItem.item.price;
  };

  //Vi laver en ny funktion, der giver vores kurvs enheder som et array.

  this.generateArray = function () {
    var arr = [];
    //Vi laver et for-loop der looper igennem vores items keys (id)
    for (var id in this.items) {
        //Vi pusher det enkelte item ud fra ID'et til listen
        arr.push(this.items[id]);
    }
    // Vi returnerer vores array
    return arr;
  };
};

