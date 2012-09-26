## Open Analytics

Analytics you own... 


### Dependencies 

** Node Modules **
* Express
* MongoDB
* Webservice.js


### Setup

Steps to use:

Step 1: Start MongoDB server by typing ./mongod in the bin of MongoDB directory

Step 2: node server.js

Step 3: Register a domain by using registration.html

Step 4: To track any of the event include track.js as source of JavaScript in the HTML page and call the function track with input argument as
				the registered domain and the field name to track.

				track(domain, trackField);


				sample.html contains various buttons which are being tracked for hits under the domain www.gmail.com. Perform various number of hits on Ad buttons
				There information is stored in a document generated dynamically.

Step 5: To see the hit for any website open the following URL and pass the registered domain as the parameter
				
				http://localhost:8080/getHits?domain=www.gmail.com


Step 6: It also tracks the pattern at the end of navigation. To check the pattern in the above case open the following URL

				http://localhost:8080/getPattern?domain=www.gmail.com

Step x: To check all the registered domain open the following URL

				http://localhost:8080/getDomains



-------------------------------------------------------------------------------------------
To see the list of web-services
-------------------------------------------------------------------------------------------
After Step 2 above go in the browser window and open
http://localhost:8080/docs




-------------------------------------------------------------------------------------------
To check the database
-------------------------------------------------------------------------------------------
Step 1: Go to console of MongoDB by typing ./mongo in the bin of MongoDB directory

Step 2: Fire following commands on the prompt of MongoDB console in order 

					use trackRecords;
					db.domains.find();

			This lists all the registered domain and their unique automatically generated IDs
			
			Sample output would be as follows

						{ "name" : "www.gmail.com", "_id" : ObjectId("2952344ef6382d6301000000") }
						{ "name" : "www.ymail.com", "_id" : ObjectId("a794344e8a9b6f4e00000000") }
						{ "name" : "www.yahoo.com", "_id" : ObjectId("a35d354e03cfc73b00000000") }
						{ "name" : "www.rediff.com", "_id" : ObjectId("b15d354eda24f33d00000000") }


			To find details of "hits" on any of the registered domain search in the document hit_<id>.
			Example: to find details of hits on www.gmail.com fire the following commands on MongoDB console
				
					db.hit_2952344ef6382d6301000000.find();

			After a predefined period (in server_modules.js TIME_SLICE) any new tracks are inserted as new entry in the document.


			To find details of "patterns" on any of the registered domain search in the document pattern_<id>
			Example: to find details of patterns on www.gmail.com fire the following commands on MongoDB console
				
					db.pattern_2952344ef6382d6301000000.find();


## Credits 

Effort initiated by [@tracend](https://github.com/tracend)

Originally based on the [analytics](https://github.com/srivastavarobin/analytics) app by [@srivastavarobin](https://github.com/srivastavarobin)

Other contributors: [@ryndel](https://github.com/ryndel)
