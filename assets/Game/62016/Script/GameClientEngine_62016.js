//游戏时间
var IDI_START_GAME = 201;					//开始定时器
var IDI_CALL_SCORE = 202;					//叫分定时器


//游戏时间
var TIME_START = 10;
var TIME_CALL_SCORE = 30;


cc.Class({
    extends: cc.GameEngine,

    properties: {

    },

    // use this for initialization
    start :function () {
        LoadSetting();
    },

    ctor :function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['GAME_OVER', 'gameover'],
            ['GAME_WIN', 'gamewin'],
            ['CARD_CLOSE', 'carderclose'],
            ['CARD_OPEN', 'carderopen'],
            ['PK', 'pk'],
            ['PKBG', 'sd'],
            ['M_READY', 'm/zhunbei'],
            ['W_READY', 'w/zhunbei'],
        );
        //出牌声音
        for(var i=0;i<6;++i){
            this.m_SoundArr[this.m_SoundArr.length] = ['M_'+i,'act_m'+i];//+'.mp3'
            this.m_SoundArr[this.m_SoundArr.length] = ['W_'+i,'act_w'+i];
        }
          //短语声音
        for(var i=1;i<=6;++i){
            var FileName = i<10?'0'+i:i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/phrase/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/phrase/'+FileName];
        }

        this.m_szText = new Array(
            '各位观众我要开牌了',
            '时间就是金钱我的朋友',
            '我是庄家来点刺激的吧',
            '下的多吃火锅下的少吃水饺',
            '一点小钱拿去喝茶吧',
            '有没有天理有没王法这牌也输',
        );
        //游戏变量
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_lCurrentAddScore = 0;
        this.m_wTurnIndex = 0;
        this.m_UserReady = new Array();
        this.m_UserLookCard = new Array();
        this.m_wGameRule = 0;
        this.m_lUserTableScore = new Array();
        this.m_bServerType = 0;
        this.m_wMeChairID = INVALID_CHAIR;
        this.m_wViewChairID = new Array();
        this.m_cbFllowIndex = INVALID_BYTE;
        this.m_lAddScoreArr = new Array();

        return;
    },
    //网络消息
    OnEventGameMessage :function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:	    //游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_ADD_SCORE:		//用户叫分
                {
                    return this.OnSubAddScore(pData, wDataSize);
                }
            case GameDef.SUB_S_GIVE_UP:		//用户放弃
                {
                    return this.OnSubPassCard(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END:	//游戏结束
                {
                    return this.OnSubGameConclude(pData, wDataSize);
                }
            case GameDef.SUB_S_COMPARE_CARD:		//用户比牌
                {
                    return this.OnSubUserCompare(pData, wDataSize);
                }
            case GameDef.SUB_S_COMPARE_FINISH:		//用户比牌
                {
                    return this.OnSubCompareFinish(pData, wDataSize);
                }
            case GameDef.SUB_S_LOOK_CARD:		//庄家信息
                {
                    return this.OnSubLookCard(pData, wDataSize);
                }
            case GameDef.SUB_S_GUZHUYIZHI:      //孤注一掷
                {
                    return this.OnSubGuZhuYiZhi(pData,wDataSize);
                }
            case GameDef.SUB_S_START_CTRL:	//游戏结束
                {
                    return this.OnSubShowStartCtrl(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_READY:	//游戏结束
                {
                    return this.OnSubUserReady(pData, wDataSize);
                }
        }
        return true;
    },
    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if(window.LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
        switch (cbGameStatus) {
            case GameDef.GAME_STATUS_FREE:	//空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    this.m_GameClientView.SetCellScore(pStatusFree.llBaseScore);
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (!kernel.IsLookonMode()) {
                        //开始设置
                        var pIClientUserItem = kernel.GetTableUserItem(this.GetMeChairID());
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            // if( !this.m_ReplayMode ) this.m_GameClientView.m_BtStart.active = true;
                            // if( !this.m_ReplayMode ) this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, pStatusFree.dwCountDown);
                        }
                    }
                    this.m_GameClientView.m_InfoBG.active = true;
                    if(!this.m_ReplayMode && !this.IsLookonMode()&&this.m_dwRoomID != 0){
                        this.m_GameClientView.m_BtStart.active = this.m_GameClientView.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID].GetUserStatus() == US_SIT;
                        this.m_GameClientView.m_BtFriend.active = this.m_wGameProgress == 0;
                    }
                    // if (this.m_dwRoomID != 0 &&  this.m_wGameProgress == 0 && !this.m_ReplayMode) this.m_GameClientView.m_BtFriend.active = true;
                    return true;
                }
            case GameDef.GAME_STATUS_PLAY:	//叫分状态
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

                    this.m_wCurrentUser = pStatusPlay.wCurrentUser;
                    this.m_wFirstUser = pStatusPlay.wFirstUser;
                    this.m_wTurnIndex = pStatusPlay.wTurnIndex;
                    this.m_bServerType = pStatusPlay.bServerType;
                    this.m_GameClientView.m_InfoBG.active = true;
                    this.m_GameClientView.m_BtStart.active = false
                    this.m_cbFllowIndex  = pStatusPlay.AddScoreInfo.cbFllowIndex;
                    this.m_lAddScoreArr = clone(pStatusPlay.AddScoreInfo.llCanAddScore);
                    this.m_wMeChairID = this.GetMeChairID();
                    for(var i = 0;i<GameDef.GAME_PLAYER;i++){
                        this.m_wViewChairID[i] = this.SwitchViewChairID(i);
                    }

                    for(var i=0;i<GameDef.GAME_PLAYER;i++)
                    {
                        this.m_lUserTableScore[i] = pStatusPlay.llUserTableScore[i];
                    }
                    this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
                    this.m_GameClientView.SetCellScore(pStatusPlay.llBaseScore);
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(pStatusPlay.wBankerUser));
                    for(var i=0;i<GameDef.GAME_PLAYER;i++)
                    {
                        for(var j=0;j<3;j++)
                       {
                          this.m_GameClientView.m_cbCardData[i][j] = pStatusPlay.cbCardData[i][j];
                       }

                    }
                    //if(this.m_wCurrentUser == INVALID_CHAIR) return true;

                    for(var i = 0; i < GameDef.GAME_PLAYER; i++){
                        var ViewID = this.SwitchViewChairID(i)
                        this.m_GameClientView.m_UserPlay[ViewID] = pStatusPlay.cbPlayStatus[i];
                        //筹码
                        this.m_GameClientView.UserAddJet(pStatusPlay.llTableScore[i], ViewID);

                        //扑克
                        if(pStatusPlay.llTableScore[i]) {
                            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData([0,0,0], GameDef.MAX_COUNT);
                            if(pStatusPlay.cbGiveUpUser[i])  this.m_GameClientView.m_UserCardControl[ViewID].SetGiveUp();
                            else if(!pStatusPlay.cbPlayStatus[i]) this.m_GameClientView.m_UserCardControl[ViewID].SetLose();
                            if(pStatusPlay.bMingZhu[i]){
                                this.m_GameClientView.OnUserLookCard(ViewID, pStatusPlay.cbHandCardData);
                                this.m_UserLookCard[i] = 1;
                            }
                            if(pStatusPlay.cbGiveUpUser[i])this.m_GameClientView.OnUserGiveUp(ViewID);
                        }
                    }

                    this.UpdateOpView( pStatusPlay.dwCountDown);
                    return true;
                }
        }
        return false;
    },

    SetGameClock :function (wChairID, nTimerID, nElapse) {
        var wViewChairID = this.SwitchViewChairID(wChairID);
        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse, 1);
        if( this.m_ReplayMode ) return
        g_TimerEngine.SetGameTimer(wViewChairID, nTimerID, nElapse*1000, null, this, 'OnTimerMessage');
    },

    //删除定时器
    KillGameClock :function () {
        this.m_GameClientView.SetUserTimer(INVALID_CHAIR);
        g_TimerEngine.KillGameTimer();
        return true;
    },

    //时间消息
    OnTimerMessage :function (wChairID, CountDown, nTimerID, Progress) {
        var nElapse = parseInt(CountDown/1000);
        this.m_GameClientView.SetUserTimer(wChairID, nElapse+1, Progress);
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
                    if (CountDown == 0) {
                        //退出游戏
                        if (this.m_dwRoomID == 0)          //关闭游戏
                            this.m_TableViewFrame.ExitGame();
                        //else
                        //    if(this.m_dwRules & GameDef.GAME_TYPE_25_READY) this.OnMessageStart();
                    }

                    return true;
                }
        }

        return true;
    },

    //游戏开始
    OnSubGameStart :function (pData, wDataSize) {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart,pData)) return false;
        this.m_GameEnd = null;
        this.m_GameClientView.m_AddNodeArr[0].interactable = true;
        this.m_GameClientView.m_AddNodeArr[1].interactable = true;
        this.m_GameClientView.m_AddNodeArr[2].interactable = true;
        //隐藏成绩界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.m_BtFriend.active = false;
        this.$('LookOnNode/BtCtrlStart').active = false;
        this.OnMessageStart(null,true);
        this.m_wMeChairID = this.GetMeChairID();
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            this.m_wViewChairID[i] = this.SwitchViewChairID(i);
        }

        //游戏变量
        this.m_wCurrentUser = this.m_GameStart.wCurrentUser;
        this.m_wFirstUser = this.m_wCurrentUser;
        this.m_wTurnIndex = 1;
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        this.m_wGameRule =  this.m_GameStart.dwRules;
        this.m_bServerType = this.m_GameStart.bServerType;
        this.m_cbFllowIndex = this.m_GameStart.AddScoreInfo.cbFllowIndex;
        this.m_lAddScoreArr = clone(this.m_GameStart.AddScoreInfo.llCanAddScore);


        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_lUserTableScore[i] = this.m_GameStart.llUserTableScore[i];
        }

        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            for(var j=0;j<3;j++)
            {
                this.m_GameClientView.m_cbCardData[i][j] = this.m_GameStart.cbCardData[i][j];
            }

        }

        //界面
        var wBankerView = this.SwitchViewChairID(this.m_GameStart.wBankerUser);
        this.m_GameClientView.SetBankerUser(wBankerView);
        this.m_GameClientView.SetCellScore(this.m_GameStart.llBaseScore);

        //回放
        if(this.m_ReplayMode) return this.UpdateOpView();

        //下注
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserPlay[ViewID] = this.m_GameStart.cbPlayStatus[i];
            if( !this.m_GameStart.cbPlayStatus[i] ) continue;
            this.m_GameClientView.UserAddJet(this.m_GameStart.llBaseScore, ViewID);
        }

        //播放开始声音
        //cc.gSoundRes.PlayGameSound('GAME_START');

        // //发牌动画
         this.m_GameClientView.m_SendCardCtrl.PlaySendCard(GameDef.MAX_COUNT, this.SwitchViewChairID(this.m_GameStart.wCurrentUser), this.m_GameClientView.m_UserPlay);

        return true;
    },

    OnSubAddScore :function (pData, wDataSize) {
        var AddScore = GameDef.CMD_S_AddScore();

        //效验
        if (wDataSize != gCByte.Bytes2Str(AddScore, pData)) return false;
        if(AddScore.wAddScoreUse == this.GetMeChairID()) this.m_GameClientView.HideAllGameButton();
        this.m_wTurnIndex = AddScore.wTurnIndex;
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        this.m_wCurrentUser = AddScore.wCurrentUser;
        var cbLastIndex = this.m_cbFllowIndex;
        this.m_cbFllowIndex = AddScore.AddScoreInfo.cbFllowIndex;
        this.m_lAddScoreArr = clone(AddScore.AddScoreInfo.llCanAddScore);
        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_lUserTableScore[i] = AddScore.llUserTableScore[i];
        }
        if(true) {//非比牌下注
            //操作提示
            var BaseAdd = this.m_lCurrentAddScore;
            if( this.m_UserLookCard[AddScore.wAddScoreUser] ) BaseAdd *= 2;
            this.PlayActionSound(AddScore.wAddScoreUser, this.m_cbFllowIndex>cbLastIndex?1:0);
        }

        //显示UI
        this.UpdateOpView();
       
        if(this.m_ReplayMode) return
        //动画
        this.m_GameClientView.UserAddJet(AddScore.llAddScoreCount,this.SwitchViewChairID(AddScore.wAddScoreUser));
        return true;
    },

    OnSubUserCompare :function (pData, wDataSize) {
        var pCompare = GameDef.CMD_S_CompareCard();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pCompare, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        var UserArr = new Array();
        for(var i in pCompare.wCompareUser){
            UserArr[i] = this.SwitchViewChairID(pCompare.wCompareUser[i])
        }

        var wLostView = this.SwitchViewChairID(pCompare.wLostUser)
        this.m_GameClientView.m_CompareCtrl.SetAct(UserArr,wLostView);

        this.PlayActionSound(pCompare.wCompareUser[0], 4);
        //if(!this.m_ReplayMode) cc.gSoundRes.PlayGameSound('PK');

        var CardBack = new Array();
        for (var i = 0; i < 3; i++) {
            CardBack[i] = 0xff;
        }

        for(var i in pCompare.wCompareUser){
            var wtagUser = pCompare.wCompareUser[i];
            var bMySelf_Look =(this.m_UserLookCard[wtagUser]&&this.GetMeChairID() == wtagUser&&!this.IsLookonMode())
            var cbCardType = bMySelf_Look?pCompare.cbCardType[i]:null;
            var cbCardData = bMySelf_Look? clone(pCompare.cbCardData[wtagUser]):clone(CardBack);
            this.m_GameClientView.SetPKCardData(i,cbCardData,GameDef.MAX_COUNT,cbCardType);
        }

        //显示按钮
        this.m_wCurrentUser = INVALID_CHAIR;
        this.UpdateOpView();

        return true;
    },
    OnSubCompareFinish :function (pData, wDataSize) {
        var pCompareFinish = GameDef.CMD_S_CompareFinish();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pCompareFinish, pData)) return false;
        this.m_GameClientView.m_CompareCtrl.HideView();
        this.m_GameClientView.m_ComCardType[0].active = false;
        this.m_GameClientView.m_ComCardType[1].active = false;
        this.m_wCurrentUser = pCompareFinish.wCurrentUser;
        this.m_wTurnIndex = pCompareFinish.wTurnIndex;
        this.m_cbFllowIndex = pCompareFinish.AddScoreInfo.cbFllowIndex;
        this.m_lAddScoreArr = clone(pCompareFinish.AddScoreInfo.llCanAddScore);
        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_lUserTableScore[i] = pCompareFinish.llUserTableScore[i];
        }
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        //显示按钮
        this.UpdateOpView();
        
        return true;
    },
    OnSubLookCard:function (pData, wDataSize) {
        var pLook = GameDef.CMD_S_LookCard();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pLook, pData)) return false;
        this.m_GameClientView.OnUserLookCard(this.SwitchViewChairID(pLook.wLookCardUser), pLook.cbCardData);
        this.PlayActionSound(pLook.wLookCardUser, 2);
        if(pLook.wLookCardUser == this.GetMeChairID()) this.m_GameClientView.ShowCallUI(0);
        this.m_UserLookCard[pLook.wLookCardUser] = 1;
        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_lUserTableScore[i] = pLook.llUserTableScore[i];
        }
        
        return true;
    },
    OnSubGuZhuYiZhi:function(pData, wDataSize){
        var pGuZhu = GameDef.CMD_S_GuZhuYiZhi();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pGuZhu, pData)) return false;

        this.m_GameClientView.PlayGuZhuYiZhi();
        this.m_wCurrentUser = pGuZhu.wCurrentUser;
        this.scheduleOnce(function(){
            this.UpdateOpView();
        }.bind(this),2);
        return true;
    },
    OnSubShowStartCtrl:function () {
        return true;
    },

    OnSubUserReady :function (pData, wDataSize) {
        var ReadyState = GameDef.CMD_S_ReadyState();
        //效验
        if (wDataSize != gCByte.Bytes2Str(ReadyState , pData)) return false;
        this.m_GameClientView.SetUserState(INVALID_CHAIR);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var pUserItem = this.GetClientUserItem(i);
            if(pUserItem == null || pUserItem == 0)continue;
            var ViewID = this.SwitchViewChairID(i);
            if(ReadyState.cbReadyStatus[i]) {
                this.m_GameClientView.SetUserState(ViewID, 'Ready');
                if(!this.m_UserReady[i])this.PlayActionSound(i, "READY");
                this.m_UserReady[i] = ReadyState.cbReadyStatus[i];
            }
        }

        if(ReadyState.cbReadyStatus[this.GetMeChairID()]) this.OnMessageStart(null,true);
        return true;
    },
    //用户放弃
    OnSubPassCard :function (pData, wDataSize) {
        var pPassCard = GameDef.CMD_S_GiveUp();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pPassCard, pData)) return false;
        this.m_GameClientView.HideAllGameButton();
        //设置变量
        this.m_wTurnIndex = pPassCard.wTurnIndex;
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        this.m_wCurrentUser = pPassCard.wCurrentUser;
        this.m_cbFllowIndex = pPassCard.AddScoreInfo.cbFllowIndex;
        this.m_lAddScoreArr = clone(pPassCard.AddScoreInfo.llCanAddScore);

        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_lUserTableScore[i] = pPassCard.llUserTableScore[i];
        }
        var wGUView = this.SwitchViewChairID(pPassCard.wGiveUpUser)
        this.m_GameClientView.m_UserCardControl[wGUView].SetGiveUp();
        this.m_GameClientView.HideUserLookCard(wGUView);
        this.m_GameClientView.OnUserGiveUp(wGUView);
        this.m_GameClientView.m_UserPlay[wGUView] = false;
        //播放声音
        this.PlayActionSound(pPassCard.wGiveUpUser, 3);

        this.m_GameClientView.m_AddNode.active = false;

        if (this.m_wCurrentUser == INVALID_CHAIR) return true;

        this.UpdateOpView();
        
        return true;
    },

    //游戏结束
    OnSubGameConclude :function (pData, wDataSize) {
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;

        //设置状态
        var kernel = gClientKernel.get();
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.ShowCallUI(0, true);
        //删除时间
        this.KillGameClock();

        //设置定时
        if(this.m_ReplayMode)
            this.OnTimeIDI_PERFORM_END()
        else
            this.schedule(this.OnTimeIDI_PERFORM_END, 1);


            this.m_GameClientView.m_AddNode.active = false;
        return true;
    },
    //执行结束
    OnTimeIDI_PERFORM_END :function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);

        //小结算界面
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var card = this.m_GameEnd.cbCardData.splice(0, GameDef.MAX_COUNT);
            //展示手牌
            if( this.m_GameEnd.llGameScore[i] == 0) continue;
            var ViewID = this.m_wViewChairID[i];
            if(this.m_GameEnd.bCompareRelation[this.m_wMeChairID][i]||this.m_wMeChairID==i){//这个用户和自己比过牌 显示牌值
                if(card[0] != 0) this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(card, GameDef.MAX_COUNT);
                if( this.m_GameEnd.byCardType[i])this.m_GameClientView.SetCardType(ViewID,  this.m_GameEnd.byCardType[i]);
            }
            else
                this.m_GameClientView.m_UserCardControl[ViewID].SetCardData([0,0,0], GameDef.MAX_COUNT);


            //显示分数
            this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.llGameScore[i]);
        }

        //播放结束声音
        cc.gSoundRes.PlayGameSound(this.m_GameEnd.llGameScore[this.m_wMeChairID]>=0?'GAME_WIN':'GAME_OVER');
        //筹码动画
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var ViewID = this.m_wViewChairID[i];
            if(this.m_GameEnd.llGameScore[i] > 0) this.m_GameClientView.EndUserGetJet(ViewID);
        }
        if(!this.m_ReplayMode){
            this.schedule(this.OnTimeIDI_READY,1)
            this.m_GameClientView.m_BtStart.active = true;
        }
    },

    OnTimeIDI_READY:function(){
        this.unschedule(this.OnTimeIDI_READY);
        if(this.m_RoomEnd == null){
           
        }else{
           this.ShowEndView(); 
        }

        return true;
    },

    UpdateOpView:function(CountDown){
        this.KillGameClock();

        //显示按钮
        var OtherTurn = true;
        var kernel = gClientKernel.get();
        if (this.m_wCurrentUser == this.GetMeChairID()) OtherTurn = null;
        this.m_GameClientView.ShowCallUI(0, OtherTurn);

        //设置时间
        if (this.m_wCurrentUser != INVALID_CHAIR) {
            this.m_TipsMusic = false;
            this.SetGameClock(this.m_wCurrentUser ,IDI_CALL_SCORE, CountDown!=null?CountDown:TIME_CALL_SCORE);
        }
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
            this.ShowEndView();
        }else{
            this.ShowAlert("该房间已被解散！", Alert_Yes, function(Res) {
                this.m_pTableScene.ExitGame();
            }.bind(this));
        }

        return true;
    },


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

    //开始消息
    OnMessageStart :function (wParam, lParam) {
        /*var state = new Array(true,true,true,true,true,true)
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(GameDef.MAX_COUNT, 0, state);
        return*/
        //删除时间
        this.KillGameClock();

        for(var i=0;i<GameDef.GAME_PLAYER;i++) this.m_UserLookCard[i] = 0;
        //设置界面
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);

        this.m_GameClientView.SetTurnCount();

        this.m_GameClientView.m_BtStart.active = false;

        //发送消息
        //if(!lParam)this.SendFrameData(SUB_GF_USER_READY);
        if(!lParam) this.SendGameData(GameDef.SUB_C_READY);

        return 0;
    },


    //PASS消息
    OnMessagePassCard :function (wParam, lParam) {
        //删除时间
        this.KillGameClock();

        //设置变量
        this.m_wCurrentUser = INVALID_CHAIR;

        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.ShowCallUI(0, true);

        //发送数据
        this.SendGameData(GameDef.SUB_C_GIVE_UP);

        return 0;
    },

    //叫分消息
    OnMessageCallScore :function (Tag, Data) {
        //删除时间
        this.KillGameClock();
        this.m_GameClientView.HideAllGameButton();
        //设置界面
        this.m_GameClientView.ShowCallUI(0, true);
        //首次跟默认加1

        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.llAddScore = parseInt(Data);
        if(parseInt(Data)==0) CallScore.llAddScore = this.m_cbFllowIndex;
        // if(CallScore.llAddScore>0){
        //     CallScore.llAddScore = this.m_GameClientView.m_lAdd[CallScore.llAddScore-1];//将加注数量传过去
        // }
        this.SendGameData(GameDef.SUB_C_ADD_SCORE, CallScore);

        this.m_GameClientView.m_AddNode.active = false;
        this.m_GameClientView.m_AddNodeArr[0].interactable = true;
        this.m_GameClientView.m_AddNodeArr[1].interactable = true;
        this.m_GameClientView.m_AddNodeArr[2].interactable = true;

        return 0;
    },
    OnMessageCompare:function (wViewChairID) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.ShowCallUI(0, true);
        var wCompareUser = INVALID_CHAIR;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.SwitchViewChairID(i) == wViewChairID) wCompareUser = i;
        }
        if(wCompareUser == INVALID_CHAIR) return this.ShowTips('可比牌用户错误！');
        //发送数据
        var pCompare = GameDef.CMD_C_CompareCard();
        pCompare.wCompareUser = wCompareUser;
        this.SendGameData(GameDef.SUB_C_COMPARE_CARD, pCompare);

        return 0;
    },
    OnMessageLookCard:function (wChairID) {
        //发送数据
        this.SendGameData(GameDef.SUB_C_LOOK_CARD);
        return 0;
    },
    OnMessageCtrlStart :function () {
        //发送数据
        this.SendGameData(GameDef.SUB_C_START);
    },
    //邀请好友分享
    OnFriend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },
    //发牌完成
    OnMessageDispatchFinish :function (wViewID, CardIndex, ActCard) {
        if(!this.m_GameClientView.m_UserPlay[wViewID]) return ;
        //发牌过程
        this.m_GameClientView.m_UserCardControl[wViewID].SetCardData([0,0,0], CardIndex+1);
        if(ActCard) return;
        //显示按钮
        this.UpdateOpView();

        return 0;
    },

    //设置信息
    SetViewRoomInfo:function ( dwServerRules , dwRulesArr){
        this.m_wGameCount = GameDef.GetGameCount(dwServerRules , dwRulesArr);
        this.m_GameClientView.SetViewRoomInfo(dwServerRules , dwRulesArr);
    },
    OnClearScene:function (){
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);
        this.m_GameClientView.SetTurnCount();
        this.m_GameClientView.SetCellScore(1);
        this.m_GameClientView.m_CompareCtrl.HideView();
        this.$('LookOnNode/BtCtrlStart').active = false;
        for(var i=0;i<GameDef.GAME_PLAYER;i++) this.m_UserLookCard[i] = 0;
        if(!this.m_ReplayMode) this.m_GameClientView.InitUserJet();
    },
});
