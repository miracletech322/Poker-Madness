// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Card, GameSetting } from "./Constant";
import ModelManager from "./ModelManager";
import UIManager from "./UIManager";
import { clientEvent } from "./framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  public static _instance: GameManager;
  public gameSetting: GameSetting;

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    GameManager._instance = this;
    console.log("GameManager loaded");
  }

  start() {}

  // update (dt) {}

  protected onEnable(): void {}

  protected onDisable(): void {}

  public roundInit() {
    this.gameSetting = {
      gameStart: false,
      totalCardCount: 52,
      remainCardCount: 52,
      score: 1,
      multi1: 0,
      multi2: 2,
      hands: 4,
      discards: 4,
      cash: 5,
      ante: 1,
      totalAnte: 8,
      remainHandCardsCount: 0,
      newCards: [],
      handCards: [],
    };
    ModelManager._instance.randomSortCards();

    // clientEvent.on("changeInitialValues", this.)
  }
}
