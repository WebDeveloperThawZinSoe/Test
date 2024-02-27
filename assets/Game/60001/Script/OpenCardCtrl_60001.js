cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Card1Node:cc.Node,
        m_Card2Node:cc.Node,
        m_TouchNode:cc.Node,
        m_TipsNode:cc.Node,
    },

    ctor :function () {
        this.m_bFinish = false;
    },

    SetHook :function(Hook) {
        this.m_Hook = Hook;
        this.m_TouchNode.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this),this.m_TouchNode);
        this.m_TouchNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),this.m_TouchNode);
        this.m_TouchNode.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd.bind(this),this.m_TouchNode);
    },
    //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();
        //滑动起始点
        this.m_TouchStart = event.touch.getLocation().x;
        return  true;
    },
    onTouchMoved :function(event){
        //屏幕坐标转节点坐标
        var TempMoveX = event.touch.getLocation().x - this.m_TouchStart;
        //滑动距离
        if(TempMoveX < 0) TempMoveX = 0;
        // if(TempMoveX >= GameDef.CARD_WIGTH) return this.m_Hook.OnClickOpenCard();
        //扑克折叠效果
        // this.m_Card1Node.width = GameDef.CARD_WIGTH - TempMoveX;
        this.m_Card2Node.x = (-GameDef.CARD_WIGTH + TempMoveX*2);
        if(-GameDef.CARD_WIGTH + TempMoveX*2 >= 0) {
            this.m_Card2Node.x = (0);
            this.m_bFinish = true;
        } else {
            this.m_bFinish = false;
        }
        this.m_TipsNode.active = (TempMoveX == 0);
    },
    onTouchEnd :function(event){
        if(this.m_bFinish) {
            this.m_Hook.OnClickOpenCard();
        } else {
            this.Reset();
        }
    },

    Reset: function() {
        this.m_Card2Node.x = (-GameDef.CARD_WIGTH);
        this.m_TipsNode.active = true;
        this.m_bFinish = false;
    },

    SetCardData:function (cbCardData){
        this.m_Card1Node.width = GameDef.CARD_WIGTH;
        this.m_Card1Node.getComponent('CardPrefab').SetData(cbCardData);
        this.Reset();
    },
});
