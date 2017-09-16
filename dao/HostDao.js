'use strict'
var mongoose = require("mongoose");
var async = require("async");
var Schema = mongoose.Schema;
var HostModel = require('../models/Host');
var NoteModel = require('../models/Note');
var cutils = require('../utils/commonUtils');

var HostDao = {
    "banner": function () {
        console.log("[HostDao banner : ] -banner- Print banner.");
    },
    "findByHostId": function (hostId, cb) {
        HostModel.findOne({
            "_id": hostId
        }, function (err, data) {
            if (err) {
                console.log("[HostDao ERROR : ] -findByHostId- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        });
    },
    "findAll": function (cb) {
        HostModel.find({}, function (err, data) {
            if (err) {
                console.log("[HostDao ERROR : ] -findAll- Host find error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        })
    },    
    "findHostWithoutGroup": function (cb) {
        HostModel.find({"groupId" : null}, function (err, data) {
            if (err) {
                console.log("[HostDao ERROR : ] -findHostWithoutGroup- Host find error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        })
    },
    "findByPage": function (page, cb) {
        var conditions = {};

        for (var i = 0; i < page.conditions.length; i++) {
            var c = page.conditions[i]
            conditions[c.name] = c.value;
        }
        HostModel.count(conditions, function (err, totalRows) {
            page.totalRows = totalRows;

            page = cutils.reBuidPage(page);
            HostModel.find(conditions)
                .skip(page.skip)
                .limit(page.pageRows)
                .exec(function (err, data) {
                    if (err) {
                        console.log("[HostDao ERROR : ] -findByPage- Host find error ");
                        console.log(err);
                        cb(true);
                    } else {
                        cb(null, data, page);
                    }
                });
        });
    },
    "findByGroupIdAndAlive": function (groupId, cb) {
        var conditions = {
            "groupId": groupId,
            "isAlive": true
        };
        HostModel.find(conditions)
            .exec(function (err, data) {
                if (err) {
                    console.log("[HostDao ERROR : ] -findByGroupIdAndAlive- Host find error ");
                    console.log(err);
                    cb(true);
                } else {
                    cb(null, data);
                }
            });
    },
    "findByIp" : function(ip,cb){
        HostModel.findOne({"ip" : ip},cb);
    },
    "deleteHost": function (hostId, cb) {
        HostModel.findOne({
            "_id": hostId
        }, function (err, data) {
            if (err) {
                console.log("[HostDao ERROR : ] -findByhostId- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                HostModel.remove({
                    "_id": hostId
                }, cb);
            }
        });
    },
    "deleteHosts": function (page, cb) {
        var hostIds = [];
        for (var i = 0; i < page.hideData.length; i++) {
            if (page.hideData[i].name = "hostId")
                hostIds.push(page.hideData[i].value)
        }
        HostModel.remove({
            "_id": hostIds
        }, function (err, data) {
            if (err) {
                console.log("[HostDao ERROR : ] -findByhostId- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                cb(null)
            }
        });
    },
    "deleteHostOwnGroup": function (id, cb) {
        HostModel.findOne({
            "_id": id
        }, function (err, data) {
            if (err || !data._id) {
                console.log("[HostDao ERROR : ] -deleteHostGroup- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                data.groupId = null;
                data.save(function (err) {
                    if (err) {
                        console.log("[HostDao ERROR : ] -deleteHostGroup- Host save error ");
                        console.log(err);
                        cb(true);
                    } else {
                        cb(null);
                    }
                });
            }
        });
    },
    "saveLine": function (line, callback) {
        async.waterfall([
            function(cb){
                HostModel.findOne({"ip" : line[0]},function(err, data){
                    if(err){
                        cb(err);
                    }else{
                        cb(null,data||new HostModel());
                    };
                });
            },function(data,cb){
                data.ip = line[0];
                data.offices = line[1];
                data.save(function(err,data){
                    if(err){
                        cb(err);
                    }else{
                        cb(null,data);
                    };
                });
            }],function(err,data){
                if(err){
                    callback(err);
                }else{
                    callback(null,data);
                };
            })      
    },
    "setAliveById": function (hostId) {
        HostModel.findOneAndUpdate({
            "_id": hostId
        }, {
            "isAlive": true
        }, function (err) {
            if (err) {
                console.log(err)
            }
        });
    },
    "setNotAliveById": function (hostId) {
        HostModel.findOneAndUpdate({
            "_id": hostId
        }, {
            "isAlive": false
        }, function (err) {
            if (err) {
                console.log(err)
            }
        });
    }
}


module.exports = HostDao;
