var express = require('express');
var router = express.Router();
var functionPart = require('./functionPart')

var cUtils = require('../../utils/commonUtils')
var HostDao = require('../../dao/HostDao')
var StdResponse = require('../../models/StdResponse')


router.use(function(req,res,next){
	// console.log("------Scan------");
	next(null)
});
/* GET 执行链试扫描. */
router.get('/waterfall', function(req, res, next) {
	functionPart.start(req.session.pid||"","127.0.0.1",function(err,pid){
		if(err){
			res.render('index', { title: 'Express' });
		}else{
			req.session.pid = pid
			res.render('index', { title: 'Express' });
		}
	});
});
/* GET 结束某个扫描进程. */
router.get('/kill/：pid', function(req, res, next) {
	res.end("OK!")
});
/* GET 结束所有扫描进程. */
router.get('/killAll', function(req, res, next) {
	res.end("OK!")
});
/* GET 跳转到扫描模块添加或者修改的页面. */
router.get('/addModelPage', function(req, res, next) {
	var stdRes = new StdResponse();
	stdRes.title = 'Add Scan Model Page';
  res.render('scan/index', {"stdRes" : stdRes});
});


module.exports = router;
