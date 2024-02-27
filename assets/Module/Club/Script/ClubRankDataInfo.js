cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_bNeedUpdate = false;
        this._page = 1;
        this._totalPage = 1;
    },

    OnShowView:function(){
        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE,function(o){
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-300));
        }.bind(this));
    },
    OnToggleClick:function(Tag){
        this._page = 1;
        this._totalPage = 1;
        this.m_bNeedUpdate = true;
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }
        if(!this._filter) return;
        for(var i=0;i<4;i++){
            this.$(`${i}`).active = false;
        }
        var RandType = 0;

        for(var i=0;i<4;i++){
            if(this.$('BGB/Type/'+i+'@Toggle').isChecked) RandType = i;
        }

        this.$(`${RandType}`).active = true;
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(RandType, 'ClubRankDataInfoPre');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        var webUrl = '';
        //大赢家数据
        if(RandType == 0){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=113&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }else if(RandType == 1){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=114&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }else if(RandType == 2){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=115&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }
        else if(RandType == 3){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=116&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }
        webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
        webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;

        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);

            if (Res.length > 0) {
                this._totalPage = Math.ceil(Res[0][3] / window.PAGE_ITEM_CNT);
            }else this._totalPage = 1;
            this._filter.SetPageTotalCnt(this._totalPage,this._page);

            var inforArr = [];
            for(var i=0;i<Res.length;i++){
                inforArr.push([Res[i], RandType]);
                //this.m_ListCtrl.InsertListInfo(RandType, [Res[i], RandType]);
            }
            this.m_ListCtrl.InsertListInfoArr(RandType,inforArr);

        }.bind(this));
    },
});
