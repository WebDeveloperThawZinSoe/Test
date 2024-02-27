
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabText: cc.Label,
    },

    ctor: function() {

    },

    onLoad: function() {
        if(!this.m_LabText) this.m_LabText = this.$('@Label');
    },

    start: function () {

    },

    OnClicked_Copy: function() {
        if(!this.m_LabText) {
            if(window.LOG_DEBUG) console.log(' 没有绑定复制节点! ');
            return;
        }
        ThirdPartyCopyClipper(this.m_LabText.string);
        g_CurScene.ShowTips(`已复制到剪切板`);
    },

});
