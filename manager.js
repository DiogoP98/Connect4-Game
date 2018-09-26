"use strict";

var divs = ["loginPageDiv","gameOptionsDiv","logoutDiv","titleDiv"]
var login;

function userLogin() {
    login = true;

    showGameOptions();
}

function showGameOptions() {
    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";

    if(login)
        document.getElementById("logoutDiv").style.display = "block";
}

function showLoginPage() {
    login= false;

    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("loginPageDiv").style.display = "block";
    document.getElementById("titleDiv").style.display = "block";
}

function returnToMain() {
    if (!login) {
        showLoginPage();
    }
    else //A melhorar: nao permitir caso o jogo ainda esteja a decorrer
        showGameOptions();

}
