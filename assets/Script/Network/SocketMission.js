_gLinkArr = new Array();
function getFreeSocketID() { //输入参数名称
    var res = 0;
    for(var i in _gLinkArr){
        if(i == res) res++;
    }
    return res;
}

CSocketMission = cc.Class({
    ctor:function () {
        this.m_MaxPortIndex = 3;
    },

    init:function (url,port){
        this.mSocketEngine = new cc.CSocketEngine(this);
        this.mUrl = url;
        this.mPort = port;
        this.mPortIndex = 0;
    },

    start:function () {
        if (this.isAlive()){
            this.onEventTCPSocketLink();
        }else{
            this.mSocketEngine.connect(this.mUrl, this.mPort+this.mPortIndex);
        }
    },

    OnErr:function(){
        this.mPortIndex++;
        if(window.LOG_NET_DATA)console.log("正在重新分配服务器 "+ this.mPortIndex);
        if(this.mPortIndex < this.m_MaxPortIndex){
            this.start();
        }else{
            this.mPortIndex = 0;
            if(window.LOG_NET_DATA)console.log("连接失败！");
            this.onEventLinkErr();
        }
    },
    stop:function () {
        this.mSocketEngine.disconnect();
    },

    isAlive:function () {
        return this.mSocketEngine.isAlive();
    },

    send:function (main,sub,data,size) {
        return this.mSocketEngine.send(main, sub, data, size);
    }
});



