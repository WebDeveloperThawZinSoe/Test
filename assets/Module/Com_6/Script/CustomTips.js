//CustomTips.js
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BGNode:cc.Node,
        m_LabNode:cc.Label,
    },

    start:function () {
        this.node.setPosition(0,-(window.SCENE_HEIGHT/2));
        var act = cc.sequence(cc.moveTo(0.2, cc.v2(0, 0)), cc.delayTime(0.8));
        this.node.runAction(cc.sequence(act,cc.callFunc( this.OnDestroy,this,this)));
        this.m_LabNode.string = this.m_strTips;
        this.m_BGNode.height = this.m_LabNode.node.height + 20;
    },
    SetTips:function(str){
        this.m_strTips = str;
    },
});
