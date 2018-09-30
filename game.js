"use strict";

var turn; //check who's turn it is. 0 for ai 1 for player
var game;
var color; //color of piece being played

function setupGame() {
    var type = document.getElementById("gameTypeForm").elements["gametype"].value;
    var firstToPlay = document.getElementById("playerorderForm").elements["playerorder"].value;
    var difficulty = document.getElementById("difficultyForm").elements["difficulty"].value;
    var columns = document.getElementById('col').value;
    var lines = document.getElementById('line').value;

    if(columns <=3 || lines <=3) {
        alert("Invalid board size");
        return;
    } 
    resetGameDiv();
    showGamePage();
    console.log(lines);
    if (type="ai") {
        console.log('here');
        game = new SinglePlayerGame(firstToPlay, difficulty, columns, lines);
        console.log('here2');
        game.startGame();
    }
}

//Objeto que representa cada buraco do tabuleiro
function boardPiece() {
    document.getElementById("gamingDiv");
}

function SinglePlayerGame(firstToPlay, difficulty, columns, lines) {
    console.log("aquiii");
    this.firstToPlay = firstToPlay;
    this.difficulty = difficulty;
    this.columns = columns;
    this.lines = lines;

    if (this.firstToPlay == "pc")
        turn = 0;
    else
        turn = 1;

    this.startGame = function() {
        this.board = new Board(this.columns, this.lines);
        this.board.setupBoard();
    }
}

function Board(columns, lines) {
    this.columns = columns;
    this.lines = lines;
    this.game = new Array();
    this.boardDiv;

    this.setupBoard = function() {
        this.boardDiv = document.createElement("div");
        this.boardDiv.id = "game-board";
        this.boardDiv.className = "game-board";
        this.boardDiv.style.width = "" + (80*this.columns) + "px";
        console.log(this.columns);

        document.getElementById("gameDiv").appendChild(this.boardDiv);

        for (var i = 0; i < this.columns; i++) {
            var columnDiv = document.createElement("div");
            columnDiv.id = "column-" + i;
            columnDiv.className = "column";
            if (i == 0)
                columnDiv.style.marginTop="10px";

            document.getElementById("game-board").appendChild(columnDiv);
            
            this.game[i] = new Array();

            for (var j = 0; j < this.lines; j++) {
                var id = this.lines-j;

                var NS="http://www.w3.org/2000/svg";   
                var svg=document.createElementNS(NS,"svg");
                
                svg.style.width = "80px";
                svg.style.height = "80px";
                svg.className.baseVal = "row-" + id;

                columnDiv.appendChild(svg); 
                svg.innerHTML += '<circle cx="50" cy="40" r="30" stroke="#0B4E72" stroke-width="1" class="free" />' + '\n';

                this.game[i].push[0];
             }
        }
    }
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
        if(possibleColumns().indexOf(currentCol) != -1){
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
