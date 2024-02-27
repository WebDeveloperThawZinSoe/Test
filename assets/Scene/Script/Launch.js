cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    ctor: function () {
        this.m_nNeedUpdate = 0;
    },

    onLoad: function () {
        cc.debug.setDisplayStats(false);
        FitSize(this.node);
        ShowO2I(this.node, 0.5);
        this.$('Version@Label').string = ``;
        if(!this.m_Loading) this.m_Loading = this.$('loading');
        this.m_Loading.zIndex = 100;
        this.m_Loading.active = false;
        this.$('ani').active = false;
        this.$('Logo').active = false;
        window.LoadSetting();
        this.m_StartAni = this.$('StartAni').getComponent(dragonBones.ArmatureDisplay);
        if(window.START_ANIMATION == 0){
            this.m_nNeedUpdate = 1;
            this.$('ani').active = true;
            this.scheduleOnce(this.OnTimer_DelayShowLogo, 0.4);
            this.m_StartAni.node.active = false;
        }else{
            this.m_StartAni.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this);
            this.m_StartAni.node.active = true;
            this.m_StartAni.playAnimation('newAnimation', 1);
        }
    },
    start: function () {
        g_Launch = this;
        g_Login = null;
        g_Lobby = null;
        g_Table = null;
        g_CurScene = this;
    },
    animationEventHandler: function (event) {
        if (event.type === dragonBones.EventObject.COMPLETE) {
            this.m_StartAni.node.active = false;
            this.m_nNeedUpdate = 1;
            this.OnTimer_DelayShowLogo();
            //this.scheduleOnce(this.OnTimer_DelayShowLogo, 0.4);
        }
    },

    OnTimer_DelayShowLogo: function() {
        this.$('ani').active = true;
        this.$('Logo').active = true;
    },

    onEnable: function() {
        cc.director.on('LocalVersion',this.OnLocalVersion, this);
    },

    OnLocalVersion: function(ver) {
        if(!ver) return;
        window.APP_VERSION = ver;
        this.$('Version@Label').string = `v${ver}`;
    },

    onDisable: function() {
        cc.director.off('LocalVersion',this.OnLocalVersion, this);
    },

    update: function () {
        if (this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }
        this.LoadConfig();
        cc.gPreLoader.Init(function () {
            if (cc.sys.isNative) {
                this.ShowPrefabDLG("UpdateManager", this.node, function (Js) {
                    Js.CheckUpdate(function() { this.ShowLogin(); }.bind(this));
                }.bind(this));
            } else {
                if (cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT || cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ) {
                    ChangeScene('Lobby');
                } else {
                    this.ShowLogin();
                }
            }
        }.bind(this));
    },

    ShowLogin: function () {
        this.ShowPrefabDLG("Login", this.node, function () {}.bind(this));
    },

    ShowUpdate: function () {
        this.ShowPrefabDLG("UpdateManager", this.node, function (Js) {
            Js.StartPreload(true, 0, function(){
                this.ShowLogin();
            }.bind(this));
        }.bind(this));
    },
    //游戏入口
    EnterGameScene:function(){
        // 加载游戏
        if(GameDef && g_ServerListDataLast){
            if(window.LOG_NET_DATA)console.log("地址：", g_ServerListDataLast.szServerAddr+":"+g_ServerListDataLast.wServerPort);
            this.m_Loading.active = true;
            this.ShowPrefabDLG("UpdateManager", this.m_Loading, function (Js) {
                Js.StartPreload(0, g_ServerListDataLast.wKindID, function() {
                    cc.gPreLoader.LoadRes(`Image_BG_BG${GameDef.BGIndex}`, '' + GameDef.KIND_ID, function(res) {
                        window.gGameBG = 'loading';
                        ChangeScene('Table');
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },
    LoadConfig: function() {
        cc.share.LoadConfig();
    }
});
