import GameManager from "../GameManager";
import { clientEvent } from "../framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlindSelectGroup extends cc.Component {
  start() {}

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {}

  hide() {}

  public selectRound() {
    clientEvent.dispatchEvent("roundStarted", []);
  }
}
