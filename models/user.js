// Vi laver et skema til at håndtere vores user.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Vi bruger bcrpyt til kryptere vores passwords. Bcrypt har en hashing algoritme der laver vores input om til en string, der er vores hashed password. Dette hjælper os med ikke at gemme passworden i databasen ukrypteret.
var bcrypt = require('bcrypt-nodejs');

//Vi laver et nyt Skema til vores user, med email og password
var userSchema = new Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

// Vi bruger bcrypts Encrypt password til at kryptere passworded
userSchema.methods.encryptPassword = function(password) {
    //Funktionen hashSync tager data og salt som parametre. Data er vores den data vi vil kryptere og "salt" bliver brugt til at hashe passworded. Grunden til at man bruger salt er for at skabe en unik hash, hver gang
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//Vi tjekker nu om passworded er validt, ved at bruge bcrypt compareSync metode, der tjekker passworded i databasen op i mod det indtastede password.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


//Vi eksporterer vores userSchema
module.exports = mongoose.model('User', userSchema);
