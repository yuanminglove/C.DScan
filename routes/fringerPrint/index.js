var express = require('express');
var router = express.Router();
var StdResponse = require('../../models/StdResponse')


router.use(function(req,res,next){
	// console.log("------Scan------");
	next(null)
});
/* GET home page. */
router.get('/', function(req, res, next) {
	var stdRes = new StdResponse();
	stdRes.title = 'Fringer Print List';
  res.render('fringerPrint/index', {"stdRes" : stdRes});
});
/* GET home page. */
router.get('/fringerPrintImportPage', function(req, res, next) {
	var stdRes = new StdResponse();
	stdRes.title = 'Fringer Print Import Page';
  res.render('fringerPrint/index', {"stdRes" : stdRes});
});

module.exports = router;
