cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor :function () {
        this.mGameServerItem = null;
        this.mShowReLink = false;
    },
    onLoad:function () {
        cc.debug.setDisplayStats(false);
        FitSize(this.node);
        ShowO2I(this.node, 0.5);
        //设置背景
        this.m_gameNode = this.$("GameNode");
        this.m_BGSprite = this.m_gameNode.getComponent(cc.Sprite);
        this.m_bTipGPS = true;
        window.g_CntGameGPS = 0;
        this.schedule(this.NetworkHeartbeat, 5);
        this.$('BtInvite').active = false;
        this.m_Loading = this.$('loading');
        if(window.gGameBG == null) window.gGameBG = 'loading';
    },
    update :function (dt) {
        if(window.gGameBG == 'loading') {

            window.gGameBG = cc.gPreLoader.LoadRes(`${GameDef.BGPath}`, '' + GameDef.KIND_ID, function(res) {
                this.m_BGSprite.spriteFrame = res;
            }.bind(this));

        } else if(window.gGameBG instanceof cc.SpriteFrame) {
            this.m_BGSprite.spriteFrame = window.gGameBG;
            window.gGameBG = null;
        }
    },

    // use this for initialization
    start :function () {
        g_Launch = null;
        g_Login = null;
        g_Lobby = null;
        g_Table = this;
        g_CurScene = this;
        this.mGameServerItem = g_ServerListDataLast;

        this.m_ServerItem = this.node.getComponent("CServerItem")
        if(this.m_ServerItem == null) this.m_ServerItem = this.node.addComponent("CServerItem");
        var TableViewNode = new cc.Node('TableViewFrame');
        this.node.addChild(TableViewNode);
        this.m_TableViewFrame = TableViewNode.addComponent("TableViewFrame");
        this.m_ServerItem.SetServerItemSink(this);
        this.m_ServerItem.SetStringMessageSink(this);
        this.m_ServerItem.mTableViewFrame = this.m_TableViewFrame;
        this.m_TableViewFrame.SetServerItem( this.m_ServerItem );

        this.CreateKernel();
    },

    InsertPromptString:function (pszString, iButtonType) {
        //提示信息
        this.ShowAlert(pszString);
    },
    OnAlertExitLogin:function(Res){
        if(Res) this.ExitGameLogin();
    },
    InsertSystemString:function (pszString, iButtonType) {
    },
    InsertPromptStringAndClose:function (pszString, iButtonType) {
        //提示信息
        this.ShowAlert(pszString,Alert_Yes,"OnAlertExitLogin",this);
    },
    //登陆完成
    OnGRLogonFinish :function() {
        var pMySelfUserItem = this.m_ServerItem.GetMeUserItem();
        if(pMySelfUserItem.GetTableID()==INVALID_CHAIR){
            if(g_ServerListDataLast.wServerType & (GAME_GENRE_PERSONAL|GAME_GENRE_PERSONAL_S|GAME_GENRE_PERSONAL_G)){
                this.m_ServerItem.PerformEnterRoom();
            }else{
                this.m_ServerItem.PerformSitDownAction(this.mGameServerItem.wTableID, INVALID_CHAIR, false);
            }
        }else{
            this.m_ServerItem.OnGFGameReady();
        }
    },

    //比赛消息
    InsertMatchJoinString:function (lMatchFee){
        this.m_lMatchFee = lMatchFee;
        if(confirm("参赛将扣除报名费 "+this.m_lMatchFee.toString()+" 游戏币，确认要参赛吗？")){
            this.OnJionCallBack();
        }
        return true;
    },

    OnJionCallBack :function() {
        pServerItem = IServerItem.get();
        var cbData = new Uint8Array(8);
        gCByte.w8(cbData, 0, this.m_lMatchFee);
        pServerItem.SendSocketData(MDM_GR_MATCH, SUB_GR_MATCH_FEE, cbData, 8);
    },

    //请求失败
    onGRRequestFailure :function(szDescribeString){
        this.ShowAlert(szDescribeString,Alert_Yes,"OnAlertExitGame",this);
    },
    OnAlertExitGame:function(Res){
        if(Res) this.ExitGame();
    },
    //创建游戏内核
    CreateKernel :function() {
        var kernel = gClientKernel.create();
        if (kernel == null) return false;
        kernel.SetServerItem(this.m_ServerItem);
        kernel.SetStringMessageSink(this);
        kernel.mIClientKernelSink=null;
        this.InitGameLayer();
       // this.schedule(this.InitGameLayer, 0.05);

        if (kernel.Init()) return true;

        gClientKernel.destory();
        return false;
    },

    //创建游戏
    InitGameLayer:function (){
        var kernel = gClientKernel.get();
        if(kernel.mIClientKernelSink) return

        this.ShowGamePrefab("GameClientEngine", GameDef.KIND_ID, this.m_gameNode, function(Js){
            this.m_GameEngine = Js;
            Js.SetTableScene(this);
            kernel.SetClientKernelSink(Js);
            if(Js.LoadSound) Js.LoadSound();
            this.m_ServerItem.ConnectServer(this.mGameServerItem, 0, 0);
        }.bind(this));
    },

    //用户更新
    OnGRUserUpdate :function(pIClientUserItem)
    {
    },

    LoadingOver:function(){
        if(this.m_ReLinkTime != null){
            this.OnGFServerReLink();
        }else{
            this.StopLoading();
        }
    },

    //房间退出
    OnGFServerClose :function(szMessage){
        this.ShowAlert("您掉线了!请检查网络设备连接状态!点击确定后将返回游戏大厅.",Alert_Yes,"OnAlertExitGame",this);
    },
    OnGFServerReLink :function(){
        if(this.m_ServerItem.mInterval != null || this.mShowReLink) return this.StopLoading();
        if(window.ReLinkTime == null) window.ReLinkTime  = 0;
        window.ReLinkTime++;
        this.StopLoading();
        if(window.ReLinkTime%7 >= 6){
            this.mShowReLink = true;
            this.ShowAlert('网络异常，是否尝试重连？',Alert_YesNo,function(Res){
                this.mShowReLink = false;
                if(Res){
                    this.ShowLoading();
                    this.m_ServerItem.CloseSocket();
                    this.m_ServerItem.ConnectServer(this.mGameServerItem, 0, 0);
                }else{
                    this.OnGFServerClose();
                }
            }.bind(this));
        }else{
            this.ShowLoading();
            this.m_ServerItem.CloseSocket();
            this.m_ServerItem.ConnectServer(this.mGameServerItem, 0, 0);
        }
    },
    ExitGame :function(){
        if(this.m_TableViewFrame){
            //退出游戏
            this.m_TableViewFrame.ExitGame();
        }else {
            gClientKernel.destory();
            ChangeScene('Lobby');
        }
    },

    ExitGameLogin :function() {
        //退出游戏
        this.m_TableViewFrame.ExitGame();
    },


    //网络心跳
    NetworkHeartbeat :function(dt) {
        if(this.m_ServerItem.mServiceStatus != ServiceStatus_ServiceIng) return
        if (this.m_ServerItem != null && this.m_ServerItem.mInterval == null){
            this.m_ServerItem.mHeartStatTime = new Date().getTime();           //服务器心跳时间
            this.m_ServerItem.SendSocketClass(MDM_KN_COMMAND, SUB_KN_CLIENT_HEART);
        }
    },
    UpdateGPS:function(para) {
        var GameClientEngine = this['m_JsGameClientEngine_'+GameDef.KIND_ID]
        if(GameClientEngine)GameClientEngine.UpdateGPS(para);
    },
    UpdateSet:function() {
        var GameClientEngine = this['m_JsGameClientEngine_'+GameDef.KIND_ID]
        if(GameClientEngine)GameClientEngine.m_GameClientView.UpdateSet();
    },
