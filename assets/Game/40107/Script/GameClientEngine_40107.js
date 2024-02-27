var CGameLogic = require("GameLogic_40107");

//游戏时间
var IDI_OUT_CARD = 200;						//出牌定时器
var IDI_START_GAME = 201;					//开始定时器
var IDI_CALL_SCORE = 202;					//叫分定时器
var IDI_DOUBLE_SCORE = 203;					//踢/加倍定时器

//游戏时间
var TIME_OUT_CARD = 30;
var TIME_CALL_SCORE = 30;
var TIME_DOUBLE = 30;
var TIME_START = 10;

cc.Class({
    extends: cc.GameEngine,

    properties: {

    },

    // use this for initialization
    // onLoad :function () {
    //     this.m_GameStart = GameDef.CMD_S_GameStart();
    //     this.m_GameLogic = new CGameLogic();    //游戏逻辑
    //     this.m_GameConclude = null;
    //     //搜索变量
    //     this.m_cbSearchResultIndex = 0;
    //     this.m_SearchCardResult = GameDef.tagSearchCardResult();
    //     this.m_EachSearchResult = GameDef.tagSearchCardResult();
    //     this.m_nCurSearchType = -1;
    //     this.m_cbEachSearchIndex = 0;
    // },
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
            ['W_JIABEI','w/cardtype/jiabei'],
            ['W_BUJIABEI','w/cardtype/bujiabei'],
            ['W_onlyTwo','w/cardtype/W_onlyTwo'],
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
            ['M_JIABEI','m/cardtype/jiabei'],
            ['M_BUJIABEI','m/cardtype/bujiabei'],
            ['M_onlyTwo','m/cardtype/M_onlyTwo'],

            ['M_SHOW', 'm/show'],
            ['W_SHOW', 'w/show'],

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
        for(var i=1;i<=11;++i){
            var FileName = i<10?'0'+i:i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m'+i,'m/phrase/'+FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w'+i,'w/phrase/'+FileName];
        }

        this.m_szText = new Array(
            '对不起，都是我的错，连累你了',
            '和你合作真是太愉快了',
            '农民终于当家做主人了',
            '让不让穷人喝口汤了',
            '我们要斗倒地主老财',
            '我这是一边吃饭，一边斗地主',
            '你这是非常6+7呀',
            '牌神，牌神，救救穷人',
            '人有多大胆，地有多大产',
            '速度速度加速度，快点快点在快点',
            '咱们相约下一个房间，不见不散'
        );
        this.m_BankerMode = 0;
        this.m_bTrusteeCount = 0;
        this.bLetlTimes =0;
        this.m_bTrustee = false;
        this.m_bLetCardlTimes = 0;
        this.m_bLetCount = 0;

        this.m_bFirstClicked = false;
        this.m_bShowStatus = false;
        this.m_bLetStatus = false;

        //游戏变量
        this.m_wBankerUser = INVALID_CHAIR;
        this.m_cbBankerScore = 0;
        this.m_wCurrentUser = INVALID_CHAIR;
        this.m_wMostCardUser = INVALID_CHAIR;
        this.m_lTimes = 1;
        this.m_SendCardStatus = true;
        this.m_VoiceArrayWx = new Array();

        this.m_cbDouble = new Array();
        this.m_cbTrustee = new Array();

        //出牌变量
        this.m_cbTurnCardCount = 0;
        this.m_cbTurnCardData = new Array();

        //扑克变量
        this.m_cbHandCardData = new Array();
        this.m_cbHandCardCount = new Array();
        this.m_cbLandCardData = new Array();

        this.cbShowCardData  =  new Array();
        this.CardData =  new Array();

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
            case GameDef.SUB_S_USER_OP_SHOW:
                {
                    return this.OnSubUserOPShow(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_OP_LET:
                {
                    return this.OnSubUserOPLet(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_SHOWCARD:
                {
                    return this.OnSubUserShow(pData, wDataSize);
                }
            case GameDef.SUB_S_USER_LETCARD:
                 {
                    return this.OnSubUserLet(pData, wDataSize);
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
            case GameDef.SUB_S_TRUSTEE: // 玩家托管
                {
                    return this.OnSubTrustee(pData, wDataSize);
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
        }
        return true;
    },

    //游戏场景
    OnEventSceneMessage :function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if(window.LOG_NET_DATA)console.log("OnEventSceneMessage cbGameStatus "+cbGameStatus+" size "+wDataSize)
      //  this.m_LookonUser = bLookonUser;
        switch (cbGameStatus) {
            case GameDef.GAME_SCENE_FREE:	//空闲状态
                {
                    //效验数据
                    var pStatusFree = GameDef.CMD_S_StatusFree();
                    if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;

                    this.m_lCellScore = pStatusFree.llBaseScore;
                    this.m_BankerMode = pStatusFree.byBankerMode;

                    this.m_GameClientView.SetCellScore(pStatusFree.llBaseScore);
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (!kernel.IsLookonMode()) {
                        //开始设置
                        var pIClientUserItem = kernel.GetTableUserItem(this.GetMeChairID());
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            if( !this.m_ReplayMode )this.m_GameClientView.m_btStart.node.active = true;
                            if( !this.m_ReplayMode )this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, pStatusFree.dwCountDown);
                        }
                    }
                 //   if (this.m_dwRoomID != 0 && this.m_wGameProgress == 0 && !this.m_ReplayMode) this.m_GameClientView.m_BtFriend.active = true;
                 if(!this.m_ReplayMode && !kernel.IsLookonMode()&&this.m_dwRoomID != 0){
                     this.m_GameClientView.m_BtFriend.active = this.m_wGameProgress == 0;
                 }
                    return true;
                }
            case GameDef.GAME_SCENE_CALL:	//叫分状态
                {
                    //效验数据
                    var pStatusCall = GameDef.CMD_S_StatusCall();
                    if (wDataSize != gCByte.Bytes2Str(pStatusCall, pData)) return false;

                    this.m_lCellScore = pStatusCall.llBaseScore;
                    this.m_BankerMode = pStatusCall.byBankerMode;
                    this.m_wCurrentUser = pStatusCall.wCurrentUser;
                    this.m_bLetCount = pStatusCall.bLetCount;
                    this.m_GameClientView.SetCellScore(pStatusCall.llBaseScore);
                    this.m_cbBankerScore = pStatusCall.cbBankerScore;

                    if(  this.m_cbBankerScore > 0 ) this.m_GameClientView.SetTimes(this.m_cbBankerScore);
                    if (this.m_bLetCount !=255 ){
                        this.m_GameClientView.SetLetCount(this.m_bLetCount);
                      //  if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(this.m_bLetCount);
                    }

                    this.ShowCard =Math.floor(Math.random()* 13);

                    for(var i = 0; i <　GameDef.NORMAL_COUNT; i++){
                        this.m_cbHandCardData[i] = bLookonUser?0:pStatusCall.bCardData[i];//
                        this.cbShowCardData[i] = 0;
                        if(this.ShowCard == i)  this.cbShowCardData[this.ShowCard] = pStatusCall.bShowOneCard;
                    }
                    for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                        var ViewID = this.SwitchViewChairID(i);
                        this.m_cbHandCardCount[i] = GameDef.NORMAL_COUNT;
                        if(ViewID != GameDef.MYSELF_VIEW_ID){
                            this.m_GameClientView.UpdateUserCardCount(ViewID, GameDef.NORMAL_COUNT);
                        }
                    }
                    if(GameDef.GetMaxPlayerCount() == 2){
                        if(this.m_wCurrentUser != this.GetMeChairID()){
                            this.m_GameClientView.m_TwoShowCard.SetCardData(this.cbShowCardData, GameDef.NORMAL_COUNT);
                        } else
                        this.m_GameClientView.m_TwoShowCard.SetCardData(0xff,GameDef.NORMAL_COUNT);

                    }

                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, GameDef.NORMAL_COUNT);

                    this.m_GameClientView.ShowBankerCard([0,0,0]);

                    if(this.m_wCurrentUser != INVALID_CHAIR){
                        //设置时间
                        this.SetGameClock(this.m_wCurrentUser ,IDI_CALL_SCORE, pStatusCall.dwCountDown);
                        if(this.m_wCurrentUser == this.GetMeChairID() && this.m_SendCardStatus){
                            this.m_GameClientView.ShowCallUI(pStatusCall.cbBankerScore, this.m_cbBankerScore);
                        }
                    }
                    // this.CheckGoodCard();
                    return true;
                }
                case GameDef.GAME_SCENE_DOUBLE:	//加倍状态
                {
                     //效验数据
                    var pStatusDouble = GameDef.CMD_S_StatusDouble();
                    if (wDataSize != gCByte.Bytes2Str(pStatusDouble, pData)) return false;

                    var MeChairID = this.GetMeChairID();
                    this.m_lCellScore = pStatusDouble.llBaseScore;
                    this.m_BankerMode = pStatusDouble.byBankerMode;
                    this.m_wCurrentUser = pStatusDouble.wCurrentUser;
                    this.m_wBankerUser = pStatusDouble.wBankerUser;
                    this.m_cbBankerScore = pStatusDouble.cbBankerScore;
                    this.m_GameClientView.SetCellScore(pStatusDouble.llBaseScore);

                    if(GameDef.GetMaxPlayerCount() == 2){
                        if(this.m_wBankerUser == this.GetMeChairID()){
                            this.m_GameClientView.m_HandCardCtrl.SetCardDistance(59);
                        }
                    }
                    this.m_lTimes = 1;
                    if (pStatusDouble.bLetCount !=255 ){
                        if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(pStatusDouble.bLetCount);
                        this.m_GameClientView.SetLetCount(pStatusDouble.bLetCount);
                    }
                  //  if( GameDef.GetMaxPlayerCount() == 3){
                        var bankTimes = 0,cbDouble = 0;
                        for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                            this.m_cbDouble[i] = pStatusDouble.cbDouble[i];
                            if (i != this.m_wBankerUser) {
                           if (pStatusDouble.cbDouble[i] == 0) cbDouble = 1;
                           else cbDouble = 0;
                                bankTimes += (pStatusDouble.cbDouble[i]+cbDouble);
                                if (this.GetMeChairID() == i) {
                                    if( GameDef.GetMaxPlayerCount() == 2){
                                        if(pStatusDouble.bLetCardlTimes!=0)  this.m_GameClientView.SetTimes((pStatusDouble.cbDouble[i]+cbDouble)*this.m_cbBankerScore*this.m_lTimes*pStatusDouble.bLetCardlTimes);
                                        else  this.m_GameClientView.SetTimes((pStatusDouble.cbDouble[i]+cbDouble)*this.m_cbBankerScore*this.m_lTimes);
                                    } else
                                    this.m_GameClientView.SetTimes((pStatusDouble.cbDouble[i]+cbDouble)*this.m_cbBankerScore*this.m_lTimes);
                                }
                            }
                        }
                        if (this.GetMeChairID() == this.m_wBankerUser) {
                            if( GameDef.GetMaxPlayerCount() == 2){
                                if(pStatusDouble.bLetCardlTimes!=0)   this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes*pStatusDouble.bLetCardlTimes);
                                else  this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes);
                            } else
                            this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes);
                        }
                  //  }    else  this.m_GameClientView.SetTimes(this.m_cbBankerScore);
                    this.ShowCard =Math.floor(Math.random()* 13);
                    for(var i = 0; i < GameDef.MAX_COUNT; i++){
                        this.m_cbHandCardData[i] = bLookonUser?0:pStatusDouble.bCardData[i];
                        this.cbShowCardData[i] = 0;
                        if(this.ShowCard == i)  this.cbShowCardData[this.ShowCard] = pStatusDouble.bShowOneCard;
                    }

                    for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                        var ViewID = this.SwitchViewChairID(i);
                        this.m_cbHandCardCount[i] = (i == this.m_wBankerUser?GameDef.MAX_COUNT:GameDef.NORMAL_COUNT);
                        if(ViewID != GameDef.MYSELF_VIEW_ID){
                            this.m_GameClientView.UpdateUserCardCount(ViewID,  this.m_cbHandCardCount[i]);
                            if(GameDef.GetMaxPlayerCount() == 2)this.m_GameClientView.m_TwoShowCard.SetCardData(0xff, this.m_cbHandCardCount[i]);
                        }

                    }

                    //设置牌
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData,  this.m_cbHandCardCount[MeChairID]);
                    this.m_GameClientView.ShowBankerCard(pStatusDouble.bBackCard);
                    this.m_GameClientView.SetBankerUser(this.SwitchViewChairID(this.m_wBankerUser));

                    var bShowUI = false;
                    if(/*this.m_BankerMode*/false){
                        // if(pStatusDouble.cbDouble[MeChairID] == 0) bShowUI = true;

                        // for(var i = 0; i <GameDef.GetMaxPlayerCount(); i++) {
                        //     if(pStatusDouble.cbDouble[i] == 0) continue;
                        //     var ViewID = this.SwitchViewChairID(i);
                        //     this.m_GameClientView.SetUserState(ViewID, pStatusDouble.cbDouble[i] == 255 ?'NoDouble':'Double', 3);
                        // }
                    }else{
                        for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                            if(pStatusDouble.cbDouble[i] == 0) continue;
                            var ViewID = this.SwitchViewChairID(i);
                            this.m_GameClientView.SetUserState(ViewID, pStatusDouble.cbDouble[i] == 1?'NoDouble':'Double', 3);
                        }

                        if(pStatusDouble.cbDouble[MeChairID] == 0 && (MeChairID != this.m_wBankerUser || MeChairID == this.m_wCurrentUser)){
                            bShowUI = true;
                        }
                    }
                    if(bShowUI && this.GetMeChairID() == this.m_wCurrentUser && !pStatusDouble.bShowStatus && !pStatusDouble.bLetStatus) this.m_GameClientView.ShowDoubleUI(true);
                    this.SetGameClock(MeChairID, IDI_DOUBLE_SCORE, pStatusDouble.dwCountDown);
                    if (pStatusDouble.bShowStatus && this.GetMeChairID() == this.m_wBankerUser)
                        this.m_GameClientView.ShowOpenCardUI();
                        if (pStatusDouble.bLetStatus && this.GetMeChairID() == this.m_wBankerUser)
                             this.m_GameClientView.LetOpenCardUI();

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
                    this.m_bLetCardlTimes = pStatusPlay.bLetCardlTimes;
                    this.m_bLetCount = pStatusPlay.bLetCount;

                    this.m_cbTrustee = clone(pStatusPlay.cbTrustee);

                    this.m_GameClientView.SetCellScore(pStatusPlay.llBaseScore);
                    this.m_lTimes = Math.pow(2, pStatusPlay.cbBombCount);

                    if(GameDef.GetMaxPlayerCount() == 2){
                        if(this.m_wBankerUser == this.GetMeChairID()){
                            this.m_GameClientView.m_HandCardCtrl.SetCardDistance(59);
                        }
                    }
                 //   if( GameDef.GetMaxPlayerCount() == 3){
                        var bankTimes = 0
                        for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                           this.m_cbDouble[i] = pStatusPlay.cbDouble[i];
                            if (i != this.m_wBankerUser) {
                                if (pStatusPlay.cbDouble[i] == 0) pStatusPlay.cbDouble[i] = 1;
                                bankTimes += pStatusPlay.cbDouble[i];
                                if (this.GetMeChairID() == i) {
                                    if( GameDef.GetMaxPlayerCount()==2){
                                 if(this.m_bLetCardlTimes !=0)   this.m_GameClientView.SetTimes(pStatusPlay.cbDouble[i]*this.m_cbBankerScore*this.m_lTimes*Math.pow(2,this.m_bLetCardlTimes));
                                 else this.m_GameClientView.SetTimes(pStatusPlay.cbDouble[i]*this.m_cbBankerScore*this.m_lTimes);
                                    } else
                                    this.m_GameClientView.SetTimes(pStatusPlay.cbDouble[i]*this.m_cbBankerScore*this.m_lTimes);
                                }
                            }
                        }
                        if (this.GetMeChairID() == this.m_wBankerUser) {
                            if(GameDef.GetMaxPlayerCount()==2){
                              if(this.m_bLetCardlTimes !=0)   this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes*Math.pow(2,this.m_bLetCardlTimes));
                              else   this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes);
                            } else
                            this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore*this.m_lTimes);
                        }
                //    }   else this.m_GameClientView.SetTimes(this.m_cbBankerScore*this.m_lTimes)

                    //if(this.m_bLetCardlTimes != 0)  this.m_GameClientView.SetTimes(this.m_lTimes*this.m_cbBankerScore*Math.pow(2,this.m_bLetCardlTimes));


                    if(this.m_bLetCount !=255 ){
                        this.m_GameClientView.SetLetCount(this.m_bLetCount);
                        if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(this.m_bLetCount);
                    }

                    //出牌变量
                    this.m_cbTurnCardCount = pStatusPlay.cbTurnCardCount;
                    for (var i = 0; i < GameDef.MAX_COUNT; i++) {
                        this.m_cbTurnCardData[i] = pStatusPlay.cbTurnCardData[i];
                    }

                    //扑克数据
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        this.m_cbHandCardCount[i] = pStatusPlay.cbHandCardCount[i];
                    }
                    this.ShowCard =Math.floor(Math.random()* 13);
                    for (var i = 0; i < GameDef.MAX_COUNT; i++) {
                        this.m_cbHandCardData[i] = bLookonUser?0:pStatusPlay.cbHandCardData[i];
                        this.cbShowCardData[i] = 0;
                        if(this.ShowCard == i)  this.cbShowCardData[this.ShowCard] = pStatusPlay.bShowOneCard;
                    }

                    //设置扑克
                    for (var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                        //获取位置
                        var wViewChairID = this.SwitchViewChairID(i);

                        //设置扑克
                        if (wViewChairID != GameDef.MYSELF_VIEW_ID) {
                            this.m_GameClientView.UpdateUserCardCount(wViewChairID, this.m_cbHandCardCount[i]);
                            if(GameDef.GetMaxPlayerCount()==2)this.m_GameClientView.m_TwoShowCard.SetCardData(0xff, this.m_cbHandCardCount[i]);
                    }


                }


                    // }
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
                        //显示按钮
                        this.m_GameClientView.ShowCardUI();

                         //搜索出牌
                        if (pStatusPlay.wTurnWiner == wMeChairID) {
                            if(!bLookonUser)this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID], null, 0, this.m_SearchCardResult);
                        } else {
                            if(!bLookonUser)this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID], this.m_cbTurnCardData,
                                this.m_cbTurnCardCount, this.m_SearchCardResult);
                        }
                    }

                    if (pStatusPlay.bBankShow) {
                        this.m_bShowStatus = true;
                        this.m_cbLandCardData = pStatusPlay.cbBankCard.slice(0);
                        var wView = this.SwitchViewChairID(this.m_wBankerUser);
                        this.m_GameClientView.m_UserShowCard[wView].SetCardData(pStatusPlay.cbBankCard, this.m_cbHandCardCount[this.m_wBankerUser]);
                    }



                    //设置时间
                    this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, pStatusPlay.dwCountDown);
                    this.UpdateTrusteeControl();

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
    OnTimerMessage :function (wChairID, CountDown, nTimerID,Progress) {
        var nElapse = parseInt(CountDown/1000);
        this.m_GameClientView.SetUserTimer(wChairID, nElapse);
        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode() || wChairID != GameDef.MYSELF_VIEW_ID) return true;
        switch (nTimerID) {
            case IDI_START_GAME:        //开始定时器
                {
                    if(kernel.GetMeUserItem().GetUserStatus() == US_READY){
                        this.m_GameClientView.m_btStart.node.active = false;
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

                    // if( this.m_cbTurnCardCount > 1 && this.m_cbHandCardCount[this.GetMeChairID()] == 1){
                    //    // this.OnMessagePassCard(0, 0);
                    //     return true;
                    // }

                    // if ( (CountDown <= 0 || (this.m_bTrustee && nElapse < TIME_OUT_CARD - 1))) {
                    //     //自动出牌
                    //   //  if (this.m_GameClientView.m_btPass.interactable) this.OnMessagePassCard(0, 0);

                    //     return true;
                    // }
                    //超时警告
                    if (CountDown <= 5000 &&  this.m_bPSound)  {
                        cc.gSoundRes.PlayGameSound('GAME_WARN');
                        this.m_bPSound = false;
                    }

                    return true;
                }
            case IDI_CALL_SCORE:
                {
                    // //自动处理
                    // if(this.m_bTimerCall) this.OnMessageCallScore(3);
                    // if (CountDown <= 0 ) this.OnMessageCallScore(255);
                    return true;
                }
            case IDI_DOUBLE_SCORE:
                {
                    //自动处理
                   // if (CountDown <= 0 && wChairID == GameDef.MYSELF_VIEW_ID) this.OnMessageDouble(0);
                    return true;
                }
        }

        return true;
    },

    //切换椅子
    SwitchViewChairID :function (wChairID) {
        //转换椅子
        var wViewChairID = (wChairID + GameDef.GetMaxPlayerCount() - this.GetMeChairID());
        switch (GameDef.GetMaxPlayerCount()) {
            case 2: { wViewChairID += 1; break; }
            case 3: { wViewChairID += 1; break; }
            case 4: { wViewChairID += 2; break; }
            case 5: { wViewChairID += 2; break; }
            case 6: { wViewChairID += 3; break; }
            case 7: { wViewChairID += 3; break; }
            case 8: { wViewChairID += 4; break; }
        }
        return wViewChairID % GameDef.GetMaxPlayerCount();
    },

    //游戏开始
    OnSubGameStart :function (pData, wDataSize) {
        //隐藏成绩界面
        this.m_GameClientView.SetUserState(INVALID_CHAIR);
        this.m_bFirstClicked = true;
        this.m_GameConclude = null;
        this.m_SendCardStatus = false;
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart,pData)) return false;

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
        this.m_bShowStatus = false;
        this.ShowCard = 0;
        this.bLetlTimes = 0;
        this.m_bLetCardlTimes = 0;


        //出牌变量
        this.m_cbTurnCardCount = 0;
        for (var i = 0; i < GameDef.MAX_COUNT; i++) {
            this.m_cbTurnCardData[i] = 0;
        }

        this.m_lCellScore = this.m_GameStart.llBaseScore;
        this.m_wCurrentUser = this.m_GameStart.wCurrentUser;

        //界面庄家
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        //状态设置
        this.m_lTimes = 1;
        this.m_GameClientView.SetTimes(this.m_lTimes);
        this.m_GameClientView.m_LetCardCount.string = '';

        this.m_GameClientView.SetCellScore(this.m_lCellScore);
        this.m_GameClientView.SetUserCountWarn(INVALID_CHAIR, false);

        //设置扑克
        this.m_GameClientView.ShowBankerCard(null);
        this.m_GameClientView.m_HandCardCtrl.SetCardData(null, 0);
        if(GameDef.GetMaxPlayerCount()==2)this.m_GameClientView.m_TwoShowCard.SetCardData(null,0);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_cbHandCardCount[i] = GameDef.NORMAL_COUNT;
            this.m_GameClientView.m_UserCardControl[i].SetCardData(null, 0);
        }
        var kernel = gClientKernel.get();//kernel.IsLookonMode()
        this.ShowCard =Math.floor(Math.random()* 13);
        for (var i = 0; i < GameDef.NORMAL_COUNT; i++) {
            this.m_cbHandCardData[i] = kernel.IsLookonMode()?0:this.m_GameStart.cbCardData[i];
            this.cbShowCardData[i] = 0;
            if(this.ShowCard == i)  this.cbShowCardData[this.ShowCard] = this.m_GameStart.bShowOneCard;
        }

        if(this.m_ReplayMode){
           this.OnMessageDispatchFinish(0,0,0);
            return true;
        }

        //播放开始声音
        cc.gSoundRes.PlayGameSound('GAME_START');

        //发牌动画
        var wViewStartUser = this.SwitchViewChairID(this.m_GameStart.wCurrentUser);
        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(GameDef.NORMAL_COUNT, wViewStartUser);

        // this.CheckGoodCard();
        return true;
    },
    CheckGoodCard:function (){
        this.m_bTimerCall = false;
        if(this.m_RulesCallBanker){
            this.m_bTimerCall = this.m_GameLogic.IsGoodCard(this.m_cbHandCardData, GameDef.NORMAL_COUNT);
        }
        return this.m_bTimerCall;
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
        this.m_bLetCount = pCallScore.bLetCardCount;
        this.m_cbBankerScore = pCallScore.cbCurrentScore;
        if (pCallScore.bLetCardCount !=255) {
            //if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(pCallScore.bLetCardCount);
            this.m_GameClientView.SetLetCount(pCallScore.bLetCardCount);
        }
        if (pCallScore.cbUserCallScore != 255 && pCallScore.cbCurrentScore != 0) {
            this.m_GameClientView.SetTimes( pCallScore.cbCurrentScore);

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

    //踢
    OnSubUserDouble :function (pData, wDataSize) {
        //效验参数
        var pDouble = GameDef.CMD_S_Double();
        if (wDataSize != gCByte.Bytes2Str(pDouble, pData)) return false;
        if(pDouble.wCallUser == this.GetMeChairID() ) this.m_GameClientView.HideAllGameButton();
        if(false){//加倍
            if(pDouble.wCallUser == INVALID_CHAIR){
                this.m_GameClientView.HideAllGameButton();
                this.m_GameClientView.ShowDoubleUI(true);
                this.SetGameClock(this.GetMeChairID(), IDI_DOUBLE_SCORE, TIME_DOUBLE);
            }else{
                if(pDouble.bDouble) this.m_lTimes*=2;
                if(!this.m_ReplayMode) this.m_GameClientView.SetUserState(this.SwitchViewChairID(pDouble.wCallUser), pDouble.bDouble?'Double':'NoDouble', 3);
            }
        }else{
            //默认踢
            if(pDouble.wCallUser != INVALID_CHAIR){
                if(pDouble.bDouble){
                    var bankTimes = 0
                    for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                      this.m_cbDouble[i] = pDouble.cbDouble[i];
                        if (i != this.m_wBankerUser) {
                            if (pDouble.cbDouble[i] == 0) pDouble.cbDouble[i] = 1;
                            bankTimes += pDouble.cbDouble[i];
                            if (this.GetMeChairID() == i) {
                                if(GameDef.GetMaxPlayerCount() == 2){
                                   if(this.bLetlTimes != 0) this.m_GameClientView.SetTimes( Math.pow(2, this.bLetlTimes)*this.m_cbBankerScore* pDouble.cbDouble[i]);
                                   else  this.m_GameClientView.SetTimes(this.m_cbBankerScore* pDouble.cbDouble[i]);
                                } else
                                this.m_GameClientView.SetTimes(pDouble.cbDouble[i]*this.m_cbBankerScore);
                            }
                        }
                    }
                    if (this.GetMeChairID() == this.m_wBankerUser) {
                        if(GameDef.GetMaxPlayerCount() == 2){
                            if(this.bLetlTimes != 0) this.m_GameClientView.SetTimes( Math.pow(2, this.bLetlTimes)*this.m_cbBankerScore*bankTimes);
                            else this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore);
                        }else
                        this.m_GameClientView.SetTimes(bankTimes*this.m_cbBankerScore);
                    }
                }
                if(!this.m_ReplayMode) {
                    if(pDouble.bDouble)
                    this.PlayActionSound(pDouble.wCallUser,'JIABEI');
                    else this.PlayActionSound(pDouble.wCallUser,'BUJIABEI');
                }
                if(!this.m_ReplayMode)this.m_GameClientView.SetUserState(this.SwitchViewChairID(pDouble.wCallUser), pDouble.bDouble?'Double':'NoDouble', 3);
                var PosX;
                if( this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(pDouble.wCallUser)].node.x >0){
                    PosX = -90;
                } else  PosX = 90;
               if(pDouble.bDouble) this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(pDouble.wCallUser)].SetDouble(true,PosX);
                //默认踢
                if(pDouble.bDouble && pDouble.wCallUser != this.m_wBankerUser){
                        if(!this.m_ReplayMode) this.m_GameClientView.SetUserState(this.SwitchViewChairID(pDouble.wCallUser), 'Double', 3);

                }
            }
            if(pDouble.wNextCallUser == this.GetMeChairID()){
                this.m_GameClientView.HideAllGameButton();
                this.m_GameClientView.ShowDoubleUI(true);
                this.SetGameClock(pDouble.wNextCallUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
            }
        }
    //     if(pDouble.wCallUser != INVALID_CHAIR){
    //        // this.m_GameClientView.SetTimes(this.m_lTimes*this.m_cbBankerScore);


    //         //设置玩家动作
    //    //     this.PlayActionSound(pDouble.wCallUser, pDouble.bDouble?"T": "BT");
    //     }

        return true;
    },

    OnSubUserOPShow: function (pData, wDataSize) {
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.ShowOpenCardUI();
        return true;
    },
    OnSubUserOPLet:function() {
        this.m_GameClientView.HideAllGameButton();
        this.m_GameClientView.LetOpenCardUI();
        this.SetGameClock(this.m_wBankerUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
        return true;
    },

    OnSubUserShow: function (pData, wDataSize) {
        var pCmd = GameDef.CMD_S_ShowCard();
        if (wDataSize != gCByte.Bytes2Str(pCmd, pData)) return false;
        if(this.m_wBankerUser == this.GetMeChairID() ) this.m_GameClientView.HideAllGameButton();

        if (pCmd.bShow) {
            //设置时间
            this.KillGameClock();
            this.SetGameClock(this.m_wBankerUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
            this.PlayActionSound(this.m_wBankerUser, "SHOW");

            this.m_bShowStatus = true;
            this.m_cbLandCardData = pCmd.bCardData.slice(0);
            var wView = this.SwitchViewChairID(this.m_wBankerUser);
            this.m_GameClientView.m_UserShowCard[wView].SetCardData(pCmd.bCardData, GameDef.MAX_COUNT);
        }
        return true;
    },



    OnSubUserLet:function (pData,wDataSize){
        var pCmdLet = GameDef.CMD_S_LetCard();
        if (wDataSize != gCByte.Bytes2Str(pCmdLet, pData)) return false;
        if(this.m_wBankerUser == this.GetMeChairID() ) this.m_GameClientView.HideAllGameButton();
        this.bShowLet = pCmdLet.bLet;
        if (pCmdLet.bLet) {
            //设置时间
            this.KillGameClock();
            this.SetGameClock(this.m_wBankerUser, IDI_DOUBLE_SCORE, TIME_DOUBLE);
        if(pCmdLet.bLetlTimes!=0) this.m_GameClientView.SetTimes( Math.pow(2, pCmdLet.bLetlTimes)*this.m_cbBankerScore);
            this.m_GameClientView.SetLetCount(pCmdLet.bLetCardCount);
            if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(pCmdLet.bLetCardCount);
            this.bLetlTimes = pCmdLet.bLetlTimes;
            this.m_bLetStatus = true;
          //  this.m_cbLandCardData = pCmd.bCardData.slice(0);
           // var wView = this.SwitchViewChairID(this.m_wBankerUser);
           // this.m_GameClientView.m_UserShowCard[wView].SetCardData(pCmd.bCardData, GameDef.MAX_COUNT);
        } else if(this.m_wBankerUser==this.GetMeChairID()) this.m_GameClientView.m_TwoShowCard.SetLetCard(this.m_bLetCount);
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

        if(GameDef.GetMaxPlayerCount() == 2){
            if(this.m_wBankerUser == this.GetMeChairID()) this.m_GameClientView.m_HandCardCtrl.SetCardDistance(59);
            else this.m_GameClientView.m_HandCardCtrl.SetCardDistance(70);
        }



        //拷贝扑克
        var kernel = gClientKernel.get();//kernel.IsLookonMode()
        this.m_cbHandCardCount[this.m_wBankerUser] = GameDef.MAX_COUNT;
        if(this.m_wBankerUser == this.GetMeChairID()){
            for (var i = 0; i < 3; i++) {
                this.m_cbHandCardData[GameDef.NORMAL_COUNT + i] = kernel.IsLookonMode()?0:pBankerInfo.cbBankerCard[i];
            }

            //设置扑克
            this.m_GameLogic.SortCardList(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wBankerUser]);
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, GameDef.MAX_COUNT);
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(pBankerInfo.cbBankerCard, 3);
        }else{
            this.m_GameClientView.UpdateUserCardCount(wViewChairID, GameDef.MAX_COUNT);
            if(GameDef.GetMaxPlayerCount() == 2)this.m_GameClientView.m_TwoShowCard.SetCardData(0xff, GameDef.MAX_COUNT);
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
        if(!this.m_ReplayMode)this.m_GameClientView.PlayAni(cbTurnCardType,wViewChairID);

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
        if (cbCardType == GameDef.CT_BOMB_CARD || cbCardType == GameDef.CT_MISSILE_CARD) {
            this.m_lTimes *= 2;
        //    this.m_GameClientView.SetTimes(this.m_lTimes*this.m_cbBankerScore);
            if(this.m_bLetCardlTimes != 0) this.bLetlTimes = this.m_bLetCardlTimes;
    //    if(this.bLetlTimes!=0)    this.m_GameClientView.SetTimes( Math.pow(2, this.bLetlTimes)*this.m_cbBankerScore*this.m_lTimes);
           // if( GameDef.GetMaxPlayerCount() == 3){
                var upDateTimes = 0;
                for(var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
                    if (i != this.m_wBankerUser) {
                        if (this.m_cbDouble[i] == 0 || this.m_cbDouble[i] == null) this.m_cbDouble[i] = 1;
                        upDateTimes += this.m_cbDouble[i];
                        if (this.GetMeChairID() == i) {
                            if(GameDef.GetMaxPlayerCount() == 2){
                                if(this.bLetlTimes!=0)    this.m_GameClientView.SetTimes( Math.pow(2, this.bLetlTimes)*this.m_cbBankerScore*this.m_lTimes*this.m_cbDouble[i]);
                                else   this.m_GameClientView.SetTimes(this.m_cbBankerScore*this.m_lTimes*this.m_cbDouble[i]);
                            }else
                            this.m_GameClientView.SetTimes(this.m_cbDouble[i]*this.m_cbBankerScore*this.m_lTimes);
                        }
                    }
                }
                if (this.GetMeChairID() == this.m_wBankerUser) {
                    if(GameDef.GetMaxPlayerCount() == 2){
                        if(this.bLetlTimes!=0) this.m_GameClientView.SetTimes(Math.pow(2, this.bLetlTimes)*upDateTimes*this.m_cbBankerScore*this.m_lTimes);
                        else this.m_GameClientView.SetTimes(upDateTimes*this.m_cbBankerScore*this.m_lTimes);
                    } else
                    this.m_GameClientView.SetTimes(upDateTimes*this.m_cbBankerScore*this.m_lTimes);
                }
          //  }

        }

        this.PlayCardTypeSound(pOutCard.wOutCardUser, cbCardType, this.m_GameLogic.GetCardLogicValue(pOutCard.cbCardData[0]).toString(), pOutCard.cbCardCount) ;

        //出牌动作
        var kernel = gClientKernel.get();

        //显示出牌
        this.m_GameClientView.m_UserCardControl[wViewChairID].SetCardData(pOutCard.cbCardData, pOutCard.cbCardCount);
           //桌面清理
        if ((this.GetMeChairID()==pOutCard.wOutCardUser) && (cbTurnCardType == GameDef.CT_MISSILE_CARD)){
         for(var i = 0 ;i<GameDef.GetMaxPlayerCount();i++){
            this.m_GameClientView.m_UserCardControl[this.SwitchViewChairID(i)].SetCardData(null, 0);
         }

       }
        var kernel = gClientKernel.get();//kernel.IsLookonMode()
        //删除扑克
        if (pOutCard.wOutCardUser == wMeChairID) {
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(0,0);
            if(!kernel.IsLookonMode() && !this.m_GameLogic.RemoveCardList(pOutCard.cbCardData,
                pOutCard.cbCardCount, this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID])){
                return false;
            }
            this.m_cbHandCardCount[wMeChairID] -= pOutCard.cbCardCount;
            this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        } else {
            //设置扑克
            this.m_cbHandCardCount[pOutCard.wOutCardUser] -= pOutCard.cbCardCount;
            this.m_GameClientView.UpdateUserCardCount(wViewChairID,  this.m_cbHandCardCount[pOutCard.wOutCardUser]);
            if(GameDef.GetMaxPlayerCount()==2) this.m_GameClientView.m_TwoShowCard.SetCardData(0xff,this.m_cbHandCardCount[pOutCard.wOutCardUser]);
            //报警
            if (this.m_cbHandCardCount[pOutCard.wOutCardUser] == 2 && this.m_cbHandCardCount[pOutCard.wOutCardUser] > 0) {
               // cc.gSoundRes.PlayGameSound('LEFT_WARN');
               this.PlayActionSound(pOutCard.wOutCardUser, "onlyTwo");
                this.m_GameClientView.SetUserCountWarn(wViewChairID, true);
            }
        }

        if (this.m_bShowStatus && this.GetMeChairID() != this.m_wBankerUser && pOutCard.wOutCardUser == this.m_wBankerUser) {
            if(!this.m_GameLogic.RemoveCardList(pOutCard.cbCardData, pOutCard.cbCardCount,
                this.m_cbLandCardData, this.m_cbHandCardCount[pOutCard.wOutCardUser] + pOutCard.cbCardCount)){
                return false;
            }
            this.m_GameClientView.m_UserShowCard[wViewChairID].SetCardData(this.m_cbLandCardData,
                 this.m_cbHandCardCount[pOutCard.wOutCardUser]);
        }


        //出牌变量
        this.m_wCurrentUser = pOutCard.wCurrentUser;
        this.m_cbTurnCardCount = (cbCardType == GameDef.CT_MISSILE_CARD ? 0 : pOutCard.cbCardCount );
        for (var i = 0; i < pOutCard.cbCardCount; i++) {
            this.m_cbTurnCardData[i] = (cbCardType == GameDef.CT_MISSILE_CARD ? 0 : pOutCard.cbCardData[i]);
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
            //显示按钮
            this.m_GameClientView.ShowCardUI();

            this.m_GameLogic.SearchOutCard( this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData, this.m_cbTurnCardCount,
                this.m_SearchCardResult);

            if (this.m_SearchCardResult.cbSearchCount == 0 && ViewID != GameDef.MYSELF_VIEW_ID && !this.m_ReplayMode) {//
                this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 3);
            }
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
      //  cc.gSoundRes.PlayGameSound('GAME_END');

        //设置状态
        var kernel = gClientKernel.get();
        this.m_GameClientView.HideAllGameButton();
        //删除时间
        this.KillGameClock();
        for (var i in this.m_GameClientView.m_UserShowCard) {
            this.m_GameClientView.m_UserShowCard[i].SetCardData(null, 0);
        }

        //小结算界面
        var tempIndex = 0;
        var wWinChair = INVALID_CHAIR;
        for (var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserEndScore(wViewID, this.m_GameConclude.lGameScore[i]);
            if(this.m_GameConclude.cbCardCount[i] > 0){
                var CardArr = this.m_GameConclude.cbCardData.splice(0,this.m_GameConclude.cbCardCount[i])
                if(wViewID != GameDef.MYSELF_VIEW_ID || kernel.IsLookonMode()){
                    if(GameDef.GetMaxPlayerCount()==2){
                        this.m_GameClientView.m_TwoShowCard.SetCardData(CardArr,this.m_GameConclude.cbCardCount[i]);
                    }else  if(!this.m_ReplayMode)this.m_GameClientView.m_UserCardControl[wViewID].SetCardData(CardArr, this.m_GameConclude.cbCardCount[i]);
                }
            }else{
                wWinChair = i;
            }
        }

        //春天动画
        if (this.m_GameConclude.bChunTian){
            this.m_GameClientView.PlayAni(wWinChair == this.m_wBankerUser?15:16);
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
            this.schedule(this.OnTimeIDI_PERFORM_END, 3);

        return true;
    },
    //执行结束
    OnTimeIDI_PERFORM_END :function () {
        this.unschedule(this.OnTimeIDI_PERFORM_END);

        if(this.m_RoomEnd == null){
            this.SetGameClock(this.GetMeChairID(), IDI_START_GAME, TIME_START);
            if(this.IsLookonMode() == false)  this.m_GameClientView.m_btStart.node.active = true;
            for(var i = 0 ;i<GameDef.GetMaxPlayerCount();i++){
                this.m_GameClientView.m_UserCardControl[this.SwitchViewChairID(i)].SetCardData(null, 0);
             }
        }else{
            this.ShowEndView();
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

        if(this.m_wGameProgress > 0|| this.m_ReplayMode){
            this.m_GameClientView.m_btStart.node.active = false;
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

            //跟牌判断
            if (this.m_cbTurnCardCount == 0) return true;
            return this.m_GameLogic.CompareCard(this.m_cbTurnCardData, cbCardData, this.m_cbTurnCardCount, cbShootCount);
        }

        return false;
    },
    //播放操作声音
    PlayCardTypeSound :function (wChairId, cbCardType, CardStr, CardCount) {
      //  if(this.m_ReplayMode)return
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
            case GameDef.CT_THREE_TAKE_TWO:
                if (CardCount == 5) return this.PlayActionSound(wChairId, "SANDAIDUI");
                return  this.PlayActionSound(wChairId, "FEIJICB");
            case GameDef.CT_FOUR_TAKE_ONE:
                return this.PlayActionSound(wChairId, "SIDAIER");
            case GameDef.CT_FOUR_TAKE_TWO:
                return  this.PlayActionSound(wChairId, "SIDAIDUI");
            case GameDef.CT_BOMB_CARD:
                return this.PlayActionSound(wChairId, "ZHADAN");
            case GameDef.CT_MISSILE_CARD:
                return this.PlayActionSound(wChairId, "HUOJIAN");
        }
    },

    //自动出牌
    AutomatismOutCard :function () {
        //状态判断
        var kernel = gClientKernel.get();
        if ((kernel.IsLookonMode() == true) || (this.m_wCurrentUser != this.GetMeChairID())) return false;

        //当前弹起
        if ((this.m_GameClientView.m_btOutCard.interactable == true) && (this.m_wCurrentUser == this.GetMeChairID())) {
            this.OnMessageOutCard(0, 0);
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
                this.OnMessageOutCard(0, 0);

                return true;
            }
        }

        //放弃出牌
        if (this.m_cbTurnCardCount > 0) this.OnMessagePassCard(0, 0);

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
        for(var i=0;i<GameDef.GAME_PLAYER;i++ ){
            this.m_GameClientView.m_UserInfo[i].SetDouble(false,0);
        }

        //扑克控件
        this.m_GameClientView.InitTableCard();
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.HideAllGameButton();
        if(GameDef.GetMaxPlayerCount() == 2) this.m_GameClientView.m_HandCardCtrl.SetCardDistance(70);

        //界面庄家
        this.m_cbBankerScore = 0;
        this.m_GameClientView.SetBankerUser(INVALID_CHAIR);

        //状态设置
        this.m_GameClientView.SetUserCountWarn(INVALID_CHAIR, false);

        //设置界面
        this.m_GameClientView.m_btStart.node.active = false;
        this.m_GameClientView.m_BankerCardBG.node.active = false;
        this.m_GameClientView.SetTimes(1, true);
        this.m_GameClientView.m_LetCardCount.string = '';

        //发送消息
        if(!lParam)this.SendFrameData(SUB_GF_USER_READY);

        return 0;
    },

    //出牌消息
    OnMessageOutCard :function (wParam, lParam) {
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
        if(this.m_cbTurnCardCount == 0 && cbHandType == GameDef.CT_DOUBLE && cbCardType != GameDef.CT_DOUBLE){
            this.ShowTips("请不要拆对出牌！");
            return true;
        }

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

        //发送数据
        this.SendGameData(GameDef.SUB_C_OUT_CARD, OutCard);

        return 0;
    },

    //PASS消息
    OnMessagePassCard :function (wParam, lParam) {
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
        this.OnMessagePassCard(0, 0);
        return 0;
    },
    //叫分消息
    OnMessageCallScore :function (callScore) {
        //删除时间
        this.KillGameClock();

        //设置界面
        this.m_GameClientView.HideAllGameButton();

        //发送数据
        var CallScore = GameDef.CMD_C_CallScore();
        CallScore.cbCallScore = parseInt(callScore);
        this.SendGameData(GameDef.SUB_C_CALL_SCORE, CallScore);

        return 0;
    },


    //踢消息
    OnMessageDouble:function(isKick) {
        //删除时间
        this.KillGameClock();

        if( !this.m_GameClientView.m_btKick.node.active && !this.m_GameClientView.m_btDouble.node.active)  return 0;
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //发送数据
        var Double = GameDef.CMD_C_UserDouble();
        Double.bDouble = isKick;
        this.SendGameData(GameDef.SUB_C_DOUBLE, Double);
        return 0;
    },
    //明牌消息
    OnMessageShow:function(bShow) {
        //删除时间
        this.KillGameClock();
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        //发送数据
        var Cmd = GameDef.CMD_C_UserShow();
        Cmd.bShow = bShow;
        this.SendGameData(GameDef.SUB_C_SHOW_CARD, Cmd);
        return 0;
    },
    //让牌消息
    OnMessageLet:function(bLet){
        //删除时间
        this.KillGameClock();
        //设置界面
        this.m_GameClientView.HideAllGameButton();
        var CmdLet = GameDef.CMD_C_UserLet();
        CmdLet.bLet = bLet;
        this.SendGameData(GameDef.SUB_C_LET_CARD, CmdLet);
    },
    //左键扑克
    OnLeftHitCard :function (bHasShoot) {
        //设置控件
        var bOutCard = this.VerdictOutCard();
        this.m_GameClientView.m_btOutCard.interactable = ((bOutCard == true) ? true : false);

        if (this.m_cbHandCardCount[this.GetMeChairID()] == GameDef.MAX_COUNT && this.m_bFirstClicked) {
            this.m_bFirstClicked = false;
            this.m_GameClientView.m_HandCardCtrl.SetShootCard(null, 0);
            this.m_GameClientView.m_btOutCard.interactable = false;
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
        if(this.m_GameLogic.GetCardType(cbCardData, cbShootCount) != GameDef.CT_ERROR) {
            //出牌判断
            if (this.VerdictOutCard()) {
                this.m_GameClientView.m_btOutCard.interactable = true;
                return;
            }
        }
        // var cbCardData = new Array();
        // var cbShootCount = this.m_GameClientView.m_HandCardCtrl.GetShootCard(cbCardData, GameDef.MAX_COUNT);
        // for(var i=this.m_SearchCardResult.cbSearchCount-1;i>=0;i--){
        //     if(this.m_GameLogic.IncludeCard(cbCardData,this.m_SearchCardResult.cbResultCard[i],cbShootCount,this.m_SearchCardResult.cbCardCount[i])){
        //         this.m_GameClientView.m_HandCardCtrl.SetShootCard(this.m_SearchCardResult.cbResultCard[i],this.m_SearchCardResult.cbCardCount[i]);
        //         this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
        //         return
        //     }
        // }
        // var TempRes = GameDef.tagSearchCardResult();
        // this.m_GameLogic.SearchOutCard( cbCardData, cbShootCount, this.m_cbTurnCardData, this.m_cbTurnCardCount, TempRes);
        // for(var i=TempRes.cbSearchCount-1;i>=0;i--){
        //     this.m_GameClientView.m_HandCardCtrl.SetShootCard(TempRes.cbResultCard[i],TempRes.cbCardCount[i]);
        //     this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
        //     return;
        // }
        var TempRes = GameDef.tagSearchCardResult();
        this.m_GameLogic.SearchOutCard( cbCardData, cbShootCount, this.m_cbTurnCardData, this.m_cbTurnCardCount, TempRes);
        var DoubleCardData = 0,DanCardData = 0;
        for(var i=TempRes.cbSearchCount-1;i>=0;i--){
            if(TempRes.cbSearchCount > 2){
                for(var k = TempRes.cbSearchCount-1 ; k > TempRes.cbSearchCount-3;k--){
                    var MaxCardData = 0, MinCardData = 100;
                    for(var j in TempRes.cbResultCard[k]){
                        j = parseInt(j);
                        if(this.m_GameLogic.GetCardValue(TempRes.cbResultCard[k][j])  > MaxCardData){
                            MaxCardData = this.m_GameLogic.GetCardValue(TempRes.cbResultCard[k][j]);
                        }

                        if( MinCardData > this.m_GameLogic.GetCardValue(TempRes.cbResultCard[k][j])){
                            if(TempRes.cbResultCard[k][j] == 0) continue;
                            MinCardData = this.m_GameLogic.GetCardValue(TempRes.cbResultCard[k][j]);
                        }
                    }
                    if(k== TempRes.cbSearchCount-1) DoubleCardData =  MaxCardData - MinCardData;
                    if(k== TempRes.cbSearchCount-2) DanCardData = MaxCardData - MinCardData;
                }

                if(DanCardData>DoubleCardData) i = TempRes.cbSearchCount-2;
            }

            this.m_GameClientView.m_HandCardCtrl.SetShootCard(TempRes.cbResultCard[i],TempRes.cbCardCount[i]);
            this.m_GameClientView.m_btOutCard.interactable = ((this.VerdictOutCard() == true) ? true : false);
            return;
        }
        //出牌判断
        if (this.m_cbTurnCardCount > 0 && !this.VerdictOutCard()) {
            //类型判断
            this.m_GameLogic.SortCardList(cbCardData, cbShootCount);
            cbShootCount = this.m_GameLogic.CalcValidCard(cbCardData, cbShootCount,this.m_cbTurnCardData, this.m_cbTurnCardCount);

            if(window.LOG_NET_DATA)console.log('OnAutoChangeShoot ',cbShootCount, cbCardData)
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
    OnFirend :function () {
       // if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        // } else {
        //     ThirdPartyShareMessage(this.GetShareInfo(), 0);
        //     ThirdPartyShareMessage(this.GetShareInfo(), 1);
        //     // this.ShowAlert('点击 ... 进入微信菜单，发送给朋友！');
        //     this.ShowPrefabDLG('ShareDLG');
        // }
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

                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 1, this.m_EachSearchResult);
                    var tmpSearchResult = GameDef.tagSearchCardResult();
                    this.m_GameLogic.SearchTakeCardType(cbHandCardData, cbHandCardCount, 0, 3, 2, tmpSearchResult);
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
                //显示按钮
                this.m_GameClientView.ShowCardUI();

                 //搜索提示
                this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser],
                this.m_cbTurnCardData, this.m_cbTurnCardCount, this.m_SearchCardResult);

                if (this.m_SearchCardResult.cbSearchCount == 0) {
                    this.m_GameClientView.SetUserState(GameDef.MYSELF_VIEW_ID, 'NoHave', 3);
                }

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


            if(GameDef.GetMaxPlayerCount() == 2){
                if(this.m_wCurrentUser != this.GetMeChairID()){
                    this.m_GameClientView.m_TwoShowCard.SetCardData(this.cbShowCardData,CardIndex+1);
                } else
                this.m_GameClientView.m_TwoShowCard.SetCardData(0xff,CardIndex+1);

            }

                //设置扑克
                if(wViewID == GameDef.MYSELF_VIEW_ID){
                    this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, CardIndex+1);
                }else{
                    this.m_GameClientView.UpdateUserCardCount(wViewID, CardIndex+1);
                }
                return;
            //  }
            //  else {



           //  }
    }
        //排列扑克
        var wMeChairID = this.GetMeChairID();
        this.m_GameLogic.SortCardList(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        this.m_GameClientView.m_HandCardCtrl.SetCardData(this.m_cbHandCardData, this.m_cbHandCardCount[wMeChairID]);
        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            var ViewID = this.SwitchViewChairID(i);
            if(ViewID == GameDef.MYSELF_VIEW_ID) continue;
            this.m_GameClientView.UpdateUserCardCount(ViewID, this.m_cbHandCardCount[i]);
        }

        //显示底牌背面
        this.m_GameClientView.ShowBankerCard([0,0,0]);

        //显示按钮
        var kernel = gClientKernel.get();
        if ((kernel.IsLookonMode() == false) && this.m_wCurrentUser == wMeChairID) {
            this.m_SendCardStatus = true;
            this.m_GameClientView.ShowCallUI(0,0);
        }

        //设置时间
        this.SetGameClock(this.m_wCurrentUser ,IDI_CALL_SCORE, TIME_CALL_SCORE);

        return 0;
    },

    //翻牌完成
    OnMessageReversalFinish :function () {
        //控制设置
        var kernel = gClientKernel.get();
        var wMeChairID = this.GetMeChairID();
        if(this.bShowLet) this.m_wCurrentUser = (this.m_wBankerUser +1) % 2;
        else this.m_wCurrentUser = this.m_wBankerUser;
        if (kernel.IsLookonMode() == false) {
            //出牌按钮
            if (this.m_wCurrentUser == wMeChairID) {
                this.m_GameClientView.ShowCardUI();

                //搜索提示
                this.m_GameLogic.SearchOutCard(this.m_cbHandCardData, this.m_cbHandCardCount[this.m_wCurrentUser], this.m_cbTurnCardData,
                    this.m_cbTurnCardCount, this.m_SearchCardResult);
            }
        }

        //设置时间
        this.SetGameClock(this.m_wCurrentUser, IDI_OUT_CARD, TIME_OUT_CARD);
        return 0;
    },


    //设置警告
    SetViewRoomInfo:function (m_dwServerRules, m_dwRulesArr){
        var dwRules = m_dwRulesArr[0];
        this.m_BankerMode = (dwRules & GameDef.GAME_TYPE_RENSHU_2) > 0;
        this.m_RulesCallBanker = (dwRules & GameDef.GAME_TYPE_GOODCARD_CALL) > 0;
        GameDef.setRule(dwRules);
        this.m_wGameCount = GameDef.GetGameCount(m_dwServerRules,m_dwRulesArr);
        this.m_GameClientView.SetViewRoomInfo(m_dwServerRules,m_dwRulesArr);

        for(var i in this.m_GameClientView.m_pIClientUserItem){
            var UserItem = this.m_GameClientView.m_pIClientUserItem[i];
            if(UserItem) this.m_GameClientView.OnUserLeave(UserItem, i);
        }
        this.Rules = dwRules;
        for(var i = 0;i<GameDef.GAME_PLAYER; i++){
            var UserItem = this.GetClientUserItem(i);
            var ViewID = this.SwitchViewChairID(i);
            if(UserItem) this.m_GameClientView.OnUserEnter(UserItem, ViewID);
        }
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
         // 玩家托管
     OnSubTrustee: function (pData, wDataSize) {
        var pTrustee = GameDef.CMD_S_Trustee();
        if (wDataSize != gCByte.Bytes2Str(pTrustee, pData)) return false;
        this.m_cbTrustee[pTrustee.wChairID] = pTrustee.cbState;
        this.UpdateTrusteeControl();
        return true;
    },
    UpdateTrusteeControl: function() {
        for(var i = 0; i < GameDef.GetMaxPlayerCount(); ++ i) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserTrustee(wViewID, this.m_cbTrustee[i]);
        }
    },
       //拖管
    OnMessageTrustee: function (wParam, lParam) {
        this.SendGameData(GameDef.SUB_C_TRUSTEE);
        return 0;
    },

    //播放操作声音
    PlayActionSound :function (wChairId, byAction) {
        //椅子效验
        var pIClientUserItem = this.GetClientUserItem(wChairId);
        if (pIClientUserItem == null) return;
        if (pIClientUserItem.GetGender() == 1) {
            cc.gSoundRes.PlayGameSound("M_" + byAction);
        } else {
            cc.gSoundRes.PlayGameSound("W_" + byAction);
        }
    },

});
