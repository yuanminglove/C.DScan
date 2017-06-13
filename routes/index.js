var express = require('express');
var router = express.Router();
var user = require("./user/index")
var scan = require("./scan/index")
var fringerPrint = require("./fringerPrint/index")


router.use(function(req,res,next){
	// console.log("[rout : index ] banner!");
	next(null);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use("/user",user);
router.use("/scan",scan);
router.use("/fringerPrint",fringerPrint);

module.exports = router;