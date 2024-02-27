cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        if(cc.sys.platform == cc.sys.MOBILE_BROWSER){
            var s1 = cc.view.getDesignResolutionSize();
            var s2 = cc.winSize;
            var scale = s2.width/s1.width;
            this.node.scaleX = scale;
        }
    },
});
