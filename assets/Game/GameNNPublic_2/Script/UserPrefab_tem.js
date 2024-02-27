
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_FontArr:[cc.Font],
    },
   
    // use this for initialization
    start :function() {
        this.$('UserInfo/UserBanker').active = false;
        this.$('UserInfo2/UserBanker').active = false;
        this.$('UserInfo/StateBanker').active = false;
        this.$('UserInfo2/StateBanker').active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
        this.m_ViewStr = (this.m_ChairID != (GameDef.MYSELF_VIEW_ID + 1) % this.m_Hook.m_playerCnt && this.m_ChairID != GameDef.MYSELF_VIEW_ID - 1)?'UserInfo':'UserInfo2';
        
        this.$('UserInfo').scale = this.m_ChairID == GameDef.MYSELF_VIEW_ID?1:0.7;
        this.$('UserInfo2').scale = this.m_ChairID == GameDef.MYSELF_VIEW_ID?1:0.8;

        this.$('UserInfo').active = false;
        this.$('UserInfo2').active = false;
        this.$(this.m_ViewStr).active = true;

        this.$('UserInfo/zhuangAni').getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, this.IconZHuangAniFinish, this);
        this.$('UserInfo2/zhuangAni').getComponent(dragonBones.ArmatureDisplay).addEventListener(dragonBones.EventObject.COMPLETE, this.IconZHuangAniFinish, this);
        
        var addAni = this.$(this.m_ViewStr+'/addAni').getComponent(dragonBones.ArmatureDisplay);
        addAni.playAnimation ('newAnimation',1);
    },
    
    //庄家动画显示回调
    IconZHuangAniFinish:function (event) {
        if(event == null) return
        if( event.type == dragonBones.EventObject.COMPLETE){
            this.SetUserBankerSign();
            this.SetBankerRim(true);
            this.SetBankerSignAni();
        }
    },

    //获取适配后的坐标
    getWidgetPos:function(){
        return this.node.getPosition();
    },

    //获取庄标记的世界坐标
    GetIconBankerPos:function (){
        var pos = this.$(this.m_ViewStr+'/StateBanker').getPosition();
        var nodeScale = this.$(this.m_ViewStr).scale;
        return this.node.convertToWorldSpaceAR(cc.v2(pos.x * nodeScale,pos.y * nodeScale));
    },

    //设置用户信息
    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_pUserItem = pUserItem;
        this.m_dwUserID = pUserItem.GetUserID();
        this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
        this.$(this.m_ViewStr+'@UserCtrl').SetShowFullName(false, 4);
        this.SetUserScore(pUserItem.GetUserScore(), 0);
    },

    //用户离开
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
            this.$(this.m_ViewStr+'/Score@Label').string = '';
            this.m_pUserItem = null;
            this.node.active = false;
        }
    },

    //离线状态
    SetOffLine:function(bOffLine) {
        this.$(this.m_ViewStr+'/OffLine').active = bOffLine;
    },

    //推注状态
    SetShowAdd:function(bShow) {
        this.$(this.m_ViewStr+'/spAdd').active = bShow;
        var addAni = this.$(this.m_ViewStr+'/addAni').active = bShow;
    },

    //搓牌状态
    SetCuoPaiAni:function (bShow) {
        if (bShow == null || bShow == undefined)bShow = false;
        this.$(this.m_ViewStr+'/cuopaiAni').active = bShow;
        if (bShow)
        {
            var ani = this.$(this.m_ViewStr+'/cuopaiAni').getComponent(dragonBones.ArmatureDisplay);
            ani.playAnimation ('newAnimation');
        }
    },
    
    //边框
    SetBankerRim:function (bBanker) {
        if(bBanker == null || bBanker == undefined) bBanker = false;
        this.$(this.m_ViewStr+'/UserBanker').active = bBanker;
    },
    
    //庄标记
    SetUserBankerSign:function(bShow) {
        if (bShow == null || bShow == undefined)bShow = false;
        
        this.$(this.m_ViewStr+'/StateBanker').active = bShow;
    },
    
    //定庄动画
    SetBankerSignAni:function (bShow) {
        if (bShow == null || bShow == undefined)bShow = false;

        this.$(this.m_ViewStr+'/zhuangAni').active = bShow;
        if (bShow){
            var ani = this.$(this.m_ViewStr+'/zhuangAni').getComponent(dragonBones.ArmatureDisplay);
            ani.playAnimation ('newAnimation',1);
        }
    },

    //头像点击
    OnClick_Head:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (this.m_dwUserID == pGlobalUserData.dwUserID) {
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }

        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID, this.m_pUserItem.GetUserIP());
    },

    UpdateScore:function(pUserItem, TableScore) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore(), 0);
        }
    },

    SetUserScore:function (Score, TableScore) {
        this.$(this.m_ViewStr+'/Score@Label').string = Score2Str(Score - TableScore);
    },

    SetEndScore:function (Score) {
        //var str = Score2Str(Score);
        
        var LbScore = this.$(this.m_ViewStr + '/EndScore@Label');
        if (Score != '') {
            var str = TransitionScore(Score) + '';

            if (Score2Str(Score) <= 0) {
                if (Score = 0)
                    LbScore.font = this.m_FontArr[1];
            } else {
                if (Score > 0) str = '+' + str;
                LbScore.font = this.m_FontArr[0];
            }
            LbScore.string = str;  
        }
        else{
            LbScore.string = Score;  
        }
    },

    OnHeadFinish:function () {},
});
