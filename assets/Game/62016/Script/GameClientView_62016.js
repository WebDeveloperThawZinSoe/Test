//X 排列方式
var enXLeft                      =       1;						//左对齐
var enXCenter				     =       2;		                //中对齐
var enXRight				     =		 3;                       //右对齐
cc.Class({
    extends: cc.GameView,

    properties: {
        m_JetAtlas:cc.SpriteAtlas,
        //牌控件
        m_CardCtrlPrefab:cc.Prefab,
        m_UserTypePrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,
        m_FntEndScore:[cc.Font],
    },
    ctor :function () {

        this.m_CardTestName = 'UserCheatCtrl';

        this.m_UserCardControl = new Array();   //用户牌
        this.m_UserCardType = new Array();   //用户牌
        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_LabEndScore = new Array();       //结算分数
        this.m_BtCCompare = new Array();   //选择比牌用户按钮
        this.m_pIClientUserItem = new Array();
        this.m_lAllTableScore = 0;
        this.m_lTableScore = new Array();
        this.m_bLookCard = new Array();
        this.m_UserPlay = new Array();
        this.m_bShowBt = false;
        this.m_cbCardData= new Array()
        this.m_AddNodeArr = new Array();
        this.m_ComCardType = new Array();

        this.m_RulesText = new Array();
        this.m_subsumlun = new Array();
        this.m_TableNumber = new Array();
        this.m_ClubNum = new Array();
        for(var i=0;i<8;i++)
        {
            this.m_cbCardData[i] = new Array();//扑克列表
        }
        this.m_ChuoCount = 0;
    },
    onLoad:function(){
        this.InitView();
    },
    // use this for initialization
    start:function () {
        this.m_GameClientEngine = this.node.parent.getComponent('GameClientEngine_'+GameDef.KIND_ID);

        //UI 节点
        this.m_JetNode  = this.node.getChildByName('JetNode');
        this.m_UINode =   this.node.getChildByName('BtUINode');
        this.m_CompareNode = this.$('CompareNode');
        this.m_AddNode = this.$('Node_Add');
        this.m_btPass = this.$('BtUINode/BTBG/Layout/BtGiveUp@Button');
        this.m_btFollow = this.$('BtUINode/BTBG/Layout/BtFollow@Button');
        this.m_btLook = this.$('BtUINode/BTBG/Layout/BtLook@Button');
        this.m_btAdd = this.$('BtUINode/BTBG/Layout/BtAdd@Button');
        this.m_btCompare = this.$('BtUINode/BTBG/Layout/BtCompare@Button');

        this.m_lCellScore = this.$('TopFrame/InfoBG/LabBase/Label@Label');
        this.m_LabTableScore = this.$('TopFrame/InfoBG/LabMultiple/Label@Label');
        this.m_LabBiMen = this.$('TopFrame/InfoBG/LabBiMen/Label@Label');
        this.m_LabTurn = this.$('TopFrame/InfoBG/LabTurn@Label');
        this.m_InfoBG = this.$('TopFrame/InfoBG');
        this.m_InfoBG.active = false;

        for(var i = 0;i < GameDef.MAX_ADD_KIND -1 ;i++){
            this.m_AddNodeArr[i] = this.$('BtAdd'+i+'@Button',this.m_AddNode);
        }
        for(var i = 0;i<2;i++){
            this['m_UserCard'+i] = new Array();
            this.m_ComCardType[i] = this.$('CompareNode/CardCtrl'+i+'/CompareType'+i);
            for(var j = 0;j<GameDef.MAX_COUNT;j++){
                this['m_UserCard'+i][j] = this.$('CompareNode/CardCtrl'+i+'/Card'+j);
            }
        }

        //控制按钮
        this.HideAllGameButton();
	    this.m_BtStart.active = false;
        this.m_BtFriend.active = false;
        this.m_LbGameRules.string = '';

        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_'+GameDef.KIND_ID);
        this.m_SendCardCtrl.SetHook(this);

        //筹码控件
        // this.m_JetCtrl = this.m_JetNode.getComponent('JetCtrl_'+GameDef.KIND_ID);
        this.m_JetCtrl = this.m_JetNode.getComponent('JettonCtrl');
        this.m_JetCtrl.SetHook(this);
        this.m_JetCtrl.SetRes([36, 24, 18, 12, 10, 9, 6, 5, 4, 3, 2, 1], this.m_JetAtlas);

        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_'+GameDef.KIND_ID);
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
            //选择比牌按钮
            this.m_BtCCompare[i] = this.m_UINode.getChildByName('BtCC'+i);
            this.m_BtCCompare[i].active = false;
        }
        // 比牌动画
        this.m_CompareCtrl = this.m_CompareNode.getComponent('CompareCtrl_'+GameDef.KIND_ID)
        this.m_CompareCtrl.Init(this);
        this.m_CompareCtrl.node.setPosition(0,0);
        this.m_CompareCtrl.HideView();
        //孤注一掷动画
        this.m_GuZhuAniCtrl = this.$('AniGuZhu@AniPrefab',this.m_AniNode);
        this.m_GuZhuAniCtrl.Init(this);

        this.m_LbTableID.string = '';
        if( window.g_dwRoomID) {
            this.m_LbTableID.string = '房间号: '+ window.g_dwRoomID
        }

        this.m_UserPosArr = new Array(
            cc.v2(-500, 130),
            cc.v2(-500, -36),
            cc.v2(-214, -141),
            cc.v2(520, -36),
            cc.v2(520, 130),
        )
        this.m_UserFaceArr = new Array();
        this.m_UserChatArr = new Array();
        this.m_UserVoiceArr = new Array();
        this.RectifyControl(window.SCENE_WIGHT ,window.SCENE_HEIGHT);
        this.m_GameClientEngine.m_ViewIsReady = true;
        this.ShowPrefabDLG('MacInfo',this.m_NdPhoneNode);

    },

    HideAllGameButton :function(){
        this.m_bShowBt = false;
        this.m_btPass.node.active = false;
        this.m_btFollow.node.active = false;
        this.m_btLook.node.active = false;
        this.m_btAdd.node.active = false;
        this.m_btCompare.node.active = false;

        for(var i in this.m_BtCCompare){
            this.m_BtCCompare[i].active = false;
        }
    },
    ShowCallUI:function(lv, Other){
        this.m_UiLv = lv;
        switch(lv){
            case 0:
            {
                this.m_btPass.node.active = true;
                this.m_btFollow.node.active = true;
                this.m_btLook.node.active = true;
                this.m_btAdd.node.active = true;
                this.m_btCompare.node.active = true;

                this.m_btPass.interactable = true;

                if(Other == null){
                    this.m_btFollow.interactable = true;
                    var bLook = !this.m_bLookCard[GameDef.MYSELF_VIEW_ID];
                    var bCompare = true;
                    this.SetAddJet(this.m_GameClientEngine.m_lAddScoreArr,this.m_GameClientEngine.m_cbFllowIndex);

                    //规则
                    if(this.m_GameClientEngine.m_wTurnIndex <= this.m_RulesBackTurn) {
                        bLook = false;
                        bCompare = false;
                    }
                    this.m_btLook.interactable = bLook;
                    this.m_btCompare.interactable = bCompare;
                }else{
                    this.m_btPass.interactable = false;
                    this.m_btFollow.interactable = false;
                    this.m_btLook.interactable = false;
                    this.m_btAdd.interactable = false;
                    this.m_btCompare.interactable = false;
                }

                break;
            }
            case 2:
            {
                this.m_bShowBt = !this.m_bShowBt;
                for(var i in this.m_BtCCompare){
                    this.m_BtCCompare[i].active = (this.m_bShowBt && this.m_UserPlay[i] && i != GameDef.MYSELF_VIEW_ID);
                }
                break;
            }


        }
    },
    SetAddJet:function(ScoreArr,FllowIndex){
        if(ScoreArr.length != GameDef.MAX_ADD_KIND) {console.error('SetAddJet error' ); return false;};
        for(var i in ScoreArr){
            if(i==0)continue;
            var Score = this.m_bLookCard[GameDef.MYSELF_VIEW_ID]?ScoreArr[i]*2:ScoreArr[i];
            this.m_AddNodeArr[i-1].node.getComponent(cc.Sprite).spriteFrame = this.m_JetAtlas.getSpriteFrame(''+Score/window.PLATFORM_RATIO);
            this.m_AddNodeArr[i-1].interactable = i > FllowIndex;
        }
        this.m_btAdd.interactable = (FllowIndex != GameDef.MAX_ADD_KIND -1);

    },

    SetUserEndScore:function(wChairID, Score){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_LabEndScore[i].string = '';
            }
            return
        }
        var tScore = Score2Str(Score);
        if(Score == null) {
            tScore = '';
        }else{
            this.m_LabEndScore[wChairID].Font = this.m_FntEndScore[Score > 0 ? 0 : 1];
            if(Score > 0) tScore = '+'+tScore;
        }
        this.m_LabEndScore[wChairID].string = tScore;
    },
    SetCardType:function(wChairID, Type){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.m_UserCardType[i].SetCardType();
            }
            return
        }
        this.m_UserCardType[wChairID].SetCardType(Type)
    },
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(this.m_lTableScore[wChairID] == null) this.m_lTableScore[wChairID] = 0;

        if (this.m_UserInfo[wChairID]) {
            this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_lTableScore[wChairID]);
            this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
            if ( this.m_UserPosArr[wChairID].x>=390)
            {
                this.m_UserInfo[wChairID].SetTableAllBG();
            }
        }
        if (this.m_GameClientEngine) {
            if(!this.m_GameClientEngine.m_ReplayMode && wChairID == GameDef.MYSELF_VIEW_ID){
                if(this.m_ChatControl == null){
                    this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                        this.m_ChatControl = Js;
                        this.m_ChatControl.ShowSendChat(false);
                        this.m_ChatControl.InitHook(this);
                    }.bind(this));
                }

                if(this.m_VoiceCtrl == null){
                    this.ShowPrefabDLG('VoiceCtrl',this.$('TableButton/NewButton'),function(Js){
                        this.m_VoiceCtrl = Js;
                        this.m_VoiceCtrl.InitVoice(this);
                        this.m_VoiceCtrl.node.zIndex = -1;
                    }.bind(this));
                }

                if(this.m_FaceExCtrl == null){
                    this.ShowPrefabDLG('FaceExCtrl',this.m_AniNode,function(Js){
                        this.m_FaceExCtrl = Js;
                    }.bind(this));
                }
            }
        }

    },
    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_lTableScore[wChairID] );
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        if(!this.m_GameClientEngine.IsLookonMode()&&(this.m_pIClientUserItem[GameDef.MYSELF_VIEW_ID].GetUserStatus() != US_SIT))this.m_BtStart.active = false;
        if ( this.m_UserPosArr[wChairID].x>=390)
        {
            this.m_UserInfo[wChairID].SetTableAllBG();
        }
        if (pUserItem.GetUserStatus() == US_READY) {
            this.m_UserState[wChairID].ShowUserState(true);
        }
    },
    OnUserLeave :function (pUserItem, wChairID) {
        this.m_UserInfo[wChairID].UserLeave(pUserItem);
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem, this.m_lTableScore[wChairID]);
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
    //设置比牌扑克
    SetPKCardData:function(index,cbCardData,cbCardCount,cbCardType){
        for(var i = 0;i<cbCardCount;i++){
            this['m_UserCard'+index][i].getComponent('CardPrefab_'+GameDef.KIND_ID).SetData(cbCardData[i]);
        }
        if(cbCardType) {
            this.m_ComCardType[index].active  = true
            this.m_ComCardType[index].getComponent('CardType_'+GameDef.KIND_ID).SetCardType(cbCardType);
        }
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
        if(wChairID == GameDef.MYSELF_VIEW_ID && !this.m_GameClientEngine.m_ReplayMode && !this.m_GameClientEngine.IsLookonMode()){
            this.m_UserCardControl[wChairID].SetCardData(Card, GameDef.MAX_COUNT);
        }else{
            this.SetCardType(wChairID, 0);
        }
    },
    OnUserGiveUp:function(wChairID){
        if(wChairID == GameDef.MYSELF_VIEW_ID && !this.m_GameClientEngine.m_ReplayMode){
            //this.m_UserCardControl[wChairID].SetCardData(Card, GameDef.MAX_COUNT);
        }else{
            this.SetCardType(wChairID, -1);
        }
    },
    //调整控件
    RectifyControl:function (nWidth, nHeight){
        //筹码动画
        this.m_JetCtrl.SetBenchmarkPos(cc.v2(0,50), 270, 110);
        this.m_JetCtrl.SetUserPos(this.m_UserPosArr);
        //this.m_CardNode 坐标系
        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(110,170),
        [cc.v2(-435, 70),cc.v2(-435, -96),cc.v2(-0, -191),cc.v2(340, -96),cc.v2(340, 70)]);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserFaceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            this.m_UserVoiceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            this.m_UserCardControl[i].SetScale(i==GameDef.MYSELF_VIEW_ID?0.55:0.40);
            this.m_UserInfo[i].node.setPosition( this.m_UserPosArr[i] );

            var Posx = this.m_UserPosArr[i].x + (this.m_UserPosArr[i].x>=390?-180:65);
            var Posy = this.m_UserPosArr[i].y - 60;
            this.m_UserCardControl[i].SetBenchmarkPos(Posx, Posy, enXLeft);

            Posx += 60;
            Posy += 25;
            this.m_UserCardType[i].SetBenchmarkPos(Posx, Posy);

            var Posx = this.m_UserPosArr[i].x + (this.m_UserPosArr[i].x>=390?-160:65);
            var Posy = this.m_UserPosArr[i].y;
            this.m_UserState[i].SetBenchmarkPos(Posx, Posy, enXLeft);
        }

        this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardDistance(0);
        this.m_UserCardType[GameDef.MYSELF_VIEW_ID].SetBenchmarkPos(0, -160);
        this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetBenchmarkPos(-135, -210);
        //this.m_UserState[GameDef.MYSELF_VIEW_ID].SetBenchmarkPos(-440, 200, enXLeft);
    },
    OnBtClickedCtrlStart() {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCtrlStart();
    },
 //////////////////////////////////////////////////////////////////////////////
    //下注
    OnBnClickedAddSure:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallScore(Tag, Data);
    },
    //跟
    OnBnClickedFollow:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallScore(Tag, Data);
    },
    // 比牌玩家
    OnBnClickedCompare:function (){
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
            if(TagUser != INVALID_CHAIR)this.m_GameClientEngine.OnMessageCompare(TagUser);
        }
    },
    // 比牌玩家
    OnBnClickedCompareUser:function (Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCompare(parseInt(Data));
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
        this.OnClickOpenCard();

        // if( this.m_bLookCard[GameDef.MYSELF_VIEW_ID]) return;
        // this.m_GameClientEngine.OnMessageLookCard();
    },
    OnBnClickedShowAdd:function (){
        cc.gSoundRes.PlaySound('Button');
        //this.HideAllGameButton();
        this.ShowCallUI(2);
    },
 //////////////////////////////////////////////////////////////////////////////
    //聊天按钮回调
    OnBnClickedChat:function  () {
        cc.gSoundRes.PlaySound('Button');
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },
    OnClickOpenCard:function (){
        //this.m_GameClientEngine.OnMessageOpenCard();
        //this.m_ChuoCount++;
       // if (this.m_ChuoCount <3)return;
        //this.m_ChuoCount = 0;

        if( this.m_bLookCard[GameDef.MYSELF_VIEW_ID]) return;
        this.m_GameClientEngine.OnMessageLookCard();
    },
    //设置底分
    SetCellScore:function ( lCellScore ) {
        var tScore = Score2Str(lCellScore);
        this.m_lCellScore.string = tScore;
    },
    //倍数
    SetTableScore:function (score) {
        this.m_lAllTableScore = score;
        var tScore = Score2Str(score);
        this.m_LabTableScore.string = tScore;
    },
    InitUserJet:function(){
        this.SetTableScore(0);
        for(var i in this.m_UserInfo){
            this.m_lTableScore[i] = 0;
            this.m_UserInfo[i].SetTableScore(0);
        }
        this.m_JetCtrl.OnGameSetScore(0);
    },
    UserAddJet:function (score, chairID) {
        this.m_lAllTableScore += score;
        this.SetTableScore(this.m_lAllTableScore);
        this.m_lTableScore[chairID] += score;
        this.m_UserInfo[chairID].SetTableScore(this.m_lTableScore[chairID]);
        this.m_UserInfo[chairID].updateTotleScore(this.m_lTableScore[chairID]);
        //动画
        this.m_JetCtrl.OnUserAdd(chairID, score);
    },
    UserGetJet:function (score, chairID) {
        this.m_lAllTableScore -= score;
        this.SetTableScore(this.m_lAllTableScore);
        this.m_lTableScore[chairID] -= score;
        this.m_UserInfo[chairID].SetTableScore(this.m_lTableScore[chairID]);
        //动画
        this.m_JetCtrl.OnUserGet(chairID, score);
    },
    EndUserGetJet:function (chairID) {
        //动画
        this.m_JetCtrl.OnUserGet(chairID, this.m_lAllTableScore);

        for(var i in this.m_UserInfo){
            this.m_lTableScore[i] = 0;
            this.m_UserInfo[i].SetTableScore(0);
        }
        this.m_lAllTableScore = 0;
        this.SetTableScore(this.m_lAllTableScore);

    },
    PlayGuZhuYiZhi:function(){
        this.m_GuZhuAniCtrl.node.setPosition(0,0);
        this.m_GuZhuAniCtrl.PlayAni('Armature',1);
    },
    AniFinish:function(){
        this.m_GuZhuAniCtrl.node.setPosition(-2000,0);
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
        for(var i=0;i<GameDef.GAME_PLAYER;i++) {
            this.m_UserInfo[i].ShowClock(i==wChairID);
        }
        if(wChairID == INVALID_CHAIR) return
        this.m_UserInfo[wChairID].SetClockNum(Progress);
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
    SetViewRoomInfo:function (dwServerRules , dwRulesArr){
        if(this.m_GameClientEngine.m_dwClubID > 0){
            this.m_LbClubID.string = '俱乐部ID:'+this.m_GameClientEngine.m_dwClubID;
            this.m_ClubNum.string = this.m_LbClubID.string;
        }

        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtGPS)  this.m_BtGPS.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;

        this.m_LbTableID.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
        this.m_LbGameRules.string = '玩法：'+GameDef.GetRulesStr(dwServerRules , dwRulesArr);

        this.m_TableNumber.string = this.m_LbTableID.string;
        this.m_RulesText.string = this.m_LbGameRules.string;

        this.m_RulesBackTurn = 0;
        this.m_RulesBackTurn = GameDef.GetGameBiMen(dwServerRules , dwRulesArr);
    },
    UpdateRoomProgress:function (){
        //this.$('TableButton/BtReturn').active = this.m_GameClientEngine.m_wGameProgress == 0;
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
        this.m_LabBiMen.string = GameDef.GetBiMen(this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
        this.m_subsumlun.string  = this.m_LbGameProgress.string;

    },

    SetTurnCount:function(turn){
        this.m_LabTurn.string = turn == null?"":'第' + turn + '轮';
    },
    onCloseAddNode:function(){
        this.m_AddNode.active = false;

    },
    onAddNode:function(){
        this.SetAddJet(this.m_GameClientEngine.m_lAddScoreArr,this.m_GameClientEngine.m_cbFllowIndex);
        this.m_AddNode.active =true;
    },

    UpdateSet:function(){
        for(var i in this.m_UserCardControl){
            this.m_UserCardControl[i].DrawCard();
        }
    },
});
