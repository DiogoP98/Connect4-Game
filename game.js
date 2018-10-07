"use strict";

var turn; //check who's turn it is. 1 for ai 2 for player
var game;
var color; //color of piece being played
var boardHeightPerLine = 80;
var boardWidthPerRow = 75;

/**
 * Reads game information from gameSettings Div and starts a new game. 
 */
function setupGame() {
    var type = document.getElementById("gameTypeForm").elements["gametype"].value;
    var firstToPlay = document.getElementById("playerorderForm").elements["playerorder"].value;
    var difficulty = document.getElementById("difficultyForm").elements["difficulty"].value;
    var rows = document.getElementById('col').value;
    var lines = document.getElementById('line').value;

    if(rows <=3 || lines <=3) {
        alert("Invalid board size");
        return;
    } 

    if (type="ai") {
        game = new SinglePlayerGame(firstToPlay, difficulty, rows, lines);
        resetGameDiv();
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
 * @param {Number} rows The number of rows.
 * @param {Number} lines The number of lines.
 */
function SinglePlayerGame(firstToPlay, difficulty, rows, lines) {
    this.firstToPlay = firstToPlay;
    this.difficulty = difficulty;
    this.rows = rows;
    this.lines = lines;

    if (this.firstToPlay == "pc")
        turn = 1;
    else
        turn = 2;
}

/**
 * Creates a new board and setups AI.
 */
SinglePlayerGame.prototype.startGame = function() {
    this.board = new Board(this.rows, this.lines);
    this.board.setupBoard();
    this.ai = new AI(this.difficulty);
}

/**
 * Checks if the game finished.
 */
SinglePlayerGame.prototype.checkStatus = function() {
    if (this.board.score() == -that.score)
        alert("You have won!");

    // Computer won
    if (that.board.score() == that.score) 
        alert("You have lost!");

    // Tie
    if (this.checkFull())
        alert("Tie!");

}

/**
 * Creates an instance of a game board.
 * 
 * @constructor
 * @this {Board}
 * @param {Number} rows The number of rows.
 * @param {Number} lines The number of lines.
 */
function Board(rows, lines) {
    this.rows = rows;
    this.lines = lines;
    this.gameBoard = new Array();
    this.boardDiv;
}

/**
 * Setups the board accordingly with the game settings given by the user.
 */
Board.prototype.setupBoard = function() {
    this.boardDiv = document.createElement("div");
    this.boardDiv.id = "game-board";
    this.boardDiv.className = "game-board";
    this.boardDiv.style.width = "" + (boardWidthPerRow*this.rows) + "px";
    this.boardDiv.style.height = "" + (boardHeightPerLine*this.lines) + "px";

    var gameDiv = document.getElementById("gameDiv");
    //gameDiv.style.marginTop = "" + (50*(8-this.lines)) + "px";
    gameDiv.appendChild(this.boardDiv);

    for (var i = 0; i < this.rows; i++) {
        var columnDiv = document.createElement("div");
        columnDiv.id = "column-" + i;
        columnDiv.className = "column";
        if (i == 0)
            columnDiv.style.marginTop="10px";

        document.getElementById("game-board").appendChild(columnDiv);

        columnDiv.addEventListener("click", function() {
            var columnNumber = this.id.match(/\d+/g)[0];
            var freeRow = game.board.findFirstFreeRow(columnNumber);
            var childDivs = this.childNodes;
            for (var k = childDivs.length-1; k >=0 ; k--) {
                var row = childDivs[k];
                var rowNumber = row.className.baseVal.match(/\d+/g)[0];
                if (rowNumber == freeRow) {
                    var c = row.childNodes[0];
                    c.className.baseVal = "yellow";
                } 
            }
            game.board.changePositionValue(columnNumber,freeRow);
            turn = 1;
        });
        
        this.gameBoard[i] = new Array();

        for (var j = 0; j < this.lines; j++) {
            var id = this.lines-j-1;

            var NS="http://www.w3.org/2000/svg";   
            var svg=document.createElementNS(NS,"svg");
            
            svg.style.width = "90px";
            svg.style.height = "70px";
            svg.className.baseVal = "row-" + id;

            columnDiv.appendChild(svg); 

            svg.innerHTML += '<circle cx="30" cy="40" r="30" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

            this.gameBoard[i].push(0);
         }
    }
}

/**
 * Finds the first free row of a certain column.
 * 
 * @param {Number} id the column which we want to search.
 */
Board.prototype.findFirstFreeRow = function (id) {
    for(var j = 0; j < this.gameBoard[id].length ; j++ ) {
        if (this.gameBoard[id][j] == 0)
            return j;
    }
}

/**
 * Changes the value of the place where it was placed the new piece.
 * 
 * @param {Number} i Column in which the piece was placed
 * @param {Number} j Row in which the piece was placed
 */
Board.prototype.changePositionValue = function(i,j) {
    this.gameBoard[i][j] = turn;
}

/**
 * Analysis the board and gives a score accordingly.
 */
Board.prototype.score = function() {
    if (this.board.score() == -that.score)
        alert("You have won!");

    // Computer won
    if (that.board.score() == that.score) 
        alert("You have lost!");

    // Tie
    if (this.checkFull())
        alert("Tie!");
}

/**
 * Determines if situation is finished.
 *
 * @param {number} depth
 * @param {number} score
 * @return {boolean}
 */
Board.prototype.isFinished = function(depth, score) {
    if (depth == 0 || score == this.game.score || score == -this.game.score || this.isFull()) {
        return true;
    }
    return false;
}

/**
 * Checks if board is full.
 */
Board.prototype.checkFull = function() {
    for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.lines; j++) {
            if (this.gameBoard[i][j] == 0)
                return -1;
        }
    }

    return 0;
}

