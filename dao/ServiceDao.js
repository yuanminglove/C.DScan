var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var ServiceModel = require('../models/Service');
var NoteModel = require('../models/Note');
var cutils = require('../utils/commonUtils');
var constProperties = require('../utils/constProperties')

var ServiceDao = {
    "banner": function () {
        console.log("[ServiceDao banner : ] -banner- Print banner.");
    },
    "saveLine" : function(line , hostId, callback){
        // console.log(line)
        async.waterfall([
            function(cb){
                ServiceModel.findOne({"url" : line[2]},function(err,data){
                    if(err){
                        cb(err)
                    }else{
                        cb(null,data||new ServiceModel())
                    }
                });
            },function(data,cb){
                data.hostId = hostId;
                data.url = line[2];
                var m = line[2].match(constProperties.urlSchema);
                /*
                console.log(url.match(/^([a-zA-z]+)?[:/]*([a-zA-z0-9\.-]+)\:?(\d+)?([^?]+)?\??([a-zA-Z0-9\/%&\-=_]+)*#?([a-zA-Z0-9]+)?/))
                Array [ 
                    "https://www.baidu.com:80/s?wd=use%2…", 
                    "https", 
                    "www.baidu.com", 
                    "80", 
                    "/s", 
                    "wd=use%20strict&rsv_spt=1&rsv_iqid=…", 
                    "asd" 
                ]
                */
                // console.log(m)
                data.protocol = m[1]||"";
                data.domain = m[2]||"";
                data.port = m[3]||"";
                data.path = m[4]||"";
                data.urlOthers = m[5]||"";

                data.serviceName = line[3];
                data.save(function(err,data){
                    if(err){
                        console.log("service save error !\n",err)
                        cb(err)
                    }else{
                        cb(null,data)
                    }
                })
            }],function(err,data){
                if(err){
                    callback(err)
                }else{
                    callback(null,data)
                }
            })   
    },
    "findByHostId" : function(req, cb){
        ServiceModel.find({"hostId" : req.params.id},function(err,data){
            if(err){
                cb(err);
            }else{
                cb(null,data);
            }
        })
    },
    "deleteByHostId" : function(hostId,cb){
        ServiceModel.remove({"hostId":hostId},cb)
    }
}


module.exports = ServiceDao;
