<!-- HEADER is in inlcude file -->  <%- include('include/activity_header.ejs') %>  <!-- HEADER is in inlcude file -->

<!-- ########################## VERSION CONTROL ###############################                         -->
<!--  1/ copy and create from "play_game_230503.ejs"                                                    -->
<!--  2/ change script file references to "?v=230503"                                                   -->
<!--  3/ change appended script file extensions to "?v=230503"                                          -->
<!--  4/ copy and create from "teacher_menu_230503.ejs"                                                 -->
<!--  5/ change script file references to "?v=230503" in teacher_menu_230503.ejs"                       -->
<!--  4/ in app.js, change render reference to "res.render('teacher/play_game_230503'," - 4 places      -->
<!--  4/ in app.js, change render reference to "res.render('teacher/teacher_menu_230503'," - 3 places   -->
<!--  5/ change id="version" display below                                                            -->
<!--  6/ SAVE EVERYTHING                                                                                -->
<!--  REBOOT app.js        AND test, test, test.                                                        -->

<style> #version { background-color:white; font-size:12px; color:black; } </style><div id="version">version:230503</div>

<!-- ########################## VERSION CONTROL ############################### -->

<div class="play-only" style="background-color:white; height:100vh; width:100vw;">
    <div class="play-only" id="lower_block" style="width:980px; justify-self:center; max-width:100%; margin:0 auto; font-size:38px; ">
        <div id="central_display"></div>
        <div id="timer_display"></div>  <!--  class="timer_animation"  -->
    </div>
</div>
<!--FINISH ONLY BELOW-->
<div class="finish-only" style="background-color:white; height:100vh; width:100vw;">
    <div class="finish-only" id="finish-container" style="width:980px; justify-self:center; max-width:100%; margin:0 auto; font-size:24px; visibility:visible; ">
        <br><div id="display_message"></div>
        <br><div id="results-container"></div>
    </div>
</div>

<!-- BALLOONS - 20 off -->  <%- include('include/balloons.ejs') %>  <!-- BALLOONS - 20 off -->
<!-- ########################################################################-->

<style>
    #enable_cookies_message { width:700px; height:300px; background-color:white; border-radius:20px; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:none; }    
</style>

<div style="width:100vw; height:100vh; background-color:grey; position:fixed; top:0px; left:0px; opacity:50%; display:none" id="grey_background"></div>
<div id="enable_cookies_message">
    <div style="display:grid; grid-template-columns: 50px 600px 50px; grid-template-rows:300px; ">
        <div style="grid-column:2/3; grid-row:1/2; display:flex; justify-content:center; align-items:center; font-size:20px;">
            We use "Session Storage" to ensure reliable function of the game.<br><br>
            Currently you have it blocked.<br>
            Please enable "Session Storage" on this browser.<br><br>
            Note: all data is deleted when you close the browser.  Thank you.<br><br>
            REFRESH BTTN
            
        </div>
    </div>
</div>

<script src="https://cdn.socket.io/socket.io-3.0.1.min.js"></script>
<script type="text/javascript" src="/scripts/teacher/yearActivity_and_activityName_objects.js?v=230503"></script>

<script>

////////////////////////////////////////////////////////////////////////////////
    
let idKey = "<%=ref%>";              let user = "<%=user%>";
let gameCode = "<%=gameCode%>";     console.log('gameCode: '+gameCode);

document.getElementById('header_message').innerHTML = '<span style="color:red; cursor:pointer;" onclick="connect_socket();">Click <u>HERE</u> to join game</span>';

let game_status;            let roundNum = 0;           let activity;           let activityCode;       let tableNum;

