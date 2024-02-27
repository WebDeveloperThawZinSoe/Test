
ClubClientKernel = cc.Class({
    extends: cc.Component,
    ctor: function () {
        this._ClubSink = null;
        this._ClubRoomSink = null;
        this._LobbySink = null;
        this._clubID = 0;
        this._InitiateClose = false;
        this._RelinkCuount = 0;
        this._Sink = null;
        //this.mHeartStatTime = 0;
        //this.mServerHeartTime = 0;
        this._inviteInfor = [];
        this._inviteUser = {};
        this._OnlineUser ={};
        this._ClubInfo = [];
        
    },

    connect: function () {
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel connect")
        //创建组件
        this._SocketEngine = new cc.CSocketEngine(this);
        this._SocketEngine.connect(window.LOGIN_SERVER_IP, window.CLUB_PORT);
    },
    shutdown: function () {
        if (!this._SocketEngine) return;
        this._inviteInfor = [];
        this._inviteUser = {};
        this._OnlineUser ={};
        this._InitiateClose = true;
        //this._ClubSink = null;
        //this._ClubRoomSink = null;
        this._SocketEngine.closesocket();
        this._SocketEngine = null;
        g_GlobalClubInfo.onClear();
        this.unschedule(this.NetworkHeartbeat);
    },

    onSetClubSink: function (ClubSink, ClubRoomSink) {
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel onSetClubSink")
        this._ClubSink = ClubSink;
        this._ClubRoomSink = ClubRoomSink;
    },
    onSetLobbySink: function (sink) {
        this._LobbySink = sink;
    },
    onEventTCPSocketLink: function (event) {
        g_CurScene.StopLoading();
        this._isAlive = true;
        this._InitiateClose = false;
        this._RelinkCuount = 0;
        this.onSendRegisterUser();
        //断线重连 判断当前页，为俱乐部，发送进入俱乐部消息
        if(g_Lobby&&g_Lobby['m_JsClubDLG']&&g_Lobby['m_JsClubDLG'].node.active){
            this._ClubRoomSink = g_Lobby['m_JsClubDLG'].m_RoomCtrl; 
            this._ClubSink = g_Lobby['m_JsClubDLG'];
            this.onSendEnetrOrLeave(true,g_ShowClubInfo.dwClubID,g_ShowClubInfo.cbClubLevel);
        }
        if(cc.share.IsH5_WX() && g_Lobby){
            g_Lobby.OnQueryParam();
        }
        //this.mServerHeartTime = new Date().getTime();
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel onEventTCPSocketLink")
        this.unschedule(this.NetworkHeartbeat);
        this.schedule(this.NetworkHeartbeat, 5);
        return true;
    },

    //网络心跳
    NetworkHeartbeat :function(dt) {
        //if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel NetworkHeartbeat---1");
        if(!this._isAlive) return;
       // if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel NetworkHeartbeat---2");
        //this.mHeartStatTime = new Date().getTime();           //服务器心跳时间
        if(this._SocketEngine) this._SocketEngine.sendClass(MDM_KN_COMMAND, SUB_KN_CLIENT_HEART, null);
        //this.onSendSocketClass(MDM_KN_COMMAND, SUB_KN_CLIENT_HEART);
    },

    onEventLinkErr: function () {
        if (this._InitiateClose == false) {
            if(this._RelinkCuount>3){
                g_CurScene.ShowAlert('与服务器断开连接!',Alert_Yes,function(){
                    window.gClubClientKernel.shutdown();
                    ChangeScene('Launch');
                }.bind(this))
                return;
            }
            this.connect();
        }
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel onEventLinkErr")
        return true;
    },
    OnErr: function () {
        this._isAlive = false;
        if (this._InitiateClose == false) {
            if(this._RelinkCuount == 0)g_CurScene.ShowLoading();
            this._RelinkCuount++;
            if(this._RelinkCuount%7 >= 6){
                g_CurScene.StopLoading();
                g_CurScene.ShowAlert('与服务器断开连接,请重新登录',Alert_Yes,function(){
                    window.gClubClientKernel.shutdown();
                    var kernel = window.gClientKernel.get();
                    kernel && kernel.mServerItem.IntermitConnect(true);
                    kernel && kernel.destory();
                    ChangeScene('Launch');
                }.bind(this))
                this._RelinkCuount = 0;
                this.unschedule(this.NetworkHeartbeat);
                return;
            }
            this._SocketEngine.closesocket();
            this.connect();
        }
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel OnErr")
        return true;
    },
    onEventTCPSocketShut: function () {
        this._isAlive = false;
        if (this._InitiateClose == false) {
            this._RelinkCuount++;
            if(this._RelinkCuount>3){
                g_CurScene.ShowAlert('与服务器断开连接!',Alert_Yes,function(){
                    window.gClubClientKernel.shutdown();
                    ChangeScene('Launch');
                }.bind(this))
                return;
            }
            this.connect();
        }
        if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel onEventTCPSocketShut")
    },

    onEventTCPSocketRead: function (main, sub, data, size) {
        // if (window.LOG_DEBUG) console.log("Club Client kernel main:" + main + " sub:" + sub);
        switch(main){
            case MDM_GC_CLUB: return this.onEventClubMsgHandle(sub, data, size);
            case MDM_GP_GET_SERVER: return this.onEventQueryMsgHandle(sub, data, size);
            case MDM_GC_PUSH: return this.onEventPushMsgHandle(sub, data, size);
        }
    },
    //心跳消息
    OnSocketHeart :function(){
        //if (window.LOG_DEBUG) console.log(" !-------------- ClubClientKernel OnSocketHeart")
        //服务器端返回的心跳
        this.mServerHeartTime = new Date().getTime();
        return true;
    },

    onEventClubMsgHandle:function(sub, data, size){
        switch (sub) {
            case SUB_CS_S_FORCED_OFFLINE: return this.onForcedOffline(data, size);
            case SUB_CS_S_UPDATE_CARD: return this.onUpdateCard(data, size);
            case SUB_CS_S_UPDATE_SCORE: return this.onUpdateScore(data, size);
            case SUB_CS_S_USER_INVITE:return this.onInviteUser(data, size);
            case SUB_CS_S_ANDROID_LIST:return this.onAndroidList(data, size);
            case SUB_CS_S_ANDROID_LIST_FINISH:return this.onAndroidListFinish();
            case SUB_CS_S_ANDROID_CREAT_RES:return this.onCreatAndroidRes();
            case SUB_CS_S_ANDROID_DEL_RES:return this.onDelAndroidRes();
            case SUB_CS_S_OPERATE_FAILURE:return this.onOperateFailure(data, size);
        }
        return true;
    },
    onEventQueryMsgHandle:function(sub, data, size){
        if(window.LOG_NET_DATA)console.log("onSocketQueryServer "+sub)
        switch (sub){
            //房间操作失败
            case SUB_GP_FAILED:		return this.onSocketQueryFailed(data, size);
            // 查询结果
            case SUB_GP_QUERYRES:		return this.onSocketQueryRes(data, size);
            //创建房间结果
            case SUB_GP_CREATE_SUCCESS:		return this.onSocketCreatRoomRes(data, size);
            case SUB_GP_JOIN_ROOM_RES:		return this.onSocketJoinRoomRes(data, size);
            //更新俱乐部房间列表
            case SUB_GP_CLUB_ROOM:		return this.onSocketUpdateClubRoom(data, size);
            case SUB_GP_CLUB_REVENUE_INFO:	return this.onSocketClubRevenueInfo(data, size);
            case SUB_GP_CLUB_USER_LIST:		return this.onSocketUpdateUserList(data, size);
            case SUB_GP_CLUB_DISS_SUC:		return this.onSocketDisClubRoom(data, size);
            case SUB_GP_ROOMCARD:   return this.onSocketGetUsingCard(data, size);
            case SUB_GP_CLUB_SET_SUC:   return this.onSocketClubSetSuc(data, size);
            case SUB_GP_GET_ROOMEX_RES:   return this.onSocketRoomExRes(data, size);
            case SUB_GP_OWN_ROOM_INFO:   return this.onSocketOwnRoomList(data, size);
            case SUB_GP_SERVER_TYPE_LIST: return this.onSocketServerTypeList(data, size);

            case SUB_GP_CREATE_CLUB_RES: return this.onSocketCreateClubRes(data, size);
            case SUB_GP_JOIN_CLUB_RES: return this.onSocketJoinClubRes(data, size);
            case SUB_GP_EXIT_CLUB_RES: return this.onSocketExitClubRes(data, size);
            case SUB_GP_ONLINE_USER_RES: return this.onSocketOnlineUserRes(data, size);
            case SUB_GP_CREAT_ANDROID_RES:return this.onSocketAndroidCreatRes(data, size);
            case SUB_GP_DELETE_ANDROID_RES: return this.onSocketDelAndroidRes(data, size);
            case SUB_GP_CREAT_ANDROID_GROUP_RES: return this.onSocketCreatAndroidGroupRes(data, size);
            case SUB_GP_DELETE_ANDROID_GROUP_RES:return this.onSocketDelAndroidGroupRes(data, size);
            case SUB_GP_GET_ANDROID_GROUP_LIST: return this.onSocketAndroidGroupList(data, size);
            case SUB_GP_GET_ANDROID_GROUP_LIST_END: return this.onSocketAndroidGroupListEnd(data, size);
            case SUB_GP_GET_ANDROID_CNT_INFO:return this.onSocketAndroidCntInfo(data, size);
            case SUB_GP_ONLINE_USER_RES_FINISH:return this.onSocketOnlineUserResFinish(data, size);
            case SUB_GP_RES_MSG:   return this.onSocketResMsg(data, size);
            //case SUB_GP_CREATE_AGENT_SUC:   return this.onSocketCreateAgentSuc();
            //case SUB_GP_SCAN_ROOM_INFO:     return this.onSocketScanRoomInfo(data, size);
        }
        return true;
    },
    onEventPushMsgHandle:function(sub, data, size){
        if(window.LOG_NET_DATA)console.log("onEventPushMsgHandle "+sub)
        switch (sub){
            case SUB_GP_S_CLUB_LIST_PUSH: return this.onSocketClubList(data, size);
            case SUB_GP_S_APPLY_PUSH:return this.onSocketUserApply(data, size);
            case SUB_GP_S_USER_LEVEL_PUSH: return this.onSocketSetMemLevel(data, size);
            case SUB_GP_S_EXIT_CLUB_PUSH: return this.onSocketDissClub(data, size);
            case SUB_GP_S_CLUB_INFO_PUSH: return this.onSocketClubInfo(data, size);
            case SUB_GP_S_ROOM_INFOR: return this.onSocketRoomInfor(data, size);
            case SUB_GP_S_DIS_ROOM :return this.onSocketDisRoom(data, size);
            case SUB_GP_S_USER_GAMESTATUS: return this.onSocketUserGameStatus(data, size);
            case SUB_GP_S_CHANGE_CLUB_INFO: return this.onSocketChangeClubInfo(data, size);
            case SUB_GP_S_MODIFY_ROOM_INFOR: return this.onSocketModifyTableRule(data, size);
            case SUB_GP_S_ONLINE_USER:return this.onSocketOnlineUser(data, size);
            case SUB_GP_S_OFFLINE_USER:return this.onSocketOfflineUser(data, size);
            case SUB_GP_S_CLUB_USER_SOCRE: return this.onSocketClubUserScore(data, size);
            case SUB_GP_S_CLUB_ROOM_INFO: return this.onSocketClubRoomInfo(data, size);
            case SUB_GP_S_KICK_USER_RES: return this.onSocketKickUserRes(data, size);
        }
        return true;
    },
    onSendSocketData: function (main, sub, data, size) {
        this._SocketEngine.send(main, sub, data, size);
    },
    onSendSocketClass: function (main, sub, Obj) {
        if (this._isAlive == false) {
            if(window.LOG_DEBUG) console.log("socket shutdown please reconnect scoket");
            return;
        }
        if(this._SocketEngine == null){
            this.connect();
            return;
        }
        if(this._SocketEngine) this._SocketEngine.sendClass(main, sub, Obj);
    },
    onForcedOffline: function (data, size) {
        var obj = new CMD_CS_S_OperateFailure();
        gCByte.Bytes2Str(obj, data);
        //console.log(obj.szDescribeString)
        g_CurScene.ShowAlert(obj.szDescribeString,Alert_Yes,function(){
            gReLogin = false;
            gClientKernel.destory();
            window.gClubClientKernel.shutdown();
            ChangeScene('Launch');
        }.bind(this))
        return true;
    },
    onUpdateScore: function (data, size) {

        var obj = new CMD_CS_S_UpdateScore();
        if (gCByte.Bytes2Str(obj, data) != size) return false;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (pGlobalUserData.dwUserID != obj.dwUserID) {
            g_Lobby && g_Lobby.ShowPrefabDLG('ClubUpdateScore', g_Lobby.node, function (Js) {
                Js.OnShowClubUser(obj.dwUserID, obj.lScore,obj.cbType);
            }.bind(this));
        }

        if (this._ClubSink) {
            this._ClubSink.OnUpdateScore(obj);
        }
        if(this._Sink) this._Sink.UpdateScore();
        this._Sink = null;

        return true;
    },
    onInviteUser:function(data, size){
        var obj = new CMD_CS_S_InviteUser();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        obj.time = new Date().getTime();
        this._inviteInfor.push(obj);
        if(window.LOG_DEBUG) console.log(obj);
        //判断提示是否显示
        if(g_CurScene&&g_CurScene['m_JsClubInviteAlter']&&g_CurScene['m_JsClubInviteAlter'].node.active) return;

        g_CurScene.ShowPrefabDLG('ClubInviteAlter',null,function(Js){
            Js.OnSetInviteInfor(this._inviteInfor.shift());
        }.bind(this));
        return true;
    },

    onAndroidList:function(data, size){
        var obj = new CMD_CS_S_AndroidInfo();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        if(this._Sink) this._Sink.onAndroidListRes(obj);
        return true;
    },

    onAndroidListFinish:function(data, size){
        if(this._Sink) this._Sink.onAndroidListResFinish();
        this._Sink = null;
        return true;
    },
    onCreatAndroidRes:function(){
        g_Lobby.ShowTips('机器人创建成功');
    },
    onDelAndroidRes:function(){
        g_Lobby.ShowTips('机器人删除成功');
    },

    onUpdateCard: function (data, size) {
        var obj = new CMD_CS_S_UpdateRoomCard();
        if (gCByte.Bytes2Str(obj, data) != size) return false;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        pGlobalUserData.llUserIngot -= obj.lRoomCard;

        if (this._ClubSink) {
            this._ClubSink.OnUpdateCard(obj);
        }
        if (g_Lobby) {
            g_Lobby.OnUpdateCard(obj);
        }
        return true;
    },

    onOperateFailure: function (data, size) {
        var obj = new CMD_CS_S_OperateFailure();
        gCByte.Bytes2Str(obj, data);
        g_CurScene.ShowAlert(obj.szDescribeString);
        return true;
    },

    onSocketQueryFailed :function(data, size){
        var Res = new CMD_GP_S_Failed();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink)this._Sink.OnQueryFailed(Res);
        this._Sink = null;
        return true;
    },
    onSocketQueryRes:function(data, size){
        var Res = new CMD_GP_S_ReturnServer();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink)this._Sink.OnQueryServerRes(Res);
        return true;
    },
    onSocketCreatRoomRes:function(data, size){
        var Res = new CMD_GP_S_CreatSuccess();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink)this._Sink.OnCreatRoomRes(Res);
        this._Sink = null;
        return true;
    },

    onSocketJoinRoomRes:function(data, size){
        var Res = new CMD_GP_S_ReturnRoom();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink)this._Sink.OnQueryRoomRes(Res);
        this._Sink = null;
        return true;
    },

    onSocketUpdateClubRoom:function(data, size){
        var Res = new CMD_GP_S_ClubRoomInfo();
        gCByte.Bytes2Str(Res, data);
        if(Res.wRoomCnt > 0){
            Res.RoomInfo = new Array();
            for(var i = 0;i<Res.wRoomCnt;i++){
                Res.RoomInfo[i] = new ServerRoomInfo();
            }
            if(size != gCByte.Bytes2Str(Res, data)) return false;
        }
        if(this._ClubRoomSink)  this._ClubRoomSink.LoadRoomInfo(Res);
        return true;
    },

    onSocketUpdateUserList:function(data, size){
        //console.log("!---------------------onSocketUpdateUserList");
        var Res = new CMD_GP_S_ClubUserInfo();
        var len = gCByte.Bytes2Str(Res, data);
        var s1 = gCByte.GetSize(new ServerRoomUserInfo());
        Res.UserInfo = {};
        for(var i = 0;i<Res.wPlayerCnt;i++){
            var tempObj = new ServerRoomUserInfo();
            gCByte.Bytes2Str(tempObj, data,len+s1*i);
            Res.UserInfo[`${tempObj.dwUserID}`] = tempObj;
        }

        if(this._ClubRoomSink) this._ClubRoomSink.SetRoomUserInfo(Res);
        return true;
    },

    onSocketResMsg:function(data, size){
        var Res = new CMD_GP_S_Msg();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink && this._Sink.OnMsgRes)this._Sink.OnMsgRes(Res.szMsg);
        else if(g_Lobby) g_Lobby.ShowTips(Res.szMsg);
        this._Sink = null;
        return true;
    },
    onSocketServerTypeList:function(data, size){
        var Res = new TagServerTypeInfo();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        if(this._Sink)this._Sink.onQueryGameLevelListRes(Res);
        return true;
    },
    onSocketCreateClubRes:function(data, size){
        var Res = new CMD_GP_UserClubInfo();
        gCByte.Bytes2Str(Res, data);
        g_GlobalClubInfo.onInsertClubInfo(Res);
        if(g_Lobby)g_Lobby.OnChangeClub(Res);

        if(g_Lobby){
            g_Lobby.ShowTips('创建成功');
            g_Lobby['m_JsClubFreeDLG'].ResetView();
            g_Lobby['m_JsClubFreeDLG'].node.active = false;
            g_Lobby.OnBtRefeshRoomCard();
        }
        return true;
    },

    onSocketJoinClubRes:function(data, size){
        var Res = new CMD_CS_S_JoinClubRes();
        if(gCByte.Bytes2Str(Res, data)!=size) return false;
        this._Sink && this._Sink.JoinClubRes(Res);
        this._Sink = null;
        return true;
    },

    onSocketExitClubRes:function(data, size){
        var Res = new CMD_CS_S_EixtClubRes();
        if(gCByte.Bytes2Str(Res, data)!=size) return false;
        g_GlobalClubInfo.onDeleteClubInfo(Res.dwClubID);
        if(g_Lobby){
            g_Lobby['m_JsClubDLG'].HideView();
            g_Lobby.ShowTips('退出成功');
        }
        return true;
    },
    onSocketOnlineUserRes:function(data, size){
        var ResSize = gCByte.GetSize(new CMD_CS_S_OnlineUserStatus());
        if(size%ResSize!=0) return false;

        var Cnt = size/ResSize;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var tempArr = [];
        for(var i =0;i<Cnt ;i++){
            var Res = new CMD_CS_S_OnlineUserStatus();
            gCByte.Bytes2Str(Res, data,ResSize*i);
            if(Res.dwUserID == pGlobalUserData.dwUserID) continue;
            if(this._inviteUser[`${Res.dwUserID}`])
            {
                this._inviteUser[`${Res.dwUserID}`].cbUserStatus =Res.cbUserStatus;
                this._inviteUser[`${Res.dwUserID}`].cbInvite =Res.cbInvite;
            }else{
                this._inviteUser[`${Res.dwUserID}`] = Res;
                Res.inviteTime = 0;
            }
            tempArr.push(Res);
        }
        for(var i in this._inviteUser){
            var vIn = false;
            for(var j in tempArr){
                if(tempArr[j].dwUserID==i) vIn = true;
            }
            if(vIn == false) delete this._inviteUser[i];
        }
        
        return true;
    },
    onSocketOnlineUserResFinish:function(data, size){
        this._Sink && this._Sink.onOnlineUserRes(this._inviteUser);
        this._Sink = null;
        return true;
    },
    onSocketAndroidCreatRes:function(data, size){
        var Res = new CMD_CS_S_OperateAndroidGroupRes();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onCreatAndroidRes(Res.cbResCode);
        //this._Sink = null;
        return true;
    },
    onSocketDelAndroidRes:function(data, size){
        var Res = new CMD_CS_S_OperateAndroidGroupRes();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onDelAndroidRes(Res.cbResCode);
        this._Sink = null;
        return true;
    },
    onSocketCreatAndroidGroupRes:function(data, size){
        var Res = new CMD_CS_S_OperateAndroidGroupRes();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onCreatRes(Res.cbResCode);
        this._Sink = null;
        return true;
    },
    onSocketDelAndroidGroupRes:function(data, size){
        var Res = new CMD_CS_S_OperateAndroidGroupRes();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onDelAndroidGroupRes(Res.cbResCode);
        this._Sink = null;
        return true;
    },
    onSocketAndroidGroupList:function(data, size){
        var Res = new CMD_CS_S_AndroidGroupInfo();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onAndroidGroupList(Res);
        return true;
    },
    onSocketAndroidGroupListEnd:function(){
        if(this._Sink) this._Sink.onAndroidGroupListEnd();
        this._Sink = null;
        return true;
    },
    onSocketAndroidCntInfo:function(data, size){
        var Res = new CMD_CS_S_GetAndroidCnt();
        if(gCByte.Bytes2Str(Res, data)!=size){
            return true;
        }
        if(this._Sink) this._Sink.onAndroidCntInfo(Res);
        this._Sink = null;
        return true;
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    //推送
    onSocketClubList:function(data, size){
        var Res = new CMD_GP_UserClubInfo();
        var ResSize = gCByte.GetSize(Res);
        if((size%ResSize) !=0  ) return false;
        var cnt = size/ResSize;
        for(var i =0;i<cnt;i++){
            var tempObj = new CMD_GP_UserClubInfo();
            gCByte.Bytes2Str(tempObj, data,i*ResSize);
            g_GlobalClubInfo.onInsertClubInfo(tempObj);
        }
        return true;
    },
    onSocketUserApply:function(data, size){
        if (g_Lobby && g_Lobby['m_JsClubDLG']) {
            g_Lobby['m_JsClubDLG'].OnShowRedPoint(true);
        }
        return true;
    },
    onSocketDissClub:function(data, size){
        var Res = new CMD_GP_S_DisClub();
        if(gCByte.Bytes2Str(Res,data)!=size) return false;
        g_GlobalClubInfo.onDeleteClubInfo(Res.dwClubID);

        if(g_Lobby && g_Lobby['m_JsClubFreeDLG'] && g_Lobby['m_JsClubFreeDLG'].node.active){
            g_Lobby['m_JsClubFreeDLG'].ShowKind();
        }

        if(g_Lobby && g_Lobby['m_JsClubDLG'] && g_Lobby['m_JsClubDLG'].m_SelClubInfo.dwClubID == Res.dwClubID){
            g_Lobby['m_JsClubDLG'].node.active = false;
            g_Lobby.ShowTips('俱乐部已解散');
        }
       

        return true;
    },
    onSocketClubInfo:function(data, size){
        var Res = new CMD_GP_UserClubInfo();
        if(gCByte.Bytes2Str(Res,data)!=size) return false;
        g_GlobalClubInfo.onInsertClubInfo(Res);

        if(g_Lobby && g_Lobby['m_JsClubFreeDLG'] && g_Lobby['m_JsClubFreeDLG'].node.active){
            g_Lobby['m_JsClubFreeDLG'].ShowKind();
        }
        return true;
    },

    onSocketSetMemLevel:function(data, size){
        var Res = new CMD_CS_S_SetMemLevel();
        if(gCByte.Bytes2Str(Res, data)!=size) return false;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(Res.dwUserID != pGlobalUserData.dwUserID){
            if(g_Lobby && g_Lobby['m_JsClubDLG'] && g_Lobby['m_JsClubDLG']['m_JsClubUserList']){
                g_Lobby['m_JsClubDLG']['m_JsClubUserList'].onUpdateUserList();
            }

            if(Res.cbOldLevel < Res.cbCurLevel && Res.cbCurLevel==6){
                g_Lobby && g_Lobby.ShowTips('合伙人添加成功');
                if(g_Lobby != null && g_Lobby['m_JsClubDLG'] != null && g_Lobby['m_JsClubDLG']['m_JsClubPartner'] != null)
                {
                    g_Lobby['m_JsClubDLG']['m_JsClubPartner'].m_bNeedUpdate = true;
                }
            }

            if(Res.cbOldLevel ==6 && Res.cbCurLevel==3){
                g_Lobby && g_Lobby.ShowTips('合伙人删除成功');
                if(g_Lobby != null && g_Lobby['m_JsClubDLG'] != null && g_Lobby['m_JsClubDLG']['m_JsClubPartner'] != null)
                {
                    g_Lobby['m_JsClubDLG']['m_JsClubPartner'].m_bNeedUpdate = true;
                }
            }

            if(Res.cbOldLevel == 2 && Res.cbCurLevel==3){
                g_Lobby && g_Lobby.ShowTips('操作成功');
                g_Lobby && g_Lobby['m_JsClubDLG']&&g_Lobby['m_JsClubDLG'].UpdateUserList();
            }

            if(Res.cbOldLevel == 0 && Res.cbCurLevel==3){
                g_Lobby && g_Lobby.ShowTips('邀请玩家成功');
            }
        }else{
            //更新等级
            g_GlobalClubInfo.onUpdateClubLevel(Res.dwClubID,Res.cbCurLevel);
            if(g_Table!=null) return;
            if(Res.cbOldLevel == 2 && Res.cbCurLevel == 3){
                g_Lobby && g_Lobby.ShowTips('申请被同意');
            }else if(Res.cbOldLevel == 2 && Res.cbCurLevel == 0){
                g_Lobby && g_Lobby.ShowTips('申请被拒绝');
            }else if(Res.cbOldLevel >=3 && Res.cbCurLevel == 0){
                g_Lobby && g_Lobby.ShowTips('被踢出俱乐部');
                g_GlobalClubInfo.onDeleteClubInfo(Res.dwClubID);
                g_Lobby &&  g_Lobby['m_JsClubFreeDLG'] && g_Lobby['m_JsClubFreeDLG'].ShowKind();
                g_Lobby &&  g_Lobby['m_JsClubDLG'] &&  g_Lobby['m_JsClubDLG'].node.active && g_Lobby['m_JsClubDLG'].HideView();
            }else if(Res.cbOldLevel > Res.cbCurLevel && Res.cbCurLevel>=3){
                g_Lobby && g_Lobby.ShowTips('被降级为'+window.ClubLvStr[Res.cbCurLevel]);
                if(g_ShowClubInfo != null)
                {
                    g_Lobby && g_Lobby['m_JsClubDLG'] && g_Lobby['m_JsClubDLG'].OnChangeClub(g_ShowClubInfo);
                }
            }else if(Res.cbOldLevel < Res.cbCurLevel && Res.cbOldLevel>=3){
                g_Lobby && g_Lobby.ShowTips('被提升为'+window.ClubLvStr[Res.cbCurLevel]);
                if(g_ShowClubInfo != null)
                {
                    g_Lobby && g_Lobby['m_JsClubDLG'] && g_Lobby['m_JsClubDLG'].OnChangeClub(g_ShowClubInfo);
                }
            }
        }

        return true;
    },

    onSocketRoomInfor: function (data, size) {
        var obj = new ServerRoomInfo();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        window.g_GlobalClubInfo.onUpdateClubTableCnt(obj.dwClubID,0);
        g_Lobby&&g_Lobby['m_JsClubFreeDLG']&&g_Lobby['m_JsClubFreeDLG'].UpdateView(obj.dwClubID);
        if(window.LOG_DEBUG) console.log(obj)
        if(this._ClubRoomSink) this._ClubRoomSink.InsertRoomInfo(obj);
        return true;
    },

    onSocketDisRoom: function (data, size) {
        var obj = new CMD_CS_S_DisRoom();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        if(obj.dwClubID > 0) {
            window.g_GlobalClubInfo.onUpdateClubTableCnt(obj.dwClubID,1);
            g_Lobby&&g_Lobby['m_JsClubFreeDLG']&&g_Lobby['m_JsClubFreeDLG'].UpdateView(obj.dwClubID);
            if(window.LOG_DEBUG) console.log(obj)
            if(this._ClubRoomSink) this._ClubRoomSink.DisRoom(obj);
        } else {
            g_Lobby&&g_Lobby['m_RoomList']&&g_Lobby['m_RoomList']['DeleteRoom']&&g_Lobby['m_RoomList'].DeleteRoom(obj.dwRoomID);
        }
        return true;
    },
    onSocketUserGameStatus:function(data, size){
        var obj = new ServerRoomUserInfo();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        if(window.LOG_DEBUG) console.log(obj)
        if(this._ClubRoomSink) this._ClubRoomSink.UpdateUserState(obj);
        if(this._OnlineUser[`${obj.dwUserID}`]) this._OnlineUser[`${obj.dwUserID}`].cbUserStatus = obj.cbUserStatus;
        return true;
    },

    onSocketChangeClubInfo:function(data, size){
        var obj = new CMD_GC_SaveClubSet();
        if (gCByte.Bytes2Str(obj, data) != size) return false;
        if(window.LOG_DEBUG) console.log(obj)
        //更新等级
        g_GlobalClubInfo.onModifyClubInfo(obj);
        if(g_ShowClubInfo.dwClubID == obj.dwClubID){
            g_Lobby && g_Lobby['m_JsClubDLG'] && g_Lobby['m_JsClubDLG'].OnChangeClub(g_ShowClubInfo);
        }
        return true;
    },
    onSocketModifyTableRule:function(data, size){
        var obj = new CMD_GC_ModifyRoom();
        if(gCByte.Bytes2Str(obj, data)!=size) return false;
        if(this._ClubRoomSink)  this._ClubRoomSink.ModifyRoomInfor(obj);
        return true;
    },
    onSocketOnlineUser:function(data, size){
        var ObjSize = gCByte.GetSize(new CMD_CS_S_OnlineUser());
        if(size%ObjSize!=0) return false;
        var Cnt = size/ObjSize;
        for(var i = 0;i<Cnt;i++){
            var obj = new CMD_CS_S_OnlineUser();
            gCByte.Bytes2Str(obj, data);
            this._OnlineUser[`${obj.dwUserID}`] = obj;
        }
        return true;
    },

    onSocketOfflineUser:function(data, size){
        var obj = new CMD_CS_S_OfflineUser();
        if(gCByte.Bytes2Str(obj, data)!=size) return false;
        if(this._OnlineUser[`${obj.dwUserID}`]) delete this._OnlineUser[`${obj.dwUserID}`];
        return true;
    },
    onSocketClubUserScore:function(data, size){
        var obj = new CMD_CS_S_ClubUserScore();
        if(gCByte.Bytes2Str(obj, data)!=size) return false;
        window.g_GlobalClubInfo.onUpdateClubScore(obj.dwClubID,obj.llScore);
        g_Lobby&&g_Lobby['m_JsClubDLG']&&g_Lobby['m_JsClubDLG'].UpdateUserScore();
        return true;
    },
    onSocketClubRoomInfo:function(data, size){
        var obj = new CMD_CS_S_ClubRoomInfo();
        if(gCByte.Bytes2Str(obj, data)!=size) return false;
        //window.g_GlobalClubInfo.onUpdateClubScore(obj.dwClubID,obj.llScore);
        if(this._ClubRoomSink) this._ClubRoomSink.onUpdateRoomInfo(obj);
        return true;
    },
    onSocketKickUserRes:function(data, size){
        var obj = new CMD_CS_S_KickUserRes();
        if(gCByte.Bytes2Str(obj, data)!=size) return false;
        g_CurScene&&g_CurScene.ShowTips(obj.bRes?'踢出成功':'踢出失败'); 
        return true;
    },
    /////////////////////////////////////////////////////////////////////////////////////////
    //发送

    //注册玩家
    onSendRegisterUser: function () {
        var Obj = new CMD_GC_RegisterUser();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        this.onSendSocketClass(MDM_GC_CLUB, SUB_CS_C_REGISTER_USER, Obj);
    },

    onSendCreatAndroid: function (sink,dwClubID,wCnt){
        this._Sink = sink;
        var Obj = new CMD_C_CreatAndroid();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;
        Obj.wCnt = wCnt;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_CREAT_ANDROID, Obj);
    },
    onSendDeleteAndroid: function (sink,dwClubID,dwTargetID){
        this._Sink = sink;
        var Obj = new CMD_C_DeleteAndroid();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwClubID = dwClubID;
        Obj.dwTargetID = dwTargetID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_DELETE_ANDROID, Obj);
    },
    onSendGetAndroidCnt:function(sink,dwClubID){
        this._Sink = sink;
        var Obj = new CMD_C_GetAndroidCnt();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_GET_ANDROID_CNT, Obj);
    },
    onSendCreatAndroidGroup: function (sink,dwClubID,dwKindID,dwRoomID,WTotalTimes,wMaxPlayingTable,wMaxSitCnt) {
        this._Sink = sink;
        var Obj = new CMD_C_AndroidGroupInfo();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;					//俱乐部id
        Obj.dwKindID = dwKindID;					//所在游戏类型
        Obj.dwRoomID = dwRoomID;				    //房间ID
        Obj.wTotalTimes = WTotalTimes;				//总消耗桌数
        Obj.wMaxPlayingTable = wMaxPlayingTable;			//同时开桌数
        Obj.wMaxSitCount = wMaxSitCnt;				//每桌最大机器人数
       
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_CREAT_ANDROID_GROUP, Obj);
    },
    
    onSendDelAndroidGroup: function (sink,dwClubID,dwGroupID) {
        this._Sink = sink;
        var Obj = new CMD_DeleteAndroidGroup();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;					//俱乐部id
        Obj.dwGroupID = dwGroupID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_DELETE_ANDROID_GROUP, Obj);
    },
    
    onSendGetAndroidList: function (sink,dwClubID) {
        this._Sink = sink;
        var Obj = new CMD_AndroidGroupList();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;					//俱乐部id
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_ANDROID_GROUP_LIST, Obj);
    },
    
    //创建俱乐部
    onSendCreateClub: function (clubID,clubName,kindID,Rules,) {
        var Obj = new CMD_GC_CreateClub();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwClubID = clubID;
        Obj.szClubName = clubName;
        Obj.wKindID = kindID;
        Obj.dwRules = Rules;

        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_CREATE_CLUB, Obj);
    },
    //加入俱乐部
    onSendJoinClub: function (sink,AllianceID) {
        this._Sink = sink;
        var Obj = new CMD_GC_JoinClub();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwAllianceID = AllianceID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_JOIN_CLUB, Obj);
    },
    //设置成员等级
    onSendSetClubUserLvL:function(dwTargetUserID,dwClubID,cbLevel){
        var Obj = new CMD_GC_SetClubUesrLvl();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwOperateUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwTargetUserID = dwTargetUserID;
        Obj.dwClubID = dwClubID;
        Obj.cbLevel = cbLevel;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_SET_CLUB_USER_LVL, Obj);
    },

    //一键操作
    onSendSetAllJoin:function(dwClubID,cbLevel){
        var Obj = new CMD_GC_SetAllJoin();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwClubID = dwClubID;
        Obj.cbLevel = cbLevel;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_SET_ALL_JOIN, Obj);
    },

    //解散俱乐部
    onSendDissClub: function (sink,Obj) {
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_EXIT_CLUB, Obj);
    },
    //保存俱乐部信息
    onSendSaveClubSet: function (sink,Obj) {
        //this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_SAVE_CLUB_SET, Obj);
    },

    OnSendCreateRoom:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_CREATE_ROOM, Obj);
    },
    OnSendJoinRoom:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_JOIN_ROOM, Obj);
    },
    OnSendJoinRoom2:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_JOIN_ROOM2, Obj);
    },
    OnSendDissClubRoom:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_DISS_CLUB_ROOM, Obj);
    },
    OnSendModifyTableRule:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_MODIFY_TABLE_RULE, Obj);
    },
    OnSendGiveScore:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_GIVE_SCORE, Obj);
    },
    OnSendTakeScore:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_TAKE_SCORE, Obj);
    },

    OnSendGetOnlineUser:function(sink,Obj){
        this._Sink = sink;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_GET_ONLINE_USER, Obj);
    },
    OnSendKickUser:function(targetID,roomID){
        var Obj = new CMD_KickRoomUser();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwTargetID = targetID;
        Obj.dwRoomID = roomID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_KICK_ROOM_USER, Obj);
    },
    ////进入俱乐部////离开俱乐部
    onSendEnetrOrLeave: function (isEnterClub, dwClubID, cbClubLevel) {
        var Obj = new CMD_GC_EnterClub();
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = dwClubID;
        Obj.cbClubLevel = cbClubLevel;

        if (isEnterClub) {
            this.onSendSocketClass(MDM_GC_CLUB, SUB_CS_C_ENTER_CLUB, Obj);
        } else {
            this.onSendSocketClass(MDM_GC_CLUB, SUB_CS_C_EXIT_CLUB, Obj);
        }
    },
    OnSendInviteUser:function(clubID,targetID, userID,KindID,RoomID){
        var Obj = new CMD_GC_InviteUser();
        Obj.dwClubID = clubID;
        Obj.dwTargetID = targetID;
        Obj.dwUserID = userID;
        Obj.dwKindID = KindID;
        Obj.dwRoomID = RoomID;
        this.onSendSocketClass(MDM_GC_CLUB, SUB_CS_C_USER_INVITE, Obj);
    },
    OnSendQueryGameLevelList:function(sink,kindID){
        this._Sink = sink;
        var Obj = new TagServerTypeInfo();
        Obj.wKindID = kindID;
        this.onSendSocketClass(MDM_GC_QUERY, SUB_GP_SERVER_TYPE_INFO, Obj);
    },
/////////////////////////////////////////////////////////////////////////////////////////
//辅助函数
    OnGetInviteUser:function(dwUserID){
        if(this._inviteUser.length == 0) return null;
        for(var i in this._inviteUser){
            if(this._inviteUser[i].dwUserID==dwUserID) return this._inviteUser[i];
        }
        return null;
    },
    OnGetInviteInfor:function(){
        if(this._inviteInfor.length == 0) return null;
        return this._inviteInfor.shift();
    },
    OnGetOnlineUser:function(dwUserID){
        return this._OnlineUser[`${dwUserID}`];
    },
});

window.gClubClientKernel = new ClubClientKernel()
