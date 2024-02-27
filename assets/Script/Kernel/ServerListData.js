
ServerStatus_Normal = 0;

CGameListItem = cc.Class({
    ctor :function () {
        //属性数据
        this.m_ItemGenre=0;
        this.m_pParentListItem=0;
    },

    init :function(ItemGenre){
        //属性数据
        this.m_ItemGenre=ItemGenre;
    }
});

CGameKindItem = cc.Class({
    extends: CGameListItem,
    ctor :function () {
        //更新变量
        this.m_dwUpdateTime=0;
        this.m_bUpdateItem=false;

        //扩展数据
        this.m_dwProcessVersion=0;

        this.m_GameKind = new tagGameKind();
    },
});

CGameTypeItem = cc.Class({
    extends: CGameListItem,
    ctor:function() {
        this.m_GameType = new tagGameType();
    }
});

CGameServerItem = cc.Class({
    extends: CGameListItem,
    ctor:function  () {
        //辅助变量
        this.m_pGameKindItem=0;

        //扩展数据
        this.m_ServerStatus=ServerStatus_Normal;
        this.m_GameType = new tagGameType();
        this.m_GameServer = new tagGameServer();
        this.m_GameMatch = new tagGameMatch();
    }
});


CServerListData = cc.Class({
    ctor:function  () {
        //接口变量
        this.m_pIServerListDataSink=null;
        this.m_dwAllOnLineCount=0;

        this.m_GameTypeItemMap = new Array();    //种类索引
        this.m_GameServerItemMap = new Array(); //房间索引
        this.m_GameKindItemMap = new Array();
    },

    //设置接口
    SetServerListDataSink :function(pIServerListDataSink){
        //设置变量
        this.m_pIServerListDataSink=pIServerListDataSink;
    },

    //插入种类
    InsertGameType:function (pGameType){
        //效验参数
        if (pGameType==null) return false;

        //变量定义
        var pGameTypeItem = null;
        var bInsert = false;


        var it = this.m_GameTypeItemMap[pGameType.wTypeID];

        if (it == null)
        {
            pGameTypeItem = new CGameTypeItem();
            bInsert = true;
        }
        else
        {
            pGameTypeItem = it;
        }

        if (pGameTypeItem == 0) return false;

        pGameTypeItem.wJoinID = pGameType.wJoinID;
        pGameTypeItem.wSortID = pGameType.wSortID;
        pGameTypeItem.wTypeID = pGameType.wTypeID;
        pGameTypeItem.szTypeName = pGameType.szTypeName;

        //寻找父项
        if (pGameType.wJoinID!=0)
        {
            //寻找父项
            pGameTypeItem.m_pParentListItem=this.SearchGameType(pGameType.wJoinID);

            //待决判断
            if (pGameTypeItem.m_pParentListItem==0)
            {
                //m_GameListItemWait.push_back(pGameTypeItem);
                return true;
            }
        }

        //插入处理
        if (bInsert==true)
        {
            //设置索引
            this.m_GameTypeItemMap[pGameType.wTypeID]=pGameTypeItem;

            //界面更新
            if (this.m_pIServerListDataSink)
                this.m_pIServerListDataSink.OnGameItemInsert(pGameTypeItem);
        }
        else
        {
            //界面更新
            if (this.m_pIServerListDataSink)
                this.m_pIServerListDataSink.OnGameItemUpdate(pGameTypeItem);
        }

        return true;
    },

    //插入房间
    InsertGameServer :function(pGameServer) {
        //效验参数
        if (pGameServer==null) return false;

        //变量定义
        var pGameServerItem = null;
        var bInsert = false;
        var it = this.m_GameServerItemMap[pGameServer.wServerID];
        if (it == null)
        {
            pGameServerItem = new CGameServerItem();
            bInsert = true;
        }
        else
        {
            pGameServerItem = it;
        }

        if (pGameServerItem == 0) return false;

        //设置数据
        pGameServerItem.wKindID = pGameServer.wKindID;
        pGameServerItem.wNodeID = pGameServer.wNodeID;
        pGameServerItem.wSortID = pGameServer.wSortID;
        pGameServerItem.wServerID = pGameServer.wServerID;
        pGameServerItem.wServerKind = pGameServer.wServerKind;
        pGameServerItem.wServerType = pGameServer.wServerType;
        pGameServerItem.wServerPort = pGameServer.wServerPort;
        pGameServerItem.lCellScore = pGameServer.lCellScore;
        pGameServerItem.lEnterScore = pGameServer.lEnterScore;
        pGameServerItem.dwServerRule = pGameServer.dwServerRule;
        pGameServerItem.dwOnLineCount = pGameServer.dwOnLineCount;
        pGameServerItem.dwAndroidCount = pGameServer.dwAndroidCount;
        pGameServerItem.dwFullCount = pGameServer.dwFullCount;
        pGameServerItem.szServerAddr = pGameServer.szServerAddr;
        pGameServerItem.szServerName = pGameServer.szServerName;
        this.m_dwAllOnLineCount += pGameServer.dwOnLineCount;

        //插入处理
        if (bInsert==true) {
            //设置索引
            this.m_GameServerItemMap[pGameServer.wServerID]=pGameServerItem;

            //插入子项
            if (this.m_pIServerListDataSink)
                this.m_pIServerListDataSink.OnGameItemInsert(pGameServerItem);
        }
        else
        {
            //更新子项
            if (this.m_pIServerListDataSink)
                this.m_pIServerListDataSink.OnGameItemUpdate(pGameServerItem);
        }

        return true;
    },

    //查找房间
    SearchGameServer :function(wServerID) {
        return this.m_GameServerItemMap[wServerID];
    },

    //设置人数
    SetServerOnLineCount:function (wServerID, dwOnLineCount){
        //搜索房间
        var pGameServerItem=this.SearchGameServer(wServerID);

        //设置人数
        if (pGameServerItem!=0)
        {
            //设置变量
            this.m_dwAllOnLineCount -= pGameServerItem.m_GameServer.dwOnLineCount;
            this.m_dwAllOnLineCount += dwOnLineCount;

            //设置变量
            pGameServerItem.m_GameServer.dwOnLineCount=dwOnLineCount;

            //查找类型
            var pGameKindItem = this.SearchGameKind(pGameServerItem.m_GameServer.wKindID);
            if(pGameKindItem)
            {
                //设置变量
                pGameKindItem.m_GameKind.dwOnLineCount = dwGameKindOnline;

                //事件通知
                if (this.m_pIServerListDataSink!=0) this.m_pIServerListDataSink.OnGameItemUpdate(pGameKindItem);
            }
        }
    },

    //查找类型
    SearchGameKind:function (wKindID){
        return this.m_GameKindItemMap[wKindID];
    },


    //查找种类
    SearchGameType :function(wTypeID) {
        return this.m_GameTypeItemMap[wTypeID];
    },

    GetGameServerCount:function (){
        return this.m_GameServerItemMap.length;
    },

    ClearGameServer :function(){
        this.m_GameServerItemMap.length = 0;
    },

    EmunGameServerItem :function(wIndex) {
        return this.m_GameServerItemMap[wIndex];
    },
});

g_ServerListData = new CServerListData();
g_ServerListDataLast = null;
