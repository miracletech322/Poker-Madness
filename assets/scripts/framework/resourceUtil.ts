const { ccclass, property } = cc._decorator;

declare global {
    namespace globalThis {
        var LZString: any;
    }
}

interface ITextAsset {
    text?: string;
    _file?: string;
    json?: string;
}

@ccclass
export class resourceUtil extends cc.Component {
    public static loadRes<T extends cc.Asset>(url: string, type: typeof cc.Asset | null, cb?: (err: Error | null, asset?: T) => void) {
        if (type) {
            cc.loader.loadRes(url, type, (err, res) => {
                if (err) {
                    cc.error(err.message || err);
                    if (cb) {
                        cb(err, res as T);
                    }
                    return;
                }
                if (cb) {
                    cb(null, res as T);
                }
            });
        } else {
            cc.loader.loadRes(url, (err, res) => {
                if (err) {
                    cc.error(err.message || err);
                    if (cb) {
                        cb(err, res as T);
                    }
                    return;
                }
                if (cb) {
                    cb(null, res as T);
                }
            });
        }
    }

    public static getMap(level: number, cb: (err: Error | null, textAsset: any) => void) {
        let levelStr = 'map';
        if (level >= 100) {
            levelStr += level;
        } else if (level >= 10) {
            levelStr += '0' + level;
        } else {
            levelStr += '00' + level;
        }

        this.loadRes(`gamePackage/map/config/${levelStr}`, null, (err, txtAsset) => {
            if (err) {
                cb(err, txtAsset);
                return;
            }

            const txt = txtAsset as unknown as ITextAsset;
            let content = '';
            if (txt._file) {
                if (globalThis.LZString) {
                    content = globalThis.LZString.decompressFromEncodedURIComponent(txt._file);
                }
                const objJson = JSON.parse(content);
                cb(null, objJson);
            } else if (txt.text) {
                if (globalThis.LZString) {
                    content = globalThis.LZString.decompressFromEncodedURIComponent(txt.text);
                }

                const objJson = JSON.parse(content);
                cb(null, objJson);
            } else if (txt.json) {
                cb(null, txt.json);
            } else {
                const errObj = new Error('failed');
                cb(errObj, null);
            }
        });
    }

    public static getMapObjs(type: string, arrName: Array<string>, progressCb: (completedCount: number, totalCount: number, item: any) => void | null, completeCb: (error: Error | null, asset: cc.Prefab | cc.Prefab[]) => void) {
        let arrUrls = [];
        for (let idx = 0; idx < arrName.length; idx++) {
            arrUrls.push(`gamePackage/map/${type}/${arrName[idx]}`);
        }

        cc.loader.loadResArray(arrUrls, cc.Prefab, progressCb, completeCb);
    }

    public static getUIPrefabRes(prefabPath: string, cb?: (err: Error | null, asset?: cc.Prefab) => void) {
        this.loadRes("prefab/ui/" + prefabPath, cc.Prefab, cb);
    }

    public static createUI(path: string, cb?: (err: Error | null, node?: cc.Node) => void, parent?: cc.Node | null) {
        this.getUIPrefabRes(path, (err: Error | null, prefab?: cc.Prefab) => {
            if (err) return;
            const node = cc.instantiate(prefab!);
            node.setPosition(0, 0, 0);
            if (!parent) {
                parent = cc.find("Canvas");
            }

            parent!.addChild(node);
            if (cb) {
                cb(null, node);
            }
        });
    }

    public static getCarsBatch(arrName: Array<string>, progressCb: (completedCount: number, totalCount: number, item: any) => void | null, completeCb: (error: Error | null, asset: cc.Prefab) => void) {
        let arrUrls = [];
        for (let idx = 0; idx < arrName.length; idx++) {
            arrUrls.push(`prefab/car/car${arrName[idx]}`);
        }

        for (let i = 0; i < arrUrls.length; i++) {
            const url = arrUrls[i];
            if (!progressCb) {
                cc.loader.loadRes(url, cc.Prefab, completeCb);
            } else {
                cc.loader.loadRes(url, cc.Prefab, progressCb, completeCb);
            }
        }
    }

    public static getUICar(name: string, cb: (err: Error | null, asset?: cc.Prefab) => void) {
        this.loadRes(`prefab/ui/car/uiCar${name}`, cc.Prefab, cb);
    }

    public static getCar(name: string, cb: (err: Error | null, asset?: cc.Prefab) => void) {
        this.loadRes(`prefab/car/car${name}`, cc.Prefab, cb);
    }

    public static setCarIcon(name: string, sprite: cc.Sprite, isBlack: boolean, cb: (err: Error | null, asset?: cc.SpriteFrame) => void) {
        let path = `gamePackage/texture/car/car${name}`;
        if (isBlack) {
            path += 'Black';
        }

        this.setSpriteFrame(path, sprite, cb);
    }

    public static getJsonData(fileName: string, cb: (err: Error | null, asset: any) => void) {
        cc.loader.loadRes("datas/" + fileName, (err, content) => {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            const txt = content as unknown as ITextAsset;
            if (txt.json) {
                cb(err, txt.json);
            } else {
                const errObj = new Error('failed!!!');
                cb(errObj, null);
            }
        });
    }

    public static getData(fileName: string, cb: (err: Error | null, asset: any) => void) {
        cc.loader.loadRes("datas/" + fileName, function (err, content) {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            const txt = content as unknown as ITextAsset;
            let text = txt.text;
            if (!text) {
                cc.loader.load(content.nativeUrl, (err, content) => {
                    text = content as unknown as string;
                    cb(err, text);
                });

                return;
            }

            cb(err, text);
        });
    }

    public static setSpriteFrame<T extends cc.Asset>(path: string, sprite: cc.Sprite, cb: (err: Error | null, asset?: cc.SpriteFrame) => void) {
        this.loadRes<cc.SpriteFrame>(path + '/spriteFrame', cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('set sprite frame failed! err:', path, err);
                cb(err, spriteFrame);
                return;
            }

            if (sprite && cc.isValid(sprite)) {
                sprite.spriteFrame = spriteFrame;
                cb(null, spriteFrame);
            }
        });
    }

    public static getCustomer(name: string, cb: (err: Error | null, asset?: cc.Prefab) => void) {
        this.loadRes(`gamePackage/map/customer/customer${name}`, cc.Prefab, cb);
    }

    public static setCustomerIcon(name: string, sprite: cc.Sprite, cb: (err: Error | null) => void) {
        let path = `gamePackage/texture/head/head${name}`;

        this.setSpriteFrame(path, sprite, cb);
    }

    public static getEffect(name: string, cb: (err: Error | null, asset?: cc.Prefab) => void) {
        this.loadRes(`prefab/effect/${name}`, cc.Prefab, cb);
    }
}
