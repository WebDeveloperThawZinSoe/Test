cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Editbox : cc.EditBox,
    },

    onLoad () {},

    start () {

    },

    OnBtBind : function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_Editbox.string.length < 6) {
            this.ShowTips('请输入正确的邀请码!');
            return;
        }
        g_Lobby.ShowLoading();

        var Cmd = new CMD_GP_ModifyIndividual();
        Cmd.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        Cmd.cbGender = g_GlobalUserInfo.GetGlobalUserData().cbGender;
        Cmd.szPassword = g_GlobalUserInfo.GetGlobalUserData().szPassword;
        Cmd.DataDescribe = new tagDataDescribe();
        Cmd.DataDescribe.wDataSize = window.LEN_ACCOUNTS * cc.TCHAR_SIZE;
        Cmd.DataDescribe.wDataDescribe = DTP_GP_UI_SPREADER;
        Cmd.szSpreader = this.m_Editbox.string;
        Cmd.len_szSpreader = window.LEN_ACCOUNTS * cc.TCHAR_SIZE;

        var LoginMission = new CGPLoginMission(this, MDM_GP_USER_SERVICE, SUB_GP_MODIFY_INDIVIDUAL, Cmd);
    },
    OnBindSpreaderRes: function (dwCode, strDes) {
        g_Lobby.StopLoading();
        this.m_Hook.m_CheckNewPlayer = 0;
        if (dwCode == 0) {
            this.m_Hook.ShowAlert("恭喜您成功绑定推广员!");
            this.m_Hook.OnBtRefeshRoomCard();
            this.HideView();
        } else {
            this.m_Hook.ShowAlert(strDes);
        }
    },

    // update (dt) {},
});
