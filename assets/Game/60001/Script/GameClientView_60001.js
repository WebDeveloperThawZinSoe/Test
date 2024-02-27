cc.Class({
    extends: cc.GameView,

    properties: {
        //牌控件
        m_CardNode: cc.Node,
        m_UserNode: cc.Node,
        m_CardCtrlPrefab: cc.Prefab,
        m_UserStatePrefab: cc.Prefab,
        m_AniPrefab: cc.Prefab,
    },
    ctor: function () {
        this.m_HandCardCtrl = null; //手牌组件
        this.m_OutCardCtrl = new Array(); //出牌扑克
        this.m_TableCardCtrl = new Array(); //桌面扑克
        this.m_UserCardCtrl = new Array(); //玩家扑克 回放

        this.m_UserInfo = new Array(); //用户信息
        this.m_UserState = new Array(); //用户信息

        this.m_pIClientUserItem = new Array();

        this.m_ptUserInfoArr = [
            cc.v2(-480, 180),
            cc.v2(-570, -215),
            cc.v2(480, 180),
            cc.v2(568, 182),
        ];
        this.m_UserFaceArr = this.m_ptUserInfoArr;
        this.m_UserVoiceArr = this.m_ptUserInfoArr;
        this.m_UserChatArr = this.m_ptUserInfoArr;

        this.m_ptUserStateArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 75, this.m_ptUserInfoArr[0].y + 0),
            cc.v2(this.m_ptUserInfoArr[1].x + 75, this.m_ptUserInfoArr[1].y + 0),
            cc.v2(this.m_ptUserInfoArr[2].x - 75, this.m_ptUserInfoArr[2].y + 0),
        ];
        this.m_UserStateModeArr = [
            enXLeft,
            enXLeft,
            enXRight,
        ];

        this.m_ptSendCardPosArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 0, this.m_ptUserInfoArr[0].y + 0),
            cc.v2(this.m_ptUserInfoArr[1].x + 570, this.m_ptUserInfoArr[1].y - 0),
            cc.v2(this.m_ptUserInfoArr[2].x + 0, this.m_ptUserInfoArr[2].y + 0),
        ];

        this.m_ptOutCardArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 135, this.m_ptUserInfoArr[0].y - 50),
            cc.v2(this.m_ptUserInfoArr[1].x + 570, this.m_ptUserInfoArr[1].y + 160),
            cc.v2(this.m_ptUserInfoArr[2].x - 155, this.m_ptUserInfoArr[2].y - 50),
        ];
        this.m_OutCardModeArr = [
            enXLeft,
            enXCenter,
            enXRight,
        ];

        this.m_ptTableCardArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 120, this.m_ptUserInfoArr[0].y - 50),
            cc.v2(this.m_ptUserInfoArr[1].x + 570, this.m_ptUserInfoArr[1].y - 150),
            cc.v2(this.m_ptUserInfoArr[2].x - 105, this.m_ptUserInfoArr[2].y - 50),
        ];

        this.m_ptUserCardArr = [
            cc.v2(this.m_ptUserInfoArr[0].x - 50, this.m_ptUserInfoArr[0].y + 50),
            cc.v2(this.m_ptUserInfoArr[1].x - 0, this.m_ptUserInfoArr[1].y - 150),
            cc.v2(this.m_ptUserInfoArr[2].x + 50, this.m_ptUserInfoArr[2].y + 50),
            cc.v2(this.m_ptUserInfoArr[3].x - 0, this.m_ptUserInfoArr[3].y + 50),
        ];

        this.m_bInit = false;
        this.m_CardTestName = 'UserCheatCtrl';
    },

    //添加相应节点变量
    CheckNode2: function (TagNode) {
        if(TagNode.name == 'BtTrustee') this.m_BtTrustee = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'CancelTrustee') this.m_CancelTrustee = TagNode;
        if(TagNode.name == 'OpenCardNode') this.m_OpenCardNode = TagNode;
        if(TagNode.name == 'btOutCard') this.m_btOutCard = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'btPrompt') this.m_btPrompt = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'btPass') this.m_btPass = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'btRobBanker') this.m_btRobBanker = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'btNoRobBanker') this.m_btNoRobBanker = TagNode.getComponent(cc.Button);
        if(TagNode.name == 'LightCardNode') this.m_LightCardNode = TagNode;
        if(TagNode.name == 'BaseScore') this.m_BaseScore = TagNode.getComponent(cc.Label);
        if(TagNode.name == 'ClockBG') this.m_TableClockNode = TagNode;
        if(TagNode.name == 'ClockLabel') this.m_LabClockNum = TagNode.getComponent(cc.Label);
    },

    Init:function(){
        if (this.m_bInit)
            return;
        this.m_bInit = true;
        //隐藏按钮
        this.HideAllGameButton();
        this.InitView();
        this.SetTableClock(null);
        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_60001');
        this.m_SendCardCtrl.SetHook(this);

        //开牌控件
        this.m_OpenCardCtrl = this.m_OpenCardNode.getComponent('OpenCardCtrl_'+GameDef.KIND_ID);
        this.m_OpenCardCtrl.SetHook(this.m_GameClientEngine);
        this.m_OpenCardCtrl.node.active = false;

        //用户手牌
        this.m_HandCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_60001');
        this.m_CardNode.addChild(this.m_HandCardCtrl.node);
        this.m_HandCardCtrl.SetGameEngine(this.m_GameClientEngine); //设置消息回调

        // 首出牌
        this.m_LightCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_60001');
        //this.m_LightCardNode.addChild(this.m_LightCardCtrl.node);
        // this.m_LightCardCtrl.SetGameEngine(this.m_GameClientEngine); //设置消息回调

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //出牌扑克
            this.m_OutCardCtrl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_60001');
            this.m_CardNode.children[i].addChild(this.m_OutCardCtrl[i].node);

            // 玩家扑克 回放
            this.m_UserCardCtrl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_60001');
            this.m_CardNode.addChild(this.m_UserCardCtrl[i].node);

            //桌面扑克
            this.m_TableCardCtrl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_60001');
            this.m_CardNode.addChild(this.m_TableCardCtrl[i].node);
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_60001');
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_60001');
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
        }

        this.RectifyControl(window.SCENE_WIGHT, window.SCENE_HEIGHT);

        this.ShowPrefabDLG('MacInfo', this.m_NdPhoneNode);
        if(this.m_BaseScore) this.m_BaseScore.string = '';

        this.m_RulesText = this.$('TopFrame/BGRoomInfo/LabRules@Label');
        this.m_subsumlun = this.$('TopFrame/BGRoomInfo/LabProgress@Label');
        this.m_TableNumber = this.$('TopFrame/BGRoomInfo/TableNumber@Label');
        this.m_ClubNum = this.$('TopFrame/BGRoomInfo/ClubNumber@Label');

        this.test('a,', 1, 2,3,4,5,6);
    },
    // use this for initialization
    start: function () {
        this.Init();
    },
    
    test: function(...info) {
        console.log(info);
    },

    //调整控件
    RectifyControl: function (nWidth, nHeight) {
        var cbPlayerCount = GameDef.GetPlayerCount(this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
        var cbTagIndex = GameDef.GAME_PLAYER;
           
        var OutCardScale = 0.4;
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if(cbPlayerCount == 2 && i != GameDef.MYSELF_VIEW_ID){
                cbTagIndex = GameDef.GAME_PLAYER-1;
            }else {
                cbTagIndex = i;
            }
            // 玩家位置
            this.m_UserInfo[i].node.setPosition(this.m_ptUserInfoArr[cbTagIndex]);

            // 状态位置
            this.m_UserState[i].SetBenchmarkPos(this.m_ptUserStateArr[cbTagIndex].x, this.m_ptUserStateArr[cbTagIndex].y, this.m_UserStateModeArr[cbTagIndex]);

            // 出牌位置
            // this.m_OutCardCtrl[i].SetScale(OutCardScale);
            this.m_OutCardCtrl[i].SetCardDistance(100);
            this.m_OutCardCtrl[i].SetBenchmarkPos(0, 0, this.m_OutCardModeArr[cbTagIndex]);

            // 桌面扑克位置
            this.m_TableCardCtrl[i].SetScale(OutCardScale);
            if (i == GameDef.MYSELF_VIEW_ID) this.m_TableCardCtrl[i].SetScale(0.85);
            this.m_TableCardCtrl[i].SetBenchmarkPos(this.m_ptTableCardArr[cbTagIndex].x, this.m_ptTableCardArr[cbTagIndex].y, this.m_OutCardModeArr[cbTagIndex]);
            this.m_TableCardCtrl[i].SetCardDistance(70);

            // 桌面扑克位置 回放
            if (i == GameDef.MYSELF_VIEW_ID) this.m_UserCardCtrl[i].SetScale(0);
            else this.m_UserCardCtrl[i].SetScale(0.3);
            this.m_UserCardCtrl[i].SetBenchmarkPos(this.m_ptUserCardArr[cbTagIndex].x, this.m_ptUserCardArr[cbTagIndex].y, this.m_OutCardModeArr[cbTagIndex]);
            this.m_UserCardCtrl[i].SetCardDistance(70);

            var pNode = this.m_OutCardCtrl[i].node.parent;
            pNode.setPosition(this.m_ptOutCardArr[cbTagIndex]);
            pNode.setScale(OutCardScale);
            pNode.anchorX = 0.5*(this.m_OutCardModeArr[cbTagIndex] - 1);

            this.m_UserFaceArr[i] = this.m_ptUserInfoArr[cbTagIndex];
            this.m_UserVoiceArr[i] = this.m_ptUserInfoArr[cbTagIndex];
            this.m_UserChatArr[i] = this.m_UserChatArr[cbTagIndex];
        }

        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0, nHeight / 2 + 100), this.m_ptSendCardPosArr);

        //自己手牌
        this.m_HandCardCtrl.SetBenchmarkPos(50, -360, enXCenter);
        this.m_HandCardCtrl.SetCardDistance(70);
        this.m_HandCardCtrl.SetScale(0.85);

        //首出牌
        this.m_LightCardCtrl.SetBenchmarkPos(0, 0, enXRight);
        this.m_LightCardCtrl.SetCardDistance(175);
        this.m_LightCardCtrl.SetScale(0.35);
    },

    //初始化牌
    InitTableCard: function () {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_OutCardCtrl[i].SetCardData(null, 0);
            this.m_TableCardCtrl[i].SetCardData(null, 0);
            this.m_UserCardCtrl[i].SetCardData(null, 0);
        }
        this.m_HandCardCtrl.SetCardData(null, 0);
    },

    HideAllGameButton: function () {
        if(this.m_btRobBanker) this.m_btRobBanker.node.active = false;
        if(this.m_btNoRobBanker) this.m_btNoRobBanker.node.active = false;
        if(this.m_btOutCard) this.m_btOutCard.node.active = false;
        if(this.m_btPass) this.m_btPass.node.active = false;
        if(this.m_btPrompt) this.m_btPrompt.node.active = false;
    },

    ShowCallUI: function (cbGameStage) {
        if (cbGameStage == GameDef.STAGE_CALL_BANKER) {
            if(this.m_btRobBanker)this.m_btRobBanker.node.active = true;
            if(this.m_btNoRobBanker)this.m_btNoRobBanker.node.active = true;
        } else {
            if(this.m_btRobBanker)this.m_btRobBanker.node.active = false;
            if(this.m_btNoRobBanker)this.m_btNoRobBanker.node.active = false;
        }
    },

    ShowCardUI: function () {
        //启用按钮
        this.m_btOutCard.interactable = this.m_GameClientEngine.VerdictOutCard();
        this.m_btPrompt.interactable = true;
        this.m_btPass.interactable = false;

        //显示按钮
        this.m_btOutCard.node.active = true;
        this.m_btPrompt.node.active = true;

        if(!GameDef.IsMustOutCard(this.m_GameClientEngine.m_dwRules)) {
            this.m_btPass.node.active = true;
            if (this.m_GameClientEngine.m_cbTurnCardCount > 0) {
                this.m_btPass.interactable = true;
            }
        }
    },

    //用户信息更新
    OnUserEnter: function (pUserItem, wViewID) {
        this.Init();
        this.m_pIClientUserItem[wViewID] = pUserItem;
        this.m_UserInfo[wViewID].SetUserItem(pUserItem);
        if (pUserItem.GetUserStatus() == US_READY) this.SetUserState(wViewID, 'Ready');
        this.m_UserInfo[wViewID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        if(!this.m_GameClientEngine.m_ReplayMode) this.scheduleOnce(function(){this.UpdateGPS();}, 5);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (pUserItem.GetUserID() == pGlobalUserData.dwUserID) {
            if (!this.m_ChatControl) {
                this.ShowPrefabDLG('ChatPrefab', this.node, function (Js) {
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                    this.m_ChatControl.node.zIndex = 1;
                }.bind(this));
            }

            if (!this.m_VoiceCtrl) {
                this.ShowPrefabDLG('VoiceCtrl', this.node.getChildByName('VoiceNode'), function (Js) {
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                    var NdButton = this.m_VoiceCtrl.node.getChildByName('Voice').getChildByName('btVoice');
                    NdButton.setPosition(this.m_BtChat.x, this.m_BtChat.y+80);
               }.bind(this));
            }

            if (!this.m_FaceExCtrl) {
                this.ShowPrefabDLG('FaceExCtrl', this.m_AniNode, function (Js) {
                    this.m_FaceExCtrl = Js;
                    // this.m_FaceExCtrl.SetPosArr(this.m_ptUserInfoArr);
                }.bind(this));
            }

        }
       // this.UpdateUserKickOut();
    },
    OnUserState: function (pUserItem, wChairID) {
        this.Init();
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if (pUserItem.GetUserStatus() == US_READY) {
            this.SetUserState(wChairID, 'Ready');
            this.m_GameClientEngine.PlayActionSound(pUserItem.GetChairID(), "READY");
        } else {
            this.m_UserState[wChairID].HideState();
        }
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave: function (pUserItem, wChairID) {
        this.Init();
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].UserLeave(pUserItem);
        }
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem);
    },

    PlayAni: function (AniName) {
        if(!this.m_AniCtrl){
            this.m_AniCtrl = cc.instantiate(this.m_AniPrefab);
            this.m_AniNode.addChild(this.m_AniCtrl);
            if(!this.m_BombAniCtrl) {
                this.m_BombAniCtrl = this.m_AniCtrl.getChildByName('BombAni').getComponent('AniPrefab');
                this.m_BombAniCtrl.Init(this);
                this.m_BombAniCtrl.node.active = false;
            }
            if(!this.m_SpringAniCtrl) {
                this.m_SpringAniCtrl = this.m_AniCtrl.getChildByName('SpringAni').getComponent('AniPrefab');
                this.m_SpringAniCtrl.Init(this);
                this.m_SpringAniCtrl.node.active = false;
            }
        }
        
        if(AniName == 'Zhadan_Animaiton') {
            this.m_BombAniCtrl.node.active = true;
            this.m_BombAniCtrl.PlayAni2(AniName, AniName, 1);
        }else if(AniName == 'chuntian' || AniName == 'fanchuntian'){
            this.m_SpringAniCtrl.node.active = true;
            this.m_SpringAniCtrl.PlayAni2(AniName, AniName, 1);
        }
    },

    AniFinish: function() {
        if(this.m_BombAniCtrl) this.m_BombAniCtrl.node.active = false;
        if(this.m_SpringAniCtrl) this.m_SpringAniCtrl.node.active = false;
    },
    ///////////////////////////////////////////////////////////////////
    //托管
    OnBnClickedTrustee: function (event, customData) {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageTrustee(customData);
    },

    //叫分按钮回调
    OnBnClickedCallBanker: function (Tag, Data) {
        cc.gSoundRes.PlaySound('Button');
        // 0：不抢；1：抢
        this.m_GameClientEngine.OnMessageCallScore(Data);
    },

    //按钮回调
    OnBnClickedPrompt: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutPrompt(0, 0);
    },

    //按钮回调
    OnBnClickedOutCard: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutCard(1, 0);
    },

    //按钮回调
    OnBnClickedPass: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessagePassCard(0, 0);
    },

    ////////////////////////////////////////////////////////////////////////////
    //设置庄家
    SetBankerUser: function (wBankerUser) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserInfo[i].SetBanker(i == wBankerUser);
        }
        this.m_HandCardCtrl.setBanker(wBankerUser == GameDef.MYSELF_VIEW_ID);
        return;
    },

    ShowUserCallBanker: function(wViewID, cbState) {
        if(wViewID >= GameDef.GAME_PLAYER) {
            for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
                this.m_UserInfo[i].ShowNoQiang(false);
            }
            return;
        }
        this.m_UserInfo[wViewID].ShowNoQiang(cbState == 0);
    },

    //设置状态
    UpdateUserCardCount: function (wViewID, Cnt, bWarning) {
        if (wViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserState[i].HideCnt();
                this.m_UserState[i].ShowCntWarning(false);
            }
        } else {
            this.m_UserState[wViewID].ShowCnt(Cnt);
            this.m_UserState[wViewID].ShowCntWarning(bWarning && wViewID != GameDef.MYSELF_VIEW_ID);
        }
    },

    //设置时间
    SetUserTimer: function (wViewID, wTimer) {
        if(!this.m_GameClientEngine.m_ReplayMode) this.SetTableClock(wTimer);
        for (var i in this.m_UserInfo) {
            if(i == wViewID) this.m_UserInfo[i].ShowCurrent(true);
            else this.m_UserInfo[i].ShowCurrent(false);
        }
    },
    
    SetTableClock: function (CountDown) {
        if (CountDown == null) {
            this.m_TableClockNode.active = false;
        } else {
            this.m_TableClockNode.active = true;
            this.m_LabClockNum.string = CountDown;
        }
    },

    SetUserState: function (ViewID, State, Cnt) {
        if (ViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserState[i].HideState();
            }
        } else {
            this.m_UserState[ViewID].ShowUserState(State, Cnt);
        }
    },

    //设置托管
    SetUserTrustee: function (wViewID, cbTrustee) {
        if (wViewID == GameDef.MYSELF_VIEW_ID) {
            if (cbTrustee) var trustee_show = cc.moveTo(0.1, cc.v2(0, 0));
            else var trustee_show = cc.moveTo(0.1, cc.v2(0, -250));
            this.m_CancelTrustee.stopAllActions();
            this.m_CancelTrustee.runAction(trustee_show);
        }
        this.m_UserInfo[wViewID].SetTrustee((cbTrustee == 1));
    },

    SetUserDynamicScore: function(wViewChairID, lDynamicScore) {
        if (!this.m_UserInfo[wViewChairID]) return;
        var pLabel = this.$('EndScoreWin@Label', this.m_UserNode);
        if(lDynamicScore < 0) pLabel = this.$('EndScoreLose@Label', this.m_UserNode);
        pLabel = cc.instantiate(pLabel.node).getComponent(cc.Label);
        this.m_UserNode.addChild(pLabel.node);
        pLabel.node.setPosition(this.m_ptUserInfoArr[wViewChairID].x, this.m_ptUserInfoArr[wViewChairID].y);
        lDynamicScore = Score2Str(lDynamicScore);
        pLabel.string = lDynamicScore > 0 ? '+' + lDynamicScore : '' + lDynamicScore;
        FlyDestroy(pLabel.node);
    },

    //设置警告
    SetViewRoomInfo: function (dwServerRules, dwRulesArr) {
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress, dwServerRules, dwRulesArr);
        this.m_LbTableID.string = ''+this.m_GameClientEngine.m_dwRoomID;
        this.m_BaseScore.string = GameDef.GetBaseScore(dwServerRules, dwRulesArr);
        this.m_LbGameRules.string = GameDef.GetRulesStr(dwServerRules, dwRulesArr);
        this.RectifyControl();
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            //用户状态
            this.m_UserState[i].SetEnableCnt(GameDef.IsAllowShowCardCount(this.m_GameClientEngine.m_dwRules));
        }
        var bShow = !this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = bShow;
        if (this.m_BtGPS) this.m_BtGPS.active = (bShow && GameDef.IsNoCheat(dwRulesArr));
    },

    UpdateRoomProgress: function () {
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress, this.m_GameClientEngine.m_dwServerRules, this.m_GameClientEngine.m_dwRulesArr);
        this.m_BaseScore.string = GameDef.GetBaseScore(this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
    },

    UpdateUserKickOut: function () {
        if(!this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID]) return;
        var UserID = this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID].GetUserID();
        var OutPower = this.m_GameClientEngine.m_bLockInRoom || (UserID == this.m_GameClientEngine.m_dwCreater)
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue;
            var bCanOut = this.m_GameClientEngine.m_LockArr[this.m_pIClientUserItem[i].GetChairID()];
            if (bCanOut == null) bCanOut = false;
            this.m_UserInfo[i].SetKickOut(i != GameDef.MYSELF_VIEW_ID && OutPower && !bCanOut);
        }
    },

    /////////////////////////////////////////////////////////////////////////
    //更新gps
    UpdateGPS:function()
    {
        if(!GameDef.IsNoCheat(this.m_GameClientEngine.m_dwRules)) return;
        this.m_GameClientEngine.GetTableUserGPS();
    },
    /////////////////////////////////////////////////////////////

});
