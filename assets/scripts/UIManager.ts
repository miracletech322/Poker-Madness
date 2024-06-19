// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GameSetting } from "./Constant";
import GameManager from "./GameManager";
import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
  public static instance: UIManager = null;

  @property(cc.Prefab)
  startOptionDialog: cc.Prefab;

  @property(cc.Prefab)
  blindSelectGroup: cc.Prefab;

  @property(cc.Label)
  scoreValue: cc.Label;

  @property(cc.Label)
  multiValue1: cc.Label;

  @property(cc.Label)
  multiValue2: cc.Label;

  @property(cc.Label)
  handsValue: cc.Label;

  @property(cc.Label)
  discardsValue: cc.Label;

  @property(cc.Label)
  cashValue: cc.Label;

  @property(cc.Label)
  anteValue: cc.Label;

  @property(cc.Label)
  anteTotal: cc.Label;

  @property(cc.Label)
  roundValue: cc.Label;

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    UIManager.instance = this;
    console.log("uimanager loaded");
  }

  start() {
    uiManager.instance.showDialog("BlindSelectGroup", this.blindSelectGroup);
    GameManager._instance.roundInit();
    this.changeGameValues(GameManager._instance.gameSetting);
  }

  protected onEnable(): void {}

  showStartOptionDialog() {
    uiManager.instance.showDialog("StartOption", this.startOptionDialog);
  }

  changeGameValues(gameSetting: GameSetting) {
    gameSetting.score &&
      (this.scoreValue.string = gameSetting.score.toString());
    gameSetting.multi1 &&
      (this.multiValue1.string = gameSetting.multi1.toString());
    gameSetting.multi2 &&
      (this.multiValue2.string = gameSetting.multi2.toString());
    gameSetting.hands &&
      (this.handsValue.string = gameSetting.hands.toString());
    gameSetting.discards &&
      (this.discardsValue.string = gameSetting.discards.toString());
    gameSetting.cash && (this.cashValue.string = gameSetting.cash.toString());
    gameSetting.ante && (this.anteValue.string = gameSetting.ante.toString());
    gameSetting.totalAnte &&
      (this.anteTotal.string = gameSetting.totalAnte.toString());
  }

  // update (dt) {}
}
