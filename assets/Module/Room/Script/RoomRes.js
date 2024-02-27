cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    OnShowData:function(dwRoomID, dwClubID, wKindID){
        this.m_dwRoomID = dwRoomID;
        this.m_dwClubID = dwClubID;
        this.m_wKindID = wKindID;
        this.$('LbRoom@Label').string = this.m_dwRoomID;
    },
    OnClick_BtCreat:function(){
        this.HideView();
        this.m_Hook.OnBtCreatRoom();
    },
    OnClick_BtJoin:function(){
        this.HideView();
        this.m_Hook.OnQueryRoom(this.m_dwRoomID, this.m_dwClubID);
    },
    OnHideView:function(){
        this.node.active = false;
        if(this.m_Hook.OnLoadOwnRoomList) this.m_Hook.OnLoadOwnRoomList();
    },
});
