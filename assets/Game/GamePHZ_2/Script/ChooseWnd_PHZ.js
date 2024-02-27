cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_ViewNode: [cc.Node],
        m_btEnsureChi: cc.Button,
    },

    ctor: function () {
        this.m_WeaveChiArray = [];
        this.m_ItemChiArr = [];
        this.m_ItemChiPool = new cc.NodePool(cc.Toggle);

        this.m_WeaveBiArray = [];
        this.m_ItemBiArr = [];
        this.m_ItemBiPool = new cc.NodePool(cc.Toggle);

        this.m_cbUpdateChi = 0;
        this.m_cbUpdateBi = 0;
        this.m_cbRefresh = 0;
        this.m_cbCurrentCard = 0;
    },

    onLoad: function () {},

    start: function () {

    },

    OnShowView() {
        this.m_btEnsureChi.interactable = false;
        ShowO2I(this.node);
    },

    OnHideView() {
        this.m_btEnsureChi.interactable = false;
        HideI2O(this.node);
    },

    SetBenchmarkPos2: function () {
        this.m_ViewNode.parent.setPosition(this.m_BenchmarkPos);
    },

    SetChooseWeave: function (ChiCardInfoArray, cbWeaveCount, cbCurrentCard) {
        this.m_btEnsureChi.interactable = false;
        this.m_cbCurrentCard = 0;
        this.m_cbSelChiIndex = 0;
        if (cbWeaveCount > 0) {
            // this.node.active = true;
        } else {
            this.node.active = false;
            return;
        }
        this.m_cbCurrentCard = cbCurrentCard;
        this.m_ChiCardInfoArray = clone(ChiCardInfoArray);
        this.m_cbWeaveCount = cbWeaveCount;
        this.RemoveIntoPool(this.m_ItemChiArr, this.m_ItemChiPool);
        this.RemoveIntoPool(this.m_ItemBiArr, this.m_ItemBiPool);

        this.m_WeaveChiArray.length = 0;
        this.m_cbValidCnt = 0;
        for (var i = 0; i < this.m_cbWeaveCount; ++i) {
            // this.SetItemInfo(this.m_ViewNode[0], i, this.m_ItemChiArr, this.m_ItemChiPool, this.m_WeaveChiArray, this.m_ChiCardInfoArray[i], 0);
            if(!this.m_ChiCardInfoArray[i].bValid) continue;

            this.SetItemInfo({
                ViewNode: this.m_ViewNode[0],
                cbItemIndex: i,
                ItemArray: this.m_ItemChiArr,
                ItemPool: this.m_ItemChiPool,
                WeaveArray: this.m_WeaveChiArray,
            }, {
                Info: this.m_ChiCardInfoArray[i],
                CardListIndex: 0,
            }, {
                souce: this,
                target: this.node,
                component: 'ChooseWnd_PHZ',
                handler: 'OnButtonclickedChiItem',
                CustomData: i,
            }, );
            this.m_cbValidCnt++;
        }
        for(var i in this.m_ItemChiArr) {
            this.m_ItemChiArr[i].isChecked = false;
        }
        // this.node.active = true;
        this.ShowView();
        this.m_ViewNode[0].active = false;
        this.m_ViewNode[1].active = false;
        this.m_cbRefresh = 1;
    },

    SetItemInfo: function (ViewInfo, ChiCardInfo, ClickHandler) {
        if (!ViewInfo.ViewNode) return;
        // body
        var _pBodyNode = ViewInfo.ViewNode.getChildByName('body');
        if (!_pBodyNode) return;
        // content
        var _pContentNode = _pBodyNode.getChildByName('content');
        if (!_pContentNode) return;

        // Toggle
        var _pItemNode = _pContentNode.getChildByName('itemNode');
        if (!_pItemNode) return;
        var _pItem = this.GetPreFormPool(ViewInfo.ItemPool, _pItemNode, _pContentNode, cc.Toggle);
        this.AddClickHandler(_pItem[0], ClickHandler.target, ClickHandler.component, ClickHandler.handler, ClickHandler.CustomData);
        _pItem[0].node.active = true;
        ViewInfo.ItemArray.push(_pItem[0]);

        // WeaveCtrl
        // var _pWeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), _pItem[0].node);
        var _pWeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', _pItem[0].node);
        if (!_pWeaveCtrl) return;
        var _WeaveItem = GameDef.tagWeaveItem();
        _WeaveItem.cbCardCount = 3;
        _WeaveItem.wWeaveKind = GameDef.ACK_CHI;
        _WeaveItem.cbCenterCard = ChiCardInfo.Info.cbCenterCard;
        _WeaveItem.cbChiKind = ChiCardInfo.Info.cbChiKind[ChiCardInfo.CardListIndex];
        _WeaveItem.cbCardList[0] = ChiCardInfo.Info.cbCardData[ChiCardInfo.CardListIndex][0];
        _WeaveItem.cbCardList[1] = ChiCardInfo.Info.cbCardData[ChiCardInfo.CardListIndex][1];
        _WeaveItem.cbCardList[2] = ChiCardInfo.Info.cbCardData[ChiCardInfo.CardListIndex][2];
        _pWeaveCtrl.SetAttribute({
            _ClientEngine: this.m_Attribute._ClientEngine,
            bBig: false,
            wViewID: GameDef.MYSELF_VIEW_ID
        });
        _pWeaveCtrl.SetDisplayItem(true);
        _pWeaveCtrl.SetShowBack(true);
        _pWeaveCtrl.SetCardData(_WeaveItem);
        ViewInfo.WeaveArray.push(_pWeaveCtrl);
    },

    OnButtonclickedChiItem: function (event, custromData) {
        // console.log(event);
        // console.log(custromData);
        this.m_pItemChi = event.target.getComponent(cc.Toggle);
        this.m_pItemBi = null;
        if (this.m_pItemChi) {
            this.m_cbSelChiIndex = custromData;
            this.m_btEnsureChi.interactable = true;
            if(window.LOG_NET_DATA)console.log(' ######## 比牌 ' + (this.m_ChiCardInfoArray[this.m_cbSelChiIndex].cbResultCount - 1));
            if(window.LOG_NET_DATA)console.log(this.m_ChiCardInfoArray[this.m_cbSelChiIndex]);
            if (this.m_pItemChi.isChecked) {
                // if (this.m_Attribute._ClientEngine && this.m_Attribute._ClientEngine.OnMessageChooseCard)
                //     this.m_Attribute._ClientEngine.OnMessageChooseCard(this.m_ChiCardInfoArray[this.m_cbSelChiIndex].cbChiKind);
                this.m_cbUpdateChi = 1;
                this.m_cbRefresh = 1;
            } else {
                this.RemoveIntoPool(this.m_ItemBiArr, this.m_ItemBiPool);
                if (this.m_ChiCardInfoArray[this.m_cbSelChiIndex].cbResultCount > 1) {
                    this.RemoveIntoPool(this.m_ItemBiArr, this.m_ItemBiPool);
                    for (var i = 1; i < this.m_ChiCardInfoArray[this.m_cbSelChiIndex].cbResultCount; ++i) {
                        //this.SetItemInfo(this.m_ViewNode[1], i - 1, this.m_ItemBiArr, this.m_ItemBiPool, this.m_WeaveBiArray, this.m_ChiCardInfoArray[i], i);
                        this.SetItemInfo({
                            ViewNode: this.m_ViewNode[1],
                            cbItemIndex: i - 1,
                            ItemArray: this.m_ItemBiArr,
                            ItemPool: this.m_ItemBiPool,
                            WeaveArray: this.m_WeaveBiArray,
                        }, {
                            Info: this.m_ChiCardInfoArray[this.m_cbSelChiIndex],
                            CardListIndex: i,
                        }, {
                            souce: this,
                            target: this.node,
                            component: 'ChooseWnd_PHZ',
                            handler: 'OnButtonclickedBiItem',
                            CustomData: i - 1,
                        }, );
                    }
                    for(var i in this.m_ItemBiArr) {
                        this.m_ItemBiArr[i].isChecked = (i == 0);
                        // this.m_ItemBiArr[i].isChecked = true;
                        if(i == 0) this.m_pItemBi = this.m_ItemBiArr[0];
                    }
                    this.m_cbUpdateBi = 1;
                    this.m_cbUpdateChi = 0;

                } else {
                    this.m_cbUpdateChi = 1;
                    this.m_cbUpdateBi = 0;
                }
                this.m_cbRefresh = 1;
            }
        }
    },

    OnClickedEnsureChi: function() {
        var WeaveItemArray = new Array();
        var cbCount = 0;
        for(var i in this.m_ItemBiArr) {
            if(!this.m_ItemBiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemBiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            WeaveItemArray[cbCount] = GameDef.tagWeaveItem();
            WeaveItemArray[cbCount].wWeaveKind = GameDef.ACK_CHI;
            WeaveItemArray[cbCount].cbChiKind = WeaveItem.cbChiKind;
            WeaveItemArray[cbCount].cbCardCount = WeaveItem.cbCardCount;
            WeaveItemArray[cbCount].cbCenterCard = WeaveItem.cbCenterCard;
            WeaveItemArray[cbCount].cbCardList[0] = WeaveItem.cbCardList[0];
            WeaveItemArray[cbCount].cbCardList[1] = WeaveItem.cbCardList[1];
            WeaveItemArray[cbCount].cbCardList[2] = WeaveItem.cbCardList[2];
            WeaveItemArray[cbCount].cbCardList[3] = 0;
            cbCount++;
        }

        if(cbCount == 0 && this.m_ItemBiArr.length > 0) {
            return;
        }

        var cbChiKind = 0;
        for(var i in this.m_ItemChiArr) {
            if(!this.m_ItemChiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemChiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemChiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            cbChiKind = WeaveItem.cbChiKind;
            break;
        }
        if (this.m_Attribute._ClientEngine && this.m_Attribute._ClientEngine.OnMessageChooseCard)
            this.m_Attribute._ClientEngine.OnMessageChooseCard(cbChiKind, this.m_cbCurrentCard, WeaveItemArray, cbCount);
    },

    OnButtonclickedBiItem: function (event, custromData) {
        this.m_pItemBi = event.target.getComponent(cc.Toggle);
        this.m_btEnsureChi.interactable = false;
        this.m_cbUpdateBi = 1;
    },

    update: function () {
        if (this.m_cbRefresh > 0) {
            this.m_cbRefresh --;
            this.UpdateViewSize();
        }

        if(this.m_cbUpdateBi > 0) {
            this.m_cbUpdateBi--;
            this.CheckBi();
        }

        if(this.m_cbUpdateChi > 0) {
            this.m_cbUpdateChi--;
            this.CheckChi();
        }
    },

    UpdateViewSize: function () {
        var i = 0;
        if (this.m_ItemChiArr.length > 0) {
            if (this.m_ViewNode[i]) {
                this.m_ViewNode[i].active = true;
                var pBodyNode = this.m_ViewNode[i].getChildByName('body');
                // if (pBodyNode) this.m_ViewNode[i].setContentSize(pBodyNode.getContentSize());
            }
        }
        ++i;
        if (this.m_ItemBiArr.length > 0) {
            if (this.m_ViewNode[i]) {
                this.m_ViewNode[i].active = true;
                var pBodyNode = this.m_ViewNode[i].getChildByName('body');
                // if (pBodyNode) this.m_ViewNode[i].setContentSize(pBodyNode.getContentSize());
            }
        } else {
            this.m_ViewNode[i].active = false;
        }
    },

    CheckBi1: function() {
        if(!this.m_Attribute._ClientEngine) {
            return -1;
        }
        if(!GameLogic.IsValidCard(this.m_cbCurrentCard)) {
            return -2;
        }
        if(!this.m_pItemBi) {
            return -3;
        }
        var cbCurrentIndex = GameLogic.SwitchToCardIndex(this.m_cbCurrentCard);
        var cbCurrentCount = this.m_Attribute._ClientEngine.m_cbCardIndex[cbCurrentIndex];
        if(cbCurrentCount > this.m_ItemBiArr.length) cbCurrentCount = this.m_ItemBiArr.length;

        if(cbCurrentCount == 0) {
            return 1;
        }

        // var _pWeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_pItemBi.node);
        var _pWeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_pItemBi.node);
        var _WeaveItem = _pWeaveCtrl.GetWeaveItem();

        // 判断比牌数量
        var cbSelCnt = GameLogic.GetCardCountByData(_WeaveItem.cbCardList, _WeaveItem.cbCardCount, this.m_cbCurrentCard);
        var bFlag = true;
        for(var i in this.m_ItemBiArr) {
            if(!this.m_ItemBiArr[i].isChecked) continue;
            if(this.m_pItemBi == this.m_ItemBiArr[i]) {

            } else {
                // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
                var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemBiArr[i].node);
                var WeaveItem = WeaveCtrl.GetWeaveItem();
                var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
                if(cbSelCnt + cbTempCnt > cbCurrentCount) {
                    bFlag = false;
                    break;
                }
                cbSelCnt += cbTempCnt;
            }
        }
        // 调整选择
        if(!bFlag) {
            cbSelCnt = GameLogic.GetCardCountByData(_WeaveItem.cbCardList, _WeaveItem.cbCardCount, this.m_cbCurrentCard);
            for(var i in this.m_ItemBiArr) {
                this.m_ItemBiArr[i].isChecked = false;
            }
            this.m_pItemBi.isChecked = true;

            // for(var i in this.m_ItemBiArr) {
            //     if(this.m_pItemBi == this.m_ItemBiArr[i]) {
            //         this.m_ItemBiArr[i].isChecked = true;
            //     } else {
            //         var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
            //         var WeaveItem = WeaveCtrl.GetWeaveItem();
            //         var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
            //         if(cbSelCnt + cbTempCnt <= cbCurrentCount) {
            //             this.m_ItemBiArr[i].isChecked = true;
            //             cbSelCnt += cbTempCnt;
            //         }
            //     }
            // }
        }

        // var cbSelCnt = 0;
        // if(this.m_pItemBi.isChecked) cbSelCnt = GameLogic.GetCardCountByData(_WeaveItem.cbCardList, _WeaveItem.cbCardCount, this.m_cbCurrentCard);
        // for(var i in this.m_ItemBiArr) {
        //     if(this.m_pItemBi == this.m_ItemBiArr[i] && this.m_pItemBi.isChecked) {
        //         console.log(' ~~~~~~~~~~~~~')
        //     } else {
        //         var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
        //         var WeaveItem = WeaveCtrl.GetWeaveItem();
        //         var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
        //         if(cbSelCnt + cbTempCnt <= cbCurrentCount) {
        //             this.m_ItemBiArr[i].isChecked = true;
        //             cbSelCnt += cbTempCnt;
        //         } else {
        //             this.m_ItemBiArr[i].isChecked = false;
        //         }
        //     }
        // }


        var cbSelCnt = 0;
        if(this.m_pItemBi.isChecked) cbSelCnt = GameLogic.GetCardCountByData(_WeaveItem.cbCardList, _WeaveItem.cbCardCount, this.m_cbCurrentCard);
        for(var i in this.m_ItemBiArr) {
            if(this.m_pItemBi == this.m_ItemBiArr[i]) {
            } else {
                // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
                var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemBiArr[i].node);
                var WeaveItem = WeaveCtrl.GetWeaveItem();
                var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
                if(cbSelCnt + cbTempCnt <= cbCurrentCount) {
                    this.m_ItemBiArr[i].isChecked = true;
                    cbSelCnt += cbTempCnt;
                } else {
                    this.m_ItemBiArr[i].isChecked = false;
                }
            }
        }
        this.m_btEnsureChi.interactable = false;
        for(var i in this.m_ItemBiArr) {
            if(this.m_ItemBiArr[i].isChecked) this.m_btEnsureChi.interactable = true;
        }
    },

    CheckBi: function() {
        if(!this.m_Attribute._ClientEngine) {
            return -1;
        }
        if(!GameLogic.IsValidCard(this.m_cbCurrentCard)) {
            return -2;
        }
        var cbSelCnt = 0;
        for(var i in this.m_ItemChiArr) {
            if(!this.m_ItemChiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemChiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemChiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
            cbSelCnt += cbTempCnt;
        }
        for(var i in this.m_ItemBiArr) {
            if(!this.m_ItemBiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemBiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
            cbSelCnt += cbTempCnt;
        }
        var cbCurrentIndex = GameLogic.SwitchToCardIndex(this.m_cbCurrentCard);
        var cbCurrentCount = this.m_Attribute._ClientEngine.m_cbCardIndex[cbCurrentIndex];
        this.m_btEnsureChi.interactable = false;
        if(cbCurrentCount + 1 == cbSelCnt) this.m_btEnsureChi.interactable = true;
        return 0;
    },

    CheckChi: function() {
        var cbSelCnt = 0;
        for(var i in this.m_ItemChiArr) {
            if(!this.m_ItemChiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemChiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemChiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
            cbSelCnt += cbTempCnt;
        }
        for(var i in this.m_ItemBiArr) {
            if(!this.m_ItemBiArr[i].isChecked) continue;
            // var WeaveCtrl = this.$('WeaveCtrl@' + this.GPComponentName('WeaveCtrlPrefab', GameDef.KIND_ID), this.m_ItemBiArr[i].node);
            var WeaveCtrl = this.$('WeaveCtrl@' + 'WeaveCtrl_PHZ', this.m_ItemBiArr[i].node);
            var WeaveItem = WeaveCtrl.GetWeaveItem();
            var cbTempCnt = GameLogic.GetCardCountByData(WeaveItem.cbCardList, WeaveItem.cbCardCount, this.m_cbCurrentCard);
            cbSelCnt += cbTempCnt;
        }
        var cbCurrentIndex = GameLogic.SwitchToCardIndex(this.m_cbCurrentCard);
        var cbCurrentCount = this.m_Attribute._ClientEngine.m_cbCardIndex[cbCurrentIndex];
        this.m_btEnsureChi.interactable = false;
        if(cbCurrentCount + 1 == cbSelCnt) this.m_btEnsureChi.interactable = true;
    },

});
