var GameLogic = require("GameLogic_501");
cc.Class({
    extends: cc.Component,

    properties: {
        m_Cards: [cc.Component],
        m_nodeCancel: cc.Node,
        m_Atlas: cc.SpriteAtlas,
        m_spType: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor () {
        this.m_cbCardData = new Array();
    },

    onLoad () {

    },

    start () {

    },

    setCardData: function (cbCardData) {
        var cbAddCard = new Array();
        for (var i in cbCardData) {
            if (this.m_cbCardData.length == this.m_Cards.length) break;
            this.m_cbCardData.push(cbCardData[i]);
            cbAddCard.push(cbCardData[i]);
        }
        this.updateView();
        return cbAddCard;
    },


    updateView: function () {
        GameLogic.getInstance().SortCardList(this.m_cbCardData, this.m_cbCardData.length, 0);
        for (var i in this.m_Cards) {
            if (parseInt(i) >=  this.m_cbCardData.length) {
                this.m_Cards[i].node.active = false;
            } else {
                this.m_Cards[i].SetData(this.m_cbCardData[i]);
                this.m_Cards[i].node.active = true;
            }
        }
        if (this.IsFull()) {
            var type = GameLogic.getInstance().GetCardType(this.m_cbCardData);
            this.m_spType.spriteFrame = this.m_Atlas.getSpriteFrame('type' + type);
        }
        this.m_nodeCancel.active = this.IsFull();
        this.m_spType.node.active = this.IsFull();
    },

    removeCard: function (cbCard) {
        for (var i in this.m_cbCardData) {
            if (this.m_cbCardData[i] == cbCard) {
                this.m_cbCardData.splice(i, 1);
            }
        }
        this.updateView();
    },

    removeAllCard: function () {
        this.m_cbCardData = new Array();
        this.updateView();
    },

    IsFull: function () {
        return this.m_Cards.length == this.m_cbCardData.length;
    },

    IsEmpty: function () {
        return  this.m_cbCardData.length == 0;
    },


    

    // update (dt) {},
});
