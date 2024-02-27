cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CardNode1:cc.Node,
        m_CardNode2:cc.Node,
        m_CardNode3:cc.Node,
        m_CardNode4:cc.Node,
    },

    ctor :function () {		
    },
    SetHook :function(Hook) {
        this.m_Hook = Hook;
        for(var i = 0; i < 2; i++){
            var NdCard = this.$("CardNode/Node_"+i);
     

            NdCard.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this),NdCard);
            NdCard.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),NdCard);
            NdCard.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded.bind(this),NdCard);
            NdCard.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded.bind(this),NdCard);
        }
    },
    //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();
        //滑动起始点
        this.m_TouchStart = event.touch.getLocation();
        this.m_TouchCard = event.currentTarget;
        this.m_StartPos = this.m_TouchCard.getPosition();
        return  true;
    },
    onTouchMoved :function(event){
        //屏幕坐标转节点坐标
        this.m_MoveX = event.touch.getLocation().x - this.m_TouchStart.x;
        this.m_MoveY = event.touch.getLocation().y - this.m_TouchStart.y;
        if(this.m_TouchCard)this.m_TouchCard.setPosition(this.m_StartPos.x + this.m_MoveX, this.m_StartPos.y + this.m_MoveY);
    },
    onTouchEnded :function(event) {
        if(this.m_TouchCard){
            this.m_TouchCard.x = this.m_StartPos.x;
            this.m_TouchCard.y = this.m_StartPos.y;
        }
        this.m_TouchCard = null;
       // if(this.m_MoveX >= 85) return this.m_Hook.OnBnClickedShowCard();
       this.scheduleOnce(function(){
            this.m_Hook.m_GameClientEngine.OnOpenCard();

       }, 0.1);
    },
    SetCardData:function (cbCardData,Cnt){
        var HideCnt = 4-Cnt;   
        for(var i=0;i<4;i++){
            if(i==0 || i==2)
                var CardCtrl = this.$('CardNode/Node_0/Card'+i+'@CardPrefab_52081');
            else
                var CardCtrl = this.$('CardNode/Node_1/Card'+i+'@CardPrefab_52081');
            // if(CardCtrl){
                if(HideCnt == 0){
                        this.m_CardNode1.setPosition(-61, -69);
                        this.m_CardNode2.setPosition(-61, -69);
                        this.m_CardNode3.setPosition(-6, -69);
                        this.m_CardNode4.setPosition(-6, -69);
                        CardCtrl.SetData(cbCardData[i]);        
                        //CardCtrl.active = (i >= HideCnt);  
                }else if(HideCnt == 2){
                        this.m_CardNode1.setPosition(-61, -69);
                        this.m_CardNode2.setPosition(-61, -69);
                        this.m_CardNode3.setPosition(10000, 10000);
                        this.m_CardNode4.setPosition(10000, 10000);
                        CardCtrl.SetData(cbCardData[i]);
                        //CardCtrl.active = (i >= HideCnt);
                    //  }
                } 
            // }
        }
        //this.m_CardNode1.setPosition(635, 200);
        this.$('Tips').active = true;
    },
});