/////////////////////////////////////////////////////////////////////////////语音接口
    GetVoiceCtrl:function(para) {
        var GameClientEngine = this['m_JsGameClientEngine_'+GameDef.KIND_ID];
        if(GameClientEngine == null) return null;
        return GameClientEngine.GetVoiceCtrl();
    },
    //上传完成
    OnVoiceUpLoad:function(para) {
        var VoiceCtrl = this.GetVoiceCtrl();
        if(VoiceCtrl)VoiceCtrl.OnRecordOver(para);
    },
    OnVoiceLoad:function(para) {
        var VoiceCtrl = this.GetVoiceCtrl();
        if(VoiceCtrl)VoiceCtrl.OnLoadVoice(para);
    },
    //播放完成
    OnPlayFinish:function() {
        var VoiceCtrl = this.GetVoiceCtrl();
        if(VoiceCtrl)VoiceCtrl.OnPlayFinish();
    },
    onRecordFinish :function (str) {
        var VoiceCtrl = this.GetVoiceCtrl();
        if(VoiceCtrl)VoiceCtrl.onRecordFinish(str);
    },
    OnBtClick_Invite:function(){
        var GameClientEngine = this['m_JsGameClientEngine_'+GameDef.KIND_ID]
        if(GameClientEngine){
            this.ShowPrefabDLG('ClubInviteUserList',null,function(Js){
                Js.OnSetGameInfor(GameClientEngine);
            }.bind(this));
        }
    },
    OnSetInviteBtShow:function(pIClientUserItem){
        var GameClientEngine = this['m_JsGameClientEngine_'+GameDef.KIND_ID]
        if(GameClientEngine&&GameClientEngine.m_dwClubID!=0){
            this.$('BtInvite').active = pIClientUserItem.GetUserStatus()!= US_LOOKON;
        }
    },
/////////////////////////////////////////////////////////////////////////////
});
