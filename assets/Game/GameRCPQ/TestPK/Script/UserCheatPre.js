cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor: function () {
        this.m_dwUserID = 0;
    },

    SetUserInfo: function (dwUserID) {
        this.m_dwUserID = dwUserID;
        this.node.active = (0 < dwUserID);
        if (this.node.active) {
            this.node.getComponent('UserCtrl').SetUserByID(dwUserID);
        }
    },



    IsChecked: function () {
        return this.node.getComponent(cc.Toggle).isChecked;
    },

    Check: function () {
        this.node.getComponent(cc.Toggle).check();
    },

    // update (dt) {},
});
