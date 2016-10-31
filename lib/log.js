/**
 * Apptrack Log
 * - Generate a new log entry
**/

var uuid = require("node-uuid");

var Log = function( options ){

	options = options || {};

	var self = this;

	// class options
	this.options = {
	}

	return function(){
		// save store reference (only once?)
		self.store = this.store;
		// identify if we are saving one action or many
		if( arguments.length == 1 && arguments[0] instanceof Array ){
			// multiple objects
			var list = arguments[0];
			for( var i in list ){
				var item = list[i];
				// assume the right structure?
				var action = item.action;
				var params = item.params;
				var headers = item.headers || item.header || null; // backwards compatible with 'header' (<=0.6.0)
				var session = item.session || null;
				// error control?
				var log = self.create(action, params, headers, session );
				if( log ) self.save(log);
			}
		} else if( arguments.length == 1 && arguments[0] instanceof Object ){
			// one object...
			var item = arguments[0];
			var action = item.action;
			var params = item.params;
			var headers = item.headers || item.header || null; // backwards compatible with 'header' (<=0.6.0)
			var session = item.session || null;
			// log
			var log = self.create(action, params, headers, session );
			if( log ) self.save(log);
		} else if(arguments.length >= 2){
			var action = arguments[0];
			var params = arguments[1];
			var headers = arguments[2] || null;
			var session = arguments[3] || null;
			var log = self.create(action, params, headers, session );
			if( log ) self.save(log); // callback?
		} else {
			// do nothing?
		}
	};
}

Log.prototype = {

	constructor: Log,

	// create a new log
	create: function( action, params, headers, session ){
		/// prerequisites
		if( !action || !params ) return false;
		// fallbacks
		headers = headers || null;
		session = session || null;
		// add header info and session info
		return {
			id: uuid.v4(),
			action: action,
			params: params,
			headers: headers,
			session: session,
			timestamp: (new Date()).getTime()
		}

	},

	// save the log to the store
	save: function( log ){
		// check if the data is an array first?
		this.store.create(log);
	}
}



module.exports = Log;
