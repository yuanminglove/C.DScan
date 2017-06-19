var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var HostGroupModel = require('../models/HostGroup');
var HostModel = require('../models/Host');
var cutils = require('../utils/commonUtils');

var HostGroupDao = {
    "banner": function () {
        console.log("[HostGroupDao banner : ] -banner- Print banner.");
    },
    "save": function (hg, cb) {
        var hostGroup = new HostGroupModel();
        hostGroup.groupName = hg.groupName;
        hostGroup.note = hg.note;
        if (hg.groupId != "") {
            HostGroupModel.find({
                "_id": hg.groupId
            }, function (err, data) {
                if (err) {
                    console.log("[HostGroupDao ERROR : ] -save- Host find error data is null!");
                    console.log(err);
                    cb(true);
                } else if (data.length > 0) {
                    data = data[0];
                    data.groupName = hostGroup.groupName;
                    data.note = hostGroup.note;
                    HostGroupModel.update({
                        "_id": data._id
                    }, data, function (err) {
                        if (err) {
                            console.log("[HostGroupDao ERROR : ] -save- Host update error ");
                            console.log(err);
                            cb(true);
                        } else {
                            cb(null, data)
                        }
                    })
                } else {
                    data = new HostGroupModel();
                    data.groupName = hostGroup.groupName;
                    data.note = hostGroup.note;
                    data.update(function (err) {
                        if (err) {
                            console.log("[HostGroupDao ERROR : ] -save- Host update error ");
                            console.log(err);
                            cb(true);
                        } else {
                            cb(null, data)
                        }
                    })
                }
            })
        } else {
            hostGroup.save(function (err, data) {
                if (err) {
                    console.log("[HostGroupDao ERROR : ] -save- Host save error ");
                    console.log(err);
                    cb(true);
                } else {
                    cb(null, data)
                }
            })
        }
    },
    "deleteById": function (id, cb) {
        HostGroupModel.findOne({
            "_id": id
        }, function (err, data) {
            if (err || !data) {
                console.log("[HostGroupDao ERROR : ] -deleteById- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                console.log(data)
                HostGroupModel.remove({
                    "_id": data._id
                }, function (err) {
                    if (err) {
                        console.log("[HostGroupDao ERROR : ] -save- Host remove error ");
                        console.log(err);
                        cb(true);
                    } else {
                        cb(null)
                    }
                })
            }
        })
    },
    "findAll": function (cb) {
        HostGroupModel.find({}, function (err, data) {
            if (err) {
                console.log("[HostGroupDao ERROR : ] -findAll- Host find error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        })
    },
    "findById": function (id, cb) {
        HostGroupModel.findOne({
            "_id": id
        }, function (err, hostGroup) {
            if (err) {
                console.log("[HostGroupDao ERROR : ] -findById- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, hostGroup)
            }
        })
    },
    "findByIds": function (ids, cb) {
        HostGroupModel.find({
            "_id": {$in : ids}
        }, function (err, hostGroup) {
            if (err) {
                console.log("[HostGroupDao ERROR : ] -findByIds- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, hostGroup)
            }
        })
    },
    "findByPage": function (page, cb) {
        var conditions = {};

        for (var i = 0; i < page.conditions.length; i++) {
            var c = page.conditions[i]
            conditions[c.name] = c.value;
        }
        HostGroupModel.find(conditions, function (err, data) {
            if (err) {
                console.log("[HostGroupDao ERROR : ] -findByPage- Host find error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        })
    },
    "addToGroup": function (id, page, cb) {
        var hostIds = [];
        for (var i = 0; i < page.hideData.length; i++) {
            if (page.hideData[i].name = "hostId") {
                hostIds.push(page.hideData[i].value)
            }
        }
        HostGroupModel.findOne({
            "_id": id
        }, function (err, hostGroup) {
            if (err || !hostGroup) {
                console.log("[HostGroupDao ERROR : ] -findGroupAndHosts- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                // cutils.log(hostIds)
                HostModel.update({
                    "_id": {
                        "$in": hostIds
                    }
                }, {
                    "groupId": hostGroup._id
                }, {
                    "multi": true
                }, function (err, data) {
                    if (err) {
                        console.log("[HostGroupDao ERROR : ] -findGroupAndHosts- Host find error ");
                        console.log(err);
                        cb(true);
                    } else {
                        cb(null)
                    }
                })
            }
        })
    },
    "findGroupAndHosts": function (id, cb) {
        HostGroupModel.findOne({
            "_id": id
        }, function (err, hostGroup) {
            if (err || !hostGroup) {
                console.log("[HostGroupDao ERROR : ] -findGroupAndHosts- Host findOne error ");
                console.log(err);
                cb(true);
            } else {
                HostModel.find({
                    "groupId": hostGroup._id
                }, function (err, data) {
                    if (err) {
                        console.log("[HostGroupDao ERROR : ] -findGroupAndHosts- Host find error ");
                        console.log(err);
                        cb(true);
                    } else {
                        cb(null, hostGroup, data)
                    }
                })
            }
        })
    }
}


module.exports = HostGroupDao;
