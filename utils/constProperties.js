module.exports = {
	"uploadDir" : "./public/upload",
	"maxFieldsSize" : 5 * 1024 * 1024,
	"mongooseConnection" : "mongodb://localhost/CDScan",
	"adaroOptions" : {
		helpers: [
			'dustjs-helpers',   //So do installed modules 
			'./utils/dustFilter'   //Relative path to your custom helpers works
		],
		cache: false
	},
	"ipSchema" : /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
	"urlSchema" : /^([a-zA-z]+)?[:/]*([a-zA-z0-9\.-]+)\:?(\d+)?([^?]+)?\??([a-zA-Z0-9\/%&\-=_]+)*#?([a-zA-Z0-9]+)?/
}
