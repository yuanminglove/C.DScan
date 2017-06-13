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
	}
}
