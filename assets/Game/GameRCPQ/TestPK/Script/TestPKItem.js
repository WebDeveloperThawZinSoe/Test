cc.Class({
    extends: cc.Component,

    properties: {
        m_LabCnt: cc.Label,
        m_Atlas: cc.SpriteAtlas,
        m_Atlas_MJ: cc.SpriteAtlas
    },

    ctor: function () {
        this.m_bSelCard = false;
    },

    OnBtClickCard: function () {
        if (this.m_bSelCard) {
            this.m_Hook.OnBtSelCard(this.node);
        } else {
            this.m_Hook.OnBtDelCard(this.node);
        }
    },

    SetData: function (cbCardData,cbKind) {
        this.node.name = cbCardData + '';
        if (cbKind == 50001 || cbKind == 63504) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.m_Atlas_MJ.getSpriteFrame(cbCardData);
        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame(cbCardData);  
        }
        
    },

    SetCardCount: function (Cnt) {
        this.m_bSelCard = true;
        this.m_LabCnt.node.parent.active = true;
        this.m_LabCnt.string = Cnt;
    },

    // update (dt) {},
});
