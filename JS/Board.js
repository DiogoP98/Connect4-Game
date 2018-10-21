"use strict"

const boardWidthPerColumn = 80;
const boardHeightPerRow = 80;
const circleWidth = 65;
const circleHeight = 65;
const circleMarginBottom = 7;

/**
 * Creates an instance of a game board.
 * 
 * @constructor
 * @this {Board}
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 * @param {String} firstToPlay Teh first player to play
 */
function Board(game ,columns, rows, firstToPlay) {
    this.game = game;
    this.columns = columns;
    this.rows = rows;
    this.gameBoard = new Array();
    this.boardDiv;
    this.turn;
    this.columnsDivs = [];

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
        this.columnsDivs[i] = columnDiv.div;

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

    let ended = game.checkStatus();
    
    if (ended != -1) {
        document.getElementById('turn').innerHTML = "Game Ended";
        setTimeout(function() {
            gameFinish(ended, game.ai.depth);
        },5000); 
    }

    else {
        if(this.turn == 1) {
            this.turn = 2;
            document.getElementById('turn').innerHTML = "Your Turn";
        }
        else {
            this.turn = 1;
            document.getElementById('turn').innerHTML = "AI's Turn";
            game.ai.play(game);
        }
    }
}

Board.prototype.changePositionValueForAi = function(i,j, turnAI) {
    this.gameBoard[i][j] = turnAI; 
}

Board.prototype.scorePosition = function(column, row, delta_x, delta_y) {
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) {
        if (this.gameBoard[column][row] == 2) {
            this.game.winning_array_human.push([column, row]);
            human_points++; // Add for each human chip
        } else if (this.gameBoard[column][row] == 1) {
            this.game.winning_array_cpu.push([column, row]);
            computer_points++; // Add for each computer chip
        }

        // Moving through our board
        if (row + delta_y < this.rows)
            row += delta_y;
        if (column + delta_x < this.columns)
            column += delta_x;
    }
    
    // Marking winning/returning score

    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        return -this.game.score;
    } 
    else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        return this.game.score;
    } 
    else
        return computer_points;
}


/**
 * Analysis the board and gives a score accordingly.
 */
Board.prototype.score = function() {
    let points = 0;

    let vertical_points = 0;
    let horizontal_points = 0;
    let diagonal_points1 = 0;
    let diagonal_points2 = 0;

    //horizontal check
    for (let i = 0; i<this.rows-3 ; i++ ){
        for (let j = 0; j<this.columns; j++){
            let score = this.scorePosition(j, i, 0, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            vertical_points += score;
        }            
    }

    //vertical search
    for (let i = 0; i<this.columns-3 ; i++ ){
        for (let j = 0; j<this.rows; j++){
            let score = this.scorePosition(i, j, 1, 0);   
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            horizontal_points += score;
        } 
    }

    //ascendingDiagonalCheck 
    for (let i=3; i<this.columns; i++){
        for (let j=0; j<this.rows-3; j++){
            let score = this.scorePosition(i, j, -1, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points1 += score;
        }            
    }

    // descendingDiagonalCheck
    for (let i=3; i<this.columns; i++){
        for (let j=3; j<this.rows; j++){
            let score = this.scorePosition(i, j, -1, -1);
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
    for (let i = 0; i < this.columns; i++) {
        for (let j = 0; j < this.rows; j++) {
            if (this.gameBoard[i][j] == 0)
                return false;
        }
    }

    return true;
}

Board.prototype.copy = function() {
    let c = new Board(this.game,this.columns, this.rows, this.turn);

    for (let i = 0; i < this.columns; i++) {
        c.gameBoard[i] = new Array();
        for (let j = 0; j < this.rows; j++) {
            c.gameBoard[i][j] = this.gameBoard[i][j];
        }
    }

    return c;
}

function Column(id, turn) {
    this.id = id;
    this.div = document.createElement("div");
    this.div.id = "column-" + id;
    this.div.className = "column";
    this.div.parent = this;
    this.turn = turn;

    if (id == 0) 
        this.div.style.marginTop="20px";
        
    if(id != this.columns-1) 
        this.div.style.marginRight = "10px";

    document.getElementById("game-board").appendChild(this.div);
    this.div.addEventListener("click", this.findPlaceToPlay);
}

Column.prototype.findPlaceToPlay = function() {
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

    game.board.play(this, freeRow, columnNumber);
}

Board.prototype.play = function(columnDiv, freeRow, columnNumber) {
    let childDivs = columnDiv.childNodes;

    for (let k = childDivs.length-1; k >=0 ; k--) {
        let row = childDivs[k];
        let rowNumber = row.className.baseVal.match(/\d+/g)[0];
        if (rowNumber == freeRow) {
            let c = row.childNodes[0];
            if (this.turn == 1)
                c.className.baseVal = "yellow";
            else 
                c.className.baseVal = "red";
        } 
    }

    this.changePositionValue(columnNumber,freeRow);
}

Column.prototype.addSVG = function(id) {
    let NS="http://www.w3.org/2000/svg";   
    let svg=document.createElementNS(NS,"svg");
            
    svg.style.width = circleWidth + "px";
    svg.style.height = circleHeight + "px";
    svg.style.marginBottom = circleMarginBottom + "px";
    svg.className.baseVal = "row-" + id;

    this.div.appendChild(svg); 

    svg.innerHTML += '<circle cx="35" cy="30" r="30" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

    game.board.gameBoard[this.id].push(0);
}
