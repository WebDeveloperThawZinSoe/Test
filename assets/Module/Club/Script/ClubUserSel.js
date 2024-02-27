cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_InputID:cc.EditBox,
        m_LabUserLv:cc.Label,
        m_UserNode:cc.Node,
    },
    onLoad:function(){
        this.m_UserCtrl = this.m_UserNode.getComponent("UserCtrl");
    },
    CheckInput:function(){
        if(this.m_InputID.string == ''){
            this.ShowTips("ID输入位空！");
            return false;
        }
        var id = parseInt(this.m_InputID.string);
        if(id>=1000000 || id < 100000){
            this.ShowTips("ID输入错误！");
            return false;
        }
        return true;
    },
    CheckCurUserInfo:function(){
        var id = parseInt(this.m_InputID.string);
        if(this.m_UserCtrl.GetUserID() == 0){
            this.ShowTips("请先查询用户信息！");
            return false;
        }
        return true;
    },
    OnBtSel:function(){
        if(!this.CheckInput()) return;
        var id = parseInt(this.m_InputID.string);
        this.m_Hook.OnSelUser(id);
        this.m_UserCtrl.SetUserByGameID(id);
    },
    OnBtAdd:function(){
        if(!this.CheckInput()) return;
        if(!this.CheckCurUserInfo()) return;
        this.m_Hook.OnOpClubUserLv(this.m_UserCtrl.GetUserID(),3);
    },
    OnBtDel:function(){
        if(!this.CheckInput()) return;
        if(!this.CheckCurUserInfo()) return;
        this.m_Hook.OnOpClubUserLv(this.m_UserCtrl.GetUserID(),0);
    },
    OnShowView:function(){
        this.m_UserCtrl.SetUserByID(0);
    },
    // update (dt) {},
});
