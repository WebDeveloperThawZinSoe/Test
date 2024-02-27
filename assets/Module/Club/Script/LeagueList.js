cc.Class({
    extends: cc.BaseClass,

    properties: {},

    ctor: function () {
        this.m_nNeedUpdate = 0;
    },

    InitView: function () {
        if (!this.m_ToggleNode) this.m_ToggleNode = this.$('ToggleContainer');
        if (!this.m_ListNode) this.m_ListNode = this.$('ScollView');
        if (!this.m_SelToggle) {
            this.m_SelToggle = new Array();
            for (var i in this.m_ToggleNode.children) {
                var index = this.m_ToggleNode.children[i].name;
                this.m_SelToggle[index] = this.$('@Toggle', this.m_ToggleNode.children[i]);
            }
        }
        if (!this.m_ListCtrl) {
            this.m_ListCtrl = this.$('@CustomListCtrl');
            this.m_ListCtrl.InitList(0, 'ClubList&Pre', this);
            this.m_ListCtrl.InitList(1, 'LobbyRoom', this);
            this.$('@ClubList&Pre').m_Hook = this;
        }
    },

    OnShowView: function () {
        this.InitView();
        this.m_nNeedUpdate = 1;
        ShowO2I(this.node);
    },

    OnHideView: function () {

        HideI2O(this.node);
    },

    update: function () {
        //显示处理
        if (this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }

        for (var i = 0; i < this.m_ListNode.childrenCount; i++) {
            this.m_ListNode.children[i].active = false;
        }
        var Index = 0;
        for (var i in this.m_SelToggle) {
            if (this.m_SelToggle[i].isChecked) {
                Index = i;
                break;
            }
        }
        if (this.$('@ClubList&Pre')) {
            if (Index == 0) {
                this.$('@ClubList&Pre').OnUpdateList(function () {
                    this.OnLoadRoomHistory(); //if(ShowLobbyClub==0)
                    //房间记录
                    var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                    var webUrl = window.PHP_HOME + '/League.php?&GetMark=6&dwUserID=' + pGlobalUserData.dwUserID;
                    WebCenter.GetData(webUrl, 3, function (data) {
                        var ClubList = JSON.parse(data);
                        this.m_Hook.OnQueryLoadRoomHistory(ClubList);
                    }.bind(this));
                }.bind(this));
            } else if (Index == 1) {
                this.m_ListCtrl.InitList(1, 'LobbyRoom', this);
                this.m_Hook.OnLoadOwnRoomList();
            }

            var tempNode = this.$('ScrollView' + Index, this.m_ListNode);
            if (tempNode) tempNode.active = true;
        }
    },

    OnToggleSelList:function(Tag, Data){
        this.m_nNeedUpdate = 1;
    },

    onOwnRoomList: function (OwnRoom) { //CMD_GP_S_OwnRoomInfo
        this.m_ListCtrl.InitList(1, 'LobbyRoom', this);
        this.$('ScollView/ScrollView1/view/NoRoom').active = OwnRoom.wCnt == 0;
        for (var i = 0; i < OwnRoom.wCnt; i++) {
            this.m_ListCtrl.InsertListInfo(1, OwnRoom.RoomInfo[i]);
        }
    },

    OnLoadRoomHistory: function () {
        //房间记录
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/League.php?&GetMark=6&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 3, function (data) {
            var ClubList = JSON.parse(data);
            this.m_Hook.OnQueryLoadRoomHistory(ClubList);
        }.bind(this));
    },

    OnGetRoomExRes: function (Res) { //CMD_GP_C_GetRoomExRes
        this.m_RoomArr = Res;
        /*this.m_ListCtrl.InitList(1, 'LobbyRoom', this);
        this.$('ListBG/ScollView/ScrollView1/view/NoRoom').active = true;
        for(var i=Res.wClubCnt;i<Res.wRoomCnt;i++){
            this.m_ListCtrl.InsertListInfo(1, Res.RoomInfo[i]);
            this.$('ListBG/ScollView/ScrollView1/view/NoRoom').active = false;
        }*/

        for (var i = 0; i < 10; i++) {
            var TempClubID = Res.dwClubID[i];
            if (TempClubID > 0) this.m_ClubRoomCnt[TempClubID] = Res.wClubRoomCnt[i];
        }
        if (this.$('@ClubList&Pre')) {
            this.$('@ClubList&Pre').OnUpdateListCheck();
        }

        var TempStr = cc.sys.localStorage.getItem(window.QPName + 'RoomHistory');
        var TempArr = new Array();
        if (TempStr) TempArr = JSON.parse(TempStr);

        for (var i in TempArr) {
            var bIn = false;
            for (var j = 0; j < Res.wRoomCnt; j++) {
                if (TempArr[i] == Res.RoomInfo[j].dwRoomID) bIn = true;
            }
            if (!bIn) TempArr.splice(i, 1);
        }
        cc.sys.localStorage.setItem(window.QPName + 'RoomHistory', JSON.stringify(TempArr));
    },

    OnChangeClub:function(ClubInfo){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.OnChangeClub(ClubInfo);
    },
});
