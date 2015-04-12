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