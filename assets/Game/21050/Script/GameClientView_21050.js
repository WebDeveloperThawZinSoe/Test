cc.Class({
    extends: cc.GameView,

    properties: {
		m_Atlas:cc.SpriteAtlas,
		m_CardCtrlPrefab: cc.Prefab,
		m_UserStatePrefab: cc.Prefab,
		m_TotalTableScore: cc.Label,
		m_LanGuo:cc.Node,
		m_BtGPS:cc.Node,
		m_BtChat:cc.Node,

		//各种按钮
		m_GameButtonLayer:cc.Node,
		m_btAddScore:cc.Button,
		m_btFollow:cc.Button,
		m_btGiveUp:cc.Button,
		m_btKick:cc.Button,
		m_btKickPass:cc.Button,
		m_btLookCard:cc.Button,

		m_OperateTimeOut:cc.Node,

		m_ChooseJettonLayer:cc.Node,

		m_lookCard:cc.Node,
		m_BtBegin:cc.Node,



    },

	ctor: function() {
		this.m_pIClientUserItem = [];
		this.m_lBaseScore = 1;
		this.m_dwRules = 0;
		this.m_dwServerRules = 0;
		this.JETTON_TYPES = 3;
		this.m_bOpenCard = false;
		this.m_btJettons = new Array();
		this.m_JettonTemplates = new Array();
		this.m_UserActionFlag = new Array();
		this.m_GiveUpFlag = new Array();
		this.m_UserInfo = new Array();
		this.m_UserCardControl = new Array();
		this.m_UserState = new Array();
		this.m_WinScore = new Array();
		this.m_LoseScore = new Array();
		this.m_CardPoint = new Array();
		this.m_CardType = new Array();
		this.m_UserPosArr = new Array(
            cc.v2(-580, 170),
            cc.v2(-580, -30),
            cc.v2(-145, -225),
            cc.v2(580, -30),
            cc.v2(580, 170)
		);
		this.m_UserStatePosArr = new Array(
			cc.v2(-500, 170),
            cc.v2(-500, -30),
            cc.v2(-305, -100),
            cc.v2(500, -30),
            cc.v2(500, 170)
		);
		this.m_UserFaceArr = new Array();
		this.m_UserScaleArr = new Array(
            0.8,
            0.8,
            1,
            0.8,
            0.8,
        );
		this.m_CardCtrlPosArr = new Array(
            cc.v2(-520, 130),
            cc.v2(-520, -70),
            cc.v2(-75, -280),
            cc.v2(520, -70),
            cc.v2(520, 130)
		);
		this.m_CardCtrlEnMode = new Array(
			enXLeft,
			enXLeft,
			enXLeft,
			enXRight,
			enXRight,
		);
		this.m_CardCtrlScale = new Array(
			0.4,
			0.4,
			0.6,
			0.4,
			0.4,
		);

        this.m_UserChatArr = new Array(
			cc.v2(-465, 100),
			cc.v2(-465, -20),
			cc.v2(-75, -110),
			cc.v2(465, -20),
			cc.v2(465, 180)
		);
        this.m_UserVoiceArr = new Array();
		this.m_strAddress = [
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!'
		];

		this.m_bLanGuo = false;
		this.m_ShowDistance = new Array();//距离警报
		this.m_bPublic = false;//是否有公张
		this.m_bInit = false;

		this.m_GameRules = '';
		this.m_CardTestName = 'UserCheatCtrl';
	},
    // LIFE-CYCLE CALLBACKS:

    start: function() {
		this.InitView();
		this.Init();
	},

	Init:function()
	{
		if(this.m_bInit == true) return;
		this.m_bInit = true;
		for(var i = 0; i < 5; ++ i) {
			this.m_btJettons[i] = this.m_ChooseJettonLayer.getChildByName('ButtonLayout').getChildByName('btJetton'+i).getComponent(cc.Button);
		}
		//this.m_LanGuo = this.node.getChildByName('LanGuo');

		for(var i = 0; i < 5; ++ i) {
			var pNode = this.node.getChildByName('JettonTemplates');
			if(!pNode) continue;
			this.m_JettonTemplates[i] = pNode.getChildByName('Jetton'+i);
		}

    	for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
    		this.m_UserActionFlag[i] = this.m_UserNode.getChildByName('UserAction' + i).getComponent(cc.Sprite);
			this.m_UserActionFlag[i].node.zIndex = 50;
    		this.m_GiveUpFlag[i] = this.m_CardNode.getChildByName('GiveUp' + i).getComponent(cc.Sprite);
			this.m_GiveUpFlag[i].node.zIndex = 50;
			// 输赢积分
			this.m_WinScore[i] = this.m_UserNode.getChildByName('winScore' + i).getComponent(cc.Label);
			this.m_LoseScore[i] = this.m_UserNode.getChildByName('loseScore' + i).getComponent(cc.Label);
			var ptPos = cc.v2(this.m_UserPosArr[i].x, this.m_UserPosArr[i].y + this.m_UserScaleArr[i] * 80 + 10);
			this.m_WinScore[i].node.setPosition(ptPos);
			this.m_LoseScore[i].node.setPosition(ptPos);
			// 手牌点数
			this.m_CardPoint[i] = this.m_UserNode.getChildByName('CardPoint' + i).getComponent(cc.Label);
			this.m_CardPoint[i].node.setPosition(ptPos);
			this.m_CardPoint[i].string = '';
			this.m_CardPoint[i].node.active = true;
			// 手牌点数
			var ptAnchor = cc.v2(0.5, 0);
			if(this.m_CardCtrlPosArr[i].x < 0){
				ptAnchor = cc.v2(0, 0);
				ptPos = cc.v2(this.m_CardCtrlPosArr[i].x, this.m_CardCtrlPosArr[i].y + this.m_CardCtrlScale[i] * GameDef.CARD_HEIGHT + 20);
			} else {
				ptAnchor = cc.v2(1, 0);
				ptPos = cc.v2(this.m_CardCtrlPosArr[i].x, this.m_CardCtrlPosArr[i].y + this.m_CardCtrlScale[i] * GameDef.CARD_HEIGHT + 20);
			}
			this.m_CardType[i] = this.m_CardNode.getChildByName('CardType' + i).getComponent(cc.Label);
			this.m_CardType[i].node.setPosition(ptPos);
			this.m_CardType[i].node.setAnchorPoint(ptAnchor);
			this.m_CardType[i].string = '';
			this.m_CardType[i].node.active = true;

			this.m_ShowDistance[i] = false;

			this.m_RulesText = this.m_LbGameRules;
			this.m_subsumlun = this.m_LbGameProgress;
			this.m_TableNumber = this.m_LbTableID;
			this.m_ClubNum = this.m_LbClubID;
    	}
    	for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
    		//用户信息
    		this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_' + GameDef.KIND_ID);
    		this.m_UserNode.addChild(this.m_UserInfo[i].node);
    		this.m_UserInfo[i].Init(this, i);
    		this.m_UserInfo[i].node.active = true;
    		this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[i]);
    		this.m_UserInfo[i].node.setScale(this.m_UserScaleArr[i]);

    		//用户牌
    		this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_' + GameDef.KIND_ID);
			this.m_CardNode.addChild(this.m_UserCardControl[i].node);

    		//用户状态
    		this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_' + GameDef.KIND_ID);
			this.m_UserNode.addChild(this.m_UserState[i].node);
			this.m_UserState[i].Init(this, i, this.m_UserStatePosArr[i]);
		}

        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_' + GameDef.KIND_ID);
		this.m_SendCardCtrl.SetHook(this);
		this.m_BtChat.active = false;
		this.ShowPrefabDLG('MacInfo',this.m_NdPhoneNode);
		this.RectifyControl(window.SCENE_WIGHT, window.SCENE_HEIGHT);
		this.ResetGameView();

		this.ShowGamePrefab('TableUserGPS_'+GameDef.KIND_ID,this.node, function(Js){
            this.m_TableGPSCtrl = Js;
			this.m_TableGPSCtrl.node.setPosition(0, 0);
            this.m_TableGPSCtrl.HideView();
		}.bind(this));


		this.m_lookCard.on(cc.Node.EventType.TOUCH_START, this.OnEventLookCard, this);
		this.m_lookCard.on(cc.Node.EventType.TOUCH_END, this.OnEventLookEnd, this);
		this.m_lookCard.on(cc.Node.EventType.TOUCH_CANCEL, this.OnEventLookEnd, this);

		this.m_OperateTimeOut.active = false;
		//this.m_BtBegin.active = false;
	},

	OnEventLookCard:function()
	{
		if(this.m_GameClientEngine.m_bGaming == false) return;
		var status = this.GetPlayStatus();
		var meChairID = this.m_GameClientEngine.GetMeChairID();
		var wViewID = this.SwitchViewChairID(meChairID);
		var cbCardData = new Array();
		var cbCradCount = this.m_UserCardControl[wViewID].GetCardData(cbCardData, 5);
		//console.log("====OnEventLookCard===");
		for(var i = 0; i < cbCradCount; i++)
		{
			if(this.m_UserCardControl[wViewID].m_cbCardData[i] == 0)
			{
				cbCardData[i] = status.cbCardData[meChairID][i];
			}
			else
			{
				cbCardData[i] = this.m_UserCardControl[wViewID].m_cbCardData[i];
			}
		}
		this.m_UserCardControl[wViewID].SetCardData(cbCardData, cbCradCount, this.m_bPublic);
		this.SetMeCardPoint(status.dwMeAllCardPoint);
	},
	OnEventLookEnd:function()
	{
		if(this.m_GameClientEngine.m_bGaming == false) return;
		//console.log("====OnEventLookEnd===");
		var status = this.GetPlayStatus();
		var meChairID = this.m_GameClientEngine.GetMeChairID();
		var wViewID = this.SwitchViewChairID(meChairID);
		var cbCardData = new Array();
		var cbCradCount = this.m_UserCardControl[wViewID].GetCardData(cbCardData, 5);
		for(var i = 0; i < GameDef.MAX_COUNT; i++)
		{
			if(i < 2)
			{
				cbCardData[i] = 0;
			}
		}
		this.m_UserCardControl[wViewID].SetCardData(cbCardData, cbCradCount, this.m_bPublic);
		if(status.bGiveUp[meChairID]) this.m_UserCardControl[wViewID].SetGiveUp();
		this.SetMeCardPoint(status.dwLightCardPoint[meChairID]);
	},
    //调整控件
    RectifyControl: function (nWidth, nHeight) {
    	for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
			this.m_UserFaceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
			this.m_UserVoiceArr[i] = cc.v2(this.m_UserChatArr[i].x,this.m_UserChatArr[i].y);
            this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x+50,this.m_UserPosArr[i].y+50);

			if(this.m_UserCardControl && this.m_UserCardControl[i]) {
				this.m_UserCardControl[i].SetBenchmarkPos(this.m_CardCtrlPosArr[i].x, this.m_CardCtrlPosArr[i].y, this.m_CardCtrlEnMode[i]);
				this.m_UserCardControl[i].SetScale(this.m_CardCtrlScale[i], this.m_CardCtrlScale[i]);
			}
		}

		this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0, 150), this.m_CardCtrlPosArr);
    },
    // update (dt) {},

    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
		this.m_pIClientUserItem[wChairID] = pUserItem;
		if(this.m_UserInfo[wChairID] == null)
		{
			this.Init();
		}
		if(this.m_UserInfo && this.m_UserInfo[wChairID]) {
			this.m_UserInfo[wChairID].SetUserItem(pUserItem);
			this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
			this.m_UserState[wChairID].ShowUserReady(pUserItem.GetUserStatus() == US_READY);
		}

        if(!this.m_GameClientEngine.m_ReplayMode && wChairID == GameDef.MYSELF_VIEW_ID){
            if(this.m_ChatControl == null){
                this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                }.bind(this));
            }

            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.node,function(Js){
                    this.m_VoiceCtrl = Js;
					this.m_VoiceCtrl.InitVoice(this);
                    var NdButton = this.m_VoiceCtrl.node.getChildByName('Voice').getChildByName('btVoice');
                    NdButton.setPosition(595,-310);
                }.bind(this));
            }

            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                    this.m_FaceExCtrl = Js;
                }.bind(this));
			}
		}
		this.scheduleOnce(function(){this.UpdateGPS();}, 5);

    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(pUserItem.GetUserStatus() == US_READY) {
			this.m_UserState[wChairID].ShowUserReady(true);
        }else{
            this.m_UserState[wChairID].HideState();
        }
		this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
		if(pUserItem.GetUserStatus() == US_OFFLINE) {
            cc.gSoundRes.PlayGameSound('LEFT_WARN');
		}
    },
    OnUserLeave :function (pUserItem, wViewChairID) {
		if(this.m_UserInfo[wViewChairID]) this.m_UserInfo[wViewChairID].UserLeave(pUserItem);
		this.m_pIClientUserItem[wViewChairID] = null;
		if(this.m_UserState[wViewChairID]) this.m_UserState[wViewChairID].Reset();

		if(this.m_GameClientEngine.m_dwClubID != 0 || (this.m_dwServerRules & SERVER_RULES_DK))
		{
			var wSmallChairID = INVALID_CHAIR;
			for(var i = 0; i < GameDef.GAME_PLAYER; i++)
			{
				if(this.m_pIClientUserItem[i] != null && this.m_pIClientUserItem[i].GetChairID() < wSmallChairID)
				{
					wSmallChairID = this.m_pIClientUserItem[i].GetChairID();
				}
			}
			var pUserItem = this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID];
			var wMeChairID = this.m_GameClientEngine.GetMeChairID();
			// if(this.m_GameClientEngine.m_wGameProgress == 0  && wSmallChairID == wMeChairID && pUserItem && pUserItem.GetUserStatus() != US_READY)
			// {
			// 	this.m_BtBegin.active = !this.m_GameClientEngine.m_bLookMode;
			// 	this.m_BtStart.active = false;
			// }
			// else
			// {
			// 	this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
			// 	this.m_BtBegin.active = false;
			// }
			this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
		}
		this.UpdateGPS();
	},

    OnUserScore :function (pUserItem, wChairID) {
		this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem);
	},

    //设置警告
    SetViewRoomInfo:function (dwServerRules,dwRulesArr) {
        this.UpdateClubID();
        this.m_LbTableID.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
		this.m_GameRules = GameDef.GetRulesStr(dwServerRules,dwRulesArr);
		this.m_dwRules = dwRulesArr[0];
		this.m_dwServerRules = dwServerRules;
		//this.m_BtGPS.active = GameDef.IsNoCheat(this.m_dwRules);
		this.m_BtChat.active = true;//(dwRules & GameDef.GAME_TYPE_NO_TALK) == 0 ? true : false;
		this.UpdateRoomProgress();
		this.schedule(this.OperateVoice, 0.2);

		var bShow = this.m_GameClientEngine.IsLookonMode();
		if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
			if(dwRulesArr[0] & GameDef.GAME_TYPE_SCORE_1_5){
			for(var i = 0; i < 5; ++ i) {
			this.m_btJettons[i] = this.m_ChooseJettonLayer.getChildByName('ButtonLayout').getChildByName('btJetton'+i).getComponent(cc.Button);
			}
		}else if(dwRulesArr[0] & GameDef.GAME_TYPE_SCORE_1_10){
			this.$("ChooseJettonLayer/ButtonLayout/btJetton0/label@Label").string = 1;
			this.$("ChooseJettonLayer/ButtonLayout/btJetton1/label@Label").string = 2;
			this.$("ChooseJettonLayer/ButtonLayout/btJetton2/label@Label").string = 3;
			this.$("ChooseJettonLayer/ButtonLayout/btJetton3/label@Label").string = 5;
			this.$("ChooseJettonLayer/ButtonLayout/btJetton4/label@Label").string = 10;
		}
	},
	OperateVoice:function()
    {
        if(this.m_VoiceCtrl)
        {
            console.log("rule:"+GameDef.IsNoVoice(this.m_dwRules));
           this.m_VoiceCtrl.node.active = GameDef.IsNoVoice(this.m_dwRules);
           this.unschedule(this.OperateVoice);
        }
    },
    UpdateRoomProgress:function () {
		this.m_LbGameProgress.string = '局数: ' + GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
	},

    //转换椅子
    SwitchViewChairID:function (wChairID) {
		return this.m_GameClientEngine.SwitchViewChairID(wChairID);
	},

	GetUser:function(wChairID) {
		if (wChairID < GameDef.GAME_PLAYER) {
			return this.m_UserInfo[this.SwitchViewChairID(wChairID)];
		}
		return null;
	},

    ResetGameView: function (ReplayMode) {
		for(var i = 0; i < this.m_UserCardControl.length; ++ i) {
			if(this.m_UserCardControl && this.m_UserCardControl[i]) {
				this.m_UserCardControl[i].SetCardData(null, 0);
			}
			if(this.m_GiveUpFlag && this.m_GiveUpFlag[i]) {
				this.m_GiveUpFlag[i].node.active = false;
			}
		}
		for (i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(this.m_UserInfo && this.m_UserInfo[i]) {
				this.m_UserInfo[i].node.active = (i < this.m_pIClientUserItem.length && this.m_pIClientUserItem[i] != null);
				if(this.m_bLanGuo == false)
				{
					this.m_UserInfo[i].setTableScore(0);
					this.m_UserInfo[i].setTurnScore(0);
				}
				this.m_UserInfo[i].SetLookCard(false);
			}
			this.ShowUserAction(i, GameDef.ACTION_NULL);
			if(this.m_WinScore[i]) this.m_WinScore[i].node.active = false;
			if(this.m_LoseScore[i]) this.m_LoseScore[i].node.active = false;
		}
		if(this.m_bLanGuo == false)
		{
			this.m_TotalTableScore.string = "0";
		}
		this.HideChooseJettonLayer();
		this.HideGameButtonLayer();
		this.SetUserCardPoint();
		this.SetUserCardType();
		var pUserItem = this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID];
		// 不是回放 不是准备状态
		if(!this.m_GameClientEngine.m_ReplayMode && pUserItem && pUserItem.GetUserStatus() != US_READY)
		{
			var kernel = gClientKernel.get();
			var PlayerCount = 0;
			if(this.m_GameClientEngine.m_dwClubID != 0 || (this.m_dwServerRules & SERVER_RULES_DK))
			{
				for(var i = 0; i < GameDef.GAME_PLAYER; i++)
				{
					if(this.m_pIClientUserItem[i] != null && this.m_pIClientUserItem[i].GetUserStatus() == US_SIT)
					{
						PlayerCount++;
					}
				}
			}
			// if(this.m_GameClientEngine.m_wGameProgress == 0
			// 	&& (this.m_GameClientEngine.m_dwCreater == kernel.mMeUserItem.GetUserID() && (this.m_dwServerRules & SERVER_RULES_DK) == 0)  || ((this.m_GameClientEngine.m_dwClubID != 0 || (this.m_dwServerRules & SERVER_RULES_DK)) && PlayerCount == 1))
			// {
			// 	this.m_BtBegin.active = !this.m_GameClientEngine.m_bLookMode;
			// 	this.m_BtStart.active = false;
			// }
			// else
			// {
			// 	this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
			// 	this.m_BtBegin.active = false;
			// }
			this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
		} else {
			this.m_BtStart.active = false;
			// this.m_BtBegin.active = false;
		}
		this.m_LanGuo.active = false;
		//this.m_OperateTimeOut.active = false;
	},

	updateUserScore: function() {


		// for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
		// 	if(!this.m_UserInfo[this.SwitchViewChairID(i)]) continue;
		// 	this.m_UserInfo[this.SwitchViewChairID(i)].SetUserScore(this.GetRoomStatus().llTotalScore[i]);
		// }
	},

	GetRoomStatus: function() {
		return this.m_GameClientEngine.m_RoomStatus;
	},

	GetPlayStatus: function() {
		return this.m_GameClientEngine.m_PlayStatus;
	},

	IsPlayerActive: function(wChairID) {
		// console.assert(wChairID != null && wChairID < GameDef.GAME_PLAYER, "invalid chair");
		// console.assert(this.m_GameClientEngine.m_PlayStatus != null, "m_PlayStatus is null");

		return wChairID < GameDef.GAME_PLAYER
			&& this.m_GameClientEngine.m_PlayStatus != null
			&& this.m_GameClientEngine.m_PlayStatus.bPlayStatus[wChairID]
			&& !this.m_GameClientEngine.m_PlayStatus.bGiveUp[wChairID];
	},

	GetActivePlayers: function() {
		var cbActiveState = new Array();
		for(var i = 0 ; i < GameDef.GAME_PLAYER; ++ i) {
			if(this.IsPlayerActive(i)) {
				cbActiveState[i] = 1;
			} else {
				cbActiveState[i] = 0;
			}
		}
		return cbActiveState;
	},

	ResetPlayStatus: function() {
		this.m_BtStart.active = false;
		// this.m_BtBegin.active = false;

		var wBankerUser = this.GetBankerUser();
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(!this.GetUser(i)) continue;
			this.GetUser(i).SetBanker(i == wBankerUser);
			this.m_UserInfo[this.SwitchViewChairID(i)].SetLookCard(this.m_GameClientEngine.m_PlayStatus.bLookCard[i]);
			this.m_JetNode.removeAllChildren();
			this.PlaceJetton(i, this.m_GameClientEngine.m_PlayStatus.llTableScore[i], 1);
		}

		this.updateUserCard();
		this.updateTableScore();
		this.OnChangeCurrentUser();
		this.SetUserCardPoint(this.GetPlayStatus().cbCardType, this.GetPlayStatus().dwLightCardPoint);
	},

	GetBankerUser: function() {
		return this.GetRoomStatus().wBankerUser;
	},

	GetCurrentUser: function() {
		return this.GetPlayStatus().wCurrentUser;
	},

	GetActionMask: function() {
		return this.GetPlayStatus().wActionMask;
	},

	updateTableScore: function() {
		var status = this.GetPlayStatus();
		this.m_TotalTableScore.string = "" + status.llTotalTableScore;
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(!this.GetUser(i)) continue;

			if (status.bPlayStatus[i]) {
				this.GetUser(i).setTableScore(status.llTableScore[i]);
				this.GetUser(i).setTurnScore(status.llTurnScore[i]);
			}
		}
	},

	updateUserCard: function(bShowAll) {

		var status = this.GetPlayStatus();
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if (status.bPlayStatus[i]) {
				var wViewID = this.SwitchViewChairID(i);
				if(bShowAll)
				{
					this.m_UserCardControl[wViewID].SetCardData(status.cbCardData[i], status.cbCardCount[i], status.bPublic[i]);
				}
				else
				{
					if(wViewID == GameDef.MYSELF_VIEW_ID)
					{
						var cbCardData = new Array();
						for(var j = 0; j < GameDef.MAX_COUNT; j++)
						{
							if(j < 2)
							{
								cbCardData[j] = 0;
							}
							else
							{
								cbCardData[j] = status.cbCardData[i][j];
							}
						}
						this.m_UserCardControl[wViewID].SetCardData(cbCardData, status.cbCardCount[i], status.bPublic[i]);
					}
					else
					{
						this.m_UserCardControl[wViewID].SetCardData(status.cbCardData[i], status.cbCardCount[i], status.bPublic[i]);
					}
				}

				if (status.bGiveUp[i] && !this.m_GameClientEngine.m_ReplayMode) {
					// 亮底控制
					if(!this.m_bOpenCard || !(this.m_dwRules & GameDef.GAME_TYPE_END_SHOW_CARD)) {
						this.m_UserCardControl[wViewID].SetGiveUp();
						this.m_GiveUpFlag[wViewID].node.active = true;
					}
				}
			}
		}
	},

	OnGameStart: function(bIsLanGuo, llDiScore) {
		this.m_BtStart.active = false;
		// this.m_BtBegin.active = false;
		this.updateTableScore();
		var status = this.GetPlayStatus();
		var wBankerUser = this.GetBankerUser();
		this.m_BtFriend.active = false;
		if(bIsLanGuo == false)
		{
			this.m_JetNode.removeAllChildren();

		}
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.m_WinScore[i].node.active = false;
			this.m_LoseScore[i].node.active = false;
			if(!this.GetUser(i)) continue;
			this.GetUser(i).SetBanker(i == wBankerUser);
			if (llDiScore[i] > 0) {
				this.PlaceJetton(i, llDiScore[i], 1);
			}
		}
	},

	OnGameEnd: function(pCmdGameEnd) {
		this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
		// this.m_BtBegin.active = false;
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			this.m_WinScore[i].node.active = false;
			this.m_LoseScore[i].node.active = false;
		}
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			if(this.GetPlayStatus().bPlayStatus[i]) {
				var wViewChairID = this.SwitchViewChairID(i);
				this.GetRoomStatus().llTotalScore[i] += pCmdGameEnd.llGameScore[i];
				//this.m_UserInfo[wViewChairID].SetUserScore(this.GetRoomStatus().llTotalScore[i]);
				if(pCmdGameEnd.llGameScore[i] > 0) {
					this.m_WinScore[wViewChairID].string = '+'+pCmdGameEnd.llGameScore[i];
					this.m_WinScore[wViewChairID].node.active = true;
				} else {
					this.m_LoseScore[wViewChairID].string = pCmdGameEnd.llGameScore[i];
					this.m_LoseScore[wViewChairID].node.active = true;
				}
			}
		}

		this.SetUserCardPoint();
	},

	OnSendStartCard: function() {
		this.m_bOpenCard = false;
		this.m_LanGuo.active = false;
		for (i in this.m_GiveUpFlag) {
			this.m_GiveUpFlag[i].node.active = false;
		}

		for (i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.m_UserInfo[i].SetLookCard(false);
		}

        for (var i in this.m_UserCardControl) {
            this.m_UserCardControl[i].SetCardData(null, 0);
		}
		this.SetUserCardPoint();
		this.SetUserCardType();

		var wBankerUser = this.GetBankerUser();
		var cbCardData = new Array();
		var cbCardCount = 2;
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			cbCardData[i] = new Array();
			for(var j = 0; j < cbCardCount; ++ j) {
				cbCardData[i][j] = 0;
			}
		}
		this.m_SendCardCtrl.PlaySendCard(this.GetPlayStatus().bPlayStatus, wBankerUser, cbCardData, cbCardCount);
		cc.gSoundRes.PlayGameSound("SEND_CARD");

	},

	OnNewTurn: function(cbCardData, bPublic) {
		var fDelay = 0.0;

		this.updateTableScore();

		var wBankerUser = this.GetBankerUser();

		var cbCardDataTemp = new Array();
		var cbCardCount = 1;
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			cbCardDataTemp[i] = new Array();
			for(var j = 0; j < cbCardCount; ++ j) {
				cbCardDataTemp[i][j] = cbCardData[i];
			}
		}
		this.m_bPublic = bPublic[this.m_GameClientEngine.GetMeChairID()];
		this.m_SendCardCtrl.PlaySendCard(this.GetActivePlayers(), wBankerUser, cbCardDataTemp, cbCardCount, bPublic);
		cc.gSoundRes.PlayGameSound("SEND_CARD");

		for (i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.ShowUserAction(i, GameDef.ACTION_NULL);
		}

		this.scheduleOnce(function(){this.OnChangeCurrentUser();}, fDelay);
	},

	OnUserAction: function(wChairID, wActionCode, wMultiple, llAddScore) {
		var wViewID = this.SwitchViewChairID(wChairID)

		if (llAddScore > 0) {
			this.updateTableScore();
			this.PlaceJetton(wChairID, llAddScore, wMultiple);
		}

		this.ShowUserAction(wViewID, wActionCode);

		switch (wActionCode) {
			case GameDef.ACTION_ADD_SCORE:
				cc.gSoundRes.PlayGameSound('ADD_SCORE');
				break;
			case GameDef.ACTION_GIVEUP:

				this.m_UserCardControl[wViewID].SetGiveUp();
				this.m_GiveUpFlag[wViewID].node.active = true;
				break;
		}

		this.OnChangeCurrentUser();
	},

	OnLookCard: function(wChairID) {
		this.updateUserCard();
		if (wChairID == this.m_GameClientEngine.GetMeChairID()) {
			this.UpdateJettonButtons();
		}
		this.m_btLookCard.node.active = false;
		this.m_UserInfo[this.SwitchViewChairID(wChairID)].SetLookCard(true);
	},

	OnOpenCard: function(pOpenCard) {
		this.m_bOpenCard = true;
		this.updateUserCard(true);
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.ShowUserAction(i, GameDef.ACTION_NULL);
		}

		if (pOpenCard.wMaxUser != INVALID_CHAIR) {
			this.GetJettons(pOpenCard.wMaxUser);
			this.m_bLanGuo = false;
		} else {
			this.m_LanGuo.active = true;
			this.m_bLanGuo = true;
		}

		this.SetUserCardType(pOpenCard.cbCardType, pOpenCard.dwCardPoint);
	},

	GetJettonPosByViewID: function(wViewID) {
		return this.m_UserPosArr[wViewID];
	},

	GetJettons: function(wChairID) {
		var wViewID = this.SwitchViewChairID(wChairID)
		var jettonPos = this.GetJettonPosByViewID(wViewID);
		for (var idx in this.m_JetNode.children) {
			var jetton = this.m_JetNode.children[idx];
			jetton.runAction(cc.sequence(cc.moveTo(0.6 + Math.random(), jettonPos).easing(cc.easeSineIn()), cc.delayTime(0.1), cc.hide(), ));
		}

		// this.scheduleOnce(function() {
		// 	this.m_JetNode.removeAllChildren();
		// }, 0.7);
	},

	PlaceJetton: function(wChairID, llAddScore, wMultiple) {
		if(llAddScore <= 0) return;
		var jetton = this.CreateJetton(llAddScore, wMultiple);
		if (jetton != null) {
			this.m_JetNode.addChild(jetton);
			jetton.angle = (Math.random() * 360);
			var areaSize = this.m_JetNode.getContentSize();
			var xDest = (Math.random() - 0.5) * areaSize.width;
			var yDest = (Math.random() - 0.5) * areaSize.height;

			var wViewID = this.SwitchViewChairID(wChairID)
			var jettonPos = this.GetJettonPosByViewID(wViewID);

			if(this.m_GameClientEngine.m_ReplayMode)
			{
				jetton.setPosition(cc.v2(xDest, yDest));
			}
			else
			{
				jetton.setPosition(jettonPos);
				jetton.runAction(cc.jumpTo(0.5, cc.v2(xDest, yDest), 50, 1).easing(cc.easeSineOut()));
			}
		}
	},

	ResumeAllJetton:function(cbScore, cbMultiple)
	{
		if(cbScore <= 0) return;
		var jetton = this.CreateJetton(cbScore, cbMultiple);
		if (jetton != null) {
			this.m_JetNode.addChild(jetton);
			jetton.angle = (Math.random() * 360);
			var areaSize = this.m_JetNode.getContentSize();
			var xDest = (Math.random() - 0.5) * areaSize.width;
			var yDest = (Math.random() - 0.5) * areaSize.height;


			jetton.setPosition(cc.v2(0, 165));
			jetton.runAction(cc.jumpTo(0.5, cc.v2(xDest, yDest), 50, 1).easing(cc.easeSineOut()));
		}

	},

	ScoreToJettonIndex: function(llScore) {
		// var mul = Math.max(llScore / this.m_GameClientEngine.m_RoomStatus.llBaseScore, 1);
		// var idx = Math.floor(Math.log2(mul));
		// return idx;
	},

	CreateJetton: function(llScore, wMultiple) {
		if (this.m_JettonTemplates == null || this.m_JettonTemplates.length == 0) return null;

		var jetton =  null;

		var idx = wMultiple - 1;//this.ScoreToJettonIndex(llScore);
		// if (idx >= this.m_JettonTemplates.length)
		// 	idx = this.m_JettonTemplates.length - 1;

		if (this.m_JettonTemplates[idx]) {
			var jetton = cc.instantiate(this.m_JettonTemplates[idx]);
			if (jetton != null) {
				var label = jetton.getChildByName('label').getComponent(cc.Label);
				if (label) {
					label.string = llScore;
				}

				jetton.active = true;
			}
		}

		return jetton;
	},

	UpdateJettonButtons: function() {
		for (var i = 0; i < this.m_btJettons.length; i++) {
			if (this.m_btJettons[i]) {
				this.m_btJettons[i].node.active = false;
			}
		}
		var status = this.GetPlayStatus();
		var wChairID = this.m_GameClientEngine.GetMeChairID();
		var wActionMask = this.GetActionMask();
		var bShowAdd2 = ((wActionMask&(GameDef.ACTION_ADD_SCORE|GameDef.ACTION_KICK_TWO)) != 0);

		var nIndex = 0;
		for (var multiple = 1; multiple <= 5; multiple++) {

			//if (multiple == 2 && !bShowAdd2) break;

			var llScore = this.m_GameClientEngine.CalcAddScore(wChairID, multiple);

			// var idx = this.ScoreToJettonIndex(llScore);

			// if (idx >= this.m_btJettons.length)
			// 	idx = this.m_btJettons.length - 1;
			if (this.m_btJettons[nIndex]) {
				var btn = this.m_btJettons[nIndex];
				if(status.bAPao)
				{
					btn.node.active = multiple == 5;
				}
				else
				{
					btn.node.active = true;
				}
				btn.clickEvents[0].customEventData = multiple;
				var label = btn.node.getChildByName('label').getComponent(cc.Label);
				if (label) {
					label.string = llScore;
				}
			}
			nIndex++;
		}
	},

	OnChangeCurrentUser: function() {
		this.HideGameButtonLayer();

		var wCurrentUser = this.GetCurrentUser();
		var wActionMask = this.GetActionMask();

		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(!this.GetUser(i)) continue;
			this.GetUser(i).setCurrent(wCurrentUser == i);
		}

		if (wCurrentUser == this.m_GameClientEngine.GetMeChairID() && wActionMask != GameDef.ACTION_NULL) {
			this.m_GameButtonLayer.active = true;

			if(!this.m_GameClientEngine.m_PlayStatus.bLookCard[this.m_GameClientEngine.GetMeChairID()]) {
				//this.m_btLookCard.node.active = true;
			}

			if ((wActionMask & GameDef.ACTION_ADD_SCORE) != 0) {
				this.m_btAddScore.node.active = true;
				this.m_btGiveUp.node.active = !this.GetPlayStatus().bAPao;
			} else if ((wActionMask & GameDef.ACTION_FOLLOW) != 0) {
				this.m_btFollow.node.active = true;
				this.m_btGiveUp.node.active = true;
			} else if ((wActionMask & (GameDef.ACTION_KICK_ONE|GameDef.ACTION_KICK_TWO)) != 0) {
				this.m_btKick.node.active = true;
				this.m_btKickPass.node.active = true;
			} else {
				console.assert(false, "Error ActionMask " + wActionMask);
			}
		}

		this.UpdateJettonButtons();
	},

	PlayButtonEffect(btn) {
		cc.gSoundRes.PlaySound('Button');
	},


	OnBtStartClicked: function() {

		var playerCount = this.GetPlayerCount();
		var readyCount = this.GetReadyPlayerCount();
		//var kernel = gClientKernel.get();
		//var meChairID = this.m_GameClientEngine.GetMeChairID();
		//var wMeViewID = this.SwitchViewChairID(meChairID);
		//if(this.m_GameClientEngine.m_wGameProgress == 0 && (this.m_GameClientEngine.m_dwCreater == kernel.mMeUserItem.GetUserID() || this.m_GameClientEngine.m_dwClubID != 0 && wMeViewID == this.GetFirstEnter()))
		{
			if(playerCount == 1)
			{
				var desc = '玩家数量为2-'+GameDef.GetPlayerCount(this.m_dwRules)+'人可开始游戏！';
				this.ShowAlert(desc);
				return;
			}
			if(playerCount > readyCount+1)
			{
				this.ShowAlert("有玩家尚未准备，无法开始游戏！");
				return;
			}
			if(playerCount < GameDef.GetPlayerCount(this.m_dwRules) && playerCount <= readyCount+1)
			{
				var desc = '当前玩家为'+playerCount+'人，是否开始游戏？';
				this.ShowAlert(desc, Alert_All, function(Res)
				{
					if(Res)
					{
						if(playerCount != this.GetPlayerCount())
						{
							this.ShowTips('人数有变动！');
							return;
						}
						this.m_GameClientEngine.SendFrameData(SUB_GF_GAME_START);
					}
				}.bind(this));
				return;
			}

			this.m_GameClientEngine.SendFrameData(SUB_GF_GAME_START);
		}
		this.ResetGameView();
		this.m_BtStart.active = false;
		// this.m_BtBegin.active = false;
	},
	OnBtReadyClicked:function()
	{
		this.m_GameClientEngine.SendFrameData(SUB_GF_USER_READY);
		this.ResetGameView();
		this.m_BtStart.active = false;
		// this.m_BtBegin.active = false;
	},

	OnBtAddScoreClicked: function() {
		this.ShowChooseJettonLayer();
	},

	OnBtKickClicked: function() {
		this.ShowChooseJettonLayer();
	},

	OnBtFollowClicked: function() {
		this.HideGameButtonLayer();
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_FOLLOW);
		this.m_GameClientEngine.KillGameClock();
	},

	OnBtKickPassClicked: function() {
		this.HideChooseJettonLayer();
		this.HideGameButtonLayer();
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_KICK_PASS);
		this.m_GameClientEngine.KillGameClock();
	},

	OnBtGiveUpClicked: function() {
		this.HideChooseJettonLayer();
		this.HideGameButtonLayer();
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_GIVEUP);
		this.m_GameClientEngine.KillGameClock();
	},

	OnBtLookCardClicked: function() {
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_LOOK_CARD);
	},

	OnBtJettonClicked: function(evt, data) {
		this.HideChooseJettonLayer();
		this.HideGameButtonLayer();
		var status = this.GetPlayStatus();
		status.bAPao = false;

		var userAction = GameDef.CMD_C_UserAction();
		userAction.wMultiple = data;

		if (this.m_GameClientEngine.m_PlayStatus.wActionMask == GameDef.ACTION_ADD_SCORE) {
			this.m_GameClientEngine.SendGameData(GameDef.SUB_C_ADD_SCORE, userAction);
		} else {
			this.m_GameClientEngine.SendGameData(GameDef.SUB_C_KICK, userAction);
		}
		this.m_GameClientEngine.KillGameClock();
	},

    //聊天按钮回调
    OnBtChatClicked: function () {
		//if(this.m_dwRules & GameDef.GAME_TYPE_NO_TALK) return this.ShowTips('禁止聊天');
    	this.m_ChatControl.node.active = true;
    	this.m_ChatControl.ShowSendChat(true);
    },

    // OnBtShowGPS:function(){
	// 	if(this.m_TableGPSCtrl)
    //     {
    //         this.m_TableGPSCtrl.ShowView();
    //         this.m_GameClientEngine.GetTableUserGPS();
    //     }
    // },
    OnGPSAddress:function(GPSInfo){
		if(this.m_TableGPSCtrl)
		{
			this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem);
			this.m_TableGPSCtrl.SetUserAddress(this.m_pIClientUserItem, GPSInfo);
		}
		// for(var i = 0; i < GameDef.GAME_PLAYER; i++)
        // {
        //     if(this.m_pIClientUserItem[i] != null)
        //     {
		// 		this.m_TableGPSCtrl.SetUserAddress(this.m_pIClientUserItem[i], GPSInfo);

        //     }
        // }
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(!this.m_GameClientEngine.GetClientUserItem(i)) continue;
            for(var j in GPSInfo){
				if(this.m_GameClientEngine.GetClientUserItem(i).GetUserID() == GPSInfo[j].dwUserID)
				{
					var wViewID = this.m_GameClientEngine.SwitchViewChairID(i);
                    this.m_strAddress[wViewID] = GPSInfo[j].szAddress;
                    //this.m_strAddress[wViewID] = GPSInfo[j].szDistance;
                }
            }
        }
	},

	OnBtCancelTrustee:function()
	{
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_CANCEL_TRUSTEE, null);
		this.m_OperateTimeOut.active = false;
	},

	HideGameButtonLayer: function() {
		this.m_GameButtonLayer.active = false;
		this.m_btAddScore.node.active = false;
		this.m_btFollow.node.active = false;
		this.m_btKick.node.active = false;
		this.m_btKickPass.node.active = false;
		this.m_btGiveUp.node.active = false;
		this.m_btLookCard.node.active = false;
	},

	HideChooseJettonLayer: function() {
		if(this.m_ChooseJettonLayer) this.m_ChooseJettonLayer.active = false;
	},

	ShowChooseJettonLayer: function() {
		if(this.m_ChooseJettonLayer) this.m_ChooseJettonLayer.active = true;
	},

	ShowUserAction: function(wViewID, wAction) {
		var sp = this.m_UserActionFlag[wViewID];
		if(!sp) return;

		var spName = null;

		switch (wAction) {
			case GameDef.ACTION_FOLLOW:
				this.m_GameClientEngine.PlayActionSound(wViewID, 'Follow_' + (Math.round(Math.random() * 100) % 3 + 1) );
				spName = 'Game52041_DY_dk_genle';
				break;
			case GameDef.ACTION_KICK_ONE:
				this.m_GameClientEngine.PlayActionSound(wViewID, 'Kick_' + (Math.round(Math.random() * 100) % 3 + 1));
				spName = 'Game52041_DY_dk_qijiao';
				break;
			case GameDef.ACTION_KICK_TWO:
				this.m_GameClientEngine.PlayActionSound(wViewID, 'Kick_' + (Math.round(Math.random() * 100) % 3 + 1));
				spName = 'Game52041_DY_dk_qijiao';
				break;
			case GameDef.ACTION_KICK_PASS:
				this.m_GameClientEngine.PlayActionSound(wViewID, 'NoKick_' +  + (Math.round(Math.random() * 100) % 2 + 1));
				spName = 'Game52041_DY_dk_buti';
				break;
			case GameDef.ACTION_GIVEUP:
				this.m_GameClientEngine.PlayActionSound(wViewID, 'GiveUp_1');
				//spName = 'Game52041_DY_dk_koule';
				break;
			default:
				break;
		}

		sp.node.active = true;
		this.m_UserActionFlag[wViewID].node.active = false;
		if (spName != null) {
			var frame = this.m_Atlas.getSpriteFrame(spName);
			if (frame != null) {
				this.m_UserActionFlag[wViewID].spriteFrame = frame;
				this.m_UserActionFlag[wViewID].node.active = true;
			}
		}
	},

	//初始化牌
	InitTableCard:function(){
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.m_UserCardControl[i].SetCardData(null, 0);
		}
	},

    SetUserState:function(wViewID, State, Cnt){
		if(this.m_UserState[0] == null)
		{
			this.Init();
		}
		if(wViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[wViewID].ShowUserState(State, Cnt);
        }
	},

	//设置定时器
	SetUserTimer:function (wChairID, wTimer){
		if(this.m_UserState[0] == null)
		{
			this.Init();
		}
		for(var i=0;i<GameDef.GAME_PLAYER;i++) {
			this.m_UserState[i].ShowClock(i==wChairID);
		}
		if(wChairID == INVALID_CHAIR) return
		this.m_UserState[wChairID].SetClockNum(wTimer);
	},

	//发牌完成 para = [wChairID, wViewID, cbCardData]
    OnMessageDispatchFinish: function (para, ActCard) {
		//设置扑克
		//console.log("====OnMessageDispatchFinish===", para[0], para[1], para[2], para[3]);
		this.m_UserCardControl[para[1]].AddCard(para[2], para[3]);
    	//发牌过程
    	if (ActCard <= 0) {
			//设置扑克
    		// this.updateUserCard();
    	}
	},

	SetUserCardPoint: function(cbCardType, dwCardPoint) {
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			if(this.m_CardPoint[i]) this.m_CardPoint[i].string = '';
		}
		// if(!cbCardType || !dwCardPoint) return;

		// for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
		// 	var wViewChairID = this.SwitchViewChairID(i);
		// 	if(cbCardType[i] == 0 && dwCardPoint[i] == 0) continue;
		// 	if(cbCardType[i] != 0) continue;
		// 	this.m_CardPoint[wViewChairID].string = dwCardPoint[i] + '点';
		// }

		if(!dwCardPoint) return;

		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			var wViewChairID = this.SwitchViewChairID(i);
			if(dwCardPoint[i] == 0) continue;
			if(this.m_CardPoint[wViewChairID]) this.m_CardPoint[wViewChairID].string = dwCardPoint[i] + '点';
		}
	},
	SetMeCardPoint:function(dwCardPoint)
	{
		var meChairID = this.m_GameClientEngine.GetMeChairID();
		var wViewID = this.SwitchViewChairID(meChairID);
		if(this.m_CardPoint[wViewID]) this.m_CardPoint[wViewID].string = dwCardPoint + '点';
	},

	SetUserCardType: function(cbCardType, dwCardPoint) {
		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			if(this.m_CardType[i]) this.m_CardType[i].string = '';
		}
		if(!cbCardType || !dwCardPoint) return;

		for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
			var wViewChairID = this.SwitchViewChairID(i);
			if(cbCardType[i] == 0 && dwCardPoint[i] == 0) continue;
			switch(cbCardType[i]) {
				case GameDef.CT_BAO_ZI: 	{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '豹子'; break;			}
				case GameDef.CT_LINE_3: 	{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '同花三顺子'; break;	}
				case GameDef.CT_LINE_4: 	{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '同花四顺子'; break;	}
				case GameDef.CT_DOUBLE_BAO: { if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '双豹子'; break;		}
				case GameDef.CT_T4: 		{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '四条'; break;			}
				case GameDef.CT_LINE_5: 	{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '同花五顺子'; break;	}
				case GameDef.CT_T5: 		{ if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = '五条'; break;			}
				default: if(this.m_CardType[wViewChairID]) this.m_CardType[wViewChairID].string = dwCardPoint[i] + '点';
			}
		}
	},

	//更新gps
    UpdateGPS:function()
    {
        if(!GameDef.IsNoCheat(this.m_dwRules)) return;
        for (var i = 0; i <GameDef.GAME_PLAYER; i++)
        {
            this.m_ShowDistance[i] = false;
            if(this.m_UserInfo[i]) this.m_UserInfo[i].SetDisWarning(false);
        }
        this.m_GameClientEngine.GetTableUserGPS();
    },

    //距离报警
    ShowDistance:function(level, fromID, toID)
    {
        if(this.m_ShowDistance[fromID] && this.m_ShowDistance[toID]) return;
        var kernel = gClientKernel.get();
        var fromUserItem=this.m_pIClientUserItem[fromID];
        var toUserItem = this.m_pIClientUserItem[toID];

        if( fromUserItem == null ) return;
		if( toUserItem == null) return;
		if(level == 2)
		{
			this.ShowTips(fromUserItem.GetNickName()+"与"+toUserItem.GetNickName()+"距离过近！");
		}

        this.m_ShowDistance[fromID] = true;
        this.m_ShowDistance[toID] = true;

        if(this.m_UserInfo[fromID]) this.m_UserInfo[fromID].SetDisWarning(true, level);
        if(this.m_UserInfo[toID]) this.m_UserInfo[toID].SetDisWarning(true, level);
	},
	SetTimeout:function(bShow)
	{
		this.m_OperateTimeOut.active = bShow;
	},
	//托管
	SetTrustee:function(wChairID, bShow)
	{
		var wViewID = this.SwitchViewChairID(wChairID);
		this.m_UserInfo[wViewID].SetTrustee(bShow);
		if(wViewID == GameDef.MYSELF_VIEW_ID)
		{
			this.SetTimeout(bShow);
		}
	},
	GetPlayerCount:function()
	{
		var Count = 0;
		for(var i in this.m_pIClientUserItem)
		{
			if(this.m_pIClientUserItem[i] != null)
			{
				Count++;
			}
		}
		return Count;
	},
	GetReadyPlayerCount:function()
	{
		var Count = 0;
		for(var i in this.m_pIClientUserItem)
		{
			if(this.m_pIClientUserItem[i] != null && this.m_pIClientUserItem[i].GetUserStatus() == US_READY)
			{
				Count++;
			}
		}
		return Count;
	},
});

