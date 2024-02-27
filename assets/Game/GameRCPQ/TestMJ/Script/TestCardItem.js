cc.Class({
    extends: cc.Component,

    properties: {
        m_Atlas: cc.SpriteAtlas,
        m_labNumber: cc.Label,
        m_Card: cc.Sprite,
    },

    crot: function () {
        this.m_cbCardData = 0;
    },

    SetCardData: function (cbCardData) {
        this.m_cbCardData = cbCardData;

        if (0 == cbCardData) {
            this.m_Card.spriteFrame = null;
            this.SetNumber(0);
            return;
        }

        this.m_Card.spriteFrame = this.m_Atlas.getSpriteFrame('' + cbCardData);
    },
    SetNumber: function (count) {
        if (this.m_labNumber == null) return;

        this.m_labNumber.string = '';
        if (0 >= count) return;

        this.m_labNumber.node.active = true;
        this.m_labNumber.string = 'x' + count;
    },
    GetCardData: function () {
        return this.m_cbCardData;
    },
});
