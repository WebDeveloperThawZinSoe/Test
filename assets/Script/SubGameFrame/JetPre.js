cc.Class({
    extends: cc.Component,

    properties: {
        m_atlas:cc.SpriteAtlas,
    },
    SetJet:function(value){
        this.node.getComponent(cc.Sprite).spriteFrame = this.m_atlas.getSpriteFrame(''+value);
    },  
});
