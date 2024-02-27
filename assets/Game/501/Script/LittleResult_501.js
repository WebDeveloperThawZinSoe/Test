cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_nodeShowBigResult: cc.Node,
        m_nodeStart: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.m_bigReSult = false;
    },
   
    setConclueStat: function (bShow) {
        this.m_bigReSult = bShow;
        this.m_nodeShowBigResult.active = bShow;
        if(this.m_nodeShowBigResult.active)
            this.m_nodeStart.active = false;
    },
    ShowInfo: function (cmd) {
        this.resetView();
        for (var i in this.m_Hook.m_pChairUserItem) {
            this.m_ListCtrl.InsertListInfo(0, [cmd, i, this.m_Hook]);
        }
        this.setConclueStat(cmd.bShowBigResult);

        this.m_nCountDown = 180;
        this.m_LastTime = new Date().getTime();
        this.m_bNeedUpdate = true;
    },

    resetView: function () {
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'LittleResultItem_500', this);
    },

    OnBtGoOn: function () {
        this.m_Hook.OnBnClickedStart();
    },

    OnBtReturn: function () {
        this.m_Hook.m_GameClientEngine.RealShowEndView();
        this.HideView();
    },

    OnBtCutCard: function () {
        this.OnBtGoOn();
        this.m_Hook.m_GameClientEngine.OnMessageCutUser();
    },

    OnBtShowShare: function () {
        if (cc.sys.isNative) {
            this.m_ShareInfo = this.OnShareGameEnd(function () {
                ThirdPartyShareImg(this.m_ShareInfo, "0");
            }.bind(this));
        } else {
            this.ShowTips("H5游戏无法分享!");
        }
    },

    OnShareGameEnd: function (callBack) {
        var ShareTex = cc.RenderTexture.create(1280, 720);
        //var ShareTex = cc.RenderTexture.create(800,600);
        var pos = this.node.getPosition();
        pos.x += 640;
        pos.y += 360;
        this.node.setPosition(pos)

        ShareTex.setVisible(false);
        ShareTex.begin();
        this.node._sgNode.visit();
        ShareTex.end();
        var filename = "screenShot" + (new Date().getTime()) + ".PNG"
        ShareTex.saveToFile(filename, cc.ImageFormat.PNG, true, function () {
            callBack();
        }.bind(this));
        this.node.setPosition(0, 0) //移除屏幕
        return jsb.fileUtils.getWritablePath() + filename;
    },

    GetShareTex: function () {
        return this.m_ShareInfo;
    },

    update: function () {
        if(!this.m_bigReSult) {
            if (this.m_bNeedUpdate) {
                var NowTime = new Date().getTime();
                var Second = parseInt((NowTime - this.m_LastTime) / 1000);
                var nCountDown = this.m_nCountDown - Second;
                // this.m_DownClock.string = "倒计时：" + nCountDown + "秒";
                if (Second >= this.m_nCountDown) {
                    this.m_bNeedUpdate = false;
                    this.OnBtGoOn();
                }
            } 
        } 
    },
});