
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor:function(){
    },

    onLoad: function() {
        this.InitView();
    },

    InitView: function() {
        if(!this.m_TipNode) {
            this.m_TipNode = this.$('imgLookOn');
            // ShowBlink(this.m_TipNode, 1);
        }
        if(!this.m_ButtonNode) this.m_ButtonNode = this.$('ButtonNode');
    },

    OnShowView: function () {
        this.InitView();
        ShowO2I(this.node);
        this.node.zIndex = 10;
    },

    OnHideView: function () {
        this.node.zIndex = 0;
        HideI2O(this.node);
    },

    OnClicked_NoClick: function() {
        this.m_ButtonNode.active = !this.m_ButtonNode.active;
    },

    OnClicked_Sit: function() {
        if(this.m_Hook && this.m_Hook.OnBtLookOnSit) this.m_Hook.OnBtLookOnSit();
    },

    OnClicked_Return: function() {
        if(this.m_Hook && this.m_Hook.OnBtReturn) this.m_Hook.OnBtReturn();
    },
    OnClicked_Menu: function(Tag) {
        if(this.m_Hook && this.m_Hook.OnBtClick_BtMenu) this.m_Hook.OnBtClick_BtMenu(Tag);
    },
});