let numOfQuestions;         let buttonNodeList;         let numberBtnNodes;     let playNodeList;       let finishNodeList; 
let gameDataUnshuffled;     let gameDataShuffled;
let currentQuestion;
let countdownColours = ["#79D70F", "#F5A31A", "#D32626"];
let secondsLeft;            let countdownTimer;         let secondsCount = 0;
let totalAttempts;          let correctCount;           let incorrectCount;                 // let new_round_gameFile_loaded = false;
let finishRoundActivated = false;                       let displayRoundResult = false;     let retrieved_user_data = false;        
let student_has_joined_game = false;                    let first_time_joining_gameRoom = true;            // let game_is_running = false;
let last_image;             let second_last_image;      let numEvenOdd=1;

let indexPool;
// let indexPool = [];
let singleAnsPool = [];     let doubleAnsPool = [];
let factorRange = [];       let compositePool = [];

let previous_correctCount = 0;      let total_number_of_questions = 0;      let average_correct_response = 0;
let groupColour = 'none';           let groupColourLastRnd = 'none';        let userNumber = 0;
let repeat_count = 0;               let repeat_point = 1;                   let repeat_entry_point = 0;     // this is set to question array length on script load
                                                                                                            // this is the array value / point at which the questions are loop back to. default = 0
let start_time;      let update_user_rankings;

let helpBttn_1;     let help_script_1;      let helpBttn_2;     let help_script_2;      let helpBttn_3;     let help_script_3;

let gStatState = 'waiting';                                                     let reBoot_rank = 0;
let game_reBooted_at_62sec = false;     let game_reBooted_at_Rnd_end = false;   let game_reBooted_at_start_after_load = false;
sessionStorage.setItem("NOTrunningAt", 3000000000000); // almost 100 years
sessionStorage.setItem("LASTrunningAt", 3000000000000);
sessionStorage.setItem("LASTtimeBeforeStart", 3000000000000);

