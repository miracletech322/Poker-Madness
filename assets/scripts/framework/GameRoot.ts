
//import { _decorator, Component, AudioSource, assert, game } from 'cc';
const {ccclass, property} = cc._decorator;
const {Component} = cc;
//import { setting } from '../ui/main/setting';
import { audioManager } from './audioManager';
declare const cocosAnalytics: any;

@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(cc.AudioSource)
    private _audioSource: cc.AudioSource = null!;

    onLoad () {
        const audioSource = this.getComponent(cc.AudioSource)!;
        this._audioSource = audioSource;
        cc.game.addPersistRootNode(this.node);

        // init AudioManager
        audioManager.instance.init(this._audioSource);
    }

    onEnable () {
        audioManager.instance.playMusic(true);
        //setting.checkState();
    }

    start(){
        if(typeof cocosAnalytics !== 'undefined'){
            cocosAnalytics.enableDebug(true);
        }
    }
}