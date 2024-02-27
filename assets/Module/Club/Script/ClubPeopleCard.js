cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    ctor: function () {
        this.m_ScoreCnt = 0;
        this.m_PoolCnt = 0;
        this.m_LeaderID = 0;
    },
    OnShowView: function () {
        this.m_userCtrl = this.$('@UserCtrl')
        this.m_userCtrl.SetUserByID(0);
        this.m_SelClubInfo = this.m_Hook.m_SelClubInfo;
    },
    OnSetParam: function (type) {
        cc.gPreLoader.LoadRes('Image_ClubPeopleCard_' + (type == 0 ? 'T-shangjimingpian' : 'T-shezhiwodemingpian'), 'Club', function (sprFrame) {
            this.$('BGM/TPsw@Sprite').spriteFrame = sprFrame;
        }.bind(this));

        this.$('BGM/PersonalBG/LabNode').active = type == 0;
        this.$('BGM/PersonalBG/InputNode').active = type == 1;

        this.$('BtShare').active = type == 1;
        this.$('BtGiveScore').active = type == 0;

        this.$('BGM/AllienceBG/t2@Label').string = this.m_SelClubInfo.wKindID == CLUB_KIND_2?'联盟专属码':'俱乐部专属码';

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/League.php?GetMark=121&dwUserID=' + pGlobalUserData.dwUserID;
        webUrl += '&ClubID=' + this.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&type=' + type;
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            if (type == 0) {
                this.$('BGM/PersonalBG/LabNode/LWeChat@Label').string = Res['WeChat'];
                this.$('BGM/PersonalBG/LabNode/LQQ@Label').string = Res['QQ'];
            } else {
                if (Res['WeChat'][0] != '') this.$('BGM/PersonalBG/InputNode/EdWeChat@EditBox').string = Res['WeChat'];
                if (Res['QQ'][0] != '') this.$('BGM/PersonalBG/InputNode/EdQQ@EditBox').string = Res['QQ'];
                cc.share.InitShareInfo_H5_WX(this.GetShareInfo.bind(this));
            }
            this.$('BGM/AllienceBG/AllienceID@Label').string = Res['AllianceID'];
            if(!Res['UserID']){
                this.m_LeaderID = pGlobalUserData.dwUserID;
                this.m_userCtrl.SetUserByID(pGlobalUserData.dwUserID);
            }else{
                this.m_userCtrl.SetUserByID(Res['UserID']);
                this.m_LeaderID = Res['UserID'];
            }

        }.bind(this));

    },
    //
    OnBtSave: function () {
        cc.gSoundRes.PlaySound('Button');
        var WeChat = this.$('BGM/PersonalBG/InputNode/EdWeChat@EditBox').string;
        var QQ = this.$('BGM/PersonalBG/InputNode/EdQQ@EditBox').string;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/League.php?GetMark=120&dwUserID=' + pGlobalUserData.dwUserID;
        webUrl += '&ClubID=' + this.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&WeChat=' + WeChat;
        webUrl += '&QQ=' + QQ;
        WebCenter.GetData(webUrl, null, function (data) {
            var res = JSON.parse(data);
            this.ShowTips(res['Describe']);
        }.bind(this));

    },
    OnBtShare: function () {
        cc.gSoundRes.PlaySound('Button');
        var filePath = saveImage(this.node);
        //this.ShowAlert(filePath);
        if(filePath!='') {
            ThirdPartyShareImg(filePath);
        }else{
            this.ShowTips('截图保存失败');
        }
    },
    GetShareInfo:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var ShareInfo = new Object();
        ShareInfo.title = `玩游戏看这里！`;
        ShareInfo.desc = `我和我身边的朋友都在玩的竞技平台，快来一展身手！`;
        ShareInfo.imgUrl = `${window.PHP_HOME}/share.jpg`;
        // if (cc.sys.isNative) {
        //     ShareInfo.link = window.SHARE_URL
        // } else {
        // }
        ShareInfo.link = cc.share.MakeLink_InviteClub(this.m_Hook.m_SelClubInfo.wKindID, this._dwAllianceID, cc.share.Mode.ToH5);
        return ShareInfo;
    },
    OnBtSaveImg: function () {
        cc.gSoundRes.PlaySound('Button');
        var bg = this.$('BGM')
        this.ShowTips(saveImage(bg)!=''?'保存成功!':'保存失败');
    },
    OnBtGiveScore:function(){
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=12&dwUserID='+this.m_LeaderID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserInfo = JSON.parse(data);
            if(UserInfo.UserID == null){
                return this.m_Hook.ShowTips('差无此人');
            }else{
                this.ShowPrefabDLG('ClubSendScore',null,function(Js){

                    Js.OnSetLeaderID(UserInfo.GameID);
                }.bind(this));
            }
        }.bind(this));
    },
    OnGiveScore:function(UserID, Type, Score,Remark){
        this.m_Hook.OnGiveScore(UserID, Type, Score,Remark);
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
