cc.Class({
    extends: cc.BaseClass,

    properties: {
        //m_atlas:cc.SpriteAtlas,
    },

    Init:function(Hook){
        this.m_Hook = Hook;
        this.m_SpFaces = this.$('FaceEx@Sprite');
        this.m_AniCtrl = this.$('AniNode@AniPrefab');
        this.m_AniCtrl.Init(this);
    },

    PlayAni:function(AniName, EndPos){
        this.m_AniName = AniName;
        this.m_AniCtrl.node.active = false;
        this.m_SpFaces.node.active = true;
        //this.m_SpFaces.spriteFrame = this.m_atlas.getSpriteFrame(AniName);
        cc.gPreLoader.LoadRes('Image_'+AniName, 'Chat_2', function(AniName){
            this.m_SpFaces.spriteFrame = AniName;
        }.bind(this));
        this.node.runAction(cc.sequence(cc.moveTo(0.2, EndPos), cc.callFunc(this.OnMoveEnd.bind(this))));//  
    },
    OnMoveEnd:function(Tag, AniName){
        this.m_AniCtrl.node.active = true;
        this.m_SpFaces.node.active = false;
        this.m_AniCtrl.PlayAni(this.m_AniName, 1);
    },
    AniFinish:function(){
        this.m_Hook.AniFinish(this);
    },
});
