// A Connect middleware for reading request info

var middleware = function(){

	var self = this,
		options = this.options,
		db = this.store;

	return function( req, res, next ){
		// monitor routes
		var path = self.routes.key( req, res );
		if( !path ) return next();
		// output client javascript
		if( path == "client" ){
			self.client(req, res);
		}
		if( path == "input" ){
			self.input(req, res);
		}
		if( path == "output" ){
			self.output(req, res);
		}
		next();
	}
};

module.exports = middleware;