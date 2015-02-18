/**
 * Store: SimpleDB
 * - Saving data using SimpleDB
**/

//var uuid = require("node-uuid"),

var CRUD = function( options ){

	// use the provided db (error control?)
	this.db = options.db;
	this.table = this.table || options.table || false;
	// continue with parent (if available)
}

CRUD.prototype = {

	constructor: CRUD,

	create: function( data, callback ){
		// fallbacks
		data = data || {};
		callback = callback || function(){};
		// variables
		var self = this;

		var attributes = this.attributes( data );

		this.db.call("PutAttributes", attributes, function( err, result ){
			if (err) return callback(err);
			var response = self.parse( result );
			// error control
			callback( null, response );
		});
	},

	read: function( data, callback, options ) {
		// fallbacks
		options = options || {};
		callback = callback || function(){};
		// variables
		var self = this;
		var query = "select * from "+ this.table;
		if( data ){
			query += " where "+ this.query( data, options );
		}

		this.db.call("Select", { SelectExpression: query }, function(err, result) {
			if (err) return callback(err);
			var response = self.parse( result["SelectResult"] );
			// convert to an array if returning a single object (for no id)
			//if ( response && (typeof data.id == "undefined") && !(response instanceof Array) ){
			//	response = [response];
			//}
			callback( null, response );
		});

	},

	update: function( data, callback ) {
		// fallback for no callback
		callback = callback || function(){};
		// variables
		var self = this;
		// don't execute with no specified id...
		if( typeof data.id == "undefined" ) return callback({ error: "No object id specified" });

		var attributes = this.attributes( data, { replace : true });

		this.db.call("PutAttributes", attributes, function( err, result ){
			if (err) return callback(err);
			var response = self.parse( result );
			// error control
			callback( null, response );
		});

	},

	destroy: function( data, callback, options ) {
		// fallbacks
		options = options || {};
		callback = callback || function(){};
		// variables
		var self = this;
		// don't execute with no specified id...
		if( typeof data.id == "undefined" ) return callback({ error: "No object id specified" });

		var attributes = this.attributes( data, { noAttr: true } );

		this.db.call("DeleteAttributes", attributes, function( err, result ){
			if (err) return callback(err);
			var response = self.parse( result );
			// error control
			//...
			// return a standard success response
			callback( null, { success: true });
		});

	},

	query: function( data, options ){
		// fallbacks
		options = options || {};
		var str = "";

		//if(typeof data === "string") return data;

		var first = true;

		for( var key in data ){
			if( !first ) str += " and ";
			var exp = "";
			// conditions
			if( key == "$or" || key == "$and" ){
				var length = data[key].length;
				for(var num in data[key]){
					var condition = data[key][num];
					// loop...
					exp += "("+ this.query( condition ) +")";
					if( num < length-1 ) exp += ( key == "$or" ) ? " or " : " and ";
				}
				str += "("+ exp +")";
			} else {
				exp = "`{{field}}`='{{value}}'";
				//
				var field = key;
				var value = data[key];
				// check the key
				var like = ( key.search(/\./) > -1 ) ?  true : false ;
				// if looking into the object...
				if(like){
					exp = "`{{field}}` like '%{{value}}%'";
					var field = key.split(".");
					field = field[0];
				}
				// operators
				if(data[key] && data[key].$gt){
					exp = "`{{field}}` > '{{value}}'";
					value = data[key].$gt;
				}
				if(data[key] && data[key].$lt){
					exp = "`{{field}}` < '{{value}}'";
					value = data[key].$lt;
				}

				if( typeof value == "object") value = JSON.stringify(value);
				str += exp.replace("{{field}}", field).replace("{{value}}", value);
			}

			//
			first = false;
		}

		if( options.limit ){
			str += " limit "+ options.limit;
		}

		return str;

	},

	// Helpers

	attributes: function(model, options){
		//default options
		options = options || {};
		options.replace = options.replace || false;
		options.noAttr = options.noAttr || false;

		var query = {};
		var count = 0;

		// create id if not defined
		//if( typeof model.id == "undefined" ) model.id = uuid.v1();

		query.DomainName = this.table;
		query.ItemName = model.id;
		// if we don't require any attributes end now
		if(options.noAttr) return query;

		// deal with attributes
		for( var key in model ){
			//if( key == "id" ) continue;
			var item = new Array()
			query["Attribute."+ count +".Name"] = key;
			query["Attribute."+ count +".Value"] = ( typeof model[key] != "object") ? model[key] : JSON.stringify(model[key]);
			if(options.replace) query["Attribute."+ count +".Replace"] = true;
			count++;
		}

		return query;
	},

	parse: function( data ) {

		// return empty if there are no results
		if( typeof data["Item"] == "undefined"){
			return false;
		}

		if( data["Item"] instanceof Array ){

			// deconstruct the response to an array
			var collection = [];

			for( i in data["Item"] ){

				var model = {};
				var attr = data["Item"][i]["Attribute"];
				//var attr = data["Item"][i];

				// parse as independent attributes
				var key = "";
				for( k in attr ){

					try{
						model[attr[k]["Name"]] = JSON.parse( attr[k]["Value"] );
					} catch(err) {
						// output err.message ?
						model[attr[k]["Name"]] = attr[k]["Value"];
					}

				}
				// ovewrite any model id present with the Attribute Name
				model.id  = data["Item"][i]["Name"];
				// filter model
				model = this.filter( model );
				//
				collection.push(model);

			}

		} else {

			var model = {};
			var attr = data["Item"]["Attribute"];

			if( attr instanceof Array ){
				for (var i in attr) {
					try{
						model[attr[i]["Name"]] = JSON.parse( attr[i]["Value"] );
					} catch(err) {
						// output err.message ?
						model[attr[i]["Name"]] = attr[i]["Value"];
					}
				}
			} else {
				// this is only one item
				model[attr["Name"]] = attr["Value"];
			}

			// ovewrite any model id present with the Attribute Name
			model.id  = data["Item"]["Name"];
			// filter model
			model = this.filter( model );
		}

		// check if we have a model or collection returned
		return collection || model;

	}

}

// Helpers



module.exports = CRUD;
