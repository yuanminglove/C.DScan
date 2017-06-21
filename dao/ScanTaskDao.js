var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanTask = require('../models/ScanTask');
var cutils = require('../utils/commonUtils');

var ScanTasklDao = {
    "banner": function () {
        console.log("[ScanTasklDao banner : ] -banner- Print banner.");
    },
    "save": function (st, cb) {
        var model = new ScanTask();
        model.name = st.name;
        model.note = st.note;
        model.timeout = st.timeout;
        model.time = new Date().getTime();
        model.targets = st.targets;
        model.scanModels = st.scanModels;

        model.save(function (err, data) {
            if (err) {
                console.log(err);
                cb(true);
            } else {
                //                console.log(data);
                cb(null)
            }
        })
    },
    "update": function (st, cb) {
        ScanTask.update(st, cb);
    },
    "findAll": function (cb) {
        ScanTask.find({}, null, {
            sort: [{
                'time': -1
            }]
        }, function (err, data) {
            if (err) {
                console.log(err);
                cb(true);
            } else {
                cb(null, data);
            }
        })
    },
    "findById": function (id, cb) {
        console.log("---------------------findById----------------")
        console.log("id : "+id)
        ScanTask.findOne({
            "_id": id
        }, function (err, data) {
        console.log("---------------------findById22222222----------------")
            if (err) {
                console.log(err);
                cb(true);
            } else {
                console.log(data)
                cb(null, data);
            }
        })
    },
    "deleteById": function (id, cb) {
        ScanTask.remove({
            "_id": id
        }, cb)
    }
}


module.exports = ScanTasklDao;
