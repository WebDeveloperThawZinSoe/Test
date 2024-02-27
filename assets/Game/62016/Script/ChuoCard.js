
cc.Class({
    extends: cc.Component,

    properties: {
        m_Card1Node:cc.Node,
        m_Card2Node:cc.Node,
        m_Card3Node:cc.Node,
        m_TouchNode:cc.Node,
    },

  
    ctor :function () {	
        this.isBCP = 0;	
    },
    SetHook :function(Hook) {
        this.m_Hook = Hook;    
        this.m_TouchNode.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this),this.m_TouchNode);
        this.m_TouchNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),this.m_TouchNode);
    },
    //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();
        //滑动起始点
        this.m_TouchStart = event.touch.getLocation().x;
        return  true;
    },
    onTouchMoved :function(event){
        if (this.isBCP) return;        
        //屏幕坐标转节点坐标
        var TempMoveX = event.touch.getLocation().x - this.m_TouchStart;
        //滑动距离
        if(TempMoveX < 0) TempMoveX = 0;
        if(TempMoveX > 290)
        {
            this.isBCP = 1;
            return this.m_Hook.OnClickOpenCard();
            
        } 
        //扑克折叠效果
        this.m_Card3Node.x=-5 - TempMoveX/2-20;
        this.m_Card2Node.x=-GameDef.CARD_WIGTH + TempMoveX/2;
        //this.m_TipsNode.active = (TempMoveX == 0);
    },

    SetCardData:function (cbCardData){
        this.isBCP = 0;	
 
        this.m_Card1Node.width = -174
        this.m_Card1Node.getComponent('CardPrefab').SetData(cbCardData);
        this.m_Card2Node.x=-260;
     
        //this.m_TipsNode.active = true;
    },
    SetCardInit:function (){
        this.m_Card2Node.x=-260;
        this.m_Card3Node.x=-5;
        this.m_Card1Node.width = -174;
  
    },

});
