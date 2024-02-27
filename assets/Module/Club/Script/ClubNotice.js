
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    OnShowNotice:function(ClubID,type){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=129&OpMark='+type+'&dwUserID='+pGlobalUserData.dwUserID;
        webUrl+='&ClubID='+ClubID;
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            this.$('Content@Label').string =Res.length==0?'': Res.Notice;
        }.bind(this));
    },
});
