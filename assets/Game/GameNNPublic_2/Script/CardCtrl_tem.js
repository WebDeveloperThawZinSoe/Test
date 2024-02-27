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
        m_cardPre:cc.Prefab,
        m_emptyNode:cc.Node,
    },

    ctor :function () {
        //扑克数据
        this.m_cbCardCount = 0;						        //扑克数目

        this.m_scale = 1;
        this.m_nXDistance = DEF_X_DISTANCE;
        this.m_AnchorMode = 0.5;
        this.m_bIsTouch = false;
    },
   
    Init :function() {
        if(this.m_layoutCtrl  == null){
            this.m_layoutCtrl = this.node.getComponent(cc.Layout);
            this.m_CardItemArray = new Array();
            for(var i=0;i<GameDef.MAX_COUNT;i++) {
                this.m_CardItemArray[i] = new tagCardItem();
            } 
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
    setTouchEnabled:function(bIsCanTouch){
        this.m_bIsTouch = bIsCanTouch;  
    },
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },
    SetBanker :function(bBanker){
        this.m_IsBanker = bBanker;
        this.DrawCard();
    },
     //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();

        return true;
    },

    onTouchEnded :function(event) {
        if (!this.m_bIsTouch) return;
        
        for (var i=0;i<this.m_cbCardCount;i++) {
            this.m_CardItemArray[i].card.SetCardShoot( false );
        }
        //屏幕坐标转节点坐标
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var wight = this.m_nXDistance;//单张宽度
        if(wight > CARD_WIGTH) wight = CARD_WIGTH;

        var TouchIndex = -1;
        for(var i = 0; i < this.m_cbCardCount; i++) {
            var cbPos = this.getCardPos(i);
            if( i == this.m_cbCardCount-1) wight = CARD_WIGTH;
            if (calcX >= cbPos.x && calcX < cbPos.x + wight){
                TouchIndex = i;
                break;
            }
        }

        if(TouchIndex == -1) return;
       
        this.m_CardItemArray[TouchIndex].card.SetCardShoot( true );
        
        if (this.m_GameClientEngine)this.m_GameClientEngine.OnMessageHint(TouchIndex);
    },

    SetCardData:function (cbCardData, cbCardCount,cbOxType,emptyIndex){
        this.Init();
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
      
        if (cbOxType == null || cbOxType == undefined)cbOxType = 255;

        //扑克数目
        this.m_cbCardCount = cbCardCount;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;
            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_tem');
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;
            //if(cbCardData[i] == null) cbCardData[i] = 0;
            this.m_CardItemArray[i].card.SetData(cbCardData[i]);
            this.m_CardItemArray[i].card.SetCardShoot(this.m_CardItemArray[i].bShoot);
            
            this.m_CardItemArray[i].card.node.zIndex = i > 2?i+1:i;
        }

        this.m_emptyNode.active = false;
        if (emptyIndex != undefined && emptyIndex >= 0)
        {
            this.m_emptyNode.zIndex = emptyIndex;
            
            this.m_emptyNode.active = (cbOxType != 0 && cbOxType != 255 && cbOxType != GameDef.OX_VALUE_FINISH);
        }
        this.DrawCard();
        return true;
    },
    SetFinalCardShoot:function (){
        this.m_CardItemArray[this.m_cbCardCount-1].card.SetCardShoot(true);
    },
    SetCardShoot:function (index){
        if (index < 0 || index >= GameDef.MAX_COUNT) return;

        this.m_CardItemArray[index].card.SetCardShoot(true);
    },
    //绘画扑克
    DrawCard:function () {
        this.m_layoutCtrl.spacingX = this.m_nXDistance - CARD_WIGTH;//*this.m_scale
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

    //扑克数目
	GetCardCount:function () { return this.m_cbCardCount; },

    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos,widget, Mode){
        this.node.setPosition(nXPos,nYPos);
        this.m_AnchorMode = 0.5*(Mode - 1)
        
        this.getComponent(cc.Widget).isAlignLeft = widget[0] != 0;
        this.getComponent(cc.Widget).left = widget[0];

        this.getComponent(cc.Widget).isAlignRight = widget[1] != 0;
        this.getComponent(cc.Widget).right = widget[1];
        
        this.getComponent(cc.Widget).isAlignTop = widget[2] != 0;
        this.getComponent(cc.Widget).top = widget[2];
        
        this.getComponent(cc.Widget).isAlignBottom = widget[3] != 0;
        this.getComponent(cc.Widget).bottom = widget[3];
        
        //this.getComponent(cc.Widget).updateAlignment();
    },

    getWidgetPos:function(){
        // var pos = this.getComponent(cc.Widget).node.getPosition();
        // if (this.node.parent != null)
        //     return this.node.parent.convertToWorldSpaceAR(pos);
        // else
        //     return pos;
        return this.node.convertToWorldSpaceAR(cc.v2(0,0));
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

    SetGiveUp:function (nXDistance) {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if (this.m_CardItemArray[i].card == null) continue;
            this.m_CardItemArray[i].card.SetGiveUp();
        }
    },
    SetLose:function (nXDistance) {
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if (this.m_CardItemArray[i].card == null) continue;
            this.m_CardItemArray[i].card.SetLose();
        }
    },
    SetBlackCard: function (cbCardIndex) {
        if (cbCardIndex == undefined || cbCardIndex >= GameDef.MAX_COUNT) 
        {
            for (var i=0; i < GameDef.MAX_COUNT; i++){
                if (this.m_CardItemArray[i].card == null) continue;
                this.m_CardItemArray[i].card.SetBlack(false);
            }
            return;
        }
        //设置扑克
        if (this.m_CardItemArray[cbCardIndex].card == null) return;
        this.m_CardItemArray[cbCardIndex].card.SetBlack(true);
    },
});
