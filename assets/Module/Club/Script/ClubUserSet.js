cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabGold:cc.Label,
        m_UserNode:cc.Node,
        m_BtSetLv8:cc.Node,
        m_BtDelLv8:cc.Node,
        //m_BtSetLv7:cc.Node,
        //m_BtDelLv7:cc.Node,
        m_BtLvDel:cc.Node,

        m_LbSelfScore:cc.Label,
        m_EdOpScore:cc.EditBox,

        m_NdBtGive:cc.Node,
        m_NdBtTake:cc.Node,
    },
    ctor:function () {
        this.m_UserArr = new Array();
        this.m_UserCnt = 0;
    },
    onLoad:function(){
        this.m_UserCtrl = this.m_UserNode.getComponent("UserCtrl");
    },

    OnShowClubUser:function(UserID, Lv, ClubID){
        this.m_UserID = UserID;
        this.m_UserCtrl.SetUserByID(UserID);
        this.m_UserLv = Lv;
        this.m_LabGold.string = 0;
        var SelfLv = this.m_Hook.m_SelClubInfo.ClubLevel;
        //管理员权限
        this.m_BtSetLv8.active = SelfLv >= 9 && Lv < 7;
        this.m_BtDelLv8.active = SelfLv >= 9 && Lv == 8;
        //合伙人权限
        //this.m_BtSetLv7.active = SelfLv >= 8 && Lv < 7;
        //this.m_BtDelLv7.active = SelfLv >= 8 && Lv == 7;
        //移出俱乐部
        this.m_BtLvDel.active = SelfLv >= 8 && Lv<SelfLv;
        //下分
        this.m_NdBtTake.active = SelfLv >= 7;



        this.m_EdOpScore.string = '0';

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=27&dwUserID='+UserID;
        webUrl += '&dwUserID2='+pGlobalUserData.dwUserID+'&dwClubID='+ClubID
        WebCenter.GetData(webUrl, null, function (data) {
            var res = JSON.parse(data);
            if(res.dwUserID == null || res.dwUserID != this.m_UserID) return
            this.m_LabGold.string = res.Gold;
            this.m_LbSelfScore.string = res.Gold1;

        }.bind(this));
    },


    OnBtSetLv0:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,0,OPERATE_CODE_SET);
        this.HideView();
    },
    OnBtSetLv8:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,8,OPERATE_CODE_SET);
        this.HideView();
    },
    OnBtSetLv7:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,7,OPERATE_CODE_SET);
        this.HideView();
    },
    OnBtSetLv3:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,3,OPERATE_CODE_SET);
        this.HideView();
    },
    OnBtSetLvUp:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,this.m_UserLv+1,OPERATE_CODE_SET);
        this.HideView();
    },
    OnBtSetLvDown:function(){
        if(this.m_UserLv <= 3){
            this.m_Hook.ShowAlert('用户是普通成员，无法降级！');
        }else{
            this.m_Hook.OnOpClubUserLv(this.m_UserID,this.m_UserLv-1,OPERATE_CODE_SET);
        }

        this.HideView();
    },
    OnClickGive:function(){//0金币 1积分
        //ClubGive
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //if(pGlobalUserData.dwUserID == this.m_UserID) return this.m_Hook.ShowTips('不要闹！');
        var Score = parseInt(this.m_EdOpScore.string);
        if(Score>0) {
            this.m_Hook.OnGiveScore(this.m_UserID, 1, Score);
            this.HideView();
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
    },
    OnClickTake:function(){//0金币 1积分
        //ClubGive
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //if(pGlobalUserData.dwUserID == this.m_UserID) return this.m_Hook.ShowTips('不要闹！');
        var Score = parseInt(this.m_EdOpScore.string);
        if(Score>0) {
            this.m_Hook.OnTakeScore(this.m_UserID, 1, Score);
            this.HideView();
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
    },

});
