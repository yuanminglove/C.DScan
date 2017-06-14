var express = require('express');
var router = express.Router();
var async = require("async");
var functionPart = require('./functionPart')

var cUtils = require('../../utils/commonUtils')
var HostDao = require('../../dao/HostDao')
var HostGroupDao = require('../../dao/HostGroupDao')
var StdResponse = require('../../models/StdResponse')


router.use(function (req, res, next) {
    // console.log("------Scan------");
    next(null)
});
/*创建扫描任务*/
router.get('/createTask/:hostGroupId', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Create scan task';
    async.waterfall([function (callback) {
        //add host group
        HostGroupDao.findById(req.params.hostGroupId, function (err, data) {
            if (err) {
                callback(true);
            } else {
                stdRes.data.push(data);
                callback(null);
            }
        });
    }, function (callback) {
        //add scan model
        var scanModels = [];
        
        var scanModel = {
            "_id": "11225563",
            "name": "aaaaa",
            "note": "ffffffff"
        }
        
        scanModels.push(scanModel);
        var scanModel = {
            "_id": "11225562",
            "name": "bbbbb",
            "note": "ffffffff"
        }
        
        scanModels.push(scanModel);
        var scanModel = {
            "_id": "11225561",
            "name": "ccccc",
            "note": "ffffffff"
        }
        
        scanModels.push(scanModel);
        stdRes.data.push(scanModels);
        callback(null);
    }, function (callback) {
        callback(null);
    }], function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/createTask ERROR!";
            res.render('scan/index', {
                "stdRes": stdRes
            });
        } else {
            res.render('scan/createTaskPage', {
                "stdRes": stdRes
            });
        }
    })
});
/*创建扫描任务*/
router.post('/createTask', function (req, res, next) {
    res.render("scan/tasks")
});




/* GET 执行链试扫描. */
router.get('/waterfall', function (req, res, next) {
    functionPart.start(req.session.pid || "", "127.0.0.1", function (err, pid) {
        if (err) {
            res.render('index', {
                title: 'Express'
            });
        } else {
            req.session.pid = pid
            res.render('index', {
                title: 'Express'
            });
        }
    });
});
/* GET 结束某个扫描进程. */
router.get('/kill/：pid', function (req, res, next) {
    res.end("OK!")
});
/* GET 结束所有扫描进程. */
router.get('/killAll', function (req, res, next) {
    res.end("OK!")
});
/* GET 跳转到扫描模块添加或者修改的页面. */
router.get('/addModelPage', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Add Scan Model Page';
    res.render('scan/index', {
        "stdRes": stdRes
    });
});


module.exports = router;
