cc.Class({
    extends: cc.BaseClass,

    properties: {},


    onLoad: function () {

    },

    start: function () {

    },

    InitPre: function () {
        this.node.active = false;
    },

    SetPreInfo: function (Param) {
        this.node.active = true;
        this.m_Index = Param.Index;
        this.m_Info = Param.Info;
        this.$('@UserCtrl').SetUserByID(this.m_Info.UserID);
    },

    OnClicked_Relieve: function() {
        cc.gSoundRes.PlaySound('Button');
        if(this.m_Hook && this.m_Hook.OnSetBlocked) this.m_Hook.OnSetBlocked(this.m_Info, 0);
    },

    // update (dt) {},
});
