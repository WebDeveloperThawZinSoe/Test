//X 排列方式
var enXLeft                      =       1;						//左对齐
var enXCenter				     =       2;		                //中对齐
var enXRight				     =		 3;                       //右对齐
//var HttpUtils = require("HttpUtils");
cc.Class({
    extends: cc.GameView,

    properties: {
        m_PhoneNode:cc.Node,
        //牌控件
        m_CardCtrlPrefab:cc.Prefab,
       // m_UserPrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,
        m_UserAction:cc.Prefab,

        m_lCellScore:cc.Label,
        m_lTimes:cc.Label,
        m_btStart:cc.Button,
        m_btGPS:cc.Button,

        m_btOutCard:cc.Button,
        m_btPrompt:cc.Button,
        m_btPass:cc.Button,
        m_btCallScore1:cc.Button,
        m_btCallScore2:cc.Button,
        m_btCallScore3:cc.Button,
        m_btCallScoreNone:cc.Button,
        m_btBanker:cc.Button,
        m_btRobBanker:cc.Button,
        m_btNoRobBanker:cc.Button,
        m_btKick:cc.Button,//踢
        m_btNoKick:cc.Button,//不踢
        m_btDouble:cc.Button,//踢
        m_btNoDouble:cc.Button,//不踢
        m_nodeShow: cc.Node,
        m_nodeNoShow: cc.Node,
        m_btLetCard:cc.Node,
        m_btNoLetCard:cc.Node,
        m_LabMultiple:cc.Node,

        m_FntEndScore:[cc.Font],
       // m_btChat:cc.Node,
        m_TableNumber:cc.Label,
        m_ClubNum:cc.Label,
        m_subsumlun:cc.Label,
        m_RulesText:cc.Label,
        m_ClockLab:cc.Label,
        m_ClockBG:cc.Node,
        m_LetCardCount:cc.Label,

       // m_btFirend:cc.Button,
      //  m_ChatPrefabNode: cc.Node,
       // m_GPSNode:cc.Node,
        m_BankerCardBG:cc.Sprite,
        m_atlas:cc.SpriteAtlas,
        m_CancelTrustee:cc.Node,
        AniCtrl:cc.Prefab,


    },
    ctor :function () {
        this.m_BackCardControl = null;          //底牌扑克
        this.m_HandCardCtrl = null;             //手牌组件
        this.m_UserCardControl = new Array();   //用户出牌
        this.m_UserShowCard = new Array();
        this.m_TwoShowCard = null;

        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_LabEndScore = new Array();
        this.m_UserlTimes3 = new Array();

        this.m_pIClientUserItem = new Array();
        this.m_cbScoreKind = 0;
        this.m_CardTestName = 'UserCheatCtrl';
    },
    // use this for initialization
    onLoad:function () {
        this.InitView();



        //UI 节点
        this.m_cardNode = this.node.getChildByName('CardNode');
        this.m_userNode = this.node.getChildByName('UserNode');
        this.m_aniNode = this.node.getChildByName('AniNode');

        //控制按钮
        this.HideAllGameButton();

        this.m_BankerCardBG.node.setPosition(-32, -68);
	    this.m_btStart.node.active = false;
        this.m_BtFriend.active = false;
     //   this.m_btChat.active = true;
        this.m_RulesText.string = '';
        this.m_subsumlun.string = '';
        this.m_LetCardCount.string = '';

        //发牌控件
        this.m_SendCardCtrl = this.m_cardNode.getComponent('SendCardCtrl_40107');
        this.m_SendCardCtrl.SetHook(this);

        //用户手牌
        this.m_HandCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
        this.m_cardNode.addChild( this.m_HandCardCtrl.node );
        this.m_HandCardCtrl.SetGameEngine(this.m_GameClientEngine);//设置消息回调

        //底牌
        this.m_BackCardControl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
        this.m_cardNode.addChild(this.m_BackCardControl.node);

        this.m_TwoShowCard = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
        this.m_cardNode.addChild(this.m_TwoShowCard.node);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户出牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
            this.m_cardNode.addChild(this.m_UserCardControl[i].node);
            //用户明牌
            this.m_UserShowCard[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
            this.m_cardNode.addChild(this.m_UserShowCard[i].node);
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_40107');
            this.m_userNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_40107');
            this.m_userNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
            //结算分数
            this.m_LabEndScore[i] = this.m_userNode.getChildByName('EndScore'+i).getComponent(cc.Label);
        }

        this.m_TableNumber.string = '';
        if( window.g_dwRoomID) {
            this.m_TableNumber.string = '房间号: '+ window.g_dwRoomID
        }
        this.m_LabMultiple.setPosition(-155, -50);

        this.m_UserPosArr = new Array(
            cc.v2(-505, 145),
            cc.v2(-575, -30),
            cc.v2(490, 140)
        )

        this.m_UserFaceArr = new Array(
            cc.v2(-505, 145),
            cc.v2(-575, -10),
            cc.v2(490, 140)
        )
        this.m_UserChatArr = new Array(
            cc.v2(-505, 145),
            cc.v2(-575, -10),
            cc.v2(490, 140)
        )
        this.m_UserVoiceArr = new Array(
            cc.v2(-505, 145),
            cc.v2(-575, -10),
            cc.v2(490, 140)
        )

        // this.m_TableGPSCtrl = this.m_GPSNode.getComponent("TableUserGPS");
        // this.m_TableGPSCtrl.node.setPosition(0,0);

        this.RectifyControl(window.SCENE_WIGHT ,window.SCENE_HEIGHT);
        this.m_GameClientEngine.m_ViewIsReady = true;
        this.ShowPrefabDLG('MacInfo',this.m_PhoneNode);
    },


    HideAllGameButton :function(){
        this.m_btOutCard.node.active = false;
        this.m_btPrompt.node.active = false;
        this.m_btPass.node.active = false;
        this.m_ClockBG.active = false;

        this.m_btCallScore1.node.active = false;
        this.m_btCallScore2.node.active = false;
        this.m_btCallScore3.node.active = false;
        this.m_btCallScoreNone.node.active = false;

        this.m_btBanker.node.active = false;
        this.m_btRobBanker.node.active = false;
        this.m_btNoRobBanker.node.active = false;

        this.m_btKick.node.active = false;
        this.m_btNoKick.node.active = false;
        this.m_btDouble.node.active = false;
        this.m_btNoDouble.node.active = false;

        this.m_nodeNoShow.active = false;
        this.m_nodeShow.active = false;
        this.m_btNoLetCard.active = false;
        this.m_btLetCard.active =false;
    },
    ShowCallUI:function(CurrentScore){
        if(this.m_GameClientEngine.m_BankerMode){
            if(CurrentScore == 0){
                this.m_btBanker.node.active = true;
                this.m_btCallScoreNone.node.active = true;
                this.m_ClockBG.active = true;
            }else{
                this.m_btRobBanker.node.active = true;
                this.m_btNoRobBanker.node.active = true;
                this.m_ClockBG.active = true;
            }

        }else{
            this.m_btCallScore1.node.active = true;
            this.m_btCallScore2.node.active = true;
            this.m_btCallScore3.node.active = true;
            this.m_btCallScoreNone.node.active = true;
            this.m_ClockBG.active = true;

            //禁用按钮
            this.m_btCallScore1.interactable = ((CurrentScore == 0) ? true : false);
            this.m_btCallScore2.interactable = ((CurrentScore <= 1) ? true : false);
            this.m_btCallScore3.interactable = ((CurrentScore <= 2) ? true : false);
        }

        if (this.m_GameClientEngine.CheckGoodCard()) {
            this.m_btCallScore1.interactable = false;
            this.m_btCallScore2.interactable = false;
            this.m_btCallScore3.interactable = true;
            this.m_btCallScoreNone.interactable = false;
        } else {
            this.m_btCallScoreNone.interactable = true;
        }

    },
    ShowDoubleUI :function(bShowKick){
        if(false){
            this.m_btDouble.node.active = true;
            this.m_ClockBG.active = true;
            this.m_btNoDouble.node.active = true;
        }else{
            this.m_btKick.node.active = bShowKick;
            this.m_btNoKick.node.active = bShowKick;
            this.m_ClockBG.active = true;
        }
    },
    ShowOpenCardUI: function () {
        this.m_nodeNoShow.active = true;
        this.m_nodeShow.active = true;
    },
    LetOpenCardUI:function (){
        var ShowLet = this.m_atlas.getSpriteFrame('L'+GameDef.GetLetCardCount(this.m_dwRules));
        this.m_btLetCard.getComponent(cc.Sprite).spriteFrame = ShowLet;
        this.m_btLetCard.active = true;
        this.m_btNoLetCard.active = true;
        this.m_ClockBG.active = true;
    },
    ShowCardUI :function(){
         //启用按钮
         this.m_btOutCard.interactable = this.m_GameClientEngine.VerdictOutCard();
         this.m_btPass.interactable = (this.m_GameClientEngine.m_cbTurnCardCount > 0);

         //显示按钮
         this.m_btOutCard.node.active = true;
         this.m_btPass.node.active = true;
         this.m_btPrompt.node.active = true;
         this.m_ClockBG.active = true;
    },
    SetUserEndScore:function(wChairID, Score){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_LabEndScore[i].string = '';
            }
            return
        }
        if(Score == null) {
            Score = '';
        }else{
            this.m_LabEndScore[wChairID].font = this.m_FntEndScore[Score > 0 ? 0 : 1];
           
            if(Score > 0) Score = '+'+ Score2Str(Score);
            else Score =  Score2Str(Score);
        }
            this.m_LabEndScore[wChairID].string = Score;
   },
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        if(pUserItem.GetUserStatus() == US_READY) this.SetUserState(wChairID, 'Ready');
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        // if(this.m_GameClientEngine.IsLookonMode() == false)
        // {
        //     this.m_BtStart.active = pUserItem.GetUserStatus() == US_SIT;
        // }



        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
      //  if(pUserItem.GetUserID()  == pGlobalUserData.dwUserID) this.m_ChatControl.InitSink(this.m_GameClientEngine, wChairID);
        this.UpdateUserKickOut();
    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(pUserItem.GetUserStatus() == US_READY) {
            this.SetUserState(wChairID, 'Ready');
            //this.m_GameClientEngine.PlayActionSound(pUserItem.GetChairID(), "READY");
            if(wChairID == GameDef.MYSELF_VIEW_ID)this.m_GameClientEngine.OnMessageStart(null,true);
        }else{
            this.m_UserState[wChairID].HideState();
        }
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave :function (pUserItem, wChairID) {
        var ViewID = this.m_GameClientEngine.SwitchViewChairID(wChairID);
        for(var i in this.m_UserInfo){
            this.m_UserInfo[i].UserLeave(pUserItem);
        }
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem);
    },

    UserExpression:function (SendUserID, TagUserID, wIndex){
        var SendChair = INVALID_CHAIR,RecvChair = INVALID_CHAIR;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( this.m_pIClientUserItem[i] == null) continue
            if( this.m_pIClientUserItem[i].GetUserID() == SendUserID) SendChair = i;
            if( this.m_pIClientUserItem[i].GetUserID() == TagUserID) RecvChair = i;
        }
        if(wIndex < 2000)  this.m_ChatControl.ShowBubblePhrase(SendChair, wIndex, this.m_pIClientUserItem[SendChair].GetGender());
        else if(wIndex < 3000 && this.m_FaceExCtrl) this.m_FaceExCtrl.OnSendFaceEx(SendChair,RecvChair, wIndex);
    },
    UserChat:function (SendUserID, TagUserID, str){
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( this.m_pIClientUserItem[i] == null) continue
            if( this.m_pIClientUserItem[i].GetUserID() == SendUserID){
                this.m_ChatControl.ShowBubbleChat(i, str);
                break;
            }
        }
    },
    //初始化牌
    InitTableCard:function(){
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserCardControl[i].SetCardData(null, 0);
            this.m_UserShowCard[i].SetCardData(null, 0);
        }
        this.m_HandCardCtrl.SetCardData(null, 0);
        this.m_BackCardControl.SetCardData(null, 0);
        this.m_TwoShowCard.SetCardData(null,0);
    },

    //调整控件
    RectifyControl:function (nWidth, nHeight){
        //this.m_cardNode 坐标系
        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0,nHeight/2+100), [cc.v2(-455, 120),cc.v2(0, -270),cc.v2(400, 200)]);
        //用户扑克
        this.m_HandCardCtrl.SetBenchmarkPos(-2,-355,enXCenter);
        this.m_HandCardCtrl.SetCardDistance(66);
        this.m_HandCardCtrl.SetScale(0.9);

        //底牌位置
        this.m_BackCardControl.SetCardDistance(GameDef.CARD_WIGTH + 10);
	    this.m_BackCardControl.SetBenchmarkPos(-35,255,enXCenter);
        this.m_BackCardControl.SetScale(0.41);

        //出牌位置
        var CardScale = 0.43;
        this.m_UserCardControl[0].SetScale(CardScale);
        this.m_UserCardControl[1].SetScale(CardScale);
        this.m_UserCardControl[2].SetScale(CardScale);
        this.m_UserCardControl[0].SetBenchmarkPos(-357, -3, enXLeft);
        this.m_UserCardControl[1].SetBenchmarkPos(0, -120,enXCenter);
        this.m_UserCardControl[2].SetBenchmarkPos(295, 113,enXRight);

        this.m_UserShowCard[0].SetScale(CardScale);
        this.m_UserShowCard[1].SetScale(CardScale);
        this.m_UserShowCard[2].SetScale(CardScale);
        this.m_UserShowCard[0].SetBenchmarkPos(0, 0, enXLeft);
        this.m_UserShowCard[1].SetBenchmarkPos(-720, -1280,enXLeft);
        this.m_UserShowCard[2].SetBenchmarkPos(600, 135,enXRight);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[i]);
        }


        this.m_UserState[0].SetBenchmarkPos(-430, 160, enXLeft);
        this.m_UserState[1].SetBenchmarkPos(-520, -150, enXLeft);
        this.m_UserState[2].SetBenchmarkPos(420, 155, enXRight);
    },

    OnBnClickedFirend:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnFirend();
    },

    OnBnClickedStart:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageStart();
    },


    //托管
    // OnBnClickedTrustee:function () {
    //     cc.gSoundRes.PlaySound('Button');
    //     var trustee_show=cc.moveTo(0.1,cc.p(window.SCENE_WIGHT/2,117));
    //     this.m_CancelTrustee.runAction(trustee_show);
    //     this.m_GameClientEngine.OnMessageTrusteeControl();
    // },
    //叫分按钮回调
    OnBnClickedCallScore:function (Tag, Data){
        // 1 2 3 0xff(不叫) 4抢地主 5不抢
        this.m_GameClientEngine.OnMessageCallScore(Data);
    },

    //踢按钮
    OnBnClickedDouble:function (Tag, Data){
        this.m_GameClientEngine.OnMessageDouble(parseInt(Data));
    },

    OnBnClickedShow: function (tag, Data) {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageShow(parseInt(Data));
    },
    OnBnClickedLet:function (tag, Data) {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageLet(parseInt(Data));
    },

    //操作按钮回调
    OnBnClickedPrompt :function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutPrompt(0,0);
    },

    OnBnClickedOutCard:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageOutCard(1,0);
    },

    OnBnClickedPass:function (){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessagePassCard(0,0);
    },

    //聊天按钮回调
    OnBnClickedChat:function  ()
    {
        cc.gSoundRes.PlaySound('Button');
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },


    //设置底分
    SetCellScore:function ( lCellScore ) {
        this.m_lCellScore.string = lCellScore;
    },
    //倍数
    SetTimes:function (lTimes,bShow) {
        if(bShow == true)   this.m_lTimes.string = '';
        else this.m_lTimes.string = '倍数X'+lTimes;
    },
    SetLetCount:function (count) {
        this.m_LetCardCount.string ='地主让'+count+'张';
    },
    //设置庄家
    SetBankerUser:function ( wBankerUser) {
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].SetBanker(i == wBankerUser,wBankerUser);
        }
        this.m_HandCardCtrl.setBanker(wBankerUser == GameDef.MYSELF_VIEW_ID);
        return;
    },
    //设置状态
    UpdateUserCardCount:function(ViewID, Cnt){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideCnt();
            }
        }else{
            this.m_UserState[ViewID].ShowCnt(Cnt,GameDef.GetMaxPlayerCount());
        }
    },
    //设置时间
    SetUserTimer:function (wChairID, wTimer,i){
        for(var i=0;i<GameDef.GAME_PLAYER;i++) {
            this.m_UserState[i].ShowClock(i==wChairID);
            this.m_UserState[1].ShowClock(false);
        }
        if(wChairID == INVALID_CHAIR) return
        this.m_UserState[wChairID].SetClockNum(wTimer);
        this.m_ClockLab.string = wTimer;
    },
    SetUserState:function(ViewID, State, Cnt){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[ViewID].ShowUserState(State, Cnt);
            if(State =='Ready') {
                if(GameDef.GetMaxPlayerCount() == 2){
                    this.m_UserState[1].SetBenchmarkPos(-510,-220,enXLeft);
                } else   this.m_UserState[1].SetBenchmarkPos(-510,-10,enXLeft);

            }
            else if (State =='Pass'){
                this.m_UserState[1].SetBenchmarkPos(this.m_UserCardControl[1].node.x,this.m_UserCardControl[1].node.y+50, enXCenter);
            }
            else if (State =='NoHave'){
                this.m_UserState[1].SetBenchmarkPos(-180,30,enXLeft);
            }
            else {
                if(GameDef.GetMaxPlayerCount() == 2){
                    this.m_UserState[1].SetBenchmarkPos(-510,-220,enXLeft);
                } else   this.m_UserState[1].SetBenchmarkPos(-510,-10,enXLeft);
            }
            // if(state == 'NoHave')this.m_stateSprite.setPosition(-67,100);
        }
    },

    //显示底牌
    ShowBankerCard:function (cbCardData){
        var count = GameDef.BACK_COUNT;
        if(cbCardData == null) count = 0;
        this.m_BackCardControl.SetCardData(cbCardData, count);
        if(cbCardData == null) this.m_BankerCardBG.node.active = false;
        else this.m_BankerCardBG.node.active = true;
        //this.m_BankerCardBG.node.active = cbCardData == null;
    },

    //设置警告
    SetUserCountWarn:function ( wChairID, bCountWarn)
    {

        return;
    },

    // //设置托管
    // SetUserTrustee:function (wChairID,bTrustee)
    // {
    //     return
    //     if(wChairID == GameDef.MYSELF_VIEW_ID)
    //     {
    //         if(bTrustee)
    //             var trustee_show=cc.moveTo(0.1,cc.p(window.SCENE_WIGHT/2,117));
    //         else var trustee_show=cc.moveTo(0.1,cc.p(window.SCENE_WIGHT/2,-117));
    //         this.m_CancelTrustee.runAction(trustee_show);
    //     }
    //     this.m_UserInfo[wChairID].SetTrustee(bTrustee);
    // },

    //设置结束信息
    SetGameEndInfo:function ( wWinner )
    {
        if( wWinner == INVALID_CHAIR ) return ;
    },
    OnClieckRulse:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Rules_40107',this.node,function(Js){
            Js.SetRules(GameDef.GetRulesStr(this.m_GameClientEngine.m_dwServerRules, this.m_GameClientEngine.m_dwRulesArr));
        }.bind(this));
    },

    //设置结算界面信息
    ShowGameScoreInfo:function (scoreInfo,bShow,gameID) {
        this.m_EndScore.active = bShow;
        this.m_EndScoreWinFlag.active = false;
        this.m_EndScoreLoseFlag.active = false;
        //this.m_btJieShu.node.active = true;
        for(var i=0;i<GameDef.GAME_PLAYER;i++)        {
            var time = 1;
            if(i!=scoreInfo.wBankerUser){
               // time = this.m_GameClientEngine.m_lTimes*(scoreInfo.szTi[scoreInfo.wBankerUser] ? 2 : 1)*(scoreInfo.szTi[i]? 2 : 1)
            }else{
                var owmTime = 0;
                for(var j = 0;j<3;j++){
                    if(j == scoreInfo.wBankerUser){
                        continue;
                    }
                    if(scoreInfo.szTi[j]){
                        owmTime+=2
                    }else{
                        owmTime+=1
                    }
                }
               // time = this.m_GameClientEngine.m_lTimes*owmTime*(scoreInfo.szTi[scoreInfo.wBankerUser] ? 2 : 1)
            }
            this.m_EndScoreName[i].string = cutstr(scoreInfo.szNickName[i],8);
            this.m_EndScoreGameID[i].string = "ID:" + gameID[i];
            this.m_EndScoreCellScore[i].string = this.m_lCellScore.string;
            if(scoreInfo.bChunTian || scoreInfo.bFanChunTian)
                this.m_EndScoreTimes[i].string = "X"+time*2;
            else
                this.m_EndScoreTimes[i].string ="X"+time;
            //
            if(scoreInfo.lGameScore[i]>=0)
                this.m_EndScoreScore[i].string = "+"+scoreInfo.lGameScore[i].toString();
            else
                this.m_EndScoreScore[i].string = scoreInfo.lGameScore[i].toString();

        }
        //this.m_EndScoreName[GameDef.MYSELF_VIEW_ID].node.active = false;
        if(scoreInfo.lGameScore[this.m_GameClientEngine.GetMeChairID()] < 0)
        {
            this.m_EndScoreLoseFlag.active = true;
        }
        else
        {
            this.m_EndScoreWinFlag.active = true;
        }

    },
    //设置警告
    SetViewRoomInfo:function (m_dwServerRules,m_dwRulesArr){
        this.m_dwRules = m_dwRulesArr[0];
        if(this.m_GameClientEngine.m_dwClubID > 0)
        this.m_ClubNum.string = 'ID:'+this.m_GameClientEngine.m_dwClubID;
        this.m_TableNumber.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
        this.m_RulesText.string = GameDef.GetRulesStr(m_dwServerRules,m_dwRulesArr);
        this.m_LbGameRules.string = GameDef.GetRulesStr(m_dwServerRules,m_dwRulesArr);

        if(this.m_VoiceCtrl == null){
            this.ShowPrefabDLG('VoiceCtrl',this.$("VoiceNode"),function(Js){
                this.m_VoiceCtrl = Js;
                this.m_VoiceCtrl.InitVoice(this);
                var NdButton = this.m_VoiceCtrl.node.getChildByName('Voice').getChildByName('btVoice');
                NdButton.setPosition(this.m_BtChat.x, this.m_BtChat.y-85);
            }.bind(this));

        }

        var bShow = this.m_GameClientEngine.IsLookonMode();
        if(this.$("VoiceNode")) this.$("VoiceNode").active = !bShow;
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        if (this.m_BtGPS) this.m_BtGPS.active = (GameDef.IsNoCheat(m_dwRulesArr)&&!bShow);

        // if((GameDef.GAME_TYPE_NOSPEAK & this.m_GameClientEngine.m_dwRulesArr[0])==0){
        //     if(!this.m_RealTimeVoice){

        //     }
        // }

        // var kernel = gClientKernel.get();
        // if(!kernel.IsLookonMode() && !this.m_RealTimeVoice && (!GameDef.IsAllowRealTimeVoice || GameDef.IsAllowRealTimeVoice(m_dwServerRules, m_dwRulesArr)) ) {
        //     this.ShowPrefabDLG('RealTimeVoice',this.node,function(Js){
        //         this.m_RealTimeVoice = Js;
        //         this.m_RealTimeVoice.node.zIndex = 0;
        //         this.m_RealTimeVoice.SetPosition(cc.v2(this.m_btChat.getPositionX(),this.m_btChat.getPositionY()+85));
        //         this.m_RealTimeVoice.Enter(this.m_GameClientEngine.GetMeChairID(), this.m_GameClientEngine.m_dwRoomID);
        //     }.bind(this));
        // }


        if(this.m_ChatControl == null){
            this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                this.m_ChatControl = Js;
                this.m_ChatControl.ShowSendChat(false);
                //this.m_ChatControl.ShowSendText((GameDef.GAME_TYPE_NOSPEAK & this.m_GameClientEngine.m_dwRulesArr[0])==0)
               // this.m_ChatControl.ShowInputNode(GameDef.IsNoInput(m_dwRulesArr));
                this.m_ChatControl.InitHook(this);
                this.m_ChatControl.node.zIndex = 1;
            }.bind(this));
        }

       // this.m_btGPS.node.active = true;//GameDef.IsNoCheat(dwRules);

        // if(dwRules & GameDef.GAME_TYPE_NO_VOICE){
        //     this.m_Voice.active = false;
        // }else  this.m_Voice.active = true;
       if(GameDef.GetMaxPlayerCount() == 2){

       this.m_UserPosArr = new Array(
            cc.v2(390, 290),
            cc.v2(-574, -218),
            cc.v2(500, 165)
    )
        this.m_UserFaceArr = new Array(
            cc.v2(390, 290),
            cc.v2(-574, -218),
            cc.v2(500, 165)
        )
        this.m_UserChatArr = new Array(
            cc.v2(390, 290),
            cc.v2(-574, -218),
            cc.v2(500, 165)
        )
        this.m_UserVoiceArr = new Array(
            cc.v2(390, 290),
            cc.v2(-574, -218),
            cc.v2(500, 165)
        )
        this.m_LabMultiple.setPosition(-890, -310);
        this.m_BankerCardBG.node.setPosition(-500, -200);

        this.m_TwoShowCard.SetBenchmarkPos(260,255,enXRight);
        this.m_TwoShowCard.SetCardDistance(100);
        this.m_TwoShowCard.SetScale(0.30);

        this.m_BackCardControl.SetBenchmarkPos(-500, 135,enXCenter)
        this.m_BackCardControl.SetScale(0.35);

        this.m_HandCardCtrl.SetBenchmarkPos(58,-355,enXCenter);
        this.m_HandCardCtrl.SetCardDistance(70);

        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0,window.SCENE_HEIGHT/2+100), [cc.v2(400, 250),cc.v2(0, -270),cc.v2(400, 200)]);
        this.m_UserCardControl[0].SetBenchmarkPos(300, 28, enXRight);
        this.m_UserInfo[0].node.setPosition(this.m_UserPosArr[0]);
        this.m_UserInfo[1].node.setPosition(this.m_UserPosArr[1]);
        this.m_UserState[0].SetBenchmarkPos(320, 220, enXRight);
        this.m_LabEndScore[0].node.setPosition(352,140);
        // this.m_VoiceCtrl.m_PlayingArr[0].node.scale=-1;
        // this.m_VoiceCtrl.m_PlayingArr[0].node.setPosition(430,230);
       }
       this.ShowPrefabDLG('FaceExCtrl',this.m_aniNode,function(Js){
        this.m_FaceExCtrl = Js;
     //   this.m_FaceExCtrl.SetPosArr(this.m_UserPosArr);
    }.bind(this));
        this.UpdateUserKickOut();
    },
    UpdateRoomProgress:function (){
        this.m_subsumlun.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
        this.UpdateUserKickOut();
    },
    // OnBtShowGPS:function(){
    //     this.m_GameClientEngine.GetTableUserGPS();
    //     this.m_TableGPSCtrl.ShowView();
    //     this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem)
    // },
    // OnGPSAddress:function(GPSInfo){
    //     this.m_TableGPSCtrl.UpdateAddress(this, GPSInfo,GameDef.GetMaxPlayerCount());
    // },
    // OnBtShowGPS:function(){
    //     this.m_GameClientEngine.GetTableUserGPS();
    //     //this.m_TableGPSCtrl.ShowView();
    //     //this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem)
    // },
    // OnGPSAddress:function(GPSInfo){
    //     //this.m_TableGPSCtrl.SetUserAddress(this.m_pIClientUserItem, GPSInfo);
    // },
    PlayAni:function (cbTurnCardType,wViewChairID){
        if(this.m_AniArr == null){
            this.m_AniArr = new Array();
            this.m_AniArr[GameDef.CT_SINGLE_LINE] = "AniLine"
            this.m_AniArr[GameDef.CT_DOUBLE_LINE] = "AniDLine";
            this.m_AniArr[GameDef.CT_THREE_LINE] = "AniPlane";
            this.m_AniArr[GameDef.CT_BOMB_CARD] = "AniBomb";
            this.m_AniArr[GameDef.CT_MISSILE_CARD] = "AniBomb";
            this.m_AniArr[GameDef.CT_AIRPLANE_ONE] = "AniPlane";
            this.m_AniArr[GameDef.CT_AIRPLANE_TWO] = "AniPlane";
            this.m_AniArr[GameDef.CT_THREE_TAKE_TWO] = "Ani3D2";
        }

            var ActionPrefab = cc.instantiate(this.m_UserAction);
            var ActionNode = ActionPrefab.getComponent('ActionCtrl_'+GameDef.KIND_ID);
            this.m_aniNode.addChild(ActionPrefab);
            ActionNode.SetAction(cbTurnCardType,wViewChairID);
    },
    AniFinish:function(){

    },
    UpdateUserKickOut:function (){
        if(this.m_GameClientEngine.m_ReplayMode) return
        if(this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID] == null ) return
        var UserID = this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID].GetUserID();
        var OutPower = this.m_GameClientEngine.m_bLockInRoom || (UserID == this.m_GameClientEngine.m_dwCreater)
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            if( this.m_pIClientUserItem[i] == null ) continue;
            var bCanOut = this.m_GameClientEngine.m_LockArr[this.m_pIClientUserItem[i].GetChairID()];
            if(bCanOut == null) bCanOut = false;
            this.m_UserInfo[i].SetKickOut(i != GameDef.MYSELF_VIEW_ID && OutPower && !bCanOut);
        }
    },
            //托管
    OnBnClickedTrustee: function (event, customData) {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageTrustee(customData);
    },
        //设置托管
    SetUserTrustee: function (wViewID, cbTrustee) {
        if (wViewID == GameDef.MYSELF_VIEW_ID) {
            // if(this.m_cbTrustee != cbTrustee) {
                if (cbTrustee) var trustee_show = cc.moveTo(0.1, cc.v2(0, 0));
                else var trustee_show = cc.moveTo(0.1, cc.v2(0, -320));
                this.m_CancelTrustee.stopAllActions();
                this.m_CancelTrustee.runAction(trustee_show);
                this.m_cbTrustee = cbTrustee;
            // }
        }
        this.m_UserInfo[wViewID].SetTrustee((cbTrustee == 1));
    },
});
