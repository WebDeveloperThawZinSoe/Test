cc.Class({
    extends: cc.Component,

    properties: 
    {
        
    },

    ctor: function(){
        this.m_GameClientEngine = null;
    },

    onLoad: function () {
        if(this.node.getChildren().length <= 0) return;
    },

    SetClientEngine: function(pClientEngine){
        this.m_GameClientEngine = pClientEngine;
    },
    
    ShowView: function(bActive){
        this.node.active = bActive;
    },

    OnButtonClickedBG: function()
    {
        this.node.active = false;
        if(this.m_GameClientEngine)
            this.m_GameClientEngine.OnLeaveControl(0, 0);
    },
});
