//游戏时间
var IDI_GAME_CLOCK = 201;					//叫分定时器

//游戏时间
var TIME_READY = 5;
var TIME_BANKER = 5;
var TIME_CALL = 5;
var TIME_OPENCARD = 15;
var TIME_OPENCARD2 = 10;
cc.Class({
    extends: cc.GameEngine,

    properties: {},

    // use this for initialization
    start: function () { },

    ctor: function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['BANKER', 'Banker'],//.mp3
            ['ADD', 'StartAdd'],//.mp3
            ['CLOCK', 'CountDown'],//.mp3
            ['WIN', 'Win'],//.mp3
            ['LOSE', 'Lose'],//.mp3
            //男
            ['M_READY', 'm/zhunbei'],
            //女
            ['W_READY', 'w/zhunbei'],

            ['SEND','SEND_CARD'],
        );
        //抢庄声音
        for (var i = 0; i <= 4; ++i) {
            this.m_SoundArr[this.m_SoundArr.length] = ['M_CB_' + i, 'm/callbank/' + i];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_CB_' + i, 'w/callbank/' + i];
        }
        this.m_SoundArr[this.m_SoundArr.length] = ['M_CB_' + 100, 'm/callbank/' + 100];
        this.m_SoundArr[this.m_SoundArr.length] = ['W_CB_' + 100, 'w/callbank/' + 100];
        //牌型声音
        for (var i = 0; i <= 13; ++i) {
            this.m_SoundArr[this.m_SoundArr.length] = ['M_' + i, 'm/type/' + i];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_' + i, 'w/type/' + i];
        }
        //短语声音
        for (var i = 1; i <= 10; ++i) {
            var FileName = (i < 10 ? '0' : '') + i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m' + i, 'm/phrase/' + FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w' + i, 'w/phrase/' + FileName];
        }

        this.m_szText = new Array(
            '大家好，很高兴见到各位',
            '快点儿啊，等到花儿都谢了',
            '大牛吃小牛，不要伤心哦',
            '我是庄家，谁敢挑战我',
            '风水轮流转，底裤都输光了',
            '一点小钱，那都不是事儿',
            '大家一起浪起来',
            '不要走，决战到天亮',
            '你真是一个天生的演员',
            '底牌亮出来，绝对吓死你'
        );
        //游戏变量
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbCardCount = new Array();
        this.m_cbOxType = new Array();
        this.m_UserState = new Array();

        this.m_lBankerTimes = new Array();

        this.m_RecordArr = new Array();//牌局回顾
        this.m_cbNoBanker = new Array();

        this.m_bIsHoldBank = false;
        return;
    },

    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:	    //游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_START_CALL:		//开始抢庄
                {
                    return this.OnSubStartCall(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_BANKER:		//抢庄消息
                {
                    return this.OnSubCallBanker(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_ANIM:		//抢庄动画
                {
                    return this.OnSubRandomCallAni(pData, wDataSize);
                }
            case GameDef.SUB_S_SHOW_BANKER:		//显示庄家
                {
                    return this.OnSubBankerUser(pData, wDataSize);
                }
            case GameDef.SUB_S_START_JETTON:	//开始下注
                {
                    return this.OnSubStartJetton(pData, wDataSize);
                }
                case GameDef.SUB_S_JETINFO:		//下注消息
                    {
                        return this.OnSubChangeJetInfo(pData, wDataSize);
                    }
            case GameDef.SUB_S_USER_JETTON:		//下注消息
                {
                    return this.OnSubCallPlayer(pData, wDataSize);
                }
            case GameDef.SUB_S_SEND_CARD:		//发牌消息
                {
                    return this.OnSubSendCard(pData, wDataSize);
                }
            case GameDef.SUB_S_START_OPEN:		//开始翻牌
                {
                    return this.OnSubStartOpen(pData, wDataSize);
                }
            case GameDef.SUB_S_LOOK_CARD:		//翻牌消息
                {
                    return this.OnSubLookCard(pData, wDataSize);
                }
            case GameDef.SUB_S_CUO_CARD:		//搓牌消息
                {
                    return this.OnSubCtrlOpenCard(pData, wDataSize);
                }
            case GameDef.SUB_S_HINT:		//提示消息
                {
                    return this.OnSubHintCard(pData, wDataSize);
                }
            case GameDef.SUB_S_OPEN_CARD:		//亮牌消息
                {
                    return this.OnSubOpenCard(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END:	//游戏结束
                {
                    return this.OnSubGameConclude(pData, wDataSize);
                }
            case GameDef.SUB_S_START_CTRL:	//控制开始
                {
                    return this.OnSubShowStartCtrl(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_READY:	//准备
                {
                    return this.OnSubUserReady(pData, wDataSize);
                }
            case GameDef.SUB_S_HISTORY:	//历史记录
                {
                    return this.OnSubUpdateHistory(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_RESULT:
                {
                    return this.OnSubCallResult(pData, wDataSize);
                }
            case GameDef.SUB_S_SEND_CARD_RESULT:
                {
                    return this.OnSubSendCardResult(pData, wDataSize);
                }
            case GameDef.SUB_S_JET_RESULT:
                {
                    return this.OnSubJetResult(pData, wDataSize);
                }
            case GameDef.SUB_S_OPEN_RESULT:
                {
                    return this.OnSubOpenResult(pData, wDataSize);
                }

        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        // if(window.LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
        switch (cbGameStatus) {
            case GameDef.GS_TK_FREE:	//空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (this.m_dwRoomID != 0 && this.m_wGameProgress == 0 && !this.m_ReplayMode) {
                        this.m_GameClientView.m_BtFriend.active = true;
                    }

                    this.m_GameClientView.SetTableMaxBet(pStatusFree.llMaxBetScore);
                    return true;
                }
            case GameDef.GS_TK_CALL_BANKER:
            case GameDef.GS_TK_BANKER_ANIM:
            case GameDef.GS_TK_SHOW_BANKER:
            case GameDef.GS_TK_SEND_CARD:
            case GameDef.GS_TK_USER_JETTON:
            case GameDef.GS_TK_OPEN_CARD:
            case GameDef.GS_TK_GAME_END:
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlaying();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

                    //庄家分数
                    if (this.m_bIsHoldBank)
                        this.m_GameClientView.SetBankerScore(pStatusPlay.llBankerScore);

                    //设置庄家
                    this.m_wBankerUser = pStatusPlay.wBankerUser;
                    var ViewBankID = this.SwitchViewChairID(pStatusPlay.wBankerUser);
                    this.m_GameClientView.m_AniBanker = pStatusPlay.wBankerUser;

                    this.m_GameClientView.SetBankerUser(ViewBankID, false);

                    //设置加注按钮
                    var MeChair = this.GetMeChairID();

                        //最大下注
                        this.m_GameClientView.SetTableMaxBet(pStatusPlay.llMaxBetScore);
                        //桌面总下注
                        this.m_GameClientView.SetTableBet(pStatusPlay.llTableScore);

                    //显示桌面下注
                    if (cbGameStatus == GameDef.GS_TK_USER_JETTON || pStatusPlay.llTableScore != 0)
                     this.m_GameClientView.m_TableJetNode.active = parseInt(this.m_GameClientView.m_MaxJetText.string) != 0;

                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        //玩家状态
                        this.m_UserState[i] = pStatusPlay.cbPlayStatus[i];

                        if (!this.m_UserState[i]) continue;
                        var ViewID = this.SwitchViewChairID(i);

                        //抢庄显示
                        if (pStatusPlay.llBankerTimes[i] != 0xFF)
                            this.m_GameClientView.SetUserCallBankerTimes(ViewID, pStatusPlay.llBankerTimes[i], false);

                        //下注显示
                        if (pStatusPlay.llPlayerTimes[i] != 0)
                            this.m_GameClientView.SetUserBet(ViewID, pStatusPlay.llPlayerTimes[i], 0, false);

                        //推注状态
                        this.m_GameClientView.SetShowAdd(ViewID, pStatusPlay.cbLastWin[i]);

                        //按钮显示
                        if (ViewID == GameDef.MYSELF_VIEW_ID) {
                            //抢庄按钮
                            this.m_GameClientView.setCallBankerBtn(pStatusPlay.cbPlayStatus[i] == GameDef.PLAYER_STATUS_CALL_BANK && !this.IsLookonMode(), pStatusPlay.cbMaxCallBanker);
                            //下注按钮
                            this.m_GameClientView.SetPlayerJetShow(pStatusPlay.cbPlayStatus[i] == GameDef.PLAYER_STATUS_BET && !this.IsLookonMode());
                            //翻牌/搓牌按钮
                            this.m_GameClientView.ShowLookUI(pStatusPlay.cbPlayStatus[i] == GameDef.PLAYER_STATUS_OPEN && !this.IsLookonMode(),pStatusPlay.bIsCanCuoPai);
                            //亮牌/提示按钮
                            this.m_GameClientView.ShowOpenUI(
                                (pStatusPlay.cbPlayStatus[i] == GameDef.PLAYER_STATUS_LOOK_CARD ||
                                pStatusPlay.cbPlayStatus[i] == GameDef.PLAYER_STATUS_HINT) && !this.IsLookonMode()
                                ,pStatusPlay.cbPlayStatus[i] != GameDef.PLAYER_STATUS_HINT);
                        }

                        //玩家手牌
                        this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(pStatusPlay.cbHandCardData[i], pStatusPlay.iSendCardCount);
                        this.m_GameClientView.m_UserCardControl[ViewID].SetCardShoot(pStatusPlay.cbFinalCardIndex[i]);

                        this.m_GameClientView.SetCardType(ViewID, pStatusPlay.cbOxType[i],pStatusPlay.cbTypeTimes[i]);

                        if (ViewID != GameDef.MYSELF_VIEW_ID)
                            this.m_GameClientView.ShowCuoPaiState(ViewID, pStatusPlay.cbCuoPaiState[i]);
                    }
                    return true;
                }
        }
        return false;
    },

    //设置定时器
    SetGameClock: function (wChairID, nTimerID, nElapse) {
        this.m_GameClientView.SetUserTimer(wChairID, nElapse, 1);
        if (this.m_ReplayMode) return
        g_TimerEngine.SetGameTimer(wChairID, nTimerID, nElapse * 1000, null, this, 'OnTimerMessage');
    },

    //删除定时器
    KillGameClock: function () {
        this.m_GameClientView.SetUserTimer(INVALID_CHAIR);
        g_TimerEngine.KillGameTimer();
        return true;
    },

    //时间消息
    OnTimerMessage: function (wChairID, CountDown, nTimerID, Progress) {
        var nElapse = parseInt(CountDown / 1000) + 1;
        if (CountDown == 0) nElapse = null;

        if (this.m_nElapse == null || this.m_nElapse != nElapse) {
            this.m_nElapse = nElapse;
            if (this.m_nElapse <= 5 && this.m_nElapse > 0) cc.gSoundRes.PlayGameSound("CLOCK");
        }

        this.m_GameClientView.SetUserTimer(wChairID, nElapse, Progress);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;

        return true;
    },

    //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        var GameStart = GameDef.CMD_S_GameStart();

        //效验
        if (wDataSize != gCByte.Bytes2Str(GameStart, pData)) return false;
        this.m_GameEnd = null;

        //隐藏成绩界面
        this.m_GameClientView.ClearView();

        //庄家分数
        if (this.m_bIsHoldBank)
            this.m_GameClientView.SetBankerScore(GameStart.llBankerScore);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //玩家状态
            this.m_UserState[i] = GameStart.cbPlayStatus[i];
            if (!this.m_UserState[i])continue;

            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetShowAdd(ViewID, GameStart.cbLastWin[i]);
        }
        return true;
    },

    //开始抢庄
    OnSubStartCall: function (pData, wDataSize) {
        var startCall = GameDef.CMD_S_StartCall();
        //效验
        if (wDataSize != gCByte.Bytes2Str(startCall, pData)) return false;

        //删除时间
        this.KillGameClock();

        this.m_GameClientView.SetTableTips('等待玩家选择抢庄倍数');

        var MeChair = this.GetMeChairID();
        var bGame = this.m_UserState[MeChair];

        this.m_GameClientView.setCallBankerBtn(bGame && !this.IsLookonMode(), startCall.cbMaxCallBanker);

        //设置时间
        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, startCall.dwCountDown / 1000);
        return true;
    },

    //抢庄消息
    OnSubCallBanker: function (pData, wDataSize) {
        var UserCall = GameDef.CMD_S_UserCall();
        //效验
        if (wDataSize != gCByte.Bytes2Str(UserCall, pData)) return false;

        //界面
        if (UserCall.wCurrentUser == this.GetMeChairID())
            this.m_GameClientView.setCallBankerBtn();

        var ViewID = this.SwitchViewChairID(UserCall.wCurrentUser);

        this.m_GameClientView.SetUserCallBankerTimes(ViewID, UserCall.llTimes, true);

        if (UserCall.llTimes != 0xFF)
            this.PlayActionSound(UserCall.wCurrentUser, 'CB_' + UserCall.llTimes)
            
        return true;
    },

    //抢庄动画
    OnSubRandomCallAni: function (pData, wDataSize) {
        var CallAni = GameDef.CMD_S_BankerAni();
        //效验
        if (wDataSize != gCByte.Bytes2Str(CallAni, pData)) return false;

        //删除时间
        this.KillGameClock();

        //最高倍抢庄的数组
        var BanekrAniArr = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserCallBankerTimes(ViewID, CallAni.llTimes[i]);
            if (CallAni.cbMaxCall[i] == 0) continue;
            BanekrAniArr.push(i);
        }

        this.m_GameClientView.StartRandomBankerAni(BanekrAniArr, INVALID_CHAIR, this.m_ReplayMode == false); //false

        return true;
    },

    //显示庄家
    OnSubBankerUser: function (pData, wDataSize) {
        var BankerUser = GameDef.CMD_S_BankerUser();
        //效验
        if (wDataSize != gCByte.Bytes2Str(BankerUser, pData)) return false;

        //删除时间
        this.KillGameClock();

        //保存数据
        this.m_wBankerUser = BankerUser.wBankerUser;

        var BankViewID = this.SwitchViewChairID(BankerUser.wBankerUser);
        this.m_GameClientView.m_AniBanker = BankerUser.wBankerUser;

        this.m_GameClientView.SetBankerUser(BankViewID, !this.m_ReplayMode);
        
        this.m_GameClientView.SetUserCallBankerTimes(INVALID_CHAIR);
        this.m_GameClientView.SetUserCallBankerTimes(BankViewID,BankerUser.llTimes);

        this.m_GameClientView.SetShowAdd(BankViewID);
        return true;
    },

    //开始下注
    OnSubStartJetton: function (pData, wDataSize) {
        var startJetton = GameDef.CMD_S_StartJetton();
        //效验
        if (wDataSize != gCByte.Bytes2Str(startJetton, pData)) return false;

        //删除时间
        this.KillGameClock();

        cc.gSoundRes.PlayGameSound("ADD");

        var MeChair = this.GetMeChairID();
        var bGame = this.m_UserState[MeChair];
        this.m_GameClientView.SetTableTips('等待闲家选择倍数');

        this.m_GameClientView.SetPlayerJetShow(bGame && MeChair != this.m_wBankerUser && !this.IsLookonMode());

        //显示桌面下注
        this.m_GameClientView.m_TableJetNode.active = parseInt(this.m_GameClientView.m_MaxJetText.string) != 0;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_UserState[i])continue;
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetShowAdd(ViewID, startJetton.bIsCanTuiZhu[i]);

            if (i != this.m_wBankerUser)
                this.m_GameClientView.SetUserCallBankerTimes(ViewID,0xFF );
        }

        //设置时间
        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, startJetton.dwCountDown / 1000);
        return true;
    },
    
    //下注消息
    OnSubChangeJetInfo: function (pData, wDataSize) {
        var ChangeInfo = GameDef.CMD_S_JettonInfo();
        //效验
        if (wDataSize != gCByte.Bytes2Str(ChangeInfo, pData)) return false;

        this.m_GameClientView.SetPlayerUIBtnScore(ChangeInfo.llBetScore,ChangeInfo.bIsDouble);
        this.m_GameClientView.SetPlayerUIBtn(ChangeInfo.bIsCanMinBet, ChangeInfo.bIsCanDouble);
        //显示大吃小滑动下注界面
        this.m_GameClientView.SetPlayerSliderUiScore(ChangeInfo.llMinBetScore,ChangeInfo.llMaxBetScore);

        return true;
    },

    //下注消息
    OnSubCallPlayer: function (pData, wDataSize) {
        var UserCall = GameDef.CMD_S_UserBet();
        //效验
        if (wDataSize != gCByte.Bytes2Str(UserCall, pData)) return false;

        cc.gSoundRes.PlaySound('Jet');

        if (UserCall.wCurrentUser == this.GetMeChairID())
            this.m_GameClientView.SetPlayerJetShow();

        var ViewID = this.SwitchViewChairID(UserCall.wCurrentUser);
        this.m_GameClientView.SetShowAdd(ViewID);

        if (UserCall.llTableScore == 0)
        {
            this.m_GameClientView.SetUserBet(ViewID, UserCall.llScore, UserCall.llTimes, true);
        }
        else
        {
            this.m_GameClientView.SetUserTableBet(ViewID, UserCall.llScore, UserCall.llTimes, true);
            this.m_GameClientView.SetTableBet(UserCall.llTableScore);
            
        }
        return true;
    },

    //发牌消息
    OnSubSendCard: function (pData, wDataSize) {
        var sendCard = GameDef.CMD_S_SendCard();
        //效验
        if (wDataSize != gCByte.Bytes2Str(sendCard, pData)) return false;

        //删除时间
        this.KillGameClock();

        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(sendCard.dwCountDown / 1000, sendCard.cbStartIndex, sendCard.cbCardData);

        return true;
    },

    //开始翻牌
    OnSubStartOpen: function (pData, wDataSize) {
        var startOpen = GameDef.CMD_S_StartOpen();
        //效验
        if (wDataSize != gCByte.Bytes2Str(startOpen, pData)) return false;

        //删除时间
        this.KillGameClock();

        var MeChair = this.GetMeChairID();
        var bGame = this.m_UserState[MeChair];
        this.m_GameClientView.SetTableTips('等待玩家开牌');

        this.m_GameClientView.ShowLookUI(bGame && !this.IsLookonMode(), startOpen.bIsCanCuoPai);
        this.m_GameClientView.ShowOpenUI(false, true);

        //设置时间
        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, startOpen.dwCountDown / 1000);
        return true;
    },

    OnSubHintCard: function (pData, wDataSize) {
        var OpenCard = GameDef.CMD_S_Open_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(OpenCard, pData)) return false;

        //显示牌
        var ViewID = this.SwitchViewChairID(OpenCard.wChairID);
        this.m_GameClientView.ShowCuoPaiState(ViewID);
        if (ViewID == GameDef.MYSELF_VIEW_ID) this.m_GameClientView.HideAllGameButton();

        this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(OpenCard.cbCardData, GameDef.MAX_COUNT);
        this.m_GameClientView.m_UserCardControl[ViewID].SetCardShoot(OpenCard.iShootIndex);
        this.m_GameClientView.SetCardType(ViewID, OpenCard.cbOxType, OpenCard.cbTypeTimes);

        var MeChair = this.GetMeChairID();
        var bGame = this.m_UserState[MeChair];
        
        if (!this.IsLookonMode())
            this.m_GameClientView.ShowOpenUI(bGame, false);

        return true;
    },

    //翻牌消息
    OnSubOpenCard: function (pData, wDataSize) {
        var OpenCard = GameDef.CMD_S_Open_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(OpenCard, pData)) return false;


        //显示牌
        var ViewID = this.SwitchViewChairID(OpenCard.wChairID);
        this.m_GameClientView.ShowCuoPaiState(ViewID);
        if (ViewID == GameDef.MYSELF_VIEW_ID) this.m_GameClientView.HideAllGameButton();

        this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(OpenCard.cbCardData, GameDef.MAX_COUNT);
        this.m_GameClientView.m_UserCardControl[ViewID].SetCardShoot(OpenCard.iShootIndex);
        this.m_GameClientView.SetCardType(ViewID, OpenCard.cbOxType, OpenCard.cbTypeTimes);

        this.PlayActionSound(OpenCard.wChairID, OpenCard.cbOxType)
        return true;
    },
    //翻牌消息
    OnSubLookCard: function (pData, wDataSize) {
        var lookCard = GameDef.CMD_S_Ctrl_Open_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(lookCard, pData)) return false;

        var ViewID = this.SwitchViewChairID(lookCard.wChairID);
        this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(lookCard.cbCardData, GameDef.MAX_COUNT);

        var MeChair = this.GetMeChairID();
        var bGame = this.m_UserState[MeChair];

        this.m_GameClientView.ShowLookUI(false);
        this.m_GameClientView.ShowOpenUI(bGame && !this.IsLookonMode(), true);

        return true;
    },
    //搓牌消息
    OnSubCtrlOpenCard: function (pData, wDataSize) {
        var CtrlOpenCard = GameDef.CMD_S_Ctrl_Open_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(CtrlOpenCard, pData)) return false;

        var MeChair = this.GetMeChairID();
        if (CtrlOpenCard.wChairID == MeChair && !this.IsLookonMode()) {

            // this.m_GameClientView.m_OpenCardCtrl.SetHook(this);
            // this.m_GameClientView.m_OpenCardCtrl.node.active = true;
            // this.m_GameClientView.m_OpenCardCtrl.SetCardData(CtrlOpenCard.cbCardData[GameDef.MAX_COUNT - 1]);
            this.ShowPrefabDLG('NdOpenCard2',null,function(Js){
                Js.SetCardData(CtrlOpenCard.cbCardData[GameDef.MAX_COUNT - 1]);
                this.m_GameClientView.m_OpenCardCtrl = Js;
            }.bind(this));

            this.m_GameClientView.m_CardArr = CtrlOpenCard.cbCardData;
            
            var bGame = this.m_UserState[MeChair];

            this.m_GameClientView.ShowLookUI(false);
            this.m_GameClientView.ShowOpenUI(bGame && !this.IsLookonMode(), true);
        }

        var ViewID = this.SwitchViewChairID(CtrlOpenCard.wChairID);
        //显示搓牌中
        this.m_GameClientView.ShowCuoPaiState(ViewID, true);

        return true;
    },

    //显示按钮
    OnSubShowStartCtrl: function (pData, wDataSize) {
        var CtrlStart = GameDef.CMD_S_StartCtrl();
        if (wDataSize != gCByte.Bytes2Str(CtrlStart, pData)) return false;

        this.m_GameClientView.m_NdCtrlStart.active = CtrlStart.bIsNeedStart;
        this.m_GameClientView.m_BtStart.active = CtrlStart.bIsNeedReady;
        if (CtrlStart.dwCountDown != 0)
        {
            if (!this.m_ReplayMode) this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, CtrlStart.dwCountDown / 1000);
        }
        return true;
    },

    //玩家准备
    OnSubUserReady: function (pData, wDataSize) {
        var ReadyState = GameDef.CMD_S_UserState();
        //效验
        if (wDataSize != gCByte.Bytes2Str(ReadyState, pData)) return false;
        this.m_GameClientView.SetUserState(INVALID_CHAIR);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pUserItem = this.GetClientUserItem(i);
            if (pUserItem == null || pUserItem == 0) continue;
            var ViewID = this.SwitchViewChairID(i);
            if (ReadyState.cbUserStatus[i]) {
                this.m_GameClientView.SetUserState(ViewID, 'Ready');
            }
        }

        //if(ReadyState.cbUserStatus[this.GetMeChairID()]) this.OnMessageStart(null,true);
        //  else this.m_GameClientView.m_BtStart.active = true;
        return true;
    },

    OnSubUpdateHistory: function (pData, wDataSize) {
        var HistoryInfo = GameDef.CMD_S_HistoryInfo();
        //效验
        if (wDataSize != gCByte.Bytes2Str(HistoryInfo, pData)) return false;
        //新增数据
        var bIn = false;
        for (var i in this.m_RecordArr) {
            if (this.m_RecordArr[i].wProgress == HistoryInfo.wProgress) bIn = true;
        }
        if (!bIn) this.m_RecordArr.push(HistoryInfo);
        if (this.m_HistoryCtrl) this.m_HistoryCtrl.OnShowCardRecord();
        return true;
    },

    OnSubCallResult:function(pData,wDataSize){
        var pResult = GameDef.CMD_S_CallResult();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pResult, pData)) return false;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //抢庄显示
            var ViewID = this.SwitchViewChairID(i);
            if (pResult.llBankerTimes[i] != 0xFF)
                this.m_GameClientView.SetUserCallBankerTimes(ViewID, pResult.llBankerTimes[i], false);
        }

        return true;
    },

    OnSubSendCardResult:function(pData,wDataSize){
        if (!this.m_ReplayMode) return true;

        var pResult = GameDef.CMD_S_SendCardResult();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pResult, pData)) return false;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if(parseInt(pResult.cbCardData[i][0]) == 0) continue;
            //抢庄显示
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(pResult.cbCardData[i], pResult.iSendCardCount);
        }
        
        return true;
    },

    OnSubJetResult:function(pData,wDataSize){
        if (!this.m_ReplayMode) return true;

        var pResult = GameDef.CMD_S_JetResult();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pResult, pData)) return false;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //抢庄显示
            var ViewID = this.SwitchViewChairID(i);
            if (pResult.llPlayerTimes[i] != 0)
                this.m_GameClientView.SetUserBet(ViewID, pResult.llPlayerTimes[i], 0, false);
        }
        
        return true;
    },
    
    OnSubOpenResult: function (pData, wDataSize) {
        if (!this.m_ReplayMode) return true;

        var pResult = GameDef.CMD_S_OpenResult();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pResult, pData)) return false;

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if(parseInt(pResult.cbCardData[i][0]) == 0) continue;
            //抢庄显示
            var ViewID = this.SwitchViewChairID(i);

            //玩家手牌
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(pResult.cbCardData[i], GameDef.MAX_COUNT);
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardShoot(pResult.cbFinalCardIndex[i]);

            this.m_GameClientView.SetCardType(ViewID, pResult.cbOxType[i],pResult.cbTypeTimes[i]);
        }
        
        return true;
    },
    //游戏结束
    OnSubGameConclude: function (pData, wDataSize) {
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;
        //设置状态
        this.m_GameClientView.HideAllGameButton();
        
        if (this.m_GameClientView.m_OpenCardCtrl != null)
            this.m_GameClientView.m_OpenCardCtrl.node.active = false;
        //删除时间
        this.KillGameClock();
        var lBankerScore = this.m_GameEnd.llBankerScore;
        if (this.m_bIsHoldBank)
            this.m_GameClientView.SetBankerScore(lBankerScore);

        this.m_GameClientView.SetUserCallBankerTimes(INVALID_CHAIR);

        //小结算界面
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //展示手牌
            if (!this.m_UserState[i]) continue;
            //显示分数
            var ViewID = this.SwitchViewChairID(i)
            this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.llGameScore[i]);

            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(this.m_GameEnd.cbCardData[i], GameDef.MAX_COUNT);
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardShoot(this.m_GameEnd.cbShootIndex[i]);
            this.m_GameClientView.SetCardType(ViewID, this.m_GameEnd.cbOxType[i], this.m_GameEnd.cbTypeTimes[i]);

            if (ViewID == GameDef.MYSELF_VIEW_ID) {
                if (this.m_GameEnd.llGameScore[i] > 0) cc.gSoundRes.PlayGameSound("WIN");
                if (this.m_GameEnd.llGameScore[i] < 0) cc.gSoundRes.PlayGameSound("LOSE");
            }
        }

        if (!this.m_ReplayMode)
        {
            this.schedule(this.OnTimeIDI_DEALAY_SCORE_ANIM, 0.5);
        }

        //设置定时
        if (this.m_ReplayMode)
            this.OnTimeIDI_PERFORM_END()
        else
            this.schedule(this.OnTimeIDI_PERFORM_END, 3);

        return true;
    },
    OnTimeIDI_DEALAY_SCORE_ANIM:function(){
        this.unschedule(this.OnTimeIDI_DEALAY_SCORE_ANIM);
        this.m_GameClientView.SetEndScoreAnim(this.m_wBankerUser, this.m_GameEnd.wWinRandArr, this.m_GameEnd.llGameScore);
    },

    OnTimeIDI_PERFORM_END: function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        if (this.m_RoomEnd == null) {
            
        } else {
            this.ShowEndView();
        }
    },

    OnEventRoomEnd: function (data, datasize) {
        this.m_RoomEnd = GameDef.CMD_S_GameCustomInfo();
        if (datasize != gCByte.Bytes2Str(this.m_RoomEnd, data)) return false;

        this.m_RoomEnd.UserID = new Array();

        //用户成绩
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if (pIClientUserItem == null) continue;
            this.m_RoomEnd.UserID[i] = pIClientUserItem.GetUserID();
        }

        if (this.m_wGameProgress > 0 || this.m_ReplayMode) {
            this.ShowEndView();
        } else {
            this.ShowAlert("该房间已被解散！", Alert_Yes, function (Res) {
                this.m_pTableScene.ExitGame();
            }.bind(this));
        }

        return true;
    },

    //开始消息
    OnMessageStart: function (Tag, bClear) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.ClearView();

        this.SendGameData(GameDef.SUB_C_READY);
        return 0;
    },

    //控制开始
    OnMessageCtrlStart: function () {
        // var cardArr = new Array(
        //     [0x01,0x02,0x03,0x04,0x05],[0x06,0x07,0x08,0x09,0x0A],
        //     [0x11,0x12,0x13,0x14,0x15],[0x16,0x17,0x18,0x19,0x1A],
        //     [0x21,0x12,0x23,0x24,0x25],[0x26,0x27,0x28,0x29,0x2A],
        //     [0x31,0x32,0x33,0x34,0x35],[0x36,0x37,0x38,0x39,0x3A],
        //     [0x0B,0x1B,0x2B,0x3B,0x4F],[0x1D,0x2D,0x3D,0x0D,255],);

        // this.m_GameClientView.m_SendCardCtrl.PlaySendCard(0.05, 0, cardArr);

        this.SendGameData(GameDef.SUB_C_START);
    },

    //叫分消息
    OnMessageCallBanker: function (callScore,iIndex) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.llScore = parseInt(callScore);
        CallScore.iIndex = parseInt(iIndex);
        this.SendGameData(GameDef.SUB_C_CALL_BANKER, CallScore);
    },
    //叫分消息
    OnMessageCallPlayer: function (callScore,iIndex) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.llScore = parseInt(callScore);
        CallScore.iIndex = parseInt(iIndex);
        this.SendGameData(GameDef.SUB_C_CALL_PLAYER, CallScore);
    },
    //叫分消息
    OnMessageCallDouble: function (isDouble) {
        //发送数据
        var ChangeJet = GameDef.CMD_C_ChangeJetInfo();
        ChangeJet.bIsDouble = isDouble;
        this.SendGameData(GameDef.SUB_C_CHANGE_JET, ChangeJet);
    },
    //翻牌
    OnMessageLookCard: function () {
        //发送数据
        this.SendGameData(GameDef.SUB_C_LOOK_CARD);
    },
    //搓牌
    OnMessageCtrlCuoPai: function () {
        //发送数据
        this.SendGameData(GameDef.SUB_C_CTRL_OPEN_CARD);
    },
    //提示
    OnMessageHint: function () {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        this.SendGameData(GameDef.SUB_C_HINT);
    },
    //亮牌
    OnMessageOpenCard: function () {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        this.SendGameData(GameDef.SUB_C_OPEN_CARD);
    },
    //历史
    OnMessageGetHistory: function (wProgress) {
        var History = GameDef.CMD_C_History();
        History.wProgress = parseInt(wProgress);
        this.SendGameData(GameDef.SUB_C_HISTORY, History);
    },
    //历史
    OnMessageShowHistoryView: function () {
        this.ShowGamePrefab("GameRecord", GameDef.KIND_ID, this.node, function (Js) {
            this.m_HistoryCtrl = Js;
            this.m_HistoryCtrl.OnShowCardRecord();
        }.bind(this));
    },

    //邀请好友分享
    OnFriend: function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {

        }
    },

    //发牌完成
    OnMessageDispatchFinish: function (wChairID, CardCount, CardData) {
        //发牌过程
        var ViewID = this.SwitchViewChairID(wChairID)
        this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(CardData, CardCount);
    },
    //切换椅子
    SwitchViewChairID2: function (wChairID) {
        if (wChairID == INVALID_CHAIR) return INVALID_CHAIR;

        var PlayerCount = GameDef.GetPlayerCount(this.m_dwServerRules, this.m_dwRulesArr);

        var wViewChairID = (parseInt(wChairID) + PlayerCount - this.GetMeChairID());
        return (wViewChairID + GameDef.MYSELF_VIEW_ID) % PlayerCount;
    },
    //设置信息
    SetViewRoomInfo: function (dwServerRules, dwRulesArr) {
        this.m_wGameCount = GameDef.GetGameCount(dwServerRules, dwRulesArr);

        this.m_GameClientView.SetViewRoomInfo(dwServerRules, dwRulesArr);
       
        this.m_bIsHoldBank = false;

        if (this.m_dwClubID > 0) {
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            var webUrl = window.PHP_HOME + '/League.php?&GetMark=6&dwUserID=' + pGlobalUserData.dwUserID;
            WebCenter.GetData(webUrl, 0, function (data) {
                var ClubList = JSON.parse(data);
                var bShow = false;
                for (var i in ClubList) {
                    if (this.m_dwClubID == ClubList[i].ClubID && ClubList[i].ClubLevel >= 9) bShow = true;
                }
            }.bind(this));
        }
    },

    OnClearScene: function () {
        //设置界面
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        this.unschedule(this.OnTimeIDI_DEALAY_SCORE_ANIM);
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.ClearView();
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_UserState = new Array();
        this.m_cbNoBanker = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_cbOxType[i] = 0xFF;
            this.m_lBankerTimes[i] = 0xFF;
            this.m_cbCardCount[i] = 0;
        }

        if (this.m_REndCtrl) {
            this.m_REndCtrl.OnDestroy();
            this.m_REndCtrl = null;
            this.m_RoomEnd = null;
        }
    },

    //点击设置
    /*OnBtClickedSet:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowGamePrefab('SetDlg',GameDef.KIND_ID);
    },*/
});