let connect_socket = function() { gotoFullScreen();

    const socket = io("https://teachertables.com");

    socket.on('connect', () => {                                                                                console.log(socket.id); // console.log(socket);
    
        socket.emit('join_teacher_gameRoom', gameCode, (gameStatus_linkedUsers) => { // console.log(gameStatus_linkedUsers);
        
            let gStat = gameStatus_linkedUsers.split('>>>>')[0].split('>>');
            let linkedUsers = gameStatus_linkedUsers.split('>>>>')[1].split('|');           
            
            for (let u=1; u<linkedUsers.length-1; u++) { if (linkedUsers[u].split('>')[0] == idKey) { userNumber = u; } }   console.log(userNumber);
        
            game_status = {"state":gStat[0],"round":gStat[2],"maxGroupSize":gStat[3],"currentGame":gStat[4]}

            gStatState = game_status.state;

            if (game_status.state == 'deleted' || game_status.state == 'finished') { window.location = "/<%=ref%>/<%=user%>"; }
            else {
                if (first_time_joining_gameRoom) { first_time_joining_gameRoom = false;  // this only happens once so page does NOT double sockets if connection breaks & then reconnects for some reason.
                    document.getElementById('header_message').innerHTML = 'Wait to start game code: <u>'+gameCode+'</u>';
    
                    roundNum = parseInt(game_status.round);
                    
                    if (roundNum === 0) {  // game has not started yet
                        document.getElementById('central_display').innerHTML = "<span style='font-size:30px;padding-left:100px;'><b>Let's practice friends of ten while we wait.</b>";
                        
                        setTimeout( () => { 
                            
                            if ( document.body.contains(document.getElementById('waitng_for_game_script')) ) { // remove only if script exists
                                document.getElementById('waitng_for_game_script').remove();  // this removes the activity script in pre for next activity script
                            }
                            
                            var activityScript = document.createElement("script");
                            activityScript.src = "/scripts/teacher/game_files/friends_of_10_waiting_game.js?v=230503";     activityScript.id = 'waitng_for_game_script';
                            document.body.append(activityScript);
                            
                        }, 3000);
                    } 
                    else { //  game has started
                        document.getElementById('central_display').textContent = 'You missed the game start, wait for next round.'; 
                        socket.emit('entering_game_after_start', gameCode);
                    }
                }
            }
        });
    
        update_user_rankings = function(ranking) { // gameCode=userRef>>user>>round>>activity>>ranking>>score>>number_of_questions|
        
            let gameRound_user_ranking = gameCode+'='+idKey+'>>'+user+'>>'+game_status.round+'>>'+activityCode+'>>'+ranking+'>>'+correctCount+'>>'+total_number_of_questions+'|';

            setTimeout( () => {  
                socket.volatile.emit('update_user_rankings',gameRound_user_ranking);
            }, 5*userNumber);
        };


        let check_gameState = function() {      // console.log('gStatState = '+gStatState);  console.log('userNumber: '+userNumber);  console.log('reBoot_rank: '+reBoot_rank);
            if (userNumber < 5 || reBoot_rank == 1 || reBoot_rank == 2) { 
                
                // if (reBoot_rank == 1) { add_reBoot = 0; }
                // else if (reBoot_rank == 2) { add_reBoot = 2000; }
                // else {  add_reBoot = userNumber * 2000 + 2000; }                
                
                if (reBoot_rank == 1) { add_reBoot = 0; }
                else if (reBoot_rank == 2) { add_reBoot = 1000; }
                else {  add_reBoot = userNumber * 1000 + 1000; }                 
                
                console.log('add_reBoot: '+add_reBoot);
                
                if (gStatState == 'uploading_wait_to_start') {                  console.log( Date.now() - sessionStorage.getItem("LASTtimeBeforeStart") );
                    game_reBooted_at_Rnd_end = false;
                    sessionStorage.setItem("NOTrunningAt", Date.now());
                    
                    if (sessionStorage.getItem("LASTtimeBeforeStart") > sessionStorage.getItem("NOTrunningAt")) { sessionStorage.setItem("LASTtimeBeforeStart", Date.now()); } // this over ride value of 3 billion
    
                    if (Date.now() - sessionStorage.getItem("LASTtimeBeforeStart") > (11000 + add_reBoot) && game_reBooted_at_start_after_load == false) { console.log('reBoot @ uploading_wait_to_start');
                        game_reBooted_at_start_after_load = true;
                        socket.volatile.emit('reBoot_to_start_game_after_loaded', gameCode+'|>|'+roundNum);
                    }
                }
            
                if (gStatState == 'running') {                                  console.log( Date.now() - sessionStorage.getItem("NOTrunningAt") );
                    game_reBooted_at_start_after_load = false;
                    sessionStorage.setItem("LASTrunningAt", Date.now());
                
                    if (sessionStorage.getItem("NOTrunningAt") > sessionStorage.getItem("LASTrunningAt")) { sessionStorage.setItem("NOTrunningAt", Date.now()); } // this over ride value of 3 billion
    
                    if (Date.now() - sessionStorage.getItem("NOTrunningAt") > (62000 + add_reBoot) && game_reBooted_at_62sec == false) { console.log('reBoot @ running');
                        game_reBooted_at_62sec = true;
                        socket.volatile.emit('reBoot_after_62sec_of_running', gameCode+'|>|'+roundNum);
                    }
                }
            
                else if (gStatState == 'rnd_complete_results_transfer') {            console.log( Date.now() - sessionStorage.getItem("LASTrunningAt") );
                    game_reBooted_at_62sec = false;
                    sessionStorage.setItem("LASTtimeBeforeStart", Date.now());
                    
                    if (sessionStorage.getItem("LASTrunningAt") > sessionStorage.getItem("LASTtimeBeforeStart")) { sessionStorage.setItem("LASTrunningAt", Date.now()); } // this over ride value of 3 billion
    
                    if (Date.now() - sessionStorage.getItem("LASTrunningAt") > (15000 + add_reBoot) && game_reBooted_at_Rnd_end == false) { console.log('reBoot @ rnd_complete_results_transfer'); 
                        game_reBooted_at_Rnd_end = true;
                        
                        if (gStatState != 'round_PAUSED') {
                            socket.volatile.emit('reBoot_at_round_end', gameCode+'|>|'+roundNum);
                        }
                    }
                }
                
            }
            setTimeout(check_gameState,999);
        }
        check_gameState();

    }); //////////////////////////////////////////////////////////////////////// end of socket emit connections

    socket.on(gameCode+'_get_ready_to_START', (gameStatus) => { 
        
        if (navigator.cookieEnabled == false) { console.log('Why have you disable cookies ?????'); // session storage "cookies" disabled!!!!!
            document.getElementById('grey_background').style.display = 'block';  document.getElementById('enable_cookies_message').style.display = 'block';
        }
        
        let gStat = gameStatus.split('>>');                                 // [ state, timeStamp, round, maxGroupSize, currentGame, numOfRnds]
        game_status = {"state":gStat[0],"round":gStat[2],"maxGroupSize":gStat[3],"currentGame":gStat[4]};     // console.log('maxGroupSize = '); console.log(game_status.maxGroupSize);   
        
        gStatState = game_status.state;
        
        if (gameCode[0] == 'c') { // console.log('it is a group game'); console.log(game_status.currentGame); 
            
            userGroups = game_status.currentGame.split('|usersAndGames|')[0].split('|>|');
            
            group_games_strg = game_status.currentGame.split('|usersAndGames|')[1].split('|games|');    // console.log(userGroups);  console.log(group_games_strg);

            thisUserGroup = '';
            userGroups.forEach( (user) => { 
                if (user.split('|in|')[0] == idKey) { thisUserGroup = user.split('|in|')[1];                // console.log( 'this user is in group: '+user.split('|in|')[1] ); 
                } 
            });

            group_games_strg.forEach( (thisGame) => {  
                if ( thisUserGroup == thisGame.split('|&|')[0] ) { 
                    newCurrentGame = thisGame;                                  // console.log('this currentGame will be: '+newCurrentGame); 
                    game_status.currentGame = thisGame;
                }
            });
        }

        if (game_status.state == 'deleted' || game_status.state == 'finished') { window.location = "/<%=ref%>/<%=user%>"; }
        else {
            student_has_joined_game = false;  // if TRUE, then game will update student results ar end of round. Here is it reset back to FALSE before next game starts.
            
            roundNum = game_status.round;                                           document.getElementById("round-counter").innerHTML = `Round ${roundNum}`;
            activity= game_status.currentGame.split('|&|')[roundNum];           // console.log('activity: '+activity);
        
            if (activity.split('TT').length == 2) { 
                tt_div_activity = activity; activity = tt_div_activity.split('TT')[0]; tableNum = tt_div_activity.split('TT')[1]; 
                activityCode = tt_div_activity;
            } else { activityCode = activity; }

            document.getElementById('central_display').innerHTML = '';
            document.getElementById('version').style.display = 'none';
            document.getElementById('close_help_btn').style.display = 'none';
            if ( document.body.contains(document.getElementById('waitng_for_game_script')) ) { document.getElementById('waitng_for_game_script').remove(); }
        
            for (let n=1; n<100; n++) {   // make sure no previous activity scripts exist from previous crash or anything.
                if ( document.body.contains(document.getElementById('round_'+n+'_script')) ) { console.log('THIS SCRIPT IS STILL HERE'); console.log(document.getElementById('round_'+n+'_script'));  // remove only if script exists
                    document.getElementById('round_'+n+'_script').remove();  // this removes the activity script in pre for next activity script
                }
            }

            let activityScript = document.createElement("script");
            activityScript.src = "/scripts/teacher/game_files/"+activity+".js?v=230503";     activityScript.id = 'round_'+roundNum+'_script';
            document.body.append(activityScript);

            document.getElementById('header_message').textContent = 'This round is....';
        }
        sessionStorage.setItem("LASTtimeBeforeStart", Date.now());
    });

    socket.on(gameCode+'nextActivity', () => { document.getElementById('header_message').innerHTML = '<span style="font-size:30px;">'+activityName[activityCode]+'</span>'; });
    
    socket.on(gameCode+'_countDown', (count) => {                           console.log('Count Down: '+count);
        document.getElementById('header_message').textContent = '';         document.getElementById('countdown-overlay').style.display = 'block';
        document.getElementById("countdown-number").innerHTML = count;      document.getElementById("countdown-circle").style.backgroundColor = countdownColours[parseInt(count)-1];
        
        sessionStorage.setItem("NOTrunningAt", Date.now());
    });
    
    socket.on(gameCode+'_START', (gameStatus) => { gStatState = gameStatus.split('>>')[0];
    
        if (gStatState == 'deleted' || gStatState == 'finished') { window.location = "/<%=ref%>/<%=user%>"; }
        else { start_this_game(); }
    });
    
    function start_this_game() { console.log('IN start_this_game');             // console.log('new_round_gameFile_loaded'); console.log(new_round_gameFile_loaded); 
        
        document.getElementById('countdown-overlay').style.display = 'none';    document.getElementById("header_message").textContent = '';

        if ( document.body.contains(document.getElementById('round_'+roundNum+'_script')) ) {

            student_has_joined_game = true;                                     console.log('initialiseRound_'+activityCode);

            gameDataUnshuffled = [];        gameDataShuffled = [];
            totalAttempts = 0;              correctCount = 0;               incorrectCount = 0;
        
            secondsCount = 0;               previous_correctCount = 0;      total_number_of_questions = 0;      average_correct_response = 0;
            finishRoundActivated = false;   displayRoundResult = false;     retrieved_user_data = false;
            repeat_count = 0;
        
            window['initialiseRound_'+activity]();  //  ### HERE IS THE ACTIVITY SCRIPT ###
        
            playNodeList.forEach(playNode => { playNode.style.display = "block"; });
            
            document.getElementById('timer_display').classList.add('timer_animation');
            
            secondsCount = 0;
            start_time = Date.now();
        
            for (i = 1; i < 21; i++) { document.getElementById('balloon_'+i).style.cssText = ''; } // Clears the balloon ID's so it can play the second time.
            for (i = 0; i < numberBtnNodes; i++) { document.getElementById('button-'+i).disabled = false; }
        
            finishNodeList.forEach(finishNode => { finishNode.style.display = "none"; });
            
            document.getElementById("results-container").innerHTML = "";
            
            if (groupColourLastRnd != 'none') {
                groupColourArray.forEach( (colourGroup) => { 
                    if (colourGroup.split('_')[0] == groupColourLastRnd ) { // let groupColorDisplay = document.getElementById("groupColour_id");
                    
                        document.getElementById("groupColour_id").innerHTML = 
                            '<div style="display:grid; grid-template-columns:160px; grid-template-rows:38px;">' +
                                '<div style="grid-column:1/2; grid-row:1/2; font-size:28px; width:90%; height:100%; border-radius:10px; display:flex; justify-content:center; align-items:center; ' +
                                    'background-color:'+colourGroup.split("_")[1]+'"><b>'+colourGroup.split('_')[0]+'</b></div>' +
                            '</div>';
                    }
                })
            }
        }
        else { 
            console.log('$$$$ Game connection must have dropped out $$$'); 
            
            socket.emit('entering_game_after_start', gameCode);
        }
    }
    
    socket.on(gameCode+'_round_of_60sec_completed', (gameStatus) => { gStatState = gameStatus.split('>>')[0];
        
        if (gStatState == 'deleted' || gStatState == 'finished') { window.location = "/<%=ref%>/<%=user%>"; }

        if (student_has_joined_game) {
            document.getElementById("results-container").textContent = "Your score was "+correctCount+" out of "+total_number_of_questions+" attempts.";
            finishRoundActivated = true;
            
            let update_user_gameScore = gameCode+'='+idKey+'>>'+correctCount+'>>'+average_correct_response+'>>'+roundNum+'>>'+user+'>>'+groupColourLastRnd+'|';

            setTimeout( () => {
                socket.volatile.emit('update_user_gameScore',update_user_gameScore);  // volatile ignores emit if you get disconnected.
                round_is_complete_display_results();
            }, 5*userNumber );     // the user_gameScores are sent back at offset time according to the userNumber, this is to reduce instantanious load on server updating memC
        }
        sessionStorage.setItem("LASTrunningAt", Date.now());
    });
    
    socket.on(gameCode+'_retreive_all_user_round_data', (userResults) => { 
        if (student_has_joined_game) { retreive_all_user_round_data(userResults); }    
    });
    
    socket.on(gameCode+'_game_has_finished', () => { gStatState = 'game_FINISHED';
        if (gameCode == idKey.substring(0,4)) { document.getElementById('home_href').href = "/"; }  // this is a "guest" game
        
        else { document.getElementById('home_href').href="/exit_game/<%=ref%>/<%=user%>"; }
        
        document.getElementById('header_message').textContent = 'Game has ended.'; 
    });

    socket.on(gameCode+'_game_paused', () => { gStatState = 'round_PAUSED';       // console.log('gStatState = '+gStatState);
        document.getElementById('header_message').textContent = 'Game paused by teacher...'; 
    });

};

