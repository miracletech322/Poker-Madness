// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CardObject, GameSetting, maxCardForOneRow } from "./Constant";
import ModelManager from "./ModelManager";
import UIManager from "./UIManager";
import { clientEvent } from "./framework/clientEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  public static _instance: GameManager;
  public gameSetting: GameSetting;
  public imageAtlas: string;

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    GameManager._instance = this;
    UIManager.instance.loadImageAtlas();
    console.log("GameManager loaded");
  }

  start() {}

  // update (dt) {}

  protected onEnable(): void {
    clientEvent.on("pickCard", this.pickCardEvent, this);
    clientEvent.on("roundStarted", this.roundStartedEvent, this);
    clientEvent.on("fillCardEvent", this.fillCardEvent, this);
  }

  protected onDisable(): void {
    clientEvent.off("pickCard", this.pickCardEvent, this);
    clientEvent.off("roundStarted", this.roundStartedEvent, this);
    clientEvent.off("fillCardEvent", this.fillCardEvent, this);
  }

  public roundInit() {
    this.gameSetting = {
      gameStart: false,
      totalCardCount: 52,
      remainCardCount: 52,
      score: 0,
      multi1: 0,
      multi2: 0,
      hands: 4,
      discards: 4,
      cash: 5,
      ante: 1,
      totalAnte: 8,
      remainHandCardsCount: 0,
      newCards: [],
      handCards: [],
    };
    ModelManager._instance.randomSortCards();
  }

  updateGameSetting(newValue: GameSetting) {
    this.gameSetting = { ...this.gameSetting, ...newValue };
    UIManager.instance.changeGameValues(this.gameSetting);
  }

  roundStartedEvent(statusStart: boolean) {
    this.updateGameSetting({ gameStart: true });
    this.fillCards();
  }

  fillCards() {
    const newCards = GameManager._instance.gameSetting.newCards;
    const handCards = GameManager._instance.gameSetting.handCards;
    const newFilledCards: CardObject[] = [];
    const handCardsCount =
      GameManager._instance.gameSetting.remainHandCardsCount;
    if (maxCardForOneRow > handCardsCount) {
      while (true) {
        if (handCards.length === maxCardForOneRow || newCards.length === 0)
          break;
        const newCard = newCards.shift();
        newFilledCards.push(newCard);
        handCards.push(newCard);
      }
    }
    UIManager.instance.fillCards(newFilledCards);
  }

  pickCardEvent([pickStatus, cardId]: [boolean, number]) {
    const cardIndex = this.gameSetting.handCards.findIndex(
      (card) => card.id === cardId
    );
    if (cardIndex !== -1) {
      this.gameSetting.handCards[cardIndex].pickStatus = pickStatus;
    }
  }

  fillCardEvent(cardId: number) {
    this.updateGameSetting({
      remainCardCount: this.gameSetting.remainCardCount - 1,
    });
  }

  discardHandCards() {
    this.updateGameSetting({ handCards: [] });
  }
}
