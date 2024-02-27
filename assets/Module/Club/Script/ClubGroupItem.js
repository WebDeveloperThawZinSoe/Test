cc.Class({
    extends: cc.BaseClass,

    properties: {},


    onLoad: function () {

    },

    start: function () {

    },

    InitPre: function () {
        this.node.active = false;
        if (!this.m_UserCtrl) {
            this.m_UserCtrl = new Array();
            this.m_BtAddUser = new Array();
            for (var i = 0; i < 9; ++i) {
                this.m_UserCtrl[i] = this.$(`UserNode/${i}/User@UserCtrl`);
                this.m_UserCtrl[i].m_Hook = this;
                this.m_BtAddUser[i] = this.$(`UserNode/${i}/BtAdd@Button`);
            }
            this.m_LabRemark = this.$('bg/LabRemark@Label');
        }

    },

    SetPreInfo: function (Param) {
        this.node.active = true;
        this.m_Index = Param.Index;
        this.m_Info = Param.Info;
        this.Refresh(this.m_Info.Remark);
    },

    Refresh: function (Remark) {
        for (var i = 0; i < 9; ++i) {
            this.m_UserCtrl[i].node.active = false;
            this.m_BtAddUser[i].node.active = false;
        }
        this.m_LabRemark.string = '';
        if (this.m_LabRemark) this.m_LabRemark.string = Remark ? Remark : this.m_Info.Remark;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=123&dwClubID=${this.m_Info.ClubID}&dwUserID=${pGlobalUserData.dwUserID}&dwGroupID=${this.m_Info.GroupID}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            var GroupMember = JSON.parse(data);
            for (var i = 0; i < GroupMember.length; i++) {
                this.m_UserCtrl[i].node.active = true;
                this.m_UserCtrl[i].SetUserByID(GroupMember[i].UserID);
            }
            this.UpdateView_AddButton();
        }.bind(this));
    },

    UpdateView_AddButton: function () {
        for (var i in this.m_UserCtrl) {
            this.m_BtAddUser[i].node.active = !this.m_UserCtrl[i].node.active;
        }
    },

    OnClicked_Remark: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_Hook && this.m_Hook.OnShowPopui) this.m_Hook.OnShowPopui(this.m_Info, 0, function (Remark) {
            this.Refresh(Remark)
        }.bind(this));
    },

    OnClicked_AddMember: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_Hook && this.m_Hook.OnShowPopui) this.m_Hook.OnShowPopui(this.m_Info, 1, function () {
            this.Refresh()
        }.bind(this));
    },

    OnUserCtrlCallback_Kick: function (UserCtrl) {
        if (!UserCtrl) return;
        if (this.m_Hook && this.m_Hook.OnDelMember) this.m_Hook.OnDelMember(this.m_Info, UserCtrl.GetUserID(), function () {
            this.Refresh()
        }.bind(this));
    },

    OnClicked_Clear: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_Hook && this.m_Hook.OnClearMember) this.m_Hook.OnClearMember(this.m_Info, function () {
            this.Refresh();
        }.bind(this));
    },


    // update (dt) {},
});
