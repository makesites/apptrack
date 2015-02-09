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
		var key = data.access_token || data.code || false;
		if( !key ) return callback(null, false);
		var expires = (data.expires_in) ? parseInt(data.expires_in) : 86400000; // default one day...
		// if refresh_token, add 60 days...
		if( data.refresh_token) expires += (60 * 86400000); // plus 60 days for refresh_token
		// convert ttl to seconds
		var ttl = Math.floor( expires / 1000 );
		// stringify data
		data = JSON.stringify(data);
		// connect to db
		this.db.setex( key, ttl, data, function(err, result){
			if(err) return callback(err);
			// error control?
			return callback( null, true );
		});
	},

	read: function( query, callback ){
		var key = query.access_token || query.code || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.get( key, function(err, data){
			if(err) return callback(err);
			// parse data into an object
			data = JSON.parse( data.toString() );
			callback( null, data );
		});
	},

	destroy: function( item, callback ){
		var key = item.access_token || item.code || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.del( key, function(err, data){
			if(err) return callback(err);
			callback( null, true );
		});
	},
	// FIX THIS: query not implemented for redis yet...
	query: function( query, callback ){
		var key = query.access_token || query.code || false;
		if( !key ) return callback(null, false);
		// connect to db
		this.db.get( key, function(err, data){
			if(err) return callback(err);
			// parse data into an object
			data = JSON.parse( data.toString() );
			callback( null, data );
		});
	}
}


module.exports = CRUD;



/* DO NOT USE -*/
/* This store needs revamping */
/*
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	model = {};

//
// Schemas definitions
//
var OAuthAccessTokensSchema = new Schema({
	accessToken: { type: String },
	clientId: { type: String },
	userId: { type: String },
	expires: { type: Date }
});

var OAuthRefreshTokensSchema = new Schema({
	refreshToken: { type: String },
	clientId: { type: String },
	userId: { type: String },
	expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
	clientId: { type: String },
	clientSecret: { type: String },
	redirectUri: { type: String }
});

var OAuthUsersSchema = new Schema({
	username: { type: String },
	password: { type: String },
	firstname: { type: String },
	lastname: { type: String },
	email: { type: String, default: '' }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
	OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
	OAuthClientsModel = mongoose.model('OAuthClients'),
	OAuthUsersModel = mongoose.model('OAuthUsers');

//
// node-oauth2-server callbacks
//
model.getAccessToken = function (bearerToken, callback) {
	console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

};

model.getClient = function (clientId, clientSecret, callback) {
	console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

;

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
var authorizedClientIds = ['s6BhdRkqt3', 'toto'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
	console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

	if (grantType === 'password') {
		return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
	}

	callback(false, true);
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
	console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

	var accessToken = new OAuthAccessTokensModel({
		accessToken: token,
		clientId: clientId,
		userId: userId,
		expires: expires
	});

	accessToken.save(callback);
};

*/

module.exports = model;