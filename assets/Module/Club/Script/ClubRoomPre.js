cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabGame: cc.Label,
        m_LabRules: cc.Label,
        m_LabRoom: cc.Label,
        m_LabProgress: cc.Label,
        m_LabTime: cc.Label,
        m_ChairNode: cc.Node,
        m_BtInfoNode: cc.Node,
    },
    ctor: function () {
        this.m_ChairCtrl = new Array();
        this.m_CurCount = 0;
        this.m_TotalCount =0;
        this.m_RoomLabInfor = {};
    },
    Init:function(){
        this.InitPre();
    },
    SetData:function(data){
        this.SetPreInfo(data);
    },

    SetIndex:function(index){
        this.$('InfoNode/LbIndex@Label').string = pad(index, 2);
    },

    InitPre: function () {
        this.m_BtInfoNode.active = false;
        for (var i = 0; i < this.m_ChairNode.childrenCount; i++) {
            if (this.m_ChairCtrl[i] == null) this.m_ChairCtrl[i] = this.$(i + '@UserCtrl', this.m_ChairNode);
            this.m_ChairCtrl[i].SetUserByID(0);
            this.m_ChairCtrl[i].node.active = false;
        }
    },
    SetPreInfo: function (ParaArr) {
        this.SetRoomInfo(ParaArr[0], ParaArr[1]);
    },
    SetRoomInfo: function (RoomInfo, RoomIndex) {
        // ServerRoomInfo
        //console.log(RoomInfo)
        this.m_RoomLabInfor = {};
        this.m_RoomInfo = RoomInfo;
        this.m_LabGame.string = window.GameList[RoomInfo.wKindID];
        this.m_GameDef = new window['CMD_GAME_' + RoomInfo.wKindID]();
        this.m_CurCount = RoomInfo.byPlayerCnt;
        this.m_PlayerCnt = this.m_GameDef.GetPlayerCount(RoomInfo.dwServerRules, RoomInfo.dwRules);
        this.m_LabRules.string = this.m_GameDef.GetRulesStr(RoomInfo.dwServerRules, RoomInfo.dwRules);
        this.m_LabProgress.string = this.m_GameDef.GetProgress(RoomInfo.wProgress, RoomInfo.dwServerRules, RoomInfo.dwRules);
        this.m_LabRoom.string = RoomInfo.dwRoomID;
        this.m_LabTime.string = Time2Str(RoomInfo.dwCreateTime);

        this.m_RoomLabInfor.GameName = this.m_LabGame.string;
        if(RoomInfo.wKindID == 21062) this.m_RoomLabInfor.GameName = this.m_GameDef.GetGameMode(RoomInfo.dwServerRules, RoomInfo.dwRules);
        this.m_RoomLabInfor.RoomNum = this.m_LabRoom.string;
        this.m_RoomLabInfor.GameRule = this.m_LabRules.string;
        this.m_RoomLabInfor.RoomRule = this.GetRoomRuleStr(RoomInfo);

        //GameDef.GetBaseScoreStr(ServerRules, GameRules);
        var cellScore = 1;
        if(this.m_GameDef.GetBaseScoreStr){
            cellScore = this.m_GameDef.GetBaseScoreStr(RoomInfo.dwServerRules, RoomInfo.dwRules);
        }
        this.$('InfoNode/LbScore@Label').string = "底分 " + cellScore;

        this.$('InfoNode/LbPlayer@Label').string = "" + RoomInfo.byPlayerCnt + '/' + this.m_PlayerCnt;
        if(RoomInfo.byPlayerCnt == this.m_PlayerCnt) this.$('InfoNode/LbPlayer@Label').string = '客满';
        //this.$('InfoNode/LbGame@Label').string = this.m_GameDef.GetGameCount(RoomInfo.dwServerRules,RoomInfo.dwRules);
        this.$('InfoNode/LbIndex@Label').string = pad(RoomIndex, 2);
        //this.$('InfoNode/LbState@Label').string = (RoomInfo.wProgress > 0?"游戏中":"等待中");
        //this.$('InfoNode/spWaiting').active = (RoomInfo.wProgress == 0);
        //this.$('InfoNode/spGameing').active = (RoomInfo.wProgress > 0);
        var strMode = '';
        if(this.m_GameDef.GetGameMode){
            strMode = `${window.GameList[RoomInfo.wKindID]}(${this.m_GameDef.GetGameMode(RoomInfo.dwServerRules, RoomInfo.dwRules)})`; 
        }else{
            strMode = window.GameList[RoomInfo.wKindID];
        }
        this.$('InfoNode/LbModel@Label').string = strMode;

        this.$('InfoNode/LbTag@Label').string = RoomInfo.szTag;
        //this.$('InfoNode/LbRoomID@Label').string = RoomInfo.dwRoomID;


        // for (var i in this.m_ChairCtrl) {
        //     this.m_ChairCtrl[i].SetUserByID(0);
        //     this.$('Layout/' + i + '/Nick@Label').string = '';
        //     this.m_ChairCtrl[i].node.active = i < this.m_PlayerCnt;//this.m_GameDef.GetPlayerCount(RoomInfo.dwServerRules,RoomInfo.dwRules);
        // }
        this.UpdateRoomUser();
        this.OnSetRoomView();
    },
    OnSetRoomView: function () {
        cc.gPreLoader.LoadRes(`Image_ClubDLG_Table${0}${this.m_PlayerCnt}`, 'Club', function(res) {
            this.$('BGTable@Sprite').spriteFrame = res;
        }.bind(this));

        if (this.m_PlayerCnt == 2) {   //2人
            this.$('Layout/0').setPosition(-162, 2);
            this.$('Layout/1').setPosition(162, 2);
        }else if(this.m_PlayerCnt == 3){
            this.$('Layout/0').setPosition(-162, 2);
            this.$('Layout/1').setPosition(0, -90);
            this.$('Layout/2').setPosition(162, 2);
        }
        else if(this.m_PlayerCnt == 4){
            this.$('Layout/0').setPosition(-162, 2);
            this.$('Layout/1').setPosition(-70, -90);
            this.$('Layout/2').setPosition(70, -90);
            this.$('Layout/3').setPosition(162, 2);
        }
        else if(this.m_PlayerCnt == 5){
            this.$('Layout/0').setPosition(-165, 40);
            this.$('Layout/1').setPosition(-127, -75);
            this.$('Layout/2').setPosition(0, -90);
            this.$('Layout/3').setPosition(127, -75);
            this.$('Layout/4').setPosition(165, 40);
        }
        else if (this.m_PlayerCnt == 6) {   //6人
            this.$('Layout/0').setPosition(-165, 40);
            this.$('Layout/1').setPosition(-146, -61);
            this.$('Layout/2').setPosition(-45, -90);
            this.$('Layout/3').setPosition(45, -90);
            this.$('Layout/4').setPosition(146, -61);
            this.$('Layout/5').setPosition(165, 40);
        }else if (this.m_PlayerCnt == 7) {   //7人
            this.$('Layout/0').setPosition(-143, 70);
            this.$('Layout/1').setPosition(-164, -15);
            this.$('Layout/2').setPosition(-112, -80);
            this.$('Layout/3').setPosition(0, -90);
            this.$('Layout/4').setPosition(112, -80);
            this.$('Layout/5').setPosition(164, -15);
            this.$('Layout/6').setPosition(143, 70);
        } else if (this.m_PlayerCnt <= 8) {//8人桌子样式
            this.$('Layout/0').setPosition(-138, 74);
            this.$('Layout/1').setPosition(-165, 2);
            this.$('Layout/2').setPosition(-130, -68); 
            this.$('Layout/3').setPosition(-41, -90);
            this.$('Layout/4').setPosition(41, -90);
            this.$('Layout/5').setPosition(130, -68);
            this.$('Layout/6').setPosition(165, 2);
            this.$('Layout/7').setPosition(138, 74);
        } else if (this.m_PlayerCnt <= 10) {//10人桌子样式
            this.$('Layout/0').setPosition(-98, -7);
            this.$('Layout/1').setPosition(-47, -16);
            this.$('Layout/2').setPosition(0, -16);
            this.$('Layout/3').setPosition(47, -16);
            this.$('Layout/4').setPosition(98, -7);
            this.$('Layout/5').setPosition(98, 85);
            this.$('Layout/6').setPosition(47, 95);
            this.$('Layout/7').setPosition(0, 95);
            this.$('Layout/8').setPosition(-47, 95);
            this.$('Layout/9').setPosition(-98, 85);
        }
        else if (this.m_PlayerCnt <= 12) {//10人桌子样式
            this.$('Layout/0').setPosition(-74, 90);
            this.$('Layout/1').setPosition(-137, 77);
            this.$('Layout/2').setPosition(-167, 14);
            this.$('Layout/3').setPosition(-155, -50);
            this.$('Layout/4').setPosition(-97, -88);
            this.$('Layout/5').setPosition(-31, -94);
            this.$('Layout/6').setPosition(31, -94);
            this.$('Layout/7').setPosition(97, -88);
            this.$('Layout/8').setPosition(155, -50);
            this.$('Layout/9').setPosition(167, 14);
            this.$('Layout/10').setPosition(137, 77);
            this.$('Layout/11').setPosition(74, 90);
        }
    },
    UpdateRoomUser: function () {
        var userList = this.m_Hook.m_RoomInfoMap.UserList;
        if(userList == null) return;
        for (var i in userList.UserInfo) {
            if (userList.UserInfo[i] == null) continue;
            var userInfo = userList.UserInfo[i];
            if(this.m_RoomInfo.dwRoomID != userInfo.dwRoomID)continue;
            var chairID = userInfo.wChairID;
            if(this.m_PlayerCnt == 2){
                if(chairID>1)chairID = 1;
            }
            this.m_ChairCtrl[chairID].SetUserByID(userInfo.dwUserID);
            this.m_ChairCtrl[chairID].SetShowFullName(false, 3);
            this.m_ChairCtrl[chairID].node.active =true;
        } 
    },
    UpdateUserState: function (userInfo) {
        if (userInfo.dwRoomID != this.m_RoomInfo.dwRoomID) return;
        if (!this.m_Hook.m_RoomInfoMap.UserList) return;
        this.m_UserList = this.m_Hook.m_RoomInfoMap.UserList;
        if(this.m_UserList.UserInfo[`${userInfo.dwUserID}`]){
            if (userInfo.cbUserStatus <= US_FREE) {//起立
                var chairID = this.m_UserList.UserInfo[`${userInfo.dwUserID}`].wChairID;
                if(this.m_PlayerCnt == 2){
                    if(chairID>1)chairID = 1;
                }
                this.m_ChairCtrl[chairID].SetUserByID(0);
                this.m_CurCount--;
                this.m_ChairCtrl[chairID].node.active =false;
            }
        }else{
            if (userInfo.cbUserStatus != US_LOOKON && userInfo.cbUserStatus > US_FREE ) {//区分旁观
                var chairID = userInfo.wChairID;
                if(this.m_PlayerCnt == 2){
                    if(chairID>1)chairID = 1;
                }
                this.m_ChairCtrl[chairID].SetUserByID(userInfo.dwUserID);
                this.m_ChairCtrl[chairID].SetShowFullName(false, 3);
                this.m_CurCount++;
                this.m_ChairCtrl[chairID].node.active =true;
            }
        }
        this.$('InfoNode/LbPlayer@Label').string = " " + this.m_CurCount + '/' + this.m_PlayerCnt;
        if(this.m_CurCount == this.m_PlayerCnt) this.$('InfoNode/LbPlayer@Label').string = '客满';
    },
    UpdateUser:function(userInfo){
        if(userInfo.dwRoomID != this.m_RoomInfo.dwRoomID) return;
        this['m_JsClubGameRuleSet'] && this['m_JsClubGameRuleSet'].ResetUserItem();
    },
    OnBtShowInfo: function () {
        //this.m_BtInfoNode.active = !this.m_BtInfoNode.active;
        this.ShowPrefabDLG('ClubGameRuleSet',this.m_Hook.m_Hook.node,function(Js){
            Js.OnSetInof(this.m_RoomLabInfor);
        }.bind(this));
    },
    OnBtClickEnter: function () {
        this.m_Hook.OnEnterRoom(this.m_RoomInfo.dwRoomID);
    },
    OnBtClickShare: function () {
        this.ShowPrefabDLG("SharePre", this.m_Hook.node)
    },
    //分享信息
    GetShareInfo: function () {
        var ShareInfo = new Object();
        ShareInfo.title = '【' + this.m_LabGame.string + '】 房间号：' + this.m_LabRoom.string;
        ShareInfo.desc = this.m_LabRules.string + '【同盟会ID：' + this.m_RoomInfo.dwClubID + "】";
        ShareInfo.link = cc.share.MakeLink_InviteRoom(this.m_RoomInfo.dwRoomID, this.m_RoomInfo.dwClubID);
        return ShareInfo;
    },
    OnBtClickDiss: function (view) {
        if (this.m_RoomInfo.wProgress > 0 && g_ShowClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER) {
            this.m_Hook.ShowTips("游戏已经开始！");
            return
        }
        this.m_Hook.OnDissolveRoom(this.m_RoomInfo.dwRoomID, this.m_RoomInfo.dwCreaterID, g_ShowClubInfo.cbClubLevel == CLUB_LEVEL_OWNER ? 1 : 0,view);
    },

    GetRoomRuleStr:function(roomInfo){
        var strRule = '';
        strRule+='参与分:'+Score2Str(roomInfo.llSitScore)+'  淘汰分:'+Score2Str(roomInfo.llStandScore)+'  大局赠送:';
        if(roomInfo.dwBigRevRules&CLUB_GAME_RULE_1){
            strRule+='大赢家';
        }else if(roomInfo.dwBigRevRules&CLUB_GAME_RULE_2){
            strRule+='赢家';
        }else{
            strRule+='所有人';
        }
        strRule+=' ';
        if(roomInfo.dwBigRevRules&CLUB_GAME_RULE_4){
            strRule+='固定赠送';
            strRule+='  起赠分:'+Score2Str(roomInfo.dwBigMinScore)+'  赠送分值:'+Score2Str(roomInfo.dwBigCnt)+'  小局赠送:';
        }else{
            strRule+='比例赠送';
            strRule+='  起赠分:'+Score2Str(roomInfo.dwBigMinScore)+'  赠送分值:'+roomInfo.dwBigCnt+'  小局赠送:';
        }
        //strRule+='  起赠分:'+Score2Str(roomInfo.dwBigMinScore)+'  赠送分值:'+Score2Str(roomInfo.dwBigCnt)+'  小局赠送:';

        if(roomInfo.dwSmallRevRules&CLUB_GAME_RULE_1){
            strRule+='大赢家';
        }else if(roomInfo.dwSmallRevRules&CLUB_GAME_RULE_2){
            strRule+='赢家';
        }else{
            strRule+='所有人';
        }
        strRule+=' ';
        if(roomInfo.dwSmallRevRules&CLUB_GAME_RULE_4){
            strRule+='固定赠送';
            strRule+='   起赠分:'+Score2Str(roomInfo.dwSmallMinScore)+'  赠送分值:'+Score2Str(roomInfo.dwSmallCnt)+' 模式:';
        }else{
            strRule+='比例赠送';
            strRule+='   起赠分:'+Score2Str(roomInfo.dwSmallMinScore)+'  赠送分值:'+roomInfo.dwSmallCnt+' 模式:';
        }
        //strRule+='   起赠分:'+Score2Str(roomInfo.dwSmallMinScore)+'  赠送分值:'+Score2Str(roomInfo.dwSmallCnt)+' 模式:';
        if(roomInfo.cbReturnType == 1){
            strRule+='平摊模式';
        }else if (roomInfo.cbReturnType == 2){
            strRule+='赢家模式';
        }else{
            strRule+='输赢平摊模式';
        }
        strRule+=' ';
        if(roomInfo.bNegativeScore){
            strRule+='可负分';
        }else{
            strRule+='不可负分';
        }
        strRule+='  ';
        strRule+='倍率:'+roomInfo.dwMagnification;
        strRule+='标签:'+roomInfo.szTag;

        return strRule;
    },

    UpdateRoomInfor:function(Res){
        this.m_RoomLabInfor.RoomRule = this.GetRoomRuleStr(Res);
        this.$('InfoNode/LbTag@Label').string = Res.szTag;
    },
    OnSwitchTableBG:function(index){
        cc.gPreLoader.LoadRes(`Image_ClubDLG_Table${index}${this.m_PlayerCnt}`, 'Club', function(res) {
            this.$('BGTable@Sprite').spriteFrame = res;
        }.bind(this));
    }
    // update (dt) {},

});
