/**
 * Store: Mongo
 * - Saving data using MongoDB
**/


var CRUD = function( options ){

	// use the provided db (error control?)
	this.db = options.db;

}

CRUD.prototype = {

	constructor: CRUD,

	create: function( data, callback ){
		// fallbacks
		data = data || {};
		var key = data._id || false;
		if( !key ) return callback(null, false);
		var expires = (data.expires_in) ? parseInt(data.expires_in) : 86400000; // default one day...
		// if refresh_token, add 60 days...
		if( data.refresh_token) expires += (60 * 86400000); // plus 60 days for refresh_token
		// stringify data
		data = JSON.stringify(data);
		// connect to db
		this.db.insertOne( data, function(err, result){
			if(err) return callback(err);
			// error control?
			return callback( null, true );
		});
	},

	read: function( query, callback ){
		var key = query._id || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.findOne({ _id: key }, function(err, data){
			if(err) return callback(err);
			// parse data into an object
			data = JSON.parse( data.toString() );
			callback( null, data );
		});
	},

	destroy: function( item, callback ){
		var key = item._id || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.deleteOne({ _id: key }, function(err, data){
			if(err) return callback(err);
			callback( null, true );
		});
	},
	// FIX THIS: query not implemented for mongo yet...
	query: function( query, callback ){
		var key = query._id || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.find({ _id: key }, function(err, data){
			if(err) return callback(err);
			// parse data into an object
			data = JSON.parse( data.toString() );
			callback( null, data );
		});
	}
}

// Helpers



module.exports = CRUD;
