const config = require('./config.json');
const http = require('http');
const routes = require('./Routing');
const server = http.createServer(routes);

server.on('listening', () => {
    console.log(`Listening on http://127.0.0.1:${conf.port}`)
})
server.listen(config.port);
