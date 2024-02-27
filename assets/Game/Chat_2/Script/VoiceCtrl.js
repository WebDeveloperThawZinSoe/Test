cc.Class({
    extends: cc.BaseClass,

    properties: {
       // m_atlas: cc.SpriteAtlas
    },

    ctor: function () {
        this.m_LoadArr = new Array(); //加载队列
        this.m_WaitArr = new Array(); //等待播放
        this.m_SelfArr = new Array(); //本地上传
        this.m_PlayingArr = new Array(); //
        this.m_PlayingIndex = INVALD_CHAIR; //播放中
        this.m_GameEngine = null;
        this.m_Voices = new Array(); // 语音队列
        this.m_Sequence = new Array();
    },

    onLoad: function () {
        this.m_btVoice = this.$('Voice/btVoice');
        this.m_nRecording = this.$('Voice/Recording');
        this.m_nSign = this.$('Voice/Sign');

        //按钮监听
        this.m_btVoice.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.RecordStart();
        }.bind(this), this.m_btVoice);

        this.m_btVoice.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.RecordOver();
        }.bind(this), this.m_btVoice);
        this.m_btVoice.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.RecordOver();
        }.bind(this), this.m_btVoice);

        for (var i in this.m_nSign.children) {
            this.m_PlayingArr[i] = this.m_nSign.children[i].getComponent(cc.Sprite);
        }
        this.schedule(this.PlayingTag, 0.2);
    },

    PlayingTag: function () {
        if (this.m_PlayingIndex == INVALD_CHAIR) return;
        if (this.m_PlayingTag == null) this.m_PlayingTag = 1;
        this.m_PlayingTag++;
        if (this.m_PlayingTag > 3) this.m_PlayingTag = 0;
        // this.m_PlayingArr[this.m_PlayingIndex].spriteFrame = this.m_atlas.getSpriteFrame('Play' + this.m_PlayingTag);

        cc.gPreLoader.LoadRes('Image_Play' + this.m_PlayingTag, 'Chat_2', function (sf, Param) {
            var Index = Param.Index;
            // var Tag = Param.m_PlayingTag;
            this.m_PlayingArr[Index].spriteFrame = sf;
        }.bind(this), {
            Index: this.m_PlayingIndex,
            Tag: this.m_PlayingTag
        });
    },

    //初始化
    InitVoice: function (Hook) {
        if (this.m_GameEngine != null) return;
        this.m_Hook = Hook;
        this.m_GameEngine = this.m_Hook.m_GameClientEngine;
        if(!ThirdPartyVoiceInit()) this.node.active = false;
    },

    RecordStart: function () {
        if (this.m_nRecording.active) return;
        if (this.m_PlayingIndex != INVALD_CHAIR) return this.ShowTips('请等待语音播放结束后再进行录音！');

        cc.audioEngine.pauseAll();
        this.ShowRecording(true);
        // this.m_RecordPath = ThirdPartyVoiceOnRecord(this);
        // if (!cc.sys.isBrowser) {
        //     if (this.m_RecordPath == "") return this.ShowTips("没有录音权限！！！")
        //     this.ShowRecording(true);
        // }
        ThirdPartyStartRecord();
    },

    PlayVoice: function (data) {
        if (this.m_Voices[data.dwSendUserID] == null) this.m_Voices[data.dwSendUserID] = '';
        this.m_Voices[data.dwSendUserID] += data.szVID;
        if (data.byPlatform == 0) {
            data.szVID = this.m_Voices[data.dwSendUserID];
            data.szVID = data.szVID.replace(/\n/g, '');
            this.m_Voices[data.dwSendUserID] = '';
            this.m_Sequence.push(data);
            if (this.isPlaying) return;
            this.OnPlayFinish();
        }
    },

    onRecordFinish :function (data) {
        if (data == '') {
            cc.audioEngine.resumeAll();
            this.ShowRecording(false);
            this.ShowTips('录制时间过短！');
            return;
        }
        var str = data;
        while (str.length != 0) {
            if (str.length > 255) {
                this.m_GameEngine.OnSendUserVoice(2, str.slice(0, 255));
                str = str.slice(255);
            } else {
                this.m_GameEngine.OnSendUserVoice(0, str.slice(0));
                str = '';
            }
        }
    },

    RecordOver: function () {
        if (this.m_RecordStart == null) return
        this.m_RecordTime = new Date().getTime() - this.m_RecordStart;
        this.m_RecordStart = null;

        let str = ThirdPartyStopRecord((this.m_RecordTime < 1000?'0':'1'));

        if(cc.sys.isNative) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                if (str == '') {
                    cc.audioEngine.resumeAll();
                    this.ShowRecording(false);
                    this.ShowTips('录制时间过短！');
                    return;
                }
                while (str.length != 0) {
                    if (str.length > 255) {
                        this.m_GameEngine.OnSendUserVoice(2, str.slice(0, 255));
                        str = str.slice(255);
                    } else {
                        this.m_GameEngine.OnSendUserVoice(0, str.slice(0));
                        str = '';
                    }
                }
                this.ShowRecording(false);
            } else {
                this.ShowRecording(false);
            }
            cc.audioEngine.resumeAll();
        }


        // ThirdPartyVoiceStopRecord(this);

        // ThirdPartyVoiceOnUpload(this, this.m_RecordPath);
        // if(cc.sys.isBrowser) {
        //     var self = this;
        //     var voice = {
        //         localId: '',
        //         serverId: '',
        //         viewID: 65535,
        //     };
        //     wx.stopRecord({
        //         success: function (res1) {
        //             voice.localId = res1.localId;
        //             wx.uploadVoice({
        //                 localId: voice.localId,
        //                 success: function (res2) {
        //                     voice.serverId = res2.serverId;
        //                     self.OnRecordOver(voice);
        //                 }
        //             });
        //         }
        //     });
        // } else {

        // }


    },
    //发送完成回调
    OnRecordOver: function (RecordStr) {
        this.ShowRecording(false);
        if (cc.sys.isBrowser) {
            //添加无需加载队列
            RecordStr.viewID = GameDef.MYSELF_VIEW_ID;
            this.m_SelfArr.push(RecordStr);
            //发送语音通知
            this.m_GameEngine.OnSendUserVoice(1, RecordStr.serverId);
        } else {
            var RecordArr = RecordStr.split(',');

            //添加无需加载队列
            RecordArr[2] = GameDef.MYSELF_VIEW_ID;
            this.m_SelfArr.push(RecordArr);
            //发送语音通知
            this.m_GameEngine.OnSendUserVoice(0, RecordArr[0]);
        }

        this.CheckPlayArr();
    },

    OnLoadVoice: function (RecordStr) {
        if (cc.sys.isBrowser) {
            for (var i in this.m_LoadArr) {
                if (this.m_LoadArr[i].serverId == RecordStr.serverId) {
                    this.m_LoadArr[i].localId = RecordStr.localId;
                    this.m_WaitArr.push(this.m_LoadArr.splice(i, 1)[0]);
                    break
                }
            }
        } else {
            var RecordArr = RecordStr.split(',');
            for (var i in this.m_LoadArr) {
                if (this.m_LoadArr[i][0] == RecordArr[0]) {
                    this.m_LoadArr[i][1] = RecordArr[1];
                    this.m_WaitArr.push(this.m_LoadArr.splice(i, 1)[0]);
                    break
                }
            }
        }
        this.CheckPlayArr();
    },

    // OnPlayFinish: function () {
    //     this.ShowPlaying(INVALD_CHAIR);
    //     this.CheckPlayArr();
    // },

    OnPlayFinish: function () {
        if (this.m_Sequence.length > 0) {
            var data = this.m_Sequence.shift();
            if (!this.isPlaying) {
                this.isPlaying = true;
                cc.audioEngine.pauseAll();
            }
            var wChairID = this.m_GameEngine.GetUserChairID(data.dwSendUserID);
            var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
            this.ShowPlaying(wViewID);
            ThirdPartyPlayVoice(data.szVID);
        } else {
            this.isPlaying = false;
            cc.audioEngine.resumeAll();
            this.ShowPlaying(INVALD_CHAIR);
        }
    },

    CheckPlayArr: function () {
        if (this.m_PlayingIndex != INVALD_CHAIR || this.m_nRecording.active) return;
        if (cc.sys.isBrowser) {
            if (this.m_WaitArr.length > 0) {
                var playInfo = (this.m_WaitArr.splice(0, 1)[0]);
                var self = this;
                //播放音频文件
                wx.playVoice({
                    localId: playInfo.localId,
                    success: function () {
                        self.ShowPlaying(playInfo.viewID);
                    }
                });
                wx.onVoicePlayEnd({
                    complete: function (res) {
                        self.OnPlayFinish();
                    }
                });
            }
        } else {
            if (this.m_WaitArr.length > 0) {
                var playInfo = this.m_WaitArr.splice(0, 1)[0];
                //播放音频文件
                ThirdPartyPlayVoice(playInfo[1]);
                //显示播放标志
                this.ShowPlaying(playInfo[2]);
            }
        }
    },
    //显示播放标志
    ShowPlaying: function (ViewID) {
        this.m_PlayingIndex = ViewID;
        for (var i = 0; i < this.m_PlayingArr.length; i++) {
            this.m_PlayingArr[i].node.active = (i == ViewID);
        }
        if (ViewID != INVALD_CHAIR) {
            var scalex = this.m_Hook.m_UserVoiceArr[ViewID].x >= 200?-1:1;
            this.m_PlayingArr[ViewID].node.setPosition(this.m_Hook.m_UserVoiceArr[ViewID].x,this.m_Hook.m_UserVoiceArr[ViewID].y);
            this.m_PlayingArr[ViewID].node.setScale(scalex, 1);
            this.m_TempBGM = cc.gSoundRes.GetBGMVolume();
            window.SaveSetting(window.SetKey_Music, 0);
        } else {
            window.SaveSetting(window.SetKey_Music, this.m_TempBGM);
        }
        //音量调整
        cc.gSoundRes.UpdateVolume();
    },
    //显示录制
    ShowRecording: function (bShow) {
        this.m_nRecording.active = bShow;
        if (bShow) {
            //开始计时
            this.m_RecordStart = new Date().getTime();
            this.m_TempBGM = cc.gSoundRes.GetBGMVolume();
            window.SaveSetting(window.SetKey_Music, 0);
        } else {
            window.SaveSetting(window.SetKey_Music, this.m_TempBGM);
        }
        //音量调整
        cc.gSoundRes.UpdateVolume();
    },

    //播放消息处理
    AddVoice: function (pVoice) {
        if (pVoice.byPlatform == 1) { //WX
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if (this.m_Hook.m_pIClientUserItem[i] == null) continue;
                if (this.m_Hook.m_pIClientUserItem[i].GetUserID() == pVoice.dwSendUserID) {
                    if (i == GameDef.MYSELF_VIEW_ID) {
                        for (var j = 0; j < this.m_SelfArr.length; j++) {
                            if (this.m_SelfArr[j].serverId == pVoice.szVID) {
                                this.m_SelfArr[j].viewID = i;
                                this.m_WaitArr.push(this.m_SelfArr.splice(j, 1)[0]);
                                break;
                            }
                        }
                    } else {
                        this.m_LoadArr.push({
                            serverId: pVoice.szVID,
                            localId: '',
                            viewID: i
                        });
                        var self = this;
                        wx.downloadVoice({
                            serverId: pVoice.szVID,
                            success: function (res) {
                                self.OnLoadVoice({
                                    serverId: pVoice.szVID,
                                    localId: res.localId,
                                    viewID: i
                                });
                            }
                        });
                    }
                    break;
                }
            }
        } else {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if (this.m_Hook.m_pIClientUserItem[i] == null) continue;
                if (this.m_Hook.m_pIClientUserItem[i].GetUserID() == pVoice.dwSendUserID) {
                    if (i == GameDef.MYSELF_VIEW_ID) { //本地消息
                        for (var j = 0; j < this.m_SelfArr.length; j++) {
                            if (this.m_SelfArr[j][0] == pVoice.szVID) {
                                this.m_WaitArr.push(this.m_SelfArr.splice(j, 1)[0]);
                                break;
                            }
                        }
                    } else { //网络消息加载
                        this.m_LoadArr.push([pVoice.szVID, '', i]);
                        //下载音频文件
                        ThirdPartyGVoiceLoadVoice(pVoice.szVID);
                    }

                    break;
                }
            }
        }

        this.CheckPlayArr();
    },
    update: function (dt) {
        if (this.m_nRecording == null) return

        //录音动画
        if (this.m_nRecording.active) {
            var Now = new Date().getTime();
            if (this.m_RecordStart != null && Now - this.m_RecordStart > 59000) {
                this.RecordOver();
                this.ShowTips('录音时长达到上限！');
            }
        }
    },
});
