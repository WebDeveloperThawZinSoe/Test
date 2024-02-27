cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    ctor:function(){
        
    },

    onLoad:function(){
    },

    OnShowView:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        window.gClubClientKernel.onSendGetAndroidCnt(this,g_ShowClubInfo.dwClubID);
        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE,function(o){
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-280));
        }.bind(this));
    },

    update: function () {
        if (this.m_bNeedUpdate) {
            this.m_bNeedUpdate = false;
        } else {
            return;
        }
        this.m_ListCtrl.InitList(0, 'AndroidItem',this);
        var ClubID = g_ShowClubInfo.dwClubID;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/ClubAndroid.php?&GetMark=1&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&dwClubID='+ClubID;
        webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
        webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
        WebCenter.GetData(webUrl, null, function (data) {
            if(data=='') return;
            var AndroidArr = JSON.parse(data);

            if (AndroidArr.length == 0) return;
            this._totalPage = Math.ceil(AndroidArr[0][3] / window.PAGE_ITEM_CNT);
            this._filter.SetPageTotalCnt(this._totalPage,this._page);

            this.m_ListCtrl.InsertListInfoArr(0,AndroidArr);
        }.bind(this));
    },
    
    OnBtCreatAndroid:function(){
        this.onShowClubInput(0,this);
    },
    onShowClubInput:function(type,hook){
        this.ShowPrefabDLG('ClubAndroidInput',null,function(Js){
            this._InputView = Js;
            Js.onSetType(type,hook);
        }.bind(this));
    },
    OnBtAndroidRecord:function(){
        this.ShowPrefabDLG('ClubAndroidRecord');
    },
    OnBtAndroidGroup:function(){
        this.ShowPrefabDLG('ClubAndroidGroupList');
    },
    onCreatAndroid:function(Cnt){
        window.gClubClientKernel.onSendCreatAndroid(this,g_ShowClubInfo.dwClubID,Cnt);
    },
    onSetAndroidScore:function(UserID,Score){
        //this.m_Hook.OnGiveScore(UserID,1,Score);

        if(Score>0){
            var QueryCG = new CMD_GP_C_ClubGive();
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

            QueryCG.dwUserID = pGlobalUserData.dwUserID;
            QueryCG.szPassWord = pGlobalUserData.szPassword;
            QueryCG.dwTagUserID = parseInt(UserID);
            QueryCG.lScore = parseInt(Score);					//金额
            QueryCG.byType = parseInt(1);					//种类
            QueryCG.dwClubID1 = g_ShowClubInfo.dwClubID;
            QueryCG.dwClubID2 = g_ShowClubInfo.dwClubID;
            QueryCG.szRemark = 1;
            window.gClubClientKernel.OnSendGiveScore(this,QueryCG);
        }else{
            var QueryCG = new CMD_GP_C_ClubGive();
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
    
            QueryCG.dwUserID = pGlobalUserData.dwUserID;
            QueryCG.szPassWord = pGlobalUserData.szPassword;
            QueryCG.dwTagUserID = parseInt(UserID);
            QueryCG.lScore = parseInt(-Score);					//金额
            QueryCG.byType = parseInt(1);					//种类
            QueryCG.dwClubID1 = g_ShowClubInfo.dwClubID;
            QueryCG.dwClubID2 = g_ShowClubInfo.dwClubID;
            window.gClubClientKernel.OnSendTakeScore(this,QueryCG);
        }
       
    },
    
    onCreatAndroidRes:function(code){
        if(code == 1){
            g_CurScene.ShowTips('创建失败');
        }else{
            g_CurScene.ShowTips('创建成功');
        }
        if(code == 0)  this.m_bNeedUpdate = true;
        if(this._InputView)this._InputView.node.active = false;
    },

    onDelAndroidRes:function(code){
        if(code == 1){
            g_CurScene.ShowTips('权限不足,不能删除');
        }else if(code == 2){
            g_CurScene.ShowTips('正在游戏中,不能删除');
        }else if(code == 3){
            g_CurScene.ShowTips('信息有误,不能删除');
        }else{
            g_CurScene.ShowTips('删除成功,积分返还到积分池');
        }
        if(code == 0)  this.m_bNeedUpdate = true;
    },
    onAndroidCntInfo:function(CntInfo){
        this.$('BG/FreeCnt/LbFreeCnt@Label').string = CntInfo.wFreeCnt;
        this.$('BG/PlayCnt/LbPlayCnt@Label').string = CntInfo.wPlayCnt;
    },
    UpdateScore:function(){
        this.m_bNeedUpdate = true;
        if(this._InputView)this._InputView.node.active = false;
    },

});
