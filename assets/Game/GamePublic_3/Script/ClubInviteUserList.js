
cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    ctor :function () {
        this._UserID = 0;
        this._Status = 0;
        this._time = 0;
    },
    OnShowView:function(){
        if(this.m_ListCtrl == null){
            this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
            if(this._btInviteAll == null) this._btInviteAll = this.$('node/ScrollView/BtInviteAll@Button');
            if(this._LabTime == null) this._LabTime = this.$('node/ScrollView/time@Label');
            this._LabTime.node.active = false;
        } 
        this.m_ListCtrl.InitList(0, 'ClubInviteUserList', this);
    },
    OnHideView:function(){
        this.m_ListCtrl.ForEachCtrl(0,function(e){
            e._time = 0;
            e.unschedule(e.UpdateTimePre);
        }.bind(this));
        this.node.active = false;
    },
    OnInsertListInfor:function(arr){
        for(var i = 0; i < arr.length;i++){
            this.m_ListCtrl.InsertListInfo(0, [arr[i],this]);
        }
    },
    OnSetGameInfor:function(RoomInfor){
        console.log(RoomInfor);
        this._roomInfor = RoomInfor;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Obj = new CMD_GC_GetOnlineUser();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.dwClubID = RoomInfor.m_dwClubID;			//俱乐部ID
        window.gClubClientKernel.OnSendGetOnlineUser(this,Obj);
    },

    OnClick_InviteAll:function(){
        this.m_ListCtrl.ForEachCtrl(0,function(e){
            e.OnClick_Invite();
        }.bind(this));
        this.OnCountdown();
    },

    OnCountdown:function(){
        this._time = 10;
        this._btInviteAll.interactable = false;
        this._LabTime.node.active = true;
        this._LabTime.string = this._time+'s';
        this.schedule(this.UpdateTime,1.0);
    },
    UpdateTime:function(){
        if(this._time==0){
            this._btInviteAll.interactable = true;
            this._LabTime.node.active = false;
            this.unschedule(this.UpdateTime);
            return;
        }
        this._time--;
        this._LabTime.string = this._time+'s';
    },

    onOnlineUserRes:function(arr){
        var freeList = [];
        var playList = [];
        var busyList = [];

        for(var i in arr){
            if(arr[i].cbInvite == 1){
                busyList.push(arr[i]);
            }
            else if(arr[i].cbUserStatus < US_SIT){
                freeList.push(arr[i]);
            }else if(arr[i].cbUserStatus){
                playList.push(arr[i]);
            }
        }
        this.OnInsertListInfor(freeList.concat(playList,busyList));
    },

    /////////////////////////////////////////////////////////////////////////////
    //Pre js
    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.$("@UserCtrl");
        if(this.m_Status == null) this.m_Status = this.$("status@Sprite");
        if(this._LabTime == null) this._LabTime = this.$('time@Label');
        if(this._btInvite == null) this._btInvite = this.$('BtInvite@Button');
        this._LabTime.node.active = false;
    },
    SetPreInfo:function(ParaArr){
        this._UserID = ParaArr[0].dwUserID;
        this._Status = ParaArr[0].cbUserStatus;
        this._bInvite = ParaArr[0].cbInvite;
        this.m_UserCtrl.SetUserByID(ParaArr[0].dwUserID);
        //this.m_UserCtrl.SetShowFullName(false,6);
        var str = '';
        if(ParaArr[0].cbInvite == 1){
            str = 'busy';
        }else if(ParaArr[0].cbUserStatus < US_SIT){
            str = 'online';
        }else {
            str = 'paly';
        }

        cc.gPreLoader.LoadRes('Image_ClubInviteUserList_'+str,'GamePublic_3',function (spriteFrame) {
            this.m_Status.spriteFrame = spriteFrame;
        }.bind(this));
        this.$('BtInvite').active = (ParaArr[0].cbUserStatus< US_SIT && ParaArr[0].cbInvite == 0);

        var userInofr = window.gClubClientKernel.OnGetInviteUser(this._UserID);
        var nowTime = new Date().getTime();

        if(userInofr && (nowTime - userInofr.inviteTime)<10000) 
        {
            this._time = 10-Math.round((nowTime - userInofr.inviteTime)/1000);
            this.OnCountdownPre();
        }
        else{
            this._btInvite.interactable = true;
        }
    },
    OnClick_Invite:function(){
        if(this._Status >= US_SIT ||this._bInvite ==1) return;
        if(this._btInvite.interactable == false) return;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        window.gClubClientKernel.OnSendInviteUser(this.m_Hook._roomInfor.m_dwClubID,this._UserID,pGlobalUserData.dwUserID,GameDef.KIND_ID,this.m_Hook._roomInfor.m_dwRoomID);
        var userInofr = window.gClubClientKernel.OnGetInviteUser(this._UserID);
        if(userInofr) userInofr.inviteTime = new Date().getTime();
        this._time = 10;
        this.OnCountdownPre();
    },
    OnCountdownPre:function(){
        this._LabTime.string = this._time+'s';
        this._LabTime.node.active = true;
        this._btInvite.interactable = false;
        this.schedule(this.UpdateTimePre,1.0);
    },
    UpdateTimePre:function(){
        if(this._time<=0){
            this._LabTime.string = '';
            this._btInvite.interactable = true;
            this._LabTime.node.active = false;
            this.unschedule(this.UpdateTimePre);
            return;
        }
        this._time--;
        this._LabTime.string = this._time+'s';
    }

});
