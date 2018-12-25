const headers = require("./Headers.js").headers;

module.exports = {
    /**
     * Sends the ranking when the request is right.
     * @param array The ranking array with maximum size 10
     * @param response The response which contains the ranking array
     */
    ok: function(array,response) {
        response.writeHead(200, headers["plain"]);
		response.write(JSON.stringify(array));
		response.end();
    }   
}
