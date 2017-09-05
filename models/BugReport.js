var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BugReportScheMa = new Schema({
    "url" : String,
    "serviceName" : String,
    "discoverer" : String,
    "detail" : String,
    "discoverDate" : {type : String,default : Date.now()},
    "bugTemplateId" : String,
    "bugName" : String,
    "reportTemplateId" : String
});


module.exports = mongoose.model('BugReport', BugReportScheMa , 'BugReport');
