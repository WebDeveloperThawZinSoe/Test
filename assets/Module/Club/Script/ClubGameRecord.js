cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_InputNode:cc.Node,
    },
    ctor:function(){
        this._KindID = 500;
        this._type = 0;
        this._page = 1;
        this._totalPage = 1;
        this._day = 0;
    },

    OnShowView:function() {
        this.m_bNeedUpdate = true;
        this.$('RecordInfo').active = false;
        this.$('LookRePlay@ClubInputReplayCode').SetHook(this);

        if(this.m_ListCtrl == null) {
            this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
            this.m_ListCtrl.InitList(2, 'GameTag', this);
            for(var i in window.GameList){
                this.m_ListCtrl.InsertListInfo(2, [i,window.GameList[i],i==this._KindID]);
            }
        }

        this.ShowPrefabDLG('FilterNode',this.$('FilterNode'),function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE|FILTER_MENU_DAY,function(o){
                this._day = o.d;
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(420,-300));
        }.bind(this));

    },

    OnRePlayGame:function( RecordID, KindID, Progress){
        if(Progress == null) Progress = 0;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_Hook.OnRePlayGame(RecordID, KindID, pGlobalUserData, Progress);
    },
    OnBtShowInput:function( ){
        if(this.m_InputNode.active){
            HideN2S(this.m_InputNode)
        }else{
            this.$('NoClick',this.m_InputNode).setContentSize(10000, 10000);
            ShowS2N(this.m_InputNode);
        }
    },
    OnShowGameInfoAll:function(RecordID, KindID){
        //显示节点
        this.$('RecordInfo').active = true;
        this._filter.node.active = false;
        //初始化列表
        this.$('RecordInfo/ScrollView@ScrollView').scrollToTop( 0)
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(1, 'ClubRecordInfoItem', this);

        //加载信息
        g_Lobby.ShowLoading();
        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=4&RecordID='+RecordID;
        WebCenter.GetData(webUrl, 30, function (data) {
            g_Lobby.StopLoading();
            if(data == "")return;
            var Arr = JSON.parse(data);
            var infoArr=[];
            for(var i in Arr){
                infoArr.push([KindID, RecordID, parseInt(i)+1, Arr[i]]);
                //this.m_ListCtrl.InsertListInfo(1, [KindID, RecordID, parseInt(i)+1, Arr[i]]);//0 Kind  1 RecordID 2 index 3 info
            }
            this.m_ListCtrl.InsertListInfoArr(1,infoArr);
        }.bind(this));
    },
    OnClick_HideInfoAll:function(){
        this.$('RecordInfo').active = false;
        this._filter.node.active = true;
    },
    OnClick_Toggle:function(event){
        if(event.target.name == 'toggle1')this._type = 0; else this._type = 1;
        this.m_bNeedUpdate = true;
    },
    OnClick_ToggleGame:function(_,Data){
        this.m_bNeedUpdate = true;
        this._KindID = Data;
        this._page = 1;
        //todo
    },
    update:function(){
        if( this.m_bNeedUpdate )this.m_bNeedUpdate = false;
        else return;
        if(!this._filter) return ;
        if(this._type == 1&& this.m_Hook.m_SelClubInfo.cbClubLevel < CLUB_LEVEL_MANAGER){
            this.$('ToggleContainer/toggle1@Toggle').check();
            return this.m_Hook.ShowTips('权限不足，无法查看全部战绩！')
        }

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Club=this.m_Hook.m_SelClubInfo.dwClubID;
        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=10&dwUserID='+pGlobalUserData.dwUserID;
        webUrl+="&ClubID="+Club;
        webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
        webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
        webUrl += `&KindID=${this._KindID}`;
        webUrl += `&type=${this._type}`;
        webUrl += `&day=${this._day}`;

        this.$('NdNoRecord').active= true;

        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubRecordPrefab', this);

        WebCenter.GetData(webUrl, 30, function (data) {
            g_Lobby.StopLoading();
            if(data == "")return;
            var Res = JSON.parse(data);

            if (Res.length > 0) this._totalPage = Math.ceil(Res[0][2] / window.PAGE_ITEM_CNT);
            else this._totalPage = 1;

            this._filter.SetPageTotalCnt(this._totalPage,this._page);
            if(Res.length == 0) return;
            this.$('NdNoRecord').active = false;
            var infoArr=[];
            for(var i in Res){
                infoArr.push([Res[i][0],Res[i][1]]);
                //this.m_ListCtrl.InsertListInfo(0, [parseInt(i)+1, Arr[i], bShowSelf]);
            }
            this.m_ListCtrl.InsertListInfoArr(0,infoArr);
        }.bind(this));

    },
});
