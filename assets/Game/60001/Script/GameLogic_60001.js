//数值掩码
var LOGIC_MASK_COLOR = 0xF0; //花色掩码
var LOGIC_MASK_VALUE = 0x0F; //数值掩码

//////////////////////////////////////////////////////////////////////////////////

//索引变量
var g_cbIndexCount = 5;

var CGameLogic_60001 = new cc.Class({

    ctor: function () {
        this.m_cbCardData = new Array();
        this.m_dwRules = 0;
    },

    SetRules: function (dwRules) {
        this.m_dwRules = dwRules;
        this.m_cbFirstOutCard = 0x23;
        this.m_cbFirstOutCard = 0x1A;
        this.m_cbFirstOutCard = 0x3D;
        this.m_cbMaxHandCount = GameDef.GetMaxCardCount(this.m_dwRules);
    },

    SetFirstOutCard: function (cbCardData) {
        this.m_cbFirstOutCard = cbCardData;
    },

    //是否有先出的牌
    HasFirstOutCard: function (cbCardData, cbCardCount) {
        for (var i = 0; i < cbCardCount; ++i) {
            if (cbCardData[i] == this.m_cbFirstOutCard) return true;
        }
        return false;
    },

    //获取数值
    GetCardValue: function (cbCardData) {
        return cbCardData & LOGIC_MASK_VALUE;
    },
    //获取花色
    GetCardColor: function (cbCardData) {
        return cbCardData & LOGIC_MASK_COLOR;
    },
    //逻辑数值
    GetCardLogicValue: function (cbCardData) {
        //扑克属性
        var cbCardColor = this.GetCardColor(cbCardData);
        var cbCardValue = this.GetCardValue(cbCardData);

        //转换数值
        if (cbCardColor == 0x40) return cbCardValue + 2;
        return (cbCardValue <= 2) ? (cbCardValue + 13) : cbCardValue;
    },

    //构造扑克
    MakeCardData: function (cbValueIndex, cbColorIndex) {
        return (cbColorIndex << 4) | (cbValueIndex + 1);
    },

    //有效判断
    IsValidCard: function(cbCardData) {
        //变量定义
        var cbColor = this.GetCardColor(cbCardData);
        var cbValue = this.GetCardValue(cbCardData);
        //有效判断
        switch (cbColor) {
            case 0x00: {
                return ((cbValue >= 0x03) && (cbValue <= 0x0D));
            }
            case 0x10: {
                return ((cbValue == 0x01) || ((cbValue >= 0x03) && (cbValue <= 0x0D)));
            }
            case 0x20: {
                return ((cbValue == 0x01) || ((cbValue >= 0x03) && (cbValue <= 0x0D)));
            }
            case 0x30: {
                return ((cbValue >= 0x01) && (cbValue <= 0x0D));
            }
        }
        return false;
    },

    GetTakeCardSameCount:  function(cbCardType) {
        switch (cbCardType)
        {
        case GameDef.CT_3_TAKE_1_1: return 3; // 三带一单
        case GameDef.CT_3_TAKE_2_1: return 3; // 三带二单
        case GameDef.CT_3_TAKE_1_2: return 3; // 三带一对
        case GameDef.CT_3_TAKE_2_2: return 3; // 三带二对
        case GameDef.CT_4_TAKE_1_1: return 4; // 四带一单
        case GameDef.CT_4_TAKE_1_3: return 4; // 四带三单
        case GameDef.CT_4_TAKE_2_1: return 4; // 四带二单
        case GameDef.CT_4_TAKE_3_1: return 4; // 四带三单
        case GameDef.CT_4_TAKE_4_1: return 4; // 四带四单
        case GameDef.CT_4_TAKE_1_2: return 4; // 四带一对
        case GameDef.CT_4_TAKE_2_2: return 4; // 四带二对
        case GameDef.CT_AIRPLANE_TAKE_1_1: return 3; // 飞机带1单
        case GameDef.CT_AIRPLANE_TAKE_1_2: return 3; // 飞机带对
        case GameDef.CT_AIRPLANE_TAKE_2_1: return 3; // 飞机带2单
	    case GameDef.CT_AIRPLANE_TAKE_3_1: return 3;//飞机带3单
        case GameDef.CT_AIRPLANE_TAKE_2_2: return 3; // 飞机带2对
        }
        return 0;
    },
    // 类型数量
    GetTakeCardCountByCT: function(cbCardType) {
        switch (cbCardType)
        {
        case GameDef.CT_3_TAKE_1_1: return 1; // 三带一单
        case GameDef.CT_3_TAKE_2_1: return 2; // 三带二单
        case GameDef.CT_3_TAKE_1_2: return 1; // 三带一对
        case GameDef.CT_3_TAKE_2_2: return 2; // 三带二对
        case GameDef.CT_4_TAKE_1_1: return 1; // 四带一单
        case GameDef.CT_4_TAKE_1_3: return 1; // 四带三单
        case GameDef.CT_4_TAKE_2_1: return 2; // 四带二单
        case GameDef.CT_4_TAKE_3_1: return 3; // 四带三单
        case GameDef.CT_4_TAKE_4_1: return 4; // 四带四单
        case GameDef.CT_4_TAKE_1_2: return 1; // 四带一对
        case GameDef.CT_4_TAKE_2_2: return 2; // 四带二对
        case GameDef.CT_AIRPLANE_TAKE_1_1: return 1; // 飞机带1单
        case GameDef.CT_AIRPLANE_TAKE_1_2: return 1; // 飞机带对
        case GameDef.CT_AIRPLANE_TAKE_2_1: return 2; // 飞机带2单
	    case GameDef.CT_AIRPLANE_TAKE_3_1: return 3;//飞机带3单
        case GameDef.CT_AIRPLANE_TAKE_2_2: return 2; // 飞机带2对
        }
        return 0;
    },

    // 类型数量
    GetTakeCardTypeCount: function(cbCardType) {
        switch (cbCardType)
        {
        case GameDef.CT_3_TAKE_1_1: return 1; // 三带一单
        case GameDef.CT_3_TAKE_2_1: return 1; // 三带二单
        case GameDef.CT_3_TAKE_1_2: return 2; // 三带一对
        case GameDef.CT_3_TAKE_2_2: return 2; // 三带二对
        case GameDef.CT_4_TAKE_1_1: return 1; // 四带一单
        case GameDef.CT_4_TAKE_1_3: return 3; // 四带三单
        case GameDef.CT_4_TAKE_2_1: return 1; // 四带二单
        case GameDef.CT_4_TAKE_3_1: return 1; // 四带三单
        case GameDef.CT_4_TAKE_4_1: return 1; // 四带四单
        case GameDef.CT_4_TAKE_1_2: return 2; // 四带一对
        case GameDef.CT_4_TAKE_2_2: return 2; // 四带二对
        case GameDef.CT_AIRPLANE_TAKE_1_1: return 1; // 飞机带1单
        case GameDef.CT_AIRPLANE_TAKE_1_2: return 2; // 飞机带对
        case GameDef.CT_AIRPLANE_TAKE_2_1: return 1; // 飞机带2单
	    case GameDef.CT_AIRPLANE_TAKE_3_1: return 1;//飞机带3单
        case GameDef.CT_AIRPLANE_TAKE_2_2: return 2; // 飞机带2对
        }
        return 0;
    },

    GetCardCount: function(cbCardData) {
        var cbCount = 0;
        if(Array.isArray(cbCardData)) {
            for(var i = 0; i < cbCardData.length; ++ i) {
                if(this.IsValidCard(cbCardData[i])) cbCount ++;
            }
        } else if(cbCardData > 0) {
            cbCount ++;
        }
        return cbCount;
    },

    IsSameCardType: function(cbFirstType, cbNextType){
        if (cbFirstType == cbNextType) return true;
        var cbFirstTCT = this.GetTakeCardTypeCount(cbFirstType);
        var cbFirstTCC = this.GetTakeCardCountByCT(cbFirstType);
        var cbNextTCT = this.GetTakeCardTypeCount(cbNextType);
        var cbNextTCC = this.GetTakeCardCountByCT(cbNextType);
        if (cbFirstTCT * cbFirstTCC == cbNextTCT * cbNextTCC && cbFirstTCT * cbFirstTCC != 0) return true;
        return false;
    },

    IsSameCard: function (cbFirstCard, cbNextCard) {
        if (!cbFirstCard || !cbNextCard) return false;
        if (cbFirstCard == cbNextCard) return true;
        var cbLogicVFirst = this.GetCardLogicValue(cbFirstCard);
        var cbLogicVNext = this.GetCardLogicValue(cbNextCard);
        return (cbLogicVFirst == cbLogicVNext);
    },

    IsSameCardList: function (cbCardDataParam1, cbCardCount1, cbCardDataParam2, cbCardCount2) {
        if (cbCardCount1 != cbCardCount2) return false;
        var cbCardData1 = clone(cbCardDataParam1);
        var cbCardData2 = clone(cbCardDataParam2);

        for (var i = 0; i < cbCardCount1; ++i)
        {
            if (!this.IsValidCard(cbCardData1[i])) return false;
            var bFlag = false;
            for (var j = 0; j < cbCardCount2; ++j)
            {
                if (this.IsValidCard(cbCardData2[j]) && cbCardData1[i] == cbCardData2[j]) {
                    cbCardData2[j] = 0;
                    bFlag = true;
                    break;
                }
            }
            if (!bFlag) return false;
        }
        return true;
    },

    //包含扑克
    CalcValidCard: function (cbShootCard, cbCount, cbTurnCard, cbTurnCount) {
        if (cbCount - cbTurnCount != 1) return 0;
        var TempCard = new Array();
        var cbCardType = this.GetCardType(cbTurnCard, cbTurnCount);

        for (var i = 0; i < cbTurnCount; i++) {
            TempCard.splice(0, TempCard.length);
            TempCard = cbShootCard.slice(0, cbCount);

            TempCard.splice(i, 1);
            if (window.LOG_NET_DATA) console.log('TempCard2 ', TempCard)
            if (this.GetCardType(TempCard, TempCard.length) == cbCardType) {
                for (var j = 0; j < cbTurnCount; j++) cbShootCard[j] = TempCard[j];
                return cbTurnCount;
            }
        }
        return 0;
    },

    // 分析带牌
    AnalyseTakeCardData: function(cbCardDataParam, cbCardCountParam, AnalyseTakeCardResult) {
        this.AnalyseCardData(cbCardDataParam, cbCardCountParam, AnalyseTakeCardResult.AnalyseResult);
        AnalyseTakeCardResult.cbCardType = this.GetCardType(cbCardDataParam, cbCardCountParam);
        if(AnalyseTakeCardResult.cbCardType == GameDef.CT_ERROR) return;
        AnalyseTakeCardResult.cbTakeTypeCount = this.GetTakeCardTypeCount(AnalyseTakeCardResult.cbCardType);
        if(AnalyseTakeCardResult.cbTakeTypeCount == 0) return;
        AnalyseTakeCardResult.cbTakeCardData = clone(this.SplitTakeCardData(cbCardDataParam, cbCardCountParam, AnalyseTakeCardResult.cbCardType, AnalyseTakeCardResult.AnalyseResult));
        AnalyseTakeCardResult.cbTakeCardCount = AnalyseTakeCardResult.cbTakeCardData.length;
    },

    // 拆分带牌
    SplitTakeCardData: function (cbCardDataParam, cbCardCountParam, cbCardType, AnalyseResult) {
        var cbTempCardData = clone(cbCardDataParam);
        switch (cbCardType) {
            case GameDef.CT_3_TAKE_1_1:
            case GameDef.CT_3_TAKE_1_2:
            case GameDef.CT_AIRPLANE_TAKE_1_1:
	        case GameDef.CT_AIRPLANE_TAKE_3_1:
            case GameDef.CT_AIRPLANE_TAKE_1_2:
            case GameDef.CT_AIRPLANE_TAKE_2_1:
            case GameDef.CT_3_TAKE_2_1:
            case GameDef.CT_3_TAKE_2_2:
                {
                    this.RemoveCardList(AnalyseResult.cbCardData[2], AnalyseResult.cbBlockCount[2] * 3, cbTempCardData, cbCardCountParam);
                    break;
                }
            case GameDef.CT_4_TAKE_1_1:
            case GameDef.CT_FOUR_TAKE_TWO:
                {
                    this.RemoveCardList(AnalyseResult.cbCardData[3], 4, cbTempCardData, cbCardCountParam);
                    break;
                }
            default: cbTempCardData = new Array(); break;
        }
        this.SortCardList(cbTempCardData, cbTempCardData.length);
        cbTempCardData.length = this.GetCardCount(cbTempCardData);
        return cbTempCardData;
    },

    // 获取带牌
    GetTakeCardData: function (cbCardData, cbCardCount) {
        //分析扑克
        var AnalyseResult = GameDef.tagAnalyseResult();
        this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);
        var cbCardType = this.GetCardType(cbCardData, cbCardCount);
        return this.SplitTakeCardData(cbCardData, cbCardCount, cbCardType, AnalyseResult);
        // var cbTempCardData = clone(cbCardData);
        // switch (cbCardType) {
        //     case GameDef.CT_3_TAKE_1_1:
        //     case GameDef.CT_3_TAKE_1_2:
        //     case GameDef.CT_AIRPLANE_TAKE_1_1:
        //     case GameDef.CT_AIRPLANE_TAKE_1_2:
        //     case GameDef.CT_AIRPLANE_TAKE_2_1:
        //     case GameDef.CT_3_TAKE_2_1:
        //     case GameDef.CT_3_TAKE_2_2:
        //         {
        //             //分析扑克
        //             var AnalyseResult = GameDef.tagAnalyseResult();
        //             this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);
        //             this.RemoveCardList(AnalyseResult.cbCardData[2], AnalyseResult.cbBlockCount[2] * 3, cbTempCardData, cbCardCount);
        //             break;
        //         }
        //     case GameDef.CT_4_TAKE_1_1:
        //     case GameDef.CT_FOUR_TAKE_TWO:
        //         {
        //             //分析扑克
        //             var AnalyseResult = GameDef.tagAnalyseResult();
        //             this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);
        //             this.RemoveCardList(AnalyseResult.cbCardData[3], 4, cbTempCardData, cbCardCount);
        //             break;
        //         }
        //     default: cbTempCardData = new Array(); break;
        // }
        // return cbTempCardData;
    },

    //获取类型
    GetCardType: function (cbCardDataParam, cbCardCount, objTouPaoState, cbHandCard/* = NULL*/, cbHandCount/* = 0*/,cbTurnUser) {
        if (cbCardCount == 0) return GameDef.CT_ERROR;
        console.log(' GetCardType: ' + GameDef.GetCardName(cbCardDataParam, cbCardCount));
        // 定义变量
        if(!objTouPaoState) objTouPaoState = new Object();
        objTouPaoState.bState = false;
        if (cbHandCard && cbHandCount)
        {
            if (this.IsSameCardList(cbCardDataParam, cbCardCount, cbHandCard, cbHandCount) && cbCardCount<=10) objTouPaoState.bState = true;
        }
        //分析扑克
        var cbCardData = clone(cbCardDataParam);
        this.SortCardList(cbCardData, cbCardCount);
        var AnalyseResult = GameDef.tagAnalyseResult();
        this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);

        //简单牌型
        switch (cbCardCount) {
            case 0: //空牌
            {
                return GameDef.CT_ERROR;
            }
            case 1: //单牌
            {
                return GameDef.CT_SINGLE;
            }
            case 2: //对牌火箭
            {
                //牌型判断
                if ((cbCardData[0] == 0x4F) && (cbCardData[1] == 0x4E)) return GameDef.CT_MISSILE_CARD;
                if (this.GetCardLogicValue(cbCardData[0]) == this.GetCardLogicValue(cbCardData[1])) return GameDef.CT_DOUBLE;

                return GameDef.CT_ERROR;
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////
        //四牌判断
        if (AnalyseResult.cbBlockCount[3] > 0) {
            if(AnalyseResult.cbBlockCount[3] != 1) return GameDef.CT_ERROR;
            switch(cbCardCount) {
                case 4: {
                    return GameDef.GetFourSameCardType(this.m_dwRules);
                }
                case 5: {
                    // 4带一单
                    if((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 1, objTouPaoState.bState,cbTurnUser))) return GameDef.CT_4_TAKE_1_1;
                    return GameDef.CT_ERROR;
                }
                case 6: {
                    // 4带2单
                    if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 2, 1, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[0] == 2)) return GameDef.CT_4_TAKE_2_1;
                    // 4带一对
                    if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 2, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[1] == 1)) return GameDef.CT_4_TAKE_1_2;
                    return GameDef.CT_ERROR;
                }
                case 7: {
                    // 4带3单
                    if((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 3, 1, objTouPaoState.bState,cbTurnUser))) return GameDef.CT_4_TAKE_3_1;
                    return GameDef.CT_ERROR;
                }
                case 8: {
                    // 4带二对
                    if((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 2, 2, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[1] == 2)) return GameDef.CT_4_TAKE_2_2;
                    // 4带四单
                    if((GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 4, 1, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[0] == 4)) return GameDef.CT_4_TAKE_4_1;
                    return GameDef.CT_ERROR;
                }
                default: GameDef.CT_ERROR;
            }

            return GameDef.CT_ERROR;
        }

        //三牌判断
        if (AnalyseResult.cbBlockCount[2] > 0) {
            // 三张类型 三张带N
            if (AnalyseResult.cbBlockCount[2] == 1) {
                switch(cbCardCount) {
                    case 3: {
                        // 3张A算炸弹
                        if (GameDef.IsAllowBomb_AAA(this.m_dwRules) && this.GetCardValue(AnalyseResult.cbCardData[2][0]) == 1) return GameDef.CT_BOMB_CARD;
                        // 三张类型
                        if((GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 0, 0, objTouPaoState.bState,cbTurnUser))) return GameDef.CT_THREE;
                        return GameDef.CT_ERROR;
                    }
                    case 4: {
                        // 3张A带一算炸弹
                        if (GameDef.IsAllowBomb_AAA_Take_1_1(this.m_dwRules) && this.GetCardValue(AnalyseResult.cbCardData[2][0]) == 1) return GameDef.CT_BOMB_CARD;
                        // 三带一单
                        if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 1, 1, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[0] == 1)) return GameDef.CT_3_TAKE_1_1;
                        return GameDef.CT_ERROR;
                    }
                    case 5: {
                        // 三带2单
                        if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 2, 1, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[0] == 2)) return GameDef.CT_3_TAKE_2_1;
                        // 三带一对
                        if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 1, 2, objTouPaoState.bState,cbTurnUser)) && (AnalyseResult.cbBlockCount[1] == 1)) return GameDef.CT_3_TAKE_1_2;
                        return GameDef.CT_ERROR;
                    }
                    default: GameDef.CT_ERROR;
                }
            } else { // 三连类型 飞机类型
                //变量定义
                var cbTempCardData = AnalyseResult.cbCardData[2][0];
                var cbLogicValue = this.GetCardLogicValue(cbTempCardData);

                //错误过虑
                if (cbLogicValue >= 15) return GameDef.CT_ERROR;

                //连牌判断
                for (var i = 1; i < AnalyseResult.cbBlockCount[2]; i++) {
                    var cbTempCardData = AnalyseResult.cbCardData[2][i * 3];
                    if (cbLogicValue != (this.GetCardLogicValue(cbTempCardData) + i)) return GameDef.CT_ERROR;
                }

                // 判断类型
                if (AnalyseResult.cbBlockCount[2] * 3 == cbCardCount) //  333444
                {
                    if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 0, 0, objTouPaoState.bState,cbTurnUser)) return GameDef.CT_THREE_LINE; // 3张顺子
                }
                else if (cbCardCount <= AnalyseResult.cbBlockCount[2] * 4) // 33344456
                {
    				// 偷跑判断
                    if((!objTouPaoState.bState ||  (!GameDef.IsAllow_F_TakeLittle(this.m_dwRules) || !GameDef.IsAllow_F_JoinLittle(this.m_dwRules))) && (cbCardCount < AnalyseResult.cbBlockCount[2] * 4)) return GameDef.CT_ERROR;
                    if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 1, 1, objTouPaoState.bState,cbTurnUser)) return GameDef.CT_AIRPLANE_TAKE_1_1; // 飞机带1单
		            else if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 2, 1, objTouPaoState.bState,cbTurnUser))/* && (AnalyseResult.cbBlockCount[0] > 0)*/) return GameDef.CT_AIRPLANE_TAKE_2_1; // 飞机带2单
                    else if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 1, 2, objTouPaoState.bState,cbTurnUser))/* && (AnalyseResult.cbBlockCount[1] > 0)*/) return GameDef.CT_AIRPLANE_TAKE_1_2; // 飞机带1对
                }
                else if ((cbCardCount <= AnalyseResult.cbBlockCount[2] * 5 )) // 3334445566
                {
    				// 偷跑判断
                    if((!objTouPaoState.bState || (!GameDef.IsAllow_F_TakeLittle(this.m_dwRules) || !GameDef.IsAllow_F_JoinLittle(this.m_dwRules))) && (cbCardCount < AnalyseResult.cbBlockCount[2] * 5)) return GameDef.CT_ERROR;
 		            if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 3, 1, objTouPaoState.bState,cbTurnUser))/* && (AnalyseResult.cbBlockCount[0] > 0)*/) return GameDef.CT_AIRPLANE_TAKE_3_1; // 飞机带3单
                    else if ((GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 2, 2, objTouPaoState.bState,cbTurnUser))/* && (AnalyseResult.cbBlockCount[0] > 0)*/) return GameDef.CT_AIRPLANE_TAKE_2_2; // 飞机带2对

                }

                return GameDef.CT_ERROR;
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////

        //两张类型
        if (AnalyseResult.cbBlockCount[1] >= GameDef.MIN_STRAIGHT_COUNT_2) {
            //变量定义
            var cbTempCardData = AnalyseResult.cbCardData[1][0];
            var cbLogicValue = this.GetCardLogicValue(cbTempCardData);

            //错误过虑
            if (cbLogicValue >= 15) return GameDef.CT_ERROR;

            //连牌判断
            for (var i = 1; i < AnalyseResult.cbBlockCount[1]; i++) {
                var cbTempCardData = AnalyseResult.cbCardData[1][i * 2];
                if (cbLogicValue != (this.GetCardLogicValue(cbTempCardData) + i)) return GameDef.CT_ERROR;
            }

            //二连判断
            if ((AnalyseResult.cbBlockCount[1] * 2) != cbCardCount) return GameDef.CT_ERROR;
            return GameDef.CT_DOUBLE_LINE;
        }

        //单张判断
        if ((AnalyseResult.cbBlockCount[0] >= GameDef.MIN_STRAIGHT_COUNT_1) && (AnalyseResult.cbBlockCount[0] == cbCardCount)) {
            //变量定义
            var cbTempCardData = AnalyseResult.cbCardData[0][0];
            var cbLogicValue = this.GetCardLogicValue(cbTempCardData);

            //错误过虑
            if (cbLogicValue >= 15) return GameDef.CT_ERROR;

            //连牌判断
            for (var i = 1; i < AnalyseResult.cbBlockCount[0]; i++) {
                var cbTempCardData = AnalyseResult.cbCardData[0][i];
                if (cbLogicValue != (this.GetCardLogicValue(cbTempCardData) + i)) return GameDef.CT_ERROR;
            }
            if(i < GameDef.MIN_STRAIGHT_COUNT_1) return GameDef.CT_ERROR;
            return GameDef.CT_SINGLE_LINE;
        }

        return GameDef.CT_ERROR;
    },

    //排列扑克
    SortCardList: function (cbCardData, cbCardCount) {
        //数目过虑
        if (cbCardCount == 0) return;

        //转换数值
        var cbSortValue = new Array();
        for (var i = 0; i < cbCardCount; i++) {
            cbSortValue[i] = this.GetCardLogicValue(cbCardData[i]);
        }

        //排序操作
        var bSorted = true;
        var cbSwitchData = 0;
        var cbLast = cbCardCount - 1;
        do {
            bSorted = true;
            for (var i = 0; i < cbLast; i++) {
                if ((cbSortValue[i] < cbSortValue[i + 1]) ||
                    ((cbSortValue[i] == cbSortValue[i + 1]) && (cbCardData[i] < cbCardData[i + 1]))) {
                    //设置标志
                    bSorted = false;

                    //扑克数据
                    cbSwitchData = cbCardData[i];
                    cbCardData[i] = cbCardData[i + 1];
                    cbCardData[i + 1] = cbSwitchData;

                    //排序权位
                    cbSwitchData = cbSortValue[i];
                    cbSortValue[i] = cbSortValue[i + 1];
                    cbSortValue[i + 1] = cbSwitchData;
                }
            }
            cbLast--;
        } while (bSorted == false);

        return;
    },

    //排列扑克
    SortOutCardList: function (cbCardData, cbCardCount) {
        //获取牌型
        var cbCardType = this.GetCardType(cbCardData, cbCardCount);

        if (cbCardType == GameDef.CT_3_TAKE_1_1 || cbCardType == GameDef.CT_3_TAKE_1_2 || cbCardType == GameDef.CT_3_TAKE_2_1) {
            //分析牌
            var AnalyseResult = GameDef.tagAnalyseResult();
            this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);

            cbCardCount = AnalyseResult.cbBlockCount[2] * 3;
            for (var i = 0; i < cbCardCount; i++) {
                cbCardData[i] = AnalyseResult.cbCardData[2][i];
            }
            for (var i = 4 - 1; i >= 0; i--) {
                if (i == 2) continue;
                if (AnalyseResult.cbBlockCount[i] > 0) {
                    for (var j = 0; j < (i + 1) * AnalyseResult.cbBlockCount[i]; j++) {
                        cbCardData[cbCardCount + j] = AnalyseResult.cbCardData[i][j];
                    }
                    cbCardCount += (i + 1) * AnalyseResult.cbBlockCount[i];
                }
            }
        } else if (cbCardType == GameDef.CT_4_TAKE_1_1 || cbCardType == GameDef.CT_FOUR_TAKE_TWO) {
            //分析牌
            var AnalyseResult = GameDef.tagAnalyseResult();
            this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);
            cbCardCount = AnalyseResult.cbBlockCount[3] * 4;
            for (var i = 0; i < cbCardCount; i++) {
                cbCardData[i] = AnalyseResult.cbCardData[3][i];
            }
            for (var i = AnalyseResult.cbBlockCount.length - 1; i >= 0; i--) {
                if (i == 3) continue;
                if (AnalyseResult.cbBlockCount[i] > 0) {
                    for (var j = 0; j < (i + 1) * AnalyseResult.cbBlockCount[i]; j++) {
                        cbCardData[cbCardCount + j] = AnalyseResult.cbCardData[i][j];
                    }
                    cbCardCount += (i + 1) * AnalyseResult.cbBlockCount[i];
                }
            }
        } else {
            this.SortCardList(cbCardData, cbCardCount)
        }
        return;
    },

    //删除扑克
    RemoveCard: function (cbRemoveCard, cbRemoveCount, cbCardData, cbCardCount) {
        //检验数据
        if (cbRemoveCount > cbCardCount) return;

        //定义变量
        var cbDeleteCount = 0;
        var cbTempCardData = new Array();
        if (cbCardCount > GameDef.MAX_CARD_COUNT) return false;
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            cbTempCardData[i] = cbCardData[i];
        }

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
        if (cbDeleteCount != cbRemoveCount) return false;

        //清理扑克
        var cbCardPos = 0;
        for (var i = 0; i < cbCardCount; i++) {
            if (cbTempCardData[i] != 0) cbCardData[cbCardPos++] = cbTempCardData[i];
        }

        return true;
    },

    //删除扑克
    RemoveCardList: function (cbRemoveCard, cbRemoveCount, cbCardData, cbCardCount) {
        //检验数据
        if (cbRemoveCount > cbCardCount) return false;

        //定义变量
        var cbDeleteCount = 0;
        var cbTempCardData = new Array();
        if (cbCardCount > GameDef.MAX_CARD_COUNT) return false;
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            cbTempCardData[i] = cbCardData[i];
            cbCardData[i] = 0;
        }

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
        if (cbDeleteCount != cbRemoveCount) return false;

        //清理扑克
        var cbCardPos = 0;
        cbCardData.fill(0);
        for (var i = 0; i < cbCardCount; i++) {
            if (cbTempCardData[i] != 0)
                cbCardData[cbCardPos++] = cbTempCardData[i];
        }

        return true;
    },

    CompareTakeCard: function (cbFirstCard, cbNextCard, cbFirstCount, cbNextCount) {
        var cbTempCardF = this.GetTakeCardData(cbFirstCard, cbFirstCount);
        var cbTempCardN = this.GetTakeCardData(cbNextCard, cbNextCount);
        for (var i = 0; i < cbTempCardN.length; ++i) {
            if (!cbTempCardN[i]) continue;
            for (var j = 0; j < cbTempCardF.length; ++j) {
                if (!cbTempCardF[j]) continue;
                //获取数值
                var cbNextLogicValue = this.GetCardLogicValue(cbTempCardN[i]);
                var cbFirstLogicValue = this.GetCardLogicValue(cbTempCardF[j]);
                if (cbNextLogicValue <= cbFirstLogicValue) return false;
            }
        }
        return true;
    },

    CompareTakeCard1: function (cbFirstCard, cbNextCard, cbFirstCount, cbNextCount) {
        //获取类型
        var cbNextType = this.GetCardType(cbNextCard, cbNextCount);
        var cbFirstType = this.GetCardType(cbFirstCard, cbFirstCount);
        //开始对比
        switch (cbNextType) {
            case GameDef.CT_3_TAKE_1_1:
            case GameDef.CT_3_TAKE_1_2:
            case GameDef.CT_AIRPLANE_TAKE_1_1:
            case GameDef.CT_AIRPLANE_TAKE_1_2:
                {
                    var cbTempCardF = clone(cbFirstCard);
                    var cbTempCardN = clone(cbNextCard);
                    //分析扑克
                    var NextResult = GameDef.tagAnalyseResult();
                    var FirstResult = GameDef.tagAnalyseResult();
                    this.AnalyseCardData(cbNextCard, cbNextCount, NextResult);
                    this.AnalyseCardData(cbFirstCard, cbFirstCount, FirstResult);
                    this.RemoveCardList(FirstResult.cbCardData[2], 3, cbTempCardF, cbNextCount);
                    this.RemoveCardList(NextResult.cbCardData[2], 3, cbTempCardN, cbFirstCount);
                    for (var i = 0; i < cbTempCardN.length; ++i) {
                        if (!cbTempCardN[i]) continue;
                        for (var j = 0; j < cbTempCardF.length; ++j) {
                            if (!cbTempCardF[j]) continue;
                            //获取数值
                            var cbNextLogicValue = this.GetCardLogicValue(cbTempCardN[i]);
                            var cbFirstLogicValue = this.GetCardLogicValue(cbTempCardF[j]);
                            if (cbNextLogicValue <= cbFirstLogicValue) return false;
                        }
                    }
                    return true;
                }
            case GameDef.CT_4_TAKE_1_1:
            case GameDef.CT_FOUR_TAKE_TWO:
                {
                    var cbTempCardF = clone(cbFirstCard);
                    var cbTempCardN = clone(cbNextCard);
                    //分析扑克
                    var NextResult = GameDef.tagAnalyseResult();
                    var FirstResult = GameDef.tagAnalyseResult();
                    this.AnalyseCardData(cbNextCard, cbNextCount, NextResult);
                    this.AnalyseCardData(cbFirstCard, cbFirstCount, FirstResult);
                    this.RemoveCardList(FirstResult.cbCardData[3], 4, cbTempCardF, cbNextCount);
                    this.RemoveCardList(NextResult.cbCardData[3], 4, cbTempCardN, cbFirstCount);
                    for (var i = 0; i < cbTempCardN.length; ++i) {
                        if (!cbTempCardN[i]) continue;
                        for (var j = 0; j < cbTempCardF.length; ++j) {
                            if (!cbTempCardF[j]) continue;
                            //获取数值
                            var cbNextLogicValue = this.GetCardLogicValue(cbTempCardN[i]);
                            var cbFirstLogicValue = this.GetCardLogicValue(cbTempCardF[j]);
                            if (cbNextLogicValue <= cbFirstLogicValue) return false;
                        }
                    }
                    return true;
                }
            default: return false;
        }
        return false;
    },

    //对比扑克
    //CompareCard: function(var cbFirstCardParam[], var cbNextCardParam[],  var cbNextHandCardParam[], var cbFirstCount, var cbNextCount, var cbNextHandCount)
    CompareCard: function (cbFirstCard, cbNextCard, cbNextHandCardParam, cbFirstCount, cbNextCount, cbNextHandCount,cbTurnUser) {

        if (cbFirstCount == 0) return false;
        if (cbNextCount == 0) return false;
        var cbFirstCard = clone(cbFirstCard);
        this.SortCardList(cbFirstCard, cbFirstCount);
        var cbNextCard = clone(cbNextCard);
        this.SortCardList(cbNextCard, cbNextCount);

        //获取类型
        var objFirstTouPao = new Object();
        var objNextTouPao = new Object();
        var cbNextType = this.GetCardType(cbNextCard, cbNextCount, objNextTouPao, cbNextHandCardParam, cbNextHandCount,cbTurnUser);
        var cbFirstType = this.GetCardType(cbFirstCard, cbFirstCount, objFirstTouPao, cbNextHandCardParam, cbNextHandCount);

        //王炸
        if (cbFirstType == GameDef.CT_MISSILE_CARD && cbFirstCount == 2) return false;
        if (cbNextType == GameDef.CT_MISSILE_CARD && cbNextCount == 2) return true;

        //类型判断
        if (cbNextType == GameDef.CT_ERROR) return false;
        if (cbNextType == GameDef.CT_MISSILE_CARD) return true;


        //炸弹判断
        if ((cbFirstType != GameDef.CT_BOMB_CARD) && (cbNextType == GameDef.CT_BOMB_CARD)) return true;
        else if ((cbFirstType == GameDef.CT_BOMB_CARD) && (cbNextType != GameDef.CT_BOMB_CARD)) return false;
        else if ((cbFirstType == GameDef.CT_BOMB_CARD) && (cbNextType == GameDef.CT_BOMB_CARD))
        {
            //获取数值
            var cbNextLogicValue = this.GetCardLogicValue(cbNextCard[0]);
            var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCard[0]);
            //对比扑克
            return cbNextLogicValue > cbFirstLogicValue;
        }
    
        //开始对比
        switch (cbNextType) {
            case GameDef.CT_SINGLE:
            case GameDef.CT_DOUBLE:
            case GameDef.CT_SINGLE_LINE:
            case GameDef.CT_DOUBLE_LINE:
            case GameDef.CT_THREE_LINE:
            case GameDef.CT_BOMB_CARD: //
            {
                //规则判断
                if ((cbFirstType != cbNextType) || (cbFirstCount != cbNextCount)) return false;
                //获取数值
                var cbNextLogicValue = this.GetCardLogicValue(cbNextCard[0]);
                var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCard[0]);

                //对比扑克
                return cbNextLogicValue > cbFirstLogicValue;
            }
	        case GameDef.CT_THREE:
            {
                if(cbTurnUser==2 && objNextTouPao.bState){
                     //分析扑克
                    var NextResult = GameDef.tagAnalyseResult();
                    var FirstResult = GameDef.tagAnalyseResult();
                    this.AnalyseCardData(cbNextCard, cbNextCount, NextResult);
                    this.AnalyseCardData(cbFirstCard, cbFirstCount, FirstResult);
                    //获取数值
                    var cbNextLogicValue = this.GetCardLogicValue(NextResult.cbCardData[2][0]);
                    var cbFirstLogicValue = this.GetCardLogicValue(FirstResult.cbCardData[2][0]);
                    //对比扑克
                    if (NextResult.cbBlockCount[2] != FirstResult.cbBlockCount[2]) return false;
                    if (cbNextLogicValue > cbFirstLogicValue) {
                        /* // 对比带牌
                        return this.CompareTakeCard(cbFirstCard, cbNextCard, cbFirstCount, cbNextCount);
                        // */
                        return true;
                    } else {
                        return false;
                    }
                }else{
                     //规则判断
                     if ((cbFirstType != cbNextType) || (cbFirstCount != cbNextCount)) return false;
                     //获取数值
                     var cbNextLogicValue = this.GetCardLogicValue(cbNextCard[0]);
                     var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCard[0]);

                     //对比扑克
                     return cbNextLogicValue > cbFirstLogicValue;
                }
            }
            case GameDef.CT_3_TAKE_1_1: // 三带一单
            case GameDef.CT_3_TAKE_2_1: // 三带二单
            case GameDef.CT_3_TAKE_1_2: // 三带一对
            case GameDef.CT_3_TAKE_2_2: // 三带二对
            case GameDef.CT_AIRPLANE_TAKE_1_1: // 飞机带1单
            case GameDef.CT_AIRPLANE_TAKE_1_2: // 飞机带对
            case GameDef.CT_AIRPLANE_TAKE_2_1: // 飞机带2单
	        case GameDef.CT_AIRPLANE_TAKE_3_1: // 飞机带3单
            case GameDef.CT_AIRPLANE_TAKE_2_2: // 飞机带2对
            {
                //规则判断
                if (objNextTouPao.bState) {

                } else {
                    if (!this.IsSameCardType(cbFirstType, cbNextType) || (cbFirstCount != cbNextCount)) return false;
                }
                //分析扑克
                var NextResult = GameDef.tagAnalyseResult();
                var FirstResult = GameDef.tagAnalyseResult();
                this.AnalyseCardData(cbNextCard, cbNextCount, NextResult);
                this.AnalyseCardData(cbFirstCard, cbFirstCount, FirstResult);
                //获取数值
                var cbNextLogicValue = this.GetCardLogicValue(NextResult.cbCardData[2][0]);
                var cbFirstLogicValue = this.GetCardLogicValue(FirstResult.cbCardData[2][0]);
                //对比扑克
                if (NextResult.cbBlockCount[2] != FirstResult.cbBlockCount[2]) return false;
                if (cbNextLogicValue > cbFirstLogicValue) {
                    /* // 对比带牌
                    return this.CompareTakeCard(cbFirstCard, cbNextCard, cbFirstCount, cbNextCount);
                    // */
                    return true;
                } else {
                    return false;
                }
            }
            // /* 屏蔽4带类型
            case GameDef.CT_4_TAKE_1_1: // 四带一单
            case GameDef.CT_4_TAKE_1_3: // 四带三单
            case GameDef.CT_4_TAKE_2_1: // 四带二单
            case GameDef.CT_4_TAKE_3_1: // 四带三单
            case GameDef.CT_4_TAKE_4_1: // 四带四单
            case GameDef.CT_4_TAKE_1_2: // 四带一对
            case GameDef.CT_4_TAKE_2_2: // 四带二对
            {
                //规则判断
                if (objNextTouPao.bState && GameDef.IsAllowTakeLittle(this.m_dwRules)) {
                    // if (cbNextCount > cbFirstCount) return false;
                } else {
                    if (!this.IsSameCardType(cbFirstType, cbNextType) || (cbFirstCount != cbNextCount)) return false;
                }
                //分析扑克
                var NextResult = GameDef.tagAnalyseResult();
                var FirstResult = GameDef.tagAnalyseResult();
                this.AnalyseCardData(cbNextCard, cbNextCount, NextResult);
                this.AnalyseCardData(cbFirstCard, cbFirstCount, FirstResult);
                //获取数值
                var cbNextLogicValue = this.GetCardLogicValue(NextResult.cbCardData[3][0]);
                var cbFirstLogicValue = this.GetCardLogicValue(FirstResult.cbCardData[3][0]);
                //对比扑克
                if (NextResult.cbBlockCount[3] != FirstResult.cbBlockCount[3]) return false;
                if (cbNextLogicValue > cbFirstLogicValue) {
                    /* // 对比带牌
                    return this.CompareTakeCard(cbFirstCard, cbNextCard, cbFirstCount, cbNextCount);
                    // */
                    return true;
                } else {
                    return false;
                }

            }
            // */ 屏蔽4带类型
        }

        return false;
    },

    //分析扑克
    AnalyseCardData: function (cbCardData, cbCardCount, AnalyseResult) {
        AnalyseResult.cbKingCount = 0;
        //设置结果
        for (var i = 0; i < 4; i++) {
            AnalyseResult.cbBlockCount[i] = 0;
            for (var j = 0; j < GameDef.MAX_CARD_COUNT; j++) {
                AnalyseResult.cbCardData[i][j] = 0;
            }
        }

        //扑克分析
        for (var i = 0; i < cbCardCount; i++) {
            if(!cbCardData[i]) break;
            //变量定义
            var cbSameCount = 1;
            var cbCardValueTemp = 0;
            var cbLogicValue = this.GetCardLogicValue(cbCardData[i]);
            if (this.GetCardColor(cbCardData[i]) == 0x40) AnalyseResult.cbKingCount++;
            //搜索同牌
            for (var j = i + 1; j < cbCardCount; j++) {
                //获取扑克
                if (this.GetCardLogicValue(cbCardData[j]) != cbLogicValue) break;
                if(!cbCardData[j]) break;

                //设置变量
                cbSameCount++;
            }

            //设置结果
            var cbIndex = AnalyseResult.cbBlockCount[cbSameCount - 1]++;
            for (var j = 0; j < cbSameCount; j++)
                AnalyseResult.cbCardData[cbSameCount - 1][cbIndex * cbSameCount + j] = cbCardData[i + j];

            //设置索引
            i += cbSameCount - 1;
        }

        return;
    },

    //分析分布
    AnalysebDistributing: function (cbCardData, cbCardCount, Distributing) {
        //设置变量
        Distributing.cbCardCount = 0;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 6; j++) {
                Distributing.cbDistributing[i][j] = 0;
            }
        }

        //设置变量
        for (var i = 0; i < cbCardCount; i++) {
            if (cbCardData[i] == 0) continue;

            //获取属性
            var cbCardColor = this.GetCardColor(cbCardData[i]);
            var cbCardValue = this.GetCardValue(cbCardData[i]);

            //分布信息
            Distributing.cbCardCount++;
            Distributing.cbDistributing[cbCardValue - 1][g_cbIndexCount]++;
            Distributing.cbDistributing[cbCardValue - 1][cbCardColor >> 4]++;
        }

        return;
    },

    // 过滤结果
    FiltrationSearchOut: function (pSearchCardResult, cbResultCountParama, bFirstOutCard, bNextSingle, cbLeftMaxCard, cbHandCard, cbHandCount) {
        if (cbResultCountParama <= 1) return cbResultCountParama;
        var cbResultCount = cbResultCountParama;

        // 校验牌型
        var objTouPaoState = new Object();
        for (var i = cbResultCount - 1; i >= 0; --i) {
            if(this.GetCardType(pSearchCardResult.cbResultCard[i], pSearchCardResult.cbCardCount[i], objTouPaoState, cbHandCard, cbHandCount) == GameDef.CT_ERROR) {
                pSearchCardResult.cbCardCount.splice(i, 1);
                pSearchCardResult.cbResultCard.splice(i, 1);
                --cbResultCount;
            }
        }

        // 首出牌过滤
        if (bFirstOutCard) {
            for (var i = cbResultCount - 1; i >= 0; --i) {
                if (!this.HasFirstOutCard(pSearchCardResult.cbResultCard[i], pSearchCardResult.cbResultCard[i].length)) {
                    pSearchCardResult.cbCardCount.splice(i, 1);
                    pSearchCardResult.cbResultCard.splice(i, 1);
                    --cbResultCount;
                }
            }
        }

        // 下家报单过滤
        if (!bNextSingle/*  || !cbLeftMaxCard */) return cbResultCount;
        // 判断最大
        var cbMaxValue = this.GetCardLogicValue(pSearchCardResult.cbResultCard[0][0]);
        for (var i = cbResultCount - 1; i >= 0; --i) {
            var cbTemp = this.GetCardLogicValue(pSearchCardResult.cbResultCard[i][0]);
            if (cbTemp > cbMaxValue) cbMaxValue = cbTemp;
        }

        if(cbLeftMaxCard) var cbLeftMaxValue = this.GetCardLogicValue(cbLeftMaxCard);
        // if(cbMaxValue > cbLeftMaxValue) cbMaxValue = cbLeftMaxValue;

        if (cbLeftMaxCard && cbMaxValue >= cbLeftMaxValue) {
            // 删除最大以外的单牌结果
            for (var i = cbResultCount - 1; i >= 0; --i) {
                if (pSearchCardResult.cbCardCount[i] > 1) continue;
                if (this.GetCardLogicValue(pSearchCardResult.cbResultCard[i][0]) < cbLeftMaxValue) {
                    pSearchCardResult.cbCardCount.splice(i, 1);
                    pSearchCardResult.cbResultCard.splice(i, 1);
                    --cbResultCount;
                }
            }
        } else {
            // 删除最大以外的单牌结果（有其他牌型就删除所有单牌结果）
            var bHasOther = false;
            // for (var i = cbResultCount - 1; i >= 0; --i) {
            //     if (pSearchCardResult.cbCardCount[i] > 1) bHasOther = true;
            // }
            for (var i = cbResultCount - 1; i >= 0; --i) {
                if (pSearchCardResult.cbCardCount[i] > 1) continue;
                if (bHasOther || (this.GetCardLogicValue(pSearchCardResult.cbResultCard[i][0]) < cbMaxValue)) {
                    pSearchCardResult.cbCardCount.splice(i, 1);
                    pSearchCardResult.cbResultCard.splice(i, 1);
                    --cbResultCount;
                }
            }
        }

        return cbResultCount;
    },

    //炸弹搜索
    SearchOutBomb:function(cbCardData,cbCardCount){
        var cbBombdata = new Array();
        var cbBombCount = 0;
        var AnalyseResult = GameDef.tagAnalyseResult();
        this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);
        //三A搜索
        if(GameDef.IsAllowBomb_AAA(this.m_dwRules)){
            for(var i = 0; i< AnalyseResult.cbBlockCount[2]*3; i++){
                if(this.GetCardValue(AnalyseResult.cbCardData[2][i]) == 1)  cbBombdata[i] = AnalyseResult.cbCardData[2][i];
            }
        }
        cbBombCount = cbBombdata.length;
        //四张搜索
        var cbIndex = AnalyseResult.cbBlockCount[3];
        if(cbIndex==0) return cbBombdata;
        for(var i = 0; i< (cbIndex*4+cbBombCount); ++i){
            cbBombdata[i+cbBombCount] = AnalyseResult.cbCardData[3][i];
        }

        return cbBombdata;
    },

    //删除炸弹
    RemoveBomb: function(cbCardData,cbCardCount){
        var cbBombdata = this.SearchOutBomb(cbCardData,cbCardCount);
        var cbBombCount = cbBombdata.length;
        this.RemoveCardList(cbBombdata,cbBombCount,cbCardData,cbCardCount);
        return cbBombCount;
    },

    //出牌搜索
    SearchOutCard: function (cbCardDataParam, cbCardCountParam, cbTurnCardParam, cbTurnCountParam, pSearchCardResult, bMustOutFirstCard, bNextSingle, cbLeftMaxCard) {
        //设置结果
        if (pSearchCardResult == null) return 0;

        // 屏蔽最大提示
        cbLeftMaxCard = 0;

        pSearchCardResult.cbSearchCount = 0;
        for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
            pSearchCardResult.cbCardCount[i] = 0;
            for (var j = 0; j < GameDef.MAX_CARD_COUNT; j++) {
                pSearchCardResult.cbResultCard[i][j] = 0;
            }
        }

        //变量定义
        var cbResultCount = 0;
        var tmpSearchCardResult = GameDef.tagSearchCardResult()
        var objTouPaoState = new Object();

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount = cbCardCountParam;
        for (var i = 0; i < cbCardCountParam; i++) {
            cbCardData[i] = cbCardDataParam[i];
        }

        //排列扑克
        this.SortCardList(cbCardData, cbCardCount);
        if (cbTurnCountParam > 0) this.SortOutCardList(cbTurnCardParam, cbTurnCountParam);
        //出牌接牌判断
        var cbTurnUser = 0;
        if(cbTurnCountParam == 0){
            cbTurnUser = 1;//出牌
        }else{
            cbTurnUser = 2;//接牌
        }
        //获取类型
        var cbTurnOutType = this.GetCardType(cbTurnCardParam, cbTurnCountParam);
        //出牌分析
        switch (cbTurnOutType) {
        case GameDef.CT_ERROR: //错误类型
            {
                var Distributing = GameDef.tagDistributing();
                this.AnalysebDistributing(cbCardData, cbCardCount, Distributing);

                //是否一手出完
                if(cbCardCount < GameDef.GetMaxCardCount(this.m_dwRules)) {
                    var cbType = this.GetCardType(cbCardData, cbCardCount, objTouPaoState, cbCardData, cbCardCount,cbTurnUser);
                    if (cbType != GameDef.CT_ERROR && !GameDef.IsAllowBombBreak(this.m_dwRules)) {
                        pSearchCardResult.cbCardType[cbResultCount] = cbType;
                        pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                        for (var i = 0; i < cbCardCount; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                        }
                        cbResultCount++;
                        pSearchCardResult.cbSearchCount = cbResultCount;
                        return cbResultCount;
                    }
                }




                //炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }

                // 搜索单牌 对子 从小到大的顺序
                for (var i = cbCardCount - 1; i >= 0;) {
                    var cbTempIndex = 0;
                    pSearchCardResult.cbResultCard[cbResultCount][cbTempIndex++] = cbCardData[i];
                    var cbTempValue = this.GetCardValue(cbCardData[i]);
                    var cbCount = 1;
                    for (var j = i - 1; j >= 0; --j) {
                        if (cbTempValue != this.GetCardValue(cbCardData[j])) break;
                        pSearchCardResult.cbResultCard[cbResultCount][cbTempIndex++] = cbCardData[j];
                        cbCount++;
                    }
                    if (cbCount < 3) {
                        pSearchCardResult.cbCardType[cbResultCount] = (cbCount == 1 ? GameDef.CT_SINGLE : GameDef.CT_DOUBLE);
                        pSearchCardResult.cbCardCount[cbResultCount] = cbCount;
                        console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(pSearchCardResult.cbCardType[cbResultCount]));
                        cbResultCount++;
                    } else {
                        pSearchCardResult.cbResultCard[cbResultCount].fill(0);
                    }
                    i -= cbCount;
                }

                //三条
                if (GameDef.CheckAllowTakeCard(this.m_dwRules,3, 0, 0,objTouPaoState.bState,cbTurnUser)) {
                    var cbTmpCount = this.SearchSameCard(cbCardData, cbCardCount, 0, 3, tmpSearchCardResult);
                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardType[cbResultCount] = GameDef.CT_THREE;
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        cbResultCount++;
                    }
                }

                //单连
                if(1) {
                    var cbTmpCount = this.SearchLineCardType(cbCardData, cbCardCount, 0, 1, 0, tmpSearchCardResult, (bMustOutFirstCard ? this.m_cbFirstOutCard : 0));

                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardType[cbResultCount] = GameDef.CT_SINGLE_LINE;
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(pSearchCardResult.cbCardType[cbResultCount]));
                        cbResultCount++;
                    }
                }
                //连对
                if(1) {
                    var cbTmpCount = this.SearchLineCardType(cbCardData, cbCardCount, 0, 2, 0, tmpSearchCardResult, (bMustOutFirstCard ? this.m_cbFirstOutCard : 0));
                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardType[cbResultCount] = GameDef.CT_DOUBLE_LINE;
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(pSearchCardResult.cbCardType[cbResultCount]));
                        cbResultCount++;
                    }
                }

                //三连
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 0, 0,objTouPaoState.bState,cbTurnUser)) {
                    var cbTmpCount = this.SearchLineCardType(cbCardData, cbCardCount, 0, 3, 0, tmpSearchCardResult, (bMustOutFirstCard ? this.m_cbFirstOutCard : 0));
                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardType[cbResultCount] = GameDef.CT_THREE_LINE;
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(pSearchCardResult.cbCardType[cbResultCount]));
                        cbResultCount++;
                    }
                }

                var cbSearchType = new Array();
                var cbSearchTypeCnt = 0;
                var cbSearchLineCnt = new Array();
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 1, 1,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_3_TAKE_1_1; } // 三带一单
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 2, 1,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_3_TAKE_2_1; } // 三带二单
                // if (GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 1, 2)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_3_TAKE_1_2; } // 三带一对
                // if (GameDef.CheckAllowTakeCard(this.m_dwRules, 3, 2, 2)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_3_TAKE_2_2; } // 三带二对
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 1, 1,objTouPaoState.bState,cbTurnUser)){ cbSearchLineCnt[cbSearchTypeCnt] = 2; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_AIRPLANE_TAKE_1_1; } // 飞机带1单GameDef.
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 2, 1,objTouPaoState.bState,cbTurnUser)){ cbSearchLineCnt[cbSearchTypeCnt] = 2; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_AIRPLANE_TAKE_2_1; } // 飞机带2单GameDef.
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 3, 1,objTouPaoState.bState,cbTurnUser)){ cbSearchLineCnt[cbSearchTypeCnt] = 2; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_AIRPLANE_TAKE_3_1; } // 飞机带3单GameDef.
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 6, 2, 2,objTouPaoState.bState,cbTurnUser)){ cbSearchLineCnt[cbSearchTypeCnt] = 2; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_AIRPLANE_TAKE_2_2; } // 飞机带2对GameDef.
                // { cbSearchLineCnt[cbSearchTypeCnt] = 2; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_AIRPLANE_TAKE_1_2; } // 飞机带1对GameDef.
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 1,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_1_1; } // 四带一单
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 3,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_1_3; } // 四带三单
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 2, 1,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_2_1; } // 四带二单
                if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 3, 1,objTouPaoState.bState,cbTurnUser)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_3_1; } // 四带三单
		        //if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 4, 1)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_4_1; } // 四带四单
                // if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 2)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_1_2; } // 四带一对
                //if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 2, 2)) { cbSearchLineCnt[cbSearchTypeCnt] = 1; cbSearchType[cbSearchTypeCnt++] = GameDef.CT_4_TAKE_2_2; } // 四带二对
                for (var i = 0; i < cbSearchTypeCnt; ++i) {
                    if (cbCardCount <= this.GetTakeCardSameCount(cbSearchType[i])) continue;
                    var cbTmpCount = this._SearchTakeCard(tmpSearchCardResult, cbCardData, cbCardCount, 0, cbSearchLineCnt[i], cbSearchType[i], 0, (bMustOutFirstCard ? this.m_cbFirstOutCard : 0));
                    for(var j = 0; j < cbTmpCount; ++ j) {
                        console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(cbSearchType[i]));
                        pSearchCardResult.cbCardType[cbResultCount] = cbSearchType[i];
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[j];
                        for (var k = 0; k < tmpSearchCardResult.cbCardCount[j]; k++) {
                            pSearchCardResult.cbResultCard[cbResultCount][k] = tmpSearchCardResult.cbResultCard[j][k];
                        }
                        cbResultCount++;
                    }
                }

                if (cbResultCount == 0) {
                    // 搜索3张 拆分成单张
                    for (var j = 0; j < GameDef.MAX_CARD_INDEX; j++) {
                        var cbIndex = (j + 2) % GameDef.MAX_CARD_INDEX;
                        if (Distributing.cbDistributing[cbIndex][g_cbIndexCount] != 3) continue;
                        var cbTempIndex = 0;
                        for (var k = 0; k < g_cbIndexCount; k++) {
                            if (Distributing.cbDistributing[cbIndex][k] == 0) continue;
                            var cbTempCard = this.MakeCardData(cbIndex, k);
                            pSearchCardResult.cbResultCard[cbResultCount][cbTempIndex++] = cbTempCard;
                            pSearchCardResult.cbCardType[cbResultCount] = GameDef.CT_SINGLE;
                            pSearchCardResult.cbCardCount[cbResultCount] = 1;
                            cbResultCount++;
                        }
                    }
                }

                 //炸弹不可拆且允許4帶3 將四帶情況添加進去
                 if(!GameDef.IsAllowBombBreak(this.m_dwRules) && GameDef.IsAllow_4_Take_3_1(this.m_dwRules)){
                    var cbSearchType1 = new Array();
                    var cbSearchTypeCnt1 = 0;
                    var cbSearchLineCnt1 = new Array();
                    if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 1, 3,objTouPaoState,cbTurnUser)) { cbSearchLineCnt1[cbSearchTypeCnt1] = 1; cbSearchType1[cbSearchTypeCnt1++] = GameDef.CT_4_TAKE_1_3; } // 四带三单
                    if (GameDef.CheckAllowTakeCard(this.m_dwRules, 4, 3, 1,objTouPaoState,cbTurnUser)) { cbSearchLineCnt1[cbSearchTypeCnt1] = 1; cbSearchType1[cbSearchTypeCnt1++] = GameDef.CT_4_TAKE_3_1; } // 四带三单
                    //构造扑克
                    var cbCardData = new Array();
                    var cbCardCount = cbCardCountParam;
                    for (var i = 0; i < cbCardCountParam; i++) {
                        cbCardData[i] = cbCardDataParam[i];
                    }
                    for (var i = 0; i < cbSearchTypeCnt1; ++i) {
                        if (cbCardCount <= this.GetTakeCardSameCount(cbSearchType1[i])) continue;
                        var cbTmpCount = this._SearchTakeCard(tmpSearchCardResult, cbCardData, cbCardCount, 0, cbSearchLineCnt1[i], cbSearchType1[i], 0, (bMustOutFirstCard ? this.m_cbFirstOutCard : 0));
                        for(var j = 0; j < cbTmpCount; ++ j) {
                            console.log(' !!! 搜索到牌型：' + cbResultCount + ' ' + GameDef.GetCardTypeName(cbSearchType1[i]));
                            pSearchCardResult.cbCardType[cbResultCount] = cbSearchType1[i];
                            pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[j];
                            for (var k = 0; k < tmpSearchCardResult.cbCardCount[j]; k++) {
                                pSearchCardResult.cbResultCard[cbResultCount][k] = tmpSearchCardResult.cbResultCard[j][k];
                            }
                            cbResultCount++;
                        }
                    }
                }

                cbResultCount = this.FiltrationSearchOut(pSearchCardResult, cbResultCount, bMustOutFirstCard, bNextSingle, cbLeftMaxCard, cbCardData, cbCardCount);
                pSearchCardResult.cbSearchCount = cbResultCount;
                return cbResultCount;
            }
        case GameDef.CT_SINGLE: //单牌类型
            {
                // 炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }
                //变量定义
                var cbReferCard = cbTurnCardParam[0];
                //搜索相同牌
                cbResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, 1, pSearchCardResult);
                cbResultCount = this.FiltrationSearchOut(pSearchCardResult, cbResultCount, bMustOutFirstCard, bNextSingle, cbLeftMaxCard, cbCardData, cbCardCount);
                break;
            }
        case GameDef.CT_DOUBLE: //对牌类型
        case GameDef.CT_THREE: //三条类型
        case GameDef.CT_FOUR: //四条类型
            {
                // 炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }
                //变量定义
                var cbReferCard = cbTurnCardParam[0];
                var cbSameCount = 1;
                if (cbTurnOutType == GameDef.CT_DOUBLE) cbSameCount = 2;
                else if (cbTurnOutType == GameDef.CT_THREE) cbSameCount = 3;
                else if (cbTurnOutType == GameDef.CT_FOUR) cbSameCount = 4;

                //搜索相同牌
                cbResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, cbSameCount, pSearchCardResult);
                break;
            }
        case GameDef.CT_SINGLE_LINE: //单连类型
        case GameDef.CT_DOUBLE_LINE: //对连类型
        case GameDef.CT_THREE_LINE: //三连类型
            {
                // 炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }
                //变量定义
                var cbBlockCount = 1;
                if (cbTurnOutType == GameDef.CT_DOUBLE_LINE) cbBlockCount = 2;
                else if (cbTurnOutType == GameDef.CT_THREE_LINE) cbBlockCount = 3;
                var cbLineCount = cbTurnCountParam / cbBlockCount;
                //搜索边牌
                cbResultCount = this.SearchLineCardType(cbCardData, cbCardCount, cbTurnCardParam[0], cbBlockCount, cbLineCount, pSearchCardResult);
                break;
            }
        case GameDef.CT_3_TAKE_1_1: // 三带一单
        case GameDef.CT_3_TAKE_2_1: // 三带二单
        case GameDef.CT_3_TAKE_1_2: // 三带一对
        case GameDef.CT_3_TAKE_2_2: // 三带二对
            {
                // 炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }
                // 搜索偷跑 是否一手出完
                if (GameDef.IsAllow_3_JoinLittle(this.m_dwRules) && this.CompareCard(cbTurnCardParam, cbCardData, cbCardData, cbTurnCountParam, cbCardCount, cbCardCount,cbTurnUser)) {
                    var objTempTPS = new Object();
                    cbType = this.GetCardType(cbCardData, cbCardCount, objTempTPS, cbCardData, cbCardCount,cbTurnUser);
                    if (cbType != GameDef.CT_ERROR) {
                        pSearchCardResult.bTouPaoState[cbResultCount] = objTempTPS.bState;
                        pSearchCardResult.cbCardType[cbResultCount] = cbType;
                        pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                        for (var i = 0; i < cbCardCount; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                        }
                        cbResultCount++;
                        pSearchCardResult.cbSearchCount = cbResultCount;
                        return cbResultCount;
                    }
                }
            }
        case GameDef.CT_AIRPLANE_TAKE_1_1: // 飞机带1单
        case GameDef.CT_AIRPLANE_TAKE_1_2: // 飞机带对
        case GameDef.CT_AIRPLANE_TAKE_2_1: // 飞机带2单
	    case GameDef.CT_AIRPLANE_TAKE_3_1: // 飞机带3单
        case GameDef.CT_AIRPLANE_TAKE_2_2: // 飞机带2对
            {
                // 炸弹不可拆 删除炸弹类型数据
                if(!GameDef.IsAllowBombBreak(this.m_dwRules)){
                    var cbBombCount =  this.RemoveBomb(cbCardData,cbCardCount);
                    cbCardCount -= cbBombCount;
                }
                // 搜索偷跑 是否一手出完
                if (GameDef.IsAllow_F_JoinLittle(this.m_dwRules) && this.CompareCard(cbTurnCardParam, cbCardData, cbCardData, cbTurnCountParam, cbCardCount, cbCardCount,cbTurnUser)) {
                    var objTempTPS = new Object();
                    cbType = this.GetCardType(cbCardData, cbCardCount, objTempTPS, cbCardData, cbCardCount,cbTurnUser);
                    if (cbType != GameDef.CT_ERROR) {
                        pSearchCardResult.bTouPaoState[cbResultCount] = objTempTPS.bState;
                        pSearchCardResult.cbCardType[cbResultCount] = cbType;
                        pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                        for (var i = 0; i < cbCardCount; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                        }
                        cbResultCount++;
                        pSearchCardResult.cbSearchCount = cbResultCount;
                        return cbResultCount;
                    }
                }
            }
        case GameDef.CT_4_TAKE_1_1: // 四带一单
        case GameDef.CT_4_TAKE_1_3: // 四带三单
        case GameDef.CT_4_TAKE_2_1: // 四带二单
        case GameDef.CT_4_TAKE_3_1: // 四带三单
        case GameDef.CT_4_TAKE_4_1: // 四带四单
        case GameDef.CT_4_TAKE_1_2: // 四带一对
        case GameDef.CT_4_TAKE_2_2: // 四带二对
            {
                // 四带偷跑
                if (GameDef.IsAllowTakeLittle(this.m_dwRules) && this.CompareCard(cbTurnCardParam, cbCardData, cbCardData, cbTurnCountParam, cbCardCount, cbCardCount,cbTurnUser)) {
                    var objTempTPS = new Object();
                    var cbType = this.GetCardType(cbCardData, cbCardCount, objTempTPS, cbCardData, cbCardCount,cbTurnUser);
                    if (cbType != GameDef.CT_ERROR) {
                        pSearchCardResult.bTouPaoState[cbResultCount] = objTempTPS.bState;
                        pSearchCardResult.cbCardType[cbResultCount] = cbType;
                        pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                        for (var i = 0; i < cbCardCount; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                        }
                        cbResultCount++;
                        pSearchCardResult.cbSearchCount = cbResultCount;
                        return cbResultCount;
                    }
                }
                //效验牌数
                if (cbCardCount < cbTurnCountParam) break;
                cbResultCount = this._SearchTakeCard1(pSearchCardResult, cbCardData, cbCardCount, cbTurnCardParam, cbTurnCountParam);
                break;
            }
        }

        if(GameDef.IsAllowBomb(this.m_dwRules) && (cbTurnOutType != GameDef.CT_MISSILE_CARD)) {
            //构造扑克
            var cbCardData = new Array();
            var cbCardCount = cbCardCountParam;
            for (var i = 0; i < cbCardCountParam; i++) {
                cbCardData[i] = cbCardDataParam[i];
            }
            //搜索炸弹
            if ((cbCardCount >= GameDef.MAX_SAME_COUNT)) {
                //变量定义
                var cbReferCard = 0;
                if (cbTurnOutType == GameDef.CT_BOMB_CARD) cbReferCard = cbTurnCardParam[0];
                //搜索炸弹
                var cbTmpResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, GameDef.MAX_SAME_COUNT, tmpSearchCardResult);
                for (var i = 0; i < cbTmpResultCount; i++) {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
                    for (var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++) {
                        pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
                    }
                    cbResultCount++;
                }
            }

            // 搜索3A炸弹
            if(GameDef.IsAllowBomb_AAA(this.m_dwRules) && cbCardCount >= 3) {
                var cbReferCard = 0x0D;
                var cbTmpResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, 3, tmpSearchCardResult);
                for (var i = 0; i < cbTmpResultCount; i++) {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
                    for (var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++) {
                        pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
                    }
                    cbResultCount++;
                }
            }
            // 搜索三A带一炸弹
            if(GameDef.IsAllowBomb_AAA_Take_1_1(this.m_dwRules) && cbCardCount > 3) {
                var cbReferCard = 0x0D;
                var cbTmpResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, 3, tmpSearchCardResult);

                if(cbTmpResultCount > 0) {
                    for (var i = 0; i < cbTmpResultCount; i++) {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
                        for (var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++) {
                            pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
                        }
                    }
                    cbTmpResultCount = this.SearchSameCard(cbCardData, cbCardCount, 0, 1, tmpSearchCardResult);
                    if(cbTmpResultCount > 0) {
                        pSearchCardResult.cbCardCount[cbResultCount] = 4;
                        pSearchCardResult.cbResultCard[cbResultCount][3] = tmpSearchCardResult.cbResultCard[0][0];
                    }
                    cbResultCount++;
                }

            }

            //搜索火箭
            if ((cbCardCount >= 2) && (cbCardData[0] == 0x4F) && (cbCardData[1] == 0x4E)) {
                //设置结果
                pSearchCardResult.cbCardCount[cbResultCount] = 2;
                pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[0];
                pSearchCardResult.cbResultCard[cbResultCount][1] = cbCardData[1];
                cbResultCount++;
            }
        }

        cbResultCount = this.FiltrationSearchOut(pSearchCardResult, cbResultCount, bMustOutFirstCard, bNextSingle, cbLeftMaxCard, cbCardData, cbCardCount);
        pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    //同牌搜索
    SearchSameCard: function (cbCardDataParam, cbCardCountParam, cbReferCard, cbSameCardCount, pSearchCardResult) {
        //设置结果
        if (pSearchCardResult) {
            pSearchCardResult.cbSearchCount = 0;
            for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
                pSearchCardResult.cbCardCount[i] = 0;
                for (var j = 0; j < GameDef.MAX_CARD_COUNT; j++) {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        }
        var cbResultCount = 0;

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount = cbCardCountParam;
        for (var i = 0; i < cbCardCountParam; i++) {
            cbCardData[i] = cbCardDataParam[i];
        }

        //排列扑克
        this.SortCardList(cbCardData, cbCardCount);

        //分析扑克
        var AnalyseResult = GameDef.tagAnalyseResult();
        this.AnalyseCardData(cbCardData, cbCardCount, AnalyseResult);

        var cbReferLogicValue = cbReferCard == 0 ? 0 : this.GetCardLogicValue(cbReferCard);
        var cbBlockIndex = cbSameCardCount - 1;
        do {
            for (var i = 0; i < AnalyseResult.cbBlockCount[cbBlockIndex]; i++) {
                var cbIndex = (AnalyseResult.cbBlockCount[cbBlockIndex] - i - 1) * (cbBlockIndex + 1);
                if (this.GetCardLogicValue(AnalyseResult.cbCardData[cbBlockIndex][cbIndex]) > cbReferLogicValue) {
                    if (pSearchCardResult == null) return 1;

                    if (cbResultCount >= pSearchCardResult.cbCardCount.length) return;

                    //复制扑克
                    for (var j = 0; j < cbSameCardCount; ++j) {
                        pSearchCardResult.cbResultCard[cbResultCount][j] = AnalyseResult.cbCardData[cbBlockIndex][cbIndex + j];
                    }
                    pSearchCardResult.cbCardCount[cbResultCount] = cbSameCardCount;

                    cbResultCount++;
                }
            }

            cbBlockIndex++;
        } while (cbBlockIndex < AnalyseResult.cbBlockCount.length);

        if (pSearchCardResult) pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    //连牌搜索
    SearchLineCardType: function (cbCardDataParam, cbCardCountParam, cbReferCard, cbBlockCount, cbLineCount, pSearchCardResult, cbMustTakeCard) {
        //设置结果
        if (pSearchCardResult) {
            pSearchCardResult.cbSearchCount = 0;
            for (var i = 0; i < GameDef.MAX_CARD_COUNT; i++) {
                pSearchCardResult.cbCardCount[i] = 0;
                for (var j = 0; j < GameDef.MAX_CARD_COUNT; j++) {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        }
        var cbResultCount = 0;

        //定义变量
        var cbLessLineCount = 0;
        if (cbLineCount == 0) {
            if (cbBlockCount == 1) cbLessLineCount = GameDef.MIN_STRAIGHT_COUNT_1;
            else if (cbBlockCount == 2) cbLessLineCount = GameDef.MIN_STRAIGHT_COUNT_2;
            else cbLessLineCount = 2;
        } else cbLessLineCount = cbLineCount;

        var cbReferIndex = 2;
        if (cbReferCard != 0) {
            if (this.GetCardLogicValue(cbReferCard) - cbLessLineCount < 2) return;
            cbReferIndex = this.GetCardLogicValue(cbReferCard) - cbLessLineCount + 1;
        }
        //超过A
        if (cbReferIndex + cbLessLineCount > 14) return cbResultCount;

        //长度判断
        if (cbCardCountParam < cbLessLineCount * cbBlockCount) return cbResultCount;

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount = cbCardCountParam;
        for (var i = 0; i < cbCardCountParam; i++) {
            cbCardData[i] = cbCardDataParam[i];
        }

        //排列扑克
        this.SortCardList(cbCardData, cbCardCount);

        //分析扑克
        var Distributing = GameDef.tagDistributing();
        this.AnalysebDistributing(cbCardData, cbCardCount, Distributing);

        //搜索顺子
        var cbTmpLinkCount = 0;
        for (var cbValueIndex = cbReferIndex; cbValueIndex < 13; cbValueIndex++) {
            //继续判断
            if (Distributing.cbDistributing[cbValueIndex][g_cbIndexCount] < cbBlockCount) {
                if (cbTmpLinkCount < cbLessLineCount) {
                    cbTmpLinkCount = 0;
                    continue;
                } else cbValueIndex--;
            } else {
                cbTmpLinkCount++;
                //寻找最长连
                if (cbLineCount == 0) continue;
            }

            if (cbTmpLinkCount >= cbLessLineCount) {
                if (pSearchCardResult == null) return 1;

                if (cbResultCount >= pSearchCardResult.cbCardCount.length) return;

                //复制扑克
                var cbCount = 0;
                for (var cbIndex = cbValueIndex + 1 - cbTmpLinkCount; cbIndex <= cbValueIndex; cbIndex++) {
                    var cbTmpCount = 0;
                    for (var cbColorIndex = 0; cbColorIndex < 4; cbColorIndex++) {
                        for (var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3 - cbColorIndex]; cbColorCount++) {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = this.MakeCardData(cbIndex, 3 - cbColorIndex);

                            if (++cbTmpCount == cbBlockCount) break;
                        }
                        if (cbTmpCount == cbBlockCount) break;
                    }
                }

                //设置变量
                pSearchCardResult.cbCardCount[cbResultCount] = cbCount;

                // 替换必带牌
                if(cbMustTakeCard) {
                    var bHas = false;
                    for (var j = 0; j < cbCount; ++j) {
                        if(pSearchCardResult.cbResultCard[cbResultCount][j] == cbMustTakeCard) bHas = true;
                    }
                    if(!bHas) {
                        var cbMustValue = this.GetCardValue(cbMustTakeCard);
                        for (var j = 0; j < cbCount; ++j) {
                            if(this.GetCardValue(pSearchCardResult.cbResultCard[cbResultCount][j]) == cbMustValue) {
                                pSearchCardResult.cbResultCard[cbResultCount][j] = cbMustTakeCard;
                                break;
                            }
                        }
                    }
                }

                cbResultCount++;

                if (cbLineCount != 0) {
                    cbTmpLinkCount--;
                } else {
                    cbTmpLinkCount = 0;
                }
            }
        }

        //特殊顺子
        if (cbTmpLinkCount >= cbLessLineCount - 1 && cbValueIndex == 13) {
            if (Distributing.cbDistributing[0][g_cbIndexCount] >= cbBlockCount ||
                cbTmpLinkCount >= cbLessLineCount) {
                if (pSearchCardResult == null) return 1;

                if (cbResultCount >= pSearchCardResult.cbCardCount.length);

                //复制扑克
                var cbCount = 0;
                var cbTmpCount = 0;
                for (var cbIndex = cbValueIndex - cbTmpLinkCount; cbIndex < 13; cbIndex++) {
                    cbTmpCount = 0;
                    for (var cbColorIndex = 0; cbColorIndex < 4; cbColorIndex++) {
                        for (var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3 - cbColorIndex]; cbColorCount++) {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = this.MakeCardData(cbIndex, 3 - cbColorIndex);

                            if (++cbTmpCount == cbBlockCount) break;
                        }
                        if (cbTmpCount == cbBlockCount) break;
                    }
                }
                //复制A
                if (Distributing.cbDistributing[0][g_cbIndexCount] >= cbBlockCount) {
                    cbTmpCount = 0;
                    for (var cbColorIndex = 0; cbColorIndex < 4; cbColorIndex++) {
                        for (var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[0][3 - cbColorIndex]; cbColorCount++) {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = this.MakeCardData(0, 3 - cbColorIndex);

                            if (++cbTmpCount == cbBlockCount) break;
                        }
                        if (cbTmpCount == cbBlockCount) break;
                    }
                }

                //设置变量
                pSearchCardResult.cbCardCount[cbResultCount] = cbCount;

                // 替换必带牌
                if(cbMustTakeCard) {
                    var bHas = false;
                    for (var j = 0; j < cbCount; ++j) {
                        if(pSearchCardResult.cbResultCard[cbResultCount][j] == cbMustTakeCard) bHas = true;
                    }
                    if(!bHas) {
                        var cbMustColor = this.GetCardColor(cbMustTakeCard) >> 4;
                        var cbMustValue = this.GetCardValue(cbMustTakeCard);
                        var cbMustLogicValue = this.GetCardLogicValue(cbMustTakeCard);
                        for (var j = 0; j < cbCount; ++j) {
                            if(this.GetCardValue(pSearchCardResult.cbResultCard[cbResultCount][j]) == cbMustValue) {
                                pSearchCardResult.cbResultCard[cbResultCount][j] = cbMustTakeCard;
                                break;
                            }
                        }
                    }
                }

                cbResultCount++;
            }
        }

        if (pSearchCardResult) pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    // 搜索带牌
    _SearchTakeCard: function (pSearchCardResult, cbCardDataParam, cbCardCount, cbReferCardParam, cbLineCount, cbCardType, cbReferTakeCard, cbMustTakeCard) {
        pSearchCardResult.cbSearchCount = 0; //搜索数目
        pSearchCardResult.cbCardCount = new Array(); //扑克数目
        pSearchCardResult.cbCardType = new Array(); //扑克类型
        pSearchCardResult.cbResultCard = new Array(); //扑克数据
        for (var i = 0; i < 50 ; i++) {
            pSearchCardResult.cbResultCard[i] = new Array();
        }

        // 复制扑克
        var cbCardData = clone(cbCardDataParam);
        var cbReferCard = clone(cbReferCardParam);
        if(!Array.isArray(cbReferCardParam)) cbReferCard = [cbReferCardParam];

        // 判断3A炸弹
        if (GameDef.IsAllowBomb_AAA(this.m_dwRules) || GameDef.IsAllowBomb_AAA_Take_1_1(this.m_dwRules)) {
            var cbTemp = new Array();
            var cbCnt = 0;
            for (var i = 0; i < cbCardCount; ++i) {
                if (this.GetCardValue(cbCardData[i]) == 1) {
                    cbTemp.push(cbCardData[i]);
                }
            }
            if (cbTemp.length == 3) {
                this.RemoveCard(cbTemp, 3, cbCardData, cbCardCount);
                cbCardCount -= 3;
            }
        }


        // 变量定义
        var cbCount = 0;
        var cbResultCount = 0;
        var cbSameCount = this.GetTakeCardSameCount(cbCardType);
        var cbTakeTypeCount = this.GetTakeCardTypeCount(cbCardType);
        var cbTakeItemCount = this.GetTakeCardCountByCT(cbCardType);
        var cbTakeCount = cbTakeItemCount * cbTakeTypeCount;//cbLineCount *
        var SearchResult = GameDef.tagSearchCardResult();
        if (cbLineCount == 1) {
            cbCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard[0], cbSameCount, SearchResult);
        } else {
            this.SortOutCardList(cbReferCard, cbReferCard.length);
            cbCount = this.SearchLineCardType(cbCardData, cbCardCount, cbReferCard[0], cbSameCount, cbLineCount, SearchResult);
        }

        for (var i = 0; i < cbCount; ++i) {
            // 删除3张 留下备选带牌
            var cbTempCardData = clone(cbCardData);
            this.RemoveCardList(SearchResult.cbResultCard[i], SearchResult.cbCardCount[i], cbTempCardData, cbCardCount);
            //分析扑克
            var AnalyseResult = GameDef.tagAnalyseResult();
            this.AnalyseCardData(cbTempCardData, cbCardCount - cbSameCount * cbLineCount, AnalyseResult);
            var Distributing = GameDef.tagDistributing();
            this.AnalysebDistributing(cbTempCardData, cbCardCount - cbSameCount * cbLineCount, Distributing);
            var cbTempResultCard = new Array();
            var bMerge = false;
            var cbTempIndex = 0;

            for (var j = 0; j < GameDef.MAX_CARD_INDEX; j++) {
                var cbIndex = (j + 2) % GameDef.MAX_CARD_INDEX;
                var cbTempBlockCnt = 0;
                for (var k = 0; k < g_cbIndexCount; k++) {
                    if(Distributing.cbDistributing[cbIndex][g_cbIndexCount] == 4) continue;
                    if (Distributing.cbDistributing[cbIndex][k] == 0) continue;

                    if(cbCardType == GameDef.CT_3_TAKE_1_2 && Distributing.cbDistributing[cbIndex][g_cbIndexCount] < 2) continue;
                    if(cbCardType == GameDef.CT_AIRPLANE_TAKE_1_2 && Distributing.cbDistributing[cbIndex][g_cbIndexCount] < 2) continue;
                    if(cbCardType == GameDef.CT_3_TAKE_2_1 && cbTempBlockCnt >= 1) continue;
                    if(cbCardType == GameDef.CT_AIRPLANE_TAKE_2_1 && cbTempBlockCnt >= 1) continue;

                    var cbTempCard = this.MakeCardData(cbIndex, k);
                    var cbValueA = this.GetCardLogicValue(cbTempCard);
                    //过滤相同牌
                    var bSame = false;
                    for (var m = 0; m < SearchResult.cbCardCount[i]; ++m) {
                        if (cbValueA != this.GetCardLogicValue(SearchResult.cbResultCard[i][m])) continue;
                        bSame = true;
                        break;
                    }
                    if (bSame) continue;
                    // 比较带牌
                    if (cbReferTakeCard && cbReferTakeCount > 0) {
                        if (cbValueA <= this.GetCardLogicValue(cbReferTakeCard[0])) continue;
                    }

                    //复制带牌
                    for (var l = 0; l < Distributing.cbDistributing[cbIndex][k]; l++) {
                        cbTempResultCard[cbTempIndex++] = cbTempCard;
                    }
                    cbTempBlockCnt++;
                    if (cbTempIndex < cbTakeCount) continue;
                    //下一组合
                    bMerge = true;
                    break;
                }
                if (bMerge) break;
            }

            // 复制结果
            if (bMerge || cbTakeTypeCount == 0) {
                var cbSearchCount = pSearchCardResult.cbSearchCount;
                pSearchCardResult.cbResultCard[cbSearchCount] = clone(SearchResult.cbResultCard[i]);

                // 替换必带牌
                if(cbMustTakeCard) {
                    var bHas = false;
                    for (var j = 0; j < cbTempResultCard.length; ++j) {
                        if(cbTempResultCard[j] == cbMustTakeCard) bHas = true;
                    }
                    for(var j = 0; j < cbLineCount * cbSameCount; ++ j) {
                        if(SearchResult.cbResultCard[i][j] == cbMustTakeCard) bHas = true;
                    }

                    if(!bHas) {
                        this.SortCardList(cbTempResultCard, cbTempResultCard.length);

                        //分析扑克
                        var Distributing = GameDef.tagDistributing();
                        this.AnalysebDistributing(cbCardData, cbCardCount, Distributing);

                        var cbMustColor = this.GetCardColor(cbMustTakeCard) >> 4;
                        var cbMustValue = this.GetCardValue(cbMustTakeCard);
                        var cbMustLogicValue = this.GetCardLogicValue(cbMustTakeCard);

                        if (Distributing.cbDistributing[cbMustValue - 1][g_cbIndexCount] > 0) {
                            var bFlag = false;
                            for(var n in cbTempResultCard) {
                                if(cbMustLogicValue >= this.GetCardLogicValue(cbTempResultCard[n])) {
                                    cbTempResultCard[n] = cbMustTakeCard;
                                    bFlag = true;
                                    break;
                                }
                            }
                            if(!bFlag) {
                                cbTempResultCard[cbTempResultCard.length - 1] = cbMustTakeCard;
                            }
                        }
                    }
                }

                for (var j = 0; j < cbTempResultCard.length; ++j) {
                    pSearchCardResult.cbResultCard[cbSearchCount][cbLineCount * cbSameCount + j] = cbTempResultCard[j];
                }
                pSearchCardResult.cbCardType[cbSearchCount] = cbCardType;
                pSearchCardResult.cbCardCount[cbSearchCount] = cbLineCount * cbSameCount + cbTempResultCard.length;
                pSearchCardResult.cbSearchCount++;
                cbResultCount++;
            }
        }
        return cbResultCount;
    },

    // 搜索带牌
    _SearchTakeCard1: function(pSearchCardResult, cbCardDataParam, cbCardCountParam, cbTurnDataParam, cbTurnCountParam) {
        // 复制扑克
        var cbCardData = clone(cbCardDataParam);
        var cbReferCard = clone(cbTurnDataParam);
        // 分析扑克
        var pAnalyseTakeCard = GameDef.tagAnalyseTakeCardResult();
        this.AnalyseTakeCardData(cbReferCard, cbTurnCountParam, pAnalyseTakeCard);
        if(pAnalyseTakeCard.cbTakeTypeCount <= 0) return 0;
        var cbSameCount = this.GetTakeCardSameCount(pAnalyseTakeCard.cbCardType);
        return this._SearchTakeCard(pSearchCardResult, cbCardData, cbCardCountParam,
            pAnalyseTakeCard.AnalyseResult.cbCardData[cbSameCount-1], pAnalyseTakeCard.AnalyseResult.cbBlockCount[cbSameCount-1],
            pAnalyseTakeCard.cbCardType, /*pAnalyseTakeCard.cbTakeCardData,*/0
        );
    },

    TransformCardData: function (Distributing, cbCardData, cbCountArray) {
        cbCardData.fill(0);
        cbCountArray.fill(0);
        var cbCardCount = 0;
        var temp = 0;
        for (var i = 0; i < GameDef.MAX_CARD_INDEX; ++i) {
            for (var j = 0; j < 5; ++j) {
                for (var k = 0; k < Distributing.cbDistributing[i][j]; ++k) {
                    cbCardData[cbCardCount] = this.MakeCardData(j, i + 1);
                    cbCardCount++;
                }
                if (i < 0x0E - 1 && j < 4) { // A ~ K
                    cbCountArray[temp++] = Distributing.cbDistributing[i][j];
                } else if(i >= 0x0E - 1 && j >= 4) { // 大小王
                    cbCountArray[temp++] = Distributing.cbDistributing[i][j];
                }
            }
            // cbCountArray[i] = Distributing.cbDistributing[i][g_cbIndexCount];
        }
        return cbCardCount;
    },
});

// module.exports = CGameLogic;
GameLogic = null;
