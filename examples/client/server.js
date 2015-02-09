// showcasing server-side tracking

var Apptrack = require("../../index"), // in production: require("apptrack")
	bodyParser = require('body-parser'),
	connect = require('connect'),
	fs = require("fs"),
	path = require("path"),
	querystring = require('querystring'),
	http = require('http');

var options = {
	routes: {
		output: "/logs"
	}
};

var apptrack = new Apptrack( options );

// APP
var app = connect()
	// parse application/x-www-form-urlencoded
	.use(bodyParser.urlencoded({ extended: false }))
	// parse application/json
	.use(bodyParser.json())
	.use(
		apptrack.connect( options ) // initialize middleware
	)
	.use(function(req, res){
		// simple router
		var uri = req._parsedUrl.pathname;

		switch( uri ){
			case "/":
				var html = fs.readFileSync( path.normalize( __dirname +"/views/index.html"), "utf8");
				//
				res.end( html );
			break;
			/* maybe an html layout for the logs?
			case "/logs":
				var html = fs.readFileSync( path.normalize( __dirname +"/views/logs.html"), "utf8");
				//var params = querystring.parse( req._parsedUrl.query );
				//console.log( "params", params );
				// send request
				res.end( html );
			break;
			*/
		}
	});


// Helper

function authority( data, callback ){

	console.log( "authorize data", data );

	for(var key in data){
		// key can be: client_id, client_secret, username, password
		// validate data here...
	}
	return callback(true);

}


http.createServer(app).listen(8080);
