var PreLoader = cc.Class({
    ctor: function () {
        this.m_MapBundle = {};
        this.m_MapPrefab = {};
        this.m_MapAudio = {};
        this.m_MapRes = {};
        this.m_szToolPhp = 'Tool.php';
        this.m_szRemote = 'remote';
    },

    Init: function (CallFunc) {
        this.LoadBundleVer(CallFunc);
    },

    LoadBundleVer: function (CallFunc) {
        var webUrl = `${window.PHP_HOME}/${this.m_szToolPhp}`;
        if (cc.share.IsH5_WX()) {
            webUrl += '?GetMark=1';
            this.m_szRemote = 'game/assets';
        } else {
            webUrl += '?GetMark=0';
        }
        WebCenter.GetData(webUrl, 0, function (data) {
            var Cnt = 0;
            var Index = 0;
            var pData = JSON.parse(data);
            if (pData) {
                for (var i in pData) {
                    if(i == 'RemotePath') {
                        this.m_szRemote = pData[i];
                        continue;
                    }
                    var ver = pData[i][0].substring(pData[i][0].indexOf('.') + 1, pData[i][0].lastIndexOf('.'));
                    if (this.m_MapBundle[i]) {
                        this.m_MapBundle[i].Ver = ver;
                        this.m_MapBundle[i].PrefabCnt = 0;
                    }
                    else this.m_MapBundle[i] = {
                        Name: i,
                        Ver: ver,
                        Bundle: null,
                        PrefabCnt: 0,
                    };
                    Cnt++;
                }
            }

            for (var i in this.m_MapBundle) {
                var UrlRemote = `${window.PHP_HOME}/${this.m_szRemote}/${this.m_MapBundle[i].Name}/config.${this.m_MapBundle[i].Ver}.json`;
                if(window.LOG_NET_DATA) console.log(` ###### LoadBundleVer ${UrlRemote} `);
                cc.assetManager.loadRemote(UrlRemote, function (a, b, c) {
                    var BundleName = b.json.name;
                    for (var j in b.json.paths) {
                        if(!b.json.types[b.json.paths[j][1]]) continue;
                        var Name = b.json.paths[j][0].substring(b.json.paths[j][0].lastIndexOf('/') + 1, b.json.paths[j][0].length);
                        var Path = b.json.paths[j][0].substring(b.json.paths[j][0].lastIndexOf('/') + 1, 0);
                        if (b.json.types[b.json.paths[j][1]] == 'cc.Prefab') {
                            if (!this.m_MapPrefab[Name]) {
                                this.m_MapPrefab[Name] = {
                                    BundleName: BundleName,
                                    Name: Name,
                                    ComName: Name,
                                    Path: Path,
                                    Prefab: null,
                                    Type: cc.Prefab,
                                };
                            }
                            this.m_MapBundle[BundleName].PrefabCnt++;

                        } else if (b.json.types[b.json.paths[j][1]] == 'cc.AudioClip') {
                            if (!this.m_MapAudio[BundleName]) this.m_MapAudio[BundleName] = {};
                            var AudioName = `${Path}${Name}`.replace(/\//g,'_');
                            this.m_MapAudio[BundleName][AudioName] = {
                                BundleName: BundleName,
                                Name: Name,
                                Path: Path,
                                Audio: null,
                                Type: cc.AudioClip,
                            };
                        } else {
                            if (!this.m_MapRes[BundleName]) this.m_MapRes[BundleName] = {};
                            var ResName = `${Path}${Name}`.replace(/\//g,'_');
                            this.m_MapRes[BundleName][ResName] = {
                                BundleName: BundleName,
                                Name: Name,
                                Path: Path,
                                Body: null,
                                Type: eval(b.json.types[b.json.paths[j][1]]),
                            };
                        }
                    }
                    Index++;
                    if (Index == Cnt && CallFunc) CallFunc();
                }.bind(this));
            }
        }.bind(this));
    },

    _LoadBundle: function(BundleName, Callback, Param) {
        if(this.m_MapBundle[BundleName].Bundle == 'loading') return 'loading';
        if (this.m_MapBundle[BundleName].Bundle) {
            if(window.LOG_NET_DATA) console.log(` ###### _LoadBundle => ${BundleName} is loaded, to loadprefab `);
            if(Callback) Callback(this.m_MapBundle[BundleName].Bundle, Param);
        } else {
            this.m_MapBundle[BundleName].Bundle = 'loading';
            var UrlBundle = `${BundleName}`;
            var Version = null;
            if(cc.sys.isNative) {
                UrlBundle = `${window.PHP_HOME}/${this.m_szRemote}/${BundleName}`;
                Version = new Object();
                Version.version = this.m_MapBundle[BundleName].Ver;
            }
            if(window.LOG_NET_DATA) console.log(` ###### _LoadBundle => ${UrlBundle} `);
            cc.assetManager.loadBundle(UrlBundle, Version, function (err, bundle) {
                if (err) {
                    this.m_MapBundle[BundleName].Bundle = null;
                    this.m_MapBundle[BundleName].Error = err;
                    if(window.LOG_NET_DATA) (`loadBundle[${BundleName}] error ${err}`);
                    if(window.trapExceptional) {
                        window.trapExceptional(`_LoadBundle ${BundleName} ${err}`, `Preloader`);
                    }
                    return null;
                }
                if(window.LOG_NET_DATA) console.log(` ###### _LoadBundle success => ${BundleName} `);
                cc.sys.localStorage.setItem(`${window.Key_ABVersion}_${BundleName}`, this.m_MapBundle[BundleName].Ver);
                this.m_MapBundle[BundleName].Bundle = (bundle);
                this.m_MapBundle[BundleName].Error = null;
                if(Param) Param.BundleName = BundleName;
                if(Callback) Callback(bundle, Param);
            }.bind(this));
        }
    },

    _LoadPrefab: function(PrefabName, Bundle, OnSuccess, OnFalied, Param) {
        if(this.m_MapPrefab[PrefabName].Prefab == 'loading') return 'loading';
        this.m_MapPrefab[PrefabName].Prefab = 'loading';
        var UrlPrefab = `${this.m_MapPrefab[PrefabName].Path}${this.m_MapPrefab[PrefabName].Name}`;
        if(window.LOG_NET_DATA) console.log(` ###### _LoadPrefab => loadPrefab url ${UrlPrefab} `);
        Bundle.load(UrlPrefab, cc.Prefab, function(a, b, c){
            cc.director.emit('UpdateItemProgress', a, b);
        }.bind(this),function (err, prefab) {
            if (err) {
                this.m_MapPrefab[PrefabName].Prefab = null;
                this.m_MapPrefab[PrefabName].Error = err;
                console.log(`_loadPrefab[${PrefabName}] error ${err}`);
                if (OnFalied) OnFalied(err);
                return null;
            }
            if(window.LOG_NET_DATA) console.log(` ###### _LoadPrefab success => ${PrefabName} => ${this.m_MapPrefab[PrefabName].Path}${this.m_MapPrefab[PrefabName].Name} `);
            this.m_MapPrefab[PrefabName].Prefab = prefab;
            this.m_MapPrefab[PrefabName].Error = null;
            if (OnSuccess) OnSuccess(prefab, Param);
        }.bind(this));
    },

    LoadPrefab: function(Key, OnSuccess, OnFalied) {
        if (!this.m_MapPrefab[Key]) return null;
        var szBundleName = this.m_MapPrefab[Key].BundleName;
        if (!szBundleName) return null;
        if (this.m_MapBundle[szBundleName].Bundle == 'loading') {
            if(window.LOG_NET_DATA) console.log(` ###### LoadPrefab => bundle ${szBundleName} is loading `);
            return null;
        }
        if (this.m_MapPrefab[Key].Prefab == 'loading'){
            if(window.LOG_NET_DATA) console.log(` ###### LoadPrefab => prefab ${Key} is loading `);
            return null;
        }
        if (this.m_MapPrefab[Key].Prefab) {
            var TempPre = cc.instantiate(this.m_MapPrefab[Key].Prefab).getComponent(this.m_MapPrefab[Key].ComName);
            if(!TempPre) {
                this.m_MapPrefab[Key].Prefab = null;
                if(window.LOG_NET_DATA) console.log(` ###### LoadPrefab faild => reload prefab ${Key} `);
                this.LoadPrefab(Key, OnSuccess, OnFalied);
                return null;
            }
            if (OnSuccess) OnSuccess(TempPre);
            return TempPre;
        } else {
            this._LoadBundle(szBundleName, function(Bundle, Param1) {
                this._LoadPrefab(Key, Bundle, function(prefab, Param2) {
                    var TempPre = cc.instantiate(prefab).getComponent(this.m_MapPrefab[Param1.Key].ComName);
                    if (Param1 && Param1.OnSuccess) Param1.OnSuccess(TempPre);
                }.bind(this), function(err){
                    if (Param1 && Param1.OnFalied) Param1.OnFalied(err);
                    else if(window.trapExceptional) {
                        window.trapExceptional(`Loadprefab ${Param1.Key} ${err}`, `Preloader`);
                    }
                },);
            }.bind(this), {Key: Key, OnSuccess: OnSuccess, OnFalied: OnFalied});
        }
        return null;
    },

    LoadAudio: function (Key, Path, KindID, Callback, Param) {
        this.LoadAudioByBundle(KindID, Key, Path, Callback, Param);
    },

    LoadPublicAudio: function (Key, Callback, Param) {
        this.LoadAudioByBundle('PublicAudio', Key, null, Callback, Param);
    },

    LoadAudioByBundle: function(BundleName, Key, Path, Callback, Param) {
        if (!this.m_MapAudio[BundleName]) return null;
        for(var i in this.m_MapAudio[BundleName]) {
            var UrlAudio = `${this.m_MapAudio[BundleName][i].Path}${this.m_MapAudio[BundleName][i].Name}`;
            if(Path) { if(Path != UrlAudio) continue; }
            else { if(Key != i) continue; }
            if(this.m_MapBundle[BundleName].Bundle == 'loading') break;
            if(this.m_MapBundle[BundleName].Bundle) {
                this.m_MapBundle[BundleName].Bundle.load(UrlAudio, cc.AudioClip, function (a, b, c){}.bind(this), function (err, audio){
                    if(!err && Callback) Callback(audio, Param);
                }.bind(this));
            } else {
                this._LoadBundle(BundleName, function(Bundle) {
                    this.m_MapBundle[BundleName].Bundle.load(UrlAudio, cc.AudioClip, function (a, b, c){}.bind(this), function (err, audio){
                        if(!err && Callback) Callback(audio, Param);
                    }.bind(this));
                }.bind(this));
            }
            break;
        }
    },

    LoadGamePrefab: function (Key, Callback) {
        return this.LoadPrefab(Key, Callback);
    },

    LoadByGame: function (KindID) {

    },

    LoadPrefabByBundle: function (BundleName) {
        for (var i in this.m_MapPrefab) {
            if (this.m_MapPrefab[i].BundleName != BundleName) continue;
            this.LoadPrefab(i);
        }
    },

    LoadResByBundle: function(BundleName, path, Callback) {
        this._LoadBundle(BundleName, function (Bundle) {
            Bundle.loadDir(path, cc.SpriteFrame, function (err, assets) {
                console.log(assets);
                if(Callback) Callback();
            }.bind(this));
        }.bind(this));
    },

    LoadRes: function(Name, BundleName, Callback, Param) {
        if (!this.m_MapRes[BundleName]) return null;
        if (!this.m_MapRes[BundleName][Name]) return null;
        if(this.m_MapRes[BundleName][Name].Body) {
            if(Callback) Callback(this.m_MapRes[BundleName][Name].Body, Param);
            return this.m_MapRes[BundleName][Name].Body;
        }
        if (Callback && this.m_MapRes[BundleName][Name]) {
            if (!!!this.m_MapRes[BundleName][Name].CallbackList) this.m_MapRes[BundleName][Name].CallbackList = [];
            this.m_MapRes[BundleName][Name].CallbackList.push({
                Callback: Callback,
                Param: Param
            })
        }
        return this._LoadBundle(BundleName, function (Bundle) {
            for(var i in this.m_MapRes[BundleName]) {
                if(this.m_MapRes[BundleName][i].CallbackList && this.m_MapRes[BundleName][i].CallbackList.length > 0) {
                    this._LoadRes(Bundle, `${this.m_MapRes[BundleName][i].Path}${this.m_MapRes[BundleName][i].Name}`, i, BundleName);
                }
            }
        }.bind(this), Param);
    },

    _LoadRes: function(Bundle, Url, Name, BundleName, Callback, Param) {
        Bundle.load(Url, this.m_MapRes[BundleName][Name].Type, function (a, b, c) {}.bind(this), function (err, res) {
            if (err) {
                this.m_MapRes[BundleName][Name].Body = null;
                this.m_MapRes[BundleName][Name].Error = err;
                console.log(`_LoadRes[ ${BundleName} => ${Name} ] error ${err}`);
                if(window.trapExceptional) {
                    window.trapExceptional(`_LoadRes ${BundleName} => ${Name} ${err}`, `Preloader`);
                }
                return;
            }
            this.m_MapRes[BundleName][Name].Body = res;
            for (var j in this.m_MapRes[BundleName][Name].CallbackList) {
                this.m_MapRes[BundleName][Name].CallbackList[j].Callback(this.m_MapRes[BundleName][Name].Body, this.m_MapRes[BundleName][Name].CallbackList[j].Param);
            }
            this.m_MapRes[BundleName][Name].CallbackList = new Array();
        }.bind(this));
    },

    Exist_Res: function(BundleName, Name) {
        if (!this.m_MapRes[BundleName]) return false;
        if (!this.m_MapRes[BundleName][Name]) return false;
        return true;
    },

    Exist_Prefab: function(Name) {
        if (!this.m_MapPrefab[Name]) return false;
        var BundleName = this.m_MapPrefab[Name].BundleName;
        if(!BundleName) return false;
        if (!this.m_MapBundle[BundleName]) return false;
        return true;
    },

    _GetGameSupport: function(wKindID) {
        var LoadArray = ['GamePublic_3', 'Chat_2', 'GPS_2', 'Jetton_2', 'GameSetting_2', 'GameNNPublic_2'];
        if(!wKindID) {
            LoadArray.push('GamePHZ_2');
            LoadArray.push('PublicMJ_2');
        } else {
            for (var i in window.GameList_MJ_New) {
                if (window.GameList_MJ_New[i] == wKindID) {
                    LoadArray.push('GameMJ_2');
                    break;
                }
            }
            for (var i in window.GameList_MJ) {
                if (window.GameList_MJ[i] == wKindID) {
                    LoadArray.push('PublicMJ_2');
                    break;
                }
            }
            for (var i in window.GameList_PHZ){
                 if (window.GameList_PHZ[i] == wKindID) {
                    LoadArray.push('GamePHZ_2');
                    break;
                 }
            }
        }
        return LoadArray;
    },

    StartPreload: function(bLoadLobby, wKindID) {
        this.m_nPrefabCnt = 0;
        this.m_nLoadCnt = 0;
        this.m_LoadArray = [];
        this.m_GameSupport = this._GetGameSupport(wKindID);
        if(bLoadLobby) {
            for(var i = 7; i > 1; -- i) {
                for(var j in this.m_MapPrefab) {
                    var BundleName = this.m_MapPrefab[j].BundleName;
                    var bLoad = true;
                    for(var k in this.m_GameSupport) {
                        if(BundleName == this.m_GameSupport[k]) {
                            bLoad = false;
                            break;
                        }
                    }
                    if(!bLoad) continue;
                    var temp = BundleName.split('_');
                    if(temp.length < 2) continue;
                    if(Number(temp[1]) != i) continue;
                    this.m_nPrefabCnt ++;
                    this.m_LoadArray.push(this.m_MapPrefab[j].Name);
                }
            }

            for(var j in this.m_MapPrefab) {
                var BundleName = this.m_MapPrefab[j].BundleName;
                var bLoad = true;
                if(Number(BundleName) > 0) bLoad = false;
                else {
                    for(var k in this.m_GameSupport) {
                        if(BundleName == this.m_GameSupport[k]) {
                            bLoad = false;
                            break;
                        }
                    }
                }
                if(!bLoad) continue;
                var temp = BundleName.split('_');
                if(temp.length > 1) continue;
                this.m_nPrefabCnt ++;
                this.m_LoadArray.push(this.m_MapPrefab[j].Name);
            }
            for(var i in window.GameList) {
                this.m_LoadArray.push(`SubRoom_${i}`);
            }
        }

        if(wKindID) {
            for(var i = 7; i > 1; -- i) {
                for(var j in this.m_MapPrefab) {
                    var BundleName = this.m_MapPrefab[j].BundleName;
                    var bLoad = false;
                    for(var k in this.m_GameSupport) {
                        if(BundleName == this.m_GameSupport[k]) {
                            bLoad = true;
                            break;
                        }
                    }
                    if(!bLoad) continue;
                    var temp = BundleName.split('_');
                    if(temp.length < 2) continue;
                    if(Number(temp[1]) != i) continue;
                    this.m_nPrefabCnt ++;
                    this.m_LoadArray.push(this.m_MapPrefab[j].Name);
                }
            }
            for(var j in this.m_MapPrefab) {
                var BundleName = this.m_MapPrefab[j].BundleName;
                if(BundleName != wKindID) continue;
                var temp = BundleName.split('_');
                if(temp.length > 1) continue;
                this.m_nPrefabCnt ++;
                this.m_LoadArray.push(this.m_MapPrefab[j].Name);
            }
            return this.m_LoadArray;
        }
        return this.CheckVer(this.m_LoadArray);
    },

    NextPreload: function(Name, OnSuccess, OnFalied) {
        this.LoadPrefab(Name, OnSuccess, OnFalied);
    },

    CheckVer: function(LoadArray) {
        for(var i = LoadArray.length - 1; i >= 0; -- i) {
            if(!this.m_MapPrefab[LoadArray[i]]) {
                LoadArray.splice(i, 1);
            } else {
                var BundleName = this.m_MapPrefab[LoadArray[i]].BundleName;
                var Ver = null;
                if(this.m_MapBundle[BundleName]) Ver = this.m_MapBundle[BundleName].Ver;
                var LocalVer = null;
                LocalVer = cc.sys.localStorage.getItem(`${window.Key_ABVersion}_${BundleName}`);
                if(Ver && LocalVer && Ver == LocalVer) LoadArray.splice(i, 1);
            }
        }
        return LoadArray;
    }
});

cc.gPreLoader = new PreLoader();

var SoundHead = '';
var GSoundHead = '';
//音頻
var tagSoundRes = cc.Class({
    ctor: function () {
        this.m_SoundMap = new Object();
        this.m_GameSoundMap = new Object();
        this.m_GameIndex = null;
    },

    //播放声音
    PlaySound: function (Key) {
        var value = this.GetSoundVolume();
        if (value == 0) return;
        if(this.m_SoundMap[Key]) {
            cc.audioEngine.play(this.m_SoundMap[Key], false, value);
        } else {
            this.LoadSound(Key, function(audio) {
                cc.audioEngine.play(audio, false, value)
            }.bind(this));
        }
    },

    //加载声音
    LoadSound: function (Key, Callback) {
        cc.gPreLoader.LoadPublicAudio(Key, function(audio, Param) {
            this.m_SoundMap[Param.Key] = audio;
            if (this.m_WBGM == Param.Key) this.PlayMusic(Key, false);
            if(Callback) Callback(audio);
        }.bind(this), {Key: Key});
    },

    LoadSoundArr: function (SoundArr, Bundle) {
        for (var i in SoundArr) {
            cc.gPreLoader.LoadAudio(SoundArr[i][0], SoundArr[i][1], Bundle, function(audio, Param) {
                var Key = Param.Key;
                this.m_SoundMap[Param.Key] = audio;
                if (this.m_WBGM == Key) this.PlayMusic(Key, true);
            }.bind(this), {Key: SoundArr[i][0], Bundle: Bundle});
        }
    },

    //播放游戏声音
    PlayGameSound: function (Key) {
        try {
            var value = this.GetSoundVolume();
            if (value == 0) return;
            var sound = this.m_GameSoundMap[this.m_GameIndex][Key];
            // if (sound == null) console.log("播放声音失败:" + Key);
            if(sound) cc.audioEngine.play(sound, false, value);
        } catch(e) {
            if(window.trapExceptional) {
                window.trapExceptional(`cc.gSoundRes.PlayGameSound: ${this.m_GameIndex} => ${Key} ${e}`, `tagSoundRes`);
            }
        }
    },

    //加载游戏声音列表
    LoadGameSoundArr: function (wKindID, SoundArr) {
        if (wKindID == null) return;
        if (this.m_GameSoundMap[wKindID] == null) this.m_GameSoundMap[wKindID] = new Object();
        this.m_GameIndex = wKindID;
        //已加载
        if (this.m_GameSoundMap[wKindID].bFinish) return;
        //加载资源
        for (var i in SoundArr) {
            // this.LoadGameSound(SoundArr[i][0], 'Audio/' + SoundArr[i][1]);
            cc.gPreLoader.LoadAudio(SoundArr[i][0], 'Audio/' + SoundArr[i][1], this.m_GameIndex, function(audio, Param) {
                var Key = Param.Key;
                var KindID = Param.KindID;
                this.m_GameSoundMap[KindID][Key] = audio;
                if (this.m_WBGM == Key) this.PlayMusic(Key, true);
            }.bind(this), {Key: SoundArr[i][0], KindID: this.m_GameIndex});
        }
        this.m_GameSoundMap[wKindID].bFinish = true;
    },

    PlaySoundPhrase: function (wItemIndex, sex, bGame) {
        var value = this.GetSoundVolume();
        if (value == 0) return;
        var szName = "Phrase"
        if (sex == 0) szName += '_w'
        if (sex == 1) szName += '_m'
        szName += wItemIndex;
        if (bGame) this.PlayGameSound(szName);
        else this.PlaySound(szName);
    },

    //更新BGM音量
    UpdateVolume: function () {
        var value = this.GetBGMVolume();
        cc.audioEngine.setVolume(this.m_PlayingID, value);
    },

    //播放BGM
    PlayMusic: function (Key, bGame) {
        this.m_WBGM = Key;
        this.m_WBGame = bGame;
        cc.audioEngine.stopAll();
        if (!bGame && this.m_SoundMap[Key] == null) {
            cc.gPreLoader.LoadPublicAudio(Key, function(audio, Param) {
                this.m_SoundMap[Param.Key] = audio;
                this.PlayMusic(Param.Key, bGame);
            }.bind(this), {Key: Key});
            return;
        }
        if (bGame && this.m_GameSoundMap[this.m_GameIndex][Key] == null) return

        var value = this.GetBGMVolume();
        this.m_WBGM = null;
        if (bGame) {
            this.m_PlayingID = cc.audioEngine.play(this.m_GameSoundMap[this.m_GameIndex][Key], true, value);
        } else {
            this.m_PlayingID = cc.audioEngine.play(this.m_SoundMap[Key], true, value);
        }
    },

    //停止BGM
    StopMusic: function () {
        cc.audioEngine.stop(this.m_PlayingID);
    },

    GetBGMVolume: function () {
        return parseFloat(window.g_Setting[window.SetKey_Music]);
    },

    GetSoundVolume: function () {
        return parseFloat(window.g_Setting[window.SetKey_Sound]);
    },
});
cc.gSoundRes = new tagSoundRes();
