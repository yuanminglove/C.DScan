"use strict"
var express = require('express');
var router = express.Router();
var fileUtil = require('../../utils/fileUtil')
var cUtils = require('../../utils/commonUtils')
var bugTemplateDao = require('../../dao/BugTemplateDao')
var reportTemplateDao = require('../../dao/ReportTemplateDao')
var bugReportDao = require('../../dao/BugReportDao')
var StdResponse = require('../../models/StdResponse')
var async = require("async");

/* GET user home page. */
router.get('/', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Report';
    res.render('user/index', {
        "stdRes": stdRes
    });
});
/* GET 漏洞模版列表 */
router.get('/bugTemplates', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    bugTemplateDao.findAll(function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "bugTemplates has error!"
        }else{
            stdRes.data = data
        }
        res.render('report/bugTemplates', {
            "stdRes": stdRes
        });
    });
    
});

router.post('/addBugTemplate',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    bugTemplateDao.add(req,function(err){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "bugTemplates has error!"
        }
        res.redirect('/report/bugTemplates')
    })
    
});
router.get('/deleteBugTemplate/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    bugTemplateDao.delById(req.params.id,function(err){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "deleteBugTemplate has error!"
        }
        res.json(stdRes)
    })
});
router.get('/editBugTemplate/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template Edit';
    bugTemplateDao.findById(req.params.id,function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "editBugTemplate has error!"
        }else{
            stdRes.data = data;
        }
        res.json(stdRes)
    })
});
router.get('/viewHtmlReportTemplate/:id', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'ReportTemplate Html View';
    console.log(req.params.id)
    reportTemplateDao.findById(req.params.id,function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "editBugTemplate has error!"
            res.end(stdRes.err)
        }else{
            console.log(data)
            var html = data.template;
            html = html.replace(/{{bugDetail}}/,data.bugDetail)
            res.writeHead(200, {'Content-Type': 'text/html','content-type' : 'text/html;charset=utf-8'});
            res.write(html);
            res.end();
        }
    })    
});

router.get('/reportTemplates', function (req, res, next) {
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    reportTemplateDao.findAll(function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "bugTemplates has error!"
        }else{
            stdRes.data = data
        }
        res.render('report/reportTemplates', {
            "stdRes": stdRes
        });
    });
    
});

router.post('/addReportTemplate',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    reportTemplateDao.add(req,function(err){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "bugTemplates has error!"
        }
        res.redirect('/report/reportTemplates')
    })
    
});
router.get('/deleteReportTemplate/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    reportTemplateDao.delById(req.params.id,function(err){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "deleteReportTemplate has error!"
        }
        res.json(stdRes)
    })
});
router.get('/editReportTemplate/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Template List';
    reportTemplateDao.findById(req.params.id,function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "editReportTemplate has error!"
        }else{
            stdRes.data = data;
        }
        res.json(stdRes)
    })
});

