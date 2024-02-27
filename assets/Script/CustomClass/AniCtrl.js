cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    PlayAni:function(Key){
        this.node.getComponent(cc.Animation).play(Key);
    },
    AniFinish:function () {
        this.OnDestroy();
    },

    // update (dt) {},
});
