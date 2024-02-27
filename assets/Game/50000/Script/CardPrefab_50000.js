var DEF_SHOOT_DISTANCE = 20; //默认间距

cc.Class({
    extends: cc.Component,

    properties: {
        m_CardSprite: cc.Node, 
       // m_NumSprite: cc.Sprite, 
       // m_SFlowerSprite: cc.Sprite,
       // m_BFlowerSprite: cc.Sprite,
       // m_BankerNode: cc.Node,
        m_atlas: cc.SpriteAtlas,
    },
    ctor: function () {
        this.m_colorArr = new Array(new cc.color(255, 255, 255), new cc.color(128, 128, 128),new cc.color(255, 255, 255));
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
        this.shoot = false;
        this.m_color =false;
    },

    SetBehind:function(){
        this.m_CardSprite.getComponent('cc.Sprite').spriteFrame = this.m_atlas.getSpriteFrame(255);
        this.node.active = true;
        return true;
    },


    SetData: function (cbCardData) {
        this.node.active = true;
        this.m_CardSprite.active = true;
        this.HideCardSp();
        this.m_cbCardData = cbCardData;
        if(cbCardData==0 || cbCardData == undefined){
            if(this.m_CardSprite.active){
                this.m_CardSprite.active = false;
            }
            return;
        }
        this.m_CardSprite.getComponent(cc.Sprite).spriteFrame = this.m_atlas.getSpriteFrame(''+cbCardData);
    },

    HideCardSp: function () {
    },
    SetGiveUp: function () {
        this.HideCardSp();
        this.m_CardSprite.getComponent('cc.Sprite').spriteFrame = this.m_atlas.getSpriteFrame(256);
    },
    SetLose: function () {
        this.HideCardSp();
        this.m_CardSprite.getComponent('cc.Sprite').spriteFrame = this.m_atlas.getSpriteFrame(257);
    },
    GetData: function () {
        return this.m_cbCardData;
    },
    GetColor: function (CardData) {
        return (CardData >> 4);
    },
    GetCardWidth: function () {
        return this.m_CardSprite.getContentSize().width;
    },

    GetCardHeight: function () {
        return this.m_CardSprite.getContentSize().height;
    },

    SetCardShoot: function (bShow) {
        this.shoot = bShow;
        var posy=bShow ? DEF_SHOOT_DISTANCE : 0;
        this.m_CardSprite.setPosition(  this.m_CardSprite.getPosition().x, posy);
    },
    SetBanker: function (bShow) {
        if (this.m_BankerNode) this.m_BankerNode.active = bShow;
    },
    SetSelect: function (bSelect) {
        this.selcet = bSelect;
        if (bSelect) {
            if(!this.m_color)
                this.m_CardSprite.color = this.m_colorArr[1];
        } else {
            if(!this.m_color)
                this.m_CardSprite.color = this.m_colorArr[0];
        }
      /*  var color = bSelect ? this.m_colorArr[1] : this.m_colorArr[0];
        this.m_CardSprite.color = color;
        for (var i in this.m_CardSprite.children) {
            this.m_CardSprite.children[i].color = color;
        }*/
    },
    SetColor:function()
    {
        this.m_CardSprite.color = this.m_colorArr[2];
        this.m_color = true;
        
    },

    TurnCard: function (CardData) {
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, cc.v2(0, 1)),
            cc.scaleTo(0.2, cc.v2(1, 1)),
            cc.callFunc(function (event, cbCard) {
                this.SetData(cbCard);
            }, this, CardData)));
    }
});