if (window.matchMedia("(orientation: portrait)").matches) { alert("Please use landscape mode for the best experience."); }

let GlRndNum = 0;  // This generates a Global Random Number (GlRndNum) b/t 0 to 12 based on the last character of the gameCode
if (gameCode[3]=='b' || gameCode[3]=='3') { GlRndNum = 1; }                     if (gameCode[3]=='c' || gameCode[3]=='4') { GlRndNum = 2; }
if (gameCode[3]=='d' || gameCode[3]=='5') { GlRndNum = 3; }                     if (gameCode[3]=='e' || gameCode[3]=='6') { GlRndNum = 4; }
if (gameCode[3]=='f' || gameCode[3]=='7') { GlRndNum = 5; }                     if (gameCode[3]=='g' || gameCode[3]=='8') { GlRndNum = 6; }
if (gameCode[3]=='h' || gameCode[3]=='9') { GlRndNum = 7; }                     if (gameCode[3]=='j' || gameCode[3]=='r' || gameCode=='x') { GlRndNum = 8; }
if (gameCode[3]=='k' || gameCode[3]=='s' || gameCode=='y') { GlRndNum = 9; }    if (gameCode[3]=='m' || gameCode[3]=='t' || gameCode=='z') { GlRndNum = 10; }
if (gameCode[3]=='p' || gameCode[3]=='v') { GlRndNum = 11; }                    if (gameCode[3]=='q' || gameCode[3]=='w') { GlRndNum = 12; }
console.log('GlRndNum: '+GlRndNum);

