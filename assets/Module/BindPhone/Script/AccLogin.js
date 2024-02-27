
/**
 * 账号注册
 * 默认头像
 * 如果php端口不是8080
 * 请修改 存储过程 GSP_GP_RegisterAccounts 内的 @HeadUrl
 * 默认头像在 php目录下的DefaultHead文件夹内
 */
cc.Class({
    extends: cc.BaseClass,

    properties: 
    {
        m_LoginNode:cc.Node,
        m_RegisterNode:cc.Node,
        m_EdLoginAcc:cc.EditBox,
        m_EdLoginPW:cc.EditBox,

        m_EdRegisterAcc:cc.EditBox,
        m_EdRegisterNick:cc.EditBox,
        m_EdRegisterPW1:cc.EditBox,
        m_EdRegisterPW2:cc.EditBox,
    },

    OnShowView: function () 
    {
        
        this.m_EdLoginAcc.string = '';
        this.m_EdLoginPW.string = '';
        this.m_EdRegisterAcc.string = '';
        this.m_EdRegisterNick.string = '';
        this.m_EdRegisterPW1.string = '';
        this.m_EdRegisterPW2.string = '';

        this.m_LoginNode.active = true;
        this.m_RegisterNode.active = false;
        if (window.g_PhpUserName != null) {
            this.m_EdLoginAcc.string = window.g_PhpUserName;
            this.m_EdLoginPW.string = window.g_PhpPassword;
        } else {
            var acc = cc.sys.localStorage.getItem('LoginAcc');
            if (acc != null && acc.search('WXUSER') == -1) this.m_EdLoginAcc.string = acc;
        }
    },
    OnBtClose:function()
    {
        cc.gSoundRes.PlaySound('Button');
        if(this.m_RegisterNode.active == true)
        {
            this.m_LoginNode.active = true;
            this.m_RegisterNode.active = false;
        }
        else
        {
            this.HideView();
        }
    },
    OnBtShowRegister:function()
    {
        cc.gSoundRes.PlaySound('Button');
        this.m_LoginNode.active = false;
        this.m_RegisterNode.active = true;
    },
    //点击注册
    OnBtRegister: function () 
    {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_EdRegisterAcc.string.length < 5) return this.ShowTips("请输入有效账号！");
        if (this.m_EdRegisterNick.string.length < 2) return this.ShowTips("请输入有效昵称！");
        if (this.m_EdRegisterPW1.string.length < 6) return this.ShowTips("请输入有效密码！");
        if (this.m_EdRegisterPW1.string != this.m_EdRegisterPW2.string) return this.ShowTips("两次输入密码不一致！");
        if (this.m_Hook) 
		{
			cc.sys.localStorage.setItem(window.Key_LoginPlatform, window.PLATFORM_PHONE);
			this.m_Hook.RegisterAccount(this.m_EdRegisterAcc.string, hex_md5(this.m_EdRegisterPW1.string), this.m_EdRegisterNick.string);
		}
    },

    //点击密码登录
    OnBtLogin: function () 
    {
        cc.gSoundRes.PlaySound('Button');
        //if (this.m_EdLoginAcc.string.length < 2) return this.ShowTips("请输入有效账号！");
        if (this.m_Hook) 
        {
            cc.sys.localStorage.setItem(window.Key_LoginPlatform, window.PLATFORM_PHONE);
            this.m_Hook.LoginAccount(this.m_EdLoginAcc.string, hex_md5(this.m_EdLoginPW.string));
        }
        this.HideView();
    },

    //修改密码/忘记密码
    OnBtChangePSW: function () {
        this.m_Hook.OnShowChangePsw();
    },
});