CGPLoginMission = cc.Class({
    extends: CSocketMission,

    ctor :function () {
        //设置回调接口
        this.mIGPLoginMissionSink = arguments[0];
        this.init(window.LOGIN_SERVER_IP, LOGIN_SERVER_PORT);
        this.SendData(arguments[1],arguments[2],arguments[3],arguments[4]);
    },
    SendData:function(wMain,wSub,DataStr,Length){
        this.m_wMain = wMain;
        this.m_wSub = wSub;
        this.m_DataStr = DataStr;
        this.m_Length = Length;
        this.start();
    },

    onEventTCPSocketLink:function (event){
        var cbData = gCByte.Str2Bytes(this.m_DataStr);
        if(this.m_Length==null) this.m_Length = cbData.length;
        this.send(this.m_wMain, this.m_wSub, cbData, this.m_Length);
        return true;
    },

    onEventLinkErr:function (){
        if (this.mIGPLoginMissionSink){
            this.mIGPLoginMissionSink.OnEventLinkErr();
        }

        return true;
    },

    onEventTCPSocketShut :function(){
        // if (this.mIGPLoginMissionSink){
        //     this.mIGPLoginMissionSink.StopLoading();
        // }
    },

    onEventTCPSocketRead :function(main,sub,data,size) {
        try {
            switch (main) {
                //登录消息
                case MDM_GP_LOGON: return this.onSocketMainLogon(sub, data, size);
                //列表信息
                case MDM_GP_SERVER_LIST:  return this.onSocketMainServerList(sub, data, size);
                //用户服务
                case MDM_GP_USER_SERVICE: return this.onSocketUserService(sub, data, size);
                case MDM_GP_USER: return ;//this.onSocketUserServer(sub, data, size);
                case MDM_GP_GET_SERVER: return this.onSocketQueryServer(sub, data, size);
                default: break;
            }
            if(window.LOG_NET_DATA)console.log("ERROR LoginMission:not case main!");
        } catch (error) {
            if(window.LOG_NET_DATA)console.log("ERROR LoginMission:onEventTCPSocketRead !");
        }
        return true;
    },

    //////////////////////////////////////////////////////////////////////////
    //登陆信息
    onSocketMainLogon :function(sub, data, size){
        switch (sub) {
            //登录成功
            case SUB_GP_LOGON_SUCCESS:		return this.onSocketSubLogonSuccess(data, size);
            //登录失败
            case SUB_GP_LOGON_FAILURE:		return this.onSocketSubLogonFailure(data, size);
            //升级提示
            case SUB_GP_UPDATE_NOTIFY:		return this.onSocketSubUpdateNotify(data, size);
            //登录完成
            case SUB_GP_LOGON_FINISH:		return this.onSocketSubLogonFinish(data, size);
            //俱乐部信息
            case SBU_GP_CLUB_SERVER_INFO:   return this.onSocketSubClubServerInfor(data, size);
            /*case SUB_GP_GROWLEVEL_CONFIG:
            case SUB_GP_VERIFY_CODE_RESULT:
            case SUB_GP_REAL_AUTH_CONFIG: */
            default:
                //if(window.LOG_NET_DATA)console.log("onSocketMainLogon 未处理消息 "+sub)
            return true;
        }
        return false;
    },

    //登录失败
    onSocketSubLogonFailure :function (data,size){
        var LogonError = new CMD_GP_LogonError();
        gCByte.Bytes2Str(LogonError,data);
        //显示消息
        if (this.mIGPLoginMissionSink)
            this.mIGPLoginMissionSink.onGPLoginFailure(LogonError.szErrorDescribe);

        //关闭处理
        this.stop();
        return true;
    },

    //登录成功

    onSocketSubLogonSuccess:function (data,dataSize){
        //消息处理
        var pLogonSuccess = new CMD_GP_LogonSuccess();

        //效验数据
        if (dataSize<gCByte.Bytes2Str(pLogonSuccess,data)) return false;
        cc.sys.localStorage.setItem('LoginPsw',  cc.sys.localStorage.getItem('LoginPswT'));

        //变量定义
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();
        var pUserInsureInfo=g_GlobalUserInfo.GetUserInsureInfo();

        //保存信息
        gCByte.StrSameMemCopy(pGlobalUserData,pLogonSuccess);
        window.PLATFORM_RATIO = pLogonSuccess.dwPlatformRatio;

        //用户成绩
        pUserInsureInfo.llUserScore=pLogonSuccess.llUserScore;
        pUserInsureInfo.llUserInsure=pLogonSuccess.llUserInsure;

        if (this.mIGPLoginMissionSink)
            this.mIGPLoginMissionSink.onGPLoginSuccess();
        return true;
    },

    //登录完成
    onSocketSubLogonFinish :function (data,size){
        this.stop();
        if(window.CLUB_PORT == 0){
            g_CurScene.ShowAlert('服务器连接异常，请重新登录!')
            this.mIGPLoginMissionSink.StopLoading();
            return;
        }
        if (this.mIGPLoginMissionSink)
            this.mIGPLoginMissionSink.onGPLoginComplete();

        return true;
    },

    //俱乐部信息
    onSocketSubClubServerInfor:function (data,size){
        var obj = new CMD_GP_ClubServerInfo();
        if(gCByte.Bytes2Str(obj,data)!=size ) return false;
        window.CLUB_PORT = obj.wClubPort;
        if(window.CLUB_PORT!=0)window.gClubClientKernel.connect();
        return true;
    },
    // 列表信息
    onSocketMainServerList :function (sub,data,size) {
        switch (sub){
            case SUB_GP_LIST_TYPE:		return this.onSocketListType(data, size);
            case SUB_GP_LIST_KIND:		return this.onSocketListKind(data, size);
            case SUB_GP_LIST_SERVER:     return this.onSocketListServer(data, size);
            case SUB_GP_LIST_MATCH:		return this.onSocketListMatch(data,size);
            case SUB_GP_LIST_FINISH:	    return this.onSocketListFinish(data, size);
            case SUB_GP_SERVER_FINISH:	return this.onSocketServerFinish(data, size);
            /*case SUB_GR_KINE_ONLINE:
            case SUB_GR_SERVER_ONLINE:
            case SUB_GR_ONLINE_FINISH:
            case SUB_GP_LIST_PROPERTY_TYPE:
            case SUB_GP_LIST_PROPERTY_RELAT:
            case SUB_GP_LIST_PROPERTY:
            case SUB_GP_LIST_PROPERTY_SUB:
            case SUB_GP_MATCH_FINISH:
            case SUB_GP_PROPERTY_FINISH:*/
            default:
                //if(window.LOG_NET_DATA)console.log("onSocketMainServerList 消息未处理! subid "+sub)
        		return true;
        }
        if(window.LOG_NET_DATA)console.log("onSocketMainServerList undefined! subid "+sub)
        return false;
    },

    // 服务信息
    onSocketUserService :function (sub,data,size)
    {
        switch (sub){
            // 签到信息
            case SUB_GP_CHECKIN_INFO:		return this.onSocketCheckinInfo(data, size);
            // 签到结果
            case SUB_GP_CHECKIN_RESULT:		return this.onSocketCheckinResult(data, size);
            // 修改个人信息结果
            case SUB_GP_OPERATE_FAILURE:
            case SUB_GP_OPERATE_SUCCESS:    return this.onSockeOperateRes(data, size);
        }
        return true;
    },
    onSocketQueryServer :function(sub, data, size){
        //if(window.LOG_NET_DATA)console.log("onSocketQueryServer "+sub)
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


            case SUB_GP_RES_MSG:   return this.onSocketResMsg(data, size);
            //case SUB_GP_CREATE_AGENT_SUC:   return this.onSocketCreateAgentSuc();
            //case SUB_GP_SCAN_ROOM_INFO:     return this.onSocketScanRoomInfo(data, size);
        }
        return true;
    },


    //代开列表
    onSocketScanRoomInfo: function (data, size)
    {
        if (size == 0) this.stop();
        return this.mIGPLoginMissionSink.OnScanRoomInfo(data, size);
    },
    //代开
    onSocketCreateAgentSuc: function ()
    {
        this.stop();
        return this.mIGPLoginMissionSink.OnCreateAgentSuc();
    },
    onSockeOperateRes :function(data, size){
        var Res = new CMD_GP_OperateSuccess();
        if(size > gCByte.Bytes2Str(Res, data)) return false;
        this.mIGPLoginMissionSink.OnBindSpreaderRes(Res.lResultCode, Res.szDescribeString);
        //关闭处理
        this.stop();
        return true;
    },
    onSocketQueryFailed :function(data, size){
        var Res = new CMD_GP_S_Failed();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.OnQueryFailed(Res);
        return true;
    },
    onSocketQueryRes:function(data, size){
        var Res = new CMD_GP_S_ReturnServer();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.OnQueryServerRes(Res);
        return true;
    },
    onSocketJoinRoomRes:function(data, size){
        var Res = new CMD_GP_S_ReturnRoom();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.OnQueryRoomRes(Res);
        return true;
    },
    onSocketCreatRoomRes:function(data, size){
        var Res = new CMD_GP_S_CreatSuccess();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.OnCreatRoomRes(Res);
        return true;
    },

    onSocketClubRevenueInfo:function(data, size){
        var Res = new CMD_GP_S_ClubRevenueInfo();
        gCByte.Bytes2Str(Res, data);
        this.mIGPLoginMissionSink.OnClubRevenueInfo(Res);
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

        this.mIGPLoginMissionSink.LoadRoomInfo(Res);
        return true;
    },
    onSocketUpdateUserList:function(data, size){
        var Res = new CMD_GP_S_ClubUserInfo();
        gCByte.Bytes2Str(Res, data);
        for(var i = 0;i<Res.wPlayerCnt;i++){
            if(Res.UserInfo == null) Res.UserInfo = new Array();
            Res.UserInfo[i] = new ServerRoomUserInfo();
        }
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.SetRoomUserInfo(Res);
        return true;
    },
    onSocketDisClubRoom:function(data, size){
        this.stop();
        this.mIGPLoginMissionSink.OnClubRoomDisolve();
        return true;
    },
    onSocketGetUsingCard:function(data, size){
        var Res = new CMD_GP_S_UsingCard();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.stop();
        this.mIGPLoginMissionSink.OnSendCardQuery(Res.lUsingCard);
        return true;
    },

    onSocketClubSetSuc:function(data, size){
        this.stop();
        this.mIGPLoginMissionSink.OnClubSetSuc();
        return true;
    },

    onSocketRoomExRes:function(data, size){
        this.stop();
        var Res = new CMD_GP_C_GetRoomExRes();
        gCByte.Bytes2Str(Res, data);
        if(Res.wRoomCnt > 0){
            Res.RoomInfo=new Array();
            for(var i=0;i<Res.wRoomCnt;i++) Res.RoomInfo[i] = new ServerRoomInfo();
        }
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.mIGPLoginMissionSink.OnGetRoomExRes(Res);
        return true;
    },
    onSocketOwnRoomList:function(data, size){
        this.stop();
        var Res = new CMD_GP_S_OwnRoomInfo();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.mIGPLoginMissionSink.onOwnRoomList(Res);
        return true;
    },

    onSocketResMsg:function(data, size){
        this.stop();
        var Res = new CMD_GP_S_Msg();
        if(size != gCByte.Bytes2Str(Res, data)) return false;
        this.mIGPLoginMissionSink.OnMsgRes(Res.szMsg);
        return true;
    },

    //种类信息
    onSocketListType :function(data,size) {
        var Obj = new Object();
        Obj.Arr = new Array();
        Obj.Arr[0] = new tagGameType();
        var itemSize = gCByte.GetSize(Obj.Arr[0]);

        //效验参数
        if (size%itemSize!=0 || size == 0) return false;

        //变量定义
        var iItemCount=size/itemSize;
        for (var i=1;i<iItemCount;i++){
            Obj.Arr[i] = new tagGameType();
        }

        gCByte.Str2Bytes(Obj,data);

        //更新数据
        for (var i=0;i<iItemCount;i++){
            g_ServerListData.InsertGameType(Obj.Arr[i]);
        }

        return true;
    },

    //类型信息
    onSocketListKind :function(data, size){
        return true;
    },

    //房间列表
    onSocketListServer:function (data, size){
        var Obj = new Object();
        Obj.Arr = new Array();
        Obj.Arr[0] = new tagGameServer();
        var strsize = gCByte.GetSize( Obj.Arr[0]);
        if (size%strsize!=0) return false;

        //变量定义
        var iItemCount=size/strsize;
        if (iItemCount == 0) return true;

        //更新数据
        for (var i=1;i<iItemCount;i++){
            Obj.Arr[i] = new tagGameServer();
        }
        gCByte.Bytes2Str(Obj,data);
        for (var i in Obj.Arr){
            g_ServerListData.InsertGameServer(Obj.Arr[0]);
        }

        return true;
    },

    //比赛列表
    onSocketListMatch :function(data, size)
    {
        var pGameMatch = new tagGameMatch();
        //效验参数
        if (size%pGameMatch.getSize() != 0) return false;

        //变量定义
        var wItemCount = size / pGameMatch.getSize();

        //获取对象
        var pGameServerItem = null;

        //更新数据
        for (var i = 0; i<wItemCount; i++){
            pGameMatch.wServerID = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_wServerID);
            pGameMatch.dwMatchID = gCByte.r4(data,pGameMatch.getSize()*i+pGameMatch.index_dwMatchID);
            pGameMatch.dwMatchNO = gCByte.r4(data,pGameMatch.getSize()*i+pGameMatch.index_dwMatchNO);
            pGameMatch.cbMatchType = gCByte.r1(data,pGameMatch.getSize()*i+pGameMatch.index_cbMatchType);
            pGameMatch.szMatchName = gCByte.rStr(data,pGameMatch.getSize()*i+pGameMatch.index_szMatchName);
            pGameMatch.cbMemberOrder = gCByte.r1(data,pGameMatch.getSize()*i+pGameMatch.index_cbMemberOrder);
            pGameMatch.cbMatchFeeType = gCByte.r1(data,pGameMatch.getSize()*i+pGameMatch.index_cbMatchFeeType);
            pGameMatch.lMatchFee = gCByte.r8(data,pGameMatch.getSize()*i+pGameMatch.index_lMatchFee);
            pGameMatch.wStartUserCount = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_wStartUserCount);
            pGameMatch.wMatchPlayCount = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_wMatchPlayCount);
            pGameMatch.wRewardCount = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_wRewardCount);
            pGameMatch.MatchStartTime.wYear = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wYear);
            pGameMatch.MatchStartTime.wMonth = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wMonth);
            pGameMatch.MatchStartTime.wDayOfWeek = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wDayOfWeek);
            pGameMatch.MatchStartTime.wDay = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wDay);
            pGameMatch.MatchStartTime.wHour = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wHour);
            pGameMatch.MatchStartTime.wMinute = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wMinute);
            pGameMatch.MatchStartTime.wSecond = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wSecond);
            pGameMatch.MatchStartTime.wMilliseconds = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchStartTime+pGameMatch.MatchStartTime.index_wMilliseconds);

            pGameMatch.MatchEndTime.wYear = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wYear);
            pGameMatch.MatchEndTime.wMonth = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wMonth);
            pGameMatch.MatchEndTime.wDayOfWeek = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wDayOfWeek);
            pGameMatch.MatchEndTime.wDay = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wDay);
            pGameMatch.MatchEndTime.wHour = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wHour);
            pGameMatch.MatchEndTime.wMinute = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wMinute);
            pGameMatch.MatchEndTime.wSecond = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wSecond);
            pGameMatch.MatchEndTime.wMilliseconds = gCByte.r2(data,pGameMatch.getSize()*i+pGameMatch.index_MatchEndTime+pGameMatch.MatchEndTime.index_wMilliseconds);

            pGameServerItem = g_ServerListData.SearchGameServer(pGameMatch.wServerID);
            if (pGameServerItem != null)
            {
                pGameServerItem.m_GameMatch.wServerID = pGameMatch.wServerID;
                pGameServerItem.m_GameMatch.dwMatchID = pGameMatch.dwMatchID;
                pGameServerItem.m_GameMatch.dwMatchNO = pGameMatch.dwMatchNO;
                pGameServerItem.m_GameMatch.cbMatchType = pGameMatch.cbMatchType;
                pGameServerItem.m_GameMatch.szMatchName = pGameMatch.szMatchName;
                pGameServerItem.m_GameMatch.cbMemberOrder = pGameMatch.cbMemberOrder;
                pGameServerItem.m_GameMatch.cbMatchFeeType = pGameMatch.cbMatchFeeType;
                pGameServerItem.m_GameMatch.lMatchFee = pGameMatch.lMatchFee;
                pGameServerItem.m_GameMatch.wStartUserCount = pGameMatch.wStartUserCount;
                pGameServerItem.m_GameMatch.wMatchPlayCount = pGameMatch.wMatchPlayCount;
                pGameServerItem.m_GameMatch.wRewardCount = pGameMatch.wRewardCount;
                pGameServerItem.m_GameMatch.MatchStartTime.wYear = pGameMatch.MatchStartTime.wYear;
                pGameServerItem.m_GameMatch.MatchStartTime.wMonth = pGameMatch.MatchStartTime.wMonth;
                pGameServerItem.m_GameMatch.MatchStartTime.wDayOfWeek = pGameMatch.MatchStartTime.wDayOfWeek;
                pGameServerItem.m_GameMatch.MatchStartTime.wDay = pGameMatch.MatchStartTime.wDay;
                pGameServerItem.m_GameMatch.MatchStartTime.wHour = pGameMatch.MatchStartTime.wHour;
                pGameServerItem.m_GameMatch.MatchStartTime.wMinute = pGameMatch.MatchStartTime.wMinute;
                pGameServerItem.m_GameMatch.MatchStartTime.wSecond = pGameMatch.MatchStartTime.wSecond;
                pGameServerItem.m_GameMatch.MatchStartTime.wMilliseconds = pGameMatch.MatchStartTime.wMilliseconds;

                pGameServerItem.m_GameMatch.MatchEndTime.wYear = pGameMatch.MatchEndTime.wYear;
                pGameServerItem.m_GameMatch.MatchEndTime.wMonth = pGameMatch.MatchEndTime.wMonth;
                pGameServerItem.m_GameMatch.MatchEndTime.wDayOfWeek = pGameMatch.MatchEndTime.wDayOfWeek;
                pGameServerItem.m_GameMatch.MatchEndTime.wDay = pGameMatch.MatchEndTime.wDay;
                pGameServerItem.m_GameMatch.MatchEndTime.wHour = pGameMatch.MatchEndTime.wHour;
                pGameServerItem.m_GameMatch.MatchEndTime.wMinute = pGameMatch.MatchEndTime.wMinute;
                pGameServerItem.m_GameMatch.MatchEndTime.wSecond = pGameMatch.MatchEndTime.wSecond;
                pGameServerItem.m_GameMatch.MatchEndTime.wMilliseconds = pGameMatch.MatchEndTime.wMilliseconds;
            }
        }

        return true;
    },

    //房间完成
    onSocketServerFinish :function (data, size){
        if (this.mIGPLoginMissionSink)
            this.mIGPLoginMissionSink.onGetServerListFinish();
        return true;
    },

    // 列表完成
    onSocketListFinish :function (data, size) {
        if (this.mIGPLoginMissionSink)
            this.mIGPLoginMissionSink.onGetServerListFinish();

        return true;
    },
});