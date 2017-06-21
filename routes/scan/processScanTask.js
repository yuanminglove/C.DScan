var async = require("async");
var ScanResultDao = require('../../dao/ScanResultDao');
var ScanTaskDao = require('../../dao/ScanTaskDao');
var options = process.argv;
/*
执行扫描的时候，
先获取task的所有内容
加载扫描模块
执行任务
*/
var task;
var targets;
var scanResults = [];
var scanModels = [];
var taskId = options[2]||"";
console.log("---------------------processScanTask----------------------------")
async.waterfall([function (waterfallcb) {
    console.log("option : " + taskId)
    ScanTaskDao.findById(taskId, function (err, t) {
        console.log("---------------------ScanTaskDao.findById----------------------------")
        if (err) {
            console.log(err);
        } else {
            task = t;
            targets = t.targets;
            for (var i in task.scanModels) {
                scanModels.push(eval(task.scanModels[i].code));
            }
            async.series(scanModels, function (err) {

                ScanResultDao.saveScanResults(scanResults, function (err) {
                    console.log("over");
                    waterfallcb(null);
                })

            });
        }
    })
}], function (err) {

})

/*
(function(){return function(cb){
    var scanResult = {};
    for (var i in targets) {
        scanResult.target = targets[i].ip;
        scanResult.port = 80;
        scanResult.level = 1;
        scanResult.outPut = "output";
        scanResults.push(scanResult)
    }
    cb(null);
}})()
*/
