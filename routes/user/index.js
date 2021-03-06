var express = require('express');
var router = express.Router();
var Ping = require('ping-lite');
var fileUtil = require('../../utils/fileUtil')
var HostDao = require('../../dao/HostDao')
var ServiceDao = require('../../dao/ServiceDao')
var NoteDao = require('../../dao/NoteDao')
var HostGroupDao = require('../../dao/HostGroupDao')
var StdResponse = require('../../models/StdResponse')
var cUtils = require('../../utils/commonUtils')
var constProperties = require('../../utils/constProperties')
var async = require("async");

/* GET user home page. */
router.get('/', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets';
    res.render('user/index', {
        "stdRes": stdRes
    });
});
/* GET 资产导入页面 */
router.get('/assetsImportPage', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets Import';
    res.render('user/assetsImportPage', {
        "stdRes": stdRes
    });
});
/* POST 保存导入资产数据 */
router.post('/assetsImportPage', function (req, res, next) {
    var stdRes = new StdResponse();    
    stdRes.title = 'Assets Import';
    async.waterfall([
        function(cb){
            fileUtil.getMultipary(req, function (err, fields, files) {
                if(err){
                    cb(err);
                }else{
                    cb(null,files.file.path)
                }
            });
        },function(exelFilePath, cb){
            fileUtil.getExecl(exelFilePath, function (err, sheets) {
                if(err){
                    cb(err);
                }else{
                    cb(null,sheets)
                }
            });
        },function(sheets, cb){
            var sheet = [];
            var sheetHead = null;
            async.each(sheets, function(item,callback){
                for(var line in item.data){               
                    if(constProperties.ipSchema.test(item.data[line][0])){
                        sheet.push(item.data[line])
                    }else if(!sheetHead){
                        sheetHead = item.data[line];
                    }
                }
                callback(null);
            },function(err){
                if(err){
                    cb(err);
                }else{
                    cb(null,sheet, sheetHead);
                }
            });
        },function(sheet, sheetHead, cb){
            var failData = [];
            async.eachSeries(sheet, function(item, callback){
                HostDao.saveLine(item, function(err,host){
                    if(err){
                        failData.push({"line" : item, "msg" : "HostDao.saveLine err!"});
                        // console.log(err);
                        callback(null);
                    }else{
                        ServiceDao.saveLine(item,host._id,function(err,service){
                            if(err){
                                console.log(err);
                                failData.push({"line" : item, "msg" : "ServiceDao.saveLine err!"});
                                callback(null);
                            }else{
                                NoteDao.saveLine(item, sheetHead, service.id,function(err){
                                    if(err){
                                        console.log(err);
                                        failData.push({"line" : item, "msg" : "NoteDao.saveLine err!"});
                                    }
                                    callback(null);
                                })
                            }
                        })
                    }
                })
            },function(err){
                if(failData.length>0){
                    cb(failData);
                }else{
                    cb(null)
                }
            })
        }],function(err){
            if(err){
                stdRes.err = true;
                console.log(err)
                stdRes.message = "/user/assetsImportPage ERROR!";
                res.render('user/assetsImportPage', {
                    "stdRes": stdRes
                });
            }else{
                res.render('user/assetsImportPage', {
                    "stdRes": stdRes
                });
            }
    })
});
/* GET 将资产从分组中删除 */
router.get('/deleteHostOwnGroup/:id', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    stdRes.page = cUtils.req2page(req, stdRes.page);
    HostDao.deleteHostOwnGroup(req.params.id, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/deleteHostOwnGroup ERROR!";
            res.json(stdRes);
        } else {
            res.json(stdRes);
        }
    })
});
/* GET 将资产删除 */
router.get('/deleteAsset/:id', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets delete';
    async.waterfall([function(cb){
        HostDao.findByHostId(req.params.id, function (err,data) {
            if (err) {
                cb(err)
            }else if(!data){
                cb("Can not find this host! ")
            }else{
                cb(null,data)
            }
        })
    },function(host,cb){
        ServiceDao.deleteByHostId(host._id,function(err){
            if(err){
                cb(err);
            }else{
                cb(null,host)
            }
        })
    },function(host,cb){
        HostDao.deleteHost(host._id,function(err){
            if(err){
                cb(err);
            }else{
                cb(null)
            }
        })
    }],function(err){
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/deleteAsset ERROR!";
            res.json(stdRes);
        } else {
            res.json(stdRes);
        }
    })
    
});
/* GET 将资产删除 */
router.post('/deleteAssets', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets delete';
    stdRes.page = cUtils.req2page(req, stdRes.page);
    HostDao.deleteHosts(stdRes.page, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/deleteAssets ERROR!";
            res.json(stdRes);
        } else {
            res.redirect('/user/assets');
        }
    })
});

