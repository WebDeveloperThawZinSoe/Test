//ThirdParty.js

//回调相关
function CallLoginFunc(func, para) {
    if (window.LOG_NET_DATA) console.log("CallLoginFunc ", func, " : ", para)
    if (g_Login) {
        if (g_Login[func]) g_Login[func](para);
    } else {
        if (window.LOG_NET_DATA) console.log("g_Login is null");
    }
}

function CallLobbyFunc(func, para) {
    if (window.LOG_NET_DATA) console.log("CallLobbyFunc ", func, " : ", para)
    if (g_Lobby != null) {
        if (g_Lobby[func]) g_Lobby[func](para);
    }
}

function CallTableFunc(func, para) {
    if (window.LOG_NET_DATA) console.log("CallTableFunc ", func, " : ", para)
    if (g_Table != null) {
        if (g_Table[func]) g_Table[func](para);
    }
}

function CallUploadSuccess() {
    if (g_CurScene && g_CurScene.OnUpload_Success) g_CurScene.OnUpload_Success();
}

function CallUploadFaild() {
    if (g_CurScene && g_CurScene.OnUpload_Faild) g_CurScene.OnUpload_Faild();
}

function CallUpdateProgress(progress) {
    if(g_UpdateManager) g_UpdateManager.OnUpdateProgress(progress);
}

//
bShowEndGame = false;
function CallSystemBack() {
    if (bShowEndGame) return
    bShowEndGame = true;
    if (g_CurScene) {
        g_CurScene.ShowAlert('确定退出游戏？', Alert_YesNo, function (Res) {
            bShowEndGame = false;
            if (Res) ThirdPartyExitGame();
        });
    }
}

function CallOpenGPS(Param) {
    if (g_CurScene && g_CurScene.m_bTipGPS) {
        g_CurScene.ShowAlert('请开启手机GPS功能，不开启GPS无法显示GPS地址！', Alert_Yes, function (Res) {
            //ThirdPartyGetAddress(Number(Param) == 1 ? true : false);
        });
    }
}

//原生功能
function ThirdPartyGetBattery() {
    var pLv = 1;
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            pLv = jsb.reflection.callStaticMethod('AppController', "GetBatteryLv");
        } else {
            pLv = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetBatteryLv", "()Ljava/lang/String;");
        }
    }
    return pLv;
}

function ThirdPartyGetAddress(bInLobby) {
    if (bInLobby) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "getAddressInLobby");
        } else {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'getAddressInLobby', "()V");
        }
    } else {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "getAddress");
        } else {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'getAddress', "()V");
        }
    }
}

function ThirdPartyOpenUrl(address) {
    if(cc.sys.isBrowser) {
        window.location.href = address;
    } else {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "OpenUrl:", address);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "OpenUrl",
                "(Ljava/lang/String;)V",
                address);
        }
    }
}

function ThirdPartyOpenApp(address) {
    if (cc.sys.OS_IOS == cc.sys.os) {
        jsb.reflection.callStaticMethod("AppController", "OpenApp:", address);
    } else if (cc.sys.OS_ANDROID == cc.sys.os) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
            "OpenApp",
            "(Ljava/lang/String;)V",
            address);
    }
}

function ThirdPartyCopyClipper(address) {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "CopyClipper:", address);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "CopyClipper",
                "(Ljava/lang/String;)V",
                address);
        }
    } else {
        var input = address + '';
        var el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        var selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) originalRange = selection.getRangeAt(0);

        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        try {
            document.execCommand('copy');
        } catch (err) {}

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
    }
}

function ThirdPartyExitGame() {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "GameClose", "()V");
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "GameClose", "()V");
        }
    } else {
        if (cc.share.IsH5_WX()) {
            WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
        }
    }
}

function ThirdPartyUpdateGame(url,apkName,ver) {
    if (cc.sys.OS_ANDROID == cc.sys.os) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "updateVerion", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url,apkName,ver);
    }
}

//微信相关
function ThirdPartyWXLogin() {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "sendWXLogin");
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sendWXLogin", "()V");
        }
    }
}


function ThirdPartyShareMessage(ShareInfo, isLine) {
    if (window.LOG_NET_DATA) console.log("WXShare ", isLine, " ", ShareInfo)
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "WXSharetitle:description:url:IsTimeLine:", ShareInfo.title, ShareInfo.desc,
                ShareInfo.link, isLine);
        } else {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'WXShare',
                "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
                ShareInfo.title, ShareInfo.desc,
                ShareInfo.link, isLine);
        }

    } else {
        if (cc.share.IsH5_WX()) {
            if (isLine == 1)
                wx.updateTimelineShareData(ShareInfo);
            else
                wx.updateAppMessageShareData(ShareInfo);
        } else {
            return false;
        }
    }
    return true
}

