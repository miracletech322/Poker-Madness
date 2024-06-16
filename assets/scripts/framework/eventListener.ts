const {ccclass, property} = cc._decorator;

interface IEvent{
    handler: Function;
    target?: Node
}

type EventList = { [name: string]: IEvent};

@ccclass
class oneToOneListener {
    supportEvent: any = {}
    handle: EventList = {};

    constructor(){
        this.supportEvent = null;
    }

    on (eventName: string, handler: Function, target: Node) {
        this.handle[eventName] = { handler: handler, target: target };
    }

    off (eventName: string, handler: Function) {
        const oldObj = this.handle[eventName];
        if (oldObj && oldObj.handler && oldObj.handler === handler) {
            delete this.handle[eventName];
        }
    }

    dispatchEvent (eventName: string) {
        if (this.supportEvent !== null && !this.supportEvent.hasOwnProperty(eventName)) {
            cc.error("please add the event into clientEvent.js");
            return;
        }

        const objHandler = this.handle[eventName];
        const args = [];
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (objHandler.handler) {
            objHandler.handler.apply(objHandler.target, args);
        } else {
            cc.log("not register " + eventName + "    callback func");
        }
    }

    setSupportEventList (arrSupportEvent: string[]) {
        if (!(arrSupportEvent instanceof Array)) {
            cc.error("supportEvent was not array");
            return false;
        }

        this.supportEvent = {};
        for (let i in arrSupportEvent) {
            const eventName = arrSupportEvent[i];
            this.supportEvent[eventName] = i;
        }

        return true;
    }
};


@ccclass("eventListener")
export class eventListener {
    public static getBaseClass (type:string) {
        return oneToOneListener;
    }
}
