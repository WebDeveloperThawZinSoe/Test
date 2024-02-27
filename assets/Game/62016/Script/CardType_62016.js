cc.Class({
    extends: cc.Component,

    properties: {
        m_Sprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas
    },
    SetCardType:function(type){
        if(type == null){
           this.node.active = false; 
        }else{
            this.node.active = true; 
            this.m_Sprite.spriteFrame = this.m_atlas.getSpriteFrame('Type'+parseInt(type));
        }
    },
    //基准位置
    SetScale:function (scale){
        this.node.scale = scale;
    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos){
        this.node.setPosition(nXPos,nYPos);
    },
    // update (dt) {},
});
