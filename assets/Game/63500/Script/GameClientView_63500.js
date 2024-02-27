cc.Class({
    extends: cc.GameView,

    properties: {
		m_Atlas:cc.SpriteAtlas,
		m_CardCtrlPrefab: cc.Prefab,
		m_UserStatePrefab: cc.Prefab,
		m_DiCardPrefab: cc.Prefab,
		m_CardTypePrefab: cc.Prefab,
		m_TotalTableScore: cc.Label,
		m_BtChat:cc.Node,

		//各种按钮
		m_GameButtonLayer:cc.Node,
		m_btAddScore:cc.Button,
		m_btFollow:cc.Button,
		m_btGiveUp:cc.Button,
		m_btRangCard:cc.Button,
		m_AddNode: cc.Node,
		m_AddButtonNode: cc.Node,
		m_GuoNode:cc.Node,
		m_allNode:cc.Node,
		m_lbFollow:cc.Label

    },

	ctor: function() {
        this.m_CardTestName = 'UserCheatCtrl';

		this.m_pIClientUserItem = [];
		this.m_lBaseScore = 1;
		this.m_dwRules = 0;
		this.m_dwServerRules = 0;
		this.JETTON_TYPES = 3;
		this.m_bOpenCard = false;
		this.m_JettonTemplates = new Array();
		this.m_UserInfo = new Array();
		this.m_UserCardControl = new Array();
		this.m_UserCardType = new Array();

		this.m_UserState = new Array();
		this.m_UserStatePosArr = new Array();
		this.m_UserFaceArr = new Array();
		this.m_CardCtrlPosArr = new Array();
		this.m_UserScaleArr = new Array(
            1,
            1,
            1.2,
            1,
			1,
            1,
            1,
            1,
            1,
            1
        );
		this.m_UserPosArr = new Array(
			cc.v2(428,111),
			cc.v2(542,-59),
			cc.v2(-424,-232),
			cc.v2(-542,-59),
			cc.v2(-428,111),
			cc.v2(-193,232),
			cc.v2(5,262),
			cc.v2(210,268),
			cc.v2(-11,256),
			cc.v2(184,232),
		);
		this.m_CardCtrlPosArr = new Array(
			cc.v2(287,0),
			cc.v2(401,-90),
			cc.v2(-154,-363),
			cc.v2(-451,-90),
			cc.v2(-400,0),
			cc.v2(-163,110),
			cc.v2(-25,120),
			cc.v2(100,130),
			cc.v2(-11,256),
			cc.v2(184,232),
		);
		this.m_CardTypePosArr = new Array(
			cc.v2(207,0),
			cc.v2(321,-90),
			cc.v2(-140,-333),
			cc.v2(-451,-90),
			cc.v2(-400,0),
			cc.v2(-163,110),
			cc.v2(-25,120),
			cc.v2(100,130),
			cc.v2(-11,256),
			cc.v2(184,232),
		);
		this.m_CardCtrlEnMode = new Array(
			enXLeft,
			enXLeft,
			enXLeft,
			enXRight,
			enXRight,
		);
		this.m_CardCtrlScale = new Array(
			0.2,
			0.2,
			0.6,
			0.2,
			0.2,
			0.2,
			0.2,
			0.2,
			0.2,
			0.2,
		);
		this.m_UserChatArr = new Array();
        this.m_UserVoiceArr = new Array();
		this.m_strAddress = [
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!',
			'无法获取到位置信息!'
		];

		this.m_bInit = false;

		this.m_GameRules = '';
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
		this.m_RulesText = this.m_LbGameRules;
		this.m_subsumlun = this.m_LbGameProgress;
		this.m_TableNumber = this.m_LbTableID;
		this.m_ClubNum = this.m_LbClubID;

    	for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
			this.m_UserStatePosArr[i] = this.m_UserPosArr[i];
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


			this.m_UserCardType[i] = cc.instantiate(this.m_CardTypePrefab).getComponent('CardType_' + GameDef.KIND_ID);
			this.m_CardNode.addChild(this.m_UserCardType[i].node);
			this.m_UserCardType[i].SetCardType();
    		//用户状态
    		this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_' + GameDef.KIND_ID);
			this.m_UserNode.addChild(this.m_UserState[i].node);
			this.m_UserState[i].Init(this, i, this.m_UserStatePosArr[i]);
		}
		//发牌控件
		this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_'+GameDef.KIND_ID);
		this.m_SendCardCtrl.SetHook(this);


		this.m_DiPai = cc.instantiate(this.m_DiCardPrefab).getComponent('DiPai_' + GameDef.KIND_ID);
		this.m_DiPai.SetPos(cc.v2(0,70));
		this.m_CardNode.addChild(this.m_DiPai.node);
        this.m_DiPai.node.active = false;
		this.m_BtChat.active = false;
		this.RectifyControl(window.SCENE_WIGHT, window.SCENE_HEIGHT);
		this.ResetGameView();
	},

    //调整控件
    RectifyControl: function (nWidth, nHeight) {
    	for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
			this.m_UserFaceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x+50,this.m_UserPosArr[i].y+50);
			this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
			this.m_UserVoiceArr[i] = cc.v2(this.m_UserChatArr[i].x,this.m_UserChatArr[i].y);
			var bSelf = i == GameDef.MYSELF_VIEW_ID;

			if(this.m_UserCardControl && this.m_UserCardControl[i]) {
				this.m_UserCardControl[i].SetBenchmarkPos(this.m_CardCtrlPosArr[i].x, this.m_CardCtrlPosArr[i].y, this.m_CardCtrlEnMode[i]);
				this.m_UserCardControl[i].SetScale(this.m_CardCtrlScale[i], this.m_CardCtrlScale[i]);
				this.m_UserCardControl[i].SetCardDistance(bSelf?50:-90);
				this.m_UserCardControl[i].node.active = true;
				this.m_UserCardType[i].SetBenchmarkPos(this.m_CardTypePosArr[i].x, this.m_CardTypePosArr[i].y);

			}

			this.m_UserState[i].SetBenchmarkPos(this.m_UserFaceArr[i]);
		}
		this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0,0),this.m_UserPosArr);
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
            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                    this.m_FaceExCtrl = Js;
                }.bind(this));
			}
			
		}
		//this.scheduleOnce(function(){this.UpdateGPS();}, 5);
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
			this.m_BtStart.active = !this.m_GameClientEngine.m_bLookMode;
		}
		//this.UpdateGPS();
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
        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;

		//this.m_BtGPS.active = GameDef.IsNoCheat(this.m_dwRules);
		this.m_BtChat.active = true;//(dwRules & GameDef.GAME_TYPE_NO_TALK) == 0 ? true : false;
		this.UpdateRoomProgress();
		this.schedule(this.OperateVoice, 0.2);

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
		this.m_LbGameProgress.string = '局数: ' + GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
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
				this.m_UserCardControl[i].node.active = true;
				this.m_UserCardType[i].SetCardType();

			}

		}
		for (i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(this.m_UserInfo && this.m_UserInfo[i]) {
				this.m_UserInfo[i].node.active = (i < this.m_pIClientUserItem.length && this.m_pIClientUserItem[i] != null);
				this.m_UserInfo[i].SetUserWin(false);

			}
		}
		this.HideChooseJettonLayer();
		this.HideGameButtonLayer();

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
		var wBankerUser = this.GetBankerUser();
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(!this.GetUser(i)) continue;
			this.GetUser(i).SetBanker(i == wBankerUser);
			this.m_JetNode.removeAllChildren();
			this.PlaceJetton(i, this.m_GameClientEngine.m_PlayStatus.llTableScore[i], 1);
		}
		this.updateUserCard();
		this.OnChangeCurrentUser();
	},

	updateTableScore: function(Score) {
		//this.m_TotalTableScore.string = Score;
	},

	updateGameView:function(wCurrentUser,bShowAll){
		this.m_GameButtonLayer.active = false;
		this.m_AddNode.active = false;
		this.m_btFollow.active = false;
		this.m_AddButtonNode.active = (this.m_GameClientEngine.m_llUserScore < this.GetAddScore(3));
		for(var i = 0; i < GameDef.GAME_PLAYER; i++){
			this.m_UserInfo[this.m_GameClientEngine.SwitchViewChairID(i)].ShowCurrent(i==wCurrentUser);
		}
		if(this.m_GameClientEngine.GetMeChairID() != wCurrentUser) return;
		if(this.GetAddScore(3) <= this.m_GameClientEngine.m_llUserScore){
			this.m_btAddScore.active = false;
		}
		this.m_lbFollow.string = this.m_GameClientEngine.m_llUserScore;
		this.m_allNode.active = this.m_DiPai.node.active;
		this.m_GuoNode.active = this.m_GameClientEngine.m_bGuoPai;
		this.m_btFollow.active = true;
        

		this.m_GameButtonLayer.active = true;
	},
	updateUserType:function(wAddScoreUser,cbType){

		if(wAddScoreUser == INVALID_CHAIR){
			for(var i = 0; i < GameDef.GAME_PLAYER; i++){
				this.m_UserInfo[i].HideUserType();
			}
		}else{
			if(cbType == 10)return
			this.m_UserInfo[wAddScoreUser].SetUserType(cbType);

		}
	},

	updateUserScore:function(llUserScore,llTotalScore){

		for(var i = 0; i < GameDef.GAME_PLAYER; i++){
			if(this.m_GameClientEngine.m_bPlayStatus[i] == false)continue;
			var viewID = this.SwitchViewChairID(i);
			this.m_UserInfo[viewID].SetUserTableScore(llUserScore[i]+llTotalScore[i]);
		}
	},

	OnGameStart: function(bIsLanGuo, llDiScore) {
		this.m_BtStart.active = false;

		var wBankerUser = this.GetBankerUser();
		this.m_BtFriend.active = false;
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			if(!this.GetUser(i)) continue;
			this.GetUser(i).SetBanker(i == wBankerUser);
			if (llDiScore[i] > 0) {
				this.PlaceJetton(i, llDiScore[i], 1);
			}
		}
	},

	ShowCard:function(cbHandCardData,cbPlayStatus,bIsEnd){

		for(var i = 0; i < GameDef.GAME_PLAYER; i++){
			if(cbPlayStatus[i] == false)continue;
			var viewID = this.SwitchViewChairID(i);
			var CardTemp = new Array();
			CardTemp = cbHandCardData[i];
			if(viewID != GameDef.MYSELF_VIEW_ID && bIsEnd==false) CardTemp = [0,0];
			this.m_UserCardControl[viewID].SetCardData(CardTemp,2,false);
			this.m_UserCardControl[viewID].node.active = true;
		}
	},


	ShowCenterData:function(cbCenterCardData,cbSendCardCount){
		if(cbSendCardCount<3)return
        this.m_DiPai.node.active = true;
		if(cbSendCardCount == 3 ){
			for(var i = 0; i < 5; i++){
				this.m_DiPai.SetCardDataAni(cbCenterCardData,i);
			}
			return;
		}
		this.m_DiPai.SetCardDataAni(cbCenterCardData,cbSendCardCount-1);
		
	},

	ShowCenterDataEnd:function(cbCenterCardData,cbSendCardCount){
		if(cbSendCardCount<3)return
        this.m_DiPai.node.active = true;
		
		this.m_DiPai.ShowCenterData(cbCenterCardData,cbSendCardCount);
		
		return;
		
		
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
			if ((wActionMask & GameDef.ACTION_ADD_SCORE) != 0) {
				this.m_btAddScore.node.active = true;
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


	OnBtReadyClicked:function()
	{
		this.m_GameClientEngine.SendFrameData(SUB_GF_USER_READY);
		this.ResetGameView();
		this.m_BtStart.active = false;
	},
	OnBtGetLastGame:function()
	{
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_LAST_GAME);
	},
	OnBtAddScoreClicked: function(tag,Data) {
		this.m_GameClientEngine.ObSubAddScoreMessage(Data);
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
	},

    //聊天按钮回调
    OnBtChatClicked: function () {
		//if(this.m_dwRules & GameDef.GAME_TYPE_NO_TALK) return this.ShowTips('禁止聊天');
    	this.m_ChatControl.node.active = true;
    	this.m_ChatControl.ShowSendChat(true);
    },

	OnBtCancelTrustee:function()
	{
		this.m_GameClientEngine.SendGameData(GameDef.SUB_C_CANCEL_TRUSTEE, null);
	},

	OnBtClickedAdd:function(){
		
		this.$('GameButtonLayer/AddNode/Bt2/lb@Label').string = this.GetAddScore(1);
		this.$('GameButtonLayer/AddNode/Bt3/lb@Label').string = this.GetAddScore(2);
		this.$('GameButtonLayer/AddNode/Bt4/lb@Label').string = this.GetAddScore(3);

		this.$('GameButtonLayer/AddNode/Bt2').active = (this.m_GameClientEngine.m_llUserScore < this.GetAddScore(1));
		this.$('GameButtonLayer/AddNode/Bt3').active = (this.m_GameClientEngine.m_llUserScore < this.GetAddScore(2));
		this.$('GameButtonLayer/AddNode/Bt4').active = (this.m_GameClientEngine.m_llUserScore < this.GetAddScore(3));

		this.m_AddNode.active = true;
		this.m_AddButtonNode.active = false;
	},


	OnBtClickedRules:function(){

		this.m_GameClientEngine.ShowAlert(this.m_GameRules);
	},

	HideGameButtonLayer: function() {
		this.m_GameButtonLayer.active = false;

	},

	HideChooseJettonLayer: function() {
		if(this.m_ChooseJettonLayer) this.m_ChooseJettonLayer.active = false;
	},

	ShowChooseJettonLayer: function() {
		if(this.m_ChooseJettonLayer) this.m_ChooseJettonLayer.active = true;
	},


	//初始化牌
	InitTableCard:function(){
		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
			this.m_UserCardControl[i].SetCardData(null,0);
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
		this.$('ClockBG/Label@Label').string = wTimer;
		if(wTimer>0) this.$('ClockBG').active = true;
		else this.$('ClockBG').active = false;

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

	SetMeCardPoint:function(dwCardPoint)
	{
		var meChairID = this.m_GameClientEngine.GetMeChairID();
		var wViewID = this.SwitchViewChairID(meChairID);
		if(this.m_CardPoint[wViewID]) this.m_CardPoint[wViewID].string = dwCardPoint + '点';
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

	GetAddScore:function(cbType)
	{
		var llScore = new Array(4);
		for(var i = 0; i < 4; i++){
			llScore[i] = new Array(5);
		}
		 if (this.m_dwRules & GameDef.GAME_TYPE_SCORE_1){
			 //llScore = { { 4, 14, 18, 30, 2000 }, { 50, 80, 100, 150, 2000 }, { 300, 350, 450, 600, 2000 }, { 700, 850, 950, 1100, 2000 } };
			 llScore = [[4, 14, 18, 30, 2000 ],[50, 80, 100, 150, 2000],[300, 350, 450, 600, 2000],[700, 850, 950, 1100, 2000]];
		 	return llScore[this.m_GameClientEngine.m_wOperaCount][cbType];
		 }
		if (this.m_dwRules & GameDef.GAME_TYPE_SCORE_2){
			//llScore[4][5] = { { 10, 20, 40, 80, 3000 }, { 100, 150, 200, 300, 3000 }, { 400, 500, 600, 800, 3000 }, { 900, 1100, 1300, 1500, 3000 } };
			llScore = [[10, 20, 40, 80, 3000 ],[100, 150, 200, 300, 3000],[400, 500, 600, 800, 3000],[900, 1100, 1300, 1500, 3000]];

			return llScore[this.m_GameClientEngine.m_wOperaCount][cbType];
		}
		if (this.m_dwRules & GameDef.GAME_TYPE_SCORE_3){
			//llScore[4][5] = { { 20, 40, 80, 100, 4000 }, { 200, 300, 400, 600, 4000 }, { 700, 800, 900, 1100, 4000 }, { 1200, 1500, 1800, 2100, 4000 } };
			llScore = [[20, 40, 80, 100, 4000 ],[200, 300, 400, 600, 4000],[700, 800, 900, 1100, 4000],[1200, 1500, 1800, 2100, 4000]];

			return llScore[this.m_GameClientEngine.m_wOperaCount][cbType];
		}
		if (this.m_dwRules & GameDef.GAME_TYPE_SCORE_4){
			//llScore[4][5] = { { 40, 80, 160, 300, 6000 }, { 400 ,550, 700, 900, 6000 }, { 1000, 1200, 1300, 1500, 6000 }, { 1600, 1900, 2200, 2500, 6000 } };
			llScore = [[40, 80, 160, 300, 6000 ],[400 ,550, 700, 900, 6000],[1000, 1200, 1300, 1500, 6000],[1600, 1900, 2200, 2500, 6000]];

			return llScore[this.m_GameClientEngine.m_wOperaCount][cbType];
		}
	},
});