function ThirdPartyShareImg(Path, isLine) {
    if (window.LOG_NET_DATA) console.log("WXShareTex ", Path)
    isLine = isLine?isLine:'';
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "WXShareTex:IsTimeLine:", Path, isLine);
        } else {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'WXShareTex',
                "(Ljava/lang/String;Ljava/lang/String;)V",
                Path, isLine);
        }
    }
}

function ThirdPartyWXPay(Info) {
    if (window.LOG_NET_DATA) console.log("ThirdPartyWXPay " + Info)
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "WXPay:", Info);
        } else {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "WXPay",
                "(Ljava/lang/String;)V", Info);
        }
    }
}

function ThirdPartyGVoiceOnRecord() {
    if (cc.sys.OS_IOS == cc.sys.os) {
        return jsb.reflection.callStaticMethod("AppController", "onRecord");
    } else {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onRecord", "()Ljava/lang/String;");
    }
}


function ThirdPartyGVoicePlayVoice(Path) {
    if (cc.sys.OS_IOS == cc.sys.os) {
        jsb.reflection.callStaticMethod("AppController", "onPlay:", Path);
    } else {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onPlay", "(Ljava/lang/String;)V", Path);
    }
}

///////////////////////////////////////////////////////////////////////////
//全平台语音
function ThirdPartyVoiceInit(Hook) {
    if(cc.share.IsH5_WX()) {
        return (typeof wx != 'undefined');
    } else {
        if (cc.sys.isNative) return true;
    }
}

//开始录制
function ThirdPartyVoiceOnRecord(Hook) {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod("AppController", "onRecord");
        } else {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "startRecord", "()Ljava/lang/String;");
        }
    } else {
        if (typeof wx == 'undefined') {

        } else {
            wx.startRecord({
                success: function () {
                    Hook.ShowRecording(true);
                },
            });
        }
        return '';
    }
}
//结束录制
function ThirdPartyVoiceStopRecord(Hook) {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "onStopRecord:", "()V");
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "onStopRecord", "()V");
        }
    } else {
        if (typeof wx == 'undefined') {

        } else {
            var voice = {
                localId: '',
                serverId: '',
                viewID: 65535,
            };
            wx.stopRecord({
                success: function (res1) {
                    voice.localId = res1.localId;
                    wx.uploadVoice({
                        localId: voice.localId,
                        success: function (res2) {
                            voice.serverId = res2.serverId;
                            Hook.OnRecordOver(voice);
                        }
                    });
                }
            });
        }
    }
}
//上传结果
function ThirdPartyVoiceOnUpload(Hook, Path) {
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "onDownLoad:", VID);
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onDownLoad", "(Ljava/lang/String;)V", VID);
        }
    } else {
        if (typeof wx == 'undefined') {
            return false;
        } else {
            return true;
        }
    }
}

function ThirdPartyGVoiceLoadVoice(VID) {
    if (cc.sys.OS_IOS == cc.sys.os) {
        jsb.reflection.callStaticMethod("AppController", "onDownLoad:", VID);
    } else {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onDownLoad", "(Ljava/lang/String;)V", VID);
    }
}

