"use strict";

var url = require("url");
var fs = require("fs");
var crypto = require('crypto');
var updater = require("./Update.js");
var headers = require("./Headers.js").headers;

/*
module.exports.processGetRequest = function(request, response){
	let parsedUrl = url.parse(request.url, true);
	let pathname = parsedUrl.pathname;
	let query = parsedUrl.query;
	let body = "";

	request.on("data", function(chunk){
		body += chunk;
    });
    
	request.on("end", function(){
		switch(pathname){
			case "/update":
				if(query["game"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Game is undefined"}));
					response.end();
					break;
				}
				else if(query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nick is undefined"}));
					response.end();
					break;
				}

				var ret = updater.insertConnection(query["game"], query["nick"], response);

				if(ret == 1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid game reference"}));
					response.end();
				}

				break;
			default:
				response.writeHead(404, headers["plain"]);
				response.end();
				break;
		}
	});
	request.on("close", function(err){
		response.end();
	});
	request.on("error", function(err){
		console.log(err.message);
		response.writeHead(400, headers["plain"]);
		response.end();
	});
}
*/
module.exports.processPostRequest = function(request, response){
	var parsedUrl = url.parse(request.url, true);
	var pathname = parsedUrl.pathname;
	var body = "";

	request.on("data", function(chunk){
		body += chunk;
	});
	request.on("end", function(){
		try{
			var query = JSON.parse(body);
		}
		catch(err){
			console.log(err.message);
			response.writeHead(400, headers["plain"]);
			response.write(JSON.stringify({error: "Error parsing JSON request: " + err}));
			response.end();
			return;
		}
		switch(pathname){
            case "/register":
				if(query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nick is undefined"}));
					response.end();
					break;
				}
				else if(query["pass"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Pass is undefined"}));
					response.end();
					break;
				}

				var ret = checkCredentials(query["nick"], query["pass"]);

				if(ret==2){
					response.writeHead(500, headers["plain"]);
					response.end();
				}
				else if(ret==1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "User registered with a different password"}));
					response.end();
				}
				else{
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}

                break;
            case "/ranking":
                console.log("aqui"); 
                console.log(size);
				if(query["size"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Undefined size"}));
					response.end();
					break;
				}
				else if(!Number.isInteger(parseInt(query["size"]))){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid size"}));
					response.end();
					break;
				}

				try{
					var fileData = fs.readFileSync("Data/users.json");
					fileData = JSON.parse(fileData.toString())["users"];
				}
				catch(err){
					console.log(err);
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}

				var array = [];
				var i = 0;
				for(i=0; i<fileData.length; i++){
					if(fileData[i]["games"][query["size"]] != null)
						array.push({nick: fileData[i]["nick"], victories: fileData[i]["games"][query["size"]]["victories"], games: fileData[i]["games"][query["size"]]["games"]});
				}

				var j=0;
				for(i=0; i<array.length; i++){
					for(j=i+1; j<array.length; j++){
						if(array[j]["victories"] > array[i]["victories"]){
							var temp = array[i];
							array[i] = array[j];
							array[j] = temp;
						}
					}
				}

				array = array.slice(0, 10);

				array = {ranking: array};

				response.writeHead(200, headers["plain"]);
				response.write(JSON.stringify(array));
				response.end();

				break;
			case "/join":
				if(query["group"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Group is undefined"}));
					response.end();
					break;
				}
				else if(query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nick is undefined"}));
					response.end();
					break;
				}
				else if(query["pass"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Pass is undefined"}));
					response.end();
					break;
				}
				else if(query["size"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Size is undefined"}));
					response.end();
					break;
				}
				else if(!Number.isInteger(parseInt(query["size"]))){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid size"}));
					response.end();
					break;
				}
				else if(!Number.isInteger(parseInt(query["group"]))){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid group"}));
					response.end();
					break;
				}

				var ret = checkCredentials(query["nick"], query["pass"]);

				if(ret==2){
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}
				else if(ret==1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "User registered with a different password"}));
					response.end();
					break;
				}

				if(updater.nickSizeAlreadyWaiting(query["group"], query["nick"], query["size"])==true){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Cannot play against yourself"}));
					response.end();
					break;
				}
				else if(updater.groupSizeAlreadyWaiting(query["group"], query["size"])==true){
					var gameid = updater.joinGame(query["group"], query["nick"], query["size"]);
					if(gameid!=null){
						response.writeHead(200, headers["plain"]);
						response.write(JSON.stringify({game: gameid}));
						response.end();
					}
					else{
						var date = new Date();
						date = date.getTime();
						var gameid = crypto
										.createHash('md5')
										.update(date.toString())
										.digest('hex');

						updater.remember(query["group"], query["nick"], query["size"], gameid);
						response.writeHead(200, headers["plain"]);
						response.write(JSON.stringify({game: gameid}));
						response.end();
					}
				}
				else{
					var date = new Date();
					date = date.getTime();
					var gameid = crypto
									.createHash('md5')
									.update(date.toString())
									.digest('hex');

					var ret = updater.remember(query["group"], query["nick"], query["size"], gameid);
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({game: gameid}));
					response.end();
				}

				break;
			case "/leave":
				if(query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nick is undefined"}));
					response.end();
					break;
				}
				else if(query["pass"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Pass is undefined"}));
					response.end();
					break;
				}
				else if(query["game"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Game is undefined"}));
					response.end();
					break;
				}

				var ret = checkCredentials(query["nick"], query["pass"]);

				if(ret==2){
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}
				else if(ret==1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "User registered with a different password"}));
					response.end();
					break;
				}

				ret = updater.leaveGame(query["game"], query["nick"]);

				if(ret==1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Invalid game reference"}));
					response.end();
				}
				else{
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}

				break;
			case "/notify":
				if(query["game"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Game is undefined"}));
					response.end();
					break;
				}
				else if(query["nick"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Nick is undefined"}));
					response.end();
					break;
				}
				else if(query["pass"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Pass is undefined"}));
					response.end();
					break;
				}
				else if(query["stack"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Stack is undefined"}));
					response.end();
					break;
				}
				else if(query["pieces"]==null){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Pieces is undefined"}));
					response.end();
					break;
				}

				var ret = checkCredentials(query["nick"], query["pass"]);

				if(ret==2){
					response.writeHead(500, headers["plain"]);
					response.end();
					break;
				}
				else if(ret==1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "User registered with a different password"}));
					response.end();
					break;
				}

				ret = updater.play(query["game"], query["nick"], query["stack"], query["pieces"]);

				if(ret == 0){
					response.writeHead(200, headers["plain"]);
					response.write(JSON.stringify({}));
					response.end();
				}
				else if(ret == 1){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Not your turn to play"}));
					response.end();
				}
				else if(ret == 2){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Stack cannot have a negative number of pieces"}));
					response.end();
				}
				else if(ret == 3){
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Not enough pieces in that stack"}));
					response.end();
				}
				else{
					response.writeHead(400, headers["plain"]);
					response.write(JSON.stringify({error: "Game not found"}));
					response.end();
				}

                break;
			default:
				response.writeHead(404, headers["plain"]);
				response.end();
				break;
		}
	});
	request.on("error", function(err){
		console.log(err.message);
		response.writeHead(400, headers["plain"]);
		response.end();
	});
}

function checkCredentials(nick, pass){
	if(nick == "" || pass == ""){
		return 1;
	}

	pass = crypto
				.createHash('md5')
				.update(pass)
				.digest('hex');

	try{
		var fileData = fs.readFileSync("Data/users.json");
		fileData = JSON.parse(fileData.toString())["users"];
	}
	catch(err){
		console.log(err);
		return 2;
	}

	var found = false;
	var i;
	for(i=0; i<fileData.length; i++){
		if(fileData[i]["nick"] == nick){
			found = true;
			break;
		}
	}
	if(found==false){
		fileData.push({nick: nick, pass: pass, games: {}});
		fileData = {users: fileData};
		try{
			fs.writeFileSync("Data/users.json", JSON.stringify(fileData));
		}
		catch(err){
			console.log("Error writing to file 'users.json'.");
			console.log(err);
			return 2;
		}
	}
	else{
		if(fileData[i]["pass"] == pass){
			return 0;
		}
		else
			return 1;
	}
}
