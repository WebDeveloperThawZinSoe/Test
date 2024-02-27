cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_bNeedUpdate = false;
        this._day = 0;
    },

    OnShowView:function(){
        
    },
    OnSetBaseInfo:function(dwUserID){
       // this.$('BGB/LeaderID@Label').string = '888888';
        this.m_bNeedUpdate = true;
        this.m_dwUserID = dwUserID;

        var webUrl = window.PHP_HOME+ '/League.php?&GetMark=132&dwClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        webUrl += '&dwUserID='+this.m_dwUserID;

        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            if(!Res['LeaderID'] ){
                var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                this.$('BGB/LeaderID@Label').string =pGlobalUserData.dwGameID;
            }else{
                this.$('BGB/LeaderID@Label').string = Res['LeaderID'];
            }

        }.bind(this));

        this.ShowPrefabDLG('FilterNode',this.node,function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE|FILTER_MENU_DAY,function(o){
                this._day = o.d;
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
        for(var i=0;i<4;i++){
            this.$(`${i}`).active = false;
        }
        var RandType = 0;

        for(var i=0;i<4;i++){
            if(this.$('BGB/Type/'+i+'@Toggle').isChecked) RandType = i;
        }

        this.$(`${RandType}`).active = true;
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(RandType, 'ClubPersonalInfoPre');

        var webUrl = '';
        //上下分日志
        if(RandType == 0){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=108&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID+'&dwUserID='+this.m_dwUserID;
        }else if(RandType == 1){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=111&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID+'&dwUserID='+this.m_dwUserID;
        }else if(RandType == 2){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=110&dwUserID='+this.m_dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }
        else if(RandType == 3){
            webUrl = window.PHP_HOME+ '/League.php?GetMark=109&dwUserID='+this.m_dwUserID+'&ClubID='+this.m_Hook.m_Hook.m_SelClubInfo.dwClubID;
        }
        else{
            webUrl = window.PHP_HOME+ '/League.php?&GetMark=8&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
            webUrl += '&RandType='+1+'&TimeType='+0;
        }

        if(RandType  < 3){
            webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
            webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
            webUrl += `&day=${this._day}`;
        }
        
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            if (RandType == 3) {
                this.m_ListCtrl.InsertListInfo(RandType, [0,[Res, RandType]]);
            }else
            {
                if (Res.length > 0) {
                    this._totalPage = Math.ceil(Res[0][5] / window.PAGE_ITEM_CNT);
                }else{
                    this._totalPage = 1;
                }

                this._filter.SetPageTotalCnt(this._totalPage,this._page);
                var inforArr = [];
                for(var i=0;i<Res.length;i++){
                    inforArr.push([Res[i], RandType]);
                    //this.m_ListCtrl.InsertListInfo(RandType, [Res[i], RandType]);
                }
                this.m_ListCtrl.InsertListInfoArr(RandType,inforArr);
            }

        }.bind(this));
    },
});
