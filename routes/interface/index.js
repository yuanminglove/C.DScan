var express = require('express');
var router = express.Router();
var async = require("async");

var cUtils = require('../../utils/commonUtils')
var ScanTask = require('../../models/ScanTask');
var ScanResult = require('../../models/ScanResult');
var StdResponse = require('../../models/StdResponse')


router.use(function (req, res, next) {
    // console.log("------Scan------");
    next(null)
});
/**
 * @condition
 * @projection
 * @options
 *
 */
router.get("/taskConditions", function (req, res, next) {
    //Model.find(conditions, [projection], [options], [callback])
    var stdRes = new StdResponse();
    stdRes.title = 'Find task by conditions';
    ScanTask.find(req.body.conditions, function (err, data) {
        if (err) {
            console.log(err)
            stdRes.error = true;
            stdRes.message = "interface/task ERROR!"
        } else {
            stdRes.data.push(data);
        }
        res.json(stdRes);
    })
})
/**
 * @id
 *
 */
router.get("/task/:id", function (req, res, next) {
    //Model.find(conditions, [projection], [options], [callback])
    var stdRes = new StdResponse();
    stdRes.title = 'Find task by id';
    ScanTask.find({
        "_id": req.params.id
    }, function (err, data) {
        if (err) {
            console.log(err)
            stdRes.error = true;
            stdRes.message = "interface/task ERROR!"
        } else {
            stdRes.data.push(data[0]);
        }
        res.json(stdRes);
    })
})
/**
 * @scanResult
 *
 */
router.post("/saveScanResults/:id", function (req, res, next) {
    //Model.find(conditions, [projection], [options], [callback])
    var stdRes = new StdResponse();
    stdRes.title = 'Save scan results';
    var taskId = req.params.id;
    async.eachSeries(req.body, function (item, callback) {
        var sr = new ScanResult();
        sr.taskId = taskId;
        sr.target = item.target;
        sr.port = item.port;
        sr.level = item.level;
        sr.outPut = item.outPut || "";
        sr.save(callback);
    }, function (err) {
        if (err) {
            console.log(err);
            stdRes.error = true;
            stdRes.message = "interface/saveScanResults ERROR!"
        }
        res.json(stdRes)
    });


})

module.exports = router;
