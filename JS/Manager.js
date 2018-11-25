"use strict";

const divs = ['loginPageDiv','gameOptionsDiv','gameDiv','gameRulesDiv','leaderboardDiv', 'gameFinishDiv', 'sizes'];
const leaderbBoardContent = ['Player', 'Games Played', 'W/L Ratio (%)', 'Points'];
var ingame;
var loginInfo = {
	signedIn: false,
    user: "",
    password: ""
}
var before = false; //check if the leaderboard was shown before
var leaderboardType;

/**
 * Shows login box, with the game name on top
 */
function showLoginPage() {
    document.getElementById('dropdown').style.visibility = 'hidden';

    loginInfo.signedIn= false;
    gameInProgress = false;

    resetDiv(document.getElementById('gameDiv'));
    resetDiv(document.getElementById('gameFinishDiv'));

    hideDivs();
    
    document.getElementById('loginPageDiv').style.display = 'block';
}

/**
 * Allows the user to login 
 */
function userLogin() {
    let status = document.getElementById('login-status');
    resetDiv(status);

    loginInfo.user = document.getElementById('user').value;
    loginInfo.password = document.getElementById('pw').value;
    
    if(loginInfo.user == "") {
        status.innerHTML = "Please insert a valid username.";
        return;
    }

    if(loginInfo.password == "") {
        status.innerHTML = "Please provide a password.";
        return;
    }

    let js_obj = {"nick": loginInfo.user, "pass": loginInfo.password};

    makeRequestFetch(JSON.stringify(js_obj), "register")
    .then(function(response){
        if(response.ok) {

            if(localStorage[loginInfo.user] == null)
                localStorage[loginInfo.user] = JSON.stringify({"victories": 0, "games": 0, "points":0});
            
            response.text().then(console.log);
            document.getElementById('username').innerHTML = loginInfo.user;
            loginInfo.signedIn = true;
            document.getElementById('dropdown').style.visibility = 'visible';
            showGameOptions();
        }

        else {
            status.innerHTML = "Wrong username and password combination";
        }

    })
    .catch(console.log);
}

/**
 * Shows the gameOptions 
 */
function showGameOptions() {
    gameInProgress = false;
    hideDivs();

    document.getElementById('gameOptionsDiv').style.display = 'block';
    resetDiv(document.getElementById('gameDiv'));
    resetDiv(document.getElementById('gameFinishDiv'));
}

/**
 * Shows the game board 
 */
function showGamePage() {
    const game = document.getElementById('gameDiv');
    hideDivs();

    document.getElementById('logout').style.pointerEvents = 'none';

    gameInProgress = true; 
    game.style.display = 'block';
}

/**
 * Shows game rules
 */
function showRules() {
    hideDivs();

    document.getElementById('gameRulesDiv').style.display = 'block';
}

/**
 * Returns to the default position. If not logged in it's the login page. Ohterwise, if in a game is the game page, if not is the options page.
 */
function returnToMain() {
    if (!loginInfo.signedIn) {
        showLoginPage();
    }
    else {
        if (!gameInProgress)
            showGameOptions();
        else 
            showGamePage();
    }
}

/**
 * Shows the leaderboard
 */
function showLeaderboardDiv() {
    if (before) 
        resetDiv(document.getElementById('show-leaderboard'));
    changeType("none");
    hideDivs();
    leaderboardDiv.style.display = 'block';
}

function changeType(type) {
    leaderboardType = type;
    if(type == 'offline') {
        document.getElementById('offline-leaderboard').className = "mode active";
        document.getElementById('online-leaderboard').className = "mode";
        document.getElementById('sizes').style.display = 'none';
        showOfflineLeaderBoard();
    }
    else if(type == 'online'){
        document.getElementById('offline-leaderboard').className = "mode";
        document.getElementById('online-leaderboard').className = "mode active";
        document.getElementById('sizes').style.display = 'block';
    }
    else {
        document.getElementById('offline-leaderboard').className = "mode";
        document.getElementById('online-leaderboard').className = "mode";
        document.getElementById('sizes').style.display = 'none';
    }
}

function showOnlineLeaderBoard(size) {
    
}

function showOfflineLeaderBoard() {
    let leaderboard = document.getElementById('show-leaderboard');

    if (before) 
        resetDiv(leaderboard);
    
    let table = document.createElement('table');
    table.id = 'players';
    let headerTr = document.createElement('tr');

    for(let i = 0; i < leaderbBoardContent.length; i++) {
        let th = document.createElement('th');
        th.innerHTML = leaderbBoardContent[i];
        headerTr.appendChild(th);   
    }

    table.appendChild(headerTr);

	for(let i=0; i<localStorage.length; i++){
        let jsonUser = localStorage.key(i);
        let json = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let jsonLeaderboard = [jsonUser,json.games,parseFloat(Math.round((json.victories/json.games*100) * 100) / 100).toFixed(0),json.points];
        let tr = document.createElement('tr');

        for(let j = 0; j < leaderbBoardContent.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = jsonLeaderboard[j];
            tr.appendChild(td); 
        }

        table.appendChild(tr);
	}
    
    leaderboard.appendChild(table);

    before = true;
}

