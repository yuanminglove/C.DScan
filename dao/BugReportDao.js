var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var BugReportModel = require('../models/BugReport');
var cutils = require('../utils/commonUtils');

var BugReportDao = {
    "banner": function () {
        console.log("[BugReportDao banner : ] -banner- Print banner.");
    },
    "add" : function(req,cb){
        if(req.body._id && req.body._id!=""){
            BugReportModel.findOne({"_id":req.body._id},function(err,data){
                if(err){
                    cb(err)
                }else{
                    data.url = req.body.url;
                    data.payload = req.body.payload;
                    data.serviceName = req.body.serviceName;
                    data.discoverer = req.body.discoverer;
                    data.detail = req.body.detail;
                    data.bugName = req.body.bugName;
                    data.bugTemplateId = req.body.bugTemplateId;
                    data.reportTemplateId = req.body.reportTemplateId;
                    console.log(req.body.detail)
                    data.save(cb)
                }
            })
        }else{   
            var BugReport = new BugReportModel();
            BugReport.url = req.body.url;
            BugReport.payload = req.body.payload;
            BugReport.serviceName = req.body.serviceName;
            BugReport.discoverer = req.body.discoverer;
            BugReport.detail = req.body.detail;
            BugReport.bugName = req.body.bugName;
            BugReport.bugTemplateId = req.body.bugTemplateId;
            BugReport.reportTemplateId = req.body.reportTemplateId;
            
            BugReport.save(cb)
        } 
    },
    "findAll" : function(cb){
        BugReportModel.find({},cb);
    },
    "findById" : function(id ,cb){
        BugReportModel.findOne({"_id" : id},cb);
    },
    "findByIds" : function(ids ,cb){
        BugReportModel.find({"_id":{"$in":ids}},cb);
    },
    "deleteById" : function(id, cb){
        BugReportModel.findOne({"_id" : id},function(err,data){
            if(err){
                cb(err);
            }else{
                data.remove(cb)
            }
        });
    }
}


module.exports = BugReportDao;
