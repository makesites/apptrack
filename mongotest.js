var mongo = require('mongodb');
var db = new mongo.Db('mydb', new mongo.Server('localhost', 34324, {}), {});
db.open(function() {});
doc = {
	"type" : "database",
	"count" : 1,
	"info" : {
		x: 203,
		y: 102
	}
};
db.collection('testCollection', function(err, collection) {


	collection.insert(doc, function(){});
	
});
