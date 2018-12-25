const headers = require("./Headers.js").headers;

module.exports = {
    ok: function(array,response) {
        response.writeHead(200, headers["plain"]);
		response.write(JSON.stringify(array));
		response.end();
    }   
}