////////////////////////////////////////////////////////////////////////////////

function questionAnswered(total_number_of_questions) {
    if (previous_correctCount != correctCount) {  // this means they have answered a question correctly
        average_correct_response = parseInt((Date.now() - start_time) / total_number_of_questions);
        previous_correctCount = correctCount;
    }
    document.getElementById("question-counter").innerHTML = `Question: ${total_number_of_questions + 1}`;
}

function pauseWrapper() { continueCurrentGame(); }

function round_is_complete_display_results() { 

    document.getElementById('timer_display').classList.remove('timer_animation');   // remove timer_display
    document.getElementById("question-text").classList.remove("incorrect-text");    // this removes css to shake incorrect answer
    document.getElementById('central_display').innerHTML = '';                      // REMOVE central html text from previous game

    // remove only if script exists, is case there was a previous crash  // this removes the activity gameCode script in pre for next gameFile
    if ( document.body.contains(document.getElementById('round_'+roundNum+'_script')) ) { document.getElementById('round_'+roundNum+'_script').remove(); }

    playNodeList.forEach(playNode => { playNode.style.display = "none"; });
    finishNodeList.forEach(finishNode => { finishNode.style.display = "block"; });
    document.getElementById('close_help_btn').style.display = 'none';
    document.getElementById("display_message").innerHTML = "Good work, "+user+"!<br>Round "+roundNum+" is complete.";
    
    release_balloons();
}

