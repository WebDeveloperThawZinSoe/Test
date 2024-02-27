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
        m_CardCtrlEndPrefab:cc.Prefab,

        m_UserTypePrefab:cc.Prefab,
        //m_UserPrefab:cc.Prefab,
        m_UserStatePrefab:cc.Prefab,
        m_UserScorePrefab:cc.Prefab,
        m_btStart:cc.Button,
        m_btFirend:cc.Button,
        m_TableNumber:cc.Label,
        m_ClubNum:cc.Label,
        m_subsumlun:cc.Label,
        m_RulesText:cc.Label,
        m_BankerUI: cc.Node,
        m_BankerChooseUI: cc.Node,
        m_PlayerUI: cc.Node,
        m_NdOpenCard: cc.Node,
        m_NdShowCard: cc.Node,
        m_NdCtrlStart: cc.Node,
        m_TableTipsNode:cc.Label,
        m_atlas:cc.SpriteAtlas,
        m_rankatlas:cc.SpriteAtlas,

        m_Card:[cc.Sprite],

        m_numOfGame:cc.Label,

        m_LabScore:cc.Label,
        m_LabScoreSlider:cc.Slider,
        m_SpriteDao:cc.Sprite,
        m_Atlas:cc.SpriteAtlas,
        m_LbAddBankerScore:cc.Label,
        m_ChuoCardNode: cc.Node,
        m_touzi:cc.Node,
        m_touzi1:cc.Node,
        m_GuoNode:cc.Node,
        m_SetXLoNode:cc.Node,
        m_nodeCoin:cc.Node

    },
    onLoad:function(){
        this.InitView();
    },
    ctor :function () {
        this.m_CardTestName = 'TestPJ';
        this.m_UserCardControl = new Array();   //用户牌
        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_UserScore = new Array();
        this.m_UserCardType = new Array();          //用户信息
        this.m_UserTableScore = new Array();          //用户信息
        this.m_pIClientUserItem = new Array();
        this.m_UserVoiceArr = new Array();
        this.m_AddScore = new Array();
        this.m_CardCtrl = new Array();
        this.m_cbDiceNum = new Array();

        this.m_BankerScore = 0;
        this.m_MaxScore = 0;
        this.m_bIsYingFen = 0;
        this.BtNode = 0;
        this.m_playerCount = 4;
        this.m_wAddUserView = INVALID_CHAIR;
    },
    // use this for initialization
    start:function () {
        this.m_GameClientEngine = this.node.parent.getComponent('GameClientEngine_'+GameDef.KIND_ID);

        //UI 节点
        this.m_JetNode  = this.node.getChildByName('JetNode');
        this.m_CardNode = this.node.getChildByName('CardNode');
        this.m_UserNode = this.node.getChildByName('UserNode');
        this.m_ScoreNode = this.node.getChildByName('ScoreNode');
        this.m_aniNode = this.node.getChildByName('AniNode');

        //控制按钮
        this.HideAllGameButton();
	    this.m_BtStart.active = false;
        this.m_BtFriend.active = false;
        this.m_RulesText.string = '';
        this.$("PaiBG").active = false;

        //发牌控件
        this.m_SendCardCtrl = this.m_CardNode.getComponent('SendCardCtrl_'+GameDef.KIND_ID);
        this.m_SendCardCtrl.SetHook(this);
        //开牌控件
        this.m_OpenCardCtrl = this.m_NdShowCard.getComponent('OpenCardCtrl_'+GameDef.KIND_ID);
        this.m_OpenCardCtrl.SetHook(this);
        //筹码控件
        this.m_JetCtrl = this.m_JetNode.getComponent('JetCtrl_'+GameDef.KIND_ID);
        this.m_JetCtrl.SetHook(this);

        //搓牌控件
        this.m_CuoCardCtrl = this.m_ChuoCardNode.getComponent("OpenCardCtrl_52081");
        this.m_CuoCardCtrl.SetHook(this);


        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            //用户牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_'+GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_UserCardControl[i].node);
            this.m_UserCardControl[i].m_bClick = i == GameDef.MYSELF_VIEW_ID;

            this.m_CardCtrlEndPrefab[i] = cc.instantiate(this.m_CardCtrlEndPrefab).getComponent('CardCtrl_'+GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_CardCtrlEndPrefab[i].node);
            this.m_CardCtrlEndPrefab[i].m_bClick = i == GameDef.MYSELF_VIEW_ID;


            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_'+GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_'+GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
            //牌型
            this.m_UserCardType[i] = cc.instantiate(this.m_UserTypePrefab).getComponent('CardType_'+GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_UserCardType[i].node);
           // this.m_UserCardType[i].SetCardType(null);
        }

        this.m_TableNumber.string = '';
        if( window.g_dwRoomID) {
            this.m_TableNumber.string = '房间号: '+ window.g_dwRoomID
        }

        this.m_UserPosArr = new Array(
            cc.v2(235, 260),
            cc.v2(-556, 70),
            cc.v2(-530, -250),
            cc.v2(566, 70),

        )
        this.m_UserCardPosArr = new Array(
            cc.v2(35, 250),
            cc.v2(-300, 58),
            cc.v2(0, -242),
            cc.v2(400, 56),

        )
        this.m_UserPosArr_8 = new Array(
            cc.v2(-556, 94),
            cc.v2(-556, -87),
            cc.v2(-530, -246),
            cc.v2(565, -87),
            cc.v2(565, 94),
            cc.v2(200, 277),
            cc.v2(0, 277),
            cc.v2(-200, 277),

        )
        this.m_UserCardPosArr_8 = new Array(
            cc.v2(-340, 93),
            cc.v2(-340, -86),
            cc.v2(80, -252),
            cc.v2(400, -86),
            cc.v2(400, 93),
            cc.v2(240, 150),
            cc.v2(40, 150),
            cc.v2(-160, 150),

        )
        this.m_UserFaceArr = this.m_UserPosArr;

       // this.RectifyControl(window.SCENE_WIGHT ,window.SCENE_HEIGHT);
        this.m_GameClientEngine.m_ViewIsReady = true;
        this.ShowPrefabDLG('MacInfo',this.m_PhoneNode);
    },

    HideAllGameButton :function(){
        this.m_BankerUI.active = false;
        this.m_PlayerUI.active = false;
        this.m_NdOpenCard.active = false;
        this.m_NdShowCard.active = false;
        this.m_BankerChooseUI.active = false;

        this.m_wAddUserView = INVALID_CHAIR;
    },
    ShowHorseUser :function(ViewID){

    },

    ShowBankerUI :function(){
        this.m_BankerUI.active = true;
    },
    ShowBankChoose:function(){
        this.m_BankerChooseUI.active = true;

    },
    ShowOpenCard:function(bShoot){
        this.m_NdOpenCard.active = bShoot;
    },
    
    ShowTouzZi:function(cbDice,bShow){
        this.m_touzi.active = bShow;

        if(bShow==false) return;

        var list = [0,5,4,0,3,1,2];
        this.ani = this.m_touzi.getComponent(dragonBones.ArmatureDisplay);
        this.ani.playAnimation ('newAnimation',1);

        let robotSlot = this.ani.armature().getSlot("touzi1");
        let robotSlot1 = this.ani.armature().getSlot("touzi2");


        // /*if (cc.sys.isNative)  {
        //     robotSlot.setDisplayIndex(list[cbDice[0]]);
        //     robotSlot1.setDisplayIndex(list[cbDice[1]]);
        // } else {*/
             robotSlot.displayIndex = (list[cbDice[0]]);
             robotSlot1.displayIndex = (list[cbDice[0]]);
        // //}
        this.node.runAction(cc.sequence( cc.delayTime(1.5), cc.callFunc(function () {
            this.m_touzi.active = false;
            this.m_touzi1.active = false;

        }, this)));
    },
    ShowPaiView:function(PaiCard){
        if (GameDef.GetPlayerCount(0,this.m_GameClientEngine.m_dwAllRules) == 8) return;

        this.$("PaiBG/CardNode").setScale(0.75, 0.75);
        for(var i=0;i<16;i++){
            if(this.m_GameNum%2 != 0){
                this.$("PaiBG/CardNode/CardPrefab"+i+"/Card@Sprite").spriteFrame = this.m_atlas.getSpriteFrame("P9Card0");
            }else{
                this.$("PaiBG/CardNode/CardPrefab"+i+"/Card@Sprite").spriteFrame = this.m_atlas.getSpriteFrame("P9Card"+PaiCard[i]);
            }
        }
    },
    ShowCardView:function(PaiCard){
        if (GameDef.GetPlayerCount(0,this.m_GameClientEngine.m_dwAllRules) == 8) return;

        cc.log("牌值：   "+PaiCard+'ffff*'+this.m_GameNum%2);
        this.$("PaiBG/CardNode").setScale(0.5, 0.5);

            if(this.m_GameNum%2 != 0){
                for(var i=0;i<32;i++){
                    this.$("PaiBG").active = true;
                    this.$("PaiBG/CardNode/CardPrefab"+i).active = true;
                    this.$("PaiBG/CardNode/CardPrefab"+i+"/Card@Sprite").spriteFrame = this.m_atlas.getSpriteFrame("P9Card0");
                }
            }else{
                this.$("PaiBG").active = true;
                for(var i=16;i<32;i++){
                        this.$("PaiBG/CardNode/CardPrefab"+i).active = true;
                        this.$("PaiBG/CardNode/CardPrefab"+(i-16)+"/Card@Sprite").spriteFrame = this.m_atlas.getSpriteFrame("P9Card0");
                        this.$("PaiBG/CardNode/CardPrefab"+i+"/Card@Sprite").spriteFrame = this.m_atlas.getSpriteFrame("P9Card"+PaiCard[i-16]);

                }
            }
    },


    ShowScoreUI :function(){
        this.m_PlayerUI.active = true;
        this.m_AddScore[0] = 0;
        this.m_AddScore[1] = 0;
        this.m_AddScore[2] = 0;
        this.InputIndex = 0;
        this.BtNode = 0 ;
        var bIsTwo = this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_BET_2;

        this.m_LabScoreSlider.progress = 0;
        this.m_LabScore.string = this.OnShowSliderScore(0);
        this.m_SpriteDao.spriteFrame = this.m_Atlas.getSpriteFrame("labd1");

    },


    SetUserEndScore:function(wChairID, Score){
        if(wChairID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                this.SetEndScore(i, '')
            }
            return
        }
        this.SetEndScore(wChairID, Score);
    },
    SetEndScore:function(wChairID, Score){
        this.m_UserInfo[wChairID].SetEndScore(Score);
    },
    SetUserSitNum:function(wChairID,SitNum){
        if(wChairID < GameDef.GAME_PLAYER)
            this.m_UserInfo[wChairID].SetUserSitNum(SitNum);
    },
    
    SetNumOfGame:function(num){
        this.m_GameNum = num;
        this.m_numOfGame.string = "第" + num + "局";
    },
    //用户信息更新
    OnUserEnter :function (pUserItem, wChairID) {


        if(this.m_GameClientEngine.IsLookonMode() == false)
        {
            this.m_BtFriend.active = (this.m_GameClientEngine.m_dwRoomID != 0 &&  this.m_GameClientEngine.m_wGameProgress == 0);
            this.m_BtStart.active = pUserItem.GetUserStatus() == US_SIT;

        }

        if(this.m_UserInfo[wChairID]){
            this.m_pIClientUserItem[wChairID] = pUserItem;
            this.m_UserTableScore[wChairID] = 0;
            this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_UserTableScore[wChairID]);
            //if(pUserItem.GetUserStatus() == US_READY) this.SetUserState(wChairID, 'Ready');
            this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);


            if( wChairID == GameDef.MYSELF_VIEW_ID){
                if(this.m_VoiceCtrl == null){
                    this.ShowPrefabDLG('VoiceCtrl',this.node.getChildByName('VoiceNode'),function(Js){
                        this.m_VoiceCtrl = Js;
                        this.m_VoiceCtrl.InitVoice(this);
                    }.bind(this));
                }

                if(this.m_ChatControl == null){
                    this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                        this.m_ChatControl = Js;
                        this.m_ChatControl.ShowSendChat(false);
                        this.m_ChatControl.InitHook(this);
                    }.bind(this));
                }

                if(this.m_FaceExCtrl == null){
                    this.ShowPrefabDLG('FaceExCtrl',this.m_aniNode,function(Js){
                        this.m_FaceExCtrl = Js;
                    }.bind(this));
                }
            }
        }

    },

    OnUserState :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(this.m_UserInfo[wChairID])this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_UserTableScore[wChairID]);
        if(this.m_UserInfo[wChairID])this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave :function (pUserItem, wChairID) {
        this.m_UserTableScore[wChairID] = 0;
        if(this.m_UserInfo[wChairID])this.m_UserInfo[wChairID].UserLeave(pUserItem);
        if(this.m_UserState[wChairID])this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(this.m_UserInfo[wChairID])this.m_UserInfo[wChairID].UpdateScore(pUserItem, this.m_UserTableScore[wChairID]);
    },
    OnUpdateUserScore :function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        if(this.m_UserInfo[wChairID])this.m_UserInfo[wChairID].SetUserScore(pUserItem.GetUserScore(), this.m_UserTableScore[wChairID]);
    },

    SetUserTableScore :function (wChairID, Score) {
        if(wChairID > GameDef.GAME_PLAYER){
            this.m_AddScore = [0,0,0];
            for(var i = 0; i < GameDef.GAME_PLAYER; i++)
                this.m_UserInfo[i].UpdateAddScore(this.m_AddScore);
            return
        } 
        this.m_UserInfo[wChairID].UpdateAddScore(Score);
    },
    UserExpression:function (SendUserID, TagUserID, wIndex){
        var SendChair = INVALID_CHAIR,RecvChair = INVALID_CHAIR;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( this.m_pIClientUserItem[i] == null) continue
            if( this.m_pIClientUserItem[i].GetUserID() == SendUserID) SendChair = i;
            if( this.m_pIClientUserItem[i].GetUserID() == TagUserID) RecvChair = i;
        }
        if(wIndex < 2000 && this.m_ChatControl)  this.m_ChatControl.ShowBubblePhrase(SendChair, wIndex, this.m_pIClientUserItem[SendChair].GetGender());
        else if(wIndex < 3000 && this.m_FaceExCtrl) this.m_FaceExCtrl.OnSendFaceEx(SendChair,RecvChair, wIndex);
    },
    UserChat:function (SendUserID, TagUserID, str){
        if(this.m_ChatControl == null) return
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
            //this.m_UserCardControl[i].SetCardData(null, 0);
            this.m_CardCtrlEndPrefab[i].SetMaxCardDate(null, 0);
            this.m_CardCtrlEndPrefab[i].SetMinCardDate(null, 0);
            this.m_CardCtrlEndPrefab[i].node.active = true;
        }
       this.SetCardType(INVALID_CHAIR);
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

    //调整控件
    RectifyControl:function (nWidth, nHeight){
        var SendCardPosArr = new Array();  //聊天位置
        this.m_UserChatArr = new Array();


        for (var i = 0; i < this.m_playerCount; i++) {
            if(this.m_playerCount == 8) {
                this.m_UserPosArr[i] = this.m_UserPosArr_8[i];
                this.m_UserCardPosArr[i] = this.m_UserCardPosArr_8[i];
            }

            var bSelf = (i == GameDef.MYSELF_VIEW_ID);
            this.m_UserChatArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y+20);
            //玩家头像
            this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[i]);
            //手牌
            this.m_UserCardControl[i].SetBenchmarkPos(this.m_UserCardPosArr[i].x, this.m_UserCardPosArr[i].y, enXCenter);
            this.m_UserCardControl[i].SetScale(bSelf ? 1 : (this.m_playerCount == 8 ? 0.6:0.8));
            this.m_UserCardControl[i].SetCardDistance(0);

            this.m_CardCtrlEndPrefab[i].SetBenchmarkPos(this.m_UserCardPosArr[i].x, this.m_UserCardPosArr[i].y, enXCenter);
            this.m_CardCtrlEndPrefab[i].SetScale(bSelf ? 1 : (this.m_playerCount == 8 ? 0.6:0.8));
            this.m_CardCtrlEndPrefab[i].SetCardDistance(0);
            this.m_CardCtrlEndPrefab[i].SetEndCardPos(1);
            //牌型
            var PosX = this.m_UserCardPosArr[i].x + (bSelf ? 0 : 0);
            var PosY = this.m_UserCardPosArr[i].y + (bSelf ? 100 : -70);
            this.m_UserCardType[i].SetBenchmarkPos(PosX, PosY);
            this.m_UserCardType[i].SetScale(bSelf ? 1 : 0.6);
            this.m_UserCardType[i].SetSpacingX(this.m_playerCount==8 ? 80 : 150);

            
            //准备
            PosX = this.m_UserPosArr[i].x + (this.m_UserPosArr[i].x >= 480?-90:+90)
            PosY = this.m_UserPosArr[i].y;
            this.m_UserState[i].SetBenchmarkPos(PosX, PosY);
            //发牌位置
            PosX = this.m_UserCardPosArr[i].x - 30;
            PosY = this.m_UserCardPosArr[i].y;
            SendCardPosArr[i] = cc.v2(PosX, PosY);

            this.m_UserVoiceArr[i] = cc.v2(this.m_UserPosArr[i].x,this.m_UserPosArr[i].y);
            if(this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
            {
                this.m_UserCardType[i].SetGameType(true);
            }else{
                this.m_UserCardType[i].SetGameType(false);
            }
        }

        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(-30,-60), SendCardPosArr,this.m_playerCount);
        //筹码坐标
        this.m_JetCtrl.SetUserPos(this.m_UserPosArr);
        
    },

    OnBtClickedSuperOK(cardArr,cnt) {
        if(cardArr[0]==null) return;
        this.m_GameClientEngine.OnMessageSuperCard(cardArr,cnt);
    },

    OnBnClickedFirend:function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnFirend();
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
    OnBnClickedCallBanker:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallBanker(Data);
    },
    OnBnClickedCallBankerChoose:function (Tag, Data){
        this.m_GameClientEngine.OnMessageCallBankerChoose(Data);
    },

    OnClearPaiChi:function(){
        this.$("PaiBG").active = false;
    },

    OnSliderUserScore :function(Tag) {
        var min = this.OnShowSliderScore(this.InputIndex);
        var max = this.m_GameClientEngine.m_lBankerTimes-this.m_AddScore[0]-this.m_AddScore[1]-this.m_AddScore[2];
        if(min>max) max = min;
        this.m_LabScore.string = ""+(min + (max-min)*Tag.progress).toFixed(0);
        this.m_RoomMaxTax = ((min + (max-min)*Tag.progress)).toFixed(0);
    },
    OnBnClickedCallPlayer:function (Tag, Data){

        var Score =  this.m_GameClientEngine.m_lBankerTimes;
        var bIsTwo = this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_BET_2;
        if(bIsTwo && Data == 12){
            Data = 11;
        }
        if(this.m_GameClientEngine.m_bIsClub){
            var myScore = this.m_UserInfo[GameDef.MYSELF_VIEW_ID].m_UserScore.string;
            if(myScore < Score) Score = myScore;
        }
        if(Data == 14){
            this.m_AddScore[0] = Score;
            this.m_AddScore[1] =0;
            this.m_AddScore[2] = 0;
            this.InputIndex=3;

        }
        else  if(Data == 11){
            this.m_AddScore[0] = Math.floor(Score/2);
            if(this.m_AddScore[0] < GameDef.GetMinBet(this.m_GameClientEngine.m_dwAllRules[0])){
                this.m_AddScore[0] =  GameDef.GetMinBet(this.m_GameClientEngine.m_dwAllRules[0]);
            }

            this.m_AddScore[1] = Score - this.m_AddScore[0];
            this.m_AddScore[2] = 0;
            this.InputIndex=3;

        }
        else  if(Data == 12){
            this.m_AddScore[0] = Score - Math.floor(Score/3)*2;
            this.m_AddScore[1] = Math.floor(Score/3);
            this.m_AddScore[2] = Math.floor(Score/3);
            this.InputIndex=3;
        }
        else if(Data == 13){
            if(this.InputIndex>2)return;
            var other = Score-this.m_AddScore[0]-this.m_AddScore[1]-this.m_AddScore[2];
            this.m_AddScore[this.InputIndex++]= other;
        }
        else{
            if(this.InputIndex>2)return;
            var scoreInput = parseInt(this.m_AddScore[0])+parseInt(this.m_AddScore[1])+parseInt(this.m_AddScore[2])+parseInt(Data);

            if(scoreInput > Score){
                this.OnBnClickedCallPlayer(0,13);
                return;
            }
            this.m_AddScore[this.InputIndex++]= Data;
        }
        this.m_GameClientEngine.OnMessageCallPlayer(this.m_AddScore);
    },
    OnBnClickCancle:function (){
        this.BtNode == 0;
        this.InputIndex = 0;
        this.m_AddScore[0]=0;
        this.m_AddScore[1]=0;
        this.m_AddScore[2]=0;

        this.ShowTips("下注分数已重置");
    },
    OnBnClickSureCall:function (Tag, Data){

        var bIsTwo = this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_BET_2;
        if(this.InputIndex==2 || (this.InputIndex==1 && bIsTwo)){
            var Score =  this.m_GameClientEngine.m_lBankerTimes;
            if(this.m_GameClientEngine.m_dwClubID > 0){
                var myScore = this.m_UserInfo[GameDef.MYSELF_VIEW_ID].m_UserScore.string;
                if(myScore < Score) Score = myScore;
            }
            this.m_AddScore[this.InputIndex] = parseInt(this.m_LabScore.string);
            if(this.m_AddScore[0]+this.m_AddScore[1]+this.m_AddScore[2] >0){
                if(this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_TOU_FULL && this.m_GameClientEngine.m_bIsFirst){
                    if(parseInt(this.m_AddScore[0])  + parseInt(this.m_AddScore[1]) +parseInt(this.m_AddScore[2]) != this.m_GameClientEngine.m_lBankerTimes) {
                        this.ShowTips("请正确下注！")
                        this.OnBnClickCancle();

                        return;
                    }
                }
                if(this.m_GameClientEngine.m_ServerRules & GameDef.GAME_TYPE_BANKER_1 && this.m_GameClientEngine.m_bIsFirst){
                    if(parseInt(this.m_AddScore[0]) != this.m_GameClientEngine.m_lBankerTimes) {
                        this.ShowTips("请正确下注！")
                        this.OnBnClickCancle();

                        return;
                    }
                }
                if(this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_SUI_GUO){
                    if(parseInt(this.m_AddScore[0])  + parseInt(this.m_AddScore[1]) +parseInt(this.m_AddScore[2]) != this.m_GameClientEngine.m_lBankerTimes) {
                        this.ShowTips("请正确下注！")
                        this.OnBnClickCancle();
                        return;
                    }
                }
                // if(this.m_GameClientEngine.m_dwRules & GameDef.GAME_TYPE_All_DAO){
                //     var minScore = GameDef.GetMinBet(this.m_GameClientEngine.m_dwRules);
                //     minScore = minScore>this.m_GameClientEngine.m_lBankerTimes?minScore:this.m_GameClientEngine.m_lBankerTimes;
                //     if(parseInt(this.m_AddScore[0])  + parseInt(this.m_AddScore[1]) +parseInt(this.m_AddScore[2])< minScore) {
                //         this.ShowTips("请正确下注！！！")
                //         return;
                //     }
                // }else{
                    var minScore = GameDef.GetMinBet(this.m_GameClientEngine.m_dwRules);
                    minScore = minScore<this.m_GameClientEngine.m_lBankerTimes?minScore:this.m_GameClientEngine.m_lBankerTimes;
                    if(this.m_GameClientEngine.m_bIsClub ){
                        var myScore = this.m_UserInfo[3].m_UserScore.string;
                        if(myScore < minScore) minScore = myScore;
                    }
                    if(parseInt(this.m_AddScore[0])< minScore) {
                        this.ShowTips("请正确下注！！！！")
                        this.OnBnClickCancle();

                        return;
                    }
               // }
                this.m_GameClientEngine.OnMessageCallPlayer(this.m_AddScore);
            }
        }else{
            this.m_AddScore[this.InputIndex++] = parseInt(this.m_LabScore.string);
            var index = this.InputIndex+1;
            this.m_SpriteDao.spriteFrame = this.m_Atlas.getSpriteFrame("labd"+index); 

            this.SetUserTableScore(GameDef.MYSELF_VIEW_ID,this.m_AddScore);
            this.m_LabScore.string = this.OnShowSliderScore(this.InputIndex);
            this.m_LabScoreSlider.progress = 0;
        }
        
    },

    OnBnClickedOpenCard:function (){
        this.m_NdOpenCard.active = false;
        this.m_GameClientEngine.OnMessageOpenCard();
    },
    OnBnClickedShowCard:function (){
        this.m_NdOpenCard.active = true;
        this.m_NdShowCard.active = false;
        this.m_GameClientEngine.OnMessageShowCard();
    },

    OnBnClickedGetMaxCard:function(){
        this.m_GameClientEngine.OnMessageGetMaxCard();
    },
    OnClickedScore:function (Tag, Data){

        var BtNode = Tag.currentTarget.name;
        var Scores = this.$('BtUINode/PlayerUI/'+BtNode+'/Label@Label').string;
        this.m_GameClientEngine.OnMessageCallPlayer(Scores);
    },

 //////////////////////////////////////////////////////////////////////////////
    //聊天按钮回调
    OnBnClickedChat:function  () {
        cc.gSoundRes.PlaySound('Button');
        if(this.m_ChatControl == null) return;
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },

    //设置庄家
    SetBankerUser:function (wBanker, BankerScore) {
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserInfo[i].SetBanker(i == wBanker);
        }
         this.m_BankerScore = BankerScore;

        this.m_LbAddBankerScore.string = BankerScore;

        // this.m_LbAddBankerScore2.string = BankerScore;
        return;
    },

    //设置时间
    SetUserTimer:function (wChairID, wTimer, Progress){
        if(wTimer != null){
            this.$('SpClock').active = true;
            this.$('SpClock/Lb@Label').string = wTimer;
        }else{
            this.$('SpClock').active = false;
        }
    },
    SetUserState:function(ViewID, State){
        if(ViewID == INVALID_CHAIR){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                if(this.m_UserState[i]) this.m_UserState[i].HideState();
            }
        }else{
            this.m_UserState[ViewID].ShowUserState(State);
        }
    },

    SetTableTips:function (str){
        if(str == null){
            this.m_TableTipsNode.string = ''
        }else{
            this.m_TableTipsNode.string = str;
        }
    },

    //设置警告
    SetViewRoomInfo:function (dwRules){

        if(this.m_GameClientEngine==null) this.start();
        if(this.m_GameClientEngine.m_dwClubID > 0)
            this.m_ClubNum.string = '俱乐部ID:'+this.m_GameClientEngine.m_dwClubID;

        this.m_TableNumber.string = '房间号: '+this.m_GameClientEngine.m_dwRoomID;
        this.m_RulesText.string = GameDef.GetRulesStr(dwRules);
        var bShow = this.m_GameClientEngine.IsLookonMode();
        if (this.m_BtChat) this.m_BtChat.active = !bShow;
        if (this.m_BtGPS)  this.m_BtGPS.active = !bShow;
        if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
        this.m_playerCount = GameDef.GetPlayerCount(0,dwRules);

        this.RectifyControl();
    },
    UpdateRoomProgress:function (){
        //this.m_subsumlun.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwRules);
    },
    SetRoomProgress:function (Turn1, Turn2){
        this.m_subsumlun.string = '第'+Turn1+'-'+Turn2+'局';
    },
    UpdateSet:function () {
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            if( this.m_pIClientUserItem[i] == null) continue
            this.m_UserCardControl[i].DrawCard();
        }
    },

    ShowRank:function(wChairID,rank,index,IsBankerChair){
        this.m_UserCardType[wChairID].SetCardType(rank,index,IsBankerChair);
        if(IsBankerChair) cc.gSoundRes.PlayGameSound('type'+rank[index]);
        if(!IsBankerChair || index==1)return
        if(rank[0] == 143 || rank[0] == 144){
            this.m_CardCtrlEndPrefab[wChairID].showGuiZi();
        }else if(rank[0] == 142){
            this.m_CardCtrlEndPrefab[wChairID].showHuangShang();
        }
    },

    OnShowSliderScore(nIndex){
        if(nIndex>1)return 0;
        var minScore = GameDef.GetMinBet(this.m_GameClientEngine.m_dwRules);
        var AddScore = this.m_AddScore[0] + this.m_AddScore[1] + this.m_AddScore[2];
        var GuoDi = this.m_GameClientEngine.m_lBankerTimes-AddScore;
        if(this.m_GameClientEngine.m_bIsClub){
            var myScore = this.m_UserInfo[GameDef.MYSELF_VIEW_ID].m_UserScore.string;
            if(myScore<minScore) minScore = myScore;
        }
        if(minScore < GuoDi){
            return minScore;
        }else{
            return GuoDi;
        }

    },
    /*
    OnBtShowGPS:function(){
        this.m_GameClientEngine.GetTableUserGPS();
        this.m_TableGPSCtrl.ShowView();
        this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem)
    },
    */
    // OnGPSAddress:function(GPSInfo){
    //     this.m_TableGPSCtrl.SetUserAddress(this.m_pIClientUserItem, GPSInfo);
    // },
     //设置页面
     OnClickSetXLNode:function(RoomInfo){
        this.m_SetXLoNode.active = !this.m_SetXLoNode.active;
    },


     playFlyCoin: function (llScore, wBanker) {
        var wBankView = this.m_GameClientEngine.SwitchViewChairID(wBanker);
        var delay = 0;
        var bWin = false, bLose = false;
        for (var i in llScore) {
            if (i == wBanker) continue;
            if (llScore[i] < 0) {
                var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt( i));
                delay = this._flyCoin(wView, wBankView);
                bWin = true;
            } else if (llScore[i] > 0) {
                bLose = true;
            }
        }


        var fn = function () {
            for (var i in llScore) {
                if (i == wBanker) continue;
                if (llScore[i] > 0) {
                    var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt( i));
                    delay = this._flyCoin(wBankView, wView);
                }
            }
        }.bind(this);


        if (delay != 0)
            this.scheduleOnce(fn, delay);
        else
            fn();
        return ((bWin && bLose) ? 2 : 1) * delay;
    },


    _flyCoin: function (wStart, wEnd) {
        if(this.m_UserInfo[wStart] == null) return;
        var start = this.m_UserInfo[wStart].node.getPosition();
        var end = this.m_UserInfo[wEnd].node.getPosition();
        console.log('--------------'+start, end);
        var delay = 0;
        for (var i = 0; i < 6; i++) {
            var node = cc.instantiate(this.m_nodeCoin);
            node.setScale(1.2);
            this.node.addChild(node);
            node.setPosition(start);
            node.active = true;
            node.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(0.6, end), cc.removeSelf(true)));
            cc.gSoundRes.PlaySound('Jet');
            delay += 0.1;
        }
        return delay + 0.2;
    },




    //随机庄动画
    StartAni:function(UserArr, Banker, NoAni){
        if(UserArr.length <= 1 || NoAni) {
            this.m_GameClientEngine.OnTimeIDI_SETBANKER();
            return;
        }

        this.m_AniIndex = 0;
        this.m_AniUserIndex = 0;
        //this.m_AniTime = new Array(0.2,0.1,0.3);
        this.m_AniTime = 0;
        this.m_AniTimeAll = 0;
        this.m_AniUserArr = UserArr;
        this.m_AniTempTime = 0;
        this.m_AniBanker = Banker;
    },

    update:function (dt) {
       // console.log(dt,this.m_AniUserArr)
        if(this.m_AniUserArr != null){
            this.m_AniTempTime += dt;

            if(this.m_AniTempTime > this.m_AniTime){
                this.m_AniTime += (this.m_AniTempTime < 2?0.05:0.2);

                for(var i=0;i<GameDef.GAME_PLAYER;i++){
                    this.m_UserInfo[i].ShowClock(i == this.m_AniUserArr[this.m_AniUserIndex])
                    this.m_UserInfo[i].SetClockNum(1);
                }

                if(this.m_AniUserArr[this.m_AniUserIndex] == this.m_AniBanker && this.m_AniTempTime > 3){
                    if(this.m_AniTime < 4) {
                        this.m_AniTime = 4.5
                    }
                    else{
                        this.m_GameClientEngine.OnTimeIDI_SETBANKER();
                        for(var i=0;i<GameDef.GAME_PLAYER;i++){
                            this.m_UserInfo[i].SetClockNum(0);
                            this.m_UserInfo[i].ShowClock(true);
                        }
                        this.m_AniUserArr = null;
                    }
                }else{
                    this.m_AniUserIndex++;
                    if(this.m_AniUserIndex >= this.m_AniUserArr.length){
                        this.m_AniUserIndex = 0;
                        this.m_AniIndex++;
                    }
                }
            }
        }
    },
});
