cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdPSW: cc.EditBox,
        m_EdPSW2: cc.EditBox,
    },
    ctor: function () {

    },
    OnShowView: function (kind) {
        this.$('NdPhone').active = true;
        //this.$('NdPsw').active = false;
        this.m_EdPSW.string = '';
        this.m_EdPSW2.string = '';

        if (!this.m_VeriCtrl) {
            this.m_VeriCtrl = this.$('NdPhone@VerificationCtrl');
            this.m_VeriCtrl.SetHook(this, null);
            this.m_VeriCtrl.SetKey('ChangePsw');
            this.m_VeriCtrl.SetCheckState(2);
        }
        if(kind == 0){
            this.$('BGM/BGT/TChangePSW').active = true;
            this.$('BGM/BGT/TReSetPsw').active = false;
        }else{
            this.$('BGM/BGT/TChangePSW').active = false;
            this.$('BGM/BGT/TReSetPsw').active = true;
        }
    },

    OnClicked_Next: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_VeriCtrl) {
            var res = this.m_VeriCtrl.Check();
            if (res.code != 0) return;
            this.$('NdPhone').active = false;
            this.$('NdPsw').active = true;
            return;
        }
    },

    OnClicked_Submit: function () {
        cc.gSoundRes.PlaySound('Button');
        //验证
        if (this.m_EdPSW.string.length < 6) {
            this.ShowTips("请填写6-8位密码")
            return
        }
        if (this.m_EdPSW.string != this.m_EdPSW2.string) {
            this.ShowTips("2次密码输入不一致")
            return
        }

        if (this.m_VeriCtrl) {
            var res = this.m_VeriCtrl.Check();
            if (res.code != 0) {
                return;
            }
        }

        var webUrl = `${window.PHP_HOME}/League.php?&GetMark=139&strPsw=${hex_md5(this.m_EdPSW.string)}&PhoneNum=${res.PhoneNum}&Code=${res.PhoneCode}&dwClubID=${g_ShowClubInfo.dwClubID}`;
        WebCenter.GetData(webUrl, null, function (data) {

            var res = JSON.parse(data);
            if (res.Res == 0) this.m_VeriCtrl.Clear();

            this.ShowAlert(res.Describe, Alert_Yes, function (Res) {
                this.HideView();
            }.bind(this));
        }.bind(this));

        //重置界面
        this.m_EdPSW.string = '';
        this.m_EdPSW2.string = '';
    },
});
