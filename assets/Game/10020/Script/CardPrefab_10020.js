var DEF_SHOOT_DISTANCE	    =		20;						//默认间距

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas:cc.SpriteAtlas,
        m_NdTag:cc.Node,
    },
    ctor:function (){
        this.m_colorArr = new Array(cc.color(255,255,255),cc.color(200,255,255));
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
    },
    InitCtrl:function (){
        if(this.m_CardSprite == null) this.m_CardSprite = this.$('Card@Sprite');
        if(this.m_NumSprite == null) this.m_NumSprite = this.$('Card/CN@Sprite');
        if(this.m_SFlowerSprite == null) this.m_SFlowerSprite = this.$('Card/SF@Sprite');
        if(this.m_BFlowerSprite == null) this.m_BFlowerSprite = this.$('Card/BF@Sprite');
        //if(this.m_SFlowerSprite2 == null) this.m_SFlowerSprite2 = this.$('Card/SF2@Sprite');
        //if(this.m_NumSprite2 == null) this.m_NumSprite2 = this.$('Card/CN2@Sprite');
    },
    SetTag:function (bShow) {
        this.m_NdTag.active = bShow;
    },
    SetData:function (cbCardData, bShowTag){
        this.InitCtrl();

        this.SetTag(false);

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
        //牌背 大小王
        var color = this.GetColor(this.m_cbCardData);
        if(color >= 4){
            if ( this.m_CardSprite) {
                this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData);
            }
          
            return
        }

        var value = this.m_cbCardData&0xf;
        var colorStr = color%2==0?'r':'b';
        this.m_NumSprite.node.active = true;  
        this.m_SFlowerSprite.node.active = true;
        this.m_BFlowerSprite.node.active = true;


        //白底
        if ( this.m_CardSprite ) this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('BG');

        //牌值
        this.m_NumSprite.spriteFrame = this.m_atlas.getSpriteFrame(colorStr+value);
        if (this.m_NumSprite2) { //镜像数字
            this.m_NumSprite2.node.active = true;
            this.m_NumSprite2.spriteFrame = this.m_atlas.getSpriteFrame(colorStr+value);
        }
        //小花
        this.m_SFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('fs'+color);
        if (this.m_SFlowerSprite2) { //镜像小牌花
            this.m_SFlowerSprite2.node.active = true;
            this.m_SFlowerSprite2.spriteFrame = this.m_atlas.getSpriteFrame('fs'+color);
        }
      
        //大花 
        this.m_BFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('f'+(value<11?color:colorStr+value));

        if (bShowTag && (0x03 == this.m_cbCardData)) this.SetTag(true);
    },
    HideCardSp:function (){
        this.InitCtrl();
       
        this.m_NumSprite.node.active = false;
        this.m_SFlowerSprite.node.active = false;
        this.m_BFlowerSprite.node.active = false;

        if (this.m_NumSprite2) this.m_NumSprite2.node.active = false;
        if (this.m_SFlowerSprite2) this.m_SFlowerSprite2.node.active = false;
    },
    SetGiveUp:function(){
        this.InitCtrl();
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(256);

        this.SetTag(false);
    },
    SetLose:function(){
        this.InitCtrl();
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(257);

        this.SetTag(false);
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
        this.m_CardSprite.node.setPositionY(bShow?DEF_SHOOT_DISTANCE:0);
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
});
