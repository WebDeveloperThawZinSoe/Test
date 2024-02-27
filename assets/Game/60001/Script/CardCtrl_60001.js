//常量定义
var INVALID_ITEM		    =		0xFF;					//无效子项

//间距定义
var DEF_X_DISTANCE		    =		53;						//默认间距
var DEF_Y_DISTANCE		    =		18;						//默认间距



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
        this.m_bEnable = new Array();//灰色禁选
        this.m_IsBanker = false;
        //扑克数据
        this.m_cbCardCount = 0;						        //扑克数目

        this.m_scale = 1;
        this.m_nXDistance = DEF_X_DISTANCE;
        this.m_AnchorMode = 0.5;
        this.m_bInit = false;
    },

    start :function() {
        this.Init();
    },

    Init: function() {
        if(this.m_bInit) return;
        this.m_bInit = true;

        this.m_layoutCtrl = this.node.getComponent(cc.Layout);
        this.m_CardItemArray = new Array();
	    for(var i=0;i<GameDef.MAX_CARD_COUNT;i++) {
            this.m_CardItemArray[i] = new tagCardItem();
            this.m_bEnable[i] = true;
        }
    },

    SetGameEngine :function(p){
        this.m_GameClientEngine = p;
        this.setTouchOn();
    },

    setTouchOn :function(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved,this);
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
        if(this.m_bBlank) return false;
        event.stopPropagation();
        //屏幕坐标转节点坐标
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var wight = this.m_nXDistance;  //单张宽度

        this.m_TouchBeginIndex = -1;
        this.m_TouchEndIndex = -1;

        for(var i = 0; i < this.m_cbCardCount; i++) {
            var cbPos = this.getCardPos(i);
            if( i == this.m_cbCardCount-1) wight = GameDef.CARD_WIGTH;//尾张
            if (calcX >= cbPos.x && calcX < cbPos.x + wight){
                if(this.m_bEnable[i]){
                    this.m_TouchBeginIndex = i;
                    break;
                }
            }
        }
        if(this.m_TouchBeginIndex==-1) return false;
        return true;
    },
    onTouchMoved :function(event){
        //屏幕坐标转节点坐标
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var wight = this.m_nXDistance; //单张宽度
        for(var i = 0; i < this.m_cbCardCount; i++) {
            var cbPos = this.getCardPos(i);
            if( i == this.m_cbCardCount-1) wight = GameDef.CARD_WIGTH;
            if (calcX >= cbPos.x && calcX < cbPos.x + wight){
                if(this.m_bEnable[i]){
                    this.m_TouchEndIndex = i;
                    break;
                }
            }
        }

        if(this.m_TouchBeginIndex == -1 || this.m_TouchEndIndex == -1)return;

        var nBeginindex = this.m_TouchBeginIndex < this.m_TouchEndIndex?this.m_TouchBeginIndex:this.m_TouchEndIndex;
        var nEndindex = this.m_TouchEndIndex > this.m_TouchBeginIndex?this.m_TouchEndIndex:this.m_TouchBeginIndex;

        for(var i = 0; i< this.m_cbCardCount; i++){
            this.m_bSelect[i] = (i >= nBeginindex && i <= nEndindex);
            this.m_CardItemArray[i].card.SetSelect(this.m_bSelect[i]);
        }
    },

    onTouchEnded :function(event) {
        //屏幕坐标转节点坐标
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var wight = this.m_nXDistance;//单张宽度
        for(var i = 0; i < this.m_cbCardCount; i++) {
            var cbPos = this.getCardPos(i);
            if( i == this.m_cbCardCount-1) wight = GameDef.CARD_WIGTH;
            if (calcX >= cbPos.x && calcX < cbPos.x + wight){
                if(this.m_bEnable[i]){
                    this.m_TouchEndIndex = i;
                    break;
                }
            }
        }

        if(this.m_TouchBeginIndex == -1 || this.m_TouchEndIndex == -1) return;

        //原有弹起
        var bHasShoot = false;
        for (var i=0;i<this.m_cbCardCount;i++) {
            if (this.m_CardItemArray[i].bShoot==true) {
                bHasShoot = true
                break;
            }
        }

        var nBeginindex = this.m_TouchBeginIndex < this.m_TouchEndIndex?this.m_TouchBeginIndex:this.m_TouchEndIndex;
        var nEndindex = this.m_TouchEndIndex > this.m_TouchBeginIndex?this.m_TouchEndIndex:this.m_TouchBeginIndex;

        for(var i = 0; i < this.m_cbCardCount; i++){
            this.m_bSelect[i] = false;
            if(i >= nBeginindex && i <= nEndindex) {
                this.m_CardItemArray[i].bShoot = !this.m_CardItemArray[i].bShoot;
            }
        }
        this.DrawCard();
        if (this.m_GameClientEngine)this.m_GameClientEngine.OnLeftHitCard(bHasShoot);
    },

    SetCardData:function (cbCardData, cbCardCount, bBlank) {
        //效验参数
        if (cbCardCount > GameDef.MAX_CARD_COUNT) return false;
        this.Init();

        //扑克数目
        this.m_cbCardCount = cbCardCount;
        this.m_bBlank = bBlank;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_60001');
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;
            if(this.m_bBlank)
                this.m_CardItemArray[i].card.SetData(0xff);
            else this.m_CardItemArray[i].card.SetData(cbCardData[i]);
        }

        this.DrawCard();
        return true;
    },

    //设置扑克
    SetShootCard:function ( cbCardData,  cbCardCount){
        //收起扑克
        for (var i=0;i<this.m_cbCardCount;i++) {
            this.m_CardItemArray[i].bShoot=false;
        }
        if(!cbCardData) return;
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

    SetGrayCard:function(cbCardData,cbCardCount){
        if(cbCardCount==null){
            for(var i=0;i<GameDef.MAX_CARD_COUNT;i++){
                this.m_bEnable[i] = true;
           }
        }
        for(var i=0;i<cbCardCount;i++){
             this.m_bEnable[i] = ((cbCardData[i]>0)?true:false);
        }

        this.DrawCard();
    },

    //绘画扑克
    DrawCard:function () {
        if(this.m_MaxWitdh) {
            var MaxWidth = this.m_MaxWitdh + this.m_MaxWitdh * (1 - this.m_scale);
            var BaseXDistance = this.m_nBaseXDistance + this.m_nBaseXDistance * (1 - this.m_scale);
            var BaseXDistance = this.m_nBaseXDistance;
            if(MaxWidth < ( BaseXDistance * (this.m_cbCardCount-1) + GameDef.CARD_WIDTH ) ) {
                this.m_nXDistance = ((MaxWidth - GameDef.CARD_WIDTH) / (this.m_cbCardCount-1));
            } else {
                this.m_nXDistance = this.m_nBaseXDistance;
            }
        }
         else {
            this.m_nXDistance = this.m_nBaseXDistance;
        }
        
        this.m_layoutCtrl.spacingX = this.m_nXDistance - GameDef.CARD_WIGTH; //*this.m_scale
        this.node.anchorX = this.m_AnchorMode;
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            if (i < this.m_cbCardCount) {
                var cardData = this.m_CardItemArray[i].card.GetData();
                this.m_CardItemArray[i].card.SetData(cardData);
                this.m_CardItemArray[i].card.SetBanker(this.m_IsBanker);
                this.m_CardItemArray[i].card.SetSelect(this.m_bSelect[i]);
                this.m_CardItemArray[i].card.SetEnable(this.m_bEnable[i]);

                this.m_CardItemArray[i].card.node.setPosition(0,0);
                this.m_CardItemArray[i].card.SetCardShoot(this.m_CardItemArray[i].bShoot);
            } else {
                this.m_CardItemArray[i].bShoot = false;
                if (this.m_CardItemArray[i].card != null)
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
        this.m_nBaseXDistance = nXDistance;
    },

    SetMaxWidth: function(width) {
        this.m_MaxWitdh = width;
    },

    SetFirstOutCard: function(cbCardData) {
        if(cbCardData) this.SetShootCard(0, 0);
        // for (var i = 0; i < this.m_cbCardCount; i++){
        //     if(cbCardData && this.m_CardItemArray[i].card.GetData() == cbCardData){
        //         this.m_CardItemArray[i].card.SetFirstOut(true);
        //     } else this.m_CardItemArray[i].card.SetFirstOut(false);
        // }
    },

    SetNiaoCard: function(cbCardData) {
        if(cbCardData) this.SetShootCard(0, 0);
        // for (var i = 0; i < this.m_cbCardCount; i++){
        //     if(cbCardData && this.m_CardItemArray[i].card.GetData() == cbCardData){
        //         this.m_CardItemArray[i].card.SetNiaoCard(true);
        //     } else this.m_CardItemArray[i].card.SetNiaoCard(false);
        // }
    },

});