"use strict";

var express = require("express"),
	http = require("http"),
	redis = require("redis"),
	bodyParser = require("body-parser"),
	path = require("path"),
	router = express.Router(),
	port = 3000,
	app,
	redisClient,
	initialKey = 10 * Math.pow(36, 3);  //Initial key used for Redis.

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
function getNextKey(originalURL, base, res){

	var newKey;

	redisClient.setnx("next", initialKey, function(err, data){  //Set next to initialKey if next does not exist in the db.

		var increaseValue = Math.floor(Math.random() * 10 + 1);  //Get the value we will increase next by.

		redisClient.incrby("next", increaseValue);  //Increase next by increaseValue, giving a unique key we can give as a shortened URL.

		redisClient.get("next", function(err, nextCount){
			if(err !== null){
				console.log("ERROR: " + err);
				return;
			}

			newKey = parseInt(nextCount, 10);  //Get the value of next in the database.
			newKey = newKey.toString(36);  //Convert the value of next to a base36 string.

			redisClient.setnx("short:" + base + newKey, originalURL);
			redisClient.set("long:" + originalURL, base + "/" + newKey);

			giveShortURL(originalURL, res);
		});
	});
}

function giveShortURL(originalURL, res){
	redisClient.get("long:" + originalURL, function(err, shortURL){
		if(err !== null){
			console.log("ERROR: " + err);
			return;
		}

		res.json({shortenedURL: shortURL});
	});
}

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
			path,  //The path part of the URL, which will usually be the part we will shorten.
			key;  //The key used to store a new shortened URL in the database.

		originalURL = req.body.url;
		base = "http://localhost:" + port;

		//Reference for checking if string contains substring: http://stackoverflow.com/questions/1789945/how-can-i-check-if-one-string-contains-another-substring
		if(originalURL.indexOf(base) > -1){  //Entered URL starts with base, so assume user wants a shortened URL.
			console.log("User entered long URL");
			redisClient.exists("long:" + originalURL, function(err, result){
				if(err !== null){
					console.log("ERROR: " + err);
					return;
				}

				if(result === 0){  //The long URL does not exist in the database.  Create a short URL.
					console.log("The URL entered does not exist in the database");
					getNextKey(originalURL, base, res);
				} else if(result === 1){  //The long URL does exist in the database.  Fetch the short URL.
					console.log("The URL entered exists in the database.");
					giveShortURL(originalURL, res);
				}
			});
		} else{  //Entered URL does not start with base, so assume user entered a shortened URL and wants the long URL.
			console.log("User entered a short URL");
		}
	});