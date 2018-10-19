"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","gameRulesDiv","leaderboardDiv"];
var login;
var ingame;

/**
 * Shows login box, with the game name on top
 */
function showLoginPage() {
    login= false;
    ingame = false;

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("loginPageDiv").style.display = "block";
    document.getElementById("titleDiv").style.display = "block";
}

/**
 * Allows the user to login 
 */
function userLogin() {
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
    resetGameDiv();
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
        if (leave) {
            alert("You've left the game. You lose.");
            showGameOptions();
        }
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

    document.getElementById("leaderboardDiv").style.display = "block";
}

/**
 * Removes leave game button after game finishes.
 */
function removeChild(element) {  
    element.removeChild(element.childNodes[7]);
}


