// Vi laver et skema til at håndtere vores user.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Vi laver et nyt Skema til vores user, med email og password
var userSchema = new Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

//Vi eksporterer vores userSchema
module.exports = mongoose.model('User', userSchema);
