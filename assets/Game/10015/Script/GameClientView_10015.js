//X 排列方式

cc.Class({
    extends: cc.GameView,

    properties: {
        //牌控件
        m_CardCtrlPrefab:cc.Prefab,
        m_UserTypePrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,
        m_UserBetPrefab:cc.Prefab,
        m_UserOperatePrefab:cc.Prefab,

        m_TableClockNode:cc.Node,
        m_LabClockNum:cc.Label,
        m_TableTipsNode:cc.Label,

        m_TableBankerNode:cc.Node,

        m_JettonNode:cc.Node,
        
        m_BankGuoScoreLabel:cc.Label,
        m_BankInfoLabel:cc.Label,
        m_BankerEndScore:cc.Label,
        
        m_FontArr:[cc.Font],
    },
    ctor :function () {
        this.m_UserCardControl = new Array();   //用户牌
        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_UserBet = new Array();          //用户信息
        this.m_UserOperate = new Array();          //用户信息
        this.m_UserCardType = new Array();          //用户信息
        this.m_pIClientUserItem = new Array();
        this.m_bCanAdd = false;
        this.m_CardArr = new Array();
        
        this.sliderJetMaxScore = 0;
        this.sliderJetMinScore = 0;

        this.strTipsWord = "";
        this.m_CardTestName = 'UserCheatCtrl';
    },
    // use this for initialization
    onLoad:function () {
        //绑定按钮点击事件
        this.InitView();
        this.BindButtonInit();
        //绑定节点
        this.m_BankerUI0 = this.$('BtUINode/BankerUI0');
        this.m_PlayerUI = this.$('BtUINode/PlayerBet');
        this.m_LookUI = this.$('BtUINode/LookUI');
        this.m_OpenUI = this.$('BtUINode/OpenUI');
        this.m_AskUI = this.$('BtUINode/AskUI');
        this.m_BtHint = this.$('BtUINode/OpenUI/BtHint');
        this.m_BtShowCard = this.$('BtUINode/LookUI/BtShowCard');
        this.m_NdCtrlStart= this.$('TableButton/Layout/BtCtrlStart');

        this.SetTableClock(null);
        this.m_RulesText = this.$('TopFrame/Layout/LabRules@Label');
        this.m_RulesText.string = '';
        this.m_subsumlun = this.$('TopFrame/PhoneInfo/LabProgress@Label');
        this.m_TableNumber = this.$('TopFrame/Layout/TableNumber@Label');
        this.m_ClubNum = this.$('TopFrame/Layout/ClubNumber@Label');

        this.m_ballAniImg = this.$('tiqiImg');

        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_tem');
        this.m_SendCardCtrl.SetHook(this);

        //筹码控件
        this.m_JetCtrl = this.m_JettonNode.getComponent('JetCtrl_tem');
        this.m_JetCtrl.SetHook(this);
        
        var tstPos = this.$('TableNode/jiangchiBggreen/gold').getPosition();
        var GuoCenterPos = this.$('TableNode/jiangchiBggreen').convertToWorldSpaceAR(tstPos);
        var jetCenterPos = this.m_JettonNode.convertToNodeSpaceAR(GuoCenterPos);
        this.m_JetCtrl.initGuoCenterPos(jetCenterPos);

        this.m_playerCnt = GameDef.GAME_PLAYER;
        //十人初始化。。。11,12为8人补充
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_tem');
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_tem');
            if (i != GameDef.MYSELF_VIEW_ID)
                this.m_UserInfo[i].node.addChild(this.m_UserCardControl[i].node);
            else
                this.m_CardNode.addChild(this.m_UserCardControl[i].node);

            //用户状态
            this.m_UserBet[i] = cc.instantiate(this.m_UserBetPrefab).getComponent('UserBet_tem');
            this.m_UserInfo[i].node.addChild(this.m_UserBet[i].node);
            this.m_UserBet[i].Init();

            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_tem');
            this.m_UserInfo[i].node.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();

            //用户状态
            this.m_UserOperate[i] = cc.instantiate(this.m_UserOperatePrefab).getComponent('UserOperate_tem');
            this.m_UserInfo[i].node.addChild(this.m_UserOperate[i].node);
            this.m_UserOperate[i].Init();

            //牌型
            this.m_UserCardType[i] = cc.instantiate(this.m_UserTypePrefab).getComponent('CardType_'+GameDef.KIND_ID);
            this.m_UserCardType[i].SetCardType();
            if (i != GameDef.MYSELF_VIEW_ID)
            {
                this.m_UserInfo[i].node.addChild(this.m_UserCardType[i].node);
                this.m_UserCardType[i].SetScale(0.7);
            }
            else
            {
                this.m_CardNode.addChild(this.m_UserCardType[i].node);
            }
        }

        this.OnInitSlider();
        
        //清理界面
        this.ClearView();

        //
        this.m_poswidthScale = new Array(
            0,0,1100,1600,1664,1664,1664,1600,1100,0,
            
            0,0,1400,1400,
            
            1100,1100,
        )
        
        //十人标准坐标。。。11,12为8人补充坐标
        this.m_UserPosArr = new Array(
            cc.v2(0, 290 + 170),
            cc.v2(-220, 280 + 170),
            cc.v2(-440, 243 + 170),
            cc.v2(-650, 165 + 170),
            cc.v2(-750, -110 + 170),
            cc.v2(-660, -270 + 170),
            cc.v2(750, -110 + 170),
            cc.v2(650, 165 + 170),
            cc.v2(440, 243 + 170),
            cc.v2(220, 280 + 170),
            
            //8人
            cc.v2(-282, 270 + 170),
            cc.v2(282, 270 + 170),
            cc.v2(-590, 210 + 170),
            cc.v2(590, 210 + 170),
            
            //6人
            cc.v2(-415, 250 + 170),
            cc.v2(415, 250 + 170),
        )
        
        this.m_CardWidgetArr = new Array(
            [0,0,0,-148],
            [-7,0,0,-148],
            [65,0,0,-148],
            [75,0,0,-138],
            [50,0,0,-55],
            [0,0,0,0],
            [0,50,0,-55],
            [0,75,0,-138],
            [0,65,0,-148],
            [0,-7,0,-148],
            
            //8人
            [1,0,0,-148],
            [0,1,0,-148],
            [60,0,0,-148],
            [0,60,0,-148],
            
            //6人
            [40,0,0,-148],
            [0,40,0,-148],
        )
        
        this.m_BetBgWidgetArr = new Array(
            [0,0,55,0],
            [35,0,55,0],
            [35,0,55,0],
            [0,0,55,0],
            [115,0,0,35],
            [160,0,0,65],
            [0,115,0,35],
            [0,0,55,0],
            [0,35,55,0],
            [0,35,55,0],
            
            //8人
            [45,0,55,0],
            [0,45,55,0],
            [75,0,55,0],
            [0,75,55,0],
            
            //6人
            [55,0,55,0],
            [0,55,55,0],
        )

        var _winSize = cc.winSize;
        for (var i = 0; i < this.m_poswidthScale.length; i++) {
            if (this.m_poswidthScale[i] != 0)
            {
                if (this.m_poswidthScale[i] > _winSize.width)
                {
                    var scalePos = _winSize.width/this.m_poswidthScale[i];

                    this.m_UserPosArr[i].x = this.m_UserPosArr[i].x * scalePos;

                    if (i != 0 && i != 5 && i != 4 && i != 6)
                        this.m_UserPosArr[i].y = this.m_UserPosArr[i].y * scalePos;

                    if (i == 3 && scalePos < 0.9)
                    {
                        this.m_CardWidgetArr[3] = [75,0,0,-92];
                        this.m_CardWidgetArr[7] = [0,75,0,-92];
                    }
                }
            }
        }
        
        if (930 > _winSize.width)
        {
            var scaleX = _winSize.width/930;

            this.m_BankerUI0.scaleX = scaleX;
            this.m_BankerUI0.scaleY = scaleX;
        }

        this.m_UserFaceArr = new Array();
        this.m_UserChatArr = new Array();
        this.m_UserVoiceArr = new Array();
        this.RectifyControl(10,window.SCENE_WIGHT ,window.SCENE_HEIGHT);
        this.ShowPrefabDLG('MacInfo',this.m_NdPhoneNode);

        this.m_TableBankerNode.active = false;
        this.m_TableBankerInitPos = this.m_TableBankerNode.getPosition();
    },

    HideAllGameButton :function(){
        this.m_BankerUI0.active = false;
        this.m_PlayerUI.active = false;
        this.m_LookUI.active = false;
        this.m_OpenUI.active = false;
        this.m_AskUI.active = false;
    },

    //清理界面
    ClearView:function(){
        this.HideAllGameButton();

        this.InitTableCard();
        
        this.m_BtStart.active = false;
        this.m_BtFriend.active = false;
        this.m_NdCtrlStart.active = false;

        this.SetTableTips('');
        this.SetUserState(INVALID_CHAIR);
        this.SetUserCallBankerTimes(INVALID_CHAIR);
        this.SetBankerUser(INVALID_CHAIR);
        this.SetShowAdd(INVALID_CHAIR);
        this.SetUserBet(INVALID_CHAIR);
        this.SetCardType(INVALID_CHAIR);
        this.ShowCuoPaiState(INVALID_CHAIR);
        this.SetUserEndScore(INVALID_CHAIR);
        this.SetBankerEndScore();
    },
    
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        //if(pUserItem.GetUserStatus() == US_READY) this.SetUserState(wChairID, 'Ready');
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);

        if(!this.m_GameClientEngine.m_ReplayMode && wChairID == GameDef.MYSELF_VIEW_ID){
            if(this.m_bNoCheat) this.$('TableButton/BtChat').active = false;
            if(this.m_ChatControl == null){
                this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                    if(this.m_bNoCheat) this.m_ChatControl.node.active = false;
                }.bind(this));
            }

            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.$('VocieNode'),function(Js){
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                    if( this.m_bNoVoice) this.m_VoiceCtrl.m_btVoice.active = false;
                }.bind(this));
            }

            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                    this.m_FaceExCtrl = Js;
                    if(this.m_bNoCheat) this.m_FaceExCtrl.node.active = false;
                }.bind(this));
            }
        }
    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        //this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave :function (pUserItem, wChairID) {
        this.m_UserInfo[wChairID].UserLeave(pUserItem);
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore :function (pUserItem, wChairID) {
    },

    //更新玩家金币
    OnUpdateUserScore :function (llUserScore) {
        for (var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            var nViewID = this.m_GameClientEngine.SwitchViewChairID(i);
            if (this.m_GameClientEngine.m_UserState[i] &&  this.m_UserInfo[nViewID])
                this.m_UserInfo[nViewID].SetUserScore(llUserScore[i],0);
        }
    },

    //初始化牌
    InitTableCard:function(){
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserCardControl[i].SetCardData(null, 0);
        }
        this.SetCardType(INVALID_CHAIR);
    },

    //调整控件
    RectifyControl:function (playerCnt,nWidth, nHeight){
        var ArrName = 'm_UserPosArr';

        this.m_playerCnt = playerCnt;

        var goldIconPosArr = new Array();
        var HeadPosArr = new Array();

        for (var i = 0; i < this.m_playerCnt; i++) {
            var posWidID = this.OnGetPositionID(i,this.m_playerCnt);
            var bSelf = (i==GameDef.MYSELF_VIEW_ID);
            this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[posWidID]);
            this.m_UserInfo[i].Init(this, i);
            
            var userHeadPos = this.m_UserNode.convertToWorldSpaceAR(cc.v2(this.m_UserPosArr[posWidID].x,this.m_UserPosArr[posWidID].y));
            this.m_UserFaceArr[i] = this.node.convertToNodeSpaceAR(cc.v2(userHeadPos.x,userHeadPos.y));
            this.m_UserChatArr[i] = this.node.convertToNodeSpaceAR(cc.v2(userHeadPos.x,userHeadPos.y + 5));
            this.m_UserVoiceArr[i] = this.node.convertToNodeSpaceAR(cc.v2(userHeadPos.x,userHeadPos.y + 5));

            this.m_UserCardControl[i].SetScale(bSelf?0.7:0.3);
            this.m_UserCardControl[i].SetCardDistance(-110);
            this.m_UserCardControl[i].SetBenchmarkPos(0,-170, this.m_CardWidgetArr[posWidID],enXCenter);
            
            this.m_UserOperate[i].SetBenchmarkPos(0,0,this.m_BetBgWidgetArr[posWidID]);

            this.m_UserState[i].SetBenchmarkPos(0,0,this.m_BetBgWidgetArr[posWidID]);

            this.m_UserBet[i].SetBenchmarkPos(0,0,this.m_BetBgWidgetArr[posWidID]);

            goldIconPosArr[i] = this.m_JettonNode.convertToNodeSpaceAR(this.m_UserBet[i].GetIconGoldPos());

            if (i == GameDef.MYSELF_VIEW_ID)
            {
                this.m_UserCardControl[i].SetBenchmarkPos(0,-170, this.m_CardWidgetArr[posWidID],enXCenter);
                this.m_UserCardType[i].SetBenchmarkPos(0,-140,this.m_CardWidgetArr[posWidID]);
            }
            else
            {
                this.m_UserCardControl[i].SetBenchmarkPos(0,0, this.m_CardWidgetArr[posWidID],enXCenter);
                this.m_UserCardType[i].SetBenchmarkPos(0,0,this.m_CardWidgetArr[posWidID]);
            }

            HeadPosArr[i] = this.m_JettonNode.convertToNodeSpaceAR(userHeadPos);
        }
        this.m_JetCtrl.init(HeadPosArr,null,goldIconPosArr);

        //this.m_UserCardType[GameDef.MYSELF_VIEW_ID].SetBenchmarkPos(0, -312, enXCenter);//card +83 +20
        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0,0), this.m_UserCardControl);
    },

    OnGetPositionID:function(viewID,playerCnt){
        var viewIDArr = new Array();
         switch (playerCnt) {
            case 6:
                viewIDArr[0] = 6;
                viewIDArr[1] = 15;
                viewIDArr[2] = 0;
                viewIDArr[3] = 14;
                viewIDArr[4] = 4;
                viewIDArr[5] = 5;
                return viewIDArr[viewID];
                break;
            case 8:
                viewIDArr[0] = 11;
                viewIDArr[1] = 0;
                viewIDArr[2] = 10;
                viewIDArr[3] = 12;
                viewIDArr[4] = 4;
                viewIDArr[5] = 5;
                viewIDArr[6] = 6;
                viewIDArr[7] = 13;
                return viewIDArr[viewID];
                break;
            default:
                return viewID;
                break;
        }
    },

 //////////////////////////////////////////////////////////////////////////////
    //开始按钮
    OnClick_BtCtrlStart:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCtrlStart();
    },

    //抢庄按钮
    OnClick_CallBanker:function (Tag, Data){
        if (Data == 5) Data = 1;
        this.m_GameClientEngine.OnMessageCallBanker(Data);
    },

    //下注按钮
    OnClick_CallPlayer:function (Tag, Data){
        var AddScore = parseInt(this.$('Label@Label',Tag.currentTarget).string * window.PLATFORM_RATIO);
        this.m_GameClientEngine.OnMessageCallPlayer(AddScore,0);//Data
    },

    //射门按钮
    OnClick_BtShoot:function (){
        this.m_GameClientEngine.OnMessageCallPlayer(0,1);//Data
    },
    
    //下注按钮
    OnClick_SliderResultBtn:function (Tag, Data){
        var AddScore = parseInt(this.$('Label@Label',Tag.currentTarget).string * window.PLATFORM_RATIO);
        this.m_GameClientEngine.OnMessageCallPlayer(AddScore,0);//Data
    },

    //翻牌按钮
    OnClick_BtLookCard:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageLookCard();
    },
    //搓牌按钮
    OnClick_BtShowCard:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCtrlCuoPai();
    },

    //提示按钮
    OnClick_BtHint:function (){
        this.m_GameClientEngine.OnMessageHint();
    },
    
    //亮牌按钮
    OnClick_BtOpenCard:function (){
        this.m_GameClientEngine.OnMessageOpenCard();
    },

    OnBnClickedShowCard:function (){
        this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardData(this.m_CardArr, GameDef.MAX_COUNT);
    },
    
    OnClick_BtTrustee:function (Tag){
        
    },

    OnClick_BtHideSetView:function (Tag){
        Tag.currentTarget.parent.active = false;
    },

    OnClick_BtInfo:function (Tag){
        this.ShowGamePrefab("GameInfo",GameDef.KIND_ID, this.node, function(Js){
            Js.SetGameData(this.m_GameClientEngine.m_dwRulesArr , this.m_GameClientEngine.m_dwServerRules);
        }.bind(this));
    },
    OnClick_BtChangeBack:function (Tag){
        cc.gSoundRes.PlaySound('Button');
        // this.ShowPrefabDLG('GameSetting', this.node, function(Js) {
        //     this.m_GameSetting = Js;
        //     this.m_GameSetting.SetGame(GameDef);
        //     this.m_GameSetting.SwitchPage(1);
        // }.bind(this));
    },
    
    //续庄按钮
    OnClick_BtContinue:function (){
        this.m_AskUI.active = false;
        this.m_GameClientEngine.OnMessageBankerOperate(0);
    },
    //升庄按钮
    OnClick_BtLevelUp:function (){
        this.m_AskUI.active = false;
        this.m_GameClientEngine.OnMessageBankerOperate(1);
    },
    //上庄按钮
    OnClick_BtApply:function (){
        this.m_AskUI.active = false;
        this.m_GameClientEngine.OnMessageBankerOperate(3);
    },
    //下庄按钮
    OnClick_BtCancle:function (){
        this.m_AskUI.active = false;
        this.m_GameClientEngine.OnMessageBankerOperate(2);
    },

 //////////////////////////////////////////////////////////////////////////////
    //设置时间
    SetUserTimer:function (wChairID, wTimer, Progress){
        this.SetTableClock(wTimer);
    },

    //设置桌面倒计时
    SetTableClock:function (CountDown){
        if(CountDown == null){
            this.m_TableClockNode.active = false;
        }else{
            this.m_TableClockNode.active = true;
            //this.m_LabClockNum.string = CountDown;
            this.m_TableTipsNode.string = this.strTipsWord + CountDown + "";
        }
    },

    //设置规则
    SetViewRoomInfo:function (dwServerRules, dwRulesArr){
        this.UpdateClubID();
        //更换桌布
        var playerCnt = GameDef.GetPlayerCount(dwServerRules,dwRulesArr);
        cc.gPreLoader.LoadRes('Image_TableBg_' + playerCnt + 'ren', 'GameNNPublic_2', function(sf, Param){
            this.node.getChildByName('cntBg').getComponent(cc.Sprite).spriteFrame = sf;
        }.bind(this), {Index: playerCnt});

        this.RectifyControl(playerCnt);

        this.m_LbTableID.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
        this.m_LbGameRules.string = GameDef.GetRulesStr(dwServerRules, dwRulesArr);

        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtGPS)  this.m_BtGPS.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        if (this.$('TableButton/BtInfo')) this.$('TableButton/BtInfo').active = !bShow;
        //if (this.m_BtFriend) this.m_BtFriend.active = !bShow;

        this.m_bNoCheat = (this.m_GameClientEngine.m_dwRulesArr[1] & GameDef.GAME_TYPE_OTHER4)>0;
        this.m_bNoVoice = (this.m_GameClientEngine.m_dwRulesArr[1] & GameDef.GAME_TYPE_OTHER8)>0;

        if(this.m_bNoCheat) this.m_BtChat.active = false;
        if(this.m_ChatControl &&  this.m_bNoCheat) this.m_ChatControl.node.active = false;
        if(this.m_VoiceCtrl && this.m_bNoVoice) this.m_VoiceCtrl.m_btVoice.active = false;
        if(this.m_FaceExCtrl && this.m_bNoCheat) this.m_FaceExCtrl.node.active = false;

    },

    UpdateRoomProgress:function (){
        //this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
    },
    
    UpdateBankerProgress:function (wBankedCnt){
        this.m_LbGameProgress.string = '轮数：' + wBankedCnt + '/' + GameDef.GetPlayerCount(this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
    },

    UpdateSet:function () {
        for(var i=0;i<this.m_playerCnt;i++){
            if( this.m_pIClientUserItem[i] == null) continue
            this.m_UserCardControl[i].DrawCard();
        }
    },

    //设置庄家分数
    SetBankerScore:function ( Score ) {
        this.m_BankGuoScoreLabel.string = Score2Str(Score);
    },

    //设置庄家信息
    SetBankerTableInfo:function(level,cnt){
        this.m_BankInfoLabel.string = "第"+level+"庄，第"+cnt+"局";
    },

    /**
     * 设置准备状态
     * @param ViewID
     * @param State
     */
    SetUserState:function(ViewID, State){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[ViewID].ShowUserState(State);
        }
    },

    /**
     * 显示桌面提示
     * @param str
     */
    SetTableTips:function (str){
        if(str == null){
            //this.m_TableTipsNode.string = '';
            this.strTipsWord = '';
        }else{
            //this.m_TableTipsNode.string = str;
            this.strTipsWord = str;
        }
    },

    /**
     * 显示抢庄按钮
     * @param bShow 是否显示
     * @param cbMaxCallTimes 最大抢庄倍数
     */
    setCallBankerBtn:function(bShow,cbMaxCallTimes){
        if (bShow == null || bShow == undefined)bShow = false;

        this.m_BankerUI0.active = bShow;

        if (!bShow)
            return;

        for(var i=1;i<=5;i++){
            this.$('BtUINode/BankerUI0/CallBanker#'+i).active = i<=cbMaxCallTimes;
        }

        if (cbMaxCallTimes == 1)
        {
            this.$('BtUINode/BankerUI0/CallBanker#1').active = false;
            this.$('BtUINode/BankerUI0/CallBanker#5').active = true;
        }
    },
    
    /**
     * 显示抢庄结果
     * @param ViewID
     * @param Times 抢庄倍数
     * @param isAni 是否播放动画
     */
    SetUserCallBankerTimes:function(ViewID, Times,isAni){
        if (ViewID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserOperate[i].HideState();
            }
        }
        else{
            if (Times == 0xFF)
                this.m_UserOperate[ViewID].HideState();
            else
                this.m_UserOperate[ViewID].ShowUserState(Times,isAni);
        }
    },
    
    /**
     * 启动随机庄动画
     * @param UserArr 随机玩家的数组集合
     * @param Banker 庄家用户
     * @param isAni 是否播放动画
     */
    StartRandomBankerAni:function(UserArr, Banker, isAni){
        if(UserArr.length <= 1 || !isAni) {
            return;
        }
        this.m_AniIndex = 0;
        this.m_AniUserIndex = 0;
        this.m_AniTime = 0;
        this.m_AniUserArr = UserArr;
        this.m_AniTempTime = 0;
        this.m_AniBanker = Banker;
    },

    update:function (dt) {
        if(this.m_AniUserArr != null){
            this.m_AniTempTime += dt;

            if(this.m_AniTempTime > this.m_AniTime){
                this.m_AniTime += 0.03;

                for(var i=0;i<this.m_playerCnt;i++){
                    var nViewID = this.m_GameClientEngine.SwitchViewChairID(i);
                    this.m_UserInfo[nViewID].SetBankerRim(i == this.m_AniUserArr[this.m_AniUserIndex])
                }

                if(this.m_AniUserArr[this.m_AniUserIndex] == this.m_AniBanker){
                    this.m_AniUserArr = null;
                }else{
                    cc.gSoundRes.PlayGameSound("BANKER");
                    this.m_AniUserIndex++;
                    if(this.m_AniUserIndex >= this.m_AniUserArr.length){
                        this.m_AniUserIndex = 0;
                        this.m_AniIndex++;
                    }
                }
            }
        }
    },
    /**
     * 设置庄家标记
     * @param wBankerUser 庄家
     * @param isAni 是否播放动画
     */
    SetBankerUser: function (wBankerUser, isAni) {
        for (var i = 0; i < this.m_playerCnt; i++) {
            this.m_UserInfo[i].SetUserBankerSign();
            this.m_UserInfo[i].SetBankerRim(false);
        }
        this.m_TableBankerNode.active = false;
        
        if (wBankerUser != INVALID_CHAIR) {
            if (isAni) {
                var endPos = this.node.convertToNodeSpaceAR(this.m_UserInfo[wBankerUser].GetIconBankerPos());
                var act = cc.moveTo(0.5, endPos);
                this.m_TableBankerNode.setPosition(this.m_TableBankerInitPos);
                this.m_TableBankerNode.active = true;
                this.m_TableBankerNode.runAction(cc.sequence(act, cc.callFunc(this.BankerEndCallFunc.bind(this), this, wBankerUser)));
            }
            else {
                this.m_TableBankerNode.active = false;
                this.m_UserInfo[wBankerUser].SetUserBankerSign(true);
                this.m_UserInfo[wBankerUser].SetBankerRim(true);
            }
        }
        return;
    },

    /**
     * 飞庄回调
     */
    BankerEndCallFunc:function (node, para){
        this.m_UserInfo[para].SetBankerSignAni(true);
        this.m_UserInfo[para].SetBankerRim(true);
    },
    
    /**
     * 设置推注标记
     * @param ViewID
     * @param bShow 是否显示
     * 暂定，待完善
     */
    SetShowAdd:function(ViewID, bShow){
        if (bShow == null || bShow == undefined)bShow = false;
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserInfo[i].SetShowAdd(false);
            }
        }else{
            this.m_UserInfo[ViewID].SetShowAdd(bShow);
        }
    },

    SetUserEndScore:function(wChairID, Score){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserInfo[i].SetEndScore('');
            }
            return
        }

        if (Score != 0)
            this.m_UserInfo[wChairID].SetEndScore(Score);
        else
            this.m_UserInfo[wChairID].SetEndScore('');
    },

    SetBankerEndScore:function(Score){
        if (Score == null || Score == undefined)Score = 0;
        if (Score != 0)
        {
            if (Score != '') {
                var str = TransitionScore(Score) + '';
    
                if (Score2Str(Score) <= 0) {
                    if (Score = 0)
                    this.m_BankerEndScore.font = this.m_FontArr[1];
                } else {
                    if (Score > 0) str = '+' + str;
                    this.m_BankerEndScore.font = this.m_FontArr[0];
                }
                this.m_BankerEndScore.string = str;  
            }
            else{
                this.m_BankerEndScore.string = Score;  
            }
        }
        else
            this.m_BankerEndScore.string = '';
    },
    /**
     * 结算飞金币
     * 
     * 暂定，待完善
     */
    SetEndScoreAnim:function(bankerID,WinArr){

        for (var i = GameDef.GAME_PLAYER - 1; i >= 0; i--)
        {
            if (WinArr[i] == bankerID)break;
            if (WinArr[i] == INVALID_CHAIR)continue;

            var nViewID = this.m_GameClientEngine.SwitchViewChairID(WinArr[i]);
            this.m_JetCtrl.OnGuoEndJetFly(nViewID,0,false);
        }
        for (var i = 0; i < GameDef.GAME_PLAYER; i++)
        {
            if (WinArr[i] == bankerID)break;
            if (WinArr[i] == INVALID_CHAIR)continue;

            var nViewID = this.m_GameClientEngine.SwitchViewChairID(WinArr[i]);
            this.m_JetCtrl.OnGuoEndJetFly(nViewID,1,true);
        }
    },

    /**
     * 设置下注信息，显示下注按钮
     * @param bShow 是否显示
     */
    SetPlayerJetShow:function(bShow){
        if (bShow == null || bShow == undefined)bShow = false;
        this.m_PlayerUI.active = bShow;
    },

    /**
     * 设置下注数值
     * @param {*} jetScore 
     */
    SetPlayerUIBtnInfo:function(jetScore,llMinBetScore,llMaxBetScore){
        var StrButton = 'BtUINode/PlayerBet/PlayerUI/CallPlayer'
        for (var i=0;i<GameDef.MAX_BET_CNT;i++)
        {
            this.$(StrButton+'#' + i +'/Label@Label').string = Score2Str(jetScore[i]);
            this.$(StrButton+'#' + i ).active = jetScore[i] != 0;
        }
        this.sliderJetMaxScore = llMaxBetScore;
        this.sliderJetMinScore = llMinBetScore;
        this.OnInitSlider();
    },

    /**
     * 设置玩家下注
     * @param ViewID
     * @param Score 下注金额
     * @param lTimes 下注倍数
     * @param isAni 是否播放飞金币动画
     */
    SetUserBet:function(ViewID, Score,isAni){
        if (isAni == null || isAni == undefined)isAni = false;
        if (ViewID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserBet[i].HideState();
            }
        }
        else{
            if (isAni)
                this.m_JetCtrl.OnUserAdd(ViewID);
            
            this.m_UserBet[ViewID].SetBetScore(Score2Str(Score));
        }
    },

    /**
     * 设置玩家搓牌按钮
     * @param bShow 是否显示
     * @param bIsCanCuoPai 是否允许搓牌
     */
    ShowLookUI :function(bShow,bIsCanCuoPai){
        if (bShow == null || bShow == undefined)bShow = false;
        if (bIsCanCuoPai == null || bIsCanCuoPai == undefined)bIsCanCuoPai = true;

        this.m_LookUI.active = bShow;
        this.m_BtShowCard.active = bIsCanCuoPai;
    },

    /**
     * 设置玩家亮牌按钮
     * @param bShow 是否显示
     * @param bIsHint 已经提示
     */
    ShowOpenUI :function(bShow,bIsHint){
        if (bShow == null || bShow == undefined)bShow = false;
        if (bIsHint == null || bIsHint == undefined)bIsHint = true;

        this.m_OpenUI.active = bShow;
        this.m_BtHint.active = bIsHint;
    },

    /**
     * 设置玩家上下庄按钮
     * @param bShow 是否显示
     * @param bIsHint 已经提示
     */
     ShowAskUI :function(bShow,cbMode){
        if (bShow == null || bShow == undefined)bShow = false;
        if (cbMode == null || cbMode == undefined)cbMode = 0;

        this.m_AskUI.active = bShow;

        var StrButton = 'BtUINode/AskUI'
        this.$(StrButton + '/BtContinue').active = cbMode == 0;
        this.$(StrButton + '/BtLevelUp').active = cbMode == 1;
        this.$(StrButton + '/BtApply').active = cbMode == 2;
    },

    /**
     * 设置牌型
     * @param ViewID
     * @param Type 牌型
     * @param times 倍数
     */
    SetCardType:function(ViewID, Type, times){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<this.m_playerCnt;i++){
                this.m_UserCardType[i].SetCardType();
            }
            return;
        }

        if (Type == 0xFF)
        {
            this.m_UserCardType[ViewID].SetCardType();
            return;
        }

        if (Type == GameDef.OX_VALUE_FINISH)
        {
            //显示完成字样
            this.m_UserCardType[ViewID].SetCompleteSign(true,true);
        }
        else
            this.m_UserCardType[ViewID].SetCardType(Type,times)
    },
    
    //
    /**
     * 搓牌状态动画
     * @param ViewID
     * @param isShow
     */
    ShowCuoPaiState:function(nViewID,isShow){
        if (isShow == null || isShow == undefined) isShow = false;
        if (nViewID == null || nViewID == undefined || nViewID == INVALID_CHAIR)
        {
            for (var i=0;i<this.m_playerCnt;i++)
                this.m_UserInfo[i].SetCuoPaiAni(false);

            return;
        }
        this.m_UserInfo[nViewID].SetCuoPaiAni(isShow);
    },

    //
    /**
     * 射门动画
     * @param ViewID
     */
     ShowShootAni:function(nViewID){
        if (nViewID == null || nViewID == undefined || nViewID == INVALID_CHAIR)
        {
            return;
        }
        
        this.m_ballAniImg.stopAllActions();
        this.m_ballAniImg.active = false;

        this.m_ballAniImg.setPosition(this.m_UserFaceArr[nViewID]);
        this.m_ballAniImg.active = true;

        var endPos = cc.v2(0,-23);

        var rotation = getVectorRadians(endPos.x,endPos.y,this.m_UserFaceArr[nViewID].x,this.m_UserFaceArr[nViewID].y);
        this.m_ballAniImg.rotation = rotation;

        var act = cc.moveTo(0.2, endPos);
        this.m_ballAniImg.runAction(cc.sequence(act,cc.delayTime(0.1),cc.callFunc(function(){
            this.m_ballAniImg.active = false;
        },this)));
    },
    
    /**
     * 下注滑动回调
     */
     OnJetSlider_Move: function (Tag) {
        var a = Tag.progress;
        this.OnSetSliderJetString(Tag.progress);
    },

    OnSetSliderJetString(progress){
        var selectJetScore = (this.sliderJetMaxScore - this.sliderJetMinScore) * progress + this.sliderJetMinScore;
        //比例转换保证不出小数
        selectJetScore = parseInt(TransitionScore(selectJetScore));
        selectJetScore = Number(selectJetScore) * window.PLATFORM_RATIO;
        
        this.$('BtUINode/PlayerBet/PlayerSliderUI/SliderResultBtn/Label@Label').string = Score2Str(selectJetScore); 
        this.$('BtUINode/PlayerBet/PlayerSliderUI/sliderBg/Slider/Handle/xiazhuBg/Label@Label').string = Score2Str(selectJetScore);

        this.sliderScore = selectJetScore;
    },

    OnInitSlider:function(){
        this.$('BtUINode/PlayerBet/PlayerSliderUI/sliderBg/Slider@CustomSlider').SetProgress(0);
        this.OnSetSliderJetString(0);
    },
});
