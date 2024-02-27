var DEF_SHOOT_DISTANCE	    =		40;						//默认间距

cc.Class({
    extends: cc.Component,

    properties: {
        m_cardSprite:cc.Sprite,
        m_bankerNode:cc.Node,
        m_atlas:cc.SpriteAtlas
    },
    ctor:function (){
        this.m_colorArr = new Array(new cc.color(255,255,255),new cc.color(200,255,255),new cc.color(180,180,180)); 
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
    },
    SetData:function (cbCardData){
        this.node.active = true;
       
        //扑克正反
        if((!this.m_bValueHide && cbCardData==0) || cbCardData==undefined){ //牌背
            cbCardData = 0xff;
        }
        this.m_cardSprite.spriteFrame = this.m_atlas.getSpriteFrame(cbCardData);
       // this.m_cardSprite.spriteFrame = (this.m_bValueHide && cbCardData==0)?null:this.m_atlas.getSpriteFrame(cbCardData);
        this.m_cbCardData = cbCardData;
    },
    SetGiveUp:function(){
        this.m_cardSprite.spriteFrame = this.m_atlas.getSpriteFrame(256);
    },
    SetLose:function(){
        this.m_cardSprite.spriteFrame = this.m_atlas.getSpriteFrame(257);
    },
    GetData:function(){
        return this.m_cbCardData;
    },

    GetCardWidth :function(){
        return this.m_cardSprite.node.getContentSize().width;
    },

    GetCardHeight:function () {
        return this.m_cardSprite.node.getContentSize().height;
    },

    setCardShoot:function (bShow) {
        this.m_cardSprite.node.y=(bShow?DEF_SHOOT_DISTANCE:0);
    },
    setBanker:function (bShow) {
        if(this.m_bankerNode) this.m_bankerNode.active = bShow;
    },
    setSelect:function(bSelect){
        this.m_cardSprite.node.color = this.m_colorArr[0];
        if(bSelect)this.m_cardSprite.node.color = this.m_colorArr[1];
    },
    setLetCard:function(bSelect){
        this.m_cardSprite.node.color = this.m_colorArr[0];
        if(bSelect)this.m_cardSprite.node.color = this.m_colorArr[2];
    },
});
