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

            ['3FEN', 'jiazhu/3fen'],
            ['6FEN', 'jiazhu/6fen'],
            ['9FEN', 'jiazhu/9fen'],
            ['GENZHU', 'jiazhu/genzhu'],
            ['FANTI', 'jiazhu/fanti'],

            ['PIAO0', 'piao/piao0'],
            ['PIAO1', 'piao/piao1'],
            ['PIAO2', 'piao/piao2'],
            ['PIAO3', 'piao/piao3'],
            ['PIAO4', 'piao/piao4'],
            ['PIAO5', 'piao/piao5'],
            ['PIAO6', 'piao/piao6'],
        );
        //出牌声音
        for(var i=0;i<5;++i){
            this.m_SoundArr[this.m_SoundArr.length] = ['M_'+i,'act_m'+i];//+'.mp3'
            this.m_SoundArr[this.m_SoundArr.length] = ['W_'+i,'act_w'+i];
        }
          //短语声音
        for(var i=1;i<=7;++i){
            var FileName = i<10?'0'+i:i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/phrase/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/phrase/'+FileName];
        }

        this.m_szText = new Array(
            '今天手气很好',
            '一个都不要走，决战到天亮',
            '下手请留情',
            '我可以笑吗',
            '我这手牌很大',
            '你吓到我了',
            '神一样的队友'
        );
        //游戏变量
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_lCurrentAddScore = 0;
        this.m_wTurnIndex = 0;
        this.m_UserReady = new Array();
        this.m_UserLookCard = new Array();
        this.m_cbHandCard = new Array();
        this.m_AddScore = 0;
        this.m_showAdd = false;
        for(var i =0; i<6;i++){
            this.m_cbHandCard[i] = new Array();
        }
        this.m_CardCnt = new Array();
        
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
            case GameDef.SUB_S_NEXT_READY:		//用户出牌
                {
                    return this.OnSubNextReady(pData, wDataSize);
                }
            case GameDef.SUB_S_START_CTRL:	//游戏结束
                {
                    return this.OnSubShowStartCtrl(pData, wDataSize);
                } 
            case GameDef.SUB_S_USER_READY:	//游戏结束
                {
                    return this.OnSubUserReady(pData, wDataSize);
                } 
            case GameDef.SUB_S_SEND_CARD:
                {
                    return this.OnSubSendCard(pData, wDataSize);
                }
            case GameDef.SUB_S_CHOOSE_PIAO:
            {
                return this.OnSubChoosePiao(pData, wDataSize);
            }
        }
        return false;
    },

    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if(LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
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
                            if( !this.m_ReplayMode ) this.m_GameClientView.m_btStart.node.active = true;
                            if( !this.m_ReplayMode ) this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, pStatusFree.dwCountDown);
                        }
                    } 
                    if (this.m_dwRoomID != 0 &&  this.m_wGameProgress == 0 && !this.m_ReplayMode) this.m_GameClientView.m_btFirend.node.active = true;
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
                    this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
                    this.m_lCurrentAddScore = pStatusPlay.llCurrentAddScore;
                    this.m_GameClientView.SetCellScore(pStatusPlay.llBaseScore);
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(pStatusPlay.wBankerUser));
                    this.m_AddScore = pStatusPlay.llAddScore;
                    this.m_showAdd = pStatusPlay.bIsAdd;

                    //if(this.m_wCurrentUser == INVALID_CHAIR) return true;

                    for(var i = 0; i < GameDef.GAME_PLAYER; i++){
                        var ViewID = this.SwitchViewChairID(i)
                        this.m_GameClientView.m_UserPlay[ViewID] = pStatusPlay.cbPlayStatus[i];
                        //筹码
                        this.m_GameClientView.UserAddJet(pStatusPlay.llTableScore[i], ViewID);

                        this.m_CardCnt[i] = pStatusPlay.cbCnt;
                        //扑克
                        if(pStatusPlay.llTableScore[i]) {
                            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData([0,pStatusPlay.cbHandCardData[i][1],pStatusPlay.cbHandCardData[i][2]], pStatusPlay.cbCnt);
                            if(pStatusPlay.cbGiveUpUser[i])  this.m_GameClientView.m_UserCardControl[ViewID].SetGiveUp();
                            else if(!pStatusPlay.cbPlayStatus[i]) this.m_GameClientView.m_UserCardControl[ViewID].SetLose();
                        }
                    }
                    if(pStatusPlay.bIsPiao){
                        if(this.m_wCurrentUser==this.GetMeChairID()){
                            this.m_GameClientView.ShowCallUI(4,null);
                        }else{
                            this.m_GameClientView.ShowCallUI(4,1);
                        }
                    }
                    else{
                        this.UpdateOpView( pStatusPlay.dwCountDown);
                    }
                
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
                        this.m_GameClientView.m_btStart.active = false;
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
            case IDI_CALL_SCORE:
                {
                    //自动处理
                    //if (CountDown <= 0 && (this.m_dwRules & GameDef.GAME_TYPE_90_PASS)||this.m_dwRoomID == 0) 
                    //    this.OnMessagePassCard();
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
        this.m_showAdd = false;

        this.m_GameClientView.HideAllGameButton();
        //隐藏成绩界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.m_btFirend.node.active = false;
        this.m_GameClientView.m_NdCtrlStart.active = false;
        this.OnMessageStart(null,true);

        //游戏变量
        this.m_wCurrentUser = this.m_GameStart.wCurrentUser;
        this.m_wFirstUser = this.m_wCurrentUser;
        this.m_lCurrentAddScore = this.m_GameStart.llBaseScore;
        this.m_wTurnIndex = 1;
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        this.m_AddScore = 0;
        //界面
        var wBankerView = this.SwitchViewChairID(this.m_GameStart.wBankerUser);
        this.m_GameClientView.SetBankerUser(wBankerView);
        this.m_GameClientView.SetCellScore(this.m_GameStart.llBaseScore);

        //回放
        if(this.m_ReplayMode) return this.UpdateOpView();

        //下注
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_CardCnt[i] = 0;
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserPlay[ViewID] = this.m_GameStart.cbPlayStatus[i];
            if( !this.m_GameStart.cbPlayStatus[i] ) continue;
            for(var j = 0; j < GameDef.MAX_COUNT; j++){
                this.m_cbHandCard[i][j] = this.m_GameStart.cbHandCardData[i][j];
            }
            this.m_GameClientView.setUserScore(ViewID,this.m_GameStart.llUserScore[i]);
        }
        
        this.m_GameClientView.SetTableScore(this.m_GameStart.llAddScoreCount);
        
        //发牌动画
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(2, this.SwitchViewChairID(this.m_GameStart.wCurrentUser), this.m_GameClientView.m_UserPlay);

        return true;
    },
    
    OnSubAddScore :function (pData, wDataSize) {
        var AddScore = GameDef.CMD_S_AddScore();

        //效验
        if (wDataSize != gCByte.Bytes2Str(AddScore, pData)) return false;
        if(AddScore.wAddScoreUser == this.GetMeChairID()) this.m_GameClientView.HideAllGameButton();
        this.m_wTurnIndex = AddScore.wTurnIndex;
        this.m_GameClientView.SetTurnCount(this.m_wTurnIndex);
        this.m_wCurrentUser = AddScore.wCurrentUser;
        var wViewID = this.SwitchViewChairID(AddScore.wAddScoreUser);
        this.m_GameClientView.SetTableScore(AddScore.llAddScoreCount);
        this.m_lCurrentAddScore = AddScore.llCurrentAddScore;
        
        this.m_AddScore = this.m_lCurrentAddScore;
        this.m_GameClientView.setUserScore(wViewID,AddScore.llUserScore);
        this.m_showAdd = AddScore.bIsAdd;

        //if (GameDef.MYSELF_VIEW_ID == wViewID)
        {
            // 0:跟注 2:加注 1:反踢
            let byAction = null;
            if (0 == AddScore.cbOpType) byAction = 'GENZHU';
            else if (1 == AddScore.cbOpType) byAction = 'FANTI';
            else {
                AddScore.cbOpType -= 1;
                if ((3 == AddScore.cbOpType) || (6 == AddScore.cbOpType) || (9 == AddScore.cbOpType)) {
                    byAction = AddScore.cbOpType + 'FEN';
                }
            }
            if (byAction) {
                cc.gSoundRes.PlayGameSound(byAction);
            }
        }

        //显示UI
        this.UpdateOpView();
        return true;
    },
    OnSubChoosePiao:function(pData, wDataSize){
        var Cmd = GameDef.CMD_S_PIAO();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;

        if(Cmd.wChairID==this.GetMeChairID()){
            this.m_GameClientView.ShowCallUI(4,null);
        }else{
            this.m_GameClientView.ShowCallUI(4,1);
        }
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


        this.PlayActionSound(pCompare.wCompareUser[0], 4);
        //if(!this.m_ReplayMode) cc.gSoundRes.PlayGameSound('PK');

        //显示按钮
        this.m_wCurrentUser = INVALID_CHAIR;
        this.UpdateOpView();
        
        return true;
    },
    OnSubCompareFinish :function (pData, wDataSize) {
        var pCompareFinish = GameDef.CMD_S_CompareFinish();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(pCompareFinish, pData)) return false;

        this.m_wCurrentUser = pCompareFinish.wCurrentUser;
        this.m_wTurnIndex = pCompareFinish.wTurnIndex;
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
        return true;
    },
    OnSubNextReady:function (pData, wDataSize) {

        this.m_GameClientView.HideAllGameButton();

        if(this.m_RoomEnd == null){
            this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_START);
            this.m_GameClientView.m_btStart.node.active = true;
        }else{
            this.ShowEndView();
        }

        return true;
    },
    OnSubShowStartCtrl:function () {
        this.m_GameClientView.m_NdCtrlStart.active = true;
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

        this.m_GameClientView.HideAllGameButton();

        if(ReadyState.cbReadyStatus[this.GetMeChairID()]) this.OnMessageStart(null,true);
        return true;
    },

    OnSubSendCard:function (pData, wDataSize) {
        var SendCard = GameDef.CMD_S_SENDCARD();
        //效验
        if (wDataSize != gCByte.Bytes2Str(SendCard , pData)) return false;
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_UserPlay[ViewID] = SendCard.cbPlayStatus[i];

            for(var j = 0; j < GameDef.MAX_COUNT; j++){
                this.m_cbHandCard[i][j] = SendCard.cbHandCardData[i][j];
            }
        }
        this.m_wCurrentUser = SendCard.wFirstUser;

        this.m_AddScore = 0;
        this.m_showAdd = false;

        this.m_GameClientView.ShowCallUI(4, false);
        this.m_GameClientView.HideAllGameButton();
        if(SendCard.cbPiao==1) {
            this.m_GameClientView.ShowTouzZi(SendCard.cbDice);
            this.scheduleOnce(function(){this.UpdateOpView();},6);
        }
        else {
            this.m_GameClientView.m_SendCardCtrl.PlaySendCard(1, this.SwitchViewChairID(SendCard.wFirstUser),this.m_GameClientView.m_UserPlay);
            //OnMessageDispatchFinish
        }

        var wViewID = this.SwitchViewChairID(SendCard.wFirstUser);
        //if (GameDef.MYSELF_VIEW_ID == wViewID)
        {
            cc.gSoundRes.PlayGameSound('PIAO'+SendCard.cbDice);
        }

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
        this.m_lCurrentAddScore = pPassCard.llCurrentAddScore;
        this.m_wCurrentUser = pPassCard.wCurrentUser;
        var wGUView = this.SwitchViewChairID(pPassCard.wGiveUpUser)
        this.m_GameClientView.m_UserCardControl[wGUView].SetGiveUp();
        this.m_GameClientView.HideUserLookCard(wGUView);
        this.m_GameClientView.m_UserPlay[wGUView] = false;
        //播放声音
        this.PlayActionSound(pPassCard.wGiveUpUser, 3);

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
        //this.m_GameClientView.ShowCallUI(0, true);
        //删除时间
        this.KillGameClock();

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

        if (!this.m_GameEnd)return ;
        //小结算界面
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var card = this.m_GameEnd.cbCardData.splice(0, GameDef.MAX_COUNT);
            //展示手牌
            var ViewID = this.SwitchViewChairID(i);
            if(card[0] != 0) this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(card, GameDef.MAX_COUNT);
            //显示分数
            if(this.m_GameEnd.llGameScore[i]>0)this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.llGameScore[i]);
            if( this.m_GameEnd.cbCardValue[i])this.m_GameClientView.SetCardScore(ViewID,  this.m_GameEnd.cbCardValue[i]);
            if( this.m_GameEnd.cbCardType[i])this.m_GameClientView.SetCardType(ViewID,  this.m_GameEnd.cbCardType[i]);
        }
    
    },

    UpdateOpView:function(CountDown){
        //显示按钮
        var OtherTurn = true;
        if (this.m_wCurrentUser == this.GetMeChairID()) OtherTurn = null;
        this.m_GameClientView.ShowCallUI(0, OtherTurn);

        this.KillGameClock();
        //设置时间
        if (this.m_wCurrentUser != INVALID_CHAIR) {
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

    OnGameIDI_PERFORM_START :function () {
        //删除定时器
        this.unschedule(this.OnGameIDI_PERFORM_START);
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
        this.m_GameClientView.SetCardScore(INVALID_CHAIR);
        this.m_GameClientView.SetTurnCount();
    
        this.m_GameClientView.m_btStart.node.active = false;

        //发送消息
        //if(!lParam)this.SendFrameData(SUB_GF_USER_READY);
        if(!lParam) this.SendGameData(GameDef.SUB_C_READY);
        return 0;
    },
    OnMessagePiao:function(piao){
        var Cmd = GameDef.CMD_C_Piao();
        Cmd.bIsPiao = piao;
        this.SendGameData(GameDef.SUB_C_CHOOSE_PIAO, Cmd);

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
    OnMessageCallScore :function (callScore) {
        //删除时间
        this.KillGameClock();

        this.m_GameClientView.HideAllGameButton();
        //设置界面
        this.m_GameClientView.ShowCallUI(0, true);
        //首次跟默认加1
    
        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.llAddScore = parseInt(callScore);
        this.SendGameData(GameDef.SUB_C_ADD_SCORE, CallScore);

        return 0;
    },
    OnMessageCompare:function (wChairID) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.ShowCallUI(0, true);

        //发送数据
        var pCompare = GameDef.CMD_C_CompareCard();
        pCompare.wCompareUser = parseInt(wChairID);
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

    getViewToChair:function(wViewID){
        for(var i =0; i < GameDef.GAME_PLAYER;i++){
            if(this.SwitchViewChairID(i)==wViewID) return i;
        }
    },
    //发牌完成
    OnMessageDispatchFinish :function (wViewID, CardIndex, ActCard) {
        //发牌过程
        var Chair = this.getViewToChair(wViewID);
        this.m_CardCnt[Chair]++;

        if (this.m_cbHandCard[Chair] && (3 <= this.m_cbHandCard[Chair].length)) {
            if(wViewID==GameDef.MYSELF_VIEW_ID){
                this.m_GameClientView.m_UserCardControl[wViewID].SetCardData(
                    [this.m_cbHandCard[Chair][0],this.m_cbHandCard[Chair][1],this.m_cbHandCard[Chair][2]], this.m_CardCnt[Chair]);
            }else{
                this.m_GameClientView.m_UserCardControl[wViewID].SetCardData(
                    [0,this.m_cbHandCard[Chair][1],this.m_cbHandCard[Chair][2]], this.m_CardCnt[Chair]);
            }
        }
        if(ActCard) return;
        //显示按钮
        this.UpdateOpView();
    
        return 0;
    },

    //设置信息
    SetViewRoomInfo:function (dwServerRules,dwRulesArr){
        this.m_dwServerRules = dwServerRules;
        this.m_wGameCount = GameDef.GetGameCount(this.m_dwServerRules,this.m_dwRulesArr);
        this.m_GameClientView.SetViewRoomInfo(dwServerRules,dwRulesArr);
        this.m_rules = dwRulesArr[0];
        
    },
    OnClearScene:function (){
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);
        this.m_GameClientView.SetTurnCount();
        this.m_GameClientView.SetCellScore(1);
        this.m_GameClientView.m_NdCtrlStart.active = false;
        for(var i=0;i<GameDef.GAME_PLAYER;i++) this.m_UserLookCard[i] = 0;
        if(!this.m_ReplayMode) this.m_GameClientView.InitUserJet();
    },
});
