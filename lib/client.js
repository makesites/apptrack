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
		routes: {
			input: "{{INPUT_ROUTE}}"
		},
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
		if(!action) return console.log("action required");
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
		// sync data interval
		this.interval = setInterval(this.sync.bind(this), this.options.interval * 1000);
	};

	Apptrack.prototype = {
		constructor: Apptrack,

		options: {},

		log: function(action, data){
			// prerequisite
			if( !this.store ) return console.log("there is no available store");

			// create a new data
			var key = "apptrack_"+ generateUid();
			var value = {
				action: action,
				data: data
			};
			// save the data locally
			this.store.set(key, JSON.stringify( value ) );
		},

		// Syncing method
		sync: function(){
			// prerequisites
			// - need to be online
			var online = navigator.onLine;
			if( !online ) return;
			// - also consider network activity?
			var self = this;
			// gather all the data
			var logs = this.store.all("apptrack_");
			// convert to array
			var data = [];
			for( var i in logs ){
				data.push( logs[i] );
			}
			// end now if we have no data to sync
			if( !data.length ) return;
			// send the data to the server
			ajax( this.options.routes.input, { method: "POST", data: JSON.stringify(data) }, function( response ){
				// stop if there is no real product
				if( response.error ) return; // try again with the same data later?
				// delete local data
				for( var i in logs ){
					self.store.remove(i);
				}
			});


		}
	};



	// Helpers

	// - Stores
	var stores = {

		sessionStorage : {
			get : function( name ) {
				var value = sessionStorage.getItem( name );
				return JSON.parse(value);
			},
			set : function( name, val ){
				// validation
				if( typeof val !== "string") val = JSON.stringify( val );
				return sessionStorage.setItem( name, val );
			},
			check: function( name ){
				return ( sessionStorage.getItem( name ) == null );
			},
			remove: function( name ){
				return sessionStorage.removeItem( name );
			},
			all: function( prefix ){
				var data = {};
				for ( var i = 0, len = sessionStorage.length; i < len; ++i ) {
					var key = sessionStorage.key( i );
					if( prefix && key.search( prefix ) !== 0 ) continue;
					var value = sessionStorage.getItem( key );
					//data.push( JSON.parse(value) );
					data[key] = JSON.parse(value);
				}
				return data;
			}
		},

		localStorage : {
			get : function( name ) {
				var value = localStorage.getItem( name );
				return JSON.parse(value);
			},
			set : function( name, val ){
				// validation
				if( typeof val !== "string") val = JSON.stringify( val );
				return localStorage.setItem( name, val );
			},
			check : function( name ){
				return ( localStorage.getItem( name ) == null );
			},
			remove: function( name ){
				return localStorage.removeItem( name );
			},
			all: function( prefix ){
				var data = {};
				for ( var i = 0, len = localStorage.length; i < len; ++i ) {
					var key = localStorage.key( i );
					if( prefix && key.search( prefix ) !== 0 ) continue;
					var value = localStorage.getItem( key );
					//data.push( JSON.parse(value) );
					data[key] = JSON.parse(value);
				}
				return data;
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
						return JSON.parse( unescape(value) );
					}
				}
			},

			set : function( name, val ){
				// automatically expire session in a day
				var expiry = 86400000;
				var date = new Date( ( new Date() ).getTime() + parseInt(expiry) );
				if( typeof val !== "string") val = JSON.stringify( val );
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

			remove: function( name ) {
				document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			},

			all: function( prefix ){
				var data = {};
				var cookies=document.cookie.split(";");
				for (i=0;i<cookies.length;i++){
					var key=cookies[i].substr(0,cookies[i].indexOf("="));
					var value=cookies[i].substr(cookies[i].indexOf("=")+1);
					// FIX
					key=key.replace(/^\s+|\s+$/g,"");
					if( prefix && key.search( prefix ) !== 0 ) continue;
					//data.push( unescape(value) );
					data[key] = JSON.parse( unescape(value) );
				}
				return data;
			}
		},


	}


	// - Initiate an AJAX request
	function ajax( url, options, callback ){
		options = options || {
			method: "GET",
			data: false
		};
		//console.log( url );

		var req = new XMLHttpRequest();
		var self = this;
		var data = options.data;

		//
		if( options.method == 'GET' && data && typeof data !== 'undefined' && data !== null) url = url+'?'+data;

		req.open( options.method ,url, true);
		if (options.method == 'POST'){
			//req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			req.setRequestHeader("Content-type", "application/json");
			req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		req.send( ( data || null ) );

		req.onerror = function(){
			console.log("there was an error with your request");
		};
		req.onload = function(e){
			// graceful parsing
			try{
				var response = JSON.parse(e.target.responseText);
				callback.call(self, response);
			} catch( e ){
				if( console ) console.log( e );
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
