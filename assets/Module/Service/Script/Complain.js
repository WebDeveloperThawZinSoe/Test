cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EditBox:cc.EditBox,
    },
    // onLoad () {},

    start () {

    },
    OnClickCommitComplain:function(){
        if(this.m_EditBox.string.length < 10){
            this.ShowAlert("您提交的信息内容少于10个字，请详细描述内容重新提交");
            return;
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=32&strAccounts='+pGlobalUserData.szAccounts;
        webUrl += '&strTitle='+"防赌博投诉" ;
        webUrl += '&strContent=' + this.m_EditBox.string;
        webUrl += '&dwSort=2';
        webUrl += '&strClientIP=' + pGlobalUserData.szClientIP;
        webUrl += '&strErrorDescribe=0';
        WebCenter.GetData(webUrl, 0, function (data) {
            var Res = JSON.parse(data);
            if(Res.strErrorDescribe && Res.strErrorDescribe.length > 0){
                this.ShowAlert(Res.strErrorDescribe,Alert_Yes,function(){
                    this.m_EditBox.string = "";
                    this.HideView();
                }.bind(this));
            }
        }.bind(this));
    },


    // update (dt) {},
});
