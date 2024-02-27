var NodePool = cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.m_NodePool = new cc.NodePool();
        this.m_PoolArr = new Array();
    },

    onLoad() {},

    start() {},

    setNode: function (node, attribute) {
        if (node == null) {
            // console.warn('Node set Pool Node is null');
        }
        this.m_NodePre = node;
        this.m_Attribute = attribute ? attribute : cc.Node;
    },

    getNode: function () {
        var node = this.m_NodePool.get();
        if (node == null) {
            node = cc.instantiate(this.m_NodePre);
            this.m_PoolArr.push(node);
        }
        return node.getComponent(this.m_Attribute);
    },

    removeAllNode: function () {
        for (var i in this.m_PoolArr) {
            this.m_PoolArr[i].parent = null;
            this.m_NodePool.put(this.m_PoolArr[i]);
        }
        this.PoolArr = new Array();
    },
    // update (dt) {},
});