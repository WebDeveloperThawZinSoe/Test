cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdName: cc.EditBox,
        m_EdID: cc.EditBox,
    },

    OnShowView: function () {
        if(!this.m_BtSubmit) this.m_BtSubmit = this.$('BtSubmit@Button');
        this.m_BtSubmit.interactable = false;
        this.$('block').active = true;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=17&dwUserID=' + pGlobalUserData.dwUserID;
        g_CurScene.ShowLoading();
        WebCenter.GetData(webUrl, null, function (data) {
            g_CurScene.StopLoading();
            var Res = JSON.parse(data);
            if (Res.RecordID != 0) {
                this.ShowTips("您已认证,无需重复认证！");
                this.m_EdName.string = Res.Compellation;
                this.m_EdID.string = Res.PassPortID;
                this.m_BtSubmit.interactable = false;
                return;
            }
            this.m_BtSubmit.interactable = true;
            this.$('block').active = false;
            this.m_EdName.string = '';
            this.m_EdID.string = '';
        }.bind(this));

        ShowO2I(this.node);
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    OnClicked_Submit: function () {
        cc.gSoundRes.PlaySound('Button');
        //验证
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if (!regName.test(this.m_EdName.string)) {
            this.ShowTips('真实姓名填写有误');
            return false;
        }
        var regIdNo = /^\d{6}(18|19|20|21|22)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
        if (!regIdNo.test(this.m_EdID.string)) {
            this.ShowTips('身份证号填写有误');
            return false;
        }

        //提交
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=1&dwUserID=' + pGlobalUserData.dwUserID;
        webUrl += '&strPsw=' + pGlobalUserData.szPassword + '&IP=' + pGlobalUserData.szClientIP;
        webUrl += '&Compellation=' + this.m_EdName.string + '&ID=' + this.m_EdID.string

        this.m_Hook.ShowLoading();
        WebCenter.GetData(webUrl, null, function (data) {
            this.m_Hook.StopLoading();
            var res = JSON.parse(data);
            this.m_Hook.ShowAlert(res.Describe)
            if (res.Res == 0) this.HideView();
        }.bind(this));
        //重置界面
        this.m_EdName.string = ''
        this.m_EdID.string = ''
    },


    // update (dt) {},
});
