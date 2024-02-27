cc.Class({
    extends: cc.Component,

    properties: {
    },

    //onLoad Init
    Init:function(Hook){
        this.m_Hook = Hook;
        this.m_DBAni = this.node.getComponent(dragonBones.ArmatureDisplay)

        //添加动画监听
        this.m_DBAni.addEventListener(dragonBones.EventObject.COMPLETE, this.AniFinish, this);
    },

    PlayAni:function(AniName, Cnt){
        this.m_PlayCnt = Cnt;
        this.m_DBAni.armatureName = AniName;
        this.m_DBAni.playAnimation('newAnimation', Cnt);
    },

    AniFinish:function (event) {
        if(event == null) return
        if( event.type == dragonBones.EventObject.COMPLETE){
            if(this.m_PlayCnt == 1) this.m_Hook.AniFinish();
        }
    },

    PlayAni2:function(ArmatureName, AnimationName, Cnt){
        this.m_PlayCnt = Cnt;
        this.m_DBAni.buildArmature(ArmatureName);
        this.m_DBAni.armatureName = ArmatureName;
        if(!this.m_DBAni.node.hasEventListener(dragonBones.EventObject.COMPLETE, true)) {
            this.m_DBAni.addEventListener(dragonBones.EventObject.COMPLETE, this.AniFinish, this);
        }
        this.m_DBAni.playAnimation(AnimationName, Cnt);
    },
    PlayAniXiPai:function(AniName, Cnt, Name){
        this.m_PlayCnt = Cnt;
        this.m_DBAni._armatureName = AniName
        this.m_DBAni.playAnimation(Name, Cnt);
    },
    // update (dt) {},
});
