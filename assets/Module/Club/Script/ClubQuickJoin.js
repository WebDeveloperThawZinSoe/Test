cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_TypeLayout:cc.Node,
    },
    ctor:function(){
        this.m_RoomKind = 0;
        this.m_TagArr = [];
        this.m_KindArr = [];
        this._update = false;
    },
    onSetRoomInfo:function(roomInfor){
        //界面初始化
        this._roomInfor = roomInfor;
        if (this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubTagBtnPre', this);
        this.m_ListCtrl.InitList(1, 'ClubQuickJoinTypePre', this);

        this.m_KindArr = [];
        for (var i in roomInfor.RoomInfo) {
            var kindID = this._roomInfor.RoomInfo[i].wKindID;
            if(this.m_RoomKind == 0) this.m_RoomKind = kindID;
            if(this.CheckKind(kindID)){
                this.m_ListCtrl.InsertListInfo(1, [window.GameList[kindID],kindID,this.m_RoomKind,this]);
                this.m_KindArr.push(kindID);
            }
        }


        this.m_TagArr = [];
        for (var i in roomInfor.RoomInfo) {
            if(this._roomInfor.RoomInfo[i].wKindID!=this.m_RoomKind) continue;
            if(this.CheckTag(roomInfor.RoomInfo[i].szTag)){
                this.m_ListCtrl.InsertListInfo(0, [roomInfor.RoomInfo[i].szTag,this]);
                this.m_TagArr.push(roomInfor.RoomInfo[i].szTag);
            }
        }

        this.m_ListCtrl.InsertListInfo(0, ['全部',this]);
    },
    OnToggleTypeClick:function(type){
        this._update = true;
        this.m_RoomKind = type;
    },
    update:function(){
        if(!this._update) return;
        this._update = false;
        this.OnFilterTag();
    },
    OnTagClick:function(_,tag){
        this.m_RoomID = 0;
        if(tag == '全部')
        {
            if(this._roomInfor.RoomInfo.length>0)
                this.m_RoomID = this._roomInfor.RoomInfo[0].dwRoomID;
            return;
        }
        var temp = tag == '无标签'?'':tag;
        for (var i in this._roomInfor.RoomInfo) {
            if(this._roomInfor.RoomInfo[i].szTag!=temp) continue;
            if (this._roomInfor.RoomInfo[i].wProgress > 0) continue;
            this.m_RoomID = this._roomInfor.RoomInfo[i].dwRoomID;
            break;
        }

    },
    OnFilterTag:function(){
        this.m_ListCtrl.InitList(0, 'ClubTagBtnPre', this);
        var ShowIndex = 0;
        this.m_TagArr = [];

        for (var i in this._roomInfor.RoomInfo) {
            if(this._roomInfor.RoomInfo[i].wKindID!=this.m_RoomKind) continue;
            if(this.CheckTag(this._roomInfor.RoomInfo[i].szTag)){
                this.m_ListCtrl.InsertListInfo(0, [this._roomInfor.RoomInfo[i].szTag,this]);
                this.m_TagArr.push(this._roomInfor.RoomInfo[i].szTag);
            }
        }
        this.m_ListCtrl.InsertListInfo(0, ['全部',this]);
    },
    CheckTag:function(Tag){
        for(var i =0;i<this.m_TagArr.length;i++){
            if(this.m_TagArr[i] == Tag) return false;
        }
        return true;
    },
    CheckKind:function(kind){
        for(var i =0;i<this.m_KindArr.length;i++){
            if(this.m_KindArr[i] == kind) return false;
        }
        return true;
    },

    OnJoin:function(){
        if(this.m_RoomID == 0){
            this.ShowTips('请选择要进入的房间!');
            return;
        }
        this.m_Hook.OnEnterRoom(this.m_RoomID);
    },
});
