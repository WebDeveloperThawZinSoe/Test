cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_nodeCard: cc.Node,
        m_Slider: cc.Slider,
        m_nodeCutBt: cc.Node,
        m_Hook: cc.Component,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.m_Cards = new Array();
        this.m_posCard = new Array();
    },

    onLoad() {
        for (var i in this.m_nodeCard.children) {
            this.m_Cards[i] = this.m_nodeCard.children[i];
            this.m_posCard[i] = this.m_Cards[i].getPosition();
        }
    },

    setHook: function (hook) {
        this.m_GameClient = hook;
    },

    start() {

    },

    OnClickHandle: function () {},

    OnClickOK: function () {
        this.m_Hook.OnMessageCutCard(this.m_Slider.progress)
    },

    playSlider: function (dvalue, bIsMe) {
        var delay = 0;
        if (!bIsMe) {
            var value = (dvalue - this.m_Slider.progress) / 50;
            this.schedule(function () {
                this.m_Slider.SetProgress(this.m_Slider.progress + value);
            }.bind(this), 0.01, 49);
            delay += 1;
        }
        this.scheduleOnce(this.playCutCard, delay);
        return delay + 2;
    },

    playCutCard: function () {
        this.m_Slider.node.active = false;
        var index = parseInt(31 * this.m_Slider.progress + 1);
        for (var i = index; i < 33; i++) {
            this.m_Cards[i].runAction(cc.moveTo(0.5, cc.v2(161, -254)));
        }
        for (var i = 0; i < index; i++) {
            this.m_Cards[i].runAction(cc.sequence(cc.delayTime(0.5), cc.moveTo(0.5, cc.v2(-244, -254))));
        }
        for (var i = 0; i < index; i++) {
            this.m_Cards[i].runAction(cc.sequence(cc.delayTime(1), cc.moveTo(0.5, cc.v2(161, -254))));
        }
        for (var i = 0; i < index; i++) {
            this.m_Cards[i].zIndex = 100;
        }
        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            this.node.active = false;
        }, this)));
    },

    resetLine: function () {
        for (var i in this.m_Cards) {
            this.m_Cards[i].setPosition(this.m_posCard[i]);
            this.m_Cards[i].zIndex = parseInt(i);
        }
    },

    show: function (bCut) {
        this.m_nodeCutBt.active = bCut;
        this.m_Slider.enabled = bCut;
        this.resetLine();
        this.m_Slider.SetProgress(0.5);
        this.m_Slider.node.active = true;
        this.node.active = true;
    },



    // update (dt) {},
});