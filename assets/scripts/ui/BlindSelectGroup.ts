import GameManager from "../GameManager";
import { clientEvent } from "../framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlindSelectGroup extends cc.Component {
  @property(cc.Animation)
  animation: cc.Animation;

  start() {}

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {
    this.animation.play("open");
  }

  hide() {
    this.animation.play("close");
  }

  public selectRound() {
    this.animation.play("close");
    clientEvent.dispatchEvent("roundStarted", true);
  }
}
