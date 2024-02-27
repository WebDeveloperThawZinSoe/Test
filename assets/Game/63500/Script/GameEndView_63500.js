cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_fntScore: [cc.Font],
    },
    ctor: function () {
        this.m_UserInfo = new Array();
    },

    SetEndInfo: function (pEndInfo) {
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var lWinScore = 0;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (pEndInfo.llTotalScore[i] > lWinScore) {
                lWinScore = pEndInfo.llTotalScore[i];
                wWinner = i;
            }
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndView_' + GameDef.KIND_ID);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (pEndInfo.UserID[i] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, pEndInfo, wWinner, pGlobalUserData.dwUserID == pEndInfo.UserID[i]]);
        }
    },
    //分享信息
    GetShareInfo: function () {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pEndInfo.UserID[i] == null) continue;
            if (ShareInfo.desc != '') ShareInfo.desc += '/';
            ShareInfo.desc += '【' + g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName + '】';
            ShareInfo.desc += (this.m_pEndInfo.llTotalScore[i] >= 0 ? '+' : '') + this.m_pEndInfo.llTotalScore[i];
        }
        ShareInfo.link = window.SHARE_URL;
        return ShareInfo;
    },
    OnBtGetShareText: function () {
        // var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        // var Arr = new Array(this.m_RecordID, this.m_Info[3], pGlobalUserData.dwUserID)
        // for(var i in Arr) Arr[i] = Arr[i].toString(35); 
        // var str = Arr.join('z');
        var ShareInfo = new Object();
        ShareInfo.desc = '';
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pEndInfo.UserID[i] == null) continue;
            if (ShareInfo.desc != '') ShareInfo.desc += '  /   ';
            ShareInfo.desc += '【' + g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName + '】 ';
            ShareInfo.desc += 'ID:' + g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].GameID + ' ';
            ShareInfo.desc += '分数:' + (this.m_pEndInfo.llTotalScore[i] >= 0 ? '+' : '') + this.m_pEndInfo.llTotalScore[i];
        }

        if (LOG_NET_DATA) console.log(ShareInfo.desc);
        ThirdPartyCopyClipper(ShareInfo.desc);
        this.m_Hook.ShowTips('战绩已复制到剪切板');
        return ShareInfo.desc;

    },
/////////////////////////////////////////////////////////////////////// 
//pre
    InitPre: function () {

    },
    SetPreInfo: function (ParaArr) {
        this.SetUserEndInfo(ParaArr[0], ParaArr[1], ParaArr[2], ParaArr[3]);
    },
    SetUserEndInfo: function (wChair, EndInfo, Winner, bSelf) {
        this.$('@UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
        var StrScore = '';
        if (EndInfo.llTotalScore[wChair] > 0) {
            StrScore = '+' + EndInfo.llTotalScore[wChair];
            this.$('Score@Label').font = this.m_fntScore[0];
        } else {
            StrScore = EndInfo.llTotalScore[wChair];
            this.$('Score@Label').font = this.m_fntScore[1];
        }
        this.$('BigWin').active = Winner == wChair;
        this.$('Score@Label').string = StrScore;
    },
/////////////////////////////////////////////////////////////////////// 
});
