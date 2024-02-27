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
        this.m_MaxCnt = 5;
        this.m_scale = 1;
        this.m_nXDistance = DEF_X_DISTANCE;
        this.m_AnchorMode = 0.5;
        this.m_CardNum = 0;
    },
   
    Init :function() {
        if(this.m_layoutCtrl == null){
            this.m_layoutCtrl = this.node.getComponent(cc.Layout);
            this.m_CardItemArray = new Array();
            for(var i=0;i<this.m_MaxCnt;i++) {
                this.m_CardItemArray[i] = new tagCardItem();
            } 
        }
    },
 
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },

    SetCardData:function (cbCardData, cbCardCount){
        this.Init();
        //效验参数
        if (cbCardCount > this.m_MaxCnt ) return false;
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab');
                // this.m_CardItemArray[i].card.m_bValueHide = true;
                this.node.addChild(this.m_CardItemArray[i].card.node);
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
        this.m_layoutCtrl.spacingX = this.m_nXDistance - CARD_WIGTH;//*this.m_scale
        this.node.anchorX = this.m_AnchorMode;
        for (var i=0; i < this.m_MaxCnt; i++){
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
});
