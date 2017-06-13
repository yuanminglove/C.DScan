var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HostGroupScheMa = new Schema({
    "groupName" : {type : String},
    "note" : {type : String},
    "hosts" : {type : Array}
}); 


module.exports = mongoose.model('HostGroup', HostGroupScheMa , 'HostGroup');