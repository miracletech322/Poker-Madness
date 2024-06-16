// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { clientEvent } from "../framework/clientEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PLayerSettingDialog extends cc.Component {

    @property(cc.Animation)
    animation: cc.Animation;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public showEvent()
    {
        this.node.active = true;
    }

    public hideEvent()
    {
        this.node.destroy();
    }

    show(){
        this.animation.play("open");
    }

    hide(){
        clientEvent.dispatchEvent("showPlayerSettingDialog");
        this.animation.play("close");
    }
}
