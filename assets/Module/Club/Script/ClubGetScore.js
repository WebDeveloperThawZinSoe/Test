cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    OnShowView:function () {
        this.m_ClubID = this.m_Hook.m_SelClubInfo.dwClubID;
        var LbScore =  this.$('View/LbScore@Label');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/League.php?&GetMark=93&dwUserID='+pGlobalUserData.dwUserID+'&ClubID='+this.m_Hook.m_SelClubInfo.dwClubID;
        WebCenter.GetData(webUrl, null, function (data) {
            LbScore.string = data;
        }.bind(this));
    },
     //提取记录
    OnClick_GetList:function(){
        //console.log('OnClick_GetList')
        this.ShowPrefabDLG("ClubGetList",this.node, function(Js){
            Js.OnLoadData();
        });
    },

    OnClick_BtGet:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var GetScore =  this.$('View/EdScore@EditBox').string;
        var webUrl = window.PHP_HOME+'/League.php?GetMark=94&dwUserID='+pGlobalUserData.dwUserID;
        webUrl+='&ClubID='+this.m_ClubID+'&GetScore='+GetScore;
        WebCenter.GetData(webUrl, null, function (data) {
            this.m_Hook.ShowTips(data);
            this.m_Hook.OnShowView( );
            this.HideView();
        }.bind(this));
    },

});
