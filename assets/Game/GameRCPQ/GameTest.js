cc.Class({
    extends: cc.GameView,

    properties: {
    },

    ctor: function () {
    },

    onLoad: function () {
       
    },

    //初始化
    InitVoice: function (Hook) {
        if (this.m_GameEngine != null) return;
        this.m_Hook = Hook;
    
    },
    OnBtClickedTest: function () {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = PHP_HOME + '/UserFunc.php?GetMark=99&dwUserID=' + pGlobalUserData.dwUserID;

        WebCenter.GetData(webUrl, 3600, function (data) {
            var UserInfo = JSON.parse(data);
            if (UserInfo.UR == null) return;
            if ((UserInfo.UR & 0x20000000) > 0) {
                if(GameDef.KIND_ID == 21050) {
                    if(this.m_Hook.m_GameEngine.m_GameClientView.m_GameClientEngine.m_PlayStatus.wTurn>0)this.m_Hook.m_GameEngine.m_GameClientView.OnGetCardTestInfo(2);
                } else {
                    this.m_Hook.m_GameEngine.m_GameClientView.OnGetCardTestInfo(2);
                }    
            }
        }.bind(this));
        
    },
});
