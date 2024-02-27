cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_JetPre:cc.Prefab,
    },

    ctor:function(){
        this.m_JetPool = new cc.NodePool('JetPool');    //回收池
        this.m_TableJet = new Array();                  //桌面筹码
        this.m_GuoCenterPos = cc.v2(0,0);
    },

    init:function(userInfoPosArr,userInfoSizeArr,userJetPosArr,widthMul,heightMul)
    {
        this.m_userInfoPosArr = userInfoPosArr;
        this.m_userInfoSizeArr = userInfoSizeArr;
        this.m_userJetPosArr = userJetPosArr;

        if (widthMul == undefined || widthMul == null) widthMul = 30;
        this.widthMul = Math.abs(widthMul);
        
        if (heightMul == undefined || heightMul == null) heightMul = 30;
        this.heightMul = Math.abs(heightMul);
    },

    initTableRect:function(centerPos, Width, Height)
    {
        this.m_CenterPos = centerPos;
        this.RandomW = Width;
        this.RandomH = Height;
    },

    initGuoCenterPos:function(centerPos)
    {
        this.m_GuoCenterPos = centerPos;
    },
////////////////////////////////////////// view 桌面金币
    //桌面筹码随机坐标
    GetTableRandomPos:function (){
        var Pos = cc.v2(0,0);
        Pos.x = this.m_CenterPos.x + parseInt(Math.random() * 123321) % (this.RandomW*2) - this.RandomW;
        Pos.y = this.m_CenterPos.y + parseInt(Math.random() * 123321) % (this.RandomH*2) - this.RandomH;
        return Pos;
    },

    //玩家筹码随机坐标
    GetRandomPos:function(ViewID){
        var mulX = parseInt(Math.random() * this.widthMul * 2) - this.widthMul;
        var mulY = parseInt(Math.random() * this.heightMul * 2) - this.heightMul;
        
        if(this.m_userInfoPosArr[ViewID] != null)
        {
            return cc.v2(this.m_userInfoPosArr[ViewID].x + mulX,this.m_userInfoPosArr[ViewID].y + mulY);
        }
        else
        {
            return cc.v2(0, 0);
        }
    },

    //向桌子添加金币
    Jet2Table: function (ViewID, isAni) {
        var JetNum = parseInt(Math.random() * 3 + 4);
        for (var i = 0; i < JetNum; i++) {
            var JetJs = this.GetJet();
            JetJs.setScale(2);
            if (isAni) {
                JetJs.setPosition(this.m_userInfoPosArr[ViewID]);

                var actFadeIn = cc.fadeIn(0);
                var delayAct = cc.delayTime(i * 0.05);
                var act = cc.moveTo(0.5, this.GetTableRandomPos());
                
                JetJs.stopAllActions();
                JetJs.runAction(cc.sequence(delayAct, actFadeIn, act));
            }
            else {
                JetJs.setPosition(this.GetTableRandomPos());
            }

            this.m_TableJet.push(JetJs);
        }
    },

    //筹码移出桌子
    /**
     * @param {*} ViewIDArr 获得金币的ID集合
     */
    JetOutTable:function(ViewIDArr){
        var index = 0;
        while(this.m_TableJet.length){
            for (var i=0;i<ViewIDArr.length;i++)
            {
                if (this.m_TableJet.length == 0)break;
                var JetJs = this.m_TableJet.shift();

                var delayAct = cc.delayTime(index * 0.05);
                var act = cc.moveTo(0.5, this.GetRandomPos(ViewIDArr[i]));
                var actFade = cc.fadeOut(0.5);
                
                JetJs.stopAllActions();
                JetJs.runAction(cc.sequence(delayAct,act,actFade, cc.callFunc(this.EndCallFunc, this, JetJs)));
            }
            index++;
        }
    },

////////////////////////////////////////// view 调用接口
    OnUserAdd:function (ViewID){
        var JetNum = parseInt(Math.random() * 3  + 4);
        for (var i = 0 ; i < JetNum ; i++)
        {
            var JetJs = this.GetJet();
            JetJs.setScale(1);
            JetJs.setPosition(this.m_userInfoPosArr[ViewID]);

            var actFadeIn = cc.fadeIn(0);
            var delayAct = cc.delayTime(i * 0.05);
            var act = cc.moveTo(0.5, this.m_userJetPosArr[ViewID]);
            var actFade = cc.fadeOut(0.5);
            
            JetJs.stopAllActions();
            JetJs.runAction(cc.sequence(delayAct,actFadeIn,act,actFade, cc.callFunc(this.EndCallFunc, this, JetJs)));
        }
    },

    OnUserToUserJetFly:function(startID,EndID,delayTime){
        if (delayTime == undefined || delayTime == null)delayTime = 0;

        var JetNum = parseInt(Math.random() * 5  + 8);
        for (var j = 0 ; j < JetNum ; j++)
        {
            var JetJs = this.GetJet();
            JetJs.setPosition(this.GetRandomPos(startID));
            JetJs.setScale(2);

            var actFadeIn = cc.fadeIn(0);
            var delayAct = cc.delayTime(j * 0.05 + delayTime);
            var act = cc.moveTo(0.5, this.GetRandomPos(EndID));
            var actFade = cc.fadeOut(0.5);
            
            JetJs.stopAllActions();
            JetJs.runAction(cc.sequence(delayAct,actFadeIn,act,actFade, cc.callFunc(this.EndCallFunc, this, JetJs)));
        }
    },

    OnGuoEndJetFly:function(nViewID,delayTime,isWin){
        if (delayTime == undefined || delayTime == null)delayTime = 0;
        if (isWin == undefined || isWin == null)return;

        var JetNum = parseInt(Math.random() * 5  + 8);
        for (var j = 0 ; j < JetNum ; j++)
        {
            var JetJs = this.GetJet();
            if (isWin)
                JetJs.setPosition(this.m_GuoCenterPos);
            else
                JetJs.setPosition(this.GetRandomPos(nViewID));

            JetJs.setScale(2);

            var actFadeIn = cc.fadeIn(0);
            var delayAct = cc.delayTime(j * 0.05 + delayTime);
            var act = cc.moveTo(0.5, this.GetRandomPos(nViewID));
            if (isWin)
                act = cc.moveTo(0.5, this.GetRandomPos(nViewID));
            else
                act = cc.moveTo(0.5, this.m_GuoCenterPos);

            var actFade = cc.fadeOut(0.5);
            
            JetJs.stopAllActions();
            JetJs.runAction(cc.sequence(delayAct,actFadeIn,act,actFade, cc.callFunc(this.EndCallFunc, this, JetJs)));
        }
    },

    //获取待用筹码
    GetJet:function(){
        var TempJet;
        if(this.m_JetPool.size()){
            TempJet = this.m_JetPool.get();
        }else{
            TempJet = cc.instantiate(this.m_JetPre);
        }
        this.node.addChild(TempJet);

        return TempJet;
    },
    //回收筹码
    DelJet:function(JetNode){
        JetNode.parent = null;
        this.m_JetPool.put(JetNode);
    },
    //移动完成回调
    EndCallFunc:function (node, para){
        cc.gSoundRes.PlaySound('Jet');
        this.DelJet(para);
    },
});
