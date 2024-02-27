cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.node.getComponent('UserCtrl');
        this.m_UserCtrl.SetUserByID(0);
    },
    SetPreInfo:function(UserID){
        this.m_UserCtrl.SetUserByID(UserID);
    },
    //检查信息
    CheckUser:function(){
        if (this.m_UserCtrl == null || this.m_UserCtrl.GetUserID() == 0 ) {
            this.ShowTips("用户信息异常！");
            return false;
        }
        return true;
    },
    OnBtDelManager:function(){
        if(!this.CheckUser()) return
        this.m_Hook.ShowAlert('是否解除管理权限?',Alert_YesNo, function(Res){
            if(Res) this.m_Hook.OnOpClubUserLv(this.m_UserCtrl.GetUserID(),CLUB_LEVEL_MEMBER);
        }.bind(this))
    },
});
