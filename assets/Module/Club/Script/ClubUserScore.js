cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabGold:cc.Label,
        m_LbSelfScore:cc.Label,
        m_EdOpScore:cc.EditBox,
    },
    ctor:function () {

    },
    onLoad:function(){

    },

    OnShowClubUser:function(UserID, ClubID, ClubLv){
        this.m_UserID = UserID;
        this.$('UserNode@UserCtrl').SetUserByID(UserID);
        this.m_LabGold.string = 0;
        var SelfLv = this.m_Hook.m_SelClubInfo.ClubLevel;
        this.m_EdOpScore.string = '';

        this.$('BtLv3').active = SelfLv==9 && ClubLv==6;
        this.$('BtLv6').active = SelfLv==9 && ClubLv==3;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=27&dwUserID='+UserID;
        webUrl += '&dwUserID2='+pGlobalUserData.dwUserID+'&dwClubID='+ClubID
        WebCenter.GetData(webUrl, null, function (data) {
            var res = JSON.parse(data);
            if(res.dwUserID == null || res.dwUserID != this.m_UserID) return
            this.m_LabGold.string = res.Gold;
            this.m_LbSelfScore.string = res.Gold1;

            if(res.LeaderID == pGlobalUserData.dwUserID && res.LeaderID !=this.m_UserID) {
                if(ClubLv==6) this.$('BtLv3').active = true;
                if(ClubLv==3 && SelfLv>6) this.$('BtLv6').active = true;
            }
        }.bind(this));
    },
    OnClick_BtSave:function(){//0金币 1积分
        //ClubGive
        var Score = parseInt(this.m_EdOpScore.string);
        if(Score>0) {
            this.m_Hook.OnGiveScore(this.m_UserID, 1, Score);
        }else if(Score<0) {
            this.m_Hook.OnTakeScore(this.m_UserID, 1, -Score);
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
        this.HideView();
    },
    OnClickGive:function(){//0金币 1积分
        //ClubGive
        var Score = parseInt(this.m_EdOpScore.string);
        if(Score>0) {
            this.m_Hook.OnGiveScore(this.m_UserID, 1, Score);
            this.HideView();
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
    },
    OnClickTake:function(){//0金币 1积分
        //ClubTake
        var Score = parseInt(this.m_EdOpScore.string);
        if(Score>0) {
            this.m_Hook.OnTakeScore(this.m_UserID, 1, Score);
            this.HideView();
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
    },
    OnClick_BtSetLv3:function(){
        this.ShowAlert('确认取消合伙人？', Alert_All, function(Res){
            if(Res)this.OnSetUserClubLv(3)
        }.bind(this))
    },
    OnClick_BtSetLv6:function(){
        this.ShowAlert('确认设置为合伙人？', Alert_All, function(Res){
            if(Res) this.OnSetUserClubLv(6);
        }.bind(this))
    },
    OnSetUserClubLv:function(Lv){
        this.m_Hook.OnOpClubUserLv(this.m_UserID, Lv, function(){
            this.m_Hook.OnClick_Toggle();
            this.HideView();
        }.bind(this))
    },
});
