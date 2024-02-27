// 牌数据坐标
function tagCardDataPostion() {
    var Obj = new Object();
    //Obj._name="tagCardDataPostion"
    Obj.Col = -2;
    Obj.Row = -2;

    Obj._Log = function () {
        return 'Col=' + this.Col + ',Row=' + this.Row;
    };
    return Obj;
};

cc.Class({
    extends: cc.CardCtrlBase_PHZ,

    properties: {
        m_OutCardArea: cc.Node,
        m_CardLayout: cc.Layout,
        m_CardPrefab: cc.Prefab,
    },

    ctor: function () {
        this.m_cbCardScale = 0; // 牌型
        this.m_cbCardDataMap = new Array();
        this.m_OutCardNode = null;
        this.m_szName = 'CardCtrl_PHZ';
        this.m_bSelMode = 1; // 0：没有限制所有牌都可以点；1：根据牌型限制点击（3张以上不可以点击）
        this.m_cbFXCard = null;
        this.m_cbFXCount = 0;
        this.m_bLookonMode = false; //观战模式
    },

    onLoad: function() {
        this.InitView();
    },

    start: function () {
        this.InitView();
    },

    InitView: function() {
        if(!this.m_OutCardNode) {
            this.m_OutCardNode = this.$('OutCardNode');
            if(this.m_OutCardNode) {
                this.m_pOCAniCtrl = this.$('@CustomAction_PHZ', this.m_OutCardNode);
                if(this.m_pOCAniCtrl) {
                    this.m_pOCAniCtrl.DelayShowNode(0.1, 0.25, 0.5, true);
                    this.m_OutCardNode.active = false;
                }
            }
        }
    },

    SetSelMode: function(bSelMode) {
        this.m_bSelMode = bSelMode;
    },

    update: function () {
        if (this.m_cbCardScale == window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Scale]) return;
        this.DrawCard();
    },

    // 校验控件牌数据 防止出现多牌
    CheckCardDataMap: function(cbCardDataParam, cbCardCountParam) {
        if(cbCardCountParam <= 0) return //console.log('~~~~~~~~~~~~~~~~~ CheckCardDataMap cbCardCountParam <= 0');
        if(!this.m_cbCardDataMap) return //console.log('~~~~~~~~~~~~~~~~~ CheckCardDataMap !this.m_cbCardDataMap');

        this.m_cbOldCardCount = 0;
        this.m_cbOldCardData = new Array();
        for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
            for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                if(this.m_cbCardDataMap[i][j] <= 0) continue;
                this.m_cbOldCardData.push(this.m_cbCardDataMap[i][j]);
            }
        }
        this.m_cbOldCardCount = this.m_cbOldCardData.length;
        var cbTempCardData = clone(this.m_cbOldCardData);
        if(GameLogic.RemoveCard4(cbTempCardData, this.m_cbOldCardCount, cbCardDataParam, cbCardCountParam)) {
            for(var m in cbTempCardData) {
                if(!GameLogic.IsValidCard(cbTempCardData[m])) continue;
                for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
                    for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                        if(this.m_cbCardDataMap[i][j] == cbTempCardData[m]) {
                            this.m_cbCardDataMap[i][j] = 0;
                            cbTempCardData[m] = 0;
                            break;
                        }
                    }
                    if(cbTempCardData[m] == 0) break;
                }
            }
        } else {
            //console.log('~~~~~~~~~~~~~~~~~ CheckCardDataMap !GameLogic.RemoveCard4');
        }

        this.EraseInvalidCardData();
    },

    SetCardData2: function (cbCardData, cbCardCount, cbSortType, bSortData) {
        //效验参数
        // if (cbCardCount > GameDef.MAX_CARD_COUNT) return false;
        if(!cbCardData || cbCardCount <= 0) this.SetOutCardTip(false);
        //扑克数目
        this.m_cbCardCount = cbCardCount;
        this.m_cbCardData = clone(cbCardData);

        //手牌索引
        this.m_cbCardIndex = new Array();
        this.m_cbCardIndex.length = GameDef.MAX_INDEX;
        GameLogic.SwitchToCardIndex1(cbCardData, cbCardCount, this.m_cbCardIndex);

        /*
        // 牌数据
        this.m_cbCardDataMap = new Array();
        for (var i = 0; i < GameDef.MAX_INDEX; ++i) {
            if (this.m_cbCardIndex[i] > 0) {
                this.m_cbCardDataMap.push(new Array(this.m_cbCardIndex[i]));
                var len = this.m_cbCardDataMap.length;
                var TempData = GameLogic.SwitchToCardData(i);
                for (var j = 0; j < this.m_cbCardIndex[i]; ++j) {
                    this.m_cbCardDataMap[len - 1][j] = TempData;
                }
            }
        }
        */
        this.InitView();
        if(bSortData || !this.m_cbCardDataMap || this.m_cbCardCount <= 0) {
            if (!cbSortType) cbSortType = 1;
            this.m_cbSortType = cbSortType;
            if (cbSortType == 1) this.m_cbCardDataMap = GameLogic.SortCardList(this.m_cbCardIndex);
            else if (cbSortType == 2) this.m_cbCardDataMap = GameLogic.SortCardList2(this.m_cbCardIndex);
            else if (cbSortType == 3 && GameLogic.SortCardListQDS) this.m_cbCardDataMap = GameLogic.SortCardListQDS(this.m_cbCardIndex);
            else if (cbSortType == 4 && GameLogic.SortCardListQD) this.m_cbCardDataMap = GameLogic.SortCardListQD(this.m_cbCardIndex);
            else this.m_cbCardDataMap = GameLogic.SortCardList(this.m_cbCardIndex);
        } else {
            this.CheckCardDataMap(cbCardData, cbCardCount);
        }

        this.DrawCard();
        return true;
    },

    //绘画扑克
    DrawCard2: function () {

        this.RemoveIntoPool(this.m_CardArr, this.m_CardPool);
        this.m_cbCardScale = window.g_GameSetting[GameDef.KIND_ID][window.SetKey_Card_Scale];
        var fScaleValue = this.m_fScaleValue;
        if (this.m_cbCardScale == 0) {
            fScaleValue = this.m_fScaleValue;
        } else {
            fScaleValue *= 1.3;
        }

        var cbTempCount = 0;
        var SpaceX = 10;
        var SpaceY = 80;

        for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
            var ptPos = cc.v2(0, 0);
            var bCanSel = true;
            if(this.m_cbCardDataMap[i].length >= 3) {
                if(this.m_cbCardDataMap[i][0] == this.m_cbCardDataMap[i][1] && this.m_cbCardDataMap[i][0] == this.m_cbCardDataMap[i][2]) bCanSel = false;
            }
            if(this.m_bSelMode == 0) bCanSel = true;

            for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {

                var pCard = this.AddCardItem({
                    CardArray: this.m_CardArr,
                    CardPool: this.m_CardPool,
                    // CardPrefab: this.GetGamePrefab('CardPrefab'),
                    CardPrefab:cc.instantiate(this.m_CardPrefab).getComponent('CardPrefab_PHZ'),
                    ParentNode: this.node,
                    Component: 'CardPrefab_PHZ',
                    Scale: fScaleValue,
                    // Display: true,
                    Display: this.m_bLookonMode ? false : true,
                    cbCardData: this.m_cbCardDataMap[i][j],
                    Index: [i, j],
                    // Position: ptPos,
                    // ZIndex: GameDef.MAX_CARD_COUNT - cbTempCount,
                });

                var CardSize = pCard.GetCardSize();
                CardSize.width -= 4;
                CardSize.height -= 0;
                var width = this.m_cbCardDataMap.length * CardSize.width;

                ptPos.x = this.m_BenchmarkPos.x - fScaleValue * width * 0.5 + fScaleValue * (i * CardSize.width + CardSize.width * 0.5);

                if(this.m_CollocateMode.x == GameDef.enXLeft) {
                    // ptPos.x = this.m_BenchmarkPos.x + fScaleValue * width * 0.5 + fScaleValue * (i * CardSize.width + CardSize.width * 0.5);
                    ptPos.x = this.m_BenchmarkPos.x + fScaleValue * CardSize.width * 0.5 + fScaleValue * (i * CardSize.width);
                }

                ptPos.y = this.m_BenchmarkPos.y + fScaleValue * CardSize.height * 0.5 + fScaleValue * j * SpaceY;

                pCard.node.setPosition(ptPos);
                pCard.node.zIndex = GameDef.MAX_CARD_COUNT - cbTempCount;

                ++cbTempCount;
                ptPos.y += SpaceY;
                pCard.SetCanSelect(bCanSel);

                // pCard.SetXing(this.IsXingCard(this.m_cbCardDataMap[i][j]));
            }
        }

        this.SetTingTip(this.m_cbTingCard);
        // 醒牌显示
        this.unschedule(this.SetXingFlag);
        this.scheduleOnce(this.SetXingFlag, 0.1);
    },
    SetXingFlag: function() {
        for(var i in this.m_CardArr) {
            var cbCardData = this.m_CardArr[i].GetData();
            this.m_CardArr[i].SetXing(this.IsXingCard(cbCardData));
        }
    },

    ///////////////////////////////////////////////////////////////////////////

    //获取扑克
    GetCardData: function (cbCardData, cbBufferCount) {
        //效验参数
        if (cbBufferCount < this.m_cbCardCount) return 0;

        //拷贝扑克
        for (var i = 0; i < this.m_cbCardCount; i++) {
            cbCardData[i] = this.m_CardItemArray[i].card.GetData();
        }

        return this.m_cbCardCount;
    },

    //扑克数目
    GetCardCount: function () {
        return this.m_cbCardCount;
    },

    ///////////////////////////////////////////////////////////////////////////

    /* //触摸事件
    onTouchBegan: function (event) {
        this.m_StartCardID = this.SearchCardID(this.node.parent.convertToNodeSpace(event.getLocation()));
        // event.stopPropagation();
        this.m_bMove = false;
        if (!this.m_bPositively) return true;
        return true;
    },

    //触摸事件
    onTouchMove: function (event) {
        var ptMove = this.node.parent.convertToNodeSpace(event.getLocation());
        if (this.IsValidCardID(this.m_StartCardID)) {
            var pCard = this.m_CardArr[this.m_StartCardID];
            pCard.node.setPosition(ptMove);
            pCard.node.zIndex = GameDef.MAX_CARD_COUNT + 1;
        } else {
            if (window.LOG_NET_DATA) console.log(' ######## onTouchMove' + this.m_StartCardID);
        }
        this.m_bMove = true;
        if (!this.m_bPositively) return;
    },

    onTouchEnded: function (event) {
        if(!this.IsValidCardID(this.m_StartCardID)) return;

        if (this.m_bMove) {
            this.m_EndCardID = this.SearchCardID(this.node.parent.convertToNodeSpace(event.getLocation()), this.m_StartCardID);
            this.MoveCardData(this.m_StartCardID, this.m_EndCardID);
            if (window.LOG_NET_DATA) console.log(' ######## StartCardID = ' + this.m_StartCardID + '; EndCardID = ' + this.m_EndCardID);
        } else {
            // 出牌处理
            if (!this.m_bPositively) {
                this.DrawCard();
                return;
            }
            this.m_EndCardID = this.SearchCardID(this.node.parent.convertToNodeSpace(event.getLocation()));
            if (window.LOG_NET_DATA) console.log(' ######## onTouchEnded HitCardID = ' + this.m_EndCardID);

            if(this.m_Attribute._ClientEngine && this.m_Attribute._ClientEngine.OnMessageOutCard) {
                this.m_Attribute._ClientEngine.OnMessageOutCard.OnMessageOutCard(this.GetCardData(this.m_EndCardID));
            }
        }
    }, */

    SetName: function(szName) {
        this.m_szName = szName;
    },

    //触摸事件
    onTouchBegan: function (event) {
        if (this.m_cbCardCount < 1) return false;
        this.m_StartCardID = this.SearchCardID(this.node.parent.convertToNodeSpace(event.getLocation()));
        // if (window.LOG_NET_DATA) console.log(' m_StartCardID is ' + (this.m_StartCardID && this.m_StartCardID._Log) ? this.m_StartCardID._Log() : "null");
        if(!this.IsValidCardID(this.m_StartCardID)) return false;
        if(!this.GetCardNode(this.m_StartCardID).IsCanSelect()){
            this.m_StartCardID = null;
            return false;
        }
        // event.stopPropagation();
        this.m_bMove = false;
        if (this.m_Attribute._ClientEngine) {
            if (this.m_Attribute._ClientEngine.OnHitShowTingTip) {
                this.m_Attribute._ClientEngine.OnHitShowTingTip(this.GetCardData2(this.m_StartCardID));
            }
        }
        if (!this.m_bPositively) return true;
        // if(this.m_OutCardNode) this.m_OutCardNode.active = true;
        return true;
    },

    //触摸事件
    onTouchMove: function (event) {
        if (!this.m_StartCardID || this.m_cbCardCount < 1) return false;
        var ptMove = this.node.parent.convertToNodeSpace(event.getLocation());
        if (this.IsValidCardID(this.m_StartCardID)) {
            var pCard = this.GetCardNode(this.m_StartCardID);
            pCard.node.setPosition(ptMove);
            pCard.node.zIndex = GameDef.MAX_CARD_COUNT + 1;
        } else {
            // if (window.LOG_NET_DATA) console.log(' ---------------- onTouchMove' + this.m_StartCardID._Log());
        }
        this.m_bMove = true;
        if (!this.m_bPositively) return;
    },

    onTouchEnded: function (event) {
        if (!this.m_StartCardID || this.m_cbCardCount < 1) return false;
        if (!this.IsValidCardID(this.m_StartCardID)) return;

        if (this.m_bMove) {
            var ptTouch = this.node.parent.convertToNodeSpace(event.getLocation());

            if (this.m_OutCardArea.getBoundingBox().contains(ptTouch)) {
                if (!this.m_bPositively) {
                    this.DrawCard();
                    return;
                }
                if (this.m_Attribute._ClientEngine) {
                    if (this.m_Attribute._OutCardCallback && this.m_Attribute._ClientEngine[this.m_Attribute._OutCardCallback]) {
                        this.m_Attribute._ClientEngine[this.m_Attribute._OutCardCallback](this.GetCardData(this.m_StartCardID));
                    } else if (this.m_Attribute._ClientEngine.OnMessageOutCard) {
                        if(this.m_Attribute._ClientEngine.OnMessageOutCard(this.GetCardData(this.m_StartCardID))) {
                            this.DeleteCardData(this.m_StartCardID);
                            if (this.m_Attribute._ClientEngine.OnHitShowTingTip) {
                                this.m_Attribute._ClientEngine.OnHitShowTingTip(this.GetCardData2(this.m_StartCardID));
                            }
                        } else {
                            if (this.m_Attribute._ClientEngine.OnHitShowTingTip) {
                                this.m_Attribute._ClientEngine.OnHitShowTingTip(0);
                            }
                        }
                    }
                }
            } else {
                this.m_EndCardID = this.SearchCardID(this.node.parent.convertToNodeSpace(event.getLocation()), this.m_StartCardID);
                // if (window.LOG_NET_DATA) console.log(' m_EndCardID is ' + this.m_EndCardID._Log());

                if (this.IsCanMoveData(this.m_StartCardID, this.m_EndCardID)) {
                    this.MoveCardData(this.m_StartCardID, this.m_EndCardID);
                } else {
                    this.DrawCard();
                }
                if (this.m_Attribute._ClientEngine.OnHitShowTingTip) {
                    this.m_Attribute._ClientEngine.OnHitShowTingTip(0);
                }
            }
        } else { // 点击事件
            if (this.m_Attribute._ClientEngine) {
                if (this.m_Attribute._ClickCardCallback && this.m_Attribute._ClientEngine[this.m_Attribute._ClickCardCallback]) {
                    this.m_Attribute._ClientEngine[this.m_Attribute._ClickCardCallback](this.SearchCardData(this.m_StartCardID));
                }
            }
        }
    },

    // 获取
    SearchCardData: function (posID) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length) {
            var cbTempData = this.m_cbCardDataMap[posID.Col][posID.Row];
            // this.m_cbCardDataMap[posID.Col][posID.Row] = 0;
            return cbTempData;
        }
        return 0;
    },

    IsValidCardID: function (posID) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length) {
            return true;
        }
        return false;
    },

    GetCardNode: function (posID) {
        var cbTempID = 0;
        for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
            for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                if (posID.Col == i && posID.Row == j) {
                    return this.m_CardArr[cbTempID]
                }
                ++cbTempID;
            }
        }
        return null;
    },

    // 手牌ID
    SearchCardID: function (ptTouch, cbExcludeID) {
        var pos = tagCardDataPostion();
        var cbTarget = this.m_CardArr.length;
        var cbTempID = 0;
        for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
            for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                if (cbExcludeID && (cbExcludeID.Col == i && cbExcludeID.Row == j)) {
                    ++cbTempID;
                    continue;
                }
                if (this.m_CardArr[cbTempID].node.getBoundingBox().contains(ptTouch)) {
                    cbTarget = cbTempID;
                }
                ++cbTempID;
            }
        }

        if (cbTarget < this.m_CardArr.length) {
            var cbTempID = 0;
            for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
                for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                    if (cbTempID == cbTarget) {
                        pos.Col = i;
                        pos.Row = j;
                        return pos;
                    }
                    ++cbTempID;
                }
            }
        } else {
            if(this.m_CardArr.length <= 0) return pos;
            var sizeCard = this.m_CardArr[0].node.getContentSize();
            if (ptTouch.x < this.m_CardArr[0].node.x - sizeCard.width * 0.5) {
                pos.Col = -1;
                return pos;
            } else {
                var tempID = tagCardDataPostion();
                tempID.Col = this.m_cbCardDataMap.length - 1;
                tempID.Row = 0;
                var pCard = this.GetCardNode(tempID);
                if (pCard && ptTouch.x > pCard.node.x + sizeCard.width * 0.5) {
                    pos.Col = this.m_cbCardDataMap.length;
                    return pos;
                }
            }

            var cbTempID = 0;
            for (var i = 0; i < this.m_cbCardDataMap.length; ++i) {
                for (var j = 0; j < this.m_cbCardDataMap[i].length; ++j) {
                    if (cbExcludeID && (cbExcludeID.Col == i && cbExcludeID.Row == j)) {
                        ++cbTempID;
                        continue;
                    }
                    if (ptTouch.x > this.m_CardArr[cbTempID].node.x - sizeCard.width * 0.5 &&
                        ptTouch.x < this.m_CardArr[cbTempID].node.x + sizeCard.width * 0.5) {
                        pos.Row = this.m_cbCardDataMap[i].length;
                        pos.Col = i;
                        return pos;
                    }
                    ++cbTempID;
                }
            }
        }
        return pos;
    },

    //
    IsCanMoveData: function (posStart, posEnd) {
        if (this.m_cbSortType != 1) return false;
        if (posStart.Col < 0 || posStart.Row < 0) return false;
        if (posEnd.Col == -2) return false;
        if (this.m_cbCardDataMap[posStart.Col].length >= 3) {
            if (this.m_cbCardDataMap[posStart.Col][0] == this.m_cbCardDataMap[posStart.Col][1] &&
                this.m_cbCardDataMap[posStart.Col][0] == this.m_cbCardDataMap[posStart.Col][2])
                return false;
        }
        // 新列-左
        if (posEnd.Col == -1) {}
        // 新列-右
        else if (posEnd.Col == this.m_cbCardDataMap.length) {}
        //
        else {
            if (posStart.Col != posEnd.Col && this.m_cbCardDataMap[posEnd.Col].length > 2) return false;
        }
        return true;
    },

    // 获取
    GetCardData: function (posID) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length) {
            var cbTempData = this.m_cbCardDataMap[posID.Col][posID.Row];
            this.m_cbCardDataMap[posID.Col][posID.Row] = 0;
            return cbTempData;
        }
        return 0;
    },
    GetCardData2: function (posID) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length) {
            var cbTempData = this.m_cbCardDataMap[posID.Col][posID.Row];
            return cbTempData;
        }
        return 0;
    },
    // 插入
    InsertCardData: function (posID, cbCardData) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length) {
            this.m_cbCardDataMap[posID.Col].splice(posID.Row, 0, cbCardData);
            return true;
        }

        // 新列-左
        if (posID.Col == -1) {
            this.m_cbCardDataMap.splice(0, 0, [cbCardData]);
            return true;
        }
        // 新列-右
        else if (posID.Col == this.m_cbCardDataMap.length) {
            this.m_cbCardDataMap.push([cbCardData]);
            return true;
        }
        //
        else {
            if (this.m_cbCardDataMap[posID.Col].length < 3) {
                this.m_cbCardDataMap[posID.Col].push(cbCardData);
                return true;
            }
        }

        return false;
    },

    // 恢复
    ResumeCardData: function (posID, cbCardData) {
        if (posID.Col >= 0 && posID.Col < this.m_cbCardDataMap.length && posID.Row >= 0 && posID.Row < this.m_cbCardDataMap[posID.Col].length &&
            this.m_cbCardDataMap[posID.Col][posID.Row] == 0) {
            this.m_cbCardDataMap[posID.Col][posID.Row] = cbCardData;
            return true;
        }
        return false;
    },

    EraseInvalidCardData: function () {
        for (var i = this.m_cbCardDataMap.length - 1; i >= 0; --i) {
            for (var j = this.m_cbCardDataMap[i].length - 1; j >= 0; --j) {
                if (this.m_cbCardDataMap[i][j] == 0) {
                    this.m_cbCardDataMap[i].splice(j, 1);
                }
            }
        }
        for (var i = this.m_cbCardDataMap.length - 1; i >= 0; --i) {
            if (this.m_cbCardDataMap[i].length == 0) {
                this.m_cbCardDataMap.splice(i, 1);
            }
        }
    },

    MoveCardData: function (posID, posTargetID) {
        var cbTempID = 0;
        var cbTempData = this.GetCardData(posID);
        if (this.InsertCardData(posTargetID, cbTempData)) {
            this.EraseInvalidCardData();
        } else {
            this.ResumeCardData(posID, cbTempData);
        }
        this.DrawCard();
    },

    DeleteCardData: function(posID, bDrawCard) {
        console.log(' sdfgsdfgsdfgsdfgsdfgsdfg DeleteCardData')
        this.m_cbCardDataMap[posID.Col][posID.Row] = 0;
        this.EraseInvalidCardData();
        if(bDrawCard) this.DrawCard();
    },

    SetOutCard: function(ptPosFrom, szState) {
        if(!this.m_CardArr || !this.m_CardArr[0]) return;
        var pMoveTo = cc.moveTo(0.25, this.m_BenchmarkPos);
        this.m_CardArr[0].node.stopAllActions();
        this.m_CardArr[0].node.setPosition(ptPosFrom);
        this.m_CardArr[0].node.setScale(0);
        // this.m_CardArr[0].node.runAction(cc.spawn(pMoveTo.easing(cc.easeBounceOut()), cc.scaleTo(0.5, this.m_fScaleValue).easing(cc.easeBounceOut())));
        this.m_CardArr[0].node.runAction(cc.spawn(pMoveTo, cc.scaleTo(0.25, this.m_fScaleValue)));
        this.SetCardFlag(szState);
    },

    SetCardFlag: function(szState) {
        if(this.m_CardArr && this.m_CardArr[0]) {
            if(szState == 'Out') this.m_CardArr[0].setFlagOut();
            else if(szState == 'Send') this.m_CardArr[0].setFlagSend();
            else if(szState == 'Xing') this.m_CardArr[0].setFlagXing();
        }
    },

    AddDiscard: function(ptPosTo) {
        var pMoveTo = cc.moveTo(0.25, ptPosTo);
        this.m_CardArr[0].node.stopAllActions();
        this.m_CardArr[0].node.runAction(cc.spawn(pMoveTo, cc.scaleTo(0.25, 0.01)));
    },

    GetCardItemSize: function() {
        var sizeCard = cc.size(0, 0);
        if(this.m_CardArr && this.m_CardArr[0]) {
            if(this.m_CardArr[0].GetCardWidth) sizeCard.width = this.m_CardArr[0].GetCardWidth();
            if(this.m_CardArr[0].GetCardHeight) sizeCard.height = this.m_CardArr[0].GetCardHeight();
        }
        return sizeCard;
    },

    SetOutCardTip: function(bShow) {
        if(this.m_OutCardNode) this.m_OutCardNode.active = (this.m_bPositively && bShow);
    },

    SetTingTip: function(cbTingCard) {
        for(var i in this.m_CardArr) {
            this.m_CardArr[i].SetTing(false);
        }
        this.m_cbTingCard = new Array();
        if(!cbTingCard || cbTingCard.length == 0) return;
        this.m_cbTingCard = clone(cbTingCard);
        for(var i in this.m_CardArr) {
            for(var j in cbTingCard) {
                if(this.m_CardArr[i].GetData() == cbTingCard[j]) {
                    this.m_CardArr[i].SetTing(true);
                }
            }
        }
    },

    SetCardCount: function(cbCountIndex, bShow) {
        for(var i = 0; i < GameDef.MAX_INDEX; ++ i) {
            var cbCardData = GameLogic.SwitchToCardData(i);
            for(var j in this.m_CardArr) {
                if(cbCardData == this.m_CardArr[j].GetData()) {
                    this.m_CardArr[j].SetCardCount(cbCountIndex[i], bShow);
                }
            }
        }
    },

    SetXing: function(cbFXCard, cbFXCount){
        this.m_cbFXCard = clone(cbFXCard);
        this.m_cbFXCount = cbFXCount;
    },

    IsXingCard: function(cbCardData) {
        if(!this.m_cbFXCard || this.m_cbFXCount == 0) return false;
        for(var i = 0; i < this.m_cbFXCount; ++ i) {
            if(this.m_cbFXCard[i] == cbCardData) return true;
        }
        return false;
    },
    SetLookModeFun:function(bLookonMode)
    {
        this.m_bLookonMode = bLookonMode;
    }
});
