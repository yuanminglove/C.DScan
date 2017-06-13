var cutils = require('../utils/commonUtils');
var HostModel = require('../models/Host');
var net = require("net")

var Scan = {
	"banner" : function(){
		cutils.log("[Scan banner : ] -banner- Print banner.");
	},
	"testAlive" : function(hostIp){
		HostModel.findOne({"_id":hostIp},function(err,data){
			if(err){
				cutils.log(err)
			}else{

			}
		})
	}
}


module.exports = Scan;
