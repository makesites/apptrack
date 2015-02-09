// Default options

module.exports = {
	host: "", // apptrack host, if serving apptrack from a separate domain
	domains: [], // list of accepted domains, that can submit tracking data (host is automatically added)
	routes: {
		client: "/apptrack.js", // the location where the client-side js is output
		input: "/input",  // the path that is receiving the client-side data...
		output: false // an endpoint to output the latest data (by default disabled)
	},
	store: "memory"

}