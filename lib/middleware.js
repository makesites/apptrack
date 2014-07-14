// A Connect middleware for reading request info

var middleware = function(){

	var options = this.options;
	var db = this.store;
	var data = this.data;

	return function(){ req, res, next ){
		// save header info in data set
	}
};

module.exports = middleware;