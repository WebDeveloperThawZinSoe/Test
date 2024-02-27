cc.Class({
    extends: cc.Component,

    properties: {
        m_CardPre: cc.Prefab,
        m_nodeSend: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:


    ctor: function() {
        this.m_NodePool = new cc.NodePool('Poker');
    },

    onLoad: function() {},

    start: function() {

    },

    _getCard: function () {
        var newNode = this.m_NodePool.get();
        if (newNode == null) {
            newNode = cc.instantiate(this.m_CardPre);
        }
        // newNode.getChildByName('Card').setScale(0.53, 0.53);
        return newNode;
    },

    _removeCard: function (node) {
        node.parent = null;
        this.m_NodePool.put(node);
    },

    sendCard: function (cbCard, pos, delay, callfunc, pra) {
        if (delay == null) delay = 0;
        var nodeCard = this._getCard();
        var js = nodeCard.getComponent('CardPrefab');
        js.SetData(cbCard);
        nodeCard.setPosition(this.m_nodeSend.getPosition());
        this.m_nodeSend.addChild(nodeCard);
        nodeCard.runAction(cc.sequence(cc.delayTime(delay),
            cc.callFunc(function () {
                // cc.gSoundRes.PlayGameSound("SENDCARD");
            }),
            cc.moveTo(0.2, pos).easing(cc.easeSineOut()),
            cc.callFunc(function () {
                this._removeCard(nodeCard);
                if (callfunc != null) callfunc(pra);
            }, this)));
        return 0.2;
    }


    // update (dt) {},
});