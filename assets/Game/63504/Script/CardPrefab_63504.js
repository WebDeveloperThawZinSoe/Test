var DEF_SHOOT_DISTANCE	    =		20;						//默认间距

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas:cc.SpriteAtlas,
    },
    ctor:function (){
        this.m_colorArr = new Array(cc.color(255,255,255),cc.color(200,255,255));
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
        this.m_CardBgIndex = 0xff;
    },
    InitCtrl:function (){
        if(this.m_CardSprite == null) this.m_CardSprite = this.$('Card@Sprite');
        if(this.m_NumSprite == null) this.m_NumSprite = this.$('Card/CN@Sprite');
    },
    SetData:function (cbCardData){
        this.InitCtrl();
        this.node.active = true;
        if ( this.m_CardSprite) {
            this.m_CardSprite.node.active = true;
        }

        this.HideCardSp();
        this.m_cbCardData = cbCardData;
        if( cbCardData==0 || cbCardData==undefined){ //牌背
            this.m_cbCardData = 0xff; //牌背
            if(this.m_bValueHide){
                if ( this.m_CardSprite) {
                    this.m_CardSprite.node.active = false;
                }

                return;
            }
        }

        if (this.m_cbCardData == 0xff)
        {
            this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData + '' + (this.m_CardBgIndex == 0xff?'':this.m_CardBgIndex + ''));
            return;
        }
        
        //牌背 大小王
        

        var value = this.m_cbCardData&0xf;
        this.m_NumSprite.node.active = true;

        //白底
        if ( this.m_CardSprite ) this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('BG' + (this.m_CardBgIndex == 0xff?'':this.m_CardBgIndex + ''));
        var color = this.GetColor(this.m_cbCardData);
        if(color >= 4){
            if ( this.m_NumSprite) {
                this.m_NumSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData);
            }
            return;
        }
        //牌值
        this.m_NumSprite.spriteFrame = this.m_atlas.getSpriteFrame(value);
        

    },
    HideCardSp:function (){
        this.InitCtrl();

        this.m_NumSprite.node.active = false;
    },
    SetGiveUp:function(){
        this.InitCtrl();
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(256);
    },
    SetLose:function(){
        this.InitCtrl();
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(257);
    },
    GetData:function(){
        return this.m_cbCardData;
    },
    GetColor:function(CardData){
        return (CardData >> 4);
    },
    GetCardWidth :function(){
        this.InitCtrl();
        return this.m_CardSprite.node.getContentSize().width;
    },

    GetCardHeight:function () {
        this.InitCtrl();
        return this.m_CardSprite.node.getContentSize().height;
    },

    SetCardShoot:function (bShow) {
        this.InitCtrl();
        this.m_CardSprite.node.y=(bShow?DEF_SHOOT_DISTANCE:0);
    },
    SetBanker:function (bShow) {
        var NdBanker = this.$('Card/Banker');
        if(NdBanker) NdBanker.active = bShow;
    },
    SetSelect:function(bSelect){
        if ( this.m_CardSprite){
            this.m_CardSprite.node.color = this.m_colorArr[0];
            if(bSelect)this.m_CardSprite.node.color = this.m_colorArr[1];
        }
    },
    SetBlack:function(bBlack){
        this.$('Card/Dark').active = bBlack;
    },

    update:function(ft){
        if (this.m_CardBgIndex !=  window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back])
        {
            this.m_CardBgIndex =  window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back]
            if(this.m_CardBgIndex == null) this.m_CardBgIndex = 0xff;
            if (this.m_cbCardData == 0xff)
            {
                if ( this.m_CardSprite) {
                    this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData + '' + (this.m_CardBgIndex == 0xff?'':this.m_CardBgIndex + ''));
                }
            }
            else{
                if ( this.m_CardSprite) {
                    this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('BG' + (this.m_CardBgIndex == 0xff?'':this.m_CardBgIndex + ''));
                }
            }
        }
    },
});
