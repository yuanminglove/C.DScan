var cUtils = require('../../utils/commonUtils');
var async = require('async')
var child_process = require('child_process')

var functionPart = {
  "banner" : function (ip,cb) {
    cUtils.log("functionPart : "+(ip++));
    for(var i=0;i<1000000000;i++){
      var k = i-8-3-9*8*8*8*8;
    }
    cb(null,ip)
  },
  "start" : function (pid,ip,callback) {//每个用户只能拥有一个正在执行的任务
    if(pid){
      child_process.spawnSync("kill",[pid]);
    }
    pid = child_process.fork("/home/chris/Documents/scanPart/index.js asd").pid
    console.log("pid : " + pid)
    callback(null,pid);
  }
}



module.exports = functionPart;
