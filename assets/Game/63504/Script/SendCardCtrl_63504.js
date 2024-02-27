var actTime = 0.1;
var delayTime = actTime/4;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPrefab:cc.Prefab
    },

    ctor:function(){
        this.m_StartPos = new cc.v2(0,0);
        this.m_ActCardCount = 0;
        this.m_PosArr = null;
        this.m_NodeArr = null;
        this.m_CardScale = 0.4;
    },
    
    start :function() {
        this.m_NodePool = new cc.NodePool('CardTempPool');
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
        TempCtrl.node.stopAllActions();
        TempCtrl.SetData(0);
        return TempCtrl;
    },

    //回收节点
    DelCard:function(node){
        node.parent = null;
        this.m_NodePool.put(node);
    },

    //基准位置
    SetBenchmarkPos:function (startPos,NodeArr, EndPosArr){
        this.m_StartPos = startPos;
        this.m_NodeArr = NodeArr;
        this.m_PosArr = EndPosArr;
    },

    PlaySendCard:function (dwCountDown,cbStartIndex,cbCardData){
        var iTurnIndex = 0;
        for(var i=cbStartIndex;i<GameDef.MAX_COUNT;i++){
            for(var j=0;j<GameDef.GAME_PLAYER;j++){
                var index = j;
                if(parseInt(cbCardData[index][i]) == 0) continue;
                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node,dwCountDown, iTurnIndex,i + 1, index,cbCardData[index]);
                iTurnIndex++;
            }
        }
    },

    SetNodeAct:function (node,sendTime, turn,CardCount, wChairID,cbCardData){
        this.m_ActCardCount++;  
        var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(wChairID);
        
        //console.log("SetNodeAct viewID = " + wChairID)

        var act = cc.sequence(cc.delayTime(sendTime * turn),cc.moveTo(actTime, this.node.convertToNodeSpaceAR(this.m_NodeArr[viewID].getWidgetPos())));
        node.runAction(cc.sequence(act, cc.callFunc(this.EndCallFunc.bind(this), this, [wChairID, CardCount,cbCardData])));
    },
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlayGameSound('SEND');
        this.DelCard(node);
        this.m_ActCardCount--;
        this.m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[0], para[1],para[2]);
        
        // if(window.LOG_WEB_DATA)
        // {
        //     console.log("para[0] = " + para[0])
        //     console.log("para[1] = " + para[1])
        //     console.log("para[2] = " + para[2])
        // }
    },
    Isplaying:function(){
        return this.m_ActCardCount > 0;
    },
    // update (dt) {},
});
