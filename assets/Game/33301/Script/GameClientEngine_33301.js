var CGameLogic = require("GameLogic_33301");

//游戏时间
var IDI_OUT_CARD = 200;						//出牌定时器
var IDI_START_GAME = 201;					//开始定时器
var IDI_CALL_SCORE = 202;					//叫分定时器
var IDI_DOUBLE_SCORE = 203;					//踢/加倍定时器

//游戏时间
var TIME_OUT_CARD = 30;
var TIME_CALL_SCORE = 30;
var TIME_DOUBLE = 10;
var TIME_START = 10;

cc.Class({
    extends: cc.GameEngine,

    properties: {

    },

    // use this for initialization
    start :function () {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        this.m_GameLogic = new CGameLogic();    //游戏逻辑
        this.m_GameConclude = null;
        //搜索变量
        this.m_cbSearchResultIndex = 0;
        this.m_SearchCardResult = GameDef.tagSearchCardResult();
        this.m_EachSearchResult = GameDef.tagSearchCardResult();
        this.m_nCurSearchType = -1;
        this.m_cbEachSearchIndex = 0;

    },

    ctor :function () {
        //var UrlHead = 'resources/SubGame/'+wKindID+'/Audio/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['GAME_START', 'GAME_START'],
            ['GAME_END', 'GAME_END'],
            ['GAME_WARN', 'GAME_WARN'],
            ['LEFT_WARN', 'leftwarn'],

            //女
            ['W_T', 'w/W_t'],
            ['W_BT', 'w/W_bt'],
            ['W_READY', 'w/cardtype/zhunbei'],
            ['W_ZHADAN', 'w/cardtype/zhadan'],
            ['W_SIDAIER', 'w/cardtype/sidaier'],
            ['W_SIDAIDUI', 'w/cardtype/sidaidui'],
            ['W_SHUANGSHUN', 'w/cardtype/shuangshun'],
            ['W_SANZHANG', 'w/cardtype/sanzhang'],
            ['W_SANSHUN', 'w/cardtype/sanshun'],
            ['W_SANDAIYI', 'w/cardtype/sandaiyi'],
            ['W_SANDAIDUI', 'w/cardtype/sandaidui'],
            ['W_HUOJIAN', 'w/cardtype/huojian'],
            ['W_GUANPAI', 'w/cardtype/guanpai'],
            ['W_3FEN', 'w/cardtype/fen3'],
            ['W_2FEN', 'w/cardtype/fen2'],
            ['W_1FEN', 'w/cardtype/fen1'],
            ['W_0FEN', 'w/cardtype/fen0'],
            ['W_FEIJICB', 'w/cardtype/feijicb'],
            ['W_FEIJI', 'w/cardtype/feiji'],
            ['W_DANSHUN', 'w/cardtype/danshun'],
            ['W_BUGUAN', 'w/cardtype/buguan'],
            ['W_BUQIANG', 'w/cardtype/buqiang'],
            ['W_QIANGDIZHU', 'w/cardtype/qiangdizhu'],
            ['W_CALLDIZHU', 'w/cardtype/jiaodizhu'],
            ['W_NOCALL', 'w/cardtype/no_call'],
            //男
            ['M_T', 'm/M_t'],
            ['M_BT', 'm/M_bt'],
            ['M_READY', 'm/cardtype/zhunbei'],
            ['M_ZHADAN', 'm/cardtype/zhadan'],
            ['M_SIDAIER', 'm/cardtype/sidaier'],
            ['M_SIDAIDUI', 'm/cardtype/sidaidui'],
            ['M_SHUANGSHUN', 'm/cardtype/shuangshun'],
            ['M_SANZHANG', 'm/cardtype/sanzhang'],
            ['M_SANSHUN', 'm/cardtype/sanshun'],
            ['M_SANDAIYI', 'm/cardtype/sandaiyi'],
            ['M_SANDAIDUI', 'm/cardtype/sandaidui'],
            ['M_HUOJIAN', 'm/cardtype/huojian'],
            ['M_GUANPAI', 'm/cardtype/guanpai'],
            ['M_3FEN', 'm/cardtype/fen3'],
            ['M_2FEN', 'm/cardtype/fen2'],
            ['M_1FEN', 'm/cardtype/fen1'],
            ['M_0FEN', 'm/cardtype/fen0'],
            ['M_FEIJICB', 'm/cardtype/feijicb'],
            ['M_FEIJI', 'm/cardtype/feiji'],
            ['M_DANSHUN', 'm/cardtype/danshun'],
            ['M_BUGUAN', 'm/cardtype/buguan'],
            ['M_BUQIANG', 'm/cardtype/buqiang'],
            ['M_QIANGDIZHU', 'm/cardtype/qiangdizhu'],
            ['M_CALLDIZHU', 'm/cardtype/jiaodizhu'],
            ['M_NOCALL', 'm/cardtype/no_call'],

        );

        //出牌声音
        for(var i=3;i<18;++i){
            //单
            this.m_SoundArr[this.m_SoundArr.length] = ['M_1_'+i,'m/cardvalue/1_'+i+''];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_1_'+i,'w/cardvalue/1_'+i+''];

            //双
            this.m_SoundArr[this.m_SoundArr.length] = ['M_2_'+i,'m/cardvalue/2_'+i+''];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_2_'+i,'w/cardvalue/2_'+i+''];
        }

         //短语声音
        for(var i=1;i<=7;++i){
            var FileName = i<10?'0'+i:i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/phrase/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/phrase/'+FileName];
        }

        this.m_szText = new Array(
            '和你合作真是太愉快了',
            '让不让穷人喝口汤了',
            '你这是非常6+7呀',
            '牌神，牌神，救救穷人',
            '人有多大胆，地有多大产',
            '速度速度加速度，快点快点在快点',
            '咱们相约下一个房间，不见不散'
        );
        this.m_BankerMode = 0;
        this.m_bTrusteeCount = 0;
        this.m_bTrustee = false;

        this.m_bFirstClicked = false;

        //游戏变量
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbBankerScore = 0;
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_wMostCardUser = INVALID_CHAIR;
        this.m_lTimes = 1;
        this.m_VoiceArrayWx = new Array();

        //出牌变量
        this.m_cbTurnCardCount = 0;
        this.m_cbTurnCardData = new Array();

        //扑克变量
        this.m_cbHandCardData = new Array();
        this.m_cbHandCardCount = new Array();

        this.m_cbDouble = new Array();
        this.m_cbAllUserCardCount = new Array();
        //this.m_dwRules = 0;
        this.m_bUserTrustee = new Array();
        this.m_cbPlayStatus = new Array();
        
        return;
    },
    //网络消息
    OnEventGameMessage :function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:	//游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_LAND_SCORE:		//用户叫分
                {
                    return this.OnSubCallScore(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_DOUBLE:		//用户踢
                {
                    return this.OnSubUserDouble(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_BANKER:		//庄家信息
                {
                    return this.OnSubBankerInfo(pData, wDataSize);
                }
            case GameDef.SUB_S_OUT_CARD:		//用户出牌
                {
                    return this.OnSubOutCard(pData, wDataSize);
                }
            case GameDef.SUB_S_PASS_CARD:		//用户放弃
                {
                    return this.OnSubPassCard(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END:	//游戏结束
                {
                    //结束动画
                    //this.m_GameClientView.ConcludeDispatch();
                    return this.OnSubGameConclude(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_OUTCARD:		//游戏开始
                {
                    this.m_GameClientView.HideAllGameButton();
                    this.OnMessageReversalFinish();
                    return true;
                }
            case GameDef.SUB_S_TRUSTEE:
                {
                    //校验数据
                    if (wDataSize != 3) return false;

                    var pTrustee = new CMD_S_TRUSTEE();
                    pTrustee.wTrusteeUser = gCByte.r2(pData, pTrustee.index_wTrusteeUser);
                    pTrustee.bTrustee = gCByte.r1(pData, pTrustee.index_bTrustee);
                    if (pTrustee.wTrusteeUser != this.GetMeChairID()) {
                        this.m_GameClientView.SetUserTrustee(this.SwitchViewChairID(pTrustee.wTrusteeUser), pTrustee.bTrustee);
                    }

                    return true;
                }
            case GameDef.SUB_S_GAME_TRUSTEE_OUTCARD:
                {               
                    return this.OnTrusteeshipOutCard(pData, wDataSize);
                }   
            case GameDef.SUB_S_TRUSTEESHIP:    //托管显示
                {
                    return this.OnTrusteeship(pData,wDataSize);
                }

                
                
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if(LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
        switch (cbGameStatus) {
            case GameDef.GAME_SCENE_FREE:	//空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;

                    this.m_lCellScore = pStatusFree.llBaseScore;
                    this.m_BankerMode = pStatusFree.byBankerMode;
                    
                    // for(var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    //     this.m_bUserTrustee[i] = pStatusFree.bUserTrustee[i];
                    // }
                    // if (this.m_bUserTrustee[this.GetMeChairID()]) {
                    //     this.m_GameClientView.m_Trusteeship.active = true;
                    // }else
                    // {
                    //     this.m_GameClientView.m_Trusteeship.active = false;
                    // }
                    this.m_GameClientView.SetCellScore(pStatusFree.llBaseScore);
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (!kernel.IsLookonMode()) {
                        //开始设置
                        var pIClientUserItem = kernel.GetTableUserItem(this.GetMeChairID());
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            if (this.m_dwRules[0] & GameDef.GAME_TYPE_XZB) {
                                if( !this.m_ReplayMode )this.m_GameClientView.m_BtStart.active = true;
                              
                            } else {
                                this.OnMessageStart();
                            }
                      
                           // if( !this.m_ReplayMode )this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, pStatusFree.dwCountDown);
                        }
                    }
                    if (this.m_dwRoomID != 0 && this.m_wGameProgress == 0 && !this.m_ReplayMode) this.m_GameClientView.m_BtFriend.active = true;                   
                    return true;
                }
            case GameDef.GAME_SCENE_PLAY:	//游戏状态
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

                    //变量定义
                    var wMeChairID = this.GetMeChairID();

                    //设置变量
                    this.m_lCellScore = pStatusPlay.lCellScore;
                    this.m_wBankerUser = pStatusPlay.wBankerUser;
                    this.m_cbBankerScore = pStatusPlay.cbBankerScore;
                    this.m_wCurrentUser = pStatusPlay.wCurrentUser;
                    for(var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        this.m_bUserTrustee[i] = pStatusPlay.bUserTrustee[i];
                    }
                    if (this.m_bUserTrustee[this.GetMeChairID()]) {
                        this.m_GameClientView.m_Trusteeship.active = true;
                    }else
                    {
                        this.m_GameClientView.m_Trusteeship.active = false;
                    }
                    this.m_GameClientView.SetCellScore(pStatusPlay.llBaseScore);
                    // this.m_lTimes = Math.pow(2, pStatusPlay.cbBombCount);
                    // for(var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    //     if(pStatusPlay.cbDouble[i] != 0) this.m_lTimes *= pStatusPlay.cbDouble[i];
                    // }
                    // for(var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    //     if(i != this.GetMeChairID()) continue;
                    //     if(pStatusPlay.cbDouble[i] != 0) this.m_lTimes *= Math.pow(2, pStatusPlay.cbDouble[i]);
                    // }
                    for(var i = 0; i < GameDef.MAX_COUNT; i++){

                        this.m_cbDouble[i] = pStatusPlay.cbDouble[i];
                    }
         
                    this.CalculateDoubleTimes();
                    this.m_GameClientView.SetCellScore(this.m_cbBankerScore);
                    this.m_GameClientView.SetTimes(this.m_lTimes);

                    //出牌变量
                    this.m_cbTurnCardCount = pStatusPlay.cbTurnCardCount;
                    for (var i = 0; i < GameDef.MAX_COUNT; i++) {
                        this.m_cbTurnCardData[i] = pStatusPlay.cbTurnCardData[i];
                    }

                    //扑克数据
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        this.m_cbHandCardCount[i] = pStatusPlay.cbHandCardCount[i];
                    }
                    for (var i = 0; i < GameDef.MAX_COUNT; i++) {
                        this.m_cbHandCardData[i] = pStatusPlay.cbHandCardData[i];
                    }
    
                    //设置扑克
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        //获取位置
           
                        var wViewChairID = this.SwitchViewChairID(i);
                        //设置扑克
                        if (wViewChairID != GameDef.MYSELF_VIEW_ID && pStatusPlay.cbHandCardCount[i] !=0) {
                            this.m_GameClientView.UpdateUserCardCount(wViewChairID, this.m_cbHandCardCount[i]);
                        }
                    }
                    //设置牌
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
                    this.m_GameClientView.ShowBankerCard(pStatusPlay.cbBankerCard);
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser));

                    //出牌界面
                    if (pStatusPlay.wTurnWiner != INVALID_CHAIR) {
                        var wViewChairID = this.SwitchViewChairID(pStatusPlay.wTurnWiner);
                        this.m_GameClientView.m_UserCardControl[wViewChairID].SetCardData(this.m_cbTurnCardData, this.m_cbTurnCardCount);
                    }

                    //当前玩家
                    if (this.m_wCurrentUser == wMeChairID) {
             

                         //搜索出牌
                        if (pStatusPlay.wTurnWiner == wMeChairID) {
                            this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID], null, 0, this.m_SearchCardResult,false);
                        } else {
                            this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID], this.m_cbTurnCardData,
                                this.m_cbTurnCardCount, this.m_SearchCardResult,false);
                        }
                        //显示按钮
                        this.m_GameClientView.ShowCardUI();
                    }

                    //设置时间
                    this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, pStatusPlay.dwCountDown);

                    return true;
                }
        }
        return false;
    },

    SetGameClock :function (wChairID, nTimerID, nElapse) {
        var wViewChairID = this.SwitchViewChairID(wChairID);
        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse);
        if( this.m_ReplayMode ) return
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
    OnTimerMessage :function (wChairID, CountDown, nTimerID) {
        var nElapse = parseInt(CountDown/1000);
        this.m_GameClientView.SetUserTimer(wChairID, nElapse);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;
        switch (nTimerID) {
            case IDI_START_GAME:        //开始定时器
                {
                    if(kernel.GetMeUserItem().GetUserStatus() == US_READY){
                        this.m_GameClientView.m_BtStart.active = false;
                        this.KillGameClock();
                        return
                    }
                    if (CountDown == 0 ) {
                        //退出游戏
                        if (this.m_dwRoomID == 0)          //关闭游戏
                            this.m_TableViewFrame.ExitGame();
                        //else if(this.m_RulesReady25)
                        //    this.OnMessageStart();
                    }

                    return true;
                }
            case IDI_OUT_CARD:
                {
                    if( this.m_cbTurnCardCount > 1 && this.m_cbHandCardCount[this.GetMeChairID()] == 1){
                        //this.OnMessagePassCard(0, 0);
                        return true;
                    }

                    if ( (CountDown <= 0 || (this.m_bTrustee && nElapse < TIME_OUT_CARD - 1))) {
                        //自动出牌
                        //if (this.m_GameClientView.m_btPass.interactable) this.OnMessagePassCard(0, 0);

                        return true;
                    }

                    //超时警告
                    if (CountDown <= 5000 &&  this.m_bPSound)  {
                        cc.gSoundRes.PlayGameSound('GAME_WARN');
                        this.m_bPSound = false;
                    }

                    return true;
                }
            case IDI_CALL_SCORE:
                {
                    //自动处理
                    return true;
                }
            case IDI_DOUBLE_SCORE:
                {
               
                    return true;
                }
        }

        return true;
    },

    //切换椅子
    SwitchViewChairID :function (wChairID) {
        var GamePlayCount  = GameDef.GAME_PLAYER;
        if (this.m_dwServerRules & GameDef.GAME_TYPE_PLAYNUMBER_2)
        {
            GamePlayCount = 2;
        }

        //转换椅子
        var wViewChairID = (wChairID + GamePlayCount - this.GetMeChairID());
        switch (GamePlayCount) {
            case 2: { wViewChairID += 1; break; }
            case 3: { wViewChairID += 1; break; }
            case 4: { wViewChairID += 2; break; }
            case 5: { wViewChairID += 2; break; }
            case 6: { wViewChairID += 3; break; }
            case 7: { wViewChairID += 3; break; }
            case 8: { wViewChairID += 4; break; }
        }
        return wViewChairID % GamePlayCount;
    },

    //游戏开始
    OnSubGameStart :function (pData, wDataSize) {
        //隐藏成绩界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_bFirstClicked = false;
        this.m_GameConclude = null;
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart,pData)) return false;
        this.m_GameClientView.m_Trusteeship.active = false;

        if( this.m_EndLittleView)
        {
            this.m_EndLittleView.HideView();
        }
        this.m_GameClientView.m_BtFriend.active = false;
        this.OnMessageStart(null,true);

        //搜索变量
        this.m_cbSearchResultIndex = 0;
        this.m_nCurSearchType = -1;
        this.m_cbEachSearchIndex = 0;

        this.m_SearchCardResult.cbSearchCount = 0;
        this.m_EachSearchResult.cbSearchCount = 0;
        for (var i = 0; i < 20; i++) {
            this.m_SearchCardResult.cbCardCount[i] = 0;
            this.m_EachSearchResult.cbCardCount[i] = 0;
            for (var j = 0; j < 20; j++) {
                this.m_SearchCardResult.cbResultCard[i][j] = 0;
                this.m_EachSearchResult.cbResultCard[i][j] = 0;
            }
        }

        //游戏变量
        this.m_bTrusteeCount = 0;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbBankerScore = 0;

        //出牌变量
        this.m_cbTurnCardCount = 0;
        for (var i = 0; i < GameDef.MAX_COUNT; i++) {
            this.m_cbTurnCardData[i] = 0;
            this.m_cbPlayStatus[i] = this.m_GameStart.cbPlayStatus[i];
        }

        this.m_lCellScore = this.m_GameStart.llBaseScore;
        this.m_wCurrentUser = this.m_GameStart.wCurrentUser;

        //界面庄家
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        //状态设置
        this.m_lTimes = 1;
        this.m_GameClientView.SetTimes(this.m_lTimes);
        this.m_GameClientView.SetCellScore(this.m_lCellScore);
        this.m_GameClientView.SetUserCountWarn(INVALID_CHAIR, false);

        //设置扑克
        this.m_GameClientView.ShowBankerCard(null);
        this.m_GameClientView.m_HandCardCtrl.SetCardData(null, 0);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_cbHandCardCount[i] = GameDef.NORMAL_COUNT;
            this.m_GameClientView.m_UserCardControl[i].SetCardData(null, 0);
        }

        for (var i = 0; i < GameDef.NORMAL_COUNT; i++) {
            this.m_cbHandCardData[i] = this.m_GameStart.cbCardData[i];
        }

        if(this.m_ReplayMode){
            this.OnMessageDispatchFinish(0,0,0);
            return true;
        }

        //播放开始声音
        cc.gSoundRes.PlayGameSound('GAME_START');

        //发牌动画
        var wViewStartUser = this.SwitchViewChairID(this.m_GameStart.wCurrentUser);
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard33301(GameDef.NORMAL_COUNT, wViewStartUser,this.m_cbPlayStatus);
        this.CheckGoodCard();
        return true;
    },
    CheckGoodCard:function (){
        this.m_bTimerCall = false;
        if(this.m_RulesCallBanker){
            this.m_bTimerCall = this.m_GameLogic.IsGoodCard(this.m_cbHandCardData, GameDef.NORMAL_COUNT);
        }
    },
    //叫分
    OnSubCallScore :function (pData, wDataSize) {
        //效验参数
        var pCallScore = GameDef.CMD_S_CallScore();
        if (wDataSize != gCByte.Bytes2Str(pCallScore, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        var CurScore = this.m_GameClientView.m_lCellScore.string;
        //叫分界面
        var wMeChairID = this.GetMeChairID();
        var wViewChairID = this.SwitchViewChairID(pCallScore.wCallScoreUser);

        this.m_cbBankerScore = pCallScore.cbCurrentScore;
        if (pCallScore.cbUserCallScore != 255 && pCallScore.cbCurrentScore != 0) {
            this.m_GameClientView.SetCellScore(this.m_cbBankerScore);
            this.m_wBankerUser = pCallScore.wCallScoreUser;
        }

        //设置玩家动作
        var CallScore = pCallScore.cbUserCallScore;
        if(this.m_BankerMode && CallScore == 5) CallScore = pCallScore.cbCurrentScore < 1 ? 255 : 6;
        if(this.m_BankerMode && CallScore != 6 && CallScore != 255) CallScore = pCallScore.cbCurrentScore <= 1?4:5;

        if(!this.m_ReplayMode)this.m_GameClientView.SetUserState(wViewChairID, CallScore, 3);
        this.m_wCurrentUser = pCallScore.wCurrentUser;

        var kernel = gClientKernel.get();
        if(this.m_ReplayMode) this.m_GameClientView.HideAllGameButton();
        if (!kernel.IsLookonMode() && pCallScore.wCurrentUser == this.GetMeChairID()) {
            this.m_GameClientView.HideAllGameButton();
            this.m_GameClientView.ShowCallUI(pCallScore.cbCurrentScore);   //显示按钮
        }

        //设置时间
        this.KillGameClock();
        if (pCallScore.wCurrentUser != INVALID_CHAIR) {
            this.SetGameClock(pCallScore.wCurrentUser, IDI_CALL_SCORE, TIME_CALL_SCORE);
        }
        //获取用户
        var pIClientUserItem = this.GetClientUserItem(pCallScore.wCallScoreUser);

        //播放声音
        switch (pCallScore.cbUserCallScore) {
            case 1:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, "1FEN");
                    break;
                }
            case 2:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, "2FEN");
                    break;
                }
            case 3:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, "3FEN");
                    break;
                }
            case 0xFF:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, "0FEN");
                    break;
                }
            case 4:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, pCallScore.cbCurrentScore == 1 ?'CALLDIZHU':"QIANGDIZHU");
                    break;
                }
            case 5:
                {
                    this.PlayActionSound(pCallScore.wCallScoreUser, pCallScore.cbCurrentScore == 0 ?'NOCALL':"BUQIANG");
                    break;
                }
        }

        return true;
    },

    CalculateDoubleTimes: function () {
        this.m_lTimes = 0;
        if (this.GetMeChairID() == this.m_wBankerUser) {
            // 地主倍数是 两个农民倍数的和
            for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                if (this.GetMeChairID() == i) continue;
                this.m_lTimes += Math.pow(2, this.m_cbDouble[i]);
            }
        } else {
            // 农民倍数只计算自己
            for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                if (this.GetMeChairID() != i) continue;
                this.m_lTimes = Math.pow(2, this.m_cbDouble[i]);
            }
        }
    },

    //踢
    OnSubUserDouble :function (pData, wDataSize) {
        //效验参数
        var pDouble = GameDef.CMD_S_Double();
        if (wDataSize != gCByte.Bytes2Str(pDouble, pData)) return false;

        if(pDouble.wCallUser == this.GetMeChairID() ) this.m_GameClientView.HideAllGameButton();

        for(var i = 0; i < GameDef.MAX_COUNT; i++){
            this.m_cbDouble[i] = pDouble.cbDouble[i];
        }
        this.CalculateDoubleTimes();

        if(this.m_BankerMode){ //加倍
            if (pDouble.wCallUser == INVALID_CHAIR) {
                // this.m_GameClientView.HideAllGameButton();
                // this.m_GameClientView.ShowDoubleUI(true);
                // this.SetGameClock(this.GetMeChairID(), IDI_DOUBLE_SCORE, TIME_DOUBLE);
            } else {
                // if (pDouble.bDouble) this.m_lTimes *= 2;
                if (!this.m_ReplayMode) this.m_GameClientView.SetUserState(this.SwitchViewChairID(pDouble.wCallUser), pDouble.bDouble ? 'Double' : 'NoDouble', 3);
            }
            if(pDouble.wNextCallUser == this.GetMeChairID()){
                this.m_GameClientView.HideAllGameButton();
                this.m_GameClientView.ShowDoubleUI(true);
                this.SetGameClock(pDouble.wNextCallUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
            }
        }else{
            //默认踢
            if(pDouble.wCallUser != INVALID_CHAIR){
                // if (pDouble.bDouble && (this.GetMeChairID() == pDouble.wCallUser || this.GetMeChairID() == this.m_wBankerUser || this.m_wBankerUser == pDouble.wCallUser)) {
                //     this.m_lTimes *= 2;
                //     if(this.m_wBankerUser == pDouble.wCallUser) {
                //         this.m_lTimes *= 2;
                //     }
                // }

                if(!this.m_ReplayMode)this.m_GameClientView.SetUserState(this.SwitchViewChairID(pDouble.wCallUser), pDouble.bDouble?'Kick':'NoKick', 3);

                //默认踢
                if(pDouble.bDouble && pDouble.wCallUser != this.m_wBankerUser){
                    for(var i = 0;i<GameDef.GAME_PLAYER;i++){
                        if(i == this.m_wBankerUser) continue;
                        if(!this.m_ReplayMode) this.m_GameClientView.SetUserState(this.SwitchViewChairID(i), 'Kick', 3);
                    }
                }
            }
            if(pDouble.wNextCallUser == this.GetMeChairID()){
                this.m_GameClientView.HideAllGameButton();
                this.m_GameClientView.ShowDoubleUI(true);
                this.SetGameClock(pDouble.wNextCallUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
            }
        }
    
        if(pDouble.wCallUser != INVALID_CHAIR){
            //设置玩家动作
            this.PlayActionSound(pDouble.wCallUser, pDouble.bDouble?"T": "BT");
        }
        this.m_GameClientView.SetTimes(this.m_lTimes/* *this.m_cbBankerScore */);

        return true;
    },
    //庄家信息
    OnSubBankerInfo :function (pData, wDataSize) {
        var pBankerInfo = GameDef.CMD_S_BankerInfo();
        //效验参数
        if (wDataSize != gCByte.Bytes2Str(pBankerInfo, pData)) return false;

        //设置变量
        this.m_wBankerUser = pBankerInfo.wBankerUser;
        this.m_wCurrentUser = pBankerInfo.wCurrentUser;
        this.m_cbBankerScore = pBankerInfo.cbBankerScore;
        var wViewChairID = this.SwitchViewChairID(this.m_wBankerUser);

        //设置牌
        this.m_GameClientView.SetBankerUser(wViewChairID);
        this.m_GameClientView.ShowBankerCard(pBankerInfo.cbBankerCard);

        //拷贝扑克
        this.m_cbHandCardCount[this.m_wBankerUser] = GameDef.MAX_COUNT;
        if(this.m_wBankerUser == this.GetMeChairID()){
            for (var i = 0; i < 3; i++) {
                this.m_cbHandCardData[GameDef.NORMAL_COUNT + i] = pBankerInfo.cbBankerCard[i];
            }

            //设置扑克
            this.m_GameLogic.SortCardList(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wBankerUser]);
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, GameDef.MAX_COUNT);
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(pBankerInfo.cbBankerCard, 3);
        }else{
            this.m_GameClientView.UpdateUserCardCount(wViewChairID, GameDef.MAX_COUNT);
        }

        return true;
    },
    //用户出牌
    OnSubOutCard :function (pData, wDataSize) {
        //变量定义
        var pOutCard = GameDef.CMD_S_OutCard();
        gCByte.Bytes2Str(pOutCard, pData);
        pOutCard.cbCardData = new Array(pOutCard.cbCardCount);
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pOutCard, pData)) return false;
    
        //变量定义
        var wMeChairID = this.GetMeChairID();
        var wViewChairID = this.SwitchViewChairID(pOutCard.wOutCardUser);
        var cbTurnCardType = this.m_GameLogic.GetCardType(pOutCard.cbCardData, pOutCard.cbCardCount);

        //删除时间
        this.KillGameClock();
        this.m_GameClientView.HideAllGameButton();

        //
        if(!this.m_ReplayMode)this.m_GameClientView.PlayAni(cbTurnCardType);

              //历史清理
        if (this.m_cbTurnCardCount == 0) {
            //用户扑克
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                //桌面清理
                if (i != pOutCard.wOutCardUser) {
                    this.m_GameClientView.m_UserCardControl[this.SwitchViewChairID(i)].SetCardData(null, 0);
                }
            }
        }
        //更新倍数
        var cbCardType = this.m_GameLogic.GetCardType(pOutCard.cbCardData, pOutCard.cbCardCount);
        if (cbCardType == GameDef.CT_BOMB_CARD || cbCardType == GameDef.CT_MISSILE_CARD|| cbCardType == GameDef.CT_TIANZHA) {
            this.m_lTimes *= 2;
            this.m_GameClientView.SetTimes(this.m_lTimes/* *this.m_cbBankerScore */);
        }

        this.PlayCardTypeSound(pOutCard.wOutCardUser, cbCardType, this.m_GameLogic.GetCardLogicValue(pOutCard.cbCardData[0]).toString(), pOutCard.cbCardCount) ;

        //出牌动作
        var kernel = gClientKernel.get();

        //显示出牌
        this.m_GameClientView.m_UserCardControl[wViewChairID].SetCardData(pOutCard.cbCardData, pOutCard.cbCardCount);

        //删除扑克
        if (pOutCard.wOutCardUser == wMeChairID) {
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(0,0);
            if(!this.m_GameLogic.RemoveCardList(pOutCard.cbCardData, pOutCard.cbCardCount, this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID])){
                return false;
            }
            this.m_cbHandCardCount[wMeChairID] -= pOutCard.cbCardCount;
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        } else {
            //设置扑克
            this.m_cbHandCardCount[pOutCard.wOutCardUser] -= pOutCard.cbCardCount;
            this.m_GameClientView.UpdateUserCardCount(wViewChairID,  this.m_cbHandCardCount[pOutCard.wOutCardUser]);
            //报警
            if (this.m_cbHandCardCount[pOutCard.wOutCardUser] < 3 && this.m_cbHandCardCount[pOutCard.wOutCardUser] > 0) {
                cc.gSoundRes.PlayGameSound('LEFT_WARN');
                this.m_GameClientView.SetUserCountWarn(wViewChairID, true);
            }
        }


        //出牌变量
        this.m_wCurrentUser = pOutCard.wCurrentUser;
        if (this.m_dwServerRules & GameDef.GAME_TYPE_PLAYNUMBER_3) {
            this.m_cbTurnCardCount = (cbCardType == GameDef.CT_TIANZHA ? 0 : pOutCard.cbCardCount );
        } else {
            this.m_cbTurnCardCount = pOutCard.cbCardCount;
        }
          
  
        for (var i = 0; i < pOutCard.cbCardCount; i++) {
            this.m_cbTurnCardData[i] = (cbCardType == GameDef.CT_TIANZHA ? 0 : pOutCard.cbCardData[i]);
        }

        //清理扑克
        if(this.m_wCurrentUser != INVALID_CHAIR && this.m_wCurrentUser != pOutCard.wOutCardUser){
            wViewChairID = this.SwitchViewChairID( pOutCard.wCurrentUser)
            this.m_GameClientView.m_UserCardControl[wViewChairID].SetCardData(null, 0);
            this.m_GameClientView.m_UserState[wViewChairID].HideState();
        }
        this.OnMessageOutCardFinish();
        return true;
    },

    //用户放弃
    OnSubPassCard :function (pData, wDataSize) {
        var pPassCard = GameDef.CMD_S_PassCard();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pPassCard, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        //设置变量
        this.m_wCurrentUser = pPassCard.wCurrentUser;
        var ViewID = this.SwitchViewChairID(pPassCard.wPassCardUser);
        //放弃设置
        var kernel = gClientKernel.get();

        this.KillGameClock();
        if(!this.m_ReplayMode)this.m_GameClientView.SetUserState(ViewID, 'Pass', 3);

        //播放声音
        this.PlayActionSound(pPassCard.wPassCardUser, "BUGUAN");
        //玩家设置
        if (this.m_wCurrentUser != INVALID_CHAIR) {

            //变量定义
            var wViewChairID = this.SwitchViewChairID(this.m_wCurrentUser);

            //门前清理
            this.m_GameClientView.m_UserCardControl[wViewChairID].SetCardData(null, 0);
        }

        //一轮判断
        if (pPassCard.cbTurnOver) {
            this.m_cbTurnCardCount = 0;
            for (var i = 0; i < GameDef.MAX_COUNT; i++) {
                this.m_cbTurnCardData[i] = 0;
            }
        }

        //玩家设置
        this.m_GameClientView.HideAllGameButton();
        if ((kernel.IsLookonMode() == false) && (this.m_wCurrentUser == this.GetMeChairID())) {


            this.m_GameLogic.SearchOutCard( this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData, this.m_cbTurnCardCount,
                this.m_SearchCardResult,false);

            if (this.m_SearchCardResult.cbSearchCount == 0 && ViewID != GameDef.MYSELF_VIEW_ID && !this.m_ReplayMode) {//
                this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 3);
            }
          //显示按钮
          this.m_GameClientView.ShowCardUI();
        }

        //设置时间
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            //设置时间
            this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
            /*
            if (this.m_wCurrentUser == this.GetMeChairID() && this.m_SearchCardResult.cbSearchCount == 0) {
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, 3);
            }else {
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
            }
            */
        }

        return true;
    },

    //游戏结束
    OnSubGameConclude :function (pData, wDataSize) {

        //效验数据
        this.m_GameConclude = GameDef.CMD_S_GameConclude();
        if (wDataSize != gCByte.Bytes2Str(this.m_GameConclude, pData)) return false;

         //播放结束声音
        cc.gSoundRes.PlayGameSound('GAME_END');

        //设置状态
        var kernel = gClientKernel.get();
        this.m_GameClientView.HideAllGameButton();
        //删除时间
        this.KillGameClock();

        //小结算界面
        var tempIndex = 0;
        var wWinChair = INVALID_CHAIR;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserEndScore(wViewID, this.m_GameConclude.lGameScore[i]);
            if(this.m_GameConclude.cbCardCount[i] > 0){
                var CardArr = this.m_GameConclude.cbCardData.splice(0,this.m_GameConclude.cbCardCount[i])
                if(wViewID != GameDef.MYSELF_VIEW_ID){
                    this.m_GameClientView.m_UserCardControl[wViewID].SetCardData(CardArr, this.m_GameConclude.cbCardCount[i]);
                }
            }else{
                wWinChair = i;
            }
        }


        //设置界面
        //this.m_GameClientView.SetWaitCallScore(false);
        this.m_GameClientView.SetUserCountWarn(INVALID_CHAIR, false);


        //取消托管
        if (this.m_bTrustee){
            this.OnMessageTrusteeControl(0, 0);
        }

        //设置定时
        if(this.m_ReplayMode)
            this.OnTimeIDI_PERFORM_END()
        else
            this.schedule(this.OnTimeIDI_PERFORM_END, 1);

        return true;
    },
    //执行结束
    OnTimeIDI_PERFORM_END :function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        this.ShowGamePrefab("LittleResultBG", GameDef.KIND_ID, this.node, function(Js){
            this.m_EndLittleView = Js;
        }.bind(this));
        this.m_GameClientView.m_BtStart.active = true;

    },

    OnEventRoomEnd:function (data, datasize){
        this.m_RoomEnd = GameDef.CMD_S_GameCustomInfo();
        if(datasize != gCByte.Bytes2Str(this.m_RoomEnd, data)) return false;

        this.m_RoomEnd.dwUserID = new Array();
        //用户成绩
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if(pIClientUserItem == null) continue;
            this.m_RoomEnd.dwUserID[i] = pIClientUserItem.GetUserID();
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
    checkTotalEnd: function (bNext) {
        if (this.m_RoomEnd) {
            if (this.m_wGameProgress > 0 || this.m_ReplayMode) {
                this.RealShowEndView();
            } else {
                this.ShowAlert("该房间已被解散！", Alert_Yes, function (Res) {
                    this.m_pTableScene.ExitGame();
                }.bind(this));
            }
        } else {
            if (bNext) this.OnMessageStart();
        }
    },
    //出牌判断
    VerdictOutCard :function () {
        //状态判断
        var kernel = gClientKernel.get();
        if (this.m_wCurrentUser != this.GetMeChairID()) return false;

        //获取扑克
        var cbCardData = new Array(GameDef.MAX_COUNT);
        var cbShootCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_COUNT);

        //出牌判断
        if (cbShootCount > 0) {
            //类型判断
            this.m_GameLogic.SortCardList(cbCardData, cbShootCount);
            if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_ERROR) return false;
            var bTwo = false;
            var bA = 0;
            for(var i = 0; i < cbShootCount; i++)
            {
                if (cbCardData[i] == 34) {
                    bTwo = true;
                }    
                if (cbCardData[i] == 1 ||cbCardData[i] == 33 ||cbCardData[i] == 49) {
                    bA++;
                }                         
            }

            //带牌2	
            if (!(this.m_dwRules[0] & GameDef.GAME_TYPE_DP2)) {
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_THREE_TAKE_ONE && bTwo) return false;
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_FOUR_TAKE_ONE && bTwo) return false;
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_AIRPLANE_ONE && bTwo) return false;  
            } 
            //三可带A
            if (!(this.m_dwRules[0] & GameDef.GAME_TYPE_SKDA)) {
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_THREE_TAKE_ONE && bA==1) return false; 
            } 
            //跟牌判断 泽泽泽
            if (this.m_cbTurnCardCount == 0)
            {                      
                // if (this.m_dwRules & GameDef.GAME_TYPE_PLAYNUMBER_3)
                // {
                //     //判断第一次出牌是否到红桃3,不带红桃3不让出
                //     if (this.m_cbHandCardCount[0] == GameDef.MAX_COUNT 
                //       && this.m_cbHandCardCount[1] == GameDef.MAX_COUNT 
                //       && this.m_cbHandCardCount[2] == GameDef.MAX_COUNT) {
                //             var bRedThree = false;
                //             for(var i = 0; i < cbShootCount; i++)
                //             {
                //                 if (cbCardData[i] == GameDef.REDTHREE) {
                //                     bRedThree = true;
                //                }                           
                //            }
                //             if (!bRedThree) {
                //                return false; 
                //            }
                //     }
                // }
            
                //其他玩家报单自己若想出单牌，只能出手中最大的单牌
                var wMeChairId = this.GetMeChairID();
                var cbHandCardCount = this.m_cbHandCardCount[wMeChairId];
                var cbHandCardData = new Array();
                for (var i = 0; i < cbHandCardCount; i++) {
                    cbHandCardData[i] = this.m_cbHandCardData[i];
                }
                //排序
                this.m_GameLogic.SortCardList(cbHandCardData, cbHandCardCount);

                for(var i = 0; i < GameDef.GAME_PLAYER; i++)
                {
                    if (this.m_cbHandCardCount[i] == 1 && cbShootCount == 1)
                    {
                        if(cbCardData[0] != cbHandCardData[0]) return false;    
                    }             
                }
                var bThree = false;
                if ((cbCardData[0] == 49 &&cbCardData[1] == 33 && cbCardData[2] == 1)) {
                    bThree = true;
                } 
                //可三不带	
                if (!(this.m_dwRules[0] & GameDef.GAME_TYPE_KSBD))
                {
                    if (cbShootCount == 3 && !bThree) {
                        return false;     
                }
            }
        
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_THREE_TAKE_ONE &&bThree) return false;
                if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_THREE_TAKE_DOUBLE&&bThree ) return false;

                //可空炸	
                if (!(this.m_dwRules[0] & GameDef.GAME_TYPE_KEKONGZHA)) {
                    if (this.m_GameLogic.GetCardType(cbCardData, cbShootCount) == GameDef.CT_BOMB_CARD) return false;
                } 
         
                

                //判断下家报双不可出对  
                if (this.m_dwRules[0] & GameDef.GAME_TYPE_RUSE_BAOSHUANG)
                {
                    var PlayerCount = GameDef.GetPlayerCount(this.m_dwServerRules);
                    var m_wCurrentUserNext = (this.m_wCurrentUser + 1) % PlayerCount;

                    if (this.m_cbHandCardCount[m_wCurrentUserNext] == 2 && cbShootCount == 2 && this.m_cbHandCardCount[this.m_wCurrentUser] != 2)
                    {
                        return false; 
                    } 

                    // for(var i = 0; i < GameDef.GAME_PLAYER; i++)
                    // {
                    //     if (this.m_cbHandCardCount[i] == 2 && cbShootCount == 2)
                    //     {
                    //         return false; 
                    //     }             
                    // }
                    return true; 
             
                } 
                else 
                {
                    return true; 
                }

                  
            } 

            return this.m_GameLogic.CompareCard(this.m_cbTurnCardData, cbCardData, this.m_cbTurnCardCount, cbShootCount);
        }

        return false;
    },
    //播放操作声音
    PlayCardTypeSound :function (wChairId, cbCardType, CardStr, CardCount) {
        if(this.m_ReplayMode)return
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
            case GameDef.CT_AIRPLANE_ONE:
            case GameDef.CT_THREE_LINE:
            case GameDef.CT_THREE_TAKE_ONE:
                if (CardCount == 4)  return this.PlayActionSound(wChairId, "SANDAIYI");
                return  this.PlayActionSound(wChairId, "FEIJI");
            case GameDef.CT_AIRPLANE_TWO:
            case GameDef.CT_THREE_TAKE_DOUBLE:
                if (CardCount == 5) return this.PlayActionSound(wChairId, "SANDAIDUI");
                return  this.PlayActionSound(wChairId, "FEIJICB");
            case GameDef.CT_FOUR_TAKE_ONE:
                return this.PlayActionSound(wChairId, "SIDAIER");
            case GameDef.CT_FOUR_TAKE_TWO:
                return  this.PlayActionSound(wChairId, "SIDAIDUI");
            case GameDef.CT_BOMB_CARD:
                return this.PlayActionSound(wChairId, "ZHADAN");
            case GameDef.CT_MISSILE_CARD:
                return this.PlayActionSound(wChairId, "ZHADAN");
            case GameDef.CT_TIANZHA:
                return this.PlayActionSound(wChairId, "ZHADAN");
        }
    },

    OnTrusteeship: function(pData,wDataSize)
    {   
        //效验数据
        this.m_TrusteeshipData = GameDef.CMD_S_Trusteeship();
        if (wDataSize != gCByte.Bytes2Str(this.m_TrusteeshipData, pData)) return false;
        if (this.m_TrusteeshipData.wChairID == this.GetMeChairID()) {
            this.m_GameClientView.m_Trusteeship.active = true; 
        }
        return true;  
    },
    OnTrusteeshipOutCard :function (pData, wDataSize) {

        //效验数据
        this.m_TrusteeshipOutCard = GameDef.CMD_S_TrusteeshipOutCard();
        if (wDataSize != gCByte.Bytes2Str(this.m_TrusteeshipOutCard, pData)) return false;
        this.m_wCurrentUser = this.m_TrusteeshipOutCard.wCurrentUser;
        this.m_cbTrusteeshipCardCount = this.m_TrusteeshipOutCard.cbCardCount;
        if (this.m_TrusteeshipOutCard.cbCardCount == 2&& this.m_wCurrentUser == this.GetMeChairID()) {
            this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                this.m_TrusteeshipOutCard.cbCardCount, this.m_SearchCardResult,false);               
        }
     
        if(this.m_TrusteeshipOutCard.cbCardCount == 2 && this.m_wCurrentUser == this.GetMeChairID() && this.m_SearchCardResult.cbSearchCount == 0)
        {
            this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                0, this.m_SearchCardResult,true);          
        }
        if (this.m_wCurrentUser == this.GetMeChairID()) {
            this.OnMessageOutPrompt(0,0);
        }  
        //当前弹起
        if ((this.m_SearchCardResult.cbSearchCount > 0) && (this.m_wCurrentUser == this.GetMeChairID())) {
            this.OnMessageOutCard(0, 0, 0);
            return true;
        }

        return true;
    },
    

    //自动出牌
    AutomatismOutCard :function (pData, wDataSize) {

        //状态判断
        var kernel = gClientKernel.get();
        if ((kernel.IsLookonMode() == true) || (this.m_wCurrentUser != this.GetMeChairID())) return false;

        //当前弹起
        if ((this.m_GameClientView.m_btOutCard.interactable == true) && (this.m_wCurrentUser == this.GetMeChairID())) {
            this.OnMessageOutCard(0, 0, 0);
            return true;
        }

        //出牌处理
        if ((this.m_cbTurnCardCount == 0) || (this.m_bTrustee == true)) {
            //设置界面
            if (this.m_SearchCardResult.cbSearchCount > 0) {
                //设置界面
                this.m_GameClientView.m_HandCardCtrl.SetShootCard(this.m_SearchCardResult.cbResultCard[0],
                    this.m_SearchCardResult.cbCardCount[0]);

                //设置控件
                var bOutCard = this.VerdictOutCard();
                this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);

                //出牌动作
                this.OnMessageOutCard(0, 0, 0);

                return true;
            }
        }

        //放弃出牌
        if (this.m_cbTurnCardCount > 0) this.OnMessagePassCard(0, 0, 0);

        return true;
    },
    OnGameIDI_PERFORM_START :function () {
        //删除定时器
        this.unschedule(this.OnGameIDI_PERFORM_START);
    },

    //开始消息
    OnMessageStart :function (wParam, lParam) {
           // var carddata = [0x03,0x13,0x23,0x04,0x14,0x24,0x05,0x15,0x25,0x07,0x17,0x08,0x18,0x09,0x19]
            /*var carddata = [0x03,0x13,0x23,0x05,0x15]
            console.log(carddata)
            this.m_GameLogic.SortCardList(carddata,carddata.length)
            var cbCardType = this.m_GameLogic.GetCardType(carddata,carddata.length);
                console.log(carddata,cbCardType)
            this.PlayCardTypeSound(this.GetMeChairID(), cbCardType, this.m_GameLogic.GetCardLogicValue(carddata[0]).toString(), carddata.length) ;
        return*/
        //删除时间
        this.KillGameClock();

        //扑克控件
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();

        //界面庄家
        this.m_cbBankerScore = 0;
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        //状态设置
        this.m_GameClientView.SetUserCountWarn(INVALID_CHAIR, false);

        //设置界面
        this.m_GameClientView.m_BtStart.active = false;
        this.m_GameClientView.SetTimes(1, true);

        //发送消息
        if(!lParam)this.SendFrameData(SUB_GF_USER_READY);

        return 0;
    },

    //出牌消息
    OnMessageOutCard :function (wParam, lParam, IsUserAction) {
        //状态判断
        if (this.m_GameClientView.m_btOutCard.interactable == false) return 0;

        //获取扑克
        var cbCardData = new Array(GameDef.MAX_COUNT);
        var cbCardCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_COUNT);

        //排列扑克
        var wMeChairID = this.GetMeChairID();
        this.m_GameLogic.SortCardList(cbCardData, cbCardCount);
        var cbCardType = this.m_GameLogic.GetCardType(cbCardData, cbCardCount);
        var cbHandType = this.m_GameLogic.GetCardType(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        //校验
        // if(this.m_cbTurnCardCount == 0 && cbHandType == GameDef.CT_DOUBLE && cbCardType != GameDef.CT_DOUBLE){
        //     this.ShowTips("请不要拆对出牌！");
        //     return true;
        // }

        //删除时间
        this.KillGameClock();

        //设置变量
        if (1 == wParam) {
            this.m_bTrusteeCount = 0;
        }
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
        OutCard.bIsUserAction = IsUserAction;
        
        //发送数据
        this.SendGameData(GameDef.SUB_C_OUT_CART, OutCard);

        return 0;
    },

    //PASS消息
    OnMessagePassCard :function (wParam, lParam, IsUserAction) {
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
        var Pass = GameDef.CMD_C_PASS_CARD();
        Pass.bIsUserAction = IsUserAction;
        //发送数据
        this.SendGameData(GameDef.SUB_C_PASS_CARD, Pass);

        return 0;
    },
    OnMessageTrusteeship :function (wParam, lParam) {
        //发送数据
        this.SendGameData(GameDef.SUB_C_TRUSTEESHIP);
    },
    //提示消息
    OnMessageOutPrompt :function (wParam, lParam) {
        var wMeChairID = this.GetMeChairID();

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
        }

        //放弃出牌
        this.OnMessagePassCard(0, 0, 1);
        return 0;
    },


    //左键扑克
    OnLeftHitCard :function (bHasShoot) {
        //设置控件
        var bOutCard = this.VerdictOutCard();
        this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);

        if (this.m_cbHandCardCount[this.GetMeChairID()] == GameDef.MAX_COUNT && this.m_bFirstClicked) {
            this.m_bFirstClicked = false;
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(null, 0);
        }else if(!bHasShoot && !bOutCard){
            this.OnAutoChangeShoot();
        }

        return 0;
    },
    //左键扑克
    OnAutoChangeShoot :function () {
        //获取扑克
        var cbCardData = new Array();
        var cbShootCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_COUNT);

        var TempRes = GameDef.tagSearchCardResult();
        this.m_GameLogic.SearchOutCard( cbCardData, cbShootCount, this.m_cbTurnCardData, this.m_cbTurnCardCount, TempRes,false);
        for(var i=TempRes.cbSearchCount-1;i>=0;i--){
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(TempRes.cbResultCard[i],TempRes.cbCardCount[i]);
            this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            return;
        }
        //出牌判断
        if (this.m_cbTurnCardCount > 0 && !this.VerdictOutCard()) {
            //类型判断
            this.m_GameLogic.SortCardList(cbCardData, cbShootCount);
            cbShootCount = this.m_GameLogic.CalcValidCard(cbCardData, cbShootCount,this.m_cbTurnCardData, this.m_cbTurnCardCount);

            if(LOG_NET_DATA)console.log('OnAutoChangeShoot ',cbShootCount, cbCardData)
            if(cbShootCount == 0) return;
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(cbCardData, cbShootCount);
            this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            return;
        }
    },
    //拖管控制
    OnMessageTrusteeControl :function (wParam, lParam) {
        return
        this.m_bTrusteeCount = 0;
        this.m_bTrustee = !this.m_bTrustee;
        if (!this.m_bTrustee) {
            this.m_GameClientView.SetUserTrustee(this.SwitchViewChairID(this.GetMeChairID()), false);
        }
        else {
            this.m_GameClientView.SetUserTrustee(this.SwitchViewChairID(this.GetMeChairID()), true);
        }

        var Trustee = new CMD_C_TRUSTEE();
        Trustee.bTrustee = this.m_bTrustee;
        this.SendGameData(SUB_C_TRUSTEE, Trustee);

        return 0;
    },

    //邀请好友分享
    OnFriend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {

        }
    },
    //搜索牌型
    OnMessageSearchCard :function (wParam, lParam) {
        var wMeChairId = this.GetMeChairID();
        if (this.m_GameClientView.m_HandCardCtrl.GetCardCount() != this.m_cbHandCardCount[wMeChairId])
            return 0;

        //变量定义
        var cbHandCardCount = this.m_cbHandCardCount[wMeChairId];
        var cbHandCardData = new Array();
        for (var i = 0; i < cbHandCardCount; i++) {
            cbHandCardData[i] = this.m_cbHandCardData[i];
        }

        //排序
        this.m_GameLogic.SortCardList(cbHandCardData, cbHandCardCount);

        //设置变量
        this.m_cbSearchResultIndex = 0;

        switch (wParam) {
            case SEARCH_MISSILE:			//搜索火箭
                {
                    if (this.m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    if (cbHandCardCount > 1 && cbHandCardData[0] == 0x4f && cbHandCardData[1] == 0x4e) {
                        this.m_EachSearchResult.cbCardCount[0] = 2;
                        this.m_EachSearchResult.cbResultCard[0][0] = cbHandCardData[0];
                        this.m_EachSearchResult.cbResultCard[0][1] = cbHandCardData[1];

                        this.m_EachSearchResult.cbSearchCount = 1;
                    }
                    this.m_nCurSearchType = SEARCH_MISSILE;
                    break;
                }
            case SEARCH_BOMB:				//搜索炸弹
                {
                    if (this.m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    this.m_GameLogic.SearchSameCard(cbHandCardData, cbHandCardCount, 0, 4, this.m_EachSearchResult);

                    this.m_nCurSearchType = SEARCH_BOMB;
                    break;
                }
            case SEARCH_THREE_TOW_LINE:		//搜索飞机
                {
                    if (this.m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    this.m_GameLogic.SearchThreeTwoLine(cbHandCardData, cbHandCardCount, this.m_EachSearchResult);

                    this.m_nCurSearchType = SEARCH_THREE_TOW_LINE;
                    break;
                }
            case SEARCH_DOUBLE_LINE:		//搜索双顺
                {
                    if (m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    this.m_GameLogic.SearchLineCardType(cbHandCardData, cbHandCardCount, 0, 2, 0, this.m_EachSearchResult);

                    this.m_nCurSearchType = SEARCH_DOUBLE_LINE;
                    break;
                }
            case SEARCH_SINGLE_LINE:		//搜索单顺
                {
                    if (this.m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    this.m_GameLogic.SearchLineCardType(cbHandCardData, cbHandCardCount, 0, 1, 0, this.m_EachSearchResult);

                    this.m_nCurSearchType = SEARCH_SINGLE_LINE;
                    break;
                }
            case SEARCH_THREE_TWO_ONE:		//搜索三带N
                {
                    if (this.m_nCurSearchType == wParam) break;

                    //设置变量
                    this.m_cbEachSearchIndex = 0;

                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 1, 1, this.m_EachSearchResult);
                    var tmpSearchResult = GameDef.tagSearchCardResult();
                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 2, 2, tmpSearchResult);
                    if (tmpSearchResult.cbSearchCount > 0) {
                        //复制牌型
                        for (var i = 0; i < tmpSearchResult.cbSearchCount; i++) {
                            var cbResultIndex = this.m_EachSearchResult.cbSearchCount++;
                            this.m_EachSearchResult.cbCardCount[cbResultIndex] = tmpSearchResult.cbCardCount[i];
                            for (var j = 0; j < tmpSearchResult.cbCardCount[i]; j++) {
                                this.m_EachSearchResult.cbResultCard[cbResultIndex][j] = tmpSearchResult.cbResultCard[i][j];
                            }
                        }
                    }
                    tmpSearchResult = GameDef.tagSearchCardResult();
                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 1, 2, tmpSearchResult);
                    if (tmpSearchResult.cbSearchCount > 0) {
                        //复制牌型
                        for (var i = 0; i < tmpSearchResult.cbSearchCount; i++) {
                            var cbResultIndex = this.m_EachSearchResult.cbSearchCount++;
                            this.m_EachSearchResult.cbCardCount[cbResultIndex] = tmpSearchResult.cbCardCount[i];
                            for (var j = 0; j < tmpSearchResult.cbCardCount[i]; j++) {
                                this.m_EachSearchResult.cbResultCard[cbResultIndex][j] = tmpSearchResult.cbResultCard[i][j];
                            }
                        }
                    }
                    tmpSearchResult = GameDef.tagSearchCardResult();
                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 2, 4, tmpSearchResult);
                    if (tmpSearchResult.cbSearchCount > 0) {
                        //复制牌型
                        for (var i = 0; i < tmpSearchResult.cbSearchCount; i++) {
                            var cbResultIndex = this.m_EachSearchResult.cbSearchCount++;
                            this.m_EachSearchResult.cbCardCount[cbResultIndex] = tmpSearchResult.cbCardCount[i];
                            for (var j = 0; j < tmpSearchResult.cbCardCount[i]; j++) {
                                this.m_EachSearchResult.cbResultCard[cbResultIndex][j] = tmpSearchResult.cbResultCard[i][j];
                            }
                        }
                    }

                    this.m_nCurSearchType = SEARCH_THREE_TWO_ONE;
                    break;
                }
        }

        //弹起扑克
        var kernel = gClientKernel.get();
        if (this.m_EachSearchResult.cbSearchCount > 0) {
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(this.m_EachSearchResult.cbResultCard[this.m_cbEachSearchIndex],
                m_EachSearchResult.cbCardCount[m_cbEachSearchIndex]);

            this.m_cbEachSearchIndex = (m_cbEachSearchIndex + 1) % this.m_EachSearchResult.cbSearchCount;

            //玩家设置
            if ((kernel.IsLookonMode() == false) && (this.m_wCurrentUser == wMeChairId)) {
                this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            }
        }
        else {
            //this.m_GameClientView.m_CardControl[GameDef.MYSELF_VIEW_ID].SetShootCard(null, 0);

            //玩家设置
            if ((kernel.IsLookonMode() == false) && (this.m_wCurrentUser == wMeChairId)) {
                this.m_GameClientView.m_btOutCard.interactable = false;
            }
        }

        return 0;
    },

    //出牌完成
    OnMessageOutCardFinish :function () {
        //出牌设置
        var wMeChairID = this.GetMeChairID();
        var kernel = gClientKernel.get();
        if ( this.m_wCurrentUser != INVALID_CHAIR ) {
            //出牌按钮
            if ((kernel.IsLookonMode() == false) && (this.m_wCurrentUser == wMeChairID)) {


                 //搜索提示
                this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser],
                this.m_cbTurnCardData, this.m_cbTurnCardCount, this.m_SearchCardResult,false);

                if (this.m_SearchCardResult.cbSearchCount == 0) {
                    this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 3);
                }
                //显示按钮
                this.m_GameClientView.ShowCardUI();
            }

            //设置时间
            if (this.m_wCurrentUser != INVALID_CHAIR) {
                this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
                /*
                if (this.m_wCurrentUser == wMeChairID && this.m_SearchCardResult.cbSearchCount == 0) {
                    this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, 3);
                } else {
                    this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
                }
                */
            }

        }

        return 0;
    },
    //发牌完成
    OnMessageDispatchFinish :function (wViewID, CardIndex, ActCard) {     
        //发牌过程
        if(ActCard){
            //设置扑克
            if(wViewID == GameDef.MYSELF_VIEW_ID){
                this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, CardIndex+1);
            }else{
                this.m_GameClientView.UpdateUserCardCount(wViewID, CardIndex+1);
            }
            return;
        }

        //排列扑克
        var wMeChairID = this.GetMeChairID();
        this.m_GameLogic.SortCardList(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            if(wMeChairID == i)continue;
            var ViewID = this.SwitchViewChairID(i);
            if(ViewID == GameDef.MYSELF_VIEW_ID) continue;
            this.m_GameClientView.UpdateUserCardCount(ViewID, this.m_cbHandCardCount[i]);
        }
    
        //显示底牌背面
        this.m_GameClientView.ShowBankerCard([0,0,0]);

        //显示按钮
        var kernel = gClientKernel.get();
        if ((kernel.IsLookonMode() == false) && this.m_wCurrentUser == wMeChairID) {
            //this.m_GameClientView.ShowCallUI(0,0);                               
            this.m_GameClientView.ShowCardUI();
            
        }
        this.OnMessageReversalFinish();
        //设置时间
        this.SetGameClock(this.m_wCurrentUser ,IDI_CALL_SCORE, TIME_CALL_SCORE);

        return 0;
    },

    //翻牌完成
    OnMessageReversalFinish :function () {
        //控制设置
        var kernel = gClientKernel.get();
        var wMeChairID = this.GetMeChairID();
        //this.m_wCurrentUser = this.m_wBankerUser;
        if (kernel.IsLookonMode() == false) {
            //出牌按钮
            if (this.m_wCurrentUser == wMeChairID) {
                //搜索提示
                this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                    this.m_cbTurnCardCount, this.m_SearchCardResult,false);
                    this.m_GameClientView.ShowCardUI();
            }
        }

        //设置时间
        this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
        return 0;
    },


    //设置警告
    SetViewRoomInfo:function ( dwServerRules, dwRules ,dwSeniorRules){
        this.m_BankerMode = 0;
        this.m_RulesCallBanker = 0;
        this.m_dwRules = dwRules;
        this.m_dwSeniorRules = dwSeniorRules;
        
       // this.m_dwServerRules =dwServerRules;
        
        //this.m_wGameCount = GameDef.GetGameCount(dwServerRules);
        this.m_GameClientView.SetViewRoomInfo(dwRules,dwServerRules,dwSeniorRules);
        this.m_GameLogic.SetRules(dwRules);
    },


    //////////////////////////////////////////////////////////////////////////

    OnClearScene:function (){
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.InitTableCard();
        //界面庄家
        this.m_cbBankerScore = 0;
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);
        this.m_GameClientView.SetTimes(1, true);

        if(this.m_REndCtrl) {
            this.m_REndCtrl.OnDestroy();
            this.m_REndCtrl = null;
            this.m_RoomEnd = null;
        }
    },
});
