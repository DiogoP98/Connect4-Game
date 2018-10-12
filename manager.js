"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","leaveGame"]
var login;
var ingame;

function userLogin() {
    login = true;

    showGameOptions();
}

function showGameOptions() {
    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";
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
    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("leaveGame").style.display = "block";
    document.getElementById("gameDiv").style.display = "block";
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
