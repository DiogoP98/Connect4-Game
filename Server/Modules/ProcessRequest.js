"use strict";

const url = require("url");
const fs = require("fs");
const crypto = require('crypto');
const updater = require("./Update.js");
const headers = require("./Headers.js").headers;
const serverStatic = require("./static.js");
const userMan = require("./user.js");
const gameMan = require("./game.js");

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
            case "/":
                serverStatic(pathname, request,response);
                break;
            case "/index.html":
                serverStatic(pathname, request,response);
                break;
            case "/c4.css":
                serverStatic(pathname, request,response);
                break;
            case "/JS/AI.js":
                serverStatic(pathname, request,response);
                break;
            case "/JS/Board.js":
                serverStatic(pathname, request,response);
                break;
            case "/JS/Connect4Api.js":
                serverStatic(pathname, request,response);
                break;
            case "/JS/Game.js":
                serverStatic(pathname, request,response);
                break;
            case "/JS/Manager.js":
                serverStatic(pathname, request,response);
                break;
            case "/JS/Timer.js":
                serverStatic(pathname, request,response);
                break;
            case "/Images/avatar.png":
                serverStatic(pathname, request,response);
                break;
            case "/Images/gameOptions.png":
                serverStatic(pathname, request,response);
                break;
            case "/favicon.ico":
                serverStatic(pathname, request,response);
                break;
			case "/update":
				if(query["game"]==null){
					gameMan.gameUndefined(response);
					break;
				}
				else if(query["nick"]==null){
					userMan.nickUndefined(response);
					break;
				}

				var ret = updater.insertConnection(query["game"], query["nick"], response);

				if(ret == 1){
					gameMan.invalidGame(response);
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
					userMan.nickUndefined(response);
					break;
				}
				else if(query["pass"]==null){
					userMan.passUndefined(response);
					break;
				}

				var ret = userMan.checkCredentials(query["nick"], query["pass"]);

				if(ret==2)
					userMan.fileError(response);
				else if(ret==1)
					userMan.wrongPassword(response);
				else
					userMan.ok(response);

                break;
            case "/ranking":
				if(query["size"]["columns"] == null || query["size"]["rows"] == null){
                    gameMan.sizeUndefined(response);
					break;
				}
				else if(!Number.isInteger(parseInt(query["size"]["rows"])) || !Number.isInteger(parseInt(query["size"]["columns"]))){
                    gameMan.invalidSize(response);
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
					if(fileData[i]["games"][query["size"]["columns"]][query["size"]["rows"]] != null)
						array.push({nick: fileData[i]["nick"], victories: fileData[i]["games"][query["size"]["columns"]][query["size"]["rows"]]["victories"], games: fileData[i]["games"][query["size"]["columns"]][query["size"]["rows"]]["games"]});
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
                userMan.ok(response);
                
				break;
            case "/join":
				if(query["group"]==null){
                    gameMan.groupUndefined(response);
					break;
				}
				else if(query["nick"]==null){
					userMan.nickUndefined(response);
					break;
				}
				else if(query["pass"]==null){
					userMan.passUndefined(response);
					break;
                }
				else if(query["size"]["columns"] ==null || query["size"]["rows"] == null){
					gameMan.sizeUndefined(response);
					break;
				}
				else if(!Number.isInteger(parseInt(query["size"]["rows"])) || !Number.isInteger(parseInt(query["size"]["columns"]))){
					gameMan.invalidSize(response);
					break;
				}
				else if(!Number.isInteger(parseInt(query["group"]))){
					gameMan.invalidGroup(response);
					break;
                }
                
				var ret = userMan.checkCredentials(query["nick"], query["pass"]);

				if(ret==2)
					userMan.fileError(response);
				else if(ret==1)
					userMan.wrongPassword(response);

				if(updater.nickSizeAlreadyWaiting(query["group"], query["nick"], query["size"]["rows"], query["size"]["columns"])==true){
					gameMan.playYourself(response);
					break;
				}
				else if(updater.groupSizeAlreadyWaiting(query["group"], query["size"]["rows"], query["size"]["columns"])==true){
					var gameid = updater.joinGame(query["group"], query["nick"], query["size"]["rows"], query["size"]["columns"] );
					if(gameid!=null)
                        gameMan.gameok(response, gameid);
                    break;

                }

				var date = new Date();
				date = date.getTime();
				var gameid = crypto.createHash('md5').update(date.toString()).digest('hex');

				var ret = updater.remember(query["group"], query["nick"], query["size"]["rows"], query["size"]["columns"], gameid);
				gameMan.gameok(response, gameid);

				break;
			case "/leave":
				if(query["nick"]==null){
					userMan.nickUndefined(response);
					break;
				}
				else if(query["pass"]==null){
					userMan.passUndefined(response);
					break;
				}
				else if(query["game"]==null){
					gameMan.gameUndefined(response);
					break;
				}

				var ret = userMan.checkCredentials(query["nick"], query["pass"]);

				if(ret==2)
					userMan.fileError(response);
				else if(ret==1)
					userMan.wrongPassword(response);

				ret = updater.leaveGame(query["game"], query["nick"]);

				if(ret==1){
                    gameMan.invalidGame(response);
                    break;
				}
				
                userMan.ok(response);

				break;
            case "/notify":
				if(query["game"]==null){
					gameMan.gameUndefined(response);
					break;
				}
				else if(query["nick"]==null){
					userMan.nickUndefined(response);
					break;
				}
				else if(query["pass"]==null){
					userMan.passUndefined(response);
					break;
				}
				else if(query["column"]==null){
					gameMan.columnUndefined(response);
					break;
				}

				var ret = userMan.checkCredentials(query["nick"], query["pass"]);

				if(ret==2)
					userMan.fileError(response);
				else if(ret==1)
					userMan.wrongPassword(response);
                
				ret = updater.play(query["game"], query["nick"], query["column"]);

				if(ret == 0)
					userMan.ok(response);
				else if(ret == 1)
					gameMan.notTurn(response);
				else if(ret == 2)
					gameMan.negativeColumn(response);
				else if(ret == 3)
					gameMan.fullColumn(response);
				else
					gameMan.notFound(response);

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
