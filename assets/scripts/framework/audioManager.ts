const {ccclass, property} = cc._decorator;

import { configuration } from "./configuration";
import { resourceUtil } from "./resourceUtil";
import { lodash } from "./lodash";

export class audioManager {
    private static _instance: audioManager;
    private static _audioSource?: cc.AudioSource;
    // private static _audioEffectSource?: cc.AudioSource;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new audioManager();
        return this._instance;
    }

    soundVolume: number = 1;

    // init AudioManager in GameRoot.
    init(audioSource: cc.AudioSource) {
        this.soundVolume = this.getConfiguration(true) ? 1 : 0;

        // audioManager._audioEffectSource = new cc.AudioSource();
        // audioManager._audioEffectSource.volume = 1;

        audioManager._audioSource = audioSource;
    }

    getConfiguration(isMusic: boolean) {
        let state;
        if (isMusic) {
            state = configuration.instance.getGlobalData('music');
        } else {
            state = configuration.instance.getGlobalData('sound');
        }

        // console.log('Config for [' + (isMusic ? 'Music' : 'Sound') + '] is ' + state);

        return state === undefined || state === 'true' ? true : false;
    }

    /**
     * 
     * @param {String} name
     * @param {Boolean} loop
     */
    playMusic(loop: boolean) {
        const audioSource = audioManager._audioSource!;
        // assert(audioSource, 'AudioManager not inited!');

        audioSource.loop = loop;
        // audioSource.volume = 
        if (!audioSource.isPlaying) {
            audioSource.play();
        }
    }

    /**
     * 
     * @param {String} name
     */
    pauseMusic() {
        const audioSource = audioManager._audioSource!;
        if (audioSource.isPlaying) {
            audioSource.pause();
        }
    }

    /**
     * 
     * @param {String} name
     */
    playSound(name: string) {
        const audioSource = audioManager._audioSource!;
        // assert(audioSource, 'AudioManager not inited!');

        //
        let path = 'audio/sound/';
        // if (name !== 'click') {
        //     path = 'gamePackage/' + path; 
        // }

        resourceUtil.loadRes(path + name, cc.AudioClip, (err: any, clip: cc.AudioClip) => {
            if (err) {
                //warn('load audioClip failed: ', err);
                return;
            }

            // NOTE: the second parameter is volume scale.
            //audioSource.playOnLoad(clip, audioSource.volume ? this.soundVolume / audioSource.volume : 0);
        });

    }

    /**
     * 
     * @param {cc.AudioClip} clip
     */
    playEffectSound(clip: cc.AudioClip) {
        const audioSource = audioManager._audioSource!;
        // assert(audioSource, 'AudioManager not inited!');
        //audioSource.play(clip, audioSource.volume ? this.soundVolume / audioSource.volume : 0);
    }

    setMusicVolume(flag: number) {
        const audioSource = audioManager._audioSource!;
        // assert(audioSource, 'AudioManager not inited!');

        //flag = clamp01(flag);
        audioSource.volume = flag;
    }

    setSoundVolume(flag: number) {
        this.soundVolume = flag;
    }

    openMusic() {
        this.setMusicVolume(0.8);
        configuration.instance.setGlobalData('music', 'true');
    }

    closeMusic() {
        this.setMusicVolume(0);
        configuration.instance.setGlobalData('music', 'false');
    }

    openSound() {
        this.setSoundVolume(1);
        configuration.instance.setGlobalData('sound', 'true');
    }

    closeSound() {
        this.setSoundVolume(0);
        configuration.instance.setGlobalData('sound', 'false');
    }
}
