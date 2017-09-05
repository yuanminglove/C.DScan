var http = require('http');
var async = require("async");
var options = process.argv;
/*
执行扫描的时候，
先获取task的所有内容
加载扫描模块
执行任务
*/
var taskId = options[2] || "";
var task;
var targets;
var scanResults = [];
var scanModels = [];

async.waterfall([function (waterfallcb) {
    getTask(taskId, function (err, data) {
        if (err) {
            waterfallcb(err);
        } else {
            waterfallcb(null, data);
        }
    });
}, function (t, waterfallcb) {
    task = JSON.parse(t).data[0];
    targets = task.targets;
    async.eachSeries(targets, function (target, callback) {
        var f = []
        for (var i in task.scanModels) {
            f.push(eval("(function(){return "+task.scanModels[i].code+"})()"));
        }
        async.series(f, function (err) {
            callback(err);
        });
    }, function (err) {
//        console.log('1.3 err: ' + err);
        waterfallcb(err);
    });
}, function (waterfallcb) {
    ///save scanResults
    saveScanResults(scanResults, function (err) {
        if (err) {
            waterfallcb(err);
        } else {
            waterfallcb(null);
        }
    })
}], function (err) {
    if (err) {
        console.log(err)
    }
})

/*

(function(){return function(cb){ 
        var scanResult = {}; 
        
        scanResult.target = target.ip; 
        scanResult.port = 80; 
        scanResult.level = 1; 
        scanResult.outPut = "output"; 
        
        scanResults.push(scanResult); 
		cb(null); 
	} 
})()
*/
function getTask(id, cb) {
    var options = {
        host: "127.0.0.1",
        port: 3000,
        path: "/interface/task/" + id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            cb(null, chunk)
        });
        res.on('error', function (err) {
            console.log('RESPONSE ERROR: ' + err);
            cb(err)
        });
    });

    req.on('error', function (err) {
        console.log('REQUEST ERROR: ' + err);
        cb(err)
    });
    req.end();
}

function saveScanResults(item, cb) {
    var bodyString = JSON.stringify(item);
    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/interface/saveScanResults/' + task._id,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        }
    };

    var req = http.request(options, function (res) {
        res.on('data', function (data) {
            if (data.error) {
                cb(data.message);
            } else {
                cb(null);
            }
        });
    });

    req.write(bodyString);
    req.end(); //不能漏掉，结束请求，否则服务器将不会收到信息。
}
