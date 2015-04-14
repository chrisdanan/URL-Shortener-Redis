var main = function(){
	"use strict";

	//DOM elements for the area where user can input URLs.
	var $inputURL = $("<input>").attr({"id": "inputURLText", "name": "inputURL"}),
		$URLSubmitBtn = $("<button>").text("Submit").attr("id", "inputURLBtn"),
		$tagLabel = $("<label>").text("Enter URL here").attr("for", "inputURL");

	$("#inputURLDiv").append($tagLabel);
	$("#inputURLDiv").append($inputURL);
	$("#inputURLDiv").append($URLSubmitBtn);

	$URLSubmitBtn.on("click", function(){
		var inputURL = $inputURL.val();
		$inputURL.val("");

		$.post("/shorter", {url: inputURL}, function(res){
			console.log("Posted to the server and got back a response.");
		});
	});
};

$(document).ready(main);