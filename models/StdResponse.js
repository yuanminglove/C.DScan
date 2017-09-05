var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var StdResponseScheMa = new Schema({
    "err" : {type : Boolean, default : false},
    "status" : {type : Number, default : 200},
    "message" : {type : String, default : "null"},
    "title" : {type : String, default : "C.DScan"},
    "data" : {type : Object},
    "page" : {
    	"currentPage" : {type : Number, default : 0},
    	"skip" :{type : Number, default : 0},
    	"totalRows" : {type : Number, default : 100},
    	"pageRows" : {type : Number, default : 25},
    	"hideData" : [{
    		"name" : {type : String},
    		"value" : {type : String}
    	}],
    	"conditions" : [{
    		"name" : {type : String},
    		"value" : {type : String}
    	}]
    }
});


module.exports = mongoose.model('StdResponse', StdResponseScheMa , 'StdResponse');
