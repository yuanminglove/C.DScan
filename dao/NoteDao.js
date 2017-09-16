var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteModel = require('../models/Note');
var async = require("async");
var cutils = require('../utils/commonUtils');

var NoteDao = {
	"banner" : function(){
		console.log("[NoteDao banner : ] -banner- Print banner.");
	},
	"findByForeignId" : function(foreignId, cb){
		// cutils.log(hostId)
		NoteModel.find({"foreignId" : foreignId},function(err,data){
			if(err){
				console.log("[NoteDao ERROR : ] -findByForeignId- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				cb(null,data)
			}
		})
	},
	"saveLine" : function(line, sheetHead, foreignId, cb){
		
		NoteModel.remove({"foreignId" : foreignId},function(err){
			if(err){
				console.log(err)
				cb(err);
			}else{
				var failData = [];
				var length = [];
				for(var i = 4 ; i<line.length ; i++){
					length.push(i)
				}
				
				if(length.length>0){
					async.each(length,function(item,callback){
						var note = new NoteModel();
						note.noteName = sheetHead[item];
						note.noteValue = line[item];
						note.foreignId = foreignId;
						console.log(note);
						note.save(function(err){
							if(err){
								failData.push({"line" : item, "msg" : "NoteDao.saveLine err!\n"+err})
							}
							callback(null)
						});
					},function(err){
						if(failData.length>0){
							cb(failData);
						}else{
							cb(null)
						}					
					})
				}else{
					cb(null)
				}
			}
		})
	}
}


module.exports = NoteDao;
