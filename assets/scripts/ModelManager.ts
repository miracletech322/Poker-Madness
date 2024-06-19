// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Card, CardFlower, maxCardForOneRow } from "./Constant";
import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ModelManager extends cc.Component {
  public static _instance: ModelManager;

  protected onLoad(): void {
    ModelManager._instance = this;
    console.log("Modelmanager loaded");
  }

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}

  public initialCards(): Card[] {
    return [
      {
        id: 0,
        symbol: "A",
        value: 11,
        cardFlower: CardFlower.Spade,
        flowerId: 0,
      },
      {
        id: 1,
        symbol: "K",
        value: 10,
        cardFlower: CardFlower.Spade,
        flowerId: 1,
      },
      {
        id: 2,
        symbol: "Q",
        value: 10,
        cardFlower: CardFlower.Spade,
        flowerId: 2,
      },
      {
        id: 3,
        symbol: "J",
        value: 10,
        cardFlower: CardFlower.Spade,
        flowerId: 3,
      },
      {
        id: 4,
        symbol: "10",
        value: 10,
        cardFlower: CardFlower.Spade,
        flowerId: 4,
      },
      {
        id: 5,
        symbol: "9",
        value: 9,
        cardFlower: CardFlower.Spade,
        flowerId: 5,
      },
      {
        id: 6,
        symbol: "8",
        value: 8,
        cardFlower: CardFlower.Spade,
        flowerId: 6,
      },
      {
        id: 7,
        symbol: "7",
        value: 7,
        cardFlower: CardFlower.Spade,
        flowerId: 7,
      },
      {
        id: 8,
        symbol: "6",
        value: 6,
        cardFlower: CardFlower.Spade,
        flowerId: 8,
      },
      {
        id: 9,
        symbol: "5",
        value: 5,
        cardFlower: CardFlower.Spade,
        flowerId: 9,
      },
      {
        id: 10,
        symbol: "4",
        value: 4,
        cardFlower: CardFlower.Spade,
        flowerId: 10,
      },
      {
        id: 11,
        symbol: "3",
        value: 3,
        cardFlower: CardFlower.Spade,
        flowerId: 11,
      },
      {
        id: 12,
        symbol: "2",
        value: 2,
        cardFlower: CardFlower.Spade,
        flowerId: 12,
      },
      {
        id: 13,
        symbol: "A",
        value: 11,
        cardFlower: CardFlower.Heart,
        flowerId: 0,
      },
      {
        id: 14,
        symbol: "K",
        value: 10,
        cardFlower: CardFlower.Heart,
        flowerId: 1,
      },
      {
        id: 15,
        symbol: "Q",
        value: 10,
        cardFlower: CardFlower.Heart,
        flowerId: 2,
      },
      {
        id: 16,
        symbol: "J",
        value: 10,
        cardFlower: CardFlower.Heart,
        flowerId: 3,
      },
      {
        id: 17,
        symbol: "10",
        value: 10,
        cardFlower: CardFlower.Heart,
        flowerId: 4,
      },
      {
        id: 18,
        symbol: "9",
        value: 9,
        cardFlower: CardFlower.Heart,
        flowerId: 5,
      },
      {
        id: 19,
        symbol: "8",
        value: 8,
        cardFlower: CardFlower.Heart,
        flowerId: 6,
      },
      {
        id: 20,
        symbol: "7",
        value: 7,
        cardFlower: CardFlower.Heart,
        flowerId: 7,
      },
      {
        id: 21,
        symbol: "6",
        value: 6,
        cardFlower: CardFlower.Heart,
        flowerId: 8,
      },
      {
        id: 22,
        symbol: "5",
        value: 5,
        cardFlower: CardFlower.Heart,
        flowerId: 9,
      },
      {
        id: 23,
        symbol: "4",
        value: 4,
        cardFlower: CardFlower.Heart,
        flowerId: 10,
      },
      {
        id: 24,
        symbol: "3",
        value: 3,
        cardFlower: CardFlower.Heart,
        flowerId: 11,
      },
      {
        id: 25,
        symbol: "2",
        value: 2,
        cardFlower: CardFlower.Heart,
        flowerId: 12,
      },
      {
        id: 26,
        symbol: "A",
        value: 11,
        cardFlower: CardFlower.Cube,
        flowerId: 0,
      },
      {
        id: 27,
        symbol: "K",
        value: 10,
        cardFlower: CardFlower.Cube,
        flowerId: 1,
      },
      {
        id: 28,
        symbol: "Q",
        value: 10,
        cardFlower: CardFlower.Cube,
        flowerId: 2,
      },
      {
        id: 29,
        symbol: "J",
        value: 10,
        cardFlower: CardFlower.Cube,
        flowerId: 3,
      },
      {
        id: 30,
        symbol: "10",
        value: 10,
        cardFlower: CardFlower.Cube,
        flowerId: 4,
      },
      {
        id: 31,
        symbol: "9",
        value: 9,
        cardFlower: CardFlower.Cube,
        flowerId: 5,
      },
      {
        id: 32,
        symbol: "8",
        value: 8,
        cardFlower: CardFlower.Cube,
        flowerId: 6,
      },
      {
        id: 33,
        symbol: "7",
        value: 7,
        cardFlower: CardFlower.Cube,
        flowerId: 7,
      },
      {
        id: 34,
        symbol: "6",
        value: 6,
        cardFlower: CardFlower.Cube,
        flowerId: 8,
      },
      {
        id: 35,
        symbol: "5",
        value: 5,
        cardFlower: CardFlower.Cube,
        flowerId: 9,
      },
      {
        id: 36,
        symbol: "4",
        value: 4,
        cardFlower: CardFlower.Cube,
        flowerId: 10,
      },
      {
        id: 37,
        symbol: "3",
        value: 3,
        cardFlower: CardFlower.Cube,
        flowerId: 11,
      },
      {
        id: 38,
        symbol: "2",
        value: 2,
        cardFlower: CardFlower.Cube,
        flowerId: 12,
      },
      {
        id: 39,
        symbol: "A",
        value: 11,
        cardFlower: CardFlower.Diamond,
        flowerId: 0,
      },
      {
        id: 40,
        symbol: "K",
        value: 10,
        cardFlower: CardFlower.Diamond,
        flowerId: 1,
      },
      {
        id: 41,
        symbol: "Q",
        value: 10,
        cardFlower: CardFlower.Diamond,
        flowerId: 2,
      },
      {
        id: 42,
        symbol: "J",
        value: 10,
        cardFlower: CardFlower.Diamond,
        flowerId: 3,
      },
      {
        id: 43,
        symbol: "10",
        value: 10,
        cardFlower: CardFlower.Diamond,
        flowerId: 4,
      },
      {
        id: 44,
        symbol: "9",
        value: 9,
        cardFlower: CardFlower.Diamond,
        flowerId: 5,
      },
      {
        id: 45,
        symbol: "8",
        value: 8,
        cardFlower: CardFlower.Diamond,
        flowerId: 6,
      },
      {
        id: 46,
        symbol: "7",
        value: 7,
        cardFlower: CardFlower.Diamond,
        flowerId: 7,
      },
      {
        id: 47,
        symbol: "6",
        value: 6,
        cardFlower: CardFlower.Diamond,
        flowerId: 8,
      },
      {
        id: 48,
        symbol: "5",
        value: 5,
        cardFlower: CardFlower.Diamond,
        flowerId: 9,
      },
      {
        id: 49,
        symbol: "4",
        value: 4,
        cardFlower: CardFlower.Diamond,
        flowerId: 10,
      },
      {
        id: 50,
        symbol: "3",
        value: 3,
        cardFlower: CardFlower.Diamond,
        flowerId: 11,
      },
      {
        id: 51,
        symbol: "2",
        value: 2,
        cardFlower: CardFlower.Diamond,
        flowerId: 12,
      },
    ];
  }

  public randomSortCards() {
    const initialCards = ModelManager._instance.initialCards();
    const totalCardCount = GameManager._instance.gameSetting.totalCardCount;
    let flag: boolean[] = [];
    for (let i = 0; i < totalCardCount; i++) {
      const random = ModelManager._instance.getRandomNumber(
        0,
        totalCardCount - 1
      );
      if (flag[random]) {
        if ((i + 1) % totalCardCount === 0) {
          flag = flag.map((value) => false);
        } else {
          i--;
          continue;
        }
      }
      flag[random] = true;
      GameManager._instance.gameSetting.newCards.push(initialCards[random]);
    }
  }

  public getRandomNumber(min: number, max: number): number {
    if (min > max) {
      return -1;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getHandCardsIfLowNumber() {
    const newCards = GameManager._instance.gameSetting.newCards;
    const handCards = GameManager._instance.gameSetting.handCards;
    const handCardsCount =
      GameManager._instance.gameSetting.remainHandCardsCount;
    if (maxCardForOneRow > handCardsCount) {
      while (true) {
        if (handCards.length === maxCardForOneRow || newCards.length === 0)
          break;
        handCards.push(newCards.shift());
      }
    }
    return { newCards, handCards };
  }
}
