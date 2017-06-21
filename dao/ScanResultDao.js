var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ScanResult = require('../models/ScanResult');
var cutils = require('../utils/commonUtils');

var ScanResultDao = {
    "banner": function () {
        console.log("[ScanTasklDao banner : ] -banner- Print banner.");
    },
    "save": function (sr, cb) {
        var model = new ScanResult();

    },
    "saveScanResults": function (scanResults, cb) {
        console.log("------------------saveScanResults---------------------")
        for (var i in scanResults) {
            var model = new ScanResult();
            mode.target = scanResults[i].target;
            mode.port = scanResults[i].port;
            mode.level = scanResults[i].level;
            mode.outPut = scanResults[i].outPut;
            console.log(model)
            model.save(function (err, data) {
                console.log(err)
            })
        }
    },
    "findByConditions": function (conditions, cb) {
        ScanResult.find(conditions, function (err, data) {
            if (err) {
                console.log("[ScanResultDao ERROR : ] -find- Host findByConditions error ");
                console.log(err);
                cb(true);
            } else {
                cb(null, data)
            }
        })
    }
}


module.exports = ScanResultDao;
