var fActTime = 0.1;
var fDelayTime = fActTime/3;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPrefab:cc.Prefab
    },
    ctor:function(){
        this.m_StartPos = new cc.v2(0,0);
        this.m_ActCardCount = 0;
        this.m_PosArr = null;
        this.m_CardScale = 0.6;
    },
    start :function() {
        this.m_NodePool = new cc.NodePool('CardTempPool');
    },

    SetHook: function (pHook) {
        this.m_Hook = pHook;
    },

    GetCard :function(){
        var TempCard;
        if(this.m_NodePool.size()){
            TempCard = this.m_NodePool.get();
        }else{
            TempCard = cc.instantiate(this.m_cardPrefab);
        }
        this.node.addChild(TempCard);

        TempCard.anchorX = 0.5;
        TempCard.children[0].anchorX = 0.5;
        TempCard.scale = this.m_CardScale;

        TempCard.setPosition(this.m_StartPos);
        var TempCtrl = TempCard.getComponent('CardPrefab_'+GameDef.KIND_ID);
        TempCtrl.SetData(0);
        return TempCtrl;
    },

    //回收节点
    DelCard:function(node){
        node.parent = null;
        this.m_NodePool.put(node);
    },
    //基准位置
    SetBenchmarkPos:function (startPos, EndPosArr){
        this.m_StartPos = startPos;
        this.m_PosArr = EndPosArr;
    },

    PlaySendCard:function (StateArr, wStartChairID, cbCardData, cbSendCount, bPublic){
        if(!cbSendCount) cbSendCount = 1;
        for(var i = 0; i < cbSendCount; ++ i) {
            // for(var j in StateArr) {
            for(var j = 0; j < GameDef.GAME_PLAYER; ++ j) {
                var wChairID = (j + wStartChairID) % GameDef.GAME_PLAYER;
                if(!StateArr[wChairID]) continue;

                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node, wChairID, cbCardData[wChairID][i], bPublic != null ? bPublic[wChairID] : false);
            }
        }
    },

    SetNodeAct:function (node, wChairID, cbCardData, bPublic){
        this.m_ActCardCount++;
        var wViewID = this.m_Hook.SwitchViewChairID(wChairID);
        var act = cc.sequence( cc.delayTime(fDelayTime * this.m_ActCardCount), cc.moveTo(fActTime, this.m_PosArr[wViewID]));
        if(this.m_Hook.m_GameClientEngine.m_ReplayMode)
        {
            this.EndCallFunc(node, [wChairID, wViewID, cbCardData,bPublic]);
            return;
        }
        node.runAction(cc.sequence(act, cc.callFunc(this.EndCallFunc.bind(this), this, [wChairID, wViewID, cbCardData,bPublic])));
    },

    //node: TempCard.node  ; para = [wViewID, wChairID, cbCardData]
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('SendCard');
        this.DelCard(node);
        this.m_ActCardCount--;
        this.m_Hook.OnMessageDispatchFinish(para, this.m_ActCardCount);
    },

    Isplaying:function(){
        return this.m_ActCardCount > 0;
    },
});

