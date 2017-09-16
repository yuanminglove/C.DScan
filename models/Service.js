var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ServiceScheMa = new Schema({
    "url" : {type : String},
    "hostId" : {type : String},
    "protocol" : {type : String},
    "domain" : {type : String},
    "port" : {type : String},
    "path" : {type : String},
    "urlOthers" : {type : String},
    "serviceName" : {type : String}
});


module.exports = mongoose.model('Service', ServiceScheMa , 'Service');
