# Apptrack

Tracking your app from the client and the server while creating analytics you own...


## Features

* Asynchronous data gathering
* Client-side integration

## Dependencies

** Node Modules **
* Connect
* Webservice.js
		"async": "0.9.0",
		"connect": "~3.0.x",
		"underscore": "1.6.0"

{
	id:
	headers: { referrer: "", host: "" }
	action: ""
	data: ""
}
## Setup

Steps to use:

Step 1: Initiate your DB

Step 2: node server.js

Step 3: Register a domain by using registration.html

Step 4: To track any of the event include track.js as source of JavaScript in the HTML page and call the function track with input argument as the registered domain and the field name to track.


app.track(action, data);

An action can be any arbritary string, but you should treat is as an identifier label. To be able to group events you shoul duse the same action.



## Usage

```
Apptrack = require("apptrack");

var tracker = new Apptrack({ store : store }, options );

// middleware

app.use( tracker.connect() );
```


## Credits

Initiated by Makis Tracend ( [@tracend](https://github.com/tracend) )

Originally based on the [analytics](https://github.com/srivastavarobin/analytics) app by [@srivastavarobin](https://github.com/srivastavarobin)

Distributed through [Makesites.org](http://makesites.org)


## License

Released under the [Apache license, version 2.0](http://makesites.org/licenses/APACHE-2.0)
