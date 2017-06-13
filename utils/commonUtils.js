module.exports = {
	"log" : function (data) {
		console.log("---------------------------")
		console.log("[Log : ] ")
		console.log(data)
		console.log("---------------------------")
	},
	"req2page" : function(req, page){
		var hideData = [];
		if(typeof req.body.hideData  == "object"){
			hideData = req.body.hideData;
		}else if(typeof req.body.hideData == "string"){
			hideData.push(req.body.hideData);
		}
		var conditions = [];
		if(typeof req.body.conditions  == "object"){
			conditions = req.body.conditions;
		}else if(typeof req.body.conditions == "string"){
			conditions.push(req.body.conditions);
		}
		var repeatTest = {};
		for(var i=0; i<hideData.length; i++){
			var splitIndex = hideData[i].indexOf(":");
			if(!repeatTest[hideData[i]] && splitIndex>0){
				repeatTest[hideData[i]] = true;
				page.hideData.push({
					"name" : hideData[i].substring(0,splitIndex),
					"value" : hideData[i].substring(splitIndex+1)
				})
			}
		}
		repeatTest = {};
		for(var i=0; i<conditions.length; i++){
			var splitIndex = conditions[i].indexOf(":");
			if(!repeatTest[hideData[i]] && splitIndex>0){
				repeatTest[hideData[i]] = true;
				page.conditions.push({
					"name" : conditions[i].substring(0,splitIndex),
					"value" : conditions[i].substring(splitIndex+1)
				})
			}
		}


		page.currentPage = (req.body.currentPage && req.body.currentPage!="")?req.body.currentPage:page.currentPage;
		page.pageRows = (req.body.pageRows && req.body.pageRows!="")?req.body.pageRows:page.pageRows;

		// this.log(page)

		return page;
	},
	"reBuidPage" : function(page){
		// page.currentPage = int.parseInt(currentPage);
		// page.skip = int.parseInt(skip);
		// page.totalRows = int.parseInt(totalRows);/*数据已经更新*/
		// page.pageRows = int.parseInt(pageRows);


		page.pageRows = page.pageRows<page.totalRows ? page.pageRows : page.totalRows;
		page.skip = page.pageRows*page.currentPage
		// this.log(page)
		return page;
	}
}
