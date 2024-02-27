cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_IPLabel: cc.Label,
    },

    ctor: function () {
        this.m_BindPhone = null;
    },

    onLoad: function () {

    },

    start: function () {

    },

    OnShowView: function () {
        if (!this.m_LbBindPhone) this.m_LbBindPhone = this.$('UserNode/BindPhone/LbPhone@Label');
        if (!this.m_BtBind) this.m_BtBind = this.$('BtBind@Button');
        if (!this.m_BtRebind) this.m_BtRebind = this.$('BtRebind@Button');
        if (!this.m_BtRealName) this.m_BtRealName = this.$('Layout/BtRealName@Button');
        if (!this.m_BtResetPsw) this.m_BtResetPsw = this.$('Layout/BtResetPsw@Button');
        if (!this.m_BtUpload) this.m_BtUpload = this.$('BtUpload@Button');
        if (!this.m_BtChangeHead) this.m_BtChangeHead = this.$('BtChangeHead');

        this.m_LbBindPhone.string = '';
        this.m_BtBind.node.active = false;
        this.m_BtRebind.node.active = false;
        this.m_BtRealName.node.active = false;
        this.m_BtResetPsw.node.active = false;
        var platform = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
        this.m_BtUpload.node.active = (platform != window.PLATFORM_WX);

        this.m_BindPhone = null;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        // 检查绑定手机
        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=19&dwUserID=' + pGlobalUserData.dwUserID;
        g_CurScene.ShowLoading();
        WebCenter.GetData(webUrl, 3, function (data) {
            g_CurScene.StopLoading();
            if (data == "") {
                this.m_LbBindPhone.string = '未绑定';
                this.m_BtBind.node.active = true;
            } else {
                this.m_LbBindPhone.string = cutPhone(data);
                this.m_BindPhone = data;
                this.m_BtRebind.node.active = true;
            }
            this.m_BtRealName.node.active = true;
            this.m_BtResetPsw.node.active = (platform != window.PLATFORM_WX);
            this.m_BtChangeHead.active = (platform != window.PLATFORM_WX);
        }.bind(this));
    },

    SetInfo: function (userid, IP,Gold) {
        this.$("UserNode@UserCtrl").SetUserByID(userid);
        this.m_IPLabel.string = IP;
        this.$("UserNode/Gold/gold@Label").string = Gold;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Addr1 = g_GlobalUserInfo.GetUserAddress(pGlobalUserData.dwUserID);
        this.$('UserNode/Adress/adress@Label').string = Addr1.string;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl2 = window.PHP_HOME + '/UserFunc.php?&GetMark=18&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl2, 10, function (data) {
            var res = JSON.parse(data);
            this.$('UserNode/JuShu/juShu@Label').string = res.GameCnt;
            this.$('UserNode/Time/Time@Label').string = res.Time;
            //this.OnChangeTex(res.GameCnt);
        }.bind(this));
    },

    OnClicked_Bind: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG("BindPhone", this.node, function (Js) {
            Js.SetBindMode(true);
        }.bind(this));
    },

    OnClicked_Rebind: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG("BindPhone", this.node, function (Js) {
            Js.SetBindMode(false);
        }.bind(this));
    },

    OnBindSuccess: function (NewPhone) {
        this.m_LbBindPhone.string = cutPhone(NewPhone);
        this.m_BindPhone = NewPhone;
    },

    OnClicked_RealName: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('RealAuth', this.node);
    },

    OnClicked_ResetPsw: function () {
        cc.gSoundRes.PlaySound('Button');
        if (!this.CheckBindPhone()) return;
        this.ShowPrefabDLG('ChangePsw', this.node, function (Js) {
            Js.OnShowView(1);
        }.bind(this));
    },

    OnClicked_UpLoad: function() {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        ThirdPartyPickImg({
            Mark: 1,
            Type: 1,
            UserID: pGlobalUserData.dwUserID,
        }, '0');
    },
    OnClicked_ChangeHead:function()
    {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ChangeHead', this.node);
    },

    CheckBindPhone: function () {
        if (!this.m_BindPhone) {
            this.ShowAlert('请先绑定手机号!', Alert_YesNo, function (Res) {
                if (Res) {
                    this.ShowPrefabDLG("BindPhone", this.node, function (Js) {
                        Js.SetBindMode(true);
                    }.bind(this));
                }
            }.bind(this));
            return false;
        }
        return true;
    },

    OnUpload_Finish: function(){
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        this.$("UserNode@UserCtrl").SetUserByID(pGlobalUserData.dwUserID, true);
    },

    OnBtShowDlg:function(Tag, Data) {
        if(!cc.gPreLoader.Exist_Prefab(Data, Data)) return;
        this.ShowPrefabDLG(Data,this.node);
    },
    OnChangeHeadFinish:function()
    {
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        this.m_Hook.m_MeUserCtrl.SetUserByID(pGlobalUserData.dwUserID, true);
        this.$("UserNode@UserCtrl").SetUserByID(pGlobalUserData.dwUserID, true);
    },
});
