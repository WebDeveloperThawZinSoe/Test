cc.Class({
    extends: cc.Component,

    properties: {

    },
    ctor: function(){

    },

    SetAction:function(wCount){
        this.node.active = true;

        if(this.m_AniCtrl == null){
            this.m_AniCtrl = this.node.getComponent('AniPrefab');
            this.m_AniCtrl.Init(this);
        }
        var AniName = 'dice'+wCount;
        this.m_AniCtrl.PlayAni(AniName,1);
    },
    AniFinish:function(){

        var seq = cc.sequence
            (
                cc.delayTime(1),

                cc.callFunc(function()
                {
                    
                    this.node.active = false;
                },this)
            );
        this.node.runAction(seq);
    },
});
