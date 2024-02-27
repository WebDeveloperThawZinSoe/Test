cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_AddGroup: cc.Node,
        m_Popui: cc.Node,
        m_Title: [cc.Node],
        m_EditBox: [cc.EditBox],
    },

    onLoad: function () {
        this.m_Popui.active = false;
        this.m_GroupList = new Array();
    },

    start: function () {

    },

    OnShowView: function () {

    },

    Refresh: function () {
        if (!this.m_ListCtrl) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubGroupItem', this);
        this.m_AddGroup.zIndex = 1000;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=122&dwClubID=${this.m_Hook.m_SelClubInfo.dwClubID}&dwUserID=${pGlobalUserData.dwUserID}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            var GroupList = JSON.parse(data);
            this.m_GroupList = new Array();
            for (var i = 0; i < GroupList.length; i++) {
                this.m_ListCtrl.InsertListInfo(0, {
                    Index: i,
                    Info: GroupList[i]
                });
                this.m_GroupList[i] = clone(GroupList[i]);
            }
        }.bind(this));
    },

    OnClicked_ClearEmptyGroup: function(){
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=130&dwClubID=${this.m_Hook.m_SelClubInfo.dwClubID}&dwUserID=${pGlobalUserData.dwUserID}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            var Res = JSON.parse(data);
            if (Res.Res == 0) {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {
                    this.Refresh();
                }.bind(this));
            } else {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {}.bind(this));
            }
        }.bind(this));
    },

    OnClicked_AddGroup: function () {
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=127&dwClubID=${this.m_Hook.m_SelClubInfo.dwClubID}&dwUserID=${pGlobalUserData.dwUserID}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            var GroupInfo = JSON.parse(data);
            this.m_ListCtrl.InsertListInfo(0, {
                Index: this.m_GroupList.length,
                Info: GroupInfo
            });
            this.m_GroupList[this.m_GroupList.length] = clone(GroupInfo);
        }.bind(this));
    },

    OnClicked_PopuiHide: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_Popui.active = false;
    },

    OnClicked_PopuiSure: function () {
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (this.m_PopType == 0) { // 修改备注
            var str = this.m_EditBox[0].string;
            if (str.length == 0) return this.ShowTips('请输入备注!');
            var webUrl = `${window.PHP_HOME}/League.php?&GetMark=126&dwClubID=${this.m_PopInfo.ClubID}`;
            webUrl += `&dwGroupID=${this.m_PopInfo.GroupID}&dwUserID=${pGlobalUserData.dwUserID}&szRemark=${str}`
            WebCenter.GetData(webUrl, 0, function (data) {
                var Res = JSON.parse(data);
                if (Res.Res == 0) {
                    this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {
                        if (this.m_PopCallback) this.m_PopCallback(str);
                    }.bind(this));
                } else {
                    this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {}.bind(this));
                }
            }.bind(this));
        } else if (this.m_PopType == 1) { // 添加成员
            var str = this.m_EditBox[1].string;
            if (str.length == 0) return this.ShowTips('请输入玩家ID!');
            var webUrl = `${window.PHP_HOME}/League.php?&GetMark=124&dwClubID=${this.m_PopInfo.ClubID}`;
            webUrl += `&dwGroupID=${this.m_PopInfo.GroupID}&dwUserID=${pGlobalUserData.dwUserID}&dwTarID=${str}`
            WebCenter.GetData(webUrl, 0, function (data) {
                var Res = JSON.parse(data);
                if (Res.Res == 0) {
                    this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {
                        if (this.m_PopCallback) this.m_PopCallback();
                    }.bind(this));
                } else {
                    this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {}.bind(this));
                }
            }.bind(this));
        }
        this.m_Popui.active = false;
    },

    OnShowPopui: function (Info, Type, Callback) {
        this.m_PopInfo = Info;
        this.m_PopType = Type;
        this.m_PopCallback = Callback;
        for (var i in this.m_Title) {
            this.m_Title[i].active = i == Type;
            this.m_EditBox[i].node.active = i == Type;
            this.m_EditBox[i].string = '';
        }
        this.m_Popui.x = 0;
        this.m_Popui.y = 0;
        this.m_Popui.active = true;
    },

    OnDelMember: function (Info, TarID, Callback) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=125&dwClubID=${Info.ClubID}`;
        webUrl += `&dwGroupID=${Info.GroupID}&dwUserID=${pGlobalUserData.dwUserID}&dwTarID=${TarID}`
        WebCenter.GetData(webUrl, 0, function (data) {
            var Res = JSON.parse(data);
            if (Res.Res == 0) {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {
                    if (Callback) Callback();
                }.bind(this));
            } else {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {}.bind(this));
            }
        }.bind(this));
    },

    OnClearMember: function (Info, Callback) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=128&dwClubID=${Info.ClubID}`;
        webUrl += `&dwGroupID=${Info.GroupID}&dwUserID=${pGlobalUserData.dwUserID}`
        WebCenter.GetData(webUrl, 0, function (data) {
            var Res = JSON.parse(data);
            if (Res.Res == 0) {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {
                    if (Callback) Callback();
                }.bind(this));
            } else {
                this.ShowAlert(Res.Describe, Alert_Yes, function (Res) {}.bind(this));
            }
        }.bind(this));

    }
});
