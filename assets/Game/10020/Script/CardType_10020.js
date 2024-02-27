cc.Class({
    extends: cc.Component,

    properties: {
        m_Sprite: cc.Sprite,
        m_atlas: cc.SpriteAtlas,

        m_lbScore: cc.Label
    },
    //基准位置
    SetScale: function (scale) {
        this.node.scale = scale;
        this.node.active = true;
        this.m_Sprite.node.active = false;
        this.m_lbScore.node.active = false;
    },
    //基准位置
    SetBenchmarkPos: function (nXPos, nYPos) {
        this.node.setPosition(nXPos, nYPos);
        this.node.active = true;
    },

    SetCardScore: function (type) {
        let bShow = (!!type);
        this.m_lbScore.node.active = bShow;
        if (!bShow) return ;

        this.m_lbScore.string = type + '点';
    },

    SetCardType: function (type) {
        let bShow =((!!type) && (6 == type));
        this.m_Sprite.node.active = bShow;
        if (!bShow) return ;

        //this.m_Sprite.node.spriteFrame = this.m_atlas.getSpriteFrame('type31');
    },
    // update (dt) {},
});
