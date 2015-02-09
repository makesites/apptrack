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



exports.addToDb = function(options, callback) {
	var res = false;
	var val = options.msg;
	var db = this.db;
	db.open(function(err, db) {

			db.collection('test', function(err, collection) {
				collection.count(function(err, count) {
					console.log('Total: ' + count);
					collection.find({'count': 'hi'}, function(err, cursor) {
						cursor.each(function(err, item) {
							if(item != null) {
								console.log(item);
							} else {
								console.log('No Items Found');
							}
						});
					});

				});
				collection.insert({'count':val});
			});
	});


	callback(null, res);


};

exports.addToDb.description = "Add data to the server";
exports.addToDb.schema = {
	msg: {
		type: 'string',
		optional: false
	}
};

exports.getAllFromDb = function(options, callback) {
	var db = this.db;
	var res = [];
	db.open(function(err, db) {
		db.collection('test', function(err, collection) {
			collection.count(function(err, count) {
				console.log('Count: ' + count);
				collection.find(function(err, cursor) {
					cursor.toArray(function(err, docs) {
						docs.forEach(function(x) {
							res.push(x.count);
						});
						callback(null, res);
						if(docs != null) {
							res = docs;
							console.log(docs);
						} else {
							console.log('None');
						}
						db.close();
					});
				});

			});
		});
	});
};

exports.register = function(options, callback) {
	var db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});
	var name = options.name;
	db.open(function(err, db) {
		db.collection('domains', function(err, collection) {
			collection.insert({"name": name});
			db.close();
			console.log(options.name + ' Registered');
			callback(null, options);

		});
	});

// 	callback(null, 'Could not update the data\n');
};
exports.register.description = "Register a domain on the Server";
exports.register.schema = {
	name: {
		type: 'string',
		optional: false
	}
};


exports.trackHits = function(options, callback) {
	db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});
	db.open(function(err, db) {
		db.collection('domains', function(err, collection) {
			collection.find({"name":options.domain}, function(err, cursor) { //Getting the ID from the Domains Document
				cursor.nextObject(function(err, tuple) {
					if(tuple != null) {
					var hitCollection = 'hit_' + tuple._id; //Constructing the name of Hits document
						db.collection(hitCollection, function(err, collection) {
							collection.find({trackField:options.trackField}, function(err, cursor) {
								cursor.count(function(err, n) {
									var now = new Date();
									var trackField = options.trackField;
									if(n == 0) { //Insert
										collection.insert({trackField:trackField, count:1, 'timestamp':now.getTime()});
										console.log(options.domain + ':' + options.trackField +  ' New Insert\n');
										db.close();
									} else { //Update
										var timestamps = []
										cursor.toArray(function(err, items) {
										for(i=0;i<n;i++) {
											timestamps.push(items[i].timestamp);
										}
										var max = Math.max.apply(0, timestamps);
										if((now.getTime() - max) < TIME_SLICE) { //Update the existing value
											collection.update({timestamp:max}, {$inc: {count: 1}});
											console.log(options.domain + ':' + options.trackField +  ' Updated Existing\n');
										} else { //Insert a new row
											collection.insert({trackField:trackField, count:1, 'timestamp':now.getTime()});
											console.log(options.domain + ':' + options.trackField +  ' Inserted after Time-Slice\n');
										}
										db.close();
										});

									}

								});
							});
						});
					}
					callback(null, tuple);
				});
			});
		});
	});
};
exports.trackHits.description = "Tracks the Click Hits on Sites";
exports.trackHits.schema = {
	domain: {
		type: 'string',
		optional: false
	},
	trackField: {
		type: 'string',
		optional: false
	}
};

exports.getDomains = function(options, callback) {
 	var db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});

	db.open(function(err, db) {
		db.collection('domains', function(err, collection) {
			collection.find(function(err, cursor) {
				cursor.toArray(function(err, items) {
					db.close();
					callback(null, items);
				});
			});
		});
	});
};

exports.getDomains.description = "Returns all the domains";

exports.getHits = function(options, callback) {
	var db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});
	db.open(function(err, b) {
		db.collection('domains', function(err, collection) {
			collection.find({"name":options.domain}, function(err, cursor) { //Getting the ID from the Domains Document
				cursor.nextObject(function(err, tuple) {
					if(tuple != null) {
					var hitCollection = 'hit_' + tuple._id; //Constructing the name of Hits document
						db.collection(hitCollection, function(err, collection) {
							collection.find(function(err, cursor) {
								cursor.toArray(function(err, items) {
									callback(null, items);
									db.close();
								});
							});
						});
					}
				});
			});
		});
	});
};

exports.getHits.description = "Return the Hit data for a registered domain";
exports.getHits.schema = {
	domain: {
		type: 'string',
		optional: false
	}
};

exports.savePattern = function(options, callback) {
	var db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});
	db.open(function(err, b) {
		db.collection('domains', function(err, collection) {
			collection.find({"name":options.domain}, function(err, cursor) { //Getting the ID from the Domains Document
				cursor.nextObject(function(err, tuple) {
					if(tuple != null) {
					var patternCollection = 'pattern_' + tuple._id; //Constructing the name of Hits document
						db.collection(patternCollection, function(err, collection) {
							var now = new Date();
							collection.insert({pattern: options.pattern, timestamp: now.getTime()});
							db.close();
							console.log('Pattern Saved for: ' + options.domain);
							callback(null, options);
						});
					}
				});
			});
		});
	});

};
exports.savePattern.description = "Saves pattern of a domain along with timestamp";
exports.savePattern.schema = {
	domain: {
		type: 'string',
		optional: false
	},
	pattern: {
		type: 'string',
		optional: false
	}
};


exports.getPattern = function(options, callback) {
	var db = new Db('trackRecords', new Server(host, port, {}), {native_parser: true});
	db.open(function(err, b) {
		db.collection('domains', function(err, collection) {
			collection.find({"name":options.domain}, function(err, cursor) { //Getting the ID from the Domains Document
				cursor.nextObject(function(err, tuple) {
					if(tuple != null) {
					var patternCollection = 'pattern_' + tuple._id; //Constructing the name of Hits document
						db.collection(patternCollection, function(err, collection) {
							collection.find(function(err, cursor) {
								cursor.toArray(function(err, items) {
									callback(null, items);
									db.close();
								});
							});
						});
					}
				});
			});
		});
	});
};

exports.getPattern.description = "Return the pattern data for a registered domain";
exports.getPattern.schema = {
	domain: {
		type: 'string',
		optional: false
	}
};


setInterval(function() {
	console.log('hello');
}, 2000);


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
