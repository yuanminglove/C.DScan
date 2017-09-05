var express = require('express');
var router = express.Router();
var user = require("./user/index")
var scan = require("./scan/index")
var interface = require("./interface/index")
var fringerPrint = require("./fringerPrint/index")
var report = require("./report/index")
var path = require('path');
var ueditor = require("ueditor")


router.use(function (req, res, next) {
    // console.log("[rout : index ] banner!");
    next(null);
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});
router.use("/user", user);
router.use("/scan", scan);
router.use("/interface", interface);
router.use("/fringerPrint", fringerPrint);
router.use("/report", report);

router.use("/ueditor/ue", ueditor(path.join(__dirname, '../public'), function (req, res, next) {  
    //客户端上传文件设置  
     var ActionType = req.query.action;  
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {  
        var file_url = '/ueditor/img/';//默认图片上传地址  
        /*其他上传格式的地址*/  
        if (ActionType === 'uploadfile') {  
            file_url = '/ueditor/file/'; //附件  
        }  
        if (ActionType === 'uploadvideo') {  
            file_url = '/ueditor/video/'; //视频  
        }  
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        res.setHeader('Content-Type', 'text/html');  
    }  
    //  客户端发起图片列表请求  
    else if (req.query.action === 'listimage') {  
        var dir_url = '/ueditor/img/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  
    }  
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/static/ueditor/ueditor.server.config.json') 
    }  
})); 

module.exports = router;
