cc.Class({
    extends: cc.Component,

    properties: {
        m_LabCnt: cc.Label,
        m_Atlas: cc.SpriteAtlas
    },

    ctor: function () {
        this.m_bSelCard = true;
    },

    OnBtClickCard: function () {
        if (this.m_bSelCard) this.m_Hook.OnBtSelCard(this.node);
        else this.m_Hook.OnBtDelCard(this.node);
    },

    SetData: function (cbCardData) {
        this.node.name = '' + cbCardData;
        this.node.getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame('P9Card' + cbCardData);
        this.m_LabCnt.string = '';
    },

    SetCardCount: function (Cnt) {
        this.m_LabCnt.node.parent.active = true;
        this.m_LabCnt.string = Cnt;
    },

    SetSelCard: function (bSel) {
        this.m_bSelCard = bSel;
    }

    // update (dt) {},
});
