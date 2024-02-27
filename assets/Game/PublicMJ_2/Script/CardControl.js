cc.Class({
    extends: cc.Component,

    properties: {
        m_CardParent: cc.Node,
        m_Atlas:cc.SpriteAtlas,
        m_CardItem:cc.Prefab,
        m_HandState:cc.Integer,
        m_CurrentCard:cc.Node,

        /*
                上:0
            左:1    右:3
                下:2
         */
    },

    // use this for initialization
    onLoad: function () {
        this.m_HandState = parseInt(this.m_HandState);

        for(var i = 0; i < GameDef.CARD_COUNT; ++ i){
            var pNode = cc.instantiate(this.m_CardItem);
            if(this.m_CardWidth == 0){
                this.m_CardWidth = pNode.width;
                this.m_CardHeight = pNode.height;
            }
            if( this.m_HandState == GameDef.HAND_TOP){
                pNode.x=(this.m_CardWidth*i);
                pNode.zIndex = GameDef.CARD_COUNT - i;
            }else if( this.m_HandState == GameDef.HAND_LEFT){
                pNode.y=(i*this.m_CardHeight);
                pNode.zIndex = GameDef.CARD_COUNT-i;
            }else if( this.m_HandState == GameDef.HAND_BOTTOM){
                pNode.x=(this.m_CardWidth*i*-1);
                pNode.zIndex = i;
            }else if( this.m_HandState == GameDef.HAND_RIGHT){
                pNode.y=(i*this.m_CardHeight*-1);
            }
            var index = i;
            if( this.m_HandState == GameDef.HAND_BOTTOM){
                index = GameDef.CARD_COUNT-i-1;
            }
            this.m_CardParent.addChild(pNode);

            this.m_CardItemArray[index] = pNode.getComponent('CardItem');
            this.m_CardItemArray[index].SetCardID(index);

            pNode.active = false;
            
        }

        var CurCard = cc.instantiate(this.m_CardItem);
        CurCard.active = false;
        this.m_CurrentCard.addChild(CurCard);
        this.m_CardItemArray[GameDef.CARD_COUNT] = CurCard.getComponent('CardItem');
        this.m_CardItemArray[GameDef.CARD_COUNT].SetCardID(GameDef.CARD_COUNT);

        this.m_HandCard = cc.instantiate(this.m_CardItem);
        this.node.addChild(this.m_HandCard);
        this.m_HandCard.setPosition(this.m_CurrentCard.getPosition());
        this.m_HandCard = this.m_HandCard.getComponent('CardItem');
        this.m_HandCard.node.active = false;

        var clickNode = this.node.getChildByName('Touch');
        if( clickNode != null ){
            // clickNode.setTouchEnabled(true);
            clickNode.on(cc.Node.EventType.TOUCH_START, function(event) {
				if(this.m_bCanTouch == false) return;
                this.m_MoveCard.SetState(GameDef.HAND_STATE_STAND);
                if(this.m_MoveIng && this.m_CurMove && this.m_SelectCard != null){
                    this.m_SelectCard.node.active = true;
                    this.m_MoveCard.node.active = false;
                }

                
                this.m_SelectCard = null;
                if( this.m_bPositively == false ){
                    return;
                }

                var location = event.touch.getLocation();
                var target = this.touchCardNode(location);

                if( target == null )return;
                if(target.GetCanOut() == false)
                {
                    return;
                }

                if( target.m_CardID != 13 && target.m_CardID >= this.m_wCardCount - 1) return;
                if( GameDef.g_GameEngine.m_HuiCardDate == target.GetCardData()) return;
    
                this.m_StarPos = location;
                this.m_MoveValue.x = 0;
                this.m_MoveValue.y = 0;
                this.m_bCurrentMoveCard = false;
                var moveCard = this.m_MoveCard;
                this.m_MoveCard.node.scale = 1;
                moveCard.node.active = true;
                if(GameDef.KIND_ID == 62007){
                  if(GameDef.g_GameEngine.GetIsLiang()){
                    moveCard.SetLiangCardData( target.GetCardData());
                    }
                    else{
                    moveCard.SetCardData( target.GetCardData());
                    }
                }
                else
                {
                    moveCard.SetCardData( target.GetCardData());
                }
    
                var offset = target.node.convertToNodeSpaceAR(location);
                var pos = moveCard.node.parent.convertToNodeSpaceAR(location);
                pos.x -= offset.x;
                pos.y -= offset.y;
                moveCard.node.setPosition(pos);
                // // target.node.active = false;
                this.m_SelectCard = target;
                moveCard.node.active = false;
                this.m_MoveIng = false;
                this.m_CurMove = false;
                // cc.log("开始 ");
    
    
            }.bind(this),this);
            clickNode.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
                if( this.m_bPositively == false || this.m_SelectCard == null )
                {
                    return;
                }
                this.m_MoveCard.SetState(GameDef.HAND_STATE_STAND);
                var moveCard = this.m_MoveCard;
                
                var location = event.touch.getLocation();
                var offset = event.touch.getDelta();
                var pos = moveCard.node.getPosition();

                pos.x += offset.x;
                pos.y += offset.y;
                moveCard.node.setPosition(pos);

                if( this.m_StarPos.y - location.y < -50){
                    this.m_MoveIng = true;
                    this.m_CurMove = true;
                    this.m_SelectCard.node.active = false;
                    this.m_MoveCard.node.active = true;
                }
                else{
                    this.m_SelectCard.node.active = true;
                    this.m_MoveCard.node.active = false;
                    this.m_MoveIng = false;
                }
                var cbCardData = moveCard.GetCardData();
                if( this.m_MoveIng )
                {
                    // console.log('移动:'+cbCardData+' CardID:'+this.m_SelectCard.m_CardID);
                    this.m_SelectCard.SetShoot(false,true);
                }

                this.ChangeSelectCardColor(cbCardData,true);
                moveCard.ChangeColor(false);
    
     
            }.bind(this),this);
            function moveEnd(event) {
                if( this.m_SelectCard == null ) return ;
                this.ChangeSelectCardColor(0,false);
                this.m_MoveCard.SetState(GameDef.HAND_STATE_STAND);
                if(this.m_bPositively &&  this.m_MoveIng && this.m_MoveCard.node.active == true ){
                    var pos = this.m_MoveCard.node.convertToWorldSpaceAR(cc.v2(0,0));
                    var cbCardData = this.m_MoveCard.GetCardData();
                    if( this.m_bPositively && GameDef.g_GameEngine.OnOutCard != null) {
                        this.m_OutCardIndex = this.m_SelectCard.m_CardID;
                        this.m_OutCardData = cbCardData;
                        
                        if( GameDef.g_GameEngine.m_HuiCardDate == cbCardData ){
                            GameDef.g_GameEngine.ShockHuiPai();
                        }else{
                            pos = this.m_SelectCard.node.parent.convertToNodeSpaceAR(pos);
                            this.m_SelectCard.node.setPosition(pos);
                            this.m_SelectCard.node.active = true;
                            GameDef.g_GameEngine.OnOutCard(this.m_HandState,this.m_MoveCard.m_CardID,cbCardData);
                        }
                    }
                }
                else if( !this.m_CurMove ){
                    var location = event.touch.getLocation();
                    var node = this.touchCardNode(location);
                    if( node != null ){
                        //console.log('this.ClickSubCard:'+node.m_CardID);
                        this.ClickSubCard(node, node.m_CardID);
                    }
                }

                this.m_MoveCard.node.active = false;
                this.m_MoveIng = false;
                this.m_SelectCard = null;
            }

            clickNode.on(cc.Node.EventType.TOUCH_END, moveEnd.bind(this), this);
            clickNode.on(cc.Node.EventType.TOUCH_CANCEL, moveEnd.bind(this), this);
        }
    },
    ctor:function(){
        this.m_TingData = null;
        this.m_CardItemArray = new Array();
        this.m_wCardCount = 0;
        this.m_bPositively = false;
        this.m_CurrentCardData = 0;

        //双击出牌后的记录
        this.m_OutCardIndex = 0;
        this.m_OutCardData = 0;
        this.m_cbCardData = new Array();
        this.m_CardStartIndex = 0;
        this.m_MoveCard = null;
        this.m_SelectCard = null;

        this.m_StarPos = {};
        this.m_bCurrentMoveCard = false;
        this.m_MoveValue={};
        this.m_CurMove = false;

        //是否单击就出牌
        this.m_isClickSendCard = false;
        this.m_CardWidth = 0;
        this.m_CardHeight = 0;
		this.m_bCanTouch = true;
    },
    SetClickSendCard:function(click){
        this.m_isClickSendCard = click;
    },

    ResetPos:function(offset){
        offset = offset==null?0:offset;
        for(var i = 0; i < GameDef.CARD_COUNT; ++ i){
            var index = i;
            if( this.m_HandState == GameDef.HAND_BOTTOM){
                index = GameDef.CARD_COUNT-i-1;
            }

            var pNode = this.m_CardItemArray[index].node;
            if( this.m_HandState == GameDef.HAND_TOP){
                pNode.x=(this.m_CardWidth*i);
                pNode.zIndex = GameDef.CARD_COUNT - i;
            }
            else if( this.m_HandState == GameDef.HAND_LEFT){
                pNode.y=(i*this.m_CardHeight);
                pNode.zIndex = GameDef.CARD_COUNT-i;
            }

            else if( this.m_HandState == GameDef.HAND_BOTTOM){
                pNode.x=(this.m_CardWidth*i*-1 + offset*this.m_CardWidth);
                pNode.zIndex = i;
            }
            else if( this.m_HandState == GameDef.HAND_RIGHT){
                pNode.y=(i*this.m_CardHeight*-1);
            }
        }
    },
    ResetView:function(){
        this.ResetPos();
        this.SetCardData(null,0);
		this.m_bCanTouch = true;
    },

    ClickSubCard:function(CardNode,CardID){
		if(this.m_bCanTouch == false) return;
        var cbCardData = CardNode.GetCardData();
        if( this.m_isClickSendCard && this.m_bPositively){

            if( GameDef.g_GameEngine.OnOutCard  != null){
                if(cbCardData == 0 ){
                    console.log("发送0");
                    return ;
                }
                if(this.m_CardItemArray[CardID].GetCanOut() == false)
                {
                    return;
                }
                this.m_OutCardIndex = CardNode.m_CardID;
                this.m_OutCardData = cbCardData;
                
                if( GameDef.g_GameEngine.m_HuiCardDate == cbCardData ){
                    GameDef.g_GameEngine.ShockHuiPai();
                }else{
                    GameDef.g_GameEngine.OnOutCard(this.m_HandState,CardNode.m_CardID,cbCardData);
                }
            }
            return;
        }
        // if(this.m_bPositively==false)return;
        for(var i in this.m_CardItemArray){
            if(i == CardNode.m_CardID){
                continue;
            }
            this.m_CardItemArray[i].SetShoot(false,true);
        }
        if(CardNode.GetShoot()==false){
            CardNode.SetShoot(true,true);
            if( cc.gSoundRes != null && cc.gSoundRes.PlaySound != null){
                cc.gSoundRes.PlayGameSound("TIPAI");
            }
            this.ChangeSelectCardColor(cbCardData,true);
            CardNode.ChangeColor(false);
        } else {
            this.ChangeSelectCardColor(0,false);
            if( this.m_bPositively && GameDef.g_GameEngine != null && GameDef.g_GameEngine.OnOutCard  != null){
                this.m_OutCardIndex = CardNode.m_CardID;
                this.m_OutCardData = cbCardData;
                
                if( GameDef.g_GameEngine.m_HuiCardDate == cbCardData ){
                    GameDef.g_GameEngine.ShockHuiPai();
                }else{
                    
                    //this.m_MoveCard.node.active = false;
                    this.m_SelectCard.node.active = false;
                    GameDef.g_GameEngine.OnOutCard(this.m_HandState,CardNode.m_CardID,cbCardData);
                }
            }else{
                CardNode.SetShoot(false,true);
            }
        }
    },
    DoubleClick:function(CardNode,CardID){
        //cc.log("双击:");
        return;
        if(this.m_bPositively==false)return;


        var cbCardData = this.m_CardItemArray[CardID].GetCardData();
        if( GameDef.g_GameEngine != null && GameDef.g_GameEngine.OnOutCard  != null){
            this.m_OutCardIndex = CardID;
            this.m_OutCardData = cbCardData;
            if( GameDef.g_GameEngine.m_HuiCardDate == cbCardData ){
                GameDef.g_GameEngine.ShockHuiPai();
            }else{
                GameDef.g_GameEngine.OnOutCard(this.m_HandState,CardID,cbCardData);
            }
        }
    },
    GetDoubleCardData:function(){
        return this.m_OutCardData;
    },
    GetDoubleCardIndex:function(){
        return this.m_OutCardIndex;
    },
    GetCardDataByIndex:function(index){
        return this.m_CardItemArray[index].GetCardData();
    },
    //设置扑克
	SetCurrentCard:function(cbCardData, bIsListen, bEnd){
        var isLookOnMode = GameDef.g_GameEngine.IsLookonMode();
        if(bEnd == true) isLookOnMode = false;

        this.m_CardItemArray[13].SetShow(cbCardData != null);
        cbCardData = cbCardData != null ?cbCardData:0;
        this.m_CardItemArray[13].SetCardData(cbCardData, isLookOnMode);
        this.m_CardItemArray[13].SetCanOut(true);
        if(bIsListen)
        {
            this.m_CardItemArray[13].SetTingTip(true);
        }

        this.m_CurrentCardData = cbCardData;

        if( cbCardData != 0 ){
            this.m_cbCardData[this.m_wCardCount++] = cbCardData;
        }
    },
    //设置扑克
	SetCurrentCard2:function(cbCardData, bIsListen, cbCantOutCard, ){
        this.m_CardItemArray[13].SetShow(cbCardData != null);
        cbCardData = cbCardData != null ?cbCardData:0;
        //this.m_CardItemArray[13].SetCardData(cbCardData);
        if(bIsListen)
        {
            //this.m_CardItemArray[13].SetTingTip(true);
            //this.m_CardItemArray[13].SetCanOut(true);
            //this.m_CardItemArray[13].SetTingTip(false);
            //this.m_CardItemArray[13].SetCanOut(false);
            for(var i in this.m_CardItemArray){
                if(!this.m_CardItemArray[i].GetCardData())continue;
               
                    var cbCardData = this.m_CardItemArray[i].GetCardData();

                    //亮倒后只能出上听牌
                    var bCanOut= false;
                    if(GameDef.g_GameEngine.m_bLiang[GameDef.g_GameEngine.GetMeChairID()]){
                        for(var k=0;k<34;++k)
                        {
                            if(GameDef.g_GameEngine.m_OutEndTingData[k] != 0)
                            {
                                if(GameDef.g_GameEngine.m_OutEndTingData[k] == cbCardData)
                                {
                                    bCanOut = true;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if(bCanOut)this.m_CardItemArray[i].SetLockTips(false);
                   
                   break;
                
            }
        }
        else
        {
            if( cbCantOutCard != null)
            {
                for(var i = 0; i < 18; i++)
                {
                    if(cbCantOutCard[i] == 0) break;
                    if(cbCantOutCard[i] == cbCardData)
                    {
                         //亮倒后只能出上听牌
                         var bCanOut= false;
                         if(GameDef.g_GameEngine.m_bLiang[GameDef.g_GameEngine.GetMeChairID()]){
                             for(var k=0;k<34;++k)
                             {
                                 if(GameDef.g_GameEngine.m_OutEndTingData[k] != 0)
                                 {
                                     if(GameDef.g_GameEngine.m_OutEndTingData[k] == cbCardData)
                                     {
                                         bCanOut = true;
                                         break;
                                     }
                                 }
                             }
                         }
                         if(bCanOut)continue;
                        this.m_CardItemArray[13].SetLockTips(true);
                        break;
                    }
                }
            }
        }

        // this.m_CurrentCardData = cbCardData;
        // if( cbCardData != 0 ){
        //     this.m_cbCardData[this.m_wCardCount++] = cbCardData;
        // }
    },
    SetLiangCurrentCard:function(cbCardData, bIsListen){
        this.m_CardItemArray[13].SetShow(cbCardData != null);
        cbCardData = cbCardData != null ?cbCardData:0;
        this.m_CardItemArray[13].SetLiangCardData(cbCardData);
        if(bIsListen)
        {
            this.m_CardItemArray[13].SetTingTip(true);
            this.m_CardItemArray[13].SetCanOut(true);
            // this.m_CardItemArray[13].SetTingTip(false);
            // this.m_CardItemArray[13].SetCanOut(false);
        }

        this.m_CurrentCardData = cbCardData;
        if( cbCardData != 0 ){
            this.m_cbCardData[this.m_wCardCount++] = cbCardData;
        }
    },
    GetCardNode:function(CardIndex){
        if( CardIndex < 0 || CardIndex > this.m_CardItemArray.length ){
            return null;
        }
        return this.m_CardItemArray[CardIndex];
    },
    //设置扑克
	SetCardData:function(cbCardData,wCardCount, bIsListen, bEnd){
        var isLookOnMode = GameDef.g_GameEngine.IsLookonMode();
        if(bEnd == true) isLookOnMode = false;
        this.m_wCardCount = wCardCount;
        if( cbCardData != null && wCardCount > 0 ){
            if( this.m_MagicData != null && this.m_MagicData > 0 ){
                for (var i = 0; i < wCardCount; i++) {
                    if(cbCardData[i] == this.m_MagicData){
                        cbCardData.splice(i,1);
                        cbCardData.splice(0,0,this.m_MagicData);
                    }
                }
            }
            for (var i = 0; i < this.m_CardItemArray.length; i++) {
                this.m_CardItemArray[i].SetCardData(0, isLookOnMode);
                this.m_CardItemArray[i].SetShow(false);
            }
            for(var i = 0;i<wCardCount ;i++)
            {
                this.m_CardItemArray[i].SetShow(true);
                this.m_cbCardData[i] = cbCardData[i];
                this.m_CardItemArray[i].SetCardData(cbCardData[i], isLookOnMode);
                if(bIsListen)
                {
                    this.m_CardItemArray[i].SetCanOut(false);
                    this.m_CardItemArray[i].SetTingTip(false);
                }
            }
            if(this.m_HandState == GameDef.HAND_BOTTOM && GameDef.CARD_COUNT >= wCardCount){
                var offset = GameDef.CARD_COUNT-wCardCount;
                this.ResetPos(offset);
            }
        }
        else{
            
            for(var i = 0;i < this.m_CardItemArray.length;i++ )
            {       
                this.m_cbCardData[i] = 0;
                this.m_CardItemArray[i].SetCardData(0, isLookOnMode);
                this.m_CardItemArray[i].SetShow(i<wCardCount);
            }
        }
        //this.ShowTingData(this.m_TingData);
    },
     //亮倒的牌
     SetLiangCardData:function(cbCardData, wCardCount, bIsListen){

        this.m_wCardCount = wCardCount;
        if( cbCardData != null && wCardCount > 0 )
        {
            //混放最前面
            if( this.m_MagicData != null && this.m_MagicData > 0 )
            {
                for (var i = 0; i < wCardCount; i++)
                {
                    if(cbCardData[i] == this.m_MagicData)
                    {
                        cbCardData.splice(i,1);
                        cbCardData.splice(0,0,this.m_MagicData);
                    }
                }
            }
            //清空牌
            for (var i = 0; i < this.m_CardItemArray.length; i++) 
            {
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(false);
                this.m_CardItemArray[i].SetCanOut(true);
                this.m_CardItemArray[i].SetTingTip(false);
            }
            //实际牌
            for(var i = 0;i<wCardCount ;i++)
            {
                this.m_CardItemArray[i].SetShow(true);
                this.m_cbCardData[i] = cbCardData[i];
                this.m_CardItemArray[i].SetLiangCardData(cbCardData[i]);
                if(bIsListen)
                {
                    this.m_CardItemArray[i].SetCanOut(false);
                    this.m_CardItemArray[i].SetTingTip(false);
                }
            }
            //位置
            if(this.m_HandState == GameDef.HAND_BOTTOM && GameDef.CARD_COUNT >= wCardCount)
            {
                var offset = GameDef.CARD_COUNT-wCardCount;
                this.ResetPos(offset);
            }
        }
        else{
            
            for(var i = 0;i < this.m_CardItemArray.length;i++ )
            {       
                this.m_cbCardData[i] = 0;
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(i<wCardCount);
            }
        }
        //this.ShowTingData(this.m_TingData);
    },
    //自己亮倒的牌
    SetSelfLiangCardData:function(cbCardData, cbLiangCard, wCardCount, wLiangCount, bIsListen){

        this.m_wCardCount = wCardCount;
        if( cbCardData != null && wCardCount > 0 )
        {
            //亮的牌放最后面
            var nCardIndex = wCardCount-1;
            for(var i = wLiangCount-1; i >= 0; i--)
            {
                for(var j = nCardIndex; j >= 0; j--)
                {
                    if(cbCardData[j] == cbLiangCard[i])
                    {
                        cbCardData.splice(j,1);
                        cbCardData.splice(nCardIndex,0,cbLiangCard[i]);
                        nCardIndex--;
                        break;
                    }
                }
            }
            //亮的牌放最前面
            // var nLiangIndex = 0;
            // for(var i = 0; i < wLiangCount; i++)
            // {
            //     for(var j = nLiangIndex; j < wCardCount; j++)
            //     {
            //         if(cbCardData[j] == cbLiangCard[i])
            //         {
            //             cbCardData.splice(j,1);
            //             cbCardData.splice(nLiangIndex,0,cbLiangCard[i]);
            //             nLiangIndex++;
            //             break;
            //         }
            //     }
            // }

            //清空牌
            for (var i = 0; i < this.m_CardItemArray.length; i++) 
            {
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(false);
                this.m_CardItemArray[i].SetCanOut(true);
                this.m_CardItemArray[i].SetTingTip(false);
                this.m_CardItemArray[i].SetTingMask(false);
                this.m_CardItemArray[i].SetLockTips(false);
                
            }
            //实际牌
            for(var i = 0;i<wCardCount ;i++)
            {
                this.m_CardItemArray[i].SetShow(true);
                this.m_cbCardData[i] = cbCardData[i];
                if(wCardCount - wLiangCount > i)
                {
                    this.m_CardItemArray[i].SetCardData(cbCardData[i]);
                }
                else
                {
                    this.m_CardItemArray[i].SetLiangCardData(cbCardData[i]);
                }
                if(bIsListen)
                {
                    this.m_CardItemArray[i].SetCanOut(false);
                    this.m_CardItemArray[i].SetTingTip(false);
                }
            }
            //位置
            if(this.m_HandState == GameDef.HAND_BOTTOM && GameDef.CARD_COUNT >= wCardCount)
            {
                var offset = GameDef.CARD_COUNT-wCardCount;
                this.ResetPos(offset);
            }
        }
        else{
            
            for(var i = 0;i < this.m_CardItemArray.length;i++ )
            {       
                this.m_cbCardData[i] = 0;
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(i<wCardCount);
            }
        }
        //this.ShowTingData(this.m_TingData);
    },
    SetCardItemState:function(state){
        for (var i = 0; i < this.m_CardItemArray.length; i++) {
            this.m_CardItemArray[i].SetState(state);
            
        }
    },
    ChangeSelectCardColor:function(cbCardData,bSelect){
        for (var i = 0; i < GameDef.m_AllCardItem.length; i++) {
            GameDef.m_AllCardItem[i].ChangeColor(false);

            if( GameDef.m_AllCardItem[i].GetCardData() == cbCardData && bSelect)
            GameDef.m_AllCardItem[i].ChangeColor(true);
            
        }
        this.m_Hook.ShowTingTip(cbCardData);
    },
    GetCardCount:function(){
        return this.m_wCardCount;
    },
    //获取扑克
    GetCurrentCard:function(){
         return this.m_CardItemArray[13].cbCardData; 
    },
    SetPositively:function(bPositively){
        this.m_bPositively = bPositively;
    },
    GetPositively:function(){
        return this.m_bPositively;
    },
    GetShootCard: function () {
        for (let idx in this.m_CardItemArray) {
            if (!this.m_CardItemArray[idx].node.active) continue;
            if (!this.m_CardItemArray[idx].GetCanOut()) continue;
            if (!this.m_CardItemArray[idx].GetShoot()) continue;
            return this.m_CardItemArray[idx].GetCardData();
        }
        return 0;
    },
    //移动一张牌的动画
    PlayMoveCard:function(MoveIndex,CardData,CardCount){
        if (this.m_HandState != GameDef.HAND_BOTTOM) return true;

        this.m_CardItemArray[MoveIndex].SetShow(false);
        //出的牌是手牌,手牌不需要移动到牌堆里
        if( MoveIndex == GameDef.CARD_COUNT) return true;

        //查找手牌移入空位
        var HandCardData = this.m_CardItemArray[13].GetCardData();
        var moveStar = 0;
        for (var i = 0; i < GameDef.CARD_COUNT; i++) {
            if(HandCardData == CardData[i]){
                moveStar = i+this.m_CardStartIndex;
                break;
            }
        }
        //移动牌补空
        var dir = 1;
        if( MoveIndex < moveStar ){
            var tmp = moveStar;
            moveStar = MoveIndex ;
            MoveIndex = tmp+1;
            dir *= -1;
        }
        for (var i = moveStar; i < MoveIndex; i++) {
            var pos = this.m_CardItemArray[i].node.getPosition();
            pos.x += this.m_CardItemArray[i].node.width * dir;
            this.m_CardItemArray[i].node.runAction(cc.moveTo(0.2,pos),);
        }

        //手牌移入牌堆
        this.m_CardItemArray[13].SetShow(false);
        this.m_HandCard.node.active = true;
        this.m_HandCard.node.setPosition(this.m_CurrentCard.getPosition());
        this.m_HandCard.SetCardData(this.m_CardItemArray[13].GetCardData());
        var movePos = this.m_CardItemArray[moveStar].node.convertToWorldSpaceAR(cc.v2(0, 0));
        movePos = this.node.convertToNodeSpaceAR(movePos);

        var sqlHand = cc.sequence(cc.moveTo(0.2, cc.v2(movePos)),cc.callFunc(function(){
            this.ResetPos();
            if( CardData != null && CardCount > 0)
                this.SetCardData(CardData,CardCount);
            this.m_HandCard.node.active = false;
        },this));
        this.m_HandCard.node.runAction(sqlHand);

    },
    SetMagicIndex:function(magic){
        this.m_cbMagicIndex = magic;
        this.m_MagicData = GameDef.g_GameLogic.SwitchToCardData(magic);
    },

    touchCardNode:function(location){
        for (var i = 0; i < this.m_CardItemArray.length; i++) {
            if(this.m_CardItemArray[i].GetCardData() == 0)continue;

            var boxCollider = this.m_CardItemArray[i].node.getComponent(cc.BoxCollider);
            boxCollider.world.points[0].y += 70;
            boxCollider.world.points[3].y += 70;
            if (cc.Intersection.pointInPolygon(location, boxCollider.world.points)) {
                return this.m_CardItemArray[i];
            }
        }
        return null;
    },
    
    ShowTingData:function(pData, bListen){
        for(var i in this.m_CardItemArray)
        {
            this.m_CardItemArray[i].SetTingTip(false);
            if(bListen)
            {
                this.m_CardItemArray[i].SetCanOut(false);
            }
            else
            {
                this.m_CardItemArray[i].SetCanOut(true);
            }
        }
        this.m_TingData = pData;
        if( pData != null ){
            for(var i in this.m_CardItemArray)
            {
                for (var j = 0; j < pData.length; j++) {
                    if(pData[j].cbOutCardData == this.m_CardItemArray[i].GetCardData() && this.m_CardItemArray[i].node.active )
                    {
                        this.m_CardItemArray[i].SetTingTip(true);
                        this.m_CardItemArray[i].SetCanOut(true);
                    }
                }
            }
        }
    },

    SetHook:function(hook){
        this.m_Hook = hook;
    },
	SetCanTouch:function(bCanTouch)
    {
        this.m_bCanTouch = bCanTouch;
    },
    GetCanTouch: function () {
        return this.m_bCanTouch;
    },
	SetOutCard:function(cbOutCardData, OutCardIndex)
    {
        this.m_OutCardData = cbOutCardData;
        if(OutCardIndex != null)
        {
            this.m_OutCardIndex = OutCardIndex;
        }
        else
        {
            for(var i in this.m_CardItemArray)
            {
                if(cbOutCardData == this.m_CardItemArray[i].GetCardData() && this.m_CardItemArray[i].node.active )
                {
                    this.m_OutCardIndex = i;
                    break;
                }
            }
        }
    },
    //锁定牌
    SetLockCardData:function(cbCardData, wCardCount, cbLockCardData, wLockCount, bIsListen, bHasCurr)
    {
        this.m_wCardCount = wCardCount;
        if(bHasCurr)
        {
            this.m_wCardCount = wCardCount - 1;
        }

        if( cbCardData != null && this.m_wCardCount > 0 )
        {

            //锁定的牌放在最前面
            if(cbLockCardData != null && wLockCount > 0)
            {
                var nIndex = 0;
                for(var i = 0; i < wLockCount; i++)
                {
                    for(var j = nIndex; j < wCardCount; j++)
                    {
                        if(cbCardData[j] == cbLockCardData[i])
                        {
                            cbCardData.splice(j,1);
                            cbCardData.splice(nIndex,0,cbLockCardData[i]);
                            nIndex++;
                            break;
                        }
                    }
                }
            } 
            for (var i = 0; i < this.m_CardItemArray.length; i++)
            {
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(false);
                this.m_CardItemArray[i].SetLockTips(false);
            }
            for(var i = 0;i<this.m_wCardCount ;i++)
            {
                this.m_CardItemArray[i].SetShow(true);
                this.m_cbCardData[i] = cbCardData[i];
                this.m_CardItemArray[i].SetCardData(cbCardData[i]);
                this.m_CardItemArray[i].SetCanOut(true);
                if(i < wLockCount)
                {
                     //亮倒后只能出上听牌
                     var bCanOut= false;
                     var MeChair = GameDef.g_GameEngine.GetMeChairID();
                     if(GameDef.g_GameEngine.m_bLiang[MeChair]){
                         for(var k=0;k<34;++k)
                         {
                             if(GameDef.g_GameEngine.m_OutEndTingData[k] != 0)
                             {
                                 if(GameDef.g_GameEngine.m_OutEndTingData[k] == cbCardData[i])
                                 {
                                     bCanOut = true;
                                     break;
                                 }
                             }
                         }
                     }
                     if(bCanOut)continue;
                    this.m_CardItemArray[i].SetLockTips(true);
                }
                if(bIsListen)
                {
                    this.m_CardItemArray[i].SetCanOut(false);
                    this.m_CardItemArray[i].SetTingTip(false);
                }
            }
            if(this.m_HandState == GameDef.HAND_BOTTOM && GameDef.CARD_COUNT >= this.m_wCardCount){
                var offset = GameDef.CARD_COUNT-this.m_wCardCount;
                this.ResetPos(offset, wLockCount);
            }
        }
        else
        {
            
            for(var i = 0;i < this.m_CardItemArray.length;i++ )
            {
                this.m_cbCardData[i] = 0;
                this.m_CardItemArray[i].SetCardData(0);
                this.m_CardItemArray[i].SetShow(i<this.m_wCardCount);
                if(i >= this.m_wCardCount - wLockCount)
                {

                    this.m_CardItemArray[i].SetLockTips(true);
                }
            }
        }
        //this.ShowTingData(this.m_TingData);
    },

});
