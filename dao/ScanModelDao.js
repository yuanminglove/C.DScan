var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanModel = require('../models/ScanModel');
var cutils = require('../utils/commonUtils');

var ScanModelDao = {
    "banner": function () {
        console.log("[ScanModelDao banner : ] -banner- Print banner.");
    },
    "save": function (sm, cb) {
        var model = new ScanModel();
        model.name = sm.name||"New Scan Model_"+Date.now();
        model.code = sm.code||"console.log("+Date.now()+")";
        model.note = sm.note||"Scan model .";
        model.save(cb);
    },
    "findAll": function (cb) {
        ScanModel.find({}, function (err, data) {
            if (err) {
                console.log(err);
                cb(true);
            } else {
                cb(null, data);
            }
        })
    },
    "findByIds": function (ids, cb) {
        ScanModel.find({"_id":{$in:ids}}, function (err, data) {
            if (err) {
                console.log(err);
                cb(true);
            } else {
                cb(null, data);
            }
        })
    },
    "deleteById": function (id) {
        ScanModel.remove({
            "_id": id
        })
    }
}


module.exports = ScanModelDao;
