// var Db = require('mongodb').Db,
//   Connection = require('mongodb').Connection,
//   Server = require('mongodb').Server,
//   BSON = require('mongodb').BSONNative;
//   
// var db = new Db('testService', new Server(host, port, {}, {native_parser: true}));
// 
// 
// var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
// var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;



var webservice = require('webservice');
    serverModule = require('./server_modules.js');

webservice.createServer(serverModule).listen(8080);
console.log('JSON Webservices Started at http://localhost:8080 ...');


// db.open(function(err, db) {
// 	db.collection('testCollection', function(err, collection) {
// 			collection.insert({'msg': val});
// 			db.close();
// 		res = true;
// 	});
// });
