//CMD_Game.js
CMD_GAME_50001 = new cc.Class({
    ctor: function () {
        //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID = 50001;                  //CardPrefab_50001中有为了牌背而设置的单独KIND_ID
        this.GAME_PLAYER = 8;					//游戏人数
        this.MAX_COUNT = 2;					//最大数目
        this.FULL_COUNT = 40;
        this.H_FULL_COUNT = 20;
        this.MYSELF_VIEW_ID = 2;
        this.CARD_WIGTH = 177;
        this.CARD_HEIGHT = 236;
        this.g_GameEngine               = null;

        /////////////////////////////////////东北推筒子/////////////////////////
        this.GAME_TYPE_CARDCOUNT_20         = 0x00000001;                //20张牌
        this.GAME_TYPE_CARDCOUNT_40         = 0x00000002;                //40张牌
        this.GAME_TYPE_CARD_PRIVATE         = 0x00000004;                //普通
        this.GAME_TYPE_CARD_PUBLIC          = 0x00000008;                //明牌

        this.GAME_TYPE_ROUND_1				= 0x00020000;				//打10局 1017
        this.GAME_TYPE_ROUND_2				= 0x00040000;				//打20局 1018
        this.GAME_TYPE_ROUND_3				= 0x00080000;				//打30局 1019

        this.GAME_TYPE_PUSH_SCORE_4			= 0x00000010;				//推注上限4
        this.GAME_TYPE_PUSH_SCORE_8			= 0x00000020;				//推注上限8
        this.GAME_TYPE_PUSH_SCORE_16		= 0x00000040;			    //推注上限16
        this.GAME_TYPE_PUSH_SCORE_32		= 0x00000080;				//推注上限32
        this.GAME_TYPE_PUSH_SCORE_64		= 0x00000100;				//推注上限64

        this.GAME_TYPE_BANKER_RAND			= 0x00000200;				//随机上庄
        this.GAME_TYPE_BANKER_FIX			= 0x00000400;				//固定庄
        this.GAME_TYPE_BANKER_TURN			= 0x00000800;				//轮流坐庄
        this.GAME_TYPE_BANKER_GRAB          = 0x00001000;               //抢庄

        this.GAME_TYPE_DIFF_BIG             = 0x00002000;               //毕十分大小：同为0点（1+9 2+8 3+7），比最大的牌，都一样则庄胜（如果有二八杠则除外）
        this.GAME_TYPE_NODIFF_BIG           = 0x00004000;               //不分大小：同为0点 则直接庄胜
                                                                        
        this.GAME_TYPE_28GANG               = 0x00008000;               //勾选了就带28杠
        this.GAME_TYPE_ALL_DOUBLE           = 0x00010000;               //通杀同赔 庄家全赢或者全输则翻倍
        this.GAME_TYPE_DOUBLE               = 0x00020000;               //翻倍  八九点X2（包括8.5；9.5），二八杠x3, 对子x4  对红中x5（选28杠）
                                                                        //八九点X2（包括8.5；9.5），          对子x3  对红中x4 （不选28杠）
        this.GAME_TYPE_HALF_IN              = 0x00040000;               //中途加入

        this.GAME_TYPE_START_2				= 0x00080000;				//满2人开始
        this.GAME_TYPE_START_3				= 0x00100000;			    //满3人开始
        this.GAME_TYPE_START_4				= 0x00200000;				//满4人开始
        this.GAME_TYPE_START_5				= 0x00400000;				//满5人开始
        this.GAME_TYPE_START_6				= 0x00800000;				//满6人开始
        this.GAME_TYPE_START_7				= 0x01000000;				//满7人开始
        this.GAME_TYPE_START_8				= 0x02000000;				//满8人开始



        //////////////////////////////////////////////////////////////////////////////////
        //扑克类型
        this.CT_JH_SINGLE = 1;									//单牌类型
        this.CT_JH_DOUBLE = 2;									//对子类型
        this.CT_JH_SHUN_ZI = 3;									//顺子类型
        this.CT_JH_JIN_HUA = 4;									//金花类型
        this.CT_JH_SHUN_JIN = 5;								//顺金类型
        this.CT_JH_BAO_ZI = 6;									//豹子类型

        this.CT_SG_P0 = 1;									//单牌类型
        this.CT_SG_P1 = 2;									//单牌类型
        this.CT_SG_P2 = 3;									//单牌类型
        this.CT_SG_P3 = 4;									//单牌类型
        this.CT_SG_P4 = 5;									//单牌类型
        this.CT_SG_P5 = 6;									//单牌类型
        this.CT_SG_P6 = 7;									//单牌类型
        this.CT_SG_P7 = 8;									//单牌类型
        this.CT_SG_P8 = 9;									//单牌类型
        this.CT_SG_P9 = 10;									//单牌类型
        this.CT_SG_HUN = 11;								//混三公
        this.CT_SG_SMALL = 12;								//小三公
        this.CT_SG_BIG = 13;								//大三公
        this.CT_SG_BAO_ZI = 14;								//豹子类型 333
        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GS_TK_FREE = 0;					    //等待开始
        this.GS_TK_CALLBANKER = 100;					//游戏进行
        this.GS_TK_CALLPLAYER = 101;					//游戏进行
        this.GS_TK_PLAYING = 102;					//游戏进行

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_S_GAME_START = 100;					//游戏开始
        this.SUB_S_USER_READY = 101;					//控制开始
        this.SUB_S_ADD_SCORE = 102;                     //下注消息
        this.SUB_S_SEND_CARD = 103;					    //发牌消息
        this.SUB_S_LOOK_CARD = 104;                     //看牌消息
        this.SUB_S_OPEN_CARD = 110;					    //开牌消息
        this.SUB_S_GAME_END = 105;					    //游戏结束
        this.SUB_S_CALL_BANKER = 107;					//抢庄（用户抢/不抢）
        this.SUB_S_BANKER_USER = 109;					//抢庄结束
        this.SUB_S_BE_BANKER = 111;                     //对子玩家坐庄消息
        this.SUB_S_ALL_ADD   =112;                       //所有人下完注

        //--------------------------------------------------------------------
        this.SUB_S_CALL_PLAYER = 106;					//发牌操作
        this.SUB_S_START_CTRL = 108;					//控制开始
        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_READY = 6;					    //准备
        this.SUB_C_CALL_BANKER = 1;				    //用户抢庄
        this.SUB_C_ADD_SCORE = 2;					//用户下注
        this.SUB_C_LOOK_CARD = 3;					//用户看牌
        this.SUB_C_OPEN_CARD = 4;					//用户开牌
        this.SUB_C_TOBEBANKER = 7;					//用户开牌
    },

    //空闲状态
    CMD_S_StatusFree: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							//基础积分
        Obj.dwCountDown = 0;
        return Obj;
    },
    //游戏状态
    CMD_S_StatusCallBanker: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusCallBanker'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.dwCountDown = 0;
        Obj.wLastBanker = 0;
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	    //手牌
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbBankerTimes = new Array(this.GAME_PLAYER);
        Obj.bChoose = 0;
        Obj.cbLastMaxCnt = 0;
        Obj.cbLastMaxUser = new Array(2);
        return Obj;
    },
    //下注状态
    CMD_S_StatusCallPlayer: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusCallPlayer'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.dwCountDown = 0;
        Obj.wBankerUser = 0;   	
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	    //手牌
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);					                //庄家用户
        Obj.wLastBanker = 0;
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);
        Obj.llAddScore = new Array(this.GAME_PLAYER);               //下注分数
        Obj.llGameScore = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusPlay'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.dwCountDown = 0;
        Obj.wBankerUser = 0;   						                //庄家用户
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.llAddScore = new Array(this.GAME_PLAYER);               //下注分数
        Obj.bLookCard = new Array(this.GAME_PLAYER); //看牌情况
        Obj.bOpenCard = new Array(this.GAME_PLAYER); //开牌情况

        return Obj;
    },

    //准备状态
    CMD_S_ReadyState: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ReadyState"
        Obj.cbReadyStatus = new Array(this.GAME_PLAYER);  		 //手上扑克    			
        return Obj;
    },

    //游戏开始
    CMD_S_GameStart: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameStart"
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //玩家状态
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	    //手牌
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.wBankerUser = 0;                    //庄家用户
        Obj.wLastBanker = 0;                    //上局庄家
        Obj.cbLastMaxCnt = 0;                   //最大对子人数
        Obj.cbLastMaxUser = new Array(2);
        Obj.llGameScore = new Array(this.GAME_PLAYER);
        Obj.llLastAddScore = new Array(this.GAME_PLAYER);

        return Obj;
    },


    //用户抢庄
    CMD_S_UserCall: function () {
        var Obj = new Object();
        //Obj._name="CMD_S_UserCall"  			
        Obj.wChairID = 0;
        Obj.byTimes = 0;
        return Obj;
    },

    //用户坐庄
    CMD_S_BeBanker: function () {
        var Obj = new Object();
        Obj.wBankerUser = 0;
        Obj.wChooseUser = 0;
        Obj.bBanker = 0;
        Obj.wLastBanker = 0;

        return Obj;
    },


    //下注
    CMD_S_AddScore: function () {
        var Obj = new Object();
        // Obj._name="CMD_S_GameStart"
        Obj.bIsBet = new Array(this.GAME_PLAYER);	    //下注状况
        Obj.wAddUser = 0;	                            //下注玩家
        Obj.lAddScore = 0;	                            //下注分
        return Obj;
    },
    //所有人下注完成 显示开牌
    CMD_S_Alladd: function () {
        var Obj = new Object();
        //Obj.bIsBet = new Array(this.GAME_PLAYER);	    //下注状况
        //Obj.wAddUser = 0;	                            //下注玩家
        //Obj.lAddScore = 0;	                            //下注分
        Obj.bIsBet = 0;
        return Obj;
    },

    //发牌
    CMD_S_SendCard: function () {
        var Obj = new Object();
        // Obj._name="CMD_S_GameStart"
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	    //手牌
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbDice = new Array(2);	                            //骰子点数
        return Obj;
    },

    //看牌
    CMD_S_LookCard: function () {
        var Obj = new Object();
        Obj.wLookUser = 0;                  //看牌玩家
        return Obj;
    },

    //开牌
    CMD_S_Open_Card: function () {
        var Obj = new Object();
        Obj.wOpenUser = 0;
        Obj.cbHandCardData = new Array(this.MAX_COUNT);	    //手牌
        return Obj;
    },

    //游戏结束
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameEnd"		
        //积分变量      
        Obj.llGameScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.bScoreZeor =new Array(this.GAME_PLAYER);
        Obj.cbAllWinorLose = 0; //通杀1 通陪2
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	    //手牌
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },

    //大结算
    CMD_S_GameCustomInfo: function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameCustomInfo"	
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//总分
        Obj.cbWinCount = new Array(this.GAME_PLAYER);
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);
        return Obj;
    },

    ///////////////////////////////////////////////////////////////////
    //用户加注
    CMD_C_AddScore: function () {
        var Obj = new Object();
        Obj.lAddScore = 0;
        return Obj;
    },

    //用户抢庄
    CMD_C_CallScore: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.cbTimes = 0;
        return Obj;
    },

    //用户坐庄
    CMD_C_ToBeBanker: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.bToBeBanker = 0;
        return Obj;
    },

    //-------------------------------------------------------



    CMD_C_OpenCard: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_OpenCard"		
        Obj.cbCardData = 0;
        return Obj;
    },
    ///////////////////////////////////////////////////////////    
    GetGameMode: function (dwServerRules, dwRulesArr) {
        var str = '二八杠';
        return str;
    },
    GetPlayerCount: function (dwServerRule,dwRules) {
        return this.GAME_PLAYER;
    },

    GetGameCount: function (dwServerRules,dwRules) {
        if (dwServerRules & this.GAME_TYPE_ROUND_1) return 10;
        if (dwServerRules & this.GAME_TYPE_ROUND_2) return 20;
        if (dwServerRules & this.GAME_TYPE_ROUND_3) return 30;
        return '';
    },

    GetProgress:function(wProgress, dwServerRules , dwRulesArr){ 
        var cnt=this.GetGameCount(dwServerRules , dwRulesArr);
        if(wProgress >= 0 && cnt > 0){
            return '第'+ wProgress+'/'+ cnt+'局';
        }else{
            return '';
        }
    },

    GetBankerMode: function (rules) {
        if (rules[0] & this.GAME_TYPE_BANKER_RAND) return "随机庄";
        if (rules[0] & this.GAME_TYPE_BANKER_GRAB) return "每局抢庄";
        if (rules[0] & this.GAME_TYPE_BANKER_FIX) return "固定庄";
        if (rules[0] & this.GAME_TYPE_BANKER_TURN) return "轮流庄";
        return '固定庄';
    },

    GetStartMode: function (rules) {
        if (rules[0] & this.GAME_TYPE_START_2) return "满2人开始";
        if (rules[0] & this.GAME_TYPE_START_3) return "满3人开始";
        if (rules[0] & this.GAME_TYPE_START_4) return "满4人开始";
        if (rules[0] & this.GAME_TYPE_START_5) return "满5人开始";
        if (rules[0] & this.GAME_TYPE_START_6) return "满6人开始";
        if (rules[0] & this.GAME_TYPE_START_7) return "满7人开始";
        if (rules[0] & this.GAME_TYPE_START_8) return "满8人开始";
        return '';
    },

    GetBaseScore: function (rules) {
        return '1';
    },
    
    // GetBaseScoreStr: function (dwServerRules,rules) {
    //     return '底分1';
    // },

    GetPushScore: function (rules) {
        if (rules & this.GAME_TYPE_PUSH_SCORE_4) return 4;
        if (rules & this.GAME_TYPE_PUSH_SCORE_8) return 8;
        if (rules & this.GAME_TYPE_PUSH_SCORE_16) return 16;
        if (rules & this.GAME_TYPE_PUSH_SCORE_32) return 32;
        if (rules & this.GAME_TYPE_PUSH_SCORE_64) return 64;
        return 4;
    },

    //游戏规则
    GetRulesStr: function (ServerRule,rules) {
        var str = "";//this.GetPlayerCount(ServerRule,rules) + "人";
        str += "  " + this.GetGameCount(ServerRule,rules);
        str += "  " + this.GetBankerMode(rules);
        str += "  " + this.GetStartMode(rules);
        str += "  " + "推注：" + this.GetPushScore(rules[0]);
        if(rules[0] & this.GAME_TYPE_CARDCOUNT_20) str += "  " + "20张牌";
        else str += "  " + "40张牌";
        if(rules[0] & this.GAME_TYPE_CARD_PUBLIC)  str += "  " + "明牌";
        else str += "  " + "普通";
        if(rules[0] & this.GAME_TYPE_DIFF_BIG)     str += "  " + "毕十分大小";
        else str += "  " + "毕十不分大小";

        if(rules[0] & this.GAME_TYPE_28GANG)       str += "  " + "28杠";
        if(rules[0] & this.GAME_TYPE_ALL_DOUBLE)   str += "  " + "通杀同赔";
        if(rules[0] & this.GAME_TYPE_DOUBLE)       str += "  " + "翻倍";
        if(rules[0] & this.GAME_TYPE_HALF_IN)      str += "  " + "中途加入";

        return str;
    },
    IsNoCheat: function (rules) { return true; },
    ///////////////////////////////////////////////////////////////////
    //GameLogic

    //用于显示牌型 所以不用计算是否28杠
    GetCardScore: function (cbCardData) {
        var cbLogicValue = this.GetCardLogicValue(cbCardData[0]) + this.GetCardLogicValue(cbCardData[1]);
        if (cbCardData[0] == cbCardData[1]) {
            if (cbCardData[0] == 0x15) {
                cbLogicValue += 400;
            } else {
                cbLogicValue += 200;
            }
        }
        if (cbLogicValue >= 100 && cbLogicValue <= 180) cbLogicValue -= 100;
        return cbLogicValue;
        
    },
    Is28Gang:function(cbCardData,dwCustomRule){
        if((dwCustomRule&this.GAME_TYPE_28GANG)== 0)return false;
        var cbFirst = this.GetCardValue(cbCardData[0]);
        var cbSecond = this.GetCardValue(cbCardData[1]);
    
        return (cbFirst == 2 && cbSecond == 8) || (cbFirst == 8 && cbSecond == 2);
    },
    GetCardLogicValue: function (cbCardData) {
        var cbCardColor = this.GetCardColor(cbCardData);
        var cbCardValue = this.GetCardValue(cbCardData);
        var cbLogicValue;
        if (cbCardColor == 0x10)cbLogicValue = 5;
        else cbLogicValue = cbCardValue * 10;
        return cbLogicValue;
    },

    GetCardValue: function (cbCardData) { return (cbCardData & 0x0f); },

    GetCardColor: function (cbCardData) { return (cbCardData & 0xf0); },

    //--------------------------------------------------

    SortCardListSG: function (cbCardData) {
        //转换数值
        var cbLogicValue = new Array()
        for (var i = 0; i < 3; i++) cbLogicValue[i] = this.GetCardValue(cbCardData[i]);
        //排序操作
        var bSorted = true;
        var cbTempData, bLast = 2;
        do {
            bSorted = true;
            for (var i = 0; i < bLast; i++) {
                if ((cbLogicValue[i] < cbLogicValue[i + 1]) ||
                    ((cbLogicValue[i] == cbLogicValue[i + 1]) && (cbCardData[i] < cbCardData[i + 1]))) {
                    //交换位置
                    cbTempData = cbCardData[i];
                    cbCardData[i] = cbCardData[i + 1];
                    cbCardData[i + 1] = cbTempData;
                    cbTempData = cbLogicValue[i];
                    cbLogicValue[i] = cbLogicValue[i + 1];
                    cbLogicValue[i + 1] = cbTempData;
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);
    },
    //排列扑克
    SortCardList: function (cbCardData) {
        //转换数值
        var cbLogicValue = new Array()
        for (var i = 0; i < 3; i++) cbLogicValue[i] = this.GetCardLogicValue(cbCardData[i]);

        //排序操作
        var bSorted = true, cbTempData, bLast = 2;

        do {
            bSorted = true;
            for (var i = 0; i < bLast; i++) {
                if ((cbLogicValue[i] < cbLogicValue[i + 1]) ||
                    ((cbLogicValue[i] == cbLogicValue[i + 1]) && (cbCardData[i] < cbCardData[i + 1]))) {
                    //交换位置
                    cbTempData = cbCardData[i];
                    cbCardData[i] = cbCardData[i + 1];
                    cbCardData[i + 1] = cbTempData;
                    cbTempData = cbLogicValue[i];
                    cbLogicValue[i] = cbLogicValue[i + 1];
                    cbLogicValue[i + 1] = cbTempData;
                    bSorted = false;
                }
            }
            bLast--;
        } while (bSorted == false);
        return;
    },

    GetSGCardType: function (CardData) {
        var byCardPoint = 0, bAll3 = true, bAllBig = true, bAllSame = true;
        var byCardValue = new Array();
        this.SortCardListSG(CardData);//KQ...32A

        //解析牌型
        for (var i = 0; i < 3; i++) {
            byCardValue[i] = this.GetCardValue(CardData[i]);
            if (byCardValue[i] != 3) bAll3 = false;
            if (byCardValue[i] <= 10) bAllBig = false;
            if (i > 0 && byCardValue[i] != byCardValue[i - 1]) bAllSame = false;
            if (byCardValue[i] < 10) byCardPoint += byCardValue[i];
        }

        if (bAll3) return this.CT_SG_BAO_ZI;
        else if (bAllSame) return (bAllBig ? this.CT_SG_BIG : this.CT_SG_SMALL);
        else if (bAllBig) return this.CT_SG_HUN;
        else return (byCardPoint % 10 + this.CT_SG_P0);
    },

    GetJHCardType: function (CardData) {
        var bySameCnt = 1, bSameColor = true, bLine = true;
        var byCardValue = new Array();
        this.SortCardList(CardData);

        for (var i = 0; i < 3; i++) {
            byCardValue[i] = this.GetCardLogicValue(CardData[i]);
            if (i > 0) {
                if (byCardValue[i] == byCardValue[i - 1]) bySameCnt++;
                if (byCardValue[i] != byCardValue[i - 1] - 1) bLine = false;
                if (this.GetCardColor(CardData[i]) != this.GetCardColor(CardData[i - 1])) bSameColor = false;
            }
        }

        //A32
        if (byCardValue[0] == 14 && byCardValue[1] == 3 && byCardValue[2] == 2) bLine = true;

        if (bySameCnt == 3) return this.CT_JH_BAO_ZI;				//豹子
        else if (bSameColor && bLine) return this.CT_JH_SHUN_JIN;	//顺金
        else if (bSameColor) return this.CT_JH_JIN_HUA;				//金花
        else if (bLine) return this.CT_JH_SHUN_ZI;					//顺子
        else if (bySameCnt == 2) return this.CT_JH_DOUBLE;			//对子
        else return this.CT_JH_SINGLE;
    },
     //游戏模式
    //  GetGameMode:function(ServerRules, RulesArr){
    //     var str='推筒子';
    //     return str;
    // },
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
});

GameDef = null;
//////////////////////////////////////////////////////////////////////////////////