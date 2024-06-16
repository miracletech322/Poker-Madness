const { ccclass, property } = cc._decorator;
import { resourceUtil } from "./resourceUtil";
import { poolManager } from "./poolManager";

const SHOW_STR_INTERVAL_TIME = 800;

interface IPanel extends cc.Component {
    show?: Function;
    hide?: Function;
}

@ccclass("uiManager")
export class uiManager {

    dictSharedPanel: { [path: string]: cc.Node } = {}
    dictLoading: { [path: string]: boolean } = {};
    arrPopupDialog: {
        panelPath: string,
        scriptName?: string,
        param: any,
        isShow: boolean
    }[] = [];
    showTipsTime: number = 0


    static _instance: uiManager;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new uiManager();
        return this._instance;
    }


    /**
     * 
     * @param {String} panelPath
     * @param {number} id
     * @param {Array} args
     * @param {Function} cb 
     */
    showDialog(panelPath: string, prefab: cc.Prefab, id?: number, args?: any, cb?: Function) {
        let key = null;
        if (id === undefined || id === null) {
            key = panelPath;
        } else {
            key = panelPath + id;
        }
        if (this.dictLoading[key]) {
            return;
        }

        let idxSplit = panelPath.lastIndexOf('/');
        let scriptName = panelPath.slice(idxSplit + 1);

        if (!args) {
            args = [];
        }
        if (this.dictSharedPanel.hasOwnProperty(key)) {
            let panel = this.dictSharedPanel[key];
            if (cc.isValid(panel)) {
                panel.parent = cc.find("Canvas/DialogParent");
                panel.active = true;
                let script = panel.getComponent(scriptName) as IPanel;
                if (script.show) {
                    script.show.apply(script, args);
                }

                cb && cb(script);

                return;
            }
        }

        this.dictLoading[key] = true;
        // resourceUtil.createUI(panelPath, (err, node) => {
        const node = cc.instantiate(prefab!);
        node.setPosition(0, 0, 0);
        let parent = cc.find("Canvas/DialogParent");
        parent!.addChild(node);
        let isCloseBeforeShow = false;
        if (!this.dictLoading[key]) {
            isCloseBeforeShow = true;
        }

        this.dictLoading[key] = false;
        // if (err) {
        //     console.error(err);
        //     return;
        // }

        // node.zIndex = 100;
        this.dictSharedPanel[key] = node!;

        let script = node!.getComponent(scriptName)! as IPanel;
        if (script.show) {
            script.show.apply(script, args);
        }

        cb && cb(script);

        if (isCloseBeforeShow) {
            this.hideDialog(panelPath);
        }

        // return script;
        // });
    }

    /**
     * 
     * @param {String} panelPath
     * @param {number} id
     * @param {fn} callback
     */
    hideDialog(panelPath: string, id?: number, callback?: Function) {
        let key = null;
        if (id === undefined || id === null) {
            key = panelPath;
        } else {
            key = panelPath + id;
        }
        // console.log(key);
        if (this.dictSharedPanel.hasOwnProperty(key)) {
            let panel = this.dictSharedPanel[key];
            if (panel && cc.isValid(panel)) {

                // let idxSplit = panelPath.lastIndexOf('/');
                // let scriptName = panelPath.slice(idxSplit + 1);
                // let script = panel.getComponent(scriptName) as IPanel;
                // if (script.hide) {
                //     script.hide.apply(script);
                // }
                panel.parent = null;
                panel.destroy();
                if (callback && typeof callback === 'function') {
                    callback();
                }
            } else if (callback && typeof callback === 'function') {
                callback();
            }
        }

        this.dictLoading[key] = false;
    }

    /**
     * 
     * @param {string} panelPath
     * @param {string} scriptName
     * @param {*} param
     */
    pushToPopupSeq(panelPath: string, scriptName: string, param: any) {
        let popupDialog = {
            panelPath: panelPath,
            scriptName: scriptName,
            param: param,
            isShow: false
        };

        this.arrPopupDialog.push(popupDialog);

        this.checkPopupSeq();
    }

    /**
     * 
     * @param {number} index
     * @param {string} panelPath
     * @param {string} scriptName
     * @param {*} param
     */
    insertToPopupSeq(index: number, panelPath: string, param: any) {
        let popupDialog = {
            panelPath: panelPath,
            param: param,
            isShow: false
        };

        this.arrPopupDialog.splice(index, 0, popupDialog);
        //this.checkPopupSeq();
    }

    /**
     * 
     * @param {string} panelPath
     */
    shiftFromPopupSeq(panelPath: string) {
        this.hideDialog(panelPath, undefined, () => {
            if (this.arrPopupDialog[0] && this.arrPopupDialog[0].panelPath === panelPath) {
                this.arrPopupDialog.shift();
                this.checkPopupSeq();
            }
        })
    }

    /**
     * 
     */
    checkPopupSeq() {
        if (this.arrPopupDialog.length > 0) {
            let first = this.arrPopupDialog[0];

            if (!first.isShow) {
                this.showDialog(first.panelPath, first.param);
                this.arrPopupDialog[0].isShow = true;
            }
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    /**
     * 
     * @param {String} content
     * @param {Function} cb
     */
    showTips(content: string, cb?: Function) {
        var now = Date.now();
        if (now - this.showTipsTime < SHOW_STR_INTERVAL_TIME) {
            var spareTime = SHOW_STR_INTERVAL_TIME - (now - this.showTipsTime);
            const self = this;
            setTimeout(function (tipsLabel, callback) {
                self._showTipsAni(tipsLabel, callback);
            }.bind(this, content, cb), spareTime);

            this.showTipsTime = now + spareTime;
        } else {
            this._showTipsAni(content, cb);
            this.showTipsTime = now;
        }
    }

    /**
     * 
     * @param {String} content
     * @param {Function} cb
     */
    _showTipsAni(content: string, cb?: Function) {
        //todo 
        resourceUtil.getUIPrefabRes('common/tips', (err, prefab) => {
            if (err) {
                return;
            }

            let tipsNode = poolManager.instance.getNode(prefab!, cc.find("Canvas/DialogParent")!) as cc.Node;
            //let tipScript = tipsNode.getComponent(tips)!;
            //tipScript.show(content, cb);
        });
    }
}
