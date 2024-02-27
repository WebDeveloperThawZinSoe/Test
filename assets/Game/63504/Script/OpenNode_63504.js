// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.BaseClass,

    onLoad:function(){
        this.m_cbCardData = 0;
        this._Card = this.$('CardPrefab_tem@CardPrefab_63504');
        this._Card.SetData(this.m_cbCardData);
        var NdCard = this.$("255");
        NdCard.setPosition(0,0);
        NdCard.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this),NdCard);
        NdCard.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),NdCard);
        NdCard.on(cc.Node.EventType.TOUCH_END,this.onTouchEnded.bind(this),NdCard);
        NdCard.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnded.bind(this),NdCard);
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
        if(this.m_MoveX>400)this.m_MoveX = 400;
        if(this.m_MoveY>300)this.m_MoveY = 300;
        if(this.m_MoveX<-400)this.m_MoveX = -400;
        if(this.m_MoveY<-300)this.m_MoveY = -300;
        if(this.m_TouchCard)this.m_TouchCard.setPosition(this.m_StartPos.x + this.m_MoveX, this.m_StartPos.y + this.m_MoveY);
        
    },
    onTouchEnded :function(event) {
        if(this.m_TouchCard){
            this.m_TouchCard.x = this.m_StartPos.x;
            this.m_TouchCard.y = this.m_StartPos.y;
        }
        this.m_TouchCard = null;
       // if(this.m_MoveX >= 85) return this.m_Hook.OnBnClickedShowCard();
        this.m_Hook.m_GameClientView.OnBnClickedShowCard();
        this.node.active = false;
    },
    SetCardData:function (cbCardData){
        this._Card.SetData(0);
        var NdCard = this.$("255");
        NdCard.setPosition(0,0);

        this.m_cbCardData = cbCardData;
        this.node.active = true;
        this._Card.SetData(this.m_cbCardData);

    },
});
