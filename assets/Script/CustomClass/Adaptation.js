cc.Class({
    extends: cc.Component,

    properties: {
        m_bScale: {
            default: false,
            tooltip: "横屏窄与比例，是否采用缩放？"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        var s1 = cc.view.getDesignResolutionSize();
        var s2 = cc.winSize;
        var scaleX = s2.width/s1.width;

        if(scaleX<1){
           if(this.m_bScale) this.node.scaleX = scaleX
        }else{
            this.node.width = s1.width*scaleX;
        }
    },
    // start () {

    // },

    // update (dt) {},
});
