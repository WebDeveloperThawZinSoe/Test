//数值掩码
var LOGIC_MASK_COLOR = 0xF0; //花色掩码
var LOGIC_MASK_VALUE = 0x0F; //数值掩码

//////////////////////////////////////////////////////////////////////////////////

var enDescend      = 0;
var enAscend       = 1;
var enColor        = 2;

var INDEX_CNT      = 4;

var CT_SINGLE      = 1;
var CT_DUIZI_1     = 2;
var CT_DUIZI_2     = 3;
var CT_TIAO_3_H    = 4;
var CT_TIAO_3      = 5;
var CT_SHUNZI      = 7;
var CT_TONGHUA     = 8;
var CT_HULU        = 9;
var CT_TIAO_4      = 10;
var CT_TONGHUASHUN = 11;
var CT_TIAO_5      = 12;

var CGameLogic_500 = cc.Class({

    GetCardValue: function (cbCardData) {
        return cbCardData & LOGIC_MASK_VALUE;
    },

    GetCardColor: function (cbCardData) {
        return cbCardData & LOGIC_MASK_COLOR;
    },

    IsKing: function (cbCardData) {
        return (cbCardData == 0x4E || cbCardData == 0x4F);
    },

    GetCardLogicValue: function (cbCardData) {
        //扑克属性
        var bCardValue = this.GetCardValue(cbCardData);
        if (bCardValue >= 14) return bCardValue + 1;
        //转换数值
        return (bCardValue == 1) ? (bCardValue + 13) : bCardValue;
    },

    SortCardList: function (cbCardData, cbCardCount, SortType) {
        // if (cbCardCount > GameDef.MAX_COUNT) console.warn('数组越界');
        if (cbCardCount < 1) return;

        var cbTemp = 0;
        for (var i = 0; i < cbCardCount - 1; i++) {
            for (var j = i + 1; j < cbCardCount; j++) {
                if ((enDescend == SortType &&
                        (this.GetCardLogicValue(cbCardData[i]) < this.GetCardLogicValue(cbCardData[j]) ||
                            (this.GetCardLogicValue(cbCardData[i]) == this.GetCardLogicValue(cbCardData[j]) &&
                                cbCardData[i] < cbCardData[j]))) ||

                    (enAscend == SortType && (this.GetCardLogicValue(cbCardData[i]) > this.GetCardLogicValue(cbCardData[j]) ||
                        (this.GetCardLogicValue(cbCardData[i]) == this.GetCardLogicValue(cbCardData[j]) &&
                            cbCardData[i] > cbCardData[j]))) ||

                    (enColor == SortType && (this.GetCardColor(cbCardData[i]) < this.GetCardColor(cbCardData[j]) ||
                        (this.GetCardColor(cbCardData[i]) == this.GetCardColor(cbCardData[j]) &&
                            this.GetCardLogicValue(cbCardData[i]) < this.GetCardLogicValue(cbCardData[j]))))) {
                    cbTemp = cbCardData[i];
                    cbCardData[i] = cbCardData[j];
                    cbCardData[j] = cbTemp;
                }
            }
        }
    },

    tagSearchCardResult: function () {
        var Obj = new Object();
        Obj.cbSearchCount = 0;
        Obj.cbCardCount = new Array();
        Obj.cbResultCard = new Array();
        return Obj;
    },

    SearchSameCard: function (cbCardData, cbCardCnt, cbSameCnt) {
        var result = this.tagSearchCardResult();
        if (cbCardCnt < cbSameCnt) return result;
        var cbCard = deepClone(cbCardData);
        this.SortCardList(cbCard, cbCardCnt, enDescend);

        var cbKingCnt = 0;
        while (cbKingCnt < cbCardCnt && this.IsKing(cbCard[cbKingCnt]))
            cbKingCnt++;

        var cbStart = cbKingCnt;
        while (cbStart < cbCardCnt) {
            var cbValue = this.GetCardLogicValue(cbCard[cbStart]);
            var cbEnd = cbStart + 1;

            while (cbEnd < cbCardCnt && this.GetCardLogicValue(cbCard[cbEnd]) == cbValue)
                cbEnd++;

            var cbCnt = cbEnd - cbStart;
            if (cbCnt >= cbSameCnt) {
                var cbSameCard = new Array();
                for (var i = 0; i < cbSameCnt; i++) {
                    cbSameCard[i] = cbCard[cbStart + i];
                }
                result.cbResultCard.push(cbSameCard);
                result.cbCardCount.push(cbSameCnt);
                result.cbSearchCount++;
            } else if (cbCnt + cbKingCnt >= cbSameCnt) {
                var cbAddKing = cbSameCnt - cbCnt;
                var cbSameCard = new Array();
                for (var i = 0; i < cbAddKing; i++) {
                    cbSameCard.push(cbCard[i]);
                }
                for (var i = 0; i < cbCnt; i++) {
                    cbSameCard.push(cbCard[i + cbStart]);
                }
                result.cbResultCard.push(cbSameCard);
                result.cbCardCount.push(cbSameCnt);
                result.cbSearchCount++;
            }
            cbStart = cbEnd;
        }
        return result;
    },

    Search2Double: function (cbCardData, cbCardCnt) {
        var result = this.tagSearchCardResult();
        var double = this.SearchSameCard(cbCardData, cbCardCnt, 2);
        for (var i = 0; i < double.cbSearchCount - 1; i++) {
            for (var j = i + 1; j < double.cbSearchCount; j++) {
                var cbCard = double.cbResultCard[i].concat(double.cbResultCard[j]);
                if (!this.IsInArray(cbCard, cbCardData)) continue;
                result.cbResultCard.push(cbCard);
                result.cbCardCount.push(4);
                result.cbSearchCount++;
            }
        }
        return result;
    },

    IsInArray: function (cbCardIn, cbCardAll) {
        var bUse = new Array();
        for (var i in cbCardAll) {
            bUse[i] = false;
        }
        for (var i in cbCardIn) {
            var bExist = false;
            for (var j in cbCardAll) {
                if (bUse[j]) continue
                if (cbCardIn[i] == cbCardAll[j]) {
                    bUse[j] = true;
                    bExist = true;
                    break;
                }
            }
            if (!bExist) return false;
        }
        return true;
    },

    tagDistributing: function () {
        var Obj = new Object();
        Obj.cbCardCount = 0;
        Obj.cbDistributing = new Array(13);
        for (var i = 0; i < 13; i++) {
            Obj.cbDistributing[i] = [0, 0, 0, 0, 0];
        }
        return Obj;
    },

    //搜索卡牌分步
    AnalysebDistributing: function (cbCardData, cbCardCnt) {
        var result = this.tagDistributing();
        for (var i = 0; i < cbCardCnt; i++) {
            if (cbCardData[i] == 0) continue;
            var cbColor = this.GetCardColor(cbCardData[i]) >> 4;
            var cbValue = this.GetCardValue(cbCardData[i]);
            result.cbCardCount++;
            result.cbDistributing[cbValue - 1][INDEX_CNT]++;
            result.cbDistributing[cbValue - 1][cbColor]++;
        }
        return result;
    },

    //顺子
    SearchLineCardType: function (cbHandCardData, cbCardCount, cbLineCount) {
        var result = this.tagSearchCardResult();
        if (cbLineCount > cbCardCount)
            return result;

        var cbCardData = deepClone(cbHandCardData);

        //排列扑克
        this.SortCardList(cbCardData, cbCardCount, enDescend);
        var cbKingCount = 0;
        while (cbKingCount < cbCardCount && this.IsKing(cbCardData[cbKingCount]))
            cbKingCount++;

        var Distributing = this.AnalysebDistributing(cbCardData.slice(cbKingCount), cbCardCount - cbKingCount);

        //搜索顺序，AKQ/32A/KQJ/.../432
        //BYTE cbSearchOrder[12] = {
        //	14, cbLineCount, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4
        //};
        var vSearchOrder = new Array();
        vSearchOrder.push(14);
        vSearchOrder.push(cbLineCount);
        for (var cbValue = 13; cbValue > cbLineCount; cbValue--)
            vSearchOrder.push(cbValue);

        for (var i = 0; i < vSearchOrder.length; i++) {
            var cbStartValue = vSearchOrder[i];
            console.assert(cbStartValue >= cbLineCount);

            var cbEndValue = cbStartValue - cbLineCount;
            var cbKingUsed = 0;
            var cbFindData = new Array();
            for (var cbValue = cbStartValue; cbValue > cbEndValue; cbValue--) {
                var cbValueIndex = (cbValue == 14 ? 0 : cbValue - 1);
                if (Distributing.cbDistributing[cbValueIndex][INDEX_CNT] > 0) {
                    for (var k = 0; k < 4; k++) {
                        var cbColorIndex = 3 - k;
                        if (Distributing.cbDistributing[cbValueIndex][cbColorIndex] > 0) {
                            cbFindData.push(((cbColorIndex << 4) | (cbValueIndex + 1)));
                            break;
                        }
                    }
                } else if (cbKingUsed < cbKingCount) {
                    cbFindData.push(cbCardData[cbKingUsed++]);
                } else {
                    break;
                }
            }

            if (cbFindData.length == cbLineCount) {
                var bExist = false;
                if (cbKingUsed > 0 && result.cbSearchCount > 0) {
                    //防止重复
                    for (var j = 0; j < result.cbSearchCount; j++) {
                        if (this.cardDataEqual(cbFindData, result.cbResultCard[j], cbLineCount)) {
                            bExist = true;
                            break;
                        }
                    }
                }

                if (!bExist) {
                    //差了 345567 要加在这儿加
                    result.cbResultCard.push(cbFindData);
                    result.cbCardCount.push(cbFindData.length);
                    result.cbSearchCount++;
                }
            }
        }

        return result;
    },

    cardDataEqual: function (left, right, cbCnt) {
        for (var i = 0; i < cbCnt; i++) {
            var bExist = false;
            for (var j = 0; j < cbCnt; j++) {
                if (left[i] == right[j]) {
                    bExist = true;
                    break;
                }
            }
            if (!bExist) return false;
        }
        return true;
    },

    //组合函数，为了选同花
    _Choose: function (arr, size) {
        var allResult = [];

        (function fnCore(arr, size, result) {
            var arrLen = arr.length;
            if (size > arrLen) {
                return;
            }
            if (size == arrLen) {
                allResult.push([].concat(result, arr))
            } else {
                for (var i = 0; i < arrLen; i++) {
                    var newResult = [].concat(result);
                    newResult.push(arr[i]);

                    if (size == 1) {
                        allResult.push(newResult);
                    } else {
                        var newArr = [].concat(arr);
                        newArr.splice(0, i + 1);
                        fnCore(newArr, size - 1, newResult);
                    }
                }
            }
        })(arr, size, []);

        return allResult;
    },

    //同花
    SearchSameColorType: function (cbHandCardData, cbHandCardCount, cbSameCount) {

        var result = this.tagSearchCardResult();
        //复制扑克
        var cbCardData = deepClone(cbHandCardData);

        //同花变量                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        var cbSameCardData = new Array(4);
        for (var i = 0; i < 4; i++) {
            cbSameCardData[i] = new Array();
        }

        var cbKingData = new Array();

        //统计同花
        for (var i = 0; i < cbHandCardCount; i++) {
            if (this.IsKing(cbCardData[i])) {
                cbKingData.push(cbCardData[i]);
                continue;
            }
            var index = this.GetCardColor(cbCardData[i]) >> 4;
            cbSameCardData[index].push(cbCardData[i]);
        }

        for (let i = 0; i < 4; i++) {
            if (cbSameCardData[i].length + cbKingData.length >= cbSameCount) {
                for (let k = 0; k <= cbKingData.length; k++) {
                    let res = this._Choose(cbSameCardData[i], cbSameCount - k);
                    for (let j in res) {
                        let arr = res[j];
                        arr = arr.concat(cbKingData.slice(0, k));
                        result.cbResultCard.push(arr);
                        result.cbSearchCount++;
                        result.cbCardCount.push(cbSameCount);
                    }
                }
            }
        }

        return result;
    },

    //搜索同花顺
    SearchSameColorLineType: function (cbHandCardData, cbHandCardCount, cbLineCount) {
        var result = this.tagSearchCardResult();
        //长度判断
        if (cbHandCardCount < cbLineCount) return result;

        var SameColor = this.SearchSameColorType(cbHandCardData, cbHandCardCount, cbLineCount);

        //同花中搜索顺子
        for (var i = 0; i < SameColor.cbSearchCount; i++) {
            var Line = this.SearchLineCardType(SameColor.cbResultCard[i], SameColor.cbCardCount[i], cbLineCount);
            for (var j = 0; j < Line.cbSearchCount; j++) {
                result.cbCardCount.push(cbLineCount);
                result.cbResultCard.push(Line.cbResultCard[j]);
                result.cbSearchCount++;
            }
        }

        return result;
    },

    //3带2 4带1
    SearchTakeCardType: function (cbHandCardData, cbHandCardCount, cbSameCount, cbTakeCardCount) {
        var result = this.tagSearchCardResult();
        if (cbSameCount != 3 && cbSameCount != 4)
            return result;
        if (cbTakeCardCount != 2 && cbTakeCardCount != 1)
            return result;
        if (cbHandCardCount < cbSameCount + cbTakeCardCount)
            return result;

        var cbKingCnt = this.GetKingCnt(cbHandCardData);

        var SameCardResult = this.SearchSameCard(cbHandCardData, cbHandCardCount, cbSameCount);
        if (SameCardResult.cbSearchCount > 0) {
            if(cbTakeCardCount){
                var TakeCardResult = this.SearchSameCard(cbHandCardData, cbHandCardCount, cbTakeCardCount);
                if (TakeCardResult.cbSearchCount > 0) {
                    for (var i = 0; i < SameCardResult.cbSearchCount; i++) {
                        for (var j = 0; j < TakeCardResult.cbSearchCount; j++) {
                            //搜索三条：AAA
                            //搜索一对：AA 33 66 99
                            //忽略组合 AAAAA
                            //保留组合 AAA33，AAA66，AAA99
                            if ((this.GetKingCnt(SameCardResult.cbResultCard[i]) +
                                this.GetKingCnt(TakeCardResult.cbResultCard[j])) > cbKingCnt) continue;
                            var cbLogicValueSame, cbLogicvalueTake;
                            for (var k in SameCardResult.cbResultCard[i]) {
                                if (this.IsKing(SameCardResult.cbResultCard[i][k])) continue;
                                cbLogicValueSame = this.GetCardLogicValue(SameCardResult.cbResultCard[i][k]);
                            }
                            for (var k in TakeCardResult.cbResultCard[j]) {
                                if (this.IsKing(TakeCardResult.cbResultCard[j][k])) continue;
                                cbLogicvalueTake = this.GetCardLogicValue(TakeCardResult.cbResultCard[j][k]);
                            }
                            if (cbLogicValueSame == cbLogicvalueTake
                            // || cbLogicvalueTake == null || cbLogicValueSame== null
                            ) continue;
                            //复制扑克
                            result.cbCardCount.push(cbSameCount + cbTakeCardCount);
                            result.cbResultCard.push(SameCardResult.cbResultCard[i].concat(TakeCardResult.cbResultCard[j]));
                            result.cbSearchCount++;
                        }
                    }
                }
            } else {
                for (var i = 0; i < SameCardResult.cbSearchCount; i++) {
                    if (this.GetKingCnt(SameCardResult.cbResultCard[i]) > cbKingCnt) continue;
                    //复制扑克
                    result.cbCardCount.push(cbSameCount);
                    result.cbResultCard.push(SameCardResult.cbResultCard[i]);
                    result.cbSearchCount++;
                }
            }

        }

        var cbKingArr = [];
        for (var i in cbHandCardData) {
            if (this.IsKing(cbHandCardData[i])) {
                cbKingArr.push(cbHandCardData[i]);
            }
        }

        for (var i in result.cbResultCard) {
            var cbKingIdx = 0;
            for (var j in result.cbResultCard[i]) {
                if (this.IsKing(result.cbResultCard[i][j])) {
                    result.cbResultCard[i][j] = cbKingArr[cbKingIdx++];
                    if (cbKingIdx > cbKingCnt) {
                        console.warn('error!');
                    }
                }
            }
        }
        return result;
    },

    GetKingCnt: function (cbCard) {
        var cnt = 0;
        for (var i in cbCard) {
            if (this.IsKing(cbCard[i]))
                cnt++;
        }
        return cnt;
    },

    GetCardType: function (cbCard) {
        var result = this.SearchSameCard(cbCard, cbCard.length, 5);
        if (result.cbSearchCount > 0) return CT_TIAO_5;

        result = this.SearchSameColorLineType(cbCard, cbCard.length, 5);
        if (result.cbSearchCount > 0) return CT_TONGHUASHUN;

        result = this.SearchTakeCardType(cbCard, cbCard.length, 4, 1);
        if (result.cbSearchCount > 0) return CT_TIAO_4;

        result = this.SearchTakeCardType(cbCard, cbCard.length, 3, 2);
        if (result.cbSearchCount > 0) return CT_HULU;

        result = this.SearchSameColorType(cbCard, cbCard.length, 5);
        if (result.cbSearchCount > 0) return CT_TONGHUA;

        result = this.SearchLineCardType(cbCard, cbCard.length, 5);
        if (result.cbSearchCount > 0) return CT_SHUNZI;

        result = this.SearchSameCard(cbCard, cbCard.length, 3);
        if (result.cbSearchCount > 0) return cbCard.length==3?CT_TIAO_3_H:CT_TIAO_3;

        result = this.Search2Double(cbCard, cbCard.length);
        if (result.cbSearchCount > 0) return CT_DUIZI_2;

        result = this.SearchSameCard(cbCard, cbCard.length, 2);
        if (result.cbSearchCount > 0) return CT_DUIZI_1;

        return CT_SINGLE;
    },


    CompareCard: function (cbFirst, cbNext) {
        var cbFirstType = this.GetCardType(cbFirst);
        var cbNextType = this.GetCardType(cbNext);
        var result = cbFirstType - cbNextType;
        if (result != 0) return result;

        //同类型比较
        switch (cbFirstType) {
            case CT_SINGLE:
            case CT_DUIZI_1:
            case CT_DUIZI_2:
            case CT_TIAO_3:
            case CT_TIAO_3_H:
            case CT_TIAO_4:
            case CT_TIAO_5:
            case CT_HULU:
                {
                    var AnalyseFirst = this.AnalysebCardData(cbFirst, cbFirst.length);
                    var AnalyseNext = this.AnalysebCardData(cbNext, cbNext.length);
                    for (var i = 4; i >= 0; i--) {
                        for (var j in AnalyseFirst.cbLogicValue[i]) {
                            result = AnalyseFirst.cbLogicValue[i][j] - AnalyseNext.cbLogicValue[i][j];
                            if (result != 0) return result;
                        }
                    }
                    return this.GetCardColor(cbFirst[0]) - this.GetCardColor(cbNext[0]);
                }
            case CT_TONGHUA:
            case CT_TONGHUASHUN:
            case CT_SHUNZI:
                {
                    var cbFirstTemp, cbNextTemp;
                    if (cbFirstType != CT_TONGHUA) {
                        cbFirstTemp = this.LineTransform(cbFirst);
                        cbNextTemp = this.LineTransform(cbNext);
                        //console.log(cbFirstTemp, cbNextTemp);
                    } else {
                        var cbFirst2 = 0,
                            cbNext2 = 0,
                            Obj;

                        Obj = this.SearchSameCard(cbFirst, cbFirst.length, 2);
                        if (Obj.cbSearchCount > 0) cbFirst2 = 1;

                        Obj = this.SearchSameCard(cbNext, cbNext.length, 2);
                        if (Obj.cbSearchCount > 0) cbNext2 = 1;

                        Obj = this.Search2Double(cbFirst, cbFirst.length);
                        if (Obj.cbSearchCount > 0) cbFirst2 = 2;

                        Obj = this.Search2Double(cbNext, cbNext.length);
                        if (Obj.cbSearchCount > 0) cbNext2 = 2;

                        //同花都有一对的比较
                        if(cbFirst2 == 1 && cbNext2 == 1){
                            var JudgeFir = this.SearchSameCard(cbFirst, cbFirst.length, 2),
                                JudgeSec = this.SearchSameCard(cbNext, cbNext.length, 2);
                            //cc.log('WHO THE HELL',JudgeFir.cbResultCard[0][0]);
                            result = this.GetCardLogicValue(JudgeFir.cbResultCard[0][0]) -this.GetCardLogicValue(JudgeSec.cbResultCard[0][0]);
                            if (result != 0) return result;
                        }

                        result = cbFirst2 - cbNext2;
                        if (result != 0) return result;
                        cbFirstTemp = cbFirst;
                        cbNextTemp = cbNext;
                    }
                    for (var i in cbFirstTemp) {
                        if (this.IsKing(cbFirstTemp[i]) || this.IsKing(cbNextTemp[i])) continue;
                        // result = this.GetCardLogicValue(cbFirstTemp[i]) - this.GetCardLogicValue(cbNextTemp[i]);
                        var cbFirstValue = this.GetCardLogicValue(cbFirstTemp[i]);
                        var cbNextValue = this.GetCardLogicValue(cbNextTemp[i]);
                        if (cbFirstType != CT_TONGHUA && i == 0) {
                            if (cbFirstValue == 14) cbFirstValue = 15;
                            if (cbFirstValue == 5) cbFirstValue = 14;
                            if (cbNextValue == 14) cbNextValue = 15;
                            if (cbNextValue == 5) cbNextValue = 14;
                        }
                        result = cbFirstValue - cbNextValue;
                        if (result) return result;
                    }
                    // if (cbFirstType == CT_TONGHUA) {
                    //     for (var i in cbFirst) {
                    //         if (this.IsKing(cbFirst[i]) || this.IsKing(cbNext[i])) continue;
                    //         result = this.GetCardColor(cbFirst[i]) - this.GetCardColor(cbNext[i]);
                    //         if (result) return result;
                    //     }
                    // } else {
                    if (cbFirstType != CT_TONGHUA) {
                        for (var i in cbFirstTemp) {
                            if (this.IsKing(cbFirstTemp[i]) || this.IsKing(cbNextTemp[i])) continue;
                            result = this.GetCardColor(cbFirstTemp[i]) - this.GetCardColor(cbNextTemp[i]);
                            if (result) return result;
                        }
                    }
                }
        }
        return 0;
    },

    tagAnalyseResult: function () {
        var Obj = new Object();
        Obj.cbLogicValue = new Array(4);
        for (var i = 0; i < 5; i++) {
            Obj.cbLogicValue[i] = new Array();
        }
        Obj.cbKingCnt = 0;
        return Obj;
    },

    //分析扑克
    AnalysebCardData: function (cbCard, cbCardCount) {
        //设置结果
        var AnalyseResult = this.tagAnalyseResult();
        var cbCardData = deepClone(cbCard);
        this.SortCardList(cbCardData, cbCardCount, enDescend);
        //扑克分析
        for (var i = 0; i < cbCardCount; i++) {
            if (0 == cbCardData[i]) continue;
            //变量定义
            var cbSameCount = 1;
            var cbLogicValue = this.GetCardLogicValue(cbCardData[i]);

            if (!this.IsKing(cbCardData[i])) {
                //获取同牌
                for (var j = i + 1; j < cbCardCount; j++) {
                    if (cbLogicValue != this.GetCardLogicValue(cbCardData[j]))
                        break;
                    cbSameCount++
                }
            } else {
                AnalyseResult.cbKingCnt++;
                continue;
            }

            if (cbSameCount != 1 && AnalyseResult.cbKingCnt > 0) {
                AnalyseResult.cbLogicValue[cbSameCount + AnalyseResult.cbKingCnt - 1].push(cbLogicValue);
                AnalyseResult.cbKingCnt = 0;
            } else {
                AnalyseResult.cbLogicValue[cbSameCount - 1].push(cbLogicValue);
            }
            //设置递增
            i += cbSameCount - 1;
        }
        if (AnalyseResult.cbKingCnt > 0) {
            var cbLogicValue = AnalyseResult.cbLogicValue[0].shift();
            AnalyseResult.cbLogicValue[1 + AnalyseResult.cbKingCnt - 1].push(cbLogicValue);
        }

        return AnalyseResult;
    },

    tagAnalyseLine: function () {
        var Obj = new Object();
        Obj.cbLogicValue = 0;
        return Obj;
    },

    LineTransform: function (cbCard) {
        var cbCardData = deepClone(cbCard);
        //排列扑克
        this.SortCardList(cbCardData, cbCardData.length, enDescend);
        var cbKingCnt = 0,
            cbKingUse = 0;
        while (cbKingCnt < cbCardData.length && this.IsKing(cbCardData[cbKingCnt]))
            cbKingCnt++;

        var cbIndex = cbKingCnt;
        if (1 == this.GetCardValue(cbCardData[cbIndex])) {
            var cbLeftCard = cbCardData.splice(cbIndex, cbCardData.length - cbKingCnt);
            var cbACard = cbLeftCard.shift();
            if (5 >= this.GetCardValue(cbLeftCard[0])) {
                cbLeftCard.push(cbACard);
            } else {
                cbLeftCard.unshift(cbACard);
            }
            cbCardData = cbCardData.concat(cbLeftCard);
        }
        var cbStart = this.GetCardValue(cbCardData[cbKingCnt]);
        if (cbStart == 1) cbStart = 14;
        else if (cbStart < 5) cbStart = 5;

        cbStart++;
        var result = new Array();
        while (cbIndex < cbCardData.length) {
            var cbCurrent = this.GetCardValue(cbCardData[cbIndex]);
            if (--cbStart != cbCurrent && !(cbStart == 14 && cbCurrent == 1)) {
                cbKingUse++;
                result.push(0x30 | cbCurrent);
            } else {
                result.push(cbCardData[cbIndex]);
                cbIndex++;
            }
        }

        cbStart = this.GetCardValue(cbCardData[cbKingCnt]);
        if (cbStart == 1) cbStart = 14;

        for (var i = 0; i < cbKingCnt - cbKingUse; i++) {
            if (cbStart < 14) {
                cbStart++;
                result.unshift(0x30 | (cbStart == 14 ? 1 : cbStart));
            } else {
                result.push(0x30 | (this.GetCardValue(result[result.length - 1]) - 1));
            }
        }


        return result;
    }


});


CGameLogic_500._instance = null;

CGameLogic_500.getInstance = function () {
    if (!CGameLogic_500._instance) {
        CGameLogic_500._instance = new CGameLogic_500();
    }
    return CGameLogic_500._instance;
};

