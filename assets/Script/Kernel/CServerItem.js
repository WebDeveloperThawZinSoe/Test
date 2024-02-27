var GameExitCode_Normal = 0;			//正常退出
var GameExitCode_CreateFailed = 1;	    //创建失败
var GameExitCode_Timeout = 2;		    //定时到时
var GameExitCode_Shutdown = 3;		    //断开连接

var CServerItem = cc.Class({
    extends: cc.Component,

    properties: {
    },
    ctor :function () {
        this.mReqTableID = INVALID_TABLE;
        this.mServiceStatus = ServiceStatus_Unknow;
        this.mGameServer = null;
        this.mServerAttribute = null;
        this.mSocketEngine = null;
        this.mIStringMessageSink = null;
        this.mUserManager = null;
        this.mMeUserItem = 0;
        this.mUserAttribute = null;
        this.mReconnecting = false;
        this.mInterval = null;
        this.mIntervalTime = 0;
        this.mServerHeartTime = 0;
        this.mHeartStatTime = 0;
    },

    //设置接口
    SetServerItemSink :function(pIServerItemSink){
        this.mServerAttribute = new tagServerAttribute();
        this.mUserManager = new CPlazaUserManager(this);
        this.mUserAttribute = new tagUserAttribute();
        this.mIServerItemSink = pIServerItemSink;
        return true;
    },

    //设置接口
    SetStringMessageSink :function(pIStringMessageSink){
        this.mIStringMessageSink = pIStringMessageSink;
        return true;
    },

    //比赛框架
    GetMatchViewFrame :function(){
        return this.mMatchViewFrame;
    },

    //房间属性
    GetServerAttribute:function (){
        return this.mServerAttribute;
    },

    //设置状态
    SetServiceStatus :function(ServiceStatus){
        //设置变量
        this.mServiceStatus=ServiceStatus;
    },

    //是否服务状态
    IsService:function (){
        return this.mServiceStatus == ServiceStatus_ServiceIng;
    },

    //服务状态
    GetServiceStatus:function (){
        return this.mServiceStatus;
    },

    //自己位置
    GetMeUserItem :function() {
        return this.mMeUserItem;
    },

    //配置房间
    SetServerAttribute:function (pGameServerItem,wAVServerPort,dwAVServerAddr) {
        //房间属性
        this.mGameServer = pGameServerItem;

        this.mServerAttribute.wKindID		= this.mGameServer.wKindID;
        this.mServerAttribute.wServerID		= this.mGameServer.wServerID;
        this.mServerAttribute.wAVServerPort	= this.mGameServer.wAVServerPort;
        this.mServerAttribute.dwAVServerAddr	= this.mGameServer.dwAVServerAddr;
        this.mServerAttribute.szServerName = this.mGameServer.szServerName;

        return true;
    },

    //配置房间
    ConnectServer:function (pGameServerItem,wAVServerPort,dwAVServerAddr) {
        if (this.mServiceStatus != ServiceStatus_Unknow && this.mServiceStatus != ServiceStatus_NetworkDown){
            if (this.mIStringMessageSink)
                this.mIStringMessageSink.InsertPromptString("很抱歉, 此游戏房间还未关闭,请先关闭!!"+this.mServiceStatus);
            return false;
        }

        //房间属性
        this.SetServerAttribute(pGameServerItem, wAVServerPort, dwAVServerAddr);

        //关闭判断
        if (this.mServerAttribute.wServerID==0){
            this.SetServiceStatus(ServiceStatus_Unknow);
            if (this.mIStringMessageSink)
                this.mIStringMessageSink.InsertPromptString("很抱歉，此游戏房间已经关闭了，不允许继续进入！");
            return false;
        }

        //创建组件
        this.mSocketEngine = new cc.CSocketEngine(this);
        this.mSocketEngine.connect(this.mGameServer.szServerAddr, this.mGameServer.wServerPort);

        //设置状态
        this.SetServiceStatus(ServiceStatus_Entering);
        return true;
    },
    OnErr:function(){
        if (this.mIServerItemSink) return this.mIServerItemSink.OnGFServerReLink();
    },
    //发送登录
    SendLogonPacket:function (){
        //变量定义
        var LogonUserID = new CMD_GR_LogonUserID();

        //变量定义
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();

        //登录信息
        LogonUserID.dwUserID = pGlobalUserData.dwUserID;
        LogonUserID.szPassword = pGlobalUserData.szDynamicPass;
        LogonUserID.szServerPasswd = LogonUserID.szServerPasswd;
        LogonUserID.wKindID = this.mServerAttribute.wKindID;
        LogonUserID.szMachineID = 'creator';

        //发送数据
        this.SendSocketClass(MDM_GR_LOGON, SUB_GR_LOGON_USERID, LogonUserID);

        return true;
    },

    //发送函数
    SendSocketData :function(wMainCmdID, wSubCmdID, data, dataSize){
        return this.mSocketEngine.send(wMainCmdID, wSubCmdID, data, dataSize);
    },
    //发送函数
    SendSocketClass :function (wMainCmdID, wSubCmdID, Obj){
        return this.mSocketEngine.sendClass(wMainCmdID, wSubCmdID, Obj);
    },
    //////////////////////////////////////////////////////////////////////////
    // Socket消息

    // 发送数据
    GFSendData :function(main, sub, data, size){
        return this.SendSocketData(main, sub, data, size);
    },

    //中断连接
    IntermitConnect :function(bBackLobby){
        if (this.mServiceStatus==ServiceStatus_Unknow || this.mServiceStatus==ServiceStatus_NetworkDown)return false;//

        if (this.IsService()){
            var kernel = gClientKernel.get();
            if(kernel) kernel.Intermit(0);
        }
        this.mIServerItemSink = null;
        this.mIntervalTime = new Date().getTime();
        this.mInterval = bBackLobby;
        return true;
    },
    CloseSocket:function (dt) {
        //设置状态
        this.SetServiceStatus(ServiceStatus_NetworkDown);

        this.mSocketEngine.closesocket();
        this.mReqTableID		    = INVALID_TABLE;
        this.mReqChairID		    = INVALID_CHAIR;
        this.mIsGameReady	        = false;
        this.mMeUserItem		    = 0;
        this.mServerHeartTime       = 0;
        this.mUserManager.ResetUserItem(true);
        var kernel = gClientKernel.get();
        if(kernel)kernel.ResetUserItem();
    },
    update :function (dt) {
        if(!this.mInterval) return;
        //检查锁屏
        var timestamp=new Date().getTime();
        if(timestamp-this.mIntervalTime>=500){
            this.mInterval = null;
            this.CloseSocket();
            gClientKernel.destory();
            ChangeScene('Lobby');
        }
    },

    //游戏已准备好
    OnGFGameReady :function() {
        //变量定义
        var wTableID = this.mMeUserItem.GetTableID();
        var wChairID = this.mMeUserItem.GetChairID();
        var dwMeUserID =  this.mMeUserItem.GetUserID();

        var pClientKernel = gClientKernel.get();
        this.mUserAttribute.wChairID = wChairID;
        this.mUserAttribute.wTableID = wTableID;
        //房间信息
        pClientKernel.OnGFConfigServer(this.mUserAttribute, this.mServerAttribute);
        pClientKernel.OnGFUserEnter(this.mMeUserItem);
        //发送用户
        if ((wTableID!=INVALID_TABLE)&&(wChairID!=INVALID_CHAIR)) {
            //变量定义
            var wEnumIndex = 0;

            //发送玩家
            while (true) {
                //获取用户
                var pIClientUserItem = this.mUserManager.EnumUserItem(wEnumIndex++);
                if (pIClientUserItem == 0) break;

                //发送判断
                if (pIClientUserItem.GetUserID() == dwMeUserID) continue;
                if (pIClientUserItem.GetTableID() != wTableID) continue;
                if (pIClientUserItem.GetUserStatus() == US_LOOKON) continue;

                //发送用户
                pClientKernel.OnGFUserEnter(pIClientUserItem);
            };

            //旁观用户
            wEnumIndex=0;
            while (true){
                //获取用户
                pIClientUserItem=this.mUserManager.EnumUserItem(wEnumIndex++);
                if (pIClientUserItem==0) break;

                 //发送判断
                if (pIClientUserItem.GetUserID() == dwMeUserID) continue;
                if (pIClientUserItem.GetTableID()!=wTableID) continue;
                if (pIClientUserItem.GetUserStatus()!=US_LOOKON) continue;

                //发送用户
                pClientKernel.OnGFUserEnter(pIClientUserItem);
            };
        }

         //配置完成
        pClientKernel.OnGFConfigFinish();

        this.mIsGameReady = true;
    },

    //游戏关闭
    OnGFGameClose :function(iExitCode){
        //效验状态
        if (this.mMeUserItem==0) return ;

        this.mIsGameReady = false;

        //变量定义
        var wTableID=this.mMeUserItem.GetTableID();
        var wChairID=this.mMeUserItem.GetChairID();
        var cbUserStatus=this.mMeUserItem.GetUserStatus();
        this.mUserAttribute.wChairID = INVALID_CHAIR;
        this.mUserAttribute.wTableID = INVALID_TABLE;

        //退出游戏
        if ((wTableID!=INVALID_TABLE)&&(this.mServiceStatus==ServiceStatus_ServiceIng))
        {
            this.SendStandUpPacket(wTableID,wChairID,1);
        }

        this.mTableViewFrame.SetTableStatus1(false);
    },

    onEventTCPSocketLink :function(){
        this.mServerHeartTime = new Date().getTime();
        if(this.mIServerItemSink)this.mIServerItemSink.StopLoading();
        if(window.ReLinkTime != null){
            if(window.LOG_NET_DATA)console.log("onEventTCPSocketLink "+window.ReLinkTime)
            window.ReLinkTime = null;
            var kernel = gClientKernel.get();
            kernel.mIClientKernelSink.OnClearScene();
            if(kernel.mIClientKernelSink.m_DisCtrl && kernel.mIClientKernelSink.m_DisCtrl.node.active){
                kernel.mIClientKernelSink.m_DisCtrl.node.active = false;
                g_TimerEngine.UnPauseGameTimer();
            }
        }

        this.SendLogonPacket();
    },

    onEventTCPSocketShut :function(){
        //设置状态
        this.SetServiceStatus(ServiceStatus_NetworkDown);
        if (this.mIServerItemSink && this.mInterval != null) return this.mIServerItemSink.OnGFServerReLink();
    },

    onEventTCPSocketRead :function(main, sub, data, dataSize){
        //try {
            switch (main){
                //登录消息
                case MDM_GR_LOGON:	return this.OnSocketMainLogon(sub,data,dataSize);
                //配置信息
                case MDM_GR_CONFIG:	return this.OnSocketMainConfig(sub,data,dataSize);
                //用户信息
                case MDM_GR_USER:	return this.OnSocketMainUser(sub,data,dataSize);
                //状态信息
                case MDM_GR_STATUS:	return this.OnSocketMainStatus(sub,data,dataSize);
                //银行消息
                case MDM_GR_INSURE:	return OnSocketMainInsure(sub,data,dataSize);
                //管理消息
                case MDM_GR_MANAGE:	return OnSocketMainManager(sub,data,dataSize);
                //管理消息
                case MDM_CM_SYSTEM: return this.OnSocketMainSystem(sub,data,dataSize);
                //游戏消息
                case MDM_GF_GAME:
                case MDM_GF_CARDROOM:
                case MDM_GF_FRAME:	return this.OnSocketMainGameFrame(main,sub,data,dataSize);
                //比赛消息
                case MDM_GR_MATCH:	return this.OnSocketMainMatch(sub,data,dataSize);
            }
        return true;
         /*} catch (error) {
            if(window.LOG_NET_DATA)console.log('onEventTCPSocketRead err!!! '+main+'-'+sub+' size:'+dataSize)
            if(window.LOG_NET_DATA)console.log(error)
        }*/




    },

    //登录消息
    OnSocketMainLogon :function(sub, data, dataSize) {
        switch (sub){
            //登录成功
            case SUB_GR_LOGON_SUCCESS:	return this.OnSocketSubLogonSuccess(data,dataSize);
            //登录失败
            case SUB_GR_LOGON_ERROR:	return this.onSocketSubLogonFailure(data,dataSize);
            //登录完成
            case SUB_GR_LOGON_FINISH:	return this.OnSocketSubLogonFinish(data,dataSize);
            //更新提示
            case SUB_GR_UPDATE_NOTIFY:	return this.OnSocketSubUpdateNotify(data,dataSize);
        }

        return true;
    },

    //配置信息
    OnSocketMainConfig :function(sub, data, dataSize) {
        switch (sub){
            //房间配置
            case SUB_GR_CONFIG_SERVER:		return this.OnSocketSubConfigServer(data, dataSize);
            //列表配置
            case SUB_GR_CONFIG_COLUMN:		return true;
            //道具配置
            case SUB_GR_CONFIG_PROPERTY:	return true;
            //配置玩家权限
            case SUB_GR_CONFIG_USER_RIGHT:	return true;
            //配置完成
            case SUB_GR_CONFIG_FINISH:		return true;
        }
        return true;
    },

    //比赛消息
    OnSocketMainMatch :function(sub, data, dataSize){
        switch (sub){
            //费用查询
            case SUB_GR_MATCH_FEE:			return this.OnSocketSubMatchFee(data,dataSize);
            //金币更新
            case SUB_GR_MATCH_GOLDUPDATE:	return this.OnSocketSubMatchGold(data, dataSize);
        }

        return this.mMatchViewFrame.OnEventViewData(sub, data, dataSize);
    },

    //心跳消息
    OnSocketHeart :function(){
        if( this.mInterval != null) return true;
        //服务器端返回的心跳
        this.mServerHeartTime = new Date().getTime();
        window.g_NetResponseTime = this.mServerHeartTime - this.mHeartStatTime;
        return true;
    },

    //比赛费用
    OnSocketSubMatchFee :function(data, dataSize) {
        var pMatchFee = new CMD_GR_Match_Fee();
        //参数效验
        if (dataSize>pMatchFee.getSize()) return false;

        //提取数据
        pMatchFee.lMatchFee = gCByte.r4(data,pMatchFee.index_lMatchFee);
        pMatchFee.szNotifyContent = gCByte.rStr(data,pMatchFee.index_szNotifyContent);
        if (pMatchFee.lMatchFee>0)
        {
            if (this.mIStringMessageSink)
            {
                this.mIStringMessageSink.InsertMatchJoinString(pMatchFee.lMatchFee);
            }
        }

        return true;
    },

    //更新金币
    OnSocketSubMatchGold :function(data, dataSize) {
        var pMatchGoldUpdate = new CMD_GR_MatchGoldUpdate();
        //参数校验
        if (pMatchGoldUpdate.getSize() != dataSize) return false;

        //提取数据
        pMatchGoldUpdate.lCurrGold = gCByte.r8(data,pMatchGoldUpdate.index_lCurrGold);
        pMatchGoldUpdate.lCurrIngot = gCByte.r8(data,pMatchGoldUpdate.index_lCurrIngot);
        pMatchGoldUpdate.dwCurrExprience = gCByte.r4(data,pMatchGoldUpdate.index_dwCurrExprience);

        //变量定义
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        //设置变量
        pGlobalUserData.llUserScore = pMatchGoldUpdate.lCurrGold;
        pGlobalUserData.llUserIngot = pMatchGoldUpdate.lCurrIngot;
        pGlobalUserData.dwExperience = pMatchGoldUpdate.dwCurrExprience;

        return true;
    },

    //登录失败
    onSocketSubLogonFailure :function(data, size){
        //变量定义
        var pLogonFailure = new CMD_GR_LogonFailure();
        gCByte.Bytes2Str(pLogonFailure,data);

        //显示消息
        if (this.mIStringMessageSink)
            this.mIStringMessageSink.InsertPromptStringAndClose(pLogonFailure.szErrorDescribe);

        return true;
    },

    //登录成功
    OnSocketSubLogonSuccess :function(data,dataSize) {
        this.mIsQuickSitDown = false;

        //设置状态
        this.SetServiceStatus(ServiceStatus_RecvInfo);

        //if (this.mIServerItemSink)
        //    this.mIServerItemSink.OnGRLogonSuccess();

        return true;
    },

    //登录完成
    OnSocketSubLogonFinish :function(data, dataSize) {
        //设置状态
        this.SetServiceStatus(ServiceStatus_ServiceIng);

        this.mUserAttribute.dwUserID=this.mMeUserItem.GetUserID();
        this.mUserAttribute.wChairID=INVALID_CHAIR;
        this.mUserAttribute.wTableID=INVALID_TABLE;

        if (this.mIServerItemSink)
            this.mIServerItemSink.OnGRLogonFinish();
        return true;
    },
  //登录完成
    OnSocketSubUpdateNotify :function(data, dataSize) {
        if (this.mIServerItemSink)
        this.mIStringMessageSink.InsertPromptStringAndClose("游戏版本不匹配");
        return true;
    },

    //房间配置
    OnSocketSubConfigServer :function(data,dataSize) {
        var pConfigServer = new CMD_GR_ConfigServer();

        //效验数据
        if (dataSize<gCByte.Bytes2Str(pConfigServer,data)) return false;

        //消息处理

        //房间属性
        this.mServerAttribute.wServerType=pConfigServer.wServerType;
        this.mServerAttribute.dwServerRule=pConfigServer.dwServerRule;
        this.mServerAttribute.wTableCount=pConfigServer.wTableCount;
        this.mServerAttribute.wChairCount=pConfigServer.wChairCount;

        if (!this.mTableViewFrame.ConfigTableFrame(
            this.mServerAttribute.wTableCount,
            this.mServerAttribute.wChairCount,
            this.mServerAttribute.dwServerRule,
            this.mServerAttribute.wServerType,
            this.mServerAttribute.wServerID))
        {
            this.IntermitConnect(true);
            return false;
        }

        return true;
    },

    //用户处理
    OnSocketMainUser :function(sub, data, dataSize){
        switch (sub) {
            //请求坐下失败
            case SUB_GR_REQUEST_FAILURE:    return this.OnSocketSubRequestFailure(data, dataSize);
            //邀请玩家
            case SUB_GR_USER_INVITE:		return OnSocketSubUserInvite(data,dataSize);
            //等待分配
            case SUB_GR_USER_WAIT_DISTRIBUTE: return OnSocketSubWaitDistribute(data,dataSize);

            //用户进入
            case SUB_GR_USER_ENTER:			return this.OnSocketSubUserEnter(data, dataSize);
            //用户积分
            case SUB_GR_USER_SCORE:			return this.OnSocketSubUserScore(data,dataSize);
            //用户状态
            case SUB_GR_USER_STATUS:		return this.OnSocketSubUserStatus(data,dataSize);

            //道具成功
            case SUB_GR_PROPERTY_SUCCESS:	return OnSocketSubPropertySuccess(data,dataSize);
            //道具失败
            case SUB_GR_PROPERTY_FAILURE:	return OnSocketSubPropertyFailure(data,dataSize);
            //道具效应
            case SUB_GR_PROPERTY_EFFECT:	return OnSocketSubPropertyEffect(data,dataSize);
            //礼物消息
            case SUB_GR_PROPERTY_MESSAGE:   return OnSocketSubPropertyMessage(data,dataSize);
            //喇叭消息
            case SUB_GR_PROPERTY_TRUMPET:	return OnSocketSubPropertyTrumpet(data,dataSize);
            case SUB_GR_USER_QUEUE_COM:		return OnSocketSubQueueCom(data, dataSize);
            case SUB_GR_USER_GAME_DATA:
            if(window.LOG_NET_DATA)console.log("the fucking user game data!!!!!")
            return true;
        }

        return true;
    },

    //请求失败
    OnSocketSubRequestFailure :function(data,dataSize) {
        //变量定义
        var pRequestFailure = new CMD_GR_RequestFailure();
        gCByte.Bytes2Str(pRequestFailure, data);

        //变量定义
        var pITableUserItem=0;
        var wMeTableID=this.mMeUserItem.GetTableID();
        var wMeChairID=this.mMeUserItem.GetChairID();


        //界面还原
        if ((this.mReqTableID!=INVALID_TABLE)&&(this.mReqChairID!=INVALID_TABLE)&&(this.mReqChairID!=MAX_CHAIR))
        {
            var pITableUserItem=this.mTableViewFrame.GetClientUserItem(this.mReqTableID,this.mReqChairID);
            if (pITableUserItem==this.mMeUserItem)
                this.mTableViewFrame.SetClientUserItem2(this.mReqTableID, this.mReqChairID, null);
        }

        //设置变量
        this.mReqTableID=INVALID_TABLE;
        this.mReqChairID=INVALID_CHAIR;

        if (this.mIsQuickSitDown){
            this.mIsQuickSitDown = false;
            /*
            if (CServerRule::IsAllowQuickMode(mServerAttribute.dwServerRule))
            {//快速坐下,防作弊模式
                if (mIServerItemSink)
                {
                    char szDescribeString[256*4];
                    UtoA(pRequestFailure->szDescribeString, szDescribeString, sizeof(pRequestFailure->szDescribeString));
                    mIServerItemSink->OnGFServerClose(szDescribeString);
                }
            }
            */
        }else{
            //提示消息
            if (this.mIServerItemSink)
                this.mIServerItemSink.onGRRequestFailure(pRequestFailure.szDescribeString);
        }

        return true;
    },

    //用户积分
    OnSocketSubUserScore:function (data, dataSize){
        var pUserScore = new CMD_GR_UserScore();

        //效验参数
        if (dataSize!= gCByte.Bytes2Str(pUserScore, data)) return false;

        //寻找用户
        var pIClientUserItem = this.mUserManager.SearchUserByUserID(pUserScore.dwUserID);

        //用户判断
        if (pIClientUserItem==0) return true;

        //变量定义
        var pGlobalUserData=g_GlobalUserInfo.GetGlobalUserData();

        //更新用户
        if (pGlobalUserData.dwUserID == pUserScore.dwUserID) {
            if(this.mServerAttribute.wServerType==GAME_GENRE_GOLD){
                pGlobalUserData.llUserScore = pUserScore.UserScore.llScore;
            }
            pGlobalUserData.llUserIngot = pUserScore.UserScore.llIngot;
        }
        this.mUserManager.UpdateUserItemScore(pIClientUserItem, pUserScore.UserScore);
        return true;
    },


    //用户进入
    OnSocketSubUserEnter :function(data, dataSize) {
        //消息处理
        var pUserInfoHead = new tagUserInfoHead();
        var readSize = gCByte.Bytes2Str(pUserInfoHead,data);
        //效验参数
        if (dataSize<readSize) return false;

        //变量定义
        var DataDescribe = new tagDataDescribe();
        var UserInfo = new tagUserInfo();
        var InfoObj = new Object();
        InfoObj.szStr = '';
        InfoObj.len_szStr = 0;
        //扩展信息
        while (readSize < dataSize){
            readSize += gCByte.Bytes2Str(DataDescribe, data, readSize);
            if (DataDescribe.wDataDescribe == DTP_NULL) break;
            InfoObj.len_szStr = DataDescribe.wDataSize;
            readSize += gCByte.Bytes2Str(InfoObj, data, readSize);
            switch (DataDescribe.wDataDescribe){
                case DTP_GR_NICK_NAME:		//用户昵称
                {
                    UserInfo.szNickName = InfoObj.szStr;
                    break;
                }
                case DTP_GR_GROUP_NAME:		//用户社团
                {
                    UserInfo.szGroupName = InfoObj.szStr;
                    break;
                }
                case DTP_GR_UNDER_WRITE:	//个性签名
                {
                    UserInfo.szUnderWrite = InfoObj.szStr;
                    break;
                }
                case DTP_GR_MOBILE_PHONE:	//个性签名
                {
                    UserInfo.szMobilePhone = InfoObj.szStr;
                    break;
                }
                case DTP_GR_IP:	//个性签名
                {
                    UserInfo.szClientIP = InfoObj.szStr;
                    break;
                }
            }
        }

        //var CustomFaceInfo = new tagCustomFaceInfo();

        //用户属性
        gCByte.StrSameMemCopy(UserInfo, pUserInfoHead);

        //激活用户
        var pIClientUserItem = this.mUserManager.SearchUserByUserID(UserInfo.dwUserID);
        if (pIClientUserItem == 0){
            pIClientUserItem = this.mUserManager.ActiveUserItem(UserInfo/*, CustomFaceInfo*/);
        }

        //获取对象
        var pServerListData = g_ServerListData;

        //人数更新
        //if (pServerListData)
        //    pServerListData.SetServerOnLineCount(this.mServerAttribute.wServerID, this.mUserManager.GetActiveUserCount());

        return true;
    },

    OnUserItemAcitve :function(pIClientUserItem){
        //判断自己
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        if (pGlobalUserData.dwUserID == pIClientUserItem.m_UserInfo.dwUserID){
            this.mMeUserItem=pIClientUserItem;
        }

        //设置桌子
        var cbUserStatus=pIClientUserItem.GetUserStatus();
        if ((cbUserStatus>=US_SIT)&&(cbUserStatus!=US_LOOKON)){
            var wTableID=pIClientUserItem.GetTableID();
            var wChairID=pIClientUserItem.GetChairID();
            this.mTableViewFrame.SetClientUserItem2(wTableID, wChairID, pIClientUserItem);
        }
    },

    //状态信息
    OnSocketMainStatus:function (sub,data,dataSize)
    {
        switch (sub)
        {
            //桌子信息
            case SUB_GR_TABLE_INFO:		return this.OnSocketSubStatusTableInfo(data, dataSize);
            //桌子状态
            case SUB_GR_TABLE_STATUS:	return this.OnSocketSubStatusTableStatus(data, dataSize);
        }

        return true;
    },

    //桌子信息
    OnSocketSubStatusTableInfo :function(data, dataSize){
        //变量定义
        var pTableInfo = new CMD_GR_TableInfo();
        if(dataSize < gCByte.Bytes2Str(pTableInfo,data)) return false;
        pTableInfo.TableStatusArray = new Array();
        for(var i = 0;i<pTableInfo.wTableCount;i++){
            pTableInfo.TableStatusArray[i] = new tagTableStatus();
        }

        if(dataSize != gCByte.Bytes2Str(pTableInfo,data)) return false;

        //桌子状态
        for (var i = 0; i < pTableInfo.wTableCount; i++){
            var cbTableLock= pTableInfo.TableStatusArray[i].cbTableLock;
            var cbPlayStatus=pTableInfo.TableStatusArray[i].cbPlayStatus;
            this.mTableViewFrame.SetTableStatus(i, (cbPlayStatus == true), (cbTableLock == true));
        }

        return true;
    },

    //桌子状态
    OnSocketSubStatusTableStatus :function(data, dataSize){
        var pTableStatus = new CMD_GR_TableStatus();
        //效验参数
        if(dataSize != gCByte.Bytes2Str(pTableStatus,data)) return false;

        //设置桌子
        var cbTableLock=pTableStatus.TableStatus.cbTableLock ;
        var cbPlayStatus=pTableStatus.TableStatus.cbPlayStatus;
        this.mTableViewFrame.SetTableStatus(pTableStatus.wTableID, (cbPlayStatus == true), (cbTableLock == true));
        //设置桌子
        if(cbPlayStatus==true && this.mMeUserItem.GetTableID()==pTableStatus.wTableID ){
            this.mTableViewFrame.SetTableStatus1(false);
        }

        return true;
    },

    //系统消息
    OnSocketMainSystem:function (sub, data, dataSize){
        switch (sub){
            //系统消息
            case SUB_CM_SYSTEM_MESSAGE:	return this.OnSocketSubSystemMessage(data,dataSize);
            //动作消息
            case SUB_CM_ACTION_MESSAGE:	return OnSocketSubActionMessage(data,dataSize);
        }
        return true;
    },

    //系统消息
    OnSocketSubSystemMessage:function (data, dataSize){
        var message = new CMD_CM_SystemMessage();
        gCByte.Bytes2Str(message, data);

        //关闭游戏
        if (message.wType&(SMT_CLOSE_ROOM|SMT_CLOSE_LINK|SMT_CLOSE_GAME)){
            if (gClientKernel.get())
                gClientKernel.get().Intermit(GameExitCode_Shutdown);
        }

        //关闭游戏
        if (message.wType&(SMT_CLOSE_ROOM|SMT_CLOSE_LINK))
        {
            //this.IntermitConnect(true);
        }

        //弹出消息
        if (message.wType&SMT_EJECT)
        {
            if (this.mIStringMessageSink)
                this.mIStringMessageSink.InsertPromptString( message.szString);
        }

        //关闭处理
        if ((message.wType&(SMT_CLOSE_ROOM|SMT_CLOSE_LINK))!=0)
        {
            //时间延迟
            //if (this.mIServerItemSink)
            //    this.mIServerItemSink.OnGFServerClose(sString);
        }

        return true;
    },

    //执行起立
    PerformStandUpAction:function (wTableID,wChairID){
        if (!this.IsService())
            return false;

        //状态过滤
        if (this.mServiceStatus!=ServiceStatus_ServiceIng) return false;
        if ((this.mReqTableID==wTableID)&&(this.mReqChairID==wChairID)) return false;

        //设置变量
        this.mReqTableID=INVALID_TABLE;
        this.mReqChairID=INVALID_CHAIR;
        this.mFindTableID=INVALID_TABLE;

        //设置界面
        this.mTableViewFrame.VisibleTable(wTableID);

        var kernel = gClientKernel.get();
        if (kernel){
            kernel.Intermit(false);
        }else{
            this.SendStandUpPacket(wTableID, wChairID, 0);
        }

        return true;
    },

    //执行坐下
    PerformSitDownAction:function(wTableID, wChairID, bEfficacyPass){
        if(window.LOG_NET_DATA)console.log("执行坐下",wTableID,wChairID);
        if (!this.IsService())  return false;

        //状态过滤
        if (this.mServiceStatus!=ServiceStatus_ServiceIng) return false;
        if ((this.mReqTableID!=INVALID_TABLE)&&(this.mReqTableID==wTableID)) return false;
        if ((this.mReqChairID!=INVALID_CHAIR)&&(this.mReqChairID==wChairID)) return false;

        if ((wTableID != INVALID_TABLE) && (wChairID != INVALID_CHAIR))
        {
            var pINowUserItem = this.mTableViewFrame.GetClientUserItem(wTableID, wChairID);
            if (pINowUserItem != null)return true;
        }

        //自己状态
        if (this.mMeUserItem.GetUserStatus()>=US_PLAYING)
        {
            return true;
            //提示消息
            if (this.mIStringMessageSink)
                this.mIStringMessageSink.InsertPromptString("您正在游戏中，暂时不能离开，请先结束当前游戏！");
            return false;
        }

        //清理界面
        if ((this.mReqTableID!=INVALID_TABLE)&&(this.mReqChairID!=INVALID_CHAIR)&&(this.mReqChairID!=MAX_CHAIR))
        {
            pIClientUserItem = this.mTableViewFrame.GetClientUserItem(this.mReqTableID, this.mReqChairID);
            if (pIClientUserItem == this.mMeUserItem) this.mTableViewFrame.SetClientUserItem2(mReqTableID, mReqChairID, null);
        }

        //设置界面
        if ((wChairID!=MAX_CHAIR)&&(wTableID!=INVALID_TABLE)&&(wChairID!=INVALID_CHAIR))
        {
            this.mTableViewFrame.VisibleTable(wTableID);
            this.mTableViewFrame.SetClientUserItem2(wTableID, wChairID, this.mMeUserItem);
        }

        //设置变量
        this.mReqTableID=wTableID;
        this.mReqChairID=wChairID;
        this.mFindTableID=INVALID_TABLE;

        //发送命令
        this.SendSitDownPacket(wTableID,wChairID,"");

        return true;
    },
    //执行坐下
    PerformEnterRoom:function() {
        if(window.LOG_NET_DATA)console.log("进入房间 ", window.g_dwRoomID);
        if (!this.IsService())  return false;

        //状态过滤
        if (this.mServiceStatus!=ServiceStatus_ServiceIng) return false;

        //自己状态
        if (this.mMeUserItem.GetUserStatus() >= US_PLAYING && this.mMeUserItem.GetTableID() != INVALID_CHAIR){
            return true;
            //提示消息
            if (this.mIStringMessageSink)
                this.mIStringMessageSink.InsertPromptString("您正在游戏中，暂时不能离开，请先结束当前游戏！");
            return false;
        }
/*
        //清理界面
        if ((this.mReqTableID!=INVALID_TABLE)&&(this.mReqChairID!=INVALID_CHAIR)&&(this.mReqChairID!=MAX_CHAIR)){
            pIClientUserItem = this.mTableViewFrame.GetClientUserItem(this.mReqTableID, this.mReqChairID);
            if (pIClientUserItem == this.mMeUserItem) this.mTableViewFrame.SetClientUserItem2(mReqTableID, mReqChairID, null);
        }

        //设置界面
        if ((wChairID!=MAX_CHAIR)&&(wTableID!=INVALID_TABLE)&&(wChairID!=INVALID_CHAIR)){
            this.mTableViewFrame.VisibleTable(wTableID);
            this.mTableViewFrame.SetClientUserItem2(wTableID, wChairID, this.mMeUserItem);
        }
*/

        //发送命令
        //if(g_ServerListDataLast.wServerType & (GAME_GENRE_PERSONAL|GAME_GENRE_CLUB)){
            if( window.g_dwRoomID > 0){
                var UserSitDown = new CMD_GR_UserEnterRoom();
                UserSitDown.dwRoomID = window.g_dwRoomID;
                UserSitDown.dwClubID = window.g_dwClubID;
                this.SendSocketClass(MDM_GR_USER, SUB_GR_USER_ENTER_ROOM, UserSitDown);
            }else{
               if(window.LOG_NET_DATA)console.log('PerformEnterRoom window.g_dwRoomID null')
               this.IntermitConnect(true);
            }
        //}

        return true;
    },
    OnUserItemDelete:function (pIClientUserItem)
    {
        //变量定义
        var wLastTableID = pIClientUserItem.GetTableID();
        var wLastChairID = pIClientUserItem.GetChairID();
        var dwLeaveUserID = pIClientUserItem.GetUserID();
        var pMeUserInfo = this.mMeUserItem.GetUserInfo();

        //离开处理
        if ((wLastTableID!=INVALID_TABLE)&&(wLastChairID!=INVALID_CHAIR))
        {
            //获取用户
            var pITableUserItem= this.mTableViewFrame.GetClientUserItem(wLastTableID,wLastChairID);
            if (pITableUserItem==pIClientUserItem) this.mTableViewFrame.SetClientUserItem2(wLastTableID,wLastChairID,null);

            //离开通知
            if ((pIClientUserItem==this.mMeUserItem)||(wLastTableID==pMeUserInfo.wTableID)) {
                var UserStatus = new tagUserStatus();
                UserStatus.cbUserStatus=US_NULL;
                UserStatus.wTableID=INVALID_TABLE;
                UserStatus.wChairID=INVALID_CHAIR;

                if (gClientKernel.get())
                    gClientKernel.get().OnGFUserStatus(pIClientUserItem.GetUserID(), UserStatus);
            }
        }
    },

    OnUserItemUpdate2:function (pIClientUserItem,tLastScore) {
        //变量定义
        var pUserInfo = pIClientUserItem.GetUserInfo();
        var pMeUserInfo = this.mMeUserItem.GetUserInfo();
        var wNowTableID=pIClientUserItem.GetTableID();
        var wLastTableID=tLastScore.wTableID;
        var wNowChairID=pIClientUserItem.GetChairID();
        var wLastChairID=tLastScore.wChairID;
        var cbNowStatus=pIClientUserItem.GetUserStatus();
        var cbLastStatus=tLastScore.cbUserStatus;

        var pClientKernel = gClientKernel.get();
        //桌子离开
        if ((wLastTableID!=INVALID_TABLE)&&((wLastTableID!=wNowTableID)||(wLastChairID!=wNowChairID)))
        {
            var pITableUserItem = this.mTableViewFrame.GetClientUserItem(wLastTableID, wLastChairID);
            if (pITableUserItem == pIClientUserItem) this.mTableViewFrame.SetClientUserItem2(wLastTableID, wLastChairID, null);
        }

        //桌子加入
        if ((wNowTableID!=INVALID_TABLE)&&(cbNowStatus!=US_LOOKON)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID)))
        {
            this.mTableViewFrame.SetClientUserItem2(wNowTableID,wNowChairID,pIClientUserItem);
        }

        //桌子状态
        if ((this.mTableViewFrame.GetChairCount() < MAX_CHAIR)&&(wNowTableID!=INVALID_TABLE)&&(wNowTableID==wLastTableID)&&(wNowChairID==wLastChairID))
        {
            this.mTableViewFrame.UpdateTableView(wNowTableID);
        }

        //离开通知
        if ((wLastTableID!=INVALID_TABLE)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID))){
            //游戏通知
            if ((pIClientUserItem==this.mMeUserItem)||(wLastTableID==pMeUserInfo.wTableID)) {
                var UserStatus = new tagUserStatus();
                UserStatus.wTableID=wNowTableID;
                UserStatus.wChairID=wNowChairID;
                UserStatus.cbUserStatus=cbNowStatus;

                if (pClientKernel) pClientKernel.OnGFUserStatus(pUserInfo.dwUserID,UserStatus);
            }

            if (pIClientUserItem==this.mMeUserItem) {
                //设置变量
                mReqTableID=INVALID_TABLE;
                mReqChairID=INVALID_CHAIR;
                //快速模式的
                this.IntermitConnect(true);
                //TODO:
                //if (this.mIServerItemSink)
                //    this.mIServerItemSink.OnGFServerClose("");
            }
            return;
        }

        //加入处理
        if ((wNowTableID!=INVALID_TABLE)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID)))
        {
            //自己判断
            if (this.mMeUserItem==pIClientUserItem)
            {
                //设置变量
                this.mReqTableID=INVALID_TABLE;
                this.mReqChairID=INVALID_CHAIR;

                if (pClientKernel==0){
                    //启动进程
                    if (!this.mIServerItemSink || !this.mIServerItemSink.CreateKernel()){
                        this.OnGFGameClose(GameExitCode_CreateFailed);
                        return;
                    }
                } else {
                    this.mMeUserItem = pIClientUserItem;
                    IServerItem.get().OnGFGameReady();
                }
            }

            //游戏通知
            if ((this.mMeUserItem!=pIClientUserItem || this.mMeUserItem.GetUserStatus() == US_LOOKON)&&pMeUserInfo.wTableID==wNowTableID){
                if (pClientKernel) pClientKernel.OnGFUserEnter(pIClientUserItem);
            }

            return;
        }

        //状态改变
        if ((wNowTableID!=INVALID_TABLE)&&(wNowTableID==wLastTableID)&&(pMeUserInfo.wTableID==wNowTableID)){
            //游戏通知
            UserStatus = new tagUserStatus();
            UserStatus.wTableID=wNowTableID;
            UserStatus.wChairID=wNowChairID;
            UserStatus.cbUserStatus=cbNowStatus;

            if (pClientKernel) pClientKernel.OnGFUserStatus(pUserInfo.dwUserID,UserStatus);
        }
    },

    OnUserScoreUpdate:function(pIClientUserItem, UserScore){
        var pClientKernel = gClientKernel.get();
        if (pClientKernel) pClientKernel.OnGFUserScore(pIClientUserItem.GetUserID(), UserScore);
    },
    OnUserItemUpdate:function(pIClientUserItem, LastStatus){
        //变量定义
        var pUserInfo=pIClientUserItem.GetUserInfo();
        var pMeUserInfo=this.mMeUserItem.GetUserInfo();
        var wNowTableID=pIClientUserItem.GetTableID();
        var wLastTableID=LastStatus.wTableID;
        var wNowChairID=pIClientUserItem.GetChairID();
        var wLastChairID=LastStatus.wChairID;
        var cbNowStatus=pIClientUserItem.GetUserStatus();
        var cbLastStatus=LastStatus.cbUserStatus;

        var pClientKernel = gClientKernel.get();

        if (this.mIServerItemSink)
            this.mIServerItemSink.OnGRUserUpdate(pIClientUserItem);

        //桌子离开
        if ((wLastTableID!=INVALID_TABLE)&&((wLastTableID!=wNowTableID)||(wLastChairID!=wNowChairID))){
            var pITableUserItem = this.mTableViewFrame.GetClientUserItem(wLastTableID, wLastChairID);
            if (pITableUserItem == pIClientUserItem) this.mTableViewFrame.SetClientUserItem2(wLastTableID, wLastChairID, null);
        }

        //桌子加入
        if ((wNowTableID!=INVALID_TABLE)&&(cbNowStatus!=US_LOOKON)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID)))
        {
            this.mTableViewFrame.SetClientUserItem2(wNowTableID,wNowChairID,pIClientUserItem);
        }

        //桌子状态
        if ((this.mTableViewFrame.GetChairCount() < MAX_CHAIR)&&(wNowTableID!=INVALID_TABLE)&&(wNowTableID==wLastTableID)&&(wNowChairID==wLastChairID)){
            this.mTableViewFrame.UpdateTableView(wNowTableID);
        }

        //离开通知
        if ((wLastTableID!=INVALID_TABLE)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID)))
        {
            //游戏通知
            if ((pIClientUserItem==this.mMeUserItem)||(wLastTableID==pMeUserInfo.wTableID)) {
                var UserStatus = new tagUserStatus();
                UserStatus.wTableID=wNowTableID;
                UserStatus.wChairID=wNowChairID;
                UserStatus.cbUserStatus=cbNowStatus;
                if (pClientKernel) pClientKernel.OnGFUserStatus(pUserInfo.dwUserID, UserStatus);
            }

            if (pIClientUserItem==this.mMeUserItem){ //设置变量
                this.mReqTableID=INVALID_TABLE;
                this.mReqChairID=INVALID_CHAIR;
            }
            return;
        }

        //加入处理
        if ((wNowTableID!=INVALID_TABLE)&&((wNowTableID!=wLastTableID)||(wNowChairID!=wLastChairID))){
            //自己判断
            if (this.mMeUserItem==pIClientUserItem){
                //设置变量
                this.mReqTableID=INVALID_TABLE;
                this.mReqChairID=INVALID_CHAIR;

                if (!pClientKernel) {
                    //启动进程
                    if (!this.mIServerItemSink || !this.mIServerItemSink.CreateKernel()){
                        this.OnGFGameClose(GameExitCode_CreateFailed);
                        return;
                    }
                } else {
                    this.mMeUserItem = pIClientUserItem;
                    this.OnGFGameReady();
                }
            }

            //游戏通知
            if ((this.mMeUserItem!=pIClientUserItem || this.mMeUserItem.GetUserStatus() == US_LOOKON)&&(pMeUserInfo.wTableID==wNowTableID)){
                if (pClientKernel) pClientKernel.OnGFUserEnter(pIClientUserItem);
            }

            return;
        }

        //状态改变
        if ((wNowTableID!=INVALID_TABLE)&&(wNowTableID==wLastTableID)&&(pMeUserInfo.wTableID==wNowTableID)){
            //游戏通知
            var UserStatus = new tagUserStatus();
            UserStatus.wTableID=wNowTableID;
            UserStatus.wChairID=wNowChairID;
            UserStatus.cbUserStatus=cbNowStatus;

            if (pClientKernel) pClientKernel.OnGFUserStatus(pUserInfo.dwUserID,UserStatus);

            return;
        }

        return;
    },

    //用户状态
    OnSocketSubUserStatus:function (data,dataSize) {
        var pUserStatus = new CMD_GR_UserStatus();
        //效验参数
        if (dataSize<gCByte.Bytes2Str(pUserStatus, data)) return false;
        //寻找用户
        var pIClientUserItem=this.mUserManager.SearchUserByUserID(pUserStatus.dwUserID);
        //用户判断
        if (pIClientUserItem==0) return true;

        //设置状态
        if (pUserStatus.UserStatus.cbUserStatus==US_NULL) {
            //删除用户
            this.mUserManager.DeleteUserItem(pIClientUserItem);
        }else{
            //更新用户
            this.mUserManager.UpdateUserItemStatus(pIClientUserItem, pUserStatus.UserStatus);
        }

        return true;
    },

    //发送坐下
    SendSitDownPacket:function (wTableID, wChairID)
    {
        var UserSitDown  = new CMD_GR_UserSitDown();
        //构造数据
        UserSitDown.wTableID = wTableID;
        UserSitDown.wChairID = wChairID;
        UserSitDown.szPassword = "";

        this.SendSocketClass(MDM_GR_USER, SUB_GR_USER_SITDOWN, UserSitDown);

        return true;
    },

    //游戏消息
    //框架消息
    OnSocketMainGameFrame:function (main,sub, data, dataSize){
        if (!gClientKernel.get() || !this.mIsGameReady)  return true;
        return gClientKernel.get().OnGFEventSocket(main, sub, data, dataSize);
    },

    //发送起立
    SendStandUpPacket:function (wTableID,wChairID,cbForceLeave)
    {
        //变量定义
        var UserStandUp = new CMD_GR_UserStandUp();
        //构造数据
        UserStandUp.wTableID = wTableID;
        UserStandUp.wChairID = wChairID;
        UserStandUp.cbForceLeave = parseInt(cbForceLeave);

        //发送数据
        this.SendSocketClass(MDM_GR_USER, SUB_GR_USER_STANDUP, UserStandUp);

        return true;
    },
});
