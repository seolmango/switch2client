// js load
import { io } from 'socket.io-client';
import {titleScreen} from "./Screens/title-screen";
import {agreementSoundScreen} from "./Screens/agreement-sound-screen";
import {tooManyUserScreen} from "./Screens/too-many-user-screen";
import {Color_list} from "./data/color_list";
import {drawText} from "./Screens/tools/drawText";
import {waitingRoomScreen} from "./Screens/waiting-room-screen";
import {viewServerListScreen} from "./Screens/view-server-list-screen";
import {JoystickController} from "./joystick/joystick";
import {checkMobile} from "./Screens/tools/checkMobile";
import {settingScreen} from "./Screens/setting-screen";
import {howToPlayScreen} from "./Screens/how-to-play-screen";
import {creditScreen} from "./Screens/credit-screen";
import {joinRoomWithIdScreen} from "./Screens/join-room-with-id-screen";
import {drawRoundBox} from "./Screens/tools/drawRoundBox";
require('./main.css');

// load html DOM elements
const Background_canvas = document.getElementById('background');
const Background_ctx = Background_canvas.getContext('2d');
const UI_canvas = document.getElementById('ui');
const UI_ctx = UI_canvas.getContext('2d');

// Set Data
const Screen = {};

/**
 * information of user's mouse
 * @type {{x: number, y: number, press: boolean, click: boolean}}
 */
Screen.userMouse = {
    x: 0,
    y: 0,
    click: false,
    press: false,
};
Screen.DPI = 1;
UI_ctx.displayDPI = Screen.DPI;
Background_ctx.displayDPI = Screen.DPI;
// 0~7: 이동키 2개, 8: 이동기 사용키, 9: 이모티콘 사용키, 10: 임시 빈칸, 11~18: switch 키, 19~20: 임시 빈칸, 21~28: 이모지키
Screen.userKeyboard = new Array(29).fill(false);
Screen.scale = 1;

Screen.currentScreen = {};
Screen.currentScreen.draw = function () {};
Screen.currentScreen.checkUIList = [];

/**
 * the gap between the client's screen and canvas width
 * @type {number}
 */
Screen.X0real = 0;

/**
 * the gap between the client's screen and canvas height
 * @type {number}
 */
Screen.Y0real = 0;

/**
 * the data of the alert message
 * @type {{data: {tag: string, text: string, time: number}[], draw: function, add_Data: function}}
 */
Screen.alert = {};
Screen.alert.data = [];
Screen.alert.draw = function() {
    for(let i=0; i<Screen.alert.data.length; i++){
        let color_alpha = (Screen.alert.data[i].time === -1) ? 0.8 : Math.min(0.8, (Screen.alert.data[i].time / Screen.Settings.Display.fps) * 0.8);
        drawRoundBox(UI_ctx, 960, (i*150) + 70, 1600, 120, `rgba(${Color_list.button_gray_2_rgb[0]}, ${Color_list.button_gray_2_rgb[1]}, ${Color_list.button_gray_2_rgb[2]}, ${color_alpha})`, `rgba(${Color_list.button_gray_3_rgb[0]}, ${Color_list.button_gray_3_rgb[1]}, ${Color_list.button_gray_3_rgb[2]}, ${color_alpha})`, 10, 25);
        drawText(UI_ctx, 960, (i*150) + 70, 60, 0, `rgba(${Color_list.text_onmouse_rgb[0]}, ${Color_list.text_onmouse_rgb[1]}, ${Color_list.text_onmouse_rgb[2]}, ${color_alpha})`, undefined, undefined, Screen.alert.data[i].text, "center", "GmarketSansMedium");
        if(Screen.alert.data[i].time > 0){
            Screen.alert.data[i].time--;
        }
        if(Screen.alert.data[i].time === 0){
            Screen.alert.data.splice(i, 1);
        }
    }
};
Screen.alert.add_Data = function (tag, text, time){
    let alreadyExist = false;
    for(let i=0; i<Screen.alert.data.length; i++){
        if(Screen.alert.data[i].tag === tag){
            alreadyExist = true;
            Screen.alert.data[i].text = text;
            Screen.alert.data[i].time = time * Screen.Settings.Display.fps;
            break;
        }
    }
    if(!alreadyExist){
        Screen.alert.data.push({
            tag: tag,
            text: text,
            time: time * Screen.Settings.Display.fps,
        });
    }
}

/**
 * the list of activated html elements
 * @type {Array}
 */
Screen.activatedHtmlElement = [];

/**
 * the data of user setting
 * @type {{Sound: {BGM: number}, Display: {fps: number}}}
 */
Screen.Settings = {
    Sound: {
        BGM: 0,
    },
    Display: {
        fps: 60,
    },
    KeyBind: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd', ' ', 'Shift', 'temp', '1', '2', '3', '4', '5', '6', '7', '8', 'temp', 'temp', '!', '@', '#', '$', '%', '^', '&', '*']
}

