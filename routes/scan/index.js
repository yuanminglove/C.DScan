var express = require('express');
var router = express.Router();
var async = require("async");
var functionPart = require('./functionPart')
var child_process = require('child_process');

var cUtils = require('../../utils/commonUtils')
var HostGroupDao = require('../../dao/HostGroupDao')
var ScanModelDao = require('../../dao/ScanModelDao')
var ScanTaskDao = require('../../dao/ScanTaskDao')
var StdResponse = require('../../models/StdResponse')
var HostDao = require('../../dao/HostDao')
var ScanResultDao = require('../../dao/ScanResultDao')


router.use(function (req, res, next) {
    // console.log("------Scan------");
    next(null)
});
router.get("/scanModels", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan model';
    ScanModelDao.findAll(function (err, data) {
        if (err) {
            res.render("scan/modelList", {
                "stdRes": stdRes
            })
        } else {
            stdRes.data = data;
            res.render("scan/modelList", {
                "stdRes": stdRes
            })
        }
    })

})
router.get("/createModelPage", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan model';
    res.render("scan/createModelPage")
})
router.get("/deleteModel/:id", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan model';
    ScanModelDao.deleteById(req.params.id, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "scan/deleteModel Error !"
            res.json(stdRes);
        } else {
            res.json(stdRes);
        }
    })
})
router.post("/addModel", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan model';
    ScanModelDao.save({
        "name": req.body.name,
        "code": req.body.code,
        "note": req.body.note
    }, function (err, data) {
        if (err) {
            res.redirect('/scan/scanModels');
        } else {
            res.redirect('/scan/scanModels');
        }
    })
})
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
        ScanModelDao.findAll(function (err, data) {
            if (err) {
                callback(true);
            } else {
                stdRes.data.push(data);
                callback(null);
            }
        })
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
    var stdRes = new StdResponse();
    stdRes.title = 'Create scan task';
    var task = {
        "name": req.body.taskName || "",
        "timeout": req.body.timeout || 3,
        "note": req.body.note || "",
        "targets": [],
        "scanModels": []
    }
    var scanModels = req.body.scanModels;
    var groupId = req.body.groupId;

    async.waterfall([function (callback) {
        //add host group
        HostGroupDao.findById(groupId, function (err, data) {
            if (err) {
                callback(true);
            } else {
                callback(null, data);
            }
        })

    }, function (hostGroup, callback) {
        HostDao.findByGroupIdAndAlive(hostGroup._id, function (err, data) {
            if (err) {
                callback(true);
            } else {
                task.targets = data
                callback(null);
            }
        })
    }, function (callback) {
        ScanModelDao.findByIds(scanModels, function (err, data) {
            if (err) {
                callback(true);
            } else {
                task.scanModels = data;
                callback(null);
            }
        })
    }, function (callback) {
        ScanTaskDao.save(task, function (err, data) {
            if (err) {
                callback(true);
            } else {
                callback(null);
            }
        })
    }], function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/createTask ERROR!";
            res.render('scan/index', {
                "stdRes": stdRes
            });
        } else {
            res.redirect("/scan/tasks");
        }
    })
});
router.get("/tasks", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan tasks';
    ScanTaskDao.findAll(function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/tasks ERROR!";
            res.render('scan/tasks', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            res.render("scan/tasks", {
                "stdRes": stdRes
            })
        }
    })
});
router.get("/task/:id", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan task detail';
    ScanTaskDao.findById(req.params.id, function (err, task) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/tasks ERROR!";
            res.render('scan/task', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data.push(task);
            ScanResultDao.findByConditions({
                "taskId": task._id
            }, function (err, scanResult) {
                if (err) {
                    stdRes.err = true;
                    stdRes.message = "/scan/task ERROR!";
                    res.json(stdRes)
                } else {
                    stdRes.data.push(scanResult);
                    res.render("scan/task", {
                        "stdRes": stdRes
                    })
                }
            })

        }
    })
});
router.get("/deleteTaskById/:id", function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Scan delete tasks';
    ScanTaskDao.deleteById(req.params.id, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/tasks ERROR!";
            res.json(stdRes)
        } else {
            res.json(stdRes)
        }
    })
})

router.get("/startScan/:id", function (req, res, next) {
    var child;
    var stdRes = new StdResponse();
    stdRes.title = 'Scan delete tasks';
    ScanTaskDao.findById(req.params.id, function (err, task) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/scan/startScan ERROR!";
            res.json(stdRes)
        } else {
            /*创建扫描进程，执行扫描任务，添加扫描进程PID到任务中  */
            //child_process.fork(modulePath[, args][, options])
            //Cannot find module '/home/chris/Documents/C.DScan/scanTask.js'
            child = child_process.fork("./routes/scan/processScanTask.js", [task._id]);
            task.pid = child.pid;
            ScanTaskDao.update(task, function (err) {
                if (err) {
                    stdRes.err = true;
                    stdRes.message = "/scan/startScan ERROR!";
                    //child_process.exec(command[, options][, callback])
                    child_process.exec("kill", child.pid)
                    res.json(stdRes)
                } else {
                    res.json(stdRes)
                }
            })
        }
    })
})




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
