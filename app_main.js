
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({ host:"mail.teachertables.com", port:465, secure:true, auth:{ user:'admin@teachertables.com', pass:'RetirementPresent4May', }, });


const express = require('express');
const mysql = require('mysql');

const nodemailer = require('nodemailer');
const fs = require('fs');

const privateKey = fs.readFileSync('/home/teache13/keys/private-key.pem', 'utf8');

const transporter = nodemailer.createTransport({
    host: 'mail.teachertables.com',
    port: 465, secure: true,
    auth: { user: 'admin@teachertables.com', pass: 'RetirementPresent4May' },
    dkim: { domainName: 'teachertables.com', keySelector: 'teachertablesdkim1', privateKey: privateKey }
});

const redis = require('./redis').getClient();

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, { pingTimeout: 10000, pingInterval: 25000, cors: { origan : "*"} });

const pool_users_db = mysql.createPool({ connectionLimit : 100, host : 'localhost', user : 'teache13_users_app', password : 'rMLlcaYNFRai', database : 'teache13_users', debug : false });
const pool_myplace_db = mysql.createPool({ connectionLimit : 100, host : 'localhost', user : 'teache13_myplace_app', password : 'dPKlBfuOfvz8', database : 'teache13_myplace', debug : false });
const pool_teachers_db = mysql.createPool({ connectionLimit : 100, host : 'localhost', user : 'teache13_teachers_app', password : 'u7cf5WuWWgjx', database : 'teache13_teachers', debug : false });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

server.listen();

