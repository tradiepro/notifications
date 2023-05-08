<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0">
    <title>Teacher Tables</title>
    <link rel="shortcut icon" type="image/png" href="/images/favicon.png">
    
    <style>
    
        /* ### ADD js such that if page width is greater than 1020 then add "overflow-x:hidden" to the body.  otherwise let it show as default ## */
        html, body { margin:0; padding:0; box-sizing: border-box; background:transparent; font-family:arial; overflow-x: hidden; -webkit-user-select: none; /*Safari*/-ms-user-select: none; /*IE 10 & 11*/user-select: none; /*Standard syntax*/ }
    
        .search_bar { width:140px; height:34px; border:solid 1px #ccc; border-radius: 17px; font-size:16px; text-align: center;}  .search_bar:hover { background-color: #e1fae9; }
        input { text-a: center; }
        ::-webkit-input-placeholder { text-align: center; }
        
        .hover_btn { width:100%; text-decoration:none; padding-top:10px; color:#555152; font-size:19px; font-weight:bold; text-align: center; }
        .hover_btn:hover { width:100%; background-color: #e1fae9; border-radius: 20px; font-size: 20px; color:black;}
 
        .hover_small_btn { width:100%; text-decoration:none; justify-self:center; padding-top:3px; font-size:15px; color:black; font-weight:bold; text-align: center; }
        .hover_small_btn:hover { background-color: #e1fae9; border-radius: 20px; font-size:17px; }
    
        .yes_no_btn { color: #555152; font-weight: bold; font-size:19px; }  .yes_no_btn:hover { color: black; background-color: #e1fae9; border-radius: 8px; }
        
        ::-webkit-scrollbar { width: 15px; }                                                /* width */
        ::-webkit-scrollbar-track { box-shadow: inset 0 0 5px grey; border-radius: 6px; }  /* Track */
        ::-webkit-scrollbar-thumb { background: #308910; opacity:80%; border-radius: 6px; }                 /* Handle */
        ::-webkit-scrollbar-thumb:hover { background: #b30000; }                            /* Handle on hover */
    </style>
</head>
<body >

<div style="display:block; " id="teacher_main_menu">
                                               <!--10px 110px 40px 280px 25px 155px 30px 210px 14px 140px 10px = 1024  -->
<div style="display:grid;   grid-template-columns: 10px 110px 40px 280px 25px 210px 30px 155px 14px 140px 10px;
                            grid-template-rows: 10px 40px 10px; justify-content:center; ">

    <div style="grid-column: 2/3; grid-row:1/3; justify-self:left; padding-top:8px;"><img style="height: 48px;" src="/images/teacher_tables.svg"></div>
    
    <div style="grid-column: 4/5; grid-row:2/4; color:#308910; opacity:80%; font-size:40px;">Teacher Zone</div>

    <% if ((ref == 'nonMember')&&(ref.length != 8)) { %>
        <!--<a href="/" style="grid-column: 6/7; grid-row:2/3;" class="hover_btn">I am a student</a>-->
        <a href="/parent/nonMember" style="grid-column: 6/7; grid-row:2/3;" class="hover_btn">I am a parent / tutor</a>
        <a href="/" style="grid-column: 8/9; grid-row:2/3;" class="hover_btn">I am a student</a>
    <% } %>

    <div id="logInOut" style="grid-column: 10/12; grid-row:1/4;">
        <div style="display:grid; grid-template-columns: 110px 40px; grid-template-rows: 6px 25px 25px 4px; justify-content:center;">
            <a href="/teacher_log_in" style="grid-column: 1/2; grid-row:2/3;" class="hover_small_btn">Log in</a>
            <a href="/teacher_registration" style="grid-column: 1/2; grid-row:3/4;" class="hover_small_btn">Sign up</a>
        </div>
    </div>    
</div>

<div style="display:grid; grid-template-columns: 100vw; grid-template-rows:30px; justify-content:center; ">
    <div style="grid-column: 1/2; grid-row:1/2; background-image: linear-gradient(#4EA62F, #28730E); width:100%; text-align:right; padding-top:6px; ">
    </div>    
</div>                  <!--  ############ END OF HEADER SECTION - green border and above #########  -->

<style>
    .menu2_cell { background-color:#e5e4e2; width:100%; border-radius:20px; color:#555152; font-size:19px; text-decoration:none; }
    .menu2_cell:hover { background-color:#c1f4d1; color:black; font-size:20px; }
    .menu2_grid { display:grid; grid-template-columns: 150px; grid-template-rows: 90px 30px 30px; }

    .menu_text { color:#555152; font-size:20px; text-decoration:none; font-weight:bold; border-radius:15px; width:98%; height:80%;
                 box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
                 display:flex; justify-content:center; align-items:center; }
    .menu_text:hover { color:black; }

    .menu_text_L2 { color:#555152; font-size:16px; text-decoration:none; font-weight:bold; }  .menu_text_L2:hover { color:black; } 

    .font_black { color:black; }    

    .code_display { background-color:white; width:280px; border-radius:50px; font-size:80px; color:black; padding:1px 10px 5px 10px; border:solid 2px grey; letter-spacing:10px; display:flex; justify-content:center; align-items:center;}
    #delete_game { text-decoration:none; background-color: white; border-radius: 8px; font-size:22px; color:orange; padding:2px 5px 2px 5px; border:solid 1px grey; cursor: pointer; }
    #delete_game:hover { color:red; }
    .menu2_target { background-color:#cbdef5; width:100%; border-radius:20px; color:black; font-size:20px; text-decoration:none; }

    #central_get_gameCode_bttn { text-decoration:none; border:7px outset; background-color:#64d63c; color:white; border-radius:25px; height:110px; width:110px; }
    
    @keyframes glowing_green {
      0% { background-color: #64d63c; box-shadow: 0 0 #B20000; }
      50% { background-color: #359812; box-shadow: 0 0 13px #FF0000; }
      100% { background-color: #64d63c; box-shadow: 0 0 #B20000; }
    }

    @keyframes glowing_red {
      0% { background-color: rgba(178, 0,0,0.85); box-shadow: 0 0 #B20000; }
      50% { background-color: red; box-shadow: 0 0 13px #FF0000; }
      100% { background-color: rgba(178, 0,0,0.85); box-shadow: 0 0 #B20000; }
    }

    .go_bttn_grid { grid-column: 1/2; grid-row:1/2; }

</style>

    <div style="display:grid; grid-template-columns: 100vw; grid-template-rows:50px; justify-content:center;">
        <div style="grid-column: 1/2; grid-row:1/2; background-color:white; width:100%; text-align:center; 
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;">
 
            <div style="display:grid; grid-template-columns: 10px 180px 190px 130px 200px 200px 110px ; grid-template-rows:50px; justify-content:center; place-items:center;">
                <div style="grid-column:2/3; grid-row:1/2; background-color:#95e778;" class="menu_text font_black">Game console</div>
                <a href="/teacher/my_students/<%=ref%>/teacher" style="grid-column:3/4; grid-row:1/2;" class="menu_text">Manage students</a>

                <% if (ref != 'nonMember' && game != 'none') { %>
                    <div style="grid-column:5/7; grid-row:1/2;" class="menu_text_L2" onclick="display_usernames_passwords()">
                        <img style="height:20px; padding-top:0px; padding-right:8px;" src="/images/my_tasks.svg">Show student usernames & passwords
                    </div>
                <% } %>
            </div>
        </div>
    </div>

    <style>
        #getgCode_bttn { color:black; font-size:32px; height:60px; border-radius:8px; width:390px; display:flex; justify-content:center; align-items:center; background-color:#FFD646;
                        cursor: pointer; animation: pulsing 2s infinite ease-in-out;
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
        }
        #getgCode_bttn:hover { border:1px outset grey; }    

        /*@keyframes pulsing { 0% { font-size:28px; } 50% { font-size:28.1px; } 100% { font-size:28px; } }*/
        @keyframes pulsing { 
            0% { box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
            50% { box-shadow: rgba(50, 50, 93, 0) 0px 50px 100px -20px, rgba(0, 0, 0, 0) 0px 30px 60px -30px, rgba(10, 37, 64, 0) 0px -2px 6px 0px inset; }
            100% { box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
        }
        
        #play_bttn { color:black; font-size:32px; height:60px; border-radius:8px; width:390px; display:none; justify-content:center; align-items:center; background-color:#FFD646;
                        cursor: pointer; animation: glowing_red 2s infinite ease-in-out;
        }
    
        #play_bttn:hover { animation: fast_glowing 1s infinite ease-in-out; } 
        
            @keyframes fast_glowing {
              0% { background-color: #64d63c; box-shadow: 0 0 #B20000; }
              50% { background-color: #359812; box-shadow: 0 0 13px #FF0000; }
              100% { background-color: #64d63c; box-shadow: 0 0 #B20000; }
            }

        .video_box { display:flex; justify-content:left; align-items:center; padding-left:3px; font-size:19px; background-color:#dadbda; width:100%; height:90%; border-radius:15px; cursor:pointer;}
        .video_box:hover { font-size:20px; }

        .pricing_freeTrial { color:black; font-size:25px; height:35px; border-radius:8px; width:180px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; text-decoration:none; } 
        .pricing_freeTrial:hover { font-size:26px; color:black; border:1px outset black; background-color:#FFD646; }        
        
        .preset_game { color:black; font-size:19px; height:30px; border-radius:8px; width:90px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; } 
        .preset_game:hover { font-size:19px; color:black; border:1px outset black; background-color:#FFD646; }

        .custom_game { color:black; font-size:17px; height:25px; border-radius:14px; width:295px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; } 
        .custom_game:hover { border:1px outset black; background-color:#FFD646; transform:translate(0px,-1px); } /*  */

        .add_game { color:black; font-size:18px; height:30px; border-radius:8px; width:110px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; } 
        .add_game:hover { color:black; border:1px outset black; background-color:#FFD646; }

        .menu2_game_code_cell { color:black; font-size:19px; text-decoration:none; }
    
        .studentZone_display { display:none; justify-content:center; align-items:center;  }
    
        .studentZone_countDown { height:160px; width:170px; border-radius:50%; font-size:120px; display:flex; justify-content:center; align-items:center; color:white; font-weight:bold; transform:translate(0px,15px); }
        .green_backing { background-color:#79D70F; } .red_backing { background-color:#D32626; } .orange_backing { background-color:#F5A31A; } /* ["#79D70F", "#F5A31A", "#D32626"] */
    
        #savedTeacherGames { width:390px; height:140px; overflow:scroll; overflow-x:hidden; }
        
        #game_status_message_above { color:purple; }
        
        .youTubeBttn { border-radius:20px; cursor:pointer; height:110px; width:190px;}
        .youTubeBttn:hover { border:1px outset grey; }
        
        .footer_bttn { font-size:16px; font-weight:bold; color:#555152; }
        .footer_bttn:hover { color:black; }
        
        .paper { stroke:#fffbec; stroke-width:2; fill:none; }  /* #fcf3d0 */
        
        .game_type_title { color:grey; font-size:16px; font-weight:bold; width:90%; height:60%; border-radius:10px; display:flex; justify-content:center; align-items:center; text-decoration:none;}
        .game_type_title:hover { color:black; }
        
        .singleGameMessage { grid-column: 1/6; grid-row:9/12; width:100%; background-color:orange; border-radius:20px; display:flex; justify-content:center; align-items:center; animation: singleGameMessage 5s; opacity:0%;}
        @keyframes singleGameMessage {
            0% { opacity:100%; }
            70% { opacity:100%; }
            100% { opacity:0%; }
        }
        
    </style>

    <!--<div style="position:absolute; top:140px; left:0px; height:655px; width:100%; z-index:-99; background-color:#E3EDE1;" id="background_id">-->
    <!--    <svg height="100%" width="100%" id="svg_background"></svg>    -->
    <!--</div>-->

    <div style="width:100%; height:100%; background-color:#E3EDE1; opacity:100%; z-index: 2;" > <!-- class="paper_back_ground" background-color:#E3EDE1;-->
        
        <div style="width:1024px; justify-self:center; margin:0 auto; font-size:22px; ">

            <div style="display: grid; grid-template-columns: 10px 190px 10px 190px 10px 10px 100px 100px 10px 390px 10px; grid-template-rows: 20px 35px 35px 35px 35px 5px repeat(14, 35px); justify-items:center;" >

                <div style="grid-column:2/3; grid-row:2/4; font-size:35px; display:flex; justify-self:left; align-items:center;"><b>Hello,</b></div>
                <div style="grid-column:2/5; grid-row:4/5; font-size:35px; display:flex; justify-self:left; align-items:center;">
                    <b>
                        <% if (ref != 'nonMember') { %> 
                            <%= teacherName.split('|>|')[0] %> 
                        <% } else { %>
                            Guest Teacher
                        <% } %>
                    </b>
                </div>

                <% if (game == 'none') { %>
                    <div style="grid-column:2/3; grid-row:7/8; background-color:white; color:black;" class="game_type_title">Whole class game</div>
                    <a href="/teacher_group_games/<%=ref%>" style="grid-column:4/5; grid-row:7/8;" class="game_type_title">Multi-groups game</a>
                <% } %>

                <% if (ref.length != 6) { %>
                    <a href="/teacher_registration" style="grid-column:2/3; grid-row:10/11; align-self:center;" class="pricing_freeTrial">Pricing</a>
                    <a href="/teacher_registration" style="grid-column:4/5; grid-row:10/11; align-self:center;" class="pricing_freeTrial">FREE trial</a>
                <% } %>

                <% if (game == 'none') { %>    <!-- There is NOT have a gameCode -->

                    <div style="grid-column:2/5; grid-row:11/19;">
                        <div style="display:grid; grid-template-columns: 190px 10px 190px; grid-template-rows: repeat(10, 29px); justify-items:center;" id="video_block">

                            <div style="grid-column:1/4; grid-row:1/1;"><b><u>How to videos:</u></b></div>
                            
                            <div style="grid-column:1/4; grid-row:2/3;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(4:50) play a guest game
                            </div>
            
                            <div style="grid-column:1/4; grid-row:3/4;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) sign up to get FREE account
                            </div>
                            
                             <div style="grid-column:1/4; grid-row:4/5;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) create a custom game
                            </div>                   
                            
                             <div style="grid-column:1/4; grid-row:5/6;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) play a member game
                            </div>                     
        
                             <div style="grid-column:1/4; grid-row:6/7;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) manage student groups
                            </div>   

                             <div style="grid-column:1/4; grid-row:7/8;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) allocate student tasks
                            </div>

                             <div style="grid-column:1/4; grid-row:8/9;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) set and play a multi-group game
                            </div>   
                            
                             <div style="grid-column:1/4; grid-row:9/10;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) manage student profiles
                            </div>  
                            
                             <div style="grid-column:1/4; grid-row:10/11;" class="video_box" onclick="play_video('play_game');">
                                <img style="height:22px;" src="/images/video_play.svg">&nbsp;(1:20) manage student profiles
                            </div>                              
                            
                        </div>
                    </div>                    
                <% } %>

                <div style="grid-column:2/5; grid-row:5/6; display:flex; justify-self:center; align-items:flex-end;" id="game_status_message_above"></div>
                <!--<div style="grid-column:2/5; grid-row:9/10; display:flex; justify-self:center; align-items:flex-end;" id="game_status_message_below"></div>-->

                <% if ((ref.length == 6)&&(game == 'none')) { %>    <!-- Teacher IS Logged In, but does NOT have a gameCode -->
                    <div style="grid-column: 2/5; grid-row:8/10; display:flex; justify-self:left; align-items:center;" onclick="get_game_code()" id="getgCode_bttn">Click here to START game</div>
                <% } %>

                <% if ((ref.length == 6)&&(game != 'none')) { %>    <!-- Teacher IS Logged In, and DOES have a gameCode -->
                    <div style="grid-column:2/5; grid-row:7/9; display:none; justify-self:left; align-items:center;" onclick="start_game_sequence()" id="play_bttn"></div>

                    <div style="grid-column: 2/5; grid-row:14/19; display:flex; justify-content:center; align-items:center;" class="menu2_game_code_cell" >
                        <div style="display:grid; grid-template-columns: 320px; grid-template-rows: 20px 100px 40px; place-items:center;">
                            <!--<div style="grid-column: 1/2; grid-row:1/2; display:flex; justify-self:center; align-items:center;"><b>Game Code</b></div>-->
                            <div style="grid-column: 1/2; grid-row:2/3;" class="code_display" id="codeID"><%=game%></div>
                            <div style="grid-column: 1/2; grid-row:3/4;">
                                <span id="delete_bttn"><a href="/teacher/delete_game_via_click/<%=ref%>/<%=game%>" id="delete_game"><b>End game</b></a></span>
                                Rnd: <span id="round_number"></span>
                            </div>
                        </div>
                    </div>

                    <div class="singleGameMessage">You have started a single group game</div>
                <% } %> 

                <% if ((ref.length != 6)&&(game == 'none')) { %>    <!-- Teacher is NOT Logged In / GUEST Game Code Message -->
                    <div style="grid-column:2/5; grid-row:8/10; display:flex; justify-self:left; align-items:center;" onclick="display_guest_message()" id="getgCode_bttn">Click here to START game</div>

                    <div style="grid-column:2/5; grid-row:7/9; display:none; justify-self:left; align-items:center;" onclick="start_game_sequence()" id="play_bttn"></div>

                    <div style="grid-column: 2/5; grid-row:14/19; display:none; justify-content:center; align-items:center;" class="menu2_game_code_cell" id="display_guest_gameCode">
                        <div style="display:grid; grid-template-columns: 320px; grid-template-rows: 20px 100px 40px; place-items:center;">
                            <!--<div style="grid-column: 1/2; grid-row:1/2; display:flex; justify-self:center; align-items:center;"><b>Game Code</b></div>-->
                            <div style="grid-column:1/2; grid-row:2/3;" class="code_display" id="codeID"><span id="displayGuestGameCodeConsole"></span></div>
                            <div style="grid-column: 1/2; grid-row:3/4;">
                                <span id="delete_bttn"><a href="" id="delete_game"><b>End game</b></a></span>
                                Rnd: <span id="round_number"></span>
                            </div>
                        </div>
                    </div>
                    
                <% } %>

                <div style="grid-column: 1/6; grid-row:9/14;" class="studentZone_display" id="studentZoneID">
                    <div style="display:grid; grid-template-columns: 175px; grid-template-rows: 140px 35px; background-color:#b4cff0;
                                border-radius:25px; font-size:24px; border:3px solid grey; place-items:center; transform:translate(0px,10px);">
                        <img style="padding-top:15px;" src="/images/game_code.svg" height="160">
                        <div><b>Game Code</b></div>
                    </div>
                </div>

                <div style="grid-column: 2/11; grid-row:19/20; border-bottom:1px solid black; width:100%; transform:translate(0px,-20px);" ></div>

                <div style="grid-column:1/7; grid-row:19/21; display:flex; justify-content:center; align-items:center; font-size:16px; font-weight:bold; color:#555152;">
                    <a href="/teacher/teacher_faqs/<%=ref%>/<%=user%>" class="footer_bttn">FAQS</a>&nbsp;|&nbsp;
                    <a href="/teacher/teacher_how_to_videos/<%=ref%>/<%=user%>" class="footer_bttn">How to videos</a href="/">&nbsp;|&nbsp;
                    <a href="/teacher/teacher_contact_us/<%=ref%>/<%=user%>" class="footer_bttn">Contact Us</a>&nbsp;|&nbsp;
                    <a href="/teacher/teacher_privacy_policy/<%=ref%>/<%=user%>" class="footer_bttn">Privacy Policy</a>
                </div>
                
                <div style="grid-column:9/11; grid-row:19/21; display:flex; justify-content:center; align-items:center; font-size:14px; color:grey;">© 2023 TXS. All rights reserved.</div>

            <!-- ########################################################################################################################## -->
 
                <!--<div style="grid-column:6/12; grid-row:2/19; width:100%; height:100%; background-color:white; border-radius:15px;"></div>-->

                <div style="grid-column:6/12; grid-row:2/19; width:100%; height:100%; background-color:white; border-radius:15px;" id="background_id">  <!-- #fffbec -->
                    
                    <svg height="100%" width="100%" id="svg_background"></svg>    

                </div>


                <div style="grid-column: 7/9; grid-row:2/3; align-self:center;" ><b><u>Preset Games</u></b></div>
                <div style="grid-column: 7/8; grid-row:3/4; align-self:center;" id="year_2_game" class="preset_game" onclick="select_preset_game(id)">Year 2</div>
                <div style="grid-column: 8/9; grid-row:3/4; align-self:center;" id="year_3_game" class="preset_game" onclick="select_preset_game(id)">Year 3</div>
                <div style="grid-column: 7/8; grid-row:4/5; align-self:center;" id="year_4_game" class="preset_game" onclick="select_preset_game(id)">Year 4</div>
                <div style="grid-column: 8/9; grid-row:4/5; align-self:center;" id="year_5_game" class="preset_game" onclick="select_preset_game(id)">Year 5</div>
                <div style="grid-column: 7/8; grid-row:5/6; align-self:center;" id="year_6_game" class="preset_game" onclick="select_preset_game(id)">Year 6</div>
                <div style="grid-column: 8/9; grid-row:5/6; align-self:center;" id="year_7_game" class="preset_game" onclick="select_preset_game(id)">Year 7</div>

                <div style="grid-column: 10/11; grid-row:2/3; justify-self:left; align-self:center; transform:translate(40px,0px);" ><b><u>Custom Games</b></u></div>

                <div style="grid-column: 10/11; grid-row:2/3; justify-self:right; align-self:center; transform:translate(-30px,0px);" class="add_game" id="add_new_game_ID" onmouseup="add_a_new_game()">+ new game</div>

                <div style="grid-column: 10/11; grid-row:3/7;" id="savedTeacherGames"></div>

                <div style="grid-column:7/10; grid-row:7/8; ">
                    <div style="display:grid; grid-template-columns: 120px 18px 26px; font-size:16px; ">
                        <div style="grid-column:1/2; grid-row:1/2; display:flex; justify-content:left; align-items:center;"><b>Max game size:</b></div>
                        <div style="grid-column:2/3; grid-row:1/2; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:20px;" id="maxStudentGroupID"><b></b></div>
    
                        <div style="grid-column:3/4; grid-row:1/2; font-size:12px; display:flex; justify-content:center; align-items:center;">
                            <div style="transform:rotate(-90deg); cursor:pointer; font-size:18px;" onclick="increase_cnt()">&#10148;</div>
                            <div style="transform:rotate(90deg); cursor:pointer; font-size:18px;" onclick="decrease_cnt()">&#10148;</div>
                        </div>
                    </div>
                </div>


                <style>
                    .input_box{ font-size:22px; font-weight:bold; border:1px solid blue; border-radius: 4px; }
                    #saveAs_title { visibility:hidden; }

                    .add_round { font-size:16px; font-weight:bold; background-color:#95e778; border-radius:10px; display:flex; justify-content:center; align-items:center; height:28px; visibility:hidden; }
                    .add_round:hover { border:1px outset black; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }

                    .saveBttn { font-size:16px; font-weight:bold; background-color:orange; border-radius:10px; display:flex; justify-content:center; align-items:center; height:28px; visibility:hidden; }
                    .saveBttn:hover { border:1px outset black; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
    
                    .saveAsBttn { font-size:16px; font-weight:bold; background-color:orange; border-radius:10px; display:flex; justify-content:center; align-items:center; height:28px; visibility:hidden; }
                    .saveAsBttn:hover { border:1px outset black; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }

                    .editBttn { font-size:16px; font-weight:bold; cursor:pointer; background-color:#ECF2FB; border-radius:10px; height:28px; width:110px; display:flex; justify-content:center; align-items:center; 
                                box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
                    .editBttn:hover { border:1px outset black; background-color:#FFD646; }

                    .cancelBttn { font-size:16px; font-weight:bold; cursor:pointer; background-color:#ECF2FB; border-radius:10px; height:28px; width:110px; display:none; justify-content:center; align-items:center; 
                                box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
                    .cancelBttn:hover { border:1px outset black; background-color:#FFD646; }

                    .round_selected { color:black; font-size:18px; padding-left:10px; height:36px; border-radius:14px; font-weight:normal; display:flex; justify-content:left; align-items:center; background-color:#e1f7fe; }
                    .round_selected:hover { cursor:n-resize; }
                    .round_hover { cursor:n-resize; font-size:22px; color:black; border:1px outset black; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; transform:translate(0px,-1px);}

                    .x_rnd_remove { color:black; font-size:18px; border-radius:14px; display:flex; justify-content:center; align-items:center; visibility:hidden; }
                    .x_rnd_remove:hover { cursor:pointer; border:1px outset black; font-size:20px; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }

                    .x_game_remove { color:black; font-size:18px; border-radius:14px; display:flex; justify-content:center; align-items:center; background-color:white }
                    .x_game_remove:hover { cursor:pointer; border:1px outset black; font-size:20px; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }

                    .mouseDown_on_this_bttn { border:1px outset black; font-weight:bold; background-color: #9ce5fc; cursor:n-resize; box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
                
                    .no_high_light { -webkit-user-select: none; /* Safari */-ms-user-select: none; /* IE 10 and IE 11 */user-select: none; /* Standard syntax */  }

                    .visible_transition { animation:visibleTransition; animation-iteration-count: 1; animation-duration: 1.5s; }
                        @keyframes visibleTransition { 0% { opacity: 0; } 100% { opacity: 1; } }
                    
                    .move_to_save { animation:moveToSave; animation-iteration-count: 1; animation-duration: 1.5s; }
                        @keyframes moveToSave { 0% { opacity:1; } 100% { opacity:0.2; transform:translate(200px,-142px);} } 
                        
                    .game_title_display { display:flex; justify-content:left; align-items:flex-end; font-weight:bold; font-size:25px; }
                    
                    #gameRoundsID { width:100%; height:315px; overflow:scroll; overflow-x:hidden; }
                    
                    .currentRound { display:flex; justify-content:center; align-items:center; background-color:white; border-radius:10px; }
                    .currentRound_flashing { background-color:pink; animation: currentRound 2s infinite ease-in-out;}
                    @keyframes currentRound { 0% { background-color:#4EA62F; } 50% { background-color:#28730E; } 100% { background-color:#4EA62F; } }
    
                    #newTitleID { animation: highlight 2s infinite ease-in-out; }
                    @keyframes highlight { 0% { color:black; } 50% { color:grey; } 100% { color:black; } }
                    
                </style>

                <div style="grid-column:7/11; grid-row:7/8; transform:translate(0px, 20px);">

                    <div style="display:grid; grid-template-columns: 28px 116px 30px 10px 150px 3px 130px 3px 130px; grid-template-rows:45px 2px 28px; align-self:center;" >

                        <div style="grid-column:2/8; grid-row:1/2;" class="game_title_display" id="game_title"></div>

                        <div style="grid-column:2/8; grid-row:1/2; display:flex; justify-content:left; align-items:center; font-weight:bold;" id="saveAs_title">
                            <input style="width:400px;" class="input_box" type="text" name="newTitle" id="newTitleID" placeholder="Enter your new game name here" autocomplete="off" maxlength="31" 
                                onkeypress="return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 48 && event.charCode <= 57) || (event.charCode == 32)"
                            required>
                        </div>
                        <div style="grid-column:2/3; grid-row:3/4; align-self:center;" class="editBttn" id="editBttnID" onmouseup="edit_rnds_function()">edit game</div>
                        <div style="grid-column:3/4; grid-row:3/4; display:flex; justify-content:right; align-items:center; cursor:pointer;" onmouseup="edit_rnds_function()"><img src="/images/pencil.svg" height="30"></div>
                        <div style="grid-column:2/3; grid-row:3/4; align-self:center;" class="cancelBttn" id="cancelBttnID" onmouseup="cancel_rnds_edit()">cancel</div>
                        <div style="grid-column:5/6; grid-row:3/4;" class="add_round" id="addRoundID" onmouseup="goto_select_activities()">Add an Activity</div>
                        <div style="grid-column:7/8; grid-row:3/4;" class="saveBttn" id="saveBttnID" onmouseup="save_function()">update game</div>
                        <div style="grid-column:9/10; grid-row:3/4;" class="saveAsBttn" id="saveAsBttnID" onmouseup="saveAs_function()">save as new</div>
                    </div>
                </div>

                <div style="grid-column:7/11;grid-row:9/10; transform:translate(0px, 30px);" id="gameRoundsID"></div>
                
            <!-- ### Show student username & password ### -->    
                
                <div style="grid-column:6/12; grid-row:2/19; width:100%; height:100%; background-color:white; border-radius:15px; z-index:2; overflow:scroll; overflow-x:hidden; display:none;" id="display_usernamesPasswords">
                    
                    <div style="display:grid; grid-template-columns:20px 200px 200px 160px 20px; grid-template-rows:10px 20px 15px; ">
                        <div style="grid-column:2/3; grid-row:2/3;"><b>Name</b></div>
                        <div style="grid-column:3/4; grid-row:2/3;"><b>username</b></div>
                        <div style="grid-column:4/5; grid-row:2/3;"><b>password</b></div>
                        <div style="grid-column:5/6; grid-row:2/3;" onclick="document.getElementById('display_usernamesPasswords').style.display='none';"><b>X</b></div>
                    </div>    

                    <div style="" id="listed_students"></div>
                    
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #play_video_here {
        width:650px; height:450px; background-color:white; border-radius:20px; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:none;
    }

    #currently_editing_game_message { 
        width:750px; height:310px; background-color:white; border-radius:20px; font-size:24px; color:#555152; 
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:none; 
    }
    .editGame_OR_startGame { color:black; font-size:24px; height:35px; border-radius:8px; width:500px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; } 
    .editGame_OR_startGame:hover { font-size:25px; color:black; border:1px outset black; background-color:#FFD646; cursor:pointer; }
    
    #guest_gameCode_message { 
        width:750px; height:400px; background-color:white; border-radius:20px; font-size:24px; color:#555152; 
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:none; 
    }
    #guest_editGame_message { 
        width:750px; height:400px; background-color:white; border-radius:20px; font-size:24px; color:#555152; z-index:2;
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); display:none; 
    }    
    
    .helps_to_bullets { display:flex; justify-content:left; align-items:center }

    /*.log_in { color:#3F9121; text-decoration:none; }  .log_in:hover { font-size:25px; transform:translate(-2px,0px); }*/
    
    .log_in { display:flex; justify-content:center; align-items:center; color:white; height:50px; width:100px; border-radius:8px; background-color:#3F9121; text-decoration:none; 
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }  .log_in:hover { font-size:25px; transform:translate(-2px,0px); }
    .log_in:hover { color:black; border:1px outset grey; transform:translate(1px,0px); }

    .create_acct {display:flex; justify-content:center; align-items:center; color:white; height:50px; width:330px; border-radius:8px; background-color:#3F9121; text-decoration:none; 
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; }
    .create_acct:hover { color:black; border:1px outset grey; transform:translate(-1px,0px); }
    
    .xClose:hover { font-size:26px; font-weight:bold; cursor:pointer; } 
    
    #play_as_guest { color:black; font-size:24px; height:35px; border-radius:8px; width:300px; display:flex; justify-content:center; align-items:center; background-color:#ECF2FB; 
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset; } 
    #play_as_guest:hover { font-size:25px; color:black; border:1px outset black; background-color:#FFD646; cursor:pointer; }
    
</style>

<div style="width:100vw; height:100vh; background-color:grey; position:fixed; top:0px; left:0px; opacity:50%; display:none" id="grey_background"></div>

<div id="play_video_here">
    <div style="display:grid; grid-template-columns: 600px 50px; grid-template-rows:50px 400px; ">

        <div style="grid-column:2/3; grid-row:1/2; display:flex; justify-content:center; align-items:center;" >
            <span class="xClose"
                onclick="   document.getElementById('grey_background').style.display='none';
                            document.getElementById('play_video_here').style.display='none';
                            document.getElementById('insert_video').innerHTML = '';
                            "
            >X</span>
        </div>        
        
        <div style="grid-column:1/2; grid-row:2/3; display:flex; justify-content:center; align-items:center;" id="insert_video"></div>
    </div>
</div>

<div id="currently_editing_game_message">
    <div style="display:grid; grid-template-columns: 80px 350px 255px; grid-template-rows:repeat(7, 36px); margin:15px 30px 20px 40px; ">
        
        <div style="grid-column:1/4; grid-row:1/3; display:flex; justify-content:center; align-items:center; font-size:35px; color:#3F9121" >
            You are currently editing a game!
        </div>
        
        <div style="grid-column:1/4; grid-row:3/4; display:flex; justify-content:center; align-items:center;"><b>You will need to either:</b></div>
      
        <div style="grid-column:1/4; grid-row:5/6; display:flex; justify-content:center; align-items:center;">
            <span onclick="document.getElementById('grey_background').style.display='none'; document.getElementById('currently_editing_game_message').style.display='none';" 
                class="editGame_OR_startGame">Finish editing and save the game
            </span>
        </div>        

        <div style="grid-column:1/4; grid-row:6/7; display:flex; justify-content:center; align-items:center;"><b>OR</b></div>

        <div style="grid-column:1/4; grid-row:7/8; display:flex; justify-content:center; align-items:center;">
            <span onclick="editGameRounds=false; get_game_code();" class="editGame_OR_startGame">Cancel edit AND Start game anyway</span>
        </div> 
    </div>
</div>

<div id="guest_gameCode_message">
    <div style="display:grid; grid-template-columns: 80px 340px 200px 60px; grid-template-rows:repeat(10, 36px); margin:15px 30px 20px 40px; ">
        <div style="grid-column:1/4; grid-row:1/3; display:flex; justify-content:left; align-items:center; font-size:35px; color:#3F9121" >
            Looks like you're not logged in!
        </div>
        <div style="grid-column:4/5; grid-row:1/2; display:flex; justify-content:right; align-items:center;" >
            <span onclick="remove_guest_message()" class="xClose">X</span>
        </div>        
        <div style="grid-column:1/4; grid-row:3/4; display:flex; justify-content:left; align-items:center;">
            Your teacher account helps you to:
        </div>
        <div style="grid-column:1/4; grid-row:4/5;" class="helps_to_bullets">&#x2022; Quickly assign tasks to students</div>
        <div style="grid-column:1/4; grid-row:5/6;" class="helps_to_bullets">&#x2022; Create and save custom games</div>        
        <div style="grid-column:1/3; grid-row:6/7;" class="helps_to_bullets">&#x2022; Save student's progress</div>
        <div style="grid-column:1/3; grid-row:7/9;" class="helps_to_bullets">and more!</div>
 
        <div style="grid-column:3/5; grid-row:4/9; display:flex; justify-content:right; align-items:center; transform:translate(-30px,0px);"><img src="/images/teacher.svg" height="200"></div>
        
        <div style="grid-column:3/4; grid-row:1/3; display:flex; justify-content:right; align-items:center;">
            <a href="/teacher_log_in" class="log_in">Log in</a>
        </div>        
        <div style="grid-column:1/3; grid-row:9/11; display:flex; justify-content:left; align-items:center;">
            <a href="/teacher_registration" class="create_acct">Create a FREE trial account</a>
        </div> 
        <div style="grid-column:3/5; grid-row:9/11; display:flex; justify-content:left; align-items:center;">
            <span onclick="get_guest_gameCode()" id="play_as_guest">Play as guest teacher</span>
        </div> 
    </div>
</div>

<div id="guest_editGame_message">
    <div style="display:grid; grid-template-columns: 80px 340px 200px 60px; grid-template-rows:repeat(10, 36px); margin:15px 30px 20px 40px; ">
        <div style="grid-column:1/4; grid-row:1/3; display:flex; justify-content:left; align-items:center; font-size:35px; color:#3F9121" >
            Looks like you're not logged in!
        </div>
        <div style="grid-column:4/5; grid-row:1/2; display:flex; justify-content:right; align-items:center;" >
            <span onclick="remove_editGame_message()" class="xClose">X</span>
        </div>        
        <div style="grid-column:1/4; grid-row:3/4; display:flex; justify-content:left; align-items:center;">
            Your teacher account allows you to:
        </div>
        <div style="grid-column:1/4; grid-row:4/5;" class="helps_to_bullets">&#x2022; Access over 50 topic activities</div>
        <div style="grid-column:1/4; grid-row:5/6;" class="helps_to_bullets">&#x2022; Add unlimited rounds to a game</div>
        <div style="grid-column:1/3; grid-row:6/7;" class="helps_to_bullets">&#x2022; Create up to 10 custom games</div>
        <div style="grid-column:1/3; grid-row:7/9;" class="helps_to_bullets">and more!</div>
 
        <div style="grid-column:3/5; grid-row:4/9; display:flex; justify-content:right; align-items:center; transform:translate(-30px,0px);"><img src="/images/teacher.svg" height="200"></div>
        
        <div style="grid-column:3/4; grid-row:1/3; display:flex; justify-content:right; align-items:center;">
            <a href="/teacher_log_in" class="log_in">Log in</a>
        </div>        
        <div style="grid-column:1/3; grid-row:9/11; display:flex; justify-content:left; align-items:center;">
            <a href="/teacher_registration" class="create_acct">Create a FREE trial account</a>
        </div> 

    </div>
</div>

<!-- ################  THIS IS THE ACTIVITIES LIST FOR EDITING GAME - ROUNDS ################# -->
<style>
    .activity_selected { background-color:#64d63c; padding-left:4px; padding-right:4px; border-radius:5px;}
    #full_activity_menu { width: 1024px; /* height: 60vh; */ overflow: scroll; }
</style>

<div style="display:none" id="activity_menu_selection">
    
    <div style="display:grid; grid-template-columns: 100vw; grid-template-rows: 130px; justify-content:center; ">
        <div style="grid-column: 1/2; grid-row:1/2; background-color: #ecf2fb; width:100%; font-weight:bold; text-align: center;">
                                                         <!--10px 110px 40px 280px 25px 155px 30px 210px 14px 140px 10px = 1024  -->
                                                         <!--10px 70px 5px repeat(8, 93px 15px) 75px 0px               = 1064  -->
            <div style="display:grid; grid-template-columns: 10px 70px 5px repeat(8, 93px 15px) 75px 0px; grid-template-rows: 10px 70px 30px 15px; justify-content:center;" id="display_main_menu">

                <div style="grid-column: 2/4; grid-row:1/3;">
                    <img style="height:48px; justify-self:left; padding-top:8px;" src="/images/teacher_tables.svg">
                </div>
                
                <div style="grid-column: 4/11; grid-row:2/3; display:flex; justify-content:center; align-items:center; font-size:24px;"><u>Add Activities to:</u></div>
                <div style="grid-column: 4/11; grid-row:3/4; display:flex; justify-content:center; align-items:center; font-size:22px;" id="game_title_on_menu"></div>

                <div style="grid-column: 12/15; grid-row:2/4; display:flex; justify-content:left; align-items:center;">Total activities for<br>this game will be:</div>
                <div style="grid-column: 14/15; grid-row:2/4; display:flex; justify-content:center; align-items:center; font-size:40px;" id="menu_task_cnt">7</div>

                <div style="grid-column: 16/19; grid-row:2/4; opacity:30%;" class="menu2_cell" onclick="add_activities()" id="addActivitiesBttn">
                    <div style="display:grid; grid-template-columns: 201px; grid-template-rows: 50px 20px 20px;">
                        <div style="grid-column: 1/2; grid-row:1/3;"><img style="height:50px; padding-top:12px; padding-left:7px;" src="/images/edit.svg"></div>
                        <div style="grid-column: 1/2; grid-row:3/4; font-size:20px;">Add these activities</div>
                    </div>   
                </div>

                <div style="grid-column: 20/21; grid-row:2/4; " class="menu2_cell" onclick="cancel_menu()">
                    <div style="display:grid; grid-template-columns: 75px; grid-template-rows: 50px 20px 20px;">
                        <div style="grid-column: 1/2; grid-row:1/2;"><img style="height:40px; padding-top:18px; padding-left:0px;" src="/images/refresh.svg"></div>
                        <div style="grid-column: 1/2; grid-row:3/4;">Cancel</div>
                    </div>   
                </div>
            </div>
        </div>
    </div>

    <div style="display:flex; justify-content:center; font-size:16px;">
        <div id="full_activity_menu">  <!-- via JS full_activity_menu.js -->  </div>
    </div>
</div>

<script src="https://cdn.socket.io/socket.io-3.0.1.min.js"></script>

<script type="text/javascript" src="/scripts/teacher/yearActivity_and_activityName_objects.js?v=230503"></script>
<script type="text/javascript" src="/scripts/full_activity_menu.js?v=230503"></script>

<script>

let height = (document.documentElement.clientHeight - (130+30)).toString();
document.getElementById('full_activity_menu').style.height = height+'px';

let idKey = "<%=ref%>";
let user = "<%=user%>";
let gameCode = "<%=game%>";                         if (gameCode != 'none') { document.getElementById('studentZoneID').style.display='flex'; }
let maxStudentGroup = "<%=maxStudentGroup%>";       document.getElementById('maxStudentGroupID').textContent = maxStudentGroup;

let gameStatus;             let numOfUser;              let activity;
let gameRounds = [];        let teacher_games = [];     let numOfStudentsInClass = 0;
let gameTitle;              let original_game_rounds;
let preset_game = true;     let editGameRounds = false;

let game_reBooted_at_63sec = false;     let game_reBooted_at_Rnd_end = false;   let game_reBooted_at_start_after_load = false;

let student_NOT_fetched_yet = true;         let temp_students = {};             let array_ref_name = [];

if (idKey != 'nonMember') { user_logged_in(); }

function user_logged_in() {
    let logged_in_text = '<div style="display:grid; grid-template-columns: 110px 40px; grid-template-rows: 18px 25px 17px;">' +
                            '<div style="grid-column: 1/3; grid-row:2/3;" class="hover_small_btn" onclick="profile_log_out_menu()">Hi <%= user %>' +
                            '</div></div>';
    document.getElementById('logInOut').innerHTML = logged_in_text;
}

function profile_log_out_menu() {
    let logInOut = "<div style='display:grid; grid-template-columns: 110px 40px; grid-template-rows: 6px 25px 25px 4px;'>" +
    
                        // "<a href='/teacher/teacher_profile/< %=ref%>/< %=user%>' style='grid-column: 1/3; grid-row:2/3;' class='hover_small_btn'>< %=user%>'s Profile</span></a>" +
                        "<a href='/teacher/teacher_profile/<%=ref%>/<%=user%>' style='grid-column: 1/3; grid-row:2/3;' class='hover_small_btn'>Edit Profile</span></a>" +

                        "<div style='grid-column: 1/3; grid-row:3/4; padding-top:3px; text-align: right;'>" +
                                "Log out: "+
                                "<a href='/teacher/nonMember' style='text-decoration:none;' class='yes_no_btn'>&nbsp;Yes&nbsp;</a>" +
                                "<span class='yes_no_btn' onclick='user_logged_in()'>&nbsp;No&nbsp;</span>" +
                        "</div></div>";
    document.getElementById('logInOut').innerHTML = logInOut;
}
////////////////////////////////////////////////////////////////////////////////


// declare global functions used in socket connections
let update_teacher_games_in_db;     let set_as_current_game_in_db;      let update_maxStudentGroup;     let check_num_users_linked_to_game_and_status;
let get_guest_gameCode;             let start_game_sequence;            let game_has_started;           let getStudentDetails;

let gameState_running_or_paused = 'not_started_yet';

sessionStorage.setItem("NOTrunningAt", 3000000000000); // almost 100 years
sessionStorage.setItem("LASTrunningAt", 3000000000000);
sessionStorage.setItem("LASTtimeBeforeStart", 3000000000000);

const socket = io("https://teachertables.com");
socket.on('connect', () => { console.log(socket.id); console.log(socket); 
    
    if (idKey == 'nonMember') { //  id = year_4_game;
        gameRounds = gameRounds_object['year_4_game'].split(',');
        gameTitle = gameRounds.shift();
        list_game_rounds();

        for (let n=1; n<11; n++) {
            document.getElementById('savedTeacherGames').innerHTML +=  '<div style="display:grid; grid-template-columns: 20px 300px 16px; grid-template-rows:28px; align-self:center;" >' +
                '<div style="display:flex; justify-content:center; align-items:center; font-size:16px;">'+n+'.</div>' +
                '<div style="display:flex; justify-content:center; align-items:center; ">------------------------------------</div>' +
                '<div></div>' +
                '</div>' ;          
        }
    }
    else { list_teacher_games(); }
    
    function list_teacher_games() {
        
        socket.emit('fetch_current_teacher_games', idKey, (results) => {  resp = results[0];    // console.log('resp');    console.log(resp);
            
            numOfStudentsInClass = resp.arrayOfStudents.split('|>|').length - 1;            // console.log('numOfStudentsInClass '+numOfStudentsInClass);
            
            let currentGame = resp.currentGame.split('|&|')[0];
            
            if (currentGame == 'Year 2') { gameRounds = gameRounds_object['year_2_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
            if (currentGame == 'Year 3') { gameRounds = gameRounds_object['year_3_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
            if (currentGame == 'Year 4') { gameRounds = gameRounds_object['year_4_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
            if (currentGame == 'Year 5') { gameRounds = gameRounds_object['year_5_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
            if (currentGame == 'Year 6') { gameRounds = gameRounds_object['year_6_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
            if (currentGame == 'Year 7') { gameRounds = gameRounds_object['year_7_game'].split(','); gameTitle = gameRounds.shift(); list_game_rounds(); }
    
            teacher_games = [ resp.game_1, resp.game_2, resp.game_3, resp.game_4, resp.game_5, resp.game_6, resp.game_7, resp.game_8, resp.game_9, resp.game_10 ];      // console.log(teacher_games);

            document.getElementById('savedTeacherGames').innerHTML =  '<div style="display:grid; grid-template-columns: 20px 300px 16px; grid-template-rows:1px; align-self:center;" >' +
                        '<div style="display:flex; justify-content:center; align-items:center; font-size:16px;"></div>' ;
    
            let n = 1;
            teacher_games.forEach( (teacherGame) => { 
                if (teacherGame != 'none') { 
                    gameMenuTitle = teacherGame.split('|&|')[0];
                    
                    document.getElementById('savedTeacherGames').innerHTML +=  '<div style="display:grid; grid-template-columns: 20px 300px 16px; grid-template-rows:28px; align-self:center;" >' +
                        '<div style="display:flex; justify-content:center; align-items:center; font-size:16px;">'+n+'.</div>' +
                        '<div id="game_'+n+'" onclick="select_custom_game(id)" class="custom_game">'+gameMenuTitle+'</div>' +
                        '<div id="delete#game_'+n+'" class="x_game_remove" onmouseup="remove_teacher_game(id)">x</div>' +
                        '</div>' ;
                    if (currentGame == gameMenuTitle) { gameRounds = teacherGame.split('|&|'); gameTitle = gameRounds.shift(); list_game_rounds(); }
                }
                else {
                    document.getElementById('savedTeacherGames').innerHTML +=  '<div style="display:grid; grid-template-columns: 20px 300px 16px; grid-template-rows:28px; align-self:center;" >' +
                        '<div style="display:flex; justify-content:center; align-items:center; font-size:16px;">'+n+'.</div>' +
                        '<div style="display:flex; justify-content:center; align-items:center; ">------------------------------------</div>' +
                        '<div></div>' +
                        '</div>' ;                
                }
                n++;
            });
            check_teacher_game_limit();
        });
    }

    update_teacher_games_in_db = function(tG) {
        socket.emit('update_teacher_games', {"ref":idKey,"g1":tG[0],"g2":tG[1],"g3":tG[2],"g4":tG[3],"g5":tG[4],"g6":tG[5],"g7":tG[6],"g8":tG[7],"g9":tG[8],"g10":tG[9]}, (resp) => { list_teacher_games(); });
    };

    set_as_current_game_in_db = function() { let currentGame = gameTitle+'|&|';
        gameRounds.forEach( (round) => { currentGame += round + '|&|'; })  
        currentGame = currentGame.slice(0, -3);
        
        socket.emit('set_as_current_teacher_game', idKey, currentGame);
    };

    update_maxStudentGroup = function() {
        if (idKey != 'nonMember') { socket.emit('update_maxStudentGroup', idKey, maxStudentGroup); }
        document.getElementById('maxStudentGroupID').textContent = maxStudentGroup;
    };

    check_num_users_linked_to_game_and_status = function(gCode) { 
        
        socket.volatile.emit('check_num_users_linked_to_game', gCode, (gameStatus) => { console.log(gameStatus);  
            
            if (gameStatus == 'err1' || gameStatus == 'err2' || gameStatus == 'err3' || gameStatus == 'err4') { 
                document.getElementById('codeID').innerHTML = 'err';
            }
            else {
                gStatArray = gameStatus.split('>>');                            //  state>>timeStamp>>round>>maxGroupSize>>currentGame>>numOfUsers
                numOfUser = gameStatus.split('|>|')[1];                         // note '|>|', the No# of users is added onto the end
                gStatState = gStatArray[0];                                     // console.log('gStatState');  console.log(gStatState);
                current_rnd = gStatArray[2];
                activity = gStatArray[4].split('|&|')[current_rnd];             // console.log(activity);
    
                document.getElementById('round_number').textContent = current_rnd;  // round
                
                if (current_rnd != '0') { 
                    document.getElementById('round_'+current_rnd).classList.add('currentRound_flashing'); 
                    if (current_rnd != '1'){ document.getElementById('round_'+(current_rnd-1)).classList.remove('currentRound_flashing');  }
                }

                if (gStatState == 'not_started_yet') {
                    document.getElementById('play_bttn').style.display = 'flex';
                    gameState_running_or_paused = 'not_started_yet';
                    
                    if (numOfUser == '1') { document.getElementById('game_status_message_above').textContent = numOfUser+' student out of '+numOfStudentsInClass+' have joined'; }
                    else { document.getElementById('game_status_message_above').textContent = numOfUser+' students out of '+numOfStudentsInClass+' have joined'; }
                    
                    if (numOfUser == '0') { document.getElementById('play_bttn').innerHTML = 'Wait for students to link'; }
                    else { document.getElementById('play_bttn').innerHTML = 'Click to PLAY!'; }
                    sessionStorage.setItem("LASTtimeBeforeStart", Date.now());
                }
        
                if ((gStatState == 'uploading_wait_to_start' || gStatState == 'running' || gStatState == 'rnd_complete_results_transfer') && (gStatArray.length == 6)) {
                    document.getElementById('play_bttn').style.display = 'flex';
                    gameState_running_or_paused = 'running';
                    document.getElementById('game_status_message_above').textContent = 'Game is running';
                    document.getElementById('play_bttn').innerHTML = 'Click to Pause';
                    
                    studentZoneDisplay(gStatState);
                }

                if (gStatArray.length == 7 ) { // string ">>paused" has been added therefore games is paused
                    document.getElementById('play_bttn').style.display = 'flex';
                    gameState_running_or_paused = 'paused';
                    document.getElementById('game_status_message_above').textContent = 'Game will pause at end of round';
                    document.getElementById('play_bttn').innerHTML = 'Click to re-start';

                    studentZoneDisplay('paused');
                }

                if (gStatState == 'finished') { 
                    if (gCode[0] == 'a' || gCode[0] == 'b') { window.location.replace('/teacher/nonMember'); }
                    else {
                        document.getElementById('game_status_message_above').textContent = 'Processing game data';
                        document.getElementById('play_bttn').innerHTML = 'please wait...';
                        document.getElementById('delete_bttn').innerHTML = '';
                        setTimeout( () => { window.location.replace('/teacher/delete_game_redirect_to_myStudents/'+idKey+'/'+gCode); }, 4000);
                    }
                }
            }
        });    
        setTimeout( () => { check_num_users_linked_to_game_and_status(gCode); }, 1000);
    }

    get_guest_gameCode = function() {                                           console.log('IN get_guest_gameCode');
        document.getElementById('play_as_guest').onclick='';
        document.getElementById('getgCode_bttn').style.display='none';
        document.getElementById('grey_background').style.display = 'none';
        document.getElementById('guest_gameCode_message').style.display='none';        
        
        let currentGame = gameTitle+'|&|';
        gameRounds.forEach( (round) => { currentGame += round + '|&|'; })  
        currentGame = currentGame.slice(0, -3);                                 // console.log(currentGame);
    
        socket.emit('get_guest_gameCode', {"currentGame":currentGame,"maxGroupSize":maxStudentGroup}, (guestGameCode) => {              // console.log('socket guestGameCode: '+guestGameCode);
            if (guestGameCode.length == 4) {
                document.getElementById('video_block').style.display = 'none';
                document.getElementById('display_guest_gameCode').style.display='flex';
                document.getElementById('studentZoneID').style.display='flex';
                document.getElementById('displayGuestGameCodeConsole').textContent = guestGameCode;

                document.getElementById('delete_game').href = '/teacher/delete_guest_game_via_click/'+guestGameCode;

                setTimeout( () => { check_num_users_linked_to_game_and_status(guestGameCode); }, 1000);
                
                gameCode = guestGameCode;
            }
        })
    };
    
    start_game_sequence = function() { console.log('start btn clicked');  // this set game_staus.state to 'running' in memC file.  return and check it before starting game.
        if (numOfUser > 0) {                           // console.log('gameRounds');  console.log(gameRounds);
            if (gameRounds.length > 0) {
                if (gameState_running_or_paused == 'not_started_yet') { console.log('start running the game!!!');
                    document.getElementById('play_bttn').style.display = 'none';
                    
                    let currentGame = gameTitle+'|&|';
                    gameRounds.forEach( (round) => { currentGame += round + '|&|'; })  
                    currentGame = currentGame.slice(0, -3);
                    
                    let total_rnds = currentGame.split('|&|').length - 1;               // minus one to remove game title
        
                    socket.emit('start_game_sequence', {"gameCode":gameCode,"ref":idKey,"currentGame":currentGame,"maxGroupSize":maxStudentGroup,"total_rnds":total_rnds} );
                    
                    document.getElementById('studentZoneID').innerHTML = '';
                }
                if (gameState_running_or_paused == 'running') { console.log('pause game now ??????');
                    document.getElementById('play_bttn').style.display = 'none';
                    document.getElementById('game_status_message_above').textContent = '';
                
                    socket.emit('game_paused_by_teacher', gameCode, (resp) => {
                       console.log(resp);
                    });
                }
                if (gameState_running_or_paused == 'paused') { console.log('pause game now ??????');
                    document.getElementById('play_bttn').style.display = 'none';
                    document.getElementById('game_status_message_above').textContent = '';
                
                    socket.emit('game_reStart_from_paused', gameCode, (resp) => {
                        console.log('socketResp');
                        console.log(resp);
                        console.log('after socketResp');
                    });
                }            
            }
            else { document.getElementById('play_bttn').textContent = 'No rounds to play!!!'; }
        }
    }

    display_usernames_passwords = function() {                                  // console.log('#### IN display_usernames_passwords');
        document.getElementById('display_usernamesPasswords').style.display = 'block';

        if (student_NOT_fetched_yet) { console.log('#### IN student_NOT_fetched_yet');
            socket.emit('fetch_my_students',idKey, (results) => { resp = results[0];
                
                student_NOT_fetched_yet = false;         console.log(resp);

                let arrayOfStudents = resp.arrayOfStudents;
            
                let array_ofStudents = resp.arrayOfStudents.split('|>|');               // arrayOfStudents = 4|>|983924s8>Jaden C>N>none>N>none>N>none|>|593v5s2y>Joel Ingwersen>N>none>Y>none>N>none|>|qtrx95ys>Sebastian Michelangelo>N>none>N>none>N>none
                max_group_size = array_ofStudents.shift();

                array_ofStudents.forEach( (user) => { user_array = user.split('>');  // array_of_user_refs.push(user_array[0]);  // 983924s8>Jaden C>N>none>N>none>N>none
 
                    array_ref_name.push([user_array[0],user_array[1]]);  // [ref,name]
                    
                    array_ref_name.sort( (a,b) => {        // this just puts names in alphabetical order
                    if (a[1].toLowerCase() < b[1].toLowerCase()) { return -1; } 
                    if (a[1].toLowerCase() > b[1].toLowerCase()) { return 1; } return 0; }); 
        
                    temp_students[user_array[0]] = {"ref":user_array[0], "name_chkbox":"unchecked", "nameFull":user_array[1], };
                });
                
                document.getElementById('listed_students').innerHTML = '';
            
                let bGrd = true;
                array_ref_name.forEach( (ref_name_rank) => { ref = ref_name_rank[0]; name = ref_name_rank[1]; user = temp_students[ref].ref; // [ref,nameFull,grp_ranking]
            
                    document.getElementById('listed_students').innerHTML += '<div style="display:grid; grid-template-columns:20px 200px 200px 160px;  padding-top:5px; align-self:left;" id="'+user+'bGrd">' +
                                                                            '<div style="grid-column:2/3; grid-row:1/2;" class="student_name" id="'+ref+'">'+name+'</div>' +
                                                                            '<div style="grid-column:3/4; grid-row:1/2;" class="task" id="'+user+'_userName"></div>' +
                                                                            '<div style="grid-column:4/5; grid-row:1/2;" class="task" id="'+user+'_passWord"></div>' +
                                                                            '<div style="grid-column:1/5; grid-row:1/2; border-bottom: 1px solid black;"></div>' +
                                                                            '</div>';
                });
                getStudentDetails();
            });
        }
    };
    
    getStudentDetails = function() {                                            console.log(array_ref_name[0][0])
        student_search_string = "idKey='"+array_ref_name[0][0];
        for (let n = 1; n < array_ref_name.length; n++) { student_search_string = student_search_string + "' OR idKey='"+array_ref_name[n][0]; }
        student_search_string = student_search_string + "'";
    
        socket.emit('fetch_my_students_details',student_search_string, (ref_userN_passW_array) => {         // console.log(ref_userN_passW_array); 
            ref_userN_passW_array.forEach( (ref_userN_passW) => {                                           // console.log(ref_userN_passW.idKey);
                
                document.getElementById(ref_userN_passW.idKey+'_userName').textContent = ref_userN_passW.userName;
                document.getElementById(ref_userN_passW.idKey+'_passWord').textContent = ref_userN_passW.userPassCode;
            });
        });
    }

}); // end of socket 'connect'

if (gameCode != 'none') { setTimeout( () => { check_num_users_linked_to_game_and_status(gameCode); }, 1000); }  // this needs ti be out of socket otherwise multiple calls will occur

let last_gStat = 'set';
function studentZoneDisplay(gStatState) {
    if (gStatState != last_gStat) {
        if (gStatState == 'uploading_wait_to_start') { 
            document.getElementById('studentZoneID').innerHTML = '<spam style="color:green; font-size:32px;"><center><b>Round '+current_rnd+'<br>is about to start.</b></span>';
            setTimeout( () => {  
                document.getElementById('studentZoneID').innerHTML = '<span class="studentZone_countDown red_backing">3</span>';
                setTimeout( () => {  
                    document.getElementById('studentZoneID').innerHTML = '<span class="studentZone_countDown orange_backing">2</span>';
                    setTimeout( () => {  
                        document.getElementById('studentZoneID').innerHTML = '<span class="studentZone_countDown green_backing">1</span>';
                        setTimeout( () => {
                            document.getElementById('studentZoneID').innerHTML = '<span style="color:green; font-size:32px;"><b>Round is now running</b></span>';
                        },999);
                    },999);
                },999);    
            },5700);
        }
        else if (gStatState == 'running') { document.getElementById('studentZoneID').innerHTML = '<span style="color:green; font-size:32px;"><b>Round is now running</b></span>';
            setTimeout( () => {  
                document.getElementById('studentZoneID').innerHTML = '<span style="color:blue;"><b><center>'+activityName[activity]+'</span><br><br><span style="color:purple;"><b><center>'+showEG[activity]+'</span>';
            },2000);
        }
        
        else if (gStatState == 'rnd_complete_results_transfer') { document.getElementById('studentZoneID').innerHTML = '<span style="color:green; font-size:32px;"><center><b>Round complete,<br>regrouping students...</b></span>'; }
        
        else if (gStatState == 'paused') { document.getElementById('studentZoneID').innerHTML = '<span style="color:green; font-size:32px;"><center><b>Game will pause<br>at end of round</span>'; }
    
        last_gStat = gStatState;
    }
}

function list_game_rounds() { 
    document.getElementById('gameRoundsID').innerHTML = '<div style="display:grid; grid-template-columns: 25px 540px 20px; grid-template-rows:2px; align-self:center;"><div></div>';
    document.getElementById('game_title').textContent = gameTitle;

    let n = 0;
    gameRounds.forEach( (round) => { // console.log(round);
    document.getElementById('gameRoundsID').innerHTML +=  '<div style="display:grid; grid-template-columns: 25px 540px 20px; grid-template-rows:38px; align-self:center;" >' +
                    '<div id="round_'+(n+1)+'" class="currentRound">'+(n+1)+'</div>' +
                    '<div id="'+n+'" onmousedown="mouseDown(id)" onmouseover="mouseOver(id)" onmouseout="mouseOut(id)" class="round_selected no_high_light">'+activityName[round]+'</div>' +
                    '<div class="x_rnd_remove" onmouseup="remove_activity('+n+')">x</div>' +
                    '</div>' ;
        n++;
    })
    // document.getElementById('gameRoundsID').innerHTML +=  '<div style="display:grid; grid; grid-template-columns: 30px 16px 570px; grid-template-rows:35px; padding-top:5px; align-self:center;">' +
    //                 '<div></div><div></div>' +
    //                 '<div class="add_round" id="addRoundID" onmouseup="goto_select_activities()">Add an Activity</div>' +
    //                 '</div>';

    if (gameTitle == 'Year 2' || gameTitle == 'Year 3' || gameTitle == 'Year 4' ||
        gameTitle == 'Year 5' || gameTitle == 'Year 6' || gameTitle == 'Year 7' ) { 
            preset_game = true; 
    } else { preset_game = false; }

    if (editGameRounds) { 
        document.getElementById('addRoundID').style.visibility = 'visible';
        document.querySelectorAll(".x_rnd_remove").forEach( (xBttn) => { xBttn.style.visibility = 'visible'; });
    }
}

function display_guest_message() {
    document.getElementById('grey_background').style.display = 'block';
    document.getElementById('guest_gameCode_message').style.display = 'block';
}
function remove_guest_message() {
    document.getElementById('grey_background').style.display = 'none';
    document.getElementById('guest_gameCode_message').style.display = 'none';
}
function display_editGame_message() {
    document.getElementById('grey_background').style.display = 'block';
    document.getElementById('guest_editGame_message').style.display = 'block';
}
function remove_editGame_message() {
    document.getElementById('grey_background').style.display = 'none';
    document.getElementById('guest_editGame_message').style.display = 'none';
    cancel_menu();
}

///// edit round order via drag ////////////////////////////////////////////////
let is_mouseDown_on_activity = false;
let moveNOTcompletedYet = true;
let mouseDownID;
let nID_of_original;
let newGame = false;

function edit_rnds_function() { 
    original_game_rounds = JSON.stringify(gameRounds);
    editGameRounds = true;
    document.getElementById('newTitleID').value = gameTitle;
    document.getElementById('game_title').style.visibility = 'hidden';      document.getElementById('saveAs_title').style.visibility = 'visible';    
    document.getElementById('addRoundID').style.visibility = 'visible';
    document.getElementById('editBttnID').style.display = 'none';           document.getElementById('cancelBttnID').style.display = 'flex';
    if (space_for_new_game) { document.getElementById('saveAsBttnID').style.visibility = 'visible'; }
    if (idKey == 'nonMember') { document.getElementById('saveAsBttnID').style.visibility = 'visible'; }
    if (preset_game == false) { document.getElementById('saveBttnID').style.visibility = 'visible'; }
    document.querySelectorAll(".x_rnd_remove").forEach( (xBttn) => { xBttn.style.visibility = 'visible'; });
}

function cancel_rnds_edit() {
    clear_edit_bttns();         newGame = false;
    gameRounds = JSON.parse(original_game_rounds);                                          
    list_game_rounds();
}

function clear_edit_bttns() {
    editGameRounds = false;     newGame = false;
    document.getElementById('game_title').style.visibility = 'visible';     document.getElementById('saveAs_title').style.visibility = 'hidden';    
    document.getElementById('addRoundID').style.visibility = 'hidden';
    document.getElementById('editBttnID').style.display = 'flex';           document.getElementById('cancelBttnID').style.display = 'none';
    document.getElementById('saveAsBttnID').style.visibility = 'hidden';    document.getElementById('saveBttnID').style.visibility = 'hidden';
    document.querySelectorAll(".x_rnd_remove").forEach( (xBttn) => { xBttn.style.visibility = 'hidden'; });
}

function add_a_new_game() {
    edit_rnds_function();
    document.getElementById('newTitleID').value = '';
    document.getElementById('saveBttnID').style.visibility = 'hidden';
    newGame = true;
    gameRounds = [];
    list_game_rounds();
}

function mouseDown(id) { 
    if (editGameRounds) {
        is_mouseDown_on_activity = true;  mouseDownID = id;  nID_of_original = id;
        document.getElementById(id).classList.add('round_hover');  document.getElementById(id).classList.add('mouseDown_on_this_bttn');
    }
}

function mouseOver(nID_of_mouseOver) {
    if (editGameRounds) {
        if (is_mouseDown_on_activity && moveNOTcompletedYet) { 
    
            let originalRound = gameRounds[nID_of_original];    let shuffledRound = gameRounds[nID_of_mouseOver];
            gameRounds[nID_of_mouseOver] = originalRound;       gameRounds[nID_of_original] = shuffledRound;
    
            let value_of_original = document.getElementById(nID_of_original).textContent;
            let value_of_mouseOver = document.getElementById(nID_of_mouseOver).textContent;
            
            document.getElementById(nID_of_original).textContent = value_of_mouseOver;
            document.getElementById(nID_of_mouseOver).textContent = value_of_original;
    
            document.getElementById(nID_of_original).classList.remove('mouseDown_on_this_bttn');
            document.getElementById(nID_of_mouseOver).classList.add('mouseDown_on_this_bttn');
            document.getElementById(nID_of_original).classList.add('visible_transition');
            
            nID_of_original = nID_of_mouseOver;        
    
            setTimeout( () => { roundList = document.querySelectorAll(".round_selected");
                roundList.forEach( (round) => { round.classList.remove('visible_transition'); });
            },1500);
    
            moveNOTcompletedYet = false;
        }
        document.getElementById(nID_of_mouseOver).classList.add('round_hover');
    }
}

function mouseOut(id) { moveNOTcompletedYet = true;  document.getElementById(id).classList.remove('round_hover'); }

document.addEventListener("mouseup", (e)=>{ moveNOTcompletedYet = true;
    let mouseUpID = e.target.id;
    if (is_mouseDown_on_activity) { 
        is_mouseDown_on_activity = false; 
        document.getElementById(mouseUpID).classList.remove('mouseDown_on_this_bttn');

        if (mouseUpID != mouseDownID) { 
            list_game_rounds();
        }
    }
});

function update_single_teacherGame_in_db(thisGameRef) {
    let gameRoundsStr = gameTitle+'|&|';
    gameRounds.forEach( (round) => { gameRoundsStr += round + '|&|'; })  
    gameRoundsStr = gameRoundsStr.slice(0, -3);
}

function update_NEW_teacherGame_db(newTitle) { // console.log('make new table and store in db game for: '+newTitle);
    let n = 1;
    let gameRef;
    teacher_games.forEach( (teacherGame)=> { //title = teacherGame.split('|&|')[0];
        if (teacherGame == 'none') { gameRef = 'game_'+n; return; } n++;
    });

    let gameRoundsStr = newTitle+'|&|';
    gameRounds.forEach( (round) => { gameRoundsStr += round + '|&|'; })  
    gameRoundsStr = gameRoundsStr.slice(0, -3);
}

function save_function() { 
    if (gameRounds.length != 0) {

        newTitle = document.getElementById('newTitleID').value.trim();
        newTitle = newTitle.replaceAll('  ', ' ');

        let thisTitleIsNew = true;
        teacher_games.forEach( (teacherGame)=> { title = teacherGame.split('|&|')[0];
            if (newTitle == title) { thisTitleIsNew = false; return; }
        });

        if (newTitle == 'Year 2' || newTitle == 'Year 3' || newTitle == 'Year 4' ||
             newTitle == 'Year 5' || newTitle == 'Year 6' || newTitle == 'Year 7' ||
             newTitle == 'This game name already exists') { thisTitleIsNew = false; }        
        if (newTitle.replaceAll(' ', '').length == 0) { thisTitleIsNew = false; }
        
        if (newTitle == gameTitle) { thisTitleIsNew = true; }

        if (thisTitleIsNew) {
            let n = 0;
            teacher_games.forEach( (teacherGame)=> { title = teacherGame.split('|&|')[0];
                if (gameTitle == title) { a = n; return; }  n++;
            });
    
            for (let q=a; q<9; q++) { teacher_games[q] = teacher_games[q+1]; }  // 1st delete the game currently displayed but with name edited
            
            teacher_games[9] = 'none';
        
            gameTitle = newTitle;
    
            let savedGameRndsStr = gameTitle+'|&|';
            gameRounds.forEach( (round) => { savedGameRndsStr += round + '|&|'; })  
            savedGameRndsStr = savedGameRndsStr.slice(0, -3);
            
            for (let q=9; q>0; q--) { teacher_games[q] = teacher_games[q-1]; }
            
            teacher_games[0] = savedGameRndsStr;
    
            update_teacher_games_in_db(teacher_games);      set_as_current_game_in_db();
    
            document.getElementById('savedTeacherGames').scrollTo({ top: 0, behavior: "smooth", });
    
            document.getElementById('game_title').classList.add('move_to_save');
            setTimeout( () => {document.getElementById('game_title').classList.remove('move_to_save');},2000);
            
            clear_edit_bttns();
        }
        else { game_name_already_exists(); }
    }
    else { game_needs_1_round(); }
}

function saveAs_function() {                                                    // console.log('IN saveAs_function');
    if (idKey != 'nonMember') {
        if (gameRounds.length != 0) {
            newTitle = document.getElementById('newTitleID').value.trim();
            newTitle = newTitle.replaceAll('  ', ' ');
    
            let thisTitleIsNew = true;
            teacher_games.forEach( (teacherGame)=> { title = teacherGame.split('|&|')[0];
                if (newTitle == title) { thisTitleIsNew = false; return; }
            });
    
            if (newTitle == 'Year 2' || newTitle == 'Year 3' || newTitle == 'Year 4' ||
                 newTitle == 'Year 5' || newTitle == 'Year 6' || newTitle == 'Year 7' ||
                 newTitle == 'This game name already exists') { thisTitleIsNew = false; }        
            if (newTitle.replaceAll(' ', '').length == 0) { thisTitleIsNew = false; }
    
            if (thisTitleIsNew) {
    
                gameTitle = newTitle;
    
                let savedGameRndsStr = gameTitle+'|&|';
                gameRounds.forEach( (round) => { savedGameRndsStr += round + '|&|'; })  
                savedGameRndsStr = savedGameRndsStr.slice(0, -3);
                
                for (let q=9; q>0; q--) { teacher_games[q] = teacher_games[q-1]; }
                
                teacher_games[0] = savedGameRndsStr;
    
                update_teacher_games_in_db(teacher_games);
                set_as_current_game_in_db();
    
                document.getElementById('game_title').classList.add('move_to_save');
                setTimeout( () => {document.getElementById('game_title').classList.remove('move_to_save');},3000);
                
                clear_edit_bttns();
            }
            else { game_name_already_exists(); }
        }
        else { game_needs_1_round(); }
    }
    else {
        display_editGame_message();
    }
}

function game_name_already_exists() {
    document.getElementById('newTitleID').style.color = '#fa7a7a';
    document.getElementById('newTitleID').value = 'This game name already exists';
    document.getElementById('newTitleID').disabled = true;
    setTimeout( () => {
        document.getElementById('newTitleID').style.color = 'black';
        document.getElementById('newTitleID').value = gameTitle;
        if (newGame) { document.getElementById('newTitleID').value = ''; }
        document.getElementById('newTitleID').disabled = false;
    }, 2000);    
}

function game_needs_1_round() {
    document.getElementById('newTitleID').style.color = '#fa7a7a';
    document.getElementById('newTitleID').value = 'Your game needs at least 1 round';
    document.getElementById('newTitleID').disabled = true;
    setTimeout( () => {
        document.getElementById('newTitleID').style.color = 'black';
        document.getElementById('newTitleID').value = ''; 
        document.getElementById('newTitleID').disabled = false;
    }, 2000);    
}

function select_preset_game(id) {
    clear_edit_bttns();

    gameRounds = gameRounds_object[id].split(',');
    gameTitle = gameRounds.shift();
    
    set_as_current_game_in_db();
    list_game_rounds();
}

function select_custom_game(id) {
    clear_edit_bttns();

    a = id.split('_')[1]-1;  // a = 0 when game_1

    gameRounds = teacher_games[a].split('|&|');
    gameTitle = gameRounds.shift();

    set_as_current_game_in_db();        list_game_rounds();
}

function remove_teacher_game(id) {
    let a = id.split('_')[1] - 1;
    let game_deleted_title = teacher_games[a].split('|&|')[0];
    
    for (let q=a; q<9; q++) { teacher_games[q] = teacher_games[q+1]; }
    teacher_games[9] = 'none';

    update_teacher_games_in_db(teacher_games);
    
    if (gameTitle == game_deleted_title) { select_preset_game('year_4_game'); }
}

function remove_activity(n) { 
    for (let i = n; i < (gameRounds.length - 1); i++) { gameRounds[i] = gameRounds[i+1]; }
    
    gameRounds.pop();       list_game_rounds();     // game_has_been_modified();
}

/////// these are the function for the selection of activities to be added to rounds //////
function goto_select_activities() {

    document.getElementById('teacher_main_menu').style.display = 'none';        document.getElementById('activity_menu_selection').style.display = 'block';
    
    document.getElementById('game_title_on_menu').textContent = document.getElementById('game_title').textContent
    document.getElementById('menu_task_cnt').textContent = gameRounds.length;
}

let include_activity = [];
function activityPlay(taskID) { task = taskID;                                                    console.log(taskID);
    
    // if (taskID.split('TT').length == 2) { task = taskID.split('TT')[0];  tableNum = taskID.split('TT')[1]; }
    // else { task = taskID }
    
    if ( document.getElementById(task).classList.contains('activity_selected') ) { 
        document.getElementById(task).classList.remove('activity_selected');
        document.getElementById('menu_task_cnt').textContent = parseInt(document.getElementById('menu_task_cnt').textContent) - 1;
        
        let temp_list = [];                                                     // remove the selected activity
        include_activity.forEach( (activityID) => { if ( activityID != taskID ) { temp_list.push(activityID); } });
        include_activity = temp_list;
    }
    else { 
        document.getElementById(task).classList.add('activity_selected');  
        include_activity.push(taskID); 
        document.getElementById('menu_task_cnt').textContent = parseInt(document.getElementById('menu_task_cnt').textContent) + 1;
    }
    console.log(include_activity);
    
    if (include_activity.length == 0) { document.getElementById('addActivitiesBttn').style.opacity = '30%';  }
    else { document.getElementById('addActivitiesBttn').style.opacity = '100%'; }
}

function add_activities() { 
    if (idKey != 'nonMember') {
        include_activity.forEach( (activityID) => { 
            // if (activityID.split('TT').length == 2) { activityID = activityID.split('TT')[0]; }
            document.getElementById(activityID).classList.remove('activity_selected'); 
        });
    
        document.getElementById('teacher_main_menu').style.display = 'block';
        document.getElementById('activity_menu_selection').style.display = 'none';
        
        if (include_activity.length > 0) { 
            gameRounds = gameRounds.concat(include_activity); 
            include_activity = [];
            list_game_rounds();  // update_db_and_page();
        }
    }
    else {
        display_editGame_message();
    }
}

function cancel_menu() {  
    include_activity.forEach( (activityID) => { document.getElementById(activityID).classList.remove('activity_selected'); });
    document.getElementById('teacher_main_menu').style.display = 'block';
    document.getElementById('activity_menu_selection').style.display = 'none'; 
    include_activity = [];
}

let space_for_new_game = false;
function check_teacher_game_limit() { space_for_new_game = false;
    teacher_games.forEach( (game)=> { if (game == 'none') { space_for_new_game = true; } });
    if (space_for_new_game == false) {
        document.getElementById('savedTeacherGames').innerHTML +=  '<div style="display:grid; grid-template-columns: 316px; grid-template-rows:20px 20px; align-self:center;" >' +
        '<div style="display:flex; justify-content:center; align-items:center; color:red; font-size:14px;"><b>Your Teacher Games menu is FULL</b></div>' +
        '<div style="display:flex; justify-content:center; align-items:center; color:red; font-size:14px;"><b>Delete before saving new game</b></div>' +
        '</div>' ;
        document.getElementById('add_new_game_ID').style.visibility = 'hidden';
    }
    else { document.getElementById('add_new_game_ID').style.visibility = 'visible'; }
}

function decrease_cnt() { maxStudentGroup = parseInt(maxStudentGroup) - 1;
    if (maxStudentGroup < 3) { maxStudentGroup = 3 }
    update_maxStudentGroup();
}
function increase_cnt() { maxStudentGroup = parseInt(maxStudentGroup) + 1;
    if (maxStudentGroup > 9) { maxStudentGroup = 9 }
    update_maxStudentGroup();
}

////////////////////////////////////////////////////////////////////////////////
function get_game_code() { console.log('in get_game_code')
    if (editGameRounds) { console.log('currently editing a game!!!!'); 
        document.getElementById('grey_background').style.display = 'block';
        document.getElementById('currently_editing_game_message').style.display = 'block';        
    }
    else { console.log('in else of get_game_code')
        document.getElementById('getgCode_bttn').onclick = '';
    
        // let currentGame = gameTitle+'|&|';
        // gameRounds.forEach( (round) => { currentGame += round + '|&|'; })  
        // currentGame = currentGame.slice(0, -3);
    
        window.location.replace('/teacher/get_game_code/<%=ref%>/<%=user%>');
    }
}

////////////////////////////////////////////////////////////////////////////////
function play_video(video) {
    
    document.getElementById('grey_background').style.display='block';document.getElementById('play_video_here').style.display='block';
    
    // NOTE: by adding "?rel=0" at end it shows your videos
    
    if (video == 'play_game') {
        document.getElementById('insert_video').innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/LA6mUJ3JKmg?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }
    if (video == 'tasks_profiles') {
        document.getElementById('insert_video').innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/VK-vSvZKttc?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    } 
    if (video == 'student_zone') {
        document.getElementById('insert_video').innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/nE3YZ6taF7s?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }  
} 

</script>

<script>
    let line_elements = '';
    for (let line=1; line<100; line++) {
        
        rand_1 = Math.random();  rand_2 = Math.random();  rand_3 = Math.random();
        x1 = rand_1 * 620;  y1 = rand_2 * 565;  x2 = Math.cos(line/10) * 7 + x1;  y2 = Math.sin(line/10) * 7 + y1;
        x3 = rand_2 * 620;  y3 = rand_1 * 565;  x4 = Math.cos(line/9) * 9 + x3;  y4 = Math.sin(line/9) * 9 + y3;
        x5 = rand_1 * 620;  y5 = rand_3 * 565;  x6 = Math.cos(line/8) * 11 + x5;  y6 = Math.sin(line/8) * 11 + y5;
        x7 = rand_2 * 620;  y7 = rand_3 * 565;  x8 = Math.cos(line/7) * 14 + x7;  y8 = Math.sin(line/7) * 14 + y7;
        x9 = rand_3 * 620;  y9 = rand_1 * 565;  x10 = Math.cos(line/11) * 16 + x9;  y10 = Math.sin(line/11) * 16 + y9;       
        x11 = rand_3 * 620;  y11 = rand_2 * 565;  x12 = Math.cos(line/13) * 13 + x11;  y12 = Math.sin(line/13) * 13 + y11; 

        line_elements += '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+' M'+x3+' '+y3+' L'+x4+' '+y4+' M'+x5+' '+y5+' L'+x6+' '+y6+' M'+x7+' '+y7+' L'+x8+' '+y8+' M'+x9+' '+y9+' L'+x10+' '+y10+' M'+x11+' '+y11+' L'+x12+' '+y12+'    " class="paper" />';
    }
    document.getElementById('svg_background').innerHTML = line_elements;
    
</script>

</body>
</html>
