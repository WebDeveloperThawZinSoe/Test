cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function (){
        this.m_BasicSound = new Array();
        this.m_BasicSound['BGM0'] = 'BGM0';
        this.m_BasicSound['BGM1'] = 'BGM1';
        this.m_BasicSound['BGM2'] = 'BGM2';
        this.m_BasicSound['Button'] = 'button';
        this.m_BasicSound['SendCard'] = 'sendcard';
        this.m_BasicSound['Jet'] = 'Jet';
        this.m_ClubRoomCnt = new Array();
    },
    onEnable: function() {
        cc.director.on('Lobby_InitShareInfo', this.OnInitShareInfo, this);
    },

    onDisable: function() {
        cc.director.off('Lobby_InitShareInfo', this.OnInitShareInfo, this);
    },
    onLoad:function () {
        cc.debug.setDisplayStats(false);
        FitSize(this.node);
        if(!this.m_Loading) this.m_Loading = this.$('loading');
        this.m_Loading.zIndex = 100;
        this.m_Loading.active = false;
        this.m_bTipGPS = false;
        window.g_CntGameGPS = 0;
        ShowO2I(this.node, 0.5);
        window.LoadSetting();
        cc.gSoundRes.LoadSoundArr(this.m_BasicSound, 'PublicAudio');
        if(cc.share.IsH5_WX()) {
            this.$('plazabg/NdButton/MenuBG/BtExit', this.m_MenuNode).active = false;
        }
        this.onSwitchBG();
    },
    start:function () {
        g_ServerListDataLast = null;
        g_ShowClubInfo = null;
        this.BindButtonInit();

        g_Launch = null;
        g_Login = null;
        g_Lobby = this;
        g_Table = null;
        g_CurScene = this;

        this.m_DlgNode = this.$('DlgFrame');
        this.m_MeUserCtrl = this.$('plazabg/NdButton/UserCtrl@UserCtrl');
        this.m_RoomCard = this.$('plazabg/NdButton/BtGetGold/L_RoomCard@Label');
        this.m_MenuNode = this.$('plazabg/NdButton/MenuBG');
        this.m_MenuNode.active == false;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        if(pGlobalUserData.dwUserID == 0){
            this.ShowLoading();
            var AutoLogonAcc = getQueryString("AAcc");
            if(AutoLogonAcc) {
                window.g_PhpUserName = AutoLogonAcc;
                window.g_PhpPassword = getQueryString("APsw");
            }
            if(window.g_PhpUserName=='') window.g_PhpUserName=null;
            getLinkInfo();
            this.m_NeedLogin = true;
        }else{
            this.onGPLoginComplete();
        }

        if(window.POP_NOTICE > 0 && g_Table == null){
            window.POP_NOTICE = 0;
            var ActivityPop = parseInt(cc.sys.localStorage.getItem(window.Key_ActivityPop));
            if(!ActivityPop) {
                this.scheduleOnce(this.OnClick_BtActivity, 0.5);
            } else {
                var last = new Date(ActivityPop);
                var cur = new Date();
                if(last.getFullYear() != cur.getFullYear() || last.getMonth() != cur.getMonth() || last.getDay() != cur.getDay()) {
                    this.scheduleOnce(this.OnClick_BtActivity, 0.5);
                }
            }
        }
        this.scheduleOnce(this.ShowCustomClick, 0.5);
    },

    ShowCustomClick: function() {
        this.ShowPrefabDLG('CustomClick', this.node, function(Js) {
            this.m_CustomClick = Js;
            //Js.node.zIndex = -1;
        }.bind(this));
    },
    OnAutoJoinClub: function(kind, allianceID) {
        this.ShowPrefabDLG('ClubFreeDLG',this.m_DlgNode,function(Js){
            Js.ShowKind(kind)
            Js.AutoJoin(allianceID)
        });
    },
    OnInitShareInfo: function() {
        cc.share.InitShareInfo_H5_WX(this.GetShareInfo.bind(this));
    },
     //登陆成功
    onGPLoginComplete:function (){
        //播放背景音乐
        this.StopLoading();

        //播放背景音乐
        //var BGMIndex = cc.sys.localStorage.getItem(window.QPName+window.Key_TableBGM);
        var BGMIndex = window.g_Setting[window.SetKey_Lobby_Music]
        if(BGMIndex == null) BGMIndex=0
        cc.gSoundRes.PlayMusic("BGM"+BGMIndex, false);

        //用户数据更新
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        this.m_MeUserCtrl.SetUserByID(pGlobalUserData.dwUserID);
        this.m_MeUserCtrl.SetShowFullName(false, 6);
        this.OnBtRefeshRoomCard();
        if(ShowLobbyClub != 0) this.OnBtShowClub();

        //邀请链接房间查询
        // if(LinkInfo && LinkInfo.LinkRoom && LinkInfo.LinkRoom[0] != 0) {
        //     this.OnQueryRoom(parseInt(LinkInfo.LinkRoom[0]), parseInt(LinkInfo.LinkRoom[1]));
        // }

        //微信H5分享链接
        if(cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT || cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ){
            var ShareInfo = this.GetShareInfo();
            ThirdPartyShareMessage(ShareInfo, 0);
            ThirdPartyShareMessage(ShareInfo, 1);
        }

        if(!window.ClubPara){
            var webUrl = window.PHP_HOME+'/League.php?&GetMark=16';
            WebCenter.GetData(webUrl, 999999, function (data) {
                window.ClubPara = JSON.parse(data);
            }.bind(this));
        }
        this.OnCheckLobbyShow();
        // this.m_bNeedUpdate = true;
        // this.m_FirstShare = this.m_FirstShareNode.getComponent('FirstShare');
        // var lasttime = cc.sys.localStorage.getItem(window.Key_ShareTime);
        // if(g_Lobby == null && DifDay(lasttime,new Date().getTime())) this.m_FirstShare.ShowView();
        //this.scheduleOnce(this.OnTimer_IDI_QueryParam, 0.001);
        cc.director.emit('Lobby_InitShareInfo');
    },
    OnQueryParam: function() {
        //邀请链接-
        if(!!!window.inviteRoom) {
            window.inviteRoom = cc.share.GetShareParam(cc.share.Type.InviteRoom);
            window.inviteClub = cc.share.GetShareParam(cc.share.Type.InviteClub);
            console.log('inviteRoom'+window.inviteRoom);
            console.log('inviteClub'+window.inviteClub);
            if(window.inviteRoom && window.inviteRoom.roomNum) { // 房间查询
                this.OnQueryRoom(window.inviteRoom.roomNum, window.inviteRoom.clubID);
            } else if(window.inviteClub && window.inviteClub.allianceID > 0) { // 联盟申请
                this.OnAutoJoinClub(window.inviteClub.kind, window.inviteClub.allianceID);
                ShowLobbyClub = 0;
                window.POP_NOTICE = 0;
            }
        }

        if(window.POP_NOTICE > 0 && g_Table == null){
            window.POP_NOTICE = 0;
            var ActivityPop = parseInt(cc.sys.localStorage.getItem(window.Key_ActivityPop));
            if(!ActivityPop) {
                this.scheduleOnce(this.OnClick_BtActivity, 0.5);
            } else {
                var last = new Date(ActivityPop);
                var cur = new Date();
                if(last.getFullYear() != cur.getFullYear() || last.getMonth() != cur.getMonth() || last.getDay() != cur.getDay()) {
                    this.scheduleOnce(this.OnClick_BtActivity, 0.5);
                }
            }
        }
        if(ShowLobbyClub != 0) this.OnBtShowClub();
    },
    GetLobbyShowArr:function(){
        var ClickArr = new Array(0,0,0,0,0,0);
        var value = cc.sys.localStorage.getItem(window.QPName+'LobbyShow');
        if(value != null ) ClickArr = JSON.parse(value);
        return ClickArr;
    },
    UpdateLobbyShowArr:function(Index){
        var ClickArr = this.GetLobbyShowArr();
        ClickArr[Index] = new Date().getTime();
        cc.sys.localStorage.setItem(window.QPName+'LobbyShow', JSON.stringify(ClickArr));
        this.OnCheckLobbyShow();
    },
    OnCheckLobbyShow:function(){
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=28&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            var ShowList = JSON.parse(data);
            var ClickArr = this.GetLobbyShowArr();
            var Today = new Date().getTime();
            this.$('plazabg/NdButton/BtRealName/point').active = (ShowList[0]==0 && DifDay(Today, ClickArr[0]));
            this.$('plazabg/NdButton/FirstGift').active = ShowList[1]==0;
            this.$('plazabg/NdButton/FirstGift/point').active = (ShowList[1]==0 && DifDay(Today, ClickArr[1]));
            this.$('plazabg/NdButton/BtSign/point').active = (ShowList[2]==0 && DifDay(Today, ClickArr[2]));
            this.$('plazabg/NdButton/BottomButton/BtInviteCode/point').active = (ShowList[3]==1 && DifDay(Today, ClickArr[3]));
            this.$('plazabg/NdButton/BtBindPhone/point').active = (ShowList[4]==0 && DifDay(Today, ClickArr[4]));
            this.$('plazabg/NdButton/BtMail/point').active = ShowList[5]>0;
        }.bind(this));
    },
    OnClick_BtBindPhone:function(){
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=19&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            if(data==""){
                this.ShowPrefabDLG('BindPhone', this.m_DlgNode);
                this.UpdateLobbyShowArr(4);
            }else{
                this.ShowAlert('您已绑定过手机！');
            }
        }.bind(this));
    },
    OnClick_BtSignIn:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Sign',this.m_DlgNode);
        this.UpdateLobbyShowArr(2);
    },
    OnClick_BtFirstBuy:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('FirstBuy',this.m_DlgNode);
        this.UpdateLobbyShowArr(1);
    },

    GetShareInfo:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var ShareInfo = new Object();
        ShareInfo.title = `玩游戏看这里！`;
        ShareInfo.desc = `我和我身边的朋友都在玩的竞技平台，快来一展身手！`;
        ShareInfo.imgUrl = `${window.PHP_HOME}/share.jpg`;
        ShareInfo.link = cc.share.MakeLink_Lobby();
        return ShareInfo;
    },
    OnClick_BtRealName:function(){
        cc.gSoundRes.PlaySound('Button');
          //提交
          var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
          var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=17&dwUserID='+pGlobalUserData.dwUserID;

          this.ShowLoading();
          WebCenter.GetData(webUrl, null, function (data) {
            this.StopLoading();
            if(data == 1) return  this.ShowAlert("无需重复认证！");
            this.ShowPrefabDLG('RealAuth', this.m_DlgNode);
            this.UpdateLobbyShowArr(0);
          }.bind(this));
    },

    //购买钻石按钮
    onClick_Bt_stone:function (){
        cc.gSoundRes.PlaySound('Button');
        this.OnBtMoreStrong();
        return
        //提示信息
        this.ShowAlert("购买钻石请联系客服或代理.");
    },
    //购买钻石按钮
    onClick_Bt_stone:function (){
        cc.gSoundRes.PlaySound('Button');
        this.OnBtMoreStrong();
        return
        //提示信息
        this.ShowAlert("购买钻石请联系客服或代理.");
    },
    //商城按钮点击事件
    onClick_Bt_shop:function (){
        cc.gSoundRes.PlaySound('Button');
        //提示信息
        this.ShowAlert("请联系客服微信号:"+window.WX_SERVICE, Alert_Yes,function(){
            ThirdPartyCopyClipper(window.WX_SERVICE);
            this.ShowTips('已复制到剪切板')
        }.bind(this));
    },
    //显示商城
    OnBtMoreStrong: function () {
        cc.gSoundRes.PlaySound('Button');
        var self = this;
        self.ShowPrefabDLG('PayCountPre', self.m_DlgNode, function(Js) {
            Js.SetData();
        });
        return
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=5&dwUserID=';
        this.ShowLoading();

        WebCenter.GetData(webUrl, 99999, function (data) {
            self.StopLoading();
            if(data == '') return;
            var res = JSON.parse(data);
            self.ShowPrefabDLG('PayCountPre', self.m_DlgNode, function(Js){
                Js.SetData(res);
            });
        });
    },
    //设置按钮点击事件
    onClick_Bt_shezhi:function (){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Setting',this.m_DlgNode);
    },
    //金币场入口
    SendTypeQuery:function(wKindID, wTypeID){
        this.ShowLoading();
        //cc.log(wKindID,wTypeID)
        wKindID = 40107
        wTypeID = 1
        //预加载
        // cc.gPreLoader.LoadByGame(wKindID);
        var QueryT = new CMD_GP_C_Query_ByType();
        QueryT.wKindID = wKindID;
        QueryT.wType = wTypeID;
        QueryT.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_QUERY_BYTYPE, QueryT);
    },
    //查询回连
    SendReLinkQuery:function(){
        //this.ShowLoading();
        var QueryRL = new CMD_GP_C_Relink();
        QueryRL.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_QUERY_RELINK, QueryRL);
    },
    //创建&加入失败信息
    OnQueryFailed:function (FailedRes){
        this.StopLoading();
        this.ShowTips( FailStr[FailedRes.byRes]);
    },
    //进入服务器信息
    OnQueryServerRes:function (ReturnServer){
        this.StopLoading();

        if(ReturnServer.wKindID == 0) return
        if(!this.BeLoadRes(ReturnServer.wKindID)) return;

        g_ServerListDataLast = new CGameServerItem();
        g_ServerListDataLast.wKindID = ReturnServer.wKindID;
        g_ServerListDataLast.wServerPort = ReturnServer.wServerPort;
        g_ServerListDataLast.szServerAddr = ReturnServer.szServerAddr;
        g_ServerListDataLast.wServerType = ReturnServer.wServerType;
        g_ServerListDataLast.llEnterScore = ReturnServer.llEnterScore;
        g_ServerListDataLast.szServerName = "";

        if(ReturnServer.byTipsReturn){
            var game = window.GameList[ReturnServer.wKindID];
            if(game == null) game = ReturnServer.wKindID;
            this.ShowAlert('您已在游戏 '+game+' 内，点击确定回到游戏！',Alert_YesNo,'EnterGameScene',this)
        }else{
            this.EnterGameScene(1);
        }
    },
    OnQueryRoomRes:function (ReturnServer){
        this.StopLoading();

        if(ReturnServer.wKindID == 0) return
        if(!this.BeLoadRes(ReturnServer.wKindID)) return;
        g_ServerListDataLast = new CGameServerItem();
        g_ServerListDataLast.wKindID = ReturnServer.wKindID;
        g_ServerListDataLast.wServerPort = ReturnServer.wServerPort;
        g_ServerListDataLast.szServerAddr = ReturnServer.szServerAddr;
        g_ServerListDataLast.wServerType = ReturnServer.wServerType;
        g_ServerListDataLast.llEnterScore = ReturnServer.llEnterScore;
        g_ServerListDataLast.szServerName = "";
        window.g_dwRoomID = ReturnServer.dwRoomID;
        window.g_dwClubID = ReturnServer.dwClubID;

        //this.ShowLoading();
        this.EnterGameScene(1);
    },

    //游戏入口
    EnterGameScene:function(Res){
        // 加载游戏
        if(Res && g_ServerListDataLast){
            if(window.LOG_NET_DATA)console.log("地址：", g_ServerListDataLast.szServerAddr+":"+g_ServerListDataLast.wServerPort);
            this.$('plazabg').active = false;
            this.$('DlgFrame').active = false;
            this.m_Loading.active = true;
            this.ShowPrefabDLG("UpdateManager", this.m_Loading, function (Js) {
                Js.StartPreload(0, g_ServerListDataLast.wKindID, function() {
                    cc.gPreLoader.LoadRes(`Image_BG_BG${GameDef.BGIndex}`, '' + GameDef.KIND_ID, function(res) {
                        window.gGameBG = 'loading';
                        ChangeScene('Table');
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },

    //游戏资源预加载
    BeLoadRes:function(wKindID){
        if(this.OnCheckGame(wKindID)) return false;
        try {
             //游戏自定义
             GameDef = new window['CMD_GAME_'+wKindID]();
             if(GameDef == null){
                 var game = window.GameList[wKindID];
                 if(game == null ) game = wKindID;
                 this.ShowTips("本地木有游戏 "+game);
                 return false;
             }
             //游戏桌布
             window.gGameBG = 'loading';
             window.LoadSetting();
             window.LoadSetting(wKindID);
             var pathInfo = window.Path_GameBG(wKindID, window.g_GameSetting[wKindID][window.SetKey_Table_BG], 0, true);
             GameDef.BGIndex = pathInfo.BGIndex;
             GameDef.BGPath = pathInfo.path;
        } catch (error) {
            this.ShowAlert("游戏资源出错！"+error);
            return false;
        }

        return true;
    },
    //显示战绩
    OnBtShowRecord:function (){
        cc.gSoundRes.PlaySound('Button');
        this.ShowLoading();
        this.ShowPrefabDLG('GameRecord',this.m_DlgNode);
    },
    //分享信息
    GetShareTex: function() {
        var TexUrl = window.PHP_HOME + '/app01/ShareRes.jpg'
        return TexUrl;
    },

/////////////////////////////////////////////////////////////////////////房间
    //创建房间
    OnBtCreatRoom:function(){
        cc.gSoundRes.PlaySound('Button');
        // this.ShowPrefabDLG('CreateRoom', this.m_DlgNode);
        // this.ShowPrefabDLG('SelectGame', this.m_DlgNode);
        this.ShowPrefabDLG('SelectGame',this.node,function(Js){
            Js.OnSetRoomType(0);
        }.bind(this));
    },

    //加入房间
    OnBtJoinRoom:function(){
        cc.gSoundRes.PlaySound('Button');
        this.SendReLinkQuery();
        this.ShowPrefabDLG('JoinRoom',this.m_DlgNode);
    },
    //俱乐部
    OnClick_BtClubMore:function(Tag, Kind){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ClubFreeDLG',this.m_DlgNode,function(Js){
            Js.ShowKind(Kind)
        });
    },
    //俱乐部
    OnBtShowClub:function(){
        if(window.g_GlobalClubInfo.onGetClubInfoList().length>0){
            this.ShowPrefabDLG('ClubDLG',this.m_DlgNode,function(Js){
                this.m_ClubCtrl = Js;
                Js.OnChangeClub(window.g_GlobalClubInfo.onGetClubInfo(ShowLobbyClub));
            }.bind(this));
        }
    },
    OnChangeClub:function(ClubInfo){
        cc.gSoundRes.PlaySound('Button');
        ShowLobbyClub = ClubInfo.dwClubID;
        this.ShowPrefabDLG('ClubDLG',this.m_DlgNode,function(Js){
            this.m_ClubCtrl = Js;
            Js.OnChangeClub(ClubInfo);
        }.bind(this));
    },
    OnShowLeague:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var self = this;
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=15&dwUserID='+pGlobalUserData.dwUserID;
        this.ShowLoading();

        WebCenter.GetData(webUrl, null, function (data) {
            self.StopLoading();
            var LeagueInfo = JSON.parse(data);
            if(LeagueInfo.LeagueID == null){
                self.ShowPrefabDLG('LeagueFreeDLG-V',self.m_DlgNode);
            }else{
                self.ShowPrefabDLG('LeagueDLG-V',self.m_DlgNode,function(Js){
                    self.m_LeagueCtrl = Js;
                });
            }
        });
    },
    OnBtShowDlg:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG(Data,this.m_DlgNode);
    },
    //加入房间
    OnQueryRoom:function(RoomNum, ClubID){
        if(LinkInfo && LinkInfo.LinkRoom) LinkInfo.LinkRoom[0] = 0;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var QueryGR = new CMD_GP_C_GetRoom();
        QueryGR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryGR.dwRoomID = parseInt(RoomNum);
        QueryGR.dwClubID = parseInt(ClubID);
        //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_JOIN_ROOM, QueryGR);
        window.gClubClientKernel.OnSendJoinRoom(this,QueryGR);
    },

    //创建房间
    OnCreateRoom:function(wKindID, RulesArr, ServerRules, Name){
        if(this.OnCheckGame(wKindID)) return
        //this.ShowLoading();
        var QueryGR = new CMD_GP_C_CreateRoom();
        QueryGR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryGR.wKindID=wKindID;
        for(var i=0;i<5;i++){
            if(RulesArr[i]==null) RulesArr[i]=0;
            QueryGR.dwRules[i] = RulesArr[i];
        }
        QueryGR.dwServerRules=ServerRules;
        QueryGR.szRoomName=Name;
        window.gClubClientKernel.OnSendCreateRoom(this,QueryGR);
        //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_CREATE_ROOM, QueryGR);
    },
    OnCreatRoomRes:function (RoomSuc){//CMD_GP_S_CreatSuccess
        this.ShowPrefabDLG('RoomRes',this.m_DlgNode,function(Js){
            Js.OnShowData(RoomSuc.dwRoomID, RoomSuc.dwClubID, RoomSuc.wKindID);
        }.bind(this));
    },
    //查询占用钻石
    OnGetUsingCard:function(){
        this.ShowLoading();
        var QueryUC = new CMD_GP_C_Query_UsingCard();
        QueryUC.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_QUERY_W_ROOMCARD, QueryUC);
    },
    //赠送钻石校验
    OnSendCardQuery:function(lUsingCard){
        this.m_SendCardCtrl.SetUsingCard(lUsingCard);
    },
    OnClick_BtActivity:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Activity',this.m_DlgNode,function(Js){
            Js.OnShowData(0, 0);
        }.bind(this));
    },
  /////////////////////////////////////////////////////////////////////////

    OnMsgRes:function(Msg){
        this.StopLoading();
        WebCenter.SetDataOutTime('GetMark=10');//上下分 更新
        this.ShowAlert(Msg, Alert_Yes, function(Res) {
            if(this.m_ClubCtrl)this.m_ClubCtrl.OnShowView(true);
        }.bind(this));
    },

 /////////////////////////////////////////////////////////////////////////
    OnBtRefeshRoomCard:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=5&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            var res = JSON.parse(data);
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

            if(res.UserMedal != null) pGlobalUserData.llUserIngot=res.UserMedal;
            this.m_RoomCard.string = pGlobalUserData.llUserIngot;
        }.bind(this));
    },
