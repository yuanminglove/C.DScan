var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HostScheMa = new Schema({
    "ip" : {type : String, index : false, unique : false, default : ""},
    "hostName" : {type : String},
    "offices" : {type : String},
    "isAlive" : {type : Boolean, default : false},
    "fringPrint" : {type : Buffer},
    "groupId" : {type: Schema.Types.ObjectId, ref: 'HostGroup',default : null},
    "joinDate" : {type : String,default : Date.now()}
});


module.exports = mongoose.model('Host', HostScheMa , 'Host');
