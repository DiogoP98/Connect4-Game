"use strict";

var divs = ["loginPageDiv","gameOptionsDiv","logoutDiv"]

function userLogin() {
    showGameOptions();
}

function showGameOptions() {
    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("gameOptionsDiv").style.display = "block";
    document.getElementById("logoutDiv").style.display = "block";
}

function showLoginPage() {
    for(var i=0; i<divs.length; i++)
        document.getElementById(divs[i]).style.display = "none";

    document.getElementById("loginPageDiv").style.display = "block";
}
