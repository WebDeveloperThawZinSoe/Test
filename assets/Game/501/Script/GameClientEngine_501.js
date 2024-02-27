var QueueEngine = require('QueueEngine');

//游戏时间
var IDI_OUT_CARD = 200; //出牌定时器
var IDI_START_GAME = 201; //开始定时器
var IDI_CALL_SCORE = 202; //叫分定时器
var IDI_DOUBLE_SCORE = 203; //踢/加倍定时器

//游戏时间
var TIME_OUT_CARD = 20;
var TIME_FIRST_OUT_CARD = 25;
var TIME_CALL_SCORE = 5;

var TIME_START = 60;
var TIME_OP = 120;

cc.Class({
    extends: cc.GameEngine,

    properties: {},

    // use this for initialization
    start: function () {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        this.Queue = new QueueEngine();
        this.m_ReadyTime = 0;
        this.m_nTime = 0;
        this.m_wKickPlayer = INVALID_CHAIR;
        this.m_UserReady = new Array(GameDef.GAME_PLAYER);
    },

    ctor: function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        // this.m_SoundArr = [];
        this.m_SoundArr = [['BGM', 'BGM'], //.mp3
            ['GAME_START', 'GAME_START'],
            ['GAME_END', 'GAME_END'],
            ['GAME_WARN', 'GAME_WARN'],
            ['LEFT_WARN', 'leftwarn'],
            ['Qiang', 'daqiang'],
            ['HomeRun', 'HomeRun'],
            ['Qiang1', 'daqiang1'],

            ['SENDCARD', 'card_fapai'], //发牌
            ['OUTCARD', 'card_out'], //出牌
            ['OUTEAT', 'card_out_eat'],
            ['EATCARD', 'card_shou'], //吃牌
            ['YOURTURN', 'yourturn'],
            ['OutAlert1', 'Quick1'], //快点出牌 男
            ['OutAlert0', 'Quick0'], //快点出牌 女
            ['TaoXin', 'taoxin'],


            // //女
            // ['W_SongHeAniCHN', 'w/MedicineType/SongHeYao'], //药
            // ['W_LanCaoAniCHN', 'w/MedicineType/CaoYao'],
            // ['W_FengYeAniCHN', 'w/MedicineType/FengYao'],
            // ['W_WuTongAniCHN', 'w/MedicineType/WuTongYao'],
            // ['W_YuAniCHN', 'w/MedicineType/YuYao'],
            // ['W_LuoBoYao', 'w/MedicineType/LuoBoYao'],
            // ['W_Clean', 'w/Other/Clean'], //清牌
            // ['W_Prepare', 'w/Other/zhunbei'], //准备


            // //男
            // ['M_SongHeAniCHN', 'm/MedicineType/SongHeYao'],
            // ['M_LanCaoAniCHN', 'm/MedicineType/CaoYao'],
            // ['M_FengYeAniCHN', 'm/MedicineType/FengYao'],
            // ['M_WuTongAniCHN', 'm/MedicineType/WuTongYao'],
            // ['M_YuAniCHN', 'm/MedicineType/YuYao'],
            // ['M_LuoBoYao', 'm/MedicineType/LuoBoYao'],
            // ['M_Clean', 'm/Other/Clean'],
            // ['M_Prepare', 'm/Other/zhunbei'],


            // ['type31', 'CardType/M/type31'],
        ];


        for (var i = 0; i < 10; i++) {
            this.m_SoundArr.push(['type' + i, 'CardType/M/type' + i]);
        }
        for (var i = 15; i < 20; i++) {
            this.m_SoundArr.push(['type' + i, 'CardType/M/type' + i]);
        }
        for (var i = 23; i < 27; i++) {
            this.m_SoundArr.push(['type' + i, 'CardType/M/type' + i]);
        }
        for (var i = 37; i < 41; i++) {
            this.m_SoundArr.push(['type' + i, 'CardType/M/type' + i]);
        }

        //短语声音
        for(var i=1;i<=12;++i){
            var FileName = 'v'+i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/'+FileName];
        }
        this.m_szText = new Array(
            '不好意思，来个电话',
            '出门没洗手，要啥啥没有',
            '都别走，我们决战到天亮',
            '干啥呢，别墨迹',
            '就是娱乐别那么认真',
            '快点吧，一趟北京都回来了',
            '说啥都没用，就是闯',
            '我去，这牌都没赢到你',
            '我说朋友，你是偷的网吗？',
            '我这也是真幸，要啥来啥呀',
            '要牌，要快，别墨迹',
            '这牌也真是没谁了',
        );


        return;
    },
    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_GAME_START: {
                return this.OnSubGameStart(pData, wDataSize);
            }
            case GameDef.SUB_S_SHOW_CARD: {
                return this.OnSubShowCard(pData, wDataSize);
            }
            case GameDef.SUB_S_COMPARE_CARD: {
                return this.OnSubComPareCard(pData, wDataSize);
            }
            case GameDef.SUB_S_GAME_END: {
                return this.OnSubGameConclude(pData, wDataSize);
            }
            case GameDef.SUB_S_CUT_USER: {
                return this.OnSubCutUser(pData, wDataSize);
            }
            case GameDef.SUB_S_CUT_CARD: {
                return this.OnSubCutCard(pData, wDataSize);
            }
            case GameDef.SUB_S_OP_ROBE_BANK: {
                return this.OnSubOPRobeBank(pData, wDataSize);
            }
            case GameDef.SUB_S_ROBE_BANK: {
                return this.OnSubRobeBank(pData, wDataSize);
            }
            case GameDef.SUB_S_ROBE_RES: {
                return this.OnSubRobeRes(pData, wDataSize);
            }
            case GameDef.SUB_S_AUTO_PUT: {
                return this.OnSubAutoPut(pData, wDataSize);
            }
            case GameDef.SUB_S_START_CTRL:{
                return this.OnSubKickShow(pData,wDataSize);
            }
            case GameDef.SUB_S_USER_READY:	
                {
                    return this.OnSubUserReady(pData, wDataSize);
                } 
            case GameDef.SUB_S_BI_PIN:
            {
                return this.OnSubBiPin(pData, wDataSize);
            }
            case GameDef.SUB_S_CHECK_CARD:
                {
                    return this.OnSubCheckCard(pData, wDataSize);
                }
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        console.log('OnEventSceneMessage cbGameStatus ' + cbGameStatus + ' size ' + wDataSize);
        switch (cbGameStatus) {
            case GameDef.GAME_SCENE_FREE: //空闲状态
            {
                //效验数据
                var pStatusFree = GameDef.CMD_S_StatusFree();
                if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;

                this.m_GameClientView.resetView();
                this.Queue.clean();
                //玩家设置
                var kernel = gClientKernel.get();
                if (!kernel.IsLookonMode()) {
                    //开始设置
                    if (kernel.GetMeUserItem().GetUserStatus() == US_SIT) {
                        this.m_GameClientView.m_BtStart.active = true;
                    }
                    if (this.m_wGameProgress == 0) {
                        this.m_GameClientView.m_BtFriend.active = true;
                        // this.m_GameClientView.setEndTimer(pStatusFree.cbTimeStartGame);
                    }
                    // else
                    //     this.m_GameClientView.setEndTimer(pStatusFree.wWaitTime);

                    if(pStatusFree.wWaitTime)this.m_GameClientView.setEndTimer(pStatusFree.wWaitTime);
                    this.m_cbTimeRangeCard = pStatusFree.cbTimeRangeCard;
                }
                this.m_GameClientView.m_bPlayStatus = deepClone(pStatusFree.bPlayStatus);
                if (this.m_wGameProgress > 0) {
                    this.m_GameClientView.m_BtFriend.active = false;
                    this.m_GameClientView.m_BtStart.active = false;
                }
                for(var i = 0; i < GameDef.GAME_PLAYER; i++){
                    var pUserItem = this.GetClientUserItem(i);
                    if(pUserItem == null || pUserItem == 0)continue;
                    var ViewID = this.SwitchViewChairID(i);
                    if(pStatusFree.cbUserStatus[i]) {
                        this.m_GameClientView.SetUserReady(ViewID);
                        this.m_UserReady[i] = pStatusFree.cbUserStatus[i];
                    }  
                }
                return true;
            }
            case GameDef.GAME_SCENE_PLAY: //游戏状态
            {
                //效验数据
                var pCmd = GameDef.CMD_S_StatusPlay();
                if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;
                //恢复牌
                var pGameView = this.m_GameClientView;
                pGameView.resetView();
                this.Queue.clean();

                this.m_GameClientView.m_bPlayStatus = deepClone(pCmd.bPlayStatus);//
                this.m_GameClientView.setBank(this.SwitchViewChairID(pCmd.wBanker));
                if(bLookonUser) return true;
                if (pCmd.wCurUser != INVALID_CHAIR && this.m_dwRulesArr[0] & GameDef.GAME_TYPE_ZHONGLU) {
                    if(pCmd.bIsChoose[this.GetMeChairID()]==false){
                        this.m_GameClientView.m_NdZLBP.active = (pCmd.bIsChoose[this.GetMeChairID()]==false);
                        
                        
                    }
                }else{
                        if (!pCmd.bFinishSegment[this.GetMeChairID()] && pCmd.bPlayStatus[this.GetMeChairID()]) {
                        // this.m_GameClientView.m_SelectCtrl.setTime(pCmd.wWaitTime);
                        this.m_cbTimeRangeCard = pCmd.cbTimeRangeCard;
                        //this.m_GameClientView.m_SelectCtrl.SetRangeTime(pCmd.cbTimeRangeCard);
                        this.m_GameClientView.m_SelectCtrl.setCardData(pCmd.cbHandCardData, pCmd.cbSpecialType);
                        for (var i in this.m_GameClientView.m_HandCtrl)
                            this.m_GameClientView.m_HandCtrl[i].setSpecialType(pCmd.cbSpecialType);
                        this.scheduleOnce(this.m_GameClientView.m_SelectCtrl.ShowView.bind(this.m_GameClientView.m_SelectCtrl),
                            this.m_GameClientView.sendCard());
                    }
                    this.m_GameClientView.setHandView(pCmd.bFinishSegment);
                }
                for(var i = 0 ; i < GameDef.GAME_PLAYER; i++){
                    var ViewID = this.SwitchViewChairID(i);
                    if(pCmd.bIsBiPing[i]){
                        this.m_GameClientView.m_UserInfo[ViewID].setBiPin(true);
                    }else{
                        this.m_GameClientView.m_UserInfo[ViewID].setBiPin(false);
                    }
                } 
                return true;
            }
        }
        return false;
    },

    SetGameClock: function (wChairID, nTimerID, nElapse) {
        var wViewChairID = this.SwitchViewChairID(wChairID);
        g_TimerEngine.SetGameTimer(wViewChairID, nTimerID, nElapse * 1000, null, this, 'OnTimerMessage');
        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse);
    },

    //删除定时器
    KillGameClock: function () {
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
        }

        return true;
    },

    //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_GameStart();
        //效验
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;
        this.m_GameClientView.m_NdZLBP.active = false;
        for(var i = 0; i < GameDef.GAME_PLAYER;i++){
            var wView = this.SwitchViewChairID(i);

            this.m_GameClientView.m_UserInfo[wView].OnBtKickShow(false);

        }
        //按钮
        this.m_GameClientView.m_BtStart.active = false;
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_BtTiQian.active = false;

        //播放开始声音
        // cc.gSoundRes.PlayGameSound('GAME_START');

        this.m_GameClientView.killEndTimer();
        this.m_GameClientView.resetView();
        this.m_nTime = Cmd.nTime;
        //this.Queue.push(function (Cmd) {
            this.m_GameClientView.m_bPlayStatus = deepClone(Cmd.bPlayStatus);//
            this.m_GameClientView.setBank(this.SwitchViewChairID(Cmd.wBanker));
            if(Cmd.bPlayStatus[this.GetMeChairID()]==false) return true;
            this.m_GameClientView.m_SelectCtrl.setCardData(Cmd.bCardData, Cmd.cbSpecialType);
            for (var i in this.m_GameClientView.m_HandCtrl){
                this.m_GameClientView.m_HandCtrl[i].setSpecialType(Cmd.cbSpecialType);
            }
            if( !this.m_ReplayMode ){//||
                this.scheduleOnce(this.m_GameClientView.m_SelectCtrl.ShowView.bind(this.m_GameClientView.m_SelectCtrl),
                this.m_GameClientView.sendCard());
            }
       // }.bind(this), Cmd);
        return true;
    },

    //玩家操作
    OnSubShowCard: function (pData, wDataSize) {
        var pCmd = GameDef.CMD_S_ShowCard();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;

        if (pCmd.wCurrentUser == this.GetMeChairID())
            this.m_GameClientView.m_SelectCtrl.HideView();
        this.m_GameClientView.setRangView(pCmd.wCurrentUser);

        return true;
    },

    //用户出牌
    OnSubComPareCard: function (pData, wDataSize) {
        var pCmd = GameDef.CMD_S_CompareCard();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;

        var delay = this.m_GameClientView.compareCard(pCmd.bSegmentCard, pCmd.cbSpecialType,
            pCmd.llScoreTimes, pCmd.llFinalScore, pCmd.llXiScore,pCmd.bIsShowZhong,pCmd.llBaseScore);
        if(!this.m_ReplayMode)this.scheduleOnce(this.OnMessageCompleteCompare, delay);
        return true;
    },

    //游戏结束
    OnSubGameConclude: function (pData, wDataSize) {

        //效验数据
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;
       // this.m_GameClientView.ShowLittleResult(this.m_GameEnd);
    
        this.m_GameClientView.m_SelectCtrl.HideView();
        //this.m_GameClientView.m_BtStart.active = true;

        if (!this.m_GameEnd.bShowBigResult && this.m_ReadyTime) {
            this.m_GameClientView.setEndTimer(this.m_ReadyTime);
        }
        return true;
    },
    OnSubBiPin:function(pData, wDataSize){

        var Cmd = GameDef.CMD_S_BiPin();
        if (wDataSize != gCByte.Bytes2Str(Cmd , pData)) return false;

        for(var i = 0 ; i < GameDef.GAME_PLAYER; i++){
            var ViewID = this.SwitchViewChairID(i);

            if(Cmd.bIsBiPing[i]){
                this.m_GameClientView.m_UserInfo[ViewID].setBiPin(true);
            }else{
                this.m_GameClientView.m_UserInfo[ViewID].setBiPin(false);
            }
        }
        return true;
    },

    OnSubCheckCard:function(pData, wDataSize){
        var Cmd = GameDef.CMD_S_CheckCard();
        if (wDataSize != gCByte.Bytes2Str(Cmd , pData)) return false;

        this.m_GameClientView.m_SelectCtrl.setCheckCard(Cmd.cbFrontCard,Cmd.cbMidCard,Cmd.cbBackCard);
        return true;
    },

    OnSubUserReady :function (pData, wDataSize) {
        var ReadyState = GameDef.CMD_S_UserState();
        //效验
        if (wDataSize != gCByte.Bytes2Str(ReadyState , pData)) return false;
        //this.m_GameClientView.SetUserState(INVALID_CHAIR);
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var pUserItem = this.GetClientUserItem(i);
            if(pUserItem == null || pUserItem == 0)continue;
            var ViewID = this.SwitchViewChairID(i);
            if(ReadyState.cbUserStatus[i]) {
                this.m_GameClientView.SetUserReady(ViewID);
                this.m_UserReady[i] = ReadyState.cbUserStatus[i];
            }  
        }
        if(ReadyState.cbUserStatus[this.GetMeChairID()]) this.OnMessageStart(null,true);
        return true;
    },
    OnSubCutUser: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_CutUser();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;
        //按钮
        this.m_GameClientView.m_BtStart.active = false;
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_BtTiQian.active = false;

        //播放开始声音
        // cc.gSoundRes.PlayGameSound('GAME_START');

        this.m_GameClientView.killEndTimer();
        this.m_GameClientView.resetView();
        this.m_GameClientView.m_NdZLBP.active = true;
        for(var i =0; i < GameDef.GAME_PLAYER; i++){
            var ViewID = this.SwitchViewChairID(i);

            this.m_GameClientView.m_UserInfo[ViewID].setBiPin(false);
        }
        return true;
    },

    OnSubCutCard: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_CutCard();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;

        this.Queue.push(function (Cmd) {
            return this.m_GameClientView.m_CutCard.playSlider(Cmd.dValue, Cmd.wChairID == this.GetMeChairID());
        }.bind(this), Cmd);
        return true;
    },

    OnSubOPRobeBank: function (pData, wDataSize) {
        this.m_GameClientView.m_BtStart.active = false;
        this.m_GameClientView.m_BtFriend.active = false;
        this.m_GameClientView.m_ButtonCtrl.showRobeUI();
        return true;
    },

    OnSubRobeBank: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_RobeBank();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;

        var wView = this.SwitchViewChairID(Cmd.wChairID);
        this.m_GameClientView.m_UserInfo[wView].showTimes(Cmd.cbRobeTimes);
        return true;
    },

    OnSubRobeRes: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_RobeResult();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;

        this.Queue.push(function (Cmd) {
            return this.m_GameClientView.playRandBank(Cmd.wRandUser, Cmd.cbRandCnt, Cmd.cbRandIdx, Cmd.wBanker);
        }.bind(this), Cmd);

        return true;
    },

    OnSubAutoPut: function (pData, wDataSize) {
        var Cmd = GameDef.CMD_S_AutoPut();
        if (wDataSize != gCByte.Bytes2Str(Cmd, pData)) return false;

        this.m_GameClientView.m_SelectCtrl.setUpCard(Cmd.bSegmentCard);
        return true;
    },

    SetBaseScore: function () {
        var pBaseScore = GameDef.CMD_C_BASE_SCORE();
        pBaseScore.cbBaseScore = parseInt(cc.sys.localStorage.getItem('BaseScore'));
        //发送数据
        this.SendGameData(GameDef.SUB_C_BASESCORE, pBaseScore);
        return true;
    },


    OnEventRoomEnd: function (data, datasize) {
        this.m_RoomEnd = GameDef.CMD_S_GameCustomInfo();
        if (datasize != gCByte.Bytes2Str(this.m_RoomEnd, data)) return false;

        //用户成绩
        this.m_RoomEnd.UserID = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if(pIClientUserItem == null) continue;
            this.m_RoomEnd.UserID[i] = pIClientUserItem.GetUserID();
        }
        
        if (this.m_wGameProgress > 0) {
            if(!this.m_GameClientView.m_LittleResult.node.active) {
                //this.RealShowEndView();
                this.schedule(this.RealShowEndView, 3)

            }
            else this.m_GameClientView.m_LittleResult.setConclueStat(true);
            /*this.m_GameClientView.m_BigResult.setData(this.m_RoomEnd);
            if (this.m_wGameProgress != GameDef.GetTotalInning(this.m_dwRules))
                this.m_GameClientView.m_BigResult.ShowInfo();*/
        } else {
            this.ShowAlert('该房间已被解散！', Alert_Yes, function (Res) {
                g_Table.ExitGame();
            });
        }
        return true;
    },
   
    //播放操作声音
    PlayCardTypeSound: function (wChairId, cbCardType, CardStr, CardCount) {
        //播放声音
        switch (cbCardType) {
            case GameDef.CT_SINGLE:
                return this.PlayActionSound(wChairId, '1_' + CardStr);
            default:
                break;
        }
    },

    //播放操作声音
    PlayActionSound: function (wChairId, byAction) {
        //椅子效验
        var pIClientUserItem = this.GetClientUserItem(wChairId);
        if (pIClientUserItem == null) return;
        if (pIClientUserItem.GetGender() == 1) {
            cc.gSoundRes.PlayGameSound('M_' + byAction);
        } else {
            cc.gSoundRes.PlayGameSound('W_' + byAction);
        }
    },


    OnMessageGiveUp:function(){
        this.SendGameData(GameDef.SUB_C_GIVE_UP);

    },


    //开始消息
    OnMessageStart: function (wParam, lParam) {
        //删除时间
        this.KillGameClock();

        //扑克控件
        this.m_GameClientView.resetView();

        //设置界面
        this.m_GameClientView.m_BtStart.active = false;

        //发送消息
       // this.SendFrameData(SUB_GF_USER_READY);
        this.SendGameData(GameDef.SUB_C_READY);
        return 0;
    },

    OnMessageShowCard: function (cbFrontCard, cbMidCard, cbBackCard, bSpecial) {
        var Cmd = GameDef.CMD_C_ShowCard();
        Cmd.cbFrontCard = cbFrontCard;
        Cmd.cbMidCard = cbMidCard;
        Cmd.cbBackCard = cbBackCard;
        Cmd.bSpecial = bSpecial;
        this.SendGameData(GameDef.SUB_C_SHOWCARD, Cmd);
    },

    OnMessageCheckCard: function (cbFrontCard, cbMidCard, cbBackCard, bSpecial) {
        var Cmd = GameDef.CMD_C_ShowCard();
        Cmd.cbFrontCard = cbFrontCard;
        Cmd.cbMidCard = cbMidCard;
        Cmd.cbBackCard = cbBackCard;
        Cmd.bSpecial = bSpecial;
        this.SendGameData(GameDef.SUB_C_CHECKCARD, Cmd);
    },

    OnMessageCompleteCompare: function () {
        this.SendGameData(GameDef.SUB_C_COMPLETE_COMPARE);
    },

    OnMessageTiQian: function () {
        this.SendGameData(GameDef.SUB_C_TIQIAN);
    },

    OnMessageCutUser: function () {
        this.SendGameData(GameDef.SUB_C_CUT_USER);
    },

    OnMessageCutCard: function (dValue) {
        this.m_GameClientView.m_NdZLBP.active = false;

        var pCmd = GameDef.CMD_C_CutCard();
        pCmd.bValue = dValue;
        this.SendGameData(GameDef.SUB_C_CUT_CARD, pCmd);
    },

    OnMessageRobeTimes: function (cbTimes) {
        var pCmd = GameDef.CMD_C_RobeBank();
        pCmd.cbRobeTime = cbTimes;
        this.SendGameData(GameDef.SUB_C_ROBE_BANK, pCmd);
    },

    OnMessageAuto: function () {
        this.SendGameData(GameDef.SUB_C_AUTO);
    },
    



    //设置警告
    SetViewRoomInfo: function (dwServerRules, dwRulesArr) {
        this.m_GameClientView.SetViewRoomInfo(dwServerRules, dwRulesArr);
        this.m_ReadyTime = 3;
        this.m_dwRulesArr = dwRulesArr;
        this.m_GameClientView.m_BtChat.active = (dwRulesArr[0] & GameDef.GAME_TYPE_NOCHAT)==false;
        if(this.m_GameClientView.m_VoiceCtrl)this.m_GameClientView.m_VoiceCtrl.node.active = (dwRulesArr[0] & GameDef.GAME_TYPE_NOVOICE)==false;
    },
    //邀请好友分享
    OnFriend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },

    OnClearScene:function (){
          //扑克控件
          this.m_GameClientView.resetView();
    },
    
    //////////////////////////////////////////////////////////////////////////

    HaveRule: function (rule) {
        return (rule & this.m_dwRules) > 0;
    },

    IsValidChairID: function (wChairID) {
        if (wChairID >= 0 && wChairID < GameDef.GAME_PLAYER) return true;
        return false;
    },
    OnSubKickShow:function(pData, wDataSize){
        this.m_wKickPlayer = this.GetMeChairID();
        for(var i = 0; i < GameDef.GAME_PLAYER;i++){
            var wView = this.SwitchViewChairID(i);

            this.m_GameClientView.m_UserInfo[wView].OnBtKickShow(true);
        }
        this.m_GameClientView.m_BtTiQian.active = true;
        return true;

    },
    
});