/* GET 资产列表 */
router.get('/assets', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    HostDao.findHostWithoutGroup(function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/assets ERROR!";
            res.render('user/assets', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            res.render('user/assets', {
                "stdRes": stdRes
            });
        }
    })
});
/* GET 资产列表 */
router.get('/getAssetByIp/:ip', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    HostDao.findByIp(req.params.ip, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/assets ERROR!";
        } else{
            stdRes.data = data;
        }
        res.json(stdRes)
    })
});
/* GET 资产列表 带分页数据 */
router.post('/assets', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    stdRes.page = cUtils.req2page(req, stdRes.page);
    stdRes.page.conditions.push({
        "name": "groupId",
        "value": null
    })
    HostDao.findByPage(stdRes.page, function (err, data, page) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/assets ERROR!";
            res.render('user/assets', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            stdRes.page = page
            res.render('user/assets', {
                "stdRes": stdRes
            });
        }
    })
});
/* GET 业务列表 */
router.get('/getServiceByHostId/:id', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    ServiceDao.findByHostId(req, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/assets ERROR!";
        } else{
            stdRes.data = data;
        }
        res.render("user/services",{
            "stdRes": stdRes
        });
    })
});
/* GET 业务列表 */
router.get('/getServiceInfoByHostId/:id', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Assets List';
    ServiceDao.findByHostId(req, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/assets ERROR!";
        } else{
            stdRes.data = data;
        }
        res.json(stdRes);
    })
});
/* post 获取单个分组信息 */
router.post('/hostGroup', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    HostGroupDao.findByPage(stdRes.page, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/hostGroups ERROR!";
            res.json(stdRes);
        } else {
            stdRes.data = data;
            res.json(stdRes);
        }
    });
});
/* GET 浏览分组 */
router.get('/hostGroup/:id', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    HostGroupDao.findGroupAndHosts(req.params.id, function (err, hostGroup, hosts) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/hostGroups ERROR!";
            res.render('user/hostGroups', {
                "stdRes": stdRes
            });
        } else {
            hostGroup.hosts = hosts;
            stdRes.data = hostGroup;
            res.render('user/hostGroup', {
                "stdRes": stdRes
            });
        }
    });
});
/* GET 浏览分组 */
router.get('/hostGroups', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    HostGroupDao.findAll(function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/hostGroups ERROR!";
            res.render('user/hostGroups', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            res.render('user/hostGroups', {
                "stdRes": stdRes
            });
        }
    });
});
/* GET 删除分组 */
router.get('/deleteHostGroup/:id', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);
    console.log("deleteHostGroup");
    HostGroupDao.deleteById(req.params.id, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/deleteHostGroup ERROR!";
            res.json(stdRes);
        } else {
            res.json(stdRes);
        }
    });
});
/* POST 浏览分组 */
router.post('/addHostGroup', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    if (req.body.groupName && req.body.note) {
        var hg = {
            "groupName": req.body.groupName || ("chris" + Math.random()),
            "note": req.body.note || ("chris" + Math.random()),
            "groupId": req.body.groupId || ""
        }
        HostGroupDao.save(hg, function (err) {
            if (err) {
                stdRes.err = true;
                stdRes.message = "/user/addHostGroup ERROR!";
                res.render('user/hostGroups', {
                    "stdRes": stdRes
                });
            } else {
                res.redirect('/user/hostGroups');
            }
        })
    } else {
        stdRes.err = true;
        stdRes.message = "/user/addHostGroup ERROR! 参数不合法！";
        res.render('user/hostGroups', {
            "stdRes": stdRes
        });
    }
});
/* POST 添加资产到分组 */
router.post('/selectGroupToAdd', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    HostGroupDao.findAll(function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/addToGroup ERROR!";
            res.render('user/addToGroup', {
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            res.render('user/addToGroup', {
                "stdRes": stdRes
            });
        }
    });
});
/* POST 添加资产到分组 */
router.post('/addToGroup', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Select Or Create Group';
    stdRes.page = cUtils.req2page(req, stdRes.page);

    HostGroupDao.addToGroup(req.body.groupId, stdRes.page, function (err) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/addToGroup ERROR!";
            res.render('user/addToGroup', {
                "stdRes": stdRes
            });
        } else {
            res.redirect('/user/hostGroup/' + req.body.groupId);
        }
    });
});
/* GET 资产附加信息 */
router.get('/note/:id', function (req, res, next) {
    var hostId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Assets note';
    NoteDao.findByHostId(hostId, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/note/" + noteId + " ERROR!";
            res.json({
                "stdRes": stdRes
            });
        } else {
            stdRes.data = data;
            res.json({
                "stdRes": stdRes
            });
        }
    })
});
router.get('/getNoteByForeignId/:id', function (req, res, next) {
    var foreignId = req.params.id;
    var stdRes = new StdResponse();
    stdRes.title = 'Assets note';
    NoteDao.findByForeignId(foreignId, function (err, data) {
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/note/" + noteId + " ERROR!";
            res.json(stdRes);
        } else {
            stdRes.data = data;
            res.json(stdRes);
        }
    })
});

/* GET 资产附加信息 */
router.get('/checkAlive/:hostId', function (req, res, next) {
    var hostId = req.params.hostId;
    var stdRes = new StdResponse();
    stdRes.title = 'Check alive';
    HostDao.findByHostId(hostId, function (err, data) {
        // cUtils.log(data)
        if (err) {
            stdRes.err = true;
            stdRes.message = "/user/checkAlive/" + hostId + " ERROR!";
            res.json({
                "stdRes": stdRes
            });
        } else {
            // console.log(data.ip+" : "+data._id);
            var ping = new Ping(data.ip);
            ping.send(function (err, ms) {
                if (ms) {
                    HostDao.setAliveById(data._id)
                    stdRes.data = data._id;
                    res.json(stdRes);
                } else {
                    stdRes.err = true;
                    stdRes.message = "/user/checkAlive/" + data._id + " ERROR!";
                    HostDao.setNotAliveById(data._id)
                    stdRes.data = data._id;
                    res.json(stdRes);
                }
            });
        }
    });

});


module.exports = router;