/////////////////
cc.voice = {
    MaxRecordTime: 59000,
    _startTime: 0,
    IsPlaying: false,
    IsRecording: false,

    _voiceH5: {},
    _queue: [],

    _ctrl: null,
    _engine: null,


    Type: cc.Enum({
        NULL: 0,
        RECORD_START: 1,
        RECORD_STOP: 2,
        PLAY: 3,
        PLAY_ALL_FINISH: 4
    }),


    Init: function (VoiceCtrl, GameEngine) {
        this._ctrl = VoiceCtrl;
        this._engine = GameEngine;
        if (cc.share.IsH5_WX()) {
            return (typeof wx != 'undefined');
        } else {
            if (cc.sys.isNative) return true;
        }
    },

    GetRecordTime: function () {
        if (!this._startTime) return null;
        return new Date().getTime() - this._startTime;
    },

    startRecord: function () {
        try {
            if (cc.share.IsH5_WX()) {
                if (typeof wx == 'undefined') {
                    this._ctrl.onDispose(false, this.Type.RECORD_START);
                } else {
                    wx.startRecord({
                        success: function () {
                            this.IsRecording = true;
                            this._startTime = new Date().getTime();
                            this._ctrl.onDispose(true, this.Type.RECORD_START);
                        }.bind(this),
                        fail: function () {
                            this._ctrl.onDispose(false, this.Type.RECORD_START);
                        }.bind(this),
                    });
                }
            } else if (cc.sys.isNative) {
                this.IsRecording = true;
                this._startTime = new Date().getTime();
                this._ctrl.onDispose(true, this.Type.RECORD_START);
                if (cc.sys.OS_IOS == cc.sys.os) {
                    jsb.reflection.callStaticMethod("AppController", "startRecord");
                } else {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "startRecord", "()V");
                }
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
        }

    },

    stopRecord: function () {
        try {
            if (this._startTime == null) return;
            this.IsRecording = false;
            var recordTime = new Date().getTime() - this._startTime;
            var str = (recordTime < 1000 ? '0' : '1');
            this._startTime = null;
            if (cc.share.IsH5_WX()) {
                if (typeof wx == 'undefined') {
                    return this._ctrl.onDispose(false, this.Type.RECORD_STOP);
                } else if (str == '0' || typeof wx == 'undefined') {
                    wx.stopRecord({
                        success: function () {
                            this._ctrl.onDispose(true, this.Type.RECORD_STOP);
                        }.bind(this)
                    });
                    return this._ctrl.onDispose(false, this.Type.RECORD_STOP);

                } else {
                    wx.stopRecord({
                        success: function (res1) {
                            this._ctrl.onDispose(true, this.Type.RECORD_STOP);
                            wx.uploadVoice({
                                localId: res1.localId,
                                success: function (res2) {
                                    this._voiceH5[res2.serverId] = res1.localId;
                                    this.send(1, res2.serverId);
                                }.bind(this)
                            });
                        }.bind(this)
                    });
                }
            } else if (cc.sys.isNative) {
                var res = '';
                if (cc.sys.OS_IOS == cc.sys.os) { // IOS端需要走回调完成结束
                    res = jsb.reflection.callStaticMethod("AppController", "stopRecord:", str);
                    this._ctrl.onDispose(true, this.Type.RECORD_STOP);
                } else {
                    res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "stopRecord", "(Ljava/lang/String;)Ljava/lang/String;", str);
                    if (str == '0') {
                        return this._ctrl.onDispose(false, this.Type.RECORD_STOP);
                    } else {
                        this._ctrl.onDispose(true, this.Type.RECORD_STOP);
                        this.send(0, res);
                    }
                }
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
        }
    },

    onRecordFinish: function (res) { // IOS 回调
        if (res == '') {
            return this._ctrl.onDispose(false, this.Type.RECORD_STOP);
        }
        this.send(0, res);
    },

    receive: function (pVoice) {
        try {
            if (!!!this._queue) this._queue = [];
            // 原生
            if (pVoice.cbPlatform == 0) {
                if (!cc.share.IsH5_WX()) {
                    if (!!!this._voice) this._voice = [];
                    if (!!!this._voice[pVoice.dwSendUserID]) this._voice[pVoice.dwSendUserID] = '';
                    this._voice[pVoice.dwSendUserID] += (pVoice.szVID.replace(/\n/g, ''));
                    if (pVoice.bFinish) {
                        this._pushVoice(pVoice.cbPlatform, pVoice.dwSendUserID, pVoice.dwTargetUserID, this._voice[pVoice.dwSendUserID]);
                        this._voice[pVoice.dwSendUserID] = '';
                        this._next();
                    }
                }
            } else { // 微信H5
                if (cc.share.IsH5_WX()) {
                    if (!!this._voiceH5[pVoice.szVID]) {
                        this._pushVoice(pVoice.cbPlatform, pVoice.dwSendUserID, pVoice.dwTargetUserID, this._voiceH5[pVoice.szVID]);
                        this._next();
                    } else {
                        wx.downloadVoice({
                            serverId: pVoice.szVID,
                            success: function (res) {
                                this._voiceH5[pVoice.szVID] = res.localId;
                                this._pushVoice(pVoice.cbPlatform, pVoice.dwSendUserID, pVoice.dwTargetUserID, this._voiceH5[pVoice.szVID]);
                                this._next();
                            }.bind(this)
                        });
                    }
                }
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
        }

    },

    _pushVoice: function (cbPlatform, dwSendUserID, dwTargetUserID, szVID) {
        this._queue.push({
            cbPlatform: cbPlatform,
            dwSendUserID: dwSendUserID,
            dwTargetUserID: dwTargetUserID,
            szVID: szVID,
        });
    },

    send: function (platform, str) {
        try {
            if (platform == 0) { // 原生
                while (str.length != 0) {
                    if (str.length > 255) {
                        this._engine.OnSendUserVoice(platform, str.slice(0, 255), false);
                        str = str.slice(255);
                    } else {
                        this._engine.OnSendUserVoice(platform, str.slice(0), true);
                        str = '';
                    }
                }
            } else {
                this._engine.OnSendUserVoice(platform, str, true);
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
        }

    },

    _next: function () {
        if (this._queue.length > 0) {
            this.IsPlaying = true;
            return this.playVoice(this._queue.shift());
        } else {
            this.IsPlaying = false;
            // this._ctrl.onFinish();
            this._ctrl.onDispose(true, this.Type.PLAY_ALL_FINISH);
        }
    },

    // platform 0原生 1微信H5
    playVoice: function (data) {
        try {
            var platform = data.cbPlatform;
            var content = data.szVID;
            if (window.LOG_DEBUG) console.log(data);
            if (platform == 0) { // 原生
                if (cc.share.IsH5_WX()) return this.onPlayFinish();
                if (cc.sys.isNative) { // 原生播放
                    // this._ctrl.onPlay(data);
                    this._ctrl.onDispose(true, this.Type.PLAY, data);

                    if (cc.sys.OS_IOS == cc.sys.os) {
                        jsb.reflection.callStaticMethod("AppController", "playVoice:", content);
                    } else {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "playVoice", "(Ljava/lang/String;)V", content);
                    }
                } else { // 浏览器播放
                    var video = document.createElement('video');
                    video.src = 'data:audio/mp4;base64,' + content;
                    video.autoplay = true;
                    // this._ctrl.onPlay(data);
                    this._ctrl.onDispose(true, this.Type.PLAY, data);
                    video.addEventListener("ended", function () {
                        video.remove();
                        this.onPlayFinish();
                    }.bind(this), false);
                }
            } else { // 微信H5
                if (!cc.share.IsH5_WX()) return this.onPlayFinish();
                if (typeof wx == 'undefined') {
                    if (!!finishFunc) finishFunc();
                } else { // 微信播放
                    wx.playVoice({
                        localId: data.szVID,
                        success: function () {
                            // this._ctrl.onPlay(data);
                            this._ctrl.onDispose(true, this.Type.PLAY, data);
                        }.bind(this)
                    });
                    wx.onVoicePlayEnd({
                        complete: function (res) {
                            this.onPlayFinish();
                        }.bind(this)
                    });
                }
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
        }

    },

    onPlayFinish: function () { // 原生回调
        this._next();
    },

}

// 语音base64
function ThirdPartyStartRecord(success, fail) {
    if(cc.share.IsH5_WX()) {
        if (typeof wx == 'undefined') {

        } else {
            wx.startRecord({
                success: function () {
                    if(success) success();
                },
                fail: function() {
                    if(fail) fail();
                },
            });
        }
    } else if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "startRecord");
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "startRecord", "()V");
        }
    }
}

