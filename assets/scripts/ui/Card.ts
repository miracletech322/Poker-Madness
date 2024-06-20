import { CardObject } from "../Constant";
import GameManager from "../GameManager";
import { clientEvent } from "../framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {
  @property(cc.Animation)
  animation: cc.Animation;

  @property(cc.Sprite)
  sprite: cc.Sprite;

  public selected: boolean;
  public statusHover: boolean;
  public cardId: number;

  start() {
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
  }

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  setCardInfo(card: CardObject) {
    this.cardId = card.id;
    this.sprite.spriteFrame = GameManager._instance.imageAtlas.getSpriteFrame(
      card.background
    );
  }

  show() {}

  hide() {}

  onMouseEnter() {
    this.node.scale = 1.1;
    this.statusHover = true;
  }

  onMouseLeave() {
    this.node.scale = 1;
    this.statusHover = false;
  }

  onMouseDown() {
    if (!this.statusHover) return;
    const handCards = GameManager._instance.gameSetting.handCards;
    const countPicked = handCards.filter(
      (card) => card.pickStatus === true
    ).length;
    const currentPos = this.node.getPosition();
    if (this.selected) {
      this.node.setPosition(cc.v2(currentPos.x, currentPos.y - 30));
      clientEvent.dispatchEvent("pickCard", [false, this.cardId]);
    } else if (countPicked < 5 && !this.selected) {
      this.node.setPosition(cc.v2(currentPos.x, currentPos.y + 30));
      clientEvent.dispatchEvent("pickCard", [true, this.cardId]);
    } else return;
    this.selected = !this.selected;
  }
}
