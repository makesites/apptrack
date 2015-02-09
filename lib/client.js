/*
 * Apptrack Client
 */

(function (lib) {

	//"use strict";

	// Support module loaders
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define("apptrack", lib);
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		lib();
	}

}(function () {

	var apptrack, _at;

	var defaults = {
		host: "",
		persist: true,
		interval: 60 // number of seconds between each sync
	}

	// Public API

	// Main init
	// ex: window.at( options );
	apptrack = function( options ){
		_at = new Apptrack( options );
	}
	// Tracking method
	// ex: window.at.log( action, data );
	apptrack.log = function( action, data ){
		if( !_at ) return console.log("Apptrack didn't initiate");
		_at.log( action, data );
	};

	// Syncing method
	// trigger manually when needed
	apptrack.sync = function( action, data ){
		if( !_at ) return console.log("Apptrack didn't initiate");
		_at.sync( action, data );
	};

	// Class

	var Apptrack = function( options ){
		options = options || {};
		// save options
		this.options = extend({}, defaults, options);
		// pick store

		// pick a persistance solution
		if( !this.options.persist && typeof sessionStorage != "undefined" && sessionStorage !== null ){
			// choose localStorage
			this.store = stores.sessionStorage;
		} else if( this.options.persist && typeof localStorage != "undefined" && localStorage !== null ){
			// choose localStorage
			this.store = stores.localStorage;
		} else {
			// otherwise we need to store data in a cookie
			this.store = stores.cookie;
		}
	};

	Apptrack.prototype = {
		constructor: Apptrack,

		options: {},

		log: function(){
			// prerequisite
			if( !this.store ) console.log("there is no ");

			// save the data locally
			console.log( this.options, this );
			//this.store.set("session", JSON.stringify( this.toJSON() ) );
		},

		// Syncing method
		sync: function(){
			// gather all the data

			// send the data to the server

			ajax( url + "order/verify/"+ user.code +"?"+ query, function( response ){
				// stop if there is no real product
				var verified = ( response.order ) ? true : false;
				callback( verified );
			});

			// delete local data

		}
	};



	// Helpers

	// - Stores
	var stores = {

		sessionStorage : {
			get : function( name ) {
				return sessionStorage.getItem( name );
			},
			set : function( name, val ){
				// validation first?
				return sessionStorage.setItem( name, val );
			},
			check : function( name ){
				return ( sessionStorage.getItem( name ) == null );
			},
			clear: function( name ){
				// actually just removing the session...
				return sessionStorage.removeItem( name );
			}
		},

		localStorage : {
			get : function( name ) {
				return localStorage.getItem( name );
			},
			set : function( name, val ){
				// validation first?
				return localStorage.setItem( name, val );
			},
			check : function( name ){
				return ( localStorage.getItem( name ) == null );
			},
			clear: function( name ){
				// actually just removing the session...
				return localStorage.removeItem( name );
			}
		},

		cookie : {
			get : function( name ) {
				var i,key,value,cookies=document.cookie.split(";");
				for (i=0;i<cookies.length;i++){
					key=cookies[i].substr(0,cookies[i].indexOf("="));
					value=cookies[i].substr(cookies[i].indexOf("=")+1);
					key=key.replace(/^\s+|\s+$/g,"");
					if (key==name){
						return unescape(value);
					}
				}
			},

			set : function( name, val ){
				// automatically expire session in a day
				var expiry = 86400000;
				var date = new Date( ( new Date() ).getTime() + parseInt(expiry) );
				var value=escape(val) + ((expiry==null) ? "" : "; expires="+date.toUTCString());
				document.cookie=name + "=" + value;
			},

			check : function( name ){
				var cookie=this.get( name );
				if (cookie!=null && cookie!=""){
					return true;
				} else {
					return false;
				}
			},

			clear: function( name ) {
				document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			}
		},


	}


	// - Initiate an AJAX request
	function ajax( url, callback ){

		//console.log( url );

		var req = new XMLHttpRequest();
		var self = this;

		req.open("GET",url,true);
		req.send(null);
		req.onerror = function(){
			console.log("there was an error with your request");
		};
		req.onload = function(e){
			// graceful parsing
			try{
				var response = JSON.parse(e.target.responseText);
				callback.call(self, response);
			} catch( e ){
				if( DEBUG && console ) console.log( e );
				callback.call(self, false);
			}
		}

	}

	// - Creates a unique id for identification purposes
	function generateUid(separator) {

		var delim = separator || "-";

		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}

		return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
	}

	// - Deep extend, multi object
	function extend() {
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
	}


	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		// update global namespace
		window.apptrack = apptrack;
		// shortcut
		if(!window.at) window.at = apptrack;
	}

	// for module loaders:
	return apptrack;


}));
