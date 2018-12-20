const http = require('http');
const URL = require('url');
const middleware = require('./Middleware');
const register = require('./Register');

function Route() {
    this.path = arguments[0]
    this.callbacks = []
    for(var i = arguments.length - 1 ; i >= 1; --i) {
        this.callbacks.push(arguments[i])
    }
}

function addRoute(method, route){
    if(routes[method] === undefined)
        routes[method] = {}
    routes[method][route.path] = route
}

addRoute('POST', new Route('/register', middleware.parseJSON, middleware.hasUser, middleware.validateUser, register.final));

module.exports = function(request, response){

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    request.url = URL.parse(request.url, true)

    if(routes[request.method] === undefined) {

        response.setHeader("Content-Type", "application/json")
        response.writeHead(501)
        response.end(JSON.stringify({error: `unknown ${request.method} request`}))
        return
    }
    var path = routes[request.method][request.url.pathname]
    if(path === undefined) {
        if(request.method === "GET") {
            serveStatic(request, response);
            return;
        }
        response.setHeader("Content-Type", "application/json")
        response.writeHead(501)
        response.end(JSON.stringify({error: `unknown ${request.method} request`}))
        return
    }

    response.setHeader("Content-Type", "application/json")
    var callbacks = path.callbacks.slice()
    function next() {
        callback = callbacks.pop();
        callback(request, response, next)
    }
    callbacks.pop()(request, response, next)    
}
