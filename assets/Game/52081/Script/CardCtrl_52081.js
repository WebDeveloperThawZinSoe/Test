//间距定义
var DEF_X_DISTANCE		    =		0;						//默认间距 

//扑克结构
var tagCardItem = cc.Class({
    ctor :function () {
        this.bShoot = false;		//弹起标志 setCardShoot
        this.card = null;			//扑克数据
    }
});

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_cardPre:cc.Prefab,
        m_cardMax:cc.Node,
        m_cardMin:cc.Node,
        m_cardNode:cc.Node

    },

    ctor :function () {
        //扑克数据
        this.m_cbCardCount = 0;						        //扑克数目
        this.m_dwCustomRule = 0;
        this.m_scale = 1;
        this.m_nXDistance = DEF_X_DISTANCE;
        this.m_AnchorMode = 0.5;
        this.m_bClick = false;
    },
   
    start :function() {
        this.m_layoutCtrl = this.node.getComponent(cc.Layout);
        this.m_CardItemArray = new Array();
	    for(var i=0;i<GameDef.MAX_COUNT;i++) {
            this.m_CardItemArray[i] = new tagCardItem();
        } 
        

    },
    SetGameEngine :function(p){
        this.m_GameClientEngine = p;
        this.m_dwCustomRule = p.m_dwRules;

        console.log("---------m_GameClientEngine");
        // this.setTouchOn();
    },
    setTouchOn :function(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded,this);
    },
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },
    SetBanker :function(bBanker){
        this.m_IsBanker = bBanker;
        this.DrawCard();
    },
    SetBClick:function(bCn){
        this.m_bClick = bCn;
    },
     //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();
       
        return  true;
    },

    onTouchEnded :function(event) {
        this.DrawCard();
        if (this.m_GameClientEngine)this.m_GameClientEngine.OnLeftHitCard();
    },

    SetCardData:function (cbCardData, cbCardCount,bshow){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
        
        //扑克数目
        this.m_cbCardCount = cbCardCount;
        this.m_cardMax.active = false;
        this.m_cardMin.active = false;
        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;       
            
            
            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_'+GameDef.KIND_ID);
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.node.addChild(this.m_CardItemArray[i].card.node);
                this.m_CardItemArray[i].card.node.getComponent(cc.Button).interactable = this.m_bClick;
            }
            this.m_CardItemArray[i].card.node.active = true;
            //if(cbCardData[i] == null) cbCardData[i] = 0;
            if(i>1)
            {
                this.m_CardItemArray[i].card.SetData(bshow?cbCardData[i]:0);
                this.m_CardItemArray[i].card.SetCardShoot(false);
            }
            else
            {
                this.m_CardItemArray[i].card.SetData(cbCardData[i]);
                this.m_CardItemArray[i].card.SetCardShoot(false);
            }
            
            
        }

        this.DrawCard();
        return true;
    },


    SetMaxCardDate:function(cbCardData, cbCardCount){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
            
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        this.m_cardMax.active = true;
        this.m_cardMin.active = true;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;       

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_'+GameDef.KIND_ID);
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.m_cardMax.addChild(this.m_CardItemArray[i].card.node);
                this.m_CardItemArray[i].card.node.getComponent(cc.Button).interactable = this.m_bClick;
            }
            this.m_CardItemArray[i].card.node.active = true;
            //if(cbCardData[i] == null) cbCardData[i] = 0;
        
            this.m_CardItemArray[i].card.SetData(cbCardData[i]);

        }

        this.DrawCard();
        return true;
    },

    SetMinCardDate:function(cbCardData, cbCardCount,isShow){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
        if(!isShow) {
            this.m_cardMin.active = false;                                    
            return true;
        }
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        this.m_cardMin.active = true;                                    
        this.m_cardMax.active = true;

        //设置扑克
        for (var i = 2; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;       

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_'+GameDef.KIND_ID);
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.m_cardMin.addChild(this.m_CardItemArray[i].card.node);
                this.m_CardItemArray[i].card.node.getComponent(cc.Button).interactable = this.m_bClick;
            }
            this.m_CardItemArray[i].card.node.active = true;
            //if(cbCardData[i] == null) cbCardData[i] = 0;
            this.m_CardItemArray[i].card.SetData(cbCardData[i]);
        }

        this.DrawCard();
        return true;
    },

    //绘画扑克
    DrawCard:function () {
        if(this.m_layoutCtrl==null) this.start();
        this.m_layoutCtrl.spacingX = this.m_nXDistance;//*this.m_scale
        this.node.anchorX = this.m_AnchorMode;
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(i < this.m_cbCardCount){
                var cardData = this.m_CardItemArray[i].card.GetData();
                this.m_CardItemArray[i].card.SetData(cardData);
            }else{
                this.m_CardItemArray[i].bShoot = false; 
                if( this.m_CardItemArray[i].card != null )
                    this.m_CardItemArray[i].card.node.active = false;
            }
        }
    },

    //获取扑克
    GetCardData:function (cbCardData, cbBufferCount){
        //效验参数
        if (cbBufferCount<this.m_cbCardCount) return 0;

        //拷贝扑克
        for (var i=0;i<this.m_cbCardCount;i++){
            cbCardData[i]=this.m_CardItemArray[i].card.GetData();
        }

        return this.m_cbCardCount;
    },

    GetOpenCard:function(p){
        var inputIndex = 0;
        var openCard = new Array();
        this.m_dwCustomRule = p.m_dwRules;
        this.m_GameClientEngine = p;
        if(p.m_dwRules & GameDef.GAME_TYPE_BIG_CARD)
        {
            for (var i=0; i < GameDef.MAX_COUNT; i++){
                if(this.m_CardItemArray[i].card.GetShoot()){
                    var cardData = this.m_CardItemArray[i].card.GetData();
                    openCard[inputIndex++] = cardData;
                }
            }
        }else{
            for (var i=0; i < 2; i++){
                var cardData = this.m_CardItemArray[i].card.GetData();
                openCard[inputIndex++] = cardData;
            }
        }
        if(inputIndex!=2){
            this.m_GameClientEngine.ShowTips("牌型有误！")
            return null;
        }
        return openCard;
    },
    GetMinCard:function(){
        var inputIndex = 0;
        var openCard = new Array();
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(this.m_CardItemArray[i].card.GetShoot()==false){
                var cardData = this.m_CardItemArray[i].card.GetData();
                openCard[inputIndex++] = cardData;
            }
        }
        if(inputIndex!=2){
            return null;
        }
        return openCard;
    },
    //扑克数目
	GetCardCount:function () { return this.m_cbCardCount; },

    //大小牌位置
    SetEndCardPos:function(leftRight){
        // if(leftRight)
        //     this.node.getComponent(cc.Layout).horizontalDirection = 1;
        // else
        //     this.node.getComponent(cc.Layout).horizontalDirection = 0;

    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos, Mode){
        this.node.setPosition(nXPos,nYPos);
       // this.m_AnchorMode = 0.5*(Mode - 1)
    },
    //基准位置
    SetScale:function (scale){
        this.m_scale = scale;
        this.node.scale = scale;
    },

    //设置距离
    SetCardDistance:function (nXDistance) {
        this.m_nXDistance = nXDistance;
    },

    SetGiveUp:function (nXDistance) {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            this.m_CardItemArray[i].card.SetGiveUp();
        }
    },
    SetLose:function (nXDistance) {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            this.m_CardItemArray[i].card.SetLose();
        }
    },

    SetMaxCard:function(cbMaxCard){
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(this.m_CardItemArray[i].card == null) continue;
            this.m_CardItemArray[i].card.SetCardShoot(false);
        }
        for(var j = 0; j < 2;j++){
            for (var i=0; i < GameDef.MAX_COUNT; i++){
                if(this.m_CardItemArray[i].card == null) continue;
                if(this.m_CardItemArray[i].card.GetData()==cbMaxCard[j] && this.m_CardItemArray[i].card.GetShoot()==false){
                    this.m_CardItemArray[i].card.SetCardShoot(true);
                    break;
                }
            }
        }
        
    },

    GetCardValue(cbCardData) { 
        return cbCardData&0x0F; 
    },
    GetCardColor(cbCardData) { 
        return cbCardData&0xF0; 
    },
    GetGenre:function(cbCardData){
        if(cbCardData.length!=2) return 0;
        for (var i = 0; i < 2; i++)
        {
            if (this.m_dwCustomRule & GameDef.GAME_TYPE_BOOM && 3 == this.GetCardValue(cbCardData[i]) && 8 == this.GetCardValue(cbCardData[1 - i]))
                return 0x91;
            if (this.m_dwCustomRule & GameDef.GAME_TYPE_GHOST && 0x09 == cbCardData[i] && 11 == this.GetCardValue((cbCardData[1 - i])))
                return 0x90;
            if (this.m_dwCustomRule & GameDef.GAME_TYPE_GHOST && 0x19 == cbCardData[i] && 11 == this.GetCardValue((cbCardData[1 - i])))
                return 0x8F;
            if (3 == this.GetCardValue(cbCardData[i]) && 0x06 == (cbCardData[1 - i]))
                return 0x8E;
            if (this.m_dwCustomRule & GameDef.GAME_TYPE_KING && 12 == this.GetCardValue(cbCardData[i]) && 9 == this.GetCardValue((cbCardData[1 - i])))
                return 0x8D;
            if (this.m_dwCustomRule & GameDef.GAME_TYPE_LAND_MOM && 2 == this.GetCardValue(cbCardData[i]) && 9 == this.GetCardValue((cbCardData[1 - i])))
                return 0x8C;
            if (cbCardData[0] == cbCardData[1])
                return 0x84 + (this.GetCardColor(cbCardData[0]) >> 4);
            if (0x09 == cbCardData[i] && 0x19 == cbCardData[1 - i])
                return 0x85;
            if (0x08 == cbCardData[i] && 0x18 == cbCardData[1 - i])
                return 0x84;
            if (0x07 == cbCardData[i] && 0x17 == cbCardData[1 - i])
                return 0x83;
            if (0x05 == cbCardData[i] && 0x15 == cbCardData[1 - i])
                return 0x82;
            if (12 == this.GetCardValue(cbCardData[i]) && 8 == this.GetCardValue(cbCardData[1 - i]))
                return 0x81;
            if (2 == this.GetCardValue(cbCardData[i]) && 8 == this.GetCardValue(cbCardData[1 - i]))
                return 0x80;
        }
        
        var cbTemp = this.GetCardColor(cbCardData[0]) > this.GetCardColor(cbCardData[1])?this.GetCardColor(cbCardData[0]):this.GetCardColor(cbCardData[1]);
        if (cbTemp == 0x00) cbTemp = 0x10;
        if (((this.GetCardValue(cbCardData[0]) + this.GetCardValue(cbCardData[1])) % 10) == 0)
            return 0;
        return cbTemp + ((this.GetCardValue(cbCardData[0]) + this.GetCardValue(cbCardData[1])) % 10);
    },
    GetRankGenre:function(cbCardRank){
        if (cbCardRank >= 0x80)
		return 0xA0 + cbCardRank - 0x80;
	    return(this.GetCardColor(cbCardRank) >> 4) + (this.GetCardValue(cbCardRank) << 4);
    },
    showGuiZi:function(){
        this.$('Ani').active = true;
        var ani = this.$('Ani').getComponent(dragonBones.ArmatureDisplay);
        ani.armatureName = 'guizi';
        ani.playAnimation ('newAnimation',1);
        this.scheduleOnce(function(){
            this.$('Ani').active = false;


       }, 2);

    },
    showHuangShang:function(){
        this.$('Ani').active = true;

        var ani = this.$('Ani').getComponent(dragonBones.ArmatureDisplay);
        ani.armatureName = 'huangshang';
        ani.playAnimation ('newAnimation',1);
        this.scheduleOnce(function(){
            this.$('Ani').active = false;


       }, 2);

    },
    update:function(){
        if (this.m_GameClientEngine){
            if(this.m_GameClientEngine.m_cbOperatrStatus != 3){
                return;
            }

        }else{
            return;
        }
        var inputIndex = 0;
        var openCard = new Array();
        var rank = new Array();
        if(this.m_CardItemArray[0].card == null) return;
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(this.m_CardItemArray[i].card == null) continue;
            if(this.m_CardItemArray[i].card.GetShoot()){
                var cardData = this.m_CardItemArray[i].card.GetData();
                openCard[inputIndex++] = cardData;
            }
        }
        if(inputIndex==2){
            rank[0] = this.GetGenre(openCard);
            inputIndex = 0;
            openCard = new Array();
            for (var i=0; i < GameDef.MAX_COUNT; i++){
                if(this.m_CardItemArray[i].card == null) continue;
                if(this.m_CardItemArray[i].card.GetShoot()==false){
                    var cardData = this.m_CardItemArray[i].card.GetData();
                    openCard[inputIndex++] = cardData;
                }
            }
            rank[1] = this.GetGenre(openCard);
            if (this.m_GameClientEngine)this.m_GameClientEngine.m_GameClientView.ShowRank(GameDef.MYSELF_VIEW_ID,rank,0);
            if (this.m_GameClientEngine)this.m_GameClientEngine.m_GameClientView.ShowRank(GameDef.MYSELF_VIEW_ID,rank,1);

        }
        
    },
});
