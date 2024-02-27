cc.Class({
    extends: cc.BaseClass,

    properties: 
    {
    },

    ctor: function () {
        this.m_HeadIndex = 0;
    },

    OnShowView: function () 
    {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.$('ToggleContainer/tx'+pGlobalUserData.wFaceID+'@Toggle').check();
    },

    OnBtSelect:function(Tag, Data)
    {
        this.m_HeadIndex = parseInt(Data);
    },


    OnBtSure:function()
    {
        cc.gSoundRes.PlaySound('Button');
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        pGlobalUserData.wFaceID = this.m_HeadIndex;
        var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=34&UserID=' + pGlobalUserData.dwUserID + '&HeadIndex='+this.m_HeadIndex;
        webUrl += '&ServerIP='+window.LOGIN_SERVER_IP;
        webUrl += '&Port='+window.PHP_PORT;
        WebCenter.GetData(webUrl, null, function (data) 
        {
            var res = JSON.parse(data);
            this.m_Hook.ShowAlert(res.Describe);
            if(res.Res == 1) 
            {
                this.m_Hook.OnChangeHeadFinish();
                this.HideView();
            }
        }.bind(this));
    },
});
