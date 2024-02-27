cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_stateSprite:cc.Sprite,
    },

    start :function() {
        this.m_stateSprite.node.active = false;
    },
    
    Init:function(){
        this.HideState();
    },

    ShowUserState :function(state, second){
        this.stateCntDown = second;
        this.m_stateSprite.node.active = true;
    },
    HideState :function(){
        this.stateCntDown = null;
        this.m_stateSprite.node.active = false;
    },

    UpdateView:function(){
        //状态
        if(this.stateCntDown > 0){
            this.stateCntDown--;
        }else if(this.stateCntDown == 0){
            this.HideState();
        }
    },
   
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos, Mode){
        var stateMode = (Mode - 1) / 2;// 1 2 3 => 0 0.5 1
        this.node.setPosition(nXPos,nYPos);
        this.node.anchorX = stateMode;
        this.node.getComponent(cc.Layout).horizontalDirection = stateMode;      
    },
});
