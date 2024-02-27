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
        this.$('BtReStart').active = this.m_Hook.m_dwClubID > 0;
        this.ShowGamePrefab('GameEndView_'+GameDef.KIND_ID,this.node,function(Js){
            this.m_CustomEndView = Js;
            this.m_CustomEndView.SetEndInfo(this.m_Hook.m_RoomEnd)
        }.bind(this));
    },

    //分享
    OnBtShowShare: function(){
        if(cc.sys.isNative){
            this.OnShareGameEnd();
        }else{
            ThirdPartyShareMessage(this.m_CustomEndView.GetShareInfo(),0);
        }
    },
    OnShareGameEnd:function(){
        var ShareTex = cc.RenderTexture.create(window.SCENE_WIGHT,window.SCENE_HEIGHT);
        this.node.setPosition(window.SCENE_WIGHT/2, window.SCENE_HEIGHT/2)

        ShareTex.setVisible(false);
        ShareTex.begin();
        this.node._sgNode.visit();
        ShareTex.end();

        this.node.setPosition(0,0);
        this.node.active = false;

        var filename = "screenShot"+(new Date().getTime())+".PNG"
        ShareTex.saveToFile(filename,cc.ImageFormat.PNG, true, function(){
            this.node.active = true;
            ThirdPartyShareImg(jsb.fileUtils.getWritablePath()+filename);
        }.bind(this));
    },
    OnClick_GameAgain: function(){
        g_Table.ShowLoading();
        var QueryGR = new CMD_GP_C_GetRoomAgain();
        QueryGR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        for(var i =0;i<5;i++){
            QueryGR.dwRoomRules[i] = parseInt(this.m_Hook.m_dwRulesArr[i]);
        }
        QueryGR.dwClubID = parseInt(this.m_Hook.m_dwClubID);
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_JOIN_ROOM2, QueryGR);
    },
    OnQueryFailed:function (FailedRes){
        g_Table.StopLoading();
        this.ShowAlert(FailStr[FailedRes.byRes],Alert_YesC,function(Res){
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

        cc.director.loadScene('Table', function(){
            var colorIndex = cc.sys.localStorage.getItem(window.QPName+window.Key_TableColor);
            if(colorIndex == null) colorIndex = 0;
            var path = 'SubGame/'+ReturnServer.wKindID+'/Picture/BG'+colorIndex;
            cc.loader.loadRes(path, cc.SpriteFrame, function(err,SpriteFrame){
                if(err){
                    console.error("UpdateBGColor ==>> "+err);
                }else{
                    window.gGameBG = SpriteFrame;
                }
            });
        });
        //this.HideView();
    },
});
