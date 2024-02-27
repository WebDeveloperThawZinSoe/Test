cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor:function () {
    },

    OnUpdateList:function (LeaderID, ClubID) {
        this.m_ClubID=ClubID;
        this.m_LeaderID=LeaderID;

        this.m_YYDSum = 0;
        this.m_YDSum = 0;
        this.m_TDSum = 0;
        this.OnDateSum(0,0,0);

        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubRevenueList&Pre', this);
        g_Lobby.ShowLoading();

        var webUrl = window.PHP_HOME+'/League.php?&GetMark=37&dwLeaderID='+LeaderID+'&ClubID='+ClubID;
        WebCenter.GetData(webUrl, 3, function (data) {
            g_Lobby.StopLoading();
            var UserArr = JSON.parse(data);
            for(var i in UserArr) this.m_ListCtrl.InsertListInfo(0, UserArr[i]);
        }.bind(this));
    },
    OnDateSum:function (YYd,YD,Td) {
        this.m_YYDSum += parseInt(YYd);
        this.m_YDSum += parseInt(YD);
        this.m_TDSum += parseInt(Td);
        this.$('BGM/YYD@Label').string = '前日总和:'+ this.m_YYDSum ;
        this.$('BGM/YD@Label').string = '昨日总和:'+ this.m_YDSum ;
        this.$('BGM/TD@Label').string = '今日总和:'+ this.m_TDSum ;
    },

/////////////////////////////////////////////////////////////////////////////
//Pre js
    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.node.getComponent("UserCtrl");
        this.m_UserCtrl.SetUserByID(0);
        this.$('LbYYS@Label').string = 0;
        this.$('LbYS@Label').string = 0;
        this.$('LbTS@Label').string = 0;
    },
    SetPreInfo:function(Para){
        this.m_UserCtrl.SetUserByID(Para);
        var webUrl = window.PHP_HOME+'/League.php?GetMark=38&dwUserID='+Para;
        webUrl+='&ClubID='+this.m_Hook.m_ClubID+'&LeaderID='+this.m_Hook.m_LeaderID;
        WebCenter.GetData(webUrl, 3, function (data) {
            var UserData = JSON.parse(data);
            this.$('LbYYS@Label').string = UserData[0];
            this.$('LbYS@Label').string = UserData[1];
            this.$('LbTS@Label').string = UserData[2];
            this.m_Hook.OnDateSum(UserData[0], UserData[1], UserData[2]);
        }.bind(this));
    },


/////////////////////////////////////////////////////////////////////////////
});
