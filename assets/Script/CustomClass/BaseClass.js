//基本方法封裝
cc.BaseClass = cc.Class({
    extends: cc.Component,
    ctor: function () {},

    SetHook: function (Hook) {
        this.m_Hook = Hook;
    },

    OnCheckLoadingPre: function () {
        //通用队列
        for (var i in this.m_WaitArr) {
            var bInGame = this.m_WaitArr[i][3];
            var PreName = this.m_WaitArr[i][0];
            var res;
            if (bInGame) res = cc.gPreLoader.LoadGamePrefab(PreName);
            else res = cc.gPreLoader.LoadPrefab(PreName);

            if (res == null) continue;
            if (res != 'err') {
                var memVar = 'm_Js' + PreName;
                this[memVar] = res;
                this.m_WaitArr[i][1].addChild(this[memVar].node);

                this[memVar].SetHook(this);
                this[memVar].ShowView();

                if (this.m_WaitArr[i][2] != null) {
                    if (typeof (this.m_WaitArr[i][2]) == "string") this[this.m_WaitArr[i][2]](res);
                    else this.m_WaitArr[i][2](res);
                }
            }
            this.m_WaitArr.splice(i, 1);
        }
        if (this.m_WaitArr.length == 0) this.unschedule(this.OnCheckLoadingPre);
    },

    ShowPrefabDLG: function (PreName, Parent, Call, KindID) {
        //默认子节点
        if (Parent == null) Parent = this.node;
        if (this.m_WaitArr == null) this.m_WaitArr = new Array();
        var memVar = 'm_Js' + PreName;
        if (this[memVar] && this[memVar].node == null) this[memVar] = null;
        //已有直接显示
        if (this[memVar]) {
            if (this[memVar].node.parent != Parent) this[memVar].node.parent = Parent;
            this[memVar].ShowView();
            if (Call != null) {
                if (typeof (Call) == "string") this[Call](this[memVar]);
                else Call(this[memVar]);
            }
            return this[memVar];
        } else {
            //判断是否已在检查队列
            var bInArr = false;
            for (var i in this.m_WaitArr) {
                if (this.m_WaitArr[i][0] == PreName) {
                    bInArr = true;
                    break;
                }
            }

            if (!bInArr) {
                var res = cc.gPreLoader.LoadPrefab(PreName, null);
                if (res == null) { //未加载完成插入检查队列
                    if (this.m_WaitArr.length == 0) this.schedule(this.OnCheckLoadingPre, 0.02);
                    this.m_WaitArr.push([PreName, Parent, Call, KindID]);
                } else { //已经预加载
                    if (res != 'err') {
                        this[memVar] = res;
                        Parent.addChild(this[memVar].node);
                        this[memVar].SetHook(this);
                        this[memVar].ShowView();
                        if (Call != null) {
                            if (typeof (Call) == "string") this[Call](res);
                            else Call(res);
                        }
                        return res;
                    }
                }
            }
        }
        this.OnCheckLoadingPre();
        return null;
    },

    ShowGamePrefab: function (PreName, KindID, Parent, Call) {
        return this.ShowPrefabDLG(PreName + '_' + KindID, Parent, Call, KindID);
    },

    ShowTips: function (str) {
        cc.gPreLoader.LoadPrefab("CustomTips", function (Js) {
            Js.SetTips(str);
            this.node.addChild(Js.node);
        }.bind(this));
    },
    //Func 回调参数 确定1  取消0  关闭null
    ShowAlert: function (str, style, Func, Hook) {
        cc.gPreLoader.LoadPrefab("Alert", function (Js) {
            this.node.addChild(Js.node);
            Js.ShowView();
            if (style == null) style = Alert_Yes; //默认参数
            Js.ShowAlert(str, style, Func, Hook);
            this['m_JsAlert'] = Js;
        }.bind(this));
    },
    OnDestroy: function (Tag, self) {
        if (self == null){
            if(this.node)this.node.destroy();
        }
        else{
            if(self.node)self.node.destroy();
        }
    },
    HideView: function () {
        if (this.OnHideView)
            this.OnHideView();
        else
            this.node.active = false;
    },
    ShowView: function () {
        this.node.active = true;
        // var curScale = this.node.getScale();
        // this.node.setScale(0.01);
        // this.node.runAction(cc.scaleTo(0.1, curScale))
        if (this.OnShowView) this.OnShowView();
    },
    OnBtClose:function()
    {
        cc.gSoundRes.PlaySound('Button');
        this.HideView();
    },
    OnBtClickSound: function () {
        cc.gSoundRes.PlaySound('Button');
    },

    ShowLoading: function (OverTime, StrWord) {
        if (this.m_LoadCnt == null) this.m_LoadCnt = 0;
        this.m_LoadCnt++;
        if (OverTime == null) OverTime = 8;
        this.ShowPrefabDLG('CustomLoading', this.node, function (Js) {
            this.m_DlgLoading = Js;
            if (OverTime) this.m_DlgLoading.SetOverTime(OverTime);
            if (StrWord) this.m_DlgLoading.SetWorkStr(StrWord);
            if (this.m_LoadCnt == 0) this.m_DlgLoading.HideView();
        }.bind(this));
    },
    LoadingOver: function () {
        this.ShowTips("请求超时，请检查网络！")
        this.StopLoading();
    },
    StopLoading: function () {
        if (this.m_LoadCnt) this.m_LoadCnt--;
        if (this.m_DlgLoading && this.m_LoadCnt == 0) {
            this.m_DlgLoading.HideView();
        }
    },
    ////////////////////////////////////////////////////////////////
    GetComponentName: function (component) {
        return component.name.match(/<.*>$/)[0].slice(1, -1);
    },
    $: function (Path, StartNode) {
        if (StartNode == null) StartNode = this.node;
        if(!StartNode) return null;
        var NdJs = Path.split('@');
        var NdArr = NdJs[0].split('/');

        for (var i in NdArr) {
            if (NdArr[i] != '') {
                if (NdArr[i] == '..') StartNode = StartNode.parent;
                else StartNode = StartNode.getChildByName(NdArr[i]);
                if (StartNode == null) {
                    if (this.m_bShowLostPath) console.log('$ find err !!! path=', Path)
                    return null;
                }
            }
        }

        if (NdJs[1] == null) {
            return StartNode;
        } else {
            var Coms = StartNode._components;

            for (var i in Coms) {
                if (this.GetComponentName(Coms[i]) == NdJs[1]) return Coms[i];
            }
            if (this.m_bShowLostPath) console.log('$ find Com err !!! path=', Path)
            return null;
        }
    },

    BindButtonInit: function () {
        var BtArr = this.node.getComponentsInChildren(cc.Button);
        for (var i in BtArr) {
            if (BtArr[i].clickEvents.length == 0) {
                if (BtArr[i].node.name[0] == '$') continue;
                var ParseArr = BtArr[i].node.name.split('#');
                var FuncName = 'OnClick_' + ParseArr[0];
                if (this[FuncName]) {
                    var eventHandler = new cc.Component.EventHandler();
                    eventHandler.target = this.node;
                    eventHandler.component = this.GetComponentName(this);
                    eventHandler.handler = FuncName;
                    eventHandler.customEventData = ParseArr[1];
                    //eventHandler.emit([BtArr[i].node]);
                    BtArr[i].clickEvents.push(eventHandler)
                } else {
                    console.log('bind err in FuncName=', FuncName, BtArr[i].node)
                }
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////
    OnEventLinkErr: function () {
        this.ShowTips("网络连接失败！！！");
        this.StopLoading();
    },
    ////////////////////////////////////////////////////////////////
});

window.RulesKey = window.QPName + '_Rules_';
window.RulesKey2 = window.QPName + '_S_Rules_';

cc.SubRoomRules = cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Font: cc.Font, //用户信息预制体
    },
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间
    ctor: function () {
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;
        this.m_Color = [
            cc.color(201, 73, 36), // 选中状态
            cc.color(201, 73, 36), // 未选中状态
            cc.color(201, 73, 36), // 分项文字颜色
        ];
    },

    InitView: function (Kind, Key, RoomType) {
        if (this.m_togArr == null) this.m_togArr = this.node.getComponentsInChildren(cc.Toggle);
        this.m_KindID = Kind;
        this.m_KeyStr = window.QPName + '_Rules_' + this.m_KindID;
        var rules = cc.sys.localStorage.getItem(this.m_KeyStr);
        if (rules != null) rules = JSON.parse(rules);

        //初始化数据
        if (this.m_bFirstShow && rules) {
            for (var i in this.m_togArr) {
                var IsChecked = false;
                for (var j in rules) {
                    if (this.m_togArr[i].node.name == rules[j]) {
                        IsChecked = true;
                        break;
                    }
                }
                this.m_togArr[i].isChecked = IsChecked;
            }
        }
        this.UpdateSubitemTitleColor();
        this.SetLabelColor();
        this.SetClubView(RoomType);
        this.SetKeyView(Key);
        this.m_bNeedUpdate = true;
        this.m_bFirstShow = false;
    },
    SetLabelColor:function(){
        var LabelArr = this.node.getComponentsInChildren(cc.Label);
        for (const i in LabelArr) {
            LabelArr[i].node.color =  this.m_Color[0];
            if(this.m_Font)LabelArr[i].font = this.m_Font;
        }
    },
    OnHideView: function () {
        this.getRulesEx();
        this.getServerRules();
        this.node.active = false;
    },

    OnUpdateToggleColor: function () {
        for (var i in this.m_togArr) {
            if (!this.m_togArr[i].node.active) continue;
            var color = this.m_togArr[i].isChecked ? this.m_Color[0] : this.m_Color[1];
            this.m_togArr[i].node.getChildByName("Label").color = color
        }
    },

    OnToggleClick: function (Tag, Data) {
        this.m_bNeedUpdate = true;
    },
    getRulesEx: function (bLog) {
        var rules = [0, 0, 0, 0, 0];
        var ruleshistory = new Array();
        for (var i in this.m_togArr) {
            if (this.m_togArr[i].node.parent.active && this.m_togArr[i].node.active && this.m_togArr[i].isChecked) {
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                ruleshistory.push(rulesIndex);
                if (bLog && window.LOG_NET_DATA) console.log(rulesIndex + " ==> " + this.$('Label@Label', this.m_togArr[i].node).string);
                if (rulesIndex < 1000) {
                    var rIndex = parseInt(rulesIndex / 100);
                    var rValue = parseInt(rulesIndex % 100);
                    if (rValue <= 31 && rIndex < 5) rules[rIndex] += 1 << rValue;
                }
            }
        }
        this.GetCustomRules(rules);

        cc.sys.localStorage.setItem(this.m_KeyStr, JSON.stringify(ruleshistory));
        return rules;
    },

    getServerRules: function () {
        var rules = 0;
        for (var i in this.m_togArr) {
            if (this.m_togArr[i].node.parent.active && this.m_togArr[i].node.active && this.m_togArr[i].isChecked) {
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                if (rulesIndex < 1000 || rulesIndex >= 1050) continue;
                rulesIndex -= 1000;
                rules += 1 << rulesIndex;
            }
        }
        return rules;
    },


    update: function () {
        if (this.m_bNeedUpdate) {
            this.m_bNeedUpdate = false;
        } else {
            return;
        }
        //私有联动
        this.OnUpdateCustomView();
        //单选颜色
        this.OnUpdateToggleColor();
    },
    //游戏自定义借口
    SetKeyView: function () {},
    SetClubView: function () {},
    GetCustomRules: function () {},
    OnUpdateCustomView: function () {},
    UpdateSubitemTitleColor: function(){},
});

