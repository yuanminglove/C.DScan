var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var BugTemplateScheMa = new Schema({
    "bugName" : String,
    "describe" : String,
    "harm" : String,
    "repairSuggestions" : String,
    "level" : Number
});


module.exports = mongoose.model('BugTemplate', BugTemplateScheMa , 'BugTemplate');
