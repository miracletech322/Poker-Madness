import GameManager from "../GameManager";
import { clientEvent } from "../framework/clientEvent";
const i18n = require("LanguageData");

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
    this.scoreAtLeastLabel.string = i18n.t("basic.score_at_least");
    this.rewardLabel.string = i18n.t("basic.reward");
    this.orLabel.string = i18n.t("basic.or");
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
