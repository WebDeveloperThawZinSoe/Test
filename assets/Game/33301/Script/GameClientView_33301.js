cc.Class({
    extends: cc.GameView,

    properties: {
        //牌控件
        m_CardCtrlPrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,
        m_lCellScore:cc.Label,
        m_lTimes:cc.Label,
        m_btOutCard:cc.Button,
        m_btPrompt:cc.Button,
        m_btPass:cc.Button,
        m_btReChange:cc.Button,
        m_FntEndScore:[cc.Font],
        m_BtChat:cc.Node,
        m_BtMenu:cc.Node,
        //m_BtGPS:cc.Node,

        m_RulesText:cc.Label,
        m_TableNumber:cc.Label,
        m_subsumlun:cc.Label,
        m_ClubNum:cc.Label,

        //m_UserPrefab: cc.Prefab,
        m_Trusteeship:cc.Node,
        m_btTrusteeship:cc.Button,
        //m_BtGpsNode:cc.Node,
        m_AniCtrlPrefab:cc.Prefab,
        m_AniBombNode: cc.Node,
    },
    ctor :function () {
        this.m_BackCardControl = null;          //底牌扑克
        this.m_HandCardCtrl = null;             //手牌组件
        this.m_UserCardControl = new Array();   //用户出牌

        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_LabEndScore = new Array();

        this.m_pIClientUserItem = new Array();
        this.m_cbScoreKind = 0;

        this.m_AniCtrl = null;             //donghua 
        this.m_CardTestName = 'UserCheatCtrl';
    },
    // use this for initialization
    onLoad:function () {
        this.InitView();
        //控制按钮
        this.HideAllGameButton();
        this.m_UserNode = this.node.getChildByName('UserNode');
        this.m_CardNode = this.node.getChildByName('CardNode');
        this.m_GameClientEngine = this.node.parent.getComponent('GameClientEngine_' + GameDef.KIND_ID);
        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl');
        this.m_SendCardCtrl.SetHook(this);

        //用户手牌
        this.m_HandCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_33301');
        this.m_CardNode.addChild( this.m_HandCardCtrl.node );
        this.m_HandCardCtrl.SetGameEngine(this.m_GameClientEngine);//设置消息回调

        // this.m_AniCtrl = cc.instantiate(this.m_AniCtrlPrefab).getComponent('AniCtrl');
        // this.m_AniNode.addChild(this.m_AniCtrl.node);
    
        //底牌
        this.m_BackCardControl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_33301');
        this.m_CardNode.addChild(this.m_BackCardControl.node);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户出牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_33301');
            this.m_CardNode.addChild(this.m_UserCardControl[i].node);
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_33301');
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_33301');
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
            //结算分数
            this.m_LabEndScore[i] = this.m_UserNode.getChildByName('EndScore'+i).getComponent(cc.Label);
        }

        this.m_UserPosArr = new Array(
            cc.v2(540, 75),
            cc.v2(-536, 0),
            cc.v2(-536, 170)

        )
        this.m_UserFaceArr = new Array(
            cc.v2(540, 55),
            cc.v2(-536, -20),
            cc.v2(-536, 150)
        );
        this.m_UserChatArr = new Array(
            cc.v2(466, -27),
            cc.v2(-461, -105),
            cc.v2(-461, 76)
        );
        this.m_UserVoiceArr = new Array(
            cc.v2(468, 121),
            cc.v2(-460, 48),
            cc.v2(-460, 205)
        );
      //GPS
      //this.m_TableGPSCtrl = this.m_BtGpsNode.getComponent('TableUserGPS_' + GameDef.KIND_ID);
      //this.m_TableGPSCtrl.SetHook(this);
      this.m_AniBomb = this.m_AniBombNode.getComponent('AniPrefab');
      this.m_AniBomb.Init(this);
        this.RectifyControl(SCENE_WIGHT ,SCENE_HEIGHT);
        this.ShowPrefabDLG('MacInfo',this.m_NdPhoneNode);
    },

    HideAllGameButton :function(){
        this.m_btOutCard.node.active = false;
        this.m_btPrompt.node.active = false;
        this.m_btPass.node.active = false;
        this.m_btReChange.node.active = false;
        
    },

    ShowCardUI :function(){
         //启用按钮
         this.m_btOutCard.interactable = this.m_GameClientEngine.VerdictOutCard();
         this.m_btPass.interactable =(this.m_GameClientEngine.m_cbTurnCardCount > 0); 
         //显示按钮
         this.m_btOutCard.node.active = true;
         this.m_btPass.node.active = true;
         this.m_btPrompt.node.active = true;
         this.m_btReChange.node.active = true;

            //如果上家出K，自己手中有A或2或炸弹，则必须出牌；可随意出A或2或炸弹，但不能不出。但手中有3个A可以选择不出
            //如果上家出A，自己手中有2则必须出2，也可以出炸弹，但是不可以不要如果手中没有2，则可以不要
            //如果上家出2，自己手中有炸弹，则必出炸弹，不可以不要
            var ANumber = 0;
            var TwoNumber = 0;
            var wMeChairId = this.m_GameClientEngine.GetMeChairID();
            var cbHandCardCount = this.m_GameClientEngine.m_cbHandCardCount[wMeChairId];
             for(var i = 0; i < cbHandCardCount; i++)
             {
                 if (this.m_GameClientEngine.m_cbHandCardData[i] == 1
                     || this.m_GameClientEngine.m_cbHandCardData[i] == 33
                     || this.m_GameClientEngine.m_cbHandCardData[i] ==49) {
                    ANumber++;
                 }
                 if (this.m_GameClientEngine.m_cbHandCardData[i] == 34) {
                        TwoNumber++;
                }
                 
             }  
            //对方出单K
            if (this.m_GameClientEngine.m_cbTurnCardCount == 1 
                && (this.m_GameClientEngine.m_cbTurnCardData[0] == 13 
                || this.m_GameClientEngine.m_cbTurnCardData[0] == 29
                ||this.m_GameClientEngine.m_cbTurnCardData[0] == 45
                ||this.m_GameClientEngine.m_cbTurnCardData[0] == 61)
                &&this.m_GameClientEngine.m_dwRules[0] & GameDef.GAME_TYPE_DKBCDA)
                {
                    if (ANumber != 3 && ANumber > 0 && this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 0)this.m_btPass.interactable = false;                    
                } 
            //对方出双K
            if (this.m_GameClientEngine.m_cbTurnCardCount == 2
                && (this.m_GameClientEngine.m_cbTurnCardData[0] == 13 
                || this.m_GameClientEngine.m_cbTurnCardData[0] == 29
                ||this.m_GameClientEngine.m_cbTurnCardData[0] == 45
                ||this.m_GameClientEngine.m_cbTurnCardData[0] == 61)
                &&this.m_GameClientEngine.m_dwRules[0] & GameDef.GAME_TYPE_DKBXCDA)
                {
                    if (ANumber != 3 && ANumber >1 && this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 0)this.m_btPass.interactable = false;                             
                }
            //对方出单A
            if (this.m_GameClientEngine.m_cbTurnCardCount == 1)
                if (this.m_GameClientEngine.m_cbTurnCardData[0] == 1 
                    || this.m_GameClientEngine.m_cbTurnCardData[0] == 49
                    ||this.m_GameClientEngine.m_cbTurnCardData[0] == 33)
                    {
                        if (this.m_GameClientEngine.m_dwRules[0] & GameDef.GAME_TYPE_AKBC2) {
                            if (TwoNumber >0 && this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 1)this.m_btPass.interactable = false;  
                        } else {
                            if (TwoNumber >0 && this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 0)this.m_btPass.interactable = false;   
                        }
                           
                    }
            //对方出单2   
            if (this.m_GameClientEngine.m_cbTurnCardCount > 0  && this.m_GameClientEngine.m_cbTurnCardData[0] == 34 ) 
            {
                if (this.m_GameClientEngine.m_dwRules[0] & GameDef.GAME_TYPE_K2KZD) {
                    if (this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 0) {
                        this.m_btPass.interactable = false; 
                    }
                }        
            } 
            var cbTurnCardType = this.m_GameClientEngine.m_GameLogic.GetCardType(this.m_GameClientEngine.m_cbTurnCardData, this.m_GameClientEngine.m_cbTurnCardCount,this.m_GameClientEngine.m_dwRules);
            if (cbTurnCardType == GameDef.CT_BOMB_CARD && this.m_GameClientEngine.m_cbTurnCardCount > 0 && this.m_GameClientEngine.m_SearchCardResult.cbSearchCount > 0)this.m_btPass.interactable = false; 
          
      
    },
    SetUserEndScore:function(wChairID, Score){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_LabEndScore[i].string = '';
            }
            return
        }
        if(Score == null) {
            Score = '';
        }else{
            this.m_LabEndScore[wChairID].Font = this.m_FntEndScore[Score > 0 ? 0 : 1];
            if(Score > 0) Score = '+'+Score;
        }
        this.m_LabEndScore[wChairID].string = Score2Str(Score);
   },
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        if(pUserItem.GetUserStatus() == US_READY) this.SetUserState(wChairID, 'Ready');
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);

         if(wChairID == GameDef.MYSELF_VIEW_ID){
            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.node,function(Js){
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                    //var NdButton = this.m_VoiceCtrl.node.getChildByName('btVoice');
                    var NdButton = this.m_VoiceCtrl.m_btVoice;
                    NdButton.setPosition(NdButton.getPosition().x, NdButton.getPosition().y-85);
                    this.m_VoiceCtrl.node.zIndex = -10;
                }.bind(this));
            }

            if(this.m_ChatControl == null){
                this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                    this.m_ChatControl.node.zIndex = 1;
                }.bind(this));
            }

            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                    this.m_FaceExCtrl = Js;
                }.bind(this));
            }
         }
    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        if(pUserItem.GetUserStatus() == US_READY) {
            this.SetUserState(wChairID, 'Ready');
            this.m_GameClientEngine.PlayActionSound(pUserItem.GetChairID(), "READY");
            if(wChairID == GameDef.MYSELF_VIEW_ID)this.m_GameClientEngine.OnMessageStart(null,true);
        }else{
            this.m_UserState[wChairID].HideState();
        }
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave :function (pUserItem, wChairID) {
        var ViewID = this.m_GameClientEngine.SwitchViewChairID(wChairID);
        for(var i in this.m_UserInfo){
            this.m_UserInfo[i].UserLeave(pUserItem);
        }
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem);
    },

    //初始化牌
    InitTableCard:function(){
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserCardControl[i].SetCardData(null, 0);
        }
        this.m_HandCardCtrl.SetCardData(null, 0);
        this.m_BackCardControl.SetCardData(null, 0);
    },

    //调整控件
    RectifyControl:function (nWidth, nHeight){
        //this.m_cardNode 坐标系
        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0,nHeight/2+100), [cc.v2(455, 55),cc.v2(-40, -270),cc.v2(-455, 150)]);

        //用户扑克
        this.m_HandCardCtrl.SetBenchmarkPos(-50,-360,enXCenter);
        this.m_HandCardCtrl.SetScale(1.04);
        this.m_HandCardCtrl.SetCardDistance(64);

        //底牌位置
        this.m_BackCardControl.SetCardDistance(CARD_WIGTH + 50);
	    this.m_BackCardControl.SetBenchmarkPos(0,276,enXCenter);
        this.m_BackCardControl.SetScale(0.35);

        //出牌位置
        var CardScale = 0.42;
        this.m_UserCardControl[2].SetBenchmarkPos(-311, 135, enXLeft);
        this.m_UserCardControl[1].SetBenchmarkPos(-300, -100,enXLeft);
        this.m_UserCardControl[0].SetBenchmarkPos(311, 25,enXRight);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[i]);
            this.m_UserCardControl[i].SetScale(CardScale);
        }

        this.m_UserState[2].SetBenchmarkPos(-480, 150, enXLeft);
        this.m_UserState[1].SetBenchmarkPos(-480, -20, enXLeft);
        this.m_UserState[0].SetBenchmarkPos(480, 55, enXRight);
    },

    //托管
    OnBnClickedTrustee:function () {
        cc.gSoundRes.PlaySound('Button');
        var trustee_show=cc.moveTo(0.1,cc.p(SCENE_WIGHT/2,117));
        this.m_CancelTrustee.runAction(trustee_show);
        this.m_GameClientEngine.OnMessageTrusteeControl();
    },

    //操作按钮回调
    OnBnClickedPrompt :function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutPrompt(0,0);
    },

    
    OnBnClickedOutCard:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutCard(1,0,1);
    },

    OnBnClickedPass:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessagePassCard(0,0,1);
    },
    OnBnClickedReChange:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_btOutCard.interactable = false;
        //设置扑克
        this.m_HandCardCtrl.SetShootCard(null, 0);
    },

    //设置底分
    SetCellScore:function ( lCellScore ) {
        this.m_lCellScore.string = lCellScore;
    },
    //倍数
    SetTimes:function (lTimes,bShow) {
        this.m_lTimes.string = lTimes;
    },

    //设置庄家
    SetBankerUser:function ( wBankerUser) {
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].SetBanker(i == wBankerUser);
        }
        this.m_HandCardCtrl.SetBanker(wBankerUser == GameDef.MYSELF_VIEW_ID);
        return;
    },
    //设置状态
    UpdateUserCardCount:function(ViewID, Cnt){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideCnt();
            }
        }else{
            this.m_UserState[ViewID].ShowCnt(Cnt);
        }
    },
    //设置时间
    SetUserTimer:function (wChairID, wTimer){
        for(var i=0;i<GameDef.GAME_PLAYER;i++) {
            this.m_UserState[i].ShowClock(i==wChairID);
        }
        if(wChairID == INVALID_CHAIR) return
        this.m_UserState[wChairID].SetClockNum(wTimer);
    },
    SetUserState:function(ViewID, State, Cnt){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[ViewID].ShowUserState(State, Cnt);
        }
    },

    //显示底牌
    ShowBankerCard:function (cbCardData){
        //var count = GameDef.BACK_COUNT;
        //if(cbCardData == null) count = 0;
        //this.m_BackCardControl.SetCardData(cbCardData, count);
    },

    //设置警告
    SetUserCountWarn:function ( ViewID, bCountWarn)
    {
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserInfo[i].SetAlert(false);
            }
        }else
        {
            this.m_UserInfo[ViewID].SetAlert(bCountWarn);
        }
        return;
    },

    //设置托管
    SetUserTrustee:function (wChairID,bTrustee)
    {
        return
        if(wChairID == GameDef.MYSELF_VIEW_ID)
        {
            if(bTrustee)
                var trustee_show=cc.moveTo(0.1,cc.p(SCENE_WIGHT/2,117));
            else var trustee_show=cc.moveTo(0.1,cc.p(SCENE_WIGHT/2,-117));
            this.m_CancelTrustee.runAction(trustee_show);
        }
        this.m_UserInfo[wChairID].SetTrustee(bTrustee);
    },

    //设置结束信息
    SetGameEndInfo:function ( wWinner )
    {
        if( wWinner == INVALID_CHAIR ) return ;
    },

    //设置结算界面信息
    ShowGameScoreInfo:function (scoreInfo,bShow,gameID) {
        this.m_EndScore.active = bShow;
        this.m_EndScoreWinFlag.active = false;
        this.m_EndScoreLoseFlag.active = false;
        //this.m_btJieShu.node.active = true;
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var time = 1;
            if(i!=scoreInfo.wBankerUser){
               // time = this.m_GameClientEngine.m_lTimes*(scoreInfo.szTi[scoreInfo.wBankerUser] ? 2 : 1)*(scoreInfo.szTi[i]? 2 : 1)
            }else{
                var owmTime = 0;
                for(var j = 0;j<3;j++){
                    if(j == scoreInfo.wBankerUser){
                        continue;
                    }
                    if(scoreInfo.szTi[j]){
                        owmTime+=2
                    }else{
                        owmTime+=1
                    }
                }
               // time = this.m_GameClientEngine.m_lTimes*owmTime*(scoreInfo.szTi[scoreInfo.wBankerUser] ? 2 : 1)
            }
            this.m_EndScoreName[i].string = cutstr(scoreInfo.szNickName[i],8);
            this.m_EndScoreGameID[i].string = "ID:" + gameID[i];
            this.m_EndScoreCellScore[i].string = this.m_lCellScore.string;
            if(scoreInfo.bFanChunTian)
                this.m_EndScoreTimes[i].string = "X"+time*2;
            else
                this.m_EndScoreTimes[i].string ="X"+time;
            //
            if(scoreInfo.lGameScore[i]>=0)
                this.m_EndScoreScore[i].string = "+"+scoreInfo.lGameScore[i].toString();
            else
                this.m_EndScoreScore[i].string = scoreInfo.lGameScore[i].toString();

        }
        //this.m_EndScoreName[GameDef.MYSELF_VIEW_ID].node.active = false;
        if(scoreInfo.lGameScore[this.m_GameClientEngine.GetMeChairID()] < 0)
        {
            this.m_EndScoreLoseFlag.active = true;
        }
        else
        {
            this.m_EndScoreWinFlag.active = true;
        }

    },

    //设置警告
    SetViewRoomInfo:function (dwRules, dwServerRules,dwSeniorRules){
        this.UpdateClubID();
        //this.m_BtGPS.active = GameDef.IsNoCheat(dwRules);
        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        
        this.m_TableNumber.string = '房间号:' + this.m_GameClientEngine.m_dwRoomID;
        this.m_RulesText.string = GameDef.GetRulesStr(dwServerRules,dwRules);
        this.m_subsumlun.string = this.m_LbGameProgress.string;
        this.m_ClubNum.string = this.m_LbClubID.string;
        //this.m_LbGameRules.string = GameDef.GetRulesStr(dwRules, dwServerRules);
        this.m_BtChat.active = true;
        this.schedule(this.OperateVoice, 0.2);
    },
    OperateVoice:function()
    {
        if(this.m_VoiceCtrl) 
        {
            console.log("rule:"+GameDef.IsNoVoice(this.m_GameClientEngine.m_dwRules));
           this.m_VoiceCtrl.node.active = !GameDef.IsNoVoice(this.m_GameClientEngine.m_dwRules);
           this.unschedule(this.OperateVoice);
        }
    },
    UpdateRoomProgress:function (){
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules);
    },
    // OnBtShowGPS: function () {
    //     this.m_GameClientEngine.openGPS();
    // },
    // OnGPSAddress:function(GPSInfo){
    //     this.m_TableGPSCtrl.UpdateAddress(GPSInfo);
    // },
    PlayAni:function (Key){
        if(this.m_AniArr == null){
            this.m_AniArr = new Array();
            this.m_AniArr[GameDef.CT_SINGLE_LINE] = "AniLine"       //单连类型
            this.m_AniArr[GameDef.CT_DOUBLE_LINE] = "AniDLine";	    //对连类型
            this.m_AniArr[GameDef.CT_THREE_LINE] = "AniDLine";	    //三连类型
            this.m_AniArr[GameDef.CT_BOMB_CARD] = "AniBomb";	    //炸弹类型
            this.m_AniArr[GameDef.CT_MISSILE_CARD] = "AniBomb";	    //火箭类型
            this.m_AniArr[GameDef.CT_AIRPLANE_ONE] = "AniPlane";    //飞机带单
            this.m_AniArr[GameDef.CT_AIRPLANE_TWO] = "AniPlane";	//飞机带对
            this.m_AniArr[GameDef.CT_THREE_TAKE_DOUBLE] = "Ani3D2";	//三带一对
            this.m_AniArr[GameDef.CT_TIANZHA] = "AniBomb";	    //火箭类型
        }

        var AniCtrl = cc.instantiate(this.m_AniCtrlPrefab).getComponent('AniCtrl');
        this.node.addChild(AniCtrl.node);
        if (Key == GameDef.CT_TIANZHA || Key == GameDef.CT_BOMB_CARD || Key == GameDef.CT_MISSILE_CARD) {
            this.m_AniBomb.node.active = true;
            this.m_AniBomb.PlayAniXiPai('Armature',1,'Zhadan_Animaiton');   
        } else {
            if(this.m_AniArr[Key]){
                AniCtrl.PlayAni(this.m_AniArr[Key]);
            }else if(typeof(Key) == "string"){
                AniCtrl.PlayAni(Key);
            }

        }
    },
    AniFinish:function(){
        this.m_AniBomb.node.active = false;
    },
    OnBtClickedTrusteeship:function (IsTrusteeship){
        cc.gSoundRes.PlaySound('Button');
        this.m_Trusteeship.active = true;
        this.m_GameClientEngine.OnMessageTrusteeship(0,0);
    },
    OnBtClickedCloseTrusteeship:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_Trusteeship.active = false;
        this.m_GameClientEngine.OnMessageTrusteeship(0,0);
    },

    
});