Screen.join_room = false;
Screen.joyStickCanvas = document.getElementById('joystick');
Screen.joyStickController = new JoystickController('joystick');
Screen.mobile = checkMobile();
// Set Screen Rendering Loop
window.onload = function () {
    Screen.currentScreen = agreementSoundScreen;
    Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    canvasResize();
    Screen.display_interval = setInterval( function () {
        if(Screen.joyStickController.active) {
            Screen.joyStickController.draw();
        }
        Screen.currentScreen.draw(Background_ctx, UI_ctx, Screen);
        Screen.alert.draw();
        Screen.currentScreen.check(Screen.userMouse, Screen.userKeyboard, Screen.currentScreen.checkUIList, Screen.DPI);
        Screen.userMouse.click = false;
    }, (1000 / Screen.Settings.Display.fps));
    if(Screen.mobile){
        Screen.alert.add_Data("mobile", `The screen automatically fits!`, 5);
        Screen.alert.add_Data('debug', `{width: ${window.innerWidth}, height: ${window.innerHeight}, ${window.devicePixelRatio}}`, 5)
    }
    setTimeout(function () {
        canvasResize();
    }, 3000);
}


// Event Listeners
window.addEventListener('resize', function() {
    canvasResize();
})

UI_canvas.addEventListener('mousemove', function(e) {
    Screen.userMouse.x = (e.offsetX / Screen.scale);
    Screen.userMouse.y = (e.offsetY / Screen.scale);
})

UI_canvas.addEventListener('click', function(e) {
    Screen.userMouse.click = true;
})

UI_canvas.addEventListener('mousedown', function(e) {
    Screen.userMouse.press = true;
})

UI_canvas.addEventListener('mouseup', function(e) {
    Screen.userMouse.press = false;
})

UI_canvas.addEventListener('mouseleave', function(e) {
    Screen.userMouse.press = false;
})

UI_canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
})

UI_canvas.addEventListener('touchstart', function(e) {
    Screen.userMouse.x = (e.touches[0].clientX - Screen.X0real) / Screen.scale;
    Screen.userMouse.y = (e.touches[0].clientY - Screen.Y0real) / Screen.scale;
    Screen.userMouse.press = true;
})

UI_canvas.addEventListener('touchmove', function(e) {
    Screen.userMouse.x = (e.touches[0].clientX - Screen.X0real) / Screen.scale;
    Screen.userMouse.y = (e.touches[0].clientY - Screen.Y0real) / Screen.scale;
})

UI_canvas.addEventListener('touchend', function(e) {
    Screen.userMouse.press = false;
})

window.addEventListener('keydown', function (e){
    if(Screen.Settings.KeyBind.indexOf(e.key) !== -1){
        Screen.userKeyboard[Screen.Settings.KeyBind.indexOf(e.key)] = true;
    }
})

window.addEventListener('keyup', function (e){
    if(Screen.Settings.KeyBind.indexOf(e.key) !== -1){
        Screen.userKeyboard[Screen.Settings.KeyBind.indexOf(e.key)] = false;
    }
})

document.addEventListener("visibilitychange", function() {
    if (document.hidden){
        Screen.userKeyboard = new Array(29).fill(false);
    }
})

window.addEventListener("blur", function() {
    Screen.userKeyboard = new Array(29).fill(false);
})

