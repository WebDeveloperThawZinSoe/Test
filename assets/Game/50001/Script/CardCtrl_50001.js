//间距定义
var DEF_X_DISTANCE		    =		-100;						//默认间距 

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
        this.m_bTouch = false;
    },
   
    Init :function() {
        if( this.m_CardItemArray == null){
            this.m_CardItemArray = new Array();
            for(var i=0;i<GameDef.MAX_COUNT;i++) {
                this.m_CardItemArray[i] = new tagCardItem();
            } 
        }
    },
    SetClickable:function(bAble) {
        if(!this.m_bTouch && bAble) this.setTouchOn();
        this.m_CardAble = bAble;
    },
   
    setTouchOn :function(){
        this.m_bTouch = true;
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded,this);
    },
    getCardPos :function(index){
        return this.m_CardItemArray[index].card.node.getPosition();
    },
    SetBanker :function(bBanker){
        this.m_IsBanker = bBanker;
        this.DrawCard();
    },
  
    onTouchEnded :function(event) {
        if(!this.m_CardAble) return;
        for (var i=0;i<this.m_cbCardCount;i++) {
            this.m_CardItemArray[i].card.SetSelect( false );
        }
        //屏幕坐标转节点坐标
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        var wight = this.m_nXDistance + CARD_WIGTH;//单张宽度
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
       
        //原有弹起
        var ShootIndex = -1;
        for (var i=0;i<this.m_cbCardCount;i++) {
            if (this.m_CardItemArray[i].bShoot==true) ShootIndex = i;
            this.m_CardItemArray[i].bShoot = false;
        }

        if( this.m_CardItemArray[TouchIndex].card.GetData() == 0xff){
            this.m_Hook.OnBnClickedShowCard();
        }else{
            for (var i=0;i<this.m_cbCardCount;i++) {
                if (this.m_CardItemArray[i].card.GetData() == 0xff) return;
            }

            if(TouchIndex != ShootIndex) this.m_CardItemArray[TouchIndex].bShoot = true;
            this.m_Hook.OnShootChange();
        }  

        this.DrawCard();
    },
    
    SetCardData:function (cbCardData, cbCardCount){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
        this.Init();
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            this.m_CardItemArray[i].bShoot = false;       
  
            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_50001');
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;            
            this.m_CardItemArray[i].card.SetData(cbCardData[i]);
            this.m_CardItemArray[i].card.SetBlack(false);
        }

        this.DrawCard();
        return true;
    },

    //test 翻牌
    SetCardDataAni:function (cbCardData, cbCardCount){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
        this.Init();
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            var actQuene = [];

            this.m_CardItemArray[i].bShoot = false;       

            if( this.m_CardItemArray[i].card == null ){
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_50001');
                this.m_CardItemArray[i].card.m_bValueHide = true;
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }

            actQuene.push(cc.callFunc(function(tag,Data) {
                Data[0].node.active = true; 
            },this, [this.m_CardItemArray[i].card]));
            
            //翻转动画
            var actScale0 = cc.scaleTo(0.15,-0.2,1);
            var actScale1 = cc.scaleTo(0.15,1,1);
            actQuene.push(actScale0);
            actQuene.push(actScale1);

            actQuene.push(cc.callFunc(function(tag,Data) {
                Data[1].SetData(Data[0]);
            },this, [cbCardData[i],this.m_CardItemArray[i].card]));
            // this.m_CardItemArray[i].card.SetData(cbCardData[i]);

            this.m_CardItemArray[i].card.SetBlack(false);

            this.m_CardItemArray[i].card.node.runAction(cc.sequence(actQuene));
        }

        this.DrawCard();
        return true;
    },

    SetBlackCard:function (cbCardData) {
        //设置扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            if( this.m_CardItemArray[i].card == null ) continue;
            if( this.m_CardItemArray[i].card.GetData() != cbCardData ) continue;
            this.m_CardItemArray[i].card.SetBlack(true);
        }
    },
    //绘画扑克
    DrawCard:function () {
        this.$('@Layout').spacingX = this.m_nXDistance;
        this.node.anchorX = this.m_AnchorMode;
        for (var i=0; i < GameDef.MAX_COUNT; i++){
            if(i < this.m_cbCardCount){
                var cardData = this.m_CardItemArray[i].card.GetData();
                this.m_CardItemArray[i].card.SetData(cardData);
                this.m_CardItemArray[i].card.SetCardShoot(this.m_CardItemArray[i].bShoot);
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

    //获取扑克
    GetShootCard:function (){
        //变量定义
        var cbCardData=0;
        for (var i=0;i<this.m_cbCardCount;i++) {
            if (this.m_CardItemArray[i].bShoot) cbCardData=this.m_CardItemArray[i].card.GetData();
        }
        return cbCardData;
    },
    //获取扑克
    GetSelCard:function (cbCardData){
        //拷贝扑克
        var CardIndex = 0;
        for (var i=0;i<this.m_cbCardCount;i++){
            if (this.m_CardItemArray[i].bShoot) continue;
            cbCardData[CardIndex]=this.m_CardItemArray[i].card.GetData();
            CardIndex++;
        }

        return CardIndex;
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
    SetCardDataInt:function (cbCardData, cbCardCount){
        //效验参数
        if (cbCardCount > GameDef.MAX_COUNT) return false;
        this.Init();
        //扑克数目
        this.m_cbCardCount = GameDef.MAX_COUNT;
        //设置扑克

        for (var i = 0; i < GameDef.MAX_COUNT; i++) 
        {
            this.m_CardItemArray[i].bShoot = false;       
            if( this.m_CardItemArray[i].card == null )
            {
                this.m_CardItemArray[i].card = cc.instantiate(this.m_cardPre).getComponent('CardPrefab_50001');
                this.m_CardItemArray[i].card.m_bValueHide = false;
                this.node.addChild(this.m_CardItemArray[i].card.node);
            }
            this.m_CardItemArray[i].card.node.active = true;  
            if(cbCardCount==1&&i==1) 
               this.m_CardItemArray[i].card.SetData(0);   
            else      
               this.m_CardItemArray[i].card.SetData(cbCardData[i]);
            this.m_CardItemArray[i].card.SetBlack(false);
            
        }

        this.DrawCard();
        return true;
    },
});
