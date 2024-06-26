const {ccclass, property} = cc._decorator;

@ccclass("poolManager")
export class poolManager {
    dictPool: { [name: string]: cc.NodePool }= {}
    dictPrefab: { [name: string]: cc.Prefab } = {}

    static _instance: poolManager;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new poolManager();
        return this._instance;
    }

    /**
     * 
     */
    getNode (prefab: cc.Prefab, parent: cc.Node) {
        let name = prefab.data.name;
        this.dictPrefab[name] = prefab;
        let node: cc.Node;
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get()!;
            } else {
                node = cc.instantiate(prefab);
            }
        } else {
            let pool = new cc.NodePool();
            this.dictPool[name] = pool;

            node = cc.instantiate(prefab);
        }

        node.parent = parent;
        return node;
    }

    /**
     * 
     */
    putNode (node: cc.Node) {
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            pool = this.dictPool[name];
        } else {
            pool = new cc.NodePool();
            this.dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * 
     */
    clearPool (name: string) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
