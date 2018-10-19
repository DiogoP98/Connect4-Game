"use strict";

var game;

/**
 * Reads game information from gameSettings Div and starts a new game. 
 */
function setupGame() {
    let type = document.getElementById("gameTypeForm").elements["gametype"].value;
    let firstToPlay = document.getElementById("playerorderForm").elements["playerorder"].value;
    let difficulty = document.getElementById("difficultyForm").elements["difficulty"].value;
    let size = document.getElementById("sizeForm").elements["size"].value;
    let columns = size.charAt(0);
    let rows = size.charAt(2);

    if (type == "ai") {
        game = new SinglePlayerGame(firstToPlay, difficulty, columns, rows);
        showGamePage();
        game.startGame();
    }
}

/**
 * Creates an instance of a single player game.
 * 
 * @constructor
 * @this {SinglePlayerGame}
 * @param {String} firstToPlay The person that starts the game. 
 * @param {Number} difficulty The level of difficulty.
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 */
function SinglePlayerGame(firstToPlay, difficulty, columns, rows) {
    this.firstToPlay = firstToPlay;
    this.difficulty = difficulty;
    this.columns = columns;
    this.rows = rows;
    this.score = 100000;
    this.winning_array = [];
}

/**
 * Creates a new board and setups AI.
 */
SinglePlayerGame.prototype.startGame = function() {
    this.board = new Board(this, this.columns, this.rows, this.firstToPlay);
    this.board.setupBoard();
    this.ai = new AI(this.difficulty);
}

/**
 * Checks if the game finished.
 * @return {Boolean} true if the game has finished or false otherwise
 */
SinglePlayerGame.prototype.checkStatus = function() {
    if (this.board.score() == -this.score){
        alert("You have won!");
        return true;
    }

    if (this.board.score() == this.score) {
        alert("You have lost!");
        return true;
    }

    if (this.board.checkFull()) {
        alert("Tie!");
        return true;
    }

    return false;

}

function resetGameDiv(){
    var elem = document.getElementById("gameDiv");
    while (elem.firstChild)
        elem.removeChild(elem.firstChild);
}
