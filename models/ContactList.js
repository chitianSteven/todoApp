var mongoose = require('mongoose'); 

var ContactSchema = new mongoose.Schema({
    name: String,
    gendar: String,
    phone: String,
    email: String,
    address: String,
    note: String,
});

module.exports = mongoose.model('ContactList', ContactSchema);
