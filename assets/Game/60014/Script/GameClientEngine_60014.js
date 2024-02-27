//游戏时间
var IDI_GAME_CLOCK = 201; //叫分定时器

//游戏时间
var TIME_CLOCK = 5;

// 定时器ID
var IDI_OPERATE_CARD = 200;
var IDI_OUT_CARD = 201;
var IDI_CONTINUE_CARD = 202;
var IDI_SEND_CARD = 203;

// 定时器时间
var TIME_OPERATE_CARD = 15;
var TIME_OUT_CARD = 15;
var TIME_CONTINUE_CARD = 2;
var TIME_SEND_CARD = 2;

cc.Class({
    extends: cc.GameEngine,

    properties: {},

    // use this for initialization
    start: function () {
        LoadSetting();
        GameLogic = new window['GameLogic_' + GameDef.KIND_ID]();
        this.InitDiscardCard();
    },

    ctor: function () {
        //var UrlHead = 'resources/Audio/'+wKindID+'/'
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'], //.mp3
            ['BANKER', 'Banker'], //.mp3
            ['CLOCK', 'CountDown'], //.mp3
            ['WIN', 'Win'], //.mp3
            ['LOSE', 'Lose'], //.mp3
            //男
            ['M_READY', 'm/zhunbei'],
            ['M_CHI', 'm/chi'],
            ['M_CHONGPAO', 'm/chongpao'],
            ['M_CHOUWEI', 'm/chouwei'],
            ['M_FANGPAO', 'm/fangpao'],
            ['M_HU', 'm/hu'],
            ['M_HUANG', 'm/huang'],
            ['M_PAO', 'm/pao'],
            ['M_PENG', 'm/peng'],
            ['M_TI', 'm/ti'],
            ['M_WEI', 'm/wei'],
            ['M_ZIMO', 'm/zimo'],
            ['M_TIANHU', 'm/tianhu'],
            //女
            ['W_READY', 'w/zhunbei'],
            ['W_CHI', 'w/chi'],
            ['W_CHONGPAO', 'w/chongpao'],
            ['W_CHOUWEI', 'w/chouwei'],
            ['W_FANGPAO', 'w/fangpao'],
            ['W_HU', 'w/hu'],
            ['W_HUANG', 'w/huang'],
            ['W_PAO', 'w/pao'],
            ['W_PENG', 'w/peng'],
            ['W_TI', 'w/ti'],
            ['W_WEI', 'w/wei'],
            ['W_ZIMO', 'w/zimo'],
            ['W_TIANHU', 'w/tianhu'],
        );
        //短语声音
        for (var i = 1; i <= 10; ++i) {
            var FileName = (i < 10 ? '0' : '') + i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m' + i, 'm/phrase/' + FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w' + i, 'w/phrase/' + FileName];
        }

        // 牌
        for(var i = 0; i < 20; ++ i) {
            this.m_SoundArr[this.m_SoundArr.length] = ['M_CARD_' + i, 'm/card/' + i];
            this.m_SoundArr[this.m_SoundArr.length] = ['W_CARD_' + i, 'w/card/' + i];
        }

        this.m_szText = new Array(
            '快点啊，我等到花都谢了',
            '怎么断线了',
            '不要走，决战到天亮',
            '你的牌打得太好了',
            '你是妹妹还是哥哥',
            '跟你合作实在太愉快了',
            '大家好，很高兴见到各位',
            '我得离开一会',
            '不要吵，专心玩游戏'
        );
        //游戏变量
        this.m_lBaseScore = 0;
        this.m_wBankerUser = INVALID_CHAIR; //庄家用户
        this.m_cbUserCardCount = new Array(); //扑克数目
        this.m_cbUserHuXiCount = new Array(); //胡息数目
        this.m_cbTrustee = new Array();

        this.m_bOutCard = false; //出牌标志
        this.m_wResumeUser = INVALID_CHAIR; //还原用户
        this.m_wCurrentUser = INVALID_CHAIR; //当前用户

        this.m_cbWeaveItemCount = new Array(); //组合数目
        // tagWeaveItem					this.m_WeaveItemArray[3][7];				//组合扑克
        this.m_WeaveItemArray = new Array(); //组合扑克
        this.m_wOutCardUser = INVALID_CHAIR; //出牌用户
        this.m_cbOutCardData = 0; //出牌扑克
        this.m_cbCardIndex = new Array(); //手中扑克
        this.m_cbUserStatus = new Array();
        this.m_dwUserIDArray = new Array();

        return;
    },

    PlaySoundCard: function(wChairID, cbCardData) {
        if(!GameLogic.IsValidCard(cbCardData)) {
            ASSERT(false, ' In PlaySoundCard CardData Invalid [ ' + cbCardData + ' ]');
            return false;
        }
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        this.PlayActionSound(wChairID, 'CARD_' + cbIndex);
        return true;
    },

    PlaySoundOperate: function(wChairID, cbAction) {
        var szName = '';

        switch(cbAction) {
            case GameDef.ACK_TI:		szName = 'TI';		break;			//提
            case GameDef.ACK_PAO:		szName = 'PAO';		break;			//跑
            case GameDef.ACK_WEI:		szName = 'WEI';		break;			//偎
            case GameDef.ACK_CHI:		szName = 'CHI';		break;			//吃
            case GameDef.ACK_CHI_EX:	szName = 'CHI';		break;			//吃
            case GameDef.ACK_PENG:		szName = 'PENG';	break;			//碰
            case GameDef.ACK_CHIHU:		szName = 'HU';		break;			//胡
            case GameDef.ACK_WEI_CHOU:	szName = 'CHOUWEI';	break;			//臭偎

            default: szName = '';
        }
        if(szName.length > 0) {
            this.PlayActionSound(wChairID, szName);
        }
    },

    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_TING_TIP: // 听牌提示
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 听牌提示');
                return this.OnSubTingTip(pData, wDataSize);
            }
            case GameDef.SUB_S_TRUSTEE: // 玩家托管
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 玩家托管');
                return this.OnSubTrustee(pData, wDataSize);
            }
            case GameDef.SUB_S_GAME_START: //游戏开始
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 游戏开始');
                return this.OnSubGameStart(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_TI_CARD: //用户提牌
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 用户提牌');
                return this.OnSubUserTiCard(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_PAO_CARD: //用户跑牌
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 用户跑牌');
                return this.OnSubUserPaoCard(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_WEI_CARD: //用户偎牌
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 用户偎牌');
                return this.OnSubUserWeiCard(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_PENG_CARD: //用户碰牌
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 用户碰牌');
                return this.OnSubUserPengCard(pData, wDataSize);
            }
            case GameDef.SUB_S_USER_CHI_CARD: //用户吃牌
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 用户吃牌');
                return this.OnSubUserChiCard(pData, wDataSize);
            }
            case GameDef.SUB_S_OUT_CARD: //出牌消息
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 出牌消息');
                return this.OnSubOutCard(pData, wDataSize);
            }
            case GameDef.SUB_S_SEND_CARD: //发牌消息
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 发牌消息');
                return this.OnSubSendCard(pData, wDataSize);
            }
            case GameDef.SUB_S_OPERATE_NOTIFY: //操作提示
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 操作提示');
                return this.OnSubOperateNotify(pData, wDataSize);
            }
            case GameDef.SUB_S_OUT_CARD_NOTIFY: //出牌提示
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 出牌提示');
                return this.OnSubOutCardNotify(pData, wDataSize);
            }
            case GameDef.SUB_S_CHOU_CARD: // 臭牌列表
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 臭牌列表');
                return this.OnSubChouCard(pData, wDataSize);
            }
            case GameDef.SUB_S_DISCARD_CARD: // 丢弃列表
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 丢弃列表');
                return this.OnSubDiscardCard(pData, wDataSize);
            }
            case GameDef.SUB_S_GAME_END: //游戏结束
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 游戏结束');
                return this.OnSubGameEnd(pData, wDataSize);
            }
            case GameDef.SUB_S_COMMAND_RESULT: //vip消息结果
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - vip消息结果');
                return this.OnSubVipCommandResult(pData, wDataSize);
            }
            case GameDef.SUB_S_HEAP_CARD: // 牌堆扑克
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 牌堆扑克');
                return this.OnSubHeapCard(pData, wDataSize);
            }
            case GameDef.SUB_S_HAND_CARD: //手中扑克
            {
                if (window.LOG_NET_DATA) console.log(' ####### 游戏消息 - 手中扑克');
                return this.OnSubHandCard(pData, wDataSize);
            }
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if(window.LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
        switch (cbGameStatus) {
            case GameDef.GAME_STATUS_FREE: //空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    var kernel = gClientKernel.get();
                    if (!kernel.IsLookonMode()) {
                        //开始设置
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            if (!this.m_ReplayMode) this.m_GameClientView.m_BtStart.active = true;
                        }
                    }
                    if(!this.m_ReplayMode && !this.IsLookonMode()&&this.m_dwRoomID != 0){
                        this.m_GameClientView.m_BtFriend.active = this.m_wGameProgress == 0;
                    }
                    this.m_cbTrustee.fill(0);
                    this.UpdateTrusteeControl();
                    this.InitDiscardCard();
                    this.UpdateTestView();
                    return true;
                }
            case GameDef.GAME_STATUS_PLAY: //游戏状态
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

                    //设置变量
                    this.m_cbUserStatus = clone(pStatusPlay.cbUserStatus);
                    this.m_cbTrustee = clone(pStatusPlay.cbTrustee);
                    this.m_wBankerUser = pStatusPlay.wBankerUser;
                    this.m_wCurrentUser = pStatusPlay.wCurrentUser;
                    this.m_wOutCardUser = pStatusPlay.wOutCardUser;
                    this.m_cbOutCardData = pStatusPlay.cbOutCardData;
                    this.m_bOutCard = pStatusPlay.bOutCard;
                    this.m_cbLeftCardCount = pStatusPlay.cbLeftCardCount;
                    this.m_cbCardIndex = clone(pStatusPlay.cbCardIndex);
                    this.m_cbUserCardCount = clone(pStatusPlay.cbUserCardCount);
                    this.m_WeaveItemArray = clone(pStatusPlay.WeaveItemArray);
                    this.m_cbWeaveItemCount = clone(pStatusPlay.cbWeaveItemCount);

                    for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                        if(this.m_cbUserStatus[i]) this.m_dwUserIDArray[i] = this.GetUserID(i);
                        else this.m_dwUserIDArray[i] = 0;
                    }

                    if (this.GetMeChairID() == this.m_wCurrentUser) {
                        this.m_GameClientView.SetTableTips('您是当前玩家请出牌！');
                    } else if (this.m_wCurrentUser == INVALID_CHAIR) {
                        if(pStatusPlay.cbUserAction != GameDef.ACK_NULL){
                            this.m_GameClientView.SetTableTips('操作提示 [' + pStatusPlay.cbUserAction + ' ' + GameDef.ActionName(pStatusPlay.cbUserAction) + ']');
                        } else {
                            this.m_GameClientView.SetTableTips('等待玩家操作...');
                        }
                    } else {
                        this.m_GameClientView.SetTableTips('等待当前玩家出牌 [' + this.m_wCurrentUser + ']');
                    }

                    //胡息信息
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        //设置胡息
                        this.m_cbUserHuXiCount[i] = 0;
                        //胡息计算
                        for (var j = 0; j < this.m_cbWeaveItemCount[i]; j++) {
                            if(this.m_WeaveItemArray[i][j].bDisplay || this.GetMeChairID() == i)
                                this.m_cbUserHuXiCount[i] += this.m_WeaveItemArray[i][j].cbHuxi;
                        }
                    }

                    //扑克信息
                    var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
                    var cbCardCount = GameLogic.SwitchToCardData1(pStatusPlay.cbCardIndex, cbCardData, cbCardData.length);

                    //设置界面
                    this.m_GameClientView.SetLeftCardCount(pStatusPlay.cbLeftCardCount);
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser));
                    this.m_GameClientView.m_HandCardControl.SetLookModeFun(this.IsLookonMode());
                    this.SetHandCardData(true);

                    //出牌界面
                    if (this.m_wOutCardUser != INVALID_CHAIR) {
                        var wViewChairID = this.SwitchViewChairID(this.m_wOutCardUser);
                        this.m_GameClientView.SetOutCardInfo(wViewChairID, this.m_cbOutCardData, this.m_bOutCard ? 'Out' : 'Send');
                    }

                    //胡息信息
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        //设置胡息
                        this.m_cbUserHuXiCount[i] = 0;
                        //胡息计算
                        this.UpdateUserHuXiCount(i);
                    }
                    //游戏界面
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        if (!this.m_cbUserStatus[i]) continue;
                        //变量定义
                        var wViewChairID = this.SwitchViewChairID(i);

                        //设置胡息
                        this.m_GameClientView.SetUserHuXiCount(wViewChairID, this.m_cbUserHuXiCount[i]);

                        //组合界面
                        for (var j = 0; j < this.m_cbWeaveItemCount[i]; j++) {
                            if(this.GetMeChairID() == i) {
                                this.m_GameClientView.m_WeaveCard[wViewChairID][j].SetDisplayItem(true);
                            } else {
                                this.m_GameClientView.m_WeaveCard[wViewChairID][j].SetDisplayItem(this.m_WeaveItemArray[i][j].bDisplay);
                            }
                            this.m_GameClientView.m_WeaveCard[wViewChairID][j].SetCardData(this.m_WeaveItemArray[i][j]);
                        }
                    }

                    //动作界面
                    if ((pStatusPlay.cbUserAction != GameDef.ACK_NULL) && (!pStatusPlay.bResponse) && (this.IsLookonMode() == false)) {
                        ASSERT(this.m_wCurrentUser != INVALID_CHAIR, ' In OnEventSceneMessage CurrentUser Is INVALID_CHAIR');
                        this.SetGameClock(this.GetMeChairID(), IDI_OPERATE_CARD, TIME_OPERATE_CARD, TIME_OPERATE_CARD);
                        this.m_GameClientView.m_ControlWnd.SetControlInfo(this.m_cbOutCardData, pStatusPlay.cbUserAction);
                    }

                   //控件设置
                   this.m_GameClientView.m_HandCardControl.SetDisplayItem(true);
                    //设置时间
                    if (this.m_wCurrentUser != INVALID_CHAIR) {
                        if (this.m_bOutCard == true) {
                            this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD, TIME_OUT_CARD);
                            if ((this.IsLookonMode() == false) && (this.GetMeChairID() == this.m_wCurrentUser)) {
                                this.m_GameClientView.SetStatusFlag(true, false);
                                this.m_GameClientView.m_HandCardControl.SetPositively(true);
                                this.m_GameClientView.m_HandCardControl.SetOutCardTip(true);
                            }
                        } else if ((this.IsLookonMode() == false) && (this.GetMeChairID() == this.m_wCurrentUser)) {
                            // this.SendGameData(GameDef.SUB_C_CONTINUE_CARD);
                        }
                    }
                    this.UpdateTrusteeControl();
                    this.InitDiscardCard();
                    this.UpdateTestView();
                    return true;
                }
        }
        return false;
    },

    // 听牌提示
    OnSubTingTip: function (pData, wDataSize) {
        var pTingTipHead = GameDef.CMD_S_TingTipHead();
        var wOffset = gCByte.Bytes2Str(pTingTipHead, pData);
        if((pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) != wDataSize) {
            console.log('(pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) != wDataSize'
            + '【'+
                (pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) + ' != ' + wDataSize
            + '】' );

            return false;
        }
        var TingTipArray = new Array();
        for(var i = 0; i < pTingTipHead.wCount; ++ i) {
            var pTingTip = GameDef.CMD_S_TingTip();
            gCByte.Bytes2Str(pTingTip, pData, wOffset + i * pTingTipHead.wItemSize);
            TingTipArray.push(pTingTip);
        }
        this.SetTingTip(TingTipArray, pTingTipHead.cbCurrentCard, pTingTipHead.bNeedOutCard);
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

    //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart, pData)) return false;
        this.m_GameEnd = null;

        //设置数据
        this.m_wResumeUser = INVALID_CHAIR;
        this.m_wBankerUser = this.m_GameStart.wBankerUser;
        this.m_wCurrentUser = this.m_GameStart.wBankerUser;
        this.m_cbLeftCardCount = this.m_GameStart.cbLeftCardCount;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) this.m_cbUserCardCount[i] = (this.m_wBankerUser == i) ? 21 : 20;
        this.m_cbOutCardData = 0;

        //设置数据
        this.m_cbTrustee.length = GameDef.GAME_PLAYER
        this.m_cbTrustee.fill(0);
        this.m_cbCardIndex.length = GameDef.MAX_INDEX;
        this.m_cbCardIndex.fill(0);
        this.m_cbWeaveItemCount.length = GameDef.MAX_INDEX;
        this.m_cbWeaveItemCount.fill(0);
        this.m_cbUserHuXiCount.length = GameDef.GAME_PLAYER;
        this.m_cbUserHuXiCount.fill(0);
        this.m_cbUserStatus = clone(this.m_GameStart.cbUserStatus);
        this.UpdateTrusteeControl();
        this.InitDiscardCard();
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if(this.m_cbUserStatus[i]) this.m_dwUserIDArray[i] = this.GetUserID(i);
            else this.m_dwUserIDArray[i] = 0;
        }
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            this.m_WeaveItemArray[i] = new Array();
            for (var j = 0; j < GameDef.MAX_WEAVE; ++j) {
                this.m_WeaveItemArray[i][j] = GameDef.tagWeaveItem();
            }
        }

        //设置扑克
        var cbCardCount = (this.GetMeChairID() == this.m_wBankerUser) ? GameDef.MAX_CARD_COUNT : (GameDef.MAX_CARD_COUNT - 1);
        GameLogic.SwitchToCardIndex1(this.m_GameStart.cbCardData, cbCardCount, this.m_cbCardIndex);

        //设置界面
        this.SetTingTip(new Array(), 0);
        var bPlayerMode = (this.IsLookonMode() == false);
        // this.m_GameClientView.m_ScoreView.ShowWindow(false);
        if(this.m_GameClientView.m_HuAction) this.m_GameClientView.m_HuAction.node.active = false;
        this.m_GameClientView.m_XingPaiNode.active = false;
        this.m_GameClientView.m_XingCardControl.SetCardData(0, 0);
        this.m_GameClientView.m_HandCardControl.SetPositively(false);
        this.m_GameClientView.m_HandCardControl.SetOutCardTip(false);
        this.m_GameClientView.m_HandCardControl.SetDisplayItem(bPlayerMode);
        this.m_GameClientView.m_HandCardControl.SetLookModeFun(this.IsLookonMode());
        this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
        if(this.m_EndView && this.m_EndView.node) this.m_EndView.node.active = false;
        this.m_EndView = 'Waitting';
        //状态设置
        this.m_GameClientView.SetLeftCardCount(this.m_GameStart.cbLeftCardCount);
        this.m_GameClientView.SetUserHuXiCount(INVALID_CHAIR, 0);
        this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser));

        //隐藏成绩界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_GameClientView.m_BtFriend.active = false;
        this.OnMessageStart(null, true);

        // this.m_GameClientView.SetTableTips('游戏开始！');
        // if (this.GetMeChairID() == this.m_wBankerUser) {
        //     this.m_GameClientView.SetTableTips('游戏开始，您是庄家请出牌！');
        //     this.m_GameClientView.m_HandCardControl.SetPositively(true);
        //     this.m_GameClientView.m_HandCardControl.SetOutCardTip(true);
        // } else {
        //     this.m_GameClientView.m_HandCardControl.SetPositively(false);
        //     this.m_GameClientView.m_HandCardControl.SetOutCardTip(false);
        // }

        //扑克设置
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_cbUserStatus[i]) continue;
            //变量定义
            var wViewChairID = this.SwitchViewChairID(i);

            //用户扑克
            if (this.GetMeChairID() == i) {
                var cbCardCount = (i == this.m_wBankerUser) ? GameDef.MAX_CARD_COUNT : (GameDef.MAX_CARD_COUNT - 1);
                this.m_GameClientView.m_HandCardControl.SetCardData(this.m_GameStart.cbCardData, cbCardCount, 1, true);
            }

            // //旁观界面
            // if (bPlayerMode == false) {
            //     var wMeChair = this.GetMeChairID();
            //     this.m_GameClientView.m_DiscardCard[wViewChairID].SetCardData(NULL, 0);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][0].SetCardData(this.m_WeaveItemArray[wMeChair][0]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][1].SetCardData(this.m_WeaveItemArray[wMeChair][1]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][2].SetCardData(this.m_WeaveItemArray[wMeChair][2]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][3].SetCardData(this.m_WeaveItemArray[wMeChair][3]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][4].SetCardData(this.m_WeaveItemArray[wMeChair][4]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][5].SetCardData(this.m_WeaveItemArray[wMeChair][5]);
            //     this.m_GameClientView.m_WeaveCard[wViewChairID][6].SetCardData(this.m_WeaveItemArray[wMeChair][6]);
            // }
        }


        // //旁观界面
        // if (bPlayerMode==false)
        // {
        //     this.m_GameClientView.SetHuangZhuang(false);
        //     this.m_GameClientView.SetUserAction(INVALID_CHAIR,0);
        //     this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR,0);
        // }

        this.m_GameClientView.ResetView();
        this.SetGameClock(this.m_wBankerUser, IDI_OUT_CARD, TIME_OUT_CARD, TIME_OUT_CARD);

        this.scheduleOnce(this.UpdateTestView, 0.5);
        this.m_GameClientView.m_BtTidy.active = true;
        return true;
    },

    //提牌
    OnSubUserTiCard: function (pData, wDataSize) {
        var pUserTiCard = GameDef.CMD_S_UserTiCard();
        if (wDataSize != gCByte.Bytes2Str(pUserTiCard, pData)) return false;
        //执行动作
        this.ExecuteActionTiCard(pUserTiCard.wActionUser, pUserTiCard.cbActionCard, pUserTiCard.cbRemoveCount, pUserTiCard.cbHuxi, pUserTiCard.bDisplay);
        return true;
    },

    //跑牌
    OnSubUserPaoCard: function (pData, wDataSize) {
        var pUserPaoCard = GameDef.CMD_S_UserPaoCard();
        if (wDataSize != gCByte.Bytes2Str(pUserPaoCard, pData)) return false;
        //执行动作
        this.ExecuteActionPaoCard(pUserPaoCard.wActionUser, pUserPaoCard.cbActionCard, pUserPaoCard.cbRemoveCount, pUserPaoCard.cbHuxi, pUserPaoCard.bDisplay);
        return true;
    },

    //偎牌
    OnSubUserWeiCard: function (pData, wDataSize) {
        var pUserWeiCard = GameDef.CMD_S_UserWeiCard();
        if (wDataSize != gCByte.Bytes2Str(pUserWeiCard, pData)) return false;
        //执行动作
        this.ExecuteActionWeiCard(pUserWeiCard.wActionUser, pUserWeiCard.cbActionCard, pUserWeiCard.cbHuxi, pUserWeiCard.bDisplay);

        return true;
    },

    //碰牌
    OnSubUserPengCard: function (pData, wDataSize) {
        var pUserPengCard = GameDef.CMD_S_UserPengCard();
        if (wDataSize != gCByte.Bytes2Str(pUserPengCard, pData)) return false;
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        //执行动作
        this.ExecuteActionPengCard(pUserPengCard.wActionUser, pUserPengCard.cbActionCard, pUserPengCard.cbHuxi);

        return true;
    },

    //吃牌
    OnSubUserChiCard: function (pData, wDataSize) {
        var pUserChiCard = GameDef.CMD_S_UserChiCard();
        if (wDataSize != gCByte.Bytes2Str(pUserChiCard, pData)) return false;
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        //执行动作
        this.ExecuteActionChiCard(pUserChiCard.wActionUser, pUserChiCard.cbActionCard, pUserChiCard.cbResultCount, pUserChiCard.cbCardData, pUserChiCard.cbHuxi);
        return true;
    },

    //出牌
    OnSubOutCard: function (pData, wDataSize) {
        var pOutCard = GameDef.CMD_S_OutCard();
        if (wDataSize != gCByte.Bytes2Str(pOutCard, pData)) return false;
        this.m_GameClientView.m_HandCardControl.SetOutCardTip(false);
        //执行动作
        this.ExecuteActionOutCard(pOutCard.wOutCardUser, pOutCard.cbOutCardData);
        return true;
    },

    //发牌
    OnSubSendCard: function (pData, wDataSize) {
        var pSendCard = GameDef.CMD_S_SendCard();
        if (wDataSize != gCByte.Bytes2Str(pSendCard, pData)) return false;
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        //执行动作
        this.ExecuteActionSendCard(pSendCard.cbCardData, pSendCard.wAttachUser, pSendCard.bSound);
        return true;
    },

    //操作提示
    OnSubOperateNotify: function (pData, wDataSize) {
        var pOperateNotify = GameDef.CMD_S_OperateNotify();
        if (wDataSize != gCByte.Bytes2Str(pOperateNotify, pData)) return false;
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        //执行动作
        this.ExecuteActionOperateNotify(pOperateNotify.cbOperateCode, pOperateNotify.cbActionCard, pOperateNotify.wResumeUser);

        return true;
    },

    //出牌提示
    OnSubOutCardNotify: function (pData, wDataSize) {
        var pOutCardNotify = GameDef.CMD_S_OutCardNotify();
        if (wDataSize != gCByte.Bytes2Str(pOutCardNotify, pData)) return false;
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        //执行动作
        this.ExecuteActionOutCardNotify(pOutCardNotify.wCurrentUser, pOutCardNotify.bOutCard);
        return true;
    },

    // 臭牌列表
    OnSubChouCard: function (pData, wDataSize) {
        var pChouCard = GameDef.CMD_S_ChouCard();
        if (wDataSize != gCByte.Bytes2Str(pChouCard, pData)) return false;
        // for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
        //     if(!this.m_cbUserStatus[i]) continue;
        //     var wViewChairID = this.SwitchViewChairID(i);
        //     var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
        //     var cbCardCount = GameLogic.SwitchToCardData1(pChouCard.bAbandonCard[i], cbCardData, cbCardData.length);
        //     this.m_GameClientView.m_DiscardCard[wViewChairID].SetCardData(cbCardData, cbCardCount);
        // }
        return true;
    },

    OnSubDiscardCard: function (pData, wDataSize) {
        var pDiscard = GameDef.CMD_S_DiscardCard();
        // if (wDataSize != gCByte.Bytes2Str(pDiscard, pData)) return false;
        gCByte.Bytes2Str(pDiscard, pData);
        this.InitDiscardCard(pDiscard.cbCardData, pDiscard.cbCardCount);

        return true;
    },
    //游戏结束
    OnSubGameEnd: function (pData, wDataSize) {
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) {
            ASSERT(false, ' In OnSubGameEnd 效验数据 错误 wDataSize=' + wDataSize + '，local=' + gCByte.Bytes2Str(this.m_GameEnd, pData));
            return false;
        }

        this.m_GameEnd.wMeChairID = this.GetMeChairID();
        this.m_GameEnd.dwUserID = clone(this.m_dwUserIDArray);
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        this.m_GameEnd.cbCardData = new Array();
        var pos = 0;
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            this.m_GameEnd.cbCardData[i] = new Array();
            for(var j = 0; j < this.m_GameEnd.cbCardCount[i]; ++ j) {
                this.m_GameEnd.cbCardData[i][j] = this.m_GameEnd.cbCardList[pos++];
            }
        }
        //删除时间
        this.KillGameClock();

        // 播放声音
        if (this.m_GameEnd.wWinUser == INVALID_CHAIR) {
            // 流局声音
            this.PlayActionSound(this.m_GameEnd.wMeChairID, 'HUANG');
        } else {
            var wWinViewID = this.SwitchViewChairID(this.m_GameEnd.wWinUser);

            if(this.m_GameEnd.dwChiHuRight & (GameDef.CHR_TIAN_3_LONG | GameDef.CHR_TIAN_5_KAN)) {
                this.PlayActionSound(this.m_GameEnd.wWinUser, 'TIANHU');
                this.m_GameClientView.PlayHuAction(wWinViewID, 'tianhu');
            } else if (this.IsFangpao()) {
                this.PlayActionSound(this.m_GameEnd.wWinUser, 'FANGPAO');
                this.m_GameClientView.PlayHuAction(wWinViewID, 'dianpao');
            } else if(this.IsZimo()) {
                this.PlayActionSound(this.m_GameEnd.wWinUser, 'ZIMO');
                this.m_GameClientView.PlayHuAction(wWinViewID, 'zimo');
            } else {
                this.PlayActionSound(this.m_GameEnd.wWinUser, 'HU');
                this.m_GameClientView.PlayHuAction(wWinViewID, 'hupai');
            }
        }
        // this.ShowGameEndView();

        // this.ShowPrefabDLG('EndViewPrefab', this.node, function (Component) {
        //     this.m_EndView = Component;
        //     this.m_EndView.node.zIndex = 2;
        // }.bind(this), function (Component) {
        //     this.m_EndView = Component;
        //     this.m_EndView.SetAttribute({
        //         _ClientEngine:this
        //     });
        // }.bind(this));
        // if (this.m_ReplayMode) {
        //     this.OnTimeIDI_PERFORM_END()
        // } else {
        //     // 胡牌动画
        //     // 显示醒牌
        //     this.ShowFanXing(this.m_GameEnd.cbFXCard, this.m_GameEnd.cbFXCount);
        //     this.scheduleOnce(this.OnTimeIDI_PERFORM_END, 3);
        // }

        if (this.m_ReplayMode) {
            this.OnTimeIDI_PERFORM_END()
        } else {
            // 胡牌动画

            // 显示醒牌
            if(this.m_GameEnd.cbFXCount > 0) {
                this.scheduleOnce(this.OnTimeIDI_ShowFanXing, 1);
            }
            this.scheduleOnce(this.OnTimeIDI_PERFORM_END, 2);
        }
        return true;
    },

    IsFangpao: function() {
        if(this.m_GameEnd.wWinUser == INVALID_CHAIR) return false;
        if(this.m_GameEnd.bDispatch) return false;
        if (this.m_GameEnd.wProvideUser != this.m_GameEnd.wWinUser && this.m_GameEnd.wProvideUser < GameDef.GAME_PLAYER) {
            return true;
        }
        return false;
    },

    IsZimo: function() {
        if(this.m_GameEnd.wWinUser == INVALID_CHAIR) return false;
        if (this.m_GameEnd.wProvideUser == this.m_GameEnd.wWinUser || (this.m_GameEnd.wProvideUser >= GameDef.GAME_PLAYER) ) {
            return true;
        }
        return false;
    },

    OnTimeIDI_ShowFanXing: function() {
        this.m_GameClientView.m_XingPaiNode.active = true;
        this.m_GameClientView.m_XingCardControl.SetCardData(this.m_GameEnd.cbFXCard, this.m_GameEnd.cbFXCount);
    },

    //执行结束
    OnTimeIDI_PERFORM_END: function () {
        // 隐藏大局结算
        // if (this.m_REndCtrl) this.m_REndCtrl.node.active = false;
        // this.m_GameClientView.m_BtStart.node.active = true;

        this.ShowPrefabDLG('EndView_PHZ', this.node, function (Component) {
            this.m_EndView = Component;
            this.m_EndView.node.zIndex = 2;
        }.bind(this), function (Component) {
            this.m_EndView = Component;
            this.m_EndView.SetAttribute({
                _ClientEngine:this
            });
        }.bind(this));

        this.UpdateTestView();
    },

