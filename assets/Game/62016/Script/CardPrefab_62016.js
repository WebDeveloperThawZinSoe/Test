var DEF_SHOOT_DISTANCE = 20; //默认间距

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas: cc.SpriteAtlas
    },

    ctor: function () {
        // 0：正常  1：选中  2：炸弹  3：不可用状态
        this.m_colorArr = new Array(new cc.color(255, 255, 255), new cc.color(200, 255, 255), new cc.color(169, 203, 167), new cc.color(180, 180, 180));
        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;
        this.m_bEnable = true;
        this.m_ptPosBase = cc.v2(0, 0);
        this.m_cbCardBack = 0;
    },

    InitCtrl: function () {
        if (!this.m_CardSprite) this.m_CardSprite = this.$('Card@Sprite');
        if (!this.m_NumSprite) this.m_NumSprite = this.$('Card/CN@Sprite');
        if (!this.m_SFlowerSprite) this.m_SFlowerSprite = this.$('Card/SF@Sprite');
        if (!this.m_BFlowerSprite) this.m_BFlowerSprite = this.$('Card/BF@Sprite');
        if (!this.m_FlagSprite) this.m_FlagSprite = this.$('Card/Flag@Sprite');
        this.UpdateFlag();
    },

    SetData: function (cbCardData) {
        this.InitCtrl();
        this.node.active = true;
        this.m_CardSprite.node.active = true;
        this.m_cbCardBack = window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back];
        if(this.m_cbCardBack == null) this.m_cbCardBack = 0;
        this.HideCardSp();
        this.m_cbCardData = cbCardData;

        if (cbCardData == 0 || cbCardData == undefined) { //牌背
            this.m_cbCardData = 0xff; //牌背


            if (this.m_bValueHide) {
                this.m_CardSprite.node.active = false;
                return;
            }
        }
        //牌背 大小王
        var color = this.GetColor(this.m_cbCardData);
        if (color >= 4) {
            // var pBGFrame = this.m_atlas.getSpriteFrame(((this.m_cbCardData) + (window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back] > 0 ? '_' + window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back] : '')));
            var cbCardStr = this.m_cbCardData == 0xff?`${this.m_cbCardData}_${this.m_cbCardBack}`:this.m_cbCardData;
            var pBGFrame = this.m_atlas.getSpriteFrame(cbCardStr);
            if(!pBGFrame) pBGFrame = this.m_atlas.getSpriteFrame(cbCardStr);
            this.m_CardSprite.spriteFrame = pBGFrame;
            return;
        }
        var value = this.m_cbCardData & 0xf;
        var colorStr = color % 2 == 0 ? 'r' : 'b';
        this.m_NumSprite.node.active = true;
        this.m_SFlowerSprite.node.active = true;
        this.m_BFlowerSprite.node.active = true;

        //白底
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame('BG');
        //牌值
        this.m_NumSprite.spriteFrame = this.m_atlas.getSpriteFrame(colorStr + value);
        //小花
        this.m_SFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('fs' + color);
        //大花
        // var BigColorFrame = this.m_atlas.getSpriteFrame('f' + (value < 11 ? color : colorStr + value) + (window.g_GameSetting[GameDef.KIND_ID][Key_Card_Color] > 0 ? 'B' : ''));
        var BigColorFrame = this.m_atlas.getSpriteFrame('f' + (value < 11 ? color : colorStr + value));
        if(!BigColorFrame) BigColorFrame = this.m_atlas.getSpriteFrame('f' + (value < 11 ? color : colorStr + value));
        // this.m_BFlowerSprite.spriteFrame = this.m_atlas.getSpriteFrame('f' + (value < 11 ? color : colorStr + value));
        this.m_BFlowerSprite.spriteFrame = BigColorFrame;
    },
    HideCardSp: function () {
        this.m_NumSprite.node.active = false;
        this.m_SFlowerSprite.node.active = false;
        this.m_BFlowerSprite.node.active = false;
    },
    SetGiveUp: function () {
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(256+'_'+this.m_cbCardBack);
    },
    SetLose: function () {
        this.HideCardSp();
        this.m_CardSprite.spriteFrame = this.m_atlas.getSpriteFrame(257+'_'+this.m_cbCardBack);
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

    SetBasePos: function(x, y) {
        this.m_ptPosBase.x = x;
        this.m_ptPosBase.y = y;
    },

    SetCardShoot: function (bShow) {
        this.m_CardSprite.node.y = (bShow ? DEF_SHOOT_DISTANCE + this.m_ptPosBase.y : this.m_ptPosBase.y);
    },

    SetBanker: function (bShow) {
        var NdBanker = this.$('Card/Banker');
        if (NdBanker) NdBanker.active = bShow;
    },

    // SetSelect:function(bSelect){
    //     this.m_CardSprite.node.color = this.m_colorArr[0];
    //     if(bSelect)this.m_CardSprite.node.color = this.m_colorArr[1];
    // },

    SetBlack: function (bBlack) {
        this.$('Card/Dark').active = bBlack;
    },

    SetSelect: function (bSelect) {
        // this.m_CardSprite.node.color = this.m_colorArr[0];
        // if (bSelect) {
        //     this.m_CardSprite.node.color = this.m_colorArr[1];
        // } else {
        // }
        // if(bBomb) {
        //     this.m_CardSprite.node.color = this.m_colorArr[2];
        // }
        this.m_bSelect = bSelect;
        this.UpdateColor();
    },

    SetBomb: function (bBomb) {
        this.m_bBomb = bBomb;
        this.UpdateColor();
    },

    SetLight: function (bLight) {
        this.m_bLight = bLight;
        this.UpdateFlag();
    },

    SetFirstOut: function (bFirstOut) {
        this.m_bFirstOut = bFirstOut;
        this.UpdateFlag();
    },

    SetNiaoCard: function (bNiaoCard) {
        this.m_bNiaoCard = bNiaoCard;
        this.UpdateFlag();
    },

    SetEnable: function (bEnable) {
        this.m_bEnable = bEnable;
        this.UpdateColor();
    },

    UpdateColor: function () {
        if (this.m_bEnable) {
            if (this.m_bSelect) {
                this.SetNodeColor(1);
            } else if (this.m_bBomb) {
                this.SetNodeColor(2);
            } else {
                this.SetNodeColor(0);
            }
        } else {
            this.SetNodeColor(3);
        }
    },

    SetNodeColor: function (cbIndex) {
        if (!this.m_colorArr[cbIndex]) cbIndex = 0;
        if (this.m_CardSprite) this.m_CardSprite.node.color = this.m_colorArr[cbIndex];
        if (this.m_NumSprite) this.m_NumSprite.node.color = this.m_colorArr[cbIndex];
        if (this.m_SFlowerSprite) this.m_SFlowerSprite.node.color = this.m_colorArr[cbIndex];
        if (this.m_BFlowerSprite) this.m_BFlowerSprite.node.color = this.m_colorArr[cbIndex];
        if (this.m_FlagSprite) this.m_FlagSprite.node.color = this.m_colorArr[cbIndex];
    },

    UpdateFlag: function () {
        if (!this.m_FlagSprite) return;
        this.m_FlagSprite.node.active = false;
        if(this.m_bLight) {
            //this.m_FlagSprite.spriteFrame = this.m_atlas.getSpriteFrame(this.m_cbCardData);
            this.m_FlagSprite.node.active = true;
        }
        if(this.m_bFirstOut) {
            this.m_FlagSprite.spriteFrame = this.m_atlas.getSpriteFrame('firstout');
            this.m_FlagSprite.node.active = true;
        }
        if(this.m_bNiaoCard) {
            this.m_FlagSprite.spriteFrame = this.m_atlas.getSpriteFrame('zhuaniao');
            this.m_FlagSprite.node.active = true;
        }
    },

    update:function(){
        if(this.m_cbCardBack == window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Back]) return;
        this.SetData(this.m_cbCardData);
    },
});
