var actTime = 0.2;
var delayTime = actTime / 4;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPrefab: cc.Prefab
    },

    ctor: function () {
        this.m_StartPos = new cc.v2(0, 0);
        this.m_ActCardCount = 0;
        this.m_PosArr = null;
        this.m_CardScale = 0.65;
    },

    start: function () {
        this.m_NodePool = new cc.NodePool('CardTempPool');
    },

    GetCard: function () {
        var TempCard;
        if (this.m_NodePool.size()) {
            TempCard = this.m_NodePool.get();
        } else {
            TempCard = cc.instantiate(this.m_cardPrefab);
        }
        this.node.addChild(TempCard);

        TempCard.anchorX = 0.5;
        TempCard.children[0].anchorX = 0.5;
        TempCard.scale = this.m_CardScale;

        TempCard.setPosition(this.m_StartPos);
        var TempCtrl = TempCard.getComponent('CardPrefab_PHZ');
        TempCtrl.SetData(0);
        return TempCtrl;
    },

    //回收节点
    DelCard: function (node) {
        node.parent = null;
        this.m_NodePool.put(node);
    },
    //基准位置
    SetBenchmarkPos: function (startPos, EndPosArr) {
        this.m_StartPos = startPos;
        this.m_PosArr = EndPosArr;
    },

    PlaySendCard: function (cnt, StateArr) {
        for (var i = 0; i < cnt; i++) {
            for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                if (!StateArr[j]) continue;
                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node, i, j);
            }
        }
    },

    SetNodeAct: function (node, turn, wChairID) {
        this.m_ActCardCount++;
        var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(wChairID);
        var act = cc.sequence(cc.delayTime(actTime * ((turn + 1) * GameDef.GAME_PLAYER + wChairID) * 0.2), cc.moveTo(actTime, this.m_PosArr[viewID]));
        node.runAction(cc.sequence(act, cc.callFunc(this.EndCallFunc.bind(this), this, [wChairID, turn])));
    },
    //node: TempCard.node  ; para = [this, viewID, index]
    EndCallFunc: function (node, para) {
        cc.gSoundRes.PlaySound('Card');
        this.DelCard(node);
        this.m_ActCardCount--;
        this.m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[0], para[1], this.m_ActCardCount);
    },
    Isplaying: function () {
        return this.m_ActCardCount > 0;
    },
    // update (dt) {},
});
