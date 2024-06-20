// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CardObject, GameSetting, maxCardForOneRow } from "./Constant";
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
          i * (this.cardsGroup.width / 8) + newCard.width / 2,
          0
        );
        const targetWorldPos =
          this.cardsGroup.convertToWorldSpaceAR(targetLocalPos);

        cc.tween(newCard)
          .delay(i * 0.1)
          .to(0.3, {
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

    const cards: cc.Node[] = this.cardsGroup.children;

    let pickedCount = 0;
    handCards.forEach((card, index) => {
      if (card.pickStatus) {
        pickedCount++;
        cc.tween(cards[index])
          .delay(pickedCount * 0.1)
          .to(0.2, {
            position: cc.v3(0, 20, 0),
          })
          .start();
      }
    });

    GameManager._instance.discardHandCards();
  }

  DiscardButtonClick() {}
}