/**
 * Shows the end of the game screen
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} difficulty Difficulty of the game
 */
function gameFinish(player,difficulty) {
    resetDiv(document.getElementById('gameDiv'));
    
    document.getElementById('logout').style.pointerEvents = 'auto';

    gameInProgress = false;

    hideDivs();

    if(!isOnline)
        showGameFinishPage(player,difficulty);
    else
        showGameFinishOnline(player);

    document.getElementById('gameFinishDiv').style.display = 'block';
}

/**
 * Adds elements to the div that shows the end of the game.
 * @param {Number} player the player that won the game. 0 in case of a draw.
 * @param {Number} difficulty Difficulty of the game
 */
function showGameFinishPage(player,difficulty) {
    const div = document.getElementById('gameFinishDiv');
    
    if (player == 1) {
        let text = "<h2>You Lost!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv+= "<p>Result factor:                   <b class='number'>0</b></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obtained:           <b class='number'>0</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[loginInfo.user])
		json["games"]++;
		localStorage[loginInfo.user] = JSON.stringify(json);
    }
    else if (player == 2) {
        let text = "<h2>You Won!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <bold class='number'>"+ difficulty+"</bold></p>";
        scoreDiv+= "<p>Result factor:                   <bold class='number'>1</br></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obtained:           <bold class='number'>"+difficulty+"</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[loginInfo.user])
        json["games"]++;
        json["victories"]++;
        json["points"]+=difficulty;
		localStorage[loginInfo.user] = JSON.stringify(json);
    }
    else {
        let text = "<h2>Tied!</h2>";
        let scoreDiv = "<div id='scoreDiv'>"
        scoreDiv+= "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv+= "<p>Result factor:                   <b class='number'>0.5</b></p>";
        scoreDiv += '<hr>';
        scoreDiv+= "<p>Total points obtained:           <b class='number'>"+0.5*difficulty+"</b></p>";
        scoreDiv+= "</div>";

        div.innerHTML = text + scoreDiv;
        let json = JSON.parse(localStorage[loginInfo.user])
        json["games"]++;
        json["points"]+=difficulty*0.5;
		localStorage[loginInfo.user] = JSON.stringify(json);
    }

    let playAgainButton = document.createElement('input');

    playAgainButton.type = 'button';
    playAgainButton.value = 'Play Again';

    playAgainButton.addEventListener("click", function() {
        showGameOptions();
    });

    div.appendChild(playAgainButton);
}

function showGameFinishOnline(player) {
    const div = document.getElementById('gameFinishDiv');

    if(player == loginInfo.user) {
        let text = document.createElement("h2");
        text.innerHTML = "You Won!";
        const scoreDiv = document.createElement("div");
        scoreDiv.innerHTML+= "<p>Total points obtained:           <b class='number'>1</b></p>";
        scoreDiv.innerHTML+= "</div>";

        div.appendChild(text);
        div.appendChild(scoreDiv);
    }
    else {
        let text = document.createElement("h2");
        text.innerHTML = "You Lost!";
        const scoreDiv = document.createElement("div");
        scoreDiv.innerHTML+= "<p>Total points obtained:           <b class='number'>0</b></p>";
        scoreDiv.innerHTML+= "</div>";

        div.appendChild(text);
        div.appendChild(scoreDiv);
    }

    let playAgainButton = document.createElement('input');

    playAgainButton.type = 'button';
    playAgainButton.value = 'Play Again';

    playAgainButton.addEventListener("click", function() {
        showGameOptions();
    });

    div.appendChild(playAgainButton);
}

/**
 * Eliminates every element of the board.
 * @param element the element from which you want to remove all the child elements
 */
function resetDiv(element){
    while (element.firstChild) 
        element.removeChild(element.firstChild);
}

/**
 * Hide all the divs from the html
 */
function hideDivs() {
    for(let i=0; i<divs.length; i++) 
        document.getElementById(divs[i]).style.display = 'none';
}

/**
 * Adds the leave button to layout on the game page
 */
function leaveGameButton() {
    this.element = document.createElement('input');

    this.element.type = 'button';
    this.element.id = 'leaveGame';
    this.element.value = 'Leave Game';
    this.element.style.width = '100%';

    this.element.addEventListener("click", function() {
        let leave = confirm("Are you sure you want to leave?");
        if (leave) {
            if(game.type == 0)
                gameFinish(1,game.ai.depth);
            else {
                game.cancelMatchMaking();
                gameFinish(1,1);
            }
        }
    });
}

//TODO hide useless forms
function checktype() {
    let value = document.getElementById("gameTypeForm").elements["gametype"].value;
}
