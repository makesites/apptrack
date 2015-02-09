/**
 * Apptrack Store
 * - connecting lib with persistent storage
**/

// Dependencies
var uuid = require("node-uuid");

// Class
var Store = function( options ){

	// pick the right store based on the options
	var Store = (typeof options.store == "string") ? require("../stores/"+ options.store ) : options.store;
	this.store = new Store( options );

}

Store.prototype = {

	constructor: Store,

	create: function( data, callback ){
		this.store.create( data, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	read: function( query, callback ){
		this.store.read( query, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	destroy: function( item, callback ){
		this.store.destroy( item, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},
	// searches through the data for results
	query: function( query, callback ){
		this.store.query( query, function( err, result ){
			if( err ) return callback( err );
			// error control?
			callback( null, result );
		});
	},

	createID: function(){
		// check if there's a custom method passed...
		return uuid.v4();
	}
}

// Export
module.exports = Store;