cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Manifest : cc.Asset
    },
    ctor: function () {
        this.m_nNeedUpdate = 0;
    },
    // use this for initialization
    onLoad: function () {
        this.InitView();
        this.m_Download.active = false;
        this.m_Progress.node.active = false;
        this.m_ItemProgress.node.active = false;

        window.MyLogger = (function () {
            var loghost = `${window.PHP_HOME}/log.php?`;
            var log = function (err) {
                if (WebCenter) {
                    var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                    var _url = [];
                    _url.push(`GetMark=1`);
                    if(err.name) _url.push(`name=${encodeURIComponent(err.name)}`);
                    if(err.message) _url.push(`message=${encodeURIComponent(err.message)}`);
                    if(err.location) _url.push(`location=${encodeURIComponent(err.location)}`);
                    if (err.line) _url.push(`line=${encodeURIComponent(err.line)}`);
                    if (err.func) _url.push(`func=${encodeURIComponent(err.func)}`);
                    if (err.file) _url.push(`file=${encodeURIComponent(err.file)}`);

                    if (g_CurScene) {
                        if (g_CurScene == g_Launch) _url.push(`where=${encodeURIComponent('运行场景')}`);
                        else if (g_CurScene == g_Lobby) _url.push(`where=${encodeURIComponent('大厅场景')}`);
                        else if (g_CurScene == g_Table) _url.push(`where=${encodeURIComponent('游戏场景')}`);
                    }
                    var platform = '';

                    if (cc.sys.OS_ANDROID == cc.sys.os) platform = 'ANDROID';
                    else if (cc.sys.OS_IOS == cc.sys.os) platform = 'IOS';
                    else if (cc.sys.isBrowser) platform = 'WEB';

                    if (pGlobalUserData && pGlobalUserData.dwUserID) {
                        _url.push(`userID=${pGlobalUserData.dwUserID}`);
                        _url.push(`gameID=${pGlobalUserData.dwGameID}`);
                        var p = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
                        if (p == window.PLATFORM_WX) platform += '微信登录';
                        if (p == window.PLATFORM_PHONE) platform += '手机登录';
                        if (p == window.PLATFORM_TEST) platform += '测试登录';
                    } else {
                        _url.push(`userID=0`);
                    }

                    if (platform.length > 0) {
                        _url.push(`platform=${encodeURIComponent(platform)}`);
                    }
                    var url = `${loghost}${_url.join('&')}`;
                    WebCenter.GetData(url, 0, function (data) {}.bind(this));
                }
            }
            return {
                log: log
            };
        })();

        window.trapError = function (msg, URI, ln) {
            var e = new Error(msg);
            e.location = URI;
            e.line = ln;
            window.MyLogger.log(e);
            return false;
        };

        window.trapExceptional = function (msg, file) {
            var e = new Error(msg);
            e.file = file;
            window.MyLogger.log(e);
            return false;
        };
        // window.onerror = trapError;
    },

    start: function () {
        g_UpdateManager = this;
    },

    onEnable: function() {
        cc.director.on('UpdateItemProgress',this.OnItemProgress, this);
    },

    OnItemProgress: function(a, b) {
        this.m_ItemProgress.SetProgress(a / b);
        this.m_ItemProgress.node.active = this.m_Progress.node.active;
    },

    onDisable: function() {
        cc.director.off('UpdateItemProgress',this.OnItemProgress, this);
    },

    InitView: function () {
        if (!this.m_Download) this.m_Download = this.$('Download');
        if (!this.m_Progress) this.m_Progress = this.$('Slider@CustomSlider');
        if (!this.m_ItemProgress) this.m_ItemProgress = this.$('ItemSlider@CustomSlider');
        if(!this.m_LbTitle) this.m_LbTitle = this.$('Title@Label', this.m_Progress.node);
        if(!this.m_LbByte) this.m_LbByte = this.$('Layout/Byte@Label', this.m_Progress.node);
        if(!this.m_LbFile) this.m_LbFile = this.$('Layout/File@Label', this.m_Progress.node);
        this.m_LbTitle.string = '';
        this.m_LbByte.string = '';
        this.m_LbFile.string = '';
    },

    StartPreload: function (bLoadLobby, wKindID, Callback) {
        var ver = cc.sys.localStorage.getItem(window.Key_HUVersionA);
        cc.director.emit('LocalVersion', ver);
        this.m_LbTitle.string = '加载中，请稍候...';
        this.m_LbByte.string = '';
        this.m_LbFile.string = '';
        this.m_PreloadArray = cc.gPreLoader.StartPreload(bLoadLobby, wKindID);
        this.m_Progress.node.active = false;
        this.m_ItemProgress.node.active = false;
        this.m_nAllCnt = this.m_PreloadArray.length;
        this.m_nIndex = 0;
        this.m_nErrorCnt = 0;
        this.m_nNeedUpdate = 1;
        this.m_PreloadCall = Callback;
        if(this.m_nAllCnt > 0) {
            var ver = cc.sys.localStorage.getItem(`${window.Key_ABVersion}_UpdateManager_7`);
            if(LOG_NET_DATA) console.log(` !@~ start Preload[${this.m_nAllCnt}][${this.m_PreloadArray.join(' ')}][${ver}]!`);
            this.m_bFinish = false;
            ShowO2I(this.m_Progress.node);
            ShowO2I(this.m_ItemProgress.node);
            this.OnUpdateProgress(0);
            cc.director.emit('UpdateItemProgress', 0, 1);
            return true;
        } else {
            this.m_bFinish = true;
            return false;
        }
    },

    update: function () {
        if (this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }
        if(this.m_bFinish) {
            if(this.m_PreloadCall) this.m_PreloadCall();
            if(this.m_Progress.node.active) {
                HideI2O(this.m_Progress.node);
                HideI2O(this.m_ItemProgress.node);
            }
        } else {
            cc.gPreLoader.NextPreload(this.m_PreloadArray[this.m_nIndex], function () {
                this.m_nIndex++;
                this.OnUpdateProgress(this.m_nIndex / this.m_nAllCnt * 100);
                this.m_nNeedUpdate = 1;
            }.bind(this), function (err) {
                if (err) {
                    this.ShowAlert(`部分资源因网络问题未加载成功，可能存在资源显示不全的问题，如想避免问题请重新加载。`, Alert_Yes, function (Res) {}.bind(this));
                }
                this.m_nErrorCnt++;
                // this.m_nIndex++;
                // this.OnUpdateProgress(this.m_nIndex / this.m_nAllCnt * 100);
                window.trapExceptional(`Load ${this.m_PreloadArray[this.m_nIndex]} ${err}`, `UpdateManager`);
                this.m_nNeedUpdate = 1;
            }.bind(this));
        }
    },

    OnShowView: function () {
        this.InitView();
        this.m_Download.active = false;
        this.m_Progress.node.active = false;
        this.m_ItemProgress.node.active = false;
        ShowO2I(this.node);
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    ShowDownload: function (bShow, Ver) {
        this.m_Download.active = bShow;
        this.m_Progress.node.active = false;
        this.m_ItemProgress.node.active = false;
        this.m_Ver = Ver;
        this.m_LbTitle.string = '下载中，请稍候...'
    },

    OnClicked_Download: function () {
        this.m_Download.active = false;
        ShowO2I(this.m_Progress.node);
        HideI2O(this.m_ItemProgress.node);
        this.OnUpdateProgress(0);
        ThirdPartyUpdateGame(window.UPDATE_URL, `${window.APK_NAME}-${this.m_Ver}.apk`, this.m_Ver);
    },

    OnClicked_Exit: function () {
        ThirdPartyExitGame();
    },

    OnUpdateProgress: function (progress) {
        this.m_Progress.SetProgress(progress / 100);
        if(progress >= 100) this.m_bFinish = true;
        return progress;
    },

    /////////////////////////////////////////////////////////////////////////////////////

    CheckUpdate: function (Callback) {
        if (this._updating) { return cc.log("检测更新中..."); }
        this.m_HotupateCall = Callback;
        if (window.LOG_NET_DATA) console.log(` !@~ CheckUpdate url ${this.m_Manifest}`);
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'take-remote-asset');
        if (window.LOG_NET_DATA) console.log(` !@~ CheckUpdate Storage path for remote asset : ${this._storagePath}`);
        this._am = new jsb.AssetsManager(this.m_Manifest, this._storagePath, this.Compare.bind(this));
        this._am.setVerifyCallback(function (filePath, asset) { return true; });
        //初始化脚本版本信息
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            //一些安卓设备不支持同时下载文件过多
            this._am.setMaxConcurrentTask(2);
        } else {
            this._am.setMaxConcurrentTask(2);
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.m_Manifest.nativeUrl;
            if (window.LOG_NET_DATA) console.log(` !@~ CheckUpdate url1 ${url}`);
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            if (window.LOG_NET_DATA) console.log(` !@~ CheckUpdate url2 ${url}`);
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.ShowAlert('加载manifest文件失败', Alert_Yes, function (Res) {}.bind(this));
            return;
        }
        this._am.setEventCallback(this.checkCallback.bind(this));
        this._am.checkUpdate();
        this._updating = true;
        this.OnUpdateProgress(0);
    },

    Compare: function (versionA, versionB) {
        cc.sys.localStorage.setItem(window.Key_HUVersionA, versionA);
        cc.sys.localStorage.setItem(window.Key_HUVersionB, versionB);
        this.m_NewVer = versionB;
        if (window.LOG_NET_DATA) console.log(` !@~ JS Custom Version Compare: versionA[${versionA}] <=> versionB[${versionB}]`);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for(var i in vA) vA[i] = parseInt(vA[i]);
        for(var i in vB) vB[i] = parseInt(vB[i]);
        if (vA[0] != vB[0]) {
            this.ShowDownload(true, versionA);
            return 0;
        }
        for (var i = 1; i < vA.length; ++i) {
            var a = vA[i];
            var b = (vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    },

    checkCallback: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                if (window.LOG_NET_DATA) console.log(` !@~ checkCallback[${event.getEventCode()}]ERROR_NO_LOCAL_MANIFEST No local manifest file found, hot update skipped.`);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                if (window.LOG_NET_DATA) console.log(` !@~ checkCallback[${event.getEventCode()}]ERROR_DOWNLOAD_MANIFEST Fail to download manifest file, hot update skipped.`);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                if (window.LOG_NET_DATA) console.log(` !@~ checkCallback[${event.getEventCode()}]ALREADY_UP_TO_DATE Already up to date with the latest remote version.`);
                this.unschedule(this.OnTimer_DelayStartPreload);
                this.scheduleOnce(this.OnTimer_DelayStartPreload, 0.1);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                if (window.LOG_NET_DATA) console.log(` !@~ checkCallback[${event.getEventCode()}]NEW_VERSION_FOUND New version found, please try to update.`);
                this._am.setEventCallback(null);
                this._checkListener = null;
                this._updating = false;
                this.hotUpdate();
                return;
            default:
                return;
        }

        this._am.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    },

    OnTimer_DelayStartPreload: function() {
        this.unschedule(this.OnTimer_DelayStartPreload);
        this.StartPreload(true, false, this.m_HotupateCall);
    },

    updateCallback: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]ERROR_NO_LOCAL_MANIFEST No local manifest file found, hot update skipped.`);
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]UPDATE_PROGRESSION ${event.getAssetId()}`);
            case jsb.EventAssetsManager.ASSET_UPDATED:

                var progress = event.getPercent() * 100;
                progress = event.getPercentByFile() * 100;
                if (progress > 0) progress = parseInt(progress);
                else progress = 0;
                this.m_LbTitle.string = "自动更新进度" + progress + "%...";

                // this.m_LbByte.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                // this.m_LbFile.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();

                this.m_ItemProgress.SetProgress(event.getPercentByFile());
                this.OnUpdateProgress(progress);

                var msg = event.getMessage();
                if (msg) if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]UPDATE_PROGRESSION Updated file: ${msg}`);

                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]ERROR_DOWNLOAD_MANIFEST Fail to download manifest file, hot update skipped.`);

                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]ALREADY_UP_TO_DATE Already up to date with the latest remote version.`);
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]UPDATE_FINISHED Update finished. ${event.getMessage()}`);
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]UPDATE_FAILED Update failed. ${event.getMessage()}`);
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]ERROR_UPDATING Asset update error: ${event.getAssetId()},${event.getMessage()}`);
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]ERROR_DECOMPRESS ${event.getMessage()}`);
                break;
            default:
                if (window.LOG_NET_DATA) console.log(` !@~ updateCallback[${event.getEventCode()}]default ${event.getEventCode()}`);
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
            this._updateListener = null;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            if (window.LOG_NET_DATA) console.log(` !@~ newPaths ${JSON.stringify(newPaths)}`);
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            if (window.LOG_NET_DATA) console.log(` !@~ HotUpdateSearchPaths ${JSON.stringify(searchPaths)}`);
            jsb.fileUtils.setSearchPaths(searchPaths);
            this.m_LbTitle.string = "自动更新文件100%...";
            this.OnUpdateProgress(100);
            this.schedule(this.OnReStart, 1);
        }
    },

    OnReStart: function () {
        console.log(' ###### restart');
        cc.game.restart();
    },

    hotUpdate: function () {
        if (this._am && !this._updating) {
            if(LOG_NET_DATA) console.log(` !@~ start hotUpdate !`);
            this.m_LbTitle.string = '更新中，请稍候...'
            this._am.setEventCallback(this.updateCallback.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var url = this.m_Manifest.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }
            this._failCount = 0;
            this._am.update();
            this._updating = true;
            var ver = cc.sys.localStorage.getItem(window.Key_HUVersionA);
            cc.director.emit('LocalVersion', ver);
            ShowO2I(this.m_Progress.node);
            ShowO2I(this.m_ItemProgress.node);
        }
    },

    onDestroy: function () {
        if(this._am) {
            this._am.setEventCallback(null);
            this._am = null;
        }
    },

});
