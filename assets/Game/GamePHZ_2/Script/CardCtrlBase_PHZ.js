//常量定义
var INVALID_ITEM = 0xFF; //无效子项

//间距定义
var DEF_X_DISTANCE = 53; //默认间距
var DEF_Y_DISTANCE = 18; //默认间距


//扑克结构
var tagCardItem = cc.Class({
    ctor: function () {
        this.bShoot = false; //弹起标志 setCardShoot
        this.card = null; //扑克数据
    }
});

cc.CardCtrlBase_PHZ = cc.Class({
    // extends: cc.BaseClass,
    extends: cc.BaseControl,
    properties: {
        // m_Content: cc.Layout,
        // m_CardPrefab: cc.Prefab,
    },

    ctor: function () {
        //扑克数据
        this.m_cbCardCount = 0; //扑克数目

        this.m_fScaleValue = 1;
        this.m_nXDistance = DEF_X_DISTANCE;

        this.m_CardArr = new Array();

        this.m_cbCardScale = 0; // 牌型
        this.m_bPositively = false;
        this.m_cbCardData = new Array();
        this.m_cbCardDataMap = new Array();

        this.m_bShowBack = true;

        this.m_Attribute = {
            bBig: false,
        };
    },

    onLoad: function() {
    },

    start: function () {
    },

    InitPool: function() {
        if(!this.m_CardPool) this.m_CardPool = new cc.NodePool('CardPrefab_PHZ');
    },

    SetCardData: function (cbCardData, cbCardCount, cbSortType, bSortData) {
        if(!this.m_CardPool) this.InitPool();
        if(this.SetCardData2) {
            this.SetCardData2(cbCardData, cbCardCount, cbSortType, bSortData);
            return true;
        }
        //扑克数目
        this.m_cbCardCount = cbCardCount;

        this.DrawCard();
        return true;
    },

    //绘画扑克
    DrawCard: function () {
        if(this.DrawCard2) {
            this.DrawCard2();
            return;
        }
    },

    AddCardItem: function(CardItem) {
        if(!CardItem.ParentNode) {
            ASSERT(false, ' In CardCtrl AddCardItem Error CardItem.ParentNode is ' + CardItem.ParentNode);
            return null;
        }
        // if(!CardItem.cbCardData) {
        //     ASSERT(false, ' In CardCtrl AddCardItem Error cbCardData is ' + CardItem.cbCardData);
        //     return null;
        // }
        var pCard = this.GetPreFormPool(CardItem.CardPool, CardItem.CardPrefab, CardItem.ParentNode, CardItem.Component);
        CardItem.CardArray.push(pCard[0]);
        pCard[0].SetScale(CardItem.Scale);
        pCard[0].SetDisplay(CardItem.Display);
        pCard[0].SetShowFrame(this.m_bShowFrame);
        pCard[0].SetBigCard(this.m_Attribute.bBig);
        pCard[0].SetShowKing(CardItem.bShowKing);
        pCard[0].SetShowBack(this.m_bShowBack);
        pCard[0].SetIndex(CardItem.Index[0]);
        pCard[0].SetData(CardItem.cbCardData);
        // if(CardItem.Position) {
        //     pCard[0].node.setPosition(CardItem.Position);
        // }
        // if(CardItem.ZIndex) {
        //     pCard[0].node.zIndex = CardItem.ZIndex;
        // }
        ++this.m_cbCardCount;
        return pCard[0];
    },

///////////////////////////////////////////////////////////////////////////

    //获取扑克
    GetCardData: function (cbCardData, cbBufferCount) {
        //效验参数
        if (cbBufferCount < this.m_cbCardCount) return 0;

        //拷贝扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            cbCardData[i] = this.m_CardItemArray[i].card.GetData();
        }

        return this.m_cbCardCount;
    },

    //扑克数目
    GetCardCount: function () {
        return this.m_cbCardCount;
    },

    /////////////////////////////////////////////////////////////
    SetAttribute2: function () {
        if(this.SetAttribute3) {
            this.SetAttribute3();
        }
    },

    //基准位置
    SetBenchmarkPos2: function () {
        if(this.SetBenchmarkPos3) {
            this.SetBenchmarkPos3()
        }
    },

    //缩放
    SetScale2: function () {
        if(this.SetScale3) {
            this.SetScale3();
        }
    },

    Reset: function() {
        if(this.Reset2) {
            this.Reset2();
        }
    },

    /////////////////////////////////////////////////////////////

    //设置距离
    SetCardDistance: function (nXDistance) {
        this.m_nXDistance = GameDef.CARD_WIGTH + nXDistance;
    },

    SetGiveUp: function () {
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            this.m_CardItemArray[i].card.SetGiveUp();
        }
    },
    SetLose: function () {
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            this.m_CardItemArray[i].card.SetLose();
        }
    },

    SetPositively: function (bPositively) {
        this.m_bPositively = bPositively;
        if(this.SetPositively2) this.SetPositively2();
    },

    SetDisplayItem: function (bDisplay) {
        this.m_bDisplay = bDisplay;
    },

    getCardPos: function (index) {
        return this.m_CardItemArray[index].card.node.getPosition();
    },

    SetBanker: function (bBanker) {
        this.m_IsBanker = bBanker;
        this.DrawCard();
    },

    SetShowFrame: function(bShow) {
        this.m_bShowFrame = bShow;
    },
    SetShowBack: function(bShow) {
        this.m_bShowBack = bShow;
    }
///////////////////////////////////////////////////////////////////////////
});