io.on('connection', (socket) => { 

    //#####################################################################################################
    /////// ### following socket connection are from the student "submit_game_code" page //////////////////
    socket.on('check_type_of_gCode', (gCode, socketResp) => {
        redis.MGET([gCode+'_game_status',gCode+'_teacher_details']).then( (data) => {
            if (data[0] !== null) { let gState = data[0].split('>>')[0];
                if (gState !== 'deleted' || gState !== 'finished') {               // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                    socketResp(data[1]);
                }
                else { socketResp(null); }                
            }
            else { socketResp(null); }
        });
    });

    socket.on('link_user_to_teacher_via_gCode', (params, socketResp) => { let newArrayOfStudents;     let linkedTeachers;

        redis.GET(params.gCode+'_teacher_details').then( (teacherDetails) => { let teacher_details = teacherDetails.split('>>');        // [teacherID, teacherName, classPW, arrayOfStudents]
        
            params.teacherID = teacher_details[0];          params.teacherName = teacher_details[1];
            params.classPW = teacher_details[2];            params.arrayOfStudents = teacher_details[3]; 

            let user_and_teacher_NOT_linked = true;
            let array_of_current_students = teacher_details[3].split('|>|');

            for (let y=1; y<array_of_current_students.length; y++) { if ( array_of_current_students[y].split('>')[0] == params.ref ) { user_and_teacher_NOT_linked = false; } }
            
            if (user_and_teacher_NOT_linked) {
                pool_users_db.query("SELECT studentFullName FROM userID_"+params.ref+"_activities WHERE activity='history'", params, (error, results2, fields)=>{
    
                    let pass_1 = params;
                    let dateNow = Date.now().toString();

                    newArrayOfStudents = pass_1.arrayOfStudents+"|>|"+pass_1.ref+">"+results2[0].studentFullName+">N>none>N>none>N>none>"+dateNow+">"+dateNow+">"+dateNow+">Ungrouped";
                    teacher_details = pass_1.teacherID+'>>'+pass_1.teacherName+'>>'+pass_1.classPW+'>>'+newArrayOfStudents;
                    
                    redis.SETEX(pass_1.gCode+'_teacher_details', 7200, teacher_details).then( ()=>{
    
                        pool_teachers_db.query("UPDATE teacherID_"+pass_1.teacherID+" SET arrayOfStudents='"+newArrayOfStudents+"' WHERE ref='"+pass_1.teacherID+"'", (error, results, fields)=>{ 
                            if (pass_1.currentLinkedTeachers == 'none') { linkedTeachers = pass_1.teacherID +"_"+ pass_1.teacherName }
                            else { linkedTeachers = pass_1.currentLinkedTeachers + "," + pass_1.teacherID +"_"+ pass_1.teacherName }
                            pool_users_db.query("UPDATE userID_"+pass_1.ref+"_activities SET activityNotes='"+linkedTeachers+"' WHERE activity='teacherCodes'", (error, results, fields)=>{ 

                                pool_users_db.query("INSERT INTO userID_"+pass_1.ref+"_activities VALUES('"+pass_1.teacherID+"_tasks','none','none','none', 'none,3,111,none,3,222,none,3,333,"+pass_1.teacherName+","+pass_1.teacherID+","+dateNow+"','0,0,0','none','none','aux_1','aux_2','teacherTasks')", (error, results, fields)=>{
                                    socketResp('student_and_teacher_linkage');
                                });
                            });
                        });
                    });
                });
            }
            else { socketResp('student_and_teacher_linkage'); }
        });
    });

    socket.on('link_newUser_to_parentTutor', (params, socketResp) => { // { "userRef":userRef,"userName":userName,"teacherRef":idKey,"teacherName":user, "arrayOfStudents":arrayOfStudents }
        let dateNow = Date.now().toString();
        let newArrayOfStudents = params.arrayOfStudents+"|>|"+params.userRef+">"+params.userName+">N>none>N>none>N>none>"+dateNow+">"+dateNow+">"+dateNow+">Ungrouped";
        pool_teachers_db.query("UPDATE teacherID_"+params.teacherRef+" SET arrayOfStudents='"+newArrayOfStudents+"' WHERE ref='"+params.teacherRef+"'", params, (error, results, fields)=>{ 
            let pass_1 = params;
            let linkedTeachers = pass_1.teacherRef +"_"+ pass_1.teacherName;
            pool_users_db.query("UPDATE userID_"+pass_1.userRef+"_activities SET activityNotes='"+linkedTeachers+"' WHERE activity='teacherCodes'", (error, results, fields)=>{ 
                pool_users_db.query("INSERT INTO userID_"+pass_1.userRef+"_activities VALUES('"+pass_1.teacherRef+"_tasks','none','none','none', 'none,3,111,none,3,222,none,3,333,"+pass_1.teacherName+","+pass_1.teacherRef+","+dateNow+"','0,0,0','none','none','aux_1','aux_2','teacherTasks')", (error, results, fields)=>{
                    socketResp('linkage_success');
                });
            });
        });
    });

    socket.on('fetch_user_userName', (idKey, socketResp) => {  
        pool_users_db.query("SELECT userName FROM userID_"+idKey+"_activities WHERE activity='history' LIMIT 1", (error, results, fields)=>{ 
            socketResp(results);
        });
    });

    socket.on('log_the_user_in', (params, socketResp) => {
        params.userName = params.userName.toLowerCase().split(' ').join('');
        params.passWord = params.passWord.split(' ').join('');

        pool_users_db.query("SELECT idKey, studentFirstName, userPassCode FROM aaaa_Data_Table_of_Users WHERE userName='"+params.userName+"'", params, (error, results, fields)=>{ // socketResp(results[0].userPassCode);
            if ( results.length === 0 ) {
                socketResp('not_valid_username>idKey>name');
            }
            
            else if (results[0].userPassCode && results[0].idKey && results[0].studentFirstName) {
                if (results[0].userPassCode !== params.passWord) { socketResp('passWord_does_not_match>idKey>name'); }
                else if (results[0].userPassCode == params.passWord) {
                    thisUser = results[0];
                    pool_users_db.query("UPDATE userID_"+thisUser.idKey+"_activities SET timeStamp="+Date.now().toString()+" WHERE activity='history'", thisUser, (error, results, fields)=>{
                        
                        let pass = thisUser;
                        pool_users_db.query("SELECT activityNotes FROM userID_"+pass.idKey+"_activities WHERE activity='teacherCodes'", pass, (error, activityResults, fields)=>{
                            socketResp('logged_in>'+pass.idKey+'>'+pass.studentFirstName+'>'+activityResults[0].activityNotes);
                        });
                    });
                }
            }
            else { socketResp('not_valid_username>idKey>name'); }
        });
    });

    socket.on('register_new_user_via_gameCode', (params, socketResp) => { 
        if (params.studentName.split(" ").length == 1) { params.firstName = params.studentName;  params.lastName = ''; }
        else { params.firstName = params.studentName.split(" ")[0];  params.lastName = params.studentName.split(" ")[1]; }
    
        if (params.passWord_1 == params.passWord_2) { params.userName = params.studentName.toLowerCase().split(' ').join('');
    
            let getUniqueUserName = function(thisUser) {
                pool_users_db.query("SELECT * FROM aaaa_Data_Table_of_Users WHERE userName='"+thisUser.userName+"'", thisUser, (error, results, fields)=>{
    
                    let pass_1 = thisUser;
                    if ( results.length === 0 ) {
                        let getIdKey = function(pass_1) { 
    
                            let random_number = Math.floor(Math.random() * (110000000000 - 7000000000)) + 7000000000;  // 103 billion possibilities
                    		wn1 = parseInt(random_number / 17); dig1 = random_number % 17;  wn2 = parseInt(wn1 / 17);   dig2 = wn1 % 17;
                    		wn3 = parseInt(wn2 / 17);           dig3 = wn2 % 17;            wn4 = parseInt(wn3 / 17);   dig4 = wn3 % 17;
                    		wn5 = parseInt(wn4 / 17);           dig5 = wn4 % 17;            wn6 = parseInt(wn5 / 17);   dig6 = wn5 % 17;
                    		wn7 = parseInt(wn6 / 17);           dig7 = wn6 % 17;            dig8 = wn7 % 17;
    
                            let convert = ['2','3','4','5','6','7','8','9','q','r','s','t','v','w','x','y','z'];
                            pass_1.idKey = convert[dig1]+convert[dig2]+convert[dig3]+convert[dig4]+convert[dig5]+convert[dig6]+convert[dig7]+convert[dig8];
                            
                            pool_users_db.query("SELECT idKey FROM aaaa_Data_Table_of_Users WHERE idKey='"+pass_1.idKey+"'", pass_1, (error, results, fields)=>{
    
                                let pass_3 = pass_1;
                                if ( results.length === 0 ) {
                                    pool_users_db.query("INSERT INTO aaaa_Data_Table_of_Users (idKey,userName,userEmail,studentFirstName,studentFullName,parentName,teacherCodes,userPassCode,registerDate,access,gameCode,homeWork,hwHistory,aux_1,aux_2,aux_3) VALUES ('"+pass_3.idKey+"','"+pass_3.userName+"','userEmail','"+pass_3.firstName+"','"+pass_3.studentName+"','parentName','none','"+pass_3.passWord_1+"','"+Date.now().toString()+"','none','none','|&|','|&|','ax1','ax2','ax3')", pass_3, (error, results, fields)=>{
                                        let pass_4 = pass_3;
                                        pool_users_db.query("CREATE TABLE userID_"+pass_4.idKey+"_activities(activity varchar(200) PRIMARY KEY, score varchar(10), time varchar(10), attempts varchar(10), activityNotes text, homeWorkCnt varchar(20), timeStamp varchar(50), gameCode varchar(200), user varchar(200), studentFullName varchar(200), userName varchar(200))", pass_4, (error, results, fields)=>{
                                            let pass_5 = pass_4;
                                            pool_users_db.query("INSERT INTO userID_"+pass_5.idKey+"_activities VALUES('teacherCodes','none','none','none', 'none','none','none','none','aux_1','aux_2','aux_3')", pass_5, (error, results, fields)=>{
                                                let pass_6 = pass_5;
                                                pool_users_db.query("INSERT INTO userID_"+pass_6.idKey+"_activities VALUES('history','0','none','0', 'history,none','none','"+Date.now().toString()+"','none','"+pass_6.firstName+"','"+pass_6.studentName+"','"+pass_6.userName+"')", pass_6, (error, results, fields)=>{ 
                                                    let pass_7 = pass_6;
                                                    pool_users_db.query("INSERT INTO userID_"+pass_7.idKey+"_activities VALUES('deleted','0','none','0', 'deleted_by_teacher,none','none','"+Date.now().toString()+"','none','none','none','none')", pass_7, (error, results, fields)=>{ 
                                                        let pass_8 = pass_7;
                                                        pool_myplace_db.query("CREATE TABLE userID_"+pass_8.idKey+"_awards_display(sceneImageID varchar(200) PRIMARY KEY, scene varchar(200), imageID varchar(200), x_pos int, y_pos int, height int, z_Index int, invertX varchar(200), user varchar(200), credit int, aux_1 varchar(200), aux_2 varchar(200), aux_3 varchar(200))", pass_8, (error, results, fields)=>{
                                                            let pass_9 = pass_8;
                                                            pool_myplace_db.query("INSERT INTO userID_"+pass_9.idKey+"_awards_display VALUES('User_Details','none','none',0,0,0,0,'none','"+pass_9.firstName+"',0,'aux_1','aux_2','aux_3')", pass_9, (error, results, fields)=>{
                                                                socketResp(pass_9);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                } else { getIdKey(pass_1); }
                            });
                        }; getIdKey(pass_1);
                    } else { pass_1.userName = pass_1.userName + Math.floor(Math.random() * 999).toString();  getUniqueUserName(pass_1); }
                });
            }; getUniqueUserName(params);
        } else { socketResp('bad data sent thru'); }
    });

    //######################################################################################################
    /////// ### following socket connection are from the student "teacher_main_menu" page //////////////////
    
    socket.on('fetch_current_teacher_games', (idKey,socketResp) => { 
        pool_teachers_db.query("SELECT arrayOfStudents, currentGame, game_1, game_2, game_3, game_4, game_5, game_6, game_7, game_8, game_9, game_10, groupTitles, groupGames FROM teacherID_"+idKey+" WHERE ref='"+idKey+"' LIMIT 1", (error, results, fields)=>{
            socketResp(results); // results are removed from results[0] via browser
        });
    });
    
    socket.on('update_teacher_games', (game,socketResp) => {
        pool_teachers_db.query("UPDATE teacherID_"+game.ref+" SET game_1='"+game.g1+"',game_2='"+game.g2+"',game_3='"+game.g3+"',game_4='"+game.g4+"',game_5='"+game.g5+"',game_6='"+game.g6+"',game_7='"+game.g7+"',game_8='"+game.g8+"',game_9='"+game.g9+"',game_10='"+game.g10+"' WHERE ref='"+game.ref+"'", (error, results, fields)=>{
            socketResp('currentGame has been updated');        
        });
    });
    
    socket.on('set_as_current_teacher_game', (ref, currentGame) => { pool_teachers_db.query("UPDATE teacherID_"+ref+" SET currentGame='"+currentGame+"' WHERE ref='"+ref+"'"); });
    
    socket.on('update_maxStudentGroup', (ref, maxStudentGroup) => { pool_teachers_db.query("UPDATE teacherID_"+ref+" SET maxStudentGroup='"+maxStudentGroup+"' WHERE ref='"+ref+"'"); });

    socket.on('save_group_games_to_teacher_db', (ref, groupGames) => { pool_teachers_db.query("UPDATE teacherID_"+ref+" SET groupGames='"+groupGames+"' WHERE ref='"+ref+"'"); });

    function retrieve_and_check_redisData(gCode,returnRedis) {
        
        redis.MGET([gCode+'_game_status',gCode+'_linked_users',gCode+'_user_results',gCode+'_user_ranking',gCode+'_teacher_details']).then( (data) => {

            if (data[0] == null || data[1] == null || data[2] == null || data[3] == null || data[4] == null ) {

                pool_teachers_db.query("SELECT * FROM "+gCode+" WHERE gCode='"+gCode+"'", gCode, (error, results, fields)=>{ // socketResp(results[0].game_status);

                    // to test, run following in redis-cli terminal
                    // DEL _game_status _linked_users _user_results

                    redis.SETEX(gCode+'_game_status', 7200, results[0].game_status).then( () => { // SET for 2 hr = 7200 seconds
                        redis.SETEX(gCode+'_linked_users', 7200, results[0].linked_users).then( () => {
                            redis.SETEX(gCode+'_user_results', 7200, results[0].user_results).then( () => {  
                                redis.SETEX(gCode+'_user_ranking', 7200, results[0].user_ranking).then( () => { 
                                    redis.SETEX(gCode+'_teacher_details', 7200, results[0].teacher_details).then( () => {
                                                    // data = [game_status, linked_users, user_results, user_ranking, teacher_details]
                                        redis.MGET([gCode+'_game_status',gCode+'_linked_users',gCode+'_user_results',gCode+'_user_ranking',gCode+'_teacher_details']).then( (data) => {
                                            returnRedis(data);
                                        });
                                    });                
                                });
                            });
                        });
                    });

                });                
            }
            else { returnRedis(data); }
        });
    }

    socket.on('check_num_users_linked_to_game', (gameCode, socketResp) => {
        retrieve_and_check_redisData(gameCode, (data) => { // data = [game_status, linked_users, user_results, user_ranking, teacher_details]
            let numOfUser = 0;
            numOfUser = data[1].split('|').length - 2;
            socketResp(data[0]+'|>|'+numOfUser);                    // state>>timeStamp>>round>>maxGroupSize>>currentGame
        });
    });

    socket.on('get_guest_gameCode', (params,socketResp) => { 
        let alpha = ['a','b'];  let alphaNum = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','5','6','7','8','9','j','k','m','p','q','r','s','t','v','w','x','y','z','2','3','4','5','6','7','8','9'];
            
        let getGameCode = function(params) { 
    		let dig1 = Math.floor(Math.random() * 2);  let dig2 = Math.floor(Math.random() * 41);  let dig3 = Math.floor(Math.random() * 41);  let dig4 = Math.floor(Math.random() * 41);
            let gameCode = alpha[dig1]+alphaNum[dig2]+alphaNum[dig3]+alphaNum[dig4];

            params.gameCode = gameCode;
            redis.GET(gameCode+'_teacher_details').then( (results) => { 
                if (results !== null || gameCode == 'arse' || gameCode=='cunt' || gameCode=='fuck' || gameCode=='dick' || gameCode=='slut' || gameCode=='fukk' || gameCode=='shit' || gameCode=='kunt' || gameCode=='piss' || gameCode=='pooo' ) { 
                    getGameCode(params);  // try again for a unique gameCode
                }
                else {
                    let pass = params;
                    let game_status = "not_started_yet>>"+Date.now().toString()+">>0>>"+pass.maxGroupSize+">>"+pass.currentGame;

                    redis.SETEX(pass.gameCode+'_game_status', 7200, game_status).then( () => { // SETEX for 2 hr = 7200 seconds
                        redis.SETEX(pass.gameCode+'_linked_users', 7200, '|').then( () => {
                            redis.SETEX(pass.gameCode+'_user_results', 7200, '').then( () => {  
                                redis.SETEX(pass.gameCode+'_user_ranking', 7200, '').then( () => { 
                                    redis.SETEX(pass.gameCode+'_teacher_details', 7200, 'nonMember>>guest').then( () => { 
                                        redis.SETEX(pass.gameCode+'_last_reBoot', 7200, 'none').then( () => { 
                                            pool_teachers_db.query("CREATE TABLE "+pass.gameCode+"(gCode varchar(10) PRIMARY KEY, game_status text, linked_users text, user_results text, user_ranking text, teacher_details text)", pass, (error, results, fields)=>{
                                                pool_teachers_db.query("INSERT INTO "+pass.gameCode+" VALUES('"+pass.gameCode+"','"+game_status+"','|','|','|','nonMember>>guest')", (error, results, fields)=>{ 
                                                    socketResp(pass.gameCode);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        }; getGameCode(params);
    });

    socket.on('start_game_sequence', (params) => { //params = [ "state", "timeStamp", "round", "maxGroupSize", "currentGame", "total_rnds"]
        let game_status = "uploading_wait>>"+Date.now().toString()+">>0>>"+params.maxGroupSize+">>"+params.currentGame+">>"+params.total_rnds;

        redis.SETEX(params.gameCode+'_game_status', 7200, game_status).then( () => { // start_clicked
            get_ready_to_START_new_round(params.gameCode);
        });
    });

    let get_ready_to_START_new_round = function(gameCode) {  // ################### GAME LOOP #################################################################

        retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]

            let game_status = data[0].split('>>');                           // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
            let game_status_wait;
            
            if (game_status[0] == 'deleted') { game_status_wait = "deleted>>endGame"; }
            else {
                let nextRnd = parseInt(game_status[2]) + 1;
                if (game_status.length == 7) { // this means that "pause" has been added to the end
                    game_status_wait = "uploading_wait_to_start>>"+Date.now().toString()+">>"+nextRnd+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]+">>paused";
                }
                else {
                    game_status_wait = "uploading_wait_to_start>>"+Date.now().toString()+">>"+nextRnd+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5];
                }
            }
            redis.SETEX(gameCode+'_game_status', 7200, game_status_wait).then( () => {
                pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_wait+"', user_results='"+data[gameCode+'_user_results']+"', user_ranking='"+data[gameCode+'_user_ranking']+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                    io.in(gameCode).emit(gameCode+'_get_ready_to_START', game_status_wait);  // wait_to_run
                });
            });
        });

        setTimeout( () => { io.in(gameCode).emit(gameCode+'nextActivity');  // tells user what the next activity name is
            setTimeout( () => { io.in(gameCode).emit(gameCode+'_countDown', '3');  // socket.emit(gameCode+'_countDown', '3');
                setTimeout( () => { io.in(gameCode).emit(gameCode+'_countDown', '2');  // socket.emit(gameCode+'_countDown', '2');
                    setTimeout( () => { io.in(gameCode).emit(gameCode+'_countDown', '1');  // socket.emit(gameCode+'_countDown', '1');
                    
                        setTimeout( () => {
                            
                            retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]

                                let game_status = data[0].split('>>');       // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                                let game_status_running;
                                if (game_status[0] == 'deleted') { game_status_running = "deleted>>endGame"; }
                                else {
                                    if (game_status.length == 7) {
                                        game_status_running = "running>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]+">>paused";
                                    }
                                    else {
                                        game_status_running = "running>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5];
                                    }
                                }
                                redis.SETEX(gameCode+'_game_status', 7200, game_status_running).then( () => {
                                    pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_running+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                                        io.in(gameCode).emit(gameCode+'_START', game_status_running);  // running
                                    });
                                });
                            });
                            
                            setTimeout( () => {
                                retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                    let game_status = data[0].split('>>');       // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                                    let game_status_60s_complete;
                                    if (game_status[0] == 'deleted') { game_status_60s_complete = "deleted>>endGame"; }
                                    else {
                                        if (game_status.length == 7) {
                                            game_status_60s_complete = "rnd_complete_results_transfer>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]+">>paused";
                                        }
                                        else {
                                            game_status_60s_complete = "rnd_complete_results_transfer>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5];
                                        }
                                    }
                                    redis.SETEX(gameCode+'_game_status', 7200, game_status_60s_complete).then( () => {
                                        pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_60s_complete+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                                            io.in(gameCode).emit(gameCode+'_round_of_60sec_completed', game_status_60s_complete);  // tells all users to send thru their results for the run so it can be updated
                                        });
                                    });        
                                });

                                setTimeout( () => {
                                    retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                        io.in(gameCode).emit(gameCode+'_retreive_all_user_round_data', data[2]);
                                    });
                                    
                                    setTimeout( () => { 
                                        retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                            
                                            let game_status = data[0].split('>>');           // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                                            if (game_status[2] == game_status[5]) { // therefore game has "finished" all rounds
                                                let game_status_finished = "finished>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4];
                                                if (gameCode[0] == 'a' || gameCode[0] == 'b') { 
                                                    redis.SETEX(gameCode+'_game_status', 7200, game_status_finished).then( () => {
                                                        pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_finished+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                                                            io.in(gameCode).emit(gameCode+'_game_has_finished', 'game_has_finished');
                                                        });
                                                    });
                                                }
                                                else { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                                    let last_game_results = data[2];
                                                    let last_game_ranking = data[3];
                                                    let teacherDetails = data[4];
                                                    let teacherID = teacherDetails.split('>>')[0];

                                                    pool_teachers_db.query("UPDATE teacherID_"+teacherID+" SET lastGameResults='"+last_game_results+"', lastGameRankings='"+last_game_ranking+Date.now().toString()+"|NotAllocated' WHERE ref='"+teacherID+"'", (error, results, fields)=>{
                                                        redis.SETEX(gameCode+'_game_status', 7200, game_status_finished).then( () => {
                                                            pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_finished+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                                                                io.in(gameCode).emit(gameCode+'_game_has_finished', 'game_has_finished');
                                                            });
                                                        });
                                                    });
                                                }
                                            }
                                            else if (game_status.length == 7) { // games has been "paused" by the teacher, noted due to addition of ">>paused"
                                                let game_status_waiting = data[0].replace('>>paused','>>waiting');
                                                redis.SETEX(gameCode+'_game_status', 7200, game_status_waiting).then( () => { 
                                                    pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_waiting+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                                                        io.in(gameCode).emit(gameCode+'_game_paused', 'game_paused');
                                                    });
                                                });
                                            }
                                            else { 
                                                last_game_results = data[2];
                                                last_game_ranking = data[3];
                                                teacherID = data[4].split('>>')[0];
                                                
                                                pool_teachers_db.query("UPDATE teacherID_"+teacherID+" SET lastGameResults='"+last_game_results+"', lastGameRankings='"+last_game_ranking+Date.now().toString()+"|NotAllocated' WHERE ref='"+teacherID+"'", gameCode, (error, results, fields)=>{
                                                    get_ready_to_START_new_round(gameCode);
                                                });
                                            }
                                        });
                                    }, 5000);   // retreive_all_user_round_data = get_ready_to_START_new_round OR game_has_finished
                                }, 8000);       // round_of_60sec_completed     = retreive_all_user_round_data
                            }, 60000);          // START                        = round_of_60sec_completed
                        }, 1000);               // countDown 1                  = START
                    }, 1000);                   // countDown 2                  = countDown 1
                }, 1000);                       // countDown 3                  = countDown 2
            }, 4000);                           // get_read_to_start            = countDown 3
        }, 2000);                               // display next activity name
    };

    socket.on('entering_game_after_start', (gameCode) => {
        retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
            if (data[0].split('>>')[0] == 'running') {                      // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                socket.emit(gameCode+'_get_ready_to_START', data[0]);
                
                setTimeout( () => { socket.emit(gameCode+'_countDown', 'GO');
                    setTimeout( () => { socket.emit(gameCode+'_START', 'start'); 
                    }, 1500 );
                }, 500 );
            }
        });
    });

    socket.on('game_paused_by_teacher', (gameCode,socketResp) => { 
        retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
            let game_status_paused = data[0]+">>paused";  
            redis.SETEX(gameCode+'_game_status', 7200, game_status_paused).then( () => { 
                pool_teachers_db.query("UPDATE "+gameCode+" SET game_status='"+game_status_paused+"' WHERE gCode='"+gameCode+"'", gameCode, (err, results, fields)=>{
                    socketResp(game_status_paused);
                });
            });
        });
    });

    socket.on('game_reStart_from_paused', (gameCode,socketResp) => { 
        retrieve_and_check_redisData(gameCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
            
            let game_status = data[0].split('>>');

            if (game_status[6] == 'paused') {
                redis.SETEX(gameCode+'_game_status', 7200, data[0].replace('>>paused','')).then( () => { 
                    socketResp('gameCode_'+gameCode+'_turn_paused_OFF');
                });
            }
            
            if (game_status[6] == 'waiting') {
                redis.SETEX(gameCode+'_game_status', 7200, data[0].replace('>>waiting','')).then( () => { 
                    get_ready_to_START_new_round(gameCode);
                    socketResp('gameCode_'+gameCode+'_turn_pausedWAITING_OFF');
                });
            }
        });
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // reBoot order //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // reBoot_at_round_end --> reBoot_to_start_game_after_loaded --> reBoot_after_62sec_of_running --> reBoot_at_round_end ///
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('reBoot_at_round_end', (gCode_Rnd) => { // reboot if no response after 63 sec game time
        
        redis.GET(gCode+'_game_status').then( (game_status) => {
            if (game_status.split('>>').length == 6) {                          // check if game has been 'paused' before reBooting the start of the next round
        
                gCode = gCode_Rnd.split('|>|')[0];
                gRnd = gCode_Rnd.split('|>|')[1];
        
                let reBoot_atRoundEnd = false;
        
                redis.GET(gCode+'_last_reBoot').then( (last_reBoot) => { 
                    
                    if (last_reBoot !== gRnd+'>reBoot_at_round_end') { reBoot_atRoundEnd = true; }
                    if (parseInt(gRnd) < parseInt(last_reBoot.split('>')[0])) { reBoot_atRoundEnd = false; }
                    
                    if (reBoot_atRoundEnd) {    
                        
                        redis.SETEX(gCode+'_last_reBoot', 7200, gRnd+'>reBoot_at_round_end').then( () => {
                            get_ready_to_START_new_round(gCode);
                        });
                    }
                });
            }
        });
    });

    socket.on('reBoot_to_start_game_after_loaded', (gCode_Rnd) => { // reboot if no response after 63 sec game time
        gCode = gCode_Rnd.split('|>|')[0];
        gRnd = gCode_Rnd.split('|>|')[1];    

        let reBoot_toStartGameAfterLoaded = false;
        
        redis.GET(gCode+'_last_reBoot').then( (last_reBoot) => {
            
            if (last_reBoot !== gRnd+'>reBoot_to_start_game_after_loaded') { reBoot_toStartGameAfterLoaded = true; }
            if (parseInt(gRnd) < parseInt(last_reBoot.split('>')[0])) { reBoot_toStartGameAfterLoaded = false; }

            if (reBoot_toStartGameAfterLoaded) {

                redis.SETEX(gCode+'_last_reBoot', 7200, gRnd+'>reBoot_to_start_game_after_loaded').then( () => {    
    
                    retrieve_and_check_redisData(gCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
            
                        let game_status = data[0].split('>>');       // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                        let game_status_running;
                        if (game_status[0] == 'deleted') { game_status_running = "deleted>>endGame"; }
                        else {
                            if (game_status.length == 7) {
                                game_status_running = "running>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]+">>paused";
                            }
                            else { game_status_running = "running>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]; }
                        }
                        redis.SETEX(gCode+'_game_status', 7200, game_status_running).then( () => {
                            pool_teachers_db.query("UPDATE "+gCode+" SET game_status='"+game_status_running+"' WHERE gCode='"+gCode+"'", gCode, (err, results, fields)=>{
                                io.in(gCode).emit(gCode+'_START', game_status_running);  // running
                            });
                        });
                    });
                });
            }
        });
    });

    socket.on('reBoot_after_62sec_of_running', (gCode_Rnd) => { // reboot if no response after 63 sec game time
        gCode = gCode_Rnd.split('|>|')[0];
        gRnd = gCode_Rnd.split('|>|')[1];     

        let reBoot_after62secOfRunning = false;

        redis.GET(gCode+'_last_reBoot').then( (last_reBoot) => {
            
            if (last_reBoot !== gRnd+'>reBoot_after_62sec_of_running') { reBoot_after62secOfRunning = true; }
            if (parseInt(gRnd) < parseInt(last_reBoot.split('>')[0])) { reBoot_after62secOfRunning = false; }

            if (reBoot_after62secOfRunning) {
            
                redis.SETEX(gCode+'_last_reBoot', 7200, gRnd+'>reBoot_after_62sec_of_running').then( () => { 

                    retrieve_and_check_redisData(gCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                        let game_status = data[0].split('>>');       // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                        let game_status_60s_complete;
                        if (game_status[0] == 'deleted') { game_status_60s_complete = "deleted>>endGame"; }
                        else {
                            if (game_status.length == 7) {
                                game_status_60s_complete = "rnd_complete_results_transfer>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5]+">>paused";
                            }
                            else {
                                game_status_60s_complete = "rnd_complete_results_transfer>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4]+">>"+game_status[5];
                            }
                        }
                        redis.SETEX(gCode+'_game_status', 7200, game_status_60s_complete).then( () => {
                            pool_teachers_db.query("UPDATE "+gCode+" SET game_status='"+game_status_60s_complete+"' WHERE gCode='"+gCode+"'", gCode, (err, results, fields)=>{
                                io.in(gCode).emit(gCode+'_round_of_60sec_completed', game_status_60s_complete);  // tells all users to send thru their results for the run so it can be updated
                            });
                        });        
                    });
                    
                    setTimeout( () => {
                        retrieve_and_check_redisData(gCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                            io.in(gCode).emit(gCode+'_retreive_all_user_round_data', data[2]);
                        });
                        
                        setTimeout( () => { 
                            retrieve_and_check_redisData(gCode, (data) => { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                
                                let game_status = data[0].split('>>');           // [ state, timeStamp, round, maxGroupSize, currentGame, total_rnds ]
                                if (game_status[2] == game_status[5]) { // therefore game has "finished" all rounds
                                    let game_status_finished = "finished>>"+Date.now().toString()+">>"+game_status[2]+">>"+game_status[3]+">>"+game_status[4];
                                    if (gCode[0] == 'a' || gCode[0] == 'b') { 
                                        redis.SETEX(gCode+'_game_status', 7200, game_status_finished).then( () => {
                                            pool_teachers_db.query("UPDATE "+gCode+" SET game_status='"+game_status_finished+"' WHERE gCode='"+gCode+"'", gCode, (err, results, fields)=>{
                                                io.in(gCode).emit(gCode+'_game_has_finished', 'game_has_finished');
                                            });
                                        });
                                    }
                                    else { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                        let last_game_results = data[2];
                                        let last_game_ranking = data[3];
                                        let teacherDetails = data[4];
                                        let teacherID = teacherDetails.split('>>')[0];
            
                                        pool_teachers_db.query("UPDATE teacherID_"+teacherID+" SET lastGameResults='"+last_game_results+"', lastGameRankings='"+last_game_ranking+Date.now().toString()+"|NotAllocated' WHERE ref='"+teacherID+"'", (error, results, fields)=>{
                                            redis.SETEX(gCode+'_game_status', 7200, game_status_finished).then( () => {
                                                pool_teachers_db.query("UPDATE "+gCode+" SET game_status='"+game_status_finished+"' WHERE gCode='"+gCode+"'", gCode, (err, results, fields)=>{
                                                    io.in(gCode).emit(gCode+'_game_has_finished', 'game_has_finished');
                                                });
                                            });
                                        });
                                    }
                                }
                                else if (game_status.length == 7) { // games has been "paused" by the teacher, noted due to addition of ">>paused"
                                    let game_status_waiting = data[0].replace('>>paused','>>waiting');
                                    redis.SETEX(gCode+'_game_status', 7200, game_status_waiting).then( () => { 
                                        pool_teachers_db.query("UPDATE "+gCode+" SET game_status='"+game_status_waiting+"' WHERE gCode='"+gCode+"'", gCode, (err, results, fields)=>{
                                            io.in(gCode).emit(gCode+'_game_paused', 'game_paused');
                                        });
                                    });
                                }
                                else { // data =[game_status, linked_users, user_results, user_ranking, teacher_details]
                                    last_game_results = data[2];
                                    last_game_ranking = data[3];
                                    teacherID = data[4].split('>>')[0];
                                    
                                    pool_teachers_db.query("UPDATE teacherID_"+teacherID+" SET lastGameResults='"+last_game_results+"', lastGameRankings='"+last_game_ranking+Date.now().toString()+"|NotAllocated' WHERE ref='"+teacherID+"'", gCode, (error, results, fields)=>{
                                        get_ready_to_START_new_round(gCode);
                                    });
                                }
                            });
                        }, 5000);   // retreive_all_user_round_data = get_ready_to_START_new_round OR game_has_finished
                    }, 8000);       // round_of_60sec_completed     = retreive_all_user_round_data
                });
            }
        });
    });

    //##############################################################################################
    /////// ### following socket connections are from the teacher "assign student_tasks" page //////////////

    ////////////////////////////////////////////////////////////////////////////
    socket.on('fetch_my_students', (idKey,socketResp) => { 
        pool_teachers_db.query("SELECT teacherName, arrayOfStudents, taskDueDays, lastGameRankings, groupTitles FROM teacherID_"+idKey+" WHERE ref='"+idKey+"'", (error, results, fields)=>{
            socketResp(results);
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    socket.on('fetch_students_task_states', (ref_pushed,socketResp) => { 
        pool_users_db.query("SELECT activityNotes FROM userID_"+ref_pushed+"_activities WHERE userName='teacherTasks'", ref_pushed, (error, results, fields)=>{ 
            results.push(ref_pushed);  // push on in order to pass thru via socket
            socketResp(results);
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    socket.on('update_student_tasks', (params,socketResp) => { let homeWork = params.student_tasks+','+Date.now();  // params = {"userRef":ref,"student_tasks":student_tasks,"teacherRef":idKey}
        pool_users_db.query("UPDATE userID_"+params.userRef+"_activities SET activityNotes='"+homeWork+"' WHERE activity='"+params.teacherRef+"_tasks'", params.userRef, (error, results, fields)=>{
            if (!error) { socketResp('success|'+params.userRef); }
        });
    });    
    ////////////////////////////////////////////////////////////////////////////
    socket.on('teacher_update_myStudents', (idKey_arrayOfStudents,socketResp) => { ref = idKey_arrayOfStudents[0];  arrayOfStudents = idKey_arrayOfStudents[1];
        pool_teachers_db.query("UPDATE teacherID_"+ref+" SET arrayOfStudents='"+arrayOfStudents+"' WHERE ref='"+ref+"'", (error, results, fields)=>{ 
            socketResp('success');
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    socket.on('update_gameData_allocated', (params) => {
        pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET lastGameRankings='"+params.lastGameRankingsAllocated+"' WHERE ref='"+params.ref+"'", (error, results, fields)=>{ });
    });
    ////////////////////////////////////////////////////////////////////////////
    socket.on('fetch_my_students_details', (student_search_string,socketResp) => {
        pool_users_db.query("SELECT idKey, userName, userPassCode FROM aaaa_Data_Table_of_Users WHERE "+student_search_string, (error, results, fields)=>{
            if (!error) { socketResp(results); }
        });
    });
    ////////////////////////////////////////////////////////////////////////////
    socket.on('update_taskDueDays', (task_due_days) => { ref = task_due_days.split('|>>|')[0];  taskDueDays = task_due_days.split('|>>|')[1]; // ref|>>|1|>|2|>|3
        pool_teachers_db.query("UPDATE teacherID_"+ref+" SET taskDueDays='"+taskDueDays+"' WHERE ref='"+ref+"'");
    });    
    //##############################################################################################
    /////// ### following socket connection are from the teacher "student_tasks" page //////////////    
    socket.on('delete_single_student', (params,socketResp) => { 

        pool_users_db.query("SELECT activityNotes FROM userID_"+params.userRef+"_activities WHERE activity='teacherCodes'", params, (error, results, fields)=>{
            pass_1 = params;
            let array_of_linked_teachers = results[0].activityNotes.split(',')

            if (array_of_linked_teachers.length == 1) {
                pool_users_db.query("DELETE FROM aaaa_Data_Table_of_Users WHERE idKey='"+pass_1.userRef+"'", pass_1, (err, results, fields)=>{
                    pass_2 = pass_1;
                    pool_users_db.query("DROP TABLE userID_"+pass_2.userRef+"_activities", pass_2, (err, results, fields)=>{
                        pass_3 = pass_2;
                        pool_myplace_db.query("DROP TABLE userID_"+pass_2.userRef+"_awards_display", pass_3, (err, results, fields)=>{
                            socketResp('deleted|'+pass_3.userRef);
                        });
                    });
                });
            }
            else {
                let updated_linked_teachers =[];
                
                array_of_linked_teachers.forEach( (teacher) => { 
                    if (teacher.split('_')[0] !== pass_1.teacherRef) { updated_linked_teachers.push(teacher) }
                });
                
                // if (updated_linked_teachers.length == 0 || updated_linked_teachers[0] == 'none') { updated_linked_teachers = 'none'; }
                
                pool_users_db.query("UPDATE userID_"+pass_1.userRef+"_activities SET activityNotes='"+updated_linked_teachers+"' WHERE activity='teacherCodes'", pass_1, (error, results, fields)=>{ 
                    pass_2 = pass_1;
                    pool_users_db.query("DELETE FROM userID_"+pass_2.userRef+"_activities WHERE activity='"+pass_2.teacherRef+"_tasks'", pass_2, (error, results, fields)=>{ 
                        socketResp('deleted|'+pass_2.userRef);
                    });
                });
            }
        });
    });
    
    socket.on('record_task_NOT_completed', (refTaskDate) => { // {"ref":ref, "task":activity, "dueDate":dateDue }
        pool_users_db.query("SELECT activityNotes FROM userID_"+refTaskDate.ref+"_activities WHERE activity='deleted' LIMIT 1", refTaskDate, (error, results, fields)=>{
            pass_1 = refTaskDate;
            deletedTasks = pass_1.task+','+pass_1.dueDate+','+results[0].activityNotes;
            pool_users_db.query("UPDATE userID_"+pass_1.ref+"_activities SET activityNotes='"+deletedTasks+"' WHERE activity='deleted'" );
        });
    });
    
    ////////////////////////////////////////////////////////////////////////////
    socket.on('fetch_student_history', (userRef,socketResp) => {
        pool_users_db.query("SELECT activityNotes, user FROM userID_"+userRef+"_activities WHERE activity='history' LIMIT 1", (error, results, fields)=>{
            if ( results.length === 0 ) { socketResp('no_history'); }
            else { socketResp(results); }
        });
    });

    //##############################################################################################
    /////// ### following socket connection are from the teacher "student_profile" page //////////////////

    socket.on('fetch_student_deleted_tasks', (userRef,socketResp) => {
        pool_users_db.query("SELECT activityNotes, user FROM userID_"+userRef+"_activities WHERE activity='deleted' LIMIT 1", (error, results, fields)=>{
            if ( results.length === 0 ) { socketResp('no_deleted_history'); }
            else { socketResp(results); }
        });
    });
    
    ////////////////////////////////////////////////////////////////////////////
    socket.on('update_studentFullNamePassWord', (params,socketResp) => { // params = { "userRef":ref, "teacherRef":idKey, "passWord":passWordNew, "fullName":nameFullNew, "firstName":nameFullNew.split(' ')[0], "origFullName":nameFull }
        pool_users_db.query("UPDATE aaaa_Data_Table_of_Users SET studentFirstName='"+params.firstName+"', studentFullName='"+params.fullName+"', userPassCode='"+params.passWord+"' WHERE idKey='"+params.userRef+"'", params, (error, results, fields)=>{
            let pass_1 = params;
            pool_users_db.query("UPDATE userID_"+pass_1.userRef+"_activities SET user='"+pass_1.firstName+"', studentFullName='"+pass_1.fullName+"' WHERE activity='history'", pass_1, (error, results, fields)=>{
                let pass_2 = pass_1;
                pool_teachers_db.query("SELECT arrayOfStudents FROM teacherID_"+pass_2.teacherRef+" WHERE ref='"+pass_2.teacherRef+"'", pass_2, (error, results, fields)=>{
                    let pass_3 = pass_2;
                    let arrayOfStudents = results[0].arrayOfStudents;           //socketResp(arrayOfStudents);
                    let newArrayOfStudents = arrayOfStudents.replace(pass_3.userRef+">"+pass_3.origFullName, pass_3.userRef+">"+pass_3.fullName);       // socketResp(newArrayOfStudents);
                    pool_teachers_db.query("UPDATE teacherID_"+pass_3.teacherRef+" SET arrayOfStudents='"+newArrayOfStudents+"' WHERE ref='"+pass_3.teacherRef+"'", pass_3, (error, results, fields)=>{
                        let pass_4 = pass_3;
                        pool_myplace_db.query("UPDATE userID_"+pass_4.userRef+"_awards_display SET user='"+pass_4.firstName+"' WHERE sceneImageID='User_Details'", (error, results, fields)=>{
                            socketResp('check if all has been updated'); 
                        });
                    });
                });
            });
        });
    });

    socket.on('update_studentUserNameAndALL', (params,socketResp) => { // params = { "ref":ref, "userNameNEW":userNameNew }
        pool_users_db.query("SELECT userName FROM aaaa_Data_Table_of_Users WHERE userName='"+params.userNameNEW+"' LIMIT 1", params, (error, results, fields)=>{
            if ( results.length > 0 ) { socketResp('check, looks like it has been used by another STUDENT!!!!!'); }
            else {
                pass_1 = params;
                pool_teachers_db.query("SELECT userName FROM aaaa_Data_Table_of_Teachers WHERE userName='"+pass_1.userNameNEW+"' LIMIT 1", pass_1, (error, results, fields)=>{
                    if ( results.length > 0 ) { socketResp('check, looks like it has been used by another TEACHER!!!!!'); }
                    else {
                        pass_2 = pass_1;
                        pool_users_db.query("UPDATE aaaa_Data_Table_of_Users SET userName='"+pass_2.userNameNEW+"' WHERE idKey='"+pass_2.ref+"'", (error, results, fields)=>{
                            socketResp('uniqueUserName_updatedSuccessfully');
                        });
                    }
                });
            }
        });
    });

    //##############################################################################################
    /////// ### following socket connection are from the student "play_game" page //////////////////

    socket.on('join_teacher_gameRoom', (gameCode,socketResp) => { 
        socket.join(gameCode);

        redis.MGET([gameCode+'_game_status',gameCode+'_linked_users']).then( (data) => {
            if (data[0] !== null && data[1] !== null) {
                socketResp( data[0]+'>>>>'+data[1] );
            }
        });
    });

    socket.on('update_user_gameScore', (gameRound_user_results) => {            // gameCode = userRef>>score>>respTime>>round>>user>>groupColour|

        let game_userResults = gameRound_user_results.split('=');
        let gameCode = game_userResults[0];
        let userResults = game_userResults[1];

        redis.APPEND(gameCode+'_user_results', userResults);
        // redis.APPEND(gameCode+'_user_results', userResults).then( () => { });
    });

    socket.on('update_user_rankings', (gameRound_user_ranking) => { gCode_gRndUserRankings =  gameRound_user_ranking.split('=');
        redis.APPEND(gCode_gRndUserRankings[0]+'_user_ranking', gCode_gRndUserRankings[1]);
        // redis.APPEND(gCode_gRndUserRankings[0]+'_user_ranking', gCode_gRndUserRankings[1]).then( () => { });
    });

    //##############################################################################################
    ///// ### following socket connection are from the student "teacher/registration" page /////////

    socket.on('create_username_and_send_email', (createAcct,socketResp) => { // createAcct = [ type, payORfree, fullName, teacherName, email, password ]
        let thisUser = {"teacherName":createAcct[3], "email":createAcct[4], "password":createAcct[5], "classPW":createAcct[6], "nameTyped":createAcct[2], "acctType":createAcct[0] };

        pool_teachers_db.query("SELECT * FROM aaaa_Data_Table_of_Teachers WHERE userEmail='"+thisUser.email+"'", thisUser, (error, results, fields)=>{

            if (results.length !== 0) { // does not allow email address to be used on more than one account
                socketResp('email_has_been_used');
            }
            else {
                if (thisUser.nameTyped.split(" ").length == 1) { thisUser.firstName = thisUser.nameTyped; }
                else { thisUser.firstName = thisUser.nameTyped.split(" ")[0]; }
            
                thisUser.userName = thisUser.nameTyped.toLowerCase().split(' ').join('');
            
                let getUniqueUserName = function(thisUser) {
                    pool_users_db.query("SELECT * FROM aaaa_Data_Table_of_Users WHERE userName='"+thisUser.userName+"'", thisUser, (error, results, fields)=>{
                        if ( results.length === 0 ) { 
                
                            let pass_1 = thisUser;
                            pool_teachers_db.query("SELECT * FROM aaaa_Data_Table_of_Teachers WHERE userName='"+pass_1.userName+"'", pass_1, (error, results, fields)=>{
                                if ( results.length === 0 ) { 
            
                                    let pass_2 = pass_1;
                                    let getIdKey = function(pass_2) {
                 
                                		dig1 = Math.floor(Math.random() * 41);      dig2 = Math.floor(Math.random() * 41);
                                		dig3 = Math.floor(Math.random() * 41);      dig4 = Math.floor(Math.random() * 41);
                                		dig5 = Math.floor(Math.random() * 41);      dig6 = Math.floor(Math.random() * 41);
            
                                        let convert = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','5','6','7','8','9','j','k','m','p','q','r','s','t','v','w','x','y','z','2','3','4','5','6','7','8','9'];
            
                                        let idKey = convert[dig1]+convert[dig2]+convert[dig3]+convert[dig4]+convert[dig5]+convert[dig6];
                                        // let idKey = 'r'+'u'+'s'+'s'+convert[dig5]+convert[dig6];
                                        // idKey = 'nonMember';
            
                                        pass_2.idKey = idKey;
                                        pool_teachers_db.query("SELECT idKey FROM aaaa_Data_Table_of_Teachers WHERE idKey='"+idKey+"'", pass_2, (error, results, fields)=>{
            
                                            let pass_4 = pass_2;
                                            if ( results.length === 0 ) { 
                                                pool_teachers_db.query("INSERT INTO aaaa_Data_Table_of_Teachers (idKey,userName,userEmail,firstName,teacherName,gameCode,arrayOfStudents,userPassCode,registerDate,access,expiryDate,fullName,taskDueDays,game_aux,lastGameResults,lastGameRankings,maxStudentGroup,aux_1,aux_2,aux_3,aux_4) VALUES ('"+pass_4.idKey+"','"+pass_4.userName+"','"+pass_4.email+"','"+pass_4.firstName+"','"+pass_4.teacherName+"|>|"+pass_4.classPW+"','none','S','"+pass_4.password+"','"+Date.now().toString()+"','"+pass_4.acctType+"','"+(Date.now()+1209600000).toString()+"','"+pass_4.nameTyped+"','2|>|4|>|6','game_aux','none','none','4','5min_cnt_started','ax2','ax3','ax4')", pass_4, (error, results, fields)=>{
                                                    pool_teachers_db.query("CREATE TABLE teacherID_"+idKey+"(ref varchar(100) PRIMARY KEY, userName text, firstName text, teacherName text, classPW text, gameCode text, arrayOfStudents text, registerDate text, access text, currentGame text, game_1 text, game_2 text, game_3 text, game_4 text, game_5 text, game_6 text, game_7 text, game_8 text, game_9 text, game_10 text, game_11 text, taskDueDays text, lastGameResults text, lastGameRankings text, maxStudentGroup text, groupTitles text, groupGames text, aux_1 text, aux_2 text, aux_3 text)", pass_4, (error, results, fields)=>{
                                                        pool_teachers_db.query("INSERT INTO teacherID_"+idKey+" (ref,userName,firstName,teacherName,classPW,gameCode,arrayOfStudents,registerDate,access,currentGame,game_1,game_2,game_3,game_4,game_5,game_6,game_7,game_8,game_9,game_10,game_11,taskDueDays,lastGameResults,lastGameRankings,maxStudentGroup,groupTitles,groupGames,aux_1,aux_2,aux_3) VALUES ('"+pass_4.idKey+"','"+pass_4.userName+"','"+pass_4.firstName+"','"+pass_4.teacherName+"','"+pass_4.classPW+"','none','S','"+Date.now().toString()+"','none','Year 4|&|add_2d_1d_no_regroup|&|sub_2d_1d_no_regrouping|&|doubles_10_to_20|&|tt_easy_click_answerTT5|&|operators_mixed','none','none','none','none','none','none','none','none','none','none','none','2|>|4|>|6','none','none','4','none','none','ax1','ax2','ax3')", pass_4, (error, results, fields)=>{
            
                                                            let email_address = pass_4.email;
                                                            // let transporter = nodemailer.createTransport({ host:"mail.teachertables.com", port:465, secure:true, auth:{ user:'admin@teachertables.com', pass:'RetirementPresent4May', }, });
                                                            const msg = { from:'"The Teacher Tables App" <admin@teachertables.com>', to:email_address,
                                                                subject : 'your Teacher Tables keycode',
                                                                text : 'Here is your Key Code',
            
                                                                html : "<div style='font-size:20px'>Hi there,<br>" +
                                                                        // "Regarding "+results[0].studentFirstName+"'s timestables.com.au account:<br>" +
                                                                        "Username is <b>"+pass_4.userName+"</b><br>" +
                                                                        "<u>keycode</u> is <b>"+pass_4.idKey+"</b><br>" +
                                                                        "We hope you enjoy our app.<br>" +
                                                                        "Kind regards,<br>" +
                                                                        "<i>Russell and the Team</i></p></div>",
                                                            }
                                                            const info = transporter.sendMail(msg);
                                                            socketResp(pass_4.idKey);
                                                        });
                                                    });
                                                });
                                            }
                                            else { getIdKey(pass_2); }
                                        });
                                    };
                                    getIdKey(pass_2);
                                }
                                else { thisUser.userName = thisUser.userName + Math.floor(Math.random() * 999).toString();  return getUniqueUserName(thisUser);  }
                            });
                        }
                        else { thisUser.userName = thisUser.userName + Math.floor(Math.random() * 999).toString();  return getUniqueUserName(thisUser);  }
                    });
                };
                getUniqueUserName(thisUser);
            }
        });
    });

    socket.on('update_teacher_access', (idKey,socketResp)  => {
        pool_teachers_db.query("UPDATE aaaa_Data_Table_of_Teachers SET aux_1='ax1' WHERE idKey='"+idKey+"'", idKey, (error, results, fields)=>{
            pool_teachers_db.query("SELECT * FROM aaaa_Data_Table_of_Teachers WHERE idKey='"+idKey+"'", (error, results, fields)=>{ let thisTeacher = results[0];

                let date = new Date( parseInt(thisTeacher.expiryDate) );
                let thisDate = date.toString().split(' ');
                thisDate = thisDate[1]+' '+thisDate[2]+', '+thisDate[3];
                
                let email_address = thisTeacher.userEmail;
                // let transporter = nodemailer.createTransport({ host:"mail.teachertables.com", port:465, secure:true, auth:{ user:'admin@teachertables.com', pass:'RetirementPresent4May', }, });
                const msg = { from:'"Teacher Tables Admin" <admin@teachertables.com>', to:email_address,
                    subject : 'your Teacher Tables account details',
                    text : 'Here are your account details',

                    html : "<div style='font-size:20px'>Hi "+thisTeacher.firstName+",<br>" +
                            "Username is <b>"+thisTeacher.userName+"</b><br>" +
                            "Password is <b>"+thisTeacher.userPassCode+"</b><br>" +
                            "Teacher Name is <b>"+thisTeacher.teacherName.split('|>|')[0]+"</b><br>" +
                            "Expiry Date is <b>"+thisDate+"</b><br>" +
                            "We hope you enjoy our app.<br>" +
                            "Kind regards,<br>" +
                            "<i>Russell and the Team</i></p></div>",
                }
                const info = transporter.sendMail(msg);
                socketResp(thisTeacher);
            });
        });
    });

    socket.on('start_10min_idKey_check', (idKey,socketResp) => { 
        setTimeout( () => { 
            pool_teachers_db.query("SELECT aux_1 FROM aaaa_Data_Table_of_Teachers WHERE idKey='"+idKey+"'", idKey, (error, results, fields)=>{ 
                if (results[0].aux_1 == '5min_cnt_started') {
                    pool_teachers_db.query("DELETE FROM aaaa_Data_Table_of_Teachers WHERE idKey='"+idKey+"'", idKey, (err, results, fields)=>{
                        pool_teachers_db.query("DROP TABLE teacherID_"+idKey, idKey, (err, results, fields)=>{
                            socketResp('idKey: '+idKey+', has timed out and been deleted');
                        });
                    });
                }
            });
        }, 300000 );
    });

    //###################################################################################################################################################################
    ///// ### following socket connection are from the student "play_finish" .ejs individual games ///////// CURRENTLY THEY ARE NOT USED, to fetch or to socket ?????????

    socket.on('update_student_history', (ref_taskHistory,socketResp) => { // ref_taskHistory = {"ref":idKey, "taskHistory":history}
    
        pool_users_db.query("SELECT activityNotes FROM userID_"+ref_taskHistory.ref+"_activities WHERE activity='history'", ref_taskHistory, (error, results, fields)=>{
            let params = ref_taskHistory;
            if ( results.length === 0 ) {
                pool_users_db.query("INSERT INTO userID_"+params.ref+"_activities VALUES('history','0','none','0', '"+params.taskHistory+"','none','none','none','aux_1','aux_2','user')", (error, results, fields)=>{ 
                    socketResp('updated NEW history');
                });
            } 
            else {
                let storedHistory = results[0].activityNotes.split(',');
                let taskHistory = params.taskHistory;
                
                //  if same game but next round, then update this game, otherwise make new game entry.
                if ( storedHistory[3] == taskHistory[3] ) { 
                    storedHistory[1] = taskHistory[1];  storedHistory[2] = taskHistory[2]; 
                }
                else { storedHistory = params.taskHistory +','+ results[0].activityNotes }
                
                pool_users_db.query("UPDATE userID_"+params.ref+"_activities SET activityNotes='"+storedHistory+"' WHERE activity='history'", (error, results, fields)=>{
                    socketResp( "storedHistory" );
                });
            }
        });
    });

    socket.on('retrieve_student_homeWork', (userRef,socketResp) => {
        pool_users_db.query("SELECT activityNotes, homeWorkCnt FROM userID_"+userRef+"_activities WHERE userName='teacherTasks'", (error, results, fields)=>{ 
            socketResp(results);
        });
    });
    
    socket.on('retrieve_activity_value', (ref_activity,socketResp) => { // ref_activity = {"ref":idKey, "activity":activity}
        pool_users_db.query("SELECT score, time, attempts, homeWorkCnt FROM userID_"+ref_activity.ref+"_activities WHERE activity='"+ref_activity.activity+"'", ref_activity, (error, results, fields)=>{
            let params = ref_activity;
            if ( results.length === 0 ) { 
                pool_users_db.query("INSERT INTO userID_"+params.ref+"_activities VALUES('"+params.activity+"','0','off','0,0,0', 'thisActivity','0','none','none','aux_1','aux_2','user')", (error, results, fields)=>{
                    socketResp( {'score': '0', 'time': 'off', 'attempts': '0,0,0', 'homeWorkCnt': '0'} );
                });
            }
            else { 
                socketResp(JSON.stringify(results[0]));
            }
        });
    });

    socket.on('update_activity_value', (updateData,socketResp) => { // updateData = {"ref":idKey, "activity":activity, "score":highestCount, "time":bestTimeCount, "attempts":attemptsData };
        pool_users_db.query("UPDATE userID_"+updateData.ref+"_activities SET score='"+updateData.score+"', time='"+updateData.time+"', attempts='"+updateData.attempts+"' WHERE activity='"+updateData.activity+"'", (error, results, fields)=>{ 
            socketResp( 'Activity data has been updated.' );
        });
    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => { res.render('main_menu', { ref: 'nonMember', user: 'guest', userName: '' }); });

app.get('/student_log_in', (req, res) => { res.render('student_log_in', { ref: 'nonMember', user: 'guest', alert_username: '', alert_password: '' }); });
app.get('/log_in', (req, res) => { res.render('student_log_in', { ref: 'nonMember', user: 'guest', alert_username: '', alert_password: '' }); });

app.get('/teacher_log_in', (req, res) => { res.render('teacher/teacher_log_in', { alert_username: '', alert_password: '' }); });

app.get('/parent_log_in', (req, res) => { res.render('parent/parent_log_in', { alert_username: '', alert_password: '' }); });

app.get('/teacher_registration', (req, res) => { res.render('teacher/teacher_registration' ); });

app.get('/parent_registration', (req, res) => { res.render('parent/parent_registration' ); });

app.get('/teacher_recover_password', (req, res) => { res.render('teacher/teacher_pw_recovery' ); });

app.get('/parent_recover_password', (req, res) => { res.render('parent/parent_pw_recovery' ); });

app.get('/my_actions', (req, res) => { res.render('my_actions',  { ref: 'nonMember', user: 'guest', userName: '' }); });

////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/:ref', (req, res) => { let ref = req.params.ref;

    if (ref == 'nonMember') { res.render('teacher/teacher_menu_230503', {ref: 'nonMember', user: 'guest', game: 'none', maxStudentGroup: '4' }); }
    else {
        pool_teachers_db.query("SELECT firstName, gameCode, teacherName, maxStudentGroup FROM teacherID_"+ref+" WHERE ref='"+ref+"' LIMIT 1", ref, (error, results, fields)=>{
            if (error || !results || results == undefined) { }
            else { let gameCode = results[0].gameCode;
                if (gameCode[0] == 'c') {
                    res.render('teacher/teacher_group_games', { ref:ref, user:results[0].firstName, game:gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });
                }
                else {
                    res.render('teacher/teacher_menu_230503', { ref:ref, user:results[0].firstName, game:gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });
                }
            }
        });
    }
});
////////////////////////////////////////////////////////////////////////////////
// app.get('/parent/:ref', (req, res) => { let ref = req.params.ref;
//     res.render('parent/parent_menu', { ref: 'nonMember', user: 'guest', userName: '' });
// });
////////////////////////////////////////////////////////////////////////////////
app.get('/parent/:ref', (req, res) => { let ref = req.params.ref;

    if (ref == 'nonMember') { res.render('parent/parent_menu', {ref: 'nonMember', user: 'guest', game: 'none', maxStudentGroup: '4' }); }
    else {
        pool_teachers_db.query("SELECT firstName, teacherName FROM teacherID_"+ref+" WHERE ref='"+ref+"' LIMIT 1", ref, (error, results, fields)=>{
            if (error || !results || results == undefined) { }
            else { 
                // let gameCode = results[0].gameCode;
                // if (gameCode[0] == 'c') {
                //     res.render('parent/teacher_group_games', { ref:ref, user:results[0].firstName, game:gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });
                // }
                // else {
                    res.render('parent/parent_menu', { ref:ref, user:results[0].firstName, teacherName:results[0].teacherName  });
                }
            // }
        });
    }
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher_group_games/:ref', (req, res) => { let ref = req.params.ref;

    if (ref == 'nonMember') { res.render('teacher/teacher_group_games', {ref: 'nonMember', user: 'guest', game: 'none', maxStudentGroup: '4' }); }
    else {
        pool_teachers_db.query("SELECT firstName, gameCode, teacherName, maxStudentGroup FROM teacherID_"+ref+" WHERE ref='"+ref+"' LIMIT 1", ref, (error, results, fields)=>{
            if (error || !results || results == undefined) { }
            else { 
                res.render('teacher/teacher_group_games', { ref:ref, user:results[0].firstName, game:results[0].gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });
            }
        });
    }
});
////////////////////////////////////////////////////////////////////////////////
app.get('/:ref/:user', (req, res) => {
    if (req.params.ref !== 'nonMember') {
        // pool_users_db.query("SELECT idKey FROM aaaa_Data_Table_of_Users WHERE idKey='"+req.params.ref+"'", req.params, (error, results, fields)=>{
            // if (results) { 
            
                let params = req.params;
                res.render('main_menu', { ref: params.ref, user: params.user, userName: '' });
                
            // }
            // else { res.render('main_menu', { ref: 'nonMember', user: 'guest', userName: '' }); }
        // });
    }
    else { res.render('main_menu', { ref: 'nonMember', user: 'guest', userName: '' }); }
});
////////////////////////////////////////////////////////////////////////////////
app.get('/exit_game/:ref/:user', (req, res) => {
    if (req.params.ref !== 'nonMember') {
        
        pool_users_db.query("UPDATE userID_"+req.params.ref+"_activities SET gameCode='none' WHERE activity='teacherCodes'", req.params, (error, results, fields)=>{
        
        // pool_users_db.query("SELECT idKey FROM aaaa_Data_Table_of_Users WHERE idKey='"+req.params.ref+"'", req.params, (error, results, fields)=>{
            // if (results) { 
            
                let params = req.params;
                res.render('main_menu', { ref: params.ref, user: params.user, userName: '' });
                
            // }
            // else { res.render('main_menu', { ref: 'nonMember', user: 'guest', userName: '' }); }
        });
    }
    else { res.render('main_menu', { ref: 'nonMember', user: 'guest', userName: '' }); }
});


////////////////////////////////////////////////////////////////////////////////
app.get('/activities_menu/:ref/:user', (req, res) => {
    res.render('activities_menu', { ref: req.params.ref, user: req.params.user });  
});
////////////////////////////////////////////////////////////////////////////////
app.get('/my_tasks/:ref/:user', (req, res) => {
    res.render('my_tasks', { ref: req.params.ref, user: req.params.user });  
});
////////////////////////////////////////////////////////////////////////////////
app.get('/my_history/:ref/:user', (req, res) => {
    res.render('my_history', { ref: req.params.ref, user: req.params.user });  
});
//////////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/my_students/:ref/:from', (req, res) => { 

    if (req.params.ref == 'nonMember' || req.params.ref.length !== 6) {
        // res.redirect('/teacher/'+req.params.ref);
        res.render('teacher/teacher_my_students', {ref: 'nonMember', user: 'guest', game: 'none', teacherName: 'no acct', from: 'from?' });
    }
    else {
        pool_teachers_db.query("SELECT * FROM teacherID_"+req.params.ref+" WHERE ref='"+req.params.ref+"' LIMIT 1", req.params, (error, results, fields)=>{
            if ( results.length !== 0 ) {
                params = req.params;
                if (params.from == 'post_game') {
                    res.render('teacher/teacher_my_students', { ref: params.ref, user: results[0].firstName, game: 'none', teacherName:results[0].teacherName, from: params.from});
                }
                else {
                    res.render('teacher/teacher_my_students', { ref: params.ref, user: results[0].firstName, game: results[0].gameCode, teacherName:results[0].teacherName, from: params.from });
                }
            }
            else res.render('teacher/teacher_my_students', {ref: 'nonMember', user: 'guest', game: 'none', teacherName: 'no acct', from: 'from?' });
        });
    }
});
//////////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/assign_tasks/:ref/:userRef', (req, res) => { 

    if (req.params.ref == 'nonMember' || req.params.ref.length !== 6) {
        res.render('teacher/teacher_assign_tasks', {ref: 'nonMember', user: 'guest', game: 'none', teacherName: 'no acct', searchStudent: 'none' });
    }
    else {
        pool_teachers_db.query("SELECT * FROM teacherID_"+req.params.ref+" WHERE ref='"+req.params.ref+"' LIMIT 1", req.params, (error, results, fields)=>{
            if ( results.length !== 0 ) {
                params = req.params;
                res.render('teacher/teacher_assign_tasks', { ref: params.ref, user: results[0].firstName, game: results[0].gameCode, teacherName:results[0].teacherName, searchStudent: params.userRef });
            }
            else res.render('teacher/teacher_assign_tasks', {ref: 'nonMember', user: 'guest', game: 'none', teacherName: 'no acct', searchStudent: 'none' });
        });
    }
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/teacher_profile/:ref/:user', (req, res) => {  // res.send('teacher/student_profiles');
    pool_teachers_db.query("SELECT userName, userEmail, teacherName, userPassCode, expiryDate FROM aaaa_Data_Table_of_Teachers WHERE idKey='"+req.params.ref+"'", req.params, (error, results, fields)=>{
        let thisT = results[0];
        res.render('teacher/teacher_profile', {ref:req.params.ref, user:req.params.user, userName:thisT.userName, userEmail:thisT.userEmail, teacherName:thisT.teacherName, password:thisT.userPassCode, expiryDate:thisT.expiryDate });
    });
});
//////////teacher/footer_bttns//////////////////////////////////////////////////
app.get('/teacher/teacher_faqs/:ref/:user', (req, res) => {             res.render('teacher/teacher_faqs', {ref:req.params.ref, user:req.params.user }); });
app.get('/teacher/teacher_how_to_videos/:ref/:user', (req, res) => {    res.render('teacher/teacher_how_to_videos', {ref:req.params.ref, user:req.params.user }); });
app.get('/teacher/teacher_contact_us/:ref/:user', (req, res) => {       res.render('teacher/teacher_contact_us', {ref:req.params.ref, user:req.params.user }); });
app.get('/teacher/teacher_privacy_policy/:ref/:user', (req, res) => {   res.render('teacher/teacher_privacy_policy', {ref:req.params.ref, user:req.params.user }); });

////////////////////////////////////////////////////////////////////////////////
app.get('/teacher_fetch/fetch_recovery_email/:recoveryEmail', (req, res) => {  

    pool_teachers_db.query("SELECT userName, userEmail, teacherName, userPassCode, expiryDate FROM aaaa_Data_Table_of_Teachers WHERE userEmail='"+req.params.recoveryEmail+"'", req.params, (error, results, fields)=>{
        if (results.length !== 0) {
            
            // let transporter = nodemailer.createTransport({ host:"mail.teachertables.com", port:465, secure:true, auth:{ user:'admin@teachertables.com', pass:'RetirementPresent4May', }, });
            const msg = {   from    :'"The Teacher Tables App" <admin@teachertables.com>', 
                            to      :req.params.recoveryEmail,
                            subject :'your Teacher Tables accountt details',
                            text    :'Here are your account details',

                            html    :   "<div style='font-size:20px'>Recovery username and email:<br>" +
                                        "Username is <b>"+results[0].userName+"</b><br>" +
                                        "Password is <b>"+results[0].userPassCode+"</b><br>" +
                                        "Please let us know if you have any further problems.<br>" +
                                        "Kind regards,<br>" +
                                        "<i>Russell and the Team</i></div>",
            }
            const info = transporter.sendMail(msg);            

            res.send('success');
        }
        else { res.send('no account or past date????'); }
    });
});

////////////////////////////////////////////////////////////////////////////////
app.get('/teacher_fetch/update_acct_details/:ref/:user/:teacherName/:userEmail/:userPassCode/:student_PW', (req, res) => {  let params = req.params;
    pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET teacherName='"+params.teacherName+"', classPW='"+params.student_PW+"' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
        pool_teachers_db.query("UPDATE aaaa_Data_Table_of_Teachers SET userEmail='"+params.userEmail+"', teacherName='"+params.teacherName+"|>|"+params.student_PW+"', userPassCode='"+params.userPassCode+"' WHERE idKey='"+params.ref+"'", params, (error, results, fields)=>{
            res.send(params);  // send params???
        });
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher_fetch/update_student_tasks/:userRef/:student_tasks/:teacherRef', (req, res) => { let homeWork = req.params.student_tasks; // let homeWork = req.params.student_tasks+','+Date.now();
        pool_users_db.query("UPDATE userID_"+req.params.userRef+"_activities SET activityNotes='"+homeWork+"' WHERE activity='"+req.params.teacherRef+"_tasks'", req.params, (error, results, fields)=>{
            if (!error) { res.send('success|'+req.params.userRef); }
        });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher_fetch/save_groupTitles/:ref/:groupTitles', (req, res) => {   //let homeWork = req.params.student_tasks+','+Date.now();
    pool_teachers_db.query("UPDATE teacherID_"+req.params.ref+" SET groupTitles='"+req.params.groupTitles+"' WHERE ref='"+req.params.ref+"'", req.params, (error, results, fields)=>{
            if (!error) { res.send('success updated groupTitles to = '+req.params.groupTitles); }
        });
});

////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/student_profiles/:ref/:user', (req, res) => {  // res.send('teacher/student_profiles');
    res.render('teacher/teacher_student_profiles', {ref: req.params.ref, user: req.params.user });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/teacher_print_student_tabs/:ref/:user', (req, res) => {  
    res.render('teacher/teacher_print_student_tabs', {ref: req.params.ref, user: req.params.user });
});
app.get('/teacher/teacher_print_page_list/:ref/:user', (req, res) => {  
    res.render('teacher/teacher_print_page_list', {ref: req.params.ref, user: req.params.user });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/submit_game_code/:ref/:user', (req, res) => { // this is route to direct user to 'submit_game_code', but only if not already in a game.
    if (req.params.ref == 'nonMember') { res.render('submit_game_code', { ref:'nonMember', user:'guest', teacherLinks:'none', alert_gameCode:'' }); }
    else {
        pool_users_db.query("SELECT activityNotes, gameCode FROM userID_"+req.params.ref+"_activities WHERE activity='teacherCodes' LIMIT 1", req.params, (error, results, fields)=>{ 
            let params = req.params;
            params.activityNotes = results[0].activityNotes;
            if (results[0].gameCode == 'none') { res.render('submit_game_code', { ref:params.ref, user:params.user, teacherLinks:results[0].activityNotes, alert_gameCode:'' }); }
            else { 
                // it goes here if student has already been logged in to game but got out BUT still has a recorded gameCode in their db.
                redis.GET(results[0].gameCode+'_game_status').then( (gameStatus) => { gState = gameStatus.split('>>')[0];
                    if (gState !== 'deleted' || gState !== 'finished') {
                        // then get redisData of gameCode_student_groups and send through as well.  if it equals 'none' then either no student groupings.  if it doesn't exist then it is a single game
                        // in play_game the student worls out which group it is in, or none
                        res.render('teacher/play_game_230503', {gameCode:results[0].gameCode, ref:params.ref, user:params.user});
                    }
                    else { // this only runs if there is a gamecode in user's db but game no longer exists.  it sets the student db gameCode = 'none' and goes to page
                        pool_users_db.query("UPDATE userID_"+params.ref+"_activities SET gameCode='none' WHERE activity='teacherCodes'", params, (error, results, fields)=>{
                            let pass = params;
                            res.render('submit_game_code', { ref:pass.ref, user:pass.user, teacherLinks:pass.activityNotes, alert_gameCode:'' });
                        });
                    }
                });
            }
        });
    }
});

//////////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/teacher_activities_menu/:ref/:user', (req, res) => {
    res.render('teacher/teacher_activities_menu', {ref: req.params.ref, user: req.params.user });
});
//////////////////////////////////////////////////////////////////////////////////////
//////////  GET links user to Activity Menus /////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////
app.get('/activities/:ref/:user/:activity', (req, res) => {
    res.render('activities_menus/'+req.params.activity+'_menu', { ref: req.params.ref, user: req.params.user }); 
});
//////////////////////////////////////////////////////////////////////////////////////
//////////  PLAY ACTIVITY ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
app.get('/play_finish/:ref/:user/:activity/:timer', (req, res) => {
    res.render('play_finish/'+req.params.activity, { ref: req.params.ref, user: req.params.user, activity: req.params.activity, timer: req.params.timer });
});

app.get('/play_finish/:ref/:user/:activity/:timer/:table_num', (req, res) => {
    res.render('play_finish/'+req.params.activity, { ref: req.params.ref, user: req.params.user, timer: req.params.timer, activity: req.params.activity, table_num: req.params.table_num });
});
////////////////////////////////////////////////////////////////////////////////
/////////////  user_fetch //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// this fetch also has socket equivalent, is it used else where ??? ////////////
app.get('/user_fetch/retrieve_homeWork/:userRef', (req, res) => { //  res.send('retrieve_homeWork');
    pool_users_db.query("SELECT activityNotes, homeWorkCnt FROM userID_"+req.params.userRef+"_activities WHERE userName='teacherTasks'", (error, results, fields)=>{ 
        res.send(results);
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/user_fetch/retrieve_homeWork_activity_rnd_cnt/:userRef/:activity', (req, res) => { // res.send('retrieve_homeWork_activity_rnd_cnt');
    pool_users_db.query("SELECT attempts, user FROM userID_"+req.params.userRef+"_activities WHERE activity='"+req.params.activity+"' LIMIT 1", (error, results, fields)=>{ 
        res.send(results[0]);
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/user_fetch/retrieve_history/:userRef', (req, res) => { 
    pool_users_db.query("SELECT activityNotes FROM userID_"+req.params.userRef+"_activities WHERE activity='history' LIMIT 1", (error, results, fields)=>{ 
        if ( results.length === 0 ) { res.send(); }
        else { res.send(results[0].activityNotes); }
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/user_fetch/is_there_active_gCode/:userRef', (req, res) => { 
    pool_users_db.query("SELECT gameCode FROM userID_"+req.params.userRef+"_activities WHERE activity='teacherCodes' LIMIT 1", (error, results, fields)=>{ 
        res.send(results);
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/user_fetch/retrieve_all_activity_data/:userRef', (req, res) => { // res.send('retrieve_all_attempts');
    pool_users_db.query("SELECT activity, score, time, attempts, homeWorkCnt FROM userID_"+req.params.userRef+"_activities WHERE activityNotes='thisActivity' ", (error, results, fields)=>{ 
        res.send(results);
    });
});
////////////////////////////////////////////////////////////////////////////////
// this has been converted to socket, is fetch used else where??? //
app.get('/user_fetch/update_history/:ref/:taskHistory', (req, res) => {  // res.send(req.params.taskHistory);

    pool_users_db.query("SELECT activityNotes FROM userID_"+req.params.ref+"_activities WHERE activity='history'", req.params, (error, results, fields)=>{
        let params = req.params;
        if ( results.length === 0 ) {
            pool_users_db.query("INSERT INTO userID_"+params.ref+"_activities VALUES('history','0','none','0', '"+params.taskHistory+"','none','none','none','aux_1','aux_2','user')", (error, results, fields)=>{ 
                res.send('updated NEW history');
            });
        } 
        else {
            let storedHistory = results[0].activityNotes.split(',');
            let taskHistory = params.taskHistory.split(',');                    // taskHistory = [ activity, roundNum, sessionHighestScore, timeOfHighestScore, currentSession ];
            
            //  if same game but next round, then update this game, otherwise make new game entry. this is checked by looking at the date.now of when games was started.  
            if ( storedHistory[4] == taskHistory[4] ) {
                storedHistory[1] = taskHistory[1];  storedHistory[2] = taskHistory[2];   storedHistory[3] = taskHistory[3]; 
            }
            else { storedHistory = params.taskHistory +','+ results[0].activityNotes; }
            
            pool_users_db.query("UPDATE userID_"+params.ref+"_activities SET activityNotes='"+storedHistory+"' WHERE activity='history'", (error, results, fields)=>{
                res.send( "storedHistory" );
            });
        }
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/user_fetch/retrieve_homeWorkCnt/:userRef/:activity', (req, res) => { // res.send('retrieve_all_attempts');
    pool_users_db.query("SELECT homeWorkCnt FROM userID_"+req.params.userRef+"_activities WHERE activity='"+req.params.activity+"'", (error, results, fields)=>{ 
        if (results.length == 0) { res.send('0'); }  // there is not activity data so resp needs to be zero 0
        else { res.send(results[0].homeWorkCnt); }
        
    });
});
////////////////////////////////////////////////////////////////////////////////
// this fetch has an equivalent socket, is it used else where ???? /////////////
app.get('/retrieve_activity_value/:ref/:activity', (req, res) => { //res.send('getting values now');
    pool_users_db.query("SELECT score, time, attempts, homeWorkCnt FROM userID_"+req.params.ref+"_activities WHERE activity='"+req.params.activity+"'", req.params, (error, results, fields)=>{
        let params = req.params;
        if ( results.length === 0 ) { 
            pool_users_db.query("INSERT INTO userID_"+params.ref+"_activities VALUES('"+params.activity+"','0','off','0,0,0', 'thisActivity','0','none','none','aux_1','aux_2','user')", (error, results, fields)=>{
                res.send( {'score': '0', 'time': 'off', 'attempts': '0,0,0', 'homeWorkCnt': '0'} );
            });
        }
        else { res.send(JSON.stringify(results[0])); }
    });
});
//////////////////////////////////////////////////////////////////////////////////////
// this fetch has an equivalent socket, is it used else where ???? /////////////
app.get('/user_fetch/update_activity_value/:ref/:activity/:score/:time/:attempts', (req, res) => {
    pool_users_db.query("UPDATE userID_"+req.params.ref+"_activities SET score='"+req.params.score+"', time='"+req.params.time+"', attempts='"+req.params.attempts+"' WHERE activity='"+req.params.activity+"'", (error, results, fields)=>{ 
        res.send( 'Activity data has been updated.' );
    });
});
//////////////////////////////////////////////////////////////////////////////////////
app.get('/update_credit_value/:ref/:add_credit', (req, res) => { 
    let params = req.params;
    pool_myplace_db.query("SELECT credit FROM userID_"+params.ref+"_awards_display WHERE sceneImageID='User_Details'", params, (error, results, fields)=>{ 
        let new_credit = results[0].credit + parseInt(params.add_credit);
        pool_myplace_db.query("UPDATE userID_"+params.ref+"_awards_display SET credit="+new_credit+" WHERE sceneImageID='User_Details'", (error, results, fields)=>{
            res.send( 'My Place credit has been updated.' );
        });
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/get_game_code/:ref/:user', (req, res) => { // res.send('in /teacher/get_game_code/');
    // only teacher who are logged in get thru to here.  there will be an ejs condition on menu page to activitate the btn, otherwise they get a message
    pool_teachers_db.query("SELECT * FROM teacherID_"+req.params.ref+" WHERE ref='"+req.params.ref+"' LIMIT 1", req.params, (error, results, fields)=>{
        
        if (results[0].gameCode !== 'none') {
            res.render('teacher_menu', { ref: results[0].ref, user: results[0].firstName, game: results[0].gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });            
        }
        else { // res.send('in else of /teacher/get_game_code/');
            let thisTeacher = results[0];

            let alpha = ['d','e','f','g','h','j','k','m','p','q','r','s','t','v','w','x','y','z'];
            let alphaNum = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','5','6','7','8','9','j','k','m','p','q','r','s','t','v','w','x','y','z','2','3','4','5','6','7','8','9'];
                
            let getGameCode = function(thisTeacher) { 
        		let dig1 = Math.floor(Math.random() * 18);      let dig2 = Math.floor(Math.random() * 41);
        		let dig3 = Math.floor(Math.random() * 41);      let dig4 = Math.floor(Math.random() * 41);
        
                let gameCode = alpha[dig1]+alphaNum[dig2]+alphaNum[dig3]+alphaNum[dig4];
                thisTeacher.gameCode = gameCode;
                    
                redis.GET(gameCode+'_teacher_details').then( (isResults) => {  // res.send(isResults);
                    if (isResults !== null || gameCode == 'arse' || gameCode=='cunt' || gameCode=='fuck' || gameCode=='dick' || gameCode=='slut' || gameCode=='fukk' || gameCode=='shit' || gameCode=='kunt' || gameCode=='piss' || gameCode=='pooo' ) { 
                        getGameCode(thisTeacher);  // try again for a unique gameCode
                    }
                    else {
                        let pass_1 = thisTeacher;
                        let game_status = "not_started_yet>>"+Date.now().toString()+">>0>>"+pass_1.maxStudentGroup+">>"+pass_1.currentGame;
                        
                        let teacher_details = pass_1.ref+'>>'+pass_1.teacherName+'>>'+pass_1.classPW+'>>'+pass_1.arrayOfStudents;

                        gCode = pass_1.gameCode;        // res.send(gCode);

                        redis.SETEX(gCode+'_teacher_details', 7200, teacher_details).then( (teacherDetailsState) => {
                            redis.SETEX(gCode+'_linked_users', 7200, '|').then( (linkedState)      => {
                                redis.SETEX(gCode+'_user_results', 7200, '').then( (userResultsState) => {
                                    redis.SETEX(gCode+'_user_ranking', 7200, '').then( (userRankingState) => {
                                        redis.SETEX(gCode+'_game_status', 7200, game_status).then( (gStatusState)     => {
                                            redis.SETEX(gCode+'_last_reBoot', 7200, 'none').then( () => { 
                                                pool_teachers_db.query("INSERT INTO aaaa_List_of_gameCodes VALUES('"+pass_1.gameCode+"','"+Date.now().toString()+"','"+pass_1.ref+"','"+pass_1.teacherName+"','"+pass_1.arrayOfStudents+"','ax1')", pass_1, (error, results, fields)=>{
                                                    let pass_2 = pass_1;
                                                    pool_teachers_db.query("UPDATE teacherID_"+pass_2.ref+" SET gameCode='"+pass_2.gameCode+"' WHERE ref='"+pass_2.ref+"'", pass_2, (error, results, fields)=>{
                                                        let pass_3 = pass_2;
                                                        pool_teachers_db.query("CREATE TABLE "+pass_3.gameCode+"(gCode varchar(10) PRIMARY KEY, game_status text, linked_users text, user_results text, user_ranking text, teacher_details text)", pass_3, (error, results, fields)=>{
                                                            let pass_4 = pass_3;
                                                            pool_teachers_db.query("INSERT INTO "+pass_4.gameCode+" VALUES('"+pass_4.gameCode+"','"+game_status+"','|','3','4','"+teacher_details+"')", pass_4, (error, results, fields)=>{ 
                                                                res.redirect('/teacher/'+pass_4.ref);
                                                            });
                                                        });                                                                
                                                    });    
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
                    
                // });
                
            }; 
            getGameCode(thisTeacher);
        }
    });        
});
////////////////////////////////////////////////////////////////////////////////
app.get('/teacher/get_group_games_code/:ref/:user', (req, res) => { 
    // only teacher who are logged in get thru to here.  there will be an ejs condition on menu page to activitate the btn, otherwise they get a message
    pool_teachers_db.query("SELECT * FROM teacherID_"+req.params.ref+" WHERE ref='"+req.params.ref+"' LIMIT 1", req.params, (error, results, fields)=>{
        
        if (results[0].gameCode !== 'none') {
            res.render('teacher_main', { ref: results[0].ref, user: results[0].firstName, game: results[0].gameCode, teacherName:results[0].teacherName, maxStudentGroup:results[0].maxStudentGroup });            
        }
        else {
            let thisTeacher = results[0];

            let alpha = ['c','d','e','f','g','h','j','k','m','p','q','r','s','t','v','w','x','y','z'];
            let alphaNum = ['2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','5','6','7','8','9','j','k','m','p','q','r','s','t','v','w','x','y','z','2','3','4','5','6','7','8','9'];
                
            let getGameCode = function(thisTeacher) { 
        		let dig1 = Math.floor(Math.random() * 19);      let dig2 = Math.floor(Math.random() * 41);
        		let dig3 = Math.floor(Math.random() * 41);      let dig4 = Math.floor(Math.random() * 41);
        
                let gameCode = 'c'+alphaNum[dig2]+alphaNum[dig3]+alphaNum[dig4];
                thisTeacher.gameCode = gameCode;

                redis.GET(gameCode+'_teacher_details').then( (isResults) => { 
                    if (isResults !== null || gameCode=='arse' || gameCode=='cunt' || gameCode=='fuck' || gameCode=='dick' || gameCode=='slut' || gameCode=='fukk' || gameCode=='shit' || gameCode=='kunt' || gameCode=='piss' || gameCode=='pooo' ) { 
                        getGameCode(thisTeacher);  // try again for a unique gameCode
                    }
                    else {
                        // NEED to take maxStudentGroup and currentGame from menu page as opposed to reading from db as new teacher account won't display games without pressing a game bttn
                        let pass_1 = thisTeacher;
                        let game_status = "not_started_yet>>"+Date.now().toString()+">>0>>"+pass_1.maxStudentGroup+">>"+pass_1.currentGame;
                        
                        let teacher_details = pass_1.ref+'>>'+pass_1.teacherName+'>>'+pass_1.classPW+'>>'+pass_1.arrayOfStudents;
                        gCode = pass_1.gameCode;

                        redis.SETEX(gCode+'_teacher_details', 7200, teacher_details).then( (teacherDetailsState) => { 
                            redis.SETEX(gCode+'_linked_users', 7200, '|').then( (linkedState) => {
                                redis.SETEX(gCode+'_user_results', 7200, '').then( (userResultsState) => {
                                    redis.SETEX(gCode+'_user_ranking', 7200, '').then( (userRankingState) => {
                                        redis.SETEX(gCode+'_game_status', 7200, game_status).then( (gStatusState) => {
                                            redis.SETEX(gCode+'_last_reBoot', 7200, 'none').then( () => {
                                                pool_teachers_db.query("INSERT INTO aaaa_List_of_gameCodes VALUES('"+pass_1.gameCode+"','"+Date.now().toString()+"','"+pass_1.ref+"','"+pass_1.teacherName+"','"+pass_1.arrayOfStudents+"','ax1')", pass_1, (error, results, fields)=>{
                                                    let pass_2 = pass_1;
                                                    pool_teachers_db.query("UPDATE teacherID_"+pass_2.ref+" SET gameCode='"+pass_2.gameCode+"' WHERE ref='"+pass_2.ref+"'", pass_2, (error, results, fields)=>{
                                                        let pass_3 = pass_2;
                                                        pool_teachers_db.query("CREATE TABLE "+pass_3.gameCode+"(gCode varchar(10) PRIMARY KEY, game_status text, linked_users text, user_results text, user_ranking text, teacher_details text)", pass_3, (error, results, fields)=>{
                                                            let pass_4 = pass_3;
                                                            pool_teachers_db.query("INSERT INTO "+pass_4.gameCode+" VALUES('"+pass_4.gameCode+"','"+game_status+"','|','3','4','"+teacher_details+"')", pass_4, (error, results, fields)=>{ 
                                                                res.redirect('/teacher_group_games/'+pass_4.ref);
                                                            });
                                                        });                                                                
                                                    });    
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }; 
            getGameCode(thisTeacher);
        }
    });        
});

//////////////////////////////////////////////////////////////////////////////// 
app.get('/teacher/delete_game_redirect_to_myStudents/:ref/:gameCode', (req, res) => { delete_game(req.params,req.path.split('/')[2],res); });

app.get('/teacher/delete_game_via_click/:ref/:gameCode', (req, res) => { delete_game(req.params,req.path.split('/')[2],res); });

function delete_game(params,path,res) {

    pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET gameCode='none' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
        let pass = params;
        pool_teachers_db.query("DELETE FROM aaaa_List_of_gameCodes WHERE gameCode='"+pass.gameCode+"'", pass, (error, results, fields)=>{
            let pass_1 = pass;
            pool_teachers_db.query("DROP TABLE "+pass_1.gameCode, pass_1, (error, results, fields)=>{ 
                let pass_2 = pass_1;
                
                redis.GET(pass_2.gameCode+'_linked_users').then( (linked_users) => {
                    if (linked_users !== '|') {
                        let linkedUsers = linked_users.split('|');
                        
                        for (let n=1; n<(linkedUsers.length - 1); n++ ) { let user = linkedUsers[n].split('>')[0];
                            pool_users_db.query("UPDATE userID_"+user+"_activities SET gameCode='none' WHERE activity='teacherCodes'");
                        }
                    }
                    let gC = pass_2.gameCode;
                    redis.DEL([gC+'_teacher_details',gC+'_linked_users',gC+'_user_results',gC+'_user_ranking',gC+'_game_status',gC+'_last_reBoot']).then( () => {
                        if( path == 'delete_game_redirect_to_myStudents') { res.redirect('/teacher/my_students/'+params.ref+'/post_game'); }
                        else { res.redirect('/teacher/'+params.ref); }
                    });
                });
            });
        });
    });
}
    
    // pool_teachers_db.query("DROP TABLE sbbv", (error, results, fields)=>{ });
    
    // pool_teachers_db.query("SELECT teacherID FROM aaaa_List_of_gameCodes WHERE gameCode='"+params.gameCode+"'", params, (error, results, fields)=>{
    //     if ( results.length === 0 ) { 
    //         pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET gameCode='none' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
    //             res.redirect('/teacher/'+params.ref);
    //         });
    //     }
    //     else {
    //         pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET gameCode='none' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
    //             let pass = params;
    //             pool_teachers_db.query("DELETE FROM aaaa_List_of_gameCodes WHERE gameCode='"+pass.gameCode+"'", pass, (error, results, fields)=>{
    //                 let pass_1 = pass;
                    
    //                 redis.GET(pass_1.gameCode+'_linked_users').then( (linked_users) => {
    //                     if (linked_users !== '|') {
    //                         let linkedUsers = linked_users.split('|');
                            
    //                         for (let n=1; n<(linkedUsers.length - 1); n++ ) { let user = linkedUsers[n].split('>')[0];
    //                             pool_users_db.query("UPDATE userID_"+user+"_activities SET gameCode='none' WHERE activity='teacherCodes'");
    //                         }
    //                     }
            
    //                     redis.SETEX(pass_1.gameCode+'_game_status', 7200, "deleted>>endGame").then( () => {
    //                         if( path == 'delete_game_redirect_to_myStudents') { res.redirect('/teacher/my_students/'+params.ref+'/post_game'); }
    //                         else { res.redirect('/teacher/'+params.ref); }
    //                     });
    //                 });
                    
    //             });
    //         });
    //     }
    // });    
// }

//pool_users_db.query("DROP TABLE userID_"+pass_2.userRef+"_activities", pass_2, (err, results, fields)=>{

// function delete_game(params,path,res) {
    
//     pool_teachers_db.query("DROP TABLE sbbv", (error, results, fields)=>{ });
    
//     pool_teachers_db.query("SELECT teacherID FROM aaaa_List_of_gameCodes WHERE gameCode='"+params.gameCode+"'", params, (error, results, fields)=>{
//         if ( results.length === 0 ) { 
//             pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET gameCode='none' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
//                 res.redirect('/teacher/'+params.ref);
//             });
//         }
//         else {
//             pool_teachers_db.query("UPDATE teacherID_"+params.ref+" SET gameCode='none' WHERE ref='"+params.ref+"'", params, (error, results, fields)=>{
//                 let pass = params;
//                 pool_teachers_db.query("DELETE FROM aaaa_List_of_gameCodes WHERE gameCode='"+pass.gameCode+"'", pass, (error, results, fields)=>{
//                     let pass_1 = pass;
                    
//                     redis.GET(pass_1.gameCode+'_linked_users').then( (linked_users) => {
//                         if (linked_users !== '|') {
//                             let linkedUsers = linked_users.split('|');
                            
//                             for (let n=1; n<(linkedUsers.length - 1); n++ ) { let user = linkedUsers[n].split('>')[0];
//                                 pool_users_db.query("UPDATE userID_"+user+"_activities SET gameCode='none' WHERE activity='teacherCodes'");
//                             }
//                         }
            
//                         redis.SETEX(pass_1.gameCode+'_game_status', 7200, "deleted>>endGame").then( () => {
//                             if( path == 'delete_game_redirect_to_myStudents') { res.redirect('/teacher/my_students/'+params.ref+'/post_game'); }
//                             else { res.redirect('/teacher/'+params.ref); }
//                         });
//                     });
                    
//                 });
//             });
//         }
//     });    
// }

app.get('/teacher/delete_guest_game_via_click/:gameCode', (req, res) => { res.redirect('/teacher/nonMember'); });


////////////////////////////////////////////////////////////////////////////////
/////////////  teacher_fetch ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// this moved to socket
// app.get('/teacher_fetch/my_students/:ref', (req, res) => { // to load on teacher menu screen
//     pool_teachers_db.query("SELECT arrayOfStudents, lastGameRankings FROM teacherID_"+req.params.ref+" WHERE ref='"+req.params.ref+"'", (error, results, fields)=>{
//         res.send(results[0]);
//     });
// });
// /////////////////////////////////////////////////////////////////////////////
// app.get('/teacher_fetch/my_students_details/:student_search_string', (req, res) => {  // res.send('my_students_details: '+req.params.ref);
//     pool_users_db.query("SELECT idKey, userName, userPassCode FROM aaaa_Data_Table_of_Users WHERE "+req.params.student_search_string, (error, results, fields)=>{
//         if (!error) {  
//             res.send(results);
//         }
//     });
// });
// /////////////////////////////////////////////////////////////////////////////
// I think this has been moved to "fetch_students_task_states"
// app.get('/teacher_fetch/students_task_states/:userRef', (req, res) => { 
//     pool_users_db.query("SELECT activityNotes FROM userID_"+req.params.userRef+"_activities WHERE userName='teacherTasks'", (error, results, fields)=>{ 
//         res.send(results);
//     });
// });
//////////////////////////////////////////////////////////////////////////////////////
////  link registered "member" user to gameCode, that is, NOT a nonmember ////////////
//////////////////////////////////////////////////////////////////////////////////////
app.post('/link_user_to_gameCode/:ref/:user/:gameCode', (req, res) => { let params = req.body; // req.body = .ref, .user, .currentLinkedTeachers, .gameCode

    pool_teachers_db.query("SELECT gameCode, teacherID FROM aaaa_List_of_gameCodes WHERE gameCode='"+params.gameCode+"'", params, (err, results, fields)=>{
        if (err) { res.render('submit_game_code', { ref: params.ref, user: params.user, teacherLinks: params.currentLinkedTeachers, alert_gameCode: 'Error. Please refresh page.' }); }
        
        else if ( results[0] == null ) { res.render('submit_game_code', { ref: params.ref, user: params.user, teacherLinks: params.currentLinkedTeachers, alert_gameCode: 'Not a valid Game Code, see your teacher.' }); }

        else { 
            pool_users_db.query("UPDATE userID_"+params.ref+"_activities SET gameCode='"+params.gameCode+"' WHERE activity='teacherCodes'", params, (error, results, fields)=>{ 
                let params_2 = params;
                
                redis.GET(params_2.gameCode+'_linked_users').then( (linked_users) => { 
                    
                    if (!linked_users) { 
                        pool_teachers_db.query("SELECT * FROM "+params_2.gameCode, params, (err, results, fields)=>{
                            let gameStatus = results[0].game_status;
                            res.send(results[0].teacher_details)
                        });
                    }
                    else {
                        let thisRefUser = params_2.ref+'>'+params_2.user;
                        let user_NOT_linked = true;
                        
                        if (linked_users !== '|') {
                            linkedUsersArray = linked_users.split('|');
                            linkedUsersArray.forEach( (refUser) => { if(refUser == thisRefUser) { user_NOT_linked = false; } });
                            
                        }

                        if (user_NOT_linked) {
                            let linkedUsersAppended = linked_users+thisRefUser+'|';

                            redis.SETEX(params_2.gameCode+'_linked_users', 7200, linkedUsersAppended).then( () => { // start_clicked    

                                pool_teachers_db.query("UPDATE "+params_2.gameCode+" SET linked_users='"+linkedUsersAppended+"' WHERE gCode='"+params_2.gameCode+"'", params_2, (err, results, fields)=>{
                                    res.render('teacher/play_game_230503', {gameCode:params_2.gameCode,ref:params_2.ref,user:params_2.user});
                                });
                            });                            
                        }
                        else  { res.render('teacher/play_game_230503', {gameCode:params_2.gameCode,ref:params_2.ref,user:params_2.user}); }
                    }        
                });
            });
        }
    });        
});
////////////////////////////////////////////////////////////////////////////////
app.post('/link_casual_user_to_gameCode', (req, res) => { // req.body = .ref, .user, .currentLinkedTeachers, .gameCode

    redis.GET(req.body.gameCode+'_teacher_details').then( (results) => { // let teacher_details = teacherDetails.split('>>');

        if ( !results ) { res.render('submit_game_code', { ref: 'nonMember', user: 'guest', teacherLinks: 'none', alert_gameCode: 'Not a valid Game Code, see your teacher.' }); }

        let params = req.body;
        params.ref = params.gameCode + Math.floor(Math.random() * 9999).toString();  // else ref = logged-in idKey / ref

        let getUniqueRef = function(params) {
            redis.GET(params.gameCode+'_linked_users').then( (linked_users) => {
                
                let isUniqueRef = true;
                
                if (linked_users !== '|') {
                    let linkedUsers = linked_users.split('|');
                    linkedUsers.forEach( (user) => { 
                        if (user.split('>')[0] == params.ref && params.gameCode == params.ref.substring(0,4) ) { isUniqueRef = false; } 
                    });
                }
                if (isUniqueRef) {
                    linked_users = linked_users+params.ref+'>'+params.user+'|'
                    redis.APPEND(params.gameCode+'_linked_users', params.ref+'>'+params.user+'|').then( () => {  // this addes the user to the 'gameCode_linked_users'
                        res.render('teacher/play_game_230503', {gameCode:params.gameCode,ref:params.ref,user:params.user});
                    });
                }
                else {
                    params.ref = params.ref.substring(0,4) + Math.floor(Math.random() * 9999).toString();
                    getUniqueRef(params);
                }
            });
        };
        getUniqueRef(params);
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////
//////////  USER Log-in & Registration Routes ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
app.post('/user_log_in', (req, res) => { 
    let userName = req.body.userName.toLowerCase().split(' ').join('');
    let passCode = req.body.passWord.split(' ').join('');

    pool_users_db.query("SELECT idKey, userName, studentFirstName, userPassCode FROM aaaa_Data_Table_of_Users WHERE userName='"+userName+"'", passCode, (err, results, fields)=>{ 
        if (err) { res.render('student_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Looks like there is a problem.', alert_password: 'Please reload page.' }); }
        else if (results[0] == null) {
            res.render('student_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Not a valid username, see teacher.', alert_password: '' });
        }
        else if (results[0].userPassCode !== passCode) {
            res.render('student_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: '', alert_password: 'Password does not match login, see teacher.' });            
        }
        else if (results[0].userPassCode == passCode) {
            thisUser = results[0];
            pool_users_db.query("UPDATE userID_"+thisUser.idKey+"_activities SET timeStamp="+Date.now().toString()+" WHERE activity='history'", thisUser, (err, results, fields)=>{
                if (err) { res.render('student_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Looks like there is a problem.', alert_password: 'Please reload page.' }); }
                else {
                    res.render('main_menu', { ref: thisUser.idKey, user: thisUser.studentFirstName, userName: thisUser.userName, });
                }
            });
        }
        else { res.render('student_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Looks like there is a problem.', alert_password: 'Please reload page.' }); }
    });
});
////////////////////////////////////////////////////////////////////////////////
app.post('/register_and_welcome', (req, res) => { // the POST request body is the following:
    let studentName = req.body.studentName;
    let passWord    = req.body.passWord_1;          let passWord_2  = req.body.passWord_2;
    let equationAns = req.body.equationAns;         let imHuman     = req.body.imHuman;
    let num1        = req.body.num1;                let num2        = req.body.num2;
    
    let userName;   let idKey;  let thisUser;   let firstName;      let lastName = "lastName";

    if (studentName.split(" ").length == 1) { firstName = studentName; }
    else { firstName = studentName.split(" ")[0]; lastName = studentName.split(" ")[1]; }

    if ((passWord==passWord_2)&&(parseInt(equationAns)==(parseInt(num1)+parseInt(num2)))&&(imHuman)) {

        userName = studentName.toLowerCase().split(' ').join('');

        // thisUser = [userName, firstName, lastName, passWord];
        thisUser = [userName, firstName, studentName, passWord];

        let getUniqueUserName = function(thisUser) {
            pool_users_db.query("SELECT * FROM aaaa_Data_Table_of_Users WHERE userName='"+thisUser[0]+"'", thisUser, (error, results, fields)=>{

                let pass_1 = thisUser;

                if ( results.length === 0 ) {
                    
                    let getIdKey = function(pass_1) {

                        let random_number = Math.floor(Math.random() * (110000000000 - 7000000000)) + 7000000000;  // 103 billion possibilities

                		wn1 = parseInt(random_number / 17); dig1 = random_number % 17;  wn2 = parseInt(wn1 / 17);   dig2 = wn1 % 17;
                		wn3 = parseInt(wn2 / 17);           dig3 = wn2 % 17;            wn4 = parseInt(wn3 / 17);   dig4 = wn3 % 17;
                		wn5 = parseInt(wn4 / 17);           dig5 = wn4 % 17;            wn6 = parseInt(wn5 / 17);   dig6 = wn5 % 17;
                		wn7 = parseInt(wn6 / 17);           dig7 = wn6 % 17;            dig8 = wn7 % 17;

                        let convert = ['2','3','4','5','6','7','8','9','q','r','s','t','v','w','x','y','z'];
                        let idKey = convert[dig1]+convert[dig2]+convert[dig3]+convert[dig4]+convert[dig5]+convert[dig6]+convert[dig7]+convert[dig8];
                        
                        // idKey = 'disney'+convert[dig7]+convert[dig8];
                        
                        let pass_2 = [pass_1[0], pass_1[1], pass_1[2], pass_1[3], idKey];
                        
                        pool_users_db.query("SELECT idKey FROM aaaa_Data_Table_of_Users WHERE idKey='"+idKey+"'", pass_2, (error, results, fields)=>{

                            let pass_3 = pass_2;
                            if ( results.length === 0 ) {
                                pool_users_db.query("INSERT INTO aaaa_Data_Table_of_Users (idKey,userName,userEmail,studentFirstName,studentFullName,parentName,teacherCodes,userPassCode,registerDate,access,gameCode,homeWork,hwHistory,aux_1,aux_2,aux_3) VALUES ('"+pass_3[4]+"','"+pass_3[0]+"','userEmail','"+pass_3[1]+"','"+pass_3[2]+"','parentName','none','"+pass_3[3]+"','"+Date.now().toString()+"','none','none','|&|','|&|','ax1','ax2','ax3')", pass_3, (error, results, fields)=>{
                                    let pass_4 = pass_3;
                                    // pool_users_db.query("CREATE TABLE userID_"+pass_4[4]+"_activities(activity varchar(200) PRIMARY KEY, score varchar(10), time varchar(10), attempts varchar(10), activityNotes text, homeWorkCnt varchar(20), timeStamp varchar(50), gameCode varchar(200), user varchar(200), studentLastName varchar(200), userName varchar(200))", pass_4, (error, results, fields)=>{
                                    pool_users_db.query("CREATE TABLE userID_"+pass_4[4]+"_activities(activity varchar(200) PRIMARY KEY, score varchar(10), time varchar(10), attempts varchar(10), activityNotes text, homeWorkCnt varchar(20), timeStamp varchar(50), gameCode varchar(200), user varchar(200), studentFullName varchar(200), userName varchar(200))", pass_4, (error, results, fields)=>{
                                        let pass_5 = pass_4;
                                        pool_users_db.query("INSERT INTO userID_"+pass_5[4]+"_activities VALUES('teacherCodes','none','none','none', 'none','none','none','none','aux_1','aux_2','aux_3')", pass_5, (error, results, fields)=>{
                                            let pass_6 = pass_5;
                                            pool_users_db.query("INSERT INTO userID_"+pass_6[4]+"_activities VALUES('history','0','none','0', 'history,none','none','"+Date.now().toString()+"','none','"+pass_6[1]+"','"+pass_6[2]+"','"+pass_6[0]+"')", pass_6, (error, results, fields)=>{ 
                                                let pass_7 = pass_6;
                                                pool_myplace_db.query("CREATE TABLE userID_"+pass_7[4]+"_awards_display(sceneImageID varchar(200) PRIMARY KEY, scene varchar(200), imageID varchar(200), x_pos int, y_pos int, height int, z_Index int, invertX varchar(200), user varchar(200), credit int, aux_1 varchar(200), aux_2 varchar(200), aux_3 varchar(200))", pass_7, (error, results, fields)=>{
                                                    let pass_8 = pass_7;
                                                    pool_myplace_db.query("INSERT INTO userID_"+pass_8[4]+"_awards_display VALUES('User_Details','none','none',0,0,0,0,'none','"+pass_8[1]+"',0,'aux_1','aux_2','aux_3')", pass_8, (error, results, fields)=>{
                                                        res.render('welcome_new_member', { 
                                                            userName: pass_8[0], firstName: pass_8[1], lastName: pass_8[2], passCode: pass_8[3], ref: pass_8[4] 
                                                        });
                                                    });        
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            else { 
                                pass_1 = pass_2.pop() // .pop() off the last value in the array
                                getIdKey(pass_1);  // this idKey exists so try again
                            }
                        });
                    };
                    getIdKey(pass_1);
                }
                else { // this adds a random 2-digit number to end and tries again.
                    userName = pass_1[0] + Math.floor(Math.random() * 999).toString();
                    pass_1 = [userName, pass_1[1], pass_1[2], pass_1[3]];
                    return getUniqueUserName(pass_1);
                }
            });
        };
        getUniqueUserName(thisUser);
    }
    else { res.send('bad data sent thru') }
});
/////////////////////////////////////////////////////////////////////////////////////////////
//////////  TEACHER Log-in & Registration Routes ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
app.post('/teacher/teacher_log_in/:acctType', (req, res) => { 
    let userName = req.body.userName.toLowerCase().split(' ').join('');
    let passCode = req.body.passWord.split(' ').join('');

    pool_teachers_db.query("SELECT idKey, userPassCode, access FROM aaaa_Data_Table_of_Teachers WHERE userName='"+userName+"'", passCode, (err, results, fields)=>{ // res.send(results[0]);
        if (err || results[0] == null) { 
            if (req.params.acctType == 'schoolTeacher') {res.render('teacher/teacher_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Not a valid username', alert_password: '' }); }
            else if (req.params.acctType == 'homeTutor') {res.render('parent/parent_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Not a valid username', alert_password: '' }); }
            else {  }
        }
        else if (results[0].userPassCode !== passCode) {
            if (results[0].access == 'schoolTeacher') { res.render('teacher/teacher_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: '', alert_password: 'Password does not match login' }); }
            else if (results[0].access == 'homeTutor') { res.render('parent/parent_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: '', alert_password: 'Password does not match login' }); }
            else {  }
        }
        else if (results[0].userPassCode == passCode) {
            pool_teachers_db.query("SELECT * FROM teacherID_"+results[0].idKey+" WHERE ref='"+results[0].idKey+"'", (err, thisTeach, fields)=>{
                if (err) { res.render('teacher/teacher_log_in', { ref: 'nonMember', user: 'guest', game: 'none', alert_username: 'Not a valid username', alert_password: '' }); }
                else {
                    if (results[0].access == 'schoolTeacher') { 
                        res.render('teacher/teacher_menu_230503', { ref:thisTeach[0].ref, user:thisTeach[0].firstName, game:thisTeach[0].gameCode, teacherName:thisTeach[0].teacherName, maxStudentGroup:thisTeach[0].maxStudentGroup });
                    }
                    else if (results[0].access == 'homeTutor') { 
                        res.render('parent/parent_menu', { ref:thisTeach[0].ref, user:thisTeach[0].firstName, teacherName:thisTeach[0].teacherName });
                    }
                }
            });
        }
        else {  }
    });
});

// /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/my_place', (req, res) => { res.render('my_place/select_poster', { ref: 'nonMember', user: 'guest', credit: '0' }); });

app.get('/my_place/:ref/:user', (req,res) => { //let params = req.params.getUrlStr.split('&');  // ref=nonMember,user=guest

    let params = req.params;

    if (params.ref == 'nonMember') { res.render('my_place/select_poster', { ref: 'nonMember', user: 'guest', credit: '0' }); }
    else {
        pool_myplace_db.query("SELECT scene, user, credit FROM userID_"+params.ref+"_awards_display WHERE sceneImageID='User_Details'", params, (error, results, fields)=>{ // res.send(results);
        
            if (error) { res.redirect('/'); }  // if can not find idKey then send back to main tt menu
            
            if (results[0].scene == 'none') { res.render('my_place/select_poster', { ref:params.ref, user:results[0].user, credit:results[0].credit }); }
            
            else { res.render('my_place/display_poster', { ref:params.ref, scene:results[0].scene }); }
        });
    }
});

////////////////////////////////////////////////////////////////////////////////
app.get('/my_place/selected_scene/:ref/:scene', (req, res) => { // let params = req.params.getUrlStr.split('&');  // ref=nonMember&scene=scene
    let ref = req.params.ref;
    let scene = req.params.scene;
    
    pool_myplace_db.query("UPDATE userID_"+ref+"_awards_display SET scene='"+scene+"' WHERE sceneImageID='User_Details'");

    if (ref == 'nonMember') { res.render('my_place/display_poster', { ref: 'nonMember', scene: scene }); }
    else { res.render('my_place/display_poster', { ref:ref, scene:scene }); }  
});

////////////////////////////////////////////////////////////////////////////////
app.get('/my_place_fetch/retrieve_scene_data/:scene', (req, res) => { // let params = req.params.getUrlStr.split('&');  // ref=member
    let scene = req.params.scene;       
    
    // res.send('scene');
    
    pool_myplace_db.query("SELECT * FROM AWARDS_"+scene, (error, results, fields)=>{ res.json(results); });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/my_place_fetch/retrieve_user_details_and_imageIDs/:ref/:scene', (req, res) => { // let params = req.params.getUrlStr.split('&');  // ref=member&scene=scene
    let ref = req.params.ref;
    let scene = req.params.scene;
    
    pool_myplace_db.query("SELECT * FROM userID_"+ref+"_awards_display WHERE scene='"+scene+"' OR sceneImageID='User_Details'", (error, results, fields) => { res.json(results); });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/my_place_fetch/record_purchased_imageID/:getUrlStr', (req, res) => { let params = req.params.getUrlStr.split('&');  //ref,scene,imageID,x_location,y_location,imageHeight,zIndexNext,invertX,newCredit

    let idKey = params[0];      let scene = params[1];      let imageID =params[2];     let x_pos = params[3];      let y_pos = params[4];
    let height =params[5];      let z_Index = params[6];    let invertX = params[7];    let credit =params[8];   

    let sceneImageID = scene+"&"+imageID;

    pool_myplace_db.query("SELECT sceneImageID FROM userID_"+idKey+"_awards_display WHERE sceneImageID='"+sceneImageID+"' ", (error, results, fields) => { 

        if ( results.length === 0 ) { 
            pool_myplace_db.query("INSERT INTO userID_"+idKey+"_awards_display VALUES('"+sceneImageID+"','"+scene+"','"+imageID+"',"+x_pos+","+y_pos+","+height+","+z_Index+",'"+invertX+"','na',0,'aux_1','aux_2','aux_3')", (error, results, fields)=>{
                pool_myplace_db.query("UPDATE userID_"+idKey+"_awards_display SET credit="+credit+" WHERE sceneImageID='User_Details'", (error, results, fields) => {
                    res.send('scene data was INSERTed and credit changed');
                });
            });
        }
        else { 
            pool_myplace_db.query("UPDATE userID_"+idKey+"_awards_display SET x_pos="+x_pos+", y_pos="+y_pos+", height='"+height+"', z_Index='"+z_Index+"', invertX='"+invertX+"' WHERE sceneImageID='"+sceneImageID+"'", (error, results, fields) => {
                res.send('scene data UPDATED, yippy!');
            });
        }
    });
});
////////////////////////////////////////////////////////////////////////////////
app.get('/my_place/change_scene/:ref/:user/:credit', (req, res) => { // let params = req.params.getUrlStr.split('&');  // ref=nonMember&user=user&credit=credit
    res.render('my_place/select_poster', { ref: req.params.ref, user: req.params.user, credit: req.params.credit });
});

////////////////////////////////////////////////////////////////////////////////
////////////// REDIS ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/node_redisONtt/set/:key/:value', (req,res) => {
    redis.SETEX(req.params.key, 600, req.params.value).then( () => {
        res.send('key='+req.params.key+' was SET for 600sec to '+req.params.value);
    });
});

app.get('/node_redisONtt/get/:key', (req,res) => {
    redis.GET(req.params.key).then( (value) => {
        res.send(req.params.key+' : '+value);
    });
});

app.get('/node_redisONtt/mget/:key1/:key2/:key3', (req,res) => {
    
    let key1 = req.params.key1;
    let key2 = req.params.key2;
    let key3 = req.params.key3;

    redis.MGET([key1, key2, key3]).then( (value) => {
        res.send(value);
    });
});

app.get('/node_redisONtt/append/:key/:value', (req,res) => {
    redis.APPEND(req.params.key, req.params.value).then( (value) => {
        res.send(req.params.key+' : '+req.params.value);
    });
});
