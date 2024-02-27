
//游戏时间
var IDI_START_GAME = 200;					//开始定时器
var IDI_OPERATE = 201;					    //操作定时器

//游戏时间
var TIME_START_GAME = 10;
var TIME_DOPERATE = 30;
var TIME_DOPERATE2 = 90;

cc.Class({
    extends: cc.GameEngine,

    properties: {
    },

    ctor: function() {

        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['ADD_SCORE', 'ADD_SCORE'],//.mp3
            ['GAME_END', 'GAME_END'],//.mp3
            ['GAME_LOSE', 'GAME_LOSE'],//.mp3
            ['GAME_START', 'GAME_START'],//.mp3
            ['GAME_WARN', 'GAME_WARN'],//.mp3
            ['GAME_WIN', 'GAME_WIN'],//.mp3
            ['LEFT_WARN', 'LEFT_WARN'],//.mp3
            ['QingXiaZhu', 'QingXiaZhu'],//.mp3
            ['SEND_CARD', 'SEND_CARD'],//.mp3

            //女
            ['W_Follow_1', 'w/Follow_1'],
            ['W_Follow_2', 'w/Follow_2'],
            ['W_Follow_3', 'w/Follow_3'],
            ['W_GiveUp_1', 'w/GiveUp_1'],
            ['W_Kick_1', 'w/Kick_1'],
            ['W_Kick_2', 'w/Kick_2'],
            ['W_Kick_3', 'w/Kick_3'],
            ['W_NoAddScore', 'w/NoAddScore'],
            ['W_NoKick_1', 'w/NoKick_1'],
            ['W_NoKick_2', 'w/NoKick_2'],

            //男
            ['M_Follow_1', 'm/Follow_1'],
            ['M_Follow_2', 'm/Follow_2'],
            ['M_Follow_3', 'm/Follow_3'],
            ['M_GiveUp_1', 'm/GiveUp_1'],
            ['M_Kick_1', 'm/Kick_1'],
            ['M_Kick_2', 'm/Kick_2'],
            ['M_Kick_3', 'm/Kick_3'],
            ['M_NoAddScore', 'm/NoAddScore'],
            ['M_NoKick_1', 'm/NoKick_1'],
            ['M_NoKick_2', 'm/NoKick_2'],
       );

       this.m_bGaming = false;//是否游戏中
    },
    Init:function()
    {
    },
    start:function()
    {
        GameDef.g_GameEngine = this;
    },
    // update (dt) {},

    SetViewRoomInfo:function (dwServerRules,dwRulesArr) {
        this.m_GameClientView.SetViewRoomInfo(dwServerRules,dwRulesArr);
    },

    OnEventGameMessage :function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:
            {
                return this.OnSubGameStart(pData, wDataSize);
            }
            case GameDef.SUB_S_GAME_END:
            {
                return this.OnSubGameEnd(pData, wDataSize);
            }
            case GameDef.SUB_S_SEND_START_CARD:
            {
                return this.OnSubSendStartCard(pData, wDataSize);
            }
            case GameDef.SUB_S_NEW_TURN:
            {
                return this.OnSubNewTurn(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_ACTION:
            {
                return this.OnSubUserAction(pData, wDataSize);
            }
            case GameDef.SUB_S_LOOK_CARD:
            {
                return this.OnSubLookCard(pData, wDataSize);
            }
            case GameDef.SUB_S_OPEN_CARD:
            {
                return this.OnSubOpenCard(pData, wDataSize);
            }
            case GameDef.SUB_S_GAME_DRAW:
            {
                return this.OnSubGameDraw(pData, wDataSize);
            }
            case GameDef.SUB_S_OPERATE_TIME_OUT:
            {
                return this.OnSubOperateTimeOut(pData, wDataSize);
            }
            case GameDef.SUB_S_TRUSTEE:
            {
                return this.OnSubTrustee(pData, wDataSize);
            }
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if (cbGameStatus == GameDef.GAME_SCENE_FREE) {
            return this.OnEventSceneFree(bLookonUser, pData, wDataSize);
        } else if (cbGameStatus == GameDef.GAME_SCENE_PLAY) {
            return this.OnEventScenePlay(bLookonUser, pData, wDataSize);
        }
    },

    //空闲场景
    OnEventSceneFree: function(bLookonUser, pData, wDataSize) {
        var pStatusFree = GameDef.CMD_S_StatusFree();
        if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;

		this.m_RoomStatus = pStatusFree.RoomStatus
        this.m_PlayStatus = GameDef.tagPlayStatus();
        
       
        if(this.m_wGameProgress != 0)
        {
            this.m_GameClientView.m_BtBegin.active = false;
        }
        if (this.m_GameClientView != null) {
            this.m_GameClientView.ResetGameView(this.m_ReplayMode);
            this.m_GameClientView.updateUserScore();
        }

        // if( !this.m_ReplayMode && gClientKernel.get().GetMeUserItem().GetUserStatus() != US_READY )
        //     this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_START_GAME);


        if(this.m_wGameProgress == 0) {
			this.m_GameClientView.m_BtFriend.active = !this.m_bLookMode;
		} else {
            this.m_GameClientView.m_BtFriend.active = false;
            if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_30)
            {
                this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_DOPERATE - pStatusFree.dwOperateTime);
            }
            else if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_90)
            {
                this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_DOPERATE2 - pStatusFree.dwOperateTime);
            }
            if( this.m_GameClientView.m_pIClientUserItem[2] == null || this.m_GameClientView.m_pIClientUserItem[2].GetUserStatus() != US_READY)
            {
                this.m_GameClientView.m_BtStart.active = true;
            }
        }
        if(!this.m_ReplayMode) this.m_GameClientView.SetTimeout(pStatusFree.bTrustee);
        this.m_bGaming = false;
        return true;
    },

    //游戏场景
    OnEventScenePlay: function(bLookonUser, pData, wDataSize) {
        var pStatusPlay = GameDef.CMD_S_StatusPlay();
        if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

        if(this.m_wGameProgress != 0)
        {
            this.m_GameClientView.m_BtBegin.active = false;
        }

		this.m_RoomStatus = pStatusPlay.RoomStatus
        this.m_PlayStatus = pStatusPlay.PlayStatus;
        var meChairID = this.GetMeChairID();
        this.m_PlayStatus.dwMeAllCardPoint = this.m_PlayStatus.dwCardPoint[meChairID];

        if (this.m_GameClientView != null) {
            this.m_GameClientView.ResetGameView();
            this.m_GameClientView.ResetPlayStatus();
            this.m_GameClientView.updateUserScore();

            
            for(var i = 0; i < pStatusPlay.cbAllJettonCount; i++)
            {
                this.m_GameClientView.ResumeAllJetton(pStatusPlay.cbAllJetton[i], pStatusPlay.cbAllMultiple[i]);
            }
        }


        if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_30)
        {
            this.SetGameClock(this.m_PlayStatus.wCurrentUser, IDI_OPERATE, TIME_DOPERATE - pStatusPlay.dwOperateTime);
        }
        else if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_90)
        {
            this.SetGameClock(this.m_PlayStatus.wCurrentUser, IDI_OPERATE, TIME_DOPERATE2 - pStatusPlay.dwOperateTime);
        }
        
        if(!this.m_ReplayMode) this.m_GameClientView.SetTimeout(this.m_PlayStatus.bTrustee[meChairID]);
        this.m_bGaming = true;
        return true;
    },

    OnEventRoomEnd:function (data, datasize){
        this.m_RoomEnd = GameDef.CMD_S_GameCustomInfo();
        if(datasize != gCByte.Bytes2Str(this.m_RoomEnd, data)) return false;

        this.m_RoomEnd.UserID = new Array();

        //用户成绩
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if(pIClientUserItem == null) continue;
            this.m_RoomEnd.UserID[i] = pIClientUserItem.GetUserID();
        }
        
        if(this.m_wGameProgress > 0|| this.m_ReplayMode){
            this.m_GameClientView.m_BtStart.active = false;
            this.KillGameClock();
            this.ShowEndView();
        }else{
            var self = this;
            this.ShowAlert("该房间已被解散！", Alert_Yes, function(Res) {
                self.m_pTableScene.ExitGame();
            });
        }
      
        return true;
    },
    
    OpenBigEndView:function(){
        if (this.m_BigResultNode) {
            this.m_BigResultNode.active = true;
        } else {
            this.m_pTableScene.ExitGame();
        }
    },

    //游戏开始
    OnSubGameStart :function (pData, wDataSize) {
        this.KillGameClock(IDI_START_GAME);

        var pGameStart = GameDef.CMD_S_GameStart();
        if (wDataSize != gCByte.Bytes2Str(pGameStart, pData)) return false;

        this.m_PlayStatus = GameDef.tagPlayStatus();

		this.m_RoomStatus.wBankerUser = pGameStart.wBankerUser;
		this.m_PlayStatus.llTurnBaseScore = pGameStart.llBaseScore;
        this.m_PlayStatus.bPlayStatus = pGameStart.bPlayStatus;
        this.m_PlayStatus.llTableScore = pGameStart.llTableScore;
        this.m_PlayStatus.llTotalTableScore = pGameStart.llTotalTableScore;



		this.m_GameClientView.OnGameStart(pGameStart.bIsLanGuo, pGameStart.llDiScore);

        // 声音
        cc.gSoundRes.PlayGameSound('GAME_START');
        return true;
    },

    //游戏结束
    OnSubGameEnd :function (pData, wDataSize) {
        var pGameEnd = GameDef.CMD_S_GameEnd();
        if (wDataSize != gCByte.Bytes2Str(pGameEnd, pData)) return false;

        this.m_GameClientView.OnGameEnd(pGameEnd);

        if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_30)
        {
            this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_DOPERATE);
        }
        else if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_90)
        {
            this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_DOPERATE2);
        }

        // 声音
        if(pGameEnd.llGameScore[this.GetMeChairID()] > 0) {
            cc.gSoundRes.PlayGameSound('GAME_WIN');
        } else {
            cc.gSoundRes.PlayGameSound('GAME_LOSE');
        }
        this.m_bGaming = false;
        return true;
    },

    //开始发牌
    OnSubSendStartCard :function (pData, wDataSize) {
        //无消息结构

		for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_PlayStatus.bLookCard[i] = false;
            this.m_PlayStatus.bGiveUp[i] = false;
            this.m_PlayStatus.llTurnScore[i] = false;
			if (this.m_PlayStatus.bPlayStatus[i]) {
				this.m_PlayStatus.cbCardCount[i] = 2;
            }
		}

        this.m_GameClientView.OnSendStartCard();

        return true;
    },

    //新一轮下注开始
    OnSubNewTurn :function (pData, wDataSize) {
        var pNewTurn = GameDef.CMD_S_NewTurn();
        if (wDataSize != gCByte.Bytes2Str(pNewTurn, pData)) return false;

        this.m_PlayStatus.wTurn++;
        this.m_PlayStatus.cbSharedCard = pNewTurn.cbSharedCard;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) 
        {
            
            for(var j = 0; j < GameDef.MAX_COUNT; j++)
            {
                if (pNewTurn.cbAllCardData[i][j] != 0)
                {
                    this.m_PlayStatus.cbCardData[i][j] = pNewTurn.cbAllCardData[i][j];
                }
            }

			if (pNewTurn.cbCardData[i] != 0) {
				// var idx = this.m_PlayStatus.cbCardCount[i];
				// this.m_PlayStatus.cbCardData[i][idx] = pNewTurn.cbCardData[i];
				this.m_PlayStatus.cbCardCount[i]++;
            }

            this.m_PlayStatus.llTurnScore[i] = 0;

            this.m_PlayStatus.dwLightCardPoint[i] = pNewTurn.dwCardPoint[i];

            this.m_PlayStatus.bPublic[i] = pNewTurn.bPublic[i];
        }

        this.m_PlayStatus.dwMeAllCardPoint = pNewTurn.dwMeAllCardPoint;
        this.m_PlayStatus.bAPao = pNewTurn.bAPao;

		this.m_PlayStatus.wCurrentUser = pNewTurn.wCurrentUser;
		this.m_PlayStatus.wActionMask = pNewTurn.wActionMask;

        this.m_GameClientView.OnNewTurn(pNewTurn.cbCardData, pNewTurn.bPublic);
        this.m_GameClientView.SetUserCardPoint(pNewTurn.cbCardType, pNewTurn.dwCardPoint)

        // 声音
        if(this.GetMeChairID() == this.m_PlayStatus.wCurrentUser) {
            cc.gSoundRes.PlayGameSound('QingXiaZhu');
        }
        if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_30)
        {
            this.SetGameClock(pNewTurn.wCurrentUser, IDI_OPERATE, TIME_DOPERATE);
        }
        else if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_90)
        {
            this.SetGameClock(pNewTurn.wCurrentUser, IDI_OPERATE, TIME_DOPERATE2);
        }
        this.m_bGaming = true;
        return true;
    },

    //用户动作
    OnSubUserAction :function (pData, wDataSize) {
        var pUserAction = GameDef.CMD_S_UserAction();
        if (wDataSize != gCByte.Bytes2Str(pUserAction, pData)) return false;

		this.m_PlayStatus.wCurrentUser = pUserAction.wCurrentUser;
		this.m_PlayStatus.wActionMask = pUserAction.wActionMask;
        this.m_PlayStatus.llTurnBaseScore = pUserAction.llTurnBaseScore;

        this.m_PlayStatus.llTurnScore[pUserAction.wChairID] += pUserAction.llAddScore;
        this.m_PlayStatus.llTableScore[pUserAction.wChairID] += pUserAction.llAddScore;
        this.m_PlayStatus.llTotalTableScore += pUserAction.llAddScore;

        if (pUserAction.wActionCode == GameDef.ACTION_GIVEUP) {
            this.m_PlayStatus.bGiveUp[pUserAction.wChairID] = true;
        }
        if (pUserAction.wActionCode == GameDef.ACTION_LOOK_CARD) {
            this.m_PlayStatus.bLookCard[pUserAction.wChairID] = true;
        }

		this.m_GameClientView.OnUserAction(
			pUserAction.wChairID,
			pUserAction.wActionCode,
			pUserAction.wMultiple,
			pUserAction.llAddScore
        );
        this.KillGameClock();
        if(pUserAction.wCurrentUser != INVALID_CHAIR)
        {
            if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_30)
            {
                this.SetGameClock(pUserAction.wCurrentUser, IDI_OPERATE, TIME_DOPERATE);
            }
            else if(this.m_dwRules & GameDef.GAME_TYPE_TIME_OUT_TRUSTEE_90)
            {
                this.SetGameClock(pUserAction.wCurrentUser, IDI_OPERATE, TIME_DOPERATE2);
            }
        }
        return true;
    },

    //游戏看牌
    OnSubLookCard :function (pData, wDataSize) {
        var pLookCard = GameDef.CMD_S_LookCard();
        if (wDataSize != gCByte.Bytes2Str(pLookCard, pData)) return false;

        this.m_PlayStatus.bLookCard[pLookCard.wChairID] = true;

        this.m_PlayStatus.cbCardData[pLookCard.wChairID][0] = pLookCard.cbCardData[0];
        this.m_PlayStatus.cbCardData[pLookCard.wChairID][1] = pLookCard.cbCardData[1];

        this.m_GameClientView.OnLookCard(pLookCard.wChairID);
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            //this.m_PlayStatus.cbCardType[i] = pLookCard.cbCardType[i];
            this.m_PlayStatus.dwCardPoint[i] = pLookCard.dwCardPoint[i];
        }
        this.m_GameClientView.SetUserCardPoint(pLookCard.cbCardType, pLookCard.dwCardPoint)

        return true;
    },

    //游戏开牌
    OnSubOpenCard :function (pData, wDataSize) {
        var pOpenCard = GameDef.CMD_S_OpenCard();
        if (wDataSize != gCByte.Bytes2Str(pOpenCard, pData)) return false;

        this.m_PlayStatus.cbCardData = pOpenCard.cbCardData;
        this.m_PlayStatus.cbCardCount = pOpenCard.cbCardCount;

        this.m_GameClientView.OnOpenCard(pOpenCard);

        return true;
    },

    //游戏烂锅
    OnSubGameDraw :function (pData, wDataSize) {
        var pGameDraw = GameDef.CMD_S_GameDraw();
        if (wDataSize != gCByte.Bytes2Str(pGameDraw, pData)) return false;
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            this.m_PlayStatus.bGiveUp[i] = false;
            this.m_PlayStatus.bLookCard[i] = false;
            this.m_PlayStatus.cbCardData[i] = new Array();
            //this.m_PlayStatus.cbLightCardType[i] = 0;
            this.m_PlayStatus.dwLightCardPoint[i] = 0;
            //this.m_PlayStatus.cbCardType[i] = 0;
            this.m_PlayStatus.dwCardPoint[i] = 0;
        }
        this.m_PlayStatus.llTurnBaseScore = pGameDraw.llTurnBaseScore;
		cc.gSoundRes.PlayGameSound("GAME_END");
        return true;
    },

    //操作超时
    OnSubOperateTimeOut :function (pData, wDataSize) {
		this.m_GameClientView.m_OperateTimeOut.active = true;

        return true;
    },
    //托管
    OnSubTrustee:function(pData, wDataSize)
    {
        var pTrustee = GameDef.CMD_S_Trustee();
        if (wDataSize != gCByte.Bytes2Str(pTrustee, pData)) return false;

        this.m_GameClientView.SetTrustee(pTrustee.wChairID, pTrustee.bTrustee);
        return true;
    },
    CalcAddScore : function(wChairID, wMultiple) {
        var lScore = 0;
        if(this.m_GameClientView.m_dwRules & GameDef.GAME_TYPE_SCORE_1_10)
        {
            var lBaseScore = 1;
            switch(wMultiple)
            {
                case 1: lBaseScore = 1; break;
                case 2: lBaseScore = 2; break;
                case 3: lBaseScore = 3; break;
                case 4: lBaseScore = 5; break;
                case 5: lBaseScore = 10; break;
            }
            lScore = this.m_PlayStatus.llTurnBaseScore * lBaseScore;
        }
        else
        {
            lScore = this.m_PlayStatus.llTurnBaseScore * wMultiple;
        }
        if ((this.m_dwRules & GameDef.GAME_TYPE_DOUBLE_LOOK) &&  this.m_PlayStatus.bLookCard[wChairID]) lScore *= 2;


        //if(this.m_PlayStatus.wTurn == 3) lScore *= 2;
        return lScore;
    },

    SetGameClock :function (wChairID, nTimerID, nElapse) {
        var wViewChairID = this.SwitchViewChairID(wChairID);
        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse);
        if( this.m_ReplayMode ) return;
        if(wViewChairID == INVALID_CHAIR) return;
        g_TimerEngine.SetGameTimer(wViewChairID, nTimerID, nElapse*1000, null, this, 'OnTimerMessage');
        this.m_bPSound = true;
    },

    //删除定时器
    KillGameClock :function () {
        this.m_GameClientView.SetUserTimer(INVALID_CHAIR);
        g_TimerEngine.KillGameTimer();
        return true;
    },

    //时间消息
    OnTimerMessage: function (wChairID, CountDown, nTimerID) {
        var nElapse = parseInt(CountDown / 1000);
        this.m_GameClientView.SetUserTimer(wChairID, nElapse + 1);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;
        switch (nTimerID) {
            case IDI_START_GAME: //开始定时器
                {
                    if (kernel.GetMeUserItem().GetUserStatus() == US_READY) {
                        this.m_GameClientView.m_BtStart.active = false;
                        this.KillGameClock(IDI_START_GAME);
                        return
                    }
                    if (CountDown == 0) {
                        //退出游戏
                        if (this.m_dwRoomID == 0)
                            this.m_TableViewFrame.ExitGame();
                        else {
                            //this.m_GameClientView.OnBtReadyClicked();
                            this.KillGameClock(IDI_START_GAME);
                        }
                    }

                    return true;
                }
            case IDI_OPERATE:
                {
                }
        }
    },

    //邀请好友分享
    OnFriend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
           
        }
    },

    //播放操作声音
    PlayActionSound: function (wViewID, cbAction) {
        //椅子效验
        //var pIClientUserItem = this.GetClientUserItem(this.SwitchChairIDFromView(wViewID));
        var pIClientUserItem = this.m_GameClientView.m_pIClientUserItem[wViewID];
        
        if (pIClientUserItem == null) return;
        if (pIClientUserItem.GetGender() == 1) {
            cc.gSoundRes.PlayGameSound("M_" + cbAction);
        }
        else {
            cc.gSoundRes.PlayGameSound("W_" + cbAction);
        }
    },
    OnClearScene:function (){
        this.m_GameClientView.ResetGameView();
    }, 
    
	OnBtRule:function()
	{
		cc.gSoundRes.PlaySound('Button');
        this.ShowGamePrefab('Rule',GameDef.KIND_ID,this.node,function(Js){
            Js.OnShowRule(this.m_dwServerRules, this.m_dwRulesArr);
        }.bind(this));
    },
    //点击设置
    OnBtClickedSet: function () {
        if(this.m_dwRules == 0)return;
        cc.gSoundRes.PlaySound('Button');
        var meUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var bCreater = (this.m_dwCreater != 0 && this.m_dwCreater == meUserID);
        this.ShowPrefabDLG('SetDlgOther', this.node, function(js)
        {
            js.SetExitBt(GameDef.IsCanDiss(this.m_dwRules), this.m_wGameProgress == 0 && bCreater == false);
        }.bind(this));
    },
});
