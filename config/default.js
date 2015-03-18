// Default options

module.exports = {
	db: false, // db where logs are stored
	domains: [], // list of accepted domains, that can submit tracking data (host is automatically added)
	host: "", // apptrack host, if serving apptrack from a separate domain
	//middleware: true, // flag if lib is used as middleware (or directly)
	routes: {
		client: "/apptrack.js", // the location where the client-side js is output
		input: "/log",  // the path that is receiving the client-side data...
		output: false // an endpoint to output the latest data (by default disabled)
	},
	store: "memory", // options: memory, redis, mongodb, simpledb
	table: "" // the name of the table or collection where the logs are stored
}