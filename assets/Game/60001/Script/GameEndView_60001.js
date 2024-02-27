cc.Class({
    extends: cc.BaseClass,

    properties: {},
    ctor: function () {

    },
    // use this for initialization
    onLoad: function () {
        this.m_pRoomEnd = null;
        this.m_dwCreaterID = -1;
    },

    SetCreateID:function(dwCreaterID){
        this.m_dwCreaterID = dwCreaterID;
    },

    SetEndInfo(pRoomEnd) {
        this.m_pRoomEnd = pRoomEnd;
        if (this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndUserInfo_' + GameDef.KIND_ID);

        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if (pRoomEnd.UserID[i] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, pRoomEnd, this.m_dwCreaterID]);
        }
    },

    //分享信息
    GetShareInfo: function () {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pRoomEnd.UserID[i] == null) continue;
            if (ShareInfo.desc != '') ShareInfo.desc += '/'
            ShareInfo.desc += '【' + g_GlobalUserInfo.m_UserInfoMap[this.m_pRoomEnd.UserID[i]].NickName + '】';
            ShareInfo.desc += (this.m_pRoomEnd.llTotalScore[i] >= 0 ? '+' : '') + this.m_pRoomEnd.llTotalScore[i];
        }
        ShareInfo.link = window.SHARE_URL
        return ShareInfo;
    },
});