cc.GameEngine = cc.Class({
    extends: cc.BaseClass,

    properties: {},
    onLoad: function () {
        this.m_GameClientView = this.$('GameClientView@GameClientView_' + GameDef.KIND_ID);
    },
    ctor: function () {
        this.m_dwRoomID = 0;
        this.m_dwRoomID2 = 0;
        this.m_dwCreater = 0; //创建者ID
        this.m_dwClubID = 0;
        this.m_dwRulesArr = new Array(0, 0, 0, 0, 0);
        this.m_wGameProgress = 0;
        this.m_wGameCount = 0;
        this.m_ReplayMode = false;
        this.m_bLockInRoom = false;
        this.m_LockArr = new Array();
        this.m_LoadFinished = false;
    },

    SetTableScene: function (tableScene) {
        this.m_pTableScene = tableScene;
        this.m_TableViewFrame = tableScene.m_TableViewFrame;
    },

    LoadSound: function () {
        cc.gSoundRes.LoadGameSoundArr(GameDef.KIND_ID, this.m_SoundArr);
        cc.gSoundRes.PlayMusic('BGM', true);
        if (1 || this.m_szText == null) {
            for (var i = 1; i <= 12; i++) {
                cc.gSoundRes.LoadSound("Phrase_w_" + (i < 10 ? '0' + i : i));
                cc.gSoundRes.LoadSound("Phrase_m_" + (i < 10 ? '0' + i : i));
            }
        }
    },

    //播放操作声音
    PlayActionSound: function (wChairId, byAction) {
        if (this.m_ReplayMode) return
        //椅子效验
        var pIClientUserItem = this.GetClientUserItem(wChairId);
        if (pIClientUserItem == null) return;
        if (pIClientUserItem.GetGender() == 1) {
            cc.gSoundRes.PlayGameSound("M_" + byAction);
        } else {
            cc.gSoundRes.PlayGameSound("W_" + byAction);
        }
    },

    OnSwitchAcc: function () {
        this.m_pTableScene.m_ServerItem.CloseSocket();
    },
    //启动游戏
    SetupGameClient: function () {
        return true;
    },

    //旁观消息
    OnEventLookonMode: function (pData, wDataSize) {
        return true;
    },

    //用户进入
    OnEventUserEnter: function (pIClientUserItem, bLookonUser) {
        //视图用户
        if (bLookonUser == false) {
            //获取属性
            var wViewID = this.SwitchViewChairID(pIClientUserItem.GetChairID());
            this.m_GameClientView.OnUserEnter(pIClientUserItem, wViewID);
            if(wViewID == GameDef.MYSELF_VIEW_ID){
                this.m_GameClientView.LoadCardTestNode();
            }
        }
        this.UpdateLookSitView();
    },

    //用户状态
    OnEventUserStatus: function (pIClientUserItem, bLookonUser) {
        //视图用户
        if (bLookonUser == false) {
            //获取属性
            var wChairID = this.SwitchViewChairID(pIClientUserItem.GetChairID());
            this.m_GameClientView.OnUserState(pIClientUserItem, wChairID);
        }
        this.UpdateLookSitView();
    },

    //用户离开
    OnEventUserLeave: function (pIClientUserItem, bLookonUser) {
        if (pIClientUserItem.GetUserID() == this.m_dwCreater && this.m_wGameProgress == 0) {
            //this.OnCreatorExit();
        }
        if (bLookonUser == false) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                if (this.m_GameClientView.m_pIClientUserItem[i] == null) continue;
                if (pIClientUserItem.GetUserID() == this.m_GameClientView.m_pIClientUserItem[i].GetUserID()) {
                    this.m_GameClientView.OnUserLeave(pIClientUserItem, i);
                }
            }
        }
    },
    OnEventScoreUpdare: function (pIClientUserItem, bLookonUser) {
        //视图用户
        if (bLookonUser == false) {
            //获取属性
            var wChairID = this.SwitchViewChairID(pIClientUserItem.GetChairID());
            this.m_GameClientView.OnUserScore(pIClientUserItem, wChairID);
        }
    },

    GetMeChairID: function () {
        var kernel = gClientKernel.get();
        if (kernel == null) return INVALD_CHAIR;
        return kernel.GetMeChairID();
    },

    GetMeUserItem: function () {
        var kernel = gClientKernel.get();
        if (!kernel) return null;

        return kernel.GetMeUserItem();
    },

    //切换椅子
    SwitchViewChairID: function (wChairID) {
        var MeChairID = this.GetMeChairID();
        if (wChairID == INVALD_CHAIR || MeChairID == INVALD_CHAIR) return INVALD_CHAIR;

        if (this.SwitchViewChairID2) return this.SwitchViewChairID2(wChairID);
        //转换椅子
        var wViewChairID = (wChairID + GameDef.GAME_PLAYER - this.GetMeChairID());

        return (wViewChairID + GameDef.MYSELF_VIEW_ID) % GameDef.GAME_PLAYER;
    },

    IsValidChairID: function (wChairID) {
        if (wChairID >= 0 && wChairID < GameDef.GAME_PLAYER) return true;
        return false;
    },

    OnUserReSit: function () {
        for (var i in this.m_GameClientView.m_pIClientUserItem) {
            var UserItem = this.m_GameClientView.m_pIClientUserItem[i];
            if (UserItem) this.m_GameClientView.OnUserLeave(UserItem, i);
        }

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var UserItem = this.GetClientUserItem(i);
            var ViewID = this.SwitchViewChairID(i);
            if (UserItem) this.m_GameClientView.OnUserEnter(UserItem, ViewID);
        }
    },
    OnCardRoomMessage: function (sub, data, datasize) {
        var self = this;
        var kernel = gClientKernel.get();
        switch (sub) {
            case SUB_GF_ROOM_INFO: {
                var pRoomInfo = new CMD_GF_RoomInfo();
                if (datasize != gCByte.Bytes2Str(pRoomInfo, data)) return false;

                this.m_dwRulesArr = pRoomInfo.dwRulesArr;
                this.m_dwServerRules = pRoomInfo.dwServerRules;
                this.m_dwClubID = pRoomInfo.dwClubID;
                this.m_dwRoomID = pRoomInfo.dwRoomID;
                this.m_dwRoomID2 = pRoomInfo.dwRoomID2;
                this.m_dwCreater = pRoomInfo.dwCreaterID;

                ShowLobbyClub = pRoomInfo.dwClubID;

                this.SetViewRoomInfo(this.m_dwServerRules, this.m_dwRulesArr);
                this.OnUserReSit();

                //房间记录
                var TempStr = cc.sys.localStorage.getItem(window.QPName + 'RoomHistory');
                var TempArr = new Array();
                if (TempStr) TempArr = JSON.parse(TempStr);
                if (this.m_dwRoomID > 0) {
                    var bNotIn = true;
                    for (var i in TempArr) {
                        if (TempArr[i] == this.m_dwRoomID) bNotIn = false;
                    }
                    //if(bNotIn)TempArr.push(this.m_dwRoomID);
                }
                cc.sys.localStorage.setItem(window.QPName + 'RoomHistory', JSON.stringify(TempArr));
                //更新GPS
                if (GameDef.IsNoCheat(this.m_dwRulesArr)) this.GetSelfGPSInfo();

                //显示邀请按钮
                if(g_Table&&g_Table.OnSetInviteBtShow) g_Table.OnSetInviteBtShow(this.GetMeUserItem());

                //微信H5分享链接
                cc.share.InitShareInfo_H5_WX(this.GetShareInfo.bind(this));
                return true;
            }
            case SUB_GF_ROOM_STATUS: {
                var pRoomStatus = new CMD_GF_RoomStatus();
                pRoomStatus.bLockArr = new Array(GameDef.GAME_PLAYER);
                if (datasize != gCByte.Bytes2Str(pRoomStatus, data)) return false;
                this.m_wGameProgress = pRoomStatus.wProgress;
                this.m_LockArr = pRoomStatus.bLockArr;
                var kernel = gClientKernel.get();
                this.m_bLockInRoom = pRoomStatus.bLockArr[this.GetMeChairID()] && !kernel.IsLookonMode();
                //更新界面
                this.m_GameClientView.UpdateRoomProgress();
                //更新GPS
                if (GameDef.IsNoCheat(this.m_dwRulesArr)) this.GetSelfGPSInfo();
                return true;
            }
            case SUB_GF_ROOM_GAME_FINISH: {
                this.OnEventRoomEnd(data, datasize);
                if (!this.m_ReplayMode) {
                    this.m_TableViewFrame.mServerItem.IntermitConnect(false);
                }
                return true;
            }
            case SUB_GF_ROOM_DISSOLVE: {
                this.m_TableViewFrame.mServerItem.IntermitConnect(false);
                this.ShowAlert("房间已解散！", Alert_Yes, function (Res) {
                    self.m_pTableScene.ExitGame();
                });
                return true;
            }
            case SUB_GF_ROOM_USER_DISSOLVE: {
                this.m_UserDiss = new CMD_GF_UserDissolve();
                if (datasize != gCByte.Bytes2Str(this.m_UserDiss, data)) return false;
                this.m_DissolveRes = null;
                this.m_UserDiss.byChoose = new Array();
                g_TimerEngine.PauseGameTimer();
                this.ShowPrefabDLG('DissolveRoom', this.node, function (Js) {
                    this.m_DisCtrl = Js;
                    this.m_DisCtrl.SetDissolveInfo(this.m_UserDiss.dwDisUserID, this.m_UserDiss.byChoose, this.m_UserDiss.dwAllCountDown, this.m_LockArr,this.m_UserDiss.dwAllCountDown);
                    if (this.m_DissolveRes) this.m_DisCtrl.SetDisRes(this.m_DissolveRes.bDissolve);
                }.bind(this));

                return true;
            }
            case SUB_GF_ROOM_DISSOLVE_STATUS: {
                this.m_UserDiss = new CMD_GF_RoomDissolve();
                this.m_UserDiss.byChoose = new Array(GameDef.GAME_PLAYER);
                if (datasize != gCByte.Bytes2Str(this.m_UserDiss, data)) return false;
                this.m_DissolveRes = null;
                g_TimerEngine.PauseGameTimer();

                this.ShowPrefabDLG('DissolveRoom', this.node, function (Js) {
                    this.m_DisCtrl = Js;
                    this.m_DisCtrl.SetDissolveInfo(this.m_UserDiss.dwDisUserID, this.m_UserDiss.byChoose, this.m_UserDiss.dwCountDown, this.m_LockArr,this.m_UserDiss.dwAllCountDown);
                    if (this.m_DissolveRes) this.m_DisCtrl.SetDisRes(this.m_DissolveRes.bDissolve);
                }.bind(this));

                return true;
            }
            case SUB_GF_ROOM_USERCHOOSE: {
                var pUserDiss = new CMD_GF_UserChooseRes();
                if (datasize != gCByte.Bytes2Str(pUserDiss, data)) return false;
                if (pUserDiss.byRes == 0) pUserDiss.byRes = 2;
                if (this.m_DisCtrl != null) {
                    this.m_DisCtrl.SetUserChoose(pUserDiss.wChairID, pUserDiss.byRes);
                } else if (this.m_UserDiss != null) {
                    this.m_UserDiss.byChoose[pUserDiss.wChairID] = pUserDiss.byRes;
                } else {
                    this.ShowTips("DissolveRoom creat err??")
                }

                return true;
            }
            case SUB_GF_ROOM_DISSOLVE_RES: {
                this.m_DissolveRes = new CMD_GF_DissolveRes();
                if (datasize != gCByte.Bytes2Str(this.m_DissolveRes, data)) return false;
                g_TimerEngine.UnPauseGameTimer();
                if (this.m_DisCtrl) this.m_DisCtrl.SetDisRes(this.m_DissolveRes.bDissolve)

                return true;
            }

        }
        return false;
    },

    //发送数据
    SendGameData: function (wSubCmdID, Obj) {
        var kernel = gClientKernel.get();
        if (kernel != null) this.sendClass(MDM_GF_GAME, wSubCmdID, Obj);
    },

    //发送数据
    SendFrameData: function (wSubCmdID, Obj) {
        this.sendClass(MDM_GF_FRAME, wSubCmdID, Obj);
        return true;
    },

    sendClass: function (wMainCmdID, wSubCmdID, Obj) {
        var kernel = gClientKernel.get();
        if (kernel != null) kernel.SendSocketClass(wMainCmdID, wSubCmdID, Obj);
    },
    OnClick_CheckOut: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_dwCreater != 0) {
            var kernel = gClientKernel.get();
            if (this.m_wGameProgress == 0 && this.m_dwCreater == kernel.mMeUserItem.GetUserID()) {
                this.ShowAlert("确认解散该房间？", Alert_All, function (Res) {
                    if (Res) this.sendClass(MDM_GF_CARDROOM, SUB_GF_CREATER_DISSOLVE);
                }.bind(this));
            }
            if (this.m_wGameProgress > 0) {
                this.ShowAlert("确认申请解散？", Alert_All, function (Res) {
                    if (Res) this.sendClass(MDM_GF_CARDROOM, SUB_GF_USER_DISSOLVE);
                }.bind(this));
            }
        }
    },
    OnBtReturn: function () {
        cc.gSoundRes.PlaySound('Button');

        if (this.m_RoomEnd != null) return this.m_pTableScene.ExitGame();
        this.ShowAlert("确定要退出游戏吗？", Alert_YesNo, function (Res) {
            if (Res) this.m_pTableScene.ExitGame();
        }.bind(this));
    },

    //////////////////////////////////////////////////////////////////////////
    //获取用户
    GetClientUserItem: function (wChairID) {
        var kernel = gClientKernel.get();
        if (kernel == null) return null;
        return kernel.GetTableUserItem(wChairID);
    },

    IsValidChairID: function (wChairID) {
        if (wChairID >= 0 && wChairID < GameDef.GAME_PLAYER) return true;

        return false;
    },

    // 获取座位
    GetUserChairID: function (dwUserID) {
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            var pIClientUserItem = this.GetClientUserItem(i);
            if (!pIClientUserItem) continue;

            if (pIClientUserItem.GetUserID() == dwUserID) return i;
        }
        return INVALID_CHAIR;
    },

    // 快捷短语
    OnSendPhrase: function (wItemID, TagUser) {
        var pExpression = new CMD_GF_C_UserExpression();
        pExpression.wItemIndex = wItemID;
        pExpression.dwTargetUserID = TagUser;
        this.SendFrameData(SUB_GF_USER_EXPRESSION, pExpression);
    },
    // 发送聊天
    OnSendChat: function (szText) {
        var pChithat = new CMD_GF_C_UserChat();
        pChithat.szChatString = szText + '\0';
        pChithat.wChatLength = pChithat.szChatString.length;
        pChithat.len_szChatString = pChithat.wChatLength * cc.TCHAR_SIZE;
        this.SendFrameData(SUB_GF_USER_CHAT, pChithat);
    },

    // 快捷短语
    OnSubUserPhrase: function (pData, wDataSize) {
        //效验
        var pShortcutPhrase = new CMD_GR_S_UserExpression();
        if (wDataSize != gCByte.Bytes2Str(pShortcutPhrase, pData)) return false;
        this.m_GameClientView.UserExpression(pShortcutPhrase.dwSendUserID, pShortcutPhrase.dwTargetUserID, pShortcutPhrase.wItemIndex)

        return true;
    },

    // 用户聊天
    OnSubUserChat: function (pData, wDataSize) {
        //效验
        var pChithat = new CMD_GF_S_UserChat();
        gCByte.Bytes2Str(pChithat, pData);
        this.m_GameClientView.UserChat(pChithat.dwSendUserID, pChithat.dwTargetUserID, pChithat.szChatString);

        return true;
    },

    ShowEndView: function () {
        if (this.m_ReplayMode) {
            this.RealShowEndView();
        } else {
            this.schedule(this.RealShowEndView, 3)
        }
    },
    RealShowEndView: function () {
        this.unschedule(this.RealShowEndView)
        this.ShowPrefabDLG("GameEndInfo", null, function (Js) {
            this.m_REndCtrl = Js;
        }.bind(this));
    },
    //分享信息
    GetShareInfo: function () {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var ShareInfo = new Object();
        ShareInfo.title = '房号【' + this.m_dwRoomID + '】 ' + g_GlobalUserInfo.m_UserInfoMap[pGlobalUserData.dwUserID].NickName + "邀请您来玩" + window.GameList[GameDef.KIND_ID];
        ShareInfo.desc = this.m_GameClientView.m_LbGameRules.string;
        ShareInfo.imgUrl = window.PHP_HOME + '/app01/App.jpg'
        ShareInfo.link = cc.share.MakeLink_InviteRoom(this.m_dwRoomID, this.m_dwClubID);
        return ShareInfo;
    },

    //点击设置
    OnBtClickedSet: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Setting');
    },

    OnClicked_GameSetting: function() {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('GameSetting', this.node, function(Js) {
            this.m_GameSetting = Js;
            this.m_GameSetting.SetGame(GameDef);
        }.bind(this));
    },

    //点击设置
    OnBtClick_BtMenu: function (Tag) {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('GameSetMenu', Tag.currentTarget.parent);
    },
    OnClick_BtLookOnList: function () {
        this.ShowPrefabDLG('GameLookOnList')
    },
    //+++++++录音和播放需要添加的内容    start++++++
    //发消息给其它玩家
    OnSendUserVoice: function (Platform, VoiceID) {
        var pVoice = new CMD_GF_C_UserVoice();
        pVoice.szVID = VoiceID;
        pVoice.byPlatform = Platform;
        this.SendFrameData(SUB_GF_USER_VOICE, pVoice);
    },

    OnSubUserVoice: function (pData, wDataSize) {
        if (window.LOG_NET_DATA) console.log('OnSubUserVoice');
        //效验
        var pVoice = new CMD_GF_S_UserVoice();
        if (gCByte.Bytes2Str(pVoice, pData) != wDataSize) {
            if (window.LOG_NET_DATA) console.log('语音包大小错误！', wDataSize);
            return false;
        }

        //显示播放
        var VoiceCtrl = this.GetVoiceCtrl();
        if (VoiceCtrl) VoiceCtrl.PlayVoice(pVoice);
        return true;
    },
    GetVoiceCtrl: function () {
        return this.m_GameClientView.m_VoiceCtrl;
    },
    //+++++++录音和播放需要添加的内容    end++++++
    GetSelfGPSInfo: function () {
        if (this.m_ReplayMode) return;
        if (this.IsLookonMode()) return;
        if(window.g_CntGameGPS >= 3) return;
        if(window.g_CntGameGPS > 0) g_CurScene.m_bTipGPS = false;
        window.g_CntGameGPS++;
        if (cc.sys.isNative) {
            ThirdPartyGetAddress();
        } else {
            var GPSInfo = new tagUserGps();
            var bShow = cc.sys.localStorage.getItem(window.Key_ShowGPS);
            if (bShow == null) bShow = 0;
            GPSInfo.byHide = parseInt(bShow);
            GPSInfo.dlatitude = 0;
            GPSInfo.dlongitude = 0;
            GPSInfo.szAddress = 'H5登录暂时无法获取信息！';
            this.SendFrameData(SUB_GF_GPS_INFO_SAVE, GPSInfo);
        }
    },
    UpdateGPS: function (Info) {
        if (Info == "") return
        var Obj = JSON.parse(Info);
        if (Obj.berror == true || Obj.code != 0) {
            this.unschedule(this.GetSelfGPSInfo);
            this.scheduleOnce(this.GetSelfGPSInfo, 3);
            return;
        }

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var GPSInfo = new tagUserGps();
        var bShow = cc.sys.localStorage.getItem(window.Key_ShowGPS);
        if (bShow == null) bShow = 0;
        GPSInfo.byHide = parseInt(bShow);
        GPSInfo.dlatitude = (Obj.latitude) * 1;
        GPSInfo.dlongitude = (Obj.longitude) * 1;
        GPSInfo.szAddress = Obj.address;
        if (GPSInfo.szAddress == '') GPSInfo.szAddress = '用户运行环境无法准确获取地理位置！';
        this.SendFrameData(SUB_GF_GPS_INFO_SAVE, GPSInfo);
    },
    IsLookonMode: function () {
        var kernel = gClientKernel.get();
        if (kernel && kernel.IsLookonMode()) return true;
        return false;
    },
    //设置状态
    SetGameStatus: function (cbGameStatus) {
        this.m_cbGameStatus = cbGameStatus;
    },
    GetGameStatus: function () {
        return this.m_cbGameStatus;
    },
    GetTableUserGPS: function () {
        this.SendFrameData(SUB_GF_GPS_INFO_GET);
    },
    OnGetTableGPSRes: function (GPSInfo) {
        if (this.m_GameClientView.OnGPSAddress) this.m_GameClientView.OnGPSAddress(GPSInfo);
    },


    ////////////////////////////////////////////////////////////////////////////////
    ShowLookOnView: function (bShow) {
        if(bShow) {
            this.ShowPrefabDLG('LookOn', this.m_GameClientView.node, function(Js) {
                this.m_LookCtrl = Js;
            }.bind(this));
        } else {
            if(this.m_LookCtrl) this.m_LookCtrl.node.active = false;
        }
        // this.UpdateLookSitView();
    },
    UpdateLookSitView: function () {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var ViewID = this.SwitchViewChairID(i);
            var UserItem = this.GetClientUserItem(i);
            var NdSit = this.$('LookOnNode/SitNode/BtSit' + i);
            if (NdSit) {
                NdSit.active = (UserItem == null || UserItem == 0);
                NdSit.setPosition(this.m_GameClientView.m_UserPosArr[ViewID]);
            }
        }
    },
    OnBtLookOnSit: function (Tag, Data) {
        //this.SendFrameData(SUB_GF_LOOKON_SIT);
        var LookOn = new CMD_GR_S_LookOnUser();
        LookOn.dwUserChairID = parseInt(Data);
        this.SendFrameData(SUB_GF_LOOKON_SIT, LookOn);
    },

    AniFinish:function() {

    },
    // 测试消息
    OnEventCardTestMessage: function (wSubCmdID, pData, wDataSize) {
        if (!GameDef.CARD_TEST) return false;

        if (!this.m_ReplayMode
            && this.m_GameClientView.m_TestCtrl
            && this.m_GameClientView.m_TestCtrl.OnEventTestMessage(wSubCmdID, pData, wDataSize)) {
            return true;
        }

        return false;
    },
});
cc.GameView = cc.Class({
    extends: cc.BaseClass,
    properties: {
        m_UserPrefab: cc.Prefab, //用户信息预制体
    },
    InitView: function () {
        this.m_GameClientEngine = this.node.parent.getComponent('GameClientEngine_' + GameDef.KIND_ID);
        this.TraverseNode(this.node.parent);

        if (this.m_BtStart) this.m_BtStart.active = false;
        if (this.m_BtFriend) this.m_BtFriend.active = false;
        if (this.m_BtChat) this.m_BtChat.active = false;
        if (this.m_BtGPS) this.m_BtGPS.active = false;
        if (this.m_BtMenu) this.m_BtMenu.active = false;
        if (this.m_LbGameRules) this.m_LbGameRules.string = '';
        if (this.m_LbGameProgress) this.m_LbGameProgress.string = '';
        if (this.m_LbTableID) {
            this.m_LbTableID.string = '';
            if (window.g_dwRoomID) this.m_LbTableID.string = window.g_dwRoomID;
        }
    },
    //添加相应节点变量
    CheckNode: function (TagNode) {
        //UI节点
        if (TagNode.name == 'JetNode') this.m_JetNode = TagNode;
        if (TagNode.name == 'CardNode') this.m_CardNode = TagNode; //左上节点
        if (TagNode.name == 'UserNode') this.m_UserNode = TagNode; //左上节点
        if (TagNode.name == 'AniNode') this.m_AniNode = TagNode; //左上节点
        //
        if (TagNode.name == 'PhoneInfo') this.m_NdPhoneNode = TagNode; //左上节点
        if (TagNode.name == 'BtStart') this.m_BtStart = TagNode; //开始按钮
        if (TagNode.name == 'BtFriend') this.m_BtFriend = TagNode; //分享按钮  m_BtFriend
        if (TagNode.name == 'BtChat') this.m_BtChat = TagNode; //聊天按钮
        if (TagNode.name == 'BtGPS') this.m_BtGPS = TagNode;   //GPS按钮
        if (TagNode.name == 'BtMenu') this.m_BtMenu = TagNode;  //菜单按钮
        if (TagNode.name == 'TableNumber') this.m_LbTableID = TagNode.getComponent(cc.Label); //房间ID
        if (TagNode.name == 'ClubNumber') this.m_LbClubID = TagNode.getComponent(cc.Label); //俱乐部ID
        if (TagNode.name == 'LabRules') this.m_LbGameRules = TagNode.getComponent(cc.Label); //游戏规则
        if (TagNode.name == 'LabProgress') this.m_LbGameProgress = TagNode.getComponent(cc.Label); //游戏进度
        if(this.CheckNode2) this.CheckNode2(TagNode);
    },
    UpdateClubID: function () {
        if (this.m_LbClubID) {
            if (this.m_GameClientEngine.m_dwClubID > 0)
                this.m_LbClubID.string = ''; //'联盟ID:'+this.m_GameClientEngine.m_dwClubID;
            else
                this.m_LbClubID.string = '';
        }
    },
    //递归遍历子节点
    TraverseNode: function (TagNode) {
        this.CheckNode(TagNode);
        for (var i = 0; i < TagNode.childrenCount; i++) {
            this.TraverseNode(TagNode.children[i]);
        }
        return false;
    },
    OnBnClickedStart: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnMessageStart();
    },
    OnBnClickedFriend: function () {
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientEngine.OnFriend();
    },

    UserExpression: function (SendUserID, TagUserID, wIndex) {
        var SendChair = INVALID_CHAIR,
            RecvChair = INVALID_CHAIR;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue
            if (this.m_pIClientUserItem[i].GetUserID() == SendUserID) SendChair = i;
            if (this.m_pIClientUserItem[i].GetUserID() == TagUserID) RecvChair = i;
        }
        if (wIndex < 2000 && this.m_ChatControl) this.m_ChatControl.ShowBubblePhrase(SendChair, wIndex, this.m_pIClientUserItem[SendChair].GetGender());
        else if (wIndex < 3000 && this.m_FaceExCtrl) this.m_FaceExCtrl.OnSendFaceEx(SendChair, RecvChair, wIndex);
    },
    UserChat: function (SendUserID, TagUserID, str) {
        if (this.m_ChatControl == null) return
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_pIClientUserItem[i] == null) continue
            if (this.m_pIClientUserItem[i].GetUserID() == SendUserID) {
                this.m_ChatControl.ShowBubbleChat(i, str);
                break;
            }
        }
    },

    //聊天按钮回调
    OnBnClickedChat: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_ChatControl == null) return;
        this.m_ChatControl.node.active = true;
        this.m_ChatControl.ShowSendChat(true);
    },
    //聊天按钮回调
    OnClick_ShowLookOn: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('GameLookOnList')
    },
    OnBtShowGPS: function () {
        console.log('OnBtShowGPS')
        if(!this.m_TableGPSCtrl){
            this.ShowPrefabDLG('TableUserGPS', this.node, function (Js) {
                this.m_TableGPSCtrl = Js;
                this.m_TableGPSCtrl.SetGPSUserPos(this.m_UserInfo);
                this.m_TableGPSCtrl.InitUser();
                this.m_GameClientEngine.GetTableUserGPS();
                this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem);
                this.m_TableGPSCtrl.node.zIndex = 1000;
            }.bind(this));
            return;
        }else{
            this.m_TableGPSCtrl.OnShowView();
            this.m_GameClientEngine.GetTableUserGPS();
            this.m_TableGPSCtrl.SetUserInfo(this.m_pIClientUserItem);
        }
    },
    OnGPSAddress: function (GPSInfo) {
        if (!this.m_TableGPSCtrl || !this.m_GameClientEngine) return;
        this.m_TableGPSCtrl.node.setPosition(0, 0);
        this.m_TableGPSCtrl.UpdateAddress(this, GPSInfo);
    },

    AniFinish:function() {

    },
    LoadCardTestNode: function () { // 'TestMJ'
        if (!USER_CARD_TEST || !GameDef.CARD_TEST) return;

        if (this.m_TestCtrl) {
            if (this.m_TestCtrl.HideView) this.m_TestCtrl.HideView();
            return ;
        }

        if (!this.m_CardTestName) return;

        // let pIClientUserItem = this.m_GameClientEngine.GetClientUserItem(this.m_GameClientEngine.GetMeChairID());
        // if (0 >= pIClientUserItem.m_UserInfo.cbMasterOrder) return ;
        //
        // this.ShowPrefabDLG(PreName, this.node, function (Js) {
        //     this.m_TestCtrl = Js;
        //     this.m_TestCtrl.node.active = false;
        // }.bind(this));

        let self = this;
        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        let webUrl = PHP_HOME + '/UserFunc.php?GetMark=99&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            if (!data) return;
            let UserInfo = JSON.parse(data);
            if (null == UserInfo.UR) return;
            if (0 == (UserInfo.UR & UR_GAME_TEST_USER)) return;
            self.ShowPrefabDLG(self.m_CardTestName, self.node, function (Js) {
                self.m_TestCtrl = Js;
                self.m_TestCtrl.SetGameEngine(this.m_GameClientEngine);
                self.m_TestCtrl.node.active = false;
            }.bind(self));
        }.bind(this));
    },

    OnGetCardTestInfo: function (tag) {
        if (!GameDef.CARD_TEST) return;

        if (!this.m_TestCtrl) return;

        if (this.m_TestCtrl.node.active) {
            this.m_TestCtrl.node.active = false;
            return;
        }

        this.m_TestCtrl.node.active = true;

        if (1 == tag) this.m_TestCtrl.ShowUserCheatCtrl();
        else if (2 == tag) this.m_TestCtrl.ShowCardCheatCtrl();
    },
    OnGetCardTestInfo2: function () {
        if (!this.m_TestCtrl) return;
        this.m_TestCtrl.node.active = true;
    },
});

