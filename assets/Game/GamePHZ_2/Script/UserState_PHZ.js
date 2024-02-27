cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_stateSprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas
    },

    start :function() {
        this.m_stateSprite.node.active = false;
        this.schedule(this.UpdateView, 1);
    },
    
    Init:function(){
        this.HideState();
    },

    //准备:Ready 抢地主:Rob 要不起:NoHave 踢:Kick 不踢:NoKick 123分:123  不叫:255 不要:Pass
    ShowUserState :function(state, second){
        this.stateCntDown = second;
        this.m_stateSprite.node.active = true;
        this.m_stateSprite.spriteFrame = this.m_atlas.getSpriteFrame('State'+state);
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
    SetBenchmarkPos:function (nXPos, nYPos){
        this.node.setPosition(nXPos,nYPos);    
    },
});
