cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabTimes:cc.Label,
        m_LabRules:cc.Label,
        m_LabCount:cc.Label,
        m_LabRoom:cc.Label,
        m_LabHJH:cc.Label,
    },
    OnBtReturn:function(){
        this.m_Hook.OnBtReturn();
        this.m_Hook.ShowPrefabDLG('CustomLoading',this.m_Hook.node);
       // this.node.active = false;
    },
    OnShowView:function(){
        var pViewEngine = this.m_Hook.m_GameClientView;
        this.m_LabTimes.string = Time2Str(new Date().getTime()/1000);
        this.m_LabRules.string = pViewEngine.m_RulesText.string;
        this.m_LabCount.string = pViewEngine.m_subsumlun.string;
        this.m_LabRoom.string = pViewEngine.m_TableNumber.string;
        this.m_LabHJH.string = pViewEngine.m_ClubNum.string;
        this.ShowGamePrefab('GameEndView',GameDef.KIND_ID,this.node,function(Js){
            this.m_CustomEndView = Js;
            this.m_CustomEndView.SetEndInfo(this.m_Hook.m_RoomEnd)
            cc.share.InitShareInfo_H5_WX(this.GetShareInfo.bind(this));
        }.bind(this));

        this.$('Layout/BtAgain').active = this.m_Hook.m_dwClubID!=0;
    },

    //分享
    OnBtShowShare: function(){
        // if(cc.sys.isNative){
        //     this.OnShareGameEnd();
        // }else{
        //     ThirdPartyShareMessage(this.m_CustomEndView.GetShareInfo(),0);
        // }
        this.ShowPrefabDLG("SharePre", this.node, function(Js) {
            this.m_SharePre = Js;
        }.bind(this));
    },
    OnShareGameEnd:function(){
        // var ShareTex = cc.RenderTexture.create(window.SCENE_WIGHT,window.SCENE_HEIGHT);
        // this.node.setPosition(window.SCENE_WIGHT/2, window.SCENE_HEIGHT/2)

        // ShareTex.setVisible(false);
        // ShareTex.begin();
        // this.node._sgNode.visit();
        // ShareTex.end();

        // this.node.setPosition(0,0);
        // this.node.active = false;

        // var filename = "screenShot"+(new Date().getTime())+".PNG"
        // ShareTex.saveToFile(filename,cc.ImageFormat.PNG, true, function(){
        //     this.node.active = true;
        //     ThirdPartyShareImg(jsb.fileUtils.getWritablePath()+filename);
        // }.bind(this));

        var filePath = saveImage(this.node);
        if(filePath!='') {
            ThirdPartyShareImg(filePath);
        }else{
            this.ShowTips('截图保存失败');
        }
    },

    GetShareTex:function() {
        if(this.m_SharePre) this.m_SharePre.node.active = false;
        return saveImage(this.node);
    },

    GetShareInfo: function() {
        if (cc.share.IsH5_WX()) {
            var ShareInfo = null;
            if (this.m_CustomEndView && this.m_CustomEndView.GetShareInfo) ShareInfo = this.m_CustomEndView.GetShareInfo();
            ShareInfo.link = cc.share.MakeLink_GameEnd();
            return ShareInfo;
        }
        return null;
    },

    OnClick_GameAgain: function(){
        //g_Table.ShowLoading();
        var QueryGR = new CMD_GP_C_GetRoom();
        QueryGR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryGR.dwRoomID = parseInt(this.m_Hook.m_dwRoomID2);
        QueryGR.dwClubID = parseInt(this.m_Hook.m_dwClubID);
        window.gClubClientKernel.OnSendJoinRoom2(this, QueryGR);
        //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_JOIN_ROOM2, QueryGR);
    },
    OnQueryFailed:function (FailedRes){
        //g_Table.StopLoading();
        this.ShowAlert(FailStr[FailedRes.byRes],Alert_Yes,function(Res){
            if(Res)g_Table.ExitGame();
        }.bind(this));
    },
    OnQueryRoomRes:function (ReturnServer){
        g_ServerListDataLast = new CGameServerItem();
        g_ServerListDataLast.wKindID = ReturnServer.wKindID;
        g_ServerListDataLast.wServerPort = ReturnServer.wServerPort;
        g_ServerListDataLast.szServerAddr = ReturnServer.szServerAddr;
        g_ServerListDataLast.wServerType = ReturnServer.wServerType;
        g_ServerListDataLast.llEnterScore = ReturnServer.llEnterScore;
        g_ServerListDataLast.szServerName = "";
        window.g_dwRoomID = ReturnServer.dwRoomID;
        window.g_dwClubID = ReturnServer.dwClubID;
        this.EnterGameScene(1);
    },
    //游戏入口
    EnterGameScene:function(Res){
        // 加载游戏
        if(Res && g_ServerListDataLast){
            if(window.LOG_NET_DATA)console.log("地址：", g_ServerListDataLast.szServerAddr+":"+g_ServerListDataLast.wServerPort);
            g_Table.m_Loading.active = true;
            this.ShowPrefabDLG("UpdateManager", g_Table.m_Loading, function (Js) {
                Js.StartPreload(0, g_ServerListDataLast.wKindID, function() {
                    cc.gPreLoader.LoadRes(`${GameDef.BGPath}`, '' + GameDef.KIND_ID, function(res) {
                        window.gGameBG = null;
                        GameDef['setRule']&&GameDef.setRule(0);
                        ChangeScene('Table');
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },

});
