cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_bNeedUpdate = false;
        this._page = 1;
        this._totalPage = 1;
        this._searchID = 0;
    },
    onLoad:function(){
        this.$('BtBack').active = false;
    },

    OnShowSubData:function (type,UserID,GameID, ClubLv, DlgLv) {
        if(UserID){
            this.m_SelClubInfo = this.m_Hook.m_SelClubInfo;
            this.m_DlgLevel = DlgLv;
            this.m_dwClubID = this.m_SelClubInfo.dwClubID;
            this.m_dwLeaderID = UserID;
            this.m_dwLeaderGameID = GameID;
            this.m_ClubLv = ClubLv;
            this.$('EditBox@EditBox').string = '';
            this.m_Type = type;
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //this.$('BtGet').active = ( this.m_dwLeaderID == pGlobalUserData.dwUserID);

        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubPartnerPre', this);
        //自己旗下合伙人
        this.$('LeaderID@Label').string = GameID;

        this.$('BtInvite').active = pGlobalUserData.dwGameID == GameID;
        this.$('BtSetLeader').active = pGlobalUserData.dwGameID != GameID;

        if(type == 0){
   
            cc.gPreLoader.LoadRes('Image_ClubPartner_T-xiashuhehuoren','Club',function (spriteFrame) {
                this.$('BGB/TBillList@Sprite').spriteFrame = spriteFrame;
            }.bind(this));
            
            this.$('ScrollView/view/content/ClubUserPre/YWinner').active = false;
            this.$('ScrollView/view/content/ClubUserPre/YScore').active = false;
            this.$('ScrollView/BGTitle2/t6').active = true;
            this.$('ScrollView/BGTitle2/t7').active = false;
            this.$('ScrollView/BGTitle2/t8').active = false;
        }
        else{
            this.$('ScrollView/view/content/ClubUserPre/Layout').active = false;
            this.$('ScrollView/view/content/ClubUserPre/YWinner').active = true;
            this.$('ScrollView/view/content/ClubUserPre/YScore').active = true;
            this.$('ScrollView/BGTitle2/t6').active = false;
            this.$('ScrollView/BGTitle2/t7').active = true;
            this.$('ScrollView/BGTitle2/t8').active = true;
            cc.gPreLoader.LoadRes('Image_ClubPartner_T-xiashuwanjia','Club',function (spriteFrame) {
                this.$('BGB/TBillList@Sprite').spriteFrame = spriteFrame;
            }.bind(this));
        }

        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE,function(o){
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-280));
        }.bind(this));

    },
    OnShowInfor:function(type,UserID){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        
        var webUrl = window.PHP_HOME+'/League.php?GetMark=67&dwUserID='+this.m_dwLeaderID+'&dwClubID='+this.m_dwClubID;
        webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
        webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
        webUrl += `&searchID=${this._searchID}`;
        webUrl += `&type=${type}`;
        WebCenter.GetData(webUrl, 1, function (data) {
            this.m_ListCtrl.InitList(0, 'ClubPartnerPre', this);
            var idArr = JSON.parse(data);
            this._inforArr = [];
            for(var i = 0; i<idArr.length; i++ ){
                if (idArr.length > 0) this._totalPage = Math.ceil(idArr[0][5] / window.PAGE_ITEM_CNT);
                else this._totalPage = 1;
                this._filter.SetPageTotalCnt(this._totalPage,this._page);

                this._inforArr = [];
                for(var i = 0; i<idArr.length; i++ ){
                    this._inforArr.push([idArr[i],UserID]);
                }
                //this.m_ListCtrl.InsertListInfo(0,  [idArr[i],UserID]);
            }
            this.m_ListCtrl.InsertListInfoArr(0,this._inforArr);
        }.bind(this));
    },
    //显示玩家信息
    OnShowMemberInfo: function(UserID, ClubLv){
        this.ShowPrefabDLG('ClubUserScore', this.node, function(Js){
            Js.OnShowClubUser(UserID, this.m_dwClubID, ClubLv);
        }.bind(this));
    },
    //显示玩家合伙人详情
    OnShowPartnerInfo: function(UserID, Lv){
        if(Lv < CLUB_LEVEL_PARTNER) return
        this.ShowPrefabDLG('ClubPartner', this.node, function(Js){
            Js.OnShowSubData(UserID, Lv, this.m_DlgLevel+1);
        }.bind(this));
    },

    //调配成员
    OnClick_BtSetLeader: function(){
        this.ShowPrefabDLG('ClubInput',this.node,function(Js){
            Js.OnSetRetunIndex(6,'成员ID', function(ID){
                this.ReSetUserLeader(ID, this.m_dwLeaderID);
            }.bind(this));
        }.bind(this));
    },

    OnShowPartnerList:function(type,UserID,GameID){
        this.ShowPrefabDLG('ClubPartner', this.node, function(Js){
            Js.OnShowSubData(type,UserID,GameID);
        }.bind(this));
    },

    //邀请玩家
    OnClick_BtInvate:function(){
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Self=this;
        this.ShowPrefabDLG('ClubInput',this.node,function(Js){
            Js.OnSetRetunIndex(3,'邀请玩家ID',function(ID){
                var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+ID;
                WebCenter.GetData(webUrl, null, function (data) {
                    var Res = JSON.parse(data)
                    window.gClubClientKernel.onSendSetClubUserLvL(Res['UserID'],Self.m_Hook.m_SelClubInfo.dwClubID,CLUB_LEVEL_MEMBER);
                });
            });
        });
    },

     //搜索
     OnBtSearch: function(){
        cc.gSoundRes.PlaySound('Button');
        var strGameID = this.$('EditBox@EditBox').string;
        if(strGameID==''){
            this.ShowTips('ID不能为空!');
            return ;
        }
        this.$('BtBack').active = !this.$('BtBack').active;
        this.$('BtFind').active = !this.$('BtFind').active;
        this._searchID = parseInt(strGameID);
        this._page = 1;
        this.m_bNeedUpdate = true;
    },
    //返回
    OnBtBack: function(){
        cc.gSoundRes.PlaySound('Button');
        this.$('EditBox@EditBox').string = '';
        this.$('BtBack').active = !this.$('BtBack').active;
        this.$('BtFind').active = !this.$('BtFind').active;
        this._searchID = 0;
        this.m_bNeedUpdate = true;
    },

    //添加合伙人
    OnClick_BtAddLeader: function(){
        var LeaderLv = 6;
        var self = this;
        this.ShowPrefabDLG('ClubInput',this.node,function(Js){
            Js.OnSetRetunIndex(4,'玩家ID',function(ID){
                self.OnGameIDSetClubLv(ID, LeaderLv);
            });
        }.bind(this));
    },

    ReSetUserLeader:function (ID, LeaderID) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?GetMark=33&dwUserID='+pGlobalUserData.dwUserID;
        webUrl+='&dwGameID='+ID+'&ClubID='+this.m_dwClubID+'&LeaderID='+LeaderID;
        WebCenter.GetData(webUrl, null, function (data) {
            this.ShowAlert(data);
            WebCenter.SetDataOutTime('League.php?GetMark=60');
            this.m_bNeedUpdate = true;
        }.bind(this));
    },

    DelFromLeader:function (UserID) {
        //this.ShowAlert('是否确认移除玩家？确认后玩家将成为盟主成员',Alert_YesNo,function(Res){
          //  if(Res){
                var GameID = g_GlobalUserInfo.m_UserInfoMap[UserID].GameID;
                this.ReSetUserLeader(GameID, this.m_SelClubInfo.CreaterID);
            //}
        //}.bind(this))
    },
    OnGameIDSetClubLv:function (GameID, Lv) {
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+GameID;
        WebCenter.GetData(webUrl, null, function (data) {
            if(data == '') return this.ShowTips('查无此人！')
            var UserInfo = JSON.parse(data);
            this.OnOpClubUserLv(UserInfo.UserID, Lv,OPERATE_CODE_SET,function(){
                this.m_bNeedUpdate = true;
            }.bind(this));
        }.bind(this));
    },
    //设置合伙人比率
    SetLeaderRate:function(UserID){
        // this.$('ClubReta').active = true;
        // this.m_RetaUserID = UserID;
        // this.$('ClubReta/BGM/EditBox@EditBox').string = '';
        // this.$('ClubReta/BGM/InputNum@Label').string = '';
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.ShowPrefabDLG('ClubInput',this.node,function(Js){
            Js.OnSetRetunIndex(1,'1-100之间的有效比率', function(Res){
                if(Res >= 0 && Res <= 100){
                    var webUrl = window.PHP_HOME+'/League.php?GetMark=35&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_dwClubID;
                    webUrl += '&LeaderID='+UserID+'&Rate='+Res;

                    WebCenter.GetData(webUrl, null, function (data) {
                        this.ShowAlert(data);
                        WebCenter.SetDataOutTime('GetMark=61');
                        this.m_bNeedUpdate = true;
                    }.bind(this));
                }else{
                    return this.ShowAlert('请输入1-100之间的有效数字');
                }
            }.bind(this));
        }.bind(this));
    },


    OnClick_GetScore:function(){
        this.m_Hook.OnBtShowDlg(null, 'ClubGetScore');
    },
    OnClick_ChangeRateList:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ClubRateList',this.node,function(Js){
            Js.OnLoadData(this.m_dwLeaderID);
        }.bind(this));
    },
    OnClick_ShowUserRevenueList:function () {
        this.m_Hook.OnShowRevenueList(this.m_dwLeaderID);
    },
    OnShowRevenueList:function (LeaderID) {
        this.m_Hook.OnShowRevenueList(LeaderID);
    },
