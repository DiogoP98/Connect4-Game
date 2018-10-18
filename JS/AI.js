"use strict";

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
            var ai_move = this.maximizePlay(this.board, this.depth,Number.MIN_VALUE, Number.MAX_VALUE);

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
    let score = board.score();

    // Break
    if (board.isFinished(depth, score)) return [null, score];

    // Column, Score
    var max = [null, -99999];

    // For all possible moves
    for (let column = 0; column < game.columns; column++) {
        let new_board = board.copy(); // Create new board

        let k = new_board.findFirstFreeRow(column);
        if (k != -1) {
            new_board.changePositionValue(column,k);

            var next_move = this.minimizePlay(new_board, depth - 1, alpha, beta); 

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
        let new_board = board.copy();

        let k = new_board.findFirstFreeRow(column);

        if (k != -1) {

            new_board.changePositionValue(column,k);

            var next_move = this.maximizePlay(new_board, depth - 1, alpha, beta);

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
