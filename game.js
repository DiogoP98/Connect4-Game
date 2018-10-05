"use strict";

var turn; //check who's turn it is. 1 for ai 2 for player
var game;
var color; //color of piece being played
var boardHeightPerLine = 80;
var boardWidthPerRow = 75;

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

SinglePlayerGame.prototype.startGame = function() {
    this.board = new Board(this.rows, this.lines);
    this.board.setupBoard();
    this.ai = new AI(this.difficulty);
}

function Board(rows, lines) {
    this.rows = rows;
    this.lines = lines;
    this.gameBoard = new Array();
    this.boardDiv;
}

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

Board.prototype.findFirstFreeRow = function (id) {
    for(var j = 0; j < this.gameBoard[id].length ; j++ ) {
        if (this.gameBoard[id][j] == 0)
            return j;
    }
}

Board.prototype.changePositionValue = function(i,j) {
    this.gameBoard[i][j] = turn;
}

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

AI.prototype.play = function() {

}

function Disc() {
    this.player = turn;
    this.color = player == 1 ? 'red' : 'yellow';

    this.addToScene = function(){
        board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>';
        if(currentPlayer==2){
          //computer move
          var possibleMoves = think();
          var cpuMove = Math.floor( Math.random() * possibleMoves.length);
          currentCol = possibleMoves[cpuMove];
          document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px";
          dropDisc(this.id,currentPlayer);
        }
    }

    var $this = this;
    document.onmousemove = function(evt){
        if(currentPlayer == 1){
        currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
        if(currentCol<0){
            currentCol=0;
        }
        if(currentCol>6){
            currentCol=6;
        }
        document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
        document.getElementById('d'+$this.id).style.top = "-55px";
        }
    }

    document.onload = function(evt){
        if(currentPlayer == 1){
        currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
        if(currentCol<0){currentCol=0;}
        if(currentCol>6){currentCol=6;}
        document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
        document.getElementById('d'+$this.id).style.top = "-55px";
        }
    }
    
    document.onclick = function(evt){
        if(currentPlayer == 1){
        if(possiblerows().indexOf(currentCol) != -1){
            dropDisc($this.id,$this.player);
        }
        }
    }
}

function dropDisc(cid,player){
    currentRow = firstFreeRow(currentCol,player);
    moveit(cid,(14+currentRow*60));
    currentPlayer = player;
    checkForMoveVictory();
}

function placeDisc(player){
    currentPlayer = player;
    var disc = new Disc(player);
    disc.addToScene();
}

function firstFreeRow(col,player){
    for(var i = 0; i<6; i++){
      if(gameField[i][col]!=0){
        break;
      }
    }
    game[i-1][col] = player;
    return i-1;
}

function resetGameDiv(){
    var elem = document.getElementById("gameDiv");
    while (elem.firstChild)
        elem.removeChild(elem.firstChild);
}