//////////////////////////////////////////////////////////中转
    //成员等级调整
    OnOpClubUserLv:function (UserID, Lv,Code,CallBack) {
        this.m_Hook.OnOpClubUserLv(UserID, Lv,Code, CallBack);
    },
    //俱乐部赠送
    OnGiveScore:function(UserID, Type, Score) {
        this.m_Hook.OnGiveScore(UserID, Type, Score);
    },
    //俱乐部下分
    OnTakeScore:function(UserID, Type, Score) {
        this.m_Hook.OnTakeScore(UserID, Type, Score);
    },
    OnBtClickRetaNum:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        if(Data == 'Reset'){        //重置
            this.$('ClubReta/BGM/EditBox@EditBox').string = '';
            this.$('ClubReta/BGM/InputNum@Label').string = '';
        }else{
            if(this.$('ClubReta/BGM/InputNum@Label').string.length >= 3) return                //0-9
            this.$('ClubReta/BGM/InputNum@Label').string += Data;
        }
        //this.$('ClubReta/BGM/EditBox@EditBox').string = this.$('ClubReta/BGM/InputNum@Label').string;
    },
    OnBtClickCloseRetaNode:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.$('ClubReta/BGM/InputNum@Label').string = '';
        this.$('ClubReta').active = false;
    },
    OnBtClickRetaSure:function(){
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(parseInt(this.$('ClubReta/BGM/InputNum@Label').string) >= 0 && parseInt(this.$('ClubReta/BGM/InputNum@Label').string) <= 100){
            var webUrl = window.PHP_HOME+'/League.php?GetMark=35&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_dwClubID;
            webUrl += '&LeaderID='+this.m_RetaUserID+'&Rate='+parseInt(this.$('ClubReta/BGM/InputNum@Label').string);
            WebCenter.GetData(webUrl, null, function (data) {
                this.ShowAlert(data);
                WebCenter.SetDataOutTime('GetMark=61');
                this.m_bNeedUpdate = true;
                this.$('ClubReta').active = false;
            }.bind(this));
        }else{
            return this.ShowAlert('请输入1-100之间的有效数字');
        }

    },
    update:function(){
        if(this.m_bNeedUpdate == false) return;
        this.m_bNeedUpdate = false;
        this.OnShowInfor(this.m_Type, this.m_dwLeaderID,this.m_dwLeaderGameID);
    },

});
