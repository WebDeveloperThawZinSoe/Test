GameLogic_60014 = new cc.Class({ //window.
    // extends: cc.Component,

    // properties: {
    // },
    ctor: function () {
        this.m_dwRules = 0;
    },

    SetRules: function (dwRules) {
        this.m_dwRules = dwRules;
    },

    //扑克转换
    SwitchToCardData: function (cbCardIndex) {
        ASSERT(cbCardIndex < GameDef.MAX_INDEX, ' In SwitchToCardData CardIndex Wrong');
        return ((parseInt(cbCardIndex / 10)) << 4) | (cbCardIndex % 10 + 1);
    },

    //扑克转换
    SwitchToCardIndex: function (cbCardData) {
        ASSERT(this.IsValidCard(cbCardData), ' In SwitchToCardIndex CardData Invalid [ ' + cbCardData + ' ]');
        return ((cbCardData & GameDef.MASK_COLOR) >> 4) * 10 + (cbCardData & GameDef.MASK_VALUE) - 1;
    },

    //扑克转换
    SwitchToCardData1: function (cbCardIndex, cbCardData, cbMaxCount) {
        //转换扑克
        var cbPosition = 0;
        for (var i = 0; i < GameDef.MAX_INDEX; i++) {
            // var cbIndex = (i % 2) * 10 + parseInt(i / 2);
            var cbIndex = i;
            if (cbCardIndex[cbIndex] != 0) {
                for (var j = 0; j < cbCardIndex[cbIndex]; j++) {
                    ASSERT(cbPosition < cbMaxCount, ' In SwitchToCardData1 cbPosition Wrong (' + cbPosition + ')');
                    cbCardData[cbPosition++] = this.SwitchToCardData(cbIndex);
                }
            }
        }
        return cbPosition;
    },

    //扑克转换
    SwitchToCardIndex1: function (cbCardData, cbCardCount, cbCardIndex) {
        //设置变量
        cbCardIndex.length = GameDef.MAX_INDEX;
        cbCardIndex.fill(0);
        //转换扑克
        for (var i = 0; i < cbCardCount; i++) {
            ASSERT(this.IsValidCard(cbCardData[i]), ' In SwitchToCardIndex1 CardData Invalid ( i = ' + i + ')');
            cbCardIndex[this.SwitchToCardIndex(cbCardData[i])]++;
        }
        return cbCardCount;
    },

    AddIndex: function(cbCardIndex1, cbCardIndex2) {
        for(var i = 0; i < GameDef.MAX_INDEX; ++ i) {
            cbCardIndex1[i] += cbCardIndex2[i];
        }
    },

    //删除扑克
    RemoveCard2: function (cbCardIndex, cbRemoveCard) {
        //效验扑克
        ASSERT(this.IsValidCard(cbRemoveCard), ' In RemoveCard2 RemoveCard Invalid (cbRemoveCard=' + cbRemoveCard + ')');
        var cbRemoveIndex = this.SwitchToCardIndex(cbRemoveCard);
        ASSERT(cbCardIndex[cbRemoveIndex] > 0, ' In RemoveCard2 RemoveIndex Wrong (cbRemoveIndex=' + cbRemoveIndex + ';cbCardIndex[cbRemoveIndex]=' + cbCardIndex[cbRemoveIndex] + ')');
        //删除扑克
        if (cbCardIndex[cbRemoveIndex] <= 0) {
            //失败效验
            ASSERT(false, ' In RemoveCard2 cbCardIndex[cbRemoveIndex] <= 0');
            return false;
        } else {
            cbCardIndex[cbRemoveIndex]--;
            return true;
        }
    },

    //删除扑克
    RemoveCard3: function (cbCardIndex, cbRemoveCard, bRemoveCount) {
        //删除扑克
        for (var i = 0; i < bRemoveCount; i++) {
            //效验扑克
            ASSERT(this.IsValidCard(cbRemoveCard[i]), ' In RemoveCard3 RemoveCard Invalid (i=' + i + ';cbRemoveCard[i]=' + cbRemoveCard[i] + ')');
            var cbRemoveIndex = this.SwitchToCardIndex(cbRemoveCard[i]);
            ASSERT(cbCardIndex[cbRemoveIndex] > 0, ' In RemoveCard3 RemoveIndex Wrong (i=' + i + ';cbRemoveIndex=' + cbRemoveIndex + ';cbCardIndex[cbRemoveIndex]=' + cbCardIndex[cbRemoveIndex] + ')');

            //删除扑克
            if (cbCardIndex[cbRemoveIndex] == 0) {
                //错误断言
                ASSERT(false, ' In RemoveCard3 cbCardIndex[cbRemoveIndex] == 0');
                //还原删除
                for (var j = 0; j < i; j++) {
                    ASSERT(this.IsValidCard(cbRemoveCard[j]), ' In RemoveCard3 RemoveCard Invalid (i=' + i + ';j=' + j + ';cbRemoveCard[j]=' + cbRemoveCard[j] + ')');
                    cbCardIndex[this.SwitchToCardIndex(cbRemoveCard[j])]++;
                }

                return false;
            } else {
                //删除扑克
                --cbCardIndex[cbRemoveIndex];
            }
        }

        return true;
    },
    //删除扑克
    RemoveCard4: function (cbCardData, cbCardCount, cbRemoveCard, cbRemoveCount) {
        //检验数据
        //ASSERT(cbCardCount <= GameDef.MAX_CARD_COUNT, ' In RemoveCard4 cbCardCount <= GameDef.MAX_CARD_COUNT (cbCardCount=' + cbCardCount + ')');
        ASSERT(cbRemoveCount <= cbCardCount, ' In RemoveCard4 cbRemoveCount <= cbCardCount (cbRemoveCount' + cbRemoveCount + ')');

        //定义变量
        var cbDeleteCount = 0;
        var cbTempCardData = new Array(GameDef.MAX_CARD_COUNT);
        if (cbCardCount > cbTempCardData.length) return false;
        cbTempCardData = clone(cbCardData);
        // CopyMemory(cbTempCardData, cbCardData, cbCardCount);

        //置零扑克
        for (var i = 0; i < cbRemoveCount; i++) {
            for (var j = 0; j < cbCardCount; j++) {
                if (cbRemoveCard[i] == cbTempCardData[j]) {
                    cbDeleteCount++;
                    cbTempCardData[j] = 0;
                    break;
                }
            }
        }

        //成功判断
        if (cbDeleteCount != cbRemoveCount) {
            ASSERT(false, ' In RemoveCard4 bDeleteCount != bRemoveCount (bDeleteCount=' + cbDeleteCount + ';bRemoveCount=' + cbRemoveCount + ')');
            return false;
        }

        //清理扑克
        var cbCardPos = 0;
        cbCardData.fill(0);
        for (var i in cbTempCardData) {
            if (cbTempCardData[i] != 0) cbCardData[cbCardPos++] = cbTempCardData[i];
        }
        cbCardData.length = cbCardPos;
        return true;
    },
    ///////////////////////////////////////////////////////////////////////

    // 牌花色
    GetCardColor: function (cbCardData) {
        return ((cbCardData & GameDef.MASK_COLOR) >> 4);
    },

    // 牌数据
    GetCardValue: function (cbCardData) {
        return (cbCardData & GameDef.MASK_VALUE);
    },

    //扑克数目
    GetCardCount: function (cbCardIndex) {
        //数目统计
        var cbCount = 0;
        for (var i = 0; i < GameDef.MAX_INDEX; i++) cbCount += cbCardIndex[i];
        return cbCount;
    },

    //获取胡息
    GetWeaveHuXi: function (WeaveItem) {
        //计算胡息
        switch (WeaveItem.wWeaveKind) {
            case GameDef.ACK_TI: //提
                {
                    return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 12 : 9;
                }
            case GameDef.ACK_PAO: //跑
                {
                    return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 9 : 6;
                }
            case GameDef.ACK_WEI: //偎
                {
                    return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 6 : 3;
                }
            case GameDef.ACK_PENG: //碰
                {
                    return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 3 : 1;
                }
            case GameDef.ACK_CHI: //吃
                {
                    //获取数值
                    var cbValue1 = WeaveItem.cbCardList[0] & GameDef.MASK_VALUE;
                    var cbValue2 = WeaveItem.cbCardList[1] & GameDef.MASK_VALUE;
                    var cbValue3 = WeaveItem.cbCardList[2] & GameDef.MASK_VALUE;
                    //一二三吃
                    if ((cbValue1 == 1) && (cbValue2 == 2) && (cbValue3 == 3)) return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 6 : 3;
                    //二七十吃
                    if ((cbValue1 == 2) && (cbValue2 == 7) && (cbValue3 == 10)) return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 6 : 3;
                    //一五十吃
                    if ((cbValue1 == 1) && (cbValue2 == 5) && (cbValue3 == 10)) return ((WeaveItem.cbCardList[0] & GameDef.MASK_COLOR) == 0x10) ? 6 : 3;
                    return 0;
                }
        }
        return 0;
    },

    //胡牌结果
    GetHuCardInfo: function (cbCardIndex, cbCurrentCard, cbHuXiWeave, HuCardInfo) {
        //变量定义
        // static CAnalyseItemArray AnalyseItemArray;
        var AnalyseItemArray = new Array();

        //构造扑克
        var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
        cbCardIndexTemp = clone(cbCardIndex);
        // CopyMemory(cbCardIndexTemp, cbCardIndex, cbCardIndexTemp.length);

        //设置结果
        // ZeroMemory(&HuCardInfo,sizeof(HuCardInfo));

        //提取碰牌
        if ((cbCurrentCard != 0) && (this.IsWeiPengCard(cbCardIndexTemp, cbCurrentCard) == true)) {

            //判断胡牌
            cbCardIndexTemp[this.SwitchToCardIndex(cbCurrentCard)]++;
            // AnalyseItemArray.RemoveAll();
            if (this.AnalyseCard(cbCardIndexTemp, AnalyseItemArray) == true) {
                //寻找最优
                var cbHuXiCard = 0;
                var nBestItem = -1;
                for (var i = 0; i < AnalyseItemArray.length; i++) {
                    //获取子项
                    // tagAnalyseItem * pAnalyseItem=&AnalyseItemArray[i];
                    var pAnalyseItem = clone(AnalyseItemArray[i]);

                    //胡息分析
                    if (pAnalyseItem.cbHuXiCount >= cbHuXiCard) {
                        nBestItem = i;
                        cbHuXiCard = pAnalyseItem.cbHuXiCount;
                    }
                }
                HuCardInfo.cbHuXiCount += cbHuXiCard;

                //设置结果
                if (nBestItem >= 0) {
                    //获取子项
                    // tagAnalyseItem * pAnalyseItem=&AnalyseItemArray[nBestItem];
                    var pAnalyseItem = clone(AnalyseItemArray[nBestItem]);

                    //设置变量
                    HuCardInfo.cbCardEye = pAnalyseItem.cbCardEye;

                    //设置组合
                    for (var i = 0; i < pAnalyseItem.cbWeaveCount; i++) {
                        var cbIndex = HuCardInfo.cbWeaveCount++;
                        HuCardInfo.WeaveItemArray[cbIndex] = pAnalyseItem.WeaveItemArray[i];
                    }
                }
                if ((HuCardInfo.cbHuXiCount + cbHuXiWeave) >= 15) return true;
            }

            //构造组合
            var cbIndex = HuCardInfo.cbWeaveCount++;
            HuCardInfo.WeaveItemArray[cbIndex].cbCardCount = 3;
            HuCardInfo.WeaveItemArray[cbIndex].wWeaveKind = GameDef.ACK_PENG;
            HuCardInfo.WeaveItemArray[cbIndex].cbCenterCard = cbCurrentCard;
            HuCardInfo.WeaveItemArray[cbIndex].cbCardList[0] = cbCurrentCard;
            HuCardInfo.WeaveItemArray[cbIndex].cbCardList[1] = cbCurrentCard;
            HuCardInfo.WeaveItemArray[cbIndex].cbCardList[2] = cbCurrentCard;

            //删除扑克
            cbCardIndexTemp[this.SwitchToCardIndex(cbCurrentCard)] = 0;

            //设置胡息
            HuCardInfo.cbHuXiCount += this.GetWeaveHuXi(HuCardInfo.WeaveItemArray[cbIndex]);
        } else if (cbCurrentCard != 0) cbCardIndexTemp[this.SwitchToCardIndex(cbCurrentCard)]++;

        //提取三牌
        for (var i = 0; i < GameDef.INDEX_KING; i++) {
            if (cbCardIndexTemp[i] == 3) {
                //设置扑克
                cbCardIndexTemp[i] = 0;

                //设置组合
                var cbCardData = this.SwitchToCardData(i);
                var cbIndex = HuCardInfo.cbWeaveCount++;
                HuCardInfo.WeaveItemArray[cbIndex].cbCardCount = 3;
                HuCardInfo.WeaveItemArray[cbIndex].wWeaveKind = GameDef.ACK_WEI;
                HuCardInfo.WeaveItemArray[cbIndex].cbCenterCard = cbCardData;
                HuCardInfo.WeaveItemArray[cbIndex].cbCardList[0] = cbCardData;
                HuCardInfo.WeaveItemArray[cbIndex].cbCardList[1] = cbCardData;
                HuCardInfo.WeaveItemArray[cbIndex].cbCardList[2] = cbCardData;

                //设置胡息
                HuCardInfo.cbHuXiCount += this.GetWeaveHuXi(HuCardInfo.WeaveItemArray[cbIndex]);
            }
        }

        //分析扑克
        AnalyseItemArray = new Array();
        if (this.AnalyseCard(cbCardIndexTemp, AnalyseItemArray) == false) return false;

        //寻找最优
        var cbHuXiCard = 0;
        var nBestItem = -1;
        for (var i = 0; i < AnalyseItemArray.length; i++) {
            //获取子项
            // tagAnalyseItem * pAnalyseItem=&AnalyseItemArray[i];
            var pAnalyseItem = clone(AnalyseItemArray[i]);

            //胡息分析
            if (pAnalyseItem.cbHuXiCount >= cbHuXiCard) {
                nBestItem = i;
                cbHuXiCard = pAnalyseItem.cbHuXiCount;
            }
        }
        HuCardInfo.cbHuXiCount += cbHuXiCard;

        //设置结果
        if (nBestItem >= 0) {
            //获取子项
            // tagAnalyseItem * pAnalyseItem=&AnalyseItemArray[nBestItem];
            var pAnalyseItem = clone(AnalyseItemArray[nBestItem]);

            //设置变量
            HuCardInfo.cbCardEye = pAnalyseItem.cbCardEye;

            //设置组合
            for (var i = 0; i < pAnalyseItem.cbWeaveCount; i++) {
                var cbIndex = HuCardInfo.cbWeaveCount++;
                HuCardInfo.WeaveItemArray[cbIndex] = pAnalyseItem.WeaveItemArray[i];
            }
        }

        return ((HuCardInfo.cbHuXiCount + cbHuXiWeave) >= 15);
    },

    ///////////////////////////////////////////////////////////////////////

    //提牌判断
    GetAcitonTiCard: function (cbCardIndex, cbTiCardIndex) {
        //提牌搜索
        var cbTiCardCount = 0;
        for (var i = 0; i < GameDef.MAX_INDEX; i++) {
            if (cbCardIndex[i] == 4) cbTiCardIndex[cbTiCardCount++] = i;
        }

        return cbTiCardCount;
    },

    //畏牌判断
    GetActionWeiCard: function (cbCardIndex, cbWeiCardIndex) {
        //畏牌搜索
        var cbWeiCardCount = 0;
        for (var i = 0; i < GameDef.MAX_INDEX; i++) {
            if (cbCardIndex[i] == 3) cbWeiCardIndex[cbWeiCardCount++] = i;
        }

        return cbWeiCardCount;
    },

    //吃牌判断
    GetActionChiCard: function (cbCardIndex, cbCurrentCard, ChiCardInfo) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In GetActionChiCard cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return 0;

        //变量定义
        var cbChiCardCount = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);

        //三牌判断
        if (cbCardIndex[cbCurrentIndex] >= 3) return cbChiCardCount;

        //大小搭吃
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        if ((cbCardIndex[cbCurrentIndex] >= 1) && (cbCardIndex[cbReverseIndex] >= 1) && (cbCardIndex[cbReverseIndex] != 3)) {
            //构造扑克
            var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbCurrentIndex]--;
            cbCardIndexTemp[cbReverseIndex]--;
            //提取判断
            var cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbCurrentIndex]--;
            cbCardIndexTemp[cbReverseIndex]--;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbCurrentIndex]--;
            cbCardIndexTemp[cbReverseIndex]--;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi2(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbCurrentIndex]--;
            cbCardIndexTemp[cbReverseIndex]--;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_2_7_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbCurrentIndex]--;
            cbCardIndexTemp[cbReverseIndex]--;
            while (GameDef.IsAllow1_5_10(this.m_dwRules) && cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_1_5_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            var cbLineExcursion = [ 0, 1, 2 ];
            for (var m = 0; m < 3; ++m) {
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                cbCardIndexTemp[cbCurrentIndex]--;
                cbCardIndexTemp[cbReverseIndex]--;
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Line(cbCardIndexTemp, cbCurrentCard, cbLineExcursion[m], pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
            }

            //设置结果
            // if (cbCardIndexTemp[cbCurrentIndex] == 0) {
                ChiCardInfo[cbChiCardCount].cbCenterCard = cbCurrentCard;
                ChiCardInfo[cbChiCardCount].cbResultCount = cbResultCount;
                ChiCardInfo[cbChiCardCount].cbCardData[0][0] = cbCurrentCard;
                ChiCardInfo[cbChiCardCount].cbCardData[0][1] = cbCurrentCard;
                ChiCardInfo[cbChiCardCount].cbCardData[0][2] = this.SwitchToCardData(cbReverseIndex);
                ChiCardInfo[cbChiCardCount++].cbChiKind[0] = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XXD : GameDef.CK_XDD;
            // }
        }

        //大小搭吃
        if (cbCardIndex[cbReverseIndex] == 2) {
            //构造扑克
            var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbReverseIndex] -= 2;
            //提取判断
            var cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbReverseIndex] -= 2;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbReverseIndex] -= 2;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi2(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbReverseIndex] -= 2;
            while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_2_7_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            // cbResultCount = 1;
            cbCardIndexTemp = clone(cbCardIndex);
            cbCardIndexTemp[cbReverseIndex] -= 2;
            while (GameDef.IsAllow1_5_10(this.m_dwRules) && cbCardIndexTemp[cbCurrentIndex] > 0) {
                var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_1_5_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                else break;
            }
            //提取判断
            var cbLineExcursion = [ 0, 1, 2 ];
            for (var m = 0; m < 3; ++m) {
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                cbCardIndexTemp[cbReverseIndex] -= 2;
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Line(cbCardIndexTemp, cbCurrentCard, cbLineExcursion[m], pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
            }

            //设置结果
            // if (cbCardIndexTemp[cbCurrentIndex] == 0) {
                ChiCardInfo[cbChiCardCount].cbCenterCard = cbCurrentCard;
                ChiCardInfo[cbChiCardCount].cbResultCount = cbResultCount;
                ChiCardInfo[cbChiCardCount].cbCardData[0][0] = cbCurrentCard;
                ChiCardInfo[cbChiCardCount].cbCardData[0][1] = this.SwitchToCardData(cbReverseIndex);
                ChiCardInfo[cbChiCardCount].cbCardData[0][2] = this.SwitchToCardData(cbReverseIndex);
                ChiCardInfo[cbChiCardCount++].cbChiKind[0] = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XDD : GameDef.CK_XXD;
            // }
        }

        //二七十吃
        var bCardValue = cbCurrentCard & GameDef.MASK_VALUE;
        if ((bCardValue == 0x02) || (bCardValue == 0x07) || (bCardValue == 0x0A)) {
            //变量定义
            var cbExcursion = [1, 6, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;

            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbIndex != cbCurrentIndex) && ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3))) break;
            }

            //提取判断
            if (i == cbExcursion.length) {
                //构造扑克
                var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                //提取判断
                var cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi2(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_2_7_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (GameDef.IsAllow1_5_10(this.m_dwRules) && cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_1_5_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                var cbLineExcursion = [ 0, 1, 2 ];
                for (var m = 0; m < 3; ++m) {
                    // cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < cbExcursion.length; j++) {
                        var cbIndex = cbInceptIndex + cbExcursion[j];
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Line(cbCardIndexTemp, cbCurrentCard, cbLineExcursion[m], pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                }
                //设置结果
                // if (cbCardIndexTemp[cbCurrentIndex] == 0) {
                    ChiCardInfo[cbChiCardCount].cbCenterCard = cbCurrentCard;
                    ChiCardInfo[cbChiCardCount].cbResultCount = cbResultCount;
                    ChiCardInfo[cbChiCardCount].cbCardData[0][0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                    ChiCardInfo[cbChiCardCount].cbCardData[0][1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                    ChiCardInfo[cbChiCardCount].cbCardData[0][2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                    ChiCardInfo[cbChiCardCount++].cbChiKind[0] = GameDef.CK_2_7_10;
                // }
            }
        }
        //一五十吃
        var bCardValue = cbCurrentCard & GameDef.MASK_VALUE;
        if ((GameDef.IsAllow1_5_10(this.m_dwRules)) && ((bCardValue == 0x01) || (bCardValue == 0x05) || (bCardValue == 0x0A))) {
            //变量定义
            var cbExcursion = [0, 4, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;

            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbIndex != cbCurrentIndex) && ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3))) break;
            }

            //提取判断
            if (i == cbExcursion.length) {
                //构造扑克
                var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                //提取判断
                var cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi2(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_2_7_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                // cbResultCount = 1;
                cbCardIndexTemp = clone(cbCardIndex);
                for (var j = 0; j < cbExcursion.length; j++) {
                    var cbIndex = cbInceptIndex + cbExcursion[j];
                    if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                }
                while (GameDef.IsAllow1_5_10(this.m_dwRules) && cbCardIndexTemp[cbCurrentIndex] > 0) {
                    var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                    ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_1_5_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                    if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                    else break;
                }
                //提取判断
                var cbLineExcursion = [ 0, 1, 2 ];
                for (var m = 0; m < 3; ++m) {
                    // cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < cbExcursion.length; j++) {
                        var cbIndex = cbInceptIndex + cbExcursion[j];
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Line(cbCardIndexTemp, cbCurrentCard, cbLineExcursion[m], pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                }

                //设置结果
                // if (cbCardIndexTemp[cbCurrentIndex] == 0) {
                    ChiCardInfo[cbChiCardCount].cbCenterCard = cbCurrentCard;
                    ChiCardInfo[cbChiCardCount].cbResultCount = cbResultCount;
                    ChiCardInfo[cbChiCardCount].cbCardData[0][0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                    ChiCardInfo[cbChiCardCount].cbCardData[0][1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                    ChiCardInfo[cbChiCardCount].cbCardData[0][2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                    ChiCardInfo[cbChiCardCount++].cbChiKind[0] = GameDef.CK_1_5_10;
                // }
            }
        }

        //顺子类型
        var cbExcursion = [0, 1, 2];
        for (var i = 0; i < cbExcursion.length; i++) {
            var cbValueIndex = cbCurrentIndex % 10;
            if ((cbValueIndex >= cbExcursion[i]) && ((cbValueIndex - cbExcursion[i]) <= 7)) {
                //索引定义
                var cbFirstIndex = cbCurrentIndex - cbExcursion[i];
                //吃牌判断
                var j = 0;
                for (j = 0; j < 3; j++) {
                    var cbIndex = cbFirstIndex + j;
                    if ((cbIndex != cbCurrentIndex) && ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3))) break;
                }
                //提取判断
                if (j == cbExcursion.length) {
                    //构造扑克
                    var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < 3; j++) {
                        var cbIndex = cbFirstIndex + j;
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    //提取判断
                    var cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < 3; j++) {
                        var cbIndex = cbFirstIndex + j;
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi(cbCardIndexTemp, cbCurrentCard, pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                    //提取判断
                    // cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < 3; j++) {
                        var cbIndex = cbFirstIndex + j;
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Dazi2(cbCardIndexTemp, cbCurrentCard, pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                    //提取判断
                    // cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < 3; j++) {
                        var cbIndex = cbFirstIndex + j;
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_2_7_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                    //提取判断
                    // cbResultCount = 1;
                    cbCardIndexTemp = clone(cbCardIndex);
                    for (var j = 0; j < 3; j++) {
                        var cbIndex = cbFirstIndex + j;
                        if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                    }
                    while (GameDef.IsAllow1_5_10(this.m_dwRules) && cbCardIndexTemp[cbCurrentIndex] > 0) {
                        var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                        ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_1_5_10(cbCardIndexTemp, cbCurrentCard, pcbResult);
                        if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                        else break;
                    }
                    //提取判断
                    var cbLineExcursion = [ 0, 1, 2 ];
                    for (var m = 0; m < 3; ++m) {
                        // cbResultCount = 1;
                        cbCardIndexTemp = clone(cbCardIndex);
                        for (var j = 0; j < 3; j++) {
                            var cbIndex = cbFirstIndex + j;
                            if (cbIndex != cbCurrentIndex) cbCardIndexTemp[cbIndex]--;
                        }
                        while (cbCardIndexTemp[cbCurrentIndex] > 0) {
                            var pcbResult = ChiCardInfo[cbChiCardCount].cbCardData[cbResultCount];
                            ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount] = this.TakeOutChiCard_Line(cbCardIndexTemp, cbCurrentCard, cbLineExcursion[m], pcbResult);
                            if(ChiCardInfo[cbChiCardCount].cbChiKind[cbResultCount]!= GameDef.CK_NULL) cbResultCount++;
                            else break;
                        }
                    }

                    //设置结果
                    // if (cbCardIndexTemp[cbCurrentIndex] == 0) {
                        var cbChiKind = [GameDef.CK_LEFT, GameDef.CK_CENTER, GameDef.CK_RIGHT];
                        ChiCardInfo[cbChiCardCount].cbCenterCard = cbCurrentCard;
                        ChiCardInfo[cbChiCardCount].cbResultCount = cbResultCount;
                        ChiCardInfo[cbChiCardCount].cbCardData[0][0] = this.SwitchToCardData(cbFirstIndex);
                        ChiCardInfo[cbChiCardCount].cbCardData[0][1] = this.SwitchToCardData(cbFirstIndex + 1);
                        ChiCardInfo[cbChiCardCount].cbCardData[0][2] = this.SwitchToCardData(cbFirstIndex + 2);
                        ChiCardInfo[cbChiCardCount++].cbChiKind[0] = cbChiKind[i];
                    // }
                }
            }
        }
        // 校验
        for(var i = 0; i < cbChiCardCount; ++ i) {
            var cbCurCnt = 0;
            cbCurCnt += this.GetCardCountByData(ChiCardInfo[i].cbCardData[0], 3, cbCurrentCard);
            for(var j = 1; j < ChiCardInfo[i].cbResultCount; ++ j) {
                cbCurCnt += (this.GetCardCountByData(ChiCardInfo[i].cbCardData[j], 3, cbCurrentCard));
            }
            if(cbCardIndex[cbCurrentIndex] == 0) ChiCardInfo[i].bValid = true;
            else if(cbCurCnt > cbCardIndex[cbCurrentIndex]) ChiCardInfo[i].bValid = true;
            else ChiCardInfo[i].bValid = false;
        }

        return cbChiCardCount;
    },

    ///////////////////////////////////////////////////////////////////////
    //有效判断
    IsValidCard: function (cbCardData) {
        var cbColor = this.GetCardColor(cbCardData);
        var cbValue = this.GetCardValue(cbCardData);
        return ((cbValue >= 1) && (cbValue <= 10) && (cbColor <= 2));
    },

    //有效判断
    IsValidIndex: function (cbCardIndex) {
        if(cbCardIndex < 0 || cbCardIndex >= GameDef.MAX_INDEX) return false;
        return true;
    },

    //是否吃牌
    IsChiCard: function (cbCardIndex, cbCurrentCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In IsChiCard cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return false;

        //构造扑克
        var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
        cbCardIndexTemp = clone(cbCardIndex);
        // CopyMemory(cbCardIndexTemp, cbCardIndex, cbCardIndexTemp.length);

        //插入扑克
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        cbCardIndexTemp[cbCurrentIndex]++;

        //提取判断
        while (cbCardIndexTemp[cbCurrentIndex] > 0) {
            var cbResult = new Array(3);
            if (this.TakeOutChiCard(cbCardIndexTemp, cbCurrentCard, cbResult) == GameDef.CK_NULL) break;
        }

        return (cbCardIndexTemp[cbCurrentIndex] == 0);
    },

    //是否提跑
    IsTiPaoCard: function (cbCardIndex, cbCurrentCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In IsTiPaoCard cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return false;

        //转换索引
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);

        //碰牌判断
        return (cbCardIndex[cbCurrentIndex] == 3) ? true : false;
    },

    //是否偎碰
    IsWeiPengCard: function (cbCardIndex, cbCurrentCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In IsWeiPengCard cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return false;

        //转换索引
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);

        //跑偎判断
        return (cbCardIndex[cbCurrentIndex] == 2) ? true : false;
    },

    ///////////////////////////////////////////////////////////////////////

    //分析扑克
    AnalyseCard: function (cbCardIndex, AnalyseItemArray) {
        //变量定义
        var cbWeaveItemCount = 0;
        var WeaveItem = new Array(76);
        for (var i = 0; i < WeaveItem.length; ++i) WeaveItem = new GameDef.tagWeaveItem();

        //数目统计
        var cbCardCount = this.GetCardCount(cbCardIndex);

        //数目判断
        if (cbCardCount == 0) return true;
        if ((cbCardCount % 3 != 0) && ((cbCardCount + 1) % 3 != 0)) return false;

        //需求计算
        var cbLessWeavItem = parseInt(cbCardCount / 3);
        var bNeedCardEye = ((cbCardCount + 1) % 3 == 0);

        //单吊判断
        if ((cbLessWeavItem == 0) && (bNeedCardEye == true)) {
            //牌眼判断
            for (var i = 0; i < GameDef.INDEX_KING; i++) {
                if (cbCardIndex[i] == 2) {
                    //变量定义
                    var AnalyseItem = GameDef.tagAnalyseItem();
                    // ZeroMemory(&AnalyseItem,sizeof(AnalyseItem));

                    //设置结果
                    AnalyseItem.cbHuXiCount = 0;
                    AnalyseItem.cbWeaveCount = 0;
                    AnalyseItem.cbCardEye = this.SwitchToCardData(i);

                    //插入结果
                    AnalyseItemArray.push(AnalyseItem);
                    return true;
                }
            }
            return false;
        }

        //拆分处理
        for (var i = 0; i < GameDef.INDEX_KING; i++) {
            //分析过虑
            if (cbCardIndex[i] == 0) continue;

            //变量定义
            var cbCardData = this.SwitchToCardData(i);

            //大小搭吃
            if ((cbCardIndex[i] == 2) && (cbCardIndex[(i + 10) % GameDef.INDEX_KING] >= 1)) {
                WeaveItem[cbWeaveItemCount].cbCardCount = 3;
                WeaveItem[cbWeaveItemCount].wWeaveKind = GameDef.ACK_CHI;
                WeaveItem[cbWeaveItemCount].cbCenterCard = cbCardData;
                WeaveItem[cbWeaveItemCount].cbCardList[0] = cbCardData;
                WeaveItem[cbWeaveItemCount].cbCardList[1] = cbCardData;
                WeaveItem[cbWeaveItemCount++].cbCardList[2] = (cbCardData + 16) % 32;
            }

            //大小搭吃
            if ((cbCardIndex[i] >= 1) && (cbCardIndex[(i + 10) % GameDef.INDEX_KING] == 2)) {
                WeaveItem[cbWeaveItemCount].cbCardCount = 3;
                WeaveItem[cbWeaveItemCount].wWeaveKind = GameDef.ACK_CHI;
                WeaveItem[cbWeaveItemCount].cbCenterCard = cbCardData;
                WeaveItem[cbWeaveItemCount].cbCardList[0] = cbCardData;
                WeaveItem[cbWeaveItemCount].cbCardList[1] = (cbCardData + 16) % 32;
                WeaveItem[cbWeaveItemCount++].cbCardList[2] = (cbCardData + 16) % 32;
            }

            //二七十吃
            if ((cbCardData & GameDef.MASK_VALUE) == 0x02) {
                for (var j = 1; j <= cbCardIndex[i]; j++) {
                    if ((cbCardIndex[i + 5] >= j) && (cbCardIndex[i + 8] >= j)) {
                        WeaveItem[cbWeaveItemCount].cbCardCount = 3;
                        WeaveItem[cbWeaveItemCount].wWeaveKind = GameDef.ACK_CHI;
                        WeaveItem[cbWeaveItemCount].cbCenterCard = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[0] = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[1] = cbCardData + 5;
                        WeaveItem[cbWeaveItemCount++].cbCardList[2] = cbCardData + 8;
                    }
                }
            }

            //一五十吃
            if (GameDef.IsAllow1_5_10(this.m_dwRules) && (cbCardData & GameDef.MASK_VALUE) == 0x01) {
                for (var j = 1; j <= cbCardIndex[i]; j++) {
                    if ((cbCardIndex[i + 4] >= j) && (cbCardIndex[i + 9] >= j)) {
                        WeaveItem[cbWeaveItemCount].cbCardCount = 3;
                        WeaveItem[cbWeaveItemCount].wWeaveKind = GameDef.ACK_CHI;
                        WeaveItem[cbWeaveItemCount].cbCenterCard = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[0] = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[1] = cbCardData + 4;
                        WeaveItem[cbWeaveItemCount++].cbCardList[2] = cbCardData + 9;
                    }
                }
            }

            //顺子判断
            if ((i < (GameDef.INDEX_KING - 2)) && (cbCardIndex[i] > 0) && ((i % 10) <= 7)) {
                for (var j = 1; j <= cbCardIndex[i]; j++) {
                    if ((cbCardIndex[i + 1] >= j) && (cbCardIndex[i + 2] >= j)) {
                        WeaveItem[cbWeaveItemCount].cbCardCount = 3;
                        WeaveItem[cbWeaveItemCount].wWeaveKind = GameDef.ACK_CHI;
                        WeaveItem[cbWeaveItemCount].cbCenterCard = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[0] = cbCardData;
                        WeaveItem[cbWeaveItemCount].cbCardList[1] = cbCardData + 1;
                        WeaveItem[cbWeaveItemCount++].cbCardList[2] = cbCardData + 2;
                    }
                }
            }
        }

        //组合分析
        if (cbWeaveItemCount >= bLessWeavItem) {
            //变量定义
            var cbCardIndexTemp = new Array(GameDef.MAX_INDEX);
            cbCardIndexTemp.fill(0);

            //变量定义
            var cbIndex = [0, 1, 2, 3, 4, 5, 6];
            // tagWeaveItem * pWeaveItem[CountArray(cbIndex)];
            var pWeaveItem = new Array(cbIndex.length);
            for (var i = 0; i < cbIndex.length; ++i) pWeaveItem[i] = new Array(tagWeaveItem);

            //开始组合
            do {
                //设置变量
                cbCardIndexTemp = clone(cbCardIndex);
                // CopyMemory(cbCardIndexTemp, cbCardIndex, cbCardIndexTemp.length);
                // for (var i=0;i<bLessWeavItem;i++) pWeaveItem[i] = &WeaveItem[cbIndex[i]];
                for (var i = 0; i < bLessWeavItem; i++) pWeaveItem[i] = clone(WeaveItem[cbIndex[i]]);
                //数量判断
                var bEnoughCard = true;
                for (var i = 0; i < bLessWeavItem * 3; i++) {
                    //存在判断
                    // var cbIndex=this.SwitchToCardIndex(pWeaveItem[i/3]->cbCardList[i%3]);
                    var cbIndex = this.SwitchToCardIndex(pWeaveItem[parseInt(i / 3)].cbCardList[i % 3]);

                    if (cbCardIndexTemp[cbIndex] == 0) {
                        bEnoughCard = false;
                        break;
                    } else cbCardIndexTemp[cbIndex]--;
                }

                //胡牌判断
                if (bEnoughCard == true) {
                    //牌眼判断
                    var cbCardEye = 0;
                    if (bNeedCardEye == true) {
                        for (var i = 0; i < GameDef.INDEX_KING; i++) {
                            if (cbCardIndexTemp[i] == 2) {
                                cbCardEye = this.SwitchToCardData(i);
                                break;
                            }
                        }
                    }

                    //组合类型
                    if ((bNeedCardEye == false) || (cbCardEye != 0)) {
                        //变量定义
                        var AnalyseItem = GameDef.tagAnalyseItem();
                        // ZeroMemory( & AnalyseItem, sizeof(AnalyseItem));

                        //设置结果
                        AnalyseItem.cbHuXiCount = 0;
                        AnalyseItem.cbCardEye = cbCardEye;
                        AnalyseItem.cbWeaveCount = bLessWeavItem;

                        //设置组合
                        for (var i = 0; i < bLessWeavItem; i++) {
                            // AnalyseItem.WeaveItemArray[i] = * pWeaveItem[i];
                            AnalyseItem.WeaveItemArray[i] = clone(pWeaveItem[i]);

                            AnalyseItem.cbHuXiCount += this.GetWeaveHuXi(AnalyseItem.WeaveItemArray[i]);
                        }

                        //插入结果
                        AnalyseItemArray.push(AnalyseItem);
                    }
                }

                //设置索引
                if (cbIndex[bLessWeavItem - 1] == (cbWeaveItemCount - 1)) {
                    var i = bLessWeavItem - 1;
                    for (i = bLessWeavItem - 1; i > 0; i--) {
                        if ((cbIndex[i - 1] + 1) != cbIndex[i]) {
                            var cbNewIndex = cbIndex[i - 1];
                            for (var j = (i - 1); j < bLessWeavItem; j++) cbIndex[j] = cbNewIndex + j - i + 2;
                            break;
                        }
                    }
                    if (i == 0) break;
                } else cbIndex[bLessWeavItem - 1]++;

            } while (true);

            return (AnalyseItemArray.length > 0);
        }

        return false;
    },
    //提取吃牌
    TakeOutChiCard1: function (cbCardIndex, cbCurrentCard, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return 0;

        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);

        //大小搭吃
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        if ((cbCardIndex[cbCurrentIndex] >= 2) && (cbCardIndex[cbReverseIndex] >= 1) && (cbCardIndex[cbReverseIndex] != 3)) {
            //删除扑克
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbReverseIndex]--;

            //设置结果
            cbResultCard[0] = cbCurrentCard;
            cbResultCard[1] = cbCurrentCard;
            cbResultCard[2] = this.SwitchToCardData(cbReverseIndex);

            return ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XXD : GameDef.CK_XDD;
        }

        //大小搭吃
        if (cbCardIndex[cbReverseIndex] == 2) {
            //删除扑克
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbReverseIndex] -= 2;

            //设置结果
            cbResultCard[0] = cbCurrentCard;
            cbResultCard[1] = this.SwitchToCardData(cbReverseIndex);
            cbResultCard[2] = this.SwitchToCardData(cbReverseIndex);

            return ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XDD : GameDef.CK_XXD;
        }

        //二七十吃
        var bCardValue = (cbCurrentCard & GameDef.MASK_VALUE);
        if ((bCardValue == 0x02) || (bCardValue == 0x07) || (bCardValue == 0x0A)) {
            //变量定义
            var cbExcursion = [1, 6, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;

            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3)) break;
            }

            //成功判断
            if (i == cbExcursion.length) {
                //删除扑克
                cbCardIndex[cbInceptIndex + cbExcursion[0]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[1]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[2]]--;

                //设置结果
                cbResultCard[0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                cbResultCard[1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                cbResultCard[2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                return GameDef.CK_2_7_10;
            }
        }

        //一五十吃
        var bCardValue = (cbCurrentCard & GameDef.MASK_VALUE);
        if (GameDef.IsAllow1_5_10(this.m_dwRules) && ((bCardValue == 0x01) || (bCardValue == 0x05) || (bCardValue == 0x0A))) {
            //变量定义
            var cbExcursion = [0, 4, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;

            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3)) break;
            }

            //成功判断
            if (i == cbExcursion.length) {
                //删除扑克
                cbCardIndex[cbInceptIndex + cbExcursion[0]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[1]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[2]]--;

                //设置结果
                cbResultCard[0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                cbResultCard[1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                cbResultCard[2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                return GameDef.CK_1_5_10;
            }
        }

        //顺子判断
        var cbExcursion = [0, 1, 2];
        for (var i = 0; i < cbExcursion.length; i++) {
            var cbValueIndex = cbCurrentIndex % 10;
            if ((cbValueIndex >= cbExcursion[i]) && ((cbValueIndex - cbExcursion[i]) <= 7)) {
                //吃牌判断
                cbFirstIndex = cbCurrentIndex - cbExcursion[i];
                if ((cbCardIndex[cbFirstIndex] == 0) || (cbCardIndex[cbFirstIndex] == 3)) continue;
                if ((cbCardIndex[cbFirstIndex + 1] == 0) || (cbCardIndex[cbFirstIndex + 1] == 3)) continue;
                if ((cbCardIndex[cbFirstIndex + 2] == 0) || (cbCardIndex[cbFirstIndex + 2] == 3)) continue;

                //删除扑克
                cbCardIndex[cbFirstIndex]--;
                cbCardIndex[cbFirstIndex + 1]--;
                cbCardIndex[cbFirstIndex + 2]--;

                //设置结果
                cbResultCard[0] = this.SwitchToCardData(cbFirstIndex);
                cbResultCard[1] = this.SwitchToCardData(cbFirstIndex + 1);
                cbResultCard[2] = this.SwitchToCardData(cbFirstIndex + 2);

                var cbChiKind = [GameDef.CK_LEFT, GameDef.CK_CENTER, GameDef.CK_RIGHT];
                return cbChiKind[i];
            }
        }

        return GameDef.CK_NULL;
    },

    /////////////////////////////////////////////////////////////////////
    SortCardList: function (cbCardIndex) {
        var cbTempCardIndex = new Array();
        cbTempCardIndex = clone(cbCardIndex);

        var cbCardData = new Array();
        for (var i = 0; i < GameDef.MAX_INDEX; ++i) {
            if (cbTempCardIndex[i] >= 3) {
                var cbTemp = new Array();
                var cbData = this.SwitchToCardData(i);
                cbTemp[0] = cbTemp[1] = cbTemp[2] = cbData;
                if(cbTempCardIndex[i] == 4) cbTemp[3] = cbData;
                cbCardData.push(cbTemp);
                cbTempCardIndex[i] = 0;
            }
        }

        /* var cbCount = this.GetEQS(cbTempCardIndex, cbCardData);
        for(var i = 0; i < cbCount; ++ i) {
            this.RemoveCard3(cbTempCardIndex, cbCardData[cbCardData.length - i - 1], 3);
        } */

        // 二七十
        while (true) {
            var cb2_7_10 = this.Search2_7_10(cbTempCardIndex);
            if (!cb2_7_10) break;
            for (var i = 0; i < cb2_7_10.length; ++i) {
                var cbTempIndex = this.SwitchToCardIndex(cb2_7_10[i]);
                --cbTempCardIndex[cbTempIndex];
            }
            cbCardData.push(cb2_7_10);
        }

        // 一五十
        if(GameDef.IsAllow1_5_10(this.m_dwRules)) {
            while (true) {
                var cb1_5_10 = this.Search1_5_10(cbTempCardIndex);
                if (!cb1_5_10) break;
                for (var i = 0; i < cb1_5_10.length; ++i) {
                    var cbTempIndex = this.SwitchToCardIndex(cb1_5_10[i]);
                    --cbTempCardIndex[cbTempIndex];
                }
                cbCardData.push(cb1_5_10);
            }
        }

        // 搭子
        while (true) {
            var cbDazi = this.SearchDazi(cbTempCardIndex);
            if (!cbDazi) break;
            for (var i = 0; i < cbDazi.length; ++i) {
                var cbTempIndex = this.SwitchToCardIndex(cbDazi[i]);
                --cbTempCardIndex[cbTempIndex];
            }
            cbCardData.push(cbDazi);
        }

        // 顺子
        while (true) {
            var cbLine = this.SearchLine(cbTempCardIndex);
            if (!cbLine) break;
            for (var i = 0; i < cbLine.length; ++i) {
                var cbTempIndex = this.SwitchToCardIndex(cbLine[i]);
                --cbTempCardIndex[cbTempIndex];
            }
            cbCardData.push(cbLine);
        }

        // 对子
        for (var i = 0; i < GameDef.MAX_INDEX; ++i) {
            if (cbTempCardIndex[i] >= 2) {
                var cbTemp = new Array();
                var cbData = this.SwitchToCardData(i);
                cbTemp[0] = cbTemp[1] = cbData;
                cbCardData.push(cbTemp);
                cbTempCardIndex[i] = 0;
            }
        }


        // 相似
        while (true) {
            var cbLike = this.SearchLike(cbTempCardIndex);
            if (!cbLike) break;
            for (var i = 0; i < cbLike.length; ++i) {
                var cbTempIndex = this.SwitchToCardIndex(cbLike[i]);
                --cbTempCardIndex[cbTempIndex];
            }
            cbCardData.push(cbLike);
        }
        // for (var i = 0; i < GameDef.MAX_INDEX; ++i) {
        //     var cbTemp = new Array();
        //     for (var j = 0; j < cbTempCardIndex[i]; ++j) {
        //         cbTemp[j] = this.SwitchToCardData(i);
        //     }
        //     if (cbTemp.length > 0) cbCardData.push(cbTemp);
        // }
        return cbCardData;
    },

    //二七十
    Search2_7_10: function (cbCardIndex) {
        var cbExcursion = [1, 6, 9];
        if ((cbCardIndex[cbExcursion[0]] > 0 && cbCardIndex[cbExcursion[1]] > 0 && cbCardIndex[cbExcursion[2]] > 0)) {
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
            cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
            cbCardData[2] = this.SwitchToCardData(cbExcursion[2]);
            return cbCardData;
        }
        cbExcursion = [11, 16, 19]
        if ((cbCardIndex[cbExcursion[0]] > 0 && cbCardIndex[cbExcursion[1]] > 0 && cbCardIndex[cbExcursion[2]] > 0)) {
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
            cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
            cbCardData[2] = this.SwitchToCardData(cbExcursion[2]);
            return cbCardData;
        }

        return null;
    },
    //一五十
    Search1_5_10: function (cbCardIndex) {
        var cbExcursion = [0, 4, 9];
        if ((cbCardIndex[cbExcursion[0]] > 0 && cbCardIndex[cbExcursion[1]] > 0 && cbCardIndex[cbExcursion[2]] > 0)) {
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
            cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
            cbCardData[2] = this.SwitchToCardData(cbExcursion[2]);
            return cbCardData;
        }
        cbExcursion = [10, 14, 19]
        if ((cbCardIndex[cbExcursion[0]] > 0 && cbCardIndex[cbExcursion[1]] > 0 && cbCardIndex[cbExcursion[2]] > 0)) {
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
            cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
            cbCardData[2] = this.SwitchToCardData(cbExcursion[2]);
            return cbCardData;
        }
        return null;
    },
    // 搭子
    SearchDazi: function (cbCardIndex) {
        for (var i = 0; i < 10; ++i) {
            var cbReverseIndex = (i + 10) % GameDef.INDEX_KING;
            if (cbCardIndex[i] < 1 || cbReverseIndex < 1 || cbCardIndex[i] > 2 || cbCardIndex[cbReverseIndex] > 2) continue;
            var cbCardData = new Array();
            if (cbCardIndex[i] == 2 && cbCardIndex[cbReverseIndex] == 1) {
                // GameDef.CK_XXD
                cbCardData[0] = this.SwitchToCardData(i);
                cbCardData[1] = this.SwitchToCardData(i);
                cbCardData[2] = this.SwitchToCardData(cbReverseIndex);
                return cbCardData;
            }
            if (cbCardIndex[i] == 1 && cbCardIndex[cbReverseIndex] == 2) {
                // GameDef.CK_XDD
                cbCardData[0] = this.SwitchToCardData(i);
                cbCardData[1] = this.SwitchToCardData(cbReverseIndex);
                cbCardData[2] = this.SwitchToCardData(cbReverseIndex);
                return cbCardData;
            }
        }
        return null;
    },
    SearchLine: function (cbCardIndex) {
        for (var i = 0; i < 10 - 2; ++i) {
            if (cbCardIndex[i] < 1 || cbCardIndex[i] > 2) continue;
            if (cbCardIndex[i + 1] < 1 || cbCardIndex[i + 1] > 2) continue;
            if (cbCardIndex[i + 2] < 1 || cbCardIndex[i + 2] > 2) continue;
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(i);
            cbCardData[1] = this.SwitchToCardData(i + 1);
            cbCardData[2] = this.SwitchToCardData(i + 2);
            return cbCardData;
        }
        for (var i = 10; i < 20 - 2; ++i) {
            if (cbCardIndex[i] < 1 || cbCardIndex[i] > 2) continue;
            if (cbCardIndex[i + 1] < 1 || cbCardIndex[i + 1] > 2) continue;
            if (cbCardIndex[i + 2] < 1 || cbCardIndex[i + 2] > 2) continue;
            var cbCardData = new Array();
            cbCardData[0] = this.SwitchToCardData(i);
            cbCardData[1] = this.SwitchToCardData(i + 1);
            cbCardData[2] = this.SwitchToCardData(i + 2);
            return cbCardData;
        }
        return null;
    },

    SearchLike: function (cbCardIndex) {
        // for(var i = 0; i < GameDef.INDEX_KING; ++ i) {
        //     if(cbCardIndex[i] <= 0) continue;
        //     // 二七十
        //     var cbExcursion = [1, 6, 9];
        //     if(i == cbExcursion[0]) {
        //         if(cbCardIndex[cbExcursion[1]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
        //             return cbCardData;
        //         } else if(cbCardIndex[cbExcursion[2]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[2]);
        //             return cbCardData;
        //         }
        //     }
        //     else if(i == cbExcursion[1]) {
        //         if(cbCardIndex[cbExcursion[2]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[1]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[2]);
        //             return cbCardData;
        //         }
        //     }

        //     // 贰柒拾
        //     cbExcursion = [11, 16, 19];
        //     if(i == cbExcursion[0]) {
        //         if(cbCardIndex[cbExcursion[1]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[1]);
        //             return cbCardData;
        //         } else if(cbCardIndex[cbExcursion[2]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[0]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[2]);
        //             return cbCardData;
        //         }
        //     }
        //     else if(i == cbExcursion[1]) {
        //         if(cbCardIndex[cbExcursion[2]] > 0) {
        //             var cbCardData = new Array();
        //             cbCardData[0] = this.SwitchToCardData(cbExcursion[1]);
        //             cbCardData[1] = this.SwitchToCardData(cbExcursion[2]);
        //             return cbCardData;
        //         }
        //     }
        // }

        for (var i = 0; i < GameDef.MAX_INDEX; ++i) {

            // 搭子
            if (i < 10) {
                var cbReverseIndex = (i + 10) % GameDef.INDEX_KING;
                if (cbCardIndex[i] == 1 && cbCardIndex[cbReverseIndex] == 1) {
                    var cbCardData = new Array();
                    cbCardData[0] = this.SwitchToCardData(i);
                    cbCardData[1] = this.SwitchToCardData(cbReverseIndex);
                    return cbCardData;
                }
            }

            // 顺子
            if((i < 10 - 2) || (i >= 10 &&  i < 20 - 2)) {
                var cbCardData = new Array();
                for(var j = 0; j < 3; ++ j) {
                    if(cbCardIndex[i + j] == 1) {
                        cbCardData.push(this.SwitchToCardData(i + j));
                    }
                }
                if(cbCardData.length == 2) {
                    return cbCardData;
                }
            }

            // 单牌
            if(cbCardIndex[i] > 0) {
                var cbCardData = new Array();
                cbCardData.push(this.SwitchToCardData(i));
                return cbCardData;
            }
        }
        return null;
    },

    SortCardList2: function (cbCardIndex) {
        var cbCardData = new Array();
        for(var i = 0; i < cbCardIndex.length; ++ i) {
            if(cbCardIndex[i] < 1) continue;
            var cbTemp = new Array();
            for(var j = 0 ; j < cbCardIndex[i]; ++ j) {
                cbTemp.push(this.SwitchToCardData(i));
            }
            cbCardData.push(cbTemp);
        }
        return cbCardData;
    },

    ////////////////////////////////////////////////////////////////////////////////////

    //提取吃牌
    TakeOutChiCard_Dazi: function (cbCardIndex, cbCurrentCard, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard_Dazi cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return GameDef.CK_NULL;
        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
         //大小搭吃
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        if ((cbCardIndex[cbCurrentIndex] >= 2) && (cbCardIndex[cbReverseIndex] >= 1) && (cbCardIndex[cbReverseIndex] != 3)) {
            //删除扑克
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbReverseIndex]--;
            //设置结果
            cbResultCard[0] = cbCurrentCard;
            cbResultCard[1] = cbCurrentCard;
            cbResultCard[2] = this.SwitchToCardData(cbReverseIndex);
            return ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XXD : GameDef.CK_XDD;
        }
        return GameDef.CK_NULL;
    },

    //提取吃牌
    TakeOutChiCard_Dazi2: function (cbCardIndex, cbCurrentCard, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard_Dazi cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return GameDef.CK_NULL;
        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        //大小搭吃
        if (cbCardIndex[cbReverseIndex] == 2) {
            //删除扑克
            cbCardIndex[cbCurrentIndex]--;
            cbCardIndex[cbReverseIndex] -= 2;
            //设置结果
            cbResultCard[0] = cbCurrentCard;
            cbResultCard[1] = this.SwitchToCardData(cbReverseIndex);
            cbResultCard[2] = this.SwitchToCardData(cbReverseIndex);
            return ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? GameDef.CK_XDD : GameDef.CK_XXD;
        }
        return GameDef.CK_NULL;
    },
    //提取吃牌
    TakeOutChiCard_2_7_10: function (cbCardIndex, cbCurrentCard, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard_2_7_10 cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return GameDef.CK_NULL;
        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        //二七十吃
        var bCardValue = (cbCurrentCard & GameDef.MASK_VALUE);
        if ((bCardValue == 0x02) || (bCardValue == 0x07) || (bCardValue == 0x0A)) {
            //变量定义
            var cbExcursion = [1, 6, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;
            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3)) break;
            }
            //成功判断
            if (i == cbExcursion.length) {
                //删除扑克
                cbCardIndex[cbInceptIndex + cbExcursion[0]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[1]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[2]]--;
                //设置结果
                cbResultCard[0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                cbResultCard[1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                cbResultCard[2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                return GameDef.CK_2_7_10;
            }
        }
        return GameDef.CK_NULL;
    },
    //提取吃牌
    TakeOutChiCard_1_5_10: function (cbCardIndex, cbCurrentCard, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard_1_5_10 cbCurrentCard Is 0');
        if (cbCurrentCard == 0) return GameDef.CK_NULL;
        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        //一五十吃
        var bCardValue = (cbCurrentCard & GameDef.MASK_VALUE);
        if (GameDef.IsAllow1_5_10(this.m_dwRules) && ((bCardValue == 0x01) || (bCardValue == 0x05) || (bCardValue == 0x0A))) {
            //变量定义
            var cbExcursion = [0, 4, 9];
            var cbInceptIndex = ((cbCurrentCard & GameDef.MASK_COLOR) == 0x00) ? 0 : 10;
            //类型判断
            var i = 0;
            for (i = 0; i < cbExcursion.length; i++) {
                var cbIndex = cbInceptIndex + cbExcursion[i];
                if ((cbCardIndex[cbIndex] == 0) || (cbCardIndex[cbIndex] == 3)) break;
            }
            //成功判断
            if (i == cbExcursion.length) {
                //删除扑克
                cbCardIndex[cbInceptIndex + cbExcursion[0]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[1]]--;
                cbCardIndex[cbInceptIndex + cbExcursion[2]]--;
                //设置结果
                cbResultCard[0] = this.SwitchToCardData(cbInceptIndex + cbExcursion[0]);
                cbResultCard[1] = this.SwitchToCardData(cbInceptIndex + cbExcursion[1]);
                cbResultCard[2] = this.SwitchToCardData(cbInceptIndex + cbExcursion[2]);
                return GameDef.CK_1_5_10;
            }
        }
        return GameDef.CK_NULL;
    },
    //提取吃牌
    TakeOutChiCard_Line: function (cbCardIndex, cbCurrentCard, cbExcursion, cbResultCard) {
        //效验扑克
        ASSERT(cbCurrentCard != 0, ' In TakeOutChiCard TakeOutChiCard_Line Is 0');
        if (cbCurrentCard == 0) return 0;
        //变量定义
        var cbFirstIndex = 0;
        var cbCurrentIndex = this.SwitchToCardIndex(cbCurrentCard);
        var cbReverseIndex = (cbCurrentIndex + 10) % GameDef.INDEX_KING;
        //顺子判断
        var cbValueIndex = cbCurrentIndex % 10;
        if ((cbValueIndex >= cbExcursion) && ((cbValueIndex - cbExcursion) <= 7)) {
            //吃牌判断
            cbFirstIndex = cbCurrentIndex - cbExcursion;
            if ((cbCardIndex[cbFirstIndex] == 0) || (cbCardIndex[cbFirstIndex] == 3)) return GameDef.CK_NULL ;
            if ((cbCardIndex[cbFirstIndex + 1] == 0) || (cbCardIndex[cbFirstIndex + 1] == 3)) return GameDef.CK_NULL;
            if ((cbCardIndex[cbFirstIndex + 2] == 0) || (cbCardIndex[cbFirstIndex + 2] == 3)) return GameDef.CK_NULL;

            //删除扑克
            cbCardIndex[cbFirstIndex]--;
            cbCardIndex[cbFirstIndex + 1]--;
            cbCardIndex[cbFirstIndex + 2]--;
            //设置结果
            cbResultCard[0] = this.SwitchToCardData(cbFirstIndex);
            cbResultCard[1] = this.SwitchToCardData(cbFirstIndex + 1);
            cbResultCard[2] = this.SwitchToCardData(cbFirstIndex + 2);
            var cbChiKind = [GameDef.CK_LEFT, GameDef.CK_CENTER, GameDef.CK_RIGHT];
            if(cbExcursion == 0) return GameDef.CK_LEFT;
            if(cbExcursion == 1) return GameDef.CK_CENTER;
            if(cbExcursion == 2) return GameDef.CK_RIGHT;
        }
        return GameDef.CK_NULL;
    },

    GetCardCountByData: function(cbCardList, cbCardCount, cbCardData) {
        var cbCount = 0;
        for(var i = 0; i < cbCardCount; ++ i) {
            if(cbCardList[i] == cbCardData) cbCount++;
        }
        return cbCount;
    },

	//构造扑克
	MakeCardData: function(cbValueIndex, cbColorIndex) {
         return (cbColorIndex << 4) | (cbValueIndex + 1);
    },

    GetWeaveCard: function(wAction, cbChiKind, cbCenterCard, cbCardData) {
        cbCardData.fill(0);
        var cbCardCount = 0;
        var cbValue = this.GetCardValue(cbCenterCard);
        var cbColor = this.GetCardColor(cbCenterCard);
        var cbCardB = this.MakeCardData(cbValue - 1, 1);
        var cbCardS = this.MakeCardData(cbValue - 1, 0);

        if (wAction & (GameDef.ACK_TI | GameDef.ACK_PAO)) {
            cbCardCount = 4;
            cbCardData[0] = cbCenterCard;
            cbCardData[1] = cbCenterCard;
            cbCardData[2] = cbCenterCard;
            cbCardData[3] = cbCenterCard;
        } else if (wAction & (GameDef.ACK_WEI | GameDef.ACK_PENG | GameDef.ACK_JIAO | GameDef.ACK_WEI_CHOU)) {
            cbCardCount = 3;
            cbCardData[0] = cbCenterCard;
            cbCardData[1] = cbCenterCard;
            cbCardData[2] = cbCenterCard;
        } else if (wAction & (GameDef.ACK_CHI | GameDef.ACK_CHI_EX | GameDef.ACK_SHUN)) {
            cbCardCount = 3;
            if (cbChiKind & GameDef.CK_XXD) {
                cbCardData[0] = cbCardB;
                cbCardData[1] = cbCardS;
                cbCardData[2] = cbCardS;
            } else if (cbChiKind & GameDef.CK_XDD) {
                cbCardData[0] = cbCardB;
                cbCardData[1] = cbCardB;
                cbCardData[2] = cbCardS;
            } else if (cbChiKind & GameDef.CK_2_7_10) {
                cbCardData[0] = this.MakeCardData(1, cbColor);
                cbCardData[1] = this.MakeCardData(6, cbColor);
                cbCardData[2] = this.MakeCardData(9, cbColor);
            } else if (cbChiKind & GameDef.CK_1_5_10) {
                cbCardData[0] = this.MakeCardData(0, cbColor);
                cbCardData[1] = this.MakeCardData(4, cbColor);
                cbCardData[2] = this.MakeCardData(9, cbColor);
            } else if (cbChiKind & GameDef.CK_LEFT) {
                cbCardData[0] = cbCenterCard;
                cbCardData[1] = cbCenterCard + 1;
                cbCardData[2] = cbCenterCard + 2;
            } else if (cbChiKind & GameDef.CK_CENTER) {
                cbCardData[0] = cbCenterCard - 1;
                cbCardData[1] = cbCenterCard;
                cbCardData[2] = cbCenterCard + 1;
            } else if (cbChiKind & GameDef.CK_RIGHT) {
                cbCardData[0] = cbCenterCard - 2;
                cbCardData[1] = cbCenterCard - 1;
                cbCardData[2] = cbCenterCard;
            }
        } else if (wAction & (GameDef.ACK_ZHANG)) {
            cbCardCount = 2;
            cbCardData[0] = cbCenterCard;
            cbCardData[1] = cbCenterCard;
        }
        return cbCardCount;
    },

    IsCanOutCard: function(cbCardIndexParam, cbRemoveCard, cbRemoveCount) {
        var cbCardIndex = clone(cbCardIndexParam);
        this.RemoveCard3(cbCardIndex, cbRemoveCard, cbRemoveCount);
        var bOutCard = true;
        var cbCount = this.GetCardCount(cbCardIndex);
        if (cbCount == 0) {
            bOutCard = false;
        } else {
            for (var i = 0; i < GameDef.MAX_INDEX; i++) {
                if ((cbCardIndex[i] > 0) && (cbCardIndex[i] < 3)) break;
            }
            if (i == GameDef.MAX_INDEX) {
                bOutCard = false;
            }
        }
        return bOutCard;
    },

    ///////////////////////////////////////////////////////////////////////////////////
});

GameLogic = null;
