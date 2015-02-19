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
		switch( path ){
			case "client":
				self.client(req, res);
			break;
			case "input":
				self.input(req, res);
			break;
			case "output":
				self.output(req, res);
			break;
			default:
				next();
			break;
		}
	}
};

module.exports = middleware;