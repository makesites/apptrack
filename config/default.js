// Default options

module.exports = {
	host: "", // apptrack host, if serving apptrack from a separate domain
	domains: [], // list of accepted domains, that can submit tracking data (host is automatically added)
	routes: {
		client: "/apptrack.js", // the location where the client-side js is output
		track: "/track" // the path that is recieving the clinet-side data...
	},
	store: "memory"

}