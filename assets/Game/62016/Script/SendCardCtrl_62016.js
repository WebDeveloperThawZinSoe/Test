var actTime = 0.2;
var delayTime = actTime/4;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPrefab:cc.Prefab
    },
    ctor:function(){
        this.m_StartPos = new cc.v2(0,0);
        this.m_CenterPos = new cc.v2(0,0);
        this.m_ActCardCount = 0;
        this.m_PosArr = null;
        this.m_CardScale = 0.45;
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
        TempCard.children[0].anchorX = 0.5;    
        TempCard.children[0].anchorY = 0.5;            
        TempCard.scale = this.m_CardScale;
        this.node.addChild(TempCard);
        TempCard.setPosition(this.m_StartPos);

        var TempCtrl = TempCard.getComponent('CardPrefab_62016');
        TempCtrl.SetData(0);
        TempCard.getChildByName('Card').active = false;
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

    PlaySendCard:function (cnt, start, bSend){  
        this.m_CardZIndex = GameDef.GAME_PLAYER * cnt;
        for(var i=0;i<cnt;i++){
            for(var j=0;j<GameDef.GAME_PLAYER;j++){
                var ChairID = (j+start)%GameDef.GAME_PLAYER;
                if(!bSend[ChairID]) continue;
                var TempCard = this.GetCard();
                this.SetNodeAct(TempCard.node, ChairID, i);
            }
        }
    },

    SetNodeAct:function (node, viewID, index){
        this.m_ActCardCount++;
      //  var act = cc.sequence( cc.delayTime((this.m_ActCardCount+(index+1)*4)*delayTime), cc.moveTo(actTime, cc.v2(0,-150)));
        var act = cc.sequence( cc.delayTime((this.m_ActCardCount)*delayTime*3), cc.callFunc(this.ShowCardFunc, this, node));
        var act2 = cc.sequence( act, cc.moveTo(actTime, this.m_CenterPos));
        var act3 = cc.sequence( cc.delayTime( delayTime), cc.moveTo(actTime*2, this.m_PosArr[viewID]));
        var act4 = cc.sequence( act2, act3);
        node.runAction(cc.sequence(act4, cc.callFunc(this.EndCallFunc.bind(this), this, [viewID, index])));
    },
    ShowCardFunc:function (Tag, node ){
        node.getChildByName('Card').active = true;
    },
    //node: TempCard.node  ; para = [this, viewID, index]
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('Card');
        this.DelCard(node);
        this.m_ActCardCount--;
        this.m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[0], para[1], this.m_ActCardCount);
    },
    Isplaying:function(){
        return this.m_ActCardCount > 0;
    },
    // update (dt) {},
});
