var express = require('express');
var router = express.Router();
var hostDao = require("../dao/HostDao")

router.get('/t', function(req, res, next) {
  res.render('index', { title: 'Test' });
});


module.exports = router;
