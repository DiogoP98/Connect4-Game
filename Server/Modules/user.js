const fs = require("fs");
const config = require("../conf.js");
const crypto = require('crypto');
const headers = require("./Headers.js").headers;

module.exports = {
    /**
     * Checks the user's input credentials
     * @param {String} nick Username given by the user 
     * @param {String} pass Password given by the user
     */
    checkCredentials: function(nick, pass){
        if(nick == "" || pass == ""){
            return 1;
        }
    
        pass = crypto.createHash('md5').update(pass).digest('hex');
    
        try{
            var fileData = fs.readFileSync(config.UserStorage);
            fileData = JSON.parse(fileData.toString())["users"];
        }
        catch(err){
            console.log(err);
            return 2;
        }
    
        var found = false;
        var i;
        for(i=0; i<fileData.length; i++){
            if(fileData[i]["nick"] == nick){
                found = true;
                break;
            }
        }
        if(found==false){
            fileData.push({nick: nick, pass: pass, games: {}});
            fileData = {users: fileData};
            try{
                fs.writeFileSync(config.UserStorage, JSON.stringify(fileData));
            }
            catch(err){
                console.log("Error writing to file 'users.json'.");
                console.log(err);
                return 2;
            }
        }
        else{
            if(fileData[i]["pass"] == pass){
                return 0;
            }
            else
                return 1;
        }
    },

    nickUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Nick is undefined"}));
		response.end();
    },

    passUndefined: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "Pass is undefined"}));
		response.end();
    },

    wrongPassword: function(response) {
        response.writeHead(400, headers["plain"]);
		response.write(JSON.stringify({error: "User registered with a different password"}));
		response.end();
    },

    fileError: function(response) {
        response.writeHead(500, headers["plain"]);
		response.end();
    },

    ok: function(response) {
        response.writeHead(200, headers["plain"]);
		response.write(JSON.stringify({}));
		response.end();
    }
}
