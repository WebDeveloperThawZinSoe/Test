cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_HandCardNode:[cc.Node],
        m_OperateNode:cc.Prefab,
        m_CardPrefab:[cc.Prefab],
        m_OutCardPos:[cc.Node],
        m_HuCard:[cc.Node],
        m_HuCardBG:[cc.Node],
        m_Atlas:cc.SpriteAtlas,
        m_DiscardCardNode:cc.Node,
        m_CenterCtrlPrefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor:function(){
        this.m_HandCard = new Array();
        this.m_Weave = new Array();
        this.m_OutCard = new Array();
        //流逝时间
        this.m_LastClickTime = 0;
        this.m_MoveCard = new Array();
        this.m_CardBackName=new Array();
        this.m_CardBackName=[
            "BackLeft",
            "BackRight",
            "BackTB",
            "ShowLR",
            "ShowTB",
            "StandBottom",
            "StandLeft",
            "StandRight",
            "StandTop",
        ];
        this.m_PlayDiscardIng = new Array();
        this.m_PlayNodeList = new Array();


        this.m_HuCardData = new Array(4);
        this.m_HuCardItem = new Array(4);
        for(var i = 0; i < 4; i++)
        {
            this.m_HuCardData[i] = new Array();
            this.m_HuCardItem[i] = new Array();
        }
        this.m_bInit = false;
    },
    onLoad:function ()
    {
        this.Init();
    },
    Init:function()
    {
        if(this.m_bInit == true) return;
        this.m_bInit = true;
        cc.director.getCollisionManager().enabled = true;
        //东南西北提示
        this.m_CenterViewCtrl = cc.instantiate(this.m_CenterCtrlPrefab);
        this.node.getChildByName('CenterCtrl').addChild(this.m_CenterViewCtrl);
        this.m_CenterViewCtrl = this.m_CenterViewCtrl.getComponent('CenterViewCtrl');

        this.m_DiscardCard = this.node.getChildByName('DiscardCardCtrl').getComponent('DiscardCardCtrl');
        this.m_TingTip = this.node.getChildByName('TingNode').getComponent('TingCtrl');

        //玩家手牌
        for (var i = 0; i < this.m_HandCardNode.length; i++) {
            this.m_HandCard[i] = this.m_HandCardNode[i].getComponent('CardControl');
            this.m_Weave[i] = this.m_HandCardNode[i].getComponent('WeaveControl');
            this.m_Weave[i].Init(this.m_HandCard[i].m_HandState);
            this.m_PlayDiscardIng[i] = false;
            this.m_HandCard[i].SetHook(this);
        }

        for(var i = 0; i < 4; i++) {
            this.m_MoveCard[i] = cc.instantiate(this.m_HandCard[i].m_CardItem);
            this.m_MoveCard[i].active = false;
            this.node.addChild(this.m_MoveCard[i]);
            this.m_MoveCard[i] = this.m_MoveCard[i].getComponent('CardItem');
            this.m_MoveCard[i].SetState(GameDef.HAND_STATE_SHOW);
            this.m_MoveCard[i].SetShadowShow(false);
            this.m_HandCard[i].m_MoveCard = this.m_MoveCard[i];
        }
    },

    //是否点击一下就出牌,true:点上牌就打出,false:抬起或落下
    setClickSendCard:function(click){
        this.m_HandCard[2].SetClickSendCard(click);
    },
    UpdateUserCount: function () {
        var nUserCount = GameDef.GetPlayerCount();
        this.m_ShowUserAction = new Array(4);
        this.m_GameUserCount = nUserCount;
        for (var i = 0; i < 4; i++) {
            this.m_ShowUserAction[i] = true;
        }

        if (nUserCount == 2) {
            this.m_ShowUserAction[1] = false;
            this.m_ShowUserAction[3] = false;
        } else {
            for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
                var wViewID = GameDef.g_GameEngine.SwitchViewChairID(i);
                this.m_ShowUserAction[wViewID] = i < nUserCount;
             }
        }
        this.m_DiscardCard.setUserCount(nUserCount);
    },
    //重置游戏
    ResetView:function(){
        for (var i = 0; i < this.m_HandCard.length; i++) {
            this.m_HandCard[i].ResetView();
            this.m_MoveCard[i].node.active = false;
            this.m_PlayDiscardIng[i] = false;
        }

        for (var i = 0; i < this.m_Weave.length; i++) {
            this.m_Weave[i].ResetData();
        }
        this.m_DiscardCard.Reset();
        this.CleanHuCard();
    },
    // update (dt) {},
    SetCardData:function(viewID,cbCardData,cbCardCount,cbCurrentCard){
        if (this.m_ShowUserAction[viewID] == false ) return ;

        if((cbCardCount+1)%3==0){
            if( cbCardData != null ){
                var cbRemoveCard = new Array();
                cbRemoveCard[0] = cbCurrentCard;
                if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1)){
                    this.m_HandCard[viewID].SetCardData(cbCardData,cbCardCount-1);
                    this.m_HandCard[viewID].SetCurrentCard(cbCurrentCard);
                }
            }else{
                this.m_HandCard[viewID].SetCardData(cbCardData,cbCardCount-1);
                this.m_HandCard[viewID].SetCurrentCard(0);
            }
        }else{
            this.m_HandCard[viewID].SetCardData(cbCardData,cbCardCount);
        }
    },
     //亮倒的牌
     SetLiangCardData:function(viewID,cbCardData,cbCardCount,cbCurrentCard)
     {
         if (this.m_ShowUserAction[viewID] == false ) return ;
 
         if((cbCardCount+1)%3==0)
         {
             if( cbCardData != null )
             {
                 this.m_HandCard[viewID].SetLiangCardData(cbCardData,cbCardCount-1);
                 this.m_HandCard[viewID].SetLiangCurrentCard(cbCurrentCard);
             }
             else
             {
                 this.m_HandCard[viewID].SetLiangCardData(cbCardData,cbCardCount);
                 this.m_HandCard[viewID].SetCurrentCard(0);
             }
         }
         else
         {
             this.m_HandCard[viewID].SetLiangCardData(cbCardData,cbCardCount);
         }
     },
    SetLockCardData:function(viewID,cbCardData,cbCardCount, cbLockCardData, cbLockCount,cbCurrentCard)
    {
        if (this.m_ShowUserAction[viewID] == false ) return ;

        if((cbCardCount+1)%3==0)
        {
            if( cbCardData != null )
            {
                var cbRemoveCard = new Array();
                cbRemoveCard[0] = cbCurrentCard;
                if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1)){
                    this.m_HandCard[viewID].SetLockCardData(cbCardData, cbCardCount, cbLockCardData, cbLockCount, false, true);
                    this.m_HandCard[viewID].SetCurrentCard(cbCurrentCard);
                }
            }
            else
            {
                this.m_HandCard[viewID].SetLockCardData(cbCardData, cbCardCount, cbLockCardData, cbLockCount, false, true);
                this.m_HandCard[viewID].SetCurrentCard(0);
            }
        }
        else
        {
            this.m_HandCard[viewID].SetLockCardData(cbCardData, cbCardCount, cbLockCardData, cbLockCount, false);
        }
    },
    SetWeaveData:function(viewID,index,WeaveData,CardCount,Private){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_Weave[viewID].SetWeaveData(index,WeaveData,CardCount);
    },
    SetWeaveState:function(viewID,index,Obj){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_Weave[viewID].SetWeaveState(index,Obj);

    },
    SetDiscardCardDate:function(viewID,cbCardData,cbCardCount){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_DiscardCard.SetCardData(viewID,cbCardData,cbCardCount);
    },
    StopDiscard:function(viewID,cbCenterCard){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        var CardData = this.m_MoveCard[viewID].GetCardData();
        if( CardData == cbCenterCard && this.m_PlayDiscardIng[viewID])
        {
            this.m_MoveCard[viewID].node.stopAllActions();
            this.m_MoveCard[viewID].node.active = false;
            this.m_PlayDiscardIng[viewID] = false;
        }
        else{
            this.m_DiscardCard.RemoveDiscard(viewID);
        }
    },
    //展示牌移动到出牌位置
    PlayOutCardMoveToDiscard(viewID,CardData,callBack){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_PlayDiscardIng[viewID] = true;
        this.m_MoveCard[viewID].node.active = true;
        this.m_MoveCard[viewID].SetCardData(CardData);
        this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
        var StartPos = this.m_OutCardPos[viewID].getPosition();
        if( viewID != GameDef.HAND_BOTTOM ){
            this.m_MoveCard[viewID].node.scale = 2;
        }
        else{
            this.m_MoveCard[viewID].node.scale = 1;
        }

        this.m_MoveCard[viewID].node.setPosition(StartPos);

        var DiscardNode = this.m_DiscardCard.GetNextDiscardNode(viewID).node;

        var MoveTo = DiscardNode.convertToWorldSpaceAR(cc.v2(0,0));
        MoveTo = this.node.convertToNodeSpaceAR(MoveTo);

        var disScale = this.m_DiscardCard.GetScale(viewID);
        var sql = cc.sequence(
            cc.delayTime(0.5),
            cc.spawn(cc.moveTo(0.1,MoveTo),
            cc.scaleTo(0.1,disScale)),
            cc.delayTime(0.1),
            cc.callFunc(function(){
                this.m_PlayDiscardIng[viewID] = false;
                this.m_MoveCard[viewID].node.active = false;
                this.AddDiscard(viewID,CardData);
                GameDef.g_GameEngine.m_GameClientView.SetHuiPai(GameDef.m_cbMagicData);
                GameDef.g_GameEngine.m_GameClientView.ShockHuiPai();
                if( callBack != null )
                    callBack();
            },this),
        );
        this.m_MoveCard[viewID].node.stopAllActions();
        this.m_MoveCard[viewID].node.runAction(sql);
    },
    AddPlayNode:function(viewID,Card){
        Obj = new Object();
    },
    //播放出牌动画
    PlayDiscard:function(viewID,CardIndex,cbOutCardData,cbCardData,CardCount,wTingOutCard, LiangCount, bLiang){

        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        if( this.m_PlayDiscardIng[viewID] ){
            var DisCard = this.m_MoveCard[viewID].GetCardData();
            this.AddDiscard(viewID,DisCard,true);
        }
        this.m_PlayDiscardIng[viewID] = true;
        var StartNode;
        var DiscardNode = this.m_DiscardCard.GetNextDiscardNode(viewID).node;
        if( viewID != GameDef.HAND_BOTTOM ){

            StartNode = this.m_HandCard[viewID].GetCardNode(13);
        }
        else{

            StartNode = this.m_HandCard[viewID].GetCardNode(CardIndex);

        }

        StartNode = StartNode.node;
        var StartPos = StartNode.convertToWorldSpaceAR(cc.v2(0,0));
        var MoveTo1 = this.m_OutCardPos[viewID].getPosition();
        var MoveTo2 = DiscardNode.convertToWorldSpaceAR(cc.v2(0,0));

        StartPos = this.node.convertToNodeSpaceAR(StartPos);
        MoveTo2 = this.node.convertToNodeSpaceAR(MoveTo2);
        this.m_MoveCard[viewID].node.active = true;
        //this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
            this.m_MoveCard[viewID].SetCardData(cbOutCardData);
        if(wTingOutCard != null && wTingOutCard != 0)
        {
            this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW_BACK);
        }
        else 
        {
            this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
        }
        //this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
        if( viewID != GameDef.HAND_BOTTOM ){
            this.m_MoveCard[viewID].node.scale = 2;
        }
        else{
            this.m_MoveCard[viewID].node.scale = 1;
        }

        this.m_MoveCard[viewID].node.setPosition(StartPos);

        var disScale = this.m_DiscardCard.GetScale(viewID);
        var sql = cc.sequence(
            cc.callFunc(function(){
                this.m_PlayDiscardIng[viewID] = true;
                if( viewID == GameDef.HAND_BOTTOM )
                {
                    //出牌后不显示遮罩
                if(GameDef.KIND_ID == 62007){
                    this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
                    if(bLiang == true)
                    {
                        this.m_HandCard[viewID].SetSelfLiangCardData(cbCardData, CardCount, wTingOutCard, LiangCount);
                    }
                    else
                    {
                        this.m_HandCard[viewID].SetCardData(cbCardData,wTingOutCard);
                    }
                    this.m_HandCard[viewID].SetCurrentCard(null);
                }
                else{
                    if(GameDef.KIND_ID == 21063) GameDef.m_bHasQue = false;
                    this.m_HandCard[viewID].SetCardData(cbCardData,CardCount);
                    this.m_HandCard[viewID].SetCurrentCard(null);
                    if(wTingOutCard != null && wTingOutCard !=0)
                    {
                        this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW_BACK);
                    }
                    else 
                    {
                        this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);

                    }
                }
                    //this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
                    // this.m_HandCard[viewID].ResetPos();
                }
            },this),
            cc.moveTo(0.1,MoveTo1),
            cc.delayTime(0.5),
            cc.spawn(cc.moveTo(0.1,MoveTo2),
            cc.scaleTo(0.1,disScale)),
            cc.callFunc(function(){
                if(GameDef.KIND_ID == 62007)wTingOutCard = null;
                this.AddDiscard(viewID,cbOutCardData,true,wTingOutCard);
                this.m_PlayDiscardIng[viewID] = false;
            },this),
        );
        this.m_MoveCard[viewID].node.stopAllActions();
        this.m_MoveCard[viewID].node.runAction(sql);
    },
    AddDiscard:function(viewID,cbCardData,bShowArrow,wTingOutCard){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_DiscardCard.AddDiscard(viewID,cbCardData,bShowArrow,wTingOutCard);
        this.m_MoveCard[viewID].node.active = false;
    },
    //播放买码动画
    PlayBuyCode:function(viewID,cbOutCardData)
    {
        this.m_MoveCard[viewID].node.active = true;
        this.m_MoveCard[viewID].SetState(GameDef.HAND_STATE_SHOW);
        this.m_MoveCard[viewID].SetLiangCardData(cbOutCardData);
        this.m_MoveCard[viewID].node.scale = 1;
        this.m_MoveCard[viewID].node.setPosition(cc.v2(-160,40));

        var sql = cc.sequence(
            cc.spawn(cc.moveTo(0.2,cc.v2(0,0)),
            cc.scaleTo(0.2,1)),
            cc.delayTime(0.8),
            cc.callFunc(function(){
                this.m_MoveCard[viewID].node.active = false;
                GameDef.g_GameEngine.m_GameEnd.cbBuyCodeData.splice(0,1);
                GameDef.g_GameEngine.m_GameEnd.cbBuyCodeCount--;
                GameDef.g_GameEngine.OnTimeIDI_PERFORM_BUYCODE();
                
            },this),
        );
        this.m_MoveCard[viewID].node.stopAllActions();
        this.m_MoveCard[viewID].node.runAction(sql);
    },
    RemoveDiscardCard:function(viewID){
        if (this.m_ShowUserAction[viewID] == false ) {
            return ;
        }
        this.m_DiscardCard.RemoveDiscard(viewID);

    },
    SetSelfCardData:function(cbCardData,cbCardCount,cbCurrentCard)
    {
        //检测手里是否有定缺的花色
        if(GameDef.KIND_ID == 21063 && (GameDef.g_GameEngine.m_dwRulesArr[0] & GameDef.GAME_RULE_SP_17) != 0 && (GameDef.g_GameEngine.m_dwServerRules & GameDef.GAME_RULE_RENSHU_2) == 0)
        {
            GameDef.m_bHasQue = false;
            var cbCurrColor = cbCurrentCard & GameDef.MASK_COLOR;
            if(cbCurrColor == GameDef.g_GameEngine.m_cbQueColor[0] || cbCurrColor == GameDef.g_GameEngine.m_cbQueColor[1])
            {
                GameDef.m_bHasQue = true;
            }
            if(GameDef.m_bHasQue == false)
            {
                for(var i = 0; i < cbCardCount; i++)
                {
                    var cbColor = cbCardData[i] & GameDef.MASK_COLOR;
                    if(cbColor == GameDef.g_GameEngine.m_cbQueColor[0] || cbColor == GameDef.g_GameEngine.m_cbQueColor[1])
                    {
                        GameDef.m_bHasQue = true;
                        break;
                    }
                }
            }
        }

        this.m_HandCard[2].SetCardData(cbCardData,cbCardCount);
        this.m_HandCard[2].SetCurrentCard(cbCurrentCard);
    },
    SetSelfLockCardData:function(cbCardData, cbCardCount, cbLockCardData, cbLockCount, cbCurrentCard)
    {
        this.m_HandCard[2].SetLockCardData(cbCardData,cbCardCount, cbLockCardData, cbLockCount);
        this.m_HandCard[2].SetCurrentCard(cbCurrentCard);
    },
    SetSelfCardIndex:function(cbCardIndex,CurCardData, bIsListen){
        //转换扑克
        var cbCardData = new Array();
        var cbCardCount=GameDef.g_GameLogic.SwitchToCardData2(cbCardIndex,cbCardData);

        //混牌放最前面
        if( cbCardData != null && cbCardCount > 0 )
        {
            if( GameDef.m_cbMagicData != null && GameDef.m_cbMagicData > 0 )
            {
                for (var i = 0; i < cbCardCount; i++)
                {
                    if(cbCardData[i] == GameDef.m_cbMagicData)
                    {
                        cbCardData.splice(i,1);
                        cbCardData.splice(0,0,GameDef.m_cbMagicData);
                    }
                }
            }
        }
        
        //检测手里是否有定缺的花色
        if(GameDef.KIND_ID == 21063 && (GameDef.g_GameEngine.m_dwRulesArr[0] & GameDef.GAME_RULE_SP_17) != 0 && (GameDef.g_GameEngine.m_dwServerRules & GameDef.GAME_RULE_RENSHU_2) == 0)
        {
            GameDef.m_bHasQue = false;
            if(CurCardData != null && CurCardData != 0)
            {
                var cbCurrColor = CurCardData & GameDef.MASK_COLOR;
                if(cbCurrColor == GameDef.g_GameEngine.m_cbQueColor[0] || cbCurrColor == GameDef.g_GameEngine.m_cbQueColor[1])
                {
                    GameDef.m_bHasQue = true;
                }
            }
            if(GameDef.m_bHasQue == false)
            {
                for(var i = 0; i < cbCardCount; i++)
                {
                    var cbColor = cbCardData[i] & GameDef.MASK_COLOR;
                    if(cbColor == GameDef.g_GameEngine.m_cbQueColor[0] || cbColor == GameDef.g_GameEngine.m_cbQueColor[1])
                    {
                        GameDef.m_bHasQue = true;
                        break;
                    }
                }
            }
        }

        if(CurCardData != null && CurCardData != 0 ){
            var cbRemoveCard = new Array();
            cbRemoveCard[0] = CurCardData;
            if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1)){

                this.m_HandCard[2].SetCardData(cbCardData,cbCardCount-1, bIsListen);
                this.m_HandCard[2].SetCurrentCard(CurCardData, bIsListen);
                return ;
            }
        }
        if((cbCardCount+1)%3==0){
            this.m_HandCard[2].SetCardData(cbCardData,cbCardCount-1, bIsListen);
            this.m_HandCard[2].SetCurrentCard(cbCardData[cbCardCount-1], bIsListen);
        }else{
            this.m_HandCard[2].SetCardData(cbCardData,cbCardCount, bIsListen);
        }

    },
    SetSelfLiangCardIndex:function(cbCardIndex, CurCardData, cbLiangCard, wLiangCount, bIsListen, bLiang, cbCantOutCard){
        //转换扑克
        //cbCantOutCard  不能出的牌
        var cbCardData = new Array();
        var cbCardCount=GameDef.g_GameLogic.SwitchToCardData2(cbCardIndex,cbCardData);


        if(bLiang == true)
        {

            if(CurCardData != null && CurCardData != 0 )
            {
                var cbRemoveCard = new Array();
                cbRemoveCard[0] = CurCardData;
                if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1))
                {
                    this.m_HandCard[2].SetSelfLiangCardData(cbCardData, cbLiangCard, cbCardCount-1, wLiangCount, bIsListen);
                    this.m_HandCard[2].SetLiangCurrentCard(CurCardData, bIsListen);
                    return ;
                }
            }
            if((cbCardCount+1)%3==0)
            {
                this.m_HandCard[2].SetSelfLiangCardData(cbCardData, cbLiangCard,cbCardCount-1, wLiangCount, bIsListen);
                this.m_HandCard[2].SetLiangCurrentCard(cbCardData[cbCardCount-1], bIsListen);
            }
            else
            {
                this.m_HandCard[2].SetSelfLiangCardData(cbCardData, cbLiangCard,cbCardCount, wLiangCount, bIsListen);
            }
        }
        else
        {
            //不能出的牌  其余玩家除非亮倒否则不允许打听口牌，除非手中剩余的牌全是别人的听口牌。
            var bHasOut = false;
            if(bIsListen == false && cbCantOutCard != null)
            {
                for(var i = 0; i < cbCardCount; i++)
                {
                    var bHas = false;
                    for(var j = 0; j < 18; j++)
                    {
                        if(cbCantOutCard[j] == 0) break;
                        if(cbCantOutCard[j] == cbCardData[i])
                        {
                            bHas = true;
                            break;
                        }
                    }
                    if(bHas == false)
                    {
                        bHasOut = true;
                        break;
                    }
                }
            }

            if(CurCardData != null && CurCardData != 0 )
            {
                var cbRemoveCard = new Array();
                cbRemoveCard[0] = CurCardData;
                if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1))
                {
                    this.m_HandCard[2].SetCardData(cbCardData,cbCardCount-1, bIsListen, cbCantOutCard, bHasOut);
                    this.m_HandCard[2].SetCurrentCard(CurCardData, bIsListen, cbCantOutCard, bHasOut);
                    return ;
                }
            }
            if((cbCardCount+1)%3==0)
            {
                this.m_HandCard[2].SetCardData(cbCardData,cbCardCount-1, bIsListen, cbCantOutCard, bHasOut);
                this.m_HandCard[2].SetCurrentCard(cbCardData[cbCardCount-1], bIsListen, cbCantOutCard, bHasOut);
            }
            else
            {
                this.m_HandCard[2].SetCardData(cbCardData,cbCardCount, bIsListen, cbCantOutCard, bHasOut);
            }
    
        }
    },
    SetSelfLockCardIndex:function(cbCardIndex, cbLockCardIndex, CurCardData, bIsListen)
    {
        //转换扑克
        var cbCardData = new Array();
        var cbCardCount=GameDef.g_GameLogic.SwitchToCardData2(cbCardIndex,cbCardData);

        var cbLockCardData = new Array();
        var cbLockCardCount=GameDef.g_GameLogic.SwitchToCardData2(cbLockCardIndex,cbLockCardData);

        if(CurCardData != null && CurCardData != 0 ){
            var cbRemoveCard = new Array();
            cbRemoveCard[0] = CurCardData;
            if(GameDef.g_GameLogic.RemoveCard4(cbCardData,cbCardCount,cbRemoveCard,1)){

                this.m_HandCard[2].SetLockCardData(cbCardData,cbCardCount, cbLockCardData, cbLockCardCount, bIsListen, true);
                this.m_HandCard[2].SetCurrentCard(CurCardData, bIsListen);
                return ;
            }
        }
        if((cbCardCount+1)%3==0){
            //这里有问题 扣的牌会放到出牌位
            this.m_HandCard[2].SetLockCardData(cbCardData,cbCardCount, cbLockCardData, cbLockCardCount, bIsListen, true);
            this.m_HandCard[2].SetCurrentCard(cbCardData[cbCardCount-1], bIsListen);
        }else{
            this.m_HandCard[2].SetLockCardData(cbCardData,cbCardCount, cbLockCardData, cbLockCardCount, bIsListen);
        }

    },
    SetCurrentCard:function(viewID,cbCurrentCard, bIsListen){
        if (this.m_ShowUserAction[viewID] == false ) return ;
        this.m_HandCard[viewID].SetCurrentCard(cbCurrentCard, bIsListen);
    },
    SetCurrentCard2:function(viewID,cbCurrentCard, bIsListen, cbCantOutCard){
        if (this.m_ShowUserAction[viewID] == false ) return ;
        this.m_HandCard[viewID].SetCurrentCard2(cbCurrentCard, bIsListen, cbCantOutCard);
    },
    GetHandCurrentCard:function(viewID){
        if (this.m_ShowUserAction[viewID] == false ) return ;
        return this.m_HandCard[viewID].m_CurrentCardData;
    },

    //是否可以弹起
    SetPositively:function(bPositively){
        this.m_HandCard[2].SetPositively(bPositively);
    },
    //
    GetPositively:function(){
        return this.m_HandCard[GameDef.MYSELF_VIEW_ID].GetPositively();
    },
    GetShootCard:function(){
        return this.m_HandCard[GameDef.MYSELF_VIEW_ID].GetShootCard();
    },
    //出牌提示
    SetDiscardTip(viewID){
        this.m_DiscardCard.ShowArrow(viewID);
    },

    SetCurrentUser:function(wCurrentUser){
        this.m_wCurrentUser=wCurrentUser;
        for (var i = 0; i < this.m_HandCard.length; i++) {
            this.m_HandCard[i].SetPositively(false);
        }
        if( wCurrentUser == GameDef.g_GameEngine.GetMeChairID()){
            this.m_HandCard[2].SetPositively(true);
        }

        this.m_CenterViewCtrl.setCurrectUser(wCurrentUser);
        if( wCurrentUser != INVALD_CHAIR ){
            var viewId = GameDef.g_GameEngine.SwitchViewChairID(wCurrentUser);
            GameDef.g_GameEngine.m_GameClientView.SetCurrentAction(viewId);
        }
    },
    SetControlInfo:function(bShow,WeaveInfo,cbCount){
        if((GameDef.KIND_ID == 62007)){
            if(!this.m_OperateCtrl){
                if(GameDef.OPERATE_CTRL) {
                    this.ShowPrefabDLG(GameDef.OPERATE_CTRL,this.node,function(js){
                        this.m_OperateCtrl = js;
                        if(this.m_TbShow){
                            //显示控制牌组
                            if(this.m_OperateCtrl){
                                this.m_OperateCtrl.node.active = true;
                                this.m_OperateCtrl.SetWeaveInfo(this.m_TWeaveInfo,this.m_TcbCount);
                            }
                        }else{
                            if(this.m_OperateCtrl){
                                this.m_OperateCtrl.node.active = false;
                            }
                        }
                    }.bind(this));
                } else {
                    var OperateNode = cc.instantiate(this.m_OperateNode);
                    this.node.addChild(OperateNode);
                    OperateNode.active = false;
                    this.m_OperateCtrl = OperateNode.getComponent('OperateCtrl');
                }
            }
            this.m_TbShow = bShow;
            this.m_TWeaveInfo = WeaveInfo;
            this.m_TcbCount = cbCount;
        }
        else{
            if(!this.m_OperateCtrl){
                var OperateNode = cc.instantiate(this.m_OperateNode);
                this.node.addChild(OperateNode);
                OperateNode.active = false;
                this.m_OperateCtrl = OperateNode.getComponent('OperateCtrl');
            }
        }

        if(bShow){
            //显示控制牌组
            this.m_OperateCtrl.node.active = true;
            this.m_OperateCtrl.SetWeaveInfo(WeaveInfo,cbCount);
        }else{
            this.m_OperateCtrl.node.active = false;
        }

        return;
    },
    SetCardItemState:function(viewID,state){
        if (this.m_ShowUserAction[viewID] == false ) return ;
        this.m_HandCard[viewID].SetCardItemState(state);
    },
    SetMakeMagicIndex:function(magic){
        this.m_cbMakeMagicIndex = magic;
    },
    SetMagicIndex:function(magic){
        this.m_cbMagicIndex = magic;
        for (var i = 0; i < 4; i++) {
            this.m_HandCard[i].SetMagicIndex(magic);
        }
    },

    ChangeCardBack:function(node,index){
        var children = node.children;
        for (var i = 0; i < children.length; ++i) {
            this.FindCardItem(children[i],index);
        }
    },
    FindCardItem:function(node,index){
        var cardNode = node.getComponent(cc.Sprite);
        if( cardNode != null){
            for (var i = 0; i < this.m_CardBackName.length; i++) {
                if( cardNode.node.name == this.m_CardBackName[i]){
                    cardNode.spriteFrame = this.m_Atlas.getSpriteFrame(this.m_CardBackName[i]+index);
                    break;
                }
            }
        }
        var children = node.children;
        for (var i = 0; i < children.length; ++i) {
            this.FindCardItem(children[i],index);
        }
    },
    ShowTingData:function(pData, bListen){
        this.m_TingTipData=pData;
        this.m_HandCard[2].ShowTingData(pData, bListen);
    },
    ShowTingTip:function(cbOutData){
        if(GameDef.g_GameEngine.m_SelectHuKou){
            this.m_TingTip.SetSelectTingTip(cbOutData,this.m_TingTipData);
        }else{
            this.m_TingTip.SetTingTip(cbOutData,this.m_TingTipData);
        }
    }, 
    ShowCheckTing:function(TingData)
    {
        this.m_TingTip.ShowTingTip(TingData);
    },
    HideTingCtrl:function()
    {
        this.m_TingTip.HideView();
        this.ShowTingData();
    },
    CleanHuCard:function()
    {
        for(var i = 0; i < 4; i++)
        {
            this.m_HuCardData[i] = new Array();
            this.m_HuCardItem[i] = new Array();
            this.m_HuCard[i].removeAllChildren();
            if(this.m_HuCardBG[i]) this.m_HuCardBG[i].active = false;
        }
    },
    AddHuCard:function(viewID, CardData, bZiMo, wProViewID)
    {
        if(viewID >= GameDef.GAME_PLAYER || CardData <= 0) return;
        if(this.m_HuCardBG[viewID]) this.m_HuCardBG[viewID].active = true;
        this.m_HuCardData[viewID].push(CardData);

        // for(var i = 0; i < this.m_HuCardItem[viewID].length; i++)
        // {
        //     if(this.m_HuCardItem[viewID][i].GetCardData() == CardData)
        //     {
        //         this.m_HuCardItem[viewID][i].SetNumber(1);
        //         return;
        //     }
        // }
        var index = this.m_HuCardItem[viewID].length;
        var card = cc.instantiate(this.m_CardPrefab[viewID]);
        var posX = 0;
        var posY = 0;
        if(viewID == GameDef.HAND_TOP)
        {
            card.setScale(0.9);
            posX = index * card.width * -0.9;
        }
        else if(viewID == GameDef.HAND_LEFT)
        {
            posY = index * card.height*-1;
        }
        else if(viewID == GameDef.HAND_BOTTOM)
        {
            card.setScale(0.55);
            posX = index * card.width * 0.55;
        }
        else if(viewID == GameDef.HAND_RIGHT)
        {
            posY = index * card.height;
            card.zIndex = 9-index;
        }

        card.setPosition(posX,posY);
        this.m_HuCard[viewID].addChild(card);

        card = card.getComponent('CardItem');
        this.m_HuCardItem[viewID].push(card);
        card.SetCardData(CardData);
        if(wProViewID != INVALID_CHAIR)
        {
            card.SetProvide(wProViewID);
        }
        if(bZiMo && GameDef.g_GameEngine.m_ReplayMode == false)
        {
            card.SetState(GameDef.HAND_STATE_SHOW_BACK);
        }
        else
        {
            card.SetState(GameDef.HAND_STATE_SHOW);
        }
        card.SetShadowShow(false);

        this.ChangeCardBack(this.m_HuCard[viewID], 0);
    },
});
