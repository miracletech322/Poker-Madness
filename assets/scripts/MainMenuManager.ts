// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";
import PLayerSettingDialog from "./ui/PlaySettingDialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuManager extends cc.Component {
    @property(cc.Prefab)
    playerSettingDialog: cc.Prefab;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    protected onEnable(): void {
        clientEvent.on("showPlayerSettingDialog", this.showPlayerSettingDialog, this);
    }

    protected onDisable(): void {
        clientEvent.off("showPlayerSettingDialog", this.showPlayerSettingDialog, this);
    
    }

    // update (dt) {}

    public playButtonClicked()
    {
        uiManager.instance.showDialog("PlaySettingDialog", this.playerSettingDialog);
    }

    public showPlayerSettingDialog()
    {
        console.log("showPlayerSettingDialog");
        uiManager.instance.showDialog("PlaySettingDialog", this.playerSettingDialog);
    }
}
