"use strict";

var divs = ["loginPageDiv","gameOptionsDiv","logoutDiv"]
var login;

function userLogin() {
    showGameOptions();
}

function showGameOptions() {
    login = true;
    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";
    document.getElementById("logoutDiv").style.display = "block";
}

function showLoginPage() {
    login= false;

    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("loginPageDiv").style.display = "block";
}

function returnToMain() { 
    if (login) {
        showLoginPage();
    }
    else //A melhorar: nao permitir caso o jogo ainda esteja a decorrer
        showGameOptions();

}
