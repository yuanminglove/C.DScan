module.exports = function (dust) {
    // Add helpers and filters
    dust.helpers.substr = function (chunk, context, bodies, params) {
            var len = parseInt(dust.helpers.tap(params.len, chunk, context)),
                start = parseInt(dust.helpers.tap(params.start, chunk, context)),
                data = dust.helpers.tap(params.data, chunk, context);
            if (data.length < (len + start)) {
                return chunk.write(data.substr(start));
            } else {
                return chunk.write(data.substr(start, len) + "...");
            }
    },
    /**
    * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    */
    dust.helpers.formatTime = function (chunk, context, bodies, params) {
        var fmt = dust.helpers.tap(params.formatString, chunk, context);
        var time = new Date(dust.helpers.tap(params.data, chunk, context)-1);
        var o = {
            "M+": time.getMonth() + 1, //月份 
            "d+": time.getDate(), //日 
            "H+": time.getHours(), //小时 
            "m+": time.getMinutes(), //分 
            "s+": time.getSeconds(), //秒 
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
            "s+": time.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o){
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return chunk.write(fmt);
    }
    //   dust.helpers.page = function(chunk, context, bodies, params) {
    //   	console.log("dust.helpers.page")
    //   	var pageObj = dust.helpers.tap(params.pageObj, chunk, context);
    //   	console.log(typeof pageObj)
    //   	console.log(pageObj)

    //   	var result = '<div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group">';

    // for(var i=0; i<pageObj.hideData.length; i++){
    // 	result += '<input type="hidden" name='+pageObj.hideData[i].name+' value='+pageObj.hideData[i].value+' />'
    // }
    // console.log(result)

    // var totalPage = Math.ceil(pageObj.totalRows/pageObj.pageRows);
    // var begin = 0;
    // var end = totalPage;
    // console.log(result)

    // if(totalPage>6){
    // 	begin = (pageObj.currentPage-3)>0 ? pageObj.currentPage : 0;
    // 	end = (pageObj.currentPage+3)<totalPage ? pageObj.currentPage : totalPage;
    // }
    // console.log(result)

    // for(;begin<end; begin++){
    // 	result += '<button href="#" type="button" class="btn btn-default">'+begin+'</button>';
    // }
    // console.log(result)

    // result += '<input type="hidden" name="pageRows" value='+pageObj.pageRows+' />';
    // result += '</div>';
    // console.log(result)
    // return chunk.write("result");		
    //   }
    dust.helpers.period = function (chunk, context, bodies, params) {
        /*  {@period location="end"}
        	  Hello World
        	{/period}
        	{!-- outputs "Hello World." --!}

        	{@period location="start"}
        	  Hello World
        	{/period}
        	{!-- outputs ".Hello World" --!}*/
        var location = params.location,
            body = bodies.block;
        if (location === 'start') {
            chunk.write('.');
            chunk.render(body, context);
        } else if (location === 'end') {
            chunk.render(body, context);
            chunk.write('.');
        } else {
            dust.log('WARN', 'missing parameter "location" in period helper');
        }
        return chunk;
    };
};
