const config = require('./conf.js');
const http = require('http');
var headers = require("./Modules/Headers.js");
const processRequest = require("./Modules/ProcessRequest.js");

http.createServer(function(request, response) {
    console.log("connected");
	switch(request.method){
		case "GET":
            processRequest.processGetRequest(request, response);
			break;
		case "POST":
            processRequest.processPostRequest(request, response);
			break;
		default:
			response.writeHead(501, headers["plain"]);
			response.end();
			break;
	}
}).listen(config.port);
