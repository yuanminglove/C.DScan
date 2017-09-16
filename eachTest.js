var async = require("async");
async.each([1,2,3,4,5,6,7,8,9,10,11,12,13,14],function(item,callback){
	console.log(item)
	if(item>15){
		callback("err : " + item)
	}else{
		callback(null)
	}
},function(err){
	console.log(err)
})