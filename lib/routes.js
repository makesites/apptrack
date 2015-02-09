/**
 * Apptrack Routes
 * - checks if the request is in the list of accepted routes
**/

var _ = require("underscore");

var Routes = function( options ){

	options = options || {};

	// class options
	this.options = {
		routes: options.routes,
		host: options.host,
		domains: options.domains
	}

}

Routes.prototype = {

	constructor: Routes,
/*
	valid: function( req, res ){
		// get host and path (error control?)
		var host = req.hostname || req._parsedUrl.host || req.host || false; // supporting in order : express >v4, connect, express <v4 ...
		var path = req.path || req._parsedUrl.pathname || false;
		var isRoot = (path == "/");

		if( this.options.host ){
			var valid_host = ( this.options.host.indexOf( host ) > -1 );
			// no need to proceed further
			if( !valid_host ) return false;
		}

		// check api first (as it is a more common occurance)
		if( this.options.api && !isRoot ){
			var valid_api = this.isAPI(req, res);
			// found an api endpoint we're good...
			if( valid_api ) return true;
		}

		// check auth endpoints
		if( this.options.routes ){
			// fast-forward if this is the root
			if( isRoot ) return false;
			// secondly, check the endpoints
			for( var i in this.options.routes ){
				var uri = this.options.routes[i];
				var valid_route = ( uri.indexOf( path ) > -1 );
				// on the first valid endpoint, exit
				if( valid_route ) return true;
			}
			// no valid route found
			return false;
		}
		// all test passed...
		return true;
	},
*/
	// returns the key of the current route
	key: function( req, res ){
		var path = req.path || req._parsedUrl.pathname || false,
			key = false;

		for( var i in this.options.routes ){
			var route = this.options.routes[i];
			// on the first valid endpoint, exit
			if( path == route ){
				key = i;
				break;
			}
		}

		return key;
	},
/*
	isAPI: function( req, res ){
		// prerequisite
		if( !this.options.api ) return false;
		var path = req.path || req._parsedUrl.pathname || false;
		return ( path.indexOf( this.options.api ) > -1 );
	}
*/
}


module.exports = Routes;
