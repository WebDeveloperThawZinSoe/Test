var actTime = 0.2;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NdJet:cc.Node,
    },

    ctor:function(){
        this.m_JetArr = new Array();                   //回收池
        this.m_WaitArr = new Array();                   //动作队列
        this.m_ActJetCount = 0;                         //移动中数量
    },

////////////////////////////////////////// view 调用接口

    //筹码移出桌子 bGet
    JetMoveAni:function(wBanker, wUserArr, bGet){
        if( this.m_ActJetCount > 0){
            this.m_WaitArr.push([wBanker, wUserArr, bGet]);
            return
        }

        for(var i=0;i<5;i++){
            for(var j in wUserArr){
                var NdJet = this.GetJet(wUserArr[j]*5 + i);
                NdJet.setPosition(this.m_UserPos[bGet?wUserArr[j]:wBanker]);
                this.SetNodeAct(NdJet, i, wUserArr[j], this.m_UserPos[bGet?wBanker:wUserArr[j]])
            }
        }
    },
//////////////////////////////////////////

    //获取待用筹码
    GetJet:function(index){
        if(this.m_JetArr[index] == null){
            this.m_JetArr[index] = cc.instantiate(this.m_NdJet);
            this.node.addChild(this.m_JetArr[index]);
        }
        this.m_JetArr[index].getChildByName('spGold').active = false;
        return this.m_JetArr[index];
    },
  
    //桌面筹码基准点和范围
    SetBenchmarkPos:function (centerPos, Width, Height){
        this.m_CenterPos = centerPos;
        this.RandomW = Width;
        this.RandomH = Height;
    },
    //筹码飞出坐标
    SetUserPos:function (PosArr){
        this.m_UserPos = PosArr;
    },

    //筹码移动动作
    SetNodeAct:function (node, turn ,ViewID, ePos){
        this.m_ActJetCount++;
   
        var act = cc.sequence(cc.delayTime(turn*0.1), cc.callFunc(this.ShowSprite, this, node) );
        var act2 = cc.sequence(cc.moveTo(0.2, ePos), cc.callFunc(this.EndCallFunc, this, [ViewID, turn]) );
        node.runAction(cc.sequence(act, act2));
    },
    ShowSprite:function (node){
        node.getChildByName('spGold').active = true;
    },
    //移动完成回调  ViewID, turn
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('Jet');
        node.getChildByName('spGold').active = false;
        this.m_ActJetCount--;

        if(this.m_ActJetCount == 0){
            if( this.m_WaitArr.length > 0){
                var Para = this.m_WaitArr.shift();
                this.JetMoveAni(Para[0], Para[1], Para[2]);
            }
        }
    },

    // update (dt) {},
});
