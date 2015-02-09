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

	return this;
};


Apptrack.prototype = {

	constructor: Apptrack,

	connect: middleware,

	// outputs client
	client: function(req, res){
		//
		res.end( client );
	},

	// outputs the logs
	output: function(req, res){
		//
		var data = [];
		res.end( JSON.stringify( data ) );
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