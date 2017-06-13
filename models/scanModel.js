var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanModelScheMa = new Schema({
    "name" : {type : String},
    "code" : {type : String},
    "note" : {type : String}
});


module.exports = mongoose.model('ScanModel', NoteScanModelScheMaScheMa , 'ScanModel');
