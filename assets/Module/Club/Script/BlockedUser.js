
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },


    onLoad: function () {

    },

    start: function () {

    },

    OnShowView: function() {

    },

    Refresh: function() {

        if(!this.m_ListCtrl) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'BlockedUserItem', this);

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl =`${window.PHP_HOME}/League.php?&GetMark=118&dwClubID=${this.m_Hook.m_SelClubInfo.dwClubID}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            var UserMap = JSON.parse(data);
            for(var i = 0; i < UserMap.length;i++){
                this.m_ListCtrl.InsertListInfo(0, {Index: i,Info: UserMap[i]});
            }

        }.bind(this));
    },

    OnClicked_AddUser: function() {
        cc.gSoundRes.PlaySound('Button');
        var pEdit = this.$('EditBox@EditBox');
        if(!pEdit) return;
        if(pEdit.string.length == 0) return this.ShowTips('请输入玩家ID!');
        this.OnSetBlocked({ClubID:this.m_Hook.m_SelClubInfo.dwClubID, UserID: pEdit.string}, 1);
    },

    OnSetBlocked: function(Info, Blocked) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl =`${window.PHP_HOME}/League.php?&GetMark=119&dwClubID=${Info.ClubID}`;
        webUrl += `&dwUserID=${pGlobalUserData.dwUserID}&dwTarID=${Info.UserID}&Blocked=${Blocked ? 1 : 0}`
        WebCenter.GetData(webUrl, 0, function (data) {
            var Res = JSON.parse(data);
            if(Res.Res == 0) {
                this.ShowAlert(Res.Describe,Alert_Yes, function(Res) {
                    this.Refresh();
                }.bind(this));
            } else {
                this.ShowAlert(Res.Describe,Alert_Yes, function(Res) {
                }.bind(this));
            }
        }.bind(this));
    },

});
