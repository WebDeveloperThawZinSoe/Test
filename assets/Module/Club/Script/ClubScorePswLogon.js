cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    ctor:function () {
        this.m_ScoreCnt = 0;
        this.m_PoolCnt = 0;
    },
    OnShowView:function () {
        this.$('EdPsw1@EditBox').string = '';
        if(CLUB_SCORE_LOGON_PSW!=0) {
            this.HideView();
            this.m_Hook.OnBtShowDlg(null,'ClubScoreRecord');
        }
        
    },
    //登录
    OnClick_Logon:function(){
        cc.gSoundRes.PlaySound('Button');
        var Psw1 = this.$('EdPsw1@EditBox').string;
        if(Psw1.length!=6) return this.ShowTips('请输入6位密码！')
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?GetMark=106&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&LogonPsw='+pGlobalUserData.szPassword;
        webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&Psw='+hex_md5(Psw1);
        WebCenter.GetData(webUrl, null, function (data) {
            var Info = JSON.parse(data);
            if(Info[0]==0) {
                CLUB_SCORE_LOGON_PSW = Psw1;
                this.m_Hook.ShowPrefabDLG('ClubScoreRecord');
                this.HideView();
            }
            else{
                this.ShowAlert(Info[1]);
            }
        }.bind(this));
    },
    OnClick_Forget:function(){
        // 检查绑定手机
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=19&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            if(data == ''){
                this.ShowAlert('请先绑定手机');
                return;
            }
            this.ShowPrefabDLG('ClubChangeInSurePsw', this.node, function (Js) {
                Js.OnShowView(1);
            }.bind(this));
        }.bind(this));
        
    },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
