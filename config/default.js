// Default options

module.exports = {
	host: "", // apptrack host, if serving apptrack from a separate domain
	domains: [], // list of accepted domains, that can submit tracking data (host is automatically added)
	routes: {
		client: "/apptrack.js", // the location where the client-side js is output
		log: "/log" // the path that is recieving the client-side data...
	},
	store: "memory"

}