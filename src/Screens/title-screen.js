const titleScreen = {};
import { image } from "../data/image";
import { drawRoundBox } from "./tools/drawRoundBox";
import { drawText } from "./tools/drawText";
import { checkTouch} from "./tools/checkTouch";
import { Color_list} from "../data/color_list";
import { viewServerListScreen } from "./view-server-list-screen";
import {creditScreen} from "./credit-screen";
import {howToPlayScreen} from "./how-to-play-screen";
import {settingScreen} from "./setting-screen";
import {clearCtx} from "./tools/clearCtx";
import {drawImage} from "./tools/drawImage";

titleScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    if(typeof(history.pushState) != 'undefined'){
        let url = new URL(window.location.href);
        let urlParams = url.searchParams;
        if(urlParams.has('page')){
            urlParams.delete('page');
        }
        history.pushState(null, null, url);
    }
    titleScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    titleScreen.checkUIList = [];
    titleScreen.checkUIList.push({
        tag: "start-game-title",
        center_x: 960,
        center_y: 600,
        width: 720,
        height: 120,
        clicked: function () {
            Screen.currentScreen = viewServerListScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
    titleScreen.checkUIList.push({
        tag: "settings-title",
        center_x: 960,
        center_y: 840,
        width: 720,
        height: 120,
        clicked: function () {
            Screen.currentScreen = settingScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
    titleScreen.checkUIList.push({
        tag: "help-title",
        center_x: 1836,
        center_y: 1008,
        width: 120,
        height: 120,
        clicked: function () {
            Screen.currentScreen = howToPlayScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
    titleScreen.checkUIList.push({
        tag: "copy-title",
        center_x: 1692,
        center_y: 1008,
        width: 120,
        height: 120,
        clicked: function () {
            Screen.currentScreen = creditScreen;
            Screen.currentScreen.initialize(Background_ctx, UI_ctx, Screen);
        }
    });
};

titleScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 600, 720, 120, UI_ctx.displayDPI)) {
        drawRoundBox(UI_ctx, 960, 600, 720*1.05, 120*1.05, Color_list.button_blue_2_hex, Color_list.button_blue_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 960, 600, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Start Game", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960, 600, 720, 120, Color_list.button_blue_1_hex, Color_list.button_blue_2_hex, 10, 25);
        drawText(UI_ctx, 960, 600, 60, 0, Color_list.text_default_hex, undefined, undefined, "Start Game", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 960, 840, 720, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 960, 840, 720*1.05, 120*1.05, Color_list.button_red_2_hex, Color_list.button_red_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 960, 840, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "Settings", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 960, 840, 720, 120, Color_list.button_red_1_hex, Color_list.button_red_2_hex, 10, 25);
        drawText(UI_ctx, 960, 840, 60, 0, Color_list.text_default_hex, undefined, undefined, "Settings", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1836, 1008, 120,120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 1836, 1008, 120*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1836, 1008, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "?", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1836, 1008, 120, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1836, 1008, 60, 0, Color_list.text_default_hex, undefined, undefined, "?", "center", "GmarketSansMedium");
    }
    if(checkTouch(Screen.userMouse.x, Screen.userMouse.y, 1692, 1008, 120, 120, UI_ctx.displayDPI)){
        drawRoundBox(UI_ctx, 1692, 1008, 120*1.05, 120*1.05, Color_list.button_gray_2_hex, Color_list.button_gray_3_hex, 10*1.05, 25*1.05);
        drawText(UI_ctx, 1692, 1008, 60*1.05, 0, Color_list.text_onmouse_hex, undefined, undefined, "ⓒ", "center", "GmarketSansMedium");
    }else{
        drawRoundBox(UI_ctx, 1692, 1008, 120, 120, Color_list.button_gray_1_hex, Color_list.button_gray_2_hex, 10, 25);
        drawText(UI_ctx, 1692, 1008, 60, 0, Color_list.text_default_hex, undefined, undefined, "ⓒ", "center", "GmarketSansMedium");
    }
    drawText(UI_ctx, 10, 1060, 30, 0, Color_list.text_default_hex, undefined, undefined, `V${__BUILD_VERSION__}`, "left", "GmarketSansMedium");
    if(__FLAG__ === "dev"){
        drawText(UI_ctx, 10, 1020, 30, 0, Color_list.text_default_hex, undefined, undefined, `ENV: ${__BUILD_ENV__}`, "left", "GmarketSansMedium");
    }
};

titleScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
    if(userMouse.click === true) {
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI)) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
};

titleScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
    drawImage(Background_ctx, image.title_logo, 960, 255, 1026, 450);
};

export { titleScreen };