//////////////////////////////////////////////

    OnSubVipCommandResult: function(pData, wDataSize) {
        var pResult = GameDef.CMD_S_VipCommandResult();
        //效验
        // if (wDataSize != gCByte.Bytes2Str(pResult, pData)) return false;


        return true;
    },

    OnSubHeapCard: function(pData, wDataSize) {
        var pCardIndex = GameDef.CMD_S_CardIndex();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pCardIndex, pData)) return false;

        this.m_GameClientView.SetHeapCardInfo(this.m_cbCardIndex, pCardIndex.cbCardIndex);

        return true;
    },

    OnSubHandCard: function(pData, wDataSize) {
        var pCardIndex = GameDef.CMD_S_CardIndex();
        //效验
        if (wDataSize != gCByte.Bytes2Str(pCardIndex, pData)) return false;

        this.m_cbCardIndex = clone(pCardIndex.cbCardIndex);
        this.SetHandCardData(true);
        return true;
    },

    /////////////////////////////////////////////////////////////////////////////

    OnClickedTestOutCard: function() {
        this.m_GameClientView.SetOutCardInfo(0, 0x01, 'Out');
    },
    OnClickedTestDiscardCard: function() {
        this.AddDiscardCard(0, [0x01]);
    },

    //开始消息
    OnMessageStart: function (Tag, bClear) {
        // this.m_GameClientView.PlayHuAction();
        // return;
        /*
        var cbCardIndex = new Array(GameDef.MAX_INDEX);
        cbCardIndex.fill(0);
        var cbCountIndex = new Array(GameDef.MAX_INDEX);
        cbCountIndex.fill(0);
        for(var i = 0; i < GameDef.MAX_INDEX; ++ i) {
            if(i % 3 == 0) {
                cbCardIndex[i] = 1;
                cbCountIndex[i] = i;
            }
        }
        this.m_GameClientView.m_TingTipCtrl.SetTingTip(cbCardIndex, cbCountIndex);
        return;
        //*/
        /*
        this.ShowPrefabDLG('EndViewPrefab', this.node, function (Component) {
            this.m_EndView = Component;
            this.m_EndView.node.zIndex = 2;
        }.bind(this), function (Component) {
            this.m_EndView = Component;
            this.m_EndView.SetAttribute({
                _ClientEngine:this
            });
            this.m_EndView.node.zIndex = 2;
        }.bind(this));
        return;
        // */
        /* if(!this.m_cbTemp) this.m_cbTemp = 1;
        if(this.m_cbTemp == 5) {
            this.m_GameClientView.SetOutCardInfo(2);
        } else {
            this.m_GameClientView.SetOutCardInfo(2, this.m_cbTemp);
        }
        this.m_cbTemp = this.m_cbTemp % 32 + 1;
        return; */
        /*
        var cbCardData = new Array(
            0x01, 0x01, 0x01, 0x04, 0x04, 0x05, 0x05, 0x06, 0x06, 0x0A, //小写
            0x11, 0x13, 0x13, 0x13,  //大写
        );
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            this.m_GameClientView.m_DiscardCard[i].SetCardData(cbCardData, cbCardData.length);
        }
        this.m_GameClientView.m_HandCardControl.SetDisplayItem(true);
        this.m_GameClientView.m_HandCardControl.SetPositively(true);
        this.m_GameClientView.m_HandCardControl.SetCardData(cbCardData, cbCardData.length);
        return 0;
        // */
        /*var SendCardCount = 5;
        this.m_cbUserStatus = new Array(1,1,1,1,1,1,1,1,1,1);
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_cbUserStatus[i] = 1;
            this.m_cbCardCount[i] = 0;
            this.m_cbCardData[i] = new Array(1,2,3,4,5)
            this.m_GameClientView.m_UserCardType[i].SetCardType((i+8)*2+1);
        }
           //发牌动画
          this.m_GameClientView.m_SendCardCtrl.PlaySendCard(SendCardCount, this.m_cbUserStatus);

        this.m_wBankerUser = 0;
        var BanekrAniArr = new Array();
        for(var i=0;i<3;i++){
            var ViewID= this.SwitchViewChairID(i);
            BanekrAniArr.push( ViewID);
            this.m_GameClientView.m_UserInfo[ViewID].node.active = true
        }

        this.m_GameClientView.StartAni(BanekrAniArr, this.SwitchViewChairID(this.m_wBankerUser), false);
        return*/

        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        // this.m_GameClientView.HideAllGameButton();
        if(this.m_GameClientView.m_BtStart) this.m_GameClientView.m_BtStart.active = false;

        //发送消息
        if (!bClear) this.SendFrameData(SUB_GF_USER_READY);

        return 0;
    },

    // 消息
    OnMessageOutCard: function (cbCardData) {
        if (cbCardData == 0) return false;

        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        if(this.m_cbCardIndex[cbIndex] > 2) {
            this.SetHandCardData(false);
            return false;
        }

        //发送数据
        var Outcard = GameDef.CMD_C_OutCard();
        Outcard.cbCardData = cbCardData;
        this.SendGameData(GameDef.SUB_C_OUT_CARD, Outcard);
        this.m_GameClientView.m_HandCardControl.SetPositively(false);
        this.m_GameClientView.m_HandCardControl.SetOutCardTip(false);
        return true;
    },

    // 消息
    OnMessageOperate: function (cbOperateCode, cbCurrentCard) {

        //吃牌操作
        if (cbOperateCode == GameDef.ACK_CHI) {
            //获取数据
            var ChiCardInfo = new Array(6);
            for (var i = 0; i < 6; ++i) ChiCardInfo[i] = GameDef.tagChiCardInfo();
            var cbWeaveCount = GameLogic.GetActionChiCard(this.m_cbCardIndex, this.m_cbOutCardData, ChiCardInfo);
            //设置控制
            this.m_GameClientView.m_ChooseWnd.SetChooseWeave(ChiCardInfo, cbWeaveCount, cbCurrentCard);
            return 0;
        }

        //构造数据
        var OperateCard = GameDef.CMD_C_OperateCard();
        OperateCard.cbChiKind = GameDef.CK_NULL;
        OperateCard.cbOperateCode = cbOperateCode;

        if(cbOperateCode > 0 && cbOperateCode != GameDef.ACK_CHIHU) {
            var cbCardData = new Array();
            cbCardData.push(cbCurrentCard);
            cbCardData.push(cbCurrentCard);
            if(!GameLogic.IsCanOutCard(this.m_cbCardIndex, cbCardData, cbCardData.length)) {
                this.ShowTips('无可出牌，请重新选择！');
                return 1;
            }
        }

        //环境设置
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(0, 0);
        if (cbOperateCode != GameDef.ACK_NULL) this.m_GameClientView.SetStatusFlag(false, true);
        this.KillGameClock();
        // KillGameTimer((GetMeChairID()==m_wCurrentUser)?IDI_OUT_CARD:IDI_OPERATE_CARD);

        this.SendGameData(GameDef.SUB_C_OPERATE_CARD, OperateCard);
    },

    //选牌操作
    OnMessageChooseCard(cbChiKind, cbCurrentCard, takeChiWeaveArray, cbTakeChiCount) {
        // KillGameTimer((this.GetMeChairID()==m_wCurrentUser)?IDI_OUT_CARD:IDI_OPERATE_CARD);
        // 构造数据
        var OperateCard = GameDef.CMD_C_OperateCard();
        OperateCard.cbChiKind = cbChiKind;
        OperateCard.cbOperateCode = GameDef.ACK_CHI;
        OperateCard.cbTakeChiCount = cbTakeChiCount;

        // 没牌打并且不能胡 就不可以吃碰
        var cbCardData = new Array();
        GameLogic.GetWeaveCard(GameDef.ACK_CHI, cbChiKind, cbCurrentCard, cbCardData);
        for(var i in cbCardData) {
            if(cbCardData[i] == cbCurrentCard) {
                cbCardData.splice(i, 1);
                break;
            }
        }
        for(var i = 0; i < cbTakeChiCount; ++ i) {
            OperateCard.TakeChiWeave[i] = clone(takeChiWeaveArray[i]);
            for(var j in takeChiWeaveArray[i]) {
                cbCardData[cbCardData.length] = takeChiWeaveArray[i].cbCardList[j];
            }
        }
        if(!GameLogic.IsCanOutCard(this.m_cbCardIndex, cbCardData, cbCardData.length)) {
            this.ShowTips('无可出牌，请重新选择！');
            return 1;
        }

        //环境设置
        this.m_GameClientView.SetStatusFlag(false,true);
        this.KillGameClock();
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(INVALID_CHAIR, 0);

        this.SendGameData(GameDef.SUB_C_OPERATE_CARD, OperateCard);

        //设置定时器
        // SetGameTimer(m_wResumeUser,IDI_ASSISTANT_TIME,TIME_ASSISTANT_TIME);

        return 0;
    },


    //发牌完成
    OnMessageDispatchFinish: function (wChairID, CardCount, CardIndex) {
        //发牌过程
        var kernel = gClientKernel.get();
        this.m_cbCardCount[wChairID]++;
        var ViewID = this.SwitchViewChairID(wChairID)
        var CardArr = new Array();
        for (var i = 0; i < this.m_cbCardCount[wChairID]; i++) {
            if (ViewID == GameDef.MYSELF_VIEW_ID && !kernel.IsLookonMode()) {
                CardArr[i] = this.m_cbCardData[wChairID][i];
            }
        }
        // this.m_GameClientView.m_UserCardControl[ViewID].SetCardData(CardArr, this.m_cbCardCount[wChairID]);
        if (CardIndex > 0) return
        this.UpdateOpView(TIME_CLOCK, CardCount + 1);
    },

    ///////////////////////////////////////////////////////////////////////

    //切换椅子
    SwitchViewChairID2: function (wChairID) {
        if (wChairID == INVALD_CHAIR) return INVALD_CHAIR;

        var PlayerCount = GameDef.GetPlayerCount(this.m_dwRulesArr[0]);
        PlayerCount = GameDef.GAME_PLAYER;
        //转换椅子
        var wViewChairID = (parseInt(wChairID) + GameDef.GAME_PLAYER - this.GetMeChairID());

        return (wViewChairID + GameDef.MYSELF_VIEW_ID) % GameDef.GAME_PLAYER;
    },
    //设置信息
    SetViewRoomInfo: function (dwServerRules, dwRulesArray) {
        if(GameLogic.SetRules) GameLogic.SetRules(dwRulesArray[0]);
        this.m_wGameCount = GameDef.GetGameCount(dwServerRules);
        if(this.m_GameClientView.SetViewRoomInfo) this.m_GameClientView.SetViewRoomInfo(dwServerRules, dwRulesArray);
    },

    OnClearScene: function () {
        //设置界面
        //this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.OnMessageStart(null, true);
        this.SetTingTip(new Array(), 0);
        this.m_GameClientView.m_HandCardControl.SetOutCardTip(false);

        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbCardData = new Array();
        this.m_cbCardCount = new Array();
        this.m_cbUserStatus = new Array();

        if (this.m_RoomEndView) {
            this.m_RoomEndView.OnDestroy();
            this.m_RoomEndView = null;
            this.m_RoomEndInfo = null;
        }
    },


    ///////////////////////////////////////////////////////////////////////

    UpdateOpView: function (Time, SendCardCnt) {},

    ///////////////////////////////////////////////////////////////////////

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
    OnTimerMessage: function (wChairID, CountDown, nTimerID, Progress) {
        var nElapse = parseInt(CountDown / 1000) + 1;
        if (CountDown == 0) nElapse = null;
        var wViewChairID = this.SwitchViewChairID(wChairID);

        if (this.m_nElapse == null || this.m_nElapse != nElapse) {
            this.m_nElapse = nElapse;
            if (this.m_nElapse <= 5 && this.m_nElapse > 0) cc.gSoundRes.PlayGameSound("CLOCK");
        }

        this.m_GameClientView.SetUserTimer(wViewChairID, nElapse, Progress);

        if (IDI_OUT_CARD == nTimerID) {
            if (this.m_nElapse == null) {
                // this.SetGameClock(wChairID, IDI_OUT_CARD, TIME_OUT_CARD, TIME_OUT_CARD);
            }
        } else if (IDI_CONTINUE_CARD == nTimerID) {
            if (this.m_nElapse == null) {
                this.SendGameData(GameDef.SUB_C_CONTINUE_CARD);
                // this.AddDiscardCard(wChairID, this.m_cbOutCardData);
            }
        }

        // var kernel = gClientKernel.get();
        // if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;

        return true;
    },

    OnTimerFinish2: function (wChairID, nTimerID, dwFullCountDown) {
        if (IDI_OUT_CARD == nTimerID) {
            this.SetGameClock(wChairID, nTimerID, dwFullCountDown, dwFullCountDown);
        }
    },


    //////////////////////////////////////////////////////////////////////////

    //更新胡息
    UpdateUserHuXiCount: function (wChairID) {
        //胡息计算
        var cbUserHuXiCount = 0;
        for (var i = 0; i < this.m_cbWeaveItemCount[wChairID]; i++) {
            cbUserHuXiCount += this.m_WeaveItemArray[wChairID][i].cbHuxi;
        }

        //设置胡息
        this.m_cbUserHuXiCount[wChairID] = cbUserHuXiCount;

        //自己胡息
        if (this.GetMeChairID() == wChairID) {}

        // // 更新界面
        // var wViewChairID = this.SwitchViewChairID(wChairID);
        // this.m_GameClientView.SetUserHuXiCount(wViewChairID, this.m_cbUserHuXiCount[wChairID]);

        return true;
    },

    //执行动作
    ExecuteActionPaoCard: function (wChairID, cbCardData, cbRemoveCount, cbHuxi, bDisplay) {
        //明跑判断
        var bExistWeave = false;
        for (var cbIndex = 0; cbIndex < this.m_cbWeaveItemCount[wChairID]; cbIndex++) {
            //变量定义
            var wWeaveKind = this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind;
            var cbWeaveCard = this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0];

            //明跑判断
            if ((cbCardData == cbWeaveCard) && ((wWeaveKind == GameDef.ACK_PENG) || (wWeaveKind == GameDef.ACK_WEI))) {
                bExistWeave = true;
                break;
            }
        }

        //扑克数目
        this.m_cbUserCardCount[wChairID] -= cbRemoveCount;

        //扑克数据
        if ((bExistWeave == false) && (wChairID == this.GetMeChairID())) {
            var cbCardList = [cbCardData, cbCardData, cbCardData];
            GameLogic.RemoveCard3(this.m_cbCardIndex, cbCardList, cbRemoveCount);
            this.SetHandCardData(false);
        }

        //设置组合
        if (bExistWeave == false) this.m_cbWeaveItemCount[wChairID]++;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardCount = 4;
        this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind = GameDef.ACK_PAO;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[1] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[2] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[3] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbHuxi = cbHuxi;
        this.m_WeaveItemArray[wChairID][cbIndex].bDisplay = bDisplay;
        //更新胡息
        this.UpdateUserHuXiCount(wChairID);

        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //提示动作
        var ActionTip = GameDef.tagActionTip();
        ActionTip.cbIndex = cbIndex;
        ActionTip.wChairID = wChairID;
        ActionTip.cbActionFlags = GameDef.ACK_PAO;
        this.ExecuteAction(GameDef.ACTION_TIP, ActionTip);

        //提牌动作
        var ActionPaoCard = GameDef.tagActionPaoCard();
        ActionPaoCard.cbIndex = cbIndex;
        ActionPaoCard.wChairID = wChairID;
        ActionPaoCard.cbRemoveCount = cbRemoveCount;
        ActionPaoCard.cbHuXiCount = this.m_cbUserHuXiCount[wChairID];
        ActionPaoCard.bDisplay = bDisplay;
        this.ExecuteAction(GameDef.ACTION_PAO_CARD, ActionPaoCard);

        return true;
    },

    //执行动作
    ExecuteActionWeiCard: function (wChairID, cbCardData, cbHuxi, bDisplay) {
        //扑克数目
        this.m_cbUserCardCount[wChairID] -= 2;

        //扑克数据
        if (wChairID == this.GetMeChairID()) {
            var cbCardList = [cbCardData, cbCardData];
            GameLogic.RemoveCard3(this.m_cbCardIndex, cbCardList, cbCardList.length);
            this.SetHandCardData(false);
        }

        //设置组合
        var cbIndex = this.m_cbWeaveItemCount[wChairID]++;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardCount = 3;
        this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind = GameDef.ACK_WEI;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[1] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[2] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbHuxi = cbHuxi;
        this.m_WeaveItemArray[wChairID][cbIndex].bDisplay = bDisplay;

        //更新胡息
        this.UpdateUserHuXiCount(wChairID);

        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //提示动作
        var ActionTip = GameDef.tagActionTip();
        ActionTip.cbIndex = cbIndex;
        ActionTip.wChairID = wChairID;
        ActionTip.cbActionFlags = GameDef.ACK_WEI;
        this.ExecuteAction(GameDef.ACTION_TIP, ActionTip);

        //提牌动作
        var ActionWeiCard = GameDef.tagActionWeiCard();
        ActionWeiCard.cbIndex = cbIndex;
        ActionWeiCard.wChairID = wChairID;
        ActionWeiCard.cbHuXiCount = this.m_cbUserHuXiCount[wChairID];
        ActionWeiCard.bDisplay = bDisplay;
        this.ExecuteAction(GameDef.ACTION_WEI_CARD, ActionWeiCard);

        return true;
    },

    //执行动作
    ExecuteActionPengCard: function (wChairID, cbCardData, cbHuxi) {
        //扑克数目
        this.m_cbUserCardCount[wChairID] -= 2;

        //扑克数据
        if (wChairID == this.GetMeChairID()) {
            var cbCardList = [cbCardData, cbCardData];
            GameLogic.RemoveCard3(this.m_cbCardIndex, cbCardList, cbCardList.length);
            this.SetHandCardData(false);
        }

        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_OPERATE_CARD);
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //设置界面
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(INVALID_CHAIR, 0);

        //设置组合
        var cbIndex = this.m_cbWeaveItemCount[wChairID]++;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardCount = 3;
        this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind = GameDef.ACK_PENG;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[1] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[2] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbHuxi = cbHuxi;
        this.m_WeaveItemArray[wChairID][cbIndex].bDisplay = true;

        //更新胡息
        this.UpdateUserHuXiCount(wChairID);

        //提示动作
        var ActionTip = GameDef.tagActionTip();
        ActionTip.cbIndex = cbIndex;
        ActionTip.wChairID = wChairID;
        ActionTip.cbActionFlags = GameDef.ACK_PENG;
        this.ExecuteAction(GameDef.ACTION_TIP, ActionTip);

        //提牌动作
        var ActionPengCard = GameDef.tagActionPengCard();
        ActionPengCard.cbIndex = cbIndex;
        ActionPengCard.wChairID = wChairID;
        ActionPengCard.cbHuXiCount = this.m_cbUserHuXiCount[wChairID];
        this.ExecuteAction(GameDef.ACTION_PENG_CARD, ActionPengCard);

        return true;
    },

    //执行动作
    ExecuteActionChiCard: function (wChairID, cbCardData, cbResultCount, cbResultData, cbHuxi) {
        //变量定义
        var cbFirstIndex = this.m_cbWeaveItemCount[wChairID];

        //扑克数目
        this.m_cbUserCardCount[wChairID] -= cbResultCount * 3 - 1;

        //设置组合
        for (var k = 0; k < cbResultCount; k++) {
            var cbIndex = this.m_cbWeaveItemCount[wChairID]++;
            this.m_WeaveItemArray[wChairID][cbIndex].cbCardCount = 3;
            this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind = GameDef.ACK_CHI;
            this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard = cbCardData;
            this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0] = cbResultData[k][0];
            this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[1] = cbResultData[k][1];
            this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[2] = cbResultData[k][2];
            this.m_WeaveItemArray[wChairID][cbIndex].cbHuxi = cbHuxi[k];
            this.m_WeaveItemArray[wChairID][cbIndex].bDisplay = true;
        }

        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_OPERATE_CARD);
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //设置界面
        this.m_GameClientView.m_ChooseWnd.SetChooseWeave(0, 0);
        this.m_GameClientView.m_ControlWnd.SetControlInfo(INVALID_CHAIR, 0);

        //更新胡息
        this.UpdateUserHuXiCount(wChairID);

        //删除扑克
        if (wChairID == this.GetMeChairID()) {
            var cbDebarCard = cbCardData;
            for (var k = 0; k < cbResultCount; k++) {
                for (var l = 0; l < 3; l++) {
                    var cbRemoveCard = cbResultData[k][l];
                    if (cbRemoveCard == cbDebarCard) cbDebarCard = 0;
                    else this.m_cbCardIndex[GameLogic.SwitchToCardIndex(cbRemoveCard)]--;
                }
            }
            this.SetHandCardData(false);
        }
        //提示动作
        var ActionTip = GameDef.tagActionTip();
        ActionTip.cbIndex = cbIndex;
        ActionTip.wChairID = wChairID;
        ActionTip.cbActionFlags = GameDef.ACK_CHI;
        this.ExecuteAction(GameDef.ACTION_TIP, ActionTip);
        //吃牌动作
        var ActionChiCard = GameDef.tagActionChiCard();
        ActionChiCard.wChairID = wChairID;
        ActionChiCard.cbIndex = cbFirstIndex;
        ActionChiCard.cbActionCard = cbCardData;
        ActionChiCard.cbResultCount = cbResultCount;
        ActionChiCard.cbHuXiCount = this.m_cbUserHuXiCount[wChairID];
        // CopyMemory(ActionChiCard.cbCardData,cbResultData,sizeof(BYTE)*3*cbResultCount);
        ActionChiCard.cbCardData = clone(cbResultData);
        //执行动作
        this.ExecuteAction(GameDef.ACTION_CHI_CARD, ActionChiCard);

        return true;
    },

    //执行动作
    ExecuteActionTiCard: function (wChairID, cbCardData, cbRemoveCount, cbHuxi, bDisplay) {
        //明跑判断
        var bExistWeave = false;
        for (var cbIndex = 0; cbIndex < this.m_cbWeaveItemCount[wChairID]; cbIndex++) {
            //变量定义
            var wWeaveKind = this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind;
            var cbWeaveCard = this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0];

            //明跑判断
            if ((cbCardData == cbWeaveCard) && ((wWeaveKind == GameDef.ACK_PENG) || (wWeaveKind == GameDef.ACK_WEI))) {
                bExistWeave = true;
                break;
            }
        }

        //扑克数目
        this.m_cbUserCardCount[wChairID] -= cbRemoveCount;

        //扑克数据
        if (wChairID == this.GetMeChairID()) {
            var cbCardList = [cbCardData, cbCardData, cbCardData, cbCardData];
            GameLogic.RemoveCard3(this.m_cbCardIndex, cbCardList, cbRemoveCount);
            this.SetHandCardData(false);
        }

        //设置组合
        if (bExistWeave == false) this.m_cbWeaveItemCount[wChairID]++;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardCount = 4;
        this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind = GameDef.ACK_TI;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[0] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[1] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[2] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbCardList[3] = cbCardData;
        this.m_WeaveItemArray[wChairID][cbIndex].cbHuxi = cbHuxi;
        this.m_WeaveItemArray[wChairID][cbIndex].bDisplay = bDisplay;

        //更新胡息
        this.UpdateUserHuXiCount(wChairID);

        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //提示动作
        var ActionTip = GameDef.tagActionTip();
        ActionTip.cbIndex = cbIndex;
        ActionTip.wChairID = wChairID;
        ActionTip.cbActionFlags = GameDef.ACK_TI;
        this.ExecuteAction(GameDef.ACTION_TIP, ActionTip);

        //提牌动作
        var ActionTiCard = GameDef.tagActionTiCard();
        ActionTiCard.cbIndex = cbIndex;
        ActionTiCard.wChairID = wChairID;
        ActionTiCard.cbRemoveCount = cbRemoveCount;
        ActionTiCard.cbHuXiCount = this.m_cbUserHuXiCount[wChairID];
        ActionTiCard.bDisplay = bDisplay;
        this.ExecuteAction(GameDef.ACTION_TI_CARD, ActionTiCard);

        return true;
    },

    //执行动作
    ExecuteActionOutCardNotify: function (wCurrentUser, bOutCard) {
        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //出牌提示
        var ActionOutCardNotify = GameDef.tagActionOutCardNotify();
        ActionOutCardNotify.bOutCard = bOutCard;
        ActionOutCardNotify.wCurrentUser = wCurrentUser;
        this.ExecuteAction(GameDef.ACTION_OUT_CARD_NOTIFY, ActionOutCardNotify);

        return true;
    },

    //执行动作
    ExecuteActionOperateNotify: function (cbOperateCode, cbOperateCard, wResumeUser) {
        //操作提示
        var ActionOperateNotify = GameDef.tagActionOperateNotify();
        ActionOperateNotify.wResumeUser = wResumeUser;
        ActionOperateNotify.cbOperateCode = cbOperateCode;
        ActionOperateNotify.cbCurrentCard = cbOperateCard;
        this.ExecuteAction(GameDef.ACTION_OPERATE_NOTIFY, ActionOperateNotify);

        return true;
    },

    //执行动作
    ExecuteActionOutCard(wOutCardUser, cbOutCardData) {
        //删除扑克
        if ((this.GetMeChairID() != wOutCardUser) || (this.IsLookonMode() == true)) {
            this.m_cbUserCardCount[wOutCardUser]--;
        }
        if (this.GetMeChairID() == wOutCardUser) {
            GameLogic.RemoveCard2(this.m_cbCardIndex, cbOutCardData);
            this.SetHandCardData(false);
        }

        //出牌动作
        var ActionOutCard = GameDef.tagActionOutCard();
        ActionOutCard.wOutCardUser = wOutCardUser;
        ActionOutCard.cbOutCardData = cbOutCardData;
        this.ExecuteAction(GameDef.ACTION_OUT_CARD, ActionOutCard);

        return true;
    },

    //执行动作
    ExecuteActionSendCard: function (cbCardData, wAttachUser, bSound) {
        //删除定时器
        this.KillGameClock();
        // KillGameTimer(IDI_ASSISTANT_TIME);

        //发牌动作
        var ActionSendCard = GameDef.tagActionSendCard();
        ActionSendCard.wAttachUser = wAttachUser;
        ActionSendCard.cbSendCardData = cbCardData;
        ActionSendCard.bSound = bSound;
        this.ExecuteAction(GameDef.ACTION_SEND_CARD, ActionSendCard);

        return true;
    },

    //执行动作
    ExecuteAction: function (cbActionKind, pActionInfo, wDataSize) {
        // //效验状态
        // ASSERT(m_wActionCount<CountArray(m_UserActionArray));
        // ASSERT(wDataSize<=sizeof(m_UserActionArray[m_wActionCount].cbActionBuffer));
        // if (m_wActionCount>=CountArray(m_UserActionArray)) return false;
        // if (wDataSize>sizeof(m_UserActionArray[m_wActionCount].cbActionBuffer)) return false;

        // //设置提示
        // m_UserActionArray[m_wActionCount].cbActionKind=cbActionKind;
        // CopyMemory(m_UserActionArray[m_wActionCount++].cbActionBuffer,pActionInfo,wDataSize);

        // //设置定时器
        // if (m_wActionCount==1) SetTimer(IDI_USER_ACTION,TIME_USER_ACTION,NULL);

        //动作处理
        switch (cbActionKind) {
            case GameDef.ACTION_TIP: //提示动作
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_TIP: //提示动作')
                    //变量定义
                    // tagActionTip * pActionTip=(tagActionTip *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionTip = pActionInfo;
                    //设置界面
                    var cbIndex = pActionTip.cbIndex;
                    var wChairID = pActionTip.wChairID;
                    var wViewChairID = this.SwitchViewChairID(wChairID);
                    this.m_GameClientView.SetTableTips(' 玩家 [' + wChairID + '] 提示');

                    var bDisplay = true;
                    if(pActionTip.cbActionFlags == GameDef.ACTION_WEI_CARD) {
                        if (wChairID == this.GetMeChairID()) bDisplay = true;
                        else bDisplay = false;
                    }

                    this.m_GameClientView.SetUserAction(wViewChairID, pActionTip.cbActionFlags, cbIndex, this.m_WeaveItemArray[wChairID][cbIndex], bDisplay);
                    break;
                }
            case GameDef.ACTION_TI_CARD: //提牌动作
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_TI_CARD: //提牌动作')
                    //变量定义
                    // tagActionTiCard * pActionTiCard=(tagActionTiCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionTiCard = pActionInfo;
                    //辅助变量
                    var cbIndex = pActionTiCard.cbIndex;
                    var wChairID = pActionTiCard.wChairID;
                    var bDisplay = pActionTiCard.bDisplay;
                    var wViewChairID = this.SwitchViewChairID(wChairID);
                    this.m_GameClientView.SetTableTips(' 玩家 [' + wChairID + '] 提牌 [' +
                    GameDef.CardDataName(this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard) + ']');
                    this.PlaySoundOperate(wChairID, this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind);
                    //设置变量
                    this.m_cbOutCardData = 0;
                    this.m_wOutCardUser = INVALID_CHAIR;

                    //组合界面
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetDisplayItem(bDisplay);
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetCardData(this.m_WeaveItemArray[wChairID][cbIndex]);
                    // RemoveControlCard(wChairID,this.m_WeaveItemArray[wChairID][cbIndex].cbCardList,pActionTiCard.cbRemoveCount);

                    //设置界面
                    this.m_GameClientView.SetStatusFlag(false, false);
                    this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetUserAction(INVALID_CHAIR, GameDef.ACK_NULL);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, pActionTiCard.cbHuXiCount, bDisplay);

                    break;
                }
            case GameDef.ACTION_PAO_CARD: //跑牌动作
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_PAO_CARD: //跑牌动作')
                    //变量定义
                    // tagActionPaoCard * pActionPaoCard=(tagActionPaoCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionPaoCard = pActionInfo;

                    //辅助变量
                    var cbIndex = pActionPaoCard.cbIndex;
                    var wChairID = pActionPaoCard.wChairID;
                    var wViewChairID = this.SwitchViewChairID(wChairID);
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  wChairID + '] 跑牌 [' +
                    GameDef.CardDataName(this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard) + ']');
                    this.PlaySoundOperate(wChairID, this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind);

                    //设置变量
                    this.m_cbOutCardData = 0;
                    this.m_wOutCardUser = INVALID_CHAIR;

                    //组合界面
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetCardData(this.m_WeaveItemArray[wChairID][cbIndex]);
                    // RemoveControlCard(wChairID,this.m_WeaveItemArray[wChairID][cbIndex].cbCardList,pActionPaoCard.cbRemoveCount);

                    //设置界面
                    this.m_GameClientView.SetStatusFlag(false, false);
                    this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetUserAction(INVALID_CHAIR, GameDef.ACK_NULL);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, pActionPaoCard.cbHuXiCount);

                    break;
                }
            case GameDef.ACTION_WEI_CARD: //偎牌动作
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_WEI_CARD: //偎牌动作')
                    //变量定义
                    // tagActionWeiCard * pActionWeiCard=(tagActionWeiCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionWeiCard = pActionInfo;

                    //辅助变量
                    var cbIndex = pActionWeiCard.cbIndex;
                    var wChairID = pActionWeiCard.wChairID;
                    var bDisplay = pActionWeiCard.bDisplay;
                    var wViewChairID = this.SwitchViewChairID(wChairID);
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  wChairID + '] 偎牌 [' + GameDef.CardDataName(this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard) + ']');
                    this.PlaySoundOperate(wChairID, this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind);

                    //组合界面
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetDisplayItem(bDisplay);
                    // RemoveControlCard(wChairID,this.m_WeaveItemArray[wChairID][cbIndex].cbCardList,2);
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetCardData(this.m_WeaveItemArray[wChairID][cbIndex]);

                    //增加胡息
                    var cbUserHuXi = GameLogic.GetWeaveHuXi(this.m_WeaveItemArray[wChairID][cbIndex]);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, this.m_GameClientView.m_cbUserHuXiCount[wViewChairID] + cbUserHuXi);

                    //出牌信息
                    this.m_cbOutCardData = 0;
                    this.m_wOutCardUser = INVALID_CHAIR;

                    //界面设置
                    this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetUserAction(INVALID_CHAIR, GameDef.ACK_NULL);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, pActionWeiCard.cbHuXiCount);

                    break;
                }
            case GameDef.ACTION_PENG_CARD: //碰牌动作
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_PENG_CARD: //碰牌动作')
                    //变量定义
                    // tagActionPengCard * pActionPengCard=(tagActionPengCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionPengCard = pActionInfo;

                    //辅助变量
                    var cbIndex = pActionPengCard.cbIndex;
                    var wChairID = pActionPengCard.wChairID;
                    var wViewChairID = this.SwitchViewChairID(wChairID);

                    //出牌信息
                    this.m_cbOutCardData = 0;
                    this.m_wOutCardUser = INVALID_CHAIR;
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  wChairID + '] 碰牌 [' + GameDef.CardDataName(this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard) + ']');
                    this.PlaySoundOperate(wChairID, this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind);

                    //组合界面
                    // RemoveControlCard(wChairID,this.m_WeaveItemArray[wChairID][cbIndex].cbCardList,2);
                    this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex].SetCardData(this.m_WeaveItemArray[wChairID][cbIndex]);

                    //界面设置
                    this.m_GameClientView.SetStatusFlag(false, false);
                    this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetUserAction(INVALID_CHAIR, GameDef.ACK_NULL);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, pActionPengCard.cbHuXiCount);

                    break;
                }
            case GameDef.ACTION_CHI_CARD: //用户吃牌
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_CHI_CARD: //用户吃牌')
                    //变量定义
                    // tagActionChiCard * pActionChiCard=(tagActionChiCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionChiCard = pActionInfo;

                    //辅助变量
                    var cbIndex = pActionChiCard.cbIndex;
                    var wChairID = pActionChiCard.wChairID;
                    var wViewChairID = this.SwitchViewChairID(wChairID);
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  wChairID + '] 吃牌 [' +
                    GameDef.CardDataName(this.m_WeaveItemArray[wChairID][cbIndex].cbCenterCard) + ']');
                    this.PlaySoundOperate(wChairID, this.m_WeaveItemArray[wChairID][cbIndex].wWeaveKind);

                    //出牌信息
                    this.m_cbOutCardData = 0;
                    this.m_wOutCardUser = INVALID_CHAIR;

                    //组合界面
                    var cbUserHuXi = 0;
                    for (var i = 0; i < pActionChiCard.cbResultCount; i++) {
                        cbUserHuXi += GameLogic.GetWeaveHuXi(this.m_WeaveItemArray[wChairID][cbIndex + i]);
                        this.m_GameClientView.m_WeaveCard[wViewChairID][cbIndex + i].SetCardData(this.m_WeaveItemArray[wChairID][cbIndex + i]);
                    }

                    //删除准备
                    var cbRemoveCount = 0;
                    var cbRemoveCard = new Array(GameDef.MAX_CARD_COUNT);
                    var cbDebarCard = pActionChiCard.cbActionCard;
                    for (var j = 0; j < pActionChiCard.cbResultCount; j++) {
                        for (var l = 0; l < 3; l++) {
                            var cbCurrentCard = pActionChiCard.cbCardData[j][l];
                            if (cbCurrentCard == cbDebarCard) cbDebarCard = 0;
                            else cbRemoveCard[cbRemoveCount++] = cbCurrentCard;
                        }
                    }

                    //删除扑克
                    ASSERT(cbRemoveCount == (pActionChiCard.cbResultCount * 3 - 1), ' In ExecuteAction 用户吃牌 cbRemoveCount = ' + cbRemoveCount + '; pActionChiCard.cbResultCount*3-1 =' + (pActionChiCard.cbResultCount * 3 - 1));
                    // RemoveControlCard(wChairID,cbRemoveCard,pActionChiCard.cbResultCount*3-1);

                    //界面设置
                    this.m_GameClientView.SetStatusFlag(false, false);
                    this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetUserAction(INVALID_CHAIR, GameDef.ACK_NULL);
                    this.m_GameClientView.SetUserHuXiCount(wViewChairID, pActionChiCard.cbHuXiCount);

                    break;
                }
            case GameDef.ACTION_OUT_CARD: //用户出牌
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_OUT_CARD: //用户出牌')
                    //变量定义
                    // tagActionOutCard * pActionOutCard=(tagActionOutCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionOutCard = pActionInfo;

                    //设置变量
                    this.m_bOutCard = false;
                    this.m_wCurrentUser = INVALID_CHAIR;
                    // this.m_cbOutCardData = pActionInfo.cbOutCardData;
                    // this.m_wOutCardUser = pActionInfo.wOutCardUser;
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  pActionInfo.wOutCardUser + '] 出牌  [' + pActionInfo.cbOutCardData + ' ' + GameDef.CardDataName(pActionInfo.cbOutCardData) + ']');

                    //扑克收集
                    if (this.m_wOutCardUser < GameDef.GAME_PLAYER) {
                        this.AddDiscardCard(this.m_wOutCardUser, this.m_cbOutCardData);
                    }

                    //出牌信息
                    this.m_wOutCardUser = pActionOutCard.wOutCardUser;
                    this.m_cbOutCardData = pActionOutCard.cbOutCardData;
                    this.PlaySoundCard(this.m_wOutCardUser, this.m_cbOutCardData);

                    //界面设置
                    // if ((this.GetMeChairID() != this.m_wOutCardUser) || (this.IsLookonMode() == true)) {
                        //设置扑克
                        var cbRemoveCard = [this.m_cbOutCardData];
                        // RemoveControlCard(pActionOutCard.wOutCardUser,cbRemoveCard,cbRemoveCard.length);

                        //设置界面
                        this.KillGameClock();
                        // KillGameTimer(IDI_OUT_CARD);
                        this.m_GameClientView.SetUserAction(INVALID_CHAIR, 0);
                        this.m_GameClientView.SetOutCardInfo(this.SwitchViewChairID(this.m_wOutCardUser), this.m_cbOutCardData, 'Out');

                        //播放声音 TODO:
                        // PlayGameSound(AfxGetInstanceHandle(),TEXT("OUT_CARD"));
                    // }

                    break;
                }
            case GameDef.ACTION_SEND_CARD: //发牌处理
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_SEND_CARD: //发牌处理')
                    //变量定义
                    // tagActionSendCard * pActionSendCard=(tagActionSendCard *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionSendCard = pActionInfo;

                    //扑克收集
                    if (this.m_wOutCardUser < GameDef.GAME_PLAYER) {
                        var wViewChairID = this.SwitchViewChairID(this.m_wOutCardUser);
                        this.AddDiscardCard(this.m_wOutCardUser, this.m_cbOutCardData);
                    }

                    //出牌信息
                    this.m_wOutCardUser = pActionSendCard.wAttachUser;
                    this.m_cbOutCardData = pActionSendCard.cbSendCardData;
                    this.m_GameClientView.SetTableTips(' 玩家 [' +  this.m_wOutCardUser + '] 发牌  [' + this.m_cbOutCardData + ' ' + GameDef.CardDataName(this.m_cbOutCardData) + ']');
                    if(pActionSendCard.bSound == true) this.PlaySoundCard(this.m_wOutCardUser, this.m_cbOutCardData);

                    //发牌界面
                    var wViewChairID = this.SwitchViewChairID(this.m_wOutCardUser);
                    if(pActionSendCard.bSound == true) this.m_GameClientView.SetOutCardInfo(wViewChairID, this.m_cbOutCardData, 'Send');
                    else this.m_GameClientView.SetOutCardInfo(INVALID_CHAIR, 0);
                    this.m_GameClientView.SetLeftCardCount(--this.m_cbLeftCardCount);

                    //播放声音 TODO:
                    // PlayGameSound(AfxGetInstanceHandle(),TEXT("OUT_CARD"));

                    // this.SetGameClock(this.m_wOutCardUser, IDI_SEND_CARD, TIME_SEND_CARD, TIME_SEND_CARD);

                    break;
                }
            case GameDef.ACTION_OPERATE_NOTIFY: //操作提示
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_OPERATE_NOTIFY: //操作提示')
                    //变量定义
                    // tagActionOperateNotify * pActionOperateNotify=(tagActionOperateNotify *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionOperateNotify = pActionInfo;

                    //设置变量
                    this.m_bOutCard = false;
                    this.m_wCurrentUser = INVALID_CHAIR;
                    this.m_wResumeUser = pActionOperateNotify.wResumeUser;

                    //用户界面
                    if ((this.IsLookonMode() == false) && (pActionOperateNotify.cbOperateCode != GameDef.ACK_NULL)) {
                        //获取变量
                        var cbOperateCode = pActionOperateNotify.cbOperateCode;
                        var cbCurrentCard = pActionOperateNotify.cbCurrentCard;

                        //设置界面
                        // ActiveGameFrame();
                        // SetGameTimer(GetMeChairID(),IDI_OPERATE_CARD,TIME_OPERATE_CARD);
                        this.SetGameClock(this.GetMeChairID(), IDI_OPERATE_CARD, TIME_OPERATE_CARD, TIME_OPERATE_CARD);
                        this.m_GameClientView.m_ControlWnd.SetControlInfo(cbCurrentCard, cbOperateCode);
                        this.m_GameClientView.SetTableTips('操作提示 [' + pActionOperateNotify.cbOperateCode + ' ' + GameDef.ActionName(pActionOperateNotify.cbOperateCode) + ']');
                    } else {
                        this.m_GameClientView.SetTableTips('等待玩家操作...');
                    }
                    // else SetGameTimer(this.m_wResumeUser,IDI_ASSISTANT_TIME,TIME_ASSISTANT_TIME);

                    break;
                }
            case GameDef.ACTION_OUT_CARD_NOTIFY: //出牌提示
                {
                    if(window.LOG_NET_DATA) console.log(' ExecuteAction ACTION_OUT_CARD_NOTIFY: //出牌提示')
                    //变量定义
                    // tagActionOutCardNotify * pActionOutCardNotify=(tagActionOutCardNotify *)(m_UserActionArray[0].cbActionBuffer);
                    var pActionOutCardNotify = pActionInfo;

                    //设置变量
                    this.m_bOutCard = false;
                    this.m_wCurrentUser = pActionOutCardNotify.wCurrentUser;

                    //设置界面
                    if(pActionOutCardNotify.bOutCard) {
                        if ((this.m_wCurrentUser == this.GetMeChairID()) && (this.IsLookonMode() == false)) {
                            this.m_bOutCard = true;
                            // ActiveGameFrame();
                            this.m_GameClientView.SetTableTips('您是当前玩家请出牌！');
                            this.m_GameClientView.SetStatusFlag(true, false);
                            this.m_GameClientView.m_HandCardControl.SetPositively(true);
                            this.m_GameClientView.m_HandCardControl.SetOutCardTip(true);
                        } else {
                            this.m_GameClientView.SetTableTips('等待当前玩家出牌 [' + this.m_wCurrentUser + ']');
                        }
                    }
                    //设置时间
                    if (!pActionOutCardNotify.bOutCard) {
                        if ((this.m_wCurrentUser == this.GetMeChairID()) && (this.IsLookonMode() == false)) {
                            // this.SetGameClock(this.m_wCurrentUser, IDI_CONTINUE_CARD, TIME_CONTINUE_CARD, TIME_CONTINUE_CARD);
                            // this.SendGameData(GameDef.SUB_C_CONTINUE_CARD);
                        }
                    } else {
                        //   SetGameTimer(m_wCurrentUser,IDI_OUT_CARD,TIME_OUT_CARD);
                        this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD, TIME_OUT_CARD);
                    }
                    break;
                }
        }

        return true;
    },

    SetHandCardData: function(bSortData) {
        var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
        var cbCardCount = GameLogic.SwitchToCardData1(this.m_cbCardIndex, cbCardData, cbCardData.length);
        this.m_GameClientView.m_HandCardControl.SetCardData(cbCardData, cbCardCount, 1, bSortData);
    },

    SetTingTip: function(TingTipArray, cbCurrentCard, bNeedOutCard) {
        if(!TingTipArray) this.m_TingTipArray = new Array();
        else this.m_TingTipArray = clone(TingTipArray);
        var cbTingCard = new Array();
        for(var i in this.m_TingTipArray) {
            cbTingCard.push(GameLogic.SwitchToCardData(this.m_TingTipArray[i].cbTingIndex));
        }
        this.m_GameClientView.m_TingTipCtrl.SetTingTipArray(this.m_TingTipArray, cbCurrentCard, bNeedOutCard);
        this.m_GameClientView.m_HandCardControl.SetTingTip(cbTingCard);
        this.OnHitShowTingTip(0);
    },

    OnHitShowTingTip: function(cbCardData) {
        this.m_GameClientView.m_TingTipCtrl.ShowTingTip(cbCardData);
    },

    InitDiscardCard: function(cbDiscardCard, cbDiscardCount) {
        this.m_cbDiscardCount = new Array();
        this.m_cbDiscardCard = new Array();
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            this.m_cbDiscardCard[i] = new Array(GameDef.FULL_COUNT);
            this.m_cbDiscardCard[i].fill(0);
            this.m_cbDiscardCount[i] = 0;
        }

        if(cbDiscardCard && cbDiscardCount) {
            var pos = 0;
            for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
                this.m_cbDiscardCount[i] = cbDiscardCount[i];
                for(var j = 0; j < cbDiscardCount[i]; ++ j) {
                    this.m_cbDiscardCard[i][j] = cbDiscardCard[pos++];
                }
            }
        }

        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            if(!this.m_cbUserStatus[i]) continue;
            var wViewChairID = this.SwitchViewChairID(i);
            this.m_GameClientView.m_DiscardCard[wViewChairID].SetCardData(this.m_cbDiscardCard[i], this.m_cbDiscardCount[i]);
        }
    },

    AddDiscardCard: function(wChairID, cbCardData) {
        if(!GameLogic.IsValidCard(cbCardData)) return;
        this.m_cbDiscardCard[wChairID][this.m_cbDiscardCount[wChairID]++] = cbCardData;
        var wViewChairID = this.SwitchViewChairID(wChairID);
        this.m_GameClientView.AddDiacard(wViewChairID, [cbCardData]);
        this.m_GameClientView.m_DiscardCard[wViewChairID].AddCard(cbCardData);
    },

    UpdateTrusteeControl: function() {
        this.m_GameClientView.m_TrusteeNode.active = true;
        var wMeChairID = this.GetMeChairID();
        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserTrustee(wViewID, this.m_cbTrustee[i]);
        }
        this.m_GameClientView.m_BtTrustee.node.active = (this.m_cbTrustee[wMeChairID] == 1 ? false : true);
    },

    /////////////////////////////////////////////////////////////////////////

    OnMessageTestCard: function () {
        this.OnMessageCommand(arguments[0], arguments[1]);
    },

    OnMessageCommand: function (wSubID, pData) {
        var pCommand = GameDef.CMD_C_Command();
        pCommand.wSubID = arguments[0];
        pCommand.pData = arguments[1];
        this.SendGameData(GameDef.SUB_C_COMMAND, pCommand);
    },

    //拖管控制
    OnMessageTrustee: function (wParam, lParam) {
        this.SendGameData(GameDef.SUB_C_TRUSTEE);
        return 0;
    },

    /////////////////////////////////////////////////////////////////////////

    update: function() {
        if(this.m_GameClientView.m_TestNode && this.m_GameClientView.m_TestNode.active && this.m_UpdateCount > 0) {
            this.m_UpdateCount --;

            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            var pAutoStart = this.$('AutoStart@Toggle', this.m_GameClientView.m_TestNode);
            var pAutoTrustee = this.$('AutoTrustee@Toggle', this.m_GameClientView.m_TestNode);

            var nAutoStart = cc.sys.localStorage.getItem(window.QPName + window.LOGIN_SERVER_IP + 'GameTest_' + "AutoStart_" + pGlobalUserData.dwUserID);
            if(nAutoStart == 1) pAutoStart.isChecked = true;
            else pAutoStart.isChecked = false;
            var nAutoTrustee = cc.sys.localStorage.getItem(window.QPName + window.LOGIN_SERVER_IP + 'GameTest_' + "AutoTrustee_" + pGlobalUserData.dwUserID);
            if(nAutoTrustee == 1) pAutoTrustee.isChecked = true;
            else pAutoTrustee.isChecked = false;
            this.UpdateTestView();
        } else {

        }
    },

    UpdateTestView: function() {
        this.m_UpdateCount = 0;
        if(!this.m_GameClientView.m_TestNode || !this.m_GameClientView.m_TestNode.active) {
            this.m_UpdateCount = 2;
            return;
        }
        if(this.m_UpdateCount > 0) return;

        // this.m_GameClientView.m_TestNode.active = true;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var pAutoStart = this.$('AutoStart@Toggle', this.m_GameClientView.m_TestNode);
        var pAutoTrustee = this.$('AutoTrustee@Toggle', this.m_GameClientView.m_TestNode);

        // 自动开始
        if(this.GetGameStatus() == GameDef.GAME_SCENE_FREE) {
            if(pAutoStart && pAutoStart.isChecked) this.OnMessageStart(0, 0);
        }
        // 自动托管
        if(this.GetGameStatus() == GameDef.GAME_SCENE_PLAY) {
            if(pAutoTrustee && pAutoTrustee.isChecked && !this.m_cbTrustee[this.GetMeChairID()]) this.OnMessageTrustee(0, 0);
        }
    },

    OnClickedTestToggle: function(event, customData) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        cc.sys.localStorage.setItem(window.QPName + window.LOGIN_SERVER_IP + 'GameTest_' + event.node.name + '_' + pGlobalUserData.dwUserID, event.isChecked ? 1 : 0);
        this.scheduleOnce(this.UpdateTestView, 0.1);
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
    //邀请好友分享
    OnFriend :function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },
    // 获取座位
    GetUserID: function (wChairID) {
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            if (i != wChairID) continue;
            var pIClientUserItem = this.GetClientUserItem(i);
            if (!pIClientUserItem) continue;
            return pIClientUserItem.GetUserID();
        }
        return 0;
    },

    //切换椅子
    SwitchViewChairID: function (wChairID) {
        var MeChairID = this.GetMeChairID();
        if (wChairID == INVALD_CHAIR || MeChairID == INVALD_CHAIR) return INVALD_CHAIR;

        if (this.SwitchViewChairID2) return this.SwitchViewChairID2(wChairID);
        // //转换椅子
        // var wViewChairID = (wChairID + GameDef.GAME_PLAYER - this.GetMeChairID());
        // return (wViewChairID + GameDef.MYSELF_VIEW_ID) % GameDef.GAME_PLAYER;

        var pCount = GameDef.GamePlayerCount(this.m_dwRules);
        pCount = GameDef.GAME_PLAYER;
        //转换椅子
        var wViewChairID = (wChairID + pCount - this.GetMeChairID());
        return (wViewChairID + GameDef.MYSELF_VIEW_ID) % pCount;
    },
    checkTotalEnd: function (bNext) {
        if (this.m_RoomEndInfo) {
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
});
