import {
  CardObject,
  CardStatus,
  Direction,
  GameProgress,
  cardPopDistance,
  spacingForCard,
} from "../Constant";
import GameManager from "../GameManager";
import UIManager from "../UIManager";
import { clientEvent } from "../framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {
  @property(cc.Animation)
  animation: cc.Animation;

  @property(cc.Sprite)
  sprite: cc.Sprite;

  public static _instance: Card;
  public statusHover: boolean;
  public cardId: number;
  public initialPos: cc.Vec2 = null;
  public dragOffset: cc.Vec2 = null;
  public touchFirstPos: cc.Vec2 = null;
  public touchEndPos: cc.Vec2 = null;
  public skipIndex: number;
  public isMoving: boolean;

  public disable: boolean;

  protected onLoad(): void {
    Card._instance = this;
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  protected onDestroy(): void {
    this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);

    this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  start() {}

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

  protected update(dt: number): void {}

  onMouseEnter() {
    if (!this.isEnablePickCard() || this.isDragging() || this.disable) return;
    this.node.scale = 1.1;
    this.statusHover = true;
    clientEvent.dispatchEvent("cardHoverEvent", [this.cardId, true]);
  }

  onMouseLeave() {
    if (!this.isEnablePickCard() || this.disable) return;
    this.node.scale = 1;
    this.statusHover = false;
    clientEvent.dispatchEvent("cardHoverEvent", [this.cardId, false]);
  }

  public isEnablePickCard() {
    return (
      GameManager._instance.gameSetting.gameProgress === GameProgress.Init ||
      GameManager._instance.gameSetting.gameProgress === GameProgress.Dragging
    );
  }

  public isDragging() {
    return (
      GameManager._instance.gameSetting.gameProgress === GameProgress.Dragging
    );
  }

  public pickCard() {
    if (!this.isEnablePickCard() || this.disable) return;
    if (!this.statusHover) return;
    const handCards = GameManager._instance.gameSetting.handCards;
    const countPicked = handCards.filter(
      (card) => card.cardStatus === CardStatus.Pick
    ).length;
    const cardIndex = handCards.findIndex((card) => card.id === this.cardId);
    const status = handCards[cardIndex].cardStatus;

    if (status === CardStatus.Pick) {
      this.node.setPosition(
        cc.v2(this.initialPos.x, this.initialPos.y - cardPopDistance)
      );
      clientEvent.dispatchEvent("pickCard", [CardStatus.Initial, this.cardId]);
    } else if (
      countPicked < 5 &&
      (status === CardStatus.Initial || status === undefined)
    ) {
      this.node.setPosition(
        cc.v2(this.initialPos.x, this.initialPos.y + cardPopDistance)
      );
      clientEvent.dispatchEvent("pickCard", [CardStatus.Pick, this.cardId]);
    } else return;
  }

  public onTouchStart(event: cc.Event.EventTouch) {
    if (!this.isEnablePickCard() || this.disable) return;
    this.initialPos = new cc.Vec2(this.node.position.x, this.node.position.y);

    this.touchFirstPos = event.getLocation();
    this.dragOffset = this.node.convertToNodeSpaceAR(this.touchFirstPos);
  }

  public onTouchMove(event: cc.Event.EventTouch) {
    if (!this.isEnablePickCard() || this.disable) return;

    GameManager._instance.updateGameSetting({
      gameProgress: GameProgress.Dragging,
    });

    const handCards = [...GameManager._instance.gameSetting.handCards];
    const touchPos = event.getLocation();
    const nodePos = this.node.parent.convertToNodeSpaceAR(touchPos);
    this.node.position = new cc.Vec3(
      nodePos.sub(this.dragOffset).x,
      nodePos.sub(this.dragOffset).y,
      0
    );

    const dragIndex = handCards.findIndex((card) => card.id === this.cardId);
    const dis = nodePos.x - this.dragOffset.x - this.initialPos.x;
    const skipIndex =
      Math.floor(Math.abs(dis) / spacingForCard) * (Math.abs(dis) / dis);
    if (
      skipIndex === this.skipIndex ||
      dragIndex + skipIndex < 0 ||
      dragIndex + skipIndex >= handCards.length
    ) {
      return;
    }
    this.skipIndex = skipIndex;

    const updatedCard = [
      ...GameManager._instance.getUpdatedCardWhenDragging(
        handCards,
        dragIndex,
        dragIndex + this.skipIndex
      ),
    ];
    UIManager.instance.arrangeHandCardsWhenDragging(updatedCard, this.cardId);
    clientEvent.dispatchEvent("cardHoverEvent", [this.cardId, false]);
  }

  public onTouchEnd(event: cc.Event.EventTouch) {
    if (!this.isEnablePickCard() || this.disable) return;
    GameManager._instance.updateGameSetting({
      gameProgress: GameProgress.Init,
    });
    this.touchEndPos = event.getLocation();
    if (
      Math.abs(this.touchEndPos.x - this.touchFirstPos.x) < 30 &&
      Math.abs(this.touchEndPos.y - this.touchFirstPos.y) < 30
    ) {
      this.pickCard();
    } else {
      this.dragCard();
    }

    this.skipIndex = -1;
  }

  public dragCard() {
    if (!this.isEnablePickCard() || this.disable) return;
    const handCards = GameManager._instance.gameSetting.handCards;
    const dragIndex = handCards.findIndex((card) => card.id === this.cardId);

    const updatedCard = [
      ...GameManager._instance.getUpdatedCardWhenDragging(
        handCards,
        dragIndex,
        dragIndex + this.skipIndex
      ),
    ];
    UIManager.instance.arrangeHandCardsAfterDragging(updatedCard);
  }

  public onTouchCancel() {}
}
