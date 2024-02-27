cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor:function() {
        this.mTableViewArray = new Array();
        this.m_pTableViewCell = new Array();
        this.mServerItem = null;
    },

    ExitGame:function() {
        //退出游戏
        if(window.LOG_NET_DATA)console.log("退出游戏");
        this.mServerItem.IntermitConnect(true);
    },

    SetServerItem:function(pServerItem){
        this.mServerItem = pServerItem;
    },

    //配置函数
    ConfigTableFrame:function(wTableCount, wChairCount, dwServerRule, wServerType, wServerID){
        //设置变量
        this.mTableCount=wTableCount;
        this.mChairCount=wChairCount;
        this.mServerRule=dwServerRule;
        this.mServerType=wServerType;

        //创建桌子
        for (var i=0;i<this.mTableCount;i++){
            this.CreateTableView(i, wChairCount);
        }

        return true;
    },

    //椅子数目
    GetChairCount :function(){return this.mChairCount;},

    //创建桌子
    CreateTableView :function(dwIndex, wChairCount){
        this.mTableViewArray[dwIndex] = new CTableView();
        this.mTableViewArray[dwIndex].InitTableView(dwIndex, wChairCount, this);
    },

    //设置信息
    SetClientUserItem2 :function(wTableID, wChairID, pIClientUserItem) {
        var pITableView=this.GetTableViewItem(wTableID);
        if (pITableView!=0) pITableView.SetClientUserItem(wChairID,pIClientUserItem);
        return true;
    },

    //获取桌子
    GetTableViewItem :function(wTableID){
        //获取桌子
        if (wTableID!=INVALID_TABLE){
            //效验参数
            if (wTableID>=this.mTableViewArray.length) return 0;

            //获取桌子
            return this.mTableViewArray[wTableID];
        }
        return null;
    },

    //桌子状态
    SetTableStatus:function(wTableID, bPlaying, bLocker){
        //获取桌子
        var pITableView=this.GetTableViewItem(wTableID);
        //设置标志
        if (pITableView!=0) pITableView.SetTableStatus(bPlaying,bLocker);
    },

    //桌子状态
    SetTableStatus1 :function(bWaitDistribute){
    },

    //更新桌子
    UpdateTableView:function (wTableID){
        //获取桌子
        var pITableView=this.GetTableViewItem(wTableID);
        if (pITableView==0) return false;
        pITableView.UpdateView();

        return true;
    },

    //桌子可视
    VisibleTable :function(wTableID){
        //效验参数
        if (wTableID>=this.mTableCount) return false;
        return true;
    },

    //获取用户
    GetClientUserItem :function(wTableID, wChairID) {
        //获取桌子
        var pITableView = this.GetTableViewItem(wTableID);

        //获取用户
        if (pITableView!=null) return pITableView.GetClientUserItem(wChairID);

        return null;
    },
});

var CTableView = cc.Class({
    ctor  :function() {
        this.mIClientUserItem = new Array();
    },

    //配置函数
    InitTableView :function(wTableID, wChairCount, pITableViewFrame){
        //设置属性
        this.mTableID=wTableID;
        this.mChairCount=wChairCount;

        //设置接口
        this.mITableViewFrame=pITableViewFrame;
    },

    //设置信息
    SetClientUserItem :function(wChairID, pIClientUserItem) {
        //效验参数
        if (wChairID>=this.mChairCount) return false;

        //设置用户
        this.mIClientUserItem[wChairID] = pIClientUserItem;

        return true;
    },

    //获取用户
    GetClientUserItem:function (wChairID) {
        //效验参数
        if (wChairID>=this.mChairCount) return 0;

        //获取用户
        return this.mIClientUserItem[wChairID];
    },

    //更新界面
    UpdateView :function(){
    },

    //桌子状态
    SetTableStatus :function(bPlaying, bLocker){
        //设置标志
        if ((this.mIsLocker!=bLocker)||(this.mIsPlaying!=bPlaying)){
            //设置变量
            this.mIsLocker=bLocker;
            this.mIsPlaying=bPlaying;

            //更新界面
            this.mITableViewFrame.UpdateTableView(this.mTableID);
        }
    },
});