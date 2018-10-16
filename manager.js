"use strict";

const divs = ["loginPageDiv","gameOptionsDiv","managerDiv","titleDiv","gameDiv","gameRulesDiv"]
var login;
var ingame;

function userLogin() {
    login = true;

    showGameOptions();
}

function showGameOptions() {
    if (ingame)
        removeChild(document.getElementById("managerDiv"));

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
    document.getElementById("managerDiv").style.marginTop = "-40px";  
    let leave = new leaveGameButton();
    document.getElementById("managerDiv").appendChild(leave.element);
    document.getElementById("managerDiv").style.display = "block";
    document.getElementById("gameDiv").style.display = "block";
}

function showRules() {
    if (ingame)
        removeChild(document.getElementById("managerDiv"));

    for(let i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameRulesDiv").style.display = "block";
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

function removeChild(element) {  
    element.removeChild(element.childNodes[7]);
}


