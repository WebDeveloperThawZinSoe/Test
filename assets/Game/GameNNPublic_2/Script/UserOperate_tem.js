cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_stateSprite:cc.Sprite
    },

    start :function() {
        this.m_stateSprite.node.active = false;
    },
    
    Init:function(){
        this.HideState();
    },

    //准备:Ready 抢地主:Rob 要不起:NoHave 踢:Kick 不踢:NoKick 123分:123  不叫:255 不要:Pass
    ShowUserState :function(times, isAni){
        if (isAni == null || isAni == undefined)isAni = false;

        cc.gPreLoader.LoadRes('Image_UserOperate_nnTime' + times, 'GameNNPublic_2', function(sf, Param){
            var Index = Param.Index;
            this.m_stateSprite.spriteFrame = sf;
            this.m_stateSprite.node.active = true;
            if (isAni)
            {
                this.m_stateSprite.node.scale = 0;
                this.m_stateSprite.node.runAction(cc.scaleTo(0.1,1));
            }
            else{
                this.m_stateSprite.node.scale = 1;
            }
        }.bind(this), {Index: times});
    },
    HideState :function(){
        this.m_stateSprite.node.active = false;
    },
   
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos,widget){
        this.node.setPosition(nXPos,nYPos);
        
        this.getComponent(cc.Widget).isAlignLeft = widget[0] != 0;
        this.getComponent(cc.Widget).left = widget[0];

        this.getComponent(cc.Widget).isAlignRight = widget[1] != 0;
        this.getComponent(cc.Widget).right = widget[1];
        
        this.getComponent(cc.Widget).isAlignTop = widget[2] != 0;
        this.getComponent(cc.Widget).top = widget[2];
        
        this.getComponent(cc.Widget).isAlignBottom = widget[3] != 0;
        this.getComponent(cc.Widget).bottom = widget[3];
        
        this.getComponent(cc.Widget).updateAlignment();
    },

    getWidgetPos:function(){
        return this.getComponent(cc.Widget).node.getPosition();
    },
});
