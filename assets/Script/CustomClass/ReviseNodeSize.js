cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER) return;
        var s1 = cc.view.getDesignResolutionSize();
        var s2 = cc.winSize;

        var scaleX = s2.width/s1.width;

        this.node.width = s1.width*scaleX;
        this.node.height = s1.height;
    },
    // start () {

    // },

    // update (dt) {},
});
