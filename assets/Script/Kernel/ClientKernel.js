CClientKernel = cc.Class({
    ctor:function() {
        //游戏属性
        this.mGameAttribute = new tagGameAttribute();
        this.mFirstPlaying = false;
        this.mMeUserItem = 0;
        this.mServerItem = null;

        this.mUserManager  = new CGameUserManager(this);
    },

    //内核配置
    Init:function() {
        this.mGameAttribute.dwClientVersion	= cc.VERSION_PLAZA;
        //this.mServerItem.OnGFGameReady();
        return true;
    },

    SetServerItem:function(pServerItem){
         this.mServerItem = pServerItem;
    },
    ResetUserItem:function(){
        this.mUserManager.ResetUserItem(this.mMeUserItem);
    },
    Intermit:function(iExitCode){
        this.mServerItem.OnGFGameClose(iExitCode);
        gClientKernel.destory();
        return true;
    },

    //房间属性
    GetServerAttribute:function () {
        return this.mServerAttribute;
    },

    //自己位置
    GetMeUserItem :function(){
        return this.mMeUserItem;
    },

    //自己位置
    GetMeChairID :function(){
        if (this.mMeUserItem == 0) return INVALID_CHAIR;
        return this.mMeUserItem.GetChairID();
    },

    //设置接口
    SetClientKernelSink :function(pIClientKernelSink){
        this.mIClientKernelSink = pIClientKernelSink;
        return true;
    },

    //设置接口
    SetStringMessageSink:function(pIStringMessageSink) {
        this.mIStringMessageSink = pIStringMessageSink;
        return true;
    },


    OnUserItemAcitve :function(pIClientUserItem){
        if (pIClientUserItem == 0) return;

        if (this.mUserAttribute.dwUserID == pIClientUserItem.GetUserID()){
            this.mMeUserItem = pIClientUserItem;
        }

        if (this.mIClientKernelSink)
            this.mIClientKernelSink.OnEventUserEnter(pIClientUserItem, pIClientUserItem.GetUserStatus() == US_LOOKON);
    },

    OnUserItemDelete:function (pIClientUserItem) {
        if (pIClientUserItem == 0) return;

        if (this.mIClientKernelSink)
            this.mIClientKernelSink.OnEventUserLeave(pIClientUserItem, pIClientUserItem.GetUserStatus() == US_LOOKON);
    },
    //用户积分
    OnGFUserScore:function (dwUserID, UserScore){
        //寻找用户
        var pIClientUserItem = this.mUserManager.SearchUserByUserID(dwUserID);

        //用户判断
        if (pIClientUserItem==null || pIClientUserItem==0) return;
        if (this.mIClientKernelSink)
            this.mIClientKernelSink.OnEventScoreUpdare(pIClientUserItem, pIClientUserItem.GetUserStatus() == US_LOOKON);

    },

    //用户状态
    OnGFUserStatus :function (dwUserID, UserStatus) {
        var pIClientUserItem = this.mUserManager.SearchUserByUserID(dwUserID);

        //用户判断
        if (pIClientUserItem==0) return;

        //状态定义
        var cbUserStatus=UserStatus.cbUserStatus;

        //离开判断
        if ((cbUserStatus==US_NULL)||(cbUserStatus==US_FREE)) {
            if (this.mMeUserItem.GetUserID()==pIClientUserItem.GetUserID()) {
                //设置变量
                this.mAllowLookon=false;
                this.mGameStatus=GAME_STATUS_FREE;

                //重置游戏
                //if (this.mIClientKernelSink)
                //    this.mIClientKernelSink.ResetGameClient();

                //删除用户
                //this.mUserManager.ResetUserItem( this.mMeUserItem );
            }
            else
            {
                //删除用户
                this.mUserManager.DeleteUserItem(pIClientUserItem);
            }

            return;
        }

        if (this.mUserManager)
            this.mUserManager.UpdateUserItemStatus(pIClientUserItem, UserStatus);
    },

    //房间配置
    OnGFConfigServer:function (UserAttribute, ServerAttribute){
        this.mUserAttribute = UserAttribute;
        this.mServerAttribute = ServerAttribute;
    },

    //用户进入
    OnGFUserEnter:function (pIClientUserItem){
        //用户判断
        if (pIClientUserItem==null) return;

        if (this.mUserManager!=null) {
            this.mUserManager.ActiveUserItem(pIClientUserItem.GetUserInfo(),pIClientUserItem.GetCustomFaceInfo());
        }
    },

    //配置完成
    OnGFConfigFinish:function (){
        if ( !this.mFirstPlaying ){
            this.mFirstPlaying = true;
            if (this.mIClientKernelSink && !this.mIClientKernelSink.SetupGameClient()) {
                return;
            }
        }

        this.SendGameOption();
    },

    //////////////////////////////////////////////////////////////////////////
    //网络接口

    //发送函数
    SendSocketClass:function (wMainCmdID, wSubCmdID, Obj) {
        return this.mServerItem.SendSocketClass(wMainCmdID, wSubCmdID, Obj);
    },

    //发送函数
    SendSocketData:function (wMainCmdID, wSubCmdID, data, dataSize) {
        return this.mServerItem.GFSendData(wMainCmdID, wSubCmdID, data, dataSize);
    },

    //////////////////////////////////////////////////////////////////////////
    //功能接口
    //发送进入场景
    SendGameOption:function (){
        //变量定义
        var GameOption = new CMD_GF_GameOption();
        //构造数据
        GameOption.cbAllowLookon = 1;
        GameOption.dwFrameVersion = cc.VERSION_PLAZA;
        GameOption.dwClientVersion = this.mGameAttribute.dwClientVersion;

        //发送数据
        this.SendSocketClass(MDM_GF_FRAME, SUB_GF_GAME_OPTION, GameOption);
    },

    OnGFEventSocket:function (main, sub, data, dataSize){
        //游戏消息
        if (main==MDM_GF_GAME) {
            if (this.mIClientKernelSink==0) return false;
            if(this.mIClientKernelSink.OnEventGameMessage(sub,data,dataSize) == true) return true;
            if (USER_CARD_TEST && this.mIClientKernelSink.OnEventCardTestMessage(sub,data,dataSize)) return true;
            return false;
        }
        //游戏消息
        if (main==MDM_GR_INSURE)  return true;

        //框架处理
        if (main==MDM_GF_FRAME){
           return this.OnEventGameFrameMessage(sub,data,dataSize)
        }

        if (main==MDM_GF_CARDROOM) {
            if (this.mIClientKernelSink==0) return false;
            return this.mIClientKernelSink.OnCardRoomMessage(sub,data,dataSize);
        }
        return false;
    },
    OnEventGameFrameMessage:function (sub,data,dataSize){
        switch (sub){
            case SUB_GF_GAME_STATUS:    //游戏状态
            {
                return this.OnSocketSubGameStatus(data,dataSize);
            }
            case SUB_GF_GAME_SCENE:     //游戏场景
            {
                return this.OnSocketSubGameScene(data,dataSize);
            }
            case SUB_GF_LOOKON_STATUS:  //旁观状态
            {
                return OnSocketSubLookonStatus(data,dataSize);
            }
            case SUB_GF_SYSTEM_MESSAGE:     //系统消息
            {
                return this.OnSocketSubSystemMessage(data,dataSize);
            }
            case SUB_GF_ACTION_MESSAGE:     //动作消息
            {
                return OnSocketSubActionMessage(data,dataSize);
            }
            case SUB_GF_GPS_GET_RES:     //动作消息
            {
                return this.OnSocketSubGPSInfo(data,dataSize);
            }
            case SUB_GF_USER_READY:         //用户准备
            {
                if(this.mMeUserItem ==0 || this.mMeUserItem.GetUserStatus()>=US_READY)
                return true;
                this.SendFrameData(SUB_GF_USER_READY);
                if (this.mIClientKernelSink)
                    this.mIClientKernelSink.OnGFMatchWaitTips(0);
                return true;
            }
            case SUB_GR_MATCH_INFO:				//比赛信息
            case SUB_GR_MATCH_WAIT_TIP:			//等待提示
            case SUB_GR_MATCH_RESULT:			//比赛结果
            {
                return true;
            }
            case SUB_GF_USER_EXPRESSION:   // 快捷短语
            {
                return this.mIClientKernelSink.OnSubUserPhrase(data, dataSize);
            }
            case SUB_GF_USER_CHAT:          // 用户聊天
            {
                return this.mIClientKernelSink.OnSubUserChat(data, dataSize);
            }
            case SUB_GF_USER_VOICE:             //语音
            {
                return this.mIClientKernelSink.OnSubUserVoice(data,dataSize);
            }
        }

        return true;
    },
    //游戏状态
    OnSocketSubGameStatus:function (data, dataSize){
        var pGameStatus = new CMD_GF_GameStatus();
        //效验参数
        if (dataSize!=gCByte.Bytes2Str(pGameStatus, data)) return false;

        //设置变量
        this.mGameStatus=pGameStatus.bGameStatus;
        this.mAllowLookon=pGameStatus.bAllowLookon?true:false;

        return true;
    },

    //系统消息
    OnSocketSubSystemMessage:function (data, dataSize){
        //变量定义
        var pSystemMessage = new CMD_CM_SystemMessage();
        gCByte.Bytes2Str(pSystemMessage, data);

        //显示消息
        if ((pSystemMessage.wType&SMT_CHAT) && (this.mIStringMessageSink != null)){
            this.mIStringMessageSink.InsertSystemString(pSystemMessage.szString);
        }

        //弹出消息
        if ((pSystemMessage.wType&SMT_EJECT) && (this.mIStringMessageSink != 0)){
            if(pSystemMessage.wType&SMT_CLOSE_GAME)  this.mIStringMessageSink.InsertPromptStringAndClose(pSystemMessage.szString);
            else this.mIStringMessageSink.InsertPromptString(pSystemMessage.szString);
        }
        //关闭处理
        if ((pSystemMessage.wType&SMT_CLOSE_GAME) != 0){
            //中断连接
            //this.Intermit(GameExitCode_Normal);
        }
        //关闭房间
        if (pSystemMessage.wType&SMT_CLOSE_GAME){
            //if (g_pClientLand!=null)g_pClientLand->CloseGameClient();
        }
        return true;
    },
    OnSocketSubGPSInfo:function (data, dataSize){
        //变量定义
        var InfoArr = new Array();
        InfoArr[0] = new tagUserGps();
        var size = gCByte.GetSize(InfoArr[0]);
        if(dataSize == 0 || dataSize < size || dataSize % size != 0 ){
            if(window.LOG_NET_DATA)console.log("OnSocketSubGPSInfo dataSize err "+dataSize+" % "+size)
            return true;
        }
        var Cnt = dataSize/size;
        for(var i = 1;i<Cnt;i++){
            InfoArr[i] = new tagUserGps();
        }
        InfoArr._name = "GPS_ARR"
        gCByte.Bytes2Str(InfoArr, data);

        this.mIClientKernelSink.OnGetTableGPSRes(InfoArr);
        return true;
    },
    //游戏场景
    OnSocketSubGameScene:function (data, dataSize){
        //效验状态
        if (this.mMeUserItem==0) return true;
        if (this.mMeUserItem==null) return true;
        if (this.mIClientKernelSink==0)  return true;

        //场景处理
        var bLookonUser=(this.mMeUserItem.GetUserStatus()==US_LOOKON);
        this.mIClientKernelSink.ShowLookOnView(bLookonUser)
        this.mIClientKernelSink.OnClearScene();
        var bRet = this.mIClientKernelSink.OnEventSceneMessage(this.mGameStatus, bLookonUser, data, dataSize);

        return bRet;
    },

    //旁观状态
    IsLookonMode:function (){
        if (this.mMeUserItem == 0) return true;
        return this.mMeUserItem.GetUserStatus() == US_LOOKON;
    },

    //用户更新
    OnUserItemUpdate:function (pIClientUserItem, UserAttrib){
        if (this.pIClientUserItem == 0) return;

        if (this.mIClientKernelSink)
            this.mIClientKernelSink.OnEventUserStatus(pIClientUserItem, pIClientUserItem.GetUserStatus() == US_LOOKON);
    },

    //游戏用户
    GetTableUserItem:function (wChairID){
        return this.mUserManager.GetTableUserItem(wChairID);
    },
    //游戏用户
    GetTableLookOnUserArr:function (){
        return this.mUserManager.GetTableLookOnUserArr();
    },
});


IClientKernel__ = cc.Class({
    ctor:function(){
        this.__gClentKernelRefCount = 0;
        this.__gClientKernel = null;
    },
    create:function() {
        if (this.__gClentKernelRefCount == 0) {
            this.__gClientKernel = new CClientKernel();
        }
        this. __gClentKernelRefCount++;

        return this.__gClientKernel;
    },

    destory:function() {
        if (this.__gClentKernelRefCount > 0){
            this.__gClentKernelRefCount--;
            if (this.__gClentKernelRefCount <= 0){
                this.__gClentKernelRefCount = 0;
                this. __gClientKernel = null;
            }
        }
    },

    get:function() {
        return this.__gClientKernel;
    },
});

window.gClientKernel = new IClientKernel__();
