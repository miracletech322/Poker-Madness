import GameManager from "../GameManager";
import { clientEvent } from "../framework/clientEvent";
import { T } from "../i18n";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlindSelectGroup extends cc.Component {

  @property(cc.Label)
  scoreAtLeastLabel: cc.Label;

  @property(cc.Label)
  rewardLabel: cc.Label;

  @property(cc.Label)
  orLabel: cc.Label;

  protected onLoad(): void {
    this.scoreAtLeastLabel.string = T("score_at_least");
    this.rewardLabel.string = T("reward");
    this.orLabel.string = T("or");
  }

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
    clientEvent.dispatchEvent("roundStartedEvent", []);
  }
}
