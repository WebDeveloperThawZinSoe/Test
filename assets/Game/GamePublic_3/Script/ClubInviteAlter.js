
cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    OnHideView:function(){
        this.unschedule(this.UpdateTime);
        var obj = null;
        do{
            obj = window.gClubClientKernel.OnGetInviteInfor();
            if(obj){
                this.OnSetInviteInfor(obj);
                return;
            }
        }while(window.gClubClientKernel._inviteInfor.length>0);
        
        this.node.active = false;
    },
    OnSetInviteInfor:function(InviteInfor){
        console.log(InviteInfor);
        this._inviteInfor = InviteInfor;
        if(this._LabTime == null)this._LabTime = this.$('BGM/time@Label');
        if(this._LabContent == null)this._LabContent = this.$('BGM/content@Label');
        var now = new Date().getTime();
        if(Math.round((now - InviteInfor.time)/1000)>60){
            this.HideView();
            return;
        } 
        this._time = 60 - Math.round((now - InviteInfor.time)/1000);  //60;
        var webUrl = PHP_HOME+'/UserFunc.php?GetMark=12&dwUserID='+InviteInfor.dwUserID;
        WebCenter.GetData(webUrl, 1, function (data) {
            var Res = JSON.parse(data);
            var webUrl1 = PHP_HOME+'/League.php?GetMark=24&ClubID='+InviteInfor.dwClubID;
            WebCenter.GetData(webUrl1, 1, function (data1) {
                var Res1 = JSON.parse(data1); 
                var str = '';
                str +='【'+Res1[0]+'】俱乐部玩家【'+Res["NickName"]+'】邀请您进行一场【'+GameList[InviteInfor.dwKindID]+'】游戏，是否接受邀请?'
                this._LabContent.string = str;
                this._LabTime.string = this._time+'s';
                this.schedule(this.UpdateTime,1.0);
            }.bind(this)); 
        }.bind(this));    
    },
    UpdateTime:function(){
        this._time--;
        this._LabTime.string = this._time+'s';
        if(this._time <= 0){
            this.HideView();
        }
    },
    onClick_Agree:function(){
        if(g_Lobby)g_Lobby.OnQueryRoom(this._inviteInfor.dwRoomID,this._inviteInfor.dwClubID);
        this.HideView();
    },
});
