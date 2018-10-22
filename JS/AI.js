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
            this.depth= 7;
            break;
    }
}

/**
 * Makes AI move with AlphaBeta.
 * @param {SinglePlayerGame} game the current game 
 */
AI.prototype.play = function(game) {
    setTimeout(function() {
        console.log(game.ai.depth);
        let ai_move = game.ai.maximizePlay(game.board, game.ai.depth, Number.MIN_VALUE, Number.MAX_VALUE, game.ai);

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
 * @param {AI} ai the game ai instance
 */
AI.prototype.maximizePlay = function(board, depth, alpha, beta,ai) {
    let score = board.score();

    if (board.isFinished(depth, score)) 
        return [null, score];

    let max = [null, -99999];

    for (let column = 0; column < board.columns; column++) {
        let new_board = board.copy();

        let k = new_board.findFirstFreeRow(column);

        if (k != -1) {
            new_board.changePositionValueForAi(column,k,1);

            let next_move = ai.minimizePlay(new_board, depth - 1, alpha, beta,ai); 
               
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

/**
 * Part of the Alpha-beta algorithm. It minimazes a play.
 * 
 * @param {Board} board the current board.
 * @param {Number} depth the depth of the search.
 * @param {number} alpha the smallest value found until now. 
 * @param {number} beta the biggest value found until now. 
 * @param {AI} ai the game ai instance
 */
AI.prototype.minimizePlay = function(board, depth, alpha, beta, ai) {
    let score = board.score();

    if (board.isFinished(depth, score)) 
        return [null, score];

    let min = [null, 99999];

    for (let column = 0; column < game.columns; column++) {
        let new_board = board.copy();

        let k = new_board.findFirstFreeRow(column);

        if (k != -1) {

            new_board.changePositionValueForAi(column,k,2);

            let next_move = ai.maximizePlay(new_board, depth - 1, alpha, beta,ai);

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
