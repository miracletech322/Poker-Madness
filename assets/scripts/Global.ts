// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GameStartOption } from "./Constant";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Global{
    static _instance: Global;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new Global();
        return this._instance;
    }

    public round: number = 0;
    public gameStartOption: GameStartOption = GameStartOption.NewRun;
}
