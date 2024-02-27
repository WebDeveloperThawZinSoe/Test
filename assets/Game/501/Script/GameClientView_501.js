// extends: cc.Component,
var GameLogic = require('GameLogic_501');
cc.Class({
    extends: cc.GameView,

    properties: {
        m_nodeUser: [cc.Node],
        m_HandCtrl: [cc.Component],
        m_AniCtrl: cc.Component,
        m_CutCard: cc.Component,
        m_SelectCtrl: cc.Component,
        m_ButtonCtrl: cc.Component,
        m_labTime: cc.Label,//这个是自动准备时间
        m_labHallTime: cc.Label,//这个是游戏桌面中央显示的理牌时间
        m_nodeTest: cc.Node,
        m_NdZLBP:cc.Node,
        m_BtTiQian:cc.Node,
    },

    ctor: function () {
        this.m_UserInfo = [];
        this.m_pIClientUserItem = [];
        this.m_pChairUserItem = [];
        this.m_UserFaceArr = [];
        this.m_bPlayStatus = [];
        this.m_UserChatArr = [];
        this.m_UserVoiceArr = [];
        this.m_CardTestName = 'UserCheatCtrl';
    },
    onLoad: function () {
        this.InitView();

        var pGlobal = g_GlobalUserInfo.m_GlobalUserData;
        var webUrl = PHP_HOME + '/UserFunc.php?GetMark=99&dwUserID=' + pGlobal.dwUserID;
        webUrl += '&LogonPass=' + pGlobal.szPassword;
        WebCenter.GetData(webUrl, null, function (data) {
            if (data === -1) {
                this.ShowTips('请检查网络！');
            } else {
                var res = JSON.parse(data);
                this.m_Master = parseInt(res.UR);
            	this.m_nodeTest.active = this.m_Master > 0;
            }
        }.bind(this));

        this.m_RulesText =this.m_LbGameRules.string;
        this.m_subsumlun = this.$('New Node/Frame/LabProgress@Label');
        this.m_TableNumber = this.$('New Node/Frame/TableNumber@Label');
        this.m_ClubNum = "";

        for (let i in this.m_nodeUser) {
            this.m_UserInfo[i] = this.m_nodeUser[i].getComponent('UserPrefab_' + GameDef.KIND_ID);
            this.m_UserInfo[i].Init(this, parseInt(i));
            this.m_UserInfo[i].OnBtKickShow(false);

            this.m_UserFaceArr[i] = this.m_UserInfo[i].node.getPosition();
            this.m_UserChatArr[i] = this.m_UserFaceArr[i];
            this.m_HandCtrl[i].m_Hook = this;
        }
        this.m_UserVoiceArr[0] =  cc.v2(this.m_UserFaceArr[0].x + 0, this.m_UserFaceArr[0].y - 120);
        this.m_UserVoiceArr[1] =  cc.v2(this.m_UserFaceArr[1].x + 0, this.m_UserFaceArr[1].y - 70);
        this.m_UserVoiceArr[2] =  cc.v2(this.m_UserFaceArr[2].x + 0, this.m_UserFaceArr[2].y - 120);
        this.m_UserVoiceArr[3] =  cc.v2(this.m_UserFaceArr[3].x + 0, this.m_UserFaceArr[3].y - 70);

        this.ShowGamePrefab("LittleResult", GameDef.KIND_ID, this.Node, function(Js){
            this.m_LittleResult = Js;
            this.m_LittleResult.HideView();
        }.bind(this));

        //this.m_BigResult.SetHook(this);
        this.m_SelectCtrl.SetHook(this);

        this.m_CutCard.HideView();

        //this.ShowPrefabDLG('MacInfo',this.$('PhoneInfo'));NZY
    },

    //用户信息更新
    OnUserEnter: function (pUserItem, wChairID) {

        this.m_pIClientUserItem[wChairID] = pUserItem;
        this.m_pChairUserItem[pUserItem.GetChairID()] = pUserItem;
        this.m_UserInfo[wChairID].SetUserItem(pUserItem);
        this.SetUserState(wChairID);

        if(pUserItem.GetChairID()==this.m_GameClientEngine.m_wKickPlayer)
            this.m_UserInfo[wChairID].OnBtKickShow(true);

        if( wChairID == GameDef.MYSELF_VIEW_ID){
            if(this.m_VoiceCtrl == null){
                this.ShowPrefabDLG('VoiceCtrl',this.node.getChildByName('VoiceNode'),function(Js){
                    this.m_VoiceCtrl = Js;
                    this.m_VoiceCtrl.InitVoice(this);
                }.bind(this));
            }

            if(this.m_ChatControl == null){
                this.ShowPrefabDLG('ChatPrefab',this.node,function(Js){
                    this.m_ChatControl = Js;
                    this.m_ChatControl.ShowSendChat(false);
                    this.m_ChatControl.InitHook(this);
                }.bind(this));
            }

            if(this.m_FaceExCtrl == null){
                this.ShowPrefabDLG('FaceExCtrl',this.$('AniNode'),function(Js){
                    this.m_FaceExCtrl = Js;
                }.bind(this));
            }
        }

    },
    OnUserLeave: function (pUserItem, wChairID) {
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].UserLeave(pUserItem);
        }
    },
    OnUserScore: function (pUserItem) {
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].UpdateScore(pUserItem);
        }
    },
    OnUserState: function (pUserItem, wView) {
        this.m_pIClientUserItem[wView] = pUserItem;
        this.SetUserState(wView);
    },

    OnClickZL: function (tag,data) {
        this.m_GameClientEngine.OnMessageCutCard(parseInt(data))
    },

    SetViewRoomInfo: function (dwServerRules, dwRulesArr) {
        this.m_LbTableID.string = this.m_GameClientEngine.m_dwRoomID;
        this.m_dwGameRule = dwRulesArr;
        this.m_LbGameRules.string = GameDef.GetRulesStr(dwServerRules, dwRulesArr);
        this.UpdateRoomProgress();
        this.m_SelectCtrl.m_btBestType.active = true;
        if(dwRulesArr[0] & GameDef.GAME_TYPE_GPS){
            this.$('New Node2/BtGps').active = true;
        }else{
            this.$('New Node2/BtGps').active = false;

        }
    },

    /**
     * @return {string}
     */
    GetCardSprite: function (cbCard) {
        return cbCard;
    },
    SetUserReady:function(View){
        
        this.m_UserInfo[View].OnUserOffLine(false);
        this.m_UserInfo[View].OnUserReady(true);
        if(View == GameDef.MYSELF_VIEW_ID)this.m_BtStart.active = false;

    },
    SetUserState: function (View) {
        var pUserItem = this.m_pIClientUserItem[View];
        this.m_UserInfo[View].OnUserOffLine(false);
        this.m_UserInfo[View].OnUserReady(false);
        switch (pUserItem.GetUserStatus()) {
            case US_READY:
                {
                    this.m_UserInfo[View].OnUserReady(true);
                    if(View == GameDef.MYSELF_VIEW_ID)this.m_BtStart.active = false;
                    break;
                }
            case US_SIT:
                {
                    break;
                }
            case US_PLAYING:
                {
                    break;
                }
            case US_OFFLINE:
                {
                    this.m_UserInfo[View].OnUserOffLine(true);
                    break;
                }
            default:
                {}
        }
    },
    

    //设置时间
    SetUserTimer: function (wChairID, wTimer) {

    },

    UpdateRoomProgress: function () {
        this.m_LbGameProgress.string = GameDef.GetProgress(this.m_GameClientEngine.m_wGameProgress,this.m_GameClientEngine.m_dwServerRules,this.m_GameClientEngine.m_dwRulesArr);
    },

    ////////////////////////////////////////////////////////////////
    //设置用户
    setBank: function (wViewID) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserInfo[i].setBank(wViewID == i);
        }
    },

    sendCard: function () {
        var delay = 0;
        for (var i in this.m_bPlayStatus) {
            if (!this.m_bPlayStatus[i]) continue;
            var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt(i));
            delay = this.m_HandCtrl[wView].sendCard();
        }
        return delay;
    },

    setRangView: function (wChairID) {
        var wView = this.m_GameClientEngine.SwitchViewChairID(wChairID);
        this.m_HandCtrl[wView].showRangeView();
    },

    setRobeTimesView: function (cbRobTimes) {
        for (var i in cbRobTimes) {
            if (!this.m_bPlayStatus[i]) continue;
            if (cbRobTimes[i] == GameDef.INVALID_TIMES) {
                if (i == this.m_GameClientEngine.GetMeChairID())
                    this.m_ButtonCtrl.showRobeUI();
            } else {
                var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt(i));
                this.m_UserInfo[wView].showTimes(cbRobTimes[i]);
            }
        }
    },

    setHandView: function (bFinishSegment) {
        for (var i in bFinishSegment) {
            if (!this.m_bPlayStatus[i]) continue;
            var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt(i));
            if (bFinishSegment[i]) {
                this.m_HandCtrl[wView].showRangeView();
            } else {
                this.m_HandCtrl[wView].sendCard();
            }
        }
    },

    compareCard: function (bSegmentCard, bSpecialType, lScoreTimes, lFinalScore, llXiScore,bIsBiPing,llBaseScore) {//1 手牌 2 特殊牌型 3 每道倍数 4 最终分数
        var delay = 0;

        this.m_labHallTime.node.parent.active = false;//这里给中央显示的时间去掉
        //每人每道顺序开
        // for (var j = 0; j < 3; j++) {
        //     var sort = this._sortOpen(j, bSegmentCard);//先开最小牌
        //     for (var idx in bSegmentCard) {
        //         var i = sort[idx];//玩家顺序
        //         if (!this.m_bPlayStatus[i]) continue;
        //         var wView = this.m_GameClientEngine.SwitchViewChairID(i);
        //         this.m_HandCtrl[wView].m_nodeSpecial.active = bSpecialType[i];//显示特殊牌动画
        //         if (bSpecialType[i]) continue;
        //         var cbCard = this._getSegmentCard(bSegmentCard[i], j);
        //         this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function (tag, data) {
        //             this.m_HandCtrl[data[1]].showCompare(data[2], data[0], data[3], data[4]);
        //         }, this, [j, wView, cbCard, lScoreTimes[i][j], lFinalScore[i]])));

        //         if (cc.sys.os == cc.sys.OS_WINDOWS)
        //             delay += 0.2;//测试专用快速比牌
        //         else
        //             delay += 0.6;
        //     }
        // }
        //每道顺序开
        for (var j = 0; j < 3; j++) {
            var sort = this._sortOpen(j, bSegmentCard);//先开最小牌
            for (var idx in bSegmentCard) {
                var i = sort[idx];//玩家顺序
                if (!this.m_bPlayStatus[i]) continue;
                var wView = this.m_GameClientEngine.SwitchViewChairID(i);
                var cbCard = this._getSegmentCard(bSegmentCard[i], j);
                
                this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function (tag, data) {
                    this.m_HandCtrl[data[1]].showCompare(data[2], data[0], data[3], data[4],data[5],data[6]);
                }, this, [j, wView, cbCard, lScoreTimes[i][j], lFinalScore[i],bIsBiPing,llBaseScore[i]])));
            }
            if (cc.sys.os == cc.sys.OS_WINDOWS)
                delay += 0.2;//测试专用快速比牌
            else
                delay += 0.6;
        }

        delay = 1;

        // //打枪之后再显示总分
        for (var i in bSegmentCard) {
            if (!this.m_bPlayStatus[i]) continue;
            var wView = this.m_GameClientEngine.SwitchViewChairID(parseInt(i));
            var cbCard = this._getSegmentCard(bSegmentCard[i], j);
            this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function (tag, data) {
                this.m_HandCtrl[data[0]].showTotalScore(data[1],data[2]);
            }, this, [wView, lFinalScore[i],llXiScore[i]])));
        }

        return delay;
    },

    _sortOpen: function (index, bSegmentCard) {
        var sort = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            sort[i] = new Array();
            sort[i][0] = i;
            sort[i][1] =(this._getSegmentCard(bSegmentCard[i], index));
        }
        sort.sort(function (fn, m, n) {
            var res = fn.CompareCard(m[1], n[1]);
            if (res > 0) return 1;
            else if (res < 0) return -1;
            else return 0;
        }.bind(this, GameLogic.getInstance()));
        var res = new Array();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            res[i] = sort[i][0];
        }
        return res;
    },

    playRandBank: function (wRobeChair, cbRobeCnt, cbIndex, wBanker) {
        var delay = 0;
        for (var cnt = 0; cnt < 5; cnt++) {
            for (var i = 0; i < cbRobeCnt; i++) {
                if (cnt == 4 && i > cbIndex) continue;
                this.scheduleOnce(function () {
                    var wView = this.m_GameClientEngine.SwitchViewChairID(wRobeChair[arguments[0]]);
                    this.setLight(wView);
                }.bind(this, i), delay);
                delay += 0.2;
            }
        }
        var wViewBank = this.m_GameClientEngine.SwitchViewChairID(wBanker);
        this.schedule(function () {
            this.node.runAction(cc.sequence(cc.callFunc(function () {
                this.setLight(wViewBank);
            }, this), cc.delayTime(0.2), cc.callFunc(function () {
                this.setLight(INVALID_CHAIR);
            }, this), cc.delayTime(0.2)));
        }.bind(this), 0.2, 3, delay);
        delay += 1.2;
        this.scheduleOnce(function () {
            this.setBank(wViewBank);
            this.hideTimes();
        }.bind(this), delay);
        return delay;
    },

    hideTimes: function () {
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].showTimes(GameDef.INVALID_TIMES);
        }
    },

    setLight: function (wView) {
        for (var i in this.m_UserInfo) {
            this.m_UserInfo[i].setLight(i == wView);
        }
    },

    playGun: function (bGun, delay) {
        var playCnt = this._getUserCnt();
        var bPlayHomeRun = false;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var cbGunCount = 0;
            for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                if (bGun[i][j]) {
                    //cc.log('打枪' + i + '>>>' + j);

                    this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function (tag, data) {
                        let wViewJ = this.m_GameClientEngine.SwitchViewChairID(data[1]);
                        let wViewI = this.m_GameClientEngine.SwitchViewChairID(data[0]);
                        // this.ShowPrefabDLG('AniCtrl_500', this.node, function (wi, wj, Js) {
                        //     Js.playGun(wi, wj);
                        // }.bind(this, wViewI, wViewJ));
                        this.m_AniCtrl.playGun(wViewI, wViewJ);
                    }, this, [i, j])));

                    cbGunCount++;
                    delay += 1.2;
                }
            }

            if (playCnt >= 3 && cbGunCount + 1 == playCnt) {
                bPlayHomeRun = true;
            }
        }
        if (bPlayHomeRun) {
            this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
                // this.ShowPrefabDLG('AniCtrl_500', this.node, function (Js) {
                //     Js.playQuanleDa();
                //     cc.gSoundRes.PlayGameSound('HomeRun');
                // }.bind(this));
                this.m_AniCtrl.playQuanleDa();
                cc.gSoundRes.PlayGameSound('HomeRun');
            }, this)));
            delay += 3;
        }
        return delay;
    },

    _getUserCnt: function () {
        var cbCnt = 0;
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (this.m_GameClientEngine.GetClientUserItem(i)) {
                cbCnt++;
            }
        }
        return cbCnt;
    },

    _getSegmentCard: function (cbCardData, index) {
        console.assert(cbCardData.length == GameDef.MAX_COUNT);
        if (index == 0) return cbCardData.slice(0, 3);
        else if (index == 1) return cbCardData.slice(3, 6);
        else return cbCardData.slice(6);
    },

    OnBtRule: function () {
        this.ShowPrefabDLG('CreateRoomPre', this.node, function (Js) {
            Js.OnShowRule(this.m_dwRules);
        }.bind(this.m_GameClientEngine));
    },

    UpdateSet:function(Value){


    },


    resetView: function () {
        for (var i in this.m_HandCtrl) {
            this.m_HandCtrl[i].resetView();
        }
        this.m_SelectCtrl.resetView();
        this.ShowLittleResult();
        this.hideTimes();
    },

    setEndTimer: function (cbWaitTime) {
        this.m_labTime.string = cbWaitTime ?  cbWaitTime: 30;
        this.schedule(this._TimeCallBack, 1);
        this.m_labTime.node.parent.active = true;
        //this.m_labTime.node.parent.active = false;
    },
    ShowLittleResult: function (EndInfo) {
        if(this.m_LittleResult == null) return
        if(EndInfo == null){
            this.m_LittleResult.HideView();
        }else{
            this.ShowGamePrefab("LittleResult", GameDef.KIND_ID, this.Node, function(Js){
                this.m_LittleResult = Js;
                this.m_LittleResult.m_nodeStart.active = false;//方便后面置true
                if (EndInfo.cbEndType == 0) {
                    this.m_LittleResult.ShowInfo(EndInfo);
                    this.m_LittleResult.m_nodeStart.active = true;
                }
            }.bind(this));
        }
    },
    killEndTimer: function () {
        this.unschedule(this._TimeCallBack);
        this.m_labHallTime.node.parent.active = false;
        this.m_labTime.node.parent.active = false;
    },

    _TimeCallBack: function () {
        var cnt = parseInt(this.m_labTime.string);
        this.m_labTime.string = --cnt;
        if (cnt < 0) {
            this.killEndTimer();
        }
    },

    update (dt) {
       this.m_nodeTest.active = this.m_Master > 0;
    },

    AniFinish:function(){

    },
});