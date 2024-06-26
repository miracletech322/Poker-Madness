// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import {
  CardObject,
  CardStatus,
  GameProgress,
  GameSetting,
  RoundFinishTypes,
  SortTypes,
  cardPopDistance,
  gameSpeed,
  scoreRule,
  spacingForCard,
  suitName,
} from "./Constant";
import GameManager from "./GameManager";
import ModelManager from "./ModelManager";
import { clientEvent } from "./framework/clientEvent";
import { uiManager } from "./framework/uiManager";
import Card from "./ui/Card";
import Deck from "./ui/Deck";
import FullDeckModal from "./ui/FullDeckModal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
  public static instance: UIManager = null;

  public deckModalStatus = false;
  public cardsGroupPanelY: number;

  @property(cc.Prefab)
  startOptionDialog: cc.Prefab;

  @property(cc.Node)
  blindSelectPoint: cc.Node;

  @property(cc.Prefab)
  blindSelectDisableGroup: cc.Prefab;

  @property(cc.Prefab)
  blindSelectEnableGroup: cc.Prefab;

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

  @property(cc.Label)
  reachingScore: cc.Label;

  @property(cc.RichText)
  pockerHands: cc.RichText;

  @property(cc.Label)
  scoreText: cc.Label;

  @property(cc.Label)
  entryScore: cc.Label;

  @property(cc.Node)
  playButtonGroup: cc.Node;

  @property(cc.Node)
  cardTooltipBox: cc.Node;

  @property(cc.Label)
  cardName: cc.Label;

  @property(cc.Label)
  cardValue: cc.Label;

  @property(cc.Node)
  winnerModal: cc.Node;

  @property(cc.Node)
  loserModal: cc.Node;

  @property(cc.Node)
  deckModalNode: cc.Node;

  @property(cc.Prefab)
  deckModal: cc.Prefab;

  @property(cc.Node)
  fullDeckModalNode: cc.Node;

  @property(cc.Prefab)
  fullDeckModal: cc.Prefab;

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    UIManager.instance = this;
    const deck = cc.instantiate(this.deckModal);
    this.deckModalNode.addChild(deck);
    deck.setPosition(cc.v3(0, 0, 0));
    this.deckModalNode.active = false;

    this.cardsGroupPanelY = this.handCardsPanel.getPosition().y;
    console.log("uimanager loaded");
  }

  start() {
    this.showBlindSelect();
    GameManager._instance.roundInit();
  }

  protected onEnable(): void {
    this.backCard.on(
      cc.Node.EventType.MOUSE_ENTER,
      this.onBackCardMouseEnter,
      this
    );
    this.backCard.on(
      cc.Node.EventType.MOUSE_LEAVE,
      this.onBackCardMouseLeave,
      this
    );
    this.backCard.on(
      cc.Node.EventType.MOUSE_DOWN,
      this.showFullDeckModal,
      this
    );
    clientEvent.on("FullDeckHideEvent", this.hideFullDeckModal, this);
  }

  protected onDisable(): void {
    this.backCard.off(
      cc.Node.EventType.MOUSE_ENTER,
      this.onBackCardMouseEnter,
      this
    );
    this.backCard.off(
      cc.Node.EventType.MOUSE_LEAVE,
      this.onBackCardMouseLeave,
      this
    );
    this.backCard.off(
      cc.Node.EventType.MOUSE_DOWN,
      this.showFullDeckModal,
      this
    );
    clientEvent.off("FullDeckHideEvent", this.hideFullDeckModal, this);
  }

  public showBlindSelect() {
    GameManager._instance.roundInit();
    this.cardsGroup.removeAllChildren();

    if (this.blindSelectPoint.children.length === 0) {
      const enablePanel = cc.instantiate(this.blindSelectEnableGroup);
      const disablePanel1 = cc.instantiate(this.blindSelectDisableGroup);
      const disablePanel2 = cc.instantiate(this.blindSelectDisableGroup);
      this.blindSelectPoint.addChild(enablePanel);
      this.blindSelectPoint.addChild(disablePanel1);
      this.blindSelectPoint.addChild(disablePanel2);
    }
    const panelWidth = this.blindSelectPoint.children[0].width;
    this.blindSelectPoint.children.forEach((node, index) => {
      const posX = (panelWidth + 15) * index + panelWidth / 2;
      cc.tween(node)
        .delay((index * 0.1) / gameSpeed)
        .call(() => {
          node.setPosition(posX, -1000, 0);
        })
        .to(
          0.2 / gameSpeed,
          {
            position: cc.v3(posX, 50, 0),
          },
          {
            easing: "quadInOut",
          }
        )
        .to(0.1 / gameSpeed, {
          position: cc.v3(posX, 0, 0),
        })
        .start();
    });
  }

  public hideBlindSelectModals() {
    this.blindSelectPoint.children.forEach((node, index) => {
      console.log(index);
      const pos = node.getPosition();
      cc.tween(node)
        .delay((index * 0.1) / gameSpeed)
        .to(0.1 / gameSpeed, {
          position: cc.v3(pos.x, 50, 0),
        })
        .to(0.2 / gameSpeed, {
          position: cc.v3(pos.x, -1000, 0),
        })
        .start();
    });
  }

  public showStartOptionDialog() {
    uiManager.instance.showDialog("StartOption", this.startOptionDialog);
  }

  public changeGameValues(gameSetting: GameSetting) {
    gameSetting.score >= 0 &&
      (this.scoreValue.string = gameSetting.score.toString());
    gameSetting.multi1 >= 0 &&
      (this.multiValue1.string = gameSetting.multi1.toString());
    gameSetting.multi2 >= 0 &&
      (this.multiValue2.string = gameSetting.multi2.toString());
    gameSetting.hands >= 0 &&
      (this.handsValue.string = gameSetting.hands.toString());
    gameSetting.discards >= 0 &&
      (this.discardsValue.string = gameSetting.discards.toString());
    gameSetting.cash >= 0 &&
      (this.cashValue.string = gameSetting.cash.toString());
    gameSetting.ante >= 0 &&
      (this.anteValue.string = gameSetting.ante.toString());
    gameSetting.totalAnte >= 0 &&
      (this.anteTotal.string = gameSetting.totalAnte.toString());
    gameSetting.totalCardCount >= 0 &&
      (this.totalCardsCount.string = gameSetting.totalCardCount.toString());
    gameSetting.remainCardCount >= 0 &&
      (this.remainCardsCount.string = gameSetting.remainCardCount.toString());
    gameSetting.reachingScore >= 0 &&
      (this.reachingScore.string = gameSetting.reachingScore.toString());
    gameSetting.round >= 0 &&
      (this.roundValue.string = gameSetting.round.toString());
    if (gameSetting.scoreType !== null) {
      this.pockerHands.string = `<color=#2a2a48><size=${
        scoreRule[gameSetting.scoreType][
          GameManager._instance.gameSetting.scoreLevel[gameSetting.scoreType]
        ].size
      }>${
        scoreRule[gameSetting.scoreType][
          GameManager._instance.gameSetting.scoreLevel[gameSetting.scoreType]
        ].name
      }</size></color> <color=#ffffff><size=17>lvl.${(
        gameSetting.scoreLevel[gameSetting.scoreType] + 1
      ).toString()}</size></color>`;
      this.scoreText.node.active = true;
    } else {
      this.pockerHands.string = "";
      this.scoreText.node.active = false;
    }
  }

  public fillCards(newFilledCards: CardObject[]) {
    let fillEndIndex = 0;
    for (let i = 0; i < newFilledCards.length; i++) {
      const card = newFilledCards[i];
      const newCard = cc.instantiate(this.card);
      newCard.getComponent(Card).setCardInfo(card);

      const backCardWorldPos = this.backCard.convertToWorldSpaceAR(cc.v2(0, 0));
      const initialPos = this.cardsGroup.convertToNodeSpaceAR(backCardWorldPos);
      newCard.setPosition(initialPos);
      this.cardsGroup.addChild(newCard);

      cc.tween(newCard)
        .delay((i * 0.1 + 0.5) / gameSpeed)
        .call(() => {
          GameManager._instance.addCardGroup(card);
          this.arrangeHandCards(
            newFilledCards.length,
            i + 1,
            GameManager._instance.gameSetting.sortType
          );
          fillEndIndex++;
          if (fillEndIndex === newFilledCards.length) {
            GameManager._instance.updateGameSetting({
              gameProgress: GameProgress.Init,
            });
          }
        })
        .call(() => {
          clientEvent.dispatchEvent("fillCardEvent", card.id);
        })
        .start();
    }
  }

  // update (dt) {}

  public HandButtonClick() {
    const handCards = GameManager._instance.gameSetting.handCards;
    if (
      handCards.length === 0 ||
      GameManager._instance.gameSetting.gameStart === false
    )
      return;

    const pickCardCount = ModelManager._instance.getHandCardsCountByStatus(
      CardStatus.Pick
    );

    if (pickCardCount === 0) return;

    GameManager._instance.updateGameSetting({
      gameProgress: GameProgress.PlayingHand,
    });

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

    this.decreaseHands();

    // when click hand button, group moves downward
    cc.tween(this.handCardsPanel)
      .to(cardsGroupMoveTime / gameSpeed, {
        position: cc.v3(handPanelLPos.x, handPanelLPos.y - distanceUp, 0),
      })
      .call(() => {
        this.playButtonGroup.active = false;

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
                this.arrangeHandCards(-1, 0, SortTypes.None);
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

  public discardButtonClick() {
    if (GameManager._instance.gameSetting.discards <= 0) return;

    const handCards = GameManager._instance.gameSetting.handCards;
    GameManager._instance.updateGameSetting({
      gameProgress: GameProgress.PlayingHand,
    });
    if (handCards.length === 0) return;

    const pickCardCount = ModelManager._instance.getHandCardsCountByStatus(
      CardStatus.Pick
    );
    if (pickCardCount === 0) return;

    const cardNodes = this.cardsGroup.children;
    const cardWidth = cardNodes[0].width;

    this.decreaseDiscards();

    let pickIndex = 0;
    let callIndex = 0;
    handCards.forEach((card, index) => {
      if (card.cardStatus === CardStatus.Pick) {
        const pos = cardNodes[index].getPosition();

        cc.tween(cardNodes[index])
          .delay((pickIndex * 0.2 + 0.5) / gameSpeed)
          .call(() => {
            GameManager._instance.discardHandCards(card.id);
            this.arrangeHandCards(-1, 0, SortTypes.None);
          })
          .to(0.2 / gameSpeed, {
            position: cc.v3(pos.x + 1000, pos.y, 0),
          })
          .call(() => {
            callIndex++;
            if (pickCardCount === callIndex) {
              this.removePopedCards();
            }
          })
          .start();

        pickIndex++;
      }
    });
  }

  public rankSortHandle() {
    GameManager._instance.updateGameSetting({
      sortType: SortTypes.Rank,
    });
    this.arrangeHandCards(0, 0, GameManager._instance.gameSetting.sortType);
  }

  public suitSortHandle() {
    GameManager._instance.updateGameSetting({
      sortType: SortTypes.Suit,
    });
    this.arrangeHandCards(0, 0, GameManager._instance.gameSetting.sortType);
  }

  public arrangeHandCards(
    totalCount: number,
    cardIndex: number,
    sortType: SortTypes
  ) {
    const count = ModelManager._instance.getHandCardsCount();
    const handCards = GameManager._instance.gameSetting.handCards;
    const cardsNode = this.cardsGroup.children;

    let sortHandsCards = [...handCards];

    if (sortType === SortTypes.Rank) {
      sortHandsCards.sort((card1, card2) => card1.flowerId - card2.flowerId);
    } else if (sortType === SortTypes.Suit) {
      sortHandsCards.sort((card1, card2) => card1.flowerId - card2.flowerId);
      sortHandsCards.sort(
        (card1, card2) => card1.cardFlower - card2.cardFlower
      );
    }

    let availableIndex = 0;
    sortHandsCards.forEach((card, index) => {
      if (
        card.cardStatus === CardStatus.Initial ||
        card.cardStatus === CardStatus.Pick ||
        !card.cardStatus
      ) {
        const handCardIndex = handCards.findIndex(
          (temp) => temp.id === card.id
        );
        cc.tween(cardsNode[handCardIndex])
          .to(0.1 / gameSpeed, {
            position: cc.v3(
              availableIndex * spacingForCard -
                (spacingForCard * (count - 1)) / 2 +
                cardsNode[handCardIndex].width / 2,
              card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
              0
            ),
          })
          .call(() => {
            if (totalCount === cardIndex) {
              this.cardsGroup.removeAllChildren();
              sortHandsCards.forEach((card, index) => {
                const newCard = cc.instantiate(this.card);
                newCard.getComponent(Card).setCardInfo(card);
                newCard.setPosition(
                  cc.v3(
                    index * spacingForCard -
                      (spacingForCard * (count - 1)) / 2 +
                      newCard.width / 2,
                    card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
                    0
                  )
                );
                this.cardsGroup.addChild(newCard);
              });
              GameManager._instance.updateArrangeForHandCards();
            }
          })
          .start();

        availableIndex++;
      }
    });
  }

  public arrangeHandCardsAfterDragging(updatedCards: CardObject[]) {
    const cardsNode = this.cardsGroup.children;
    let availableIndex = 0;
    let callIndex = 0;
    const handCards = GameManager._instance.gameSetting.handCards;
    updatedCards.forEach((card, index) => {
      if (
        card.cardStatus === CardStatus.Initial ||
        card.cardStatus === CardStatus.Pick ||
        !card.cardStatus
      ) {
        const handCardIndex = handCards.findIndex(
          (temp) => temp.id === card.id
        );
        cc.tween(cardsNode[handCardIndex])
          .to(0.1 / gameSpeed, {
            position: cc.v3(
              availableIndex * spacingForCard -
                (spacingForCard * (handCards.length - 1)) / 2 +
                cardsNode[handCardIndex].width / 2,
              card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
              0
            ),
          })
          .call(() => {
            callIndex++;
            if (handCards.length === callIndex) {
              this.cardsGroup.removeAllChildren();
              updatedCards.forEach((card, index) => {
                const newCard = cc.instantiate(this.card);
                newCard.getComponent(Card).setCardInfo(card);
                newCard.setPosition(
                  cc.v3(
                    index * spacingForCard -
                      (spacingForCard * (updatedCards.length - 1)) / 2 +
                      newCard.width / 2,
                    card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
                    0
                  )
                );
                this.cardsGroup.addChild(newCard);
              });
              GameManager._instance.updateGameSetting({
                handCards: [...updatedCards],
              });
            }
          })
          .start();

        availableIndex++;
      }
    });
  }

  public displayMultiInfo() {
    const { scoreType } = GameManager._instance.getSocreCardIdInPopedCards(
      CardStatus.Pick
    );
    if (!scoreType) {
      GameManager._instance.updateGameSetting({
        multi1: 0,
        multi2: 0,
        scoreType: null,
      });
      return;
    }

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
      scoreType,
    });
  }

  public moveScoreCards() {
    const { scoreCards, scoreType } =
      GameManager._instance.getSocreCardIdInPopedCards(CardStatus.Pop);

    const handCards = GameManager._instance.gameSetting.handCards;
    const cards: cc.Node[] = this.cardsGroup.children;
    let realIndex = 0;

    // move up picked cards
    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const id = scoreCards.find((score) => score === card.id);
      if (id !== undefined) {
        const pos = cards[index].getPosition();
        cc.tween(cards[index])
          .delay((0.5 + realIndex * 0.05) / gameSpeed)
          .to(0.1 / gameSpeed, {
            position: cc.v3(pos.x, pos.y + 50, 0),
          })
          .start();
        realIndex++;
      }
    });
    realIndex = 0;

    // pick cards scaling
    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const id = scoreCards.find((score) => score === card.id);
      if (id !== undefined) {
        cc.tween(cards[index])
          .delay(1.5 + scoreCards.length * 0.05 + realIndex * 1)
          .to(
            0.1 / gameSpeed,
            {
              scale: 1.3,
              angle: 5,
            },
            {
              easing: "quadInOut",
            }
          )
          .to(
            0.1 / gameSpeed,
            {
              scale: 0.7,
              angle: -5,
            },
            {
              easing: "quadInOut",
            }
          )
          .to(
            0.1 / gameSpeed,
            {
              scale: 1,
              angle: 0,
            },
            {
              easing: "quadInOut",
            }
          )
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

    // after scaling, move down a bit to original pos
    realIndex = 0;
    let realCallIndex = 0;
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
          .call(() => {
            // score calcaulation
            realCallIndex++;
            if (realCallIndex === scoreCards.length) {
              GameManager._instance.updateScore();
            }
          })
          .start();
        realIndex++;
      }
    });

    // move the poped cards to the right after ending
    handCards.forEach((card, index) => {
      if (card.cardStatus !== CardStatus.Pop) return;
      const pos = cards[index].getPosition();
      cc.tween(cards[index])
        .delay((5 + scoreCards.length * 1.1 + realIndex * 0.05) / gameSpeed)
        .to(0.5 / gameSpeed, {
          position: cc.v3(pos.x + 1000, pos.y, 0),
        })
        .call(() => {})
        .start();
      realIndex--;
    });

    const handPanelLPos = this.handCardsPanel.getPosition();

    // group moves to original pos
    cc.tween(this.handCardsPanel)
      .delay((6 + scoreCards.length * 1.15) / gameSpeed)
      .to(0.1 / gameSpeed, {
        position: cc.v3(handPanelLPos.x, handPanelLPos.y + 80, 0),
      })
      .call(() => {
        this.playButtonGroup.active = true;
        this.removePopedCards();
      })
      .start();
  }

  public removePopedCards() {
    const cardNodes = this.cardsGroup.children;
    const handleCards = GameManager._instance.gameSetting.handCards;
    const nodesToDestroy = [];
    handleCards.forEach((card, index) => {
      if (card.cardStatus === CardStatus.Pop) {
        nodesToDestroy.push(cardNodes[index]);
      }
    });

    nodesToDestroy.forEach((node) => {
      if (node && node.isValid) {
        node.removeFromParent();
        node.destroy();
      }
    });

    GameManager._instance.removePopedCards();

    this.determineRoundFinish();
  }

  public updateScore(score: number) {
    this.entryScore.string = score.toString();
    let tempScore = score;
    const step = Math.floor(score / 10 < 1 ? score : 10);
    const per = Math.floor(score / step) < 1 ? 1 : Math.floor(score / step) + 1;
    cc.tween(this.entryScore.node)
      .delay(1 / gameSpeed)
      .to(0.1 / gameSpeed, {
        scale: 2,
      })
      .to(0.1 / gameSpeed, {
        scale: 1,
      })
      .call(() => {})
      .start();
    for (let i = 0; i < step; i++) {
      cc.tween(this.entryScore)
        .delay((2 + i * 0.08) / gameSpeed)
        .call(() => {
          tempScore -= per;
          let val = per;
          if (tempScore < 0) {
            val += tempScore;
            tempScore = 0;
          }
          this.entryScore.string = tempScore !== 0 ? tempScore.toString() : "";
          GameManager._instance.updateGameSetting({
            score: GameManager._instance.gameSetting.score + val,
          });
        })
        .start();
    }
  }

  public decreaseHands() {
    GameManager._instance.updateGameSetting({
      hands: GameManager._instance.gameSetting.hands - 1,
    });
    cc.tween(this.handsValue.node)
      .to(0.3 / gameSpeed, {
        scale: 1.3,
      })
      .to(0.3 / gameSpeed, {
        scale: 1,
      })
      .start();
  }

  public decreaseDiscards() {
    GameManager._instance.updateGameSetting({
      discards: GameManager._instance.gameSetting.discards - 1,
    });
    cc.tween(this.discardsValue.node)
      .to(0.3 / gameSpeed, {
        scale: 1.3,
      })
      .to(0.3 / gameSpeed, {
        scale: 1,
      })
      .start();
  }

  public arrangeHandCardsWhenDragging(
    updateCards: CardObject[],
    updateCardId: number
  ) {
    const count = updateCards.length;
    const cardsNode = this.cardsGroup.children;
    const handCards = GameManager._instance.gameSetting.handCards;

    let availableIndex = 0;
    updateCards.forEach((card, index) => {
      if (card.id === updateCardId) {
        availableIndex++;
        return;
      }
      const handCardIndex = handCards.findIndex((temp) => temp.id === card.id);
      cc.tween(cardsNode[handCardIndex])
        .to(0.1 / gameSpeed, {
          position: cc.v3(
            availableIndex * spacingForCard -
              (spacingForCard * (count - 1)) / 2 +
              cardsNode[handCardIndex].width / 2,
            card.cardStatus === CardStatus.Pick ? cardPopDistance : 0,
            0
          ),
        })
        .start();

      availableIndex++;
    });
  }

  public showCardTooltip(card: CardObject, status: boolean, index: number) {
    if (!status) {
      this.cardTooltipBox.active = status;
    }

    const cardNodes = this.cardsGroup.children;
    const cardPos = cardNodes[index].convertToWorldSpaceAR(
      new cc.Vec3(0, 0, 0)
    );
    const tooltipPos = this.cardTooltipBox.parent.convertToNodeSpaceAR(cardPos);

    this.cardTooltipBox.setPosition(
      new cc.Vec3(tooltipPos.x, tooltipPos.y + cardNodes[index].height, 0)
    );
    this.cardName.string = card.symbol + " of " + suitName[card.cardFlower];
    this.cardValue.string = "+" + card.value + " chips";
    this.cardTooltipBox.active = status;
  }

  public determineRoundFinish() {
    const isFinish = GameManager._instance.isFinishRound();
    if (isFinish === RoundFinishTypes.None) {
      GameManager._instance.fillCards();
    } else if (isFinish === RoundFinishTypes.Failed) {
      this.loserModal.active = true;
      const pos = this.loserModal.getPosition();
      cc.tween(this.loserModal)
        .to(
          0.2 / gameSpeed,
          {
            position: cc.v3(pos.x, 50, 0),
          },
          {
            easing: "quadInOut",
          }
        )
        .to(
          0.1 / gameSpeed,
          {
            position: cc.v3(pos.x, 0, 0),
          },
          {
            easing: "quadInOut",
          }
        )
        .start();
    } else if (isFinish === RoundFinishTypes.Success) {
      const pos = this.winnerModal.getPosition();
      this.winnerModal.active = true;
      cc.tween(this.winnerModal)
        .to(
          0.2 / gameSpeed,
          {
            position: cc.v3(pos.x, pos.y + 1050, 0),
          },
          {
            easing: "quadInOut",
          }
        )
        .to(
          0.1 / gameSpeed,
          {
            position: cc.v3(pos.x, pos.y + 1000, 0),
          },
          {
            easing: "quadInOut",
          }
        )
        .start();
    }
  }

  public onBackCardMouseEnter() {
    if (
      GameManager._instance.gameSetting.gameProgress !== GameProgress.Init ||
      GameManager._instance.gameSetting.gameStart === false
    ) {
      return;
    }
    if (this.deckModalStatus) {
      return;
    }
    this.deckModalStatus = true;
    this.deckModalNode.active = true;

    const deckModal = this.deckModalNode.children[0];
    cc.tween(deckModal)
      .call(() => {
        this.playButtonGroup.active = false;
      })
      .to(0.1 / gameSpeed, {
        position: cc.v3(0, -100, 0),
      })
      .call(() => {
        deckModal.getComponent(Deck).isMoving = false;
      })
      .start();

    const pos = this.handCardsPanel.getPosition();
    cc.tween(this.handCardsPanel)
      .to(0.1 / gameSpeed, {
        position: cc.v3(pos.x, this.cardsGroupPanelY - 100, 0),
      })
      .start();

    GameManager._instance.showDeckModal();
  }

  public onBackCardMouseLeave() {
    if (!this.deckModalStatus) {
      return;
    }
    this.deckModalStatus = false;
    this.deckModalNode.active = false;

    const deckModal = this.deckModalNode.children[0];
    this.playButtonGroup.active = true;

    cc.tween(deckModal)
      .call(() => {})
      .to(0.1 / gameSpeed, {
        position: cc.v3(0, 100, 0),
      })
      .start();

    const posCards = this.handCardsPanel.getPosition();
    cc.tween(this.handCardsPanel)
      .to(0.1 / gameSpeed, {
        position: cc.v3(posCards.x, this.cardsGroupPanelY, 0),
      })
      .start();
  }

  public showFullDeckModal() {
    if (GameManager._instance.gameSetting.gameStart === false) return;
    if (this.fullDeckModalNode.children.length === 0) {
      const fullDeckModal = cc.instantiate(this.fullDeckModal);
      this.fullDeckModalNode.addChild(fullDeckModal);
      fullDeckModal
        .getComponent(FullDeckModal)
        .init(ModelManager._instance.initialCards());
    } else {
    }

    const fullDeckModal = this.fullDeckModalNode.children[0];
    const { numberCount, count } = GameManager._instance.getRemainCardInfo();
    fullDeckModal.getComponent(FullDeckModal).setData(numberCount, count);

    const pos = fullDeckModal.getPosition();
    fullDeckModal.setPosition(cc.v3(pos.x, -1000, 0));
    cc.tween(fullDeckModal)
      .to(0.2 / gameSpeed, {
        position: cc.v3(pos.x, 50, 0),
      })
      .to(0.1 / gameSpeed, {
        position: cc.v3(pos.x, 0, 0),
      })
      .start();
  }

  public hideFullDeckModal() {
    const fullDeckModal = this.fullDeckModalNode.children[0];
    const pos = fullDeckModal.getPosition();
    cc.tween(fullDeckModal)
      .to(0.1 / gameSpeed, {
        position: cc.v3(pos.x, 50, 0),
      })
      .to(0.2 / gameSpeed, {
        position: cc.v3(pos.x, -1000, 0),
      })
      .start();
  }

  public handleCashout() {
    const pos = this.winnerModal.getPosition();
    cc.tween(this.winnerModal)
      .to(
        0.1 / gameSpeed,
        {
          position: cc.v3(pos.x, pos.y + 50, 0),
        },
        {
          easing: "quadInOut",
        }
      )
      .to(
        0.1 / gameSpeed,
        {
          position: cc.v3(pos.x, pos.y - 1050, 0),
        },
        {
          easing: "quadInOut",
        }
      )
      .call(() => {
        this.showBlindSelect();
      })
      .start();
  }

  public loserNewRun() {
    const pos = this.loserModal.getPosition();
    cc.tween(this.loserModal)
      .to(
        0.1 / gameSpeed,
        {
          position: cc.v3(pos.x, 50, 0),
        },
        {
          easing: "quadInOut",
        }
      )
      .to(
        0.1 / gameSpeed,
        {
          position: cc.v3(pos.x, -1050, 0),
        },
        {
          easing: "quadInOut",
        }
      )
      .call(() => {
        this.showBlindSelect();
      })
      .start();
  }
}
