const {ccclass, property} = cc._decorator;

import { configuration } from "./configuration";
import { constant } from "./constant";
import { util } from "./util";
import { localConfig } from '../framework/localConfig';


// {
//     level: number,
//     gold: number,
//     diamond: number,
//     realLevel: number,
//     passCheckPoint: boolean,
//     createDate: any,
//     currentCar: number,
//     cars: number[],
//     onlineRewardTime: number,
//     dictBuyTask: { [name: string]: any },
//     signInInfo: { [name: string]: any },
//     dictGetCarTime: { [name: string]: any }
// };

type UserInfoForNumber = 'level' | 'gold' | 'diamond' | 'realLevel' | 'currentCar' | 'onlineRewardTime';

@ccclass("playerData")
export class playerData extends cc.Component {
    /* class member could be defined like this */
    // dummy = '';

    static _instance: playerData;
    serverTime = 0;
    localTime = 0;
    showCar = 0;
    isComeFromBalance: boolean = false;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new playerData();
        return this._instance;
    }

    userId: string = '';
    playerInfo: { [name: string]: any} = {};
    history: any = null;
    settings: any = null;
    isNewBee: boolean = false;   
    dataVersion: string = '';
    // bag: any = null;
    signInInfo: any = null;

    loadGlobalCache() {
        let userId = configuration.instance.getUserId();
        if (userId) {
            this.userId = userId;
        }
    }

    loadFromCache() {
        this.playerInfo = this.loadDataByKey(constant.LOCAL_CACHE.PLAYER);

        if (this.playerInfo.currentCar) {
            this.showCar = this.playerInfo.currentCar;
        } else {
            this.showCar = constant.INITIAL_CAR;
        }

        this.history = this.loadDataByKey(constant.LOCAL_CACHE.HISTORY);

        // this.bag = this.loadDataByKey(constants.LOCAL_CACHE.BAG);

        this.settings = this.loadDataByKey(constant.LOCAL_CACHE.SETTINGS);
    }

    loadDataByKey(keyName: string) {
        let ret = {};
        let str = configuration.instance.getConfigData(keyName);
        if (str) {
            try {
                ret = JSON.parse(str);
            } catch (e) {
                ret = {};
            }
        }

        return ret;
    }

    createPlayerInfo(loginData?: { [name: string]: any }) {
        this.playerInfo.level = 1; 
        this.playerInfo.gold = 0;
        this.playerInfo.realLevel = 1;
        this.playerInfo.passCheckPoint = false;
        this.playerInfo.createDate = new Date(); 
        this.playerInfo.currentCar = constant.INITIAL_CAR; 
        this.playerInfo.cars = [];
        this.playerInfo.cars.push(constant.INITIAL_CAR); 
        this.playerInfo.dictBuyTask = {};
        this.showCar = this.playerInfo.currentCar;
        this.isNewBee = true; 

        this.playerInfo.signInInfo = {};
        this.playerInfo.dictGetCarTime = {}


        if (loginData) {
            for (let key in loginData) {
                this.playerInfo[key] = loginData[key];
            }
        }

        // if (!this.playerInfo.avatarUrl) {
        //     
        // }

        // this.playerInfo.dictTask = this.createRandTask();
        // this.playerInfo.taskDate = new Date(); //任务创建时间
        this.savePlayerInfoToLocalCache();
    }

    saveAccount(userId: any) {
        this.userId = userId;
        configuration.instance.setUserId(userId);
    }

    /**
     * 
     */
    savePlayerInfoToLocalCache() {
        configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
    }

    /**
     * 
     */
    saveAll() {
        configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
        configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.HISTORY, JSON.stringify(this.history));
        configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.SETTINGS, JSON.stringify(this.settings));
        // configuration.instance.setConfigDataWithoutSave(constant.LOCAL_CACHE.BAG, JSON.stringify(this.bag));
        configuration.instance.setConfigData(constant.LOCAL_CACHE.DATA_VERSION, this.dataVersion);
    }

    /**
     * 
     * 
     * @param {String} key
     * @param {Number} value
     */
    updatePlayerInfo(key: string, value: any) {
        let isChanged = false;
        if (this.playerInfo.hasOwnProperty(key)) {
            if (typeof value === 'number') {
                isChanged = true;
                this.playerInfo[key] += value;
                if (this.playerInfo[key] < 0) {
                    this.playerInfo[key] = 0;
                }
                //return;
            } else if (typeof value === 'boolean' || typeof value === 'string') {
                isChanged = true;
                this.playerInfo[key] = value;
            }
        } else if(key === 'gold'){
            isChanged = true;
            this.playerInfo[key] = value;
        }
        if (isChanged) {
            configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
        }
    }

    updateSignInCurrentDay() {
        if (Object.keys(this.playerInfo.signInInfo).length === 0 || this.isNeedRecycleSignInInfo()) {
            this.createNewSignInInfo();
        } else {
            let offectDays = util.getDeltaDays(this.playerInfo.signInInfo.signInDate, Date.now());//比较两个时间，为0则今天更新过
            if (offectDays === 0) {
                return;
            }

            this.updateSignInFillSignInDays(0, true);

            this.playerInfo.signInInfo.currentDay += offectDays;
            if (this.playerInfo.signInInfo.currentDay <= 0) {
                this.createNewSignInInfo();
            }
            this.playerInfo.signInInfo.currentDay > constant.MAX_SIGNIN_DAY ? constant.MAX_SIGNIN_DAY : this.playerInfo.signInInfo.currentDay;
            this.playerInfo.signInInfo.signInDate = Date.now();
        }
        this.savePlayerInfoToLocalCache();
    }

    /**
     * 
     */
    createNewSignInInfo() {
        if (!this.playerInfo.hasOwnProperty('signInInfo')) {
            this.playerInfo.signInInfo = {};
            this.playerInfo.dictGetCarTime = {};
        }

        let signInInfo = this.playerInfo.signInInfo;
        signInInfo.createDate = Date.now();
        signInInfo.signInDate = Date.now();
        signInInfo.currentDay = 1;
        signInInfo.receivedDays = [];
        signInInfo.afterFillSignInDays = [];
        this.savePlayerInfoToLocalCache();
    }

    /**
    * 
    */
    isNeedRecycleSignInInfo(): boolean {
        if (!this.playerInfo.signInInfo) {
            this.createNewSignInInfo();
        }
        let isNeedRecycled = false;
        let diffTime = util.getDeltaDays(this.playerInfo.signInInfo.createDate, Date.now());
        if (diffTime >= constant.MAX_SIGNIN_DAY) {
            isNeedRecycled = true;
        }
        return isNeedRecycled;
    }

    /**
     *
     * @param {Number} day
    */
    updateSignInReceivedDays(day: number) {
        let receivedDays = this.playerInfo.signInInfo.receivedDays;
        if (Array.isArray(receivedDays) && receivedDays.includes(day)) {
            return;
        }
        receivedDays.push(Number(day));
        this.savePlayerInfoToLocalCache();
    }

    /**
     * 
     * @param {number} day
     * @param {boolean} isClear 
     */
    updateSignInFillSignInDays(day: number, isClear: boolean) {
        let afterFillSignInDays = this.playerInfo.signInInfo.afterFillSignInDays;

        if (!isClear) {
            if (Array.isArray(afterFillSignInDays) && afterFillSignInDays.includes(day)) {
                return;
            }
            afterFillSignInDays.push(Number(day));
        } else {
            afterFillSignInDays.length = 0;
        }
        this.savePlayerInfoToLocalCache();
    }

    /**
     * 
     * 
     * @returns {boolean, boolean}  
     */
    getSignInReceivedInfo(): any {
        if (!this.playerInfo.signInInfo) {
            this.createNewSignInInfo();
        }
        let signInInfo = this.playerInfo.signInInfo;
        let isAllReceived = false;
        let isTodayReceived = false;
        if (signInInfo.receivedDays.length < signInInfo.currentDay) {
            isAllReceived = false;
        } else {
            isAllReceived = true;
        }

        if (signInInfo.receivedDays.includes(signInInfo.currentDay)) {
            isTodayReceived = true;
        } else {
            isTodayReceived = false;
        }

        return { isAllReceived, isTodayReceived };
    }


    /**
     *
     * @param {number} ID 车的ID
     * @returns
     * @memberof playerData
     */
    isHadCarAndDuringPeriod(ID: number) {
        let createDate = this.playerInfo.signInInfo.createDate;
        if (!this.playerInfo.dictGetCarTime) {
            this.playerInfo.dictGetCarTime = {};
        }
        let getCarDate = this.playerInfo.dictGetCarTime[ID];
        let isHadCar = this.playerInfo.cars.indexOf(ID) !== -1;

        return isHadCar && getCarDate && getCarDate < createDate;
    }

    /**
     * 
     * @param ID 
     */
    updateDictGetCarTime(ID: number) {
        if (!this.playerInfo.dictGetCarTime) {
            this.playerInfo.dictGetCarTime = {};
        }
        this.playerInfo.dictGetCarTime[ID] = this.playerInfo.signInInfo.createDate;
        configuration.instance.setConfigData(constant.LOCAL_CACHE.PLAYER, JSON.stringify(this.playerInfo));
    }

    /**********************************************/

    getLastOnlineRewardTime() {
        if (this.playerInfo.onlineRewardTime) {
            return this.playerInfo.onlineRewardTime;
        }

        this.playerInfo.onlineRewardTime = this.getCurrentTime();

        this.savePlayerInfoToLocalCache();

        return this.playerInfo.onlineRewardTime;
    }

    /**
     * 
     *
     * @param {number} elapsedTime
     * @memberof playerData
     */
    updateLastOnlineRewardTime(elapsedTime: number) {
        let time = this.getCurrentTime() - elapsedTime * 1000;

        this.playerInfo.onlineRewardTime = time;
        this.savePlayerInfoToLocalCache();
    }

    /**
     * 
     */
    syncServerTime(serverTime: number) {
        this.serverTime = serverTime;
        this.localTime = Date.now();
    }

    /**
     * 
     */
    getCurrentTime() {
        let diffTime = Date.now() - this.localTime;

        return this.serverTime + diffTime;
    }

    /**
     * 
     *
     * @param {number} carID
     * @memberof playerData
     */
    hasCar(carID: number) {
        if (carID === constant.INITIAL_CAR) {
            return true;
        }

        if (!this.playerInfo.cars) {
            this.playerInfo.cars = [constant.INITIAL_CAR];
        }

        return this.playerInfo.cars.indexOf(carID) !== -1;
    }

    hasCarCanReceived() {
        let arrCars = localConfig.instance.getCars();
        for (let idx = 0; idx < arrCars.length; idx++) {
            let carInfo = arrCars[idx];

            if (carInfo.type === constant.BUY_CAR_TYPE.GOLD || carInfo.type === constant.BUY_CAR_TYPE.SIGNIN) {
                continue;
            }

            if (this.hasCar(carInfo.ID)) {
                continue;
            }

            if (!this.playerInfo.dictBuyTask || !this.playerInfo.dictBuyTask.hasOwnProperty(carInfo.type)) {
                continue;
            }

            if (this.playerInfo.dictBuyTask[carInfo.type] >= carInfo.num) {
                return true;
            }
        }

        return false;
    }

    finishBuyTask(type: number, value: number, isAdd?: Boolean) {
        if (!this.playerInfo.dictBuyTask) {
            this.playerInfo.dictBuyTask = {};
        }

        if (!this.playerInfo.dictBuyTask.hasOwnProperty(type) || !isAdd) {
            this.playerInfo.dictBuyTask[type] = value;
        } else {
            this.playerInfo.dictBuyTask[type] += value;
        }

        this.savePlayerInfoToLocalCache();
    }

    /**
     * 
     *
     * @param {*} type
     * @memberof playerData
     */
    getBuyTypeProgress(type: number) {
        if (this.playerInfo.dictBuyTask && this.playerInfo.dictBuyTask.hasOwnProperty(type)) {
            return this.playerInfo.dictBuyTask[type];
        }

        return 0;
    }

    /**
     * 
     *
     * @returns
     * @memberof playerData
     */
    getCurrentCar() {
        if (!this.playerInfo.currentCar) {
            this.playerInfo.currentCar = constant.INITIAL_CAR;
        }

        return this.playerInfo.currentCar;
    }

    /**
     *
     * 
     * @param {*} carId
     * @returns
     * @memberof playerData
     */
    useCar(carId: number) {
        if (!this.hasCar(carId)) {
            return false;
        }

        this.playerInfo.currentCar = carId;
        this.savePlayerInfoToLocalCache();

        this.showCar = this.playerInfo.currentCar;

        return true;
    }

    buyCar(carId: number) {
        if (this.playerInfo.cars.indexOf(carId) !== -1) {
            return true;
        }

        this.playerInfo.cars.push(carId);
        this.savePlayerInfoToLocalCache();

        return true;
    }

    clear() {
        this.playerInfo = {};
        this.settings = {};
        this.saveAll();
    }


    passLevel(rewardMoney: number) {
        this.playerInfo.level++;
        this.playerInfo.gold += rewardMoney;

        console.log("###1 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel);

        if (!this.playerInfo.passCheckPoint) {
            if (this.playerInfo.level >= constant.MAX_LEVEL) {
                this.playerInfo.realLevel = constant.MAX_LEVEL;
                this.playerInfo.level = constant.MAX_LEVEL;

                this.playerInfo.passCheckPoint = true;
                console.log("###2 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel);
            } else {
                this.playerInfo.realLevel = this.playerInfo.level;
            }
        } else {
            this.playerInfo.realLevel = this.getRandLevel();
            console.log("###3 this.playerInfo.level", this.playerInfo.level, 'this.playerInfo.realLevel', this.playerInfo.realLevel);
        }

        this.savePlayerInfoToLocalCache();
    }

    getRandLevel() {
        let level = -1;

        while(level === -1){
            let randLevel = 16 + Math.floor(Math.random() * 5);
            if (randLevel !== this.playerInfo.realLevel) {
                level = randLevel;
            }
        }

        return level
    }
}
