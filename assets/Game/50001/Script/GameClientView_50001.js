//X 排列方式
var enXLeft = 1;						//左对齐
var enXCenter = 2;		                //中对齐
var enXRight = 3;                       //右对齐
cc.Class({
    extends: cc.GameView,
    
    properties: {
        //牌控件
        m_CardCtrlPrefab: cc.Prefab,
        m_UserTypePrefab: cc.Prefab,
        m_UserStatePrefab: cc.Prefab,
        m_atlas: cc.SpriteAtlas,
        m_TIPs: cc.Node,
        m_JetAtlas:cc.SpriteAtlas,
    },
    ctor: function () {
        this.m_CardTestName = 'UserCheatCtrl';
        this.m_UserCardControl = new Array();   //用户牌
        this.m_UserInfo = new Array();          //用户信息
        this.m_UserState = new Array();          //用户信息
        this.m_UserCardType = new Array();          //用户信息
        this.m_UserTableScore = new Array();          //用户信息
        this.m_pIClientUserItem = new Array();
        this.m_UserVoiceArr = new Array();
        this.m_wAddUserView = INVALID_CHAIR;
        this.m_MaxCallBanker = 4;
        this.m_cbDiceNum = new Array();
    },
    // use this for initialization
    start: function () {
        this.InitView();
        //this.m_GameClientEngine = this.$('..@GameClientEngine_' + GameDef.KIND_ID);
        //绑定按钮事件
        this.BindButtonInit();
        //UI 节点
        this.m_CardNode = this.$('CardNode');
        this.m_UserNode = this.$('UserNode');
        this.m_DiceAni = this.$('AniDice');
        this.m_DiceAni.active = false;

        // this.m_TypeNode = this.$('TypeNode');

        //UI 初始化
    
        this.m_TableNumber = this.$('TopFrame/ReviseNode/TableNumber@Label');
        this.m_TableNumber.string = '';
        if (window.g_dwRoomID) {
            this.m_TableNumber.string = '房间号: ' + window.g_dwRoomID
        }
        this.m_ClubNum = this.$('TopFrame/ClubNumber@Label');
        this.m_ClubNum.string = '';
        this.m_subsumlun = this.$('TopFrame/ReviseNode/num_label@Label');
        this.m_RulesText = this.$('TopFrame/LabRules@Label');
        this.m_RulesText.string = '';
        this.m_BankerUI = this.$('BtUINode/BankerUI');
        this.m_AddScoreUI = this.$('BtUINode/AddScoreUI');

        this.m_NdToBeBanker = this.$('BtUINode/BeBankerNode');
        this.m_NdOpenCard = this.$('BtUINode/BtOpenCard');
        this.m_NdLookCard = this.$('BtUINode/BtLookCard');
        this.m_NdRubCard = this.$('BtUINode/BtRubCard');
        this.m_NdCtrlStart = this.$('TableButton/BtCtrlStart');
        this.m_TableTipsNode = this.$('BtUINode/LabTips@Label');
        //发牌控件 
        this.m_SendCardCtrl = this.$('@SendCardCtrl_' + GameDef.KIND_ID, this.m_CardNode);
        this.m_SendCardCtrl.SetHook(this);
        //筹码控件
        this.m_JetCtrl = this.$('JetNode@JetCtrl_' + GameDef.KIND_ID);
        this.m_JetCtrl.SetHook(this);
        //搓牌控件
        this.m_OpenCardCtrl = this.$('BtUINode/NdOpenCard@OpenCardCtrl_' + GameDef.KIND_ID);
        this.m_OpenCardCtrl.SetHook(this);

        this.m_Jetton = this.$('Jetton').getComponent('JettonCtrl');
        this.m_Jetton.SetHook(this);
        this.m_Jetton.SetRes([64, 32, 16, 8, 4, 2], this.m_JetAtlas);

        //通杀同陪
        this.m_Tongs = this.$('Tongs');
        this.m_Tongp = this.$('Tongp');
        this.m_Tongs.active = false;
        this.m_Tongp.active = false;
        

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //用户牌
            this.m_UserCardControl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_' + GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_UserCardControl[i].node);
            this.m_UserCardControl[i].SetHook(this);
            //用户信息
            this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_' + GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserInfo[i].node);
            this.m_UserInfo[i].Init(this, i);
            this.m_UserInfo[i].node.active = false;
            //用户状态
            this.m_UserState[i] = cc.instantiate(this.m_UserStatePrefab).getComponent('UserState_' + GameDef.KIND_ID);
            this.m_UserNode.addChild(this.m_UserState[i].node);
            this.m_UserState[i].Init();
            //牌型
            this.m_UserCardType[i] = cc.instantiate(this.m_UserTypePrefab).getComponent('CardType_' + GameDef.KIND_ID);
            this.m_CardNode.addChild(this.m_UserCardType[i].node);
            this.m_UserCardType[i].HideType();
        }
        this.m_UserPosArr = new Array(
            cc.v2(-574, 100),
            cc.v2(-574, -100),
            cc.v2(-369, -281),
            cc.v2(336, -281),
            cc.v2(574, 100),
            cc.v2(574, -100),
            cc.v2(336, 229),
            cc.v2(-288, 229),
        )
        this.m_CardPosArr = new Array(
            cc.v2(-511, 46),
            cc.v2(-511, -158),
            cc.v2(-300, -337),
            cc.v2(86, -337),
            cc.v2(324, 46),
            cc.v2(324, -158),
            cc.v2(86, 172),
            cc.v2(-222, 172),
        )
        this.m_UserFaceArr = this.m_UserPosArr;
        this.HideAllGameButton();
        this.RectifyControl(SCENE_WIGHT, SCENE_HEIGHT);
        this.ShowPrefabDLG('MacInfo', this.$('TopFrame/ReviseNode/PhoneInfoBG'));
        this.m_BtChat.active = true;
    },

    HideAllGameButton: function () {
        this.m_wAddUserView = INVALID_CHAIR;
        this.m_BankerUI.active = false;
        this.m_AddScoreUI.active = false;
        this.m_NdOpenCard.active = false;
        this.m_NdLookCard.active = false;
        this.m_NdRubCard.active = false;
        this.m_OpenCardCtrl.node.active = false;
        // this.m_TypeNode.active = false;
        this.m_NdToBeBanker.active = false;
        this.m_TIPs.active = false;
    },

    //显示下注节点
    ShowScoreUI: function (bShow) {

        this.m_AddScoreUI.active = true;
        this.m_TIPs.active = true;

        for (var i = 0; i < 5; i++) {
            this.m_AddScoreUI.getChildByName('AddNode' + i).active = false;
        }
        if(this.m_GameClientEngine.m_wBankerUser == this.m_GameClientEngine.GetMeChairID())return;
        
        this.m_AddScoreUI.getChildByName('AddNode0').active = true;
        var PushMax = GameDef.GetPushScore(this.dwCusRules[0]);
        for(var i in this.m_AddScoreUI.getChildByName('AddNode0').children)
        {
            if(parseInt(i)==this.m_AddScoreUI.getChildByName('AddNode0').children.length-1)break;
            var Index = this.m_AddScoreUI.getChildByName('AddNode0').children[i].name.slice(6);
            this.m_AddScoreUI.getChildByName('AddNode0').children[i].active = parseInt(Index) <= PushMax;
        }
        return;
        //推注
        if(bShow) this.$('BtUINode/AddScoreUI/AddNode'+index+'/BtPushAdd').active = true;
        else this.$('BtUINode/AddScoreUI/AddNode'+index+'/BtPushAdd').active = false;
        

    },

    //显示下注分
    SetAddScore: function (wView, score) {
        if (wView == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserInfo[i].SetAddScore(0);
            }
        } else {
            this.m_UserInfo[wView].SetAddScore(score);
            this.m_Jetton.OnUserAdd(wView, score*window.PLATFORM_RATIO);//增加到桌子
        }
    },

    //看牌、搓牌按钮
    ShowCardUI: function () {
        this.m_NdLookCard.active = true;
        this.m_NdRubCard.active = true;
    },

    //抢庄节点
    ShowBankerUI: function () {
        this.m_BankerUI.active = true;
        // for (var i = 0; i <= 4; i++) {
        //     this.$('BtUINode/BankerUI/BtBanker#' + i).active = (i <= this.m_MaxCallBanker);
        // }
    },

    //结算分
    SetUserEndScore: function (wChairID, Score) {
        if (wChairID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.SetEndScore(i, '')
            }
            return
        }
        this.SetEndScore(wChairID, Score);
        //动画 
        this.m_Jetton.OnUserGet(wChairID, Score);
    },
    SetEndScore: function (wChairID, Score) {
        this.m_UserInfo[wChairID].SetEndScore(Score);
    },

    //椅子号、规则、分数
    SetCardType: function (wChairID, index, score) {
        if (wChairID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++){
                this.m_UserCardType[i].SetCardType();
            }
            return
        }
        this.m_UserCardType[wChairID].SetCardType(index,score);
    },

    //--------------------------------------------------------
    

    // SetCardType: function (wChairID, Type, Type2, Score1, Score2) {
    //     if (wChairID == INVALID_CHAIR) {
    //         for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
    //             this.m_UserCardType[i].SetCardType();
    //         }
    //         return
    //     }
    //     this.m_UserCardType[wChairID].SetCardType(Type, Type2, Score1, Score2)
    // },

    SetCardTypeFinish: function (wChairID) {
        if (wChairID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserCardType[i].SetFinish(false);
            }
            return
        }
        if (wChairID != GameDef.MYSELF_VIEW_ID) this.m_UserCardType[wChairID].SetFinish(true)
    },
    //用户信息更新
    OnUserEnter: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserTableScore[wChairID] = 0;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_UserTableScore[wChairID]);
        //if(pUserItem.GetUserStatus() == US_READY) this.SetUserState(wChairID, 'Ready');
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
        
        this.m_UserInfo[wChairID].SetCreater(pUserItem.GetUserID() == this.m_GameClientEngine.m_dwCreater);
        if (wChairID == GameDef.MYSELF_VIEW_ID) {
            if (this.m_VoiceCtrl == null) {
                this.ShowPrefabDLG('VoiceCtrl', this.node.getChildByName('VoiceNode'), function (Js) {
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                }.bind(this));
            }

            if (this.m_ChatControl == null) {
                this.ShowPrefabDLG('ChatPrefab', this.node, function (Js) {
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                }.bind(this));
            }

            if (this.m_FaceExCtrl == null) {
                this.ShowPrefabDLG('FaceExCtrl', this.$('AniNode'), function (Js) {
                    this.m_FaceExCtrl = Js;
                }.bind(this));
            }
        }
    },

    OnUserState: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem, this.m_UserTableScore[wChairID]);
        this.m_UserInfo[wChairID].SetOffLine(pUserItem.GetUserStatus() == US_OFFLINE);
    },
    OnUserLeave: function (pUserItem, wChairID) {
        this.m_UserTableScore[wChairID] = 0;
        this.m_UserInfo[wChairID].UserLeave(pUserItem);
        this.m_UserState[wChairID].Init();
        this.m_pIClientUserItem[wChairID] = null;
    },
    OnUserScore: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateScore(pUserItem, this.m_UserTableScore[wChairID]);
    },

    SetUserTableScore: function (wChairID, Score) {
        if (wChairID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserTableScore[i] = 0;
                if (this.m_pIClientUserItem[i] == null) continue
                this.m_UserInfo[i].UpdateScore(this.m_pIClientUserItem[i], this.m_UserTableScore[i]);
            }
            return
        }
        this.m_UserTableScore[wChairID] = Score;
        this.m_UserInfo[wChairID].UpdateScore(this.m_pIClientUserItem[wChairID], this.m_UserTableScore[wChairID]);
    },

    UserExpression: function (SendUserID, TagUserID, wIndex) {
        var SendChair = INVALID_CHAIR, RecvChair = INVALID_CHAIR;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue
            if (this.m_pIClientUserItem[i].GetUserID() == SendUserID) SendChair = i;
            if (this.m_pIClientUserItem[i].GetUserID() == TagUserID) RecvChair = i;
        }
        if (wIndex < 2000 && this.m_ChatControl) this.m_ChatControl.ShowBubblePhrase(SendChair, wIndex, this.m_pIClientUserItem[SendChair].GetGender());
        else if (wIndex < 3000 && this.m_FaceExCtrl) this.m_FaceExCtrl.OnSendFaceEx(SendChair, RecvChair, wIndex);
    },
    UserChat: function (SendUserID, TagUserID, str) {
        if (this.m_ChatControl == null) return
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue
            if (this.m_pIClientUserItem[i].GetUserID() == SendUserID) {
                this.m_ChatControl.ShowBubbleChat(i, str);
                break;
            }
        }
    },
    //初始化牌
    InitTableCard: function () {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserCardControl[i].SetCardData(null, 0);
        }
        this.SetCardType(INVALID_CHAIR);
    },

    //调整控件
    RectifyControl: function (nWidth, nHeight) {
        var SendCardPosArr = new Array();  //聊天位置
        this.m_UserChatArr = new Array();

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var bSelf = (i == GameDef.MYSELF_VIEW_ID);
            this.m_UserChatArr[i] = this.m_UserPosArr[i];
            this.m_UserVoiceArr[i] = cc.v2(this.m_UserPosArr[i].x + 40, this.m_UserPosArr[i].y - 28);
            //玩家头像
            this.m_UserInfo[i].node.setPosition(this.m_UserPosArr[i]);
            // this.m_UserInfo[i].node.scale = bSelf?1.5:1;
            //准备 //准备的位置
            //this.m_UserState[i].SetBenchmarkPos(this.m_UserPosArr[i].x, this.m_UserPosArr[i].y + 60);
            var PosX = (i == 3 || i== 4 || i==5 || i== 6)?this.m_UserPosArr[i].x -100:this.m_UserPosArr[i].x +100;
            this.m_UserState[i].SetBenchmarkPos(PosX, this.m_UserPosArr[i].y + 33);
            //手牌
            this.m_UserCardControl[i].SetBenchmarkPos(this.m_CardPosArr[i].x, this.m_CardPosArr[i].y, enXLeft);
            // this.m_UserCardControl[i].SetScale(bSelf ? 0.7 : 0.3);
            // this.m_UserCardControl[i].SetCardDistance(bSelf ? 10 : -110);
            this.m_UserCardControl[i].SetScale(1.45);
            this.m_UserCardControl[i].SetCardDistance(5);
            //发牌位置
            SendCardPosArr[i] = cc.v2(this.m_CardPosArr[i].x - 30, this.m_CardPosArr[i].y);
            //牌型 
            // this.m_UserCardType[i].SetBenchmarkPos(this.m_CardPosArr[i].x, this.m_CardPosArr[i].y + (bSelf ? 235 : 15));
            this.m_UserCardType[i].SetBenchmarkPos(this.m_CardPosArr[i].x+85, this.m_CardPosArr[i].y + 50);
        }

        //发牌坐标点
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(-30, -60), SendCardPosArr);
        //筹码坐标
        this.m_JetCtrl.SetUserPos(this.m_UserPosArr);
        //筹码动画
        this.m_Jetton.SetBenchmarkPos(cc.v2(0,20), 270, 100);
        this.m_Jetton.SetUserPos(this.m_UserPosArr);


    },

    OnBnClickedFirend: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnFirend();
    },

    OnBnClickedStart: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageStart();
    },
    OnBtClickedCtrlStart() {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageCtrlStart();
    },

    //////////////////////////////////////////////////////////////////////////////
    //下注按钮
    OnClick_BtAdd: function (Tag, Data) {
        this.m_GameClientEngine.OnMessageAddScore(Data);
    },

    //推注按钮
    OnClick_BtPushAdd:function(){
        this.m_GameClientEngine.OnMessagePushAddScore();
    },

    //翻牌
    OnClick_BtLookCard: function (Tag, Data) {
        this.m_NdLookCard.active = false;
        this.m_NdRubCard.active = false;
        this.SetCardClickedAble(true);
        this.OnBnClickedShowCard();
    },

    OnBnClickedShowCard: function () {
        this.m_GameClientEngine.OnMessageShowCard();
        // this.m_NdOpenCard.active = true;
        this.m_OpenCardCtrl.node.active = false;

    },

    //搓牌
    OnClick_BtRubCard: function (Tag, Data) {
        this.m_NdLookCard.active = false;
        this.m_NdRubCard.active = false;
        this.m_GameClientEngine.OnShowOpenCardCtrl();
    },

    //开牌按钮
    OnClick_BtOpenCard: function () {
        this.m_GameClientEngine.OnMessageOpenCard();
    },

    //抢庄按钮
    OnClick_BtBanker: function (Tag, Data) {
        this.m_GameClientEngine.OnMessageCallBanker(Data);
    },

    //坐庄/不坐
    OnClick_BtToBeBanker: function (Tag, Data) {
        this.m_GameClientEngine.OnMessageToBeBanker(Data);
    },
    //-------------------------------------------------------

    OnShootChange: function () {
        var CardData = [0, 0, 0];
        if (this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].GetSelCard(CardData) == 3) {
            var SGType = GameDef.GetSGCardType(CardData);
            var JHType = GameDef.GetJHCardType(CardData);
            this.SetCardType(GameDef.MYSELF_VIEW_ID, SGType, JHType);
        } else {
            this.SetCardType(GameDef.MYSELF_VIEW_ID);
        }
    },
    Onclick_BtGameRule:function(){
        this.ShowPrefabDLG('RoomRules',this.node);
    },

    //////////////////////////////////////////////////////////////////////////////
    //聊天按钮回调
    OnBnClickedChat: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_ChatControl == null) return;
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },

    //设置庄家
    SetBankerUser: function (wBanker) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserInfo[i].SetBanker(i == wBanker);
        }
        return;
    },
    SetCardClickedAble: function (bAble) {
        this.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetClickable(bAble);
    },
    //设置时间
    SetUserTimer: function (wChairID, wTimer, Progress) {
        if (wTimer != null) {
            this.$('TopFrame/SpClock').active = true;
            this.$('TopFrame/SpClock/Lb@Label').string = wTimer;
        } else {
            this.$('TopFrame/SpClock').active = false;
        }
    },
    //设置时间
    SetShowUserBanker: function (ViewID, bShow) {
        if (ViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserInfo[i].SetBanker(false)
            }
        } else {
            this.m_UserInfo[ViewID].SetBanker(bShow)
        }
    },
    SetUserState: function (ViewID, State) {
        if (ViewID == INVALID_CHAIR) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserState[i].HideState();
            }
        } else {
            this.m_UserState[ViewID].ShowUserState(State);
        }
    },

    SetTableTips: function (str) {
        if (str == null) {
            this.m_TableTipsNode.string = ''
        } else {
            this.m_TableTipsNode.string = str;
        }
    },
    SetTableSpState: function (str) {
        if (str == null) {
            this.$("TopFrame/spGameState").active = false;
        } else {
            this.$("TopFrame/spGameState").active = true;
            this.$("TopFrame/spGameState@Sprite").spriteFrame = this.m_atlas.getSpriteFrame('sp' + str);
        }
    },
    //设置警告
    SetViewRoomInfo: function (dwServerRules,dwRules) {
        var LbClub = this.$('TopFrame/ClubNumber@Label');
        if (this.m_GameClientEngine.m_dwClubID > 0 && LbClub) LbClub.string = '俱乐部ID:' + this.m_GameClientEngine.m_dwClubID;

        this.m_TableNumber.string = '房间号: ' + this.m_GameClientEngine.m_dwRoomID;
        if (this.m_GameClientEngine.m_dwClubID > 0) this.m_ClubNum.string = '俱乐部: ' + this.m_GameClientEngine.m_dwClubID;

        this.m_RulesText.string = GameDef.GetRulesStr(dwServerRules,dwRules);
        this.RectifyControl();

        this.m_MaxCallBanker = 4;
        if (dwRules[0] & GameDef.GAME_TYPE_BANKER_3) this.m_MaxCallBanker = 3;
        if (dwRules[0] & GameDef.GAME_TYPE_BANKER_2) this.m_MaxCallBanker = 2;
        if (dwRules[0] & GameDef.GAME_TYPE_BANKER_1) this.m_MaxCallBanker = 1;

        //规则
        this.dwCusRules = dwRules;
        this.$('TableButton/NewButton/BtExit').active = this.m_GameClientEngine.m_wGameProgress==0;
    },
    UpdateRoomProgress: function () {
        this.$('TableButton/NewButton/BtExit').active = this.m_GameClientEngine.m_wGameProgress==0;
        this.m_subsumlun.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress, this.m_GameClientEngine.m_dwRules);
    },
    UpdateSet: function () {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue
            this.m_UserCardControl[i].DrawCard();
        }
    },
    //通杀通陪
    PlayAllWinorLoseAction:function(Mode){
        if(Mode == 0)return;
        if(Mode == 1){
            this.ShowL2CandC2R(this.m_Tongs);

        }else{
            this.ShowL2CandC2R(this.m_Tongp);
        }
    },
    ShowL2CandC2R:function(Node){
        Node.x = -1111;
        Node.active = true;
        Node.stopAllActions();
        var act1 = cc.moveTo(0.3, cc.v2(0,0)).easing(cc.easeOut(3.0));
        var act2 = cc.moveTo(0.3, cc.v2(1111,0)).easing(cc.easeOut(3.0));
        var act3 = cc.sequence(cc.delayTime(1), act2);
        Node.runAction(cc.sequence(act1,act3,cc.callFunc(function(){
            Node.active = false;
        })));
    },
    //随机庄动画
    StartAni: function (UserArr, Banker, NoAni) {
        if (UserArr.length <= 1 || NoAni) {
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
    update: function (dt) {
        // console.log(dt,this.m_AniUserArr)
        if (this.m_AniUserArr != null) {
            this.m_AniTempTime += dt;

            if (this.m_AniTempTime > this.m_AniTime) {
                this.m_AniTime += (this.m_AniTempTime < 2 ? 0.05 : 0.2);

                for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    this.m_UserInfo[i].SetBanker(i == this.m_AniUserArr[this.m_AniUserIndex])
                }

                if (this.m_AniUserArr[this.m_AniUserIndex] == this.m_AniBanker && this.m_AniTempTime > 3) {
                    if (this.m_AniTime < 4) {
                        this.m_AniTime = 4.5
                    }
                    else {
                        this.SetShowUserBanker(INVALID_CHAIR);
                        this.m_AniUserArr = null;
                        this.m_GameClientEngine.OnTimeIDI_SETBANKER();
                    }
                } else {
                    this.m_AniUserIndex++;
                    if (this.m_AniUserIndex >= this.m_AniUserArr.length) {
                        this.m_AniUserIndex = 0;
                        this.m_AniIndex++;
                    }
                }
            }
        }
    },

    //骰子动画
    PlayDiceAni: function (cbDice) {
        this.m_cbDiceNum[0] = cbDice[0];
        this.m_cbDiceNum[1] = cbDice[1];
        this.m_DiceAni.active = true;
        this.ani = this.m_DiceAni.getComponent(dragonBones.ArmatureDisplay);
        this.ani.playAnimation('newAnimation', 1);
        //换骰子图片
        this.ani.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this);
    },

    //动画结束
    animationEventHandler: function(event) {
        if (event.type == dragonBones.EventObject.COMPLETE) {
            var diceList = [0, 0, 1, 2, 3, 4, 5]; //骰子传过来是1-6点
            this.ani = this.m_DiceAni.getComponent(dragonBones.ArmatureDisplay);
            var diceSlot0 = this.ani.armature().getSlot('tz1');
            var diceSlot1 = this.ani.armature().getSlot('tz11');
            if (cc.sys.isNative)  {
                diceSlot0.setDisplayIndex(diceList[this.m_cbDiceNum[0]]);
                diceSlot1.setDisplayIndex(diceList[this.m_cbDiceNum[1]]);
            } else {
                diceSlot0.displayIndex = (diceList[this.m_cbDiceNum[0]]);
                diceSlot1.displayIndex = (diceList[this.m_cbDiceNum[1]]);
            }
            
            // this.m_DiceAni.runAction(cc.sequence(cc.delayTime(1.3), cc.hide()));
            this.node.runAction(cc.sequence( cc.delayTime(2), cc.callFunc(function () {
                this.m_DiceAni.active = false;
            }, this)));
            
            //发牌
            this.m_GameClientEngine.OnPlaySendCard(this.m_cbDiceNum);
            this.m_cbDiceNum = new Array();
        }
    },

    
    AniFinish:function(animark){
        //this.node.active = false;
        //this.m_AniAction[animark].active = false; //原来实现
      // this.m_AniAction[0].active=false; //20200620 leexc

    },

});
