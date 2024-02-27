cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_UserInfo = new Array();
    },
    start:function () {

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
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndUserInfo_'+GameDef.KIND_ID);

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
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
            ShareInfo.desc += (this.m_pEndInfo.llTotalScore[i] >= 0?'+':'')+this.m_pEndInfo.llTotalScore[i];
        }
        ShareInfo.link = cc.share.MakeLink_GameEnd();
        return ShareInfo;
    },
});
