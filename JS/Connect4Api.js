const host = "twserver.alunos.dcc.fc.up.pt"
const port = 8008;
const Connect4Api =  [
    {
		elemId: 'startGame',
		eventName: 'submit',
		callback: playGame
	},
	{
		elemId: 'loginForm',
		eventName: 'submit',
		callback: (event) => {event.preventDefault()}
	},
	{
		elemId: 'loginButton',
		eventName: 'click',
		callback: login
	},
	{
		elemId: 'registerButton',
		eventName: 'click',
		callback: register
	},
	{
		elemId: 'logoutbutton',
		eventName: 'click',
		callback: logout
	},
	{	elemId: 'adversary',
		eventName: 'change',
		callback: changeGameMode
	},
	{
		elemId: 'returnToGame',
		eventName: 'click',
		callback: (event) => { navigate('#/game') }
	},
	{
		elemId: 'offline-lb',
		eventName: 'click',
		callback: () => {OnChangeLeaderboardType("offline")} 
	},
	{
		elemId: 'online-lb',
		eventName: 'click',
		callback: () => {OnChangeLeaderboardType("online")} 
	}, 
	{
		elemId: 'rankingSize',
		eventName: 'change',
		callback: () => {OnChangeLeaderboardType("online")}
	}
];

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
