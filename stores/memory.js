/**
 * Store: Memory
 * - Saving data using the memory
 * Note: Highly inefficient & unreliable - do NOT use in production
**/

var CRUD = function( options ){

	// use the built-in methods
	this.db = db;

}

CRUD.prototype = {

	constructor: CRUD,

	create: function( data, callback ){
		this.db.create( data, callback );
	},

	read: function(query, callback){
		this.db.read( query, callback );
	},

	destroy: function(item, callback){
		this.db.destroy( item, callback );
	}
}

// Helpers
var data = {};

var db = {

	create: function( item, callback ){
		var key = item.id || false;
		if( !key ) return callback(null, false);
		// check if the item exists first?
		data[key] = item;
		return callback(null, true);
	},

	read: function( query, callback ){
		query = query || {};
		var key = query.id || "*";
		// return all
		if( key == "*" ) return callback(null, data);
		var value = query[key];
		// return specific
		if( data[key] ) return callback(null, data[key]);
		return callback(null, false);
	},

	destroy: function( item, callback ){
		var key = item.id || false;
		if( !key ) return callback(null, false);
		delete data[key];
		// assume only one item for every key
		return callback(null, true);
	},

	query: function( query, callback ){
		// loop through the stored data
		for( var i in data ){
			// try to match supplied data
			var valid = false;
			for(var j in query){
				// stop the lop if we found one inconsistency
				if( data[i][j] != query[j] ){
					valid = false;
					break;
				}
				valid = true;
			}
			// if all conditions are met...
			if( valid ) return callback(null, data[i]);
		}
		return callback(null, false);
	}

}


module.exports = CRUD;