function ThirdPartyStopRecord(str) {
    var res = '';
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            res = jsb.reflection.callStaticMethod("AppController", "stopRecord:", str);
        } else {
            res = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "stopRecord", "(Ljava/lang/String;)Ljava/lang/String;", str);
        }
    }
    return res;
}

function ThirdPartyPlayVoice(str) {
    if (window.LOG_NET_DATA) console.log(str);
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController", "playVoice:", str);
        } else {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/VoiceCtrl", "playVoice", "(Ljava/lang/String;)V", str);
        }
    } else {
        var video = document.createElement('video');
        video.src = 'data:audio/mp4;base64,' + str;
        video.autoplay = true;
        video.addEventListener("ended", function () {
            video.remove();
            g_Table.OnPlayFinish();
        }, false)
        if (typeof wx == 'undefined') {

        } else {

        }
    }
}

function ThirdPartyPickImg(JsonObj, szNeedChip) {
    JsonObj.URL = window.PHP_UPLOAD_URL;
    JsonObj.PickEndCallback = 'OnPhotoPickEnd';
    if (cc.sys.isNative) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            // jsb.reflection.callStaticMethod("AppController","WXSharetitle:description:url:IsTimeLine:",ShareInfo.title,ShareInfo.desc,ShareInfo.link, isLine);
            jsb.reflection.callStaticMethod("RootViewController", "pickImg:description:", JSON.stringify(JsonObj), szNeedChip);
            console.log(' ### ios ThirdPartyPickImg ' + JSON.stringify(JsonObj));
        } else {
            jsb.reflection.callStaticMethod(
                'org/cocos2dx/javascript/AppActivity', 'pickImg', "(Ljava/lang/String;Ljava/lang/String;)V", JSON.stringify(JsonObj), szNeedChip
            );
        }

    } else {
        if (cc.share.IsH5_WX()) {
            //
        } else {
            return false;
        }
    }
    return true
}

function Restart (e) {
	if(window.LOG_DEBUG && e) console.log(e);
    cc.game.restart();
}
