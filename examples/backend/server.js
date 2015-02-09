// showcasing client-side tracking

var Apptrack = require("../../index"), // in production: require("apptrack")
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
			case "/one":
				// track this request
				apptrack.log("action_1", { path: "/one" });
				//
				res.writeHead(307, {'Location': "/" });
				res.end();
			break;
			case "/two":
				// track this request
				apptrack.log("action_2", { path: "/two" });
				///
				res.writeHead(307, {'Location': "/" });
				res.end();
			break;
			case "/three":
				// track this request
				apptrack.log("action_3", { path: "/three" });
				///
				res.writeHead(307, {'Location': "/" });
				res.end();
			break;
			case "/four":
				// track this request
				apptrack.log("action_4", { path: "/four" });
				///
				res.writeHead(307, {'Location': "/" });
				res.end();
			break;

		}
	});


// Helper



http.createServer(app).listen(8080);
