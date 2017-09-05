var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var BugTemplateModel = require('../models/BugTemplate');
var cutils = require('../utils/commonUtils');

var BugTemplateDao = {
    "banner": function () {
        console.log("[BugTemplateDao banner : ] -banner- Print banner.");
    },
    "add" : function(req,cb){        
        if(req.body._id && req.body._id!=""){
            BugTemplateModel.findOne({"_id":req.body._id},function(err,data){
                if(err){
                    cb(err)
                }else{
                    data.bugName = req.body.bugName;
                    data.describe = req.body.describe;
                    data.harm = req.body.harm;
                    data.repairSuggestions = req.body.repairSuggestions;
                    data.level = req.body.level;
                    data.save(cb)
                }
            })
        }else{   
            var bugTemplate = new BugTemplateModel();
            bugTemplate.bugName = req.body.bugName;
            bugTemplate.describe = req.body.describe;
            bugTemplate.harm = req.body.harm;
            bugTemplate.repairSuggestions = req.body.repairSuggestions;
            bugTemplate.level = req.body.level;         
            bugTemplate.save(cb)
        } 
    },
    "findAll" : function(cb){
        BugTemplateModel.find({},cb);
    },
    "findById" : function(id ,cb){
        BugTemplateModel.findOne({"_id" : id},cb);
    },
    "delById" : function(id, cb){
        BugTemplateModel.findOne({"_id":id},function(err,data){
            if(err){
                cb(err)
            }else{
                BugTemplateModel.remove(data,cb);
            }
        })
    }
}


module.exports = BugTemplateDao;
