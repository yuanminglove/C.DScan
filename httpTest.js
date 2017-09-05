var http = require('http');

function httptest(cb) {
    var scanResult = {};
    scanResult.target = "www.phpyun.com";
    scanResult.port = 80;
    scanResult.level = 1;
    scanResult.outPut = "output";

    var options = {
        host: scanResult.target,
        port: scanResult.port,
        path: '/'
    };
    http.get(options, function (res) {
        console.log(res.statusCode)
        var html = "";

        res.on('data', function (data) {
            html += data;
        })

        res.on('end', function () {
            scanResult.outPut = html;
            //scanResults.push(scanResult);
            cb(null, scanResult);
        })
    }).on('error', function (err) {
        scanResult.outPut = err.message;
        //scanResults.push(scanResult);
        cb(null);
    });
}


httptest(function (err, scanResult) {
    console.log(scanResult);
})
