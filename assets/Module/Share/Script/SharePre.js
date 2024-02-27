cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BtWX: cc.Node,
        m_BtWXLine: cc.Node,
    },

    OnBtShare(Tag, isLine) {
        // var platform = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
        // if (platform != window.PLATFORM_WX) {
        //     if (g_CurScene) g_CurScene.ShowTips('非微信登录无法分享到微信！');
        //     return;
        // }
        var ShareInfo = null;
        //带文本分享
        if (this.m_Hook.GetShareInfo) ShareInfo = this.m_Hook.GetShareInfo();
        if (ShareInfo) {
            ThirdPartyShareMessage(ShareInfo, isLine);
        }
        //纯图片分享
        else if (this.m_Hook.GetShareTex) {
            ShareInfo = this.m_Hook.GetShareTex();
            if (ShareInfo) ThirdPartyShareImg(ShareInfo, isLine);
        }
        this.shareFunc();
        this.HideView();
    },
    OnShowView:function(){
        ShowO2I(this.node);
    },
    OnHideView:function(){
        HideI2O(this.node);
    },
    shareFunc:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=10&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            var res = JSON.parse(data);
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            if(res.RoomCard != null)  pGlobalUserData.llUserIngot=res.RoomCard;
        }.bind(this));
    },
    // update (dt) {},
});
