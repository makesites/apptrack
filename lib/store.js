// Dependencies
var uuid = require("node-uuid");

// Class
var Store = function(){

	createID: function(){
		// check if there's a custom method passed...
		return uuid.v4();
	}
}

// Export
module.exports = Store;