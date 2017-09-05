var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ReportTemplateScheMa = new Schema({
    //
    "templateName" : String,
    "template" : String,
    "bugDetail" : String
});


module.exports = mongoose.model('ReportTemplate', ReportTemplateScheMa , 'ReportTemplate');
