cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    ctor: function () {
    },

    SetEndInfo:function(pEndInfo){
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var lWinScore = 0;

        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( pEndInfo.llTotalScore[i] > lWinScore){
                lWinScore = pEndInfo.llTotalScore[i];
                wWinner = i;
            }
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndView_'+GameDef.KIND_ID);

        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(pEndInfo.UserID[i] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, pEndInfo, wWinner, pGlobalUserData.dwUserID == pEndInfo.UserID[i]]);
        }
    },
    //分享信息
    GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.m_pEndInfo.UserID[i] == null) continue;
            if(ShareInfo.desc != '') ShareInfo.desc += '/'
            ShareInfo.desc += '【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName+'】';
            ShareInfo.desc += (this.m_pEndInfo.llTotalScore[i] >= 0?'+':'')+ Score2Str(this.m_pEndInfo.llTotalScore[i]);
        }
        ShareInfo.link = cc.share.MakeLink_GameEnd();
        return ShareInfo;
    },

///////////////////////////////////////////////////////////////////////
//pre
    InitPre: function() {

    },
    SetPreInfo: function(ParaArr) {
        this.SetUserEndInfo(ParaArr[0],ParaArr[1],ParaArr[2],ParaArr[3]);
    },
    SetUserEndInfo:function(wChair, EndInfo, Winner, bSelf) {
        this.$('@UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
        var StrScore = '';
        if( EndInfo.llTotalScore[wChair] >= 0) StrScore = '+';
        StrScore += Score2Str(EndInfo.llTotalScore[wChair]) ;
        this.$('Score@Label').string =StrScore;

        //this.m_spriteBigWinner.node.active = Winner;
    },
///////////////////////////////////////////////////////////////////////
});