import { GameStartOption } from "../Constant";
import Global from "../Global";
import { clientEvent } from "../framework/clientEvent";
import { uiManager } from "../framework/uiManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartOptionDialog extends cc.Component {
  @property(cc.Animation)
  animation: cc.Animation;

  @property(cc.Button)
  newGameButton: cc.Button;

  @property(cc.Button)
  continueButton: cc.Button;

  @property(cc.Button)
  challengeButton: cc.Button;

  @property(cc.Button)
  backButton: cc.Button;

  @property(cc.SpriteFrame)
  buttonFocusSpriteFrame: cc.SpriteFrame;

  @property(cc.SpriteFrame)
  buttonNormalSpriteFrame: cc.SpriteFrame;

  start() {
    this.buttonStatusChanged(GameStartOption.NewRun);
  }

  public showEvent() {
    this.node.active = true;
  }

  public hideEvent() {
    this.node.destroy();
  }

  show() {
    this.animation.play("open");
  }

  hide() {
    this.animation.play("close");
  }

  public playClick() {
    cc.director.loadScene("GameBoard");
  }

  public buttonStatusChanged(status: number) {
    Global.instance.gameStartOption = status;

    this.newGameButton.normalSprite = this.buttonNormalSpriteFrame;
    this.continueButton.normalSprite = this.buttonNormalSpriteFrame;
    this.challengeButton.normalSprite = this.buttonNormalSpriteFrame;

    if (status === GameStartOption.NewRun) {
      this.newGameButton.normalSprite = this.buttonFocusSpriteFrame;
    } else if (status === GameStartOption.Continue) {
      this.continueButton.normalSprite = this.buttonFocusSpriteFrame;
    } else if (status === GameStartOption.Challenge) {
      this.challengeButton.normalSprite = this.buttonFocusSpriteFrame;
    }
  }

  public newGameButtonClicked() {
    this.buttonStatusChanged(GameStartOption.NewRun);
  }

  public continueButtonClicked() {
    this.buttonStatusChanged(GameStartOption.Continue);
  }

  public challengeButtonClicked() {
    this.buttonStatusChanged(GameStartOption.Challenge);
  }
}