cc.BaseControl = cc.Class({

    extends: cc.BaseClass,

    properties: {},

    ctor: function () {
        this.m_fScaleValue = 1;
        this.m_BenchmarkPos = cc.v2(0, 0);
        this.m_AnchorPoint = cc.v2(0.5, 0.5);
        this.m_CollocateMode = cc.v2(0, 0);
    },

    onLoad: function () {

    },

    start: function () {

    },

    SetAttribute: function (Attribute) {
        this.m_Attribute = Attribute;
        if (this.SetAttribute2) {
            this.SetAttribute2();
        }
    },

    //基准位置
    SetBenchmarkPos: function (nXPos, nYPos, ModeX, ModeY) {
        this.m_BenchmarkPos.x = nXPos;
        this.m_BenchmarkPos.y = nYPos;
        this.m_AnchorPoint.x = 0.5 * (ModeX - 1);
        this.m_AnchorPoint.y = 0.5 * (ModeY - 1);
        this.m_CollocateMode.x = ModeX;
        this.m_CollocateMode.y = ModeY;

        if (this.SetBenchmarkPos2) {
            this.SetBenchmarkPos2()
        }
    },

    //缩放
    SetScale: function (fScaleValue) {
        this.m_fScaleValue = fScaleValue;
        if (this.SetScale2) {
            this.SetScale2();
        }
    },

    SetTouchOn: function () {
        try {
            if (this.onTouchBegan) this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
            if (this.onTouchMove) this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            if (this.onTouchEnded) this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
            if (this.onTouchCancel) this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        } catch (error) {
            ASSERT(false, ' In BaseControl-SetTouchOn catch error is ' + error);
        }

    },

    NewNode: function (Parent, Component) {
        try {
            var TempNode = new cc.Node();
            if (!TempNode) return null;
            if (Parent instanceof cc.Node) {
                Parent.addChild(TempNode);
            } else if (Parent.node instanceof cc.Node) {
                Parent.node.addChild(TempNode);
            }
            if (Component) {
                if(Component instanceof cc.Node) return TempNode;
                TempNode.addComponent(Component);
                return TempNode;
            } else {
                ASSERT(false, ' In BaseControl-NewNode wrong Component is ' + Component);
                return TempNode;
            }
        } catch (error) {
            ASSERT(false, ' In BaseControl-NewNode catch error is ' + error);
        }
    },

    RemoveIntoPool: function (jsArr, Pool) {
        try {

            if (jsArr == null) jsArr = new Array();
            for (var i in jsArr) {

                if (jsArr[i] instanceof cc.Node) {
                    // jsArr[i].parent = null;
                    Pool.put(jsArr[i]);
                } else if (jsArr[i].node instanceof cc.Node) {
                    // jsArr[i].node.parent = null;
                    Pool.put(jsArr[i].node);
                }
            }
            jsArr.splice(0, jsArr.length);
        } catch (error) {
            ASSERT(false, ' In BaseControl-RemoveIntoPool catch error is ' + error);
        }

    },

    RemoveIntoPoolByID: function (jsArr, Pool, cbID) {
        try {

            if (jsArr == null) jsArr = new Array();
            if(!jsArr[cbID]) return;

            if (jsArr[cbID] instanceof cc.Node) {
                Pool.put(jsArr[cbID]);
            } else if (jsArr[cbID].node instanceof cc.Node) {
                Pool.put(jsArr[cbID].node);
            }
            jsArr.splice(cbID, 1);
        } catch (error) {
            ASSERT(false, ' In BaseControl-RemoveIntoPoolByID catch error is ' + error);
        }

    },

    GetPreFormPool: function (Pool, SouceNode, Parent, Com1, Com2) {
        try {
            var TempNode;
            if (Pool.size()) {
                TempNode = Pool.get();
                if (Parent instanceof cc.Node) Parent.addChild(TempNode);
                else if (Parent.node instanceof cc.Node) Parent.node.addChild(TempNode);
            } else {
                if(SouceNode) {
                    if(SouceNode instanceof cc.Node) {
                        TempNode = cc.instantiate(SouceNode);
                    } else if(SouceNode.node instanceof cc.Node) {
                        TempNode = SouceNode.node;
                    }
                    if (Parent instanceof cc.Node) Parent.addChild(TempNode);
                        else if (Parent.node instanceof cc.Node) Parent.node.addChild(TempNode);
                }
                else {
                    TempNode = this.NewNode(Parent, Com1);
                }
            }

            var js1 = TempNode;
            if (Com1 != cc.Node) js1 = TempNode.getComponent(Com1);
            if (js1) js1.m_Hook = this;

            var js2 = null;
            if (Com2) js2 = TempNode;
            if (Com2 && Com2 != cc.Node) js2 = TempNode.getComponent(Com2);
            if (js2) js2.m_Hook = this;

            ASSERT(js1, ' In BaseControl-GetPreFormPool js1 is ' + js1 + '; Com1=' + Com1 + '; Com2=' + Com2);
            return [js1, js2];
        } catch (error) {
            ASSERT(false, ' In BaseControl-GetPreFormPool catch error is ' + error);
        }

    },

    //递归遍历子节点查找目标节点
    // SearchInfo: ContentArray, SouceNode, SearchCom, HandlerComponet, HandlerFunc, CustomData
    TraverseNode: function (SearchInfo) {
        try {
            if (!SearchInfo.SouceNode) return false;

            var pCom = null;
            if (SearchInfo.SouceNode instanceof cc.Node) pCom = SearchInfo.SouceNode.getComponent(SearchInfo.SearchCom);
            else if (SearchInfo.SouceNode.node instanceof cc.Node) pCom = SearchInfo.SouceNode.node.getComponent(SearchInfo.SearchCom);
            if (pCom) {
                if (SearchInfo.HandlerComponet && SearchInfo.HandlerFunc) {
                    var pHandler = new cc.Component.EventHandler();
                    pHandler.target = this.node;
                    pHandler.component = SearchInfo.HandlerComponet;
                    pHandler.handler = SearchInfo.HandlerFunc;
                    if (SearchInfo.CustomData != null) pHandler.customEventData = SearchInfo.CustomData;
                    pCom.clickEvents.push(pHandler);
                }
                if (window.LOG_NET_DATA) console.log(" In BaseControl TraverseNode --------------- ");
                if (window.LOG_NET_DATA) console.log("TraverseNode index: " + SearchInfo.ContentArray.length + " => " + pCom.node.name + " -- ");
                if (window.LOG_NET_DATA) console.log(SearchInfo);
                if (window.LOG_NET_DATA) console.log(" --------------- ");
                if (SearchInfo.ContentArray) SearchInfo.ContentArray.push(pCom);
                return true;
            }
            for (var i = 0; i < SearchInfo.SouceNode.childrenCount; i++) {
                this.TraverseNode({
                    ContentArray: SearchInfo.ContentArray,
                    SouceNode: SearchInfo.SouceNode.children[i],
                    SearchCom: SearchInfo.SearchCom,
                    HandlerComponet: SearchInfo.HandlerComponet,
                    HandlerFunc: SearchInfo.HandlerFunc,
                    CustomData: i,
                });
            }
            return false;
        } catch (error) {
            ASSERT(false, ' In BaseControl-TraverseNode catch error is ' + error);
        }

    },

    AddClickHandler: function (souce, target, component, handler, CustomData) {
        try {
            for(var i in souce.clickEvents) {
                if(souce.clickEvents[i].target == target && souce.clickEvents[i].component == component && souce.clickEvents[i].handler) {
                    if (CustomData != null) souce.clickEvents[i].customEventData = CustomData;
                    return;
                }
            }
            var pHandler = new cc.Component.EventHandler();
            pHandler.target = target;
            pHandler.component = component;
            pHandler.handler = handler;
            if (CustomData != null) pHandler.customEventData = CustomData;
            souce.clickEvents.push(pHandler);
        } catch (error) {
            ASSERT(false, ' In BaseControl-AddClickHandler catch error is ' + error);
        }
    },


    //递归遍历子节点查找复选框
    TraverseToggle: function (TagNode, pArray) {
        if (!TagNode) return false;
        if (!pArray) return false;
        if (TagNode.name[0] != '$') {
            var js = TagNode.getComponent(cc.Toggle);
            if (js) {
                pArray.push(js);
                return true;
            }
        }
        for (var i = 0; i < TagNode.childrenCount; i++) {
            if (TagNode.children[i].name[0] == '$') continue;
            this.TraverseToggle(TagNode.children[i], pArray);
        }
        return false;
    },

    GetPair: function (pToggle) {
        if (!pToggle) return null;
        var cbIndex = pToggle.node.name.indexOf('_');
        if (cbIndex != -1) {
            return {
                key: pToggle.node.name.slice(0, cbIndex),
                value: pToggle.node.name.slice(cbIndex + 1)
            };
        }
        return null;
    },

});


