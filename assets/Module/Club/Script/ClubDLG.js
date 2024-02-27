cc.Class({
    extends: cc.BaseClass,

    properties: {
        //动态创建排序列表
        m_NdClubList:cc.Node,
        //加入或创建相关
        m_WaitJoinNode:cc.Node,//等待加入
        //选择信息
        m_ClubCreater:cc.Node,
        m_LabClubNotice:cc.Label,
        //为选择或无数据时隐藏界面
        m_BottomNodes:[cc.Node],
        m_NullClubShow:[cc.Node],
        m_NdLv7UI:[cc.Node],
        m_NdLv6UI:[cc.Node],
        m_LeagueUI:[cc.Node],
        m_CreaterUI:[cc.Node],
        //玩家列表
        m_HaveUserNode:cc.Node,
        m_NoticeNode:cc.Node,
    },

    ctor:function () {
        this.m_SelClubInfo = null;
        this.m_RoomInfoMap = new Object();//俱乐部房间

        this.NORMAL_GAME = 2;
        this.SHOW_RANK = 4;
        this._AndroidCnt = 0;
    },
    start:function () {
        this.m_WaitJoinNode.active = false;
        this.m_bUpdateRoom = false;
        window.LoadSetting();
        this.onSwitchBG();

    },
    HideClubAll:function (){
        //this.SetClubNotice('您好，欢迎来到联盟，快去创建一个试试吧！');
        for (var i in this.m_LeagueUI) {
            this.m_LeagueUI[i].active = false;
        }
        for(var i in this.m_CreaterUI){
            this.m_CreaterUI[i].active = false;
        }
        for(var i in this.m_NdLv7UI){
            this.m_NdLv7UI[i].active = false;
        }
        for(var i in this.m_NdLv6UI){
            this.m_NdLv6UI[i].active = false;
        }
        this.m_NoticeNode.y = (-30);
        for(var i in this.m_BottomNodes){
            this.m_BottomNodes[i].active = false;
        }
        for(var i in this.m_NullClubShow){
            this.m_NullClubShow[i].active = true;
        }
        //this.$('RoomScrollView@ClubRoomView').UpdateRoomList(false, null);
    },

    update:function (dt) {
        if(this.m_UpdateTime == null) return
        var now = new Date().getTime();
        if(now - this.m_UpdateTime < 3000) return
        //this.OnClick_BtUpdate();
        //this.m_UpdateTime = now;
    },
    OnShowView:function (bForceUpdare) {
        this.m_bUpdateRoom = false;
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        if(this.m_RoomCtrl == null) {
            this.m_RoomCtrl = this.$('NewNode/RoomScrollView@ClubRoomView');
            this.m_RoomCtrl.SetHook(this); 
        }
       
        window.gClubClientKernel.onSetClubSink(this,this.m_RoomCtrl);

        if(this.m_SelClubInfo == null) this.HideClubAll();
        //console.log('ShowLobbyClub',ShowLobbyClub)
        this.$('@ClubList&Pre',this.m_NdClubList).m_Hook = this;
        this.$('@ClubList&Pre',this.m_NdClubList).OnUpdateList();

        this.m_UpdateTime = null;
        if(this._btAgreeInvite == null) this._btAgreeInvite = this.$('BTUI/BottomBG/BtAgreeInvire');
        if(this._btRefushInvite == null) this._btRefushInvite = this.$('BTUI/BottomBG/BtRefushInvire');
    },
    OnClick_BtUpdate:function () {
        ShowLobbyClub = this.m_SelClubInfo.dwClubID;
        this.OnShowView(true);
    },
    OnHideView:function () {
        this.m_WaitJoinNode.active = false;
        this.m_Hook.m_bNeedUpdate = true;
        this.ResetView();
        window.gClubClientKernel.onSendEnetrOrLeave(false,g_ShowClubInfo.dwClubID,0);
        window.gClubClientKernel.onSetClubSink(null,null);
        g_ShowClubInfo = null;
        ShowLobbyClub = 0;
        cc.director.emit('Lobby_InitShareInfo');
        this.node.active = false;
    },
    OnChangeClub:function (ClubInfo) {
        this.m_UpdateTime = new Date().getTime();
        ShowLobbyClub = 0;
        var OldClub = 0;
        if(this.m_SelClubInfo) OldClub = this.m_SelClubInfo.dwClubID;
        this.m_SelClubInfo = ClubInfo;
        g_ShowClubInfo = ClubInfo;
        this.m_RoomCtrl.InitRoomView(this.m_SelClubInfo);

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //if(OldClub == 0 || OldClub != this.m_SelClubInfo.dwClubID){
            this.$('@UserCtrl', this.m_ClubCreater).SetUserByID(pGlobalUserData.dwUserID)//ClubInfo.CreaterID
            this.$('@UserCtrl', this.m_ClubCreater).SetShowFullName(false, 6);
        //}
        this.$('BTUI/Top/ClubCtrl/ClubID@Label').string = ClubInfo.dwAllianceID;
        this.$('BTUI/Top/ClubCtrl/ClubName@Label').string = ClubInfo.szClubName;
        this.$('BTUI/Top/UserNode/UserCtrl/CardNum/CardNum@Label').string = pGlobalUserData.llUserIngot;
        this.$('BTUI/Top/UserNode/UserCtrl/ScoreNum/ScoreNum@Label').string = Score2Str(parseInt(ClubInfo.llScore));
        this.SetClubNotice(ClubInfo.szNotice);

        this.m_NoticeNode.y=(0);
        for(var i in this.m_BottomNodes){
            this.m_BottomNodes[i].active = true;
        }

        for (var i in this.m_LeagueUI) {
            this.m_LeagueUI[i].active = this.m_SelClubInfo.wKindID > CLUB_KIND_0;
        }

        if(this.m_SelClubInfo.wKindID > CLUB_KIND_0){
            for(var i in this.m_NdLv6UI){
                this.m_NdLv6UI[i].active = this.m_SelClubInfo.cbClubLevel >= CLUB_LEVEL_PARTNER;
            }
        }

        for(var i in this.m_CreaterUI){
            this.m_CreaterUI[i].active = this.m_SelClubInfo.cbClubLevel >= CLUB_LEVEL_MANAGER;
        }

        this.$('BTUI/Top/UserNode/UserCtrl/ScoreNum').active = ClubInfo.wKindID > CLUB_KIND_0;
        this.$('BTUI/BottomBG/Layout/BtAdJustScore').active = ClubInfo.wKindID > CLUB_KIND_0;
        this.$('BTUI/BottomBG/Layout/BtRand').active = ClubInfo.wKindID == CLUB_KIND_0;

        this.$('BTUI/BottomBG/Layout/BtSet').active = ClubInfo.wKindID == CLUB_KIND_2;
        this.$('BTUI/BottomBG/Layout/BtSet2').active = ClubInfo.wKindID < CLUB_KIND_2;
        
        if(this.m_SelClubInfo.cbClubLevel > CLUB_LEVEL_MEMBER && this.m_SelClubInfo.cbClubLevel == CLUB_LEVEL_MANAGER){
            this.$('BTUI/BottomBG/Layout/BtMyselfCard').active = false;
        }
        
        this.$('CloseFlag').active = this.m_SelClubInfo.cbCloseStatus == 1;

        this._btAgreeInvite.active = ClubInfo.cbIsInvite == 0;
        this._btRefushInvite.active = ClubInfo.cbIsInvite == 1;

        this.UpdateUserList(false);

        var webUrl = window.PHP_HOME+'/ClubAndroid.php?&GetMark=0&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&dwClubID='+g_ShowClubInfo.dwClubID;
        WebCenter.GetData(webUrl, null, function (data) {
            var AndroidInfo = JSON.parse(data);
            this.$('BTUI/Top/ButtomNode/Layout/BtClubAndroid').active = AndroidInfo[0]>0;
        }.bind(this));

        window.gClubClientKernel.onSendEnetrOrLeave(true,ClubInfo.dwClubID,ClubInfo.cbClubLevel);
    },

    UpdateUserList:function(bForceUpdare) {
        if(this.m_SelClubInfo == null) return;
        var ClubID = this.m_SelClubInfo.dwClubID;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=7&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&ClubID='+ClubID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserMap = JSON.parse(data);
            this.m_HaveUserNode.active = (UserMap[2] && UserMap[2].length > 0);
        }.bind(this));
    },
    UpdateUserScore:function() {
        if(this.m_SelClubInfo == null) return;
        this.$('BTUI/Top/UserNode/UserCtrl/ScoreNum/ScoreNum@Label').string = Score2Str(parseInt(this.m_SelClubInfo.llScore));
    },
    OnShowRedPoint:function(bShow){
        this.m_HaveUserNode.active = bShow;
    },
    //设置俱乐部滚动公告
    SetClubNotice:function (str) {
        this.m_LabClubNotice.node.stopAllActions();
        this.m_LabClubNotice.string = str;
        this.m_LabClubNotice.node.x=(800);
        if(str!= null && str.length > 0){
            var act = cc.sequence(cc.moveTo(0,cc.v2(800,0)), cc.moveTo(10,cc.v2(-800,0)));
            this.m_LabClubNotice.node.runAction(cc.repeatForever(act));
        }

    },
    //显示创建房间界面
    OnBtShowCreateRoom:function(Tag,Data){
        cc.gSoundRes.PlaySound('Button');
        //g_Lobby.SendReLinkQuery();
        this.ShowPrefabDLG('SelectGame',this.node,function(Js){
            var TempType = 0;
            if( this.m_SelClubInfo.wKindID>CLUB_KIND_0 && (this.m_SelClubInfo.dwRules&this.NORMAL_GAME) > 1) TempType = 1;
            Js.OnSetRoomType(TempType);
        }.bind(this));
        // this.ShowPrefabDLG('CreateRoom',this.node,function(Js){
        //     var TempType = 0;
        //     if( this.m_SelClubInfo.wKindID>CLUB_KIND_0 && (this.m_SelClubInfo.dwRules&this.NORMAL_GAME) > 1) TempType = 1;
        //     Js.OnClubAutoView(TempType);
        // }.bind(this));
    },
    //创建房间
    OnCreateRoom:function(wKindID, RulesArr, ServerRules, Name){

        if(this.m_SelClubInfo.cbCloseStatus == 1) return g_Lobby.ShowTips('已经打烊，不能创建房间');

        this.m_createRoomInfor = {};
        this.m_createRoomInfor.wKindID = wKindID;
        this.m_createRoomInfor.RulesArr = RulesArr;
        this.m_createRoomInfor.ServerRules = ServerRules;
        this.m_createRoomInfor.Name = Name;

        this.ShowPrefabDLG('ClubTableSet',null,function(Js){
            Js.OnSetRuleInfor(wKindID,this.m_SelClubInfo.wKindID,null);
        }.bind(this));

    },
    OnModifyTableRule:function(RoomInfor){
        this.ShowPrefabDLG('ClubTableSet',null,function(Js){
            Js.OnSetRuleInfor(RoomInfor.wKindID,this.m_SelClubInfo.wKindID,RoomInfor);
        }.bind(this));
    },
    OnSendModifyTableRule:function(ObjParas){
        var Obj = new CMD_GP_C_ModifyTableRule();
        Obj.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        Obj.dwRoomID=ObjParas.RoomID;

        Obj.llSitScore = ObjParas.llSitScore;        //参与分
        Obj.llStandScore = ObjParas.llStandScore;      //淘汰分

        Obj.dwBigRevRules = ObjParas.dwBigRevRules;     //大局表情规则
        Obj.dwBigMinScore = ObjParas.dwBigMinScore;     //大局表情起曾分
        Obj.dwBigCnt = ObjParas.dwBigCnt;          //大局百分比或固定数量

        Obj.dwSmallRevRules = ObjParas.dwSmallRevRules;     //小局表情规则
        Obj.dwSmallMinScore = ObjParas.dwSmallMinScore;     //小局表情起曾分
        Obj.dwSmallCnt = ObjParas.dwSmallCnt;          //小局百分比或固定数量

        Obj.cbReturnType = ObjParas.cbReturnType;        //反水类型
        Obj.bNegativeScore = ObjParas.bNegativeScore;        //反水类型
        Obj.dwMagnification = ObjParas.dwMagnification;       //倍率
        Obj.szTag = ObjParas.szTag;                //标签

        window.gClubClientKernel.OnSendModifyTableRule(this,Obj);
        //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_MODIFY_TABLE_RULE, Obj);
    },
    OnSendCreateRoom:function(Obj){

        if(g_Lobby.OnCheckGame(this.m_createRoomInfor.wKindID)) return
        //g_Lobby.ShowLoading();
        var QueryGR = new CMD_GP_C_CreateRoom();
        QueryGR.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryGR.wKindID=this.m_createRoomInfor.wKindID;
        for(var i=0;i<5;i++){
            if(this.m_createRoomInfor.RulesArr[i]==null) this.m_createRoomInfor.RulesArr[i]=0;
            QueryGR.dwRules[i] = this.m_createRoomInfor.RulesArr[i];
        }
        QueryGR.dwClubID=this.m_SelClubInfo.dwClubID;
        QueryGR.byPartID=0;
        QueryGR.dwServerRules=this.m_createRoomInfor.ServerRules;
        QueryGR.szRoomName=this.m_createRoomInfor.Name;

        QueryGR.cbClubKind = this.m_SelClubInfo.wKindID; //俱乐部类型
        QueryGR.llSitScore = Obj.llSitScore;        //参与分
        QueryGR.llStandScore = Obj.llStandScore;      //淘汰分

        QueryGR.dwBigRevRules = Obj.dwBigRevRules;     //大局表情规则
        QueryGR.dwBigMinScore = Obj.dwBigMinScore;     //大局表情起曾分
        QueryGR.dwBigCnt = Obj.dwBigCnt;          //大局百分比或固定数量

        QueryGR.dwSmallRevRules = Obj.dwSmallRevRules;     //小局表情规则
        QueryGR.dwSmallMinScore = Obj.dwSmallMinScore;     //小局表情起曾分
        QueryGR.dwSmallCnt = Obj.dwSmallCnt;          //小局百分比或固定数量

        QueryGR.cbReturnType = Obj.cbReturnType;        //反水类型
        QueryGR.bNegativeScore = Obj.bNegativeScore;        //反水类型
        QueryGR.dwMagnification = Obj.dwMagnification;       //倍率
        QueryGR.szTag = Obj.szTag;                //标签

        //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_CREATE_ROOM, QueryGR);

        window.gClubClientKernel.OnSendCreateRoom(this,QueryGR);
    },

    OnCreatRoomRes:function (RoomSuc){//CMD_GP_S_CreatSuccess
        g_Lobby.StopLoading();
        this.ShowTips("创建成功！");
    },

    //创建&加入失败信息
    OnQueryFailed:function (FailedRes){
        //g_Lobby.StopLoading();
        if(FailedRes.byRes == 16){
            this.ShowAlert(FailStr[FailedRes.byRes],Alert_Yes,function(){
                WebCenter.SetDataOutTime(this.m_SelClubInfo.ClubID+'');
                if(this['m_JsClubSet']) this['m_JsClubSet'].HideView();
                this.HideView();
            }.bind(this));
        }
        else{
            this.ShowTips( FailStr[FailedRes.byRes]);
        }
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
    OnEnterRoom:function(RoomID) {
        this.m_Hook.OnQueryRoom(RoomID, this.m_SelClubInfo.ClubID);
    },
    OnDissolveRoom:function(RoomID, CreaterID, Force) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(pGlobalUserData.dwUserID != CreaterID && this.m_SelClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER ){
            this.ShowTips("您不是房主，无法解散房间！");
            return;
        }
        this.m_Hook.OnDissolveClubRoom(RoomID,this.m_SelClubInfo.ClubID,this.m_SelClubInfo.LeagueID,pGlobalUserData.dwUserID,Force);
    },
    OnBtShowDlg:function(Tag,Data){
        if('ClubScoreRecord' != Data) cc.gSoundRes.PlaySound('Button');
        if(this.m_SelClubInfo == null) return;
        this.ShowPrefabDLG(Data);
    },
    OnClick_BtNotice:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Activity',this.node,function(Js){
            Js.OnShowData(0, this.m_SelClubInfo.dwClubID,this.m_SelClubInfo.wKindID);
        }.bind(this));
    },
    OnBtShowAndroidManager:function(){
        if(this.m_SelClubInfo.cbClubLevel<9) return;
        this.ShowPrefabDLG('ClubAndroidList');
    },
    //退出/解散 俱乐部
    OnBtExitClub:function() {
        var str = '确认退出？'//该联盟
        if(this.m_SelClubInfo.ClubLevel == 9) str ='确认解散？';//该联盟
        this.ShowAlert(str,Alert_YesNo, function(Res) {
            if(Res) {
                //g_Lobby.ShowLoading();
                var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                var QueryEC = new CMD_GP_C_ExitClub();
                QueryEC.dwUserID=pGlobalUserData.dwUserID;
                QueryEC.dwClubID=this.m_SelClubInfo.dwClubID;
                QueryEC.szPassWord=pGlobalUserData.szPassword;
                window.gClubClientKernel.onSendDissClub(this,QueryEC);
            }
        }.bind(this));
    },
    //显示合伙人关系
    OnClickShowLeaderData:function(_,data){
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.ShowPrefabDLG('ClubPartner', this.node, function(Js){
            Js.OnShowSubData(0,pGlobalUserData.dwUserID, pGlobalUserData.dwGameID,this.m_SelClubInfo.cbClubLevel, 1);
        }.bind(this));
    },

    //俱乐部赠送
    OnGiveScore:function(UserID, Type, Score,Remark) {
        this.m_GRecord = true;
        //g_Lobby.ShowLoading();
        //this.m_Hook.OnClubGiveUserScore(UserID, Score, Type,this.m_SelClubInfo.ClubID,this.m_SelClubInfo.ClubID);
        var QueryCG = new CMD_GP_C_ClubGive();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        QueryCG.dwUserID = pGlobalUserData.dwUserID;
        QueryCG.szPassWord = pGlobalUserData.szPassword;
        QueryCG.dwTagUserID = parseInt(UserID);
        QueryCG.lScore = parseInt(Score);					//金额
        QueryCG.byType = parseInt(Type);					//种类
        QueryCG.dwClubID1 = this.m_SelClubInfo.dwClubID;
        QueryCG.dwClubID2 = this.m_SelClubInfo.dwClubID;
        QueryCG.szRemark = Remark;
        window.gClubClientKernel.OnSendGiveScore(this,QueryCG);
    },

    //俱乐部下分
    OnTakeScore:function(UserID, Type, Score) {
        this.m_GRecord = true;
        //g_Lobby.ShowLoading();
        //this.m_Hook.OnClubTakeUserScore(UserID, Score, Type,this.m_SelClubInfo.ClubID,this.m_SelClubInfo.ClubID);
        var QueryCG = new CMD_GP_C_ClubGive();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        QueryCG.dwUserID = pGlobalUserData.dwUserID;
        QueryCG.szPassWord = pGlobalUserData.szPassword;
        QueryCG.dwTagUserID = parseInt(UserID);
        QueryCG.lScore = parseInt(Score);					//金额
        QueryCG.byType = parseInt(Type);					//种类
        QueryCG.dwClubID1 = this.m_SelClubInfo.dwClubID;
        QueryCG.dwClubID2 = this.m_SelClubInfo.dwClubID;
        window.gClubClientKernel.OnSendTakeScore(this,QueryCG);
    },
    //操作结果
    // OnMsgRes:function(Msg){
    //     g_Lobby.StopLoading();
    //     WebCenter.SetDataOutTime('GetMark=10');//上下分 更新
    //     this.ShowAlert(Msg, Alert_Yes, function(Res) {
    //         this.OnShowView(true);
    //     }.bind(this));
    // },
    //战绩
    OnBtShowClubRecord:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        g_Lobby.ShowLoading();
        this.ShowPrefabDLG('GameRecord');
    },

    ShowUserInfo: function(UserID, Level, ClubID){
        this.ShowPrefabDLG("ClubUserSet",this.node,function(Js){
            Js.OnShowClubUser(UserID, Level, ClubID) ;
        }.bind(this));
    },
    ShowUserScoreInfo: function(UserID, View){
        this.ShowPrefabDLG("ClubUserScore",this.node,function(Js){
            Js.OnShowClubUser(UserID, this.m_SelClubInfo.ClubID, View) ;
        }.bind(this));
    },

    OnBtShare: function(){
        if(this.m_SelClubInfo == null ){
            this.ShowTips("请先进入！");//联盟
            return;
        }
        this.ShowPrefabDLG("SharePre")
    },
    //分享信息
    GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【'+this.m_SelClubInfo.ClubName+'】 同盟会 ID：'+this.m_SelClubInfo.dwClubID;
        ShareInfo.desc = '欢迎加入【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_SelClubInfo.dwCreaterID].NickName+'】ID：'
            +g_GlobalUserInfo.m_UserInfoMap[this.m_SelClubInfo.dwCreaterID].GameID+'的同盟会';
        ShareInfo.link = cc.share.MakeLink_InviteClub(this.m_SelClubInfo.wKindID, this.m_SelClubInfo.dwAllianceID, cc.share.Mode.ToH5);
        return ShareInfo;
    },
    SendClubConfig: function(bSeeNull,bMC){
        var QueryCS = new CMD_GP_C_ClubSet();
        QueryCS.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryCS.dwClubID = parseInt(this.m_SelClubInfo.ClubID);
        QueryCS.dwLeagueID = parseInt(this.m_SelClubInfo.LeagueID);
        QueryCS.bySeeNullRoom = bSeeNull?1:0;					//成员仅见空房
        QueryCS.byMemberCreat = bMC?3:9;					    //成员开房
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_CLUB_SET, QueryCS);
    },
    //俱乐部配置结果
    OnClubSetSuc:function(){
        g_Lobby.StopLoading();
        this.ShowTips("服务器接受了配置信息！！！");
        //this.$('RoomScrollView@ClubRoomView').UpdateRoomList(true, this.m_SelClubInfo);
    },
    OnOpNoChat: function(bNoChat){
        var QueryCS = new CMD_GP_C_ClubRoomSet();
        QueryCS.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryCS.dwClubID = parseInt(this.m_SelClubInfo.ClubID);
        QueryCS.dwLeagueID = parseInt(this.m_SelClubInfo.LeagueID);
        QueryCS.byNoChat = bNoChat?1:0;					//成员仅见空房
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_CLUB_ROOM_SET, QueryCS);
    },
    //设置俱乐部配置
    OnSetClubRevenue:function(ClubID,LeagueID,Mark,Limit,Rate,Cnt,byNoUpdateScore){
        var QueryCS = new CMD_GP_C_ClubRevenueSet();
        QueryCS.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        QueryCS.dwClubID = ClubID;
        QueryCS.dwLeagueID = LeagueID;
        QueryCS.dwMark = Mark;
        QueryCS.dwLimit = Limit;
        QueryCS.wRate = Rate;
        QueryCS.wCnt = Cnt;
        QueryCS.byNoUpdateScore = byNoUpdateScore;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_CLUB_REVENUE_SET, QueryCS);
    },

    OnRePlayGame:function( RecordID, KindID, LookUser){
        this.m_Hook.OnRePlayGame(RecordID, KindID, LookUser);
    },

    OnOpClubUserLv:function(UserID, Level){
        window.gClubClientKernel.onSendSetClubUserLvL(UserID,this.m_SelClubInfo.dwClubID,Level);
    },
    //俱乐部列表
    OnClickShowClubList:function(){
        ShowL2C(this.m_NdClubList);
    },
    OnClickMoreClub:function(){
        this.ShowPrefabDLG('ClubFreeDLG');
    },
    //俱乐部流水
    OnClickGameRecordClub: function(){
        g_Lobby.ShowLoading();
        this.ShowPrefabDLG('ClubGameRecord');
    },
    OnClick_ShowRoomKind:function() {
        this.OnShowView();
    },
    OnShowRevenueList:function (LeaderID) {
        this.ShowPrefabDLG('ClubRevenueList&Pre',this.node,function(Js){
            Js.OnUpdateList(LeaderID, this.m_SelClubInfo.ClubID);
        }.bind(this));
    },
    OnUpdateScore:function(obj){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        if(obj.cbType == 0){
            if(pGlobalUserData.dwUserID == obj.dwUserID){
                obj.lScore = -obj.lScore;
            }
        }else{
            if(pGlobalUserData.dwUserID != obj.dwUserID){
                obj.lScore = -obj.lScore;
            }
        }

        this.UpdateScore(obj.lScore);
        //刷新
        if(this['m_JsClubRank']&&this['m_JsClubRank'].node.active) this['m_JsClubRank'].m_bNeedUpdate = true;
    },
    UpdateScore:function(lScore){
        this.m_SelClubInfo.llScore = (parseInt(this.m_SelClubInfo.llScore)+parseInt(lScore));
        this.$('BTUI/Top/UserNode/UserCtrl/ScoreNum/ScoreNum@Label').string = Score2Str(parseInt(this.m_SelClubInfo.llScore));
    },
    OnUpdateCard:function(obj){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.$('BTUI/Top/UserNode/UserCtrl/CardNum/CardNum@Label').string = pGlobalUserData.llUserIngot;
    },

    OnBtShowPeopleCard:function(_,Data){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ClubPeopleCard',this.node,function(Js){
            Js.OnSetParam(Data);
        }.bind(this));
    },

    onDisClubRes:function(UserID){
        if(UserID==this.m_SelClubInfo.dwCreaterID) return;
        this.ShowAlert("俱乐部被解散!",Alert_Yes,function(){
            this.HideView();
        }.bind(this));
    },

    OnBtInviteStatus:function(_,Data){
        this._btAgreeInvite.active = !this._btAgreeInvite.active;
        this._btRefushInvite.active = !this._btRefushInvite.active;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_SelClubInfo.cbIsInvite = parseInt(Data);
        var webUrl = window.PHP_HOME+ '/League.php?GetMark=138&dwUserID='+pGlobalUserData.dwUserID+'&dwClubID='+this.m_SelClubInfo.dwClubID+'&isInvite='+Data;
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            this.ShowTips(Res.Describe);
        }.bind(this));
    },
    ResetView:function(){
        this['m_JsClubSet'] && this['m_JsClubSet'].HideView();
    },
    OnBtSelfInfo:function(){
        if(g_Lobby&&g_Lobby['m_JsSelfInfo']){
            g_Lobby['m_JsSelfInfo'].node.destroy();
            g_Lobby['m_JsSelfInfo'] = null;
        }
        g_Lobby && g_Lobby.OnBtnSelfInfo();
    },
    OnUpload_Finish:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.$('@UserCtrl', this.m_ClubCreater).SetUserByID(pGlobalUserData.dwUserID, true)//ClubInfo.CreaterID
        this.$('@UserCtrl', this.m_ClubCreater).SetShowFullName(false, 6); 
    },
    onSwitchBG:function(index){
        if(index == null) index = window.g_Setting[window.SetKey_CLUB_BG];
        var bg = this.$('BGClub@Sprite');
        cc.gPreLoader.LoadRes('Image_BG_CBG' + index, 'Club', function(sf){
            bg.spriteFrame = sf;
        });
    },
    onSwitchTableBG:function(index){
        if(index == null) index = window.g_Setting[window.SetKey_CLUB_TABLE_COLOR];
        if(this.m_RoomCtrl)this.m_RoomCtrl.OnSwitchTableBG(index);
    },
});
