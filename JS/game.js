"use strict";

var game;
const boardWidthPerColumn = 80;
const boardHeightPerRow = 70;
const circleWidth = 60;
const circleHeight = 55;
const circleMarginBottom = 7;

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

/**
 * Creates an instance of a game board.
 * 
 * @constructor
 * @this {Board}
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 * @param {String} firstToPlay Teh first player to play
 */
function Board(game,columns, rows, firstToPlay) {
    this.game = game;
    this.columns = columns;
    this.rows = rows;
    this.gameBoard = new Array();
    this.boardDiv;
    this.turn;

    if (firstToPlay == "pc") 
        this.turn = 1;
    else
        this.turn = 2;

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

    if(this.turn == 1)
        document.getElementById('turn').innerHTML = "AI's Turn";
    else
        document.getElementById('turn').innerHTML = "Your Turn";


    for (let i = 0; i < this.columns; i++) {

        this.gameBoard[i] = new Array();
        let columnDiv = new Column(i, this.turn);

        for (let j = 0; j < this.rows; j++) {
            let id = this.rows-j-1;

            columnDiv.addSVG(id);
         }
    }
}

/**
 * Finds the first free row of a certain column.
 * 
 * @param {Number} id the column which we want to search.
 */
Board.prototype.findFirstFreeRow = function (id) {
    console.log(id);
    for(var j = 0; j < this.gameBoard[id].length ; j++ ) {
        if (this.gameBoard[id][j] == 0)
            return j;
    }

    return -1;
}

/**
 * Changes the value of the place where it was placed the new piece.
 * 
 * @param {Number} i Column in which the piece was placed
 * @param {Number} j Row in which the piece was placed
 */
Board.prototype.changePositionValue = function(i,j) {
    this.gameBoard[i][j] = this.turn;
    
    if(this.turn == 1)
        this.turn = 2;
    else
        this.turn = 1;
}

Board.prototype.scorePosition = function(row, column, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    console.log("here");
    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) {
        if (this.gameBoard[row][column] == 0) {
            this.game.winning_array_human.push([row, column]);
            human_points++; // Add for each human chip
        } else if (this.gameBoard[row][column] == 1) {
            this.game.winning_array_cpu.push([row, column]);
            computer_points++; // Add for each computer chip
        }

        // Moving through our board
        row += delta_y;
        column += delta_x;
    }

    console.log("here2");
    // Marking winning/returning score
    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        // Computer won (100000)
        return -this.game.score;
    } else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        // Human won (-100000)
        return this.game.score;
    } else {
        // Return normal points
        return computer_points;
    }
}


/**
 * Analysis the board and gives a score accordingly.
 */
Board.prototype.score = function() {
    var points = 0;

    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    for (var row = 0; row < this.game.rows - 3; row++) {
        for (var column = 0; column < this.game.columns; column++) {
            var score = this.scorePosition(row, column, 1, 0);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            vertical_points += score;
        }            
    }

    for (var row = 0; row < this.game.rows; row++) {
        for (var column = 0; column < this.game.columns - 3; column++) { 
            var score = this.scorePosition(row, column, 0, 1);   
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            horizontal_points += score;
        } 
    }

    for (var row = 0; row < this.game.rows - 3; row++) {
        for (var column = 0; column < this.game.columns - 3; column++) {
            var score = this.scorePosition(row, column, 1, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points1 += score;
        }            
    }

    for (var row = 3; row < this.game.rows; row++) {
        for (var column = 0; column <= this.game.columns - 4; column++) {
            var score = this.scorePosition(row, column, -1, +1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points2 += score;
        }

    }

    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
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

    return new Board(this.game, c, this.turn);
}

function Column(id, turn) {
    this.id = id;
    this.div = document.createElement("div");
    this.div.id = "column-" + id;
    this.div.className = "column";
    this.turn = turn;
    if (id == 0)
        this.div.style.marginTop="20px";
        
    if(id != this.columns-1) 
        this.div.style.marginRight = "10px";

    document.getElementById("game-board").appendChild(this.div);
    this.div.addEventListener("click", this.play);
}

Column.prototype.play = function() {
    if (this.turn == 1) {
        alert("It's computer's turn.");
        return;
    }
    
    let columnNumber = this.id.match(/\d+/g)[0];
    let freeRow = game.board.findFirstFreeRow(columnNumber);

    if (freeRow == -1) {
        alert("Invalid move! Try again.");
        return;
    }

    let childDivs = this.childNodes;

    for (let k = childDivs.length-1; k >=0 ; k--) {
        let row = childDivs[k];
        let rowNumber = row.className.baseVal.match(/\d+/g)[0];
        if (rowNumber == freeRow) {
            let c = row.childNodes[0];
            c.className.baseVal = "yellow";
        } 
    }
    game.board.changePositionValue(columnNumber,freeRow);
    document.getElementById('turn').innerHTML = "AI's Turn";
    game.ai.play();
}

Column.prototype.addSVG = function(id) {
    let NS="http://www.w3.org/2000/svg";   
    let svg=document.createElementNS(NS,"svg");
            
    svg.style.width = circleWidth + "px";
    svg.style.height = circleHeight + "px";
    svg.style.marginBottom = circleMarginBottom + "px";
    svg.className.baseVal = "row-" + id;

    this.div.appendChild(svg); 

    svg.innerHTML += '<circle cx="27" cy="27" r="27" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

    game.board.gameBoard[this.id].push(0);
}

function resetGameDiv(){
    var elem = document.getElementById("gameDiv");
    while (elem.firstChild)
        elem.removeChild(elem.firstChild);
}
