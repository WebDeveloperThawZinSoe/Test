cc.Class({
    extends: cc.Component,

    properties:
    {
        m_Bubble: cc.Node,
        m_ChatBG: cc.Sprite,
        m_ChatLabel: cc.Label,

        m_Position: cc.Vec2,
        m_AnchorPoint: cc.Vec2,
        m_Scale: cc.Vec2,
    },

    ctor :function(){
        this.m_bActionFinish = true;
    },

    start :function(){
        this.node.setScale(0, 0);
    },

    ShowBubble :function(szText)
    {
        if(!this.m_bActionFinish) return false;
        this.m_bActionFinish = false;
        var szTextTemp = szText;
        this.m_ChatLabel.string = szTextTemp;

        var sizeContent = cc.size(0, 0);
        sizeContent.width = this.m_ChatLabel.node.getContentSize().width + 30;
        sizeContent.height = this.m_ChatLabel.node.getContentSize().height;
        this.m_ChatBG.node.setContentSize(sizeContent);
        this.node.setContentSize(sizeContent);

        this.node.setScale(0, 0);
        //var pScaleTo = cc.scaleTo(0.1, this.m_Scale.x, this.m_Scale.y);
        var pScaleTo = cc.scaleTo(0.1, 1, 1);
 
        this.node.runAction(cc.sequence(pScaleTo, cc.delayTime(3), cc.scaleTo(0.1, 0, 0), cc.delayTime(2), cc.callFunc(this.OnShowBubbleCallBack, this) ) );
        return true;
    },

    OnAnimationCallBack:function(){
        this.m_bActionFinish = true;
    },

    GetBubbleActionStatus :function()
    {
        return this.m_bActionFinish;
    }
});
