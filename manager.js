"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","leaveGame","gameRulesDiv", "turn"]
var login;
var ingame;

function userLogin() {
    login = true;

    showGameOptions();
}

function showGameOptions() {
    ingame = false;
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";
    document.getElementById("managerDiv").style.marginTop = "-40px"; 
    document.getElementById("managerDiv").style.display = "block";
    resetGameDiv();
}

function showLoginPage() {
    login= false;
    ingame = false;

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("loginPageDiv").style.display = "block";
    document.getElementById("titleDiv").style.display = "block";
}

function showGamePage() {
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    ingame = true;
    document.getElementById("managerDiv").style.marginTop = "-80px";  
    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("leaveGame").style.display = "block";
    document.getElementById("gameDiv").style.display = "block";
    document.getElementById("turn").style.display = "block";
}

function showRules() {
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameRulesDiv").style.display = "block";
    if (login)
        document.getElementById("managerDiv").style.display = "block";
}

function leaveGame() {
    alert("You've left the game. The computer won.");
    showGameOptions();
}

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