function retreive_all_user_round_data(userResults) { 
    
    let user_results_array = userResults.split('|');                            // userRef >> round >> score >> respTime >> user >> groupColour |
    user_results_array.pop();                                                   // this removed the last empty array value after the final '|'
    
    console.log('user_results_array');  console.log(user_results_array);  

    let last_rnd_user_data = [];

    user_results_array.forEach( (each_user_data) => {                           console.log('each_user_data = ');    console.log(each_user_data);  // ['656sr4t5>>3>>2084>>1>>Russ>>none']
        let eachUserData = each_user_data.split('>>');
        if ( eachUserData[3] == roundNum ) { last_rnd_user_data.push(eachUserData) }
    });
    
    // ################# also check that the userRef has NOT doubled up some how !!!!!!!!
    
    //console.log('last_rnd_user_data'); console.log(last_rnd_user_data);

    let user_data_sorted = last_rnd_user_data.sort( (a,b) => { // this sorts user from highest to lowest, score then respTime lowest to highest
        // userRef , score , respTime , roundNum , user , groupColour
        if (a[1] == b[1]) { return a[2] - b[2]; } return b[1] - a[1];                                                                                   // ??????????????????????????????  check check check check
    });                                                                         //console.log('user_data_sorted'); console.log(user_data_sorted);

    let q = 1;  let ranking = 0;
    user_data_sorted.forEach( (sortedUsers) => { if (sortedUsers[0] == idKey) { ranking = q; }  q++;  });

    reBoot_rank = ranking;

    let numberOfUser = last_rnd_user_data.length;                               // console.log('numberOfUser = ');     console.log(numberOfUser);  // this numberOfUser appear correct
    let usersPerGroup = parseInt(game_status.maxGroupSize);                     // console.log('usersPerGroup = ');    console.log(usersPerGroup);  // this usersPerGroup appears to be good :-)

    let make_equal_groups = function(usersPerGroup) { // start with teacher defined usersPerGroup, else reduce to make equal group sizes. 

        let numberInLastGroup = numberOfUser % usersPerGroup;                   // this is the number of user in the last group, if zero then all groups are full

        let numberOfGroups = 1;     let numUsersPerGroup = [];
        
        if (numberInLastGroup === 0) { numberOfGroups = numberOfUser/usersPerGroup; } 
        else { numberOfGroups = Math.floor(numberOfUser/usersPerGroup) + 1; }       // this defines total number of groups

        for (let u=0; u<numberOfGroups-1; u++ ) { numUsersPerGroup.push(usersPerGroup); }  

        if (numberInLastGroup == 0) { numUsersPerGroup.push(usersPerGroup); }
        else { numUsersPerGroup.push(numberInLastGroup); }

        let moveNumUsers = usersPerGroup - numberInLastGroup;  // how many spaces at NOT filled in the last group.  // 3-1 = 2
        
        if ((moveNumUsers == usersPerGroup)||(numberOfGroups == 1)) { moveNumUsers = 0; }  // if same as group size then all good, all groups are full
        else { moveNumUsers = moveNumUsers - 1;}  // if there is only one space NOT filled, all good, no need to move any user, make last group one smaller

        if (moveNumUsers > (numberOfGroups - 1)) { 
            usersPerGroup = usersPerGroup - 1;  
            make_equal_groups(usersPerGroup);  // GO thru process again !!!!!
        }

        else { //###########################################################
            if (moveNumUsers != 0) {
                let len = numUsersPerGroup.length;          // length of array, OR the number of groups  [3,3,1] - then rearrange groupings
                for (let i=1; i <= moveNumUsers; i++ ) { // console.log('len'); console.log(len);
                    
                    numUsersPerGroup[len-1] = numUsersPerGroup[len-1] + 1;
                    let pos = (len - 1) - i;
                    numUsersPerGroup[pos] = numUsersPerGroup[pos] - 1;
                }
            }                                                               //console.log('### Users per group will be following array:'); console.log(numUsersPerGroup);  console.log('##################');

            let numUsersCumm = numUsersPerGroup;
            for (let p=1; p < numUsersPerGroup.length; p++) { numUsersCumm[p] = numUsersPerGroup[p] + numUsersCumm[p-1]; }
            
            let gameGroup = 0;
            for (let k=0; k < numUsersCumm.length; k++) { 
                if (ranking > numUsersCumm[k]) { gameGroup++; } 
            }                                                                   // console.log('For NEXT round, user will be in gameGroup (array position): '+gameGroup);
            
            // console.log('gameGroup: '+gameGroup+' GlRndNum: '+GlRndNum+' roundNum: '+roundNum);
            
            let colourAllocation = parseInt(gameGroup) + parseInt(GlRndNum) + parseInt(roundNum);    // RED, BLUE, GREEN, PURPLE, YELLOW, ORANGE, PINK, TEAL, CYAN, LIME, MAROON, MAGENTA, SILVER, GOLD, OLIVE, GREY, NAVY, BROWN = 18 colours

            colourAllocation = colourAllocation - ( Math.floor(colourAllocation/18)*18 );           // keeps colorAllocation between 0 and 17

            // console.log('colourAllocation: '+colourAllocation.toString());      console.log('groupColourLastRnd: '+groupColourLastRnd);

            update_user_rankings(ranking);

            if (groupColourLastRnd != 'none') { display_score_board(user_data_sorted, groupColourLastRnd, roundNum); }
            else {
                document.getElementById("display_message").innerHTML =  'Next round you will be in the<br>' +
                                                                        '<b><span style="color:'+groupColourArray[colourAllocation].split('_')[1]+';">'+groupColourArray[colourAllocation].split('_')[0]+'</span></b> game.<br>' +
                                                                        'Good luck!';
                document.getElementById("results-container").textContent = "";
            }
            groupColourLastRnd = groupColourArray[colourAllocation].split('_')[0];
        }  // ##############################################################
    };
    make_equal_groups(usersPerGroup);
}

