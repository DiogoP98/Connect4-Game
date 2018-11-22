"use strict";

var game;
var turn;
var gameInProgress;

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
        game = new Connect4Game(firstToPlay, difficulty, columns, rows,0);
        showGamePage();
        game.startGame();
    }

    else {
        game = new Connect4Game(firstToPlay, difficulty, columns, rows,1);
        showGamePage();
        game.setupBoard();
        game.createConnection();
        game.joinGame();
        //game.cancelMatchMaking();
    }
}

/**
 * Creates an instance of a single player game.
 * 
 * @constructor
 * @this {Connect4Game}
 * @param {String} firstToPlay The person that starts the game. 
 * @param {Number} difficulty The level of difficulty.
 * @param {Number} columns The number of columns.
 * @param {Number} rows The number of rows.
 * @param {Number} type Check if is is singleplayer or multiplayer
 */
function Connect4Game(firstToPlay, difficulty, columns, rows, type) {
    this.type = type;
    if(this.type == 0) {
        this.firstToPlay = firstToPlay;
        this.difficulty = difficulty;
        this.columns = columns;
        this.rows = rows;
        this.score = 100000;
        this.winning_array = [];

        if (firstToPlay == "pc") 
            turn = 1;
        else
            turn = 2;
    }

    else {
        this.columns = columns;
        this.rows = rows;
        this.groupNumber = 33;
        this.winning_array = [];
        this.gameID;
    }
}

/*--------------------- Singleplayer Functions -------------------------*/

/**
 * Creates a new board and setups AI.
 */
Connect4Game.prototype.startGame = function() {
    this.board = new Board(this, this.columns, this.rows);
    this.board.setupBoard();
    this.ai = new AI(this.difficulty);
    if (turn == 1)
        this.ai.play(this);
}

/**
 * Checks if the game finished.
 * @return {Boolean} true if the game has finished or false otherwise
 */
Connect4Game.prototype.checkStatus = function() {
    if (this.board.score() == -this.score)
        return 2;

    if (this.board.score() == this.score)
        return 1;

    if (this.board.checkFull())
        return 0;

    return -1;
}

/*--------------------- Multiplayer Functions -------------------------*/

Connect4Game.prototype.setupBoard = function() {
    this.board = new Board(this, this.columns, this.rows);
    this.board.setupBoard();
}

Connect4Game.prototype.createConnection = function(){
    var gameContent = document.getElementById("gameDiv");
	this.spanner = document.createElement('div');
	var prompt = document.createElement('div');
	var title = document.createElement('h2');
    var subtitle = document.createElement('h3');
    let button = document.createElement('input');
    var context = this;
    
	button.addEventListener('click', function() {
		context.cancelMatchMaking();
    }, false);

	subtitle.id = "promptH3";
	subtitle.innerHTML = "Your group id: "+ this.groupNumber;
	title.id = "promptH2";
	title.innerHTML = "Waiting for opponent";
	this.spanner.className = "spanner";
    prompt.id = "prompt";
    
    button.type = 'button';
    button.value = 'Cancel matchmaking';
	prompt.appendChild(title);
	prompt.appendChild(subtitle);
	prompt.appendChild(button);
	this.spanner.appendChild(prompt);
    gameContent.appendChild(this.spanner);
}

Connect4Game.prototype.cancelMatchMaking = function(){
    let js_obj = {"nick": loginInfo.user, "pass": loginInfo.password, "game": this.gameID};
    
    makeRequestFetch(JSON.stringify(js_obj), "leave")
    .then(function(response){
        gameInProgress = false;
        //console.log(response);
        showGameOptions();
    })
    .catch(console.log);
}

Connect4Game.prototype.joinGame = function(){
    let js_obj = {"group": this.groupNumber, "nick": loginInfo.user, "pass": loginInfo.password, "size": { "rows": Number(this.rows), "columns": Number(this.columns)} };

	makeRequestFetch(JSON.stringify(js_obj), "join")
    .then(function(response){
        if(response.ok) {
            return response.json()
            .then(function(json) {
                game.gameID = json.game;
                gameInProgress = true;
                game.openServerEventListener();
            })
        }

        else {
            console.log(response.text());
            showGameOptions();
        }

    })
    .catch(console.log);
}

Connect4Game.prototype.openServerEventListener = function() {
    this.eventSource = new EventSource(`http://${host}:${port}/update?nick=${loginInfo.user}&game=${this.gameID}`);

    this.eventSource.onmessage = function(event) {
        console.log(event);
    }
}
/** 
//we wait for updates to do stuff
this.eventSource = new EventSource(`http://${host}:${port}/update?nick=${this.userName}&game=${gameId}`);
var context = this;
this.eventSource.onmessage = function(event) {
    console.log("RECEIVED AN UPDATE!")
    console.log(event)
    if(event.data == "{}")
        return
    if(!this.isConnected){
        //here we let the user know somebody is ready to play.
            this.isConnected = true;
            context.toggleConnecting();		
    }

    var data = JSON.parse(event.data);
    context.onReceiveUpdate(data);
}
*/
