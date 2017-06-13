var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ServiceScheMa = new Schema({
    "port" : {type : Number, index : true},
    "isOpen" : {type : Boolean, default : false},
    "fringPrint" : {type : Buffer},
    "serviceDetail" : {
    	"serviceName" : {type : String},
    	"serviceVersion" : {type : String},
    	"serviceProtocol" : {type : String}
    },
    "isWebService" : {type : Boolean, default : false},
    "webService" : [{
        "domain" : {type : String},
        "indexTitle" : {type : String},
        "indexPath" : {type : String}
    }]



}); 


module.exports = mongoose.model('Service', ServiceScheMa , 'Service');