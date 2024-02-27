
cc.Class({
    extends: cc.BaseClass,

    properties: {

    },
    // onLoad () {},
    OnLoadData:function (UserID) {
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubRateList', this);
        //var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=99&dwUserID='+UserID+'&ClubID='+this.m_Hook.m_dwClubID;
        WebCenter.GetData(webUrl, null, function (data) {
            var JsArr = JSON.parse(data);
            for(var i = 0; i<JsArr.length; i++ ){
                this.m_ListCtrl.InsertListInfo(0, JsArr[i]);
            }
        }.bind(this));
    },
    // update (dt) {},

////////////////////////////////////////////////////////////// pre

    InitPre:function(){
        this.$('Num@Label').string = 0;
        this.$('Time@Label').string = 0;
    },
    SetPreInfo:function(ParaArr){
        this.$('Num@Label').string = ParaArr[0];
        this.$('Time@Label').string = ParaArr[1];
    },
});
