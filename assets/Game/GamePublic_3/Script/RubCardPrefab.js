cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function (){
        this.m_cbCardData = 0xff;
    },
    InitCtrl:function (){
        if(this.m_CardSprite == null) this.m_CardSprite = this.$('Card@Sprite');
        if(this.m_CardVauleSprite == null) this.m_CardVauleSprite = this.$('CardVaule@Sprite');
        if(this.m_CardVauleSprite2 == null) this.m_CardVauleSprite2 = this.$('CardVaule2@Sprite');
    },
    SetData:function (cbCardData){
        this.InitCtrl();
        this.m_cbCardData = cbCardData;
        if( cbCardData==0 || cbCardData==undefined)this.m_cbCardData = 0xff; //牌背


        this.m_CardSprite.spriteFrame=null;
        this.m_CardVauleSprite.spriteFrame=null;
        this.m_CardVauleSprite2.spriteFrame=null;

        cc.gPreLoader.LoadRes('Image_RubCard_'+this.m_cbCardData,'GamePublic_3',function(sprFrame){
            this.m_CardSprite.spriteFrame = sprFrame;
        }.bind(this));
        cc.gPreLoader.LoadRes('Image_RubCard_f'+this.m_cbCardData,'GamePublic_3',function(sprFrame){
            this.m_CardVauleSprite.spriteFrame = sprFrame;
            this.m_CardVauleSprite2.spriteFrame = sprFrame;
        }.bind(this));
    },

    GetData:function(){
        return this.m_cbCardData;
    },

    SetCardAnchor:function (AnchorX, AnchorY) {
        this.m_CardSprite.node.anchorX = AnchorX
        this.m_CardSprite.node.anchorY = AnchorY
    },
});
