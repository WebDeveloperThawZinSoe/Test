cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre:function(){
        if(this.m_UserCtrl == null){
            this.m_UserCtrl = this.$('@UserCtrl');
            this.m_LbIndex = this.$('LbRank@Label');
            this.m_LbScore = this.$('Score@Label');
            this.m_LbLv1 = this.$('level1');
            this.m_LbLv2 = this.$('level2');
            this.m_LbLv3 = this.$('level3');
            this.m_LbLv4 = this.$('level4');
            this.m_BtKickOut = this.$('BtKickOut');
            this.m_State = this.$('State@Label');
            this.m_LbLeaderID = this.$('LeaderID@Label');
        }
    },
    SetPreInfo:function(Info){
        //this.SetUserInfo(Info[0],Info[1],Info[2],Info[3],Info[4]);
        this.m_Hook = Info[1];
        if(Info[0] == 0){
            this.ShowUserList(Info[2]);
        }else if(Info[0] == 1){
            this.ShowApplyInfor(Info[2])
        }else{
            this.ShowAdminInfor(Info[2])
        }
    },
    ShowUserList:function(Arr){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_UserID = Arr[0];
        this.m_UserCtrl.SetUserByID(Arr[0]);
        this.m_LbLeaderID.string = Arr[1]== null? pGlobalUserData.dwGameID:Arr[1];
        this.m_Level = Arr[3];
        var str = '';
        if(Arr[10]==-1){
            str = Arr[2].replace(/ /,'\n');
        }else{
           
            str = Arr[10]>=US_SIT?'游戏中':'在线';
        }
        this.m_State.string = str;
        if(Arr[3] == CLUB_LEVEL_OWNER){
            this.m_LbLv1.active = true;
            this.m_LbLv2.active = false;
            this.m_LbLv3.active = false;
            this.m_LbLv4.active = false;
        }else if(Arr[3]==CLUB_LEVEL_MANAGER){
            this.m_LbLv1.active = false;
            this.m_LbLv2.active = false;
            this.m_LbLv3.active = true;
            this.m_LbLv4.active = false;       
        }else if(Arr[3]==CLUB_LEVEL_PARTNER){
            this.m_LbLv1.active = false;
            this.m_LbLv2.active = true;
            this.m_LbLv3.active = false;
            this.m_LbLv4.active = false;        
        }else{
            this.m_LbLv1.active = false;
            this.m_LbLv2.active = false;
            this.m_LbLv3.active = false;
            this.m_LbLv4.active = true;    
        }
        //this.m_LbLv.string = Arr[3]==CLUB_LEVEL_OWNER ?'老板':(Arr[3]==CLUB_LEVEL_MANAGER ?'管理员':(Arr[3]==CLUB_LEVEL_PARTNER ?'合伙人':"会员"));
        this.node.active = true;
        if(this.m_BtKickOut){
            this.m_BtKickOut.active = g_ShowClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER && g_ShowClubInfo.cbClubLevel > this.m_Level;
        }
    },
    ShowApplyInfor:function(userID){
        this.m_UserID = userID;
        this.m_UserCtrl.SetUserByID(userID);
        this.node.active = true;
    },
    ShowAdminInfor:function(userID){
        this.m_UserID = userID;
        this.m_UserCtrl.SetUserByID(userID);
        this.node.active = true;
        if(this.m_BtKickOut){
            this.m_BtKickOut.active = g_ShowClubInfo.cbClubLevel==CLUB_LEVEL_OWNER;
        }
    },
    SetUserInfo:function(UIndex, UserID, Level, Score , bShowFull){
        this.m_UserID = UserID;
        this.m_Level = Level;
        this.m_Score = Score;
        this.m_UserCtrl.SetUserByID(this.m_UserID);
        if(bShowFull == null) bShowFull = true;
        this.m_UserCtrl.SetShowFullID(bShowFull);
        if(this.m_LbIndex) this.m_LbIndex.string = parseInt(UIndex) + 1;
        if(this.m_LbScore) this.m_LbScore.string = Score;//'金币：'+
        //俱乐部权限等级
        // if(this.m_LbLv) {
        //     this.m_LbLv.string = window.ClubLvStr[Level];
        //     if(this.m_Level >= CLUB_LEVEL_OWNER) this.m_LbLv.node.color = cc.color(255, 98, 0);
        //     else if(this.m_Level == CLUB_LEVEL_MANAGER) this.m_LbLv.node.color = cc.color(0, 168, 255);
        //     else if(this.m_Level >= CLUB_LEVEL_PARTNER) this.m_LbLv.node.color = cc.color(35, 222, 30);
        //     else this.m_LbLv.node.color = cc.color(170, 57, 40);
        // }

        if(this.m_BtKickOut){
            this.m_BtKickOut.active = g_ShowClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER && g_ShowClubInfo.cbClubLevel > this.m_Level;
        }
    },

    OnBtShowUserInfo:function(){
        this.m_Hook.ShowUserInfo(this.m_UserID,this.m_Level, this.m_Hook.m_ClubID)
    },
    OnClick_BtTakeAll:function(){
       this.m_Hook.OnTakeUserAllScore(this.m_UserID, this.m_Score);
    },
    OnClick_BtShowUserScoreInfo:function(Tag, View){
        this.m_Hook.ShowUserScoreInfo(this.m_UserID, View)
    },
    //检查信息
    CheckUser:function(){
        if ( g_GlobalUserInfo.m_UserInfoMap[this.m_UserID] == null ) {
            g_Lobby.ShowTips("用户信息异常！");
            return false;
        }
        if ( g_GlobalUserInfo.m_UserInfoMap[this.m_UserID] == 'Loading' ) {
            g_Lobby.ShowTips("用户信息加载中！请稍候......");
            return false;
        }
        return true;
    },
    //俱乐部成员删除/拒绝加入
    OnBtDelUser:function(){
        if(!this.CheckUser()) return
        this.m_Hook.OnOpClubUserLv(this.m_UserID,CLUB_LEVEL_NONE);
    },
    //俱乐部成员 同意加入
    OnBtAgree:function(){
        if(!this.CheckUser()) return
        this.m_Hook.OnOpClubUserLv(this.m_UserID,CLUB_LEVEL_MEMBER);
    },

    //俱乐部成员 黑名单
    OnBtNotShow:function(){
        if(!this.CheckUser()) return
        this.m_Hook.OnOpClubUserLv(this.m_UserID,CLUB_LEVEL_BAN);
    },
    //俱乐部成员删除
    OnClick_DelUser:function(){
        if(!this.CheckUser()) return;
        //权限判断
        this.m_MeLevel = this.m_Hook.m_Hook.m_SelClubInfo.cbClubLevel;
        if(this.m_MeLevel<CLUB_LEVEL_MANAGER || this.m_Level>=this.m_MeLevel) return g_Lobby.ShowTips("权限不足！");

        var webUrl = window.PHP_HOME+ '/League.php?GetMark=103&dwUserID='+this.m_UserID;
        webUrl += '&dwClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += `&start=1`;
        webUrl += `&end=10`;
        webUrl += `&lvl=0`;
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            if(Res.length>1){
                g_Lobby.ShowTips("该玩家有下级玩家，不能删除！");
            }else{
                this.m_Hook.ShowAlert('确认踢出该成员？',Alert_YesNo, function(Res) {
                    if(Res) this.m_Hook.OnOpClubUserLv(this.m_UserID,CLUB_LEVEL_NONE);
                }.bind(this));
            }
        }.bind(this));
    },
    //显示详情
    OnBtDetails:function(){

    },
    OnBtDelAdminLv:function(){
        this.m_Hook.OnOpClubUserLv(this.m_UserID,CLUB_LEVEL_MEMBER);
    },
});
