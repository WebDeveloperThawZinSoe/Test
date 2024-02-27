cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdUserFind:cc.EditBox,
        m_LbAllScore:cc.Label,
    },
    ctor:function () {
        this.m_ClubID = 0;
        this.HIDE_ID = 1;
        this.TOOGLE_CNT = 3;
        this.m_WaitJoinCount = 0;
        this._page = 1;
        this._totalPage = 1;
        this._lvl = 0;
    },
    OnShowView:function(Tag, bOldData){
        if(bOldData == null) this.m_ClubID = this.m_Hook.m_SelClubInfo.dwClubID;
        this.m_ClubLevel = this.m_Hook.m_SelClubInfo.cbClubLevel;

        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubUserPre', this);

        this.$(`Type/1`).active = this.m_ClubLevel >= CLUB_LEVEL_MANAGER;
        this.$(`Type/2`).active = this.m_ClubLevel == CLUB_LEVEL_OWNER;
        //this.m_bClickToggle = true;
        this.$(`0/BtBack`).active = false;

        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE|FILTER_MENU_LEVEL,function(o){
                this._lvl = o.l;
                this._page = o.p;
                this.m_bClickToggle = true;
            }.bind(this),cc.Vec2(420,-280));
        }.bind(this));

    },
    OnHideView:function(){
        this.node.active = false;
        this.m_EdUserFind.string = '';
    },
    GetSelUserStr:function(){
        if(this.m_EdUserFind && this.m_EdUserFind.node.active){
            return this.m_EdUserFind.string;
        }
        return "";
    },
    OnChangeSelShowUserList:function(Tag, Num){
        if(Num == 0 && cc.sys.isNative) return
        this.OnShowView(null, true);
    },

    SetClubList: function(UserMap){
        var findStr = this.GetSelUserStr();
        var bShowFullID = this.m_Hook.m_SelClubInfo.ClubLevel>=CLUB_LEVEL_MANAGER || (this.m_Hook.m_SelClubInfo.Rules & this.HIDE_ID) == 0 ;
        var UserInfoArr = [];
        for(var Lv = CLUB_LEVEL_OWNER; Lv >= CLUB_LEVEL_MEMBER; Lv--){
            for(var i in UserMap){
                if(Lv != UserMap[i][1]) continue;
                var UserID = UserMap[i][0];
                if(findStr != '' && g_GlobalUserInfo.m_UserInfoMap[UserID] != null){
                    var Name = g_GlobalUserInfo.m_UserInfoMap[UserID].NickName;
                    var ID = g_GlobalUserInfo.m_UserInfoMap[UserID].GameID+'';
                    if(Name.indexOf(findStr)<0 && ID.indexOf(findStr)<0) continue
                }
                UserInfoArr.push([i, UserID, UserMap[i][1], UserMap[i][2], bShowFullID]);

                //this.m_ListCtrl.InsertListInfo(0, [i, UserID, UserMap[i][1], UserMap[i][2], bShowFullID]);
            }
        }
        if(UserInfoArr.length>0)this.m_ListCtrl.InsertListInfoArr(UserInfoArr);

    },
    //俱乐部成员
    OnBtShowSelEdit:function(){
        if(this.m_EdUserFind == null) return;
        this.m_EdUserFind.node.active = true;
    },
    OnBtShowUserDel: function(){
        this.m_bShowDel = true;
        this.m_ListCtrl.ForEachCtrl(0, function(Js){
            Js.ShowDelBt();
        });
    },
    ShowUserInfo:function(UserID,Level){
        this.m_Hook.ShowUserInfo(UserID,Level,this.m_ClubID);
        this.HideView();
    },

    OnBtWaitJoinAll:function(_,Level){
        if(this.m_WaitJoinCount == 0) return;
        window.gClubClientKernel.onSendSetAllJoin(this.m_Hook.m_SelClubInfo.dwClubID,Level);
    },

    OnOpClubUserLv:function(UserID, Level){
        this.m_Hook.OnOpClubUserLv(UserID, Level);
    },
    OnUpdateUserList:function(type){
        this.m_Hook.UpdateUserList(false);
        this.$(`Type/${type}@Toggle`).check();
    },
    onClickToggle:function(){
        this.m_bClickToggle = true;
        cc.gSoundRes.PlaySound('Button');
    },

    update:function (dt) {
        if(this.m_bClickToggle == null) return
        this.m_bClickToggle = null;
        var type = 0;
        for(var i = 0;i<this.TOOGLE_CNT;i++){
            if(this.$(`Type/${i}@Toggle`).isChecked) type = i;
            this.$(`${i}`).active = false;
        }
        //type = 1;
        this.$(`${type}`).active = true;
        this.m_ListCtrl.InitList(type, 'ClubUserPre');
        this._filter.node.active = type == 0;
        var webUrl ='';
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (type == 0) {
            webUrl = window.PHP_HOME + '/League.php?&GetMark=103&dwUserID=' + pGlobalUserData.dwUserID;
            webUrl += '&dwClubID=' + this.m_ClubID;
            webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
            webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
            webUrl += `&lvl=${this._lvl}`;
            WebCenter.GetData(webUrl, 0, function (data) {
                if (data == '') return;
                var Res = JSON.parse(data);
                if (Res.length == 0) return;
                this._totalPage = Math.ceil(Res[0][5] / window.PAGE_ITEM_CNT);
                this._filter.SetPageTotalCnt(this._totalPage,this._page);
                for (var i = 0; i < Res.length; i++) {
                    var onlineUser = window.gClubClientKernel.OnGetOnlineUser(Res[i][0]);
                    Res[i][10] = onlineUser ? onlineUser.cbUserStatus : -1;
                    this.m_ListCtrl.InsertListInfo(type, [type, this, Res[i]]);
                }
            }.bind(this));
            this.$('0/EdID@EditBox').string = '';
            this.$(`0/BtSearch`).active = true;
        }else if(type == 1){
            webUrl = window.PHP_HOME+'/League.php?&GetMark=7&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += '&ClubID='+this.m_ClubID;
            WebCenter.GetData(webUrl, 0, function (data) {
                var UserMap = JSON.parse(data);
                for(var i = 0; i < UserMap[2].length;i++){
                    var UserID = UserMap[2][i];
                    this.m_WaitJoinCount = UserMap[2].length; 
                    this.m_ListCtrl.InsertListInfo(type, [type,this, UserID, CLUB_LEVEL_APPLY]);
                }
            }.bind(this));
        }
        else{
            webUrl = window.PHP_HOME+'/League.php?&GetMark=104&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += '&dwClubID='+this.m_ClubID;
            WebCenter.GetData(webUrl, 0, function (data) {
                var Res = JSON.parse(data);
                for(var i = 0; i < Res.length;i++){
                    this.m_ListCtrl.InsertListInfo(type, [type,this, Res[i]]);
                }
            }.bind(this));
            this.$('2/EdID@EditBox').string = '';
        }
    },

    OnBtSearchUser:function(){
        cc.gSoundRes.PlaySound('Button');
        var strUserID = this.$('0/EdID@EditBox').string;
        if (strUserID == '') {
            this.ShowTips('不能为空');
            return;
        }
        this._page = 1;
        var type = 0;//0 ID 查询 1- 昵称模糊查询

        if(parseInt(strUserID) == NaN || strUserID.length != 6){
            type = 1;
        }

        this.m_ListCtrl.InitList(0, 'ClubUserPre');

        this.$(`0/BtBack`).active = true;
        this.$(`0/BtSearch`).active = false;
        this._filter.SetPageTotalCnt(1,1);

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/League.php?&GetMark=140&dwUserID=' + pGlobalUserData.dwUserID;
        webUrl += '&dwClubID=' + this.m_ClubID;
        webUrl += `&NickName=${type==1?strUserID:''}`;
        webUrl += `&GameID=${type==0?parseInt(strUserID):0}`;
        webUrl += `&type=${type}`;
        WebCenter.GetData(webUrl, 0, function (data) {
            if (data == '') return;
            var Res = JSON.parse(data);
            for (var i = 0; i < Res.length; i++) {
                var onlineUser = window.gClubClientKernel.OnGetOnlineUser(Res[i][0]);
                Res[i][10] = onlineUser ? onlineUser.cbUserStatus : -1;
                this.m_ListCtrl.InsertListInfo(0, [0, this, Res[i]]);
            }
        }.bind(this));
    },
    OnBtBack:function(){
        cc.gSoundRes.PlaySound('Button');
        this.$('0/EdID@EditBox').string = '';
        this.m_bClickToggle = true;
        this.$(`0/BtBack`).active = false;
        this.$(`0/BtSearch`).active = true;
    },
    OnBtAddAdmin:function(){
        cc.gSoundRes.PlaySound('Button');
        var strGameID = this.$('2/EdID@EditBox').string;
        if(strGameID == ''){
            this.ShowTips('ID不能为空！');
            return;
        }
        var self = this;
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+strGameID;
        WebCenter.GetData(webUrl, null, function (data) {
            if(data == '') return this.ShowTips('查无此人！')
            var UserInfo = JSON.parse(data);
            webUrl = window.PHP_HOME+'/League.php?GetMark=134&dwClubID='+this.m_ClubID+'&dwUserID='+UserInfo.UserID;
            WebCenter.GetData(webUrl, null, function (data) {
                if(data == '') return this.ShowTips('查无此人！')
                var obj = JSON.parse(data);
                var strMsg = '';
                if(obj.ClubLevel == CLUB_LEVEL_PARTNER){
                    strMsg = '该玩家身份为合伙人不允许被设置为管理员。';
                }else if(obj.ClubLevel >= CLUB_LEVEL_MANAGER){
                    strMsg = '该玩家身份已经是管理员，不能重复设置。';
                }else{
                    strMsg = '被设置为管理员的玩家将被从任意合伙人关系中抽出，不参与合伙人分润，是否继续操作？';
                }
                self.ShowAlert(strMsg,Alert_YesNo,function(Res){
                    if(obj.ClubLevel<CLUB_LEVEL_PARTNER && Res){
                        self.OnOpClubUserLv(UserInfo.UserID, CLUB_LEVEL_MANAGER);
                    }
                })
            })
        }.bind(this));

    },
    onUpdateUserList:function(){
        this.m_bClickToggle = true;
    },
    /////////////////////////////////////
    //Pre

});
