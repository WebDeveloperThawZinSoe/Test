cc.Class({
    extends: cc.BaseClass,

    properties: {},

    ctor: function () {
        this.m_szWXCode = "";
        //'resources/Audio/'
        this.m_BasicSound = new Array(
            ['BGM0', 'BGM0'],
            ['BGM1', 'BGM1'],
            ['Button', 'button'],
            ['Jet', 'Jet'],
            ['SendCard', 'sendcard'],
        );
    },
    onLoad: function () {
        this.node.setContentSize(cc.winSize.width, cc.winSize.height);
        this.InitView();
        // this.m_BtWXLogin.node.active = !cc.share.IsH5_WX();
        // this.m_BtPhoneLogin.node.active = !cc.share.IsH5_WX();
        this.m_AgreeToggle.node.active = !cc.share.IsH5_WX();
        // this.m_BtLogin.node.active = false;
        cc.gSoundRes.LoadSoundArr(this.m_BasicSound, 'PublicAudio');
    },

    start: function () {
        cc.audioEngine.stopAll();
        this.InitView();
    },

    InitView: function () {
        if (!this.m_BtWXLogin) this.m_BtWXLogin = this.$('BtWXLogin@Button');
        if (!this.m_BtPhoneLogin) this.m_BtPhoneLogin = this.$('BtPhoneLogin@Button');
        if (!this.m_AgreeNode) this.m_AgreeNode = this.$('AgreeNode');
        if (!this.m_AgreeToggle) this.m_AgreeToggle = this.$('AgreeToggle@Toggle');
        if (!this.m_LabVersion) this.m_LabVersion = this.$('LabVersion@Label');
        if (!this.m_BtLogin) this.m_BtLogin = this.$('BtLogin@Button');
    },

    OnShowView: function () {
        ShowO2I(this.node);
        this.InitView();
        this.BindButtonInit();
        this.OnEnter();
        CLUB_SCORE_LOGON_PSW = 0;
        if(window.gClubClientKernel) window.gClubClientKernel.shutdown();
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    OnEnter: function () {
        if (cc.sys.isBrowser) {
            if (window.LOG_NET_DATA) console.log("cc.sys.isBrowser");
            var AutoLogonAcc = getQueryString("AAcc");
            if (AutoLogonAcc) {
                window.g_PhpUserName = AutoLogonAcc;
                window.g_PhpPassword = getQueryString("APsw");
            }
            if (window.g_PhpUserName == '') window.g_PhpUserName = null;
        }
        getLinkInfo();
        // this.StopLoading();
        // 加载声音
        // cc.gSoundRes.LoadSoundArr(this.m_BasicSound)

        if (cc.sys.isBrowser) {
            if (window.g_PhpUserName != null && !gReLogin) this.LoginAccount(window.g_PhpUserName, hex_md5(window.g_PhpPassword));
        } else {
            //自动登录
            if (!gReLogin && cc.sys.localStorage.getItem('LoginPsw') != null) this.LoginAccount(cc.sys.localStorage.getItem('LoginAcc'), cc.sys.localStorage.getItem('LoginPsw'));
        }
        g_Login = this;
    },

    //微信账号登录按钮点击事件
    OnClick_BtWXLogin: function () {
        // cc.gSoundRes.PlaySound('Button');
        if (!this.CheckToggle()) return;
        ThirdPartyWXLogin();
    },

    //获得微信CODE
    onWXCode: function (code) {
        if (window.LOG_NET_DATA) console.log("onWXCode " + code)
        if (code == '') {

        } else {
            var json = JSON.parse(code);
            json.nickname = json.nickname.replace(/&/g, '%26');
            code = JSON.stringify(json);

            var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=11&code=' + code;
            WebCenter.GetData(webUrl, null, function (data) {
                var Login = JSON.parse(data);
                if (Login.errcode != null) return this.ShowAlert("ErrCode:" + Login.errcode);
                cc.sys.localStorage.setItem(window.Key_LoginPlatform, window.PLATFORM_WX);
                this.LoginAccount(Login.Accounts, Login.LogonPass);
            }.bind(this));
        }
    },
    //RegisterAccount
    RegisterAccount: function (Account, Password, Nickname, Gender, PhoneReg) {
        if (!this.CheckToggle()) return;
        this.ShowLoading(null, '正在注册');
        var LogonAccounts = new CMD_GP_RegisterAccounts();
        LogonAccounts.dwPlazaVersion = cc.VERSION_PLAZA;
        LogonAccounts.szAccounts = Account
        LogonAccounts.szPassWord = Password;
        LogonAccounts.szMachineID = "creator";
        LogonAccounts.cbGender = (Gender ? 1 : 0);
        if(Nickname) LogonAccounts.szNickName = Nickname;
        else {
            var nowDate = new Date();
            LogonAccounts.szNickName = '游客';
            LogonAccounts.szNickName += nowDate.getMonth() + 1;
            LogonAccounts.szNickName += nowDate.getDate();
            LogonAccounts.szNickName += 'r' + nowDate.getTime() % 1000;
        }

        if(PhoneReg) var LoginMission = new CGPLoginMission(this, MDM_GP_LOGON, SUB_GP_REGISTER_PHONE, LogonAccounts);
        else var LoginMission = new CGPLoginMission(this, MDM_GP_LOGON, SUB_GP_REGISTER_ACCOUNTS, LogonAccounts);

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        pGlobalUserData.szPassword = LogonAccounts.szPassWord;
        cc.sys.localStorage.setItem('LoginAcc', Account);
        cc.sys.localStorage.setItem('LoginPswT', Password);
    },

    //LoginAccount
    LoginAccount: function (Account, Password) {
        if (!this.CheckToggle()) return;
        gReLogin = false;
        this.ShowLoading(null, '登录中');
        var LogonAccounts = new CMD_GP_LogonAccounts();
        LogonAccounts.dwPlazaVersion = cc.VERSION_PLAZA;
        LogonAccounts.szAccounts = Account
        LogonAccounts.szPassword = Password;
        LogonAccounts.szPassPortID = "no";

        var LoginMission = new CGPLoginMission(this, MDM_GP_LOGON, SUB_GP_LOGON_ACCOUNTS, LogonAccounts);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        pGlobalUserData.szPassword = LogonAccounts.szPassword;
        cc.sys.localStorage.setItem('LoginAcc', Account);
        cc.sys.localStorage.setItem('LoginPswT', Password);
    },

    OnShowChangePsw: function () {
        // this.ShowPrefabDLG("ChangePsw");
    },

    OnClick_BtChangePsw: function () {
        // this.ShowPrefabDLG("ChangePsw");
    },

    // 显示登录框
    OnClick_BtPhoneLogin: function () {
        // cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG("PhoneLogin");
    },

    // 显示登录框
    OnClick_BtLogin: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG("AccLogin");
    },

    onGPLoginSuccess: function () {

    },

    OnClick_BtShowAgreeNode: function () {
        this.ShowPrefabDLG('AgreeMent',this.m_DlgNode);
       // if(this.m_AgreeNode) this.m_AgreeNode.runAction(cc.moveTo(0.1, cc.v2(0, 0)));
    },

    OnClick_BtHideAgreeNode: function () {
        this.m_AgreeNode.runAction(cc.moveTo(0.1, cc.v2(-window.SCENE_WIGHT, 0)));
    },

    //
    CheckToggle: function () {
        if (!this.m_AgreeToggle.isChecked) {
            this.ShowAlert("请同意用户协议！", Alert_Yes);
            return false;
        }
        return true;
    },

    //登录失败
    onGPLoginFailure: function (szDescription) {
        this.StopLoading();
        //提示信息
        this.ShowAlert(szDescription, Alert_Yes);
    },

    //登陆成功
    onGPLoginComplete: function () {
        //查询重连
        this.SendReLinkQuery()
    },
    //查询回连
    SendReLinkQuery: function () {
        // this.ShowLoading();
        var QueryRL = new CMD_GP_C_Relink();
        QueryRL.dwUserID = g_GlobalUserInfo.GetGlobalUserData().dwUserID;
        var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_QUERY_RELINK, QueryRL);
    },
    //进入服务器信息
    OnQueryServerRes: function (ReturnServer) {
        if (ReturnServer.wKindID == 0 || !this.BeLoadRes(ReturnServer.wKindID)) {
            ChangeScene('Lobby');
            return;
        }
        g_ServerListDataLast = new CGameServerItem();
        g_ServerListDataLast.wKindID = ReturnServer.wKindID;
        g_ServerListDataLast.wServerPort = ReturnServer.wServerPort;
        g_ServerListDataLast.szServerAddr = ReturnServer.szServerAddr;
        g_ServerListDataLast.wServerType = ReturnServer.wServerType;
        g_ServerListDataLast.llEnterScore = ReturnServer.llEnterScore;
        g_ServerListDataLast.szServerName = "";
        if(g_CurScene && g_CurScene.EnterGameScene) g_CurScene.EnterGameScene();
    },
    OnQueryRoomRes: function (ReturnServer) {
        if(window.LOG_NET_DATA) console.log('OnQueryRoomRes ', ReturnServer)
        if (ReturnServer.wKindID == 0 || !this.BeLoadRes(ReturnServer.wKindID)) {
            ChangeScene('Lobby');
            return;
        }
        g_ServerListDataLast = new CGameServerItem();
        g_ServerListDataLast.wKindID = ReturnServer.wKindID;
        g_ServerListDataLast.wServerPort = ReturnServer.wServerPort;
        g_ServerListDataLast.szServerAddr = ReturnServer.szServerAddr;
        g_ServerListDataLast.wServerType = ReturnServer.wServerType;
        g_ServerListDataLast.llEnterScore = ReturnServer.llEnterScore;
        g_ServerListDataLast.szServerName = "";
        window.g_dwRoomID = ReturnServer.dwRoomID;
        window.g_dwClubID = ReturnServer.dwClubID;
        if(g_CurScene && g_CurScene.EnterGameScene) g_CurScene.EnterGameScene();
    },

    //登陆成功
    onGetServerListFinish: function () {},


    OnBtTestLoginin: function (Tag, Num) {
        var key = 'test' + Num;

        if (this[key] == null) this[key] = true;
        else return this.OnReSetTestLogin();

        var InPutCnt = 0;
        for (var i = 1; i <= Num; i++) {
            if (this['test' + i] == null) return this.OnReSetTestLogin();
            else InPutCnt++;
        }

        if (InPutCnt >= 3) this.m_AccLogin.active = true;
    },
    OnReSetTestLogin: function () {
        for (var i = 1; i < 4; i++) this['test' + i] = null;
    },
    //游戏资源预加载
    BeLoadRes: function (wKindID) {
        try {
           //游戏自定义
           GameDef = new window['CMD_GAME_' + wKindID]();
           if (GameDef == null) {
               var game = window.GameList[wKindID];
               if (game == null) game = wKindID;
               return false;
           }
           //游戏桌布
           window.gGameBG = 'loading';
           window.LoadSetting();
           window.LoadSetting(wKindID);
           var pathInfo = window.Path_GameBG(wKindID, window.g_GameSetting[wKindID][window.SetKey_Table_BG], 0, true);
           GameDef.BGIndex = pathInfo.BGIndex;
           GameDef.BGPath = pathInfo.path;
        } catch (error) {
            return false;
        }

        return true;
    },
});
