cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor:function () {
        this.m_SelClubInfo = null;
        this.m_Loading = false;
    },
    OnUpdateListCheck:function () {
        var ClubID = 0;
        if(this.m_SelClubInfo)ClubID = this.m_SelClubInfo.dwClubID;
        this.m_ListCtrl.ForEachCtrl(0, function(Js){
            Js.UpdateClubSel(ClubID)
        }.bind(this));
    },
    OnUpdateList:function (CallBack, Kind) {
        this.m_SelKind = Kind;
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubList&Pre', this);
        this.SetClubList(g_GlobalClubInfo.onGetClubInfoList());
    },
    OnUpdateTableCnt:function(dwClubID){
        this.m_ListCtrl.ForEachCtrl(0,function(e){
            if(e.m_ClubInfo.dwClubID == dwClubID ) e.m_LbTableCnt.string = ''+e.m_ClubInfo.wTableCount;
        }.bind(this));
        
    },
    //显示俱乐部列表
    SetClubList:function (ClubList) {
        var NoClub = this.$('ListBG/ScollView/ScrollView0/view/NoClub');
        NoClub = NoClub || this.$('ScollView/ScrollView0/view/NoClub') || this.$('BGB/BGNoClub');
        if(NoClub) NoClub.active = true;
        if(ClubList.length == 0)  return;
        var index = -1;

        for(var i in ClubList){
            if(window.g_Setting[window.SetKey_CLUB_DEF1] == ClubList[i].dwClubID && this.m_SelKind < CLUB_KIND_2 ){
                index = i;
                break;
            }
            if(window.g_Setting[window.SetKey_CLUB_DEF2] == ClubList[i].dwClubID && this.m_SelKind == CLUB_KIND_2 ){
                index = i;
                break;
            }
        }

        if(index !=-1){
            this.m_ListCtrl.InsertListInfo(0, ClubList[index]);
            if(NoClub) NoClub.active = false;
        }

        this.m_SelClubInfo = null;
        //刷新列表
        for (var i in ClubList ) {
            if(this.m_SelKind == null)continue;
            if(typeof(ClubList[i])!=='object')continue;
            if(ClubList[i] == null)continue;
            if(((this.m_SelKind == CLUB_KIND_2 && ClubList[i].wKindID < this.m_SelKind)||(this.m_SelKind<CLUB_KIND_2 && ClubList[i].wKindID > CLUB_KIND_1 ))) continue;
            if(index!= -1 && i == index) continue;
            this.m_ListCtrl.InsertListInfo(0, ClubList[i]);
            if(NoClub) NoClub.active = false;
        }
    },

    OnChangeClub:function (ClubInfo, bHideList) {
        this.m_SelClubInfo = ClubInfo;
        this.m_Hook.OnChangeClub(ClubInfo);
        if(bHideList) this.HideView();
    },
    OnExitClub:function (ClubInfo) {
        var str = '确认退出？'//该联盟
        if(ClubInfo.ClubLevel == 9) str ='确认解散？';//该联盟
        this.ShowAlert(str,Alert_YesNo, function(Res) {
            if(Res){
                g_Lobby.ShowLoading();
                g_Lobby.OnExitClub(this.m_SelClubInfo.dwClubID);
                this.HideView();
            }
        }.bind(this));
    },

    OnBtShare: function(){
        if(this.m_SelClubInfo == null ) return this.ShowTips("请先进入大联盟！");
        this.ShowPrefabDLG("SharePre");
    },
    //分享信息
    GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【'+this.m_SelClubInfo.szClubName+'】 大联盟 ID：'+this.m_SelClubInfo.dwAllianceID;
        ShareInfo.desc = '欢迎加入【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_SelClubInfo.dwCreaterID].NickName+'】ID：'
            +g_GlobalUserInfo.m_UserInfoMap[this.m_SelClubInfo.dwCreaterID].GameID+'的大联盟';
        ShareInfo.link = cc.share.MakeLink_InviteClub(this.m_SelClubInfo.wKindID, this.m_SelClubInfo.dwAllianceID);
        return ShareInfo;
    },
    OnClickMoreClub: function(){
        this.m_Hook.OnClickMoreClub();
        this.HideView();
    },
    //筛选
    OnBtFliter:function(){
        this.$('BGB/FliterNode').active = !this.$('BGB/FliterNode').active;
    },
    OnBtFliterLimit:function(_,data){
        this.$('BGB/FliterNode').active = false;
        this.$('BGB/FliterBtn/Background/LimitTip@Label').string = this.$('BGB/FliterNode/BtFliter'+data+'/Background/Label@Label').string;
        var level = 0;
        if (data == 1){
            level = 0;
        }else if(data == 2){
            level = 3;
        }
        else if(data == 3){
            level = 6;
        }
        else if(data == 4){
            level = 8;
        }
        else if(data == 5){
            level = 9;
        }

        var ClubList = g_GlobalClubInfo.onGetClubInfoList();
        for (var j in ClubList ) 
        {
            if(typeof(ClubList[j])!=='object')continue;
            if(ClubList[j] == null)continue;
            
            for(var i=0;i<this.m_ListCtrl.m_CtrlArr[0].length;i++)
            {
                var Js = this.m_ListCtrl.m_CtrlArr[0][i];
                if(Js.m_ClubInfo.dwClubID != ClubList[j].dwClubID) continue;
                Js.node.active = level == 0?true: Js.m_ClubInfo.cbClubLevel == level;
                break;
            }
        }
    },
    UpdateDefTog:function(){
        this.OnUpdateList(null,this.m_SelKind);
    },
