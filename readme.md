# Apptrack

Application tracking that simplifies the process of gathering analytics and avoids convoluted conventions.

The logic is minimal, lightweight, yet can work both on the server and the client, with asynchronous syncing of the client data.


## Features

* Client-side integration
* Asynchronous data gathering
* Multiple DB stores supported
* Optional Connect middleware


## Examples

* [Backend](./examples/backend/server.js)
* [Client-side](./examples/client/server.js)


## Dependencies

* Connect
* Underscore


## Install

Using npm
```
node install apptrack
```


## Usage

When Apptrack is initiated you can pass the selected store, among other options:

```
Apptrack = require("apptrack");

var apptrack = new Apptrack({ store : "redis", db: db });
```
The library can operate independently but optionally can be connected to the server using a middleware
```
// middleware
app.use( apptrack.connect() );
```

Apptrack automatically serves the client-side javascript from the _client_ route (mentioned in the options below) which, when included in a web page, will create an object named ```at``` in the global namespace.


## Options

* **host** (default: ""), the Apptrack host, if serving the tracking from a separate domain
* **domains** (default: []), list of accepted domains, that can submit tracking data (host is automatically added)
* **store** (default: "memory"), options: memory, redis, mongodb, simpledb
* **db** (default: false), db where tokens are stored

### Routes

A top level option that may contain the following sub-options:

* **client** (default:"/apptrack.js"), the location where the client-side js is output
* **input** (default: "/log"), the path that is receiving the client-side data...
* **output** (default: false), an endpoint to output the latest data (by default disabled)


## Methods

Below are the public methods that are provided for interfacing with the library:

### Client

* **at( options )** Initiator for the client, this method is required before any other method can be used.
* **at.log( action, params )** Record an event with an action label and parameters
* **at.sync()** Sending data to the server; usually triggered in intervals automatically, we may want to force syncing on occassion (ex. when exiting the website)

## Server

* **apptrack.log( action, params )** Record an event with an action label and data parameters
* **apptrack.output()** Return all the (recent) data saved
* **apptrack.valid( url )** Validate a URL (referer) agains the domains list and host


## Tracking

To track any event, load Apptrack on the server and optionally include the client-side JavaScipt (default: /apptrack.js) in the HTML page. You can call the method ```log``` available from both ends of the application stack, with a keyword for the action and any params attached to it.
```
.log(action, params);
```
### Action

An action can be any arbitrary string, but you should treat is as an identifier label. To be able to group events you should use the same action keyword.

### Params

The library does not try to define the structure of the parameters - it is left schema-less for simplicity, allowing the developer to send arbitrary data along with any action.



## Credits

Initiated by Makis Tracend ( [@tracend](https://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org)

### Thanks

Inspired by the [analytics](https://github.com/srivastavarobin/analytics) app by [@srivastavarobin](https://github.com/srivastavarobin)

### License

Released under the [Apache license, version 2.0](http://makesites.org/licenses/APACHE-2.0)

