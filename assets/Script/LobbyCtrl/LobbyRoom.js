cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    //Pre js
    InitPre:function(){
    },

    SetPreInfo:function(ParaArr){	//OwnRoomInfo
        this.m_dwRoomID =  ParaArr.dwRoomID;
        this.m_wKindID = ParaArr.wKindID;
        if(ParaArr.dwClubID)this.m_dwClubID = ParaArr.dwClubID;

        this.m_dwRules = ParaArr.dwRules;
        this.m_dwServerRules = ParaArr.dwServerRules;
        var gamedef = new window['CMD_GAME_'+ParaArr.wKindID]();
        this.$('room@Label').string = ParaArr.dwRoomID;
        this.$('score@Label').string = '';
        this.$('rule@Label').string = '';
        this.$('pay@Label').string = '';
        this.$('subroom@Label').string = '';
        this.$('people@Label').string = '';

        if(gamedef.GetBaseScore) this.$('score@Label').string = gamedef.GetBaseScore(this.m_dwServerRules, this.m_dwRules);
        if(gamedef.GetGameMode) this.$('rule@Label').string = gamedef.GetGameMode(this.m_dwServerRules, this.m_dwRules);
        else this.$('rule@Label').string = window.GameList[this.m_wKindID];
        if(gamedef.GetPayMode) this.$('pay@Label').string = gamedef.GetPayMode(this.m_dwServerRules, this.m_dwRules);
        if(gamedef.GetGameCount) this.$('subroom@Label').string = gamedef.GetGameCount(this.m_dwServerRules, this.m_dwRules);
        this.$('people@Label').string = ParaArr.byPlayerCnt;
    },

    OnClick_EnterRoom:function(){
        g_Lobby.OnQueryRoom(this.m_dwRoomID, this.m_dwClubID);
    },

    OnClick_Share:function(){
        this.GetShareInfo();
    },

    //分享信息
    GetShareInfo: function() {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var ShareInfo = new Object();
        ShareInfo.title = '房号【'+this.m_dwRoomID+'】 ' + g_GlobalUserInfo.m_UserInfoMap[pGlobalUserData.dwUserID].NickName + "邀请您来玩" + window.GameList[this.m_wKindID];
        var gamedef = new window['CMD_GAME_'+this.m_wKindID]();
        if(gamedef.GetGameMode)
        {
            ShareInfo.desc = gamedef.GetGameMode(this.m_dwServerRules, this.m_dwRules);
        }
        else
        {
            ShareInfo.desc = window.GameList[this.m_wKindID];
        }
        ShareInfo.imgUrl = window.PHP_HOME + '/app01/App.jpg';
        ShareInfo.link = cc.share.MakeLink_InviteRoom(this.m_dwRoomID, this.m_dwClubID);
        ThirdPartyShareMessage(ShareInfo,0)
        return ShareInfo;
    },
/////////////////////////////////////////////////////////////////////////////
});
