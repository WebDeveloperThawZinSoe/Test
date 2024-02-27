cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserNode:cc.Node,
        m_UserPreNode:cc.Node,
    },
    ctor:function(){
        this.m_UserInfo = new Array();
    },
    LoadUserInfoPre:function(wChair){
        if(this.m_UserInfo[0] == null){
            this.m_UserInfo[0] = this.m_UserPreNode.getComponent('GameEndUserInfo_'+GameDef.KIND_ID);
        }
        if(this.m_UserInfo[wChair] == null){
            this.m_UserInfo[wChair] = cc.instantiate(this.m_UserInfo[0].node).getComponent('GameEndUserInfo_'+GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserInfo[wChair].node);
        }
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

        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(pEndInfo.UserID[i] == null) continue;
            this.LoadUserInfoPre(i);
            this.m_UserInfo[i].SetEndInfo(i, pEndInfo, wWinner, pGlobalUserData.dwUserID == pEndInfo.UserID[i]);
        }
    },
       //分享信息
       GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.describe = '';
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.m_pEndInfo.UserID[i] == null) continue;
            if(ShareInfo.describe != '') ShareInfo.describe += '/'
            ShareInfo.describe += '【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName+'】';
            ShareInfo.describe += (this.m_pEndInfo.llTotalScore[i] >= 0?'+':'')+this.m_pEndInfo.llTotalScore[i];
        }
        ShareInfo.link = window.SHARE_URL
        return ShareInfo;
    },
});