/**
 * Creates an instace from AI.
 * 
 * @constructor
 * @this {AI}
 * @param {String} difficulty identifies the difficulty of the game
 */
function AI(difficulty) {
    switch(difficulty) {
        case "easy":
            this.depth= 2;
            break;
        
        case "medium": 
            this.depth= 4;
            break;

        case "hard":
            this.depth= 6;
            break;

        case "legendary":
            this.depth= 8;
            break;
    }
}

/**
 * Makes AI move.
 */
AI.prototype.play = function() {
    if (game.checkStatus != 0) {

        setTimeout(function() {

            // Algorithm call
            var ai_move = that.maximizePlay(this.board, this.depth,Number.MIN_VALUE, Number.MAX_VALUE);

            // Place ai decision
            that.place(ai_move[0]);

            // Debug
            document.getElementById('ai-column').innerHTML = 'Column: ' + parseInt(ai_move[0] + 1);
            document.getElementById('ai-score').innerHTML = 'Score: ' + ai_move[1];
            document.getElementById('ai-iterations').innerHTML = that.iterations;

            document.getElementById('loading').style.display = "none"; // Remove loading message
        }, 100);   
    }
}

/**
 * Part of the Alpha-beta algorithm. It maximizes a play.
 * 
 * @param {Board} board the current board.
 * @param {Number} depth the depth of the search.
 * @param {number} alpha the smallest value found until now. 
 * @param {number} beta the biggest value found until now. 
 */
AI.prototype.maximizePlay = function(board, depth, alpha, beta) {
    // Call score of our board
    var score = board.score();

    // Break
    if (board.isFinished(depth, score)) return [null, score];

    // Column, Score
    var max = [null, -99999];

    // For all possible moves
    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy(); // Create new board

        if (new_board.place(column)) {

            that.iterations++; // Debug

            var next_move = that.minimizePlay(new_board, depth - 1, alpha, beta); // Recursive calling

            // Evaluate new move
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) return max;
        }
    }

    return max;
}

AI.prototype.minimizePlay = function(board, depth, alpha, beta) {
    var score = board.score();

    if (board.isFinished(depth, score)) return [null, score];

    // Column, score
    var min = [null, 99999];

    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();

        if (new_board.place(column)) {

            that.iterations++;

            var next_move = that.maximizePlay(new_board, depth - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            if (alpha >= beta) return min;

        }
    }
    return min;
}

function resetGameDiv(){
    var elem = document.getElementById("gameDiv");
    while (elem.firstChild)
        elem.removeChild(elem.firstChild);
}
