cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre: function () {
        this._name = this.$('Label@Label');
        this._KindID = 0;
    },
    SetPreInfo: function (Info) {
        //this.SetUserInfo(Info[0],Info[1],Info[2],Info[3],Info[4]);
        this.m_Hook = Info[3];
        this._name.string = Info[0];
        this._KindID = Info[1];
        if(Info[1] == Info[2]) this.$('@Toggle').check();
    },
    OnClickToggle: function () {
        this.m_Hook.OnToggleTypeClick(this._KindID);
    },
});
