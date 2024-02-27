var actTime = 0.2;
var delayTime = actTime/4;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPrefab:cc.Prefab
    },
    ctor:function(){
        this.m_StartPos = new cc.v2(0,0);
        this.m_ActCardCount = 0;
        this.m_PosArr= null;
        this.m_CardScale = 0.54;
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
        TempCard.scale = this.m_CardScale;
        this.node.addChild(TempCard);
        TempCard.setPosition(this.ChangeCardPos(this.m_StartPos));

        var TempCtrl = TempCard.getComponent('CardPrefab');
        TempCtrl.SetData(0);
        TempCtrl.SetBanker(false);
        TempCard.getChildByName('Card').active = false;
        return TempCtrl;
    },
    //左下对其点换算中心对齐坐标
    ChangeCardPos:function(Pos){
        return cc.v2(Pos.x - CARD_WIGTH/2*this.m_CardScale, Pos.y - CARD_HEIGHT/2*this.m_CardScale);
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

    PlaySendCard:function (cnt, start){
        for(var i=0;i<cnt;i++){
            for(var j=0;j<GameDef.GAME_PLAYER;j++){
                var viewID = (j+start)%GameDef.GAME_PLAYER;
                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node, viewID, i);
            }
        }
    },

    PlaySendCard33301:function (cnt, start,cbPlayStatus){       
        for(var i=0;i<cnt;i++){
            for(var j=0;j<2;j++){
                var viewID = (j+start)%2;               
                if(!cbPlayStatus[viewID])continue;
                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node, viewID, i);
            }
        }
    },

    SetNodeAct:function (node, viewID, index){
        this.m_ActCardCount++;
        var act = cc.sequence( cc.delayTime(this.m_ActCardCount*delayTime), cc.callFunc(this.ShowCardFunc, this, node) );
        var act2 = cc.sequence( act, cc.moveTo(actTime, this.ChangeCardPos(this.m_PosArr[viewID])));
        node.runAction(cc.sequence(act2, cc.callFunc(this.EndCallFunc, this, [this, viewID, index])));
    },
    ShowCardFunc:function (Tag, node ){
        node.getChildByName('Card').active = true;
    },
    //node: TempCard.node  ; para = [this, viewID, index]
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('SendCard');
        para[0].DelCard(node);
        para[0].m_ActCardCount--;
        para[0].m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[1], para[2], para[0].m_ActCardCount);
    },
    Isplaying:function(){
        return this.m_ActCardCount > 0;
    },
    // update (dt) {},
});
