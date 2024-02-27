var actTime = 0.2;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_JetPre:cc.Prefab,
    },

    ctor:function(){
        this.m_JetValue = new Array( 10, 5, 2, 1); //筹码数值
        this.m_JetPool = new cc.NodePool('JetPool');    //回收池
        this.m_WaitArr = new Array();                   //动作队列
        this.m_WaitDelArr = new Array();                //等待删除队列
        this.m_reSetCnt = 0;                           //绘制上限   
        this.m_ActJetCount = 0;                         //移动中数量
        this.m_TableJet = new Array();                  //桌面筹码
        for(var i in this.m_JetValue){
            this.m_TableJet[this.m_JetValue[i]] = new Array();
        }
        this.m_lTableScore = 0;
    },

////////////////////////////////////////// view 调用接口
    OnUserAdd:function (wChair, Score){
        this.Jet2Table(wChair, Score);
        //无动画立刻刷新
        if(wChair == INVALID_CHAIR) this.UpdateTableScore();
    },
    OnUserGet:function (wChair, Score){
        if( this.m_ActJetCount > 0){
            this.m_WaitArr.push(['JetOutTable', wChair, Score]);
        }else{
            this.JetOutTable(wChair, Score);
        }
        //无动画立刻刷新
        if(wChair == INVALID_CHAIR) this.UpdateTableScore();
    },
    OnGameSetScore:function (Score){
        if( this.m_ActJetCount > 0){
            this.m_WaitArr.push(['SetTableJet', Score, null]);
        }else{
            this.SetTableJet(Score);
        }
    },
//////////////////////////////////////////

    //获取待用筹码
    GetJet:function(value){
        var TempJet;
        if(this.m_JetPool.size()){
            TempJet = this.m_JetPool.get();
        }else{
            TempJet = cc.instantiate(this.m_JetPre);
        }
        this.node.addChild(TempJet);

        var js = TempJet.getComponent('JetPre');
        js.SetJet(value);
        this.m_TableJet[value].push(js);
        return js;
    },
    //回收筹码
    DelJet:function(JetNode){
        JetNode.parent = null;
        this.m_JetPool.put(JetNode);
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
    //桌面筹码随机坐标
    GetRandomPos:function (){
        var Pos = cc.v2(0,0);
        Pos.x = this.m_CenterPos.x + parseInt(Math.random() * 123321) % (this.RandomW*2) - this.RandomW;
        Pos.y = this.m_CenterPos.y + parseInt(Math.random() * 123321) % (this.RandomH*2) - this.RandomH;
        return Pos;
    },
    //筹码移动动作
    SetNodeAct:function (node, ePos){
        this.m_ActJetCount++;
        var act = cc.sequence(cc.moveTo(actTime, ePos), cc.callFunc(this.EndCallFunc, this, this));
        node.runAction(act);
    },
   
    //向桌子添加筹码
    Jet2Table:function(wChair, Score){
        var TempScore = Score;
        for(var i in this.m_JetValue){
            while(TempScore >= this.m_JetValue[i]){
                TempScore -= this.m_JetValue[i];
                var JetJs = this.GetJet(this.m_JetValue[i]);
                if(wChair == INVALID_CHAIR){
                    JetJs.node.setPosition(this.GetRandomPos());
                }else{
                    JetJs.node.setPosition(this.m_UserPos[wChair]);
                    this.SetNodeAct(JetJs.node,this.GetRandomPos());
                }
            }
        }
    },
    //筹码移出桌子
    JetOutTable:function(wChair, Score){
        var TempScore = Score;
        for(var i in this.m_JetValue){
            while(TempScore >= this.m_JetValue[i] && this.m_TableJet[this.m_JetValue[i]].length){
                TempScore -= this.m_JetValue[i];
                var JetJs = this.m_TableJet[this.m_JetValue[i]].shift();
                if(wChair == INVALID_CHAIR){
                    this.DelJet(JetJs.node);
                }else{
                    this.SetNodeAct(JetJs.node,this.m_UserPos[wChair]);
                    this.m_WaitDelArr.push(JetJs);
                }
            }
        }
    },
    //移动完成回调
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('Jet');
        para.m_ActJetCount--;
        if( para.m_ActJetCount == 0){
            //删除筹码
            for(var i in para.m_WaitDelArr){
                para.DelJet(para.m_WaitDelArr[i].node);
            }
            para.m_WaitDelArr = new Array();
            para.UpdateTableScore();
            
            if(para.m_Hook.SetTableScore)para.m_Hook.SetTableScore(para.m_lTableScore);
            //动作队列
            if( para.m_WaitArr.length > 0){
                var obj = para.m_WaitArr.shift();
                para[obj[0]](obj[1], obj[2]);
            }else {
                para.CheckReSet();
            }  
        }
    },
    UpdateTableScore:function(){
        this.m_lTableScore = this.GetTableScore();
        if(this.m_Hook.SetTableScore)this.m_Hook.SetTableScore(this.m_lTableScore);
    },
    //当前筹码面值
    GetTableScore:function(){
        var Score = 0;
        for(var i in this.m_TableJet){
            Score += i * this.m_TableJet[i].length;
        }
        return Score;
    },
    //检查重绘
    CheckReSet:function (){
        //无需重绘
        if( this.m_reSetCnt == 0) return;
        var Cnt = 0;
        for(var i in this.m_TableJet){
            Cnt += this.m_TableJet[i].length;
        }

        if(Cnt < this.m_reSetCnt) return;
        var Score=this.GetTableScore();
        this.JetOutTable(INVALID_CHAIR, Score);
        this.Jet2Table(INVALID_CHAIR, Score);
     },

    //设置桌面筹码
    SetTableJet:function (Score){
        if(Score == this.GetTableScore()) return

        if(Score < this.GetTableScore()){
            this.JetOutTable(INVALID_CHAIR,this.GetTableScore() - Score);
        }else{
            this.Jet2Table(INVALID_CHAIR, Score - this.GetTableScore());
        }
          //无动画立刻刷新
        this.UpdateTableScore();
    },
    // update (dt) {},
});
