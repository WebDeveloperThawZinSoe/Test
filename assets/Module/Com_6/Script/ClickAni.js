cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        this.m_Ani = this.getComponent(dragonBones.ArmatureDisplay);
        this.m_Ani.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this);
    },
    onEnable :function(){
        this.m_Ani.playAnimation('newAnimation', 1);
    },
    reuse(hook) {
        this.m_Hook = hook; // get 中传入的管理类实例
    },
    animationEventHandler: function (event) {
        if (event.type === dragonBones.EventObject.COMPLETE) {
            this.m_Hook.onClickAniKilled(this.node);
        }
    }
});