/////////////////////////////////////////////////////////////////////////////////////
    //游戏单热更 未完成无效接口
    OnCheckGame:function(wKindID){
        return false;
        if(!cc.sys.isNative || !window.HUversion) return false;
        var sub = cc.sys.localStorage.getItem(window.Key_HUKey+wKindID);
        if(sub == 'F') return false;
        if(sub == null || sub == 'L'){
            var UpdatePrefab = cc.instantiate(this.m_UpdatePrefab);
            var Update = UpdatePrefab.getComponent('UpdatePrefab');
            this.node.addChild(UpdatePrefab);
            Update.CheckUpdate(wKindID);
            return true;
        }
    },
    //首次登录分享赠送相关
    CheckFirstShare:function(){
        this.m_bChecking = true;
    },
    CheckShareFunc:function(){
        //cc.sys.localStorage.setItem(window.Key_ShareTime, new Date().getTime());
        //if(this.m_bChecking == null) return
        this.m_bChecking = null
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=10&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            var res = JSON.parse(data);
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            if(res.RoomCard != null)  pGlobalUserData.llUserIngot=res.RoomCard;
            this.m_RoomCard.string = pGlobalUserData.llUserIngot;
           // this.m_FirstShare.HideView();
        }.bind(this));
    },
    //游戏回放
    OnRePlayGame:function( RecordID, KindID, LookUser, Progress){
        if(!this.BeLoadRes(KindID)) return;
        this.ShowPrefabDLG('GameRePlay',this.node,function(Js) {
            this.m_GameRePlay = Js;
            if(this.m_GameRePlay.LoadGameRes(KindID)) {
                this.m_GameRePlay.LoadRePlayData(LookUser, RecordID, Progress);
            } else {
                this.$('plazabg').active = false;
                this.$('DlgFrame').active = false;
                this.m_Loading.active = true;
                this.ShowPrefabDLG("UpdateManager", this.m_Loading, function (Js) {
                    Js.StartPreload(0, KindID, function() {
                        cc.gPreLoader.LoadRes(`Image_BG_BG${GameDef.BGIndex}`, '' + GameDef.KIND_ID, function(res) {
                            window.gGameBG = 'loading';
                            this.$('plazabg').active = true;
                            this.$('DlgFrame').active = true;
                            this.m_Loading.active = false;
                            this.ShowPrefabDLG('GameRePlay',this.node,function(Js1) {
                                if(Js1.LoadGameRes(KindID) == false) {
                                    Js1.OnDestroy();
                                    this.ShowAlert('游戏暂不支持回放！');
                                    return
                                }
                                Js1.LoadRePlayData(LookUser, RecordID, Progress);
                            }.bind(this))
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this))
    },

///////////////////////////////////////////////////////////////////////////////////////绑定邀请码
    //检查代理绑定
    OnBtNewPlayer: function () {
        cc.gSoundRes.PlaySound('Button');
        var pUserInfo = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=15&dwUserID=' + pUserInfo.dwUserID;
        webUrl += '&LogonPass=' + pUserInfo.szPassword;
        if( this.m_CheckNewPlayer == null)  this.m_CheckNewPlayer = 0;
        var self = this;
        this.ShowLoading();
        WebCenter.GetData(webUrl, this.m_CheckNewPlayer, function (data) {
            self.m_CheckNewPlayer = 999999;
            self.StopLoading();
            var UserInfo = JSON.parse(data);
            if (UserInfo.Status == null) return
            if (1 == UserInfo.Status) {
                self.UpdateLobbyShowArr(3);
                self.ShowPrefabDLG('NewPlayer',self.m_DlgNode, function (Js){
                    self.m_NewPlayer = Js;
                });
            }else{
                self.ShowAlert("您已经完成了绑定！");
            }
        });
    },

    OnBtUnFinished: function () {
        this.ShowAlert("敬请期待！");
    },

    LoginAccount:function(Account, Password){
        gReLogin = false;
        var LogonAccounts = new CMD_GP_LogonAccounts();
        LogonAccounts.dwPlazaVersion = cc.VERSION_PLAZA;
        LogonAccounts.szAccounts = Account
        LogonAccounts.szPassword = Password;
        LogonAccounts.szPassPortID = "no";

        var LoginMission = new CGPLoginMission(this, MDM_GP_LOGON, SUB_GP_LOGON_ACCOUNTS, LogonAccounts);
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        pGlobalUserData.szPassword = LogonAccounts.szPassword;
        cc.sys.localStorage.setItem('LoginAcc', Account);
        cc.sys.localStorage.setItem('LoginPswT', Password);
    },

    onGPLoginSuccess:function (){},
    //登陆成功
    onGetServerListFinish:function () {},
    //登录失败
    onGPLoginFailure:function (szDescription) {
        this.StopLoading();
        //提示信息
        this.ShowAlert(szDescription, Alert_Yes);
    },
    OnWXErr:function (err){
        this.ShowAlert('OnWXErr '+err)
    },
    //个人信息
    OnBtnSelfInfo:function(){
        cc.gSoundRes.PlaySound("Button");
        this.m_bTipGPS = true;
        this.OnBtRefeshRoomCard();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Addr = g_GlobalUserInfo.GetUserAddress(pGlobalUserData.dwUserID);
        if (Addr.berror) {
            if (cc.sys.isNative) {
                ThirdPartyGetAddress(1);
            } else {
                // var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                // g_GlobalUserInfo.SetUserAddress(pGlobalUserData.dwUserID, 'H5登录暂时无法获取信息！', false);
                // this.scheduleOnce(function(){
                //     this.UpdateGPS('{"berror":false,"longitude": 123.434104,"latitude": 41.814169,"code": 0,"address": "沈阳市","msg": "success"}');
                // }.bind(this),1);
                this.UpdateGPS('{"berror":false,"longitude": 123.434104,"latitude": 41.814169,"code": 0,"address": "沈阳市","msg": "success"}');
            }
        }
        this.ShowPrefabDLG('SelfInfo', this.m_DlgNode, function(Js){
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            Js.SetInfo(pGlobalUserData.dwUserID, pGlobalUserData.szClientIP,pGlobalUserData.llUserIngot);
            this.m_SelfInfo = Js;
        }.bind(this));
    },

    //菜单列表
    OnBtClickedMenu:function(){
        // cc.gSoundRes.PlaySound('Button');
        this.m_MenuNode.active = !this.m_MenuNode.active;
    },

    //退出
    OnBtClickedExit :function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowAlert('确定退出游戏！',Alert_YesNo,function(Res){
            if(Res){
                gReLogin = true;
                gClientKernel.destory();
                window.gClubClientKernel.shutdown();
                ChangeScene('Launch');
            }
        })
    },

    //加入俱乐部
    OnBtJoinClub:function(){
        this.ShowPrefabDLG('ClubFreeDLG', this.m_DlgNode, function (Js){
            Js.OnBtShowJoin();
        }.bind(this))
    },
    OnClickRoomList:function(){
        this.ShowPrefabDLG('RoomList', this.m_DlgNode, function(Js){
            this.m_RoomList = Js;
        }.bind(this));
    },
///////////////////////////////////////////////////////////////////////////////////////

    OnLoadOwnRoomList:function(){
        //房间记录
        var OR = new CMD_GP_C_OwnRoom();
        OR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_GET_OWN_ROOM, OR);
    },

    onOwnRoomList:function(OwnRoom) {//CMD_GP_S_OwnRoomInfo
        if(this.m_RoomList && this.m_RoomList.onOwnRoomList) this.m_RoomList.onOwnRoomList(OwnRoom);
    },

    OnLoadRoomHistory:function() {
        //房间记录
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/League.php?&GetMark=6&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            var ClubList = JSON.parse(data);
            var GRE = new CMD_GP_C_GetRoomEx();
            for (var i = 0; i < 10; i++) {
                GRE.dwClubID[i] = 0;
                if (ClubList[i]) GRE.dwClubID[i] = ClubList[i].ClubID;
            }
            var TempStr = cc.sys.localStorage.getItem(window.QPName + 'RoomHistory');
            var TempArr = new Array();
            if (TempStr) TempArr = JSON.parse(TempStr);
            for (var i = 0; i < 40; i++) {
                GRE.dwRoomID[i] = 0;
                //if(TempArr[i]) GRE.dwRoomID[i]=TempArr[i];
            }
            var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_GET_ROOMEX, GRE);
        }.bind(this));
    },
    OnQueryLoadRoomHistory: function(ClubList) {
        if(!ClubList) return;
        var GRE = new CMD_GP_C_GetRoomEx();
        for (var i = 0; i < 10; i++) {
            GRE.dwClubID[i] = 0;
            if (ClubList[i]) GRE.dwClubID[i] = ClubList[i].ClubID;
        }
        var TempStr = cc.sys.localStorage.getItem(window.QPName + 'RoomHistory');
        var TempArr = new Array();
        if (TempStr) TempArr = JSON.parse(TempStr);
        for (var i = 0; i < 40; i++) {
            GRE.dwRoomID[i] = 0;
            //if(TempArr[i]) GRE.dwRoomID[i]=TempArr[i];
        }
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_GET_ROOMEX, GRE);
    },

    OnGetRoomExRes:function(Res){//CMD_GP_C_GetRoomExRes
        this.m_RoomArr = Res;
        if(this.RoomList && this.RoomList.OnGetRoomExRes) this.RoomList.OnGetRoomExRes(Res);
    },

    update:function(){
        //微信H5 code登录
        if(this.m_NeedLogin){
             this.m_NeedLogin = null;
             if(window.g_PhpUserName!=null){
                 this.LoginAccount(window.g_PhpUserName,hex_md5(window.g_PhpPassword));
             }else{
                 var WXCode = getQueryString("code");
                 var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=7&code=' + WXCode;
                 WebCenter.GetData(webUrl, null, function (data) {
                     var Login = JSON.parse(data);
                     if(Login.errcode != null) return this.ShowAlert("ErrCode:" + Login.errcode,Alert_Yes,function(){
                         ThirdPartyCopyClipper(data)
                         ThirdPartyExitGame();
                     });
                     this.LoginAccount(Login.Accounts, Login.LogonPass);
                 }.bind(this));
             }
        }
        //显示处理
        if (this.m_bNeedUpdate) {
            this.m_bNeedUpdate = false;
        } else {
            return;
        }
        // if(!this.m_LeagueList){
        //     this.ShowPrefabDLG('LeagueList', this.m_DlgNode, function(Js){
        //         this.m_LeagueList = Js;
        //         this.m_LeagueList.node.zIndex = -1;
        //     }.bind(this));
        // }
        // if (cc.sys.isNative) {
        //     ThirdPartyGetAddress(1);
        // } else {
        //     var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //     g_GlobalUserInfo.SetUserAddress(pGlobalUserData.dwUserID, 'H5登录暂时无法获取信息！', false);
        // }
    },

    OnUpdateCard:function(obj){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_RoomCard.string = pGlobalUserData.llUserIngot;
    },

    OnUpload_Success: function() {
        this.ShowAlert('上传完成！',Alert_Yes, function(Res){
            var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
            this.m_MeUserCtrl.SetUserByID(pGlobalUserData.dwUserID, true);
            if(this.m_SelfInfo && this.m_SelfInfo.node.active && this.m_SelfInfo.OnUpload_Finish) {
                this.m_SelfInfo.OnUpload_Finish();
            }
            if(this['m_JsClubDLG']&&this['m_JsClubDLG'].node.active&&this['m_JsClubDLG'].OnUpload_Finish){
                this['m_JsClubDLG'].OnUpload_Finish();
            }
        }.bind(this));
    },

    OnUpload_Faild: function() {
        this.OnUpload_Success();
    },

    UpdateGPS:function (Info) {
        if(!Info || Info.length <= 0) return
        var Obj = JSON.parse(Info);
        // if(Obj.berror == true || Obj.code != 0)return this.GetSelfGPSInfo();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(Obj.berror === true) g_GlobalUserInfo.SetUserAddress(pGlobalUserData.dwUserID, '用户运行环境无法准确获取地理位置！', Obj.berror);
        else
            g_GlobalUserInfo.SetUserAddress(pGlobalUserData.dwUserID, Obj.address, Obj.berror);

        if(this.m_SelfInfo && this.m_SelfInfo.node.active) {
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            this.m_SelfInfo.SetInfo(pGlobalUserData.dwUserID, pGlobalUserData.szClientIP,pGlobalUserData.llUserIngot);
        }
    },
    onSwitchBG:function(index){
        if(index == null) index = window.g_Setting[window.SetKey_Lobby_BG];
        var bg = this.$('plazabg@Sprite');
        cc.resources.load("Image/BG/BG"+index, cc.SpriteFrame, function (err, spriteFrame) {
            bg.spriteFrame = spriteFrame;
        });
    }
});
