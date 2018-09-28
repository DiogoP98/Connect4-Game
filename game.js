"use strict";

var turn; //check who's turn it is
var game;

function setupBoard() {
    var type = document.getElementById("gameTypeForm").elements["gametype"].value;
    var firstToPlay = document.getElementById("playerorderForm").elements["playerorder"].value;
    var difficulty = document.getElementById("difficultyForm").elements["difficulty"].value;
    var columns = document.getElementById('col').value;
    var lines = document.getElementById('line').value;

    if (type="ai") {
        game = new SinglePlayerGame(firstToPlay, difficulty, columns, lines);
        game.startGame();
    }
}

//Objeto que representa cada buraco do tabuleiro
function boardPiece() {
    document.getElementById("gamingDiv");
}

function SinglePlayerGame(firstToPlay, difficulty, column, line) {
    this.firstToPlay = firstToPlay
    this.difficulty = difficulty;
    this.columns = columns;
    this.lines = lines

    
}
