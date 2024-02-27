cc.Class({
    extends: cc.GameView,

    properties: {
        m_AreaJPPrefab: cc.Prefab,
        m_CardCtrlPrefab: cc.Prefab,
        m_ChooseWndPrefab: cc.Prefab,
        m_ControlWndPrefab: cc.Prefab,
        m_DiscardCardPrefab: cc.Prefab,
        m_UserStatePrefab: cc.Prefab,
        m_WeaveCardPrefab: cc.Prefab,
        m_TingPrefab: cc.Prefab,
    },

    ctor: function () {
        this.m_cbTrustee = 0;
        this.m_UserInfo = new Array(); //用户信息
        this.m_UserState = new Array(); //用户状态
        this.m_DiscardCard = new Array(); //弃牌控件
        this.m_AreaJP = new Array(); // 进牌区
        this.m_WeaveCard = new Array(); //组合牌控件
        this.m_WeaveAction = new Array(); //组合牌动作控件
        this.m_pIClientUserItem = new Array();
        this.m_OutCardCtrl = new Array();
        this.m_Out2DisCardCtrl = new Array();
        this.m_TableCardCtrl = new Array();

        this.m_cbUserAction = new Array();
        this.m_cbUserHuXiCount = new Array();

        this.m_ptHandCardPos = cc.v2(0, -360);
        this.m_ptUserInfoArr = new Array(
            cc.v2(-560, 175),
            cc.v2(-560, -165),
            cc.v2(560, 175),
            cc.v2(560, 175),
        );

        this.m_ptHuActionArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 120, this.m_ptUserInfoArr[0].y + 0),
            cc.v2(0, -150),
            cc.v2(this.m_ptUserInfoArr[2].x - 120, this.m_ptUserInfoArr[2].y + 0),
            cc.v2(this.m_ptUserInfoArr[3].x - 85, this.m_ptUserInfoArr[3].y + 0),
        ];

        this.m_ptUserStateArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 85, this.m_ptUserInfoArr[0].y + 0),
            cc.v2(this.m_ptUserInfoArr[1].x + 85, this.m_ptUserInfoArr[1].y + 0),
            cc.v2(this.m_ptUserInfoArr[2].x - 85, this.m_ptUserInfoArr[2].y + 0),
            cc.v2(this.m_ptUserInfoArr[3].x - 85, this.m_ptUserInfoArr[3].y + 0),
        ];

        this.m_ptOutCardArr = [
            cc.v2(-350, 150),
            cc.v2(-350, -100),
            cc.v2(350, 150),
            cc.v2(350, 150),
        ];

        this.m_UserStateModeArr = [
            enXLeft,
            enXLeft,
            enXRight,
            enXRight,
        ];

        this.m_ptDiscardPosArr = new Array(
            cc.v2(this.m_ptUserInfoArr[0].x - 80, this.m_ptUserInfoArr[0].y - 190),
            cc.v2(this.m_ptUserInfoArr[1].x - 80, this.m_ptUserInfoArr[1].y - 190),
            cc.v2(this.m_ptUserInfoArr[2].x + 80, this.m_ptUserInfoArr[2].y - 190),
            cc.v2(this.m_ptUserInfoArr[3].x + 80, this.m_ptUserInfoArr[3].y - 190),
        );
        this.m_ScaleDiscardArr = new Array(0.4, 0.4, 0.4, 0.4);

        this.m_ptAreaJPArr = new Array(
            cc.v2(this.m_ptUserInfoArr[0].x + 65, this.m_ptUserInfoArr[0].y - 25),
            cc.v2(this.m_ptUserInfoArr[1].x + 65, this.m_ptUserInfoArr[1].y - 25),
            cc.v2(this.m_ptUserInfoArr[2].x - 65, this.m_ptUserInfoArr[2].y - 25),
            cc.v2(this.m_ptUserInfoArr[3].x - 65, this.m_ptUserInfoArr[3].y - 25),
        );
        this.m_ScaleAreaJPArr = new Array(0.4, 0.4, 0.4, 0.4);

        this.m_ptTableCardArr = [
            cc.v2(this.m_ptUserInfoArr[0].x + 85, this.m_ptUserInfoArr[0].y + 50),
            cc.v2(this.m_ptUserInfoArr[1].x + 85, this.m_ptUserInfoArr[1].y + 0),
            cc.v2(this.m_ptUserInfoArr[2].x - 150, this.m_ptUserInfoArr[2].y + 50),
            cc.v2(this.m_ptUserInfoArr[3].x - 300, this.m_ptUserInfoArr[3].y + 50),
        ];

        this.m_TableCardModeArr = [
            enXLeft,
            enXLeft,
            enXRight,
            enXRight,
        ];
    },
    onLoad2: function () {
    },

    //添加相应节点变量
    CheckNode2: function (TagNode) {
        //UI节点
        if (TagNode.name == 'TestNode') this.m_TestNode = TagNode;


        if (TagNode.name == 'TrusteeNode') this.m_TrusteeNode = TagNode;
        if (TagNode.name == 'CancelTrustee') this.m_CancelTrustee = TagNode;
        if (TagNode.name == 'MacInfoNode') this.m_MacInfoNode = TagNode;

        // 桌子按钮
        if (TagNode.name == 'BtTidy') this.m_BtTidy = TagNode;
        if(this.m_BtTidy) this.m_BtTidy.active = false;


        if (TagNode.name == 'BtTrustee') this.m_BtTrustee = TagNode.getComponent(cc.Button);

        // 桌子信息

        if(TagNode.name == 'RoomName') this.m_LabRoomName = TagNode.getComponent(cc.Label);

        if(TagNode.name == 'ActionNode') this.m_ActionNode = TagNode;
        if(TagNode.name == 'OperateNode') this.m_OperateNode = TagNode;
        if(TagNode.name == 'TableClockNode') this.m_TableClockNode = TagNode;
        if(TagNode.name == 'LabLeftCount') this.m_LabLeftCount = TagNode.getComponent(cc.Label);
        if(TagNode.name == 'LabClockNum') this.m_LabClockNum = TagNode.getComponent(cc.Label);
        if(TagNode.name == 'LabTips') this.m_LabTips = TagNode.getComponent(cc.Label);
        if(TagNode.name == 'imgXingPai') this.m_XingPaiNode = TagNode;

        if(this.LabLeftCount) this.LabLeftCount.string = '';
        if(this.LabClockNum) this.LabClockNum.string = '';
        if(this.m_LabTips) this.m_LabTips.string = '';
        if(this.m_XingPaiNode) this.m_XingPaiNode.active = false;
    },

    start: function () {

        this.m_RulesText = this.$('TopFrame/LabRules@Label');
        this.m_subsumlun = this.$('TopFrame/New Layout/LabProgress@Label');
        this.m_TableNumber = this.$('TopFrame/New Layout/TableNumber@Label');
        this.m_ClubNum = this.$('TopFrame/New Layout/ClubNumber@Label');
        this.m_ClubNum.string = '';
        this.m_RulesText.string = '';



        this.InitView();
        this.SetTableClock(null);
        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_PHZ');
        this.m_SendCardCtrl.SetHook(this);
        this.m_UserFaceArr = clone(this.m_ptUserInfoArr);

        // 手牌控件
        this.m_HandCardControl = (cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'));
        this.m_CardNode.addChild(this.m_HandCardControl.node);
        this.m_HandCardControl.SetAttribute({
            _ClientEngine: this.m_GameClientEngine,
            _ClientView: this,
            bBig: false,
            _OutCardCallback: 'OnMessageOutCard'
        });
        this.m_HandCardControl.SetTouchOn();

        // // 醒牌控件
        // this.m_XingCardControl = (this.GetGamePrefab('CardCtrlPrefab'));
        // this.m_CardNode.addChild(this.m_XingCardControl.node);
        // this.m_XingCardControl.SetAttribute({
        //     _ClientEngine: this.m_GameClientEngine,
        //     _ClientView: this,
        //     bBig: true,
        // });

        // 剩余扑克
        this.m_XingCardControl = (cc.instantiate(this.m_DiscardCardPrefab).getComponent('DiscardCard_PHZ'));
        this.m_CardNode.addChild(this.m_XingCardControl.node);
        this.m_XingCardControl.SetAttribute({
            _ClientEngine: this.m_GameClientEngine,
            _ClientView: this,
            bBig: true,
            wViewID: 5
        });

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //用户信息
            this.m_UserInfo[i] = (cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_PHZ'));
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = (cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_PHZ'));
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();

            // 弃牌控件
            this.m_DiscardCard[i] = (cc.instantiate(this.m_DiscardCardPrefab).getComponent('DiscardCard_PHZ'));
            this.m_CardNode.addChild(this.m_DiscardCard[i].node);
            this.m_DiscardCard[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                bBig: false,
                wViewID: i
            });

            // 进牌区
            this.m_AreaJP[i] = (cc.instantiate(this.m_AreaJPPrefab).getComponent('AreaJP_PHZ'));

            this.m_CardNode.addChild(this.m_AreaJP[i].node);
            this.m_AreaJP[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                wViewID: i
            });

            // 组合牌控件
            this.m_WeaveCard[i] = new Array();
            for (var j = 0; j < GameDef.MAX_WEAVE; ++j) {
                this.m_WeaveCard[i][j] = (cc.instantiate(this.m_WeaveCardPrefab).getComponent('WeaveCtrl_PHZ'));

                this.m_AreaJP[i].node.addChild(this.m_WeaveCard[i][j].node);
                this.m_WeaveCard[i][j].SetAttribute({
                    _ClientEngine: this.m_GameClientEngine,
                    _ClientView: this,
                    bBig: false,
                    wViewID: i
                });
                if (1 || GameDef.MYSELF_VIEW_ID == i) this.m_WeaveCard[i][j].SetDisplayItem(true);
                else this.m_WeaveCard[i][j].SetDisplayItem(false);
            }


            // 组合牌控件
            this.m_WeaveAction[i] = (cc.instantiate(this.m_WeaveCardPrefab).getComponent('WeaveCtrl_PHZ'));
            this.m_AniNode.addChild(this.m_WeaveAction[i].node);
            this.m_WeaveAction[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                bBig: false,
                wViewID: i
            });
            if (1 || GameDef.MYSELF_VIEW_ID == i) this.m_WeaveAction[i].SetDisplayItem(true);
            else this.m_WeaveAction[i].SetDisplayItem(false);
            // 出牌控件
            this.m_OutCardCtrl[i] = (cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'));
            this.m_CardNode.addChild(this.m_OutCardCtrl[i].node);
            this.m_OutCardCtrl[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                bBig: true
            });
            this.m_OutCardCtrl[i].SetShowFrame(true);
            // 出牌控件
            this.m_Out2DisCardCtrl[i] = (cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'));
            this.m_CardNode.addChild(this.m_Out2DisCardCtrl[i].node);
            this.m_Out2DisCardCtrl[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                bBig: true
            });
            this.m_Out2DisCardCtrl[i].SetShowFrame(true);

            // 桌面牌控件
            this.m_TableCardCtrl[i] = (cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'));
            this.m_CardNode.addChild(this.m_TableCardCtrl[i].node);
            this.m_TableCardCtrl[i].SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                bBig: false
            });
        }

        // 操作窗口
        this.m_ControlWnd = (cc.instantiate(this.m_ControlWndPrefab).getComponent('ControlWnd_PHZ'));
        this.m_OperateNode.addChild(this.m_ControlWnd.node);
        this.m_ControlWnd.SetAttribute({
            _ClientEngine: this.m_GameClientEngine,
            _ClientView: this,
        });

        // 选择窗口
        this.m_ChooseWnd = (cc.instantiate(this.m_ChooseWndPrefab).getComponent('ChooseWnd_PHZ'));
        this.m_OperateNode.addChild(this.m_ChooseWnd.node);
        this.m_ChooseWnd.SetAttribute({
            _ClientEngine: this.m_GameClientEngine,
            _ClientView: this,
        });
        this.m_ChooseWnd.node.active = false;

        //听牌
        this.m_TingTipCtrl = (cc.instantiate(this.m_TingPrefab).getComponent('TingTip_PHZ'));
        this.m_CardNode.addChild(this.m_TingTipCtrl.node);

        this.m_GameClientEngine.m_ViewIsReady = true;
        this.RectifyControl(window.SCENE_WIGHT, window.SCENE_HEIGHT);
        this.m_bReady = true;
    },

    //调整控件
    RectifyControl: function (nWidth, nHeight) {
        this.m_UserChatArr = new Array();
        this.m_UserVoiceArr = new Array();

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserChatArr[i] = this.m_ptUserInfoArr[i];
            this.m_UserVoiceArr[i] = this.m_ptUserInfoArr[i];

            this.m_UserInfo[i].node.setPosition(this.m_ptUserInfoArr[i]);
            // 状态位置
            this.m_UserState[i].SetBenchmarkPos(this.m_ptUserStateArr[i].x, this.m_ptUserStateArr[i].y, this.m_UserStateModeArr[i]);

            this.m_DiscardCard[i].node.setPosition(this.m_ptDiscardPosArr[i]);
            this.m_DiscardCard[i].SetScale(this.m_ScaleDiscardArr[i]);
            if (this.m_ptAreaJPArr[i].x > 300)
                this.m_AreaJP[i].SetBenchmarkPos(this.m_ptAreaJPArr[i].x, this.m_ptAreaJPArr[i].y, GameDef.enXRight, GameDef.enYCenter);
            else
                this.m_AreaJP[i].SetBenchmarkPos(this.m_ptAreaJPArr[i].x, this.m_ptAreaJPArr[i].y, GameDef.enXLeft, GameDef.enYCenter);
            this.m_AreaJP[i].SetScale(this.m_ScaleAreaJPArr[i]);
            this.m_OutCardCtrl[i].SetBenchmarkPos(this.m_ptOutCardArr[i].x, this.m_ptOutCardArr[i].y, GameDef.enXCenter, GameDef.enYBottom);
            this.m_OutCardCtrl[i].SetScale(0.7);
            this.m_Out2DisCardCtrl[i].SetBenchmarkPos(this.m_ptOutCardArr[i].x, this.m_ptOutCardArr[i].y, GameDef.enXCenter, GameDef.enYBottom);
            this.m_Out2DisCardCtrl[i].SetScale(0.7);
            this.m_Out2DisCardCtrl[i].node.active = false;

            this.m_TableCardCtrl[i].SetBenchmarkPos(this.m_ptTableCardArr[i].x, this.m_ptTableCardArr[i].y, this.m_TableCardModeArr[i], GameDef.enYBottom);
            this.m_TableCardCtrl[i].SetScale(0.35);
            this.m_TableCardCtrl[i].node.active = false;
        }

        //手牌大小位置
        this.m_HandCardControl.SetBenchmarkPos(this.m_ptHandCardPos.x, this.m_ptHandCardPos.y, GameDef.enXCenter, GameDef.enYBottom);
        this.m_HandCardControl.SetCardDistance();
        this.m_HandCardControl.SetScale(0.85);

        // //醒牌大小位置
        this.m_XingCardControl.node.setPosition(cc.v2(0, 0));
        this.m_XingCardControl.SetScale(0.75);

        this.m_TingTipCtrl.SetScale(0.5);
        this.m_TingTipCtrl.SetBenchmarkPos(640, -360, GameDef.enXCenter, GameDef.enYBottom);

        this.ShowPrefabDLG('MacInfo', this.m_NdPhoneNode);
    },

    UpdateVoiceView: function() {
        // if(this.m_VoiceCtrl) {
        //     var NdButton = this.m_VoiceCtrl.node.getChildByName('btVoice');
        //     NdButton.setPosition(this.m_BtChat.node.getPositionX() - 80, this.m_BtChat.node.getPositionY());
        // }
    },

    //用户信息更新
    OnUserEnter: function (pUserItem, wViewID) {
        if(!pUserItem) return false;
        this.m_pIClientUserItem[wViewID] = pUserItem;
        this.m_UserInfo[wViewID].SetUserItem(pUserItem);
        this.m_UserState[wViewID].HideState();
        if (pUserItem.GetUserStatus() == US_READY) this.SetUserState(wViewID, 'Ready');
        this.m_UserInfo[wViewID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (pUserItem.GetUserID() == pGlobalUserData.dwUserID) {
            if (!this.m_VoiceCtrl) {
                this.ShowPrefabDLG('VoiceCtrl', this.node.getChildByName('VoiceNode'), function (Js) {
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                    var NdButton = this.m_VoiceCtrl.node.getChildByName('Voice').getChildByName('btVoice');
                    NdButton.setPosition(this.m_BtChat.x, this.m_BtChat.y - 85);
                    if(this.UpdateVoiceView) this.UpdateVoiceView();
                }.bind(this));
            }

            if (!this.m_ChatControl) {
                this.ShowPrefabDLG('ChatPrefab', this.m_GameClientEngine.node, function (Js) {
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                    this.m_ChatControl.node.zIndex = 2;
                }.bind(this));
            }
            if (!this.m_FaceExCtrl) {
                this.ShowPrefabDLG('FaceExCtrl', this.m_AniNode, function (Js) {
                    this.m_FaceExCtrl = Js;
                    this.m_FaceExCtrl.node.zIndex = 2;
                    // this.m_FaceExCtrl.SetPosArr(this.m_ptUserInfoArr);
                }.bind(this));
            }
        }
        this.UpdateUserKickOut();
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

    HideAllGameButton: function () {},

    SetUserEndScore: function (wChairID, Score) {
        if (wChairID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserInfo[i].SetEndScore();
            }
            return
        }
        this.m_UserInfo[wChairID].SetEndScore(Score);
    },
    SetCardType: function (wChairID, Type) {},

    InitTableCard: function () {},

    //////////////////////////////////////////////////////////////////////////////
    OnBnClickedCallBanker: function (Tag, Data) {
        this.m_GameClientEngine.OnMessageCallBanker(Data);
    },
    OnBnClickedCallPlayer: function (Tag, Data) {
        this.m_GameClientEngine.OnMessageCallPlayer(Data);
    },
    OnBnClickedOpenCard: function () {
        this.m_GameClientEngine.OnMessageOpenCard();
    },
    OnClicked_Tidy: function() {
        this.m_GameClientEngine.SetHandCardData(true);
    },
    //////////////////////////////////////////////////////////////////////////////
    //聊天按钮回调
    OnBnClickedChat: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_ChatControl == null) return;
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },

    OnBnClickedWanfa: function () {
        cc.gSoundRes.PlaySound('Button');
        if (!this.m_WanfaCtrl) return;
        this.m_WanfaCtrl.node.active = true;
    },

    //设置庄家
    SetBankerUser: function (wBankerUser) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserInfo[i].SetBanker(i == wBankerUser);
        }
        return;
    },

    //设置时间
    SetUserTimer: function (wViewID, wTimer, Progress) {
        if (wViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                this.m_UserInfo[i].ShowClock(false);
                this.m_UserInfo[i].ShowCurrent(false);
            }
            this.SetTableClock(null);
            return;
        }

        // if (this.m_UserInfo[wViewID]) {
        //     this.m_UserInfo[wViewID].ShowClock(true);
        //     this.m_UserInfo[wViewID].SetClockNum(Progress);
        // }
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            this.m_UserInfo[i].ShowCurrent(i == wViewID);
        }
        this.SetTableClock(wTimer);
    },

    SetUserState: function (ViewID, State) {
        if (ViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserState[i].HideState();
            }
        } else {
            this.m_UserState[ViewID].ShowUserState(State);
        }
    },

    SetTableTips: function (str) {
        str = '';
        if (str == null) {
            this.m_LabTips.string = ''
        } else {
            this.m_LabTips.string = str;
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
    SetViewRoomInfo: function ( dwServerRules, dwRulesArray) {
        if (this.SetViewRoomInfo2) this.SetViewRoomInfo2(dwServerRules, dwRulesArray);

        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        if (this.m_BtGPS) this.m_BtGPS.active = !bShow;
    },
    //设置警告
    SetViewRoomInfo2: function (dwServerRules, dwRulesArray) {
        this.m_LbGameRules.string = GameDef.GetRulesStr(dwRulesArray[0],dwServerRules,dwRulesArray);
        this.m_LbTableID.string =this.m_GameClientEngine.m_dwRoomID;
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress, dwServerRules, dwRulesArray);
        this.m_LbClubID.string =this.m_GameClientEngine.m_dwClubID;

        this.m_RulesText.string = GameDef.GetRulesStr(dwRulesArray[0],dwServerRules,dwRulesArray);
        this.m_TableNumber.string =this.m_GameClientEngine.m_dwRoomID;
        this.m_ClubNum.string =this.m_GameClientEngine.m_dwClubID;
        this.m_subsumlun.string = this.m_LbGameProgress.string;

        if (!this.m_WanfaCtrl) {
            this.m_WanfaCtrl = this.m_GameClientEngine.node.getChildByName('WanfaNode').getComponent('CustomPage');
            this.m_WanfaCtrl.SetAttribute({
                _ClientEngine: this.m_GameClientEngine,
                _ClientView: this,
                SetClose: null,
                SetNO: null,
                SetOK: {
                    _active: true,
                    _enable: true,
                    _valid: true,
                },
                SetBGClose: {
                    _active: true,
                    _enable: true,
                    _valid: true,
                },
            });
            this.m_WanfaCtrl.SetString(GameDef.GetRulesStrInGame(dwRulesArray[0], dwServerRules, dwRulesArray));
        }
        this.RectifyControl();
    },

    UpdateRoomProgress: function () {
        this.m_subsumlun.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwServerRules);
    },

    //随机庄动画
    StartAni: function (UserArr, Banker, NoAni) {
        if (UserArr.length <= 1 || NoAni) {
            this.SetBankerUser(Banker);
            this.m_GameClientEngine.OnTimeIDI_SETBANKER();
            return;
        }
        this.m_AniIndex = 0;
        this.m_AniUserIndex = 0;
        //this.m_AniTime = new Array(0.2,0.1,0.3);
        this.m_AniTime = 0;
        this.m_AniTimeAll = 0;
        this.m_AniUserArr = UserArr;
        this.m_AniTempTime = 0;
        this.m_AniBanker = Banker;
    },

    update: function (dt) {
        // console.log(dt,this.m_AniUserArr)
        if (this.m_AniUserArr != null) {
            this.m_AniTempTime += dt;

            if (this.m_AniTempTime > this.m_AniTime) {
                this.m_AniTime += (this.m_AniTempTime < 2 ? 0.05 : 0.2);

                for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    this.m_UserInfo[i].ShowClock(i == this.m_AniUserArr[this.m_AniUserIndex])
                }

                if (this.m_AniUserArr[this.m_AniUserIndex] == this.m_AniBanker && this.m_AniTempTime > 3) {
                    if (this.m_AniTime < 4) {
                        this.m_AniTime = 4.5
                    } else {
                        this.SetBankerUser(this.m_AniBanker);
                        this.m_GameClientEngine.OnTimeIDI_SETBANKER();
                        this.m_AniUserArr = null;
                    }
                } else {
                    this.m_AniUserIndex++;
                    if (this.m_AniUserIndex >= this.m_AniUserArr.length) {
                        this.m_AniUserIndex = 0;
                        this.m_AniIndex++;
                    }
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////
    SetLeftCardCount: function (cbLeftCardCount) {
        this.m_LabLeftCount.string = cbLeftCardCount;
    },

    SetUserHuXiCount: function (wViewChairID, cbHuxiCjount) {
        if (this.m_UserInfo[wViewChairID]) {
            this.m_UserInfo[wViewChairID].SetHuxi(cbHuxiCjount);
            this.m_cbUserHuXiCount[wViewChairID] = cbHuxiCjount;
        } else {
            for (var i in this.m_UserInfo) {
                this.m_cbUserHuXiCount[i] = 0;
                this.m_UserInfo[i].SetHuxi(this.m_cbUserHuXiCount[i]);
            }
        }
    },

    SetOutCardInfo: function (wViewChairID, cbOutCardData, szState) {
        for(var i in this.m_OutCardCtrl) {
            this.m_OutCardCtrl[i].SetCardData(0, 0);
            this.m_OutCardCtrl[i].node.active = false;
        }
        if (cbOutCardData < 0 || wViewChairID >=  GameDef.GAME_PLAYER) return;
        var cbCardData = new Array();
        cbCardData[0] = cbOutCardData;
        this.m_OutCardCtrl[wViewChairID].node.active = true;
        this.m_OutCardCtrl[wViewChairID].SetCardData(cbCardData, 1, 1, true);
        // this.m_OutCardCtrl[wViewChairID].SetOutCard(this.m_ptUserInfoArr[wViewChairID], szState);
        this.m_OutCardCtrl[wViewChairID].SetOutCard(cc.v2(50, 220), szState);
    },

    AddDiacard: function(wViewChairID, cbCardData) {
        for(var i in this.m_Out2DisCardCtrl) {
            this.m_Out2DisCardCtrl[i].SetCardData(0, 0);
            this.m_Out2DisCardCtrl[i].node.active = false;
        }
        if(wViewChairID >= GameDef.GAME_PLAYER) return;
        var pCardCtrl = this.m_Out2DisCardCtrl[wViewChairID]
        pCardCtrl.node.active = true;
        pCardCtrl.SetCardData(cbCardData, 1, 1, true);
        var ptPosTarget = this.m_DiscardCard[wViewChairID].GetNextPosition();
        ptPosTarget.x += this.m_ptDiscardPosArr[wViewChairID].x;
        ptPosTarget.y += this.m_ptDiscardPosArr[wViewChairID].y;
        pCardCtrl.AddDiscard(ptPosTarget);
    },

    SetStatusFlag: function (bOutCard, bWaitOther) {
        //设置变量
        this.m_bOutCard = bOutCard;
        this.m_bWaitOther = bWaitOther;
    },

    // 动作信息
    SetUserAction: function (wViewChairID, cbUserAction, cbIndex, WeaveItem, bDisplay) {
        // 设置变量
        // if (wViewChairID < GameDef.GAME_PLAYER) this.m_cbUserAction[wViewChairID] = cbUserAction;
        // else {
        //     ZeroMemory(this.m_bUserAction, this.m_cbUserAction.length);
        // }
        if (cbUserAction == GameDef.ACK_NULL) return;

        // 玩家动作
        if (!this.m_ActionCtrl) {
            this.m_ActionCtrl = this.m_ActionNode.getComponent('CustomAction_' + GameDef.KIND_ID);
        }

        var ptPos = cc.v2(0, 0);
        ptPos.x = this.m_ScaleAreaJPArr[wViewChairID] * (this.m_WeaveCard[wViewChairID][cbIndex].node.getPosition().x) + this.m_ptAreaJPArr[wViewChairID].x;
        ptPos.y = this.m_ScaleAreaJPArr[wViewChairID] * (this.m_WeaveCard[wViewChairID][cbIndex].node.getPosition().y) + this.m_ptAreaJPArr[wViewChairID].y;
        // this.m_ActionCtrl.SetUserAction(cbUserAction, ptPos);

        this.m_WeaveAction[wViewChairID].Reset();
        this.m_WeaveAction[wViewChairID].SetDisplayItem(false);
        this.m_WeaveAction[wViewChairID].SetAction(cbUserAction);
        this.m_WeaveAction[wViewChairID].WeaveGoing(ptPos);
        this.m_WeaveAction[wViewChairID].SetCardData(WeaveItem);

        return;
    },

    OnButtonClickLeftCount: function (event, customData) {
        var pPage = event.target.getComponent('CustomPage');
        if (pPage) {
            // console.log(' #################### ' + pPage.GetEditBoxString());
            var pModifyLC = GameDef.CMD_C_ModifyLeftCount();
            pModifyLC.cbLeftCount = pPage.GetEditBoxString();
            pModifyLC.dwTest = 1313;
            this.m_GameClientEngine.OnMessageCommand(1, pModifyLC);
        }

    },

    ResetView: function () {
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            this.SetUserHuXiCount(i, 0);
            this.m_DiscardCard[i].SetCardData(null, 0);
            for (var j = 0; j < GameDef.MAX_WEAVE; ++j) {
                this.m_WeaveCard[i][j].Reset();
            }
        }
    },

/////////////////////////////////////////////////////////////////////

    SetHeapCardInfo: function (cbHandCardIndex, cbLeftCardIndex) {
        if(this.m_TestCardCtrl) {
            if(this.m_TestCardCtrl.node.active) {
                this.m_TestCardCtrl.UpdateView(cbHandCardIndex, cbLeftCardIndex);
            } else {
                this.m_TestCardCtrl.ShowView();
                this.m_TestCardCtrl.InitCtrl(cbHandCardIndex, cbLeftCardIndex);
            }
        } else {
            this.ShowPrefabDLG('PHZTestCardCtrl', this.m_GameClientEngine.node, function (Js) {
                this.m_TestCardCtrl = Js;
                this.m_TestCardCtrl.node.zIndex = 100;
                this.m_TestCardCtrl.InitCtrl(cbHandCardIndex, cbLeftCardIndex);
            }.bind(this));
        }
    },

    //设置托管
    SetUserTrustee: function (wViewID, cbTrustee) {
        if (wViewID == GameDef.MYSELF_VIEW_ID) {
            // if(this.m_cbTrustee != cbTrustee) {
                if (cbTrustee) var trustee_show = cc.moveTo(0.1, cc.v2(0, 0));
                else var trustee_show = cc.moveTo(0.1, cc.v2(0, -275));
                this.m_CancelTrustee.stopAllActions();
                this.m_CancelTrustee.runAction(trustee_show);
                this.m_cbTrustee = cbTrustee;
            // }
        }
        this.m_UserInfo[wViewID].SetTrustee((cbTrustee == 1));
    },

    PlayHuAction: function(wViewID, szAniName) {
        if(!this.m_HuAction) {
            this.m_HuAction = this.$('hu@AniPrefab', this.m_AniNode);
            this.m_HuAction.Init(this);
        }
        this.m_HuAction.node.active = true;
        // this.m_HuAction.PlayAni('Armature', 1);
        this.m_HuAction.PlayAni2('Armature', szAniName, 1);
        this.m_HuAction.node.setPosition(this.m_ptHuActionArr[wViewID]);
    },

    AniFinish: function() {
        // this.m_HuAction.node.active = false;
    },
    //托管
    OnBnClickedTrustee: function (event, customData) {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageTrustee(customData);
    },
    OnUserState: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(pUserItem.GetUserStatus() == US_READY) {
            this.SetUserState(wChairID, 'Ready');
            if(wChairID == GameDef.MYSELF_VIEW_ID)this.m_GameClientEngine.OnMessageStart(null,true);
        }else{
            this.m_UserState[wChairID].HideState();
        }
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave: function (pUserItem, wChairID) {
        var ViewID = this.m_GameClientEngine.SwitchViewChairID(wChairID);
        for(var i in this.m_UserInfo){
            this.m_UserInfo[i].UserLeave(pUserItem);
        }
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },

    OnUserScore: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem);
    },
    OnBnClickedStart:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageStart();
    },
});
