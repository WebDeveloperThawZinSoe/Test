cc.Class({
    extends: cc.BaseControl,

    properties: {
    },

    ctor: function () {
    },

    start: function () {

    },

    SetEndInfo: function (pEndInfo) {
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var wPaoWang = INVALID_CHAIR;
        var cbPaoWangCount = 0;
        var lWinScore = 0;
        var cbMaxPao = 0;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pEndInfo.lTotalScore[i] > lWinScore) {
                lWinScore = this.m_pEndInfo.lTotalScore[i];
                wWinner = i;
            }
            if (this.m_pEndInfo.cbPaoCount[i] > cbMaxPao) {
                cbMaxPao = this.m_pEndInfo.cbPaoCount[i];
                wPaoWang = i;
            }
        }
        if (wPaoWang < GameDef.GAME_PLAYER) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if (this.m_pEndInfo.cbPaoCount[i] == cbMaxPao) {
                    cbPaoWangCount++;
                }
            }
            if (cbPaoWangCount > 1) wPaoWang = INVALID_CHAIR;
        }

        if (this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'TotalEndViewItem_PHZ');
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            // if (this.m_pEndInfo.dwUserID[i] == null) continue;
            if (this.m_pEndInfo.UserID[i] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, this.m_pEndInfo, wWinner, wPaoWang, this.m_pEndInfo.dwUserID[i]]);
        }
    },

    //分享信息
    GetShareInfo: function () {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            // if (this.m_pEndInfo.dwUserID[i] == null) continue;
            if (this.m_pEndInfo.UserID[i] == null) continue;
            if (ShareInfo.desc != '') ShareInfo.desc += '/'
            ShareInfo.desc += '【' + g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.dwUserID[i]].NickName + '】';
            ShareInfo.desc += (this.m_pEndInfo.lTotalScore[i] >= 0 ? '+' : '') + Score2Str(this.m_pEndInfo.lTotalScore[i]);
        }
        ShareInfo.link = cc.share.MakeLink_GameEnd();
        return ShareInfo;
    },
});