function display_score_board(user_data_sorted,groupColourLastRnd,lastRnd) {
    document.getElementById("results-container").textContent = "";
    document.getElementById("display_message").innerHTML = 'The <b><span style="color:'+groupColourLastRnd+';">'+groupColourLastRnd+'</span></b>'+
                                                            ' game score board is:<br>';
    let q = 1;
    user_data_sorted.forEach( (user) => { // get data for THIS userRef and for this round just past which is 1 less than game_status. 
        // userRef >> score >> respTime >> round >> user >> groupColour
        // 6s28qsv2,0,0,50,David,PINK
        if (user[5] == groupColourLastRnd && user[3] == lastRnd) {
            document.getElementById("display_message").innerHTML += '<br>'+q.toString()+'. '+user[4];
            q++;
        }
    });
}

////////////////////////////////////////////////////////////////////////////////

function gotoFullScreen() { let elem = document.body;  console.log('ON connect, go full screen');
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) { elem.requestFullScreen(); } 
        else if (elem.mozRequestFullScreen) { elem.mozRequestFullScreen(); } 
        else if (elem.webkitRequestFullScreen) { elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); } 
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
    } 
} 

</script>

<script type="text/javascript" src="/scripts/teacher/text_and_image_feedback_control.js?v=230503"></script>
<script type="text/javascript" src="/scripts/teacher/celebrate_with_balloons_and_jumping_letters.js?v=230503"></script>

<!--<script type="text/javascript" src="/scripts/teacher/finish_round_and_update.js"></script>-->

<script type="text/javascript" src="/scripts/dislay_help_charts.js?v=230503"></script>

</body>
</html>
