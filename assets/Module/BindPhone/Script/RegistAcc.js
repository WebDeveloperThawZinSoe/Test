cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdNick: cc.EditBox,
        m_EdPSW: cc.EditBox,
        m_EdPSW2: cc.EditBox,
    },

    OnShowView: function () {
        this.$('NdPhone').active = true;
        this.$('NdInfo').active = false;
        this.m_EdPSW.string = '';
        this.m_EdPSW2.string = '';
        if (!this.m_VeriCtrl) {
            this.m_VeriCtrl = this.$('@VerificationCtrl');
            this.m_VeriCtrl.SetHook(this, null);
            this.m_VeriCtrl.SetKey('RegistAcc');
            this.m_VeriCtrl.SetCheckState(1);
            this.m_TGender = new Array();
            this.m_TGender[0] = this.$('NdInfo/Gender/ToggleContainer/0@Toggle');
            this.m_TGender[1] = this.$('NdInfo/Gender/ToggleContainer/1@Toggle');
        }
    },

    OnClicked_Next: function () {
        var res = this.m_VeriCtrl.Check();
        if (res.code != 0) return;
        if (!this.$('NdPhone/AgreeToggle@Toggle').isChecked) {
            this.ShowAlert("请同意用户协议及隐私条款！", Alert_Yes);
            return;
        }
        this.$('NdPhone').active = false;
        this.$('NdInfo').active = true;
        return;
    },

    //点击注册
    OnClicked_Regist: function () {
        if (this.m_VeriCtrl) {
            var res = this.m_VeriCtrl.Check();
            if (res.code != 0) {
                return;
            }
        }
        if(!this.CheckNickname(this.m_EdNick.string)) return;

        if (this.m_EdPSW.string.length < 6) {
            this.ShowTips("请填写6-8位密码")
            return;
        }
        if (this.m_EdPSW.string != this.m_EdPSW2.string) {
            this.ShowTips("2次密码输入不一致")
            return;
        }

        var Gender = 0;
        if (this.m_TGender[0].isChecked) Gender = 0;
        if (this.m_TGender[1].isChecked) Gender = 1;
        if (this.m_Hook && this.m_Hook.RegisterAccount) this.m_Hook.RegisterAccount(res.PhoneNum, hex_md5(this.m_EdPSW.string), this.m_EdNick.string, Gender, true);
    },

    CheckNickname: function (str) {
        if (str.length < 2) {
            this.ShowTips("请输入有效昵称！");
            return false;
        }
        var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]","i");
        if(pat.test(str)==true) {
            this.ShowTips("非法昵称，请重新输入！");
            return false;
        }
        return true;
    },
    OnClickAgree:function(){
        this.ShowPrefabDLG("AgreeMent");
    }

});
