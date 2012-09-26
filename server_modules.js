//MongoDB 
var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server,
  BSON = require('mongodb').BSONNative;

var TIME_SLICE = 10000;



var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
console.log('Host: ' + host);
console.log('Port: ' + port);

//Webservice
this.title = "These are Server Modules";
this.name = "ServM";
this.version = "0.1";
this.endpoint = "http://localhost:8080";



exports.echo = function(options, callback) {
  var res = [];

  res[0] = {
    "a" : "hello",
    "b" : "hi"
  };

  res[1] = {
    "a" : "how",
    "b" : "are"
  };

  var testJSON = {
    "a" : "hello",
    "b" : "hi"
  };

  callback(null, options);
}

exports.echo.description = "Echos your message back";
exports.echo.schema = {
  msg: {
    type: 'string',
    optional: false
  }
};

exports.addToDb = function(options, callback) {
	var res = false;
	var val = options.msg;
	var db = new Db('testMongo', new Server(host, port, {}, {native_parser: true}));
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
	var db = new Db('testMongo', new Server(host, port, {}), {native_parser: true});
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


/*setInterval(function() {
	console.log('hello');
}, 2000);*/