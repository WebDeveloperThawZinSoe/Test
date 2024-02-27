cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NdSubView:cc.Node,
    },

    ctor:function () {
        this.m_ScoreCnt = 0;
        this.m_PoolCnt = 0;
        this.m_Psw = '';
        this._page = 1;
        this._totalPage = 1;
        this._day = 0;// 0- 今天 1- 昨天 2- 前天
        this._searchID = 0;
        this._type = 0; // 0- 收取, 1 增加
        this._tagIndex = 0;
    },

    OnShowView:function () {
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubScoreRecordPre', this);
        this.m_ListCtrl.InitList(1, 'ClubScoreBankRecord', this);
        if(this.m_ToggleArr == null){
            this.m_ToggleArr = this.node.getComponentsInChildren(cc.Toggle);
        }

        this._searchNode =  this.$('SearchNode');

        this.OnUpdateView();

        this.$('SearchNode/BtSearch').active = true;
        this.$('SearchNode/BtBack').active = false;
        this.$('SearchNode/IDEditBox@EditBox').string = '';
        
        this.$('ScrollView/ScrollView3/EdOldPsw@EditBox').string = '';
        this.$('ScrollView/ScrollView3/EdNewPsw@EditBox').string = '';
        this.$('ScrollView/ScrollView3/EdNewPsw1@EditBox').string = '';
        this.$('NdSetPsw/EdPsw1@EditBox').string = '';
        this.$('Take&Save/EdCnt@EditBox').string = '';

        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(this._tagIndex == 1?FILTER_MENU_PAGE:FILTER_MENU_PAGE|FILTER_MENU_DAY|FILTER_MENU_KIND,function(o){
                this._day = o.d;
                this._page = o.p;
                this._type = o.k;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-300));
        }.bind(this));
    },

    OnUpdateView:function () {
        for(var i=0;i<this.m_ToggleArr.length;i++){
            if(this.m_ToggleArr[i].isChecked) {
                this.m_ToggleArr[i].isChecked = false;
                this.m_ToggleArr[i].check();
            }
        }
    },

    OnCheckChange:function (_, Data) {
        this._page = 1;
        this.m_bNeedUpdate = true;
    },
    ShowUserScoreInfo:function (UseID, View) {
        this.m_Hook.ShowUserScoreInfo(UseID, View)
        this.HideView();
    },
    OnTakeUserAllScore:function (UseID, Score) {
        if(Score>0) {
            this.ShowAlert('确认清楚玩家积分？',Alert_YesNo, function(Res) {
                if(Res) {
                    this.m_Hook.OnTakeScore(UseID, 1, Score);
                    this.HideView();
                }
            }.bind(this));
        }else{
            return this.m_Hook.ShowTips('输入金额错误！');
        }
    },

    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }
        if(!this._filter) return;

        var RandType = 0;
        for (var i = 0; i < 5; i++) {
            if (this.$('Toggle/' + i + '@Toggle').isChecked) RandType = i;
        }

        var ShowName = 'ScrollView'+RandType;
        for(var i = 0;i<this.m_NdSubView.childrenCount; i++ ){
            this.m_NdSubView.children[i].active = (this.m_NdSubView.children[i].name == ShowName);
        }

        if(RandType == 3){
            this.$('ScrollView/'+ShowName+'/EdOldPsw@EditBox').string = '';
            this.$('ScrollView/'+ShowName+'/EdNewPsw@EditBox').string = '';
            this.$('ScrollView/'+ShowName+'/EdNewPsw1@EditBox').string = '';
        }
        if(RandType == 4){
            this.$('ScrollView/'+ShowName+'/Edit1@EditBox').string = '';
            this.$('ScrollView/'+ShowName+'/Edit2@EditBox').string = '';
            this.$('ScrollView/'+ShowName+'/Edit3@EditBox').string = '';
        }
        this.$('NdSetPsw').active = false;
        this.m_ListCtrl.InitList(0, 'ClubScoreBankRecord', this);
        this.m_ListCtrl.InitList(1, 'ClubScoreRecordPre', this);

        this._filter.node.active = RandType ==1 || RandType == 2;
        if(RandType != this._tagIndex) this._filter.SetMode1(RandType == 1?FILTER_MENU_PAGE:FILTER_MENU_PAGE|FILTER_MENU_DAY|FILTER_MENU_KIND);
        
        this._tagIndex = RandType;
        this._searchNode.active = RandType == 2;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        //俱乐部银行
        if(RandType == 0){
            var webUrl = window.PHP_HOME+'/League.php?GetMark=51&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
            WebCenter.GetData(webUrl, 0, function (data) {
                var Info = JSON.parse(data);
                this.$('ScrollView/ScrollView0/LbScore@Label').string = Score2Str(parseInt(Info[1]));
                this.$('ScrollView/ScrollView0/LbBank@Label').string = Score2Str(parseInt(Info[2]));
                this.m_ScoreCnt = Score2Str(parseInt(Info[1]));
                this.m_PoolCnt = Score2Str(parseInt(Info[2]));
            }.bind(this));
        }
        //俱乐部银行
        if(RandType == 1){
            var webUrl = window.PHP_HOME+'/League.php?GetMark=55&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
            webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
            webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
            WebCenter.GetData(webUrl, null, function (data) {
                var Info = JSON.parse(data);
                //for(var i in Info) this.m_ListCtrl.InsertListInfo(0, Info[i]);

                if (Info.length > 0) this._totalPage = Math.ceil(Info[0][2] / window.PAGE_ITEM_CNT);
                else this._totalPage = 1;
                this._filter.SetPageTotalCnt(this._totalPage,this._page);
                if(Info.length > 0)this.m_ListCtrl.InsertListInfoArr(0,Info);
            }.bind(this));
        }
        //俱乐部银行
        if(RandType == 2){
            var webUrl = window.PHP_HOME+'/League.php?GetMark=136&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
            webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
            webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
            webUrl += `&day=${this._day}`;
            webUrl += `&searchID=${this._searchID}`;
            webUrl += `&type=${this._type}`;
            WebCenter.GetData(webUrl, null, function (data) {
                var Info = JSON.parse(data);
                
                if (Info.length > 0) this._totalPage = Math.ceil(Info[0][9] / window.PAGE_ITEM_CNT);
                else this._totalPage = 1;
                this._filter.SetPageTotalCnt(this._totalPage,this._page);

                //for(var i in Info) this.m_ListCtrl.InsertListInfo(1, Info[i]);
                if(Info.length > 0)this.m_ListCtrl.InsertListInfoArr(1,Info);
            }.bind(this));
        }

    },
    GetSelUserStr:function(){
        if(this.m_EdUserFind && this.m_EdUserFind.node.active){
            return this.m_EdUserFind.string;
        }
        return "";
    },
    SetClubList: function(UserMap){
        var findStr = this.GetSelUserStr();
        var bShowFullID = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER || (this.m_Hook.m_SelClubInfo.dwRules & this.HIDE_ID) == 0 ;
        for(var Lv = CLUB_LEVEL_OWNER; Lv >= CLUB_LEVEL_MEMBER; Lv--){
            for(var i in UserMap){
                if(i == 'Revenue' || i == 'ARevenue') continue
                if(Lv != UserMap[i][1]) continue;
                var UserID = UserMap[i][0];
                if(findStr != '' && g_GlobalUserInfo.m_UserInfoMap[UserID] != null){
                    var Name = g_GlobalUserInfo.m_UserInfoMap[UserID].NickName;
                    var ID = g_GlobalUserInfo.m_UserInfoMap[UserID].GameID+'';
                    if(Name.indexOf(findStr) < 0 && ID.indexOf(findStr) < 0) continue
                }
                this.m_ListCtrl.InsertListInfo(1, [i, UserID, UserMap[i][1], UserMap[i][2], bShowFullID]);
            }
        }

    },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //银行功能
    OnClick_Save:function(){
        this.m_type = 0;
        this.$('Take&Save').active = true;
        cc.gPreLoader.LoadRes('Image_ClubScoreRecord_T-chunjifen','Club',function (spriteFrame) {
            this.$('Take&Save/BGM/TPsw@Sprite').spriteFrame = spriteFrame;
        }.bind(this));

        this.$('Take&Save/ScoreCnt@Label').string = '当前积分：'+this.m_ScoreCnt;
        this.$('Take&Save/PoolCnt@Label').string = '积分池积分：'+this.m_PoolCnt;
        this.$('Take&Save/Label@Label').string = '存入:';
        this.$('Take&Save/EdCnt/PLACEHOLDER_LABEL@Label').string = '输入要存入的积分数';
        this.$('Take&Save/EdCnt/TEXT_LABEL@Label').string = '输入要存入的积分数';
    },
    //取
    OnClick_Take:function(){
        this.m_type = 1;
        this.$('Take&Save').active = true;
        cc.gPreLoader.LoadRes('Image_ClubScoreRecord_T-qujifen','Club',function (spriteFrame) {
            this.$('Take&Save/BGM/TPsw@Sprite').spriteFrame = spriteFrame;
        }.bind(this));
        this.$('Take&Save/ScoreCnt@Label').string = '当前积分：'+this.m_ScoreCnt;
        this.$('Take&Save/PoolCnt@Label').string = '积分池：'+this.m_PoolCnt;
        this.$('Take&Save/Label@Label').string = '取出:';
        this.$('Take&Save/EdCnt@EditBox').Placeholder = '输入要取出的积分数';
        this.$('Take&Save/EdCnt/PLACEHOLDER_LABEL@Label').string = '输入要取出的积分数';
        this.$('Take&Save/EdCnt/TEXT_LABEL@Label').string = '输入要取出的积分数';
    },
    //首次设置银行密码
    OnClick_SetPsw:function(){

        var OldPsw = this.$('ScrollView/ScrollView3/EdOldPsw@EditBox').string;
        var NewPsw1 = this.$('ScrollView/ScrollView3/EdNewPsw@EditBox').string;
        var NewPsw2 = this.$('ScrollView/ScrollView3/EdNewPsw1@EditBox').string;
        if(NewPsw1!=NewPsw2) return this.ShowTips('请输入相同的密码！')
        if(NewPsw1.length!=6) return this.ShowTips('请输入6位密码！')

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?GetMark=54&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&LogonPsw='+pGlobalUserData.szPassword;
        webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&NewPsw='+hex_md5(NewPsw1);
        webUrl += '&OldPsw='+hex_md5(OldPsw);
        WebCenter.GetData(webUrl, null, function (data) {
            var Info = JSON.parse(data);
            this.ShowAlert(Info[1]);
            if(Info[0]==0){
                CLUB_SCORE_LOGON_PSW = NewPsw1;
                this.OnUpdateView();
            }
        }.bind(this));
    },
    OnClick_BtSend:function(){
        var EdGameID = this.$('ScrollView/ScrollView4/Edit1@EditBox');
        var EdScore = this.$('ScrollView/ScrollView4/Edit2@EditBox');
        var EdRemark = this.$('ScrollView/ScrollView4/Edit3@EditBox');

        var GameID = parseInt(EdGameID.string);
        if( GameID > 100000 && GameID < 1000000){ } else { return this.ShowTips('请输入有效ID') };

        var SendScore = Number(EdScore.string);
        if(SendScore > 0) { } else { return this.ShowTips('请输入有效数量') };
        
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+GameID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserInfo = JSON.parse(data);
            if(UserInfo.UserID == null){
                return this.ShowTips('用户查询失败');
            }else{
                this.OnSureDo(UserInfo.UserID, SendScore, UserInfo.NickName,EdRemark.string);
            }
        }.bind(this));
    },
    OnSureDo:function(UserID, Score, Nick,Remark){
        this.ShowAlert('确定赠送【'+Nick+'】 '+ Score+' 积分?', Alert_YesNo, function(Res) {
            if(Res) {
                this.m_Hook.OnGiveScore(UserID, 1, Score,Remark);
                this.HideView();
            }
        }.bind(this) )
    },
    //隐藏设置密码界面
    OnClick_SetPswHideView:function(){
        this.$('Toggle/3@Toggle').check();
    },
    //隐藏设置密码界面
    OnClick_SetTakeAndSaveHideView:function(){
        this.$('Take&Save').active = false;
    },
    OnClick_Sure:function(){
        this.$('Take&Save').active = false;
        var Score = Number (this.$('Take&Save/EdCnt@EditBox').string);
        if(Score <= 0||Score==NaN){
            this.ShowTips('请输入有效数值！');
            return;
        }
        this.$('Take&Save/EdCnt@EditBox').string = '';
        Score = Score * window.PLATFORM_RATIO;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?GetMark='+(this.m_type == 0?52:53)+'&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&Score='+Score;
        webUrl += '&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&Psw='+hex_md5(CLUB_SCORE_LOGON_PSW);
        WebCenter.GetData(webUrl, null, function (data) {
            var Info = JSON.parse(data);
            //this.ShowAlert(Info[1]);
            this.ShowTips(Info[1]);
            if(Info[0]==0){
                this.OnUpdateView();
                this.m_Hook.UpdateScore(this.m_type == 0?-Score:Score);
            }
            this.m_Hook.OnClick_BtUpdate();
        }.bind(this));

    },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    OnClick_CloseSearch:function(){
        this.$('SearchNode/IDEditBox@EditBox').string = '';
        this._searchID = 0;
        this.$('SearchNode/BtSearch').active = true;
        this.$('SearchNode/BtBack').active = false;
        this.OnCheckChange(null, 2);
    },
    OnClick_Search:function(){
        var strGameID = this.$('SearchNode/IDEditBox@EditBox').string;
        if(strGameID.length < 6) {
            this.ShowTips('ID格式错误');
            return;
        }
        this._searchID = parseInt(strGameID);
        this._page = 1;
        this.$('SearchNode/BtSearch').active = false;
        this.$('SearchNode/BtBack').active = true;
        this.OnCheckChange(null, 2);
    },
});
