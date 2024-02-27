//游戏时间
var IDI_GAME_CLOCK = 201;					//叫分定时器

//游戏时间
var TIME_CLOCK = 10;

cc.Class({
    extends: cc.GameEngine,

    properties: {},

    // use this for initialization
    // start :function () {},

    ctor :function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'],//.mp3
            ['BANKER', 'Banker'],//.mp3
            ['CLOCK', 'CountDown'],//.mp3
            ['WIN', 'Win'],//.mp3
            ['LOSE', 'Lose'],//.mp3
            //男
            ['M_READY', 'm/zhunbei'],
            //女
            ['W_READY', 'w/zhunbei'],
            ['Jet', 'chip3'],
            ['shaizi', 'shaizi'],
        );
        //短语声音
        for(var i=0;i<=17;++i){
            this.m_SoundArr[this.m_SoundArr.length] = ['M_'+i,'m/type/'+i];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_'+i,'w/type/'+i];
        }
        //短语声音
        for(var i=1;i<=6;++i){
            var FileName = (i<10?'0':'')+i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/phrase/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/phrase/'+FileName];
        }
        this.m_SoundArr[this.m_SoundArr.length] = ['type0','cardtype/type0'];
        for(var i = 17;i<146;i++){
            if(i>24 && i<33) continue;
            if(i>41 && i<49) continue;
            if(i>57 && i<65) continue;
            if(i==70) continue;
            if(i>73 && i<81) continue;
            if(i>89 && i<97) continue;
            if(i==100) continue;
            if(i>105 && i<114) continue;
            if(i>121 && i<128) continue;
            this.m_SoundArr[this.m_SoundArr.length] = ['type'+i,'cardtype/type'+i];
        }

        this.m_szText = new Array(
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
        this.m_lBankerTimes = 0;
        this.m_cbOperatrStatus = 8;
        this.m_cbCardData = new Array();
        this.m_cbOpenCardData = new Array();
        this.m_cbCardCount = new Array();
        this.m_cbOpenCard = new Array();
        this.m_UserState = new Array();
        this.m_UserAddScore = new Array();
        this.m_UserTimesBank = new Array();
        this.m_UserReady = new Array();
        this.m_PaiCard = new Array();

        this.m_GameMode = 0;//0积分 1金币
        this.m_bNeedShowCard = true;
        this.m_bLookonUser = 0;
        this.m_CallBank =0;
        this.m_dwRules =0;
        this.m_ServerRules = 0;
        this.m_dwAllRules = new Array();

        this.m_bIsShowEnd = 0;
        this.m_bIsFirst = false;
        this.m_bIsClub = 0;
        this.m_nTime = 3;
        return;
    },

    //网络消息
    OnEventGameMessage :function (wSubCmdID, pData, wDataSize) {

        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START:	    //游戏开始
                {
                    return this.OnSubGameStart(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_BANKER:		//用户叫分
                {
                    return this.OnSubCallBanker(pData, wDataSize);
                }
            case GameDef.SUB_S_DI_GUO:
                {
                    return this.OnSubDiGuo(pData, wDataSize);
                }
            case GameDef.SUB_S_CALL_PLAYER:		//用户放弃
                {
                    return this.OnSubCallPlayer(pData, wDataSize);
                }
            case GameDef.SUB_S_ADD_SCORE:		//用户下注
                {
                    return this.OnSubAddScore(pData, wDataSize);
                }
            case GameDef.SUB_S_SEND_CARD:
                {
                    return this.OnSubShowCard(pData, wDataSize);
                }
             case GameDef.SUB_S_QIEGUO:
                {
                    return this.OnSubQieGuo(pData, wDataSize);
                }
            case GameDef.SUB_S_NOTIFY_CARD:
                {
                    return this.OnSubGameNotify(pData, wDataSize);
                }
            case GameDef.SUB_S_GAME_END:	//游戏结束
                {
                    return this.OnSubGameConclude(pData, wDataSize);
                }
            case GameDef.SUB_S_OPEN_CARD:		//用户比牌
                {
                    return this.OnSubOpenCard(pData, wDataSize);
                }
            case GameDef.SUB_S_START_CTRL:	//
                {
                    return this.OnSubShowStartCtrl(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_READY:	//准备
                {
                    return this.OnSubUserReady(pData, wDataSize);
                }
            case GameDef.SUB_S_LITTLE:
                {
                    return this.OnSubShowLittle(pData, wDataSize);
                }
            case GameDef.SUB_S_OPERATE:
                {
                    return this.OnSubShowAdd(pData, wDataSize);
                }
            case GameDef.SUB_S_CHEAT_CARD:	
                {
                    return this.OnSubCheatCard(pData, wDataSize);
                } 
        }
        return false;
    },

    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        //if(window.LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)

        switch (cbGameStatus) {
            case GameDef.GS_TK_FREE:	//空闲状态
                {
                    this.m_GameClientView.node.stopAllActions();
                    console.log("getNumberOfRunningActions",this.m_GameClientView.node.getNumberOfRunningActions());

                    if(this.m_ReplayMode) this.m_GameClientView.start();
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    this.m_lBaseScore = pStatusFree.llBaseScore;

                    this.m_bIsFirst = pStatusFree.bIsFirst;
                    this.m_bLookonUser = bLookonUser;
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (!bLookonUser && !this.m_ReplayMode) {
                        //开始设置
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            if( !this.m_ReplayMode ) this.m_GameClientView.m_btStart.node.active = true;
                            if( !this.m_ReplayMode ) this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, pStatusFree.dwCountDown);
                        }
                    }
                    //if (this.m_dwRoomID != 0 &&  this.m_wGameProgress == 0 && !this.m_ReplayMode) this.m_GameClientView.m_btFirend.node.active = true;
                    this.m_bIsClub = pStatusFree.bIsClub;

                    this.m_GameClientView.SetNumOfGame(pStatusFree.nNumGame);
                    return true;
                }
            case GameDef.GS_TK_PLAYING:	//游戏状态
                {
                    
                    this.m_GameClientView.node.stopAllActions();
                    console.log("getNumberOfRunningActions",this.m_GameClientView.node.getNumberOfRunningActions());

                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    var bytesize = gCByte.Bytes2Str(pStatusPlay, pData);
                    console.log("GS_TK_PLAYING",wDataSize,bytesize);

                    if (wDataSize != bytesize) return false;
                    this.m_bLookonUser = bLookonUser;
                    this.m_GameClientView.m_BtFriend.active = false;
                    this.m_wBankerUser = pStatusPlay.wBankerUser;


                    this.m_cbOperatrStatus = pStatusPlay.cbenOperaStatus;
                    this.m_bIsFirst = pStatusPlay.bIsFirst;

                    this.count = pStatusPlay.nCount;

                    for(var i=0;i<GameDef.GAME_PLAYER;i++){
                        this.m_UserState[i] = pStatusPlay.cbPlayStatus[i];
                        this.m_cbOpenCard[i] = pStatusPlay.bIsOpen[i];
                        this.m_UserTimesBank[i] = pStatusPlay.cbRobeTimes[i];
                        this.m_UserAddScore[i] = pStatusPlay.lBetScore[i];
                        this.m_cbCardData[i] = pStatusPlay.cbHandCardData[i];
                        this.m_cbOpenCardData[i] = pStatusPlay.cbOpenHandCardData[i];

                        if( this.m_UserState[i]){
                            var ViewID = this.SwitchViewChairID(i);
                            this.m_GameClientView.SetUserTableScore(ViewID,this.m_UserAddScore[i]);
                        }


                    }

                    this.m_bIsClub = pStatusPlay.bIsClub;
                    this.m_lBankerTimes = pStatusPlay.lDiGuo;
                    var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
                    this.m_GameClientView.SetBankerUser(BankerView, this.m_lBankerTimes);
                    this.OnButtonShow(this.m_cbOperatrStatus,null);
                    this.m_GameClientView.SetNumOfGame(pStatusPlay.nNumGame);

                    return true;
                }
        }

        return false;
    },

    SetGameClock :function (wChairID, nTimerID, nElapse) {
        this.m_GameClientView.SetUserTimer(wChairID, nElapse, 1);
        if( this.m_ReplayMode ) return
        g_TimerEngine.SetGameTimer(wChairID, nTimerID, nElapse*1000, null, this, 'OnTimerMessage');
    },

    //删除定时器
    KillGameClock :function () {
        this.m_GameClientView.SetUserTimer(INVALID_CHAIR);
        g_TimerEngine.KillGameTimer();
        return true;
    },

    //时间消息
    OnTimerMessage :function (wChairID, CountDown, nTimerID, Progress) {
        var nElapse = parseInt(CountDown/1000) + 1;
        if(CountDown == 0) nElapse = null;

        if(this.m_nElapse == null || this.m_nElapse != nElapse){
            this.m_nElapse = nElapse;
            if( this.m_nElapse <= 5 && this.m_nElapse > 0) cc.gSoundRes.PlayGameSound("CLOCK");
        }

        this.m_GameClientView.SetUserTimer(wChairID, nElapse, Progress);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;

        return true;
    },

    //游戏开始
    OnSubGameStart :function (pData, wDataSize) {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetGameEngine(this);
        //效验
        console.log("START",wDataSize,gCByte.Bytes2Str(this.m_GameStart,pData));

        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart,pData)) return false;
        this.m_GameEnd = null;

        //隐藏成绩界面
        this.KillGameClock();
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.SetUserTableScore(INVALID_CHAIR);

        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_NdCtrlStart.active = false;
        this.OnMessageStart(null, true);
        if(this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode)this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode.active = false;

        this.m_nTime = 3;

        //界面
        this.m_wBankerUser = this.m_GameStart.wBankUser;
        this.m_cbOperatrStatus = this.m_GameStart.cbOperatrStatus;
        this.m_lBankerTimes = this.m_GameStart.ldiGuo;
        var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(BankerView, this.m_lBankerTimes);
        this.m_GameClientView.SetNumOfGame(this.m_GameStart.nNumGame);

        this.m_bIsFirst = this.m_GameStart.bIsFirst;

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserState[i] = this.m_GameStart.cbPlayStatus[i];
            this.m_cbCardCount[i] = 0;
            this.m_UserReady[i] = 0;
            this.m_cbOpenCard[i] = 0;
        }
        for(var i=0;i< 16;i++){
            this.m_PaiCard[i] = this.m_GameStart.cbCardPai[i];
        }
        this.OnButtonShow(this.m_cbOperatrStatus,20);

        return true;
    },

    OnSubCallBanker :function (pData, wDataSize) {
        var UserCall = GameDef.CMD_S_UserCall();

        console.log("CallBanker",wDataSize,gCByte.Bytes2Str(UserCall,pData));

        //效验
        if (wDataSize != gCByte.Bytes2Str(UserCall, pData)) return false;
        this.KillGameClock();

        //界面
        if(UserCall.wCurrentUser == this.GetMeChairID()) this.m_GameClientView.HideAllGameButton();
        this.m_cbOperatrStatus = UserCall.cbOperatrStatus;

        for(var i=0;i<GameDef.GAME_PLAYER;i++)
        {
            this.m_UserTimesBank[i] = UserCall.cbUserTimes[i];
        }
        if(UserCall.bIsRobeOrTimes==1)
        {
            this.m_GameClientView.HideAllGameButton();
            this.m_wBankerUser = UserCall.wBankUser;
            this.m_lBankerTimes = UserCall.ldiGuo;
            var BanekrAniArr = new Array();
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                if(!this.m_UserState[i] || UserCall.cbUserTimes[i] != UserCall.cbUserTimes[this.m_wBankerUser]) continue;
                var ViewID = this.SwitchViewChairID(i);
                BanekrAniArr.push( ViewID );
            }
            this.m_GameClientView.StartAni(BanekrAniArr, this.SwitchViewChairID(this.m_wBankerUser), false);//
        }
        else
            this.OnButtonShow(this.m_cbOperatrStatus,null);

        return true;
    },

    OnSubCallPlayer :function (pData, wDataSize) {

        return true;
    },
    OnSubDiGuo : function (pData, wDataSize) {
        var DiGuo = GameDef.CMD_S_DiGuo();

        console.log("DiGuo",wDataSize,gCByte.Bytes2Str(DiGuo,pData));

        //效验
        if (wDataSize != gCByte.Bytes2Str(DiGuo, pData)) return false;
        this.KillGameClock();

        this.m_lBankerTimes = DiGuo.lDiGuo;
        var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(BankerView, DiGuo.lDiGuo);
        this.m_cbOperatrStatus = DiGuo.cbOperatrStatus;

        this.OnButtonShow(this.m_cbOperatrStatus,20);

        return true;
    },
    OnSubAddScore :function (pData, wDataSize) {
        var AddScore = GameDef.CMD_S_AddScore();
        console.log("CMD_S_AddScore",wDataSize,gCByte.Bytes2Str(AddScore,pData));

        //效验
        if (wDataSize != gCByte.Bytes2Str(AddScore, pData)) return false;

        //var MeChairID = this.GetMeChairID();
        var ViewID = this.SwitchViewChairID(AddScore.wAddUser);
        this.m_GameClientView.SetUserTableScore(ViewID,AddScore.nlAddScore);
        this.m_cbOperatrStatus = AddScore.cbOperatrStatus;

        return true;
    },
    OnSubCheatCard:function(pData, wDataSize){
        var CheatCard = GameDef.CMD_S_Cheat_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(CheatCard , pData)) return false;

        this.m_GameClientView.SetUserCheatCardInfo(CheatCard.nCnt,CheatCard.cbCardArr);
        return true;
    },
    OnSubShowCard:function(pData, wDataSize)
    {

        var SendCard = GameDef.CMD_S_SendCard();
        console.log("CMD_S_SendCard",wDataSize,gCByte.Bytes2Str(SendCard,pData));

        if (wDataSize != gCByte.Bytes2Str(SendCard, pData)) return false;
        this.KillGameClock();
        this.m_GameClientView.HideAllGameButton();

        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
                this.m_cbCardData[i] = SendCard.bHandCardData[i];
        }

        this.m_GameClientView.ShowTouzZi(SendCard.cbDice,true);
        this.schedule(this.showCardEnd,2);

        this.m_wFirstSendUser = SendCard.wFirstSendUser;
        for(var i=0;i< 16;i++){
            this.m_PaiCard[i] = SendCard.cbCardPai[i];
        }
        return true;
    },

    showCardEnd:function(){
        this.m_GameClientView.ShowTouzZi(null,false);
        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
            this.m_GameClientView.m_SendCardCtrl.PlaySendCard(GameDef.MAX_COUNT, this.m_wFirstSendUser);
        else
            this.m_GameClientView.m_SendCardCtrl.PlaySendCard(2, this.m_wFirstSendUser);


        this.unschedule(this.showCardEnd);
    },

    OnSubOpenCard :function (pData, wDataSize) {
        var OpenCard = GameDef.CMD_S_Open_Card();
        //效验
        if (wDataSize != gCByte.Bytes2Str(OpenCard, pData)) return false;
        var cbCardTemp = new Array();
        this.m_cbOpenCard[OpenCard.wOpenUser] = OpenCard.bIsOpen;
        if(OpenCard.wOpenUser == this.GetMeChairID() && !this.m_bLookonUser){
            if(this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode)this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode.active = true;
            cbCardTemp = OpenCard.bHandCardData[OpenCard.wOpenUser];
        }
        else
            cbCardTemp = [0,0,0,0];
        var ViewID = this.SwitchViewChairID(OpenCard.wOpenUser);
        this.m_GameClientView.m_UserCardControl[ViewID].node.active = false;
        this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].node.active = true;
        this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].SetMaxCardDate(cbCardTemp,2);
        //if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
        this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].SetMinCardDate(cbCardTemp,4,this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD);

        return true;
    },
    OnSubBankerUser :function (pData, wDataSize) {
        var BankerUser = GameDef.CMD_S_BankerUser();
        //效验
        if (wDataSize != gCByte.Bytes2Str(BankerUser, pData)) return false;

        this.m_GameClientView.HideAllGameButton();
        this.KillGameClock();

        this.m_wBankerUser = BankerUser.wBankerUser;
        this.m_lBankerTimes = BankerUser.llTimes;
        this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser), this.m_lBankerTimes);
        this.m_GameClientView.SetRoomProgress(BankerUser.byTurn1,BankerUser.byTurn2);
        var MeChair = this.GetMeChairID();
        this.m_GameClientView.m_MaxScore = BankerUser.llMaxCall[MeChair];

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserState[i] = BankerUser.cbPlayStatus[i];
        }

        this.UpdateOpView(TIME_CLOCK, 0);
        var BanekrAniArr = new Array();
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            if(!this.m_UserState[i]) continue;
            var ViewID = this.SwitchViewChairID(i);
            BanekrAniArr.push( ViewID );
        }
        this.m_GameClientView.StartAni(BanekrAniArr, this.SwitchViewChairID(this.m_wBankerUser), true);//false

        return true;
    },

    OnSubGameNotify:function(pData, wDataSize){
        var Cmd = GameDef.CMD_S_NOTIFY();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetMaxCard(Cmd.cbMaxCard);
        return true;
    },
    OnSubQieGuo:function(pData, wDataSize){
        var     qieGuo = GameDef.CMD_S_QIEGUO();
        //效验
        if (wDataSize != gCByte.Bytes2Str(qieGuo, pData)) return false;
        this.KillGameClock();

        this.m_GameClientView.HideAllGameButton();

        this.m_wBankerUser = qieGuo.wBankUser;
        this.m_lBankerTimes = qieGuo.ldiGuo;
        this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser), this.m_lBankerTimes);

        this.m_cbOperatrStatus = qieGuo.cbenOperatrStatus;
        for(var i=0;i< 16;i++){
            this.m_PaiCard[i] = qieGuo.cbCardPai[i];
        }
        this.OnButtonShow(this.m_cbOperatrStatus,20);

        return true;
    },
    OnTimeCuoPai :function () {
        this.unschedule(this.OnTimeCuoPai);
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].node.active = false;

        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD){
            this.m_GameClientView.m_OpenCardCtrl.SetCardData(this.m_cbCardData[this.GetMeChairID()],4);

        }else if(this.m_dwRules & GameDef.GAME_TYPE_SMALL_CARD){
            this.m_GameClientView.m_OpenCardCtrl.SetCardData(this.m_cbCardData[this.GetMeChairID()],2);
        }

        this.m_GameClientView.m_ChuoCardNode.active = true;
    },
    OnOpenCard :function () {
        this.m_GameClientView.m_OpenCardCtrl.node.active = false;
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].node.active = true;

        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD){
            this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardData(this.m_cbCardData[this.GetMeChairID()],4,true);
        }else if(this.m_dwRules & GameDef.GAME_TYPE_SMALL_CARD){
            this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardData(this.m_cbCardData[this.GetMeChairID()],2,true);

        }

    },
    OnTimeIDI_SETBANKER:function () {
        this.unschedule(this.OnTimeIDI_SETBANKER);
        this.KillGameClock();
        var ViewID = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(ViewID, this.m_lBankerTimes);
        this.OnButtonShow(this.m_cbOperatrStatus,20);
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
                //if(!this.m_UserReady[i])this.PlayActionSound(i, "READY");
                this.m_UserReady[i] = ReadyState.cbReadyStatus[i];
            }
        }

        if(ReadyState.cbReadyStatus[this.GetMeChairID()]) this.OnMessageStart(null,true);
        return true;
    },
    OnSubShowAdd:function(pData, wDataSize){
        this.m_cbOperatrStatus = 2;
        this.m_bIsFirst = true;
        this.OnButtonShow(this.m_cbOperatrStatus,20);
        return true;
    },


    OnSubShowLittle:function(pData, wDataSize){
        var Little = GameDef.CMD_S_Little_Result();
        if (wDataSize != gCByte.Bytes2Str(Little , pData)) return false;
        this.m_RoomEnd = Little;
        this.m_RoomEnd.UserID = new Array();
        this.KillGameClock();

        this.m_GameClientView.HideAllGameButton();

        this.m_wBankerUser = Little.wBankUser;
        this.m_lBankerTimes = Little.ldiGuo;
        this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser), this.m_lBankerTimes);

        this.m_cbOperatrStatus = Little.cbOperatrStatus;
        for(var i=0;i< 16;i++){
            this.m_PaiCard[i] = Little.cbCardPai[i];
        }
        //用户成绩
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if(pIClientUserItem == null) continue;
            this.m_RoomEnd.UserID[i] = pIClientUserItem.GetUserID();
        }
        this.ShowGamePrefab('GameEndInfo_52081',this.m_gameNode,function(Js){
            this.m_Little= Js;
        }.bind(this));
        return true;
    },



    //游戏结束
    OnSubGameConclude :function (pData, wDataSize) {
        this.m_GameEnd = GameDef.CMD_S_GameEnd();

        //效验数据
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;

        //设置状态
        this.m_GameClientView.HideAllGameButton();
        //删除时间
        this.KillGameClock();
        this.m_nTime = 0.3;

        if(this.m_GameEnd.wWinner > GameDef.GAME_PLAYER ) return true;

        if(this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode) this.m_GameClientView.m_CardCtrlEndPrefab[GameDef.MYSELF_VIEW_ID].m_cardNode.active = true;



        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var cbCardTemp = [0,0,0,0];
            this.m_GameClientView.m_CardCtrlEndPrefab[i].SetMaxCardDate(cbCardTemp, 2);
            this.m_GameClientView.m_CardCtrlEndPrefab[i].SetMinCardDate(cbCardTemp, 4,this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD);
            this.m_GameClientView.m_CardCtrlEndPrefab[i].node.active = false;
            this.m_GameClientView.m_UserCardControl[i].node.active = false;

        }
        var cardIndex = 1;
        this.m_cbOperatrStatus = 0;
        //小结算界面
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //展示手牌

            if( !this.m_UserState[(this.m_wBankerUser+i+1)%GameDef.GAME_PLAYER] ) continue;
            var ViewID = this.SwitchViewChairID((this.m_wBankerUser+i+1)%GameDef.GAME_PLAYER);

            this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].node.active = true;
            if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD){
                for(var j = 1; j>=0;j--)
                {
                    var act = cc.sequence( cc.delayTime(cardIndex*2), cc.callFunc(this.EndShowCardFunc.bind(this), this, [ViewID, j,(this.m_wBankerUser+i+1)%GameDef.GAME_PLAYER]));
                    this.m_GameClientView.node.runAction(act);
                    cardIndex++;
                }
            }
            else{
                var act = cc.sequence( cc.delayTime(cardIndex*2), cc.callFunc(this.EndShowCardFunc.bind(this), this, [ViewID, 0,(this.m_wBankerUser+i+1)%GameDef.GAME_PLAYER]));
                    this.m_GameClientView.node.runAction(act);
                    cardIndex++;
            }
        }
        if(this.m_GameEnd.cbAni == 10)cardIndex = 1;
        this.m_nTime = cardIndex*2;

        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD){

            this.schedule(this.endGame,this.m_nTime);
        }else{
            this.schedule(this.endGame,this.m_nTime);

        }


        return true;
    },
    getEndTime:function(){
        return this.m_nTime;
    },
    endGame:function(){

        this.m_lBankerTimes = this.m_GameEnd.ldiGuo;
        var BankerView = this.SwitchViewChairID(this.m_wBankerUser);
        this.m_GameClientView.SetBankerUser(BankerView, this.m_lBankerTimes);


        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //展示手牌

            if( !this.m_UserState[i] ) continue;
            //显示分数
            var ViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserEndScore(ViewID, this.m_GameEnd.nlGameScore[i]);
            var pUserItem = this.GetClientUserItem(i);

            this.m_GameClientView.OnUpdateUserScore(pUserItem,ViewID);
        }
        this.m_GameClientView.playFlyCoin(this.m_GameEnd.nlGameScore,this.m_wBankerUser);

        this.m_GameClientView.m_btStart.node.active = true;

        this.unschedule(this.endGame);

    },

    LoseGold:function(){
        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            if(!this.m_UserState[i] || i==this.m_wBankerUser) continue;
            if(this.m_GameEnd.nlGameScore[i] > 0){
                this.m_GameClientView.PlaceJetton(this.m_wBankerUser,i);
            }
        }
        this.unschedule(this.LoseGold);

    },

    EndShowCardFunc:function (node, para){
        if(para[1] == 1)
        {
            this.m_GameClientView.ShowRank(para[0],this.m_GameEnd.cbRank[para[2]],1,true);
            // this.m_GameClientView.m_CardCtrlEndPrefab[para[0]].SetMaxCardDate(this.m_GameEnd.cbHandCardData[para[2]],2);
            this.m_GameClientView.m_CardCtrlEndPrefab[para[0]].SetMinCardDate(this.m_GameEnd.cbHandCardData[para[2]],4,this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD);

        }
        else
        {
            this.m_GameClientView.ShowRank(para[0],this.m_GameEnd.cbRank[para[2]],0,true);
            this.m_GameClientView.m_CardCtrlEndPrefab[para[0]].SetMaxCardDate(this.m_GameEnd.cbHandCardData[para[2]],2);

            this.m_GameClientView.m_CardCtrlEndPrefab[para[0]].SetMinCardDate(this.m_GameEnd.cbHandCardData[para[2]],4,this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD);
        }

    },
    OnTimeIDI_PERFORM_END :function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);
        if(this.m_RoomEnd == null){
            this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, 30);
            this.m_GameClientView.m_btStart.node.active = true;
        }else{
            this.ShowEndView();
        }
    },
    UpdateOpView:function(Time, SendCardCnt){
        // this.KillGameClock();
        // var MeChair = this.GetMeChairID();
        // var MeUserItem = this.GetMeUserItem();
        // var bGame = this.m_UserState[MeChair];

        // if(SendCardCnt == 0){
        //     this.m_GameClientView.SetTableTips('等待闲家选择倍数');
        //     var AddScore = this.m_GameClientView.m_UserTableScore[GameDef.MYSELF_VIEW_ID];
        //     if( bGame && MeChair != this.m_wBankerUser){
        //         if (AddScore == 0) {
        //             this.m_GameClientView.ShowScoreUI();
        //         } else {
        //             var StateArr = new Array();
        //             var MaxScore = this.m_GameClientView.m_MaxScore;
        //             for(var i=0;i<GameDef.GAME_PLAYER;i++){
        //                 var ViewID = this.SwitchViewChairID(i);
        //                 StateArr[ViewID] = i==this.m_wBankerUser?0:this.m_UserState[i];
        //             }
        //             //this.m_GameClientView.ShowAddScoreUI(this.SwitchViewChairID(this.m_wBankerUser),MaxScore,StateArr );
        //         }
        //     }
        // }

        // if(SendCardCnt == 5 ){
        //     this.m_GameClientView.SetTableTips('等待玩家开牌');

        // }
        // //设置时间
        // this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, Time);
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


    //开始消息
    OnMessageStart :function (Tag, bClear) {

        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.SetUserTableScore(INVALID_CHAIR);
        this.m_GameClientView.ShowHorseUser(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.m_btStart.node.active = false;
        this.m_GameClientView.node.stopAllActions();

        //发送消息
        //if(!bClear)this.SendFrameData(SUB_GF_USER_READY);
        if(!bClear) this.SendGameData(GameDef.SUB_C_READY);

        return 0;
    },


    //叫分消息
    OnMessageCallBanker :function (callScore) {

        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallScore = GameDef.CMD_C_Time();
        CallScore.cbTimes = parseInt(callScore);
        this.SendGameData(GameDef.SUB_C_TIMES, CallScore);
    },
    OnMessageCallBankerChoose:function(BankerChoose){
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        var Qie = GameDef.CMD_C_QieGuo();
        Qie.cbScoreTimes = parseInt(BankerChoose);
        this.SendGameData(GameDef.SUB_C_QIEGUO, Qie);

    },
    //叫分消息
    OnMessageCallPlayer :function (callScore) {
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.lAddScore = callScore;

        this.SendGameData(GameDef.SUB_C_ADD_SCORE, CallScore);
    },

    OnMessageGetMaxCard:function(){
        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD){
            this.SendGameData(GameDef.SUB_C_NOTIFY_CARD);
        }else{
            var cbMaxCard = new Array(2);
            cbMaxCard[0] = this.m_cbCardData[this.GetMeChairID()][0];
            cbMaxCard[1] = this.m_cbCardData[this.GetMeChairID()][1];

            this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetMaxCard(cbMaxCard);
        }

    },

    OnMessageOpenCard :function () {
        var ViewID = this.SwitchViewChairID(this.GetMeChairID());
        var openCrad = new Array();
        openCrad = this.m_GameClientView.m_UserCardControl[ViewID].GetOpenCard(this);

        if(openCrad == null)
        {
            this.m_GameClientView.m_NdOpenCard.active = true;
            return;
        }
        //设置界面
        this.m_GameClientView.HideAllGameButton();

        var minCrad = new Array();
        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
            minCrad = this.m_GameClientView.m_UserCardControl[ViewID].GetMinCard();
        else{
            minCrad[0] = 0;
            minCrad[1] = 0;

        }

        var chooseCard = GameDef.CMD_C_OPEN();
        chooseCard.cbMaxCard = 	openCrad;
        chooseCard.cbMinCard = 	minCrad;
        //发送数据
        this.SendGameData(GameDef.SUB_C_OPEN_CARD,chooseCard);
    },
    OnMessageShowCard :function () {
        var MeChairID = this.GetMeChairID();
        this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardData(this.m_cbCardData[MeChairID], this.m_cbCardCount[MeChairID],false);
    },




    OnMessageCtrlStart :function () {
        //发送数据
        this.SendGameData(GameDef.SUB_C_START);
    },
    //邀请好友分享
    OnFirend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },
    //发牌完成
    OnMessageDispatchFinish :function (wChairID, CardCount, PlayerIndex,CardIndex) {
         //发牌过程
         var kernel = gClientKernel.get();
         this.m_cbCardCount[wChairID]++;
         var ViewID = this.SwitchViewChairID(wChairID)
         var CardArr = new Array();

        if(this.m_dwRules & GameDef.GAME_TYPE_CUO_PAI && !this.m_bLookonUser){
            CardArr = [0,0,0,0];

        }else{
            if(wChairID == this.GetMeChairID() &&  !this.m_bLookonUser){
                CardArr = this.m_cbCardData[wChairID];
            }else{
                CardArr = [0,0,0,0];
            }
        }
        for(var i = 0;i<32;i++){
            if(i<16){
                this.$("GameClientView/PaiBG/CardNode/CardPrefab"+i).active = true;
            }else{
                this.$("GameClientView/PaiBG/CardNode/CardPrefab"+i).active = false;
            }
        }
        if (GameDef.GetPlayerCount(0,this.m_dwAllRules) == 4)
            this.$("GameClientView/PaiBG").active = true;
        if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(CardArr,GameDef.MAX_COUNT,true);
        else if(this.m_dwRules & GameDef.GAME_TYPE_SMALL_CARD){
            this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(CardArr,2,true);
        }

         this.m_GameClientView.m_UserCardControl[ViewID].node.active = true;
         if(CardIndex > 0)  return;
         if(this.m_UserState[this.GetMeChairID()] &&  !this.m_bLookonUser)
             this.m_GameClientView.ShowOpenCard(true);
         this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, 30);
         this.UpdateOpView(TIME_CLOCK, CardCount+1);
         this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetGameEngine(this);
         if(this.m_dwRules & GameDef.GAME_TYPE_CUO_PAI && !this.m_bLookonUser){
            this.scheduleOnce(this.OnTimeCuoPai, 0.5);
         }
         this.m_GameClientView.ShowPaiView(this.m_PaiCard);

    },

    //设置信息
    SetViewRoomInfo:function ( ServerRules,dwRules){
        this.m_dwRules = dwRules[0];
        this.m_ServerRules = ServerRules;
        this.m_GameClientView.SetViewRoomInfo(dwRules);
        this.m_dwAllRules = dwRules;
    },

    SwitchViewChairID2: function (wChairID) {
        if (wChairID == INVALID_CHAIR) return INVALID_CHAIR;

        var wViewChairID = (parseInt(wChairID) + this.m_GameClientView.m_playerCount - this.GetMeChairID());
        return (wViewChairID + GameDef.MYSELF_VIEW_ID) % this.m_GameClientView.m_playerCount;
    },

    OnClearScene:function (){
        //设置界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.SetUserTableScore(INVALID_CHAIR);

        this.OnMessageStart(null, true);
       // this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_NdCtrlStart.active = false;
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_lBankerTimes = 0;
        this.m_cbCardData = new Array();
        this.m_cbCardCount = new Array();
        this.m_UserState = new Array();
        this.m_UserReady = new Array();
    },

    showCard:function(bshow){
        this.m_GameClientView.ShowTouzZi(null,false);

        var cbCardTemp = new Array();

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            if(!this.m_UserState[i]) continue;
            if(i == this.GetMeChairID() &&  !this.m_bLookonUser && this.m_UserState[this.GetMeChairID()])
                cbCardTemp[i] = this.m_cbCardData[i];
            else
                cbCardTemp[i] = [0,0,0,0];
            var ViewID = this.SwitchViewChairID(i);
            if(this.m_cbOpenCard[i]){
                this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].SetMaxCardDate(cbCardTemp[i],2);
                this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].SetMinCardDate(cbCardTemp[i],4);
                this.m_GameClientView.m_CardCtrlEndPrefab[ViewID].node.active = true;

            }
            else{
                if(this.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
                    this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(cbCardTemp[i],GameDef.MAX_COUNT,bshow);
                else
                    this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(cbCardTemp[i],2,bshow);
                this.m_GameClientView.m_UserCardControl[ViewID].node.active = true;
            }
                

        }

    },

    OnBtClickedRules:function(){
        var str = GameDef.GetRulesStr(this.m_dwAllRules,this.m_ServerRules);
        this.ShowAlert(''+str);
    },

    OnButtonShow:function(cbOperatrStatus,nTime){
        this.m_GameClientView.HideAllGameButton();
        switch (cbOperatrStatus) {

            case 2:
                {
                    if(this.m_Little)this.m_Little.node.active = false;

                    this.m_GameClientView.ShowCardView(this.m_PaiCard);
                    if(this.GetMeChairID() !=  this.m_wBankerUser &&  !this.m_bLookonUser && this.m_UserState[this.GetMeChairID()]){
                        this.m_GameClientView.ShowScoreUI();
                        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, nTime);
                    }

                    break;
                }
            case 4:
                {
                    if( !this.m_bLookonUser && this.m_UserState[this.GetMeChairID()])
                    {
                        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, nTime);
                        this.m_GameClientView.ShowBankerUI();
                    }
                    break;
                }
            case 5:
                {
                    if(this.m_UserTimesBank[this.GetMeChairID()] == 100 &&  !this.m_bLookonUser && this.m_UserState[this.GetMeChairID()]){
                        this.m_GameClientView.ShowBankerUI();
                        this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, nTime);
                    }

                    break;
                }
            case 3:
                {

                    this.SetGameClock(GameDef.MYSELF_VIEW_ID, IDI_GAME_CLOCK, nTime);
                    this.m_GameClientView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetGameEngine(this);

                    this.showCard(true);
                    if(this.m_cbOpenCard[this.GetMeChairID()])
                        this.m_GameClientView.ShowOpenCard(false);
                    else if(this.m_UserState[this.GetMeChairID()])
                        this.m_GameClientView.ShowOpenCard(true);

                    break;
                }
            case 7:
                {
                    if(this.GetMeChairID() ==  this.m_wBankerUser)
                        this.m_GameClientView.ShowBankChoose();

                    break;
                }
            case 8:
                {
                  //  if(this.m_Little)this.m_Little.node.active = false;
                    break;
                }

        }
    },
});
