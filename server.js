"use strict";

var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	bodyParser = require("body-parser"),
	path = require("path"),
	router = express.Router(),
	port = 3000,
	app,
	redisClient;

app = express();
redisClient = redis.createClient();

app.set("views", path.join(__dirname, "views"));  //Set up views folder path.
app.set("view engine", "jade");  //Use Jade.

app.use(express.static(__dirname + "/public"));  //Set up static path.
app.use(bodyParser());
app.use(router);

http.createServer(app).listen(port);
console.log("Server listening on port " + port);

//Functions

//Routes
//Route for homepage.
router.route("/")
	.get(function(req, res){
		res.render("index", {title: "URL Shortener"});
	});

router.route("/shorter")
	.post(function(req, res){
		console.log("Received POST from client.");
		console.log(req.body);

		var originalURL,  //The original URL entered by the user.
			base,  //The base part of the URL, which in this program should be "http://localhost:<port number>".
			path;  //The path part of the URL, which will usually be the part we will shorten.

		originalURL = req.body.url;
		base = "http://localhost:" + port;

		//Reference for checking if string contains substring: http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring
		if(originalURL.indexOf(base) > -1){  //Entered URL starts with base, so assume user wants a shortened URL.
			console.log("User entered long URL");
		} else{  //Entered URL does not start with base, so assume user entered a shortened URL and wants the long URL.
			console.log("User entered a short URL");
		}
	});