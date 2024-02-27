cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_nIconGold:cc.Node,
        m_nScoreBg:cc.Node,
        m_lbScore:cc.Label,
    },

    start :function() {
    },
    
    Init:function(){
        this.HideState();
    },

    HideState :function(){
        this.m_nScoreBg.active = false;
    },

    SetBetScore:function(Score){
        this.m_nScoreBg.active = true;
        this.m_lbScore.string = Score;
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
    
    GetIconGoldPos:function (){
        var pos = this.m_nIconGold.getPosition();
        var nodeScale = this.m_nScoreBg.scale;
        return this.node.convertToWorldSpaceAR(cc.v2(pos.x * nodeScale,pos.y * nodeScale));
    },
});
