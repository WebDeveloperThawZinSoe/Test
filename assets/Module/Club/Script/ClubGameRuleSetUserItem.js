cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    InitPre: function () {
        if(this.m_UserCtrl == null){
            this.m_UserCtrl = this.$(`@UserCtrl`);
        }
    },

    SetPreInfo: function (Param) {
        this._targetID = Param[0];
        this._RoomID =  Param[1];
        this.m_UserCtrl.SetUserByID(Param[0]);
        this.m_UserCtrl.SetShowFullName(false,5);
        this.$('btDel').active = g_ShowClubInfo.cbClubLevel >= CLUB_LEVEL_MANAGER;
    },
    OnBtDelUser:function(){
        if(g_ShowClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER){
            this.ShowTips('权限不足，无法操作');
            return;
        }
        window.gClubClientKernel.OnSendKickUser(this._targetID,this._RoomID);
    },
});
