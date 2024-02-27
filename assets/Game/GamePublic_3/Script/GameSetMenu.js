cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BtSit:cc.Node,
        m_BtCheckOut:cc.Node,
    },

    onLoad: function() {
        this.InitView();
        this.m_BtSit.active = false;
        this.m_BtReturn.active = false;
        this.m_BtCheckOut.active = false;
        this.m_BtLookOnUser.active = false;
        this.m_BtSet.active = false;
    },

    start: function() {
        this.InitView();
    },

    update: function() {
        if(this.m_Hook && this.m_Hook.m_wGameProgress > 0) {
            this.m_BtReturn.active = false;
        }
    },

    InitView: function() {
        if(!this.m_BtSit) this.m_BtSit = this.$('New Node/Layout/BtSit');
        if(!this.m_BtReturn) this.m_BtReturn = this.$('New Node/Layout/BtReturn');
        if(!this.m_BtCheckOut) this.m_BtCheckOut = this.$('New Node/Layout/BtCheckOut');
        if(!this.m_BtLookOnUser) this.m_BtLookOnUser = this.$('New Node/Layout/BtLookOnUser');
        if(!this.m_BtSet) this.m_BtSet = this.$('New Node/Layout/BtSet');
    },

    OnShowView:function() {
        this.InitView();
        this.m_BtSit.active = false;
        this.m_BtReturn.active = false;
        this.m_BtCheckOut.active = false;
        this.m_BtLookOnUser.active = false;
        this.m_BtSet.active = false;
        if(this.m_Hook.IsLookonMode()) {
            this.m_BtSit.active = true;
            this.m_BtReturn.active = true;
            this.m_BtCheckOut.active = false;
            this.m_BtLookOnUser.active = true;
            this.m_BtSet.active = true;
        } else {
            this.m_BtSit.active = false;
            this.m_BtReturn.active = true;
            var bCreater = this.m_Hook.m_dwCreater == this.m_Hook.GetMeUserItem().GetUserID();
            if((bCreater || this.m_Hook.m_wGameProgress > 0)) this.m_BtCheckOut.active = true;
            this.m_BtLookOnUser.active = true;
            this.m_BtSet.active = true;
        }

    },

    OnClick_BtSet:function(){
        this.m_Hook.OnClicked_GameSetting();
        this.HideView();
    },

    OnClick_BtSit:function(){
        this.m_Hook.OnBtLookOnSit();
        this.HideView();
    },
    OnClick_BtLeave:function(){
        this.m_Hook.OnBtReturn();
        this.HideView();
    },
    OnClick_BtCheckOut:function(){
        this.m_Hook.OnClick_CheckOut();
        this.HideView();
    },
    OnClick_BtLookOnUser:function(){
        this.m_Hook.OnClick_BtLookOnList();
        this.HideView();
    },
});
