/*Scan model*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanResultScheMa = new Schema({
    "taskId": {
        type: String
    },
    "target": {
        type: String
    },
    "port": {
        type: Number
    },
    "level": {
        type: Number
    },
    "outPut": {
        type: String
    }
});


module.exports = mongoose.model('ScanResult', ScanResultScheMa, 'ScanResult');
