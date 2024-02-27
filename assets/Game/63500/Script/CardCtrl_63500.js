//属性定义
var MAX_CARD_COUNT		    =		5;						//扑克数目

//间距定义
var DEF_X_DISTANCE		    =		50;						//默认间距

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
        //间隔变量
        this.m_TouchBeginIndex = -1;
        this.m_TouchEndIndex = -1;

        this.m_bSelect = new Array();//null
        this.m_IsBanker = false;
        //扑克数据
        this.m_cbCardCount = 0;						        //扑克数目

        this.m_scale = 1;
        this.m_AnchorMode = 0.5;

        this.m_cbCardData = new Array();

    },
    onLoad: function() {
        this.m_layoutCtrl = this.node.getComponent(cc.Layout);
        this.m_CardItemArray = new Array();
	    for(var i=0;i<MAX_CARD_COUNT;i++) {
            this.m_CardItemArray[i] = new tagCardItem();
        }
    },

    start :function() {
        // this.m_layoutCtrl = this.node.getComponent(cc.Layout);
        // this.m_CardItemArray = new Array();
	    // for(var i=0;i<MAX_CARD_COUNT;i++) {
        //     this.m_CardItemArray[i] = new tagCardItem();
        // }
    },
    SetGameEngine :function(p){
        this.m_GameClientEngine = p;
        this.setTouchOn();
    },
    setTouchOn :function(){
        
    },
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },
    SetBanker :function(bBanker){
        this.m_IsBanker = bBanker;
        this.DrawCard();
    },
    SetCardData:function (cbCardData, cbCardCount, bPublic){
        //效验参数
        if (cbCardCount > MAX_CARD_COUNT) return false;
        //扑克数目
        this.m_cbCardCount = cbCardCount;
        this.m_cbCardData = new Array();

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_cbCardData[i] = cbCardData[i];
            this.m_CardItemArray[i].bShoot = false;

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_'+GameDef.KIND_ID);
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;
            this.m_CardItemArray[i].card.SetData(this.m_cbCardData[i]);
        }

        this.DrawCard();
        return true;
    },

    SendCard: function(cbCardData) {
        this.m_cbCardData[this.m_cbCardCount] = cbCardData;
        this.m_cbCardCount += 1;
        this.SetCardData(this.m_cbCardData, this.m_cbCardCount);
    },

    AddCard: function(cbCardData, bPublic) {
        this.m_cbCardData[this.m_cbCardCount] = cbCardData;
        this.m_cbCardCount += 1;
        this.SetCardData(this.m_cbCardData, this.m_cbCardCount, bPublic);
    },

    //设置扑克
    SetShootCard:function ( cbCardData,  cbCardCount){
        //收起扑克
        for (var i=0;i<this.m_cbCardCount;i++) {
            this.m_CardItemArray[i].bShoot=false;
        }

        //弹起扑克
        for (var i = 0; i < this.m_cbCardCount; i++){
            for (var j=0;j<cbCardCount;j++){
                if(this.m_CardItemArray[i].card.GetData() == cbCardData[j]){
                    this.m_CardItemArray[i].bShoot = true;
                }
            }
        }

        this.DrawCard();
    },

    //获取扑克
    GetShootCard:function ( cbCardData, cbBufferCount){
        //变量定义
        var cbShootCount=0;

        //拷贝扑克
        for (var i=0;i<this.m_cbCardCount;i++) {
            //效验参数
            if (cbBufferCount<=cbShootCount) break;

            //拷贝扑克
            if (this.m_CardItemArray[i].bShoot==true) cbCardData[cbShootCount++]=this.m_CardItemArray[i].card.GetData();
        }

        return cbShootCount;
    },

    //绘画扑克
    DrawCard:function () {
        this.$('@Layout').spacingX = this.m_nXDistance;
        for (var i=0; i < MAX_CARD_COUNT; i++){
            if(i < this.m_cbCardCount){
                var cardData = this.m_CardItemArray[i].card.GetData();
                this.m_CardItemArray[i].card.SetData(cardData);
                this.m_CardItemArray[i].card.SetCardShoot(this.m_CardItemArray[i].bShoot);
                this.m_CardItemArray[i].card.SetBanker( this.m_IsBanker );
                this.m_CardItemArray[i].card.SetSelect( this.m_bSelect[i] );
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
        this.m_nXDistance = nXDistance;
    },

    SetGiveUp:function (){
        for (var i=0; i < 2; i++)
        {
            if(i < this.m_cbCardCount)
            {
                this.m_CardItemArray[i].card.SetGiveUp();
            }
        }

    },



});