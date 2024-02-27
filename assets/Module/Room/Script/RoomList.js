cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    InitView:function(){
        if (!this.m_ListCtrl) {
            this.m_ListCtrl = this.$('@CustomListCtrl');
            this.m_ListCtrl.InitList(0, 'LobbyRoom', this);
        }
        this.m_Hook.OnLoadOwnRoomList();
    },

    OnShowView: function () {
        this.InitView();
        ShowO2I(this.node);
    },

    OnHideView: function () {

        HideI2O(this.node);
    },

    onOwnRoomList: function (OwnRoom) { //CMD_GP_S_OwnRoomInfo
        this.m_ListCtrl.InitList(0, 'LobbyRoom', this);
        this.$('NoRoom').active = OwnRoom.wCnt == 0;
        for (var i = 0; i < OwnRoom.wCnt; i++) {
            this.m_ListCtrl.InsertListInfo(0, OwnRoom.RoomInfo[i]);
        }
    },

    DeleteRoom: function(dwRoomID) {
        if(!this.node.active || !this.m_ListCtrl) return;
        this.m_ListCtrl.ForEachCtrl(0, function(item){
            if(dwRoomID ==item.m_dwRoomID) item.node.active = false;
        }.bind(this));
    },
});
