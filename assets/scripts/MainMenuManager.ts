// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { loadFont, loadImgAtlas } from "./AssetLoader";
import { GameStartOption } from "./Constant";
import Global from "./Global";
import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";
import { T, loadI18n, setLanguage } from "./i18n";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuManager extends cc.Component {
  @property(cc.Prefab)
  startOptionDialog: cc.Prefab;

  @property(cc.Button)
  background: cc.Button;

  @property(cc.Label)
  playButtonLabel: cc.Label;

  @property(cc.Label)
  collectionButtonLabel: cc.Label;

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

    loadFont()
      .then(() => {
        console.log("successfully loaded font file");
      })
      .catch((err) => {
        console.log({ err });
      });

    loadI18n();

    this.playButtonLabel.string = T("play");
    this.collectionButtonLabel.string = T("collection");
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
