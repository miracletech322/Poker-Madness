const {ccclass, property} = cc._decorator;
import { oneToMultiListener } from "./oneToMultiListener";

@ccclass
export class clientEvent extends oneToMultiListener {
    static handlers = {};
}
