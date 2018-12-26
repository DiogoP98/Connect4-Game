const headers = require("./Headers.js").headers;

module.exports = {
    sizeUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Undefined size"}));
	    response.end();
    },

    groupUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Group is undefined"}));
		response.end();
    },

    gameUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Game is undefined"}));
		response.end();
    },

    columnUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Column is undefined"}));
		response.end();
    },

    invalidSize: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Invalid size"}));
		response.end();
    },

    invalidGroup: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Invalid group"}));
		response.end();
    },

    invalidGame: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Invalid game reference"}));
	    response.end();
    },

    playYourself: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Cannot play against yourself"}));
		response.end();
    },

    notTurn: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Not your turn to play"}));
		response.end();
    },

    negativeColumn: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Column reference is negative"}));
		response.end();
    },

    fullColumn: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Column full"}));
		response.end();
    },

    notFound: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Game not found"}));
		response.end();
    },

    gameok: function(response, gameid) {
        response.writeHead(200, headers["plain"]);
		response.write(JSON.stringify({game: gameid}));
		response.end();
    }

}
