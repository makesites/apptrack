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
		// save store reference (one once?)
		self.store = this.store;
		// identify if we are saving one action or many
		if( arguments.length == 1 && arguments[0] instanceof Array){
			var list = arguments[0];
			for( var i in list ){
				// assume the right structure?
				var action = list[i].action;
				var data = list[i].data;
				// error control?
				var log = self.create(action, data);
				self.save(log);
			}
		} else if(arguments.length == 2){
			var action = arguments[0];
			var data = arguments[1];
			var log = self.create(action, data);
			self.save(log); // callback?
		} else {
			// do nothing?
		}
	};
}

Log.prototype = {

	constructor: Log,

	// create a new log
	create: function( action, data ){
		// add header info and session info
		return {
			id: uuid.v4(),
			action: action,
			meta: data,
			//header
			//session
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