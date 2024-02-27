//数值掩码
var LOGIC_MASK_COLOR = 0xF0;								//花色掩码
var LOGIC_MASK_VALUE = 0x0F;								//数值掩码

//////////////////////////////////////////////////////////////////////////////////
//分析结构
var tagAnalyseResult = cc.Class({
    ctor:function  () {
        this.cbKingCount = 0;
        this.cbBlockCount = new Array();					//扑克数目
        this.cbCardData = new Array();			            //扑克数据
        for(var i=0;i<4;i++)
        {
            this.cbCardData[i] = new Array();
        }
    }
});

//出牌结果
var tagOutCardResult = cc.Class({
    ctor:function  () {
        this.cbCardCount = 0				//扑克数目
        this.cbResultCard = new Array();			            //扑克数据
    }
});

//分布信息
var tagDistributing = cc.Class({
    ctor:function  () {
        this.cbCardCount = 0					//扑克数目
        this.cbDistributing = new Array();			            //扑克数据
        for(var i=0;i<15;i++)
        {
            this.cbDistributing[i] = new Array();
        }
    }
});



//索引变量
var cbIndexCount = 5;

var CGameLogic = cc.Class({

    ctor:function  () {
       this.m_cbCardData = new Array();
       this.m_dwRules = new Array(0,0,0,0,0);
    },

    SetRules: function (dwRule) {
        this.m_dwRules = dwRule;
    },

    //获取类型
    GetCardType:function ( cbCardData, cbCardCount)
    {
        //简单牌型
        switch (cbCardCount)
        {
        case 0:	//空牌
            {
                return GameDef.CT_ERROR;
            }
        case 1: //单牌
            {
                return GameDef.CT_SINGLE;
            }
        case 2:	//对牌火箭
            {
                //牌型判断
                if ((cbCardData[0]==0x4F)&&(cbCardData[1]==0x4E)) return GameDef.CT_MISSILE_CARD;
                if (this.GetCardLogicValue(cbCardData[0])==this.GetCardLogicValue(cbCardData[1])) return GameDef.CT_DOUBLE;

                return GameDef.CT_ERROR;
            }
        }

        //分析扑克
        var AnalyseResult = new tagAnalyseResult() ;
        this.AnalysebCardData(cbCardData,cbCardCount,AnalyseResult);
        // if(cbCardCount==8&&this.JudeSpAirPlaneType(cbCardData,cbCardCount,AnalyseResult)){
        //     return GameDef.CT_AIRPLANE_ONE;
        // }

        //四牌判断
        if (AnalyseResult.cbBlockCount[3] > 0) {

            if ((AnalyseResult.cbBlockCount[3] == 1) && (cbCardCount == 4) && (cbCardData[1] == 0x23)) return GameDef.CT_TIANZHA;
           
            //牌型判断
            if ((AnalyseResult.cbBlockCount[3] == 1) && (cbCardCount == 4)) return GameDef.CT_BOMB_CARD;
            if ((AnalyseResult.cbBlockCount[3] == 1) && (cbCardCount == 6) && (this.m_dwRules[0] & GameDef.GAME_TYPE_SD2 && this.m_dwRules[0] & GameDef.GAME_TYPE_DP)) return GameDef.CT_FOUR_TAKE_ONE;

            if ((AnalyseResult.cbBlockCount[3] == 1) && (cbCardCount == 8) && (AnalyseResult.cbBlockCount[1] == 2)
            //  ||(AnalyseResult.cbBlockCount[3] == 2) && (cbCardCount == 8)
            ) return GameDef.CT_FOUR_TAKE_TWO;

            //炸弹拆分类型
            /*if (AnalyseResult.cbBlockCount[2] > 0 ){
                var CardArr = new Array();
                for(var i=0;i<AnalyseResult.cbBlockCount[3];i++){
                    CardArr.push(AnalyseResult.cbCardData[3][i*4])
                }
                for(var i=0;i<AnalyseResult.cbBlockCount[2];i++){
                    CardArr.push(AnalyseResult.cbCardData[2][i*3])
                }
                this.SortCardList(CardArr,CardArr.length);

                var bLine = false;
                if(CardArr.length == 2 && this.GetCardLogicValue(CardArr[0]) == this.GetCardLogicValue(CardArr[1]+1)){
                    bLine = true;
                }
                if(CardArr.length > 2 && this.GetCardType(CardArr,CardArr.length) == GameDef.CT_SINGLE_LINE){
                    bLine = true;
                }

                if(bLine){
                    if((AnalyseResult.cbBlockCount[2]+AnalyseResult.cbBlockCount[3])*4 == cbCardCount) return GameDef.CT_AIRPLANE_ONE;
                    if((AnalyseResult.cbBlockCount[2]+AnalyseResult.cbBlockCount[3])*5 == cbCardCount) return GameDef.CT_AIRPLANE_TWO;
                }
            }*/

            return GameDef.CT_ERROR;
        }

        //三牌判断
        if (AnalyseResult.cbBlockCount[2] > 0) {
            //连牌判断
            if (AnalyseResult.cbBlockCount[2] > 1) {
                //变量定义
                var cbCardData = AnalyseResult.cbCardData[2][0];
                var cbFirstLogicValue = this.GetCardLogicValue(cbCardData);

                //错误过虑
                if (cbFirstLogicValue >= 15) return GameDef.CT_ERROR;

                //连牌判断
                for (var i = 1; i < AnalyseResult.cbBlockCount[2]; i++) {
                    var cbCardData = AnalyseResult.cbCardData[2][i * 3];
                    if (cbFirstLogicValue != (this.GetCardLogicValue(cbCardData) + i)) return GameDef.CT_ERROR;
                }
            } 
            else if (cbCardCount == 3)
            {
                for(var i=0;i<cbCardCount;i++)
                {
                    if (cbCardData[i] == 0x21) {
                        return GameDef.CT_MISSILE_CARD;
                    } 
                }
                
                return GameDef.CT_THREE;
            } 

            var CardType = GameDef.CT_ERROR;
            if (AnalyseResult.cbBlockCount[2] == 1 && (this.m_dwRules[0] & GameDef.GAME_TYPE_DP)) {
                if (AnalyseResult.cbBlockCount[0] == 1 && cbCardCount == 4) CardType = GameDef.CT_THREE_TAKE_ONE; //三带一单
                 //if(AnalyseResult.cbBlockCount[0] == 2 && cbCardCount == 5) CardType = GameDef.CT_THREE_TAKE_2;          //三带二单
                if (AnalyseResult.cbBlockCount[1] == 1 && cbCardCount == 5) CardType = GameDef.CT_THREE_TAKE_DOUBLE; //三带一对
                 //if(AnalyseResult.cbBlockCount[1] == 2 && cbCardCount == 7) CardType = GameDef.CT_THREE_TAKE_DOUBLE_2;   //三带二对
            } 
            if (AnalyseResult.cbBlockCount[2] != 1){

                if (AnalyseResult.cbBlockCount[2] * 3 == cbCardCount) CardType = GameDef.CT_THREE_LINE;
                else {
                    if (AnalyseResult.cbBlockCount[2] * 4 == cbCardCount) CardType = GameDef.CT_AIRPLANE_ONE;

                    if ((AnalyseResult.cbBlockCount[2] * 5 == cbCardCount) &&AnalyseResult.cbBlockCount[0] == 0&&(this.m_dwRules[0] & GameDef.GAME_TYPE_FJKDD) == 0) CardType = GameDef.CT_AIRPLANE_TWO;
                }
            }

            //  if (!(this.m_dwRules[0] & GameDef.GAME_TYPE_3_TAKE_2)) {
            //      if (CardType == GameDef.CT_THREE_TAKE_DOUBLE || CardType == GameDef.CT_AIRPLANE_TWO) CardType = GameDef.CT_ERROR;
            //  }

            return CardType;
        }

        //两张类型
        if (AnalyseResult.cbBlockCount[1]>=2)
        {
            //变量定义
            var cbCardData=AnalyseResult.cbCardData[1][0];
            var cbFirstLogicValue=this.GetCardLogicValue(cbCardData);

            //错误过虑
            if (cbFirstLogicValue>=15) return GameDef.CT_ERROR;

            //连牌判断
            for (var i=1;i<AnalyseResult.cbBlockCount[1];i++)
            {
                var cbCardData=AnalyseResult.cbCardData[1][i*2];
                if (cbFirstLogicValue!=(this.GetCardLogicValue(cbCardData)+i)) return GameDef.CT_ERROR;
            }

            //二连判断
            if ((AnalyseResult.cbBlockCount[1]*2)==cbCardCount) return GameDef.CT_DOUBLE_LINE;

            return GameDef.CT_ERROR;
        }

        //单张判断
        if ((AnalyseResult.cbBlockCount[0]>=5)&&(AnalyseResult.cbBlockCount[0]==cbCardCount))
        {
            //变量定义
            var cbCardData=AnalyseResult.cbCardData[0][0];
            var cbFirstLogicValue=this.GetCardLogicValue(cbCardData);

            //错误过虑
            if (cbFirstLogicValue>=15) return GameDef.CT_ERROR;

            //连牌判断
            for (var i=1;i<AnalyseResult.cbBlockCount[0];i++)
            {
                var cbCardData=AnalyseResult.cbCardData[0][i];
                if (cbFirstLogicValue!=(this.GetCardLogicValue(cbCardData)+i)) return GameDef.CT_ERROR;
            }

            return GameDef.CT_SINGLE_LINE;
        }

        return GameDef.CT_ERROR;
    },

    JudeSpAirPlaneType :function (cbCardData, cbCardCount, AnalyseResult) {
        var isPlane = false;
        if(AnalyseResult.cbBlockCount[2] == 2 && AnalyseResult.cbBlockCount[1] == 1 ){
            isPlane = true;
        }
        if(AnalyseResult.cbBlockCount[3] == 1 && AnalyseResult.cbBlockCount[3] == 1 ){
            isPlane = true;
        }
        if(AnalyseResult.cbBlockCount[2] == 1 && AnalyseResult.cbBlockCount[3] == 1 && AnalyseResult.cbBlockCount[0] == 1){
            isPlane = true;
        }
        //牌形判断
        if (isPlane) {
            //变量定义
            var cbCardData=AnalyseResult.cbCardData[2][0];
            var cbFirstLogicValue=this.GetCardLogicValue(cbCardData);
            //连牌判断
            for (var i = 1; i < AnalyseResult.cbBlockCount[3]; i++) {
                var cbCardData = AnalyseResult.cbCardData[0][i];
                if (cbFirstLogicValue != (this.GetCardLogicValue(cbCardData) + i)) return false;
            }
            return true;
        }
        return false;
    },

    //排列扑克
    SortCardList:function ( cbCardData, cbCardCount)
    {
        //数目过虑
        if (cbCardCount==0) return;

        //转换数值
        var cbSortValue = new Array();
        for (var i=0;i<cbCardCount;i++)
        {
            cbSortValue[i]=this.GetCardLogicValue(cbCardData[i]);
        }

        //排序操作
        var bSorted=true;
        var cbSwitchData=0;
        var cbLast=cbCardCount-1;
        do
        {
            bSorted=true;
            for (var i=0;i<cbLast;i++)
            {
                if ((cbSortValue[i]<cbSortValue[i+1])||
                    ((cbSortValue[i]==cbSortValue[i+1])&&(cbCardData[i]<cbCardData[i+1])))
                {
                    //设置标志
                    bSorted=false;

                    //扑克数据
                    cbSwitchData=cbCardData[i];
                    cbCardData[i]=cbCardData[i+1];
                    cbCardData[i+1]=cbSwitchData;

                    //排序权位
                    cbSwitchData=cbSortValue[i];
                    cbSortValue[i]=cbSortValue[i+1];
                    cbSortValue[i+1]=cbSwitchData;
                }
            }
            cbLast--;
        } while(bSorted==false);

        return;
    },

    //删除扑克
    RemoveCardList:function ( cbRemoveCard, cbRemoveCount, cbCardData, cbCardCount)
    {
        //检验数据
        if(cbRemoveCount>cbCardCount) return false;

        //定义变量
        var cbDeleteCount=0;
        var cbTempCardData = new Array();
        if (cbCardCount>GameDef.MAX_COUNT) return false;
        for(var i=0;i<GameDef.MAX_COUNT;i++)
        {
            cbTempCardData[i] = cbCardData[i];
            cbCardData[i] = 0;
        }

        //置零扑克
        for (var i=0;i<cbRemoveCount;i++)
        {
            for (var j=0;j<cbCardCount;j++)
            {
                if (cbRemoveCard[i]==cbTempCardData[j])
                {
                    cbDeleteCount++;
                    cbTempCardData[j]=0;
                    break;
                }
            }
        }
        if (cbDeleteCount!=cbRemoveCount) return false;

        //清理扑克
        var cbCardPos=0;
        for (var i=0;i<cbCardCount;i++)
        {
            if (cbTempCardData[i]!=0)
                cbCardData[cbCardPos++]=cbTempCardData[i];
        }

        return true;
    },

    //删除扑克
    RemoveCard:function ( cbRemoveCard, cbRemoveCount, cbCardData, cbCardCount)
    {
        //检验数据
        if(cbRemoveCount>cbCardCount) return;

        //定义变量
        var cbDeleteCount=0;
        var cbTempCardData = new Array();
        if (cbCardCount>GameDef.MAX_COUNT) return false;
        for(var i=0;i<GameDef.MAX_COUNT;i++)
        {
            cbTempCardData[i] = cbCardData[i];
        }

        //置零扑克
        for (var i=0;i<cbRemoveCount;i++)
        {
            for (var j=0;j<cbCardCount;j++)
            {
                if (cbRemoveCard[i]==cbTempCardData[j])
                {
                    cbDeleteCount++;
                    cbTempCardData[j]=0;
                    break;
                }
            }
        }
        if (cbDeleteCount!=cbRemoveCount) return false;

        //清理扑克
        var cbCardPos=0;
        for (var i=0;i<cbCardCount;i++)
        {
            if (cbTempCardData[i]!=0) cbCardData[cbCardPos++]=cbTempCardData[i];
        }

        return true;
    },

    //排列扑克
    SortOutCardList:function ( cbCardData, cbCardCount)
    {
        //获取牌型
        var cbCardType = this.GetCardType(cbCardData,cbCardCount);

        if( cbCardType == GameDef.CT_THREE_TAKE_ONE || cbCardType == GameDef.CT_THREE_TAKE_DOUBLE )
        {
            //分析牌
            var AnalyseResult =new tagAnalyseResult();
            this.AnalysebCardData( cbCardData,cbCardCount,AnalyseResult );

            cbCardCount = AnalyseResult.cbBlockCount[2]*3;
            for (var i=0;i<cbCardCount;i++)
            {
                cbCardData[i] = AnalyseResult.cbCardData[2][i];
            }
            for( var i = 4-1; i >= 0; i-- )
            {
                if( i == 2 ) continue;

                if( AnalyseResult.cbBlockCount[i] > 0 )
                {
                    for (var j=0;j<(i+1)*AnalyseResult.cbBlockCount[i];j++)
                    {
                        cbCardData[cbCardCount+j] = AnalyseResult.cbCardData[i][j];
                    }
                    cbCardCount += (i+1)*AnalyseResult.cbBlockCount[i];
                }
            }
        }
        else if( cbCardType == GameDef.CT_FOUR_TAKE_ONE || cbCardType == GameDef.CT_FOUR_TAKE_TWO )
        {
            //分析牌
            var AnalyseResult =new tagAnalyseResult();
            this.AnalysebCardData( cbCardData,cbCardCount,AnalyseResult );

            cbCardCount = AnalyseResult.cbBlockCount[3]*4;
            for (var i=0;i<cbCardCount;i++)
            {
                cbCardData[i] = AnalyseResult.cbCardData[3][i];
            }
            for( var i = AnalyseResult.cbBlockCount.length-1; i >= 0; i-- )
            {
                if( i == 3 ) continue;

                if( AnalyseResult.cbBlockCount[i] > 0 )
                {
                    for (var j=0;j<(i+1)*AnalyseResult.cbBlockCount[i];j++)
                    {
                        cbCardData[cbCardCount+j] = AnalyseResult.cbCardData[i][j];
                    }
                    cbCardCount += (i+1)*AnalyseResult.cbBlockCount[i];
                }
            }
        }

        return;
    },
    //获取数值
	GetCardValue:function (cbCardData) { return cbCardData&LOGIC_MASK_VALUE; },
	//获取花色
	GetCardColor:function (cbCardData) { return cbCardData&LOGIC_MASK_COLOR; },
    //逻辑数值
    GetCardLogicValue:function ( cbCardData)
    {
        //扑克属性
        var cbCardColor=this.GetCardColor(cbCardData);
        var cbCardValue=this.GetCardValue(cbCardData);

        //转换数值
        if (cbCardColor==0x40) return cbCardValue+2;
        return (cbCardValue<=2)?(cbCardValue+13):cbCardValue;
    },
    //包含扑克
    IncludeCard:function ( cbFirstCard, cbNextCard, cbFirstCount, cbNextCount){
        if(cbFirstCount <= cbNextCount) return false;
        //分析扑克
        var FirstResult = new tagAnalyseResult();
        var NextResult = new tagAnalyseResult();

        this.AnalysebCardData(cbFirstCard,cbFirstCount,FirstResult);
        this.AnalysebCardData(cbNextCard,cbNextCount,NextResult);

        for(var i=0;i<4;i++){//同牌数量 1-4
            for(var j=0;j<NextResult.cbBlockCount[i];j++){
                var CardValue = this.GetCardLogicValue(NextResult.cbCardData[i][j*(i+1)]);//牌index
                var bHas = false;
                for(var k=i;k<4;k++){//同牌数量 1-4
                    if(bHas) break;
                    for(var l=0;l<FirstResult.cbBlockCount[k];l++){//同牌数量 1-4
                        if(this.GetCardLogicValue(FirstResult.cbCardData[k][l*(k+1)]) == CardValue) {
                            bHas = true;
                            break;
                        }
                    }
                }
                if(!bHas) return false;
            }
        }

        return true;
    },

    //包含扑克
    CalcValidCard:function (cbShootCard, cbCount, cbTurnCard, cbTurnCount){
        if( cbCount - cbTurnCount != 1) return 0;
        var TempCard = new Array();
        var cbCardType = this.GetCardType(cbTurnCard, cbTurnCount);

        for(var i=0;i<cbTurnCount;i++){
            TempCard.splice(0,TempCard.length);
            TempCard = cbShootCard.slice(0,cbCount);

            TempCard.splice(i,1);
            if(LOG_NET_DATA)console.log('TempCard2 ',TempCard)
            if(this.GetCardType(TempCard, TempCard.length) == cbCardType){
                for(var j=0;j<cbTurnCount;j++)cbShootCard[j] = TempCard[j];
                return cbTurnCount;
            }
        }

        return 0;
    },

    //对比扑克
    CompareCard:function ( cbFirstCard, cbNextCard, cbFirstCount, cbNextCount)
    {
        //获取类型
        var cbNextType=this.GetCardType(cbNextCard,cbNextCount);
        var cbFirstType=this.GetCardType(cbFirstCard,cbFirstCount);

        //王炸
        if( cbFirstType == GameDef.CT_MISSILE_CARD && cbFirstCount == 2 ) return false;
        if( cbNextType == GameDef.CT_MISSILE_CARD && cbNextCount == 2 ) return true;
        if( cbFirstType == GameDef.CT_MISSILE_CARD && cbFirstCount == 3 ) return false;
        //类型判断
        if (cbNextType==GameDef.CT_ERROR) return false;
        if (cbNextType==GameDef.CT_MISSILE_CARD) return true;
        if (cbNextType==GameDef.CT_TIANZHA) return true;

        //炸弹判断
        if ((cbFirstType!=GameDef.CT_BOMB_CARD)&&(cbNextType==GameDef.CT_BOMB_CARD)) return true;
        if ((cbFirstType==GameDef.CT_BOMB_CARD)&&(cbNextType!=GameDef.CT_BOMB_CARD)) return false;

        //规则判断
        if ((cbFirstType!=cbNextType)||(cbFirstCount!=cbNextCount)) return false;

        //开始对比
        switch (cbNextType)
        {
        case GameDef.CT_SINGLE:
        case GameDef.CT_DOUBLE:
        case GameDef.CT_THREE:
        case GameDef.CT_SINGLE_LINE:
        case GameDef.CT_DOUBLE_LINE:
        case GameDef.CT_THREE_LINE:
        case GameDef.CT_BOMB_CARD:
            {
                //获取数值
                var cbNextLogicValue=this.GetCardLogicValue(cbNextCard[0]);
                var cbFirstLogicValue=this.GetCardLogicValue(cbFirstCard[0]);

                //对比扑克
                return cbNextLogicValue>cbFirstLogicValue;
            }
        case GameDef.CT_THREE_TAKE_ONE:
        case GameDef.CT_THREE_TAKE_DOUBLE:
        case GameDef.CT_THREE_TAKE_2:
        case GameDef.CT_THREE_TAKE_DOUBLE_2:
        case GameDef.CT_AIRPLANE_ONE:
        case GameDef.CT_AIRPLANE_TWO:
            {
                //分析扑克
                var NextResult = new tagAnalyseResult();
                var FirstResult = new tagAnalyseResult();

                this.AnalysebCardData(cbNextCard,cbNextCount,NextResult);
                this.AnalysebCardData(cbFirstCard,cbFirstCount,FirstResult);

                //获取数值
                var cbNextLogicValue=this.GetCardLogicValue(NextResult.cbCardData[2][0]);
                var cbFirstLogicValue=this.GetCardLogicValue(FirstResult.cbCardData[2][0]);

                //对比扑克
                return cbNextLogicValue>cbFirstLogicValue;
            }
        case GameDef.CT_FOUR_TAKE_ONE:
        case GameDef.CT_FOUR_TAKE_TWO:
            {
                //分析扑克
                var NextResult = new tagAnalyseResult();
                var FirstResult = new tagAnalyseResult();
                this.AnalysebCardData(cbNextCard,cbNextCount,NextResult);
                this.AnalysebCardData(cbFirstCard,cbFirstCount,FirstResult);

                //获取数值
                var cbNextLogicValue=this.GetCardLogicValue(NextResult.cbCardData[3][0]);
                var cbFirstLogicValue=this.GetCardLogicValue(FirstResult.cbCardData[3][0]);

                //对比扑克
                return cbNextLogicValue>cbFirstLogicValue;
            }
        }

        return false;
    },

    //构造扑克
    MakeCardData:function ( cbValueIndex, cbColorIndex)
    {
        return (cbColorIndex<<4)|(cbValueIndex+1);
    },

    //分析扑克
    AnalysebCardData:function ( cbCardData, cbCardCount, AnalyseResult)
    {
        AnalyseResult.cbKingCount = 0;
        //设置结果
        for (var i = 0; i < 4; i++) {
            AnalyseResult.cbBlockCount[i] = 0;
            for (var j = 0; j < GameDef.MAX_COUNT; j++) {
                AnalyseResult.cbCardData[i][j] = 0;
            }
        }

        //扑克分析
        for (var i = 0; i < cbCardCount; i++) {
            //变量定义
            var cbSameCount = 1;
            var cbCardValueTemp = 0;
            var cbLogicValue = this.GetCardLogicValue(cbCardData[i]);
            if (this.GetCardColor(cbCardData[i]) == 0x40) AnalyseResult.cbKingCount++;
            //搜索同牌
            for (var j = i + 1; j < cbCardCount; j++) {
                //获取扑克
                if (this.GetCardLogicValue(cbCardData[j]) != cbLogicValue) break;

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
    AnalysebDistributing:function ( cbCardData, cbCardCount,  Distributing)
    {
        //设置变量
        Distributing.cbCardCount = 0;
        for(var i=0;i<15;i++)
        {
            for(var j=0;j<6;j++)
            {
                Distributing.cbDistributing[i][j] = 0;
            }
        }

        //设置变量
        for (var i=0;i<cbCardCount;i++)
        {
            if (cbCardData[i]==0) continue;

            //获取属性
            var cbCardColor=this.GetCardColor(cbCardData[i]);
            var cbCardValue=this.GetCardValue(cbCardData[i]);

            //分布信息
            Distributing.cbCardCount++;
            Distributing.cbDistributing[cbCardValue-1][cbIndexCount]++;
            Distributing.cbDistributing[cbCardValue-1][cbCardColor>>4]++;
        }

        return;
    },

    //出牌搜索
    SearchOutCard:function ( cbHandCardData, cbHandCardCount, cbTurnCardData, cbTurnCardCount, pSearchCardResult ,bTrusteeship)
    {
        //设置结果
        if( pSearchCardResult == null ) return 0;

        pSearchCardResult.cbSearchCount = 0;
        for(var i=0;i<16;i++)
        {
            pSearchCardResult.cbCardCount[i] = 0;
            for(var j=0;j<16;j++)
            {
                pSearchCardResult.cbResultCard[i][j] = 0;
            }
        }

        //变量定义
        var cbResultCount = 0;
        var tmpSearchCardResult = GameDef.tagSearchCardResult()

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount=cbHandCardCount;
        for(var i=0;i<cbHandCardCount;i++)
        {
            cbCardData[i] = cbHandCardData[i];
        }

        //排列扑克
        this.SortCardList(cbCardData,cbCardCount);

        //获取类型
        var cbTurnOutType=this.GetCardType(cbTurnCardData,cbTurnCardCount);

        //出牌分析
        switch (cbTurnOutType)
        {
        case GameDef.CT_ERROR:					//错误类型
            {
                //提取各种牌型一组
                if( !pSearchCardResult ) return 0;

                //是否一手出完
                if( this.GetCardType(cbCardData,cbCardCount) != GameDef.CT_ERROR )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                    for(var i=0;i<cbCardCount;i++)
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                    }
                    cbResultCount++;
                }

                //如果最小牌不是单牌，则提取
                var cbSameCount = 0;
                if( cbCardCount > 1 && this.GetCardValue(cbCardData[cbCardCount-1]) == this.GetCardValue(cbCardData[cbCardCount-2]) )
                {
                    cbSameCount = 1;
                    pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[cbCardCount-1];
                    var cbCardValue = this.GetCardValue(cbCardData[cbCardCount-1]);
                    for( var i = cbCardCount-2; i >= 0; i-- )
                    {
                        if( this.GetCardValue(cbCardData[i]) == cbCardValue )
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][cbSameCount++] = cbCardData[i];
                        }
                        else break;
                    }

                    pSearchCardResult.cbCardCount[cbResultCount] = cbSameCount;
                    cbResultCount++;
                }

                //单牌
                var cbTmpCount = 0;
                if( cbSameCount != 1 )
                {
                    cbTmpCount = this.SearchSameCard( cbCardData,cbCardCount,0,1,tmpSearchCardResult );
                    if( cbTmpCount > 0 )
                    {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        //泽:如果托管并且有人报单则只能出手里最大单排
                        if (bTrusteeship) {
                            for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                            {
                                pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[cbTmpCount-1][i];
                            }
                        } else {
                            for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                            {
                                pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                            }
                        }

                        cbResultCount++;
                    }
                }

                //对牌
                if( cbSameCount != 2 )
                {
                    cbTmpCount = this.SearchSameCard( cbCardData,cbCardCount,0,2,tmpSearchCardResult );
                    if( cbTmpCount > 0 )
                    {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        cbResultCount++;
                    }
                }

                //三条
                if( cbSameCount != 3 )
                {
                    cbTmpCount = this.SearchSameCard( cbCardData,cbCardCount,0,3,tmpSearchCardResult );
                    if( cbTmpCount > 0 )
                    {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        cbResultCount++;
                    }
                }

                //三带一单
                cbTmpCount = this.SearchTakeCardType(cbCardData, cbCardCount, 0, 3, 1, 1, tmpSearchCardResult);
                if (cbTmpCount > 0) {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }

                //三带一对
               // if(this.m_dwRules[0] & GameDef.GAME_TYPE_3_TAKE_2) {
                    cbTmpCount = this.SearchTakeCardType(cbCardData, cbCardCount, 0, 3, 2, 2, tmpSearchCardResult);
                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        cbResultCount++;
                    }
               // }

                 //if(this.m_dwRules[0] & GameDef.GAME_TYPE_3_TAKE_2) {
                     //三带二单
                     cbTmpCount = this.SearchTakeCardType(cbCardData, cbCardCount, 0, 3, 1, 2, tmpSearchCardResult);
                     if (cbTmpCount > 0) {
                         pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                         for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                             pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                         }
                         cbResultCount++;
                     }

                    //三带二对
                    cbTmpCount = this.SearchTakeCardType(cbCardData, cbCardCount, 0, 3, 2, 4, tmpSearchCardResult);
                    if (cbTmpCount > 0) {
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                        for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                            pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                        }
                        cbResultCount++;
                    }
                //}

                //单连
                cbTmpCount = this.SearchLineCardType( cbCardData,cbCardCount,0,1,0,tmpSearchCardResult );
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }

                //连对
                cbTmpCount = this.SearchLineCardType( cbCardData,cbCardCount,0,2,0,tmpSearchCardResult );
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }

                //三连
                cbTmpCount = this.SearchLineCardType( cbCardData,cbCardCount,0,3,0,tmpSearchCardResult );
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for(var i=0;i<tmpSearchCardResult.cbCardCount[0];i++)
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }

                //飞机
                var cbTmpCount = this.SearchThreeTwoLine( cbCardData,cbCardCount,tmpSearchCardResult );

                if( cbTmpCount > 0 )
                {
                    for (var i = 0; i < tmpSearchCardResult.cbSearchCount; i++) {

                        if(this.GetCardType(tmpSearchCardResult.cbResultCard[i], tmpSearchCardResult.cbCardCount[i]) == GameDef.CT_ERROR) continue;
                        pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
                        for (var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++)
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
                        }
                        cbResultCount++;

                    }
                }
                pSearchCardResult.cbSearchCount = cbResultCount;
                return cbResultCount;
            }
        case GameDef.CT_SINGLE:					//单牌类型
        case GameDef.CT_DOUBLE:					//对牌类型
        case GameDef.CT_THREE:					//三条类型
            {
                //变量定义
                var cbReferCard=cbTurnCardData[0];
                var cbSameCount = 1;
                if( cbTurnOutType == GameDef.CT_DOUBLE ) cbSameCount = 2;
                else if( cbTurnOutType == GameDef.CT_THREE ) cbSameCount = 3;

                //搜索相同牌
                cbResultCount = this.SearchSameCard( cbCardData,cbCardCount,cbReferCard,cbSameCount,pSearchCardResult );

                break;
            }
        case GameDef.CT_SINGLE_LINE:		//单连类型
        case GameDef.CT_DOUBLE_LINE:		//对连类型
        case GameDef.CT_THREE_LINE:				//三连类型
            {
                //变量定义
                var cbBlockCount = 1;
                if( cbTurnOutType == GameDef.CT_DOUBLE_LINE ) cbBlockCount = 2;
                else if( cbTurnOutType == GameDef.CT_THREE_LINE ) cbBlockCount = 3;

                var cbLineCount = cbTurnCardCount/cbBlockCount;

                //搜索边牌
                cbResultCount = this.SearchLineCardType( cbCardData,cbCardCount,cbTurnCardData[0],cbBlockCount,cbLineCount,pSearchCardResult );

                break;
            }
        case GameDef.CT_THREE_TAKE_ONE:	//三带一单
        case GameDef.CT_THREE_TAKE_DOUBLE:	//三带一对
            {
                //效验牌数
                if( cbCardCount < cbTurnCardCount ) break;

                //如果是三带一或三带二
                if( cbTurnCardCount == 4 || cbTurnCardCount == 5 )
                {
                    var cbTakeCardCount = cbTurnOutType == GameDef.CT_THREE_TAKE_ONE ? 1 : 2;
                    //搜索三带牌型
                    cbResultCount = this.SearchTakeCardType(cbCardData, cbCardCount, cbTurnCardData[2], 3, cbTakeCardCount, cbTakeCardCount, pSearchCardResult);
                }
                else
                {
                    //变量定义
                    var cbBlockCount = 3;
                    var cbLineCount = cbTurnCardCount/(cbTurnOutType==GameDef.CT_THREE_TAKE_ONE?4:5);
                    var cbTakeCardCount = cbTurnOutType==GameDef.CT_THREE_TAKE_ONE?1:2;

                    //搜索连牌
                    var cbTmpTurnCard = new Array();
                    for(var i=0;i<cbTurnCardCount;i++)
                    {
                        cbTmpTurnCard[i] = cbTurnCardData[i];
                    }
                    this.SortOutCardList( cbTmpTurnCard,cbTurnCardCount );
                    cbResultCount = this.SearchLineCardType( cbCardData,cbCardCount,cbTmpTurnCard[0],cbBlockCount,cbLineCount,pSearchCardResult );

                    //提取带牌
                    var bAllDistill = true;
                    for( var i = 0; i < cbResultCount; i++ )
                    {
                        var cbResultIndex = cbResultCount-i-1;

                        //变量定义
                        var cbTmpCardData = new Array();
                        var cbTmpCardCount = cbCardCount;

                        //删除连牌
                        for(var j=0;j<cbCardCount;j++)
                        {
                            cbTmpCardData[j] = cbCardData[j];
                        }
                        // VERIFY( this.RemoveCard( pSearchCardResult.cbResultCard[cbResultIndex],pSearchCardResult.cbCardCount[cbResultIndex],
                        //     cbTmpCardData,cbTmpCardCount ) );
                        cbTmpCardCount -= pSearchCardResult.cbCardCount[cbResultIndex];

                        //分析牌
                        var TmpResult = new tagAnalyseResult() ;
                        this.AnalysebCardData( cbTmpCardData,cbTmpCardCount,TmpResult );

                        //提取牌
                        var cbDistillCard = new Array();
                        var cbDistillCount = 0;
                        for( var j = cbTakeCardCount-1; j < TmpResult.cbBlockCount.length; j++ )
                        {
                            if( TmpResult.cbBlockCount[j] > 0 )
                            {
                                if( j+1 == cbTakeCardCount && TmpResult.cbBlockCount[j] >= cbLineCount )
                                {
                                    var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                                    for( var k = 0; k < (j+1)*cbLineCount; k++ )
                                    {
                                        cbDistillCard[k] = TmpResult.cbCardData[j][(cbTmpBlockCount-cbLineCount)*(j+1)+k];
                                    }
                                    cbDistillCount = (j+1)*cbLineCount;
                                    break;
                                }
                                else
                                {
                                    for( var k = 0; k < TmpResult.cbBlockCount[j]; k++ )
                                    {
                                        var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                                        cbDistillCard[cbDistillCount+k]=TmpResult.cbCardData[j][(cbTmpBlockCount-k-1)*(j+1)+k];
                                        cbDistillCount += cbTakeCardCount;

                                        //提取完成
                                        if( cbDistillCount == cbTakeCardCount*cbLineCount ) break;
                                    }
                                }
                            }

                            //提取完成
                            if( cbDistillCount == cbTakeCardCount*cbLineCount ) break;
                        }

                        //提取完成
                        if( cbDistillCount == cbTakeCardCount*cbLineCount )
                        {
                            //复制带牌
                            var cbCount = pSearchCardResult.cbCardCount[cbResultIndex];
                            pSearchCardResult.cbResultCard[cbResultIndex][cbCount]=cbDistillCard[cbResultIndex];//不确定
                            pSearchCardResult.cbCardCount[cbResultIndex] += cbDistillCount;
                        }
                        //否则删除连牌
                        else
                        {
                            bAllDistill = false;
                            pSearchCardResult.cbCardCount[cbResultIndex] = 0;
                        }
                    }

                    //整理组合
                    if( !bAllDistill )
                    {
                        pSearchCardResult.cbSearchCount = cbResultCount;
                        cbResultCount = 0;
                        for( var i = 0; i < pSearchCardResult.cbSearchCount; i++ )
                        {
                            if( pSearchCardResult.cbCardCount[i] != 0 )
                            {
                                tmpSearchCardResult.cbCardCount[cbResultCount] = pSearchCardResult.cbCardCount[i];
                                for(var j=0;j<pSearchCardResult.cbCardCount[i];j++)
                                {
                                    tmpSearchCardResult.cbResultCard[cbResultCount][j] = pSearchCardResult.cbResultCard[i][j];
                                }
                                cbResultCount++;
                            }
                        }
                        tmpSearchCardResult.cbSearchCount = cbResultCount;
                        for( var i = 0; i < cbResultCount; i++ )
                        {
                            pSearchCardResult.cbCardCount[i] = tmpSearchCardResult.cbCardCount[i];
                            for(var j=0;j<tmpSearchCardResult.cbCardCount[i];j++)
                            {
                                pSearchCardResult.cbResultCard[i][j] = tmpSearchCardResult.cbResultCard[i][j];
                            }
                        }
                    }
                }

                break;
            }
        case GameDef.CT_THREE_TAKE_2:				//三带两单
        case GameDef.CT_THREE_TAKE_DOUBLE_2:		//三带两双
        {
            //效验牌数
            if( cbCardCount < cbTurnCardCount ) break;
            // 规则校验
            //if(!(this.m_dwRules[0] & GameDef.GAME_TYPE_3_TAKE_2)) break;
            //三带二单或三带二对
            var cbTakeTypeCount = cbTurnOutType == GameDef.CT_THREE_TAKE_2 ? 1 : 2;
            //搜索三带牌型
            cbResultCount = this.SearchTakeCardType(cbCardData, cbCardCount, cbTurnCardData[2], 3, cbTakeTypeCount, cbTakeTypeCount * 2, pSearchCardResult);
            break;
        }

        case GameDef.CT_FOUR_TAKE_ONE:		//四带两单
        case GameDef.CT_FOUR_TAKE_TWO:		//四带两双
            {
                var cbTakeTypeCount = cbTurnOutType == GameDef.CT_FOUR_TAKE_ONE ? 1 : 2;

                var cbTmpTurnCard = new Array();
                for (var i = 0; i < cbTurnCardCount; i++) {
                    cbTmpTurnCard[i] = cbTurnCardData[i];
                }
                this.SortOutCardList(cbTmpTurnCard, cbTurnCardCount);

                //搜索带牌
                cbResultCount = this.SearchTakeCardType(cbCardData, cbCardCount, cbTmpTurnCard[0], 4, cbTakeTypeCount, cbTakeTypeCount * 2, pSearchCardResult);

                break;
            }
        }

        //搜索炸弹
        if ((cbCardCount>=4)&&(cbTurnOutType!=GameDef.CT_MISSILE_CARD))
        {
            //变量定义
            var cbReferCard = 0;
            if (cbTurnOutType==GameDef.CT_BOMB_CARD) cbReferCard=cbTurnCardData[0];

            //搜索炸弹
            var cbTmpResultCount = this.SearchSameCard( cbCardData,cbCardCount,cbReferCard,4,tmpSearchCardResult );
            for( var i = 0; i < cbTmpResultCount; i++ )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
                for( var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++ )
                {
                    pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
                }
                cbResultCount++;
            }
        }

        //搜索火箭
        if (cbTurnOutType!=GameDef.CT_MISSILE_CARD&&(cbCardCount>=2)&&(cbCardData[0]==0x4F)&&(cbCardData[1]==0x4E))
        {
            //设置结果
            pSearchCardResult.cbCardCount[cbResultCount] = 2;
            pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[0];
            pSearchCardResult.cbResultCard[cbResultCount][1] = cbCardData[1];

            cbResultCount++;
        }

        pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    //同牌搜索
    SearchSameCard:function ( cbHandCardData, cbHandCardCount, cbReferCard, cbSameCardCount,pSearchCardResult )
    {
        //设置结果
        if( pSearchCardResult )
        {
            pSearchCardResult.cbSearchCount = 0;
            for(var i=0;i<20;i++)
            {
                pSearchCardResult.cbCardCount[i] = 0;
                for(var j=0;j<20;j++)
                {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        }
        var cbResultCount = 0;

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount=cbHandCardCount;
        for(var i=0;i<cbHandCardCount;i++)
        {
            cbCardData[i] = cbHandCardData[i];
        }

        //排列扑克
        this.SortCardList(cbCardData,cbCardCount);

        //分析扑克
        var AnalyseResult = new tagAnalyseResult();
        this.AnalysebCardData( cbCardData,cbCardCount,AnalyseResult );

        var cbReferLogicValue = cbReferCard==0?0:this.GetCardLogicValue(cbReferCard);
        var cbBlockIndex = cbSameCardCount-1;
        do
        {
            for( var i = 0; i < AnalyseResult.cbBlockCount[cbBlockIndex]; i++ )
            {
                var cbIndex = (AnalyseResult.cbBlockCount[cbBlockIndex]-i-1)*(cbBlockIndex+1);
                if( this.GetCardLogicValue(AnalyseResult.cbCardData[cbBlockIndex][cbIndex]) > cbReferLogicValue )
                {
                    if( pSearchCardResult == null ) return 1;

                    if(cbResultCount>=pSearchCardResult.cbCardCount.length) return;

                    //复制扑克
                    for(var j = 0; j < cbSameCardCount; ++ j)
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][j] = AnalyseResult.cbCardData[cbBlockIndex][cbIndex+j];
                    }
                    pSearchCardResult.cbCardCount[cbResultCount] = cbSameCardCount;

                    cbResultCount++;
                }
            }

            //AAA
            var cbACount = 0;
            for( var i = 0; i < cbHandCardCount; i++ )
            {
                if(cbCardData[i]==0x01 || cbCardData[i]==0x21 ||cbCardData[i]==0x31)
                {
                    cbACount++;
                }
            }
            var CardData = new Array();
            CardData[0] = 0x01;
            CardData[1] = 0x21;
            CardData[2] = 0x31;
            if (cbACount == 3) {
                for(var j = 0; j < cbACount; ++ j)
                {
                    pSearchCardResult.cbResultCard[cbResultCount][j] = CardData[j];
                }
                pSearchCardResult.cbCardCount[cbResultCount] = cbACount;
                cbResultCount++;
            }

            cbBlockIndex++;
        }while( cbBlockIndex < AnalyseResult.cbBlockCount.length );

        if( pSearchCardResult )
            pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },
    //带牌类型搜索(三带一，四带一等)
    SearchTakeCardType: function (cbHandCardData, cbHandCardCount, cbReferCard, cbSameCount, cbTakeTypeCount, cbTakeCount, pSearchCardResult) {
        //设置结果
        if (pSearchCardResult) {
            pSearchCardResult.cbSearchCount = 0;
            for (var i = 0; i < 20; i++) {
                pSearchCardResult.cbCardCount[i] = 0;
                for (var j = 0; j < 20; j++) {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        } else return 0;
        var cbResultCount = 0;

        //效验
        if (cbSameCount != 3 && cbSameCount != 4) return cbResultCount;
        if (cbTakeTypeCount != 1 && cbTakeTypeCount != 2) return cbResultCount;

        //长度判断
        if (cbSameCount == 4 && cbHandCardCount < cbSameCount + cbTakeTypeCount * 2 || cbHandCardCount < cbSameCount + cbTakeTypeCount) return cbResultCount;

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount = cbHandCardCount;
        for (var i = 0; i < cbHandCardCount; i++) {
            cbCardData[i] = cbHandCardData[i];
        }

        //排列扑克
        this.SortCardList(cbCardData, cbCardCount);

        //搜索同张
        var SameCardResult = GameDef.tagSearchCardResult();
        var cbSameCardResultCount = this.SearchSameCard(cbCardData, cbCardCount, cbReferCard, cbSameCount, SameCardResult);

        if (cbSameCardResultCount > 0) {
            //分析扑克
            var AnalyseResult = new tagAnalyseResult();
            this.AnalysebCardData(cbCardData, cbCardCount, AnalyseResult);

            //需要牌数
            var cbNeedCount = cbSameCount + cbTakeCount;

            //提取带牌
            for (var i = 0; i < cbSameCardResultCount; i++) {
                var bMerge = false;

                for (var j = cbTakeTypeCount - 1; j < AnalyseResult.cbBlockCount.length; j++) {

                    for (var k = 0; k < AnalyseResult.cbBlockCount[j]; k++) {
                        //从小到大
                        var cbIndex = (AnalyseResult.cbBlockCount[j] - k - 1) * (j + 1);

                        //过滤相同牌
                        if (this.GetCardValue(SameCardResult.cbResultCard[i][0]) == this.GetCardValue(AnalyseResult.cbCardData[j][cbIndex])) continue;

                        //复制带牌
                        var cbCount = SameCardResult.cbCardCount[i];
                        for (var l = 0; l < cbTakeTypeCount; l++) {
                            SameCardResult.cbResultCard[i][cbCount + l] = AnalyseResult.cbCardData[j][cbIndex + l];
                        }
                        SameCardResult.cbCardCount[i] += cbTakeTypeCount;

                        if (SameCardResult.cbCardCount[i] < cbNeedCount) continue;

                        //复制结果
                        for (var m = 0; m < SameCardResult.cbCardCount[i]; m++) {
                            pSearchCardResult.cbResultCard[cbResultCount][m] = SameCardResult.cbResultCard[i][m];
                        }
                        pSearchCardResult.cbCardCount[cbResultCount] = SameCardResult.cbCardCount[i];
                        cbResultCount++;

                        bMerge = true;

                        //下一组合
                        break;
                    }
                    if (bMerge) break;
                }
            }
        }

        if (pSearchCardResult) pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    //连牌搜索
    SearchLineCardType:function ( cbHandCardData, cbHandCardCount, cbReferCard, cbBlockCount, cbLineCount, pSearchCardResult )
    {
        //设置结果
        if( pSearchCardResult )
        {
            pSearchCardResult.cbSearchCount = 0;
            for(var i=0;i<20;i++)
            {
                pSearchCardResult.cbCardCount[i] = 0;
                for(var j=0;j<20;j++)
                {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        }
        var cbResultCount = 0;

        //定义变量
        var cbLessLineCount = 0;
        if( cbLineCount == 0 )
        {
            if( cbBlockCount == 1 )
                cbLessLineCount = 5;
            else if( cbBlockCount == 2 )
                cbLessLineCount = 3;
            else cbLessLineCount = 2;
        }
        else cbLessLineCount = cbLineCount;

        var cbReferIndex = 2;
        if( cbReferCard != 0 )
        {
            if(this.GetCardLogicValue(cbReferCard)-cbLessLineCount<2) return;
            cbReferIndex = this.GetCardLogicValue(cbReferCard)-cbLessLineCount+1;
        }
        //超过A
        if( cbReferIndex+cbLessLineCount > 14 ) return cbResultCount;

        //长度判断
        if( cbHandCardCount < cbLessLineCount*cbBlockCount ) return cbResultCount;

        //构造扑克
        var cbCardData = new Array();
        var cbCardCount=cbHandCardCount;
        for(var i=0;i<cbHandCardCount;i++)
        {
            cbCardData[i] = cbHandCardData[i];
        }

        //排列扑克
        this.SortCardList(cbCardData,cbCardCount);

        //分析扑克
        var Distributing = new tagDistributing();
        this.AnalysebDistributing(cbCardData,cbCardCount,Distributing);

        //搜索顺子
        var cbTmpLinkCount = 0;
        for (var cbValueIndex=cbReferIndex;cbValueIndex<13;cbValueIndex++)
        {
            //继续判断
            if ( Distributing.cbDistributing[cbValueIndex][cbIndexCount]<cbBlockCount )
            {
                if( cbTmpLinkCount < cbLessLineCount )
                {
                    cbTmpLinkCount=0;
                    continue;
                }
                else cbValueIndex--;
            }
            else
            {
                cbTmpLinkCount++;
                //寻找最长连
                if( cbLineCount == 0 ) continue;
            }

            if( cbTmpLinkCount >= cbLessLineCount )
            {
                if( pSearchCardResult == null ) return 1;

                if( cbResultCount >= pSearchCardResult.cbCardCount.length ) return;

                //复制扑克
                var cbCount = 0;
                for( var cbIndex = cbValueIndex+1-cbTmpLinkCount; cbIndex <= cbValueIndex; cbIndex++ )
                {
                    var cbTmpCount = 0;
                    for (var cbColorIndex=0;cbColorIndex<4;cbColorIndex++)
                    {
                        for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3-cbColorIndex]; cbColorCount++ )
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++]=this.MakeCardData(cbIndex,3-cbColorIndex);

                            if( ++cbTmpCount == cbBlockCount ) break;
                        }
                        if( cbTmpCount == cbBlockCount ) break;
                    }
                }

                //设置变量
                pSearchCardResult.cbCardCount[cbResultCount] = cbCount;
                cbResultCount++;

                if( cbLineCount != 0 )
                {
                    cbTmpLinkCount--;
                }
                else
                {
                    cbTmpLinkCount = 0;
                }
            }
        }

        //特殊顺子
        if( cbTmpLinkCount >= cbLessLineCount-1 && cbValueIndex == 13 )
        {
            if( Distributing.cbDistributing[0][cbIndexCount] >= cbBlockCount ||
                cbTmpLinkCount >= cbLessLineCount )
            {
                if( pSearchCardResult == null ) return 1;

                if( cbResultCount >= pSearchCardResult.cbCardCount.length );

                //复制扑克
                var cbCount = 0;
                var cbTmpCount = 0;
                for( var cbIndex = cbValueIndex-cbTmpLinkCount; cbIndex < 13; cbIndex++ )
                {
                    cbTmpCount = 0;
                    for (var cbColorIndex=0;cbColorIndex<4;cbColorIndex++)
                    {
                        for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3-cbColorIndex]; cbColorCount++ )
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++]=this.MakeCardData(cbIndex,3-cbColorIndex);

                            if( ++cbTmpCount == cbBlockCount ) break;
                        }
                        if( cbTmpCount == cbBlockCount ) break;
                    }
                }
                //复制A
                if( Distributing.cbDistributing[0][cbIndexCount] >= cbBlockCount )
                {
                    cbTmpCount = 0;
                    for (var cbColorIndex=0;cbColorIndex<4;cbColorIndex++)
                    {
                        for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[0][3-cbColorIndex]; cbColorCount++ )
                        {
                            pSearchCardResult.cbResultCard[cbResultCount][cbCount++]=this.MakeCardData(0,3-cbColorIndex);

                            if( ++cbTmpCount == cbBlockCount ) break;
                        }
                        if( cbTmpCount == cbBlockCount ) break;
                    }
                }

                //设置变量
                pSearchCardResult.cbCardCount[cbResultCount] = cbCount;
                cbResultCount++;
            }
        }

        if( pSearchCardResult )
            pSearchCardResult.cbSearchCount = cbResultCount;
        return cbResultCount;
    },

    //搜索飞机
    SearchThreeTwoLine:function ( cbHandCardData, cbHandCardCount, pSearchCardResult )
    {
        //设置结果
        if (pSearchCardResult) {
            pSearchCardResult.cbSearchCount = 0;
            for (var i = 0; i < 20; i++) {
                pSearchCardResult.cbCardCount[i] = 0;
                for (var j = 0; j < 20; j++) {
                    pSearchCardResult.cbResultCard[i][j] = 0;
                }
            }
        }

        //变量定义
        var tmpSearchResult = GameDef.tagSearchCardResult();
        var tmpSingleWing = GameDef.tagSearchCardResult();
        var tmpDoubleWing = GameDef.tagSearchCardResult();
        var cbTmpResultCount = 0;

        //搜索连牌
        cbTmpResultCount = this.SearchLineCardType(cbHandCardData, cbHandCardCount, 0, 3, 0, tmpSearchResult);

        if (cbTmpResultCount > 0) {
            //提取带牌
            for (var i = 0; i < cbTmpResultCount; i++) {
                //变量定义
                var cbTmpCardData = new Array();
                var cbTmpCardCount = cbHandCardCount;
                for (var j = 0; j < cbHandCardCount; j++) {
                    cbTmpCardData[j] = cbHandCardData[j];
                }
                //删除连牌
                this.RemoveCard(tmpSearchResult.cbResultCard[i], tmpSearchResult.cbCardCount[i], cbTmpCardData, cbTmpCardCount)
                cbTmpCardCount -= tmpSearchResult.cbCardCount[i];

                //分析牌
                var TmpResult = new tagAnalyseResult();
                this.AnalysebCardData(cbTmpCardData, cbTmpCardCount, TmpResult);
                if (TmpResult.cbBlockCount[0] > 2) {
                    var index = tmpSingleWing.cbSearchCount;
                    tmpSingleWing.cbCardCount[index] = 8;
                    for (var j = 0; j < 6; j++) {
                        tmpSingleWing.cbResultCard[index][j] = tmpSearchResult.cbResultCard[i][j];
                    }
                    //tmpSingleWing.cbResultCard[index][6]=TmpResult.cbCardData[0][0];
                    //tmpSingleWing.cbResultCard[index][7]=TmpResult.cbCardData[0][1];
                    for (var j = 0; j < 2; j++) {
                        tmpSingleWing.cbResultCard[index][6 + j] = TmpResult.cbCardData[0][TmpResult.cbBlockCount[0] - j - 1];
                    }
                    tmpSingleWing.cbSearchCount++;
                }

                if (TmpResult.cbBlockCount[1] > 2) {
                    var index = tmpDoubleWing.cbSearchCount;
                    tmpDoubleWing.cbCardCount[index] = 10;
                    for (var j = 0; j < 6; j++) {
                        tmpDoubleWing.cbResultCard[index][j] = tmpSearchResult.cbResultCard[i][j];
                    }
                    // memcpy(tmpDoubleWing.cbResultCard[index],tmpSearchResult.cbResultCard[i],6);
                    //tmpSingleWing.cbResultCard[index][6]=TmpResult.cbCardData[1][0];
                    //tmpSingleWing.cbResultCard[index][7]=TmpResult.cbCardData[1][1];
                    //tmpSingleWing.cbResultCard[index][8]=TmpResult.cbCardData[1][2];
                    //tmpSingleWing.cbResultCard[index][9]=TmpResult.cbCardData[1][3];
                    for (var j = 0; j < 4; j++) {
                        tmpDoubleWing.cbResultCard[index][6 + j] = TmpResult.cbCardData[1][TmpResult.cbBlockCount[1] * 2 - j - 1];
                    }
                    // memcpy(&tmpDoubleWing.cbResultCard[index][6],TmpResult.cbCardData[1],4);
                    tmpDoubleWing.cbSearchCount++;
                }
            }

            //复制结果
            // for( var i = 0; i < tmpSearchResult.cbSearchCount; i++ )
            // {
            //     var cbResultCount = pSearchCardResult.cbSearchCount++;
            //      for( var j = 0; j < tmpSearchResult.cbCardCount[i]; j++ )
            //      {
            //         pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchResult.cbResultCard[i][j];
            //      }
            //     pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchResult.cbCardCount[i];
            // }
            for (var i = 0; i < tmpDoubleWing.cbSearchCount; i++) {
                var cbResultCount = pSearchCardResult.cbSearchCount++;
                for (var j = 0; j < tmpDoubleWing.cbCardCount[i]; j++) {
                    pSearchCardResult.cbResultCard[cbResultCount][j] = tmpDoubleWing.cbResultCard[i][j];
                }
                pSearchCardResult.cbCardCount[cbResultCount] = tmpDoubleWing.cbCardCount[i];
            }
            for (var i = 0; i < tmpSingleWing.cbSearchCount; i++) {
                var cbResultCount = pSearchCardResult.cbSearchCount++;
                for (var j = 0; j < tmpSingleWing.cbCardCount[i]; j++) {
                    pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSingleWing.cbResultCard[i][j];
                }
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSingleWing.cbCardCount[i];
            }
        }

        return pSearchCardResult == null ? 0 : pSearchCardResult.cbSearchCount;
    },
    IsGoodCard:function(cbHandCardData, cbHandCardCount){
        var TempCard = new Array();
        for(var i=0;i<cbHandCardCount;i++) TempCard[i] = cbHandCardData[i];
        this.SortCardList(TempCard, cbHandCardCount);
        var AnalyseResult = new tagAnalyseResult() ;
        this.AnalysebCardData(TempCard,cbHandCardCount,AnalyseResult);
        if(AnalyseResult.cbKingCount == 2) return true;
        var b2Bomb = false;
        for(var i = 0;i<AnalyseResult.cbBlockCount[3];i++){
            if(this.GetCardValue( AnalyseResult.cbCardData[3][i*4]) == 2) return true;
        }
        return false;
    },
});

module.exports = CGameLogic;
