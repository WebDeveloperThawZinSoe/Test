var DEF_SHOOT_DISTANCE = 20;						//默认间距
var Kind_id = 50001;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas: cc.SpriteAtlas,
        m_atlas1: cc.SpriteAtlas,
        m_atlas2: cc.SpriteAtlas,
    },
    ctor: function () {
        this.m_colorArr = new Array(new cc.color(255, 255, 255), new cc.color(200, 255, 255));
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
    },
    InitCtrl: function () {
        if (this.m_CardSprite == null) this.m_CardSprite = this.$('Card@Sprite');
        if (this.m_NumSprite == null) this.m_NumSprite = this.$('Card/CN@Sprite');
        if (this.m_SFlowerSprite == null) this.m_SFlowerSprite = this.$('Card/SF@Sprite');
        if (this.m_BFlowerSprite == null) this.m_BFlowerSprite = this.$('Card/BF@Sprite');
    },
    SetData: function (cbCardData) {
        // this.InitCtrl();
        // this.node.active = true;
        // this.m_CardSprite.node.active = true;
        // this.HideCardSp();
        // this.m_cbCardData = cbCardData;
        // if( cbCardData==0 || cbCardData==undefined){ //牌背
        //     this.m_cbCardData = 0xff; //牌背
        //     if(this.m_bValueHide){
        //         this.m_CardSprite.node.active = false;
        //         return;
        //     }       
        // }
        // //牌背 大小王
        // var color = this.GetColor(this.m_cbCardData);
        // if(color >= 4){
        //     this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData);
        //     return
        // }
        // var value = this.m_cbCardData&0xf;
        // var colorStr = color%2==0?'r':'b';
        // this.m_NumSprite.node.active = true;
        // this.m_SFlowerSprite.node.active = true;
        // this.m_BFlowerSprite.node.active = true;

        // //白底
        // this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('BG');
        // //牌值
        // this.m_NumSprite.spriteFrame = this.m_atlas.getSpriteFrame(colorStr+value);
        // //小花
        // this.m_SFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('fs'+color);
        // //大花 
        // this.m_BFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('f'+(value<11?color:colorStr+value)); 
        //---------------test----------------
        this.InitCtrl();
        this.node.active = true;
        this.m_CardSprite.node.active = true;
        this.HideCardSp();
        this.m_cbCardData = cbCardData;
        if (cbCardData == 0 || cbCardData == undefined) 
        { //牌背
            this.m_cbCardData = 0xff; //牌背
            if (this.m_bValueHide) {
                this.m_CardSprite.node.active = false;
                return;
            }
        }
        //只有有资源的才可以换牌背
        if(this.m_atlas1 && this.m_atlas2)
        {
            window.LoadSetting(Kind_id);
            var CardBackValue = window.g_GameSetting[Kind_id][window.SetKey_Card_Back];
            if(CardBackValue == 0)this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('Mj' + cbCardData);
            if(CardBackValue == 1)this.m_CardSprite.spriteFrame = this.m_atlas1.getSpriteFrame('Mj' + cbCardData);
            if(CardBackValue == 2)this.m_CardSprite.spriteFrame = this.m_atlas2.getSpriteFrame('Mj' + cbCardData);

        }else this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('Mj' + cbCardData);

    },
    HideCardSp: function () {
        this.m_NumSprite.node.active = false;
        this.m_SFlowerSprite.node.active = false;
        this.m_BFlowerSprite.node.active = false;
    },
    SetGiveUp: function () {
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(256);
    },
    SetLose: function () {
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(257);
    },
    GetData: function () {
        return this.m_cbCardData;
    },
    GetColor: function (CardData) {
        return (CardData >> 4);
    },
    GetCardWidth: function () {
        return this.m_CardSprite.node.getContentSize().width;
    },

    GetCardHeight: function () {
        return this.m_CardSprite.node.getContentSize().height;
    },

    SetCardShoot: function (bShow) {
        this.m_CardSprite.node.y = (bShow ? DEF_SHOOT_DISTANCE : 0);
    },
    SetBanker: function (bShow) {
        var NdBanker = this.$('Card/Banker');
        if (NdBanker) NdBanker.active = bShow;
    },
    SetSelect: function (bSelect) {
        this.m_CardSprite.node.color = this.m_colorArr[0];
        if (bSelect) this.m_CardSprite.node.color = this.m_colorArr[1];
    },
    SetBlack: function (bBlack) {
        this.$('Card/Dark').active = bBlack;
    },
});
