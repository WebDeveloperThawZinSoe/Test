var DEF_SHOOT_DISTANCE = 20; //默认间距

cc.Class({
    extends: cc.BaseClass,
    // extends: cc.Component,

    properties: {
        m_CardNode: cc.Node,
        m_Atlas: cc.SpriteAtlas,
    },

    ctor: function () {
        this.m_colorArr = new Array(new cc.color(255, 255, 255), new cc.color(200, 255, 255));
        this.m_colorCardText = new Array(new cc.color(0, 0, 0), new cc.color(187, 23, 23));

        this.m_cbCardData = 0xff;
        this.m_bValueHide = false;

        this.m_CardSize = cc.size(84, 228);
        this.m_bDisplay = true;
        this.m_bBig = false;

        this.m_cbTypeface = 0; // 字体
        this.m_cbCardBack = 0; // 牌背

        this.m_fScaleValue = 1;

        this.m_cbIndex = new Array();

        this.m_bCanSel = true;
    },

    onLoad: function() {
        this.Init();
    },

    start: function() {
        this.Init();
    },

    Init: function() {
        if(!this.m_CountNode) this.m_CountNode = this.$('CardNode/CountNode');
        if(!this.m_LbCount) this.m_LbCount = this.$('CardNode/CountNode/LbCount@Label');
        if(!this.m_TingNode) this.m_TingNode = this.$('CardNode/TingNode');
        if(!this.m_HuNode) this.m_HuNode = this.$('CardNode/HuNode');
        if(!this.m_XingNode) this.m_XingNode = this.$('CardNode/XingNode');
        // if(!this.m_CountNode) this.m_CountNode = this.m_CardNode.getChildByName('CountNode');
        // if(!this.m_LbCount) this.m_LbCount = this.m_CardNode.getChildByName('CountNode').getChildByName('LbCount').getComponent(cc.Label);
        // if(!this.m_TingNode) this.m_TingNode = this.m_CardNode.getChildByName('TingNode');
        if(this.m_CountNode) this.m_CountNode.active = false;
        if(this.m_TingNode) this.m_TingNode.active = false;
        if(this.m_HuNode) this.m_HuNode.active = false;
        if(this.m_XingNode) this.m_XingNode.active = false;
    },

    update: function () {
        if (this.m_cbTypeface == window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Typeface]) return;
        this.DrawCard();
    },

    SetBigCard: function (bBig) {
        if (bBig) {
            this.m_CardSize.width = GameDef.CARD_WIGTH;
            this.m_CardSize.height = GameDef.CARD_HEIGHT;
        } else {
            this.m_CardSize.width = GameDef.CARD_WIGTH_S;
            this.m_CardSize.height = GameDef.CARD_HEIGHT_S;
        }
        this.m_bBig = bBig;
    },

    SetScale: function(fScaleValue) {
        this.m_fScaleValue = fScaleValue;
    },

    // 显示正反
    SetDisplay: function (bDisplay) {
        this.m_bDisplay = bDisplay;
        this.m_cbCardData = 0xff;
    },

    SetShowFrame: function(bShowFrame) {
        this.m_bShowFrame = bShowFrame;
    },

    SetShowBack: function(bShowBack) {
        this.m_bShowBack = bShowBack;
    },

    SetShowKing: function(bShow) {
        this.m_bShowKing = bShow;
    },

    SetIndex: function(ID1, ID2) {
        this.m_cbIndex[0] = ID1;
        this.m_cbIndex[1] = ID2;
    },

    SetData: function (cbCardData) {
        this.node.active = true;
        this.Init();
        if (!this.m_bDisplay) cbCardData = 0xff;
        this.m_cbCardData = cbCardData;
        this.DrawCard();
    },

    DrawCard: function () {

        this.node.active = true;
        this.m_cbTypeface = window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Typeface];
        this.m_bCanSel = true;
        if (this.m_cbTypeface == null) this.m_cbTypeface = 0;
        this.m_cbCardBack = Number(cc.sys.localStorage.getItem(window.SetKey_Card_Back));
        if (isNaN(this.m_cbCardBack)) this.m_cbCardBack = 0;

        if (this.m_bBig) {
            this.m_CardSize.width = GameDef.CARD_WIGTH;
            this.m_CardSize.height = GameDef.CARD_HEIGHT;
        } else {
            this.m_CardSize.width = GameDef.CARD_WIGTH_S;
            this.m_CardSize.height = GameDef.CARD_HEIGHT_S;
        }

        this.HideAllFlag();

        var cbCardValue = GameLogic.GetCardValue(this.m_cbCardData);
        var cbIndex = GameLogic.SwitchToCardIndex(this.m_cbCardData);

        var pCardText = new Array();
        pCardText[0] = this.m_CardNode.getChildByName('text0').getComponent(cc.Sprite);
        pCardText[1] = this.m_CardNode.getChildByName('text1').getComponent(cc.Sprite);
        var pKingFlag = this.m_CardNode.getChildByName('king').getComponent(cc.Sprite);
        var pCardFrame = this.m_CardNode.getChildByName('frame').getComponent(cc.Sprite);
        var pCardBack = this.m_CardNode.getChildByName('back');
        if(pCardBack) pCardBack= pCardBack.getComponent(cc.Sprite);
        else pCardBack = pCardFrame.node.getChildByName('back').getComponent(cc.Sprite);
        if(this.m_bShowBack) pCardBack.node.active = true;
        else pCardBack.node.active = false;
        if(this.m_bShowFrame) {
            pCardBack.node.parent = pCardFrame.node;
            pCardFrame.node.active = true;
        } else {
            pCardBack.node.parent = this.m_CardNode;
            pCardFrame.node.active = false;
        }
        if (this.m_bDisplay) {
            if (this.m_bBig) {
                pCardText[0].node.active = true;
                pCardText[1].node.active = true;
                // pCardText[0].node.setPositionY(75);
                pCardText[0].node.y = 75;
            } else {
                pCardText[0].node.active = true;
                pCardText[1].node.active = false;
                // pCardText[0].node.setPositionY(0);
                pCardText[0].node.y = 0;
            }
            if(cbCardValue == 2 || cbCardValue == 7 || cbCardValue == 10) {
                pCardText[0].node.color = this.m_colorCardText[1];
                pCardText[1].node.color = this.m_colorCardText[1];
            } else {
                if(cbIndex < GameDef.INDEX_KING) {
                    pCardText[0].node.color = this.m_colorCardText[0];
                    pCardText[1].node.color = this.m_colorCardText[0];
                } else {
                    pCardText[0].node.color = cc.color(255, 255, 255);
                    pCardText[1].node.color = cc.color(255, 255, 255);
                }
            }

            pCardText[0].spriteFrame = this.m_Atlas.getSpriteFrame('' + this.m_cbTypeface + '_' + (cbIndex + 1));
            pCardText[1].spriteFrame = this.m_Atlas.getSpriteFrame('' + this.m_cbTypeface + '_' + (cbIndex + 1));
            pCardBack.spriteFrame = this.m_Atlas.getSpriteFrame('Card');
        } else {
            pCardText[0].node.active = false;
            pCardText[1].node.active = false;
            if (this.m_bBig) {
                pCardBack.spriteFrame = this.m_Atlas.getSpriteFrame('' + this.m_cbCardBack + '_255_b');
            } else {
                pCardBack.spriteFrame = this.m_Atlas.getSpriteFrame('' + this.m_cbCardBack + '_255_s');
            }
        }
        if(this.m_bShowKing) {
            pKingFlag.node.active = true;
            if (this.m_bBig) {
                // pKingFlag.node.setPositionY(100);
                pKingFlag.node.y = 100;
            } else {
                // pKingFlag.node.setPositionY(30);
                pKingFlag.node.y = 30;
            }
        } else {
            pKingFlag.node.active = false;
        }

        pCardBack.node.setContentSize(this.m_CardSize);
        this.m_CardNode.setContentSize(this.m_CardSize);
        this.node.setContentSize(this.m_CardSize);
        this.node.scale = this.m_fScaleValue;
    },

    SetGiveUp: function () {
        CardBack.spriteFrame = this.m_Atlas.getSpriteFrame(256);
    },

    SetLose: function () {
        CardBack.spriteFrame = this.m_Atlas.getSpriteFrame(257);
    },

    GetData: function () {
        return this.m_cbCardData;
    },
    GetCardSize: function() {
        var CardSize = this.m_CardNode.getContentSize();
        // CardSize.width = CardSize.width * this.m_CardNode.scale;
        // CardSize.height = CardSize.height * this.m_CardNode.scale;
        return CardSize;
    },

    GetCardWidth: function () {
        return this.m_CardNode.getContentSize().width;
    },

    GetCardHeight: function () {
        return this.m_CardNode.getContentSize().height;
    },

    setCardShoot: function (bShow) {
        // this.m_CardNode.setPositionY(bShow ? DEF_SHOOT_DISTANCE : 0);
        this.m_CardNode.y = (bShow ? DEF_SHOOT_DISTANCE : 0);
    },

    setBanker: function (bShow) {
        if (this.m_bankerNode) this.m_bankerNode.active = bShow;
    },

    setSelect: function (bSelect) {
        this.m_CardNode.color = this.m_colorArr[0];
        if (bSelect) this.m_CardNode.color = this.m_colorArr[1];
    },

    SetCanSelect: function(bCanSel) {
        this.m_bCanSel = bCanSel;
        var pBack = this.$('CardNode/back');
        if(pBack) {
            // pBack.color = this.m_colorArr[bCanSel ? 0 : 1];
            if(bCanSel) pBack.color = new cc.color(255, 255, 255);
            else pBack.color = new cc.color(180, 180, 180);
        }
    },

    IsCanSelect: function() {
        return this.m_bCanSel;
    },

    setFlagSend: function() {
        this.HideAllFlag();
        var pSendFlag = this.m_CardNode.getChildByName('SendFlag');
        if(pSendFlag) pSendFlag.active = true;
    },

    setFlagOut: function() {
        this.HideAllFlag();
        var pOutFlag = this.m_CardNode.getChildByName('OutFlag');
        if(pOutFlag) pOutFlag.active = true;
    },

    setFlagXing: function() {
        this.HideAllFlag();
        var pXingFlag = this.m_CardNode.getChildByName('XingFlag');
        if(pXingFlag) pXingFlag.active = true;
    },

    HideAllFlag: function() {
        var pSendFlag = this.m_CardNode.getChildByName('SendFlag');
        if(pSendFlag) pSendFlag.active = false;
        var pOutFlag = this.m_CardNode.getChildByName('OutFlag');
        if(pOutFlag) pOutFlag.active = false;
        var pXingFlag = this.m_CardNode.getChildByName('XingFlag');
        if(pXingFlag) pXingFlag.active = false;
    },

    SetTing: function(bTing) {
        this.m_bTing = bTing;
        if(this.m_TingNode) this.m_TingNode.active = bTing;
    },

    IsTing: function (){
        return this.m_bTing;
    },

    SetCardCount: function(cbCount, bShow) {
        if(this.m_CountNode) this.m_CountNode.active = bShow;
        if(this.m_LbCount) this.m_LbCount.string = cbCount;
    },

    SetHu: function(bHu) {
        this.m_bHu = bHu;
        if(this.m_HuNode) this.m_HuNode.active = bHu;
    },

    SetXing: function(bXing) {
        this.m_bXing = bXing;
        if(this.m_XingNode) this.m_XingNode.active = bXing;
    },
});