// Socket Event Listeners
window.addEventListener("doSocketConnect", function () {
    // 서버 주소 입력
    Screen.socket = io(__SOCKET_SERVER__);
    if(__FLAG__ === 'dev'){
        console.log(`Connecting to socket server: ${__SOCKET_SERVER__}`);
        console.log(`Build Version: ${__BUILD_VERSION__}`);
        console.log(`Build Environment: ${__BUILD_ENV__}`);
    }

    Screen.socket.on('connected', function () {
        Screen.socket.emit('set player info', (Screen.mobile) ? 'phone' : 'computer', (callback) => {
            if(callback.status === 200){
                Screen.alert.add_Data('connected', 'Connected to server!', 5);
            }else{
                Screen.alert.add_Data('error', 'error', 5);
            }
        })
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('page')){
            const page = urlParams.get('page');
            if(page === 'setting'){
                Screen.currentScreen = settingScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
            }
            if(page === 'howToPlay'){
                Screen.currentScreen = howToPlayScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
            }
            if(page === 'credit'){
                Screen.currentScreen = creditScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
            }
            if(page === 'serverList'){
                Screen.currentScreen = viewServerListScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
            }
            if(page.length === 12 && page.startsWith('room')){
                Screen.currentScreen = joinRoomWithIdScreen;
                Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
            }
        }else{
            Screen.currentScreen = titleScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });

    Screen.socket.on('server full', function () {
        Screen.currentScreen = tooManyUserScreen;
        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    })

    Screen.socket.on('player joined', function (data) {
        if(Screen.join_room){
            console.log(data);
            waitingRoomScreen.playerInfos.push(data);
            waitingRoomScreen.user_slot = [false, false, false, false, false, false, false, false, false];
            for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++){
                waitingRoomScreen.user_slot[waitingRoomScreen.playerInfos[i].number] = true;
            }
            Screen.alert.add_Data("player joined", `${data.name} joined!`, 5);
            if(waitingRoomScreen.Client_owner){
                waitingRoomScreen.checkUIList[13].clickable = 2 * Screen.Settings.Display.fps;
            }
        }
    })

    Screen.socket.on('player leaved', function (player_num) {
        if(Screen.join_room){
            let player_index = -1;
            for(let i=0; i<waitingRoomScreen.playerInfos.length; i++){
                if(waitingRoomScreen.playerInfos[i].number === player_num){
                    player_index = i;
                    break;
                }
            }
            if(player_index !== -1){
                Screen.alert.add_Data("player leaved", `${waitingRoomScreen.playerInfos[player_index].name} leaved!`, 5);
                waitingRoomScreen.playerInfos.splice(player_index, 1);
                waitingRoomScreen.user_slot = [false, false, false, false, false, false, false, false, false];
                for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++) {
                    waitingRoomScreen.user_slot[waitingRoomScreen.playerInfos[i].number] = true;
                }
            }
            if(waitingRoomScreen.Client_owner){
                waitingRoomScreen.checkUIList[13].clickable = 2 * Screen.Settings.Display.fps;
            }
        }
    })

    Screen.socket.on('owner changed', function (player_num) {
        if(Screen.join_room){
            waitingRoomScreen.playerInfos.forEach(function (player) {
                if(player.number === player_num){
                    player.role = 'owner';
                } else {
                    player.role = 'user';
                }
                if(player.number === waitingRoomScreen.Client_room_id){
                    waitingRoomScreen.Client_owner = player.role === 'owner';
                }
            })
        }
    })

    Screen.socket.on('you kicked', function () {
        Screen.alert.add_Data("you kicked", `You are kicked by owner!`, 5);
        Screen.join_room = false;
        Screen.currentScreen = viewServerListScreen;
        Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
    })

    Screen.socket.on('player number changed', function (payload) {
        if(Screen.join_room){
            waitingRoomScreen.playerInfos.forEach(function (player) {
                if(player.number === payload.before_idx){
                    player.number = payload.after_idx;
                }
            })
            waitingRoomScreen.user_slot = [false, false, false, false, false, false, false, false, false];
            for(let i = 0; i < waitingRoomScreen.playerInfos.length; i++) {
                waitingRoomScreen.user_slot[waitingRoomScreen.playerInfos[i].number] = true;
            }
            if(payload.before_idx === waitingRoomScreen.Client_room_id){
                waitingRoomScreen.Client_room_id = payload.after_idx;
            }
        }
    })

    Screen.socket.on('player skill changed', function (payload) {
        if(Screen.join_room){
            waitingRoomScreen.playerInfos.forEach(function (player) {
                if(player.number === payload.player_idx){
                    player.skill = payload.skill;
                }
            })
        }
    })

    Screen.socket.on('room map changed', function (payload) {
        if(Screen.join_room){
            waitingRoomScreen.gameroomInfo.mapIndex = payload.mapIndex;
            waitingRoomScreen.gameroomInfo.mapName = payload.mapName;
            Screen.alert.add_Data("map changed", `Map changed to ${payload.mapName}!`, 5);
        }
    })
});

// functions
function canvasResize() {
    if (window.innerWidth * 9 < window.innerHeight * 16) {
        Screen.scale = window.innerWidth / (1920 * Screen.DPI) * 0.9;
    } else {
        Screen.scale = window.innerHeight / (1080 * Screen.DPI) * 0.9;
    }
    Screen.joyStickCanvas.width = window.innerWidth;
    Screen.joyStickCanvas.height = window.innerHeight;
    Screen.joyStickCanvas.style.top = '50%';
    Screen.joyStickCanvas.style.left = '50%';
    Screen.joyStickCanvas.style.transform = 'translate(-50%, -50%)';
    Background_canvas.width = 1920 * Screen.DPI;
    Background_canvas.height = 1080 * Screen.DPI;
    Background_canvas.style.width = `${1920 * Screen.DPI * Screen.scale}px`;
    Background_canvas.style.height = `${1080 * Screen.DPI * Screen.scale}px`;
    UI_canvas.width = 1920 * Screen.DPI;
    UI_canvas.height = 1080 * Screen.DPI;
    UI_canvas.style.width = `${1920 * Screen.DPI * Screen.scale}px`;
    UI_canvas.style.height = `${1080 * Screen.DPI * Screen.scale}px`;
    Background_canvas.style.top = '50%';
    Background_canvas.style.left = '50%';
    Background_canvas.style.transform = 'translate(-50%, -50%)';
    UI_canvas.style.top = '50%';
    UI_canvas.style.left = '50%';
    UI_canvas.style.transform = 'translate(-50%, -50%)';
    Screen.currentScreen.redrawBackground(Background_ctx);
    for(let i = 0; i < Screen.activatedHtmlElement.length; i++){
        Screen.activatedHtmlElement[i].resize(Screen.scale, window.innerWidth, window.innerHeight, Screen.DPI);
    }
    Screen.X0real = (window.innerWidth - (1920 * Screen.DPI * Screen.scale)) / 2;
    Screen.Y0real = (window.innerHeight - (1080 * Screen.DPI * Screen.scale)) / 2;
}

Screen.CanvasResize = canvasResize;