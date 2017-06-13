var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteModel = require('../models/Note');
var cutils = require('../utils/commonUtils');

var NoteDao = {
	"banner" : function(){
		console.log("[NoteDao banner : ] -banner- Print banner.");
	},
	"findByhostId" : function(hostId, cb){
		// cutils.log(hostId)
		NoteModel.find({"hostId" : hostId},function(err,data){
			if(err){
				console.log("[NoteDao ERROR : ] -findById- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				cb(null,data)
			}
		})
	}
}


module.exports = NoteDao;
