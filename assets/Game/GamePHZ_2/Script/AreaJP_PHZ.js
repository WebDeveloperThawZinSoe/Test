// 进牌区控件
cc.Class({
    extends: cc.BaseControl,

    properties: {},

    ctor: function () {},

    onLoad: function () {

    },

    start: function () {
        this.Init();
    },

    Init: function() {
        if(!this.m_Content) this.m_Content = this.node.getComponent(cc.Layout);

        this.m_Content.node.anchorX = this.m_AnchorPoint.x;
        this.m_Content.node.anchorY = this.m_AnchorPoint.y;
        if (this.m_AnchorPoint.x == 1) {
            this.m_Content.horizontalDirection = 1;
        } else {
            this.m_Content.horizontalDirection = 0;
        }
    },

    SetScale2: function () {
        this.node.scale = this.m_fScaleValue;

    },

    //基准位置
    SetBenchmarkPos2: function () {
        this.node.setPosition(this.m_BenchmarkPos);
        this.Init();
    },

});
