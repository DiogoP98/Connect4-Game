"use strict";

const divs = ['loginPageDiv','gameOptionsDiv','gameDiv','gameRulesDiv','leaderboardDiv', 'gameFinishDiv', 'sizes'];
const leaderBoardOfflineContent = ['Player', 'Games Played', 'Wins', 'W/L Ratio (%)', 'Points'];
const leaderBoardOnlineContent = ['Player', 'Games Played', 'Wins', 'W/L Ratio (%)'];
var loginInfo = {
	signedIn: false,
    user: "",
    password: ""
}
var before = false; //check if the leaderboard was shown before
var leaderboardType;
const supportStorage = ((typeof window.localStorage) !== 'undefined')

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

            if(supportStorage)
                if(localStorage[loginInfo.user] == null )
                    localStorage[loginInfo.user] = JSON.stringify({"victories": 0, "games": 0, "points":0});
            
            document.getElementById('username').innerHTML = loginInfo.user;
            loginInfo.signedIn = true;
            defaults();
            document.getElementById('dropdown').style.visibility = 'visible';
            showGameOptions();
        }

        else 
            status.innerHTML = "Wrong username and password combination";

    })
    .catch(console.log);
}

function defaults() {
    document.getElementById('user').value = '';
    document.getElementById('pw').value = '';
    if(document.getElementById("gameTypeForm").elements["gametype"].value == 'pvp') {
        document.getElementById("difficultyDiv").style.display = "block";
        document.getElementById("playerOrderDiv").style.display = "block";
    }
    document.getElementById('gameTypeForm').reset();
    document.getElementById('playerorderForm').reset();
    document.getElementById('difficultyForm').reset();
    document.getElementById('sizeForm').reset();
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

/**
 * Offline and Online leaderboard manager.
 * @param {String} type 
 */
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

function showOnlineLeaderBoard(columns, rows) {
    let js_obj = {"size": {"rows": rows, "columns": columns}};

    makeRequestFetch(JSON.stringify(js_obj), "ranking")
    .then(function(response) {
        if(response.ok) {
            return response.json()
            .then(function(json) {
                buildOnlineLeaderBoard(json);
            })
        }
    })
}

/**
 * Builds the offline Leaderboard ordered by number of points
 */
function showOfflineLeaderBoard() {
    if(!supportStorage) {
        alert("Your version of the browser doesn't support localStorage"); 
        return;
    }
    
    let leaderboard = document.getElementById('show-leaderboard');
    
    let localArray = new Array(localStorage.length);

    for(let i = 0; i < localStorage.length; i++) {
        localArray[i] = new Array(5);
        let jsonUser = localStorage.key(i);
        let json = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let jsonLeaderboard = [jsonUser,json.games,json.victories,parseFloat(Math.round((json.victories/json.games*100) * 100) / 100).toFixed(0),json.points];
        localArray[i] = jsonLeaderboard.slice(0);
    }

    //orders the leaderboard by number of points
    localArray.sort(function(a,b) {
            return b[4] - a[4];
    });

    if (before) 
        resetDiv(leaderboard);
    
    let table = document.createElement('table');
    table.id = 'players';
    let headerTr = document.createElement('tr');

    for(let i = 0; i < leaderBoardOfflineContent.length; i++) {
        let th = document.createElement('th');
        th.innerHTML = leaderBoardOfflineContent[i];
        headerTr.appendChild(th);   
    }

    table.appendChild(headerTr);

	for(let i=0; i<localArray.length; i++){
        let tr = document.createElement('tr');

        for(let j = 0; j < leaderBoardOfflineContent.length; j++) {
            let td = document.createElement('td');
            if(j == 3 && isNaN(localArray[i][j])) //when the user hasn't played any games yet
                td.innerHTML = "--------";
            else
                td.innerHTML = localArray[i][j];
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
    
    if(game.type == 0)
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
        let text = document.createElement("h2");
        text.innerHTML = "You Lost!";
        let scoreDiv = document.createElement("div");
        scoreDiv.id = 'scoreDiv';
        scoreDiv.innerHTML = "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv.innerHTML += "<p>Result factor:                   <b class='number'>0</b></p>";
        scoreDiv.innerHTML += '<hr>';
        scoreDiv.innerHTML += "<p>Total points obtained:           <b class='number'>0</b></p>";

        div.appendChild(text);
        div.appendChild(scoreDiv);
        let json = JSON.parse(localStorage[loginInfo.user])
		json["games"]++;
		localStorage[loginInfo.user] = JSON.stringify(json);
    }
    else if (player == 2) {
        let text = document.createElement("h2");
        text.innerHTML = "You Won!";
        let scoreDiv = document.createElement("div");
        scoreDiv.id = 'scoreDiv';
        scoreDiv.innerHTML = "<p>Difficulty of the AI:            <b class='number'>"+ difficulty +"</b></p>";
        scoreDiv.innerHTML += "<p>Result factor:                   <b class='number'>1</b></p>";
        scoreDiv.innerHTML += '<hr>';
        scoreDiv.innerHTML += "<p>Total points obtained:           <b class='number'>"+ difficulty + "</b></p>";

        div.appendChild(text);
        div.appendChild(scoreDiv);
        let json = JSON.parse(localStorage[loginInfo.user])
		json["games"]++;
        json["victories"]++;
        json["points"]+=difficulty;
		localStorage[loginInfo.user] = JSON.stringify(json);
    }
    else {
        let text = document.createElement("h2");
        text.innerHTML = "It's a draw!";
        let scoreDiv = document.createElement("div");
        scoreDiv.id = 'scoreDiv';
        scoreDiv.innerHTML = "<p>Difficulty of the AI:            <b class='number'>"+ difficulty+"</b></p>";
        scoreDiv.innerHTML += "<p>Result factor:                   <b class='number'>0.5</b></p>";
        scoreDiv.innerHTML += '<hr>';
        scoreDiv.innerHTML += "<p>Total points obtained:           <b class='number'>"+ 0.5 * difficulty + "</b></p>";

        div.appendChild(text);
        div.appendChild(scoreDiv);
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
    this.element.id = 'leave-game';
    this.element.value = 'Leave Game';

    this.element.addEventListener("click", function() {
        let leave = confirm("Are you sure you want to leave?");
        if (leave) {
            if(game.type == 0)
                gameFinish(1,game.ai.depth);
            else 
                game.cancelMatchMaking();
        }
    });
}

/**
 * Checks the game type form selection. If it is multiplayer removes useless forms.
 */
function checktype() {
    let value = document.getElementById("gameTypeForm").elements["gametype"].value;

    if(value == "pvp") {
        document.getElementById("difficultyDiv").style.display = "none";
        document.getElementById("playerOrderDiv").style.display = "none";
    } 

    else {
        document.getElementById("difficultyDiv").style.display = "block";
        document.getElementById("playerOrderDiv").style.display = "block";
    }
}

/*-----------------Online manager--------------*/

/**
 * Shows the outcome of the match.
 * @param {String} player Username of the player who won the game. Nothing when it is a draw. 
 */
function showGameFinishOnline(player) {
    const div = document.getElementById('gameFinishDiv');

    if(player == loginInfo.user) {
        let text = document.createElement("h2");
        text.innerHTML = "You Won!";

        div.appendChild(text);
    }
    else if(player == null){
        let text = document.createElement("h2");
        text.innerHTML = "It's a draw!";

        div.appendChild(text);
    }
    else {
        let text = document.createElement("h2");
        text.innerHTML = "You Lost!";

        div.appendChild(text);
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
 * Builds the online LeaderBoard ordered by number of victories
 * @param {Json} json Server file with information of players stats 
 */
function buildOnlineLeaderBoard(json) {
    let leaderboard = document.getElementById('show-leaderboard');

    if (before) 
        resetDiv(leaderboard);
    
    let table = document.createElement('table');
    table.id = 'players';
    let headerTr = document.createElement('tr');

    for(let i = 0; i < leaderBoardOnlineContent.length; i++) {
        let th = document.createElement('th');
        th.innerHTML = leaderBoardOnlineContent[i];
        headerTr.appendChild(th);   
    }

    table.appendChild(headerTr);
    
    for(let i = 0; i < json.ranking.length; i++) {
        let WL = parseFloat(Math.round((json.ranking[i].victories/json.ranking[i].games*100) * 100) / 100).toFixed(0);
        const jsonLeaderboard = [json.ranking[i].nick,json.ranking[i].games,json.ranking[i].victories, WL];

        let tr = document.createElement('tr');

        for(let j = 0; j < leaderBoardOnlineContent.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = jsonLeaderboard[j];
            tr.appendChild(td); 
        }

        table.appendChild(tr);
    }

    leaderboard.appendChild(table);

    before = true;
}
