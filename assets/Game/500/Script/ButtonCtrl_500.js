
cc.Class({
    extends: cc.Component,

    properties: {
        m_nodeRobeTimes: [cc.Node],
        m_GameClient: cc.Component,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    showRobeUI: function () {
        for (var i in this.m_nodeRobeTimes) {
            this.m_nodeRobeTimes[i].active = true;
        }
    },

    hideRobeUI: function () {
        for (var i in this.m_nodeRobeTimes) {
            this.m_nodeRobeTimes[i].active = false;
        }
    },

    OnClickRobe: function (tag, data) {
        this.hideRobeUI();
        this.m_GameClient.OnMessageRobeTimes(parseInt(data));
    },
    

    // update (dt) {},
});
