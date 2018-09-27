"use strict";


var type; //AI or pvp
var turn; //check who's turn it is
var difficulty; //difficulty of the game
var column; //column size
var line; //line size


function setupGame() {
    type = document.getElementById("gameTypeForm").elements["gametype"].value;
    turn = document.getElementById("playerorderForm").elements["playerorder"].value;
    difficulty = document.getElementById("difficultyForm").elements["difficulty"].value;
    column = document.getElementById('col').value;
    line = document.getElementById('line').value;

    if (column == "" || line == "")
        alert('Please insert all the information');
    else
        showGamePage(column, line);
}
