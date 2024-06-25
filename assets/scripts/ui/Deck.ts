import { CardFlower } from "../Constant";
import ModelManager from "../ModelManager";
import { clientEvent } from "../framework/clientEvent";
import CardCount from "./CardCount";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Deck extends cc.Component {
  @property(cc.Node)
  topBar: cc.Node;

  @property(cc.Prefab)
  cardCount: cc.Prefab;

  @property(cc.Label)
  spadesCount: cc.Label;

  @property(cc.Label)
  heartsCount: cc.Label;

  @property(cc.Label)
  cubesCount: cc.Label;

  @property(cc.Label)
  diamondsCount: cc.Label;

  @property(cc.Node)
  spadesRow: cc.Node;

  @property(cc.Node)
  heartsRow: cc.Node;

  @property(cc.Node)
  cubesRow: cc.Node;

  @property(cc.Node)
  diamondsRow: cc.Node;

  protected onLoad(): void {}

  protected onDestroy(): void {}

  public isMoving: boolean;

  start() {}

  protected onEnable(): void {
    clientEvent.on("getDeckInfoEvent", this.getInfos, this);
  }

  protected onDisable(): void {
    clientEvent.off("getDeckInfoEvent", this.getInfos, this);
  }

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {}

  hide() {}

  protected update(dt: number): void {}

  public getInfos([countNumber, suitCount, count]: [
    number[],
    number[],
    number[][]
  ]) {
    const cards = ModelManager._instance.initialCards();

    if (this.topBar.children.length === 0) {
      for (let i = 0; i < 13; i++) {
        const obj = cc.instantiate(this.cardCount);
        this.topBar.addChild(obj);
        const topbarWidth = this.topBar.width;
        const itemWidth = topbarWidth / 13 - 5;
        obj.width = itemWidth;
        const numberCount = 4;
        obj.getComponent(CardCount).setCompInfo(cards[i], numberCount);
        obj.setPosition(
          cc.v3((itemWidth + 5) * i - topbarWidth / 2 + itemWidth / 2, 0, 0)
        );
      }
    }

    const countNumberNodes = this.topBar.children;
    countNumberNodes.forEach((node, index) => {
      node.getComponent(CardCount).setCompInfo(null, countNumber[index]);
    });
    this.spadesCount.string = suitCount[CardFlower.Spade].toString();
    this.heartsCount.string = suitCount[CardFlower.Heart].toString();
    this.cubesCount.string = suitCount[CardFlower.Cube].toString();
    this.diamondsCount.string = suitCount[CardFlower.Diamond].toString();

    const parentWidth = this.spadesRow.width;
    const labelNodeWidth = parentWidth / 13 - 5;
    const labelNodeHeight = this.spadesRow.height;

    if (this.spadesRow.children.length === 0) {
      count[CardFlower.Spade].forEach((c, index) => {
        const node = new cc.Node();
        const label = node.addComponent(cc.Label);
        node.width = labelNodeWidth;
        node.height = labelNodeHeight;
        node.setPosition(
          cc.v3(
            (labelNodeWidth + 5) * index - parentWidth / 2 + labelNodeWidth / 2,
            -17,
            0
          )
        );
        label.string = c.toString();
        label.fontSize = 17;

        this.spadesRow.addChild(node);
      });
    } else {
      const nodes = this.spadesRow.children;
      nodes.forEach((node, index) => {
        const label = node.getComponent(cc.Label);
        label.string = count[CardFlower.Spade][index].toString();
      });
    }

    if (this.heartsRow.children.length === 0) {
      count[CardFlower.Heart].forEach((c, index) => {
        const node = new cc.Node();
        const label = node.addComponent(cc.Label);
        node.width = labelNodeWidth;
        node.height = labelNodeHeight;
        node.setPosition(
          cc.v3(
            (labelNodeWidth + 5) * index - parentWidth / 2 + labelNodeWidth / 2,
            -17,
            0
          )
        );
        label.string = c.toString();
        label.fontSize = 17;

        this.heartsRow.addChild(node);
      });
    } else {
      const nodes = this.heartsRow.children;
      nodes.forEach((node, index) => {
        const label = node.getComponent(cc.Label);
        label.string = count[CardFlower.Heart][index].toString();
      });
    }

    if (this.cubesRow.children.length === 0) {
      count[CardFlower.Cube].forEach((c, index) => {
        const node = new cc.Node();
        const label = node.addComponent(cc.Label);
        node.width = labelNodeWidth;
        node.height = labelNodeHeight;
        node.setPosition(
          cc.v3(
            (labelNodeWidth + 5) * index - parentWidth / 2 + labelNodeWidth / 2,
            -17,
            0
          )
        );
        label.string = c.toString();
        label.fontSize = 17;

        this.cubesRow.addChild(node);
      });
    } else {
      const nodes = this.cubesRow.children;
      nodes.forEach((node, index) => {
        const label = node.getComponent(cc.Label);
        label.string = count[CardFlower.Cube][index].toString();
      });
    }

    if (this.diamondsRow.children.length === 0) {
      count[CardFlower.Diamond].forEach((c, index) => {
        const node = new cc.Node();
        const label = node.addComponent(cc.Label);
        node.width = labelNodeWidth;
        node.height = labelNodeHeight;
        node.setPosition(
          cc.v3(
            (labelNodeWidth + 5) * index - parentWidth / 2 + labelNodeWidth / 2,
            -17,
            0
          )
        );
        label.string = c.toString();
        label.fontSize = 17;

        this.diamondsRow.addChild(node);
      });
    } else {
      const nodes = this.diamondsRow.children;
      nodes.forEach((node, index) => {
        const label = node.getComponent(cc.Label);
        label.string = count[CardFlower.Diamond][index].toString();
      });
    }
  }
}
