/*Scan model*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanModelScheMa = new Schema({
    "name": {type : String, default : "New Scan Model_"+Date.now()},
    "code": {type : String, default : "console.log("+Date.now()+")"},
    "note": {type : String, default : "Scan model ."}
});


module.exports = mongoose.model('ScanModel', ScanModelScheMa, 'ScanModel');
