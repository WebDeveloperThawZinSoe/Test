cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserNode:cc.Node,
        m_UserPreNode:cc.Node,
    },
    ctor:function(){
        this.m_UserInfo = new Array();
    },
    // LoadUserInfoPre:function(wChair){
    //     if(this.m_UserInfo[0] == null ){
    //         this.m_UserInfo[0] = this.m_UserPreNode.getComponent('GameEndUserInfo_'+GameDef.KIND_ID);
    //     }
    //     if(this.m_UserInfo[wChair] == null){
    //         this.m_UserInfo[wChair] = cc.instantiate(this.m_UserInfo[0].node).getComponent('GameEndUserInfo_'+GameDef.KIND_ID);
    //         this.m_UserNode.addChild(this.m_UserInfo[wChair].node);
    //     }
    // },

    SetEndInfo:function(pEndInfo){
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var lWinScore = 0;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( pEndInfo.lTotalScore[i] > lWinScore){
                lWinScore = pEndInfo.lTotalScore[i];
                wWinner = i;
            }
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        // for(var i = 0;i<GameDef.GAME_PLAYER;i++){
        //     if(pEndInfo.UserID[i] == null) continue;
        //     this.LoadUserInfoPre(i);
        //     this.m_UserInfo[i].SetEndInfo(i, pEndInfo, wWinner, pGlobalUserData.dwUserID == pEndInfo.UserID[i]);
        // }

        if (this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndUserInfo_' + GameDef.KIND_ID);

        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if (pEndInfo.UserID[i] == null) continue;
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
            ShareInfo.desc += (this.m_pEndInfo.lTotalScore[i] >= 0?'+':'')+this.m_pEndInfo.lTotalScore[i];
        }
        ShareInfo.link = SHARE_URL
        return ShareInfo;
    },
});
