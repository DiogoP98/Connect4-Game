"use strict";

const divs = ['loginPageDiv','gameOptionsDiv','gameDiv','gameRulesDiv','leaderboardDiv', 'gameFinishDiv'];
var login;
var ingame;
var loginInfo = {
	signedIn: false,
    user: null,
    password: ""
}
var before = false; //check if the leaderboard was shown before
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
 * Shows login box, with the game name on top
 */
function showLoginPage() {
    document.getElementById('dropdown').style.visibility = 'hidden';

    login= false;
    ingame = false;

    resetDiv(document.getElementById('gameDiv'));
    resetDiv(document.getElementById('gameFinishDiv'));

    hideDivs();
    
    document.getElementById('loginPageDiv').style.display = 'block';
}

/**
 * Allows the user to login 
 */
function userLogin() {
    loginInfo.user = document.getElementById('user').value;
    loginInfo.password = document.getElementById('pw').value;
    
    document.getElementById('username').innerHTML = user;

    if(localStorage[user] == null)
        localStorage[user] = JSON.stringify({"victories": 0, "games": 0, "points":0});
    
    makeRequest("login", "POST", {nick: loginInfo.username, pass: loginInfo.password}, (status, data) => {
        if(data.error){
            throwJoinError(event.target.id);
        }
        else{
            loginInfo.signedIn = true;
            document.getElementById('dropdown').style.visibility = 'visible';
            showGameOptions();
            }
        })
}

/**
 * Shows the gameOptions 
 */
function showGameOptions() {
    ingame = false;
    hideDivs();

    document.getElementById('gameOptionsDiv').style.display = 'block';
    resetDiv(document.getElementById('gameDiv'));
    resetDiv(document.getElementById('gameFinishDiv'));
}

/**
 * Shows the game board 
 */
function showGamePage() {
    const game = document.getElementById('gameDiv');
    hideDivs();

    document.getElementById('logout').style.pointerEvents = 'none';

    ingame = true; 
    game.style.display = 'block';
}

/**
 * Shows game rules
 */
function showRules() {
    hideDivs();

    document.getElementById('gameRulesDiv').style.display = 'block';
}

/**
 * Returns to the default position. If not logged in it's the login page. Ohterwise, if in a game is the game page, if not is the options page.
 */
function returnToMain() {
    if (!login) {
        showLoginPage();
    }
    else {
        if (!ingame)
            showGameOptions();
        else 
            showGamePage();
    }
}

/**
 * Shows the leaderboard
 */
function showLeaderboard() {
    let leaderboardDiv = document.getElementById('leaderboardDiv');

    if (before) 
        leaderboardDiv.innerHTML = "";

    hideDivs();
    
    let finalText = "<h2 class= 'first'>LeaderBoard</h2>"
    finalText += 
			"<table id='players'>" +
				"<tr>" +
					"<th>Player</th>" +
					"<th>Games Played</th>" +
					"<th>W/L Ratio (%)</th>" +
					"<th>Points</th>" +
				"</tr>";
	for(let i=0; i<localStorage.length; i++){
        let jsonUser = localStorage.key(i);
		let json = JSON.parse(localStorage.getItem(localStorage.key(i)));
		finalText += 
			"<tr>" +
				"<td>" + jsonUser + "</td>" +
				"<td>" + json.games + "</td>" +
				"<td>" + parseFloat(Math.round((json.victories/json.games*100) * 100) / 100).toFixed(0) + "</td>" +
				"<td>" + json.points + "</td>";
		finalText += "</tr>";
	}
	finalText += "</table>"
    
    leaderboardDiv.innerHTML += finalText;
    leaderboardDiv.style.display = 'block';
    before = true;
}

/**
 * Shows the end of the game screen
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} difficulty Difficulty of the game
 */
function gameFinish(player,difficulty) {
    resetDiv(document.getElementById('gameDiv'));
    
    document.getElementById('logout').style.pointerEvents = 'auto';

    ingame = false;

    hideDivs();

    showGameFinishPage(player,difficulty);

    document.getElementById('gameFinishDiv').style.display = 'block';
}

/**
 * Adds elements to the div that shows the end of the game.
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} difficulty Difficulty of the game
 */
function showGameFinishPage(player,difficulty) {
    const div = document.getElementById('gameFinishDiv');
    
    if (player == 1) {
        let text = "<h2>You Lost!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv+= "<p>Result factor:                   <b class='number'>0</b></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obatined:           <b class='number'>0</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
		json["games"]++;
		localStorage[user] = JSON.stringify(json);
    }
    else if (player == 2) {
        let text = "<h2>You Won!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <bold class='number'>"+ difficulty+"</bold></p>";
        scoreDiv+= "<p>Result factor:                   <bold class='number'>1</br></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obatined:           <bold class='number'>"+difficulty+"</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
        json["games"]++;
        json["victories"]++;
        json["points"]+=difficulty;
		localStorage[user] = JSON.stringify(json);
    }
    else {
        let text = "<h2>Tied!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv+= "<p>Result factor:                   <b class='number'>0.5</b></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obatined:           <b class='number'>"+0.5*difficulty+"</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
        json["games"]++;
        json["points"]+=difficulty*0.5;
		localStorage[user] = JSON.stringify(json);
    }

    let playAgainButton = document.createElement('input');

    playAgainButton.type = 'button';
    playAgainButton.value = 'Play Again';

    playAgainButton.addEventListener("click", function() {
        showGameOptions();
    });

    div.appendChild(playAgainButton);
}

/**
 * Eliminates every element of the board.
 * @param element the element from which you want to remove all the child elements
 */
function resetDiv(element){
    while (element.firstChild) 
        element.removeChild(element.firstChild);
}

/**
 * Hide all the divs from the html
 */
function hideDivs() {
    for(let i=0; i<divs.length; i++) 
        document.getElementById(divs[i]).style.display = 'none';
}

/**
 * Adds the leave button to layout on the game page
 */
function leaveGameButton() {
    this.element = document.createElement('input');

    this.element.type = 'button';
    this.element.id = 'leaveGame';
    this.element.value = 'Leave Game';
    this.element.style.width = '100%';

    this.element.addEventListener("click", function() {
        let leave = confirm("Are you sure you want to leave?");
        if (leave)
            gameFinish(1,game.ai.depth);
    });
}

window.onload = function() {
    showLoginPage();

    for(let i = 0; i < Connect4Api.length(); i++) {
        var elem = document.getElementById(Connect4Api[i].elemId);
        console.log(elem);
        elem.addEventListener(Connect4Api[i].eventName, Connect4Api[i].callback);
    }
}
