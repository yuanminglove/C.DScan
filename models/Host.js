var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HostScheMa = new Schema({
    "ip" : {type : String, index : true, unique : true, default : ""},
    "hostName" : {type : String},
    "businessName" : {type : String},
    "isAlive" : {type : Boolean, default : false},
    "fringPrint" : {type : Buffer},
    "groupId" : {type: Schema.Types.ObjectId, ref: 'HostGroup',default : null}
});


module.exports = mongoose.model('Host', HostScheMa , 'Host');
