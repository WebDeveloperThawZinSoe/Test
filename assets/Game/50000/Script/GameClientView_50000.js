cc.Class({
    extends: cc.GameView,

    properties: {
        m_RulesText:cc.Label,
        m_UserInfo: [cc.Component],
        m_CardCtrl: [cc.Component],
        m_RePlayCard:[cc.Component],
        m_OpertorCtrl:[cc.Node],
        m_Atlas: cc.SpriteAtlas,

        m_subsumlun: cc.Label,
        m_LittleUser:[cc.Node],
        m_ClubNum:cc.Label,
        m_TrusteeNode:cc.Node,
        m_CancelTrustee:cc.Node,
        m_Direction:cc.Node,
    },

    start:function () {
        //组件定义
        this.InitView();
        this.ResetData();
        this.m_GameClientEngine = this.$('..@GameClientEngine_'+GameDef.KIND_ID);
        this.m_DupaiButton=this.$('GameButton/DupaiButton');//独牌按钮
        this.m_Aginrules=this.$('GameButton/Aginrules');//提示条幅
        this.m_LittleEnd=this.$('LittlerResoult');//小结算空间
        this.m_subsumlun.string='';
        this.m_TableNumber = this.$('Frame/TableNumber@Label');
        this.m_RePlayCardNode = this.$('RePlayCard');
        this.m_CardPosArr = new Array();
        //发牌控件 
        for(var i=0;i<27;i++){
            var pos=cc.v2(-546+42*i, -240);
            this.m_CardPosArr.push(pos);
        }
        var SendCardPosArr = new Array();  //聊天位置
        for(var i =0;i<27;i++)
            SendCardPosArr[i] =  this.m_CardPosArr[i];

        this.m_CardNode = this.$('SendNode');
        this.m_SendCardCtrl = this.$('@SendCardCtrl_'+GameDef.KIND_ID, this.m_CardNode);
        this.m_SendCardCtrl.SetHook(this);
        this.m_SendCardCtrl.SetBenchmarkPos(cc.v2(-30,-60),  this.m_CardPosArr);
        this.m_MyCardCtrl = this.$('CardCtrl@CardCtrl_'+GameDef.KIND_ID);
        this.m_MyCardCtrl.SetHook(this);
        this.m_ChairNode=this.$('LittlerResoult/Layout');
        this.m_PackageCtrl=this.$('PackageCard');
  
  
    },

    ctor: function () {
        this.m_pIClientUserItem = new Array();
        this.m_UserFaceArr = new Array();
        this.m_UserChatArr = new Array();
        this.m_UserTableScore = new Array();          //用户信息
        this.jetton;
        //this.m_UserVoiceArr = new Array();
        this.m_UserVoiceArr = new Array(
            cc.v2(-560, -24),
            cc.v2( 487, 27),
            cc.v2(323, 282),
            cc.v2(-550, 161),
        )  
        this.m_CardTestName = 'UserCheatCtrl';
    },



     //方向
     OnChangeDirection:function(chair){
        var viewID=this.m_GameClientEngine.SwitchViewChairID(chair);
        switch(viewID){
            case 0:
            {   
                this.m_Direction.getComponent('cc.Sprite').spriteFrame=this.m_Atlas.getSpriteFrame('xia')
                break;
            }
            case 1:
            {
                this.m_Direction.getComponent('cc.Sprite').spriteFrame=this.m_Atlas.getSpriteFrame('you')
                break;
            }
            case 2:
            {
                this.m_Direction.getComponent('cc.Sprite').spriteFrame=this.m_Atlas.getSpriteFrame('shang')
                break;
            }
            case 3:
            {
                this.m_Direction.getComponent('cc.Sprite').spriteFrame=this.m_Atlas.getSpriteFrame('zuo')
                break;
            }
        }
        this.m_Direction.active=true;
    },

    //关闭明鸡牌
    OnCloseChickenCard:function(){
        var chicken=this.$('ChickenCard');
        var showcard= this.$('ShowCard');
        var action= cc.sequence( cc.scaleTo(0.1, 0.1, 0),
                                 cc.callFunc(function(){ chicken.active = false;}) 
                               )
        chicken.runAction(action);
    },

    ResetData:function(){
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].Init(this, parseInt(i));
            this.m_UserFaceArr[i] = this.m_UserInfo[i].node.getPosition();
            this.m_UserChatArr[i] = this.m_UserInfo[i].node.getPosition()/*.add(cc.v2(0, 80))*/;
            //this.m_UserVoiceArr[i]=this.m_UserInfo[i].node.getPosition();
        }

        //this.m_UserVoiceArr
    },

    onLoadGame: function () {
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].Init(this, parseInt(i));
            this.m_UserFaceArr[i] = this.m_UserInfo[i].node.getPosition();
            this.m_UserChatArr[i] = this.m_UserInfo[i].node.getPosition()/*.add(cc.v2(0, 80))*/;
            //this.m_UserVoiceArr[i]=this.m_UserInfo[i].node.getPosition();
        }
    },

    OnClickGameRules:function(){
        //this.ShowPrefabDLG('RoomRules',this.m_GameClientEngine.node); 
        this.ShowPrefabDLG('RoomRules',this.node,function(Js){
            Js.ShowSubView(GameDef.KIND_ID);
        }.bind(this));
    },

    OnBtClickedGameRules:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('GameRules',this.m_GameClientEngine.node,function(Js){
            Js.SetGameRules(GameDef.GetRulesStr(this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr));
        }.bind(this));
    },
    
    MoveResoulticonView:function(wView){
        this.schedule(function(){
            var jetton = cc.instantiate(this.m_Jinbis);
            this.node.addChild(jetton);
            jetton.setPosition(this.m_UserInfo[wView].node.getPosition());
            jetton.active = true;
            jetton.runAction(cc.moveTo(0.3,cc.v2(0,13)));
        },0.05,4,0);
    },
    
    SetUserEndScore: function (wChairID, Score) {

    },
    
    //用户信息更新
    OnUserEnter: function (pUserItem, wChairID) {

        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        this.m_UserInfo[wChairID].node.active = true;

        if (pUserItem.GetUserStatus() == US_READY) this.m_UserInfo[wChairID].SetReady(pUserItem);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(pGlobalUserData.dwUserID != pUserItem.GetUserID()) return;
        if(this.m_GameClientEngine.IsLookonMode() == false)
        {
            this.m_BtFriend.active = (this.m_GameClientEngine.m_dwRoomID != 0 &&  this.m_GameClientEngine.m_wGameProgress == 0);
            this.m_BtStart.active = pUserItem.GetUserStatus() == US_SIT;
        }



        if(this.m_GameClientEngine.IsLookonMode() == false)
        {
            this.m_BtFriend.active = (this.m_GameClientEngine.m_dwRoomID != 0 &&  this.m_GameClientEngine.m_wGameProgress == 0);
            this.m_BtStart.active = pUserItem.GetUserStatus() == US_SIT;
        }

        
        if (!this.m_GameClientEngine.m_ReplayMode && wChairID == GameDef.MYSELF_VIEW_ID) {
          
            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.node.getChildByName('VoiceNode'),function(Js){
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                }.bind(this));
            }

            if (this.m_FaceExCtrl == null) {
                this.ShowPrefabDLG('FaceExCtrl', this.m_AniNode, function (Js) {
                    this.m_FaceExCtrl = Js;
                }.bind(this));
            }
        }
    },


    OnUserState: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateUserItem(pUserItem);
        if (pUserItem.GetUserStatus() == US_READY) {
            this.m_GameClientEngine.PlayActionSound(pUserItem.GetChairID(), "READY");
            if (wChairID == GameDef.MYSELF_VIEW_ID) this.m_GameClientEngine.OnMessageStart(null, true);
        }
    },

    OnUserLeave: function (pUserItem, wChairID) {
        this.m_UserTableScore[wChairID] = 0;    
        this.m_UserInfo[wChairID].UserLeave(pUserItem);
        this.m_pIClientUserItem[wChairID] = null;
    },

    OnUserScore: function (pUserItem, wChairID) {
        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_UserInfo[wChairID].UpdateUserItem(pUserItem,this.m_UserTableScore[wChairID]);
    },
 
    sendCard: function (cbCardData, cbIdx) {
        this.resetTurnScore();
        var delay = 0;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_GameClientEngine.m_bPlayStatus[i]) continue;
            if (this.m_GameClientEngine.m_bGiveUp[i]) continue;
            var wView = this.m_GameClientEngine.SwitchViewChairID(i);
            // delay += this.m_SendCtrl.sendCard(cbCardData[i], this._getCardPos(wView, cbIdx), delay, function (data) {
            //     this.m_CardCtrl[data[0]].sendCard(data[1]);
            // }.bind(this), [wView, cbCardData[i]]);
        }
        return delay;
    },

    resetTurnScore: function () {
       /* for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].node.getChildByName('addScore').getChildByName('_addScore').getComponent(cc.Label).string='0';
        }*/
    },

    setCard: function (cbCardData) {
        for (var i in cbCardData) {
            if (!this.m_GameClientEngine.m_bPlayStatus[i]) continue;
            var wView = this.m_GameClientEngine.SwitchViewChairID(i);
            this.m_CardCtrl[wView].setCard(cbCardData[i]);
          /*  if (this.m_GameClientEngine.m_bGiveUp[i]) {
                this.m_CardCtrl[wView].setPass();
            }*/
        }
    },

    _getCardPos: function (wView, cbIdx) {
        var node = this.m_CardCtrl[wView].m_Card[cbIdx].node;
        var pos = node.getPosition();
        var world = node.parent.convertToWorldSpaceAR(pos);
        var nodePos = this.m_SendCtrl.node.convertToNodeSpaceAR(world);
        return nodePos;
    },

    setCurUser: function (wChairID, cbOPCode) {
        var wView = this.m_GameClientEngine.SwitchViewChairID(wChairID);
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].setCur(i == wView);
        }
        if (GameDef.MYSELF_VIEW_ID == wView) {
            this.m_ButtonCtrl.showOPView(cbOPCode);
        } else {
            this.m_ButtonCtrl.hideOPView();
        }
    },

    addScore: function (wView, llAddScore) {
        var jetton = cc.instantiate(this._jetton);
        this.node.addChild(jetton);
        jetton.setPosition(this.m_UserInfo[wView].node.getPosition());
        jetton.active = true;
        jetton.runAction(cc.sequence(cc.moveTo(0.2, this._jettonTotal.getPosition()),cc.removeSelf(true),
            cc.callFunc(function () {
                var labAddScore = this.m_UserInfo[wView].node.getChildByName('addScore').getChildByName('_addScore').getComponent(cc.Label).string;
                var labTotal = this._totalScore.$Label;
                labAddScore.string = parseInt(labAddScore.string) + llAddScore;
                labTotal.string = parseInt(labTotal.string) + llAddScore;
            }, this)));
        return 0.5
    },

    setScore: function (llTurnScore, llTableScore) {
        var llTotal = 0;
        for (var i in llTurnScore) {
            var wView = this.m_GameClientEngine.SwitchViewChairID(i);
            this.m_UserInfo[wView].node.getChildByName('addScore').getChildByName('_addScore').getComponent(cc.Label).string = llTurnScore[i];
            llTotal += llTableScore[i];
        }
        this._totalScore.$Label.string = llTotal;
    },

    showCard: function (cbFirst, cbType) {
        for (var i in cbFirst) {
            if (cbFirst[i]) {
                var wView = this.m_GameClientEngine.SwitchViewChairID(i);
                this.m_CardCtrl[wView].showCard(cbFirst[i], cbType[i]);
            }
        }
    },

    //设置庄家
    SetBankerUser: function (wBankerUser) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserInfo[i].SetBanker(i == wBankerUser);
        }
        return;
    },

    //设置警告
    SetViewRoomInfo:function (m_dwServerRules,m_dwRulesArr){
        this.m_LbGameRules.string = GameDef.GetRulesStr(m_dwServerRules,m_dwRulesArr);
        this.m_TableNumber.string = ''+this.m_GameClientEngine.m_dwRoomID;
        if (this.m_ChatControl == null) {
            this.ShowPrefabDLG('ChatPrefab', this.node, function (Js) {
                this.m_ChatControl = Js;
                this.m_ChatControl.ShowSendChat(false);
                //this.m_ChatControl.ShowInputNode(!(m_dwRulesArr[0] & GameDef.GAME_TYPE_OPTION_4));
                this.m_ChatControl.InitHook(this);
            }.bind(this));
         }
         var bShow = this.m_GameClientEngine.IsLookonMode();
         if (this.m_BtChat) this.m_BtChat.active = !bShow;
         if (this.m_BtGPS)  this.m_BtGPS.active = !bShow;
         if (this.m_BtMenu) this.m_BtMenu.active = !bShow;
    },

    UpdateRoomProgress: function () {
        //this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress, this.m_GameClientEngine.m_dwRules);
        this.m_subsumlun.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules) ;
    },

    // OnBtShowGPS:function(){
    //     this.ShowGamePrefab("TableUserGPS",GameDef.KIND_ID,this.node, function(Js){
    //         this.m_TableGPSCtrl = Js;
    //         this.m_TableGPSCtrl.UpdateUserData();
    //         this.m_GameClientEngine.GetTableUserGPS();
    //     }.bind(this));
    // },

    // OnGPSAddress: function (GPSInfo) {
    //     //this.GetTableUserGPS();
    //     if(this.m_TableGPSCtrl)
    //       this.m_TableGPSCtrl.UpdateAddress(GPSInfo);
    // },

    resetView: function () {
        for (var i in this.m_CardCtrl) {
            this.m_CardCtrl[i].resetView();
        }
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].resetView();
        }
       // this._totalScore.$Label.string = '0';
    },
    
     //托管
    OnBnClickedTrustee: function (event, customData) {
        cc.gSoundRes.PlaySound('Button');
        
        this.m_GameClientEngine.OnMessageTrustee(customData);
    },

    SetUserTrustee: function (wViewID, cbTrustee) {
        if (wViewID == GameDef.MYSELF_VIEW_ID) {
            // if(this.m_cbTrustee != cbTrustee) {
                if (cbTrustee) var trustee_show = cc.moveTo(0.1, cc.v2(0, 0));
                else var trustee_show = cc.moveTo(0.1, cc.v2(0, -250));
                this.m_CancelTrustee.stopAllActions();
                this.m_CancelTrustee.runAction(trustee_show);
                //this.m_cbTrustee = cbTrustee;
            // }
        }
        this.m_UserInfo[wViewID].SetTrustee((cbTrustee == 1));
    },

    AniFinish:function(){

    },

});