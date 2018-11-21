const host = "twserver.alunos.dcc.fc.up.pt"
const port = 8008;

/**
 * Makes a request to the specified command 
 * @param {String} command 
 * @param {String} method 
 * @param {*} data 
 * @param {Function} callback 
 */
function makeRequest(command, method, data, callback) {    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState != 4)
            return
        callback(xhr.status, JSON.parse(xhr.responseText))
    }

    xhr.open(method, `http://${host}:${port}/${command}`);

    xhr.send(JSON.stringify(data))
}
