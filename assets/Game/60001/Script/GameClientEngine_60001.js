//游戏时间
var IDI_OUT_CARD = 200; //出牌定时器
var IDI_START_GAME = 201; //开始定时器
var IDI_CALL_BANKER = 204; //抢庄定时器

//游戏时间
var TIME_OUT_CARD = 30;
var TIME_CALL_SCORE = 30;
var TIME_START = 10;

cc.Class({
    extends: cc.GameEngine,

    properties: {

    },

    Init:function(){
        if (this.m_bInit)
        return;
        this.m_bInit = true;
        this.m_GameStart = GameDef.CMD_S_GameStart();
        GameLogic = new window[('CGameLogic_60001')]();
        this.m_GameEnd = null;
        //搜索变量
        this.m_cbSearchResultIndex = 0;
        this.m_SearchCardResult = GameDef.tagSearchCardResult();
        this.m_EachSearchResult = GameDef.tagSearchCardResult();
        this.m_nCurSearchType = -1;
        this.m_cbEachSearchIndex = 0;
        //观战手牌
        this.m_cbLookonUserCard.length = GameDef.MAX_CARD_COUNT
        this.m_cbLookonUserCard.fill(0);
    },
    // use this for initialization
    start: function () {
        // console.log(' ~~~~~~~~~~~~~~~~~~~~~~~~~~ start (GameClientEngine_60001)');
        LoadSetting();
        this.Init();
    },

    ctor: function () {
        //var UrlHead = 'resources/SubGame/'+wKindID+'/Audio/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'], //.mp3
            ['GAME_START', 'GAME_START'],
            ['GAME_END', 'GAME_END'],
            ['GAME_WARN', 'GAME_WARN'],
            ['LEFT_WARN', 'LEFT_WARN'],

            //女
            ['W_3FEN', 'w/operation/fen3'],
            ['W_2FEN', 'w/operation/fen2'],
            ['W_1FEN', 'w/operation/fen1'],
            ['W_0FEN', 'w/operation/fen0'],
            ['W_READY', 'w/operation/zhunbei'],
            ['W_QIANG', 'w/operation/Qiang'],
            ['W_NOQIANG', 'w/operation/NoQiang'],
            ['W_BUGUAN', 'w/operation/buguan'],
           
            ['W_DANSHUN', 'w/cardtype/danshun'],
            ['W_SHUANGSHUN', 'w/cardtype/shuangshun'],
            ['W_SANSHUN', 'w/cardtype/sanshun'],
            ['W_SANZHANG', 'w/cardtype/sanzhang'],
            ['W_SANDAIYI', 'w/cardtype/sandaiyi'],
            ['W_SANDAIER', 'w/cardtype/sandaier'],
            ['W_SANDAIDUI', 'w/cardtype/sandaidui'],
            ['W_SIDAIER', 'w/cardtype/sidaier'],
            ['W_SIDAIDUI', 'w/cardtype/sidaidui'],
            ['W_FEIJI', 'w/cardtype/feiji'],
            ['W_FEIJICB', 'w/cardtype/feijicb'],
            ['W_ZHADAN', 'w/cardtype/zhadan'],
            ['W_HUOJIAN', 'w/cardtype/huojian'],
            
            //男
            ['M_3FEN', 'm/operation/fen3'],
            ['M_2FEN', 'm/operation/fen2'],
            ['M_1FEN', 'm/operation/fen1'],
            ['M_0FEN', 'm/operation/fen0'],
            ['M_READY', 'm/operation/zhunbei'],
            ['M_QIANG', 'm/operation/Qiang'],
            ['M_NOQIANG', 'm/operation/NoQiang'],
            ['M_BUGUAN', 'm/operation/buguan'],
           
            ['M_DANSHUN', 'm/cardtype/danshun'],
            ['M_SHUANGSHUN', 'm/cardtype/shuangshun'],
            ['M_SANSHUN', 'm/cardtype/sanshun'],
            ['M_SANZHANG', 'm/cardtype/sanzhang'],
            ['M_SANDAIYI', 'm/cardtype/sandaiyi'],
            ['M_SANDAIER', 'm/cardtype/sandaier'],
            ['M_SANDAIDUI', 'm/cardtype/sandaidui'],
            ['M_SIDAIER', 'm/cardtype/sidaier'],
            ['M_SIDAIDUI', 'm/cardtype/sidaidui'],
            ['M_FEIJI', 'm/cardtype/feiji'],
            ['M_FEIJICB', 'm/cardtype/feijicb'],
            ['M_ZHADAN', 'm/cardtype/zhadan'],
            ['M_HUOJIAN', 'm/cardtype/huojian'],

        );

        //出牌声音
        for (var i = 3; i < 18; ++i) {
            //单
            this.m_SoundArr[this.m_SoundArr.length] = ['M_1_' + i, 'm/cardvalue/1_' + i + ''];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_1_' + i, 'w/cardvalue/1_' + i + ''];

            //双
            this.m_SoundArr[this.m_SoundArr.length] = ['M_2_' + i, 'm/cardvalue/2_' + i + ''];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_2_' + i, 'w/cardvalue/2_' + i + ''];
        }

        //短语声音
        for (var i = 1; i <= 6; ++i) {
            var FileName = i < 10 ? '0' + i : i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m' + i, 'm/phrase/' + FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w' + i, 'w/phrase/' + FileName];
        }

        this.m_szText = new Array(
            '对不起，都是我的错，连累你了',
            '你这是非常6+7呀',
            '牌神，牌神，救救穷人',
            '人有多大胆，地有多大产',
            '速度速度加速度，快点快点在快点',
            '咱们相约下一个房间，不见不散'
        );

        //游戏变量
        this.m_bOutFirstCard = false;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_cbUserState = new Array();
        this.m_lBombScore = new Array();
        this.m_cbTrustee = new Array();
        
        //出牌变量
        this.m_cbTurnCardCount = 0;
        this.m_cbTurnCardData = new Array();
        
        //扑克变量
        this.m_cbCardData = new Array();
        this.m_cbOutCardData = new Array();
        this.m_cbCardCount = null;
        this.m_cbOutCardCount = null;
        this.m_cbLookonUserCard = new Array();
        this.m_cbBlankCard = new Array();

        this.m_bInit = false;
        return;
    },

    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START: //游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_BANKER: // 玩家抢庄
                {
                    return this.OnSubUserCallBanker(pData, wDataSize);
                }
            case GameDef.SUB_S_BANKER_INFO: //庄家信息
                {
                    return this.OnSubBankerInfo(pData, wDataSize);
                }
            case GameDef.SUB_S_OUT_CARD: //用户出牌
                {
                    return this.OnSubOutCard(pData, wDataSize);
                }
            case GameDef.SUB_S_PASS_CARD: //用户放弃
                {
                    return this.OnSubPassCard(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END: //游戏结束
                {
                    return this.OnSubGameEnd(pData, wDataSize);
                }
            case GameDef.SUB_S_TRUSTEE: // 玩家托管
                {
                    return this.OnSubTrustee(pData, wDataSize);
                }
            case GameDef.SUB_S_HEAP_CARD: //牌堆扑克
                {
                    return this.OnSubHeapCard(pData, wDataSize);
                }
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if (window.LOG_NET_DATA) console.log("OnEventSceneMessage cbGameStatus " + cbGameStatus + " size " + wDataSize)
        switch (cbGameStatus) {
            case GameDef.GAME_SCENE_FREE: //空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    
                    if(this.m_GameClientView.m_LittleResult) this.m_GameClientView.m_LittleResult.OnHideView();
                    this.m_lCellScore = pStatusFree.llCellScore;
                    this.m_cbTrustee.fill(0);
                    //玩家设置
                    if(!this.m_ReplayMode && !this.IsLookonMode()&&this.m_dwRoomID != 0){
                        if (gClientKernel.get().GetMeUserItem().GetUserStatus() != US_READY) this.m_GameClientView.m_BtStart.active = true;
                        this.m_GameClientView.m_BtFriend.active = this.m_wGameProgress == 0;
                    }
                    this.UpdateTrusteeControl();
                    return true;
                }
            case GameDef.GAME_SCENE_PLAY: //游戏状态
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) {
                        return false;
                    }
                    if(this.m_GameClientView.m_LittleResult) this.m_GameClientView.m_LittleResult.OnHideView();
                    //设置变量
                    var wMeChairID = this.GetMeChairID();
                    this.m_lCellScore = pStatusPlay.llCellScore;
                    this.m_cbGameStage = pStatusPlay.cbGameStage;
                    this.m_cbUserState = clone(pStatusPlay.cbUserState);
                    this.m_cbTrustee = clone(pStatusPlay.cbTrustee);
                    this.m_cbBlankCard = clone(pStatusPlay.cbBlankCard);
                    this.m_bOutFirstCard = pStatusPlay.bOutFirstCard;
                    this.m_wBankerUser = pStatusPlay.wBankerUser;
                    this.m_wOutUser = pStatusPlay.wTurnWiner;
                    this.m_wCurrentUser = pStatusPlay.wCurrentUser;
		            this.m_lBombScore = clone(pStatusPlay.llBombScore);
                    GameLogic.SetFirstOutCard(pStatusPlay.cbFirstOutCard);
                    this.SetLightCardData(pStatusPlay.cbFirstOutCard, pStatusPlay.cbNiaoCard);

                    //出牌变量
                    this.m_cbTurnCardCount = clone(pStatusPlay.cbTurnCardCount);
                    this.m_cbTurnCardData = clone(pStatusPlay.cbTurnCardData);
                    //扑克数据
                    this.m_cbCardCount = clone(pStatusPlay.cbCardCount);
                    this.m_cbCardData = clone(pStatusPlay.cbCardData);
                    GameLogic.SortCardList(this.m_cbCardData, this.m_cbCardCount[wMeChairID]);

                    //设置扑克
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        if(!this.m_cbUserState[i]) continue;
                        //获取位置
                        var wViewChairID = this.SwitchViewChairID(i);
                        //设置扑克
                        if (wViewChairID != GameDef.MYSELF_VIEW_ID) {
                            this.m_GameClientView.UpdateUserCardCount(wViewChairID, this.m_cbCardCount[i], this.m_cbCardCount[i] == 1);
                        }
                    }
                    var kernel = gClientKernel.get();
                    //设置牌
                    if(kernel.IsLookonMode()){
                        this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                    }else{
                        this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                    }
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser));

                    //出牌界面
                    if (pStatusPlay.wTurnWiner != INVALID_CHAIR) {
                        var wViewChairID = this.SwitchViewChairID(pStatusPlay.wTurnWiner);
                        this.m_GameClientView.m_OutCardCtrl[wViewChairID].SetCardData(this.m_cbTurnCardData, this.m_cbTurnCardCount);
                    }
                    for(var i = 0 ;i < GameDef.GAME_PLAYER; ++ i) {
                        this.AddHistoryCard(i, pStatusPlay.cbOutCardData[i], pStatusPlay.cbOutCardCount[i]);
                    }
                    this.UpdateUserScore();
                    //当前玩家界面
                    this.m_GameClientView.HideAllGameButton();
                    if (this.m_wCurrentUser == wMeChairID) {
                        if ((kernel.IsLookonMode() == false) && this.m_cbGameStage == GameDef.STAGE_CALL_BANKER) {
                            this.m_GameClientView.ShowCallUI(this.m_cbGameStage);
                        }
                        else if (this.m_cbGameStage == GameDef.STAGE_PLAY) {
                            //搜索出牌
                            this.m_cbSearchResultIndex = 0;
                            this.m_SearchCardResult = GameDef.tagSearchCardResult();
                            this.m_EachSearchResult = GameDef.tagSearchCardResult();
                            var wNext = this.NextUser();
                            if (pStatusPlay.wTurnWiner == wMeChairID) {
                                GameLogic.SearchOutCard(this.m_cbCardData, this.m_cbCardCount[wMeChairID], null, 0, this.m_SearchCardResult, this.m_bOutFirstCard, this.m_cbCardCount[wNext]==1, pStatusPlay.cbLeftMaxCard);
                            } else {
                                GameLogic.SearchOutCard(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbTurnCardData, this.m_cbTurnCardCount, this.m_SearchCardResult, this.m_bOutFirstCard, this.m_cbCardCount[wNext]==1, pStatusPlay.cbLeftMaxCard);
                            }
                            this.m_GameClientView.ShowCardUI();
                            //只有一种出牌方式 自动弹起
                            // this.OnPromptShoot();
                            // 自动提示
                            if (GameDef.IsAllowAutoPrompt(this.m_dwRules)) this.OnMessageOutPrompt();
                        }
                    }

                    //设置时间
                    this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, pStatusPlay.dwCountDown);
                    this.UpdateTrusteeControl();
                    return true;
                }
        }
        return false;
    },

    SetGameClock: function (wChairID, nTimerID, nElapse) {
        this.m_bPSound = true;
        this.m_GameClientView.SetUserTimer(wChairID, nElapse);
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
        var nElapse = parseInt(CountDown / 1000);
        var wViewChairID = this.SwitchViewChairID(wChairID);
        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;
        switch (nTimerID) {
            case IDI_START_GAME: //开始定时器
                {
                    if (kernel.GetMeUserItem().GetUserStatus() == US_READY) {
                        this.m_GameClientView.m_BtStart.active = false;
                        this.KillGameClock();
                        return
                    }
                    if (CountDown == 0) {//关闭游戏
                        if (this.m_dwRoomID == 0) this.m_TableViewFrame.ExitGame();
                    }
                    return true;
                }
            case IDI_OUT_CARD:
                {
                    var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules) ? GameDef.GetAutoTrusteeTime(this.m_dwRules) : TIME_OUT_CARD;
                    if ((CountDown < 0 || (this.m_cbTrustee[this.GetMeChairID()] && nElapse < TrusteeTime - 1))) {
                        this.KillGameClock();
                        return true;
                    }
                    //超时警告
                    if (CountDown <= 5000 && this.m_bPSound) {
                        cc.gSoundRes.PlayGameSound('GAME_WARN');
                        this.m_bPSound = false;
                    }
                    return true;
                }
        }

        return true;
    },

    SetLightCardData: function(cbFirstOutCard, cbNiaoCard) {
        var cbCardData = new Array();
        if(cbFirstOutCard) cbCardData.push(cbFirstOutCard)
        if(cbNiaoCard) cbCardData.push(cbNiaoCard);
        this.m_GameClientView.m_LightCardCtrl.SetCardData(cbCardData, cbCardData.length);
        this.m_GameClientView.m_LightCardCtrl.SetFirstOutCard(cbFirstOutCard);
        this.m_GameClientView.m_LightCardCtrl.SetNiaoCard(cbNiaoCard);
    },

    //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        this.Init();
        //隐藏成绩界面
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameEnd = null;
        if(this.m_GameClientView.m_LittleResult) this.m_GameClientView.m_LittleResult.OnHideView();
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart, pData)) return false;

        //搜索变量
        this.m_cbSearchResultIndex = 0;
        this.m_nCurSearchType = -1;
        this.m_cbEachSearchIndex = 0;
        this.m_SearchCardResult.cbSearchCount = 0;
        this.m_EachSearchResult.cbSearchCount = 0;
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            this.m_SearchCardResult.cbCardCount[i] = 0;
            this.m_EachSearchResult.cbCardCount[i] = 0;
            for (var j = 0; j < GameDef.MAX_CARD_COUNT; j++) {
                this.m_SearchCardResult.cbResultCard[i][j] = 0;
                this.m_EachSearchResult.cbResultCard[i][j] = 0;
            }
        }

        //游戏变量
        this.m_cbOutCardCount = null;
        this.m_cbOutCardData = null;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbTurnCardCount = 0;
        this.m_cbTurnCardData.length = GameDef.MAX_CARD_COUNT
        this.m_cbTurnCardData.fill(0);
        this.m_cbTrustee.length = GameDef.GAME_PLAYER
        this.m_cbTrustee.fill(0);
        this.m_lBombScore.length = GameDef.GAME_PLAYER
        this.m_lBombScore.fill(0);

        this.m_wCurrentUser = this.m_GameStart.wCurrentUser;
        this.m_cbGameStage = this.m_GameStart.cbGameStage;
        this.m_cbCardData = clone(this.m_GameStart.cbCardData);
        this.m_cbCardCount = clone(this.m_GameStart.cbCardCount);
        this.m_cbUserState = clone(this.m_GameStart.cbUserState);
        this.m_cbBlankCard = clone(this.m_GameStart.cbBlankCard);
        GameLogic.SetFirstOutCard(this.m_GameStart.cbFirstOutCard);
        this.SetLightCardData(this.m_GameStart.cbFirstOutCard, this.m_GameStart.cbNiaoCard);

        //界面
        this.m_GameClientView.m_BtStart.active = false;
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.m_HandCardCtrl.SetCardData(null, 0);
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_GameClientView.m_OutCardCtrl[i].SetCardData(null, 0);
        }
        this.UpdateTrusteeControl();

        if (this.m_ReplayMode) {
            this.OnMessageDispatchFinish(0, 0, 0);
            return true;
        }
        
        //播放开始声音
        cc.gSoundRes.PlayGameSound('GAME_START');

        //发牌动画
        if(!this.m_ReplayMode){
            var wViewStartUser = this.SwitchViewChairID(this.m_GameStart.wCurrentUser);
            this.m_GameClientView.m_SendCardCtrl.PlaySendCard(this.m_cbCardCount[this.GetMeChairID()] - 1, wViewStartUser);
        }
        return true;
    },

    OnSubUserCallBanker: function (pData, wDataSize) {
        var pCallBanker = GameDef.CMD_S_UserCallBanker();
        //效验参数
        if (wDataSize != gCByte.Bytes2Str(pCallBanker, pData)) return false;

        this.m_wCurrentUser = pCallBanker.wCurrentUser;
        var wMeChairID = this.GetMeChairID();
        //显示按钮
        var kernel = gClientKernel.get();
        if ((kernel.IsLookonMode() == false) && this.m_wCurrentUser == wMeChairID) {
            this.m_GameClientView.ShowCallUI(this.m_cbGameStage);
        }

        var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules);
        this.SetGameClock(this.m_wCurrentUser, IDI_CALL_BANKER, TrusteeTime > 0 ? TrusteeTime : TIME_CALL_SCORE);

        // 更新UI
        var wViewID = this.SwitchViewChairID(pCallBanker.wCallUser)
        this.m_GameClientView.ShowUserCallBanker(wViewID, pCallBanker.cbState);
        // 播放声音
        this.PlayActionSound(pCallBanker.wCallUser, pCallBanker.cbState == 1 ? 'QIANG' : 'NOQIANG');
        return true;
    },

    //庄家信息
    OnSubBankerInfo: function (pData, wDataSize) {
        var pBankerInfo = GameDef.CMD_S_BankerInfo();
        //效验参数
        if (wDataSize != gCByte.Bytes2Str(pBankerInfo, pData)) return false;

        //设置变量
        this.m_wBankerUser = pBankerInfo.wBankerUser;
        this.m_wCurrentUser = pBankerInfo.wCurrentUser;
        this.m_cbGameStage = pBankerInfo.cbGameStage;
        this.m_bOutFirstCard = pBankerInfo.bOutFirstCard;

        //设置界面
        var wViewChairID = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(wViewChairID);
        this.m_GameClientView.ShowUserCallBanker(INVALID_CHAIR);
        this.m_GameClientView.ShowCallUI(this.m_cbGameStage);
        this.m_GameClientView.m_BtTrustee.node.active = true;

        this.m_GameClientView.HideAllGameButton();
        if ((this.IsLookonMode() == false) && (this.m_wCurrentUser == this.GetMeChairID())) {
            this.m_SearchCardResult = GameDef.tagSearchCardResult();
            this.m_EachSearchResult = GameDef.tagSearchCardResult();
            var wNext = this.NextUser();
            GameLogic.SearchOutCard(this.m_cbCardData, this.m_cbCardCount[this.m_wCurrentUser], this.m_cbTurnCardData, this.m_cbTurnCardCount, this.m_SearchCardResult, this.m_bOutFirstCard, this.m_cbCardCount[wNext]==1, pBankerInfo.cbLeftMaxCard);
            //显示按钮
            // this.m_GameClientView.ShowCardUI();
        }
        //var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules);
        //this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TrusteeTime > 0 ? TrusteeTime : TIME_OUT_CARD);
        return true;
    },

    NextUser: function(){
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i){
            var temp = (this.m_wCurrentUser + i + 1) % GameDef.GAME_PLAYER;
            if(this.m_cbUserState[temp]) return temp;
        }
        return INVALID_CHAIR;
    },

    AddHistoryCard: function(wChairID, cbCardData, cbCardCount) {
        if(!this.m_cbOutCardCount) {
            this.m_cbOutCardCount = new Array(GameDef.GAME_PLAYER);
            this.m_cbOutCardCount.fill(0);
            this.m_cbOutCardData = new Array(GameDef.GAME_PLAYER);
            for(var i = 0 ;i < GameDef.GAME_PLAYER; ++ i) {
                this.m_cbOutCardData[i] = new Array(GameDef.MAX_CARD_COUNT);
                this.m_cbOutCardData[i].fill(0);
            }
        }
        for (var i = 0; i < cbCardCount; ++i) {
            this.m_cbOutCardData[wChairID][this.m_cbOutCardCount[wChairID] + i] = cbCardData[i];
        }
        this.m_cbOutCardCount[wChairID] += cbCardCount;
    },

    //用户出牌
    OnSubOutCard: function (pData, wDataSize) {
        //变量定义
        var pOutCard = GameDef.CMD_S_OutCard();
        gCByte.Bytes2Str(pOutCard, pData);
        pOutCard.cbCardData = new Array(pOutCard.cbCardCount);
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pOutCard, pData)) return false;

        this.m_bOutFirstCard = false;
        //变量定义
        var wMeChairID = this.GetMeChairID();
        var wViewChairID = this.SwitchViewChairID(pOutCard.wOutCardUser);
        var cbTurnCardType = GameLogic.GetCardType(pOutCard.cbCardData, pOutCard.cbCardCount);

        //删除时间
        this.KillGameClock();
        this.m_GameClientView.HideAllGameButton();

        if (!this.m_ReplayMode && cbTurnCardType == GameDef.CT_BOMB_CARD) this.m_GameClientView.PlayAni('Zhadan_Animaiton');

        //历史清理
        if (this.m_cbTurnCardCount == 0) {
            //用户扑克
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                //桌面清理
                if (i != pOutCard.wOutCardUser) {
                    this.m_GameClientView.m_OutCardCtrl[this.SwitchViewChairID(i)].SetCardData(null, 0);
                }
            }
        }

        //更新倍数
        var cbCardType = GameLogic.GetCardType(pOutCard.cbCardData, pOutCard.cbCardCount);
        if (cbCardType == GameDef.CT_BOMB_CARD || cbCardType == GameDef.CT_MISSILE_CARD) { }

        this.PlayCardTypeSound(pOutCard.wOutCardUser, cbCardType, GameLogic.GetCardLogicValue(pOutCard.cbCardData[0]).toString(), pOutCard.cbCardCount);

        //出牌动作
        var kernel = gClientKernel.get();

        //显示出牌
        this.m_GameClientView.m_OutCardCtrl[wViewChairID].SetCardData(pOutCard.cbCardData, pOutCard.cbCardCount);
        this.AddHistoryCard(pOutCard.wOutCardUser, pOutCard.cbCardData, pOutCard.cbCardCount);

        //删除扑克
        if (pOutCard.wOutCardUser == wMeChairID) {
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(0, 0);
            if (!GameLogic.RemoveCardList(pOutCard.cbCardData, pOutCard.cbCardCount, this.m_cbCardData, this.m_cbCardCount[wMeChairID])) {
                return false;
            }
            this.m_cbCardCount[wMeChairID] -= pOutCard.cbCardCount;
            if(kernel.IsLookonMode()){
                this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
            }else{
                this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                this.m_GameClientView.m_HandCardCtrl.SetGrayCard();
            }
        } else {
            //设置扑克
            this.m_cbCardCount[pOutCard.wOutCardUser] -= pOutCard.cbCardCount;
            this.m_GameClientView.UpdateUserCardCount(wViewChairID, this.m_cbCardCount[pOutCard.wOutCardUser], this.m_cbCardCount[pOutCard.wOutCardUser] == 1);
            //报警
            if (this.m_cbCardCount[pOutCard.wOutCardUser] < 2 && this.m_cbCardCount[pOutCard.wOutCardUser] > 0) {
                cc.gSoundRes.PlayGameSound('LEFT_WARN');
            }
            this.m_GameClientView.m_HandCardCtrl.SetGrayCard();
        }

        //出牌变量
        this.m_wCurrentUser = pOutCard.wCurrentUser;
        this.m_cbTurnCardCount = (cbCardType == GameDef.CT_MISSILE_CARD ? 0 : pOutCard.cbCardCount);
        for (var i = 0; i < pOutCard.cbCardCount; i++) {
            this.m_cbTurnCardData[i] = (cbCardType == GameDef.CT_MISSILE_CARD ? 0 : pOutCard.cbCardData[i]);
        }

        this.OnMessageOutCardFinish(pOutCard.cbLeftMaxCard);
        return true;
    },
    
    //分数刷新
    UpdateUserScore: function() {
        var lScore = new Array(GameDef.GAME_PLAYER);
        lScore.fill(0);
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            var pUserItem = this.GetClientUserItem(i);
            if(!pUserItem) continue;
            lScore[i] += pUserItem.GetUserScore();
            lScore[i] += this.m_lBombScore[i];
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserInfo[wViewID].SetUserScore(lScore[i]);
        }
    },

    //用户放弃
    OnSubPassCard: function (pData, wDataSize) {
        var pPassCard = GameDef.CMD_S_PassCard();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pPassCard, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        //设置变量
        this.m_wCurrentUser = pPassCard.wCurrentUser;
        var ViewID = this.SwitchViewChairID(pPassCard.wPassUser);
        this.m_GameClientView.m_OutCardCtrl[ViewID].SetCardData(null, 0);
        //放弃设置
        var kernel = gClientKernel.get();

        this.KillGameClock();
        if (!this.m_ReplayMode) this.m_GameClientView.SetUserState(ViewID, 'Pass', 1);

        //播放声音
        this.PlayActionSound(pPassCard.wPassUser, "BUGUAN");
        //玩家设置
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            //变量定义
            var wViewChairID = this.SwitchViewChairID(this.m_wCurrentUser);
            //门前清理
            this.m_GameClientView.m_OutCardCtrl[wViewChairID].SetCardData(null, 0);
        }
        //一轮判断
        if (pPassCard.cbNewTurn) {
            this.m_cbTurnCardCount = 0;
            for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
                this.m_cbTurnCardData[i] = 0;
            }
        }

        //玩家设置
        this.m_GameClientView.HideAllGameButton();
        var wMeChairID = this.GetMeChairID();
        if (this.m_wCurrentUser == wMeChairID) {
            if(kernel.IsLookonMode() == false){
                this.m_cbBlankCard[wMeChairID] = 0;
                this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                this.m_cbSearchResultIndex = 0;
                this.m_SearchCardResult = GameDef.tagSearchCardResult();
                this.m_EachSearchResult = GameDef.tagSearchCardResult();
                var wNext = this.NextUser();
                GameLogic.SearchOutCard(this.m_cbCardData, this.m_cbCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                    this.m_cbTurnCardCount, this.m_SearchCardResult, false, this.m_cbCardCount[wNext]==1, pPassCard.cbLeftMaxCard);
                if (this.m_SearchCardResult.cbSearchCount == 0 && ViewID != GameDef.MYSELF_VIEW_ID && !this.m_ReplayMode) { //
                    this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 1);
                }
                //显示按钮
                this.m_GameClientView.ShowCardUI();

                //只有一种出牌方式 自动弹起
                // this.OnPromptShoot();
                // 自动提示
                if(GameDef.IsAllowAutoPrompt(this.m_dwRules)) this.OnMessageOutPrompt();
            }else{
                this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
            }
        }
        this.m_lBombScore = clone(pPassCard.llBombScore);
        // 显示得分
        for(var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if(pPassCard.llBombScore[i] == 0) continue;
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserDynamicScore(wViewID, pPassCard.llBombScore[i], 3);
        }
        this.UpdateUserScore();
        //设置时间
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            //设置时间
            if (this.m_wCurrentUser == this.GetMeChairID() && this.m_SearchCardResult.cbSearchCount == 0) {
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, 0.5);
            } else {
                var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules);
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TrusteeTime > 0 ? TrusteeTime : TIME_OUT_CARD);
            }
        }

        return true;
    },

    // 玩家托管
    OnSubTrustee: function (pData, wDataSize) {
        var pTrustee = GameDef.CMD_S_Trustee();
        if (wDataSize != gCByte.Bytes2Str(pTrustee, pData)) return false;
        this.m_cbTrustee[pTrustee.wChairID] = pTrustee.cbState;
        this.UpdateTrusteeControl();
        return true;
    },

    //提示消息
    OnPromptShoot: function (wParam, lParam) {
        var cbEnableData = new Array();
        var cbEnableCount = 0;
        var cbEnableCard = new Array();
        var bAllLight = false;//是否全亮

        //只有一张大过牌
        if (this.m_SearchCardResult.cbSearchCount == 1) {
            //设置界面
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(this.m_SearchCardResult.cbResultCard[0],
                this.m_SearchCardResult.cbCardCount[0]);

            for (var j = 0; j < this.m_SearchCardResult.cbCardCount[0]; j++) {
                if(this.m_SearchCardResult.cbResultCard[0][j] == 0) continue;
                cbEnableData[cbEnableCount] = this.m_SearchCardResult.cbResultCard[0][j];
                cbEnableCount++;
            }
            for(var i=0;i<GameDef.MAX_CARD_COUNT ;i++){
                for(var j = 0; j<cbEnableCount;j++){
                    if(GameLogic.GetCardValue(this.m_cbCardData[i])==GameLogic.GetCardValue(cbEnableData[j])) cbEnableCard[i] = this.m_cbCardData[i];
                }
            }

            //设置控件
            var bOutCard = this.VerdictOutCard();
            this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);
        }else if(this.m_SearchCardResult.cbSearchCount > 1 ){//有多种搜索 不能选的牌灰色禁选

            for (var i = 0; i < this.m_SearchCardResult.cbCardCount.length ; i++) {
                for (var j = 0; j < this.m_SearchCardResult.cbCardCount[i]; j++) {
                    if(this.m_SearchCardResult.cbResultCard[i][j] == 0) continue;
                    cbEnableData[cbEnableCount] = this.m_SearchCardResult.cbResultCard[i][j];
                    cbEnableCount++;
                }
            }
            for(var i=0;i<GameDef.MAX_CARD_COUNT ;i++){
                for(var j = 0; j<cbEnableCount;j++){
                    if(GameLogic.GetCardValue(this.m_cbCardData[i])==GameLogic.GetCardValue(cbEnableData[j])) cbEnableCard[i] = this.m_cbCardData[i];
                }
            }
        }
        this.m_GameClientView.m_HandCardCtrl.SetGrayCard(cbEnableCard,GameDef.MAX_CARD_COUNT);

        for(var i=0;i<this.m_SearchCardResult.cbCardType.length;i++){//牌里有三带四带飞机
            if(this.m_SearchCardResult.cbCardType[i]>=GameDef.CT_3_TAKE_1_1 && this.m_SearchCardResult.cbCardType[i]<=GameDef.CT_AIRPLANE_TAKE_2_2)
            {bAllLight = true;break;}

        }
        //首次出牌
        if(this.m_bOutFirstCard && (this.m_cbCardCount[this.GetMeChairID()] == GameDef.GetMaxCardCount(this.m_dwRules)) && this.m_cbTurnCardCount == 0){
            var bSameValue = 0;
            for(var i=0;i<GameDef.MAX_CARD_COUNT ;i++){
                if(!this.m_cbCardData[i]) continue;
                if(GameLogic.GetCardValue(this.m_cbCardData[i]) > 3) continue;
                bSameValue++;
            }
            if(bSameValue<3) bAllLight = false;
        }
        if(bAllLight)this.m_GameClientView.m_HandCardCtrl.SetGrayCard();
        return 0;
    },

    //出牌判断
    VerdictOutCard: function () {
        var wMeChairID = this.GetMeChairID();

        //状态判断
        if (this.m_wCurrentUser != wMeChairID) return false;

        //获取扑克
        var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
        var cbShootCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_CARD_COUNT);
        var cbCardType = GameLogic.GetCardType(cbCardData, cbShootCount);
        if(!GameDef.IsAllowBombBreak(this.m_dwRules) && cbCardType != GameDef.CT_BOMB_CARD && (cbCardType > GameDef.CT_4_TAKE_2_2 || cbCardType < GameDef.CT_4_TAKE_1_1)) {
            for (var i = 0; i < cbShootCount; i++) {
                var cbTempCard = new Array();
                var cbSameCount = 0;
                var cbValue = 0;
                cbValue = GameLogic.GetCardValue(cbCardData[i]);
                for (var j = 0; j < this.m_cbCardCount[this.GetMeChairID()]; j++) {
                    var cbValue1 = GameLogic.GetCardValue(this.m_cbCardData[j]);
                    if (cbValue == cbValue1) {
                        cbSameCount++;
                        cbTempCard.push(this.m_cbCardData[j]);
                    }
                }
                if (GameLogic.GetCardType(cbTempCard, cbSameCount) == GameDef.CT_BOMB_CARD) return false;
            }
        }

        //出牌判断
        var wNext = this.NextUser();
        if(cbShootCount == 1 && this.m_cbCardCount[wNext] == 1) {
            // 下家报单处理
            for(var i = 0; i < this.m_SearchCardResult.cbSearchCount; ++ i) {
                if( this.m_SearchCardResult.cbCardCount[i] != 1 ) continue;
                if(GameLogic.IsSameCard(cbCardData[0], this.m_SearchCardResult.cbResultCard[i][0])) return true;
            }
        }
        else if (cbShootCount > 0) {
            //类型判断
            GameLogic.SortCardList(cbCardData, cbShootCount);
            if(this.m_bOutFirstCard) {
                if(!GameLogic.HasFirstOutCard(cbCardData, cbShootCount)) return false;
            }
            var objTouPaoState = new Object();
            var cbTurnUser = 0;
            //跟牌判断
            if (this.m_cbTurnCardCount == 0){
                cbTurnUser = 1;//出牌
                if (GameLogic.GetCardType(cbCardData, cbShootCount, objTouPaoState, this.m_cbCardData, this.m_cbCardCount[wMeChairID],cbTurnUser) == GameDef.CT_ERROR) return false;
                return true;
            }else{
                cbTurnUser = 2;//接牌
            }
            return GameLogic.CompareCard(this.m_cbTurnCardData, cbCardData, this.m_cbCardData, this.m_cbTurnCardCount, cbShootCount, this.m_cbCardCount[wMeChairID],cbTurnUser);
        }

        return false;
    },

    //左键扑克
    OnLeftHitCard: function (bHasShoot) {
        //设置控件
        var bOutCard = this.VerdictOutCard();
        this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);
        if (!bHasShoot && !bOutCard) {
            this.OnAutoChangeShoot();
        }
        return 0;
    },

    //左键扑克
    OnAutoChangeShoot: function () {
        //获取扑克
        var cbCardData = new Array();
        var cbShootCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_CARD_COUNT);
        var TempRes = GameDef.tagSearchCardResult();
        GameLogic.SearchOutCard(cbCardData, cbShootCount, this.m_cbTurnCardData, this.m_cbTurnCardCount, TempRes);
        for (var i = TempRes.cbSearchCount - 1; i >= 0; i--) {
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(TempRes.cbResultCard[i], TempRes.cbCardCount[i]);
            this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            return;
        }
        //出牌判断
        if (this.m_cbTurnCardCount > 0 && !this.VerdictOutCard()) {
            //类型判断
            GameLogic.SortCardList(cbCardData, cbShootCount);
            cbShootCount = GameLogic.CalcValidCard(cbCardData, cbShootCount, this.m_cbTurnCardData, this.m_cbTurnCardCount);

            if (window.LOG_NET_DATA) console.log('OnAutoChangeShoot ', cbShootCount, cbCardData)
            if (cbShootCount == 0) return;
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(cbCardData, cbShootCount);
            this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            return;
        }
    },

    //开始消息
    OnMessageStart: function (wParam, lParam) {
        //删除时间
        this.KillGameClock();

        //扑克控件
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserDynamicScore(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();

        //界面庄家
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        //设置界面
        this.m_GameClientView.m_BtStart.active = false;

        //发送消息
        if (!lParam) this.SendFrameData(SUB_GF_USER_READY);
        return 0;
    },

    //出牌消息
    OnMessageOutCard: function (wParam, lParam) {
        //状态判断
        if (this.m_GameClientView.m_btOutCard.interactable == false) return 0;

        //获取扑克
        var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
        var cbCardCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_CARD_COUNT);

        //排列扑克
        GameLogic.SortCardList(cbCardData, cbCardCount);

        //删除时间
        this.KillGameClock();

        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_cbSearchResultIndex = 0;
        this.m_SearchCardResult.cbSearchCount = 0;

        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //构造数据
        var OutCard = GameDef.CMD_C_OutCard();
        OutCard.cbCardCount = cbCardCount;
        for (var i = 0; i < cbCardCount; i++) {
            OutCard.cbCardData[i] = cbCardData[i];
        }

        //发送数据
        this.SendGameData(GameDef.SUB_C_OUT_CARD, OutCard);
        return 0;
    },

    //PASS消息
    OnMessagePassCard: function (wParam, lParam) {
        //状态判断
        if (this.m_GameClientView.m_btPass.interactable == false) return 0;
        if (this.m_GameClientView.m_btPass.interactable == false) return 0;

        //删除时间
        this.KillGameClock();

        //设置变量
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_cbSearchResultIndex = 0;
        this.m_SearchCardResult.cbSearchCount = 0;

        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //设置扑克
        this.m_GameClientView.m_HandCardCtrl.SetShootCard(null, 0);

        //发送数据
        this.SendGameData(GameDef.SUB_C_PASS_CARD);
        return 0;
    },

    //提示消息
    OnMessageOutPrompt: function (wParam, lParam) {
        //有大过牌
        if (this.m_SearchCardResult.cbSearchCount > 0) {
            //设置界面
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(this.m_SearchCardResult.cbResultCard[this.m_cbSearchResultIndex],
                this.m_SearchCardResult.cbCardCount[this.m_cbSearchResultIndex]);

            //设置控件
            var bOutCard = this.VerdictOutCard();
            this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);

            //设置变量
            this.m_cbSearchResultIndex = (this.m_cbSearchResultIndex + 1) % this.m_SearchCardResult.cbSearchCount;
            return 0;
        } else {
            this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 1);
        }
        return 0;
    },

    //叫分消息
    OnMessageCallScore: function (callScore) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallBanker = GameDef.CMD_C_UserCallBanker();
        CallBanker.cbState = parseInt(callScore);
        this.SendGameData(GameDef.SUB_C_CALL_BANKER, CallBanker);
        return 0;
    },

    //出牌完成
    OnMessageOutCardFinish: function (cbLeftMaxCard) {
        //出牌设置
        var wMeChairID = this.GetMeChairID();
        var kernel = gClientKernel.get();
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            //出牌按钮
            if (this.m_wCurrentUser == wMeChairID) {
                if(kernel.IsLookonMode() == false){
                    this.m_cbBlankCard[wMeChairID] = 0;
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                    //搜索提示
                    this.m_cbSearchResultIndex = 0;
                    this.m_SearchCardResult = GameDef.tagSearchCardResult();
                    this.m_EachSearchResult = GameDef.tagSearchCardResult();
                    var wNext = this.NextUser();
                    GameLogic.SearchOutCard(this.m_cbCardData, this.m_cbCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                        this.m_cbTurnCardCount, this.m_SearchCardResult, false, this.m_cbCardCount[wNext]==1, cbLeftMaxCard);
                    if (this.m_SearchCardResult.cbSearchCount == 0) {
                        this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 1);
                    }
                    //显示按钮
                    this.m_GameClientView.ShowCardUI();
                    //只有一种出牌方式 自动弹起
                    // this.OnPromptShoot();
                    // 自动提示
                    if(GameDef.IsAllowAutoPrompt(this.m_dwRules)) this.OnMessageOutPrompt();
                }else{
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
                }

            }
        }
        //设置时间
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            if (this.m_wCurrentUser == wMeChairID && this.m_SearchCardResult.cbSearchCount == 0) {
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, 0.5);
            } else {
                var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules);
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TrusteeTime > 0 ? TrusteeTime : TIME_OUT_CARD);
            }
        }
        return 0;
    },

    //发牌完成
    OnMessageDispatchFinish: function (wViewID, CardIndex, ActCard) {
        var wMeChairID = this.GetMeChairID();
        //发牌过程
        if (ActCard) {
            //设置扑克
            if (wViewID == GameDef.MYSELF_VIEW_ID) {
                if(this.IsLookonMode() == false){
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, CardIndex + 1, this.m_cbBlankCard[wMeChairID]);
                    this.m_GameClientView.m_HandCardCtrl.SetGrayCard();
                }else{
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, CardIndex + 1, this.m_cbBlankCard[wMeChairID]);
                }
            } else {
                this.m_GameClientView.UpdateUserCardCount(wViewID, CardIndex + 1);
            }
            return;
        }
        // 搓牌
        if(0 && this.m_dwRules & GameDef.GAME_TYPE_CUO_PAI) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if(!this.m_cbUserState[i] || i == wMeChairID) continue;
                var wViewID = this.SwitchViewChairID(i);
                this.m_GameClientView.UpdateUserCardCount(wViewID, this.m_cbCardCount[i] - 1);
            }

            GameLogic.SortCardList(this.m_cbCardData, this.m_cbCardCount[wMeChairID]);
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID]-1, this.m_cbBlankCard[wMeChairID]);

            this.m_GameClientView.m_OpenCardCtrl.node.active = true;
            this.m_GameClientView.m_OpenCardCtrl.SetCardData(this.m_cbCardData[this.m_cbCardCount[wMeChairID] - 1]);
            return true;
        } else {
            this.OnClickOpenCard();
        }
        return 0;
    },

    OnClickOpenCard: function() {
        //排列扑克
        var wMeChairID = this.GetMeChairID();
        GameLogic.SortCardList(this.m_cbCardData, this.m_cbCardCount[wMeChairID]);
        if(this.IsLookonMode() == false){
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
        }else{
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbLookonUserCard, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
        }

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if(i == wMeChairID) continue;
            var wViewID = this.SwitchViewChairID(i);
            if(!this.m_cbUserState[i]){
                this.m_GameClientView.m_UserState[wViewID].HideCnt();
                this.m_GameClientView.m_UserState[wViewID].ShowCntWarning(false);
            }else{   
                this.m_GameClientView.UpdateUserCardCount(wViewID, this.m_cbCardCount[i]);
            }
        }

        //显示按钮
        if ((this.IsLookonMode() == false) && this.m_wCurrentUser == wMeChairID) {
            this.m_cbBlankCard[wMeChairID] = 0;
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbCardData, this.m_cbCardCount[wMeChairID], this.m_cbBlankCard[wMeChairID]);
            this.m_GameClientView.ShowCallUI(this.m_cbGameStage);
            //显示按钮
            if(this.m_cbGameStage == GameDef.STAGE_PLAY) {
                this.m_GameClientView.ShowCardUI();
                //只有一种出牌方式 自动弹起
                // this.OnPromptShoot();
                // 自动提示
                if(GameDef.IsAllowAutoPrompt(this.m_dwRules)) this.OnMessageOutPrompt();
            }
        }
        //设置时间
        var TrusteeTime = GameDef.GetAutoTrusteeTime(this.m_dwRules);
        this.SetGameClock(this.m_wCurrentUser, IDI_CALL_BANKER, TrusteeTime > 0 ? TrusteeTime : TIME_CALL_SCORE);
        this.m_GameClientView.m_OpenCardCtrl.node.active = false;
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
     //游戏结束
     OnSubGameEnd: function (pData, wDataSize) {
        //效验数据
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;

        //播放结束声音
        cc.gSoundRes.PlayGameSound('GAME_END');

        //设置界面
        this.KillGameClock();
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.m_HandCardCtrl.SetCardData(null, 0);
        this.m_GameClientView.UpdateUserCardCount(INVALID_CHAIR);


        // 设置变量
        var szNickname = new Array();
        var dwUserID = new Array();
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            var pIClientUserItem = this.GetClientUserItem(i);
            if (pIClientUserItem == null) continue;
            szNickname[i] = pIClientUserItem.GetNickName();
            dwUserID[i] = pIClientUserItem.GetUserID();
        }
        this.m_GameEnd.wBankerUser = this.m_wBankerUser;
        this.m_GameEnd.szNickname = clone(szNickname);
        this.m_GameEnd.dwUserID = clone(dwUserID);
        this.m_GameEnd.cbUserState = clone(this.m_cbUserState);

        var bSpringAni = false;
        if(!this.m_ReplayMode){
            //春天动画
            for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
                if(this.m_GameEnd.cbSpring[i]) bSpringAni = true;
                if(this.m_GameEnd.cbSpring[i] == 1) this.m_GameClientView.PlayAni('chuntian');
                else if(this.m_GameEnd.cbSpring[i] == 2) this.m_GameClientView.PlayAni('fanchuntian');
            }
        }

        //小结算界面
        var wWinner = INVALID_CHAIR;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_cbUserState[i]) continue;
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserDynamicScore(wViewID, this.m_GameEnd.llScore[i]);
            if (this.m_GameEnd.cbCardCount[i] > 0) {
                this.m_GameClientView.m_TableCardCtrl[wViewID].SetCardData(this.m_GameEnd.cbCardData[i], this.m_GameEnd.cbCardCount[i]);
            }
            if (this.m_GameEnd.cbResult[i] == 1) {
                wWinner = i;
            }
        }

        if (this.m_GameEnd.wWinnerJH < GameDef.GAME_PLAYER) {
            this.scheduleOnce(this.OnTimeIDI_SHOW_BD, 3);
        } else {
            //设置定时
            if (this.m_ReplayMode || this.m_GameEnd.wWinner >= GameDef.GAME_PLAYER) this.OnTimeIDI_PERFORM_END()
            else if(bSpringAni) this.scheduleOnce(this.OnTimeIDI_PERFORM_END, 3);
            else this.scheduleOnce(this.OnTimeIDI_PERFORM_END, 0.2);
        }

        return true;
    },

    // 显示比点
    OnTimeIDI_SHOW_BD: function () {
        if(this.m_dwRules & GameDef.GAME_TYPE_BI_DIAN) {
            this.m_GameClientView.InitTableCard();
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if(!this.m_cbUserState[i]) continue;
                var wViewID = this.SwitchViewChairID(i);
                this.m_GameClientView.m_TableCardCtrl[wViewID].SetCardData(this.m_GameEnd.cbCardDataJH[i], 3);
            }
        }
        //设置定时
        if (this.m_ReplayMode)
            this.OnTimeIDI_PERFORM_END()
        else
            this.scheduleOnce(this.OnTimeIDI_PERFORM_END, 0.2);
    },

    //执行结束
    OnTimeIDI_PERFORM_END: function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        // 清除上局残余
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_GameClientView.m_TableCardCtrl[i].SetCardData(null, 0);
            this.m_GameClientView.m_OutCardCtrl[i].SetCardData(null, 0);
        }
        // 成绩界面
        this.ShowGamePrefab("LittleResultBG", GameDef.KIND_ID, this.m_GameClientView.node, function (Js) {
            this.m_GameClientView.m_LittleResult = Js;
            this.m_GameClientView.m_LittleResult.node.zIndex = 9;

            // 隐藏解散
            if (this.m_DisCtrl) {
                this.m_DisCtrl.node.active = false;
            }
            // 隐藏大局结算
            if (this.m_REndCtrl) {
                this.m_REndCtrl.node.active = false;
            }
            this.m_GameClientView.m_BtStart.active = true;
        }.bind(this));

    },

    checkTotalEnd:function(bNext){
        if(this.m_RoomEnd){
            if(this.m_wGameProgress > 0 || this.m_ReplayMode){
                this.RealShowEndView();
            }else{
                this.ShowAlert("该房间已被解散！", Alert_Yes, function(Res) {
                    this.m_pTableScene.ExitGame();
                }.bind(this));
            }
        }else{
            if(bNext) this.OnMessageStart();
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
    //////////////////////////////////////////////////////////////////////////
    SetViewRoomInfo: function (dwServerRules, dwRulesArr) {
        this.m_dwRules = dwRulesArr[0];
        GameLogic.SetRules(this.m_dwRules);
        GameDef.SetRules(this.m_dwRules);
        this.m_wGameCount = GameDef.GetGameCount(dwServerRules, dwRulesArr);
        this.m_GameClientView.SetViewRoomInfo(dwServerRules, dwRulesArr);
    },

    OnClearScene: function () {
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.SetUserDynamicScore(INVALID_CHAIR);
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.UpdateUserCardCount(INVALID_CHAIR);
        //界面庄家
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        if (this.m_REndCtrl) {
            this.m_REndCtrl.OnDestroy();
            this.m_REndCtrl = null;
            this.m_RoomEndInfo = null;
        }

        if(!this.m_cbOutCardCount) {
            this.m_cbOutCardCount = new Array(GameDef.GAME_PLAYER);
            this.m_cbOutCardData = new Array(GameDef.GAME_PLAYER);
            for(var i = 0 ;i < GameDef.GAME_PLAYER; ++ i) {
                this.m_cbOutCardData[i] = new Array(GameDef.MAX_CARD_COUNT);
            }
        }
        for(var i = 0 ;i < GameDef.GAME_PLAYER; ++ i) {
            this.m_cbOutCardData[i].fill(0);
        }
        this.m_cbOutCardCount.fill(0);

    },

    ////////////////////////////////////////////////////////////////
     //播放操作声音
     PlayActionSound: function (wChairId, byAction) {
        //椅子效验
        var pIClientUserItem = this.GetClientUserItem(wChairId);
        if (pIClientUserItem == null) return;
        if (pIClientUserItem.GetGender() == 1) {
            cc.gSoundRes.PlayGameSound("M_" + byAction);
        } else {
            cc.gSoundRes.PlayGameSound("W_" + byAction);
        }
    },

    //播放操作声音
    PlayCardTypeSound: function (wChairId, cbCardType, CardStr, CardCount) {
        // if (this.m_ReplayMode) return
        //播放声音
        switch (cbCardType) {
            case GameDef.CT_SINGLE:
                return this.PlayActionSound(wChairId, "1_" + CardStr);
            case GameDef.CT_DOUBLE:
                return this.PlayActionSound(wChairId, "2_" + CardStr);
            case GameDef.CT_THREE:
                return this.PlayActionSound(wChairId, "SANZHANG");
            case GameDef.CT_SINGLE_LINE:
                return this.PlayActionSound(wChairId, "DANSHUN");
            case GameDef.CT_DOUBLE_LINE:
                return this.PlayActionSound(wChairId, "SHUANGSHUN");
            case GameDef.CT_THREE_LINE:
                return this.PlayActionSound(wChairId, "SANSHUN");
                //return this.PlayActionSound(wChairId, "FEIJI");
            case GameDef.CT_3_TAKE_1_1:
                return this.PlayActionSound(wChairId, "SANDAIYI");
            case GameDef.CT_3_TAKE_2_1:
                return this.PlayActionSound(wChairId, "SANDAIER");
            case GameDef.CT_3_TAKE_1_2:
                return this.PlayActionSound(wChairId, "SANDAIDUI");  
            case GameDef.CT_4_TAKE_2_1:
                return this.PlayActionSound(wChairId, "SIDAIER");
            case GameDef.CT_4_TAKE_2_2:
                return this.PlayActionSound(wChairId, "SIDAIDUI");  
            case GameDef.CT_AIRPLANE_TAKE_1_1:
            case GameDef.CT_AIRPLANE_TAKE_1_2:
            case GameDef.CT_AIRPLANE_TAKE_2_1:
            case GameDef.CT_AIRPLANE_TAKE_3_1:
            case GameDef.CT_AIRPLANE_TAKE_2_2:
                return this.PlayActionSound(wChairId, "FEIJICB");
            case GameDef.CT_BOMB_CARD:
                return this.PlayActionSound(wChairId, "ZHADAN");
            case GameDef.CT_MISSILE_CARD:
                return this.PlayActionSound(wChairId, "HUOJIAN");
        }
    },

    //邀请好友分享
    OnFriend:function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },

    ///////////////////////////////////////////////////////////////////
    //拖管
    OnMessageTrustee: function (wParam, lParam) {
        this.SendGameData(GameDef.SUB_C_TRUSTEE);
        return 0;
    },

    UpdateTrusteeControl: function() {
        var wMeChairID = this.GetMeChairID();
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserTrustee(wViewID, this.m_cbTrustee[i]);
        }
        this.m_GameClientView.m_BtTrustee.node.active = (this.m_cbTrustee[wMeChairID] == 1 ? false : true);
    },
    ///////////////////////////////////////////////////////////////////
	 OnSubHeapCard: function (pData, wDataSize) {
        var pHeapCard = GameDef.CMD_S_HeapCard();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pHeapCard , pData)) return false;
        var cbCardData = new Array(54);
        var cbCountArray = new Array(54 );
        GameLogic.TransformCardData(pHeapCard.Distributing, cbCardData, cbCountArray);
        //this.m_GameClientView.SetHeapCardInfo(pHeapCard.wChairID, cbCountArray);
        return true;
    },


});
