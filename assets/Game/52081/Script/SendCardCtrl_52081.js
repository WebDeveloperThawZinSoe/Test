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
        this.m_PosArr = null;
        this.m_CardScale = 1;
        this.m_CardArr = new Array();
       // this.m_CardScale = 0.4;
    },
    start :function() {
        //this.m_NodePool = new cc.NodePool('CardTempPool');
    },  
    StopAni:function() {
        for(var i in this.m_CardArr){
            if(this.m_CardArr[i] && this.m_CardArr[i].node.active){
                this.m_CardArr[i].node.stopAllActions();
                this.m_CardArr[i].node.active = false;
            }
        }
        this.m_ActCardCount = 0;
    },  
    GetCard :function(wIndex){
        if(this.m_CardArr[wIndex] == null){
            this.m_CardArr[wIndex] = cc.instantiate(this.m_cardPrefab).getComponent('CardPrefab_'+GameDef.KIND_ID);
            this.node.addChild(this.m_CardArr[wIndex].node);
        }
        this.m_CardArr[wIndex].node.active = true;
        this.m_CardArr[wIndex].node.children[0].anchorX = 0.5;   
        this.m_CardArr[wIndex].node.scale = this.m_CardScale;
        this.m_CardArr[wIndex].node.setPosition(this.m_StartPos);
        this.m_CardArr[wIndex].SetData(0);
        return this.m_CardArr[wIndex];
    },
    //基准位置
    SetBenchmarkPos:function (startPos, EndPosArr,playerCnt){
        this.m_StartPos = startPos;
        this.m_PosArr = EndPosArr;
        this.m_playerCnt = playerCnt;
    },

    PlaySendCard:function (cnt, State){  
        
        for(var j=0;j<this.m_playerCnt;j++){
            for(var i=0;i<cnt;i++){
                //if(!StateArr[j]) continue;
                var viewID = (j+State)%this.m_playerCnt;
                var TempCard = this.GetCard(viewID*this.m_playerCnt+i);
                this.SetNodeAct(TempCard.node, i,viewID,j);
            }
        }
    },
    SetNodeAct:function (node, turn, wChairID,j){
        this.m_ActCardCount++;  
        var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(wChairID);
        var act = cc.sequence( cc.delayTime(actTime*((j+1)*this.m_playerCnt+turn)*0.2), cc.moveTo(actTime, this.m_PosArr[viewID]));
        node.runAction(cc.sequence(act, cc.callFunc(this.EndCallFunc.bind(this), this, [wChairID, turn,j])));
    },
        //node: TempCard.node  ; para = [viewID, index]
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('Card');
        node.active = false;
        this.m_ActCardCount--;
        this.m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[0], para[1],para[2] ,this.m_ActCardCount);
    },
    Isplaying:function(){
        return this.m_ActCardCount > 0;
    },
    // SetNodeAct:function (node, turn, wChairID){
    //     this.m_ActCardCount++;  
    //     var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(wChairID);
    //     var act1 = cc.spawn( cc.scaleTo(actTime, 1), cc.moveTo(actTime, this.m_PosArr[viewID]));
    //     var act2 = cc.sequence( cc.delayTime(actTime*((turn+1)*GameDef.GAME_PLAYER+wChairID)*0.2), act1);
    //     node.runAction(cc.sequence(act2, cc.callFunc(this.EndCallFunc.bind(this), this, [wChairID, turn])));
    // },
    // //node: TempCard.node  ; para = [wChairID, index]
    // EndCallFunc:function (node, para){
    //     cc.gSoundRes.PlaySound('Card');
    //     this.DelCard(node);
    //     this.m_ActCardCount--;
    //     this.m_Hook.m_GameClientEngine.OnMessageDispatchFinish(para[0], para[1], this.m_ActCardCount);
    // },
    
    // update (dt) {},
});
