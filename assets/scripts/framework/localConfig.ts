const {ccclass, property} = cc._decorator;
import { resourceUtil } from "./resourceUtil";
import { csvManager } from "./csvManager";
import { ICarInfo } from "./constant";

@ccclass("localConfig")
export class localConfig {
    /* class member could be defined like this */
    static _instance: localConfig;
    csvManager: csvManager | null = null;
    arrCars: ICarInfo[] = [];

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new localConfig();
        return this._instance;
    }

    _callback: Function | null = null;
    _skills: any = {};
    currentLoad = 0;
    cntLoad = 0;
    servers: any = [];

    loadConfig (cb: Function) {
        this._callback = cb;
        this.csvManager = new csvManager();
        this.loadCSV();
    }

    loadCSV () {
        var arrTables = ['talk', 'car', 'signIn'];
        this.cntLoad = arrTables.length + 1;

        arrTables.forEach((tableName, index, array)=> {
            resourceUtil.getData(tableName, (err, content) => {
                this.csvManager!.addTable(tableName, content);
                this.tryToCallbackOnFinished();
            });
        });

        resourceUtil.getJsonData("servers", (err, content)=> {
            this.servers = content;
            this.tryToCallbackOnFinished();
        });
    }

    queryOne (tableName: string, key: string, value: any) {
        return this.csvManager!.queryOne(tableName, key, value);
    }

    queryByID (tableName: string, ID: string) {
        return this.csvManager!.queryByID(tableName, ID);
    }

    getTable (tableName: string) {
        return this.csvManager!.getTable(tableName);
    }

    getTableArr (tableName: string) {
        return this.csvManager!.getTableArr(tableName);
    }

    getCars () {
        if (this.arrCars.length > 0) {
            return this.arrCars;
        }

        let arr = localConfig.instance.getTableArr('car') as any[];
        this.arrCars = arr.sort((elementA, elementB)=>{
            return elementA.sort - elementB.sort
        });

        return this.arrCars;
    }

    queryAll (tableName: string, key: string, value: any) {
        return this.csvManager!.queryAll(tableName, key, value);
    }

    queryIn (tableName: string, key: string, values: Array<any>) {
        return this.csvManager!.queryIn(tableName, key, values);
    }

    queryByCondition (tableName: string, condition: any) {
        return this.csvManager!.queryByCondition(tableName, condition);
    }

    tryToCallbackOnFinished () {
        if (this._callback) {
            this.currentLoad++;
            if (this.currentLoad >= this.cntLoad) {
                this._callback();
            }
        }
    }

    getCurrentServer () {
        return this.servers[0];
    }

    getVersion () {
        let server = this.getCurrentServer();
        let version = server ? server.version : 'unknown';
        return version;
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
