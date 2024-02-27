
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

            ['TYPE1', 'add'],//.mp3
            ['TYPE10', 'all'],//.mp3
            ['TYPE0', 'genzhu'],//.mp3
            ['TYPE5', 'passs'],//.mp3


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
            case GameDef.SUB_S_ADD_SCORE:
            {
                return this.OnSubAddScore(pData, wDataSize);
            }
            case GameDef.SUB_S_SEND_CARD:
                {
                    return this.OnSubSendCard(pData, wDataSize);
                }
            case GameDef.SUB_S_LAST_GAME:
                {
                    return this.OnSubShowLastGame(pData, wDataSize);

                }
            case GameDef.SUB_S_GIVE_UP:
                {
                    return this.OnSubGiveUp(pData, wDataSize);
                }
        }
        return false;
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
        
        if (this.m_GameClientView != null) {
            this.m_GameClientView.ResetGameView(this.m_ReplayMode);
        }

        if (this.IsLookonMode() || this.m_ReplayMode) {
            this.m_GameClientView.m_BtStart.active = false;
            this.m_GameClientView.m_BtFriend.active = false;
        } else {
            if(this.m_dwGameProgress == 0) {
                this.m_GameClientView.m_BtFriend.active = true;
                this.m_GameClientView.m_BtStart.active = (this.GetMeUserItem().GetUserStatus() == US_SIT);
            }
        }
        this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, pStatusFree.wCountDown);

        this.m_GameClientView.updateTableScore(0);
        this.m_bGaming = false;
        this.m_bGuoPai = false;
        this.m_wOperaCount = 0;

        return true;
    },

    //游戏场景
    OnEventScenePlay: function(bLookonUser, pData, wDataSize) {
        var pStatusPlay = GameDef.CMD_S_StatusPlay();
        if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

        this.m_GameClientView.m_BtStart.active = false;


		this.m_wBankerUser = pStatusPlay.wBankerUser;
        this.m_bPlayStatus = pStatusPlay.cbPlayStatus;
        this.m_llTableScore = pStatusPlay.llCenterScore;
        this.m_llTurnMaxScore = pStatusPlay.llTurnMaxScore;
        this.m_llTurnLessScore = pStatusPlay.llTurnLessScore;
        this.m_cbHnadCardData = pStatusPlay.cnHandCardData;
        this.m_wCurrentUser = pStatusPlay.wCurrentUser;
        this.m_wDuser = pStatusPlay.wMaxChipInUser;
        this.m_llUserScore = pStatusPlay.llFollowScore;
        this.m_bGuoPai = pStatusPlay.bIsGuoPai;
        this.m_wOperaCount = pStatusPlay.wOperaCount;

        this.m_GameClientView.updateUserScore(pStatusPlay.llTableScore,pStatusPlay.llTotalScore);

        this.m_GameClientView.ShowCard(pStatusPlay.cbHandCardData,pStatusPlay.cbPlayStatus,false);
        this.m_GameClientView.updateGameView(pStatusPlay.wCurrentUser,this.m_wOperaCount!=0);
        this.SetGameClock(pStatusPlay.wCurrentUser, IDI_START_GAME, pStatusPlay.wCountDown);

        for(var i = 0; i< GameDef.GAME_PLAYER; i++){
            if(pStatusPlay.bGiveUp[i] == false)continue;
            this.m_GameClientView.m_UserCardControl[this.SwitchViewChairID(i)].SetGiveUp();
        }
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

        if(this.m_wGameProgress > 0 || this.m_ReplayMode){
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


        var pGameStart = GameDef.CMD_S_GameStart();
        if (wDataSize != gCByte.Bytes2Str(pGameStart, pData)) return false;
        
        this.m_bGaming = true;
        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            this.m_GameClientView.m_UserState[i].HideState();
            this.m_GameClientView.m_UserInfo[i].HideEndScore();
            this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(i)].SetBanker(i==pGameStart.wBankerUser);
            this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(i)].SetDUser(i==pGameStart.wMaxChipInUser);
            this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(i)].SetXUser(i==pGameStart.wMinChipInUser);
            this.m_GameClientView.m_UserCardType[i].SetCardType();
			this.m_GameClientView.m_UserInfo[i].SetUserWin(false);
        }
        if(this.IsLookonMode()){
            pGameStart.cbHandCardData[this.GetMeChairID()] = [0,0];
        } 
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_DiPai.node.active = false;
        this.m_GameClientView.m_BtStart.active = false;
        this.m_wOperaCount = 0;
        this.m_bGuoPai = false;
		this.m_wBankerUser = pGameStart.wBankerUser;
        this.m_bPlayStatus = pGameStart.bPlayStatus;
        this.m_llTurnMaxScore = pGameStart.llTurnMaxScore;
        this.m_llUserScore = pGameStart.llFollowScore;
        this.m_llTurnLessScore = pGameStart.llTurnLessScore;
        this.m_cbHnadCardData = pGameStart.cnHandCardData;
        this.m_wCurrentUser = pGameStart.wCurrentUser;
        this.m_cbHandCardData = pGameStart.cbHandCardData;
        this.m_GameClientView.updateUserScore(pGameStart.llUserTableScore,pGameStart.llTotalScore);
        this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, GameDef.GetTime(this.m_GameClientView.m_dwRules));
        this.m_GameClientView.updateUserType(INVALID_CHAIR);
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(this.m_bPlayStatus,this.m_wCurrentUser,2);

        // 声音
        cc.gSoundRes.PlayGameSound('GAME_START');
        return true;
    },


    OnSubAddScore:function(pData, wDataSize){
        var pCmd = GameDef.CMD_S_AddScore();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;
        if( pCmd.llAddScoreCount>0) this.m_llUserScore = pCmd.llAddScoreCount;
        this.m_bGuoPai = pCmd.bIsGuoPai;

        this.m_GameClientView.updateGameView(pCmd.wCurrentUser,true);
        this.m_GameClientView.updateUserScore(pCmd.llUserTableScore,pCmd.llTotalScore);
        this.m_GameClientView.updateUserType(this.SwitchViewChairID(pCmd.wAddScoreUser),pCmd.cbType);
        this.SetGameClock(this.GetMeChairID(), this.IDI_START_GAME, GameDef.GetTime(this.m_GameClientView.m_dwRules));
        cc.gSoundRes.PlayGameSound('TYPE'+pCmd.cbType);
        
        return true;
    },

    OnSubSendCard: function(pData, wDataSize){
        var pCmd = GameDef.CMD_S_SendCard();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;
        this.m_bGuoPai = (this.m_wOperaCount!=0);
        this.m_wOperaCount++;

        this.m_llUserScore = pCmd.llScore;

        this.m_GameClientView.updateUserScore(pCmd.llUserTableScore,pCmd.llTotalScore);
        this.m_GameClientView.ShowCenterData(pCmd.cbCenterCardData,pCmd.cbSendCardCount);
        this.m_GameClientView.updateUserType(INVALID_CHAIR);
        this.m_GameClientView.updateGameView(pCmd.wCurrentUser,true);
        this.SetGameClock(this.GetMeChairID(), this.IDI_START_GAME, GameDef.GetTime(this.m_GameClientView.m_dwRules));
        cc.gSoundRes.PlayGameSound('TYPE'+pCmd.cbType);

        return true;

    },

    OnSubGiveUp:function(pData, wDataSize){
        var pCmd = GameDef.CMD_S_GiveUp();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;
        this.m_GameClientView.m_UserCardControl[this.SwitchViewChairID(pCmd.wGiveUpUser)].SetGiveUp();
        return true;
    },

    OnSubShowLastGame:function(pData, wDataSize){

        var pCmd = GameDef.CMD_S_LastGame();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;

        this.ShowGamePrefab("LastGame", GameDef.KIND_ID, this.node, function (Js) {
            this.m_LastGameCtrl = Js;
            this.m_LastGameCtrl.SetRecordData(pCmd);
        }.bind(this));
        return true;
    },
    //游戏结束
    OnSubGameEnd :function (pData, wDataSize) {
        var pGameEnd = GameDef.CMD_S_GameEnd();
        if (wDataSize != gCByte.Bytes2Str(pGameEnd, pData)) return false;

        this.OnGameEnd(pGameEnd);

        // 声音
        if(pGameEnd.llGameScore[this.GetMeChairID()] > 0) {
            cc.gSoundRes.PlayGameSound('GAME_WIN');

        } else {
            cc.gSoundRes.PlayGameSound('GAME_LOSE');
        }
        this.m_bGaming = false;
        this.m_GameClientView.updateUserType(INVALID_CHAIR);

        return true;
    },
    OnGameEnd: function(pCmdGameEnd) {
        this.m_bGuoPai = true;

        this.m_GameClientView.updateGameView(INVALID_CHAIR,false);
        this.m_GameClientView.updateUserScore(pCmdGameEnd.llUserTableScore,pCmdGameEnd.llTotalScore);

        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            if(this.m_bPlayStatus[i] == false) continue;
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserInfo[wViewID].SetEndScore(pCmdGameEnd.llGameScore[i]);
			if(pCmdGameEnd.bShow== false)this.m_GameClientView.m_UserCardType[wViewID].SetCardType(pCmdGameEnd.cbEndCardKind[i]);
			this.m_GameClientView.m_UserInfo[wViewID].SetUserWin(pCmdGameEnd.llGameScore[i]>0);

        }
        this.m_GameClientView.ShowCard(pCmdGameEnd.cbCardData,this.m_bPlayStatus,true);
        if(pCmdGameEnd.bShow == false)this.m_GameClientView.ShowCenterDataEnd(pCmdGameEnd.cbCenterCardData,5);

        this.m_GameClientView.m_BtStart.active = true;
	},


    SetGameClock :function (wChairID, nTimerID, nElapse) {
        this.KillGameClock();
        this.m_GameClientView.SetUserTimer(wChairID, nElapse, 1);
        if( this.m_ReplayMode ) return;
        if(wChairID == INVALID_CHAIR) return;
        g_TimerEngine.SetGameTimer(wChairID, nTimerID, nElapse*1000, null, this, 'OnTimerMessage');
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

    ObSubAddScoreMessage:function(Data){
        var Cmd = GameDef.CMD_C_AddScore();
        
        if(Data == 0){
            Cmd.llScore = this.m_llUserScore;
            Cmd.cbType = 0;
        }
        else if(Data == 10){
            Cmd.llScore = 0;
            Cmd.cbType = 10;
        }
        else if(Data == 4){
            Cmd.llScore = Data;
            Cmd.cbType = 2;
        }else
        {
            Cmd.llScore = this.m_GameClientView.GetAddScore(Data);
            Cmd.cbType = 1;
        }
        this.SendGameData(GameDef.SUB_C_ADD_SCORE,Cmd);
    },
    //node: TempCard.node  ; para = [wViewID, wChairID, cbCardData]

    OnMessageDispatchFinish:function(para, CardCount){

        //发牌过程
        var kernel = gClientKernel.get();
        var CardArr = new Array();
        for(var i = 0; i < (para[2]+1);i++){
            CardArr[i] = this.m_cbHandCardData[para[0]][i];
            if(para[0]!=this.GetMeChairID()){
                CardArr[i] = 0;
            }
        }
        this.m_GameClientView.m_UserCardControl[para[1]].SetCardData(CardArr,(para[2]+1),false);
		this.m_GameClientView.m_UserCardControl[para[1]].node.active = true;
        if(CardCount)  return
        this.m_GameClientView.updateGameView(this.m_wCurrentUser,this.m_llTurnLessScore,false);

    },
});
