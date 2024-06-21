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
  cardPopDistance,
  gameSpeed,
  maxCardForOneRow,
  scoreRule,
} from "./Constant";
import GameManager from "./GameManager";
import ModelManager from "./ModelManager";
import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";
import Card from "./ui/Card";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
  public static instance: UIManager = null;

  @property(cc.Prefab)
  startOptionDialog: cc.Prefab;

  @property(cc.Prefab)
  blindSelectGroup: cc.Prefab;

  @property(cc.Label)
  scoreValue: cc.Label;

  @property(cc.Label)
  multiValue1: cc.Label;

  @property(cc.Label)
  multiValue2: cc.Label;

  @property(cc.Label)
  handsValue: cc.Label;

  @property(cc.Label)
  discardsValue: cc.Label;

  @property(cc.Label)
  cashValue: cc.Label;

  @property(cc.Label)
  anteValue: cc.Label;

  @property(cc.Label)
  anteTotal: cc.Label;

  @property(cc.Label)
  roundValue: cc.Label;

  @property(cc.Label)
  totalCardsCount: cc.Label;

  @property(cc.Label)
  remainCardsCount: cc.Label;

  @property(cc.Node)
  handCardsPanel: cc.Node;

  @property(cc.Prefab)
  card: cc.Prefab;

  @property(cc.Node)
  cardsGroup: cc.Node;

  @property(cc.Node)
  backCard: cc.Node;

  @property(cc.Node)
  previewCardsGroup: cc.Node;

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    UIManager.instance = this;
    console.log("uimanager loaded");
  }

  start() {
    uiManager.instance.showDialog("BlindSelectGroup", this.blindSelectGroup);
    GameManager._instance.roundInit();
    this.changeGameValues(GameManager._instance.gameSetting);
  }

  protected onEnable(): void {}

  public showStartOptionDialog() {
    uiManager.instance.showDialog("StartOption", this.startOptionDialog);
  }

  public changeGameValues(gameSetting: GameSetting) {
    gameSetting.score &&
      (this.scoreValue.string = gameSetting.score.toString());
    gameSetting.multi1 &&
      (this.multiValue1.string = gameSetting.multi1.toString());
    gameSetting.multi2 &&
      (this.multiValue2.string = gameSetting.multi2.toString());
    gameSetting.hands &&
      (this.handsValue.string = gameSetting.hands.toString());
    gameSetting.discards &&
      (this.discardsValue.string = gameSetting.discards.toString());
    gameSetting.cash && (this.cashValue.string = gameSetting.cash.toString());
    gameSetting.ante && (this.anteValue.string = gameSetting.ante.toString());
    gameSetting.totalAnte &&
      (this.anteTotal.string = gameSetting.totalAnte.toString());
    gameSetting.totalCardCount &&
      (this.totalCardsCount.string = gameSetting.totalCardCount.toString());
    gameSetting.remainCardCount &&
      (this.remainCardsCount.string = gameSetting.remainCardCount.toString());
  }

  public fillCards(newFilledCards: CardObject[]) {
    for (let i = 0; i < newFilledCards.length; i++) {
      const card = newFilledCards[i];
      if (card) {
        const newCard = cc.instantiate(this.card);
        newCard.getComponent(Card).setCardInfo(card);

        const backCardWorldPos = this.backCard.convertToWorldSpaceAR(
          cc.v2(0, 0)
        );
        const initialPos =
          this.cardsGroup.convertToNodeSpaceAR(backCardWorldPos);
        newCard.setPosition(initialPos);
        this.cardsGroup.addChild(newCard);

        const targetLocalPos = cc.v2(
          i * (this.cardsGroup.width / 8) +
            newCard.width / 2 -
            this.cardsGroup.width / 2,
          0
        );
        const targetWorldPos =
          this.cardsGroup.convertToWorldSpaceAR(targetLocalPos);

        cc.tween(newCard)
          .delay((i * 0.1) / gameSpeed)
          .to(0.3 / gameSpeed, {
            position: cc.v3(
              this.cardsGroup.convertToNodeSpaceAR(targetWorldPos).x,
              this.cardsGroup.convertToNodeSpaceAR(targetWorldPos).y,
              0
            ),
          })
          .call(() => {
            clientEvent.dispatchEvent("fillCardEvent", card.id);
          })
          .start();
      }
    }
  }

  loadImageAtlas() {
    return new Promise((resolve, reject) => {
      cc.loader.loadRes(
        "/images/TexturePacker/Sprites",
        cc.SpriteAtlas,
        function (err, imageAtlas) {
          if (err) {
            console.log("error: loading card atlas", err);
            reject(err);
            return;
          }
          console.log("Loaded end atlas successfully");
          GameManager._instance.imageAtlas = imageAtlas;
          resolve();
        }
      );
    });
  }

  // update (dt) {}

  HandButtonClick() {
    const handCards = GameManager._instance.gameSetting.handCards;
    if (handCards.length === 0) return;

    const pickCardCount = ModelManager._instance.getHandCardsCountByStatus(
      CardStatus.Pick
    );

    if (pickCardCount === 0) return;

    const cardSpacing = 10;
    const distanceUp = 80;
    const cards: cc.Node[] = this.cardsGroup.children;
    const cardWidth = cards[0].width;
    let pickedCount = handCards.filter(
      (card) => card.cardStatus === CardStatus.Pick
    ).length;
    let pickedIndex = 0;
    let popEndIndex = 0;

    const cardsGroupMoveTime = 0.1;
    const delayTimeAferGroupMove = 0.8;
    const durationTime = 0.2;

    const handPanelLPos = this.handCardsPanel.getPosition();

    // when click hand button, group moves downward
    cc.tween(this.handCardsPanel)
      .to(cardsGroupMoveTime / gameSpeed, {
        position: cc.v3(handPanelLPos.x, handPanelLPos.y - distanceUp, 0),
      })
      .call(() => {
        const firstPosX =
          (cardWidth * pickedCount + cardSpacing * (pickedCount - 1)) / 2 -
          cardWidth / 2;
        handCards.forEach((card, index) => {
          if (card.cardStatus === CardStatus.Pick) {
            const targetWPos =
              this.previewCardsGroup.parent.convertToWorldSpaceAR(
                this.previewCardsGroup.getPosition()
              );

            const newPos = this.cardsGroup.convertToNodeSpaceAR(targetWPos);

            // hand cards are poped after group moving
            cc.tween(cards[index])
              .delay(
                (pickedIndex * durationTime + delayTimeAferGroupMove) /
                  gameSpeed
              )
              .call(() => {
                GameManager._instance.discardHandCards(card.id);
                this.arrangeHandCards();
              })
              .to(0.2 / gameSpeed, {
                position: cc.v3(
                  newPos.x -
                    firstPosX +
                    pickedIndex * (cardWidth + cardSpacing),
                  newPos.y,
                  0
                ),
              })
              .call(() => {
                popEndIndex++;
                if (popEndIndex === pickCardCount) {
                  // find and move the pair cards
                  this.moveScoreCards();
                }
              })
              .start();

            pickedIndex++;
          }
        });
      })
      .start();
  }

  arrangeHandCards() {
    const count = ModelManager._instance.getHandCardsCount();
    const handCards = GameManager._instance.gameSetting.handCards;
    const cardsNode = this.cardsGroup.children;
    const groupWidth = this.cardsGroup.width;
    const dis = 50;

    let availableIndex = 0;
    handCards.forEach((card, index) => {
      if (
        card.cardStatus === CardStatus.Initial ||
        card.cardStatus === CardStatus.Pick ||
        !card.cardStatus
      ) {
        cc.tween(cardsNode[index])
          .to(0.1 / gameSpeed, {
            position: cc.v3(
              availableIndex * dis -
                (dis * (count - 1)) / 2 +
                cardsNode[index].width / 2,
              card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
              0
            ),
          })
          .call(() => {})
          .start();
        availableIndex++;
      }
    });
  }

  moveScoreCards() {
    const { scoreCards, scoreType } =
      GameManager._instance.getSocreCardIdInPopedCards();

    const handCards = GameManager._instance.gameSetting.handCards;
    const cards: cc.Node[] = this.cardsGroup.children;
    let realIndex = 0;

    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const id = scoreCards.find((score) => score === card.id);
      if (id !== undefined) {
        const pos = cards[index].getPosition();
        cc.tween(cards[index])
          .delay(0.5 + realIndex * 0.05)
          .to(0.1 / gameSpeed, {
            position: cc.v3(pos.x, pos.y + 50, 0),
          })
          .start();
        realIndex++;
      }
    });
    realIndex = 0;

    const multi1 =
      scoreRule[scoreType][
        GameManager._instance.gameSetting.scoreLevel[scoreType]
      ].multi1;
    const multi2 =
      scoreRule[scoreType][
        GameManager._instance.gameSetting.scoreLevel[scoreType]
      ].multi2;
    this.multiValue1.string = multi1.toString();
    this.multiValue2.string = multi2.toString();
    GameManager._instance.updateGameSetting({
      multi1,
      multi2,
    });

    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const id = scoreCards.find((score) => score === card.id);
      if (id !== undefined) {
        cc.tween(cards[index])
          .delay(1.5 + scoreCards.length * 0.05 + realIndex * 1)
          .to(0.1 / gameSpeed, {
            scale: 1.3,
          })
          .to(0.1 / gameSpeed, {
            scale: 1,
          })
          .call(() => {
            const updatedMulti1 =
              card.value + GameManager._instance.gameSetting.multi1;
            GameManager._instance.updateGameSetting({
              multi1: updatedMulti1,
            });
            this.multiValue1.string = updatedMulti1.toString();
          })
          .start();
        realIndex++;
      }
    });

    realIndex = 0;
    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const id = scoreCards.find((score) => score === card.id);
      if (id !== undefined) {
        const pos = cards[index].getPosition();
        cc.tween(cards[index])
          .delay(1.5 + scoreCards.length * 1.05 + realIndex * 0.05)
          .to(0.1 / gameSpeed, {
            position: cc.v3(pos.x, pos.y, 0),
          })
          .start();
        realIndex++;
      }
    });

    // move the poped cards to the right after ending
    realIndex = 0;
    handCards.reverse().forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const pos = cards[handCards.length - index - 1].getPosition();
      cc.tween(cards[handCards.length - index - 1])
        .delay(2 + scoreCards.length * 1.1 + realIndex * 0.05)
        .to(0.5 / gameSpeed, {
          position: cc.v3(pos.x + 1000, pos.y, 0),
        })
        .call(() => {})
        .start();
      realIndex++;
    });

    const handPanelLPos = this.handCardsPanel.getPosition();

    // when click hand button, group moves downward
    cc.tween(this.handCardsPanel)
      .delay(3 + scoreCards.length * 1.15)
      .to(0.1 / gameSpeed, {
        position: cc.v3(handPanelLPos.x, handPanelLPos.y + 80, 0),
      })
      .call(() => {
        GameManager._instance.removePopedCards();
        // GameManager._instance.fillCards();
      })
      .start();
  }

  DiscardButtonClick() {}
}
