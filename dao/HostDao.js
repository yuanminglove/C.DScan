var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var HostModel = require('../models/Host');
var NoteModel = require('../models/Note');
var cutils = require('../utils/commonUtils');

var HostDao = {
	"banner" : function(){
		console.log("[HostDao banner : ] -banner- Print banner.");
	},
	"findByhostId" : function(hostId,cb){
		HostModel.findOne({"_id":hostId},function(err,data){
			if(err){
				console.log("[HostDao ERROR : ] -findByhostId- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				cb(null,data)
			}
		});
	},
	"findAll" : function(cb){
		HostModel.find({},function(err,data){
			if(err){
				console.log("[HostDao ERROR : ] -findAll- Host find error ");
				console.log(err);
				cb(true);
			}else{
				cb(null,data)
			}
		})
	},
	"findByPage" : function(page,cb){
		var conditions = {};

		for(var i=0; i<page.conditions.length; i++){
			var c = page.conditions[i]
			conditions[c.name] = c.value;
		}
		HostModel.count(conditions, function(err,totalRows){
			page.totalRows = totalRows;

			page = cutils.reBuidPage(page);
			HostModel.find(conditions)
			.skip(page.skip)
			.limit(page.pageRows)
			.exec(function(err,data){
				if(err){
					console.log("[HostDao ERROR : ] -findByPage- Host find error ");
					console.log(err);
					cb(true);
				}else{
					cb(null,data,page);
				}
			});
		});
	},
	"deleteHost" : function(hostId, cb){
		HostModel.findOne({"_id":hostId},function(err,data){
			if(err){
				console.log("[HostDao ERROR : ] -findByhostId- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				HostModel.remove({"_id":hostId},cb);
			}
		});
	},
	"deleteHosts" : function(page, cb){
		var hostIds = [];
		for(var i=0; i<page.hideData.length; i++){
			if(page.hideData[i].name = "hostId")
				hostIds.push(page.hideData[i].value)
		}
		HostModel.remove({"_id":hostIds},function(err,data){
			if(err){
				console.log("[HostDao ERROR : ] -findByhostId- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				cb(null)
			}
		});
	},
	"deleteHostGroup" : function(id,cb){
		HostModel.findOne({"_id":id},function(err,data){
			if(err || !data._id){
				console.log("[HostDao ERROR : ] -deleteHostGroup- Host findOne error ");
				console.log(err);
				cb(true);
			}else{
				data.groupId = null;
				data.save(function(err){
					if(err){
						console.log("[HostDao ERROR : ] -deleteHostGroup- Host save error ");
						console.log(err);
						cb(true);
					}else{
						cb(null);
					}
				});
			}
		});
	},
	"saveSheet" : function(sheet){
		var tf = 0;
		console.log("[HostDao LOG : ] -saveSheets- IN saveSheet.");
		var sheetHead = sheet[0];
		var flag=0;
		var ipTmp = [];
		async.forEach(sheet, function(line, callback) {
			line[0] = (line[0]+"").replace(/\s/g, "")
			for(var i in ipTmp){
				if(ipTmp[i]==line[0]){
					flag=0
				}
			}

			if(flag && line[0]!=""){
				ipTmp.push(line[0]);
				async.waterfall([
			    function(cb){
		        HostModel.findOne({ "ip": line[0]},function(err,host){
								cb(err,host||new HostModel());
						});
			    }
					,function (host,cb){
						if(host.ip==""&&line[0]!=""){
							host.ip = line[0];
							host.businessName = line[1];
						}else{
							host.businessName=line[1];
						}
						host.save(function(err,host_){
							cb(err,host_);
						})
					}
					,function (host,cb) {
						NoteModel.find({"hostId": host._id},function(err,data){
							if(data.length>0){
								async.forEach(data,function(item, cb1) {
									item.remove(function(err,data){
										cb1()
									});
								},function(err){
									cb(null,host);
								})
							}else{
								cb(err,host);
							}
						});
					}
					,function(host,cb){
						var notes = [];
						for(var j=2; j<line.length; j++){
							var note = new NoteModel();
							note.hostId = host._id;
							note.noteName = sheetHead[j]||"";
							note.noteValue = line[j]||"";
							notes.push(note);
						}
						async.forEach(notes,function(item, cb2) {
							item.save(function(err,note_){
								if(err){
									console.log("[HostDao ERROR : ] -saveLine- Note save error ");
									console.log(err)
								}else{
								}
							});
						},function(err){
							cb(err);
						})
					}
				], function (err) {
			    callback(err);
				});
			}else {
				flag++;
				callback(null)
			}
		}, function(err) {
			if(err){
				console.log("[HostDao LOG : ] -saveSheets- IN saveSheet.");
				console.log('err: '+ err);
			}
		});
	},
	"saveLine" : function(line, sheetHead){
		HostModel.findOne({ "ip": line[0]},function(err,host){
			if(err){
				console.log("[HostDao ERROR : ] -saveLine- Host findOne error ");
				console.log(err);
			}else{
				if(!host){
					host = new HostModel();
					host.ip = line[0];
					host.businessName = line[1];
					host.save(function(err,host_){
						if(err){
							console.log("[HostDao ERROR : ] -saveLine- Host save error ");
							console.log(err)
						}else{
							NoteModel.remove({"hostIp": Schema.Types.ObjectId(host_.ip)},{ "multi": true },function(err){
								if(err){
									console.log("[HostDao ERROR : ] -saveLine- Note remove error ");
									console.log(err)
								}else{
									for(var j=2; j<line.length; j++){
										var note = new NoteModel();
										note.hostId = host_._id;
										note.noteName = sheetHead[j]||"";
										note.noteValue = line[j]||"";
										note.save(function(err,note_){
											if(err){
												console.log("[HostDao ERROR : ] -saveLine- Note save error ");
												console.log(err)
											}
										});
									}
								}
							})

						}
					})
				}else{
					NoteModel.remove({"hostIp":Schema.Types.ObjectId(host.ip)},{ "multi": true },function(err){
						if(err){
							console.log("[HostDao ERROR : ] -saveLine- Note remove error ");
							console.log(err)
						}else{
							for(var j=2; j<line.length; j++){
								var note = new NoteModel();
								note.hostId = host._id;
								note.noteName = sheetHead[j]||"";
								note.noteValue = line[j]||"";
								note.save(function(err,note_){
									if(err){
										console.log("[HostDao ERROR : ] -saveLine- Note save error ");
										console.log(err)
									}
								});
							}
						}
					})
				}
			}
		})
	},
	"setAliveById" : function (hostId) {
		HostModel.findOneAndUpdate({"_id" : hostId}, {"isAlive" : true},function(err){
			if(err){
				console.log(err)
			}
		});
	},
	"setNotAliveById" : function (hostId) {
		HostModel.findOneAndUpdate({"_id" : hostId}, {"isAlive" : false},function(err){
			if(err){
				console.log(err)
			}
		});
	}
}


module.exports = HostDao;
