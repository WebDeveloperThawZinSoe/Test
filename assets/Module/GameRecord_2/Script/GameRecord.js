cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NoRecordNode:cc.Node,
        m_InputNode:cc.Node,
        m_EdInput:cc.EditBox,
    },
    ctor:function(){
        this._KindID = 500;
        this._page = 1;
        this._totalPage = 1;
        this._day = 0;
    },

    OnShowView:function() {
        
        this.m_NoRecordNode.active = true;
        if(this.m_ListCtrl == null) {
            this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
            this.m_ListCtrl.InitList(2, 'GameTag', this);
            for(var i in window.GameList){
                if(i == 63500) continue;
                this.m_ListCtrl.InsertListInfo(2, [i,window.GameList[i],i==this._KindID]);
            }
        }

        this.$('LookRePlay@InputReplayCode').SetHook(this);

        this.ShowPrefabDLG('FilterNode',this.$('FilterNode'),function(Js){
            this._filter = Js;
            this._filter.SetMode(FILTER_MENU_PAGE|FILTER_MENU_DAY,function(o){
                this._day = o.d;
                this._page = o.p;
                this.m_bNeedUpdate = true;
            }.bind(this),cc.Vec2(430,-290));
        }.bind(this));
    },
    update:function(){
        if( this.m_bNeedUpdate )this.m_bNeedUpdate = false;
        else return;
        if(!this._filter) return;
        this.m_ListCtrl.InitList(0, 'RecordPrefab', this);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=2&dwUserID='+pGlobalUserData.dwUserID;
        webUrl+="&ClubID=0";
        webUrl += `&start=${(this._page - 1) * window.PAGE_ITEM_CNT + 1}`;
        webUrl += `&end=${(this._page) * window.PAGE_ITEM_CNT}`;
        webUrl += `&KindID=${this._KindID}`;
        webUrl += `&day=${this._day}`;

        this.m_NoRecordNode.active = true;
        WebCenter.GetData(webUrl, 30, function (data) {
            g_Lobby.StopLoading();
            if(data == "" )return;
            var Res = JSON.parse(data);

            if (Res.length > 0) this._totalPage = Math.ceil(Res[0][2] / window.PAGE_ITEM_CNT);
            else this._totalPage = 1;
            this._filter.SetPageTotalCnt(this._totalPage,this._page);
            if(Res.length == 0) return;
            
            this.m_NoRecordNode.active = false;
            var infoArr = [];
            for(var i in Res)  infoArr.push([Res[i][0],Res[i][1]]);;
            this.SetItemInfo(infoArr);
        }.bind(this));
    },

    // OnHideView:function(){
    //     HideN2S(this.node);
    // },
    SetItemInfo:function(IDArr) {
        this.m_NoRecordNode.active = false;

        for (var i in IDArr ) {
            this.m_ListCtrl.InsertListInfo(0, [parseInt(i)+1, IDArr[i]]);
        }
    },

    OnRePlayGame:function( RecordID, KindID, Progress){
        if(Progress == null) Progress = 0;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_Hook.OnRePlayGame(RecordID, KindID, pGlobalUserData, Progress);
    },
    OnBtShowReplay:function(){
        //解析
        var RelayID = this.m_EdInput.string;
        if(RelayID.indexOf('z') < 0) return this.ShowTips('无效的ID');

        var Arr = RelayID.split('z');
        for(var i in Arr) Arr[i] = parseInt(Arr[i], 35);
        if(Arr[1] == null || Arr[2] == null || window.GameList[Arr[1]] == null) return this.ShowTips('无效的ID');

        var UserInfo = new Object();
        UserInfo.dwUserID = Arr[2]
        this.m_Hook.OnRePlayGame(Arr[0], Arr[1], UserInfo);
        this.m_InputNode.active = false;
    },
    OnBtShowInput:function( ){
        if(this.m_InputNode.active){
            HideN2S(this.m_InputNode)
        }else{
            this.$('NoClick',this.m_InputNode).setContentSize(10000, 10000);
            ShowS2N(this.m_InputNode);
        }
    },
    //update:function(){},
    OnShowGameInfoAll:function(RecordID, KindID, ScoreArr){
        //显示节点
        this.$('RecordInfo').active = true;
        this._filter.node.active = false;
        //初始化列表
        this.$('RecordInfo/ScrollView@ScrollView').scrollToTop(0)
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(1, 'RecordInfoItem', this);

        //加载信息
        g_Lobby.ShowLoading();
        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=4&RecordID='+RecordID;
        WebCenter.GetData(webUrl, 30, function (data) {
            g_Lobby.StopLoading();
            if(data == "")return;
            var Arr = JSON.parse(data);
            for(var i in Arr){
                this.m_ListCtrl.InsertListInfo(1, [KindID, RecordID, parseInt(i)+1, Arr[i]]);//0 Kind  1 RecordID 2 index 3 info
            }
        }.bind(this));
    },
    OnClick_HideInfoAll:function(){
        this.$('RecordInfo').active = false;
        this._filter.node.active = true;
    },
    OnClick_ToggleGame:function(_,Data){
        this._KindID = Data;
        this._page = 1;
        this.m_bNeedUpdate = true;
        //todo
    },
});
