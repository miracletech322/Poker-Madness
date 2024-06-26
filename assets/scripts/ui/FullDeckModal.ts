import { CardFlower, CardObject } from "../Constant";
import ModelManager from "../ModelManager";
import { clientEvent } from "../framework/clientEvent";
import Card from "./Card";
import CardCount from "./CardCount";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FullDeckModal extends cc.Component {
  @property(cc.Node)
  remainCountPanel: cc.Node;

  @property(cc.Node)
  cardsPanel: cc.Node;

  @property(cc.Prefab)
  card: cc.Prefab;

  protected onLoad(): void {}

  protected onDestroy(): void {}

  public isLoaded: boolean;

  start() {}

  protected onEnable(): void {}

  protected onDisable(): void {}

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {}

  hide() {}

  protected update(dt: number): void {}

  public init(cards: CardObject[]) {
    const nodeHeight = this.remainCountPanel.height / 13 - 5;
    const nodeWidth = this.remainCountPanel.width;

    // left panel init
    for (let i = 0; i < 13; i++) {
      const rootNode = new cc.Node();
      rootNode.width = nodeWidth;
      rootNode.height = nodeHeight;
      rootNode.setPosition(
        cc.v3(
          0,
          this.remainCountPanel.height - (nodeHeight + 5) * (i + 1) - 5,
          0
        )
      );

      const node = new cc.Node();
      const label = node.addComponent(cc.Label);
      label.fontSize = 17;
      label.string = i < 4 ? cards[i].symbol[0] : cards[i].symbol;
      node.setPosition(cc.v3(0, 0, 0));

      const countNode = new cc.Node();
      const countLabel = countNode.addComponent(cc.Label);
      countLabel.fontSize = 17;
      countLabel.string = "";
      countNode.setPosition(cc.v3(nodeWidth, 0, 0));

      rootNode.addChild(node);
      rootNode.addChild(countNode);
      this.remainCountPanel.addChild(rootNode);
    }

    // cards panel init

    const panelWidth = this.cardsPanel.width;
    const panelHeight = this.cardsPanel.height - 50;
    const cardWidth = 70;
    const cardHeight = 90;
    for (let i = 0; i < cards.length; i++) {
      const card = cc.instantiate(this.card);
      this.cardsPanel.addChild(card);
      card.width = cardWidth;
      card.height = cardHeight;
      card.setPosition(
        cc.v3(
          ((panelWidth - cardWidth) / 13) * (i % 13) + cardWidth,
          panelHeight -
            (panelHeight / 4) * Math.floor(i / 13) -
            cardHeight / 2 +
            25,
          0
        )
      );
      card.getComponent(Card).setCardInfo(cards[i]);
      card.getComponent(Card).disable = true;
      card.angle = -((i % 13) - 6) * 2;
    }
  }

  public setData(numberCount: number[], count: number[][]) {
    const remainItems = this.remainCountPanel.children;
    remainItems.forEach((node, index) => {
      node.children[1].getComponent(cc.Label).string =
        numberCount[index].toString();
    });

    const cardItems = this.cardsPanel.children;
    cardItems.forEach((item, index) => {
      count[Math.floor(index / 13)][index % 13] === 0 && (item.opacity = 150);
    });
  }

  public onBack() {
    const cardItems = this.cardsPanel.children;
    cardItems.forEach((item, index) => {
      item.opacity = 255;
    });
    clientEvent.dispatchEvent("FullDeckHideEvent", []);
  }
}