router.get('/addBugPage',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Add bug page';
    var result = {};
    async.waterfall([
        function(cb) {
            bugTemplateDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    result["bugTemplate"] = data
                    cb(null)
                }
            })
        },
        function(cb) {
            reportTemplateDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    result["reportTemplate"] = data
                    cb(null)
                }
            })
        }
    ], function (err) {
        if(err){
            console.log(err);
            stdRes.err = true;
            stdRes.message = "get addBugPage has err!"
        }else{
            stdRes.data = result
        }
        res.render('report/addBugPage', {
            "stdRes": stdRes
        });
    });    
});
router.post('/addBug',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug List';
    async.waterfall([
        function(cb) {
            bugTemplateDao.findById(req.body.bugTemplateId ,function(err,data){
                if(err){
                    cb(err)
                }else{
                    req.body["bugName"] = data.bugName
                    cb(null)
                }
            })
        },
        function(cb){
            bugReportDao.add(req,function(err){
                if(err){
                    console.log(err)
                    stdRes.err = true;
                    stdRes.message = "addBug has error!"
                    cb(err)
                }else{
                    cb(null)
                }
                
            })
        }
    ], function (err) {
        if(err){
            console.log(err);
            stdRes.err = true;
            stdRes.message = "get addBugPage has err!"
        }
        res.redirect('/report/bugs')
    });
    
});
router.get('/bugs',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug List';
    var result = {}
    async.waterfall([
        function(cb) {
            bugReportDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,data)
                }
                
            });
        },function(bugs, cb){
            reportTemplateDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,bugs,data)
                }                
            })
        }],function(err,bugs,reportTemplates){
            if(err){
                console.log(err)
                stdRes.err = true;
                stdRes.message = "bugTemplates has error!"
            }else{
                result["bugs"] = bugs;
                result["reportTemplates"] = reportTemplates;
                stdRes.data = result;
                res.render('report/bugs',{
                    "stdRes": stdRes
                });
            }
        })
});
router.get('/editBugReport/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Resport Edit';
    var result = {};
    async.waterfall([
        function(cb) {
            bugTemplateDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    result["bugTemplate"] = data
                    cb(null)
                }
            })
        },
        function(cb) {
            reportTemplateDao.findAll(function(err,data){
                if(err){
                    cb(err)
                }else{
                    result["reportTemplate"] = data
                    cb(null)
                }
            })
        },
        function(cb){
            bugReportDao.findById(req.params.id, function(err,data){
                if(err){
                    cb(err)
                }else{
                    result["bugReport"] = data
                    cb(null)
                }                     
            });
        }
    ], function (err) {

        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "deleteBugReport has error!" 
            res.render("report/addBugPage",{"stdRes" : stdRes})           
        }else{
            stdRes.data = result;
            res.render("report/editBugPage",{"stdRes" : stdRes})
        }
    });


    
});
router.get('/deleteBugReport/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Resport Delete';
    bugReportDao.deleteById(req.params.id, function(err,data){
        if(err){
            console.log(err)
            stdRes.err = true;
            stdRes.message = "deleteBugReport has error!"
        }
        res.json(stdRes)
    });
});
router.get('/bugHtmlView/:id',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Html View';
    async.waterfall([
        function(cb) {
            bugReportDao.findById(req.params.id ,function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,data)
                }
            })
        },
        function(bugReport,cb){
            reportTemplateDao.findById(bugReport.reportTemplateId,function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,bugReport,data)
                }
                
            })
        },
        function(bugReport, reportTemplate, cb){
            bugTemplateDao.findById(bugReport.bugTemplateId,function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,bugReport,reportTemplate,data)
                }
                
            })
        },
        function(bugReport, reportTemplate, bugTemplate, cb){
            var html = reportTemplate.template;
            var bugDetail = reportTemplate.bugDetail;
            /** BugReport */
            bugDetail = bugDetail.replace(/{{url}}/g,"<a href=\""+bugReport.url+"\" target=\"_blank\">"+bugReport.url+"</a>");
            bugDetail = bugDetail.replace(/{{discoverer}}/g,bugReport.discoverer);
            bugDetail = bugDetail.replace(/{{detail}}/g,bugReport.detail);
            bugDetail = bugDetail.replace(/{{discoverDate}}/g,bugReport.discoverDate);
            bugDetail = bugDetail.replace(/{{serviceName}}/g,bugReport.serviceName);
            
            /** BugTemplate */
            bugDetail = bugDetail.replace(/{{bugName}}/g,bugTemplate.bugName);
            bugDetail = bugDetail.replace(/{{level}}/g,bugTemplate.level);
            bugDetail = bugDetail.replace(/{{harm}}/g,bugTemplate.harm);
            bugDetail = bugDetail.replace(/{{repairSuggestions}}/g,bugTemplate.repairSuggestions);
            bugDetail = bugDetail.replace(/{{describe}}/g,bugTemplate.describe);

            html = html.replace(/{{bugDetail}}/,bugDetail)
            html = html.replace(/{{dateNow}}/,Date.now())
            cb(null,html)
        }
    ], function (err, html) {
        if(err){
            console.log(err);
            stdRes.err = true;
            stdRes.message = "get addBugPage has err!"
            res.json(stdRes)
        }else{
            res.writeHead(200, {'Content-Type': 'text/html','content-type' : 'text/html;charset=utf-8'});
            res.write(html);
            res.end();
        }
    });
});
router.post('/bugsHtmlView',function(req, res, next){
    var stdRes = new StdResponse();
    stdRes.title = 'Bug Html View';
    async.waterfall([
        function(cb) {
            bugReportDao.findByIds(req.body.bugIds ,function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,data)
                }
            })
        },
        function(bugReports,cb){       
            reportTemplateDao.findById(req.body.reportTemplateId,function(err,data){
                if(err){
                    cb(err)
                }else{
                    cb(null,bugReports,data)
                }                
            })
        },
        function(bugReports, reportTemplate, cb){
            var _bugReports = [];
            async.each(bugReports, function(item, callback) {
                bugTemplateDao.findById(item.bugTemplateId,function(err,data){
                    if(err){
                        callback(err)
                    }else{
                        item["_bugTemplate"] = data
                        _bugReports.push(item);
                        callback(null)
                    }                    
                })
            }, function(err) {
                if(err){
                    cb(err)
                }else{
                    cb(null,_bugReports,reportTemplate)
                }
            });            
        },
        function(bugReports, reportTemplate, cb){
           
            var html = reportTemplate.template;
            var bugDetailHtml = "";
            for(var i in bugReports){
                /** BugReport */
                var _b = reportTemplate.bugDetail;
                _b = _b.replace(/{{url}}/g,"<a href=\""+bugReports[i].url+"\" target=\"_blank\">"+bugReports[i].url+"</a>");
                _b = _b.replace(/{{discoverer}}/g,bugReports[i].discoverer);
                _b = _b.replace(/{{detail}}/g,bugReports[i].detail);
                _b = _b.replace(/{{discoverDate}}/g,bugReports[i].discoverDate);
                _b = _b.replace(/{{serviceName}}/g,bugReports[i].serviceName);
                
                /** BugTemplate */
                _b = _b.replace(/{{bugName}}/g,bugReports[i]._bugTemplate.bugName);
                _b = _b.replace(/{{level}}/g,bugReports[i]._bugTemplate.level);
                _b = _b.replace(/{{harm}}/g,bugReports[i]._bugTemplate.harm);
                _b = _b.replace(/{{repairSuggestions}}/g,bugReports[i]._bugTemplate.repairSuggestions);
                _b = _b.replace(/{{describe}}/g,bugReports[i]._bugTemplate.describe);

                bugDetailHtml += _b+"<br/>";
            }            

            html = html.replace(/{{bugDetail}}/,bugDetailHtml)
            html = html.replace(/{{dateNow}}/,Date.now())
            cb(null,html)
        }
    ], function (err, html) {
        if(err){
            console.log(err);
            stdRes.err = true;
            stdRes.message = "get addBugPage has err!"
            res.json(stdRes)
        }else{
            res.writeHead(200, {'Content-Type': 'text/html','content-type' : 'text/html;charset=utf-8'});
            res.write(html);
            res.end();
        }
    });
});




module.exports = router;
