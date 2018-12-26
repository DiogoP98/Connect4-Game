const fs = require('fs')
const path = require('path')
const config = require('../conf.js')
const mediaTypes = { 
    ".txt": "text/plain", 
    ".html": "text/html", 
    ".css": "text/css", 
    ".js": "application/javascript", 
    ".png": "image/png", 
    ".jpeg": "image/jpeg", 
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico" : "image/x-icon"
}

const root = config.documentRoot.replace("/", path.sep)

/**
 * Builds file pathname
 * @param {String} purl pathname from the request
 */
function getPathname(purl) {    
    let pathname = path.normalize(path.join("." + path.sep, root, purl));
    if(!pathname.startsWith(root))  
        pathname = null; 
    return pathname;
}

/**
 * Checks the mediaType of the object
 * @param {String} mediaType 
 */
function isText(mediaType) {
    var isText = !mediaType.startsWith("image") && !mediaType.startsWith("font") && !mediaType.startsWith("application/vnd.ms-fontobject");
    return isText;
}

/**
 * Send the requested file if found.
 * @param {String} pathname pathname of the file
 * @param response response sent 
 */
function doGetPathname(pathname, response) {
    var mediaType = mediaTypes[path.extname(pathname).toLowerCase()] || "application/octet-stream";
    var encoding = isText(mediaType) ? "utf8" : null;
    
    fs.readFile(pathname, encoding, (err, data) => {
        if (err) {
            response.writeHead(404); // Not Found 
            response.end("File not found");
        } else {
            response.writeHead(200, {
                'Content-Type': mediaType,
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
            response.end(data);
        }
    });
}

/**
 * Handles static part of the server.
 * @param {String} purl pathname from the request
 * @param response response sent 
 */
module.exports = (purl, response) => {
    var pathname = getPathname(purl);
    if (pathname === null) {
        response.writeHead(403); // Forbidden 
        response.end("Forbidden");
    } else {
        fs.stat(pathname, (err, stats) => {
            if (err) {
                response.writeHead(404); // Internal Server Error 
                console.log(err);
                response.end("File not found");
            } else if (stats.isDirectory()) {
                if (pathname.endsWith(path.sep)) {
                    doGetPathname(path.join(pathname, config.defaultIndex), response);
                }
                else {
                    response.writeHead(301, // Moved Permanently 
                        {
                            'Location': request.url.pathname + "/"
                        });
                    response.end();
                }
            } else {
                doGetPathname(pathname, response);
            }
        });
    }

}
