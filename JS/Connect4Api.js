

/**
 * Makes a request to the specified command 
 * @param {String} command 
 * @param {String} type 
 * @param {*} data 
 * @param {Function} callback 
 */
function makeRequest(command, type, data, callback) {    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState != 4)
            return
        callback(xhr.status, JSON.parse(xhr.responseText))
    }

    xhr.open(method, `http://${host}:${port}/${command}`);

    xhr.send(JSON.stringify(data));

    return fetch(`http://${host}:${port}`,{ method: type});
}
