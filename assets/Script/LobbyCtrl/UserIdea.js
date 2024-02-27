cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdUserIdea:cc.EditBox,
        m_EdUserWX:cc.EditBox,
    },

    OnBtSubmit:function(){
        //验证
        if(this.m_EdUserIdea.string == ''){
            this.ShowTips("请填写您的意见或建议！")
            return
        }
        if(this.m_EdUserWX.string == ''){
            this.ShowTips("请填写您的联系方式！")
            return
        }
        //提交
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=0&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&strPsw='+pGlobalUserData.szPassword;
        webUrl += '&WX='+this.m_EdUserWX.string+'&Describe='+this.m_EdUserIdea.string;
        var self = this;

        WebCenter.GetData(webUrl, null, function (data) {
            if(self.m_Hook)self.m_Hook.StopLoading();
            if (data === -1){
                self.ShowTips('请检查网络！');
            }else{
                var res = JSON.parse(data);
                self.m_Hook.ShowAlert(res.Describe)
                if(res.Res == 0) self.HideView();
            }
        });
        //重置界面
        this.m_EdUserIdea.string = ''
        this.m_EdUserWX.string = ''
    },
});
