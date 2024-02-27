cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_editPhone:cc.EditBox,
        m_editPassWord:cc.EditBox,
        m_editCode:cc.EditBox,
    },

    OnShowView:function() {
        this.m_editPhone.string = '';
        this.m_editPassWord.string = '';
        var platform = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
        if(platform == window.PLATFORM_PHONE) {
            if(window.g_PhpUserName != null){
                this.m_editPhone.string = window.g_PhpUserName ;
                this.m_editPassWord.string = window.g_PhpPassword;
            } else {
                var acc = cc.sys.localStorage.getItem('LoginAcc');
                if(acc != null) this.m_editPhone.string = acc;
            }
        }

        var platform = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
        if(platform != window.PLATFORM_PHONE) this.m_editPhone.string = '';

        if(!this.m_VeriCtrl) {
            this.m_VeriCtrl = this.$('ToggleContainer/1/checkmark/VerCode@VerificationCtrl');
            this.m_VeriCtrl.SetHook(this, null);
            this.m_VeriCtrl.SetKey('PhoneLogin');
            this.m_VeriCtrl.SetCheckState(2);
        }
    },

    //点击注册
    OnClicked_Regist:function() {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('RegistAcc', this.node, function(Js) {
            Js.m_Hook = this.m_Hook;
        }.bind(this));
    },

    //点击密码登录
    OnClicked_Login:function() {
        cc.gSoundRes.PlaySound('Button');
        if(this.m_editPhone.string.length < 2) return this.ShowTips("请输入有效账号！");
        if(this.m_Hook){
            cc.sys.localStorage.setItem(window.Key_LoginPlatform, window.PLATFORM_PHONE);
            this.m_Hook.LoginAccount(this.m_editPhone.string, hex_md5(this.m_editPassWord.string));
        }
        this.HideView();
    },

    //点击验证码登录
    OnClicked_PhoneLogin: function(){
        cc.gSoundRes.PlaySound('Button');
        if(this.m_VeriCtrl) {
            var res = this.m_VeriCtrl.Check();
            if(res.code != 0) return;
            //提交
            var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=20&strPhone='+res.PhoneNum;
            WebCenter.GetData(webUrl, null, function (data) {
                var res = JSON.parse(data);
                if(res.Res != 0) {
                    this.ShowAlert('该手机未绑定任何账号！');
                }else{
                    cc.sys.localStorage.setItem(window.Key_PhoneCode, '');
                    if(this.m_Hook) {
                        cc.sys.localStorage.setItem(window.Key_LoginPlatform, window.PLATFORM_PHONE);
                        this.m_Hook.LoginAccount(res.Accounts, res.LogonPass);
                    }
                    this.HideView();
                }
            }.bind(this));
            return;
        }
    },

    //修改密码/忘记密码
    OnClicked_ChangePSW:function() {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ChangePsw', this.node, function(Js) {
            Js.OnShowView(0);
        }.bind(this));
    },

});
