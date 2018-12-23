const config = require('./conf.js');
const http = require('http');
const headers = require("./Modules/Headers.js");
const processRequest = require("./Modules/ProcessRequest.js");

http.createServer(function(request, response) {
    console.log("connected");
    console.log(request.method);
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
