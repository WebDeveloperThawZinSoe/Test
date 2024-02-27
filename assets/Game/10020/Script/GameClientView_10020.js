//X 排列方式
var enXLeft                      =       1;						//左对齐
var enXCenter				     =       2;		                //中对齐
var enXRight				     =		 3;                       //右对齐
cc.Class({
    extends: cc.GameView,

    properties: {
        m_PhoneNode:cc.Node,
        //牌控件
        m_CardCtrlPrefab:cc.Prefab,
        m_UserTypePrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,

        m_lCellScore:cc.Label,
        m_LabTableScore:cc.Label,
        m_btStart:cc.Button,

        m_btPass:cc.Button,

        m_btFollow:cc.Button,

        m_btCallA1:cc.Button,
        m_btCallA2:cc.Button,
        m_btCallA3:cc.Button,
        m_btCallM1:cc.Button,
        m_NdAddScore:cc.Node,
        m_LbAddScore:cc.Label,

        m_NdCtrlStart:cc.Node,
        m_FntEndScore:[cc.Font],
        m_TableNumber:cc.Label,
        m_ClubNum:cc.Label,
        m_subsumlun:cc.Label,
        m_RulesText:cc.Label,
        m_LbGameRules:cc.Label,
      
        m_btFirend:cc.Button,
        m_LabTurn:cc.Label,
        m_NodeScore:[cc.Node],

        m_touzi:cc.Node,
        m_piao:cc.Node
    },
    ctor :function () {
        this.m_CardTestName = 'UserCheatCtrl';

        this.m_UserCardControl = new Array();   //用户牌
        this.m_UserCardType = new Array();   //用户牌
        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_LabEndScore = new Array();       //结算分数
    
        this.m_pIClientUserItem = new Array();
        this.m_lAllTableScore = 0;
        this.m_lTableScore = new Array();
        this.m_bLookCard = new Array();
        this.m_UserPlay = new Array();
        this.m_bShowBt = false;
        this.m_lAddScore = 0;
        this.m_lMaxAddScore = 0;
    },
    // use this for initialization
    start:function () {
        this.InitView();

        this.m_touzi.active = false;
        this.m_piao.active = false;

        this.m_touzi.setPosition(0,150);
        this.m_piao.setPosition(0,150);
        //UI 节点
        //
        //控制按钮
        this.HideAllGameButton();
	    this.m_btStart.node.active = false;
        this.m_btFirend.node.active = false;
        this.m_RulesText.string = '';

        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_'+GameDef.KIND_ID);
        this.m_SendCardCtrl.SetHook(this);
        
        //筹码控件
        this.m_JetCtrl = this.m_JetNode.getComponent('JetCtrl_'+GameDef.KIND_ID);
        this.m_JetCtrl.SetHook(this);
        
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_'+GameDef.KIND_ID);
            this.m_UserCardControl[i].m_GameClientEngine = this.m_GameClientEngine;
            this.m_CardNode.addChild(this.m_UserCardControl[i].node);
            //牌型
            this.m_UserCardType[i] = cc.instantiate(this.m_UserTypePrefab).getComponent('CardType_'+GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_UserCardType[i].node);
            this.m_UserCardType[i].SetCardType(null);
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_'+GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_'+GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
            //结算分数
            this.m_LabEndScore[i] = this.m_UserNode.getChildByName('EndScore'+i).getComponent(cc.Label);
            this.m_LabEndScore[i].string='';
            this.m_NodeScore[i].active = false;
        }
      
        this.m_TableNumber.string = '';
        if( window.g_dwRoomID) {
            this.m_TableNumber.string = '房间号: '+ window.g_dwRoomID
        }
        
        this.m_UserPosArr = new Array(
            cc.v2(-440, 238),
            cc.v2(-566, 0),
            cc.v2(-535, -200),
            cc.v2(570, 0),
            cc.v2(351, 244),
            cc.v2(-42, 262)
        )

        this.m_CardPos = new Array(
            cc.v2(-353, 84),
            cc.v2(-435, -98),
            cc.v2(-292, -323),
            cc.v2(315, -101),
            cc.v2(128, 72),
            cc.v2(-103, 86)
        )
        this.m_UserFaceArr = new Array();
        this.m_UserChatArr = new Array();
        this.m_UserVoiceArr = new Array();
        this.RectifyControl(SCENE_WIGHT ,SCENE_HEIGHT);
        this.m_GameClientEngine.m_ViewIsReady = true;
        this.ShowPrefabDLG('MacInfo',this.m_PhoneNode);
    },

    HideAllGameButton :function(){
        this.m_bShowBt = false;
        this.m_btPass.node.active = false;
        
        this.m_btFollow.node.active = false;
        this.m_btCallA1.node.active = false;
        this.m_btCallA2.node.active = false;
        this.m_btCallA3.node.active = false;
        this.m_btCallM1.node.active = false;
        
        this.m_NdAddScore.active = false;

    },
    ShowCallUI:function(lv, Other){
        

        this.$('BtUINode/BTBG/Layout/BtPiao').active = false;
        this.$('BtUINode/BTBG/Layout/BtBuPiao').active = false;

        if(lv==4){

            this.m_btCallA1.node.active = false;
            this.m_btCallA2.node.active = false;
            this.m_btCallA3.node.active = false;
            this.m_btCallM1.node.active = false;
            this.m_btFollow.node.active = false;
            this.m_btPass.node.active = false;
            if(Other == null){
                this.$('BtUINode/BTBG/Layout/BtPiao').active = true;
                this.$('BtUINode/BTBG/Layout/BtBuPiao').active = true;
            }
            return
        }

        this.m_btPass.interactable = true;
        if(Other == null){
            if(this.m_GameClientEngine.m_AddScore > 0){
                this.m_btFollow.node.active = true;
                this.m_btFollow.interactable = true;
            }
            this.m_btPass.node.active = true;
            
            this.m_btCallA1.node.active = false;
            this.m_btCallA2.node.active = false;
            this.m_btCallA3.node.active = false;
            this.m_btCallM1.node.active = false;
            if(this.m_GameClientEngine.m_showAdd == false){
              //  this.m_btCallA1.node.active = true;
                this.m_btCallA2.node.active = true;
                this.m_btCallA3.node.active = true;
                this.m_btCallM1.node.active = true;
            }
            
            var betScore = GameDef.GetBaseScore(0,this.m_rules);
            //this.$("BtFont@Label",this.m_btCallA1.node).string = '加'+betScore+'分';
            this.$("BtFont@Label",this.m_btCallA2.node).string = '加'+betScore*1+'分';
            this.$("BtFont@Label",this.m_btCallA3.node).string = '加'+betScore*2+'分';
            this.$("BtFont@Label",this.m_btCallM1.node).string = '加'+betScore*3+'分';
            this.$("BtFont@Label",this.m_btFollow.node).string = '跟'+this.m_GameClientEngine.m_AddScore+'分';

        }else{
            if(this.m_UserPlay[GameDef.MYSELF_VIEW_ID]){
                this.m_btPass.interactable = true;
                this.m_btPass.node.active = true;
            }
            else{
                this.m_btPass.interactable = false;
                this.m_btPass.node.active = false;
            }
            this.m_btFollow.interactable = false;
        }
        
    },

    AniFinish:function(){
        if(this.m_touzi.active){
            this.m_touzi.active = false;
            this.PiaoAni =  this.m_piao.getComponent('AniPrefab');
            this.PiaoAni.Init(this);
            var piao = 'piaopai' + this.m_Dice;
            this.PiaoAni.PlayAni (piao,1);
            this.m_piao.active = true;
        }
        else if(this.m_piao.active){
            this.m_piao.active = false;
            this.m_SendCardCtrl.PlaySendCard(1, this.m_GameClientEngine.SwitchViewChairID(this.m_GameClientEngine.m_wCurrentUser),this.m_UserPlay);
        }
    },

    ShowTouzZi:function(cbDice){
        this.m_touzi.active = true;
        var dice = 'dice' + cbDice;
        this.m_Dice = cbDice;
        if (!this.m_touziCtrl) {
            this.m_touziCtrl = this.m_touzi.getComponent('AniPrefab');
            this.m_touziCtrl.Init(this);
        }
        this.m_touziCtrl.PlayAni(dice,1);
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
            this.m_LabEndScore[wChairID].Font = this.m_FntEndScore[Score > 0 ? 0 : 1];
            if(Score > 0) Score = Score2Str(Score);
        }
        this.m_LabEndScore[wChairID].string = Score;
    },
    SetCardType:function(ViewID, Type){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserCardType[i].SetCardType();
            }
            return
        }
        this.m_UserCardType[ViewID].SetCardType(Type)
    },
    SetCardScore:function(ViewID, Type){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserCardType[i].SetCardScore();
            }
            return
        }
        this.m_UserCardType[ViewID].SetCardScore(Type);
    },
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(this.m_lTableScore[wChairID] == null) this.m_lTableScore[wChairID] = 0;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_lTableScore[wChairID]);
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        this.m_NodeScore[wChairID].active = true;

        if(!this.m_GameClientEngine.m_ReplayMode && wChairID == GameDef.MYSELF_VIEW_ID){
            if(this.m_ChatControl == null){
                this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false); 
                    this.m_ChatControl.InitHook(this);
                }.bind(this));
            }

            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.$("VoiceNode"),function(Js){
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                }.bind(this));
            }

            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                    this.m_FaceExCtrl = Js;
                }.bind(this));
            }
        }
    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_lTableScore[wChairID] );
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        this.m_NodeScore[wChairID].active = true;

    },
    OnUserLeave :function (pUserItem, wChairID) {
        this.m_UserInfo[wChairID].UserLeave(pUserItem);
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
        this.m_NodeScore[wChairID].active = false;

    },
    OnUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem, this.m_lTableScore[wChairID]);
    },


    OnBtClickedPiao:function(tag,data){

        this.m_GameClientEngine.OnMessagePiao(parseInt(data));
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
    //初始化牌
    InitTableCard:function(){
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserCardControl[i].SetCardData(null, 0);
            this.HideUserLookCard(i);
        }
    },
    HideUserLookCard:function(ViewID){
        this.m_bLookCard[ViewID] = false;
        this.m_UserCardType[ViewID].SetCardType(null);
    },
    OnUserLookCard:function(wChairID, Card){
        this.m_bLookCard[wChairID] = true;
        if(wChairID == GameDef.MYSELF_VIEW_ID && !this.m_GameClientEngine.m_ReplayMode){
            this.m_UserCardControl[wChairID].SetCardData(Card, GameDef.MAX_COUNT);
        }else{
            this.SetCardType(wChairID, 0);
        }
    },
    //调整控件
    RectifyControl:function (nWidth, nHeight){
        //筹码动画
        this.m_JetCtrl.SetBenchmarkPos(cc.v2(0,20), 270, 120);
        this.m_JetCtrl.SetUserPos(this.m_UserPosArr);
        //this.m_CardNode 坐标系

        let SendPos = new Array();

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserFaceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x+(this.m_UserPosArr[i].x>=390?-70:70),this.m_UserPosArr[i].y+70);
            this.m_UserVoiceArr[i] = cc.v2(this.m_UserPosArr[i].x+40,this.m_UserPosArr[i].y-28);
            this.m_UserCardControl[i].SetScale(i==GameDef.MYSELF_VIEW_ID?0.65:0.45);
            this.m_UserInfo[i].node.setPosition( this.m_UserPosArr[i] );

            this.m_UserCardControl[i].SetBenchmarkPos(this.m_CardPos[i].x, this.m_CardPos[i].y, enXLeft);

            Posx += 68;
            Posy += 28;
            this.m_UserCardType[i].SetBenchmarkPos(this.m_CardPos[i].x+40, this.m_CardPos[i].y+40);

            var Posx = this.m_UserPosArr[i].x + (this.m_UserPosArr[i].x>=390?-160:65);
            var Posy = this.m_UserPosArr[i].y;
            this.m_UserState[i].SetBenchmarkPos(this.m_CardPos[i].x, this.m_CardPos[i].y,enXLeft);
            
            this.m_NodeScore[i].setPosition(this.m_CardPos[i].x+80, this.m_CardPos[i].y - 10);

            SendPos[i] = this.m_CardPos[i];
            SendPos[i].x += 100;
            SendPos[i].y += 100;
        }

        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(0, 124), SendPos);

        this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardDistance(0);
        //this.m_UserState[GameDef.MYSELF_VIEW_ID].SetBenchmarkPos(-440, 200, enXLeft);
    },

    OnBnClickedFirend:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnFriend();
    },

    OnBnClickedStart:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageStart();
    },
    OnBtClickedCtrlStart() {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCtrlStart();
    },
 //////////////////////////////////////////////////////////////////////////////
    //叫分按钮回调
    OnBnClickedCallScore:function (Tag, Data){
        this.m_lAddScore += parseInt(Data);
        var MaxScore = this.m_lMaxAddScore;
        if(this.m_bLookCard[GameDef.MYSELF_VIEW_ID]) MaxScore*=2;
        if(this.m_lAddScore > MaxScore) this.m_lAddScore = MaxScore;
        this.m_LbAddScore.string = '下注：'+ this.m_lAddScore;
    },
    //下注
    OnBnClickedAddSure:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallScore(Data);
    },
    //跟
    OnBnClickedFollow:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallScore(0);
    },
    // 比牌玩家
    OnBnClickedCompare:function (){
       // this.ShowCallUI(2);
       // return
        var TagUser = INVALID_CHAIR;
        var OtherUser = 0;

        for(var i in this.m_UserPlay){
            if(!this.m_UserPlay[i] || i == GameDef.MYSELF_VIEW_ID) continue;
            OtherUser++;
            TagUser = i;
        }
        if(OtherUser > 1){
            this.ShowCallUI(2);
        }else{
            this.m_GameClientEngine.OnMessageCompare( this.m_pIClientUserItem[TagUser].GetChairID());
        }
    },
    // 比牌玩家
    OnBnClickedCompareUser:function (Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCompare(this.m_pIClientUserItem[parseInt(Data)].GetChairID());
    },

    OnBnClickedPass:function (){
        cc.gSoundRes.PlaySound('Button');
        if( this.m_UiLv != 1){
            this.m_GameClientEngine.OnMessagePassCard();
        }else{
            this.HideAllGameButton();
            this.ShowCallUI(0);
        }
    },
    OnBnClickedLookCard:function (){
        cc.gSoundRes.PlaySound('Button');
        if( this.m_bLookCard[GameDef.MYSELF_VIEW_ID]) return;
        this.m_GameClientEngine.OnMessageLookCard();
    },
    OnBnClickedShowAdd:function (){
        cc.gSoundRes.PlaySound('Button');
        this.HideAllGameButton();
        this.ShowCallUI(1);
    },
 //////////////////////////////////////////////////////////////////////////////
    //聊天按钮回调
    OnBnClickedChat:function  () {
        cc.gSoundRes.PlaySound('Button');
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true); 
    },

    //设置底分
    SetCellScore:function ( lCellScore ) {
        this.m_lCellScore.string = lCellScore;
    },
    setUserScore:function(ViewID,llScore){
        this.$("Label@Label",this.m_NodeScore[ViewID]).string = llScore;
        
    },
    //倍数
    SetTableScore:function (score) {
        this.m_lAllTableScore = score;
        this.m_LabTableScore.string = score;
    },
    InitUserJet:function(){
        
        for(var i in this.m_UserInfo){
            this.m_lTableScore[i] = 0;
            
        }
       // this.m_JetCtrl.OnGameSetScore(0);
    },
    UserAddJet:function (score, chairID) {
        this.m_lAllTableScore += score;
        this.m_LabTableScore.string = this.m_lAllTableScore;
        this.m_lTableScore[chairID] += score;
        
        //动画
        //this.m_JetCtrl.OnUserAdd(chairID, score);
    },
    UserGetJet:function (score, chairID) {
        this.m_lAllTableScore -= score;
        this.m_LabTableScore.string = this.m_lAllTableScore;
        this.m_lTableScore[chairID] -= score;
        
        //动画
        //this.m_JetCtrl.OnUserGet(chairID, score);
    },
    EndUserGetJet:function (chairID) {
        //动画
        this.m_JetCtrl.OnUserGet(chairID, this.m_lAllTableScore);

        for(var i in this.m_UserInfo){
            this.m_lTableScore[i] = 0;
        
        }
        this.m_lAllTableScore = 0;
        this.m_LabTableScore.string = this.m_lAllTableScore;
    
    },
    //设置庄家
    SetBankerUser:function ( wBankerUser) {
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].SetBanker(i == wBankerUser);
        }
        return;
    },

    //设置时间
    SetUserTimer:function (wChairID, wTimer, Progress){
    
    },
    SetUserState:function(ViewID, State, Cnt){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[ViewID].ShowUserState(State, Cnt);
        }
    },

    //设置警告
    SetViewRoomInfo:function (dwServerRules,dwRulesArr){
        if(this.m_GameClientEngine.m_dwClubID > 0)
            this.m_ClubNum.string = '合家欢ID:'+this.m_GameClientEngine.m_dwClubID;

        this.m_TableNumber.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
        this.m_RulesText.string = GameDef.GetRulesStr(dwServerRules,dwRulesArr);
        this.m_LbGameRules.string = GameDef.GetRulesStr(dwServerRules,dwRulesArr);
        this.m_RulesBackTurn = 0;
        this.m_lMaxAddScore = 10;
        this.m_rules = dwRulesArr[0];

        this.m_bNoVoice = true;
        if (this.m_BtGPS) this.m_BtGPS.active = true;
        //if(this.m_BtGPS) this.m_BtGPS.active = GameDef.IsNoCheat(dwServerRules);
        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        if (this.m_VoiceCtrl && this.m_bNoVoice) this.m_VoiceCtrl.node.active = false;
    },
    UpdateRoomProgress:function (){
        this.m_subsumlun.string = GameDef.SetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules);
    },
    SetTurnCount:function(turn){
        this.m_LabTurn.string = turn == null?"":'第' + turn + '轮';
    },
});
