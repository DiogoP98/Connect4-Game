"use strict";

var turn; //check who's turn it is. 1 for ai 2 for player
var game;
var color; //color of piece being played
const boardWidthPerColumn = 90;
const boardHeightPerRow = 90;

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

    if (type="ai") {
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

    if (this.firstToPlay == "pc")
        turn = 1;
    else
        turn = 2;
}

/**
 * Creates a new board and setups AI.
 */
SinglePlayerGame.prototype.startGame = function() {
    this.board = new Board(this.columns, this.rows);
    this.board.setupBoard();
    this.ai = new AI(this.difficulty);

    if(turn == 1)
        document.getElementById('turn').innerHTML = "AI's Turn";
    else
        document.getElementById('turn').innerHTML = "Your Turn";
}

/**
 * Checks if the game finished.
 * @return {Boolean} true if the game has finished or false otherwise
 */
SinglePlayerGame.prototype.checkStatus = function() {
    if (this.board.score() == -that.score){
        alert("You have won!");
        return true;
    }

    if (this.board.score() == that.score) {
        alert("You have lost!");
        return true;
    }

    if (this.board.checkFull()) {
        alert("Tie!");
        return true;
    }

    return false;

}

/**
 * Creates an instance of a game board.
 * 
 * @constructor
 * @this {Board}
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 */
function Board(columns, rows) {
    this.columns = columns;
    this.rows = rows;
    this.gameBoard = new Array();
    this.boardDiv;
}

/**
 * Setups the board accordingly with the game settings given by the user.
 */
Board.prototype.setupBoard = function() {
    let turnDiv = document.createElement("div");
    turnDiv.id = "turn";
    this.boardDiv = document.createElement("div");
    this.boardDiv.id = "game-board";
    this.boardDiv.className = "game-board";
    this.boardDiv.style.width = "" + (boardWidthPerColumn*this.columns) + "px";
    this.boardDiv.style.height = "" + (boardHeightPerRow*this.rows) + "px";

    var gameDiv = document.getElementById("gameDiv");
   
    gameDiv.appendChild(turnDiv);
    gameDiv.appendChild(this.boardDiv);

    for (let i = 0; i < this.columns; i++) {
        let columnDiv = document.createElement("div");
        columnDiv.id = "column-" + i;
        columnDiv.className = "column";
        if (i == 0)
            columnDiv.style.marginTop="20px";
        
        if(i != this.columns-1) 
            columnDiv.style.marginRight = "10px";

        document.getElementById("game-board").appendChild(columnDiv);

        //check when the human player clicks on a column
        columnDiv.addEventListener("click", function() {
            if (turn == 1) {
                alert("It's computer's turn.");
                return;
            }
            
            let columnNumber = columnDiv.id.match(/\d+/g)[0];
            let freeRow = game.board.findFirstFreeRow(columnNumber);
            let childDivs = columnDiv.childNodes;

            for (let k = childDivs.length-1; k >=0 ; k--) {
                let row = childDivs[k];
                let rowNumber = row.className.baseVal.match(/\d+/g)[0];
                if (rowNumber == freeRow) {
                    let c = row.childNodes[0];
                    c.className.baseVal = "yellow";
                } 
            }
            game.board.changePositionValue(columnNumber,freeRow);
            turn = 1;
            document.getElementById('turn').innerHTML = "AI's Turn";
        });

        this.gameBoard[i] = new Array();

        for (let j = 0; j < this.rows; j++) {
            let id = this.rows-j-1;

            let NS="http://www.w3.org/2000/svg";   
            let svg=document.createElementNS(NS,"svg");
            
            svg.style.width = "70px";
            svg.style.height = "70px";
            svg.style.marginBottom = "10px";
            svg.className.baseVal = "row-" + id;

            columnDiv.appendChild(svg); 

            svg.innerHTML += '<circle cx="35" cy="35" r="35" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

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
}

/**
 * Determines if situation is finished.
 *
 * @param {number} depth
 * @param {number} score
 * @return {boolean}
 */
Board.prototype.isFinished = function(depth, score) {
    if (depth == 0 || score == this.game.score || score == -this.game.score || this.checkFull()) {
        return true;
    }
    return false;
}

/**
 * Checks if board is full.
 */
Board.prototype.checkFull = function() {
    for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
            if (this.gameBoard[i][j] == 0)
                return -1;
        }
    }

    return 0;
}

Board.prototype.copy = function() {
    var c = new Board(this.columns, this.rows);

    for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
            c.gameBoard[i][j] = this.gameBoard[i][j];
        }
    }

    return c;
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
    if (game.checkStatus() != true) {

        setTimeout(function() {

            // Algorithm call
            var ai_move = that.maximizePlay(this.board, this.depth,Number.MIN_VALUE, Number.MAX_VALUE);

            // Place ai decision
            var j = game.gameBoard.findFirstFreeRow(ai_move[0]);
            game.gameBoard.changePositionValue(ai_move[0],j);
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
    for (let column = 0; column < game.columns; column++) {
        var new_board = board.copy(); // Create new board

        if (new_board.place(column)) {

            var next_move = that.minimizePlay(new_board, depth - 1, alpha, beta); 

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

    for (let column = 0; column < game.columns; column++) {
        var new_board = board.copy();

        if (new_board.place(column)) {

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
