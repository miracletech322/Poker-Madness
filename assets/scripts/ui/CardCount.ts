import { CardObject } from "../Constant";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardCount extends cc.Component {
  @property(cc.Label)
  cardType: cc.Label;

  @property(cc.Label)
  cardCount: cc.Label;

  protected onLoad(): void {}

  protected onDestroy(): void {}

  start() {}

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {}

  hide() {}

  protected update(dt: number): void {}

  public setCompInfo(info: CardObject | null, numberCount: number) {
    if (info) {
      this.cardType.string = info.flowerId < 4 ? info.symbol[0] : info.symbol;
    }
    this.cardCount.string = numberCount.toString();
  }
}
