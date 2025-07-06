import {checkTouch} from "./tools/checkTouch";

const ingameScreen = {};
import { clearCtx } from './tools/clearCtx.js';

ingameScreen.initialize = function (Background_ctx, UI_ctx, Screen) {
    ingameScreen.redrawBackground(Background_ctx);
    clearCtx(UI_ctx);
    ingameScreen.checkUIList = [];
}

ingameScreen.draw = function (Background_ctx, UI_ctx, Screen) {
    clearCtx(UI_ctx);
}

ingameScreen.redrawBackground = function (Background_ctx) {
    clearCtx(Background_ctx);
}

ingameScreen.check = function (userMouse, userKeyboard, checkUIList, DPI) {
    if(userMouse.click === true){
        for (let i = 0; i < checkUIList.length; i++) {
            if (checkTouch(userMouse.x, userMouse.y, checkUIList[i].center_x, checkUIList[i].center_y, checkUIList[i].width, checkUIList[i].height, DPI) && checkUIList[i].clickable <= 0) {
                checkUIList[i].clicked();
            }
        }
        userMouse.click = false;
    }
}