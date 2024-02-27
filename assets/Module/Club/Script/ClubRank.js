cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_bNeedUpdate = false;
        this._first = false;
        this._bLimit = false;
        this._page = 1;
        this._totalPage = 1;
        this._kind = 0;//0 -增加 1- 减少
        this._day = 0;// 0- 今天 1- 昨天 2- 前天
        this._searchID = 0;
        this._bSearch = false;
    },

    OnShowView:function(){
        this._first = true;
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_InputNum = this.$('UpdateUserScore/BGM/InputNum@Label');
       // if(this.m_SelfCtrl == null) this.m_SelfCtrl = this.$('BottomBG/ClubRankPre@ClubRankPre');
        this.$('BGB/Type/0').active = this.m_Hook.m_SelClubInfo.wKindID > CLUB_KIND_0;
        this.$('BGB/Type/1').active = this.m_Hook.m_SelClubInfo.wKindID > CLUB_KIND_0;
        this.$('BGB/Type/4').active = this.m_Hook.m_SelClubInfo.wKindID > CLUB_KIND_0;
        this.$('UpdateUserScore').active = false;

        var webUrl = window.PHP_HOME+'/League.php?GetMark=137&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        WebCenter.GetData(webUrl, 1, function (data) {
            var Res = JSON.parse(data);
            if((Res['Rules'] & this.m_Hook.SHOW_RANK) == 0 &&this.m_Hook.m_SelClubInfo.cbClubLevel<CLUB_LEVEL_MANAGER){
                this._bLimit = true;
            }
            if(this.m_Hook.m_SelClubInfo.wKindID == CLUB_KIND_0){
                this.$('BGB/Type/2@Toggle').check();
            }else{
                this.$('BGB/Type/0@Toggle').check();
            }
        }.bind(this));

        var imgName = this.m_Hook.m_SelClubInfo.wKindID > CLUB_KIND_0?'TRank':'T-paihangbang';
        cc.gPreLoader.LoadRes('Image_ClubRank_'+imgName,'Club',function(sprFrame){
            this.$('topBG/LabRank@Sprite').spriteFrame = sprFrame;
        }.bind(this));

        this.ShowPrefabDLG('FilterNode',this.$('FilterNode'),function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE,function(o){
                this._day = o.d;
                this._kind = o.t;//0 -增加 1- 减少
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-280));
        }.bind(this));


    },

    OnToggleClick:function(Tag){
        if(this._first == false)cc.gSoundRes.PlaySound('Button');
        this._first = false;
        this._page = 1;
        this._searchID = 0;
        this.m_bNeedUpdate = true;
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }
        if(!this._filter) return;
        for(var i=0;i<6;i++){
            this.$(`${i}`).active = false;
        }
        
        var RandType = 0;

        for(var i=0;i<6;i++){
            if(this.$('BGB/Type/'+i+'@Toggle').isChecked) RandType = i;
        }
        this._filter.node.active = RandType != 4;
        this._RandType = RandType;
        if(RandType == 2|| RandType == 3){
            this.$('LabLimit').active = this._bLimit;
            if(this._bLimit) return;
        }else{
            this.$('LabLimit').active = false;
        }
        //this.$('BTBack').active = !this._bLimit;
        
        this.$(`${RandType}`).active = true;
        this.m_ListCtrl.InitList(RandType, 'ClubRankPre');
     

        var webUrl = '';
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //上下分日志
        if(RandType == 0){
             webUrl = window.PHP_HOME+'/League.php?GetMark=60&dwUserID='+pGlobalUserData.dwUserID+'&dwClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        }else if(RandType == 1){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=13&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID+'&dwUserID='+pGlobalUserData.dwUserID;
            webUrl += `&kind=${this._kind}`;
            webUrl += `&day=${this._day}`;
        }else if(RandType == 2){
            if((this.m_Hook.m_SelClubInfo.dwRules & CLUB_SET_RULE_0) == 0 &&this.m_Hook.m_SelClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER){
                return ;
            }
            webUrl = window.PHP_HOME+ '/League.php?GetMark=8&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID+'&RandType=3&TimeType=200';
        }
        else if(RandType == 3){
            if((this.m_Hook.m_SelClubInfo.dwRules & CLUB_SET_RULE_0) == 0 &&this.m_Hook.m_SelClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER){
                return ;
            }
            webUrl = window.PHP_HOME+ '/League.php?GetMark=8&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID+'&RandType=0&TimeType=200';
        }
        else if(RandType == 4){
            webUrl = window.PHP_HOME+'/League.php?GetMark=112&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        }
        else if(RandType == 5){
            webUrl = window.PHP_HOME+'/League.php?GetMark=117&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        }

        if(RandType != 4)
        {
            webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
            webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
            webUrl += `&searchID=${this._searchID}`;
        }

        WebCenter.GetData(webUrl, 1, function (data) {
            this.m_ListCtrl.InitList(RandType, 'ClubRankPre');
            var Res = JSON.parse(data);
            if(RandType == 4){
                this.m_ListCtrl.InsertListInfo(RandType, [0,[Res, RandType, this]]);
            }else{
                if (RandType == 0) {
                    if (Res.length > 0) this._totalPage = Math.ceil(Res[0][5] / window.PAGE_ITEM_CNT);else this._totalPage = 1;
                    this._filter.SetPageTotalCnt(this._totalPage,this._page);
                }
                if (RandType == 1) {
                    if (Res.length > 0) this._totalPage = Math.ceil(Res[0][7] / window.PAGE_ITEM_CNT); else this._totalPage = 1;
                    this._filter.SetPageTotalCnt(this._totalPage,this._page);
                }
                if (RandType == 2||RandType == 3) {
                    if (Res.length > 0) this._totalPage = Math.ceil(Res[0][3] / window.PAGE_ITEM_CNT);else this._totalPage = 1;
                    this._filter.SetPageTotalCnt(this._totalPage,this._page);
                }
                if (RandType == 5) {
                    if (Res.length > 0) this._totalPage = Math.ceil(Res[0][8] / window.PAGE_ITEM_CNT);else this._totalPage = 1;
                    this._filter.SetPageTotalCnt(this._totalPage,this._page);
                }

                this._inforArr = [];
                for(var i=0;i<Res.length;i++){
                    this._inforArr.push([Res[i], RandType, this]);
                    //this.m_ListCtrl.InsertListInfo(RandType, [Res[i], RandType, this]);
                }
                this.m_ListCtrl.InsertListInfoArr(RandType,this._inforArr);
            }

        }.bind(this));
    },
    OnBtClickOpenUpdateUserScoreNode:function(dwUserID){
        cc.gSoundRes.PlaySound('Button');
        this.m_UserID = dwUserID;
        this.$('UpdateUserScore').active = true;
        this.m_InputNum.string = '';
    },
    OnBtClickCloseUpdateUserScoreNode:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.m_InputNum.string = '';
        this.$('UpdateUserScore').active = false;
    },
    OnBtClickUpdateUserScoreNum:function(Tag, Data){
        cc.gSoundRes.PlaySound('Button');
        this.$('UpdateUserScore/BGM/EditBox').active =false;
        if(Data == 'Del'){        //删除
            if(this.m_InputNum.string.length){
                this.m_InputNum.string = this.m_InputNum.string.slice(0,this.m_InputNum.string.length-1)
            }
            if (this.m_InputNum.string.length <=0) {
                this.$('UpdateUserScore/BGM/EditBox').active =true;
            }
        }else{
            if(this.m_InputNum.string.length >= 7) return                //0-9
            this.m_InputNum.string += Data;
        }

    },
    OnBtClickUpdateUserScoreSure:function(){
        cc.gSoundRes.PlaySound('Button');
        var Num = this.m_InputNum.string;
        var NumArr = Num.split('');
        var error = false;
        for(var i=1;i<NumArr.length;i++){
           if (NumArr[i] == '-') {
               error = true;
               break;
           }
        }
        if(error) {
            this.ShowTips('输入金额错误！');
            this.m_InputNum.string = '';
            return;
        }
        this.$('UpdateUserScore').active =false;

        var Score = parseInt(Num);
        if(Score>0) {
            this.m_Hook.OnGiveScore(this.m_UserID, 1, Score);
        }else if(Score<0) {
            this.m_Hook.OnTakeScore(this.m_UserID, 1,-Score);
        }
        //this.m_bNeedUpdate = true;
    },
    OnShowRankDataInfo:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ClubRankDataInfo',this.node,function(Js){
        }.bind(this));
    },
    OnBtSearch: function (_, Data) {
        cc.gSoundRes.PlaySound('Button');
        var strID = this.$(`${Data}/EdSearch@EditBox`).string;
        this.m_type = Data;
        if (strID.length < 6) {
            this.ShowTips('请输入正确的ID');
            return;
        }
        this._searchID = parseInt(strID);
        this.$('BTBack').active = true;
        this.$(`${Data}/BTSearch`).active = false;
        this._page = 1;
        this.m_bNeedUpdate = true;

    },
    OnBtBack: function () {
        cc.gSoundRes.PlaySound('Button');
        this.$('BTBack').active = false;
        for (var i = 0; i < 6; i++) {
            this.$(`${i}/EdSearch@EditBox`).string = '';
            this.$(`${i}/BTSearch`).active = true;
        }
        this._searchID = 0;
        this.m_bNeedUpdate = true;
    },
});
