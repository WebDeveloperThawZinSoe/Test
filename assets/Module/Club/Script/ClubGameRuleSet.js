cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    OnShowView:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
    },
    OnBtModifyRoomRule:function(){
        this.m_Hook.m_Hook.m_Hook.OnModifyTableRule(this.m_Hook.m_RoomInfo);
        this.HideView();
    },
    OnBtDelTable:function(){
        this.m_Hook.OnBtClickDiss(this);
    },

    OnSetInof:function(Obj){
        this._RoomID = Obj.RoomNum;
        this.$('BtNode/BtModTable').active = g_ShowClubInfo && g_ShowClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('BtNode/BtDelTable').active = g_ShowClubInfo && g_ShowClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Lab1@Label').string = Obj.GameName;
        this.$('Lab2@Label').string = Obj.RoomNum;
        this.$('Lab3@Label').string = Obj.GameRule;
        this.$('Lab4@Label').string = Obj.RoomRule;
        this.$('BtNode/BtAddAndroid').active = false;
        this.$('BtNode/BtEmpty').active = true;
        var webUrl = window.PHP_HOME+'/ClubAndroid.php?&GetMark=2&ClubID='+g_ShowClubInfo.dwClubID;
        webUrl += '&KindID='+this.m_Hook.m_RoomInfo.wKindID;
        WebCenter.GetData(webUrl, null, function (data) {
            var isAndroid = JSON.parse(data);
            if(isAndroid>0 && g_ShowClubInfo.cbClubLevel == CLUB_LEVEL_OWNER){
                this.$('BtNode/BtAddAndroid').active = true;
                this.$('BtNode/BtEmpty').active = false;
            }   
            
        }.bind(this));
        this.m_ListCtrl.InitList(0,'ClubGameRuleSetUserItem',this);

        for(var i in this.m_Hook.m_Hook.m_RoomInfoMap.UserList.UserInfo){
            let userInfo = this.m_Hook.m_Hook.m_RoomInfoMap.UserList.UserInfo[i];
            if(userInfo.dwRoomID == this._RoomID){
                this.m_ListCtrl.InsertListInfo(0,[userInfo.dwUserID,userInfo.dwRoomID]);
            }
        }
    },

    OnBtAddAndroid:function(){
        this.ShowPrefabDLG('ClubAndroidCreat',this.node,function(Js){
            Js.OnSetInfo(this.m_Hook.m_RoomInfo);
        }.bind(this));
    },
    ResetUserItem:function(userInfo){
        this.m_ListCtrl.InitList(0,'ClubGameRuleSetUserItem',this);

        for(var i in this.m_Hook.m_Hook.m_RoomInfoMap.UserList.UserInfo){
            let userInfo = this.m_Hook.m_Hook.m_RoomInfoMap.UserList.UserInfo[i];
            if(userInfo.dwRoomID == this._RoomID){
                this.m_ListCtrl.InsertListInfo(0,[userInfo.dwUserID,userInfo.dwRoomID]);
            }
        }
    },
    // update (dt) {},
});
