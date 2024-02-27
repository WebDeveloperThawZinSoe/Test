cc.Class({
    extends: cc.Component,

    properties: {
        m_nodeAdd: cc.Node,
        m_nodeFollow: cc.Node,
        m_nodeAllIn: cc.Node,
        m_nodeGiveUp: cc.Node,
        m_nodeScore: [cc.Node],
        m_GameClient: cc.Component,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function() {
        this.m_dicScore = [5, 10, 20, 50];
    },

    onLoad: function() {
        this.m_GameView = this.m_GameClient.m_GameClientView;
    },

    showOPView: function (cbOPCode) {
        this._hidAllButton();
        this.m_nodeAdd.active = (cbOPCode & GameDef.OP_ADD);
        this.m_nodeFollow.active = (cbOPCode & GameDef.OP_FOLLOW);
        this.m_nodeAllIn.active = (cbOPCode & GameDef.OP_ALLIN);
        this.m_nodeGiveUp.active = (cbOPCode & GameDef.OP_GIVEUP);
        this.node.active = true;
    },

    _hidAllButton: function () {
        this.m_nodeAdd.active = false;
        this.m_nodeFollow.active = false;
        this.m_nodeAllIn.active = false;
        this.m_nodeGiveUp.active = false;
        this._hideScore();
    },

    hideOPView: function () {
        this._hidAllButton();
        this.node.active = false;
    },

    OnBtAdd: function () {
        this._hidAllButton();
        for (var i in this.m_nodeScore) {
            this.m_nodeScore[i].active = true;
            var strScore = this.m_GameView.m_UserInfo[this.m_GameClient.findLastUser()]._addScore.$Label.string;
            this.m_nodeScore[i].active = this.m_dicScore[i] > parseInt(strScore);
            if (i == 3) this.m_nodeScore[i].active = this.m_GameClient.m_bCanAdd50 && this.m_dicScore[i] > parseInt(strScore);
        }
    },

    OnBtScore: function (event, data) {
        this.hideOPView();
        this.m_GameClient.OnMessageAddScore(data);
    },

    OnBtGiveUp: function () {
        this.hideOPView();
        this.m_GameClient.OnMessageGiveUp();
    },

    OnBtAllIn: function () {
        this.hideOPView();
        this.m_GameClient.OnMessageAllIn();
    },

    OnBtFollow: function () {
        this.hideOPView();
        this.m_GameClient.OnMessageFollow();
    },

    OnBtPass: function () {
        this.hideOPView();
        this.m_GameClient.OnMessagePass();
    },

    _hideScore: function () {
        for (var i in this.m_nodeScore) {
            this.m_nodeScore[i].active = false;
        }
    },


    // update (dt) {},
});