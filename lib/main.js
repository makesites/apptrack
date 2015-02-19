var _ = require("underscore"),
	defaults = require("../config/default"),
	fs = require("fs"),
	middleware = require("./middleware"),
	utils = require("./utils"),
	// main methods
	Log = require('./log'),
	Routes = require('./routes'),
	Store = require('./store');

// client-side javascript
var client = fs.readFileSync( __dirname +"/client.js", "utf8");

var Apptrack = function( options ){
	// fallbacks
	options = options || {};
	// merge options with defaults
	this.options = utils.extend({}, defaults, options);
	// prerequisites
	//if( !store ) return false;
	// init main methods using the same options...
	this.log = new Log( this.options );
	this.routes = new Routes( this.options );
	this.store = new Store( this.options );
	// bind methods to lib
	_.bindAll(this, 'log');

	return this;
};


Apptrack.prototype = {

	constructor: Apptrack,

	connect: middleware,

	// outputs client
	client: function(req, res){
		// get client file
		var script = client;
		// update variables
		script = script
					.replace("{{INPUT_ROUTE}}", this.options.routes.input)
					.replace("{{HOST}}", this.options.host);
		// remove whitespace
		//script = script.replace(/(\r\n|\n|\r|\t)/gm,"").replace(/\s+/gm, " ");
		// compress??
		// MIME type
		if( res.header ) res.header("Content-Type", "application/json");
		res.end( script );
	},

	// getting data from client
	input: function( req, res ){
		var data = req.body; // or req.query?
		if( !data ) return res.end(); // is there a bodyParser?
		this.log( data );
		return res.end("1"); // wait for data to be saved?
	},

	// outputs the logs
	output: function(req, res){
		//
		var data = this.store.read(null, function( err, data ){
			// error control?
			res.end( JSON.stringify( data ) );
		});

	},

	// check a referer against the domains:
	valid: function( url ){
		var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
		var domain = matches && matches[1];  // domain will be null if no match is found
		return ( domain == this.options.host || this.options.domains.indexOf(domain) > -1 );
	}

};


// export

module.exports = function( options ){

	var lib = new Apptrack( options );
	return lib;

};



/*
var TIME_SLICE = 10000;


exports.echo.schema = {
  msg: {
    type: 'string',
    optional: false
  }
};

*/