// 分享
cc.share = {

    Type: cc.Enum({
        NULL: 0,
        Login: 1,
        Download: 2,
        InviteRoom: 3,
        InviteClub: 4,
        GameEnd: 5,
    }),

    Mode: cc.Enum({
        NULL: 0,
        Auto: 1,
        ToH5: 2,
        ToApp: 3,
    }),

    LoadConfig: function(callback) {
        window.GetConfig('ShareLinkH5', {
            error: function (e) {
                if(LOG_WEB_DATA) console.log('请配置分享链接！');
                if(callback) callback(null);
            },
            success: function (res) {
                if(!res) {
                    if(LOG_WEB_DATA) console.log('分享链接-配置数据异常！');
                    if(callback) callback(null);
                    return;
                }
                if (res.String && res.String.length > 1) {
                    // 回调数据处理
                    window.SHARE_URL_H5 = res.String;
                    if (LOG_WEB_DATA && res.State == 1) console.log(res.Tip + ' 获取成功!');
                    if(callback) callback(res.String);

                } else {

                    if (LOG_WEB_DATA && res.State == 1) console.log('请配置 ' + res.Tip);
                    if(callback) callback(res.String);
                }
            },
        });
        window.GetConfig('ShareLinkApp', {
            error: function (e) {
                if(LOG_WEB_DATA) console.log('请配置分享链接！');
                if(callback) callback(null);
            },
            success: function (res) {
                if(!res) {
                    if(LOG_WEB_DATA) console.log('分享链接-配置数据异常！');
                    if(callback) callback(null);
                    return;
                }
                if (res.String && res.String.length > 1) {
                    // 回调数据处理
                    window.SHARE_URL = res.String;
                    if (LOG_WEB_DATA && res.State == 1) console.log(res.Tip + ' 获取成功!');
                    if(callback) callback(res.String);

                } else {
                    if (LOG_WEB_DATA && res.State == 1) console.log('请配置 ' + res.Tip);
                    if(callback) callback(res.String);
                }
            },
        });
    },

    InitShareInfo_H5_WX: function(ShareFunc) {
        if(this.IsH5_WX() && ShareFunc){
            var ShareInfo = ShareFunc();
            if(ShareInfo) {
                ThirdPartyShareMessage(ShareInfo, 0);
                ThirdPartyShareMessage(ShareInfo, 1);
                return true;
            }
        }
        return false;
    },

    // 串接参数
    Stringify: function (param) {
        try {
            var str = '';
            if (typeof param == 'string') {
                str = param;
            } else if (typeof param == 'object') {
                str = JSON.stringify(param);
            } else {
                return '';
            }
            var res = encodeURIComponent(unescape(str));
            return res;
        } catch (e) {
            if (window.LOG_DEBUG) console.log(e);
            return '';
        }
    },

    // 解析参数
    Parse: function (param) {
        try {
            var str = decodeURIComponent(param);
            var obj = JSON.parse(str);
            return obj;
        } catch(e) {
            if (window.LOG_DEBUG) console.log(e);
            return null;
        }
    },

    IsH5_WX: function(mode) {
        if(mode == this.Mode.Auto || !!!mode) {
            return (cc.sys.isBrowser && (cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT || cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ || cc.sys.browserType == cc.sys.BROWSER_TYPE_QQ));
        } else if(mode == this.Mode.ToH5){
            return true;
        } else {
            return false;
        }
    },

    MakeLink_InviteRoom: function (roomID, clubID, mode) {
        if (this.IsH5_WX(mode)) {
            var obj = {};
            obj.type = this.Type.InviteRoom;
            obj.value = [roomID, clubID];
            var link = `${window.SHARE_URL_H5}${this.Stringify(obj)}`;
            return link;
        } else {
            return window.SHARE_URL;
        }
    },

    MakeLink_InviteClub: function (kind, allianceID, mode) {
        if (this.IsH5_WX(mode)) {
            var obj = {};
            obj.type = this.Type.InviteClub;
            obj.value = [kind, allianceID];
            var link = `${window.SHARE_URL_H5}${this.Stringify(obj)}`;
            return link;
        } else {
            return window.SHARE_URL;
        }
    },

    MakeLink_GameEnd: function (mode) {
        if (this.IsH5_WX(mode)) {
            return `${window.SHARE_URL_H5}0`;
        } else {
            return window.SHARE_URL;
        }
    },

    MakeLink_Lobby: function (mode) {
        if (this.IsH5_WX(mode)) {
            return `${window.SHARE_URL_H5}0`;
        } else {
            return window.SHARE_URL;
        }
    },

    MakeLink_Download: function (mode) {
        if (this.IsH5_WX(mode)) {
            return `${window.SHARE_URL_H5}0`;
        } else {
            return window.SHARE_URL;
        }
    },

    GetShareParam: function(type) {
        if(cc.sys.isNative) return null;
        var state = getQueryString("state");
        var param = null;
        if(state && state != '') {
            param = this.Parse(state);
        }
        var obj = {};
        switch(type) {
            case this.Type.InviteRoom: {
                if(param && param.type == type) {
                    obj.roomNum = param.value[0];
                    obj.clubID = param.value[1];
                } else {
                    obj.roomNum = 0;
                    obj.clubID = 0;
                }
                break;
            }
            case this.Type.InviteClub: {
                if(param && param.type == type) {
                    obj.kind = param.value[0];
                    obj.allianceID = param.value[1];
                } else {
                    obj.kind = 0;
                    obj.allianceID = 0;
                }
                break;
            }
        }
        return obj;
    },

}
