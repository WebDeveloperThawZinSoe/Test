//游戏时间
var IDI_GAME_CLOCK = 201;					//叫分定时器

//游戏时间
var TIME_CLOCK = 10;

cc.Class({
    extends: cc.GameEngine,

    properties: {},

    // use this for initialization
    start: function () { 
        GameDef.g_GameEngine = this;
    },

    ctor: function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['BANKER', 'Banker'],//.mp3
            ['CLOCK', 'CountDown'],//.mp3
            ['WIN', 'Win'],//.mp3
            ['LOSE', 'Lose'],//.mp3
            ['TONGS', 'Tongs'],//.mp3
            ['TONGP', 'Tongp'],//.mp3
        
            //男
            ['M_READY', 'm/zhunbei'],
            //女
            ['W_READY', 'w/zhunbei'],
        );
        //短语声音
        for (var i = 0; i <= 17; ++i) {
            this.m_SoundArr[this.m_SoundArr.length] = ['M_' + i, 'm/type/' + i];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_' + i, 'w/type/' + i];
        }
        //短语声音
        for (var i = 1; i <= 7; ++i) {
            var FileName = (i < 10 ? '0' : '') + i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m' + i, 'm/phrase/' + FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w' + i, 'w/phrase/' + FileName];
        }

        this.m_szText = new Array(
            '抽烟身体好，赌博练头脑',
            '各位观众，我要开牌了',
            '时间就是金钱，我的朋友',
            '我是庄家来点刺激的吧',
            '下的多吃火锅，下的少吃水饺',
            '一点小钱，拿去喝茶吧',
            '有没有天理，有没有王法，这牌也输',
        );
        //游戏变量
        this.m_lBaseScore = 0;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_lBankerTimes = new Array();
        this.m_lPlayerTimes = new Array();
        this.m_cbCardData = new Array();
        this.m_cbDelCardData = new Array();
        this.m_cbCardCount = new Array();
        this.m_cbSGType = new Array();
        this.m_cbJHType = new Array();
        this.m_UserState = new Array();
        this.m_BankerState = new Array();
        this.m_UserReady = new Array();
        this.m_GameMode = 0;//0积分 1金币
        this.m_wLastBanker = INVALD_CHAIR;
        return;
    },

    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:	    //游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_READY:	//准备
                {
                    return this.OnSubUserReady(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_BANKER:		//用户抢庄
                {
                    return this.OnSubCallBanker(pData, wDataSize);
                }
            case GameDef.SUB_S_BANKER_USER:		//用户定庄
                {
                    return this.OnSubBankerUser(pData, wDataSize);
                }
            case GameDef.SUB_S_BE_BANKER:   //对子玩家坐庄
                {
                    return this.OnSubToBeBanker(pData, wDataSize);
                }
            case GameDef.SUB_S_ADD_SCORE: //下注
                {
                    return this.OnSubAddScore(pData, wDataSize);
                }
            case GameDef.SUB_S_SEND_CARD: //发牌
                {
                    return this.OnSubSendCard(pData, wDataSize);
                }
            case GameDef.SUB_S_LOOK_CARD:  //看牌
                {
                    return this.OnSubLookCard(pData, wDataSize);
                }
            case GameDef.SUB_S_OPEN_CARD:	//开牌
                {
                    return this.OnSubOpenCard(pData, wDataSize);
                }

            //--------------------------------------------------

            case GameDef.SUB_S_CALL_PLAYER:		//用户放弃
                {
                    return this.OnSubCallPlayer(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END:	//游戏结束
                {
                    return this.OnSubGameConclude(pData, wDataSize);
                }

            case GameDef.SUB_S_START_CTRL:	//游戏结束
                {
                    return this.OnSubShowStartCtrl(pData, wDataSize);
                }
            case GameDef.SUB_S_ALL_ADD:	//游戏结束
                {
                    return this.OnALLAdd(pData, wDataSize);
                }   

        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if (LOG_NET_DATA) console.log("OnEventSceneMessage cbGameStatus " + cbGameStatus + " size " + wDataSize)
        switch (cbGameStatus) {
            case GameDef.GS_TK_FREE:	//空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    this.m_lBaseScore = pStatusFree.llBaseScore;

                    //玩家设置 显示时钟
                    if (!bLookonUser && !this.m_ReplayMode) {
                        if (this.m_wGameProgress>0) {
                            this.SetGameClock(0, IDI_GAME_CLOCK, pStatusFree.dwCountDown);
                        }
                    }
                    var kernel = gClientKernel.get();
                    if (this.m_dwRoomID != 0 && !this.m_ReplayMode && !kernel.IsLookonMode())
                    {
                        this.m_GameClientView.m_BtFriend.active = this.m_wGameProgress == 0;
                        this.m_GameClientView.m_BtStart.active = true;
                    }

                    return true;
                }
            case GameDef.GS_TK_CALLBANKER:	//抢庄状态
                {
                    //效验数据
                    var pStatusCB = GameDef.CMD_S_StatusCallBanker();
                    if (wDataSize != gCByte.Bytes2Str(pStatusCB, pData)) return false;

                    //上局庄家
                    this.m_wLastBanker = pStatusCB.wLastBanker;
                    
                    //抢庄在发牌后 所以要显示牌
                    var MeChair = this.GetMeChairID();
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++)
                     {
                        this.m_UserState[i] = pStatusCB.cbPlayStatus[i];
                        this.m_lBankerTimes[i] = pStatusCB.cbBankerTimes[i];
                        if (!this.m_UserState[i]) continue;
                        this.m_cbCardCount[i] = 2;
                        this.m_cbCardData[i] = pStatusCB.cbHandCardData[i];
                        var ViewID = this.SwitchViewChairID(i);
                        //显示抢庄倍数
                        if (this.m_lBankerTimes[i] != 0xFF) this.m_GameClientView.SetUserState(ViewID, 'X' + pStatusCB.cbBankerTimes[i]);
                        //显示下注分
                        this.m_GameClientView.SetAddScore(ViewID, 0);

                        //显示牌
                        if(MeChair==i)
                        {
                            if(this.m_dwRulesArr[0] & GameDef.GAME_TYPE_CARD_PUBLIC)this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(this.m_cbCardData[i], 1);
                            else this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);  
                        }   
                        else
                            this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);      
                    }

                    //var MeChairID = this.GetMeChairID();
                    if (pStatusCB.cbPlayStatus[MeChair]) 
                    {
                        if(pStatusCB.cbBankerTimes[MeChair]==0xFF)
                        {
                            this.m_GameClientView.ShowBankerUI();
                        }
                        //第一局
                        // if (this.m_wGameProgress == 1) {
                        //     if (this.m_lBankerTimes[MeChairID] == 0xFF)
                        //         this.m_GameClientView.ShowBankerUI();
                        // } else {
                        //     //一人有对子
                        //     if (pStatusCB.cbLastMaxCnt == 1) {
                        //         //没做选择
                        //         if (!pStatusCB.bChoose) {
                        //             //询问是否坐庄
                        //             if (MeChairID == pStatusCB.cbLastMaxUser[0])
                        //                 this.m_GameClientView.m_NdToBeBanker.active = true;
                        //         }
                        //         //选择后还在此状态即其他玩家抢庄
                        //         else {
                        //             if (MeChairID != pStatusCB.cbLastMaxUser[0])
                        //                 this.m_GameClientView.ShowBankerUI();
                        //         }

                        //     }
                        //     //2人有对子还在此状态即对子玩家抢庄
                        //     else if (pStatusCB.cbLastMaxCnt == 2) {
                        //         for (var i = 0; i < 2; i++) {
                        //             if (MeChairID == pStatusCB.cbLastMaxUser[i] && this.m_lBankerTimes[MeChairID] == 0xFF)
                        //                 //显示抢庄节点
                        //                 this.m_GameClientView.ShowBankerUI();
                        //         }
                        //     }

                        // }
                    }


                    //test托管 下注定时器
                    this.SetGameClock(0, IDI_GAME_CLOCK, pStatusCB.dwCountDown);

                    return true;

                }
            case GameDef.GS_TK_CALLPLAYER:	//下注状态
                {

                    //效验数据
                    var pStatusCP = GameDef.CMD_S_StatusCallPlayer();
                    if (wDataSize != gCByte.Bytes2Str(pStatusCP, pData)) return false;
                    //上局庄家
                    this.m_wLastBanker = pStatusCP.wLastBanker;
                    //庄家标识
                    this.m_wBankerUser = pStatusCP.wBankerUser;
                    var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
                    this.m_GameClientView.SetBankerUser(BankerView);

                    //显示
                    var MeChair = this.GetMeChairID();
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++)
                    {
                        //玩家状态
                        this.m_UserState[i] = pStatusCP.cbPlayStatus[i];
                        if (!this.m_UserState[i]) continue;
                        this.m_cbCardCount[i] = 2;
                        this.m_cbCardData[i] = pStatusCP.cbHandCardData[i];
                        //下注
                        var ViewID = this.SwitchViewChairID(i);
                        //显示下注分
                        if (pStatusCP.llAddScore[i] != 0) {
                            this.m_GameClientView.SetAddScore(ViewID, pStatusCP.llAddScore[i]);
                        }
  
                        //下注节点
                        var bPush = false;
                        //上局庄家=本局庄家、闲家、上局赢可以推注
                        //if (pStatusCP.wLastBanker == this.m_wBankerUser && this.m_wBankerUser != this.GetMeChairID() && pStatusCP.llGameScore[this.GetMeChairID()] > 0)
                            //bPush = true;
                        if (pStatusCP.cbPlayStatus[MeChair] && pStatusCP.llAddScore[MeChair] == 0) 
                        {
                            this.m_GameClientView.ShowScoreUI(bPush);
                        }
                        //显示牌
                        if(MeChair==i)
                        {
                            if(this.m_dwRulesArr[0] & GameDef.GAME_TYPE_CARD_PUBLIC)this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(this.m_cbCardData[i], 1);
                            else this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);
                        }
                        else
                            this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);      
                    }

                    //test托管 下注定时器
                    this.SetGameClock(0, IDI_GAME_CLOCK, pStatusCP.dwCountDown);

                    return true;
                }
            case GameDef.GS_TK_PLAYING:	//游戏状态
                {
                    //--------------------------------------------------------------
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    var bytesize = gCByte.Bytes2Str(pStatusPlay, pData)
                    if (wDataSize != bytesize) return false;

                    this.m_wBankerUser = pStatusPlay.wBankerUser;
                    this.m_lBaseScore = pStatusPlay.llBaseScore;
                    //庄家标志
                    var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
                    this.m_GameClientView.SetBankerUser(BankerView);
               

                    var MeChair = this.GetMeChairID();
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) 
                    {
                        //玩家状态
                        this.m_UserState[i] = pStatusPlay.cbPlayStatus[i];
                        if (!this.m_UserState[i]) continue;
                        var ViewID = this.SwitchViewChairID(i);
                        //手牌、数量
                        this.m_cbCardData[i] = pStatusPlay.cbHandCardData[i];
                        this.m_cbCardCount[i] = 2;

                        //显示下注分数
                        if (pStatusPlay.llAddScore[i] != 0) {
                            this.m_GameClientView.SetAddScore(ViewID, pStatusPlay.llAddScore[i]);
                        }

                        //已开牌的用户显示手牌
                        if (pStatusPlay.bOpenCard[i]) 
                        {
                            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(this.m_cbCardData[i], 2);
                        }
                        else 
                        {
                            //没开牌，显示扣着的手牌
                            // var CardArr = new Array();
                            // this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(CardArr, 2);
                           // if (i == MeChair) this.m_GameClientView.ShowCardUI();
                            //明牌暗牌
                           if(MeChair==i)
                           {
                                if(this.m_dwRulesArr[0] & GameDef.GAME_TYPE_CARD_PUBLIC)this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(this.m_cbCardData[i], 1);
                                else this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);
                                this.m_GameClientView.ShowCardUI();
                           }
                           else
                               this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);
                            
                        } 
                    }

                    //test托管 开牌定时器
                    this.SetGameClock(0, IDI_GAME_CLOCK, pStatusPlay.dwCountDown);

                    return true;
                }
        }
        return false;
    },

    SetGameClock: function (wChairID, nTimerID, nElapse) {
        if (this.m_ReplayMode) return;
        this.m_GameClientView.SetUserTimer(wChairID, nElapse, 1);
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

    OnSubUserReady: function (pData, wDataSize) {
        var ReadyState = GameDef.CMD_S_ReadyState();
        //效验
        if (wDataSize != gCByte.Bytes2Str(ReadyState, pData)) return false;
        this.m_GameClientView.SetUserState(INVALID_CHAIR);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pUserItem = this.GetClientUserItem(i);
            if (pUserItem == null || pUserItem == 0) continue;
            var ViewID = this.SwitchViewChairID(i);
            if (ReadyState.cbReadyStatus[i]) {
                this.m_GameClientView.SetUserState(ViewID, 'Ready');
                if (!this.m_UserReady[i]) this.PlayActionSound(i, "READY");
                this.m_UserReady[i] = ReadyState.cbReadyStatus[i];
            }
        }
        if (ReadyState.cbReadyStatus[this.GetMeChairID()]) this.OnMessageStart(null, true);
        else this.m_GameClientView.m_BtStart.active = true;
        return true;
    },

    //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart, pData)) return false;
        this.m_GameEnd = null;
        //隐藏界面
        this.KillGameClock();
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_NdCtrlStart.active = false;
        this.OnMessageStart(null, true);
        this.m_cbCardData = new Array();



        //上局庄家
        this.m_wLastBanker = this.m_GameStart.wLastBanker;

        //数据
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserState[i] = this.m_GameStart.cbPlayStatus[i];
            this.m_cbCardCount[i] = 0;
            this.m_UserReady[i] = 0;
            this.m_lBankerTimes[i] = 0xFF;
        }

        //显示下注分UI

        // this.m_GameClientView.m_ScoreNode.active = true;

      

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_GameStart.cbPlayStatus[i]) continue;
            var wView = this.SwitchViewChairID(i);
            this.m_GameClientView.SetAddScore(wView, 0);
        }

        //庄家 固定庄直接显示庄
        this.m_wBankerUser = this.m_GameStart.wBankerUser;

        //if(this.m_wBankerUser !=INVALD_CHAIR)
        {
            var wView = this.SwitchViewChairID(this.m_wBankerUser);
            this.m_GameClientView.SetBankerUser(wView);
        }
        //固定庄 轮庄
        // if (this.m_wBankerUser != INVALD_CHAIR && (this.dwRules[0] & GameDef.GAME_TYPE_BANKER_FIX || this.dwRules[0] & GameDef.GAME_TYPE_BANKER_TURN)) {
        //     var wView = this.SwitchViewChairID(this.m_wBankerUser);
        //     this.m_GameClientView.SetBankerUser(wView);

        //     //显示下注按钮(庄家不下注)
        //     if (this.m_wBankerUser != this.GetMeChairID() && this.m_UserState[this.GetMeChairID()]) {
        //         //固定庄推注
        //         if (this.dwRules[0] & GameDef.GAME_TYPE_BANKER_FIX) {
        //             if (this.m_GameStart.llGameScore[this.GetMeChairID()] > 0)
        //                 this.m_GameClientView.ShowScoreUI(true);
        //             else
        //                 this.m_GameClientView.ShowScoreUI(false);
        //         }
        //         else
        //             this.m_GameClientView.ShowScoreUI(false);
        //     }
        // } else 
        // {
        //     if (this.m_UserState[this.GetMeChairID()]) 
        //     {
        //         //第一局自由抢庄
        //         if (this.m_wGameProgress == 0) {
        //             this.m_GameClientView.ShowBankerUI();
        //         } else {
        //             //最大对子人数
        //             if (this.m_GameStart.cbLastMaxCnt == 2) {
        //                 for (var i = 0; i < 2; i++) {
        //                     if (this.GetMeChairID() == this.m_GameStart.cbLastMaxUser[i])
        //                         //显示抢庄节点
        //                         this.m_GameClientView.ShowBankerUI();
        //                 }
        //             } else if (this.m_GameStart.cbLastMaxCnt == 1) {
        //                 //询问是否坐庄
        //                 if (this.GetMeChairID() == this.m_GameStart.cbLastMaxUser[0])
        //                     this.m_GameClientView.m_NdToBeBanker.active = true;
        //             } else {
        //                 //没有对子连庄 (上边写了)
        //                 // this.m_wBankerUser = this.m_GameStart.wBankerUser;
        //                 var wView = this.SwitchViewChairID(this.m_wBankerUser);
        //                 this.m_GameClientView.SetBankerUser(wView);
        //                 //推注 上局赢分 本局不是庄
        //                 var bPush = this.CanPushScore(this.m_GameStart.wLastBanker);
        //                 //显示下注按钮(庄家不下注)
        //                 if (this.m_wBankerUser != this.GetMeChairID())
        //                     this.m_GameClientView.ShowScoreUI(bPush);
        //             }
        //         }

        //     }


        // }

        //test托管 下注/是否坐庄/抢庄 定时器
        //this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);

        return true;
    },


    //是否能推注
    CanPushScore: function (wLastBanker) {
        var bPush = false;
        //没换庄、本人不是庄、上局赢分
        if (wLastBanker == this.m_wBankerUser && this.m_wBankerUser != this.GetMeChairID() && this.m_GameStart.llGameScore[this.GetMeChairID()] > 0)
            bPush = true;
        return bPush;
    },

    //抢庄
    OnSubCallBanker: function (pData, wDataSize) {
        var UserCall = GameDef.CMD_S_UserCall();
        //效验
        if (wDataSize != gCByte.Bytes2Str(UserCall, pData)) return false;
        this.m_lBankerTimes[UserCall.wChairID] = UserCall.byTimes;
        //界面
        //if (UserCall.wCurrentUser == this.GetMeChairID()) this.m_GameClientView.HideAllGameButton();
        if (UserCall.wChairID == this.GetMeChairID()) this.m_GameClientView.HideAllGameButton();
        var ViewID = this.SwitchViewChairID(UserCall.wChairID);
        this.m_GameClientView.SetUserState(ViewID, 'X' + UserCall.byTimes);
        return true;
    },

    //定庄
    OnSubBankerUser: function (pData, wDataSize) {

        //test托管 关闭抢庄定时器
        this.KillGameClock();

        var BankerUser = GameDef.CMD_S_UserCall();
        //效验
        if (wDataSize != gCByte.Bytes2Str(BankerUser, pData)) return false;

        this.m_GameClientView.HideAllGameButton();
        this.m_wBankerUser = BankerUser.wChairID;
        var MeChair = this.GetMeChairID();

        var BanekrAniArr = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) 
        {
            if (!this.m_UserState[i] || this.m_lBankerTimes[i] != this.m_lBankerTimes[this.m_wBankerUser]) continue;
            var ViewID = this.SwitchViewChairID(i);
            BanekrAniArr.push(ViewID);
        }
        this.m_lBankerTimes[this.m_wBankerUser] = BankerUser.byTimes;
        this.m_GameClientView.StartAni(BanekrAniArr, this.SwitchViewChairID(this.m_wBankerUser), this.m_ReplayMode);
        return true;
    },

    OnSubToBeBanker: function (pData, wDataSize) {

        //test托管 关闭是否坐庄定时器
        this.KillGameClock();

        //隐藏坐庄/不坐
        this.m_GameClientView.m_NdToBeBanker.active = false;

        var BeBanker = GameDef.CMD_S_BeBanker();
        //效验
        if (wDataSize != gCByte.Bytes2Str(BeBanker, pData)) return false;

        //坐庄显示庄家、下注节点
        if (BeBanker.bBanker) {
            //显示庄家
            this.m_wBankerUser = BeBanker.wBankerUser;
            var ViewID = this.SwitchViewChairID(this.m_wBankerUser);
            this.m_GameClientView.SetBankerUser(ViewID);
            //显示下注按钮
            var bPush = this.CanPushScore(BeBanker.wLastBanker);
            if (this.m_UserState[this.GetMeChairID()])
                this.m_GameClientView.ShowScoreUI(bPush);
        }
        //不坐庄其他玩家抢庄
        else {
            if (this.m_UserState[this.GetMeChairID()] && this.GetMeChairID() != BeBanker.wChooseUser) {
                this.m_GameClientView.ShowBankerUI();
            }
        }

        //test托管 下注/抢庄 定时器
        this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);

        return true;
    },

    //加注
    OnSubAddScore: function (pData, wDataSize) {
        var AddScore = GameDef.CMD_S_AddScore();
        if (wDataSize != gCByte.Bytes2Str(AddScore, pData)) return false;

        var wView = this.SwitchViewChairID(AddScore.wAddUser);
        this.m_GameClientView.SetAddScore(wView, AddScore.lAddScore);
        //this.KillGameClock();
        if (AddScore.wAddUser==this.GetMeChairID()) {
            //显示看牌、搓牌按钮
            this.m_GameClientView.HideAllGameButton();
            this.KillGameClock();
           // this.m_GameClientView.ShowCardUI();    
        }
        // if(this.m_wBankerUser==this.GetMeChairID())
        // {
        //     this.m_GameClientView.ShowCardUI(); 
        // }
        return true;
    },

    //发牌
    OnSubSendCard: function (pData, wDataSize) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //test托管  关闭下注定时器
        //this.KillGameClock();

        var SendCard = GameDef.CMD_S_SendCard();
        if (wDataSize != gCByte.Bytes2Str(SendCard, pData)) return false;

        var cbDice = new Array(2);
        for (var i = 0; i < 2; i++)cbDice[i] = SendCard.cbDice[i];
        //手牌数据
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_UserState[i]) continue;
            this.m_cbCardData[i] = SendCard.cbHandCardData[i];
        }
        //没有骰子直接发牌 有庄从庄发 没庄随机

        var startIndex = this.m_wBankerUser ==INVALD_CHAIR ?this.RandOnePlayUser():this.m_wBankerUser;
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(2, this.m_UserState, startIndex);

        //test托管 开牌定时器
        //应该是抢庄定时器
        //this.SetGameClock(0, IDI_GAME_CLOCK, 3);

        //骰子动画(播完发牌)
        //this.m_GameClientView.PlayDiceAni(cbDice);

        return true;
    },
    RandOnePlayUser:function(){
        var wUser = Math.floor((Math.random()*10)+1)%GameDef.GAME_PLAYER;
        while(!this.m_UserState[wUser])
        {
            wUser = (wUser +1) %GameDef.GAME_PLAYER;
        }
        return wUser;
    },

    //看牌
    // OnSubLookCard: function (pData, wDataSize) {
    //     var LookCard = GameDef.CMD_S_LookCard();
    //     if (wDataSize != gCByte.Bytes2Str(LookCard, pData)) return false;

    //     if (LookCard.wLookUser == this.GetMeChairID()) {
    //         this.m_GameClientView.m_NdLookCard.active = false;
    //         this.m_GameClientView.m_NdRubCard.active = false;
    //         this.m_GameClientView.m_NdOpenCard.active = true;
    //     }

    //     return true;
    // },

    //开牌
    OnSubOpenCard: function (pData, wDataSize) {
        var OpenCard = GameDef.CMD_S_Open_Card();
        if (wDataSize != gCByte.Bytes2Str(OpenCard, pData)) return false;
        
        //显示开牌用户手牌
        var wView = this.SwitchViewChairID(OpenCard.wOpenUser);
        //自己不播放翻牌
        if (OpenCard.wOpenUser != this.GetMeChairID()) {
            this.m_GameClientView.m_UserCardControl[wView].SetCardDataAni(OpenCard.cbHandCardData, 2);
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
        // this.m_GameClientView.SetCardClickedAble(false);
        // this.m_GameClientView.SetCardTypeFinish(INVALD_CHAIR);
        // this.m_GameClientView.SetTableSpState();

        //删除时间
        this.KillGameClock();
        var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
        var BankerGetArr = new Array();
        var BankerGiveArr = new Array();
        this.bScoreZeor =new Array();
        //小结算界面
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //展示手牌
            if (!this.m_UserState[i]) continue;
            //没发牌前解散
            if (!this.m_cbCardData[i]) continue;
            //显示分数
            var ViewID = this.SwitchViewChairID(i)
            //显示分
            this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.llGameScore[i]);
            //牌
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(this.m_GameEnd.cbHandCardData[i], 2);
            //牌型
            var index = 0;
            //勾选翻倍
            //八九点X2（包括8.5；9.5），二八杠x3, 对子x4, 对红中x5（选28杠）
            //八九点X2（包括8.5；9.5），          对子x3 对红中x4（不选28杠）
            var score = GameDef.GetCardScore(this.m_cbCardData[i]);
            if (this.dwRules[0] & GameDef.GAME_TYPE_DOUBLE)
            {
                index = 1;
                //纠正数值到牌型
                var bHave28Gang = (this.dwRules[0] & GameDef.GAME_TYPE_28GANG )> 0;
                if(GameDef.Is28Gang(this.m_cbCardData[i],this.m_dwRulesArr[0]) == true)score = 200;//index = 1
                //对子
                if(this.m_cbCardData[i][0] == this.m_cbCardData[i][1])
                {
                    score = bHave28Gang ? 211:210;
                    if(this.m_cbCardData[i][0] == 0x15)
                    {
                        score = bHave28Gang ? 411:410;
                    }
                }

            }else if(GameDef.Is28Gang(this.m_cbCardData[i],this.m_dwRulesArr[0]) == true)score = 201;//index = 0
            this.m_GameClientView.SetCardType(ViewID, index, score);

            //通杀通陪放统一音效
            if(this.m_GameEnd.cbAllWinorLose==0)
            {
                if (ViewID == GameDef.MYSELF_VIEW_ID) {
                    if (this.m_GameEnd.llGameScore[i] > 0) cc.gSoundRes.PlayGameSound("WIN");
                    if (this.m_GameEnd.llGameScore[i] < 0) cc.gSoundRes.PlayGameSound("LOSE");
                }
            }
            else
            {
                this.m_GameEnd.cbAllWinorLose==1?cc.gSoundRes.PlayGameSound("TONGS"):cc.gSoundRes.PlayGameSound("TONGP");
            }

            //金币特效
            if (i != this.m_wBankerUser) {
                if (this.m_GameEnd.llGameScore[i] > 0) BankerGiveArr.push(ViewID);
                if (this.m_GameEnd.llGameScore[i] < 0) BankerGetArr.push(ViewID);
            }
            this.bScoreZeor[i]=this.m_GameEnd.bScoreZeor[i];
        }
        this.m_GameClientView.PlayAllWinorLoseAction(this.m_GameEnd.cbAllWinorLose);
        this.m_GameClientView.m_JetCtrl.JetMoveAni(BankerView, BankerGetArr, 1);
        this.m_GameClientView.m_JetCtrl.JetMoveAni(BankerView, BankerGiveArr, 0);
        //设置定时
        if (this.m_ReplayMode)
            this.OnTimeIDI_PERFORM_END()
        else
            this.schedule(this.OnTimeIDI_PERFORM_END,2);

        return true;
    },

    OnTimeIDI_PERFORM_END: function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);

        if (this.m_GameEnd == null) return
        // this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserState(INVALD_CHAIR);

        this.m_GameClientView.m_Jetton.OnGameSetScore(0);
        // for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
        //     if (!this.m_UserState[i]) continue;
        //     //显示分数
        //     var ViewID = this.SwitchViewChairID(i)
        //     this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.llGameScore[i]);
        // }

        if (this.m_RoomEnd == null) 
        {
         
            this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);
            // var  bGoldServer = g_ServerListDataLast.wServerType & (GAME_GENRE_GOLD | GAME_GENRE_PERSONAL_S|GAME_GENRE_PERSONAL_G);
            // if(bGoldServer)
            // {
            //     if(this.m_GameClientView.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID].GetUserScore()<1)
            //         this.m_GameClientView.m_BtStart.active = false;
            //     else
            //         this.m_GameClientView.m_BtStart.active = true;
            // }
            // else
            if(this.bScoreZeor[this.GetMeChairID()])this.m_GameClientView.m_BtStart.active = false;
            else this.m_GameClientView.m_BtStart.active = true;
                
        } else {
            this.ShowEndView();
        }
    },

    //---------------------------------------------------------------------
    //开始消息(准备)
    OnMessageStart: function (Tag, bClear) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetAddScore(INVALD_CHAIR);
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.SetShowUserBanker(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.SetCardClickedAble(false);
        this.m_GameClientView.SetTableSpState();
        this.m_GameClientView.m_BtStart.active = false;
        //发送消息
        //if(!bClear)this.SendFrameData(SUB_GF_USER_READY);
        if (!bClear) this.SendGameData(GameDef.SUB_C_READY);

        return 0;
    },

    //加注消息
    OnMessageAddScore: function (addScore) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //发送数据
        var AddScore = GameDef.CMD_C_AddScore();
        AddScore.lAddScore = parseInt(addScore);
        this.SendGameData(GameDef.SUB_C_ADD_SCORE, AddScore);
    },

    //推注
    OnMessagePushAddScore: function () {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //推注分不能大于上限
        var cbPushMax = GameDef.GetPushScore(this.dwRules[0]);
        var cbPushScore = this.m_GameStart.llLastAddScore[this.GetMeChairID()] * 2 > cbPushMax ? cbPushMax : this.m_GameStart.llLastAddScore[this.GetMeChairID()] * 2;

        //发送数据
        var AddScore = GameDef.CMD_C_AddScore();
        AddScore.lAddScore = cbPushScore;
        this.SendGameData(GameDef.SUB_C_ADD_SCORE, AddScore);
    },

    //发牌
    OnPlaySendCard: function (cbDiceNum)
    {
        var playCnt = 0;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) 
        {
            if (!this.m_UserState[i]) continue;
            playCnt++;
        }
        //发牌顺序逆时针
        //var startIndex = (this.m_wBankerUser + (cbDiceNum[0] + cbDiceNum[1] - 1) % playCnt) % playCnt;
        var startIndex = (this.m_wLastBanker + (cbDiceNum[0] + cbDiceNum[1] - 1) % playCnt) % playCnt;
        //顺时针（但是座位没变顺时针）
        // var ClockWise = this.m_wLastBanker - (cbDiceNum[0] + cbDiceNum[1] ) % playCnt + 1;
        // var startIndex = (Math.abs(ClockWise)) % playCnt;
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(2, this.m_UserState, startIndex);
    },

    //发牌完成
    OnMessageDispatchFinish: function (wChairID, CardCount, CardIndex) {

        //发牌过程
        this.m_cbCardCount[wChairID]++;
        var ViewID = this.SwitchViewChairID(wChairID);

        if(CardCount<1)return;//一次发一张 都发完再显示
        //var actQuene = [];
        //actQuene.push(cc.callFunc(function () 
        //{
        //}, this));
        //延迟显示
        // var playCnt = 0;
        // for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
        //     if (!this.m_UserState[i]) continue;
        //     playCnt++;
        // }
        //actQuene.push(cc.delayTime(0.3 * playCnt));
    
        // if (this.m_cbCardCount[this.GetMeChairID()] == 2) {
        //     //显示看牌、搓牌按钮
        //     this.m_GameClientView.ShowCardUI();
        // }
        // actQuene.push(cc.callFunc(function () {
        //     //显示看牌、搓牌按钮
        //     this.m_GameClientView.ShowCardUI();
        // }, this)); 

        //发完牌显示牌明牌和暗牌
        if(wChairID==this.GetMeChairID()){
            if(this.m_dwRulesArr[0] & GameDef.GAME_TYPE_CARD_PUBLIC)this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(this.m_cbCardData[wChairID], 1);
            else this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0, 0);
        }
        else
           this.m_GameClientView.m_UserCardControl[ViewID].SetCardDataInt(0,0);
        // for(var i =0;i<GameDef.GAME_PLAYER;i++)
        // {
        //     if(this.m_UserState[i] && i!=GameDef.MYSELF_VIEW_ID)
        //     this.m_GameClientView.m_UserCardControl[i].SetCardData(this.m_cbCardData[MeChairID], 2);
        // }
        //this.node.runAction(cc.sequence(actQuene));
        //抢庄才显示抢庄按钮
        if(this.m_dwRulesArr[0] & GameDef.GAME_TYPE_BANKER_GRAB)this.ShowBankerUIE();
        else{
            this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);//下注
            this.m_GameClientView.ShowScoreUI(false);
        } 
    },

    //看牌（点看牌直接开牌,不等全部人看牌后显示开牌按钮了）
    OnMessageShowCard: function () {
        var MeChairID = this.GetMeChairID();
        //记录是否看牌
        // this.SendGameData(GameDef.SUB_C_LOOK_CARD);
        //发送开牌消息
        this.SendGameData(GameDef.SUB_C_OPEN_CARD);
        //显示手牌
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardDataAni(this.m_cbCardData[MeChairID], 2);
    },

    //搓牌界面
    OnShowOpenCardCtrl: function () {
        var MeChair = this.GetMeChairID();
        this.m_GameClientView.m_OpenCardCtrl.node.active = true;
        this.m_GameClientView.m_OpenCardCtrl.SetCardData([this.m_cbCardData[MeChair][1],this.m_cbCardData[MeChair][0]]);
        this.m_GameClientView.SetCardClickedAble(true);
    },

    //开牌
    // OnMessageOpenCard: function () {
    //     //设置界面
    //     this.m_GameClientView.HideAllGameButton();
    //     //发送数据
    //     this.SendGameData(GameDef.SUB_C_OPEN_CARD);
    // },

    //抢庄消息
    OnMessageCallBanker: function (callScore) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.cbTimes = parseInt(callScore);
        this.SendGameData(GameDef.SUB_C_CALL_BANKER, CallScore);
    },

    //坐庄消息
    OnMessageToBeBanker: function (bBeBanker) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //发送数据
        var BeBanker = GameDef.CMD_C_ToBeBanker();
        BeBanker.bToBeBanker = parseInt(bBeBanker);
        this.SendGameData(GameDef.SUB_C_TOBEBANKER, BeBanker);
    },

    //抢庄动画回调
    OnTimeIDI_SETBANKER: function () {
        this.unschedule(this.OnTimeIDI_SETBANKER);
        //test托管 下注定时器
        this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);//抢庄后下注
        //显示庄家
        var ViewID = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(ViewID);
        this.m_GameClientView.SetUserState(INVALD_CHAIR);
        //显示抢不抢
        //this.m_GameClientView.SetUserState(ViewID, 'X' + this.m_lBankerTimes[this.m_wBankerUser]);
        //显示下注节点
       // var bPush = this.CanPushScore(this.m_wLastBanker);
        if (this.m_UserState[this.GetMeChairID()])
            this.m_GameClientView.ShowScoreUI(false);
    },
    //------------------------------------------------------------

    OnSubCallPlayer: function (pData, wDataSize) {
        var UserCall = GameDef.CMD_S_UserCall();
        //效验
        if (wDataSize != gCByte.Bytes2Str(UserCall, pData)) return false;

        var ViewID = this.SwitchViewChairID(UserCall.wChairID);
        this.m_GameClientView.SetUserState(ViewID, 'X' + UserCall.byTimes);
        return true;
    },



    OnSubShowStartCtrl: function () {
        this.m_GameClientView.m_NdCtrlStart.active = true;
        return true;
    },


    UpdateOpView: function (Time, SendCardCnt) {
        this.KillGameClock();
        var MeChair = this.GetMeChairID();
        var MeUserItem = this.GetMeUserItem();
        var bGame = this.m_UserState[MeChair];

        if (SendCardCnt == 4 || SendCardCnt == 3) {
            if (bGame && this.m_BankerState[MeChair] && this.m_lBankerTimes[MeChair] == 0xFF) {
                this.m_GameClientView.ShowBankerUI();
            }
        } else if (SendCardCnt == 0) {
            this.m_GameClientView.SetTableSpState('WaitAdd');
            var AddScore = this.m_GameClientView.m_UserTableScore[GameDef.MYSELF_VIEW_ID];
            if (bGame) {
                // if (AddScore == 0) this.m_GameClientView.ShowScoreUI();
            }
        } else if (SendCardCnt == 1) {
            this.m_GameClientView.SetTableSpState('LookCard');
            if (bGame && this.m_cbSGType[MeChair] == 0xff) {
                // this.m_GameClientView.ShowCardUI();
            }
        }
        //设置时间
        this.SetGameClock(0, IDI_GAME_CLOCK, Time);
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


    //买马消息
    // OnMessageAddScore :function (wChairID,lCallScore) {
    //     //设置界面
    //     this.m_GameClientView.HideAllGameButton();

    //     //发送数据
    //     var CallScore = GameDef.CMD_C_AddScore();
    //     CallScore.wChairID = wChairID;		
    //     CallScore.llAddScore = parseInt(lCallScore);
    //     this.SendGameData(GameDef.SUB_C_ADD_SCORE, CallScore);
    // },

    OnMessageCtrlStart: function () {
        //发送数据
        this.SendGameData(GameDef.SUB_C_START);
    },
    //邀请好友分享
    OnFirend: function () {
        // if (cc.sys.isNative) {
        this.ShowPrefabDLG("SharePre");
        // } else {

        // }
    },
  
    //设置信息
    SetViewRoomInfo: function (dwServerRules,dwRules) {
        this.m_wGameCount = GameDef.GetGameCount(dwServerRules,dwRules);
        this.m_GameClientView.SetViewRoomInfo(dwServerRules,dwRules);
        this.m_GameMode = (GameDef.GAME_TYPE_GAME_MODE & dwRules[0]) ? 1 : 0;
        this.dwRules = dwRules;
    },


    OnClearScene: function () {
        //设置界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.OnMessageStart(null, true);
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_NdCtrlStart.active = false;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_lBankerTimes = new Array();
        this.m_cbCardData = new Array();
        this.m_cbCardCount = new Array();
        this.m_UserState = new Array();
        this.m_UserReady = new Array();
        this.m_BankerState = new Array();


        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_cbSGType[i] = 0xFF;
            this.m_cbJHType[i] = 0xFF;
            this.m_lBankerTimes[i] = 0xFF;
        }
        if (this.m_REndCtrl) this.m_REndCtrl.HideView();
        this.m_GameClientView.m_Jetton.OnGameSetScore(0);
    },
    ShowBankerUIE: function()
    {
        if (this.m_UserState[this.GetMeChairID()]) 
        this.m_GameClientView.ShowBankerUI();
        this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);//10秒抢庄
    },
    OnALLAdd:function(pData, wDataSize)
    {
        var AddAll = GameDef.CMD_S_Alladd();
        if (wDataSize != gCByte.Bytes2Str(AddAll, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        if(AddAll.bIsBet)
        {
            this.KillGameClock();
            //if (this.m_cbCardCount[this.GetMeChairID()] == 2) {
                //显示看牌、搓牌按钮
                //this.ShowTips("买定离手");
                this.m_GameClientView.ShowCardUI();
                this.SetGameClock(0, IDI_GAME_CLOCK, TIME_CLOCK);//10秒抢庄
           //}
        }
        return true;

    },

    OnBtClickedSet1: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Setting',this.node,function(Js){
            Js.SetGame(GameDef);
        }.bind(this));
    },
    OnRefreshCardBack:function(){
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var ViewID = this.SwitchViewChairID(i)
            var cbCardData = new Array(2);
            var CardCount = this.m_GameClientView.m_UserCardControl[ViewID].GetCardData(cbCardData,2);
            if(CardCount>0)
            {
                this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(cbCardData, CardCount);
            }
        }
    },

});
