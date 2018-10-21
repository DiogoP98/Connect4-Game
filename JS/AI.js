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
            this.depth= 1;
            break;
        
        case "medium": 
            this.depth= 3;
            break;

        case "hard":
            this.depth= 5;
            break;

        case "legendary":
            this.depth= 6;
            break;
    }
}

/**
 * Makes AI move.
 */
AI.prototype.play = function(game) {
    setTimeout(function() {
    // Algorithm call

    let ai_move = game.ai.maximizePlay(game.board, game.ai.depth, Number.MIN_VALUE, Number.MAX_VALUE, game.ai);

    // Place ai decision
    let j = game.board.findFirstFreeRow(ai_move[0]);
            
    game.board.play(game.board.columnsDivs[ai_move[0]], j, ai_move[0]); 

    }, 100);
}

/**
 * Part of the Alpha-beta algorithm. It maximizes a play.
 * 
 * @param {Board} board the current board.
 * @param {Number} depth the depth of the search.
 * @param {number} alpha the smallest value found until now. 
 * @param {number} beta the biggest value found until now. 
 */
AI.prototype.maximizePlay = function(board, depth, alpha, beta,ai) {
    // Call score of our board
    let string = "";
    for(let i = 0; i < board.columns; i++ ) {
        for(let j = 0; j < board.rows; j++ ) {
            string += board.gameBoard[i][j] + " ";
        }
        string += "\n";
    }

    console.log(string);
    let score = board.score();
    console.log(score);
    // Break
    if (board.isFinished(depth, score)) 
        return [null, score];

    // Column, Score
    var max = [null, -99999];

    // For all possible moves
    for (let column = 0; column < board.columns; column++) {
        let new_board = board.copy(); // Create new board

        let k = new_board.findFirstFreeRow(column);

        if (k != -1) {
            new_board.changePositionValueForAi(column,k,1);

            var next_move = ai.minimizePlay(new_board, depth - 1, alpha, beta,ai); 
            //console.log("max: " + next_move+ "    " + max);
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

AI.prototype.minimizePlay = function(board, depth, alpha, beta, ai) {
    let score = board.score();

    if (board.isFinished(depth, score)) 
        return [null, score];

    // Column, score
    let min = [null, 99999];

    for (let column = 0; column < game.columns; column++) {
        let new_board = board.copy();

        let k = new_board.findFirstFreeRow(column);

        if (k != -1) {

            new_board.changePositionValueForAi(column,k,2);

            let next_move = ai.maximizePlay(new_board, depth - 1, alpha, beta,ai);

            //console.log("min: " + next_move + "    " + min);

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
