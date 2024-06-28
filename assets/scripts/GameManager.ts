// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import {
  CardObject,
  CardStatus,
  Direction,
  GameProgress,
  GameSetting,
  RoundFinishTypes,
  ScoreTypes,
  SortTypes,
  roundScore,
} from "./Constant";
import Global from "./Global";
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
    console.log("GameManager loaded");
  }

  start() {}

  // update (dt) {}

  protected onEnable(): void {
    clientEvent.on("cardStatusEvent", this.cardStatusEvent, this);
    clientEvent.on("roundStartedEvent", this.roundStartedEvent, this);
    clientEvent.on("cardHoverEvent", this.showCardTooltip, this);
  }

  protected onDisable(): void {
    clientEvent.off("cardStatusEvent", this.cardStatusEvent, this);
    clientEvent.off("roundStartedEvent", this.roundStartedEvent, this);
    clientEvent.off("cardHoverEvent", this.showCardTooltip, this);
  }

  public roundInit() {
    this.gameSetting = {
      gameStart: false,
      round: 0,
      maxCountForHandCards: 8,
      gameProgress: GameProgress.Init,
      totalCardCount: 52,
      remainCardCount: 52,
      score: 0,
      reachingScore: 0,
      multi1: 0,
      multi2: 0,
      scoreType: null,
      hands: 4,
      discards: 4,
      cash: 5,
      ante: 1,
      totalAnte: 8,
      newCards: [],
      handCards: [],
      scoreLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      sortType: SortTypes.Rank,
    };
  }

  public updateGameSetting(newValue: GameSetting) {
    this.gameSetting = { ...this.gameSetting, ...newValue };
    UIManager.instance.changeGameValues(this.gameSetting);
  }

  public roundStartedEvent() {
    this.updateGameSetting({
      gameStart: true,
      round: this.gameSetting.round + 1,
      gameProgress: GameProgress.Init,
      totalCardCount: 52,
      remainCardCount: 52,
      score: 0,
      reachingScore: roundScore[this.gameSetting.round],
      multi1: 0,
      multi2: 0,
      scoreType: null,
      hands: 4,
      discards: 4,
      ante: this.gameSetting.ante,
      totalAnte: this.gameSetting.totalAnte,
      newCards: [],
      handCards: [],
      scoreLevel: [...this.gameSetting.scoreLevel],
      sortType: this.gameSetting.sortType,
    });
    ModelManager._instance.randomSortCards();
    UIManager.instance.hideBlindSelectModals();
    this.fillCards();
  }

  public fillCards() {
    const newCards = this.gameSetting.newCards;
    const handCards = this.gameSetting.handCards;
    const newFilledCards: CardObject[] = [];
    while (true) {
      if (
        handCards.length + newFilledCards.length ===
          this.gameSetting.maxCountForHandCards ||
        newCards.length === 0
      )
        break;
      const newCard = newCards.shift();
      newFilledCards.push(newCard);
    }
    UIManager.instance.fillCards(newFilledCards);
  }

  public addCardGroup(card: CardObject) {
    card.cardStatus = CardStatus.Initial;
    this.gameSetting.handCards.push(card);
  }

  public updateArrangeForHandCards() {
    let handCards = this.gameSetting.handCards;
    const sortType = this.gameSetting.sortType;

    if (sortType === SortTypes.Rank) {
      handCards.sort((card1, card2) => card1.flowerId - card2.flowerId);
    } else if (sortType === SortTypes.Suit) {
      handCards.sort((card1, card2) => card1.flowerId - card2.flowerId);
      handCards.sort((card1, card2) => card1.cardFlower - card2.cardFlower);
    }
    this.gameSetting.handCards = [...handCards];
  }

  public cardStatusEvent([pickStatus, cardId]: [CardStatus, number]) {
    const cardIndex = this.gameSetting.handCards.findIndex(
      (card) => card.id === cardId
    );
    if (cardIndex !== -1) {
      this.gameSetting.handCards[cardIndex].cardStatus = pickStatus;
    }

    UIManager.instance.displayMultiInfo();
  }

  public discardHandCards(cardId: number) {
    this.gameSetting.handCards = this.gameSetting.handCards.map((card) => {
      if (card.id === cardId) {
        return { ...card, cardStatus: CardStatus.Pop };
      }
      return card;
    });
  }

  public getSocreCardIdInPopedCards(cardStatus: CardStatus) {
    const popCards = this.gameSetting.handCards.filter(
      (card) => card.cardStatus === cardStatus
    );
    let scoreCards: number[] = [];
    let scoreType: ScoreTypes;

    if (popCards.length === 0) return { scoreCards, scoreType };

    const popCardsSoryByWeight = popCards.sort(
      (a, b) => a.flowerId - b.flowerId
    );

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
    console.log({ scoreCards, scoreType });
    return { scoreCards, scoreType };
  }

  public removePopedCards() {
    const handCards = this.gameSetting.handCards;
    const updatedHandCards: CardObject[] = [];
    handCards.forEach((card) => {
      if (card.cardStatus !== CardStatus.Pop) {
        updatedHandCards.push(card);
      }
    });
    this.updateGameSetting({ handCards: updatedHandCards });
  }

  public updateScore() {
    const score =
      GameManager._instance.gameSetting.multi1 *
      GameManager._instance.gameSetting.multi2;
    this.updateGameSetting({
      multi1: 0,
      multi2: 0,
      scoreType: null,
    });
    UIManager.instance.updateScore(score);
  }

  public getUpdatedCardWhenDragging(
    updatedCard: CardObject[],
    oriIndex: number,
    updateIndex: number
  ): CardObject[] {
    let res: CardObject[] = [];
    res = [
      ...updatedCard.slice(0, oriIndex),
      ...updatedCard.slice(oriIndex + 1),
    ];
    res.splice(updateIndex, 0, updatedCard[oriIndex]);
    return res;
  }

  public rankSortHandle() {
    this.updateGameSetting({
      sortType: SortTypes.Rank,
    });
    UIManager.instance.rankSortHandle();
  }

  public suitSortHandle() {
    this.updateGameSetting({
      sortType: SortTypes.Suit,
    });
    UIManager.instance.suitSortHandle();
  }

  public showCardTooltip([cardId, status]: [number, boolean]) {
    const handCards = this.gameSetting.handCards;
    const index = handCards.findIndex((card) => card.id === cardId);
    UIManager.instance.showCardTooltip(handCards[index], status, index);
  }

  public isFinishRound(): RoundFinishTypes {
    const score = this.gameSetting.score;
    const round = this.gameSetting.round;
    if (score >= roundScore[round - 1]) {
      return RoundFinishTypes.Success;
    }
    const hands = this.gameSetting.hands;
    if (hands === 0) {
      return RoundFinishTypes.Failed;
    }

    return RoundFinishTypes.None;
  }

  public showDeckModal() {
    const cards = this.gameSetting.newCards;
    let numberCount: number[] = new Array(13).fill(0);
    let suitCount: number[] = new Array(4).fill(0);
    let count: number[][] = Array.from({ length: 4 }, () =>
      new Array(13).fill(0)
    );

    cards.forEach((card) => {
      numberCount[card.flowerId]++;
      suitCount[card.cardFlower]++;
      count[card.cardFlower][card.flowerId]++;
    });

    clientEvent.dispatchEvent("getDeckInfoEvent", [
      numberCount,
      suitCount,
      count,
    ]);
  }

  public getRemainCardInfo() {
    const cards = this.gameSetting.newCards;
    let numberCount: number[] = new Array(13).fill(0);
    let suitCount: number[] = new Array(4).fill(0);
    let count: number[][] = Array.from({ length: 4 }, () =>
      new Array(13).fill(0)
    );

    cards.forEach((card) => {
      numberCount[card.flowerId]++;
      suitCount[card.cardFlower]++;
      count[card.cardFlower][card.flowerId]++;
    });

    return { numberCount, count };
  }
}
