
var crypto = require("crypto");
	//fs = require("fs"),
	//path = require("path");

// params
var algorithm = 'aes-256-ctr';

// Helpers
var utils = {

	// deep extend, multi-object
	extend: function() {
		var objects = Array.prototype.slice.call(arguments);
		var destination = objects.shift();
		//
		for( var num in objects){
			var source = objects[num];
			for (var property in source) {
				if (source[property] && source[property].constructor && source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}
		return destination;
	},

	// encode data (with CTR)
	encode: function( data, seed ) {
		// fallbacks
		seed = seed || "secret";
		// variables
		var input = ( typeof data == "object") ? JSON.stringify( data ) : data; // convert to text
		var cipher = crypto.createCipher(algorithm, seed.toString() );
		var output = cipher.update(input,'utf8','hex');
		output += cipher.final('hex');
		return output;
	},

	// decode data
	decode: function( data, seed ){
		// fallbacks
		seed = seed || "secret";
		// variables
		var input = data; // validate?
		var decipher = crypto.createDecipher(algorithm, seed.toString() );
		var output = decipher.update(input,'hex','utf8')
		output += decipher.final('utf8');
		return output;
	},

}

// private methods



module.exports = utils;
