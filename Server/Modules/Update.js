"use strict";

var fs = require("fs");

var games = [];

module.exports.remember = function(group, nick, rowsa, columnsa, gameid){
	let board = new Array();
    for(let i=0; i < columnsa; i++) {
        board[i] = new Array();
        for(let j = 0; j < rowsa; j++)
            board[i][j] = null;
    }

	let timeout = setTimeout(function() {
		waitIsOver(gameid);
	}, 120000);

	games.push({group: group, size: {rows: rowsa, columns: columnsa}, nick1: nick, nick2: null, gameid: gameid, timeout: timeout, responses: {response1: null, response2: null}, board: board, turn: null, active: false});
}

module.exports.joinGame = function(group, nick, rows, columns){
    console.log("here");
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].size.rows == rows && games[i].size.columns == columns && games[i].active == false){
			games[i].nick2 = nick;

			return games[i].gameid;
		}
	}
	return null;
}

function waitIsOver(gameid){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick2 == null)
				update(JSON.stringify({winner: null}), games[i].responses.response1, games[i].responses.response2);
			else if(games[i].turn == games[i].nick1)
				update(JSON.stringify({winner: games[i].nick2}), games[i].responses.response1, games[i].responses.response2);
			else
				update(JSON.stringify({winner: games[i].nick1}), games[i].responses.response1, games[i].responses.response2);
			
			if(games[i].responses.response1!=null)
				games[i].responses.response1.end();
			if(games[i].responses.response2!=null)
				games[i].responses.response2.end();
			games.splice(i, 1);
			break;
		}
	}
}

function insertScore(winner, looser, size){
	try{
		var fileData = fs.readFileSync("Data/users.json");
		fileData = JSON.parse(fileData.toString())["users"];
	}
	catch(err){
		console.log(err);
		return 1;
	}

	for(var i=0; i<fileData.length; i++){
		if(fileData[i]["nick"]==winner){
			if(fileData[i]["games"][size] == null){
				fileData[i]["games"][size] = {};
				fileData[i]["games"][size]["games"] = 1;
				fileData[i]["games"][size]["victories"] = 1;
			}
			else{
				fileData[i]["games"][size]["games"]++;
				fileData[i]["games"][size]["victories"]++;
			}
		}
		else if(fileData[i]["nick"]==looser){
			if(fileData[i]["games"][size] == null){
				fileData[i]["games"][size] = {};
				fileData[i]["games"][size]["games"] = 1;
				fileData[i]["games"][size]["victories"] = 0;
			}
			else
				fileData[i]["games"][size]["games"]++;
		}
	}

	fileData = {users: fileData};
	try{
		fs.writeFileSync("Data/users.json", JSON.stringify(fileData));
	}
	catch(err){
		console.log("Error writing to file 'users.json'.");
		console.log(err);
		return 2;
	}

	return 0;
}

module.exports.nickSizeAlreadyWaiting = function(group, nick, rows, columns){
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].nick1 == nick && games[i].size.rows == rows && games[i].size.columns == columns &&  games[i].active==false){
			return true;
		}
	}

	return false;
}

module.exports.groupSizeAlreadyWaiting = function(group, rows, columns){
	for(let i=0; i<games.length; i++){
		if(games[i].group == group && games[i].size.rows == rows && games[i].size.columns == columns && games[i].active==false)
			return true;
	}

	return false;
}

module.exports.leaveGame = function(gameid, nick){
	var winner, looser;
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick1!=nick && games[i].nick2!=nick)
				return 1;
			clearTimeout(games[i].timeout);
			if(games[i].nick2==null){
				winner = null;
			}
			else{
				if(games[i].nick1==nick){
					winner = games[i].nick2;
					looser = games[i].nick1;
				}
				else{
					winner = games[i].nick1;
					looser = games[i].nick2;
				}
				insertScore(winner, looser, games[i].board.length);
			}
			update(JSON.stringify({winner: winner}), games[i].responses.response1, games[i].responses.response2);
			if(games[i].responses.response1 != null)
				games[i].responses.response1.end();
			if(games[i].responses.response2 != null)
				games[i].responses.response2.end();
			games.splice(i, 1);
			return 0;
		}
	}

	return 1;
}

module.exports.play = function(gameid, nick, stack, pieces){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid && games[i].active == true){
			clearTimeout(games[i].timeout);
			if(games[i].turn != nick){
				return 1;
			}
			else if(pieces < 0){
				return 2;
			}
			else if(pieces >= games[i].board[stack]){
				return 3;
			}
			else{
				games[i].board[stack] = pieces;
				if(checkEndGame(games[i].board) == true){
					update(JSON.stringify({winner: nick, rack: games[i].board, stack: stack, pieces: pieces}), games[i].responses.response1, games[i].responses.response2);
					games[i].responses.response1.end();
					games[i].responses.response2.end();
					if(games[i].nick1 == nick)
						insertScore(nick, games[i].nick2, games[i].board.length);
					else
						insertScore(nick, games[i].nick1, games[i].board.length);
					games.splice(i,1);
				}
				else{
					if(games[i].turn == games[i].nick1)
						games[i].turn = games[i].nick2;
					else
						games[i].turn = games[i].nick1;
					let timeout = setTimeout(function() {
						waitIsOver(gameid);
					}, 120000);
					games[i].timeout = timeout;
					update(JSON.stringify({turn: games[i].turn, rack: games[i].board, stack: stack, pieces: pieces}), games[i].responses.response1, games[i].responses.response2);
				}
				return 0;
			}
		}
	}

	return 4;
}

function startGame(i){
	games[i].active = true;
	
	games[i].turn = games[i].nick1;

	update(JSON.stringify({turn: games[i].turn, rack: games[i].board}), games[i].responses.response1, games[i].responses.response2);
}

function checkEndGame(board){
	for(let i = 0; i<board.length; i++){
		if(board[i]>0)
			return false;
	}

	return true;
}

module.exports.insertConnection = function(gameid, nick, response){
	for(var i=0; i<games.length; i++){
		if(games[i].gameid == gameid){
			if(games[i].nick1 == nick && games[i].responses.response1 == null){
				games[i].responses.response1 =  response;
				response.writeHead(200, {
											'Content-Type': 'text/event-stream',
											'Cache-Control': 'no-cache',
											'Access-Control-Allow-Origin': '*',
											'Connection': 'keep-alive'
										});
				return 0;
			}
			else if(games[i].nick2 == nick && games[i].responses.response2 == null){
				games[i].responses.response2 =  response;
				response.writeHead(200, {
											'Content-Type': 'text/event-stream',
											'Cache-Control': 'no-cache',
											'Access-Control-Allow-Origin': '*',
											'Connection': 'keep-alive'
										});
				games[i].active = true;
				startGame(i);
				return 0;
			}
			break;
		}
	}

	return 1;
}

function update(message, response1, response2){
	if(response1!=null){
		response1.write("data: " + message + "\n\n");
	}
	if(response2!=null){
		response2.write("data: " + message + "\n\n");
	}
}

