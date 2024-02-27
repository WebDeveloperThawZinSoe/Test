var DEF_SHOOT_DISTANCE	    =		20;						//默认间距

cc.Class({
    extends: cc.Component,

    properties: {
        m_CardSprite:cc.Sprite,
        // m_NumSprite:cc.Sprite,
        // m_SFlowerSprite:cc.Sprite,
        // m_BFlowerSprite:cc.Sprite,
        // m_BankerNode:cc.Node,
        m_atlas:cc.SpriteAtlas
    },
    ctor:function (){
        this.m_colorArr = new Array(new cc.color(255,255,255),new cc.color(200,255,255)); 
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
        this.m_bShoot = false;
        this.m_OpenCard = new Array();
    },
    SetData:function (cbCardData){
        this.node.active = true;
        this.m_cbCardData = cbCardData;
        if( cbCardData==undefined){ //牌背
            this.m_cbCardData = 0xff; //牌背
            if(this.m_bValueHide){
                this.m_CardSprite.node.active = false;
                return;
            }       
        }
        //牌
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('P9Card'+cbCardData); 
    },
    
    GetData:function(){
        return this.m_cbCardData;
    },
    GetShoot:function(){
        return this.m_bShoot;
    },
    GetCardWidth :function(){
        return this.m_CardSprite.node.getContentSize().width;
    },

    GetCardHeight:function () {
        return this.m_CardSprite.node.getContentSize().height;
    },

    SetCardShoot:function (bShow) {
        this.m_bShoot = bShow;
        this.m_CardSprite.node.y = (bShow?DEF_SHOOT_DISTANCE:0);
    },
    SetSelect:function(bSelect){
        this.m_CardSprite.node.color = this.m_colorArr[0];
        if(bSelect)this.m_CardSprite.node.color = this.m_colorArr[1];
    },

    OnClickCard: function () {
        this.SetCardShoot(!this.m_bShoot);
    }
});
