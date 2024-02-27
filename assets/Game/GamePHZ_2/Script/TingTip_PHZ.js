// 进牌区控件
cc.Class({
    extends: cc.BaseControl,
    // extends: cc.BaseClass,
    // extends: cc.Component,

    properties: {},

    ctor: function () {
        this.m_TingTipArray = new Array();
        this.m_cbCurrentCard = 0;
        this.m_bNeedOutCard = true;
    },

    onLoad: function () {
        this.Init();
    },

    start: function () {
        this.Init();
    },

    Init: function () {
        if (!this.m_CardCtrl) {
            this.m_CardCtrl = this.$('CardCtrl_PHZ@CardCtrl_PHZ');
            this.m_CardCtrl.SetBenchmarkPos(0, 0, GameDef.enXLeft, GameDef.enYCenter);
            this.m_CardCtrl.SetCardDistance();
            this.m_CardCtrl.SetScale(1);
        }
    },

    SetScale2: function () {
        this.node.scale = this.m_fScaleValue;
    },

    //基准位置
    SetBenchmarkPos2: function () {
        this.node.setPosition(this.m_BenchmarkPos);
    },

    _SetTingTip: function (cbCardIndex, cbLeftCount) {
        var cbCardList = new Array();
        for (var i in cbCardIndex) {
            if (cbCardIndex[i] <= 0) continue;
            cbCardList.push(GameLogic.SwitchToCardData(i));
        }
        this.m_CardCtrl.SetCardData(cbCardList, cbCardList.length, 2, true);
        // this.m_CardCtrl.SetCardCount(cbLeftCount, true);
        this.m_cbLeftCount = clone(cbLeftCount);
        this.scheduleOnce(this.OnShowCount, 0.01);
    },

    OnShowCount: function() {
        this.m_CardCtrl.SetCardCount(this.m_cbLeftCount, true);
    },

    SetTingTipArray: function (TingTipArray, cbCurrentCard, bNeedOutCard) {
        this.Init();
        if (!TingTipArray || TingTipArray.length == 0) {
            this.m_TingTipArray = new Array();
            this.m_cbCurrentCard = 0;
            this.m_bNeedOutCard = true;
        } else {
            this.m_TingTipArray = clone(TingTipArray);
            this.m_cbCurrentCard = cbCurrentCard;
            this.m_bNeedOutCard = bNeedOutCard;
        }
    },

    ShowTingTip: function (cbCardData) {
        this.Init();
        this.ResetView();
        if(this.m_bNeedOutCard) {
            if (!GameLogic.IsValidCard(cbCardData)) return;
            var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
            for (var i in this.m_TingTipArray) {
                if (this.m_TingTipArray[i].cbTingIndex == cbIndex) {
                    this.node.active = true;
                    this._SetTingTip(this.m_TingTipArray[i].cbCardIndex, this.m_TingTipArray[i].cbLeftCount);
                    break;
                }
            }
        } else {
            if(this.m_TingTipArray && this.m_TingTipArray.length > 0) {
                this.node.active = true;
                this._SetTingTip(this.m_TingTipArray[0].cbCardIndex, this.m_TingTipArray[0].cbLeftCount);
            }
        }
    },

    ResetView: function () {
        this.m_CardCtrl.SetCardData(0, 0, 2, true);
        this.node.active = false;
    },
});
