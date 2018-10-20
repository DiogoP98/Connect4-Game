"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","gameRulesDiv","leaderboardDiv", "gameFinishDiv"];
var login;
var ingame;
var user;

/**
 * Shows login box, with the game name on top
 */
function showLoginPage() {
    login= false;
    ingame = false;

    resetDiv(document.getElementById("gameDiv"));
    resetDiv(document.getElementById("gameFinishDiv"));
    resetDiv(document.getElementById("usernameDiv"));

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
    
    document.getElementById("usernameDiv").innerHTML += "<span>"+user+"</span>";

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
        removeChild(document.getElementById("managerDiv"));

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
        removeChild(document.getElementById("managerDiv"));

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
            gameFinish(1);
    });
}

/**
 * Shows the leaderboard
 */
function showLeaderboard() {
    if (ingame)
        removeChild(document.getElementById("managerDiv"));

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    var finalText = 
			"<table id='players'>" +
				"<tr>" +
					"<th>Player</th>" +
					"<th>Games Played</th>" +
					"<th>W/L Ratio</th>" +
					"<th>Points</th>" +
				"</tr>";
	for(var i=0; i<localStorage.length; i++){
        var jsonUser = localStorage.key(i);
        console.log(jsonUser);
		var json = JSON.parse(localStorage.getItem(localStorage.key(i)));
		finalText += 
			"<tr>" +
				"<td>" + jsonUser + "</td>" +
				"<td>" + json.games + "</td>" +
				"<td>" + json.victories + "</td>" +
				"<td>" + json.points + "</td>";
		finalText += "</tr>";
	}
	finalText += "</table>"
    
    console.log(finalText);
    document.getElementById("leaderboardDiv").innerHTML = finalText;

    document.getElementById("leaderboardDiv").style.display = "block";
}

function gameFinish(player,depth) {
    resetDiv(document.getElementById("gameDiv"));
    ingame = false;



    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    removeChild(document.getElementById("managerDiv"));
    addFinishSpans(player,depth);
    changeJSON();
    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("gameFinishDiv").style.display = "block";
}

function addFinishSpans(player,depth) {
    let div = document.getElementById("gameFinishDiv");
    console.log(depth);
    if (player == 1) {
        div.innerHTML += "<h2>You Lost!</h2>";
        div.innerHTML += "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        div.innerHTML += "<p>Result factor:                   <bold class='number'>0</br></p>";
        div.innerHTML += "<p>Total points obatined:           <bold class='number'>0</br></p>";
        var json = JSON.parse(localStorage[user])
		json["games"]++;
		localStorage[user] = JSON.stringify(json);
    }
    else if (player == 2) {
        div.innerHTML += "<h2>You Won!</h2>";
        div.innerHTML += "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        div.innerHTML += "<p>Result factor:                   <bold class='number'>1</br></p>";
        div.innerHTML += "<p>Total points obatined:           <bold class='number'>"+depth+"</br></p>";
        var json = JSON.parse(localStorage[user])
        json["games"]++;
        json["victories"]++;
        json["points"]+=depth;
		localStorage[user] = JSON.stringify(json);
    }
    else {
        div.innerHTML += "<h2>Tied!</h2>";
        div.innerHTML += "<p>Difficulty of the AI:            <bold class='number'>"+ depth+"</bold></p>";
        div.innerHTML += "<p>Result factor:                   <bold class='number'>0.5</br></p>";
        div.innerHTML += "<p>Total points obatined:           <bold class='number'>"+depth*0.5+"</br></p>";
        var json = JSON.parse(localStorage[user])
        json["games"]++;
        json["points"]+=depth*0.5;
		localStorage[user] = JSON.stringify(json);
    }

}

function changeJSON() {

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
function removeChild(element) {  
    element.removeChild(element.childNodes[7]);
}


