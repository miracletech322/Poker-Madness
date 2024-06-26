// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { loadImgAtlas } from "./AssetLoader";
import { GameStartOption } from "./Constant";
import Global from "./Global";
import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuManager extends cc.Component {
  @property(cc.Prefab)
  startOptionDialog: cc.Prefab;

  @property(cc.Button)
  background: cc.Button;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    loadImgAtlas()
      .then(() => {
        console.log("successfully loaded atlas file");
        this.background.node.active = false;
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  start() {}

  protected onEnable(): void {
    clientEvent.on("showPlayerSettingDialog", this.playButtonClicked, this);
  }

  protected onDisable(): void {
    clientEvent.off("hidePlayerSettingDialog", this.playButtonClicked, this);
  }

  // update (dt) {}

  public playButtonClicked() {
    uiManager.instance.showDialog("StartOptionDialog", this.startOptionDialog);
  }
}
