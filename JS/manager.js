"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","gameRulesDiv","leaderboardDiv", "gameFinishDiv"];
var login;
var ingame;
var user;
var before = false; //check if the leaderboard was shown before

/**
 * Shows login box, with the game name on top
 */
function showLoginPage() {
    login= false;
    ingame = false;

    resetDiv(document.getElementById("gameDiv"));
    resetDiv(document.getElementById("gameFinishDiv"));

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";
    
    document.getElementById("loginPageDiv").style.display = "block";
    document.getElementById("titleDiv").style.display = "block";
}

/**
 * Allows the user to login 
 */
function userLogin() {
    user = document.getElementById("user").value;
    
    if(user == "")
        user = "User";
    
    document.getElementById("usernameDiv").innerHTML = "<span>"+user+"</span>";

    if(localStorage[user] == null)
        localStorage[user] = JSON.stringify({"victories": 0, "games": 0, "points":0});
    
    login = true;

    showGameOptions();
}

/**
 * Shows the gameOptions 
 */
function showGameOptions() {
    if (ingame)
        removeChild(document.getElementById("managerDiv"),7);

    ingame = false;
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";
    document.getElementById("managerDiv").style.display = "block";
    resetDiv(document.getElementById("gameDiv"));
    resetDiv(document.getElementById("gameFinishDiv"));
}

/**
 * Shows the game board 
 */
function showGamePage() {
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("logout").disabled = true;

    ingame = true; 
    let leave = new leaveGameButton();
    document.getElementById("managerDiv").appendChild(leave.element);
    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("gameDiv").style.display = "block";
}

/**
 * Shows game rules
 */
function showRules() {
    if (ingame)
        removeChild(document.getElementById("managerDiv"),7);

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameRulesDiv").style.display = "block";
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
 * Adds the leave button to layout on the game page
 */
function leaveGameButton() {
    this.element = document.createElement("input");

    this.element.type = "button";
    this.element.id = "leaveGame";
    this.element.value = "Leave Game";

    this.element.addEventListener("click", function() {
        let leave = confirm("Are you sure you want to leave?");
        if (leave)
            gameFinish(1,game.ai.depth);
    });
}

/**
 * Shows the leaderboard
 */
function showLeaderboard() {
    let leaderboard = document.getElementById("leaderboardDiv");

    if (ingame)
        removeChild(document.getElementById("managerDiv"),7);

    if (before) 
        removeChild(leaderboard,7);

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";
    
    let finalText = 
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
    
    leaderboard.innerHTML += finalText;
    leaderboard.style.display = "block";
    before = true;
}

/**
 * Shows the end of the game screen
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} depth Difficulty of the game
 */
function gameFinish(player,depth) {
    resetDiv(document.getElementById("gameDiv"));
    removeChild(document.getElementById("managerDiv"),7);
    document.getElementById("logout").disabled = false;
    ingame = false;

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    showGameFinishPage(player,depth);

    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("gameFinishDiv").style.display = "block";
}

/**
 * Adds elements to the div that shows the end of the game.
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} depth Difficulty of the game
 */
function showGameFinishPage(player,depth) {
    let div = document.getElementById("gameFinishDiv");

    if (player == 1) {
        let text = "<h2>You Lost!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        scoreDiv+= "<p>Result factor:                   <bold class='number'>0</br></p>";
        scoreDiv+= "<p>Total points obatined:           <bold class='number'>0</br></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
		json["games"]++;
		localStorage[user] = JSON.stringify(json);
    }
    else if (player == 2) {
        let text = "<h2>You Won!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        scoreDiv+= "<p>Result factor:                   <bold class='number'>1</br></p>";
        scoreDiv+= "<p>Total points obatined:           <bold class='number'>"+depth+"</br></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
        json["games"]++;
        json["victories"]++;
        json["points"]+=depth;
		localStorage[user] = JSON.stringify(json);
    }
    else {
        let text = "<h2>Tied!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        scoreDiv+= "<p>Result factor:                   <bold class='number'>0.5</br></p>";
        scoreDiv+= "<p>Total points obatined:           <bold class='number'>"+0.5*depth+"</br></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[user])
        json["games"]++;
        json["points"]+=depth*0.5;
		localStorage[user] = JSON.stringify(json);
    }

    let playAgainButton = document.createElement("input");

    playAgainButton.type = "button";
    playAgainButton.value = "Play Again";

    playAgainButton.addEventListener("click", function() {
        showGameOptions();
    });

    div.appendChild(playAgainButton);
}

/**
 * Eliminates every element of the board.
 */
function resetDiv(element){
    while (element.firstChild) 
        element.removeChild(element.firstChild);
}

/**
 * Removes leave game button after game finishes.
 */
function removeChild(element, id) {
    element.removeChild(element.childNodes[id]);
}


