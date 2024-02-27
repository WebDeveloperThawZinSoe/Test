cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.$('@UserCtrl');
        this.m_UserCtrl.SetUserByID(0);
        this.$('YRevence@Label').string='0%';
        this.$('Y&TDraw@Label').string='0';
        this.$('Rate&TRevence@Label').string='0';
        this.$('T&YRevence@Label').string='0';
        this.$('YWinner@Label').string='0';
        this.$('YScore@Label').string='0';
        //删除
        this.m_NdDel = this.$('Layout/BtDel');
        if( this.m_NdDel ) this.m_NdDel.active = false;
        //旗下普通玩家
        this.m_NdInfo = this.$('Layout/BtInfo');
        if( this.m_NdInfo ) this.m_NdInfo.active = false;
        //旗下
        this.m_NdLeadList = this.$('Layout/BtLeadList');
        if( this.m_NdLeadList ) this.m_NdLeadList.active = false;

        this.m_MaxLv = CLUB_LEVEL_OWNER;
        this.m_MinLv = CLUB_LEVEL_MEMBER;

        this.node.active = false;
        this._bChangeRate = false;
    },
    SetPreInfo:function(ParaArr){//idArr[i], ShowLv, FindID
        this.m_UserID = ParaArr[1][0][0];
        this.m_LeaderID = this.m_Hook.m_dwLeaderID;
        this.m_ClubID = this.m_Hook.m_SelClubInfo.dwClubID;
        this.m_ClubLv = this.m_Hook.m_SelClubInfo.cbClubLevel;
        this.m_UserLv = CLUB_LEVEL_MEMBER;
   
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=61&dwUserID='+this.m_UserID;
        webUrl += '&dwClubID='+this.m_ClubID+'&dwLeaderID='+this.m_LeaderID;
        WebCenter.GetData(webUrl, 1, function (data) {//GameID ClubLv Rate Score
            var InfoArr = JSON.parse(data);
            this.m_UserLv = InfoArr[1];
            //列表筛选等级
            if(InfoArr[1]==null || InfoArr[1]>this.m_MaxLv || InfoArr[1]<this.m_MinLv) return
            //筛选查找ID
            //if(ParaArr[2]!='' && (InfoArr[0]+'').indexOf(ParaArr[2])<0) return
            this.node.active = true;
            this.m_TagClubLv = InfoArr[1];
            if (this.m_UserCtrl) {
                this.m_UserCtrl.SetUserByID(this.m_UserID);
            }

            this.$('YRevence@Label').string=Score2Str(parseInt(InfoArr[6]));
            this.$('Y&TDraw@Label').string=parseInt(InfoArr[7])+'\n'+parseInt(InfoArr[8]);
            this.$('Rate&TRevence@Label').string=InfoArr[2]+'%'+'\n'+Score2Str(parseInt(InfoArr[5]));
            this.$('T&YRevence@Label').string=Score2Str(parseInt(InfoArr[4]))+'\n'+Score2Str(parseInt(InfoArr[3]));
            this.$('YWinner@Label').string=InfoArr[9];
            this.$('YScore@Label').string=Score2Str(parseInt(InfoArr[10]));
            this.$('ScoreInfo@Label').string=Score2Str(parseInt(InfoArr[11]))+'\n'+Score2Str(parseInt(InfoArr[12]));

            if(this.m_UserID == ParaArr[1][1]){
                this.m_NdInfo.active = true;
            }else{
                //解除关系   (部长名下普通成员无删除)
                if(this.m_NdDel) this.m_NdDel.active = (InfoArr[1]==CLUB_LEVEL_PARTNER);
                //旗下普通玩家
                if(this.m_NdInfo && InfoArr[1]>CLUB_LEVEL_MEMBER) this.m_NdInfo.active = true;
                //旗下
                if(this.m_NdLeadList && InfoArr[1]>CLUB_LEVEL_MEMBER) this.m_NdLeadList.active = true;
            }

            this._bChangeRate = InfoArr[1]>=CLUB_LEVEL_PARTNER;
          
        }.bind(this));
    },
    //详情
    OnClick_ShowUserScore:function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.OnShowMemberInfo(this.m_UserID, this.m_UserLv);
    },
    //调整比率
    OnClick_ChangeRate:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_UserID == pGlobalUserData.dwUserID) return;
        if(this._bChangeRate == false) return;
        if(this.m_LeaderID!=pGlobalUserData.dwUserID) return;
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.SetLeaderRate(this.m_UserID);
    },
    //旗下
    OnClick_ShowUserPartnerInfo:function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.OnShowPartnerInfo(this.m_UserID, this.m_TagClubLv);
    },
    //旗下玩家
    OnClick_ShowUserPartnerList:function(_,data){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.OnShowPartnerList(data,this.m_UserID,this.m_UserCtrl.m_LabID.string);
    },
    //删除
    OnClick_BtDel:function(){
        cc.gSoundRes.PlaySound('Button');
        if(this.m_TagClubLv == 3){
            this.m_Hook.ShowAlert('是否确认移除玩家？确认后玩家将成为盟主成员',Alert_YesNo,function(Res){
                if(Res) this.m_Hook.DelFromLeader(this.m_UserID);
            }.bind(this));
        }else{
            var webUrl = window.PHP_HOME+ '/League.php?GetMark=103&dwUserID='+this.m_UserID;
            webUrl += '&dwClubID='+g_ShowClubInfo.dwClubID;
            webUrl += `&start=1`;
            webUrl += `&end=10`;
            webUrl += `&lvl=0`;
            WebCenter.GetData(webUrl, null, function (data) {
                var Res = JSON.parse(data);
                if(Res.length>1){
                    g_Lobby.ShowTips("该玩家有下级玩家，不能删除！");
                }else{
                    this.m_Hook.ShowAlert('是否确认将玩家降为普通成员？',Alert_YesNo,function(Res){
                        if(Res) {
                            this.m_Hook.OnOpClubUserLv(this.m_UserID, CLUB_LEVEL_MEMBER);
                        }
                    }.bind(this))
                }
            }.bind(this));
        }
    },
});
