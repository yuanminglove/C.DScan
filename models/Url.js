var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UrlScheMa = new Schema({
    "url" : {type : String},
    "pageTitle" : {type : String},
    "isAbleToLogin" : {type : Boolean},
    "isNeedVerifyCode" : {type : Boolean}
});


module.exports = mongoose.model('Url', UrlScheMa , 'Url');