cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_Atlas: cc.SpriteAtlas,
        m_CardCtrlPrefab: cc.Prefab,
        m_DiscardCardPrefab:cc.Prefab,
    },

    ctor: function () {

    },

    onLoad: function () {

    },

    start: function () {

    },

    Init: function () {
        // try {
            this.m_UserNode = this.m_ScoreViewNode.getChildByName('UserNode');
            if (!this.m_UserNode) return false;
            this.m_UserInfo = new Array();
            for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                var pUser = this.m_UserNode.getChildByName('' + i);
                if (pUser) {
                    this.m_UserInfo[i] = pUser.getComponent('UserCtrl');
                } else {
                    this.m_UserInfo[i] = null;
                }
            }
            if(!this.m_WinUserCtrl) {
                this.m_WinUserCtrl = this.$('WinUser@UserCtrl', this.m_ScoreViewNode);
            }

            // 自摸图片
            this.m_FlagZimo = this.NewNode(this.node, cc.Sprite).getComponent(cc.Sprite);
            this.m_FlagZimo.spriteFrame = this.m_Atlas.getSpriteFrame('imgEndZimo');
            this.m_FlagZimo.node.setScale(0.6);
            // 胡图片
            this.m_FlagHu = this.NewNode(this.node, cc.Sprite).getComponent(cc.Sprite);
            this.m_FlagHu.spriteFrame = this.m_Atlas.getSpriteFrame('imgEndHu');
            this.m_FlagHu.node.setScale(0.6);
            // 炮图片
            this.m_FlagPao = this.NewNode(this.node, cc.Sprite).getComponent(cc.Sprite);
            this.m_FlagPao.spriteFrame = this.m_Atlas.getSpriteFrame('imgEndDP');
            this.m_FlagPao.node.setScale(0.6);
            // 胜利图片
            this.m_FlagWin = this.NewNode(this.m_ScoreViewNode, cc.Sprite).getComponent(cc.Sprite);
            this.m_FlagWin.spriteFrame = this.m_Atlas.getSpriteFrame('imgEndWin');
            this.m_FlagWin.node.setPosition(-470, 70);
            // 失败图片
            this.m_FlagLose = this.NewNode(this.m_ScoreViewNode, cc.Sprite).getComponent(cc.Sprite);
            this.m_FlagLose.spriteFrame = this.m_Atlas.getSpriteFrame('imgEndLost');
            this.m_FlagLose.node.setPosition(-490, 70);

            // 胡牌扑克
            this.m_ProvideNode = this.$("ProvideNode", this.m_ScoreViewNode);
            if(!this.m_ProvideNode) return;
            // this.m_ProvideCard = (this.GetGamePrefab('CardCtrlPrefab'));
            this.m_ProvideCard = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'),
            this.m_ProvideNode.addChild(this.m_ProvideCard.node);
            this.m_ProvideCard.SetAttribute({
                _ClientEngine: this.m_Hook,
                _ClientView: this.m_Hook.m_GameClientView,
                bBig: true
            });
            this.m_ProvideCard.SetShowFrame(true);
            // this.m_ProvideCard.SetBenchmarkPos(-355, 0, GameDef.enXCenter, GameDef.enYBottom);
            this.m_ProvideCard.node.setContentSize(cc.size(GameDef.CARD_WIGTH, GameDef.CARD_HEIGHT));
            this.m_ProvideCard.SetScale(0.7);
            // 醒牌扑克
            // this.m_XingCard = (this.GetGamePrefab('CardCtrlPrefab'));
            this.m_XingCard = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'),
            this.m_ProvideNode.addChild(this.m_XingCard.node);
            this.m_XingCard.SetAttribute({
                _ClientEngine: this.m_Hook,
                _ClientView: this.m_Hook.m_GameClientView,
                bBig: true
            });
            this.m_XingCard.SetShowFrame(true);
            // this.m_XingCard.SetBenchmarkPos(-280, 0, GameDef.enXCenter, GameDef.enYBottom);
            this.m_XingCard.node.setContentSize(cc.size(GameDef.CARD_WIGTH, GameDef.CARD_HEIGHT));
            this.m_XingCard.SetScale(0.7);

            // 手牌控件
            // this.m_HandCardControl = (this.GetGamePrefab('CardCtrlPrefab'));
            this.m_HandCardControl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'),
            this.m_ScoreViewNode.addChild(this.m_HandCardControl.node);
            this.m_HandCardControl.SetAttribute({
                _ClientEngine: this.m_Hook,
                _ClientView: this.m_Hook.m_GameClientView,
                bBig: false,
            });
            //手牌大小位置
            this.m_HandCardControl.SetBenchmarkPos(0, -100, GameDef.enXCenter, GameDef.enYBottom);
            // this.m_HandCardControl.SetCardDistance();
            this.m_HandCardControl.SetScale(0.85);

            return true;
        // } catch (error) {
        //     ASSERT(false, ' In GameEndView-Init catch error is ' + error);
        //     return false;
        // }
    },

    onClickContinue: function () {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.HideView();
    },

    OnHideView: function() {
        this.m_Hook.checkTotalEnd(true);
        HideI2O(this.node);
    },

    OnShowView: function () {
        // try {
            ShowO2I(this.node);
            if (!this.m_ScoreViewNode) this.m_ScoreViewNode = this.node.getChildByName('ScoreView');

            if (!this.m_LiuJuNode) {
                this.m_LiuJuNode = this.node.getChildByName('LJ');
                if (!this.m_LJAniCtrl) {
                    this.m_LJAniCtrl = this.m_LiuJuNode.getComponent('CustomAction_PHZ');
                }
                if (!this.m_LJPageCtrl) {
                    this.m_LJPageCtrl = this.m_LiuJuNode.getComponent('CustomPage');
                    this.m_LJPageCtrl.SetAttribute({
                        _ClientEngine: this.m_Hook,
                        SetClose: null,
                        SetNO: null,
                        SetOK: null,
                        SetBGClose: {
                            _active: false,
                            _enable: true,
                            _valid: true,
                        },
                    });
                }
            }

            var pPage = this.node.getComponent('CustomPage');
            pPage.SetAttribute({
                _ClientEngine: this.m_Hook,
                SetClose: {
                    _active: true,
                    _enable: true,
                    _valid: true,
                },
                SetNO: null,
                SetOK: null,
                SetBGClose: null,
            });

            if (this.m_Hook.m_GameEnd.wWinUser == INVALID_CHAIR) {
                this.m_ScoreViewNode.active = false;
                this.m_LiuJuNode.active = true;
                this.m_LJAniCtrl.DelayShowNode(3, 0.5, 0.5, true);
                return;
            }
            this.m_LiuJuNode.active = false;
            this.m_ScoreViewNode.active = true;

            this.SetUserInfo(this.m_Hook.m_GameEnd);
            this.SetHandCardData(this.m_Hook.m_GameEnd);
            this.SetWeaveInfo(this.m_Hook.m_GameEnd);
            this.SetHuInfo(this.m_Hook.m_GameEnd);
            this.SetLoseUserCardInfo(this.m_Hook.m_GameEnd, this.m_Hook.m_WeaveItemArray, this.m_Hook.m_cbWeaveItemCount);

        // } catch (error) {
        //     ASSERT(false, ' In GameEndView-OnShowView catch error is ' + error);
        // }
    },
    SetUserInfo: function (EndInfo) {
        // try {
            if (!this.m_UserInfo) {
                if (!this.Init()) return;
            }
            if (EndInfo.wProvideUser != EndInfo.wWinUser && EndInfo.wProvideUser < GameDef.GAME_PLAYER) {
                // 隐藏自摸
                if(this.m_FlagZimo) this.m_FlagZimo.node.active = false;
                // 炮
                if(this.m_FlagPao) {
                    this.m_FlagPao.node.parent = this.m_UserInfo[EndInfo.wProvideUser].node;
                    this.m_FlagPao.node.active = true;
                    this.m_FlagPao.node.setPosition(0, 30);
                    this.m_FlagPao.node.active = (!EndInfo.bDispatch);
                }
                // 胡
                if (this.m_FlagHu) {
                    this.m_FlagHu.node.parent = this.m_UserInfo[EndInfo.wWinUser].node;
                    this.m_FlagHu.node.active = true;
                    this.m_FlagHu.node.setPosition(0, 30);
                }
            } else {
                // 隐藏点炮
                if(this.m_FlagPao) this.m_FlagPao.node.active = false;
                // 隐藏胡
                if(this.m_FlagHu) this.m_FlagHu.node.active = false;
                // 自摸
                if (this.m_FlagZimo) {
                    this.m_FlagZimo.node.parent = this.m_UserInfo[EndInfo.wWinUser].node;
                    this.m_FlagZimo.node.active = true;
                    this.m_FlagZimo.node.setPosition(0, 30);
                }
            }
            // // 胡
            // if (this.m_FlagHu) {
            //     this.m_FlagHu.node.parent = this.m_UserInfo[EndInfo.wWinUser].node;
            //     this.m_FlagHu.node.active = true;
            //     this.m_FlagHu.node.setPosition(0, 30);
            // }

            // 胜利
            this.m_FlagWin.node.active = false;
            this.m_FlagLose.node.active = false;
            // if (EndInfo.wWinUser == EndInfo.wMeChairID) this.m_FlagWin.node.active = true;
            // else this.m_FlagLose.node.active = true;

            // 胡牌扑克
            this.m_ProvideCard.SetCardData([EndInfo.cbHuCard], 1, 1, true);
            this.m_ProvideCard.SetCardFlag(EndInfo.bDispatch ? 'Send' :'Out');

            // 醒牌扑克
            this.m_XingCard.SetCardData([EndInfo.cbFirstFX], EndInfo.cbFirstFX > 0 ? 1 : 0, 1, true);
            this.m_XingCard.SetCardFlag('Xing');
            this.m_XingCard.node.active = EndInfo.cbFirstFX > 0;

            for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
                if (!this.m_UserInfo[i]) continue;
                if (this.m_Hook) {
                    var dwUserID = EndInfo.dwUserID[i];
                    if (dwUserID > 0 && i != EndInfo.wWinUser) {
                        this.m_UserInfo[i].node.active = true;
                        this.m_UserInfo[i].SetUserByID(dwUserID);
                    } else {
                        this.m_UserInfo[i].node.active = false;
                        continue;
                    }
                } else {
                    return;
                }
                var pCtrl = this.m_UserInfo[i].node.getComponent('CustomPage');
                if (pCtrl) {
                    pCtrl.SetCustomText([
                        EndInfo.lGameScore[i] > 0 ? '+' + Score2Str(EndInfo.lGameScore[i]) : Score2Str(EndInfo.lGameScore[i])
                    ], [
                        // EndInfo.lGameScore[i] > 0 ? cc.color(137, 90, 44) : cc.color(137, 90, 44)
                        EndInfo.lGameScore[i] > 0 ? cc.color(255, 255, 255) : cc.color(255, 255, 255)
                    ]);
                }
            }

            // 赢家信息
            if(this.m_WinUserCtrl) {
                this.m_WinUserCtrl.SetUserByID(EndInfo.dwUserID[EndInfo.wWinUser]);
                var pCtrl = this.m_WinUserCtrl.node.getComponent('CustomPage');
                if (pCtrl) {
                    pCtrl.SetCustomText([
                        EndInfo.lGameScore[EndInfo.wWinUser] > 0 ? '+' + Score2Str(EndInfo.lGameScore[EndInfo.wWinUser]) : Score2Str(EndInfo.lGameScore[EndInfo.wWinUser])
                    ], [
                        // EndInfo.lGameScore[EndInfo.wWinUser] > 0 ? cc.color(137, 90, 44) : cc.color(137, 90, 44)
                        EndInfo.lGameScore[i] > 0 ? cc.color(255, 255, 255) : cc.color(255, 255, 255)
                    ]);
                }
            }

            // 剩余扑克
            if(!this.m_LeftCardCtrl) {
                // this.m_LeftCardCtrl = (this.GetGamePrefab('DiscardCardPrefab'));
                this.m_LeftCardCtrl = cc.instantiate(this.m_DiscardCardPrefab).getComponent('DiscardCard_PHZ');
                this.m_ScoreViewNode.addChild(this.m_LeftCardCtrl.node);
                this.m_LeftCardCtrl.SetAttribute({
                    _ClientEngine: this.m_GameClientEngine,
                    _ClientView: this,
                    bBig: false,
                    wViewID: 4
                });
                this.m_LeftCardCtrl.node.setPosition(cc.v2(-555, -30));
                this.m_LeftCardCtrl.SetScale(0.4);
            }
            this.m_LeftCardCtrl.SetCardData(EndInfo.cbLeftCard, EndInfo.cbLeftCount);
        // } catch (error) {
        //     ASSERT(false, ' In GameEndView-SetUserInfo catch error is ' + error);
        // }
    },

    SetHandCardData: function (EndInfo) {
        if (EndInfo.HuCardInfo.dwCHR & (GameDef.CHR_TIAN_3_LONG | GameDef.CHR_TIAN_5_KAN) ) {
            this.m_HandCardControl.SetBenchmarkPos(-100, 0, GameDef.enXCenter, GameDef.enYBottom);

            var WeaveItem = clone(this.m_Hook.m_WeaveItemArray[EndInfo.wWinUser]);
            var cbWeaveCount = this.m_Hook.m_cbWeaveItemCount[EndInfo.wWinUser];
            var cbCardIndex = new Array(GameDef.MAX_INDEX);
            cbCardIndex.fill(0);
            var cbTempCardIndex = new Array(GameDef.MAX_INDEX);
            cbTempCardIndex.fill(0);
            GameLogic.SwitchToCardIndex1(EndInfo.cbCardData[EndInfo.wWinUser], EndInfo.cbCardCount[EndInfo.wWinUser], cbTempCardIndex);
            GameLogic.AddIndex(cbCardIndex, cbTempCardIndex);
            for(var i = 0; i < cbWeaveCount; i ++) {
                var cbTempCardIndex = new Array();
                GameLogic.SwitchToCardIndex1(WeaveItem[i].cbCardList, WeaveItem[i].cbCardCount, cbTempCardIndex);
                GameLogic.AddIndex(cbCardIndex, cbTempCardIndex);
            }

            var cbCardData = new Array();
            var cbCardCount = GameLogic.SwitchToCardData1(cbCardIndex, cbCardData, GameDef.MAX_CARD_COUNT);
            this.m_HandCardControl.SetXing(EndInfo.cbFXCard, EndInfo.cbFXCount);
            this.m_HandCardControl.SetCardData(cbCardData, cbCardCount, 1, true);

        } else {
            this.m_HandCardControl.SetCardData(null, 0);
        }
    },

    SetWeaveInfo: function (EndInfo) {
        // try {

            if (!this.m_AreaJP) {
                // this.m_AreaJP = this.m_ScoreViewNode.getChildByName('AreaJP').getComponent('AreaJP_' + GameDef.KIND_ID);
                // this.m_AreaJP = this.$('AreaJP@' + this.GPComponentName('AreaJPPrefab', GameDef.KIND_ID), this.m_ScoreViewNode);
                this.m_AreaJP = this.$('AreaJP@' + 'AreaJP_PHZ', this.m_ScoreViewNode);
                this.m_AreaJP.SetBenchmarkPos(-303, 100, GameDef.enXLeft, GameDef.enYCenter);
            }
            if (!this.m_AreaJP) return;


            if (!this.m_WeaveCard) {
                this.m_WeaveCard = new Array();
                // this.m_FlagZimo = this.m_AreaJP.node.getChildByName('zimo');
                for (var i = 0; i < GameDef.MAX_WEAVE; ++i) {
                    // this.m_WeaveCard[i] = this.m_AreaJP.node.getChildByName('' + i).getComponent('WeaveCtrl_' + GameDef.KIND_ID);
                    // this.m_WeaveCard[i] = this.$('' + i + '@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_AreaJP.node);
                    this.m_WeaveCard[i] = this.$('' + i + '@' + 'WeaveCtrl_PHZ', this.m_AreaJP.node);
                    this.m_WeaveCard[i].SetCardScale(0.8)
                }
            }
            // if (EndInfo.wProvideUser == EndInfo.wWinUser || (EndInfo.wProvideUser >= GameDef.GAME_PLAYER && EndInfo.wProvideUser != EndInfo.wMeChairID)) {
            //     this.m_FlagZimo.active = true;
            // } else {
            //     this.m_FlagZimo.active = false;
            // }

            for (var i = 0; i < GameDef.MAX_WEAVE; ++i) {
                if (!this.m_WeaveCard[i]) continue;
                this.m_WeaveCard[i].Reset();
                this.m_WeaveCard[i].SetDisplayItem(true);
            }

            if (EndInfo.HuCardInfo.dwCHR & (GameDef.CHR_TIAN_3_LONG | GameDef.CHR_TIAN_5_KAN) ) return;

            var bShowHuCard = false;
            for (var i = 0; i < GameDef.MAX_WEAVE; ++i) {
                if (!this.m_WeaveCard[i]) continue;
                if (i < this.m_Hook.m_cbWeaveItemCount[EndInfo.wWinUser]) {
                    this.m_WeaveCard[i].SetCardData(this.m_Hook.m_WeaveItemArray[EndInfo.wWinUser][i]);
                    this.m_WeaveCard[i].ShowType(this.m_Hook.m_WeaveItemArray[EndInfo.wWinUser][i], true);
                    if(EndInfo.dwChiHuRight & ( GameDef.CHR_TI | GameDef.CHR_WEI_TO_TI | GameDef.CHR_WEI |
                        GameDef.CHR_PAO | GameDef.CHR_WEI_TO_PAO | GameDef.CHR_PENG_TO_PAO)) {
                        this.m_WeaveCard[i].ShowHu(this.m_Hook.m_WeaveItemArray[EndInfo.wWinUser][i], true, EndInfo.cbHuCard, EndInfo.dwChiHuRight);
                        bShowHuCard = true;
                    }
                    this.m_WeaveCard[i].ShowXing(EndInfo.cbFXCard, EndInfo.cbFXCount);
                } else break;
            }
            for (; i < GameDef.MAX_WEAVE; ++i) {
                if (!this.m_WeaveCard[i]) continue;
                if (i < this.m_Hook.m_cbWeaveItemCount[EndInfo.wWinUser] + EndInfo.HuCardInfo.cbWeaveCount) {
                    var cbID = i - this.m_Hook.m_cbWeaveItemCount[EndInfo.wWinUser];
                    if (cbID < EndInfo.HuCardInfo.cbWeaveCount) {
                        this.m_WeaveCard[i].SetCardData(EndInfo.HuCardInfo.WeaveItemArray[cbID], EndInfo.HuCardInfo.cbKingReplace);
                        var bKingStateArray = this.m_WeaveCard[i].GetKingState();
                        if (bKingStateArray) {
                            for (var j = 0; j < 4; ++j) {
                                if (bKingStateArray[j] == true) {
                                    EndInfo.HuCardInfo.cbKingReplace[j] = GameDef.MAX_INDEX;
                                }
                            }
                        }
                        this.m_WeaveCard[i].ShowType(EndInfo.HuCardInfo.WeaveItemArray[cbID], true);
                        if(!bShowHuCard) {
                            this.m_WeaveCard[i].ShowHu(EndInfo.HuCardInfo.WeaveItemArray[cbID], true, EndInfo.cbHuCard, EndInfo.dwChiHuRight);
                        }
                        this.m_WeaveCard[i].ShowXing(EndInfo.cbFXCard, EndInfo.cbFXCount);
                    } else break;
                } else break;
            }

            if (EndInfo.HuCardInfo.cbCardEye > 0) {
                var Weave = GameDef.tagWeaveItem();
                Weave.wWeaveKind = GameDef.ACK_ZHANG;
                Weave.cbCardList[0] = EndInfo.HuCardInfo.cbCardEye;
                Weave.cbCardList[1] = EndInfo.HuCardInfo.cbCardEye;
                this.m_WeaveCard[i].SetCardData(Weave, EndInfo.HuCardInfo.cbKingReplace);
                this.m_WeaveCard[i].ShowType(Weave, true);
                if(!bShowHuCard) {
                    this.m_WeaveCard[i].ShowHu(Weave, true, EndInfo.cbHuCard, EndInfo.dwChiHuRight);
                }
                this.m_WeaveCard[i].ShowXing(EndInfo.cbFXCard, EndInfo.cbFXCount);
            }
        // } catch (error) {
        //     ASSERT(false, ' In GameEndView-SetWeaveInfo catch error is ' + error);
        // }
    },

    SetHuInfo: function (EndInfo) {
        // try {

            // if(!this.m_LeftCardCtrl) {
            //     this.m_LeftCardCtrl =(this.GetGamePrefab('CardCtrlPrefab'));
            //     this.node.node.addChild(this.m_LeftCardCtrl.node);
            //     this.m_LeftCardCtrl.SetAttribute({
            //         _ClientEngine: this.m_Hook,
            //         _ClientView: this.m_Hook.m_GameClientView,
            //         bBig: false,
            //     });
            //     //手牌大小位置
            //     // this.m_TableCardCtrl[i].SetBenchmarkPos(0, 0, GameDef.enXLeft, GameDef.enYBottom);
            //     this.m_LeftCardCtrl.SetCardDistance();
            //     this.m_LeftCardCtrl.node.setPosition(0, 0);
            //     this.m_LeftCardCtrl.SetScale(0.4);
            // }


            var pHuInfo = this.m_ScoreViewNode.getChildByName('HuInfo');
            if (!pHuInfo) return;
            pHuInfo = pHuInfo.getComponent('CustomPage');
            if (!pHuInfo) return;
            pHuInfo.SetCustomText([
                /* '+' +  */(EndInfo.cbHuxiCount),
                /* '+' +  */(Score2Str(EndInfo.lBaseScore)),
                /* '+' +  */(Score2Str(EndInfo.cbZimoFan)),
                /* '+' +  */(Score2Str(EndInfo.lXingScore)),
                /* '+' +  */(EndInfo.cbFan),
                /* '+' +  */(Score2Str(EndInfo.lHuScore)),
                GameDef.GetCHRText_EndView ? GameDef.GetCHRText_EndView(EndInfo.dwChiHuRight, this.m_Hook.m_dwRulesArr, EndInfo.HuCardInfo.cbFan) : '',
            ], null,[
                true,
                true,
                false,
                true,
                true,
                true,
                EndInfo.dwChiHuRight > 0,
            ]);
        // } catch (error) {
        //     ASSERT(false, ' In GameEndView-SetHuInfo catch error is ' + error);
        // }
    },

    SetLoseUserCardInfo: function(EndInfo, WeaveItemArray, cbWeaveCountArray) {

        if(!this.m_TableCardCtrl) this.m_TableCardCtrl = new Array();
        if (!this.m_LoseAreaJP) this.m_LoseAreaJP = new Array();
        if(!this.m_LoseWeaveCard) this.m_LoseWeaveCard = new Array();

        for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
            if (!this.m_UserInfo[i] || i == EndInfo.wWinUser || !EndInfo.dwUserID[i]) continue;
            // 组合控件
            if(!this.m_LoseAreaJP[i]) {
                // this.m_LoseAreaJP[i] = this.$('AreaJP@' + this.GPComponentName('AreaJPPrefab', GameDef.KIND_ID), this.m_UserInfo[i].node);
                this.m_LoseAreaJP[i] = this.$('AreaJP@' + 'AreaJP_PHZ', this.m_UserInfo[i].node);
                this.m_LoseAreaJP[i].SetBenchmarkPos(210, 0, GameDef.enXLeft, GameDef.enYCenter);
                if(!this.m_LoseWeaveCard[i]) {
                    this.m_LoseWeaveCard[i] = new Array();
                    for (var j = 0; j < GameDef.MAX_WEAVE; ++j) {
                        // this.m_LoseWeaveCard[i][j] = this.$('' + j + '@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_LoseAreaJP[i].node);
                        this.m_LoseWeaveCard[i][j] = this.$('' + j + '@' + 'WeaveCtrl_PHZ', this.m_LoseAreaJP[i].node);
                    }
                }
            }

            // 设置组合数据
            for(var j = 0; j < this.m_LoseWeaveCard[i].length; ++ j) {
                if(j < cbWeaveCountArray[i]) {
                    this.m_LoseWeaveCard[i][j].SetDisplayItem(true);
                    this.m_LoseWeaveCard[i][j].SetCardData(WeaveItemArray[i][j]);
                } else {
                    this.m_LoseWeaveCard[i][j].Reset();
                }
            }

            // 手牌控件
            if(!this.m_TableCardCtrl[i]) {
                // this.m_TableCardCtrl[i] =(this.GetGamePrefab('CardCtrlPrefab'));
                this.m_TableCardCtrl[i] = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ'),
                this.m_UserInfo[i].node.addChild(this.m_TableCardCtrl[i].node);
                this.m_TableCardCtrl[i].SetAttribute({
                    _ClientEngine: this.m_Hook,
                    _ClientView: this.m_Hook.m_GameClientView,
                    bBig: false,
                });
                //手牌大小位置
                // this.m_TableCardCtrl[i].SetBenchmarkPos(0, 0, GameDef.enXLeft, GameDef.enYBottom);
                this.m_TableCardCtrl[i].SetCardDistance();
                this.m_TableCardCtrl[i].node.setPosition(0, 0);
                this.m_TableCardCtrl[i].SetScale(0.4);
            }
            // 设置手牌数据
            var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
            var cbCardCount = GameLogic.SwitchToCardData1(EndInfo.cbCardIndex[i], cbCardData, cbCardData.length);
            this.m_TableCardCtrl[i].SetBenchmarkPos(210 + 40 * cbWeaveCountArray[i], -60, GameDef.enXLeft, GameDef.enYBottom);
            this.m_TableCardCtrl[i].SetCardData(cbCardData, cbCardCount, 1, true);
        }
    },

});
