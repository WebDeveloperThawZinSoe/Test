cc.Class({
    extends: cc.BaseClass,

    properties: {

    },
    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.m_Key = [];
        this.m_Text = [];
        this.m_nNeedUpdate = 0;
    },
    start: function () {

    },

    OnShowView: function () {
        this.m_nNeedUpdate = 0;
        ShowO2I(this.node);
    },

    OnHideView: function () {
        this.unschedule(this.OnTimer_DelayShow);
        this.m_nNeedUpdate = 0;
        HideI2O(this.node);
    },
});
