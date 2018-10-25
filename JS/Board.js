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
 * @param {Game} game The current game
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 */
function Board(game ,columns, rows) {
    this.game = game;
    this.columns = columns;
    this.rows = rows;
    this.gameBoard = new Array();
    this.boardDiv;
    this.columnsDivs = [];
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

    const gameDiv = document.getElementById("gameDiv");
   
    gameDiv.appendChild(turnDiv);
    gameDiv.appendChild(this.boardDiv);

    if(turn == 1)
        document.getElementById('turn').innerHTML = "AI's Turn";
    else
        document.getElementById('turn').innerHTML = "Your Turn";

    for (let i = 0; i < this.columns; i++) {
        this.gameBoard[i] = new Array();

        let columnDiv = new Column(i);
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
 * @return {Number} the first freew row. -1 when column is full.
 */
Board.prototype.findFirstFreeRow = function (id) {
    for(let j = 0; j < this.gameBoard[id].length ; j++ ) {
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
    this.gameBoard[i][j] = turn;

    let ended = game.checkStatus();

    const turnDiv = document.getElementById('turn');
    
    if (ended != -1) {
        turnDiv.innerHTML = "Game Ended";
        if (ended != 0)
            this.highlightWinner();
        setTimeout(function() {
            gameFinish(ended, game.ai.depth);
        },3000); 
    }

    else {
        if(turn == 1) {
            turn = 2;
            turnDiv.innerHTML = "Your Turn";
        }
        else {
            turn = 1;
            turnDiv.innerHTML = "AI's Turn";
            game.ai.play(game);
        }
    }
}

/**
 * Changes Position of cell in current board
 * @param {Number} i the number of the column
 * @param {Number} j the number of the row
 * @param {Number} turn which player's turn it is
 */
Board.prototype.changePositionValueForAi = function(i,j, turnAI) {
    this.gameBoard[i][j] = turnAI; 
}

/**
 * Tells the current state of the board on each section of the game board.
 * @param {Number} column the current column
 * @param {Number} row the current row
 * @param {Number} delta_x where to move in the next iteration on x axis.
 * @param {Number} delta_y where to move in the next iteration on y axis
 */
Board.prototype.ScorePerDirection = function(column, row, delta_x, delta_y) {
    let human_points = 0;
    let computer_points = 0;

    let winning_human = [];
    let winning_pc = [];

    for (let i = 0; i < 4; i++) {
        if (this.gameBoard[column][row] == 2) {
            winning_human.push([column, row]);
            human_points++;
        } else if (this.gameBoard[column][row] == 1) {
            winning_pc.push([column, row]);
            computer_points++;
        }

        if (row + delta_y < this.rows)
            row += delta_y;
        if (column + delta_x < this.columns)
            column += delta_x;
    }

    if (human_points == 4) {
        this.game.winning_array = winning_human;
        return -this.game.score;
    } 
    else if (computer_points == 4) {
        this.game.winning_array = winning_pc;
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
            let score = this.ScorePerDirection(j, i, 0, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            vertical_points += score;
        }            
    }

    //vertical search
    for (let i = 0; i<this.columns-3 ; i++ ){
        for (let j = 0; j<this.rows; j++){
            let score = this.ScorePerDirection(i, j, 1, 0);   
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            horizontal_points += score;
        } 
    }

    //ascendingDiagonalCheck 
    for (let i=3; i<this.columns; i++){
        for (let j=0; j<this.rows-3; j++){
            let score = this.ScorePerDirection(i, j, -1, 1);
            if (score == this.game.score) return this.game.score;
            if (score == -this.game.score) return -this.game.score;
            diagonal_points1 += score;
        }            
    }

    // descendingDiagonalCheck
    for (let i=3; i<this.columns; i++){
        for (let j=3; j<this.rows; j++){
            let score = this.ScorePerDirection(i, j, -1, -1);
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
 * @param {number} depth the current search depth
 * @param {number} score the current board score
 * @return {boolean} True if the search ended
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

/**
 * Copies the current board to another
 */
Board.prototype.copy = function() {
    let new_board = new Board(this.game,this.columns, this.rows);

    for (let i = 0; i < this.columns; i++) {
        new_board.gameBoard[i] = new Array();
        for (let j = 0; j < this.rows; j++) {
            new_board.gameBoard[i][j] = this.gameBoard[i][j];
        }
    }

    return c;
}

/**
 * Makes the play, changing the value on game board and css color of the cell.
 * @param {Column} columnDiv the div of the column we want to change.
 * @param {Number} freeRow the number of the free row.
 * @param {Number} columnNumber the number of the column where the play was made.
 */
Board.prototype.play = function(columnDiv, freeRow, columnNumber) {
    let childDivs = columnDiv.childNodes;

    for (let k = childDivs.length-1; k >=0 ; k--) {
        let row = childDivs[k];
        let rowNumber = row.className.baseVal.match(/\d+/g)[0];
        if (rowNumber == freeRow) {
            let child = row.childNodes[0];
            if (turn == 1)
                child.className.baseVal = "yellow";
            else 
                child.className.baseVal = "red";
        } 
    }

    this.changePositionValue(columnNumber,freeRow);
}

/**
 * Highlight winner cells when the game finishes.
 */
Board.prototype.highlightWinner = function() {
    for (let i = 0; i < 4; i++) {
        let columnDiv = document.getElementById("column-"+this.game.winning_array[i][0]);
        let freeRow = this.game.winning_array[i][1];
        let childDivs = columnDiv.childNodes;

        for (let k = childDivs.length-1; k >=0 ; k--) {
            let row = childDivs[k];
            let rowNumber = row.className.baseVal.match(/\d+/g)[0];
            if (rowNumber == freeRow) {
                let c = row.childNodes[0];
                c.className.baseVal += " winner";
            }
        }
    }
}

/**
 * Creates an instance of a Column.
 * 
 * @constructor
 * @param {Number} id The number of the column.
 */
function Column(id) {
    this.id = id;
    this.div = document.createElement("div");
    this.div.id = "column-" + id;
    this.div.className = "column";
    this.div.parent = this;

    if (id == 0) 
        this.div.style.marginTop="20px";
        
    if(id != this.columns-1) 
        this.div.style.marginRight = "10px";

    document.getElementById("game-board").appendChild(this.div);
    this.div.addEventListener("click", this.findPlaceToPlay);
}

Column.prototype.findPlaceToPlay = function() {
    if (turn == 1) {
        alert("It's computer's turn.");
        return;
    }

    let columnNumber = this.id.match(/\d+/g)[0];
    let freeRow = game.board.findFirstFreeRow(columnNumber);

    if (freeRow == -1) {
        alert("Invalid move! Try again.");
        return;
    }

    if (game.checkStatus() == -1)
        game.board.play(this, freeRow, columnNumber);

}

/**
 * Adds a cell to the column.
 * @param {Number} row the number of the row
 */
Column.prototype.addSVG = function(row) {
    let NS="http://www.w3.org/2000/svg";   
    let svg=document.createElementNS(NS,"svg");
            
    svg.style.width = circleWidth + "px";
    svg.style.height = circleHeight + "px";
    svg.style.marginBottom = circleMarginBottom + "px";
    svg.className.baseVal = "row-" + row;

    this.div.appendChild(svg); 

    svg.innerHTML += '<circle cx="35" cy="30" r="30" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

    game.board.gameBoard[this.id].push(0);
}
