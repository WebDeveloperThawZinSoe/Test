cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.node.getComponent("UserCtrl");
        this.m_UserCtrl.SetUserByID(0);
    },
    SetPreInfo:function(Arr){
        // var webUrl = window.PHP_HOME+'/LeagueRoom.php?GetMark=10&RoomIndex='+ID;
        // WebCenter.GetData(webUrl, null, function (data) {
        //     var Info = JSON.parse(data);
        //     for(var i in Info) this.SetUserInfo(Info);
        // }.bind(this));
        this.SetUserInfo(Arr);
    },
    SetUserInfo:function(ParaArr){
        this.$('Revenue@Label').string = Score2Str(parseInt(ParaArr[1][4]));
        this.$('TIME@Label').string = ParaArr[1][5].replace(/ /,'\n');
        this.$('RoomCnt@Label').string = ParaArr[1][2];
        this.$('GameName@Label').string = window.GameList[ParaArr[1][3]];
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(pGlobalUserData.dwUserID == ParaArr[1][6])
        {
            this.$('Type@Label').string = '收取';
            this.m_UserCtrl.SetUserByID(ParaArr[1][7]);
        } else
        {
            this.$('Type@Label').string = '付出';

            this.m_UserCtrl.SetUserByID(ParaArr[1][6]);
        }
    },
});