/////////////////////////////////////////////////////////////////////////////
//Pre js
    InitPre:function(){
        if(this.m_LabID == null) {
            this.m_LabID = this.$("LbID@Label");
            if(this.m_UserCtrl == null) this.m_UserCtrl = this.$("@UserCtrl");
            if(this.m_UserCtrl ) this.m_UserCtrl.SetUserByID(0);
            if(this.m_TogCtrl == null) this.m_TogCtrl = this.$("@Toggle");
            if(this.m_LabName == null) this.m_LabName = this.$("LbName@Label");
            if(this.m_LabCnt == null) this.m_LabCnt = this.$("LbCnt@Label");
            if(this.m_LbLv == null) this.m_LbLv = this.$("LbLv@Label");
            if(this.m_NdClub == null) this.m_NdClub = this.$("NdClub");
            if(this.m_NdClub1 == null) this.m_NdClub1 = this.$("NdClub1");
            if(this.m_LbTableCnt == null) this.m_LbTableCnt = this.$("LbTableCnt@Label");
        }
    },
    SetPreInfo:function(ParaArr){
        this.SetClubInfo(ParaArr);
    },
    //ClubInfo :  ClubLever CreaterID GameID HeadUrl NickName Notice
    SetClubInfo:function(ClubInfo){
        //参数
        this.m_ClubInfo = ClubInfo;
        //显示内容
        if(this.m_UserCtrl ) {
            this.m_UserCtrl.SetUserByID(ClubInfo.dwCreaterID);
            this.m_UserCtrl.SetShowFullName(false, 5);
        }

        if(this.m_LabName)this.m_LabName.string =cutstr(ClubInfo.szClubName, 4);// ClubInfo.ClubName;
        if(this.m_LabID)this.m_LabID.string = ClubInfo.dwAllianceID;//"ID:"+
        if(this.m_LabCnt)this.m_LabCnt.string = "玩家："+ ClubInfo.wMemberCnt + "人";
        //if(this.m_LbLv)this.m_LbLv.string = window.ClubLvStr[ClubInfo.ClubLevel];
        //俱乐部权限等级
        if(this.m_LbLv) {
            this.m_LbLv.string = window.ClubLvStr[ClubInfo.cbClubLevel];
            // if(ClubInfo.ClubLevel >= 9) this.m_LbLv.node.color = cc.color(255, 98, 0);
            // else if(ClubInfo.ClubLevel == 8) this.m_LbLv.node.color = cc.color(0, 168, 255);
            // else if(ClubInfo.ClubLevel >= 6) this.m_LbLv.node.color = cc.color(35, 222, 30);
            // else this.m_LbLv.node.color = cc.color(170, 57, 40);
        }
        g_Lobby.m_ClubRoomCnt[ClubInfo.dwClubID] = ClubInfo.wTableCount;
        var TableCnt = g_Lobby.m_ClubRoomCnt[ClubInfo.dwClubID] ;
        if(TableCnt == null) TableCnt = 0;
        if(this.m_LbTableCnt) this.m_LbTableCnt.string = TableCnt;


        if(this.m_NdClub && this.m_NdClub1){
            this.m_NdClub.active = ClubInfo.wKindID < CLUB_KIND_2;
            this.m_NdClub1.active = ClubInfo.wKindID >= CLUB_KIND_2;
        }
        if(this.m_TogCtrl )this.m_TogCtrl.isChecked = false;
        if(ShowLobbyClub && ClubInfo.ClubID == ShowLobbyClub) {
            //ShowLobbyClub = 0;
            if(this.m_TogCtrl) this.m_TogCtrl.check();
            //this.OnBtClicked();
        }
        if(this.$('NdClub/type@Label')) this.$('NdClub/type@Label').string = ClubInfo.wKindID == CLUB_KIND_0?'普通场':'比赛场';
        this.UpdateClubSel();
        this.setDefTog();
    },
    UpdateClubSel:function(ClubID){
        //this.m_TogCtrl.isChecked = (this.m_ClubInfo.ClubID == ClubID);
        if(g_Lobby.m_RoomArr == null) return
        var RoomArr = g_Lobby.m_RoomArr;
        var RoomInfo = null;
        for(var i=0;i<RoomArr.wClubCnt;i++){
            if(RoomArr.RoomInfo[i].dwClubID == this.m_ClubInfo.ClubID){
                RoomInfo = RoomArr.RoomInfo[i];
                break;
            }
        }

        if(RoomInfo && this.$('score@Label')){
            var dwRules = RoomInfo.dwRules;
            var dwServerRules = RoomInfo.dwServerRules;
            var gamedef = new window['CMD_GAME_'+RoomInfo.wKindID]();
            this.$('score@Label').string = gamedef.GetBaseScore(dwServerRules, dwRules);
            this.$('rule@Label').string = gamedef.GetGameMode(dwServerRules, dwRules);
            this.$('pay@Label').string = gamedef.GetPayMode(dwServerRules, dwRules);
            this.$('subroom@Label').string = gamedef.GetGameCount(dwServerRules, dwRules);
            this.$('people@Label').string = RoomInfo.byPlayerCnt;
        }
    },
    OnBtClicked:function(){
        //if(this.m_Hook == null) return;
        //if(this.m_TogCtrl.isChecked) return;
        //this.m_Hook.OnChangeClub(this.m_ClubInfo);
        if(g_Lobby == null) return;
        this.m_Hook.node.active = false;
        g_Lobby.OnChangeClub(this.m_ClubInfo);
    },
    OnBtClickExit:function(){
        if(this.m_Hook == null) return;
        this.m_Hook.OnExitClub(this.m_ClubInfo);
    },
    OnClick_BtShare:function(){
        this.m_Hook.m_SelClubInfo = this.m_ClubInfo;
        this.m_Hook.OnBtShare();
    },
    OnTogClick:function(){
        var tagSelected = this.$('Tog@Toggle').isChecked;
        if(this.m_ClubInfo.wKindID < CLUB_KIND_2){
            window.SaveSetting(window.SetKey_CLUB_DEF1, parseInt(tagSelected?this.m_ClubInfo.dwClubID:0));
            window.g_Setting[window.SetKey_CLUB_DEF1] = tagSelected?this.m_ClubInfo.dwClubID:0;
        }else{
            window.SaveSetting(window.SetKey_CLUB_DEF2, parseInt(tagSelected?this.m_ClubInfo.dwClubID:0));
            window.g_Setting[window.SetKey_CLUB_DEF2] = tagSelected?this.m_ClubInfo.dwClubID:0;
        }
        this.m_Hook.UpdateDefTog();
    },
    setDefTog:function(){
        if(this.m_ClubInfo.wKindID < CLUB_KIND_2){
            this.$('Tog@Toggle').isChecked = window.g_Setting[window.SetKey_CLUB_DEF1] == this.m_ClubInfo.dwClubID;
        } else{
            this.$('Tog@Toggle').isChecked = window.g_Setting[window.SetKey_CLUB_DEF2] == this.m_ClubInfo.dwClubID;
        }
    }
/////////////////////////////////////////////////////////////////////////////
});
