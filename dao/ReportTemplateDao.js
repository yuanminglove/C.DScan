var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var ReportTemplateModel = require('../models/ReportTemplate');
var cutils = require('../utils/commonUtils');

var ReportTemplateDao = {
    "banner": function () {
        console.log("[ReportTemplateDao banner : ] -banner- Print banner.");
    },
    "add" : function(req,cb){        
        if(req.body._id && req.body._id!=""){
            ReportTemplateModel.findOne({"_id":req.body._id},function(err,data){
                if(err){
                    cb(err)
                }else{
                    data.templateName = req.body.templateName;
                    data.template = req.body.template;
                    data.bugDetail = req.body.bugDetail;
                    data.save(cb)
                }
            })
        }else{ 
            var reportTemplate = new ReportTemplateModel();
            reportTemplate.templateName = req.body.templateName;
            reportTemplate.template = req.body.template;
            reportTemplate.bugDetail = req.body.bugDetail;            
            reportTemplate.save(cb)
        } 
    },
    "findAll" : function(cb){
        ReportTemplateModel.find({},cb);
    },
    "findById" : function(id ,cb){
        ReportTemplateModel.findOne({"_id" : id},cb);
    },
    "delById" : function(id, cb){
        ReportTemplateModel.findOne({"_id":id},function(err,data){
            if(err){
                cb(err)
            }else{
                ReportTemplateModel.remove(data,cb);
            }
        })
    }
}


module.exports = ReportTemplateDao;
