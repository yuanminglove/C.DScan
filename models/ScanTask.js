/*Scan model*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanTaskScheMa = new Schema({
    "name": {type : String},
    "timeout": {type : Number},
    "targets": {type : Array},
    "scanModels": {type : Array},
    "time" : {type : Number},
    "note": {type : String, default : "Scan task ."}
});


module.exports = mongoose.model('ScanTask', ScanTaskScheMa, 'ScanTask');
