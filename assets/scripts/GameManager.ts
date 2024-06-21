// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import {
  CardObject,
  CardStatus,
  GameSetting,
  ScoreTypes,
  maxCardForOneRow,
} from "./Constant";
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
      scoreLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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

  pickCardEvent([pickStatus, cardId]: [CardStatus, number]) {
    const cardIndex = this.gameSetting.handCards.findIndex(
      (card) => card.id === cardId
    );
    if (cardIndex !== -1) {
      this.gameSetting.handCards[cardIndex].cardStatus = pickStatus;
    }
  }

  fillCardEvent(cardId: number) {
    this.updateGameSetting({
      remainCardCount: this.gameSetting.remainCardCount - 1,
    });
  }

  discardHandCards(cardId: number) {
    this.gameSetting.handCards = this.gameSetting.handCards.map((card) => {
      if (card.id === cardId) {
        return { ...card, cardStatus: CardStatus.Pop };
      }
      return card;
    });
  }

  getSocreCardIdInPopedCards() {
    const popCards = this.gameSetting.handCards.filter(
      (card) => card.cardStatus === CardStatus.Pop
    );
    const popCardsSoryByWeight = popCards.sort(
      (a, b) => a.flowerId - b.flowerId
    );

    let scoreCards: number[] = [];
    let scoreType: ScoreTypes;
    let rowCount = 1;
    let pairCount = [1, 1];
    let pairFlowerId = [-1, -1];
    let pairCountIndex = 0;
    let beforeVal = -2;
    const firstCardSuit = popCards[0].cardFlower;
    let sameSuit = true;

    popCardsSoryByWeight.forEach((card) => {
      if (card.flowerId - beforeVal === 1) {
        rowCount++;
      } else {
        rowCount = 1;
      }

      if (card.flowerId === beforeVal) {
        pairCount[pairCountIndex]++;
      } else {
        if (pairCount[pairCountIndex] >= 2) {
          pairCountIndex++;
        }
      }

      if (pairCount[pairCountIndex] >= 2) {
        pairFlowerId[pairCountIndex] = card.flowerId;
      }

      if (firstCardSuit !== card.cardFlower) {
        sameSuit = false;
      }
      beforeVal = card.flowerId;
    });

    if (rowCount === 5 && sameSuit) {
      scoreType = ScoreTypes.StraightFlush;
      popCards.forEach((card) => scoreCards.push(card.id));
    } else if (rowCount === 5 && !sameSuit) {
      scoreType = ScoreTypes.Straight;
      popCards.forEach((card) => scoreCards.push(card.id));
    } else if (pairCount[0] === 4) {
      scoreType = ScoreTypes.FourOfAKind;
    } else if (
      (pairCount[0] === 3 && pairCount[1] === 2) ||
      (pairCount[0] === 2 && pairCount[1] === 3)
    ) {
      scoreType = ScoreTypes.FullHouse;
    } else if (sameSuit && popCards.length === 5) {
      scoreType = ScoreTypes.Flush;
      popCards.forEach((card) => scoreCards.push(card.id));
    } else if (pairCount[0] === 3) {
      scoreType = ScoreTypes.ThreeOfAKind;
    } else if (pairCount[0] === 2 && pairCount[1] === 2) {
      scoreType = ScoreTypes.TwoPair;
    } else if (pairCount[0] === 2) {
      scoreType = ScoreTypes.Pair;
    } else {
      scoreType = ScoreTypes.HighCard;
      scoreCards.push(popCardsSoryByWeight[0].id);
    }

    if (
      scoreType === ScoreTypes.FourOfAKind ||
      scoreType === ScoreTypes.FullHouse ||
      scoreType === ScoreTypes.ThreeOfAKind ||
      scoreType === ScoreTypes.TwoPair ||
      scoreType === ScoreTypes.Pair
    ) {
      popCards
        .filter(
          (card) =>
            card.flowerId === pairFlowerId[0] ||
            card.flowerId === pairFlowerId[1]
        )
        .forEach((card) => {
          scoreCards.push(card.id);
        });
    }
    console.log({ popCards, scoreCards, scoreType });
    return { scoreCards, scoreType };
  }

  removePopedCards() {
    const handCards = this.gameSetting.handCards;
    const updatedHandCards: CardObject[] = [];
    handCards.forEach((card) => {
      if (card.cardStatus !== CardStatus.Pop) {
        updatedHandCards.push(card);
      }
    });
    this.updateGameSetting({ handCards: updatedHandCards });
  }
}
