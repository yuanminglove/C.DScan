var formidable = require('formidable');
//引入node-xlsx解析excel模块  
var node_xlsx = require('node-xlsx'); 
var constProperties = require('./constProperties');
module.exports = {
	"getMultipary" : function(req,cb){
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8';
		form.uploadDir = constProperties.uploadDir;
		form.maxFieldsSize = constProperties.maxFieldsSize;

		form.parse(req, function(err, fields, files) {
			if(err){
				console.log("[fileUtil ERROR : ] -getMultipary- 文件上传解析错误！")
				console.log(err);
				cb(true);
			}else{
				cb(null,fields,files)
			}
		});
	},
	"getExecl" : function(execlPath,cb){
		console.log("[fileUtil INFO : ] -getExecl- IN getExecl.")
		var obj = node_xlsx.parse(execlPath); 
		if(obj.length <= 0){
			console.log("[fileUtil ERROR : ] -getExecl- Execl读取错误！");
			console.log(err);
			cb(true);
		}else{
			// var excelObj = obj[0].data;//取得第一个excel表的数据
			// console.log(excelObj);
			cb(null,obj[0].data);
		}
		 
	},
	"c-log" : function (data) {
		console.log("---------------------------")
		console.log(data)
		console.log("---------------------------")
	}
}