//间距定义
var DEF_X_DISTANCE		    =		64;						//默认间距

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
        m_cardPre:cc.Prefab
    },

    ctor :function () {
        //扑克数据
        this.m_cbCardCount = 0;						        //扑克数目

        this.m_scale = 1;
        this.m_nXDistance = DEF_X_DISTANCE;
        this.m_AnchorMode = 0.5;
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
        this.setTouchOn();
    },
    setTouchOn :function(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded,this);
    },
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },
    setBanker :function(bBanker){
        this.m_IsBanker = bBanker;
        this.DrawCard();
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

    SetCardData:function (cbCardData, cbCardCount){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
      
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;       
  
            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_10020');
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;
            this.m_CardItemArray[i].card.SetData(cbCardData[i]);
        }

        this.DrawCard();
        return true;
    },

    //绘画扑克
    DrawCard:function () {
        let bShowTag = (this.m_GameClientEngine && GameDef.IsShowCardTag(this.m_GameClientEngine.m_dwRulesArr));
        this.m_layoutCtrl.spacingX = this.m_nXDistance - CARD_WIGTH;//*this.m_scale
        this.node.anchorX = this.m_AnchorMode;
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(i < this.m_cbCardCount){
                var cardData = this.m_CardItemArray[i].card.GetData();
                this.m_CardItemArray[i].card.SetData(cardData, bShowTag);
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

    //扑克数目
	GetCardCount:function () { return this.m_cbCardCount; },

    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos, Mode){
        this.node.setPosition(nXPos,nYPos);
        this.m_AnchorMode = 0.5*(Mode - 1)
    },
    //基准位置
    SetScale:function (scale){
        this.m_scale = scale;
        this.node.scale = scale;
    },

    //设置距离
    SetCardDistance:function (nXDistance) {
        this.m_nXDistance = CARD_WIGTH + nXDistance;
    },

    SetGiveUp:function () {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(this.m_CardItemArray[i].card)this.m_CardItemArray[i].card.SetGiveUp();
        }
    },
    SetLose:function () {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(this.m_CardItemArray[i].card)this.m_CardItemArray[i].card.SetLose();
        }
    },
});