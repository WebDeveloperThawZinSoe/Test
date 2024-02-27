cc.Class({
    extends: cc.BaseClass,

    SetHook:function(Hook) {
        this.m_Hook = Hook;

        this.mask = this.$('CardPrefab');   
        this.cardShow = this.$('CardPrefab/Card'); 
        this.cardBack = this.$('CardPrefab/BG');  
        this.m_NdTouch = this.$('Touch');
        this.m_Card = this.$('CardPrefab@RubCardPrefab');

        this.CardVaule = this.$('CardPrefab/CardVaule'); 
        this.CardVaule2 = this.$('CardPrefab/CardVaule2');  
        this.CardVaule.active = false;
        this.CardVaule2.active = false;
       
        this.worldPos = this.mask.convertToWorldSpaceAR(this.cardBack.getPosition());
        this.m_NdTouch.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this),this.m_NdTouch);
        this.m_NdTouch.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),this.m_NdTouch);
        this.m_NdTouch.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded.bind(this),this.m_NdTouch);
        this.m_NdTouch.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded.bind(this),this.m_NdTouch);
    },
    SetCardData :function(cbCardData){
        this.m_EndTime = 0;
        this.m_bTouched = true;
        this.CardVaule.active = false;
        this.CardVaule2.active = false;
        this.m_Card.SetData(cbCardData);
        //this.m_Card.SetValueShow(false);
        this.cardBack.active = true;
        this.mask.setPosition(cc.v2(0, 0));
        this.cardShow.setPosition(cc.v2(1024, 720));
        this.mask.anchorX = 0.5;
        this.mask.angle = 0;
        this.mask.rotation = -90;
        this._stay();
    },
    //触摸事件
    onTouchBegan:function(event){
        if( !this.m_bTouched ) return;
        this.startPos = event.getLocation();
    },
    onTouchMoved:function(event){
        if( !this.m_bTouched ) return;
        let pos = event.getLocation();
            pos = cc.v2(pos.x, pos.y);
            // 点击移动的偏移量
            let offset = pos.sub(this.startPos);

            if (offset.x >= 0) this.LeftOrRight = true;
            else if (offset.x < 0) this.LeftOrRight = false;
            else return;
            if (offset.y > 0) this.UpOrDown = false;
            else if (offset.y < 0) this.UpOrDown = true;
            else return;
            // console.log((this.LeftOrRight ? '左' : '右') + (this.UpOrDown ? '上' : '下'));

            // 转换成角上的位置偏移
            var AnchorX = 0;
            var AnchorY = 0;
            if (this.LeftOrRight) AnchorX = 1;
            if (this.UpOrDown) AnchorY = 1;
            this.m_Card.SetCardAnchor(AnchorX,AnchorY);

            let cardBackPointWorld = this.worldPos.add(cc.v2((this.LeftOrRight ? -1 : 1) * this.cardBack.width / 2,
                (this.UpOrDown ? 1 : -1) * this.cardBack.height / 2));
            let cardShowPointWorld = cardBackPointWorld.add(offset);
            // 两点间中点
            let midWorld = cardShowPointWorld.add(cardBackPointWorld);
            midWorld = cc.v2(midWorld.x / 2, midWorld.y / 2);

            let angle = Math.atan(offset.y / offset.x) / Math.PI * 180;
            angle = -angle;

            //设置mask位置, 为两点间中点
            this.mask.anchorX = this.LeftOrRight ? 0 : 1;
            let maskPos = this.mask.parent.convertToNodeSpaceAR(midWorld);
            this.mask.setPosition(maskPos);
            this.cardShow.setPosition(this.cardShow.parent.convertToNodeSpaceAR(cardShowPointWorld));

            this.mask.rotation = angle;
            this.cardShow.rotation = angle;
            this._stay();
    },
    onTouchEnded:function(event) {
        if( !this.m_bTouched ) return;
        let pos = event.getLocation();
        pos = cc.v2(pos.x, pos.y);
        // 点击移动的偏移量
        let offset = pos.sub(this.startPos);
        if (Math.abs(offset.x) > this.cardBack.width/2 || Math.abs(offset.y) > this.cardBack.height/2) {
            console.log('开牌');
            return this.OnShowCard();
        } else {
            this.mask.setPosition(cc.v2(0, 0));
            this.cardShow.setPosition(cc.v2(1024, 720));
            this.mask.anchorX = 0.5;
            this.mask.angle = 0;
            this._stay();
        }
    },
    
    // 保证底牌不动, 使用widget插件不行, 估计widget插件带上角度后有bug, 所以用代码控制
    _stay:function() {
        this.cardBack.rotation = -this.cardBack.parent.rotation;
        let cardBackPos = this.mask.convertToNodeSpaceAR(this.worldPos);
        this.cardBack.setPosition(cardBackPos)
    },

    OnShowCard:function() {
        this.m_bTouched = false;
        this.CardVaule.active = true;
        this.CardVaule2.active = true;
        //this.m_Card.SetValueShow(true);
        this.m_Card.SetCardAnchor(0.5,0.5);
        this.cardShow.setPosition(cc.v2(0, 0));
        this.cardShow.rotation = -90;
        this.cardBack.active = false;

        this.mask.setPosition(cc.v2(0, 0));
        this.mask.anchorX = 0.5;
        this.mask.rotation = 90;
        
        this._stay();
        this.m_EndTime = new Date().getTime()+1000;
    },
    update:function() {
        var Now = new Date().getTime();
        if(this.m_EndTime != 0 && Now >= this.m_EndTime){
            this.m_EndTime = 0;
            this.m_Hook.m_GameClientView.OnBnClickedShowCard();
            this.CardVaule.active = false;
            this.CardVaule2.active = false;
        }
    },
});
