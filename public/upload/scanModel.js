/*
*@cb 模块执行完之后调用，用于接收错误信息
*
* scanResult  扫描结果对象
* scanResults 扫描结果存储数组
* target      扫描对象
*/
function(cb){ 
    var scanResult = {}; //扫描结果
    
    scanResult.target = target.ip; 
    scanResult.port = 80; 
    scanResult.level = 1; 
    scanResult.outPut = "output"; 
    
    scanResults.push(scanResult); 

	cb(null); //有错则返回错误信息，否则返回 !true
} 