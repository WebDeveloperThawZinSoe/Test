//CMD_Game.js
CMD_GAME_60001 = new cc.Class({ //window.
    ctor:function  () {
       //游戏属性
       this.CARD_TEST = true;
        this.KIND_ID 						= 60001;
        this.GAME_PLAYER					= 3;							//游戏人数
        this.MYSELF_VIEW_ID					= 1;							//自己视图ID

        this.FULL_COUNT						= 48;							//全牌数目
        this.MAX_CARD_COUNT					= 16;							//最大数目
        this.MAX_SAME_COUNT					= 4;							//最大同张
        this.MIN_STRAIGHT_COUNT_1			= 5;							//最小单顺子张数
        this.MIN_STRAIGHT_COUNT_2			= 2;							//最小双顺子张数
        this.MAX_CARD_INDEX					= 15;							//最大索引
        this.MAX_COUNT                      = 16;
        this.CARD_WIGTH						= 177;
        this.CARD_HEIGHT					= 240;

        //逻辑类型
        this.CT_ERROR						= 0;							// 错误类型
        this.CT_SINGLE						= 1;							// 单牌类型
        this.CT_DOUBLE						= 2;							// 对牌类型
        this.CT_THREE						= 3;							// 三张类型
        this.CT_SINGLE_LINE					= 4;							// 单连类型
        this.CT_DOUBLE_LINE					= 5;							// 对连类型
        this.CT_THREE_LINE					= 6;							// 三连类型
        this.CT_3_TAKE_1_1					= 7;							// 三带一单
        this.CT_3_TAKE_2_1					= 8;							// 三带二单
        this.CT_3_TAKE_1_2					= 9;							// 三带一对
        this.CT_3_TAKE_2_2					= 10;							// 三带二对
        this.CT_4_TAKE_1_1					= 11;							// 四带一单
        this.CT_4_TAKE_1_3					= 12;							// 四带一三张
        this.CT_4_TAKE_2_1					= 13;							// 四带二单
        this.CT_4_TAKE_3_1					= 14;							// 四带三单
        this.CT_4_TAKE_4_1					= 15;							// 四带四单
        this.CT_4_TAKE_1_2					= 16;							// 四带一对
        this.CT_4_TAKE_2_2					= 17;							// 四带二对
 	    this.CT_AIRPLANE_TAKE_1_1			= 18;							//飞机带1单 3334445
        this.CT_AIRPLANE_TAKE_1_2			= 19;							//飞机带1对 33344455
        this.CT_AIRPLANE_TAKE_2_1			= 20;							//飞机带2单 33344456
        this.CT_AIRPLANE_TAKE_3_1           = 21;                           //飞机带3单 333444567
 	    this.CT_AIRPLANE_TAKE_2_2			= 22;							//飞机带2对 3334445566
        this.CT_BOMB_CARD					= 23;							// 炸弹类型
        this.CT_MISSILE_CARD				= 24;							// 火箭类型

        this.SP_CT_ALL_BLACK				= 0x01;							// 特殊牌型 全黑
        this.SP_CT_ALL_RED					= 0x02;							// 特殊牌型 全红
        this.SP_CT_ALL_BIG					= 0x04;							// 特殊牌型 全大
        this.SP_CT_ALL_SMALL				= 0x08;							// 特殊牌型 全小
        this.SP_CT_ALL_SINGLE				= 0x10;							// 特殊牌型 全单
        this.SP_CT_ALL_DOUBLE				= 0x20;							// 特殊牌型 全双

        //////////////////////////////////////////////////////////////////////////////////

		this.RuleValue0 = 0x00000001;
		this.RuleValue1 = 0x00000002;
		this.RuleValue2 = 0x00000004;
		this.RuleValue3 = 0x00000008;
		this.RuleValue4 = 0x00000010;
		this.RuleValue5 = 0x00000020;
		this.RuleValue6 = 0x00000040;
		this.RuleValue7 = 0x00000080;
		this.RuleValue8 = 0x00000100;
		this.RuleValue9 = 0x00000200;
		this.RuleValue10 = 0x00000400;
		this.RuleValue11 = 0x00000800;
		this.RuleValue12 = 0x00001000;
		this.RuleValue13 = 0x00002000;
		this.RuleValue14 = 0x00004000;
		this.RuleValue15 = 0x00008000;
		this.RuleValue16 = 0x00010000;
		this.RuleValue17 = 0x00020000;
		this.RuleValue18 = 0x00040000;
		this.RuleValue19 = 0x00080000;
		this.RuleValue20 = 0x00100000;
		this.RuleValue21 = 0x00200000;
		this.RuleValue22 = 0x00400000;
		this.RuleValue23 = 0x00800000;
		this.RuleValue24 = 0x01000000;
		this.RuleValue25 = 0x02000000;
		this.RuleValue26 = 0x04000000;
		this.RuleValue27 = 0x08000000;
		this.RuleValue28 = 0x10000000;
		this.RuleValue29 = 0x20000000;
		this.RuleValue30 = 0x40000000;
		this.RuleValue31 = 0x80000000;
        // 服务器规则
        // 局数 
        this.GAME_TYPE_ROUND_0			= (this.RuleValue20);							//	局数 8局
        this.GAME_TYPE_ROUND_1			= (this.RuleValue21);							//	局数 10局
        this.GAME_TYPE_ROUND_2			= (this.RuleValue22);							//	局数 20局
        this.GAME_TYPE_ROUND_3			= (this.RuleValue23);							//	局数 ??局
        // 玩家人数
        this.GAME_TYPE_P_COUNT_0		= (this.RuleValue16);							//	玩家人数 2人
        this.GAME_TYPE_P_COUNT_1		= (this.RuleValue17);							//	玩家人数 3人
        this.GAME_TYPE_P_COUNT_2		= (this.RuleValue18);							//	玩家人数 4人
        // 规则数组1
        this.GAME_TYPE_BASE_1			= (this.RuleValue0);						    //	底分 2
        this.GAME_TYPE_BASE_2			= (this.RuleValue1);						    //	底分 5
        this.GAME_TYPE_BASE_3			= (this.RuleValue2);						    //	底分 10
        this.GAME_TYPE_BASE_4			= (this.RuleValue3);						    //	底分 20
        this.GAME_TYPE_BASE_5			= (this.RuleValue4);						    //	底分 50
        this.GAME_TYPE_BASE_6			= (this.RuleValue5);						    //	底分 100
        this.GAME_TYPE_BASE_7			= (this.RuleValue6);						    //	底分 200
        this.GAME_TYPE_MUST_OUT_CARD    = (this.RuleValue7);                            //  必出/不必出
        // 手牌数量
        this.GAME_TYPE_HAND_COUNT_15	= (this.RuleValue8);							//	手牌数量 15张
        this.GAME_TYPE_HAND_COUNT_16	= (this.RuleValue9);							//	手牌数量 16张
        // 首局出牌
        this.GAME_TYPE_FIRST_CARD_0x33	= (this.RuleValue10);							//	黑桃3先出
        this.GAME_TYPE_FIRST_CARD_0x33_1= (this.RuleValue11);						    //	黑桃3必须首出
        this.GAME_TYPE_FIRST_CARD_NONE  = (this.RuleValue12);                            //  首出无要求
        this.GAME_TYPE_FIRST_CARD_WIN   = (this.RuleValue13);                            //  第二局赢家先出

        this.GAME_TYPE_BOMB_BREAK_NO    = (this.RuleValue14);                            //  炸弹不可拆
        this.GAME_TYPE_4_TAKE_3			= (this.RuleValue15);							//	可四带三 / 不可四带三
        // 显示牌数
        this.GAME_TYPE_CARD_COUNT_ON	= (this.RuleValue18);							//	显示余牌 / 不显示余牌

        this.GAME_TYPE_3_TAKE_LITTLE    = (this.RuleValue19);                           //  三张可少带出完
        this.GAME_TYPE_3_JOIN_LITTLE    = (this.RuleValue20);                           //  三张可少带接完
        this.GAME_TYPE_F_TAKE_LITTLE    = (this.RuleValue21);                           //  飞机可少带出完
        this.GAME_TYPE_F_JOIN_LITTLE    = (this.RuleValue22);                           //  飞机可少带接完
        // 自动托管
        this.GAME_TYPE_AUTO_TRUSTEE_0	= (this.RuleValue27);							//	自动托管 不托管
        this.GAME_TYPE_AUTO_TRUSTEE_1	= (this.RuleValue28);							//	自动托管 60S
        this.GAME_TYPE_AUTO_TRUSTEE_2	= (this.RuleValue29);							//	自动托管 90S
        this.GAME_TYPE_AUTO_TRUSTEE_3	= (this.RuleValue30);							//	自动托管 120S




        // // 抓鸟翻倍
        // this.GAME_TYPE_ZHUANIAO_NO		= (this.RuleValue11);							//	抓鸟翻倍 不抓鸟
        // this.GAME_TYPE_ZHUANIAO_0x2A	= (this.RuleValue12);							//	抓鸟翻倍 红桃10翻倍
        // this.GAME_TYPE_ZHUANIAO_LUCK	= (this.RuleValue13);							//	抓鸟翻倍 幸运翻牌
        // // 少带偷跑
        // this.GAME_TYPE_TAKE_CARD_LITTLE	= (this.RuleValue14);							//	可少带偷跑 / 不可少带偷跑
        // // 3A炸弹
        // this.GAME_TYPE_BOMB_3A			= (this.RuleValue15);							//	3A为炸弹
        // this.GAME_TYPE_BOMB_3A_TAKE_1	= (this.RuleValue16);							//	3A带一为炸弹
        // this.GAME_TYPE_BOMB_3A_NO		= (this.RuleValue17);							//	3A不为炸弹
        // 未出牌可见
        // this.GAME_TYPE_BLANK_CARD_TURN1	= (this.RuleValue20);							//	未出牌可见 / 未出牌不可见
        // // 自动准备
        // this.GAME_TYPE_AUTO_READY_0		= (this.RuleValue27);							//	自动准备 8S
        // this.GAME_TYPE_AUTO_READY_1		= (this.RuleValue28);							//	自动准备 15S
        // this.GAME_TYPE_AUTO_READY_2		= (this.RuleValue29);							//	自动准备 20S
        // // 距离检测
        // this.GAME_TYPE_IP_CHECK			= (this.RuleValue30);							//	IP检测
        this.GAME_TYPE_GPS_CHECK		= (this.RuleValue31);							//	GPS检测
        //////////////////////////////////////////////////////////////////////////////////

        //状态定义
        this.GAME_SCENE_FREE				= 0;							//等待开始
        this.GAME_SCENE_PLAY				= 100;							//游戏进行
        this.STAGE_CALL_BANKER				= 1;							//抢庄阶段
        this.STAGE_PLAY						= 2;							//游戏阶段

        //////////////////////////////////////////////////////////////////////////////////
        //服务端命令定义
        this.SUB_S_GAME_START				= 101;							//游戏开始
        this.SUB_S_CALL_BANKER				= 102;							//游戏开始
        this.SUB_S_BANKER_INFO				= 103;							//游戏开始
        this.SUB_S_OUT_CARD					= 110;							//用户出牌
        this.SUB_S_PASS_CARD				= 111;							//用户放弃
        this.SUB_S_TRUSTEE					= 112;							//玩家托管
        this.SUB_S_GAME_END					= 120;							//游戏结束

        //客户端命令定义
        this.SUB_C_CALL_BANKER				= 1;							//玩家抢庄
        this.SUB_C_OUT_CARD					= 2;							//玩家出牌
        this.SUB_C_PASS_CARD				= 3;							//放弃出牌
        this.SUB_C_TRUSTEE					= 4;							//玩家托管
        //////////////////////////////////////////////////////////////////////////////////
    },

    

    //////////////////////////////////////////////////////////////////////////////////

    //搜索结果
    tagSearchCardResult: function () {
        var Obj = new Object();
        Obj.cbSearchCount = 0; //搜索数目
        Obj.bTouPaoState = new Array();  //偷跑状态
        Obj.cbCardCount = new Array(); //扑克数目
        Obj.cbCardType = new Array(); //扑克类型
        Obj.cbResultCard = new Array(); //扑克数据
        for (var i = 0; i < 50 ; i++) {
            Obj.cbResultCard[i] = new Array();
        }
        return Obj;
    },

    //分布信息
    tagDistributing: function () {
        var Obj = new Object();
        Obj._name = 'tagDistributing';
        Obj.cbCardCount = 0 //扑克数目
        Obj.cbDistributing = new Array(); //扑克数据
        for (var i = 0; i < 15; i++) {
            Obj.cbDistributing[i] = new Array(6);
            Obj.cbDistributing[i].fill(0);
        }
        return Obj;
    },

    //分析结构
    tagAnalyseResult: function () {
        var Obj = new Object();
        Obj._name = 'tagAnalyseResult';
        Obj.cbKingCount = 0;
        Obj.cbBlockCount = new Array(4); //扑克数目
        Obj.cbBlockCount.fill(0);
        Obj.cbCardData = new Array(); //扑克数据
        for (var i = 0; i < 4; i++) {
            Obj.cbCardData[i] = new Array(this.MAX_CARD_COUNT);
            Obj.cbCardData[i].fill(0);
        }
        return Obj;
    },

    // 3带4带分析结果
    tagAnalyseTakeCardResult: function () {
        var Obj = new Object();
        Obj._name = 'tagAnalyseTakeCardResult';
        Obj.AnalyseResult = this.tagAnalyseResult();
        Obj.Distributing = this.tagDistributing();
        Obj.cbCardCount = 0; // 扑克数量
        Obj.cbCardData = new Array(GameDef.MAX_CARD_COUNT); //扑克数据
        Obj.cbCardData.fill(0);
        Obj.cbCardType = 0; // 类型
        Obj.cbTakeTypeCount = 0; // 带牌类型数量
        Obj.cbTakeCardCount = 0; // 带牌数量
        Obj.cbTakeCardData = new Array(GameDef.MAX_CARD_COUNT); //扑克数据
        Obj.cbTakeCardData.fill(0);
        return Obj;
    },

    //////////////////////////////////////////////////////////////////////////////////

    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusFree';
        Obj.llCellScore = 0;									//基础积分
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusPlay'
        Obj.dwCountDown = 0;
        Obj.cbGameStage = 0;									//游戏阶段 0:空闲阶段； 1：抢庄阶段；2：游戏阶段
        Obj.cbUserState = new Array(this.GAME_PLAYER);			//玩家状态 0：没人，1：游戏
        Obj.cbTrustee = new Array(this.GAME_PLAYER);			//玩家托管
        Obj.cbBlankCard = new Array(this.GAME_PLAYER);			//玩家盖牌
        Obj.bOutFirstCard = 0;									//是否必出首出牌

        Obj.llCellScore = 0;									//基础积分
        Obj.wBankerUser = 0;									//庄家用户
        Obj.wTurnWiner = 0;										//出牌的人
        Obj.wCurrentUser = 0;									//当前玩家
        Obj.cbNiaoCard = 0;										//抓鸟扑克
        Obj.cbFirstOutCard = 0;									//首出扑克

        Obj.cbLeftMaxCard = 0;									//剩余的最大牌
        Obj.cbCardData = new Array(this.MAX_CARD_COUNT);		//手上扑克
        Obj.cbCardCount = new Array(this.GAME_PLAYER);			//扑克数目
        Obj.cbOutCardCount = new Array(this.GAME_PLAYER);		//出牌数目
        Obj.cbOutCardData = new Array(this.GAME_PLAYER);		//出牌扑克
        for(var i = 0; i < this.GAME_PLAYER; ++ i) Obj.cbOutCardData[i] = new Array(this.MAX_CARD_COUNT);

        Obj.cbBombCount = new Array(this.GAME_PLAYER);			//炸弹数目
        Obj.cbTurnCardCount = 0;								//基础出牌
        Obj.cbTurnCardData = new Array(this.MAX_CARD_COUNT);	//出牌列表
        Obj.llBombScore = new Array(this.GAME_PLAYER);			//炸弹得分
        return Obj;
    },

    //游戏开始
    CMD_S_GameStart :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameStart";
        Obj.cbGameStage = 0;									//游戏阶段 0:空闲阶段； 1：抢庄阶段；2：游戏阶段
        Obj.cbUserState = new Array(this.GAME_PLAYER);			//玩家状态 0：没人，1：游戏
        Obj.wCurrentUser = 0;									//当前玩家
        Obj.cbNiaoCard = 0;										//抓鸟扑克
        Obj.cbFirstOutCard = 0;									//首出扑克
        Obj.cbCardCount = new Array(this.GAME_PLAYER);			//扑克数量
        Obj.cbCardData = new Array(this.MAX_CARD_COUNT);		//扑克列表
        Obj.cbBlankCard = new Array(this.GAME_PLAYER);			//玩家盖牌

        return Obj;
    },

    //玩家抢庄
    CMD_S_UserCallBanker :function () {
        var Obj = new Object();
        Obj._name="CMD_S_UserCallBanker";
        Obj.cbState = 0;										//是否抢庄
        Obj.wCallUser = 0;										//抢庄玩家
        Obj.wCurrentUser = 0;									//当前玩家
        return Obj;
    },

    //庄家信息
    CMD_S_BankerInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_BankerInfo"
        Obj.wBankerUser = 0;									//庄家用户
        Obj.wCurrentUser = 0;									//当前玩家
        Obj.bOutFirstCard = 0;									//是否必出首出牌
        Obj.cbGameStage = 0;									//游戏阶段 0:空闲阶段； 1：抢庄阶段；2：游戏阶段
        Obj.cbLeftMaxCard = 0;									//剩余的最大牌
        return Obj;
    },

    // 玩家托管
    CMD_S_Trustee :function () {
        var Obj = new Object();
        Obj._name="CMD_S_Trustee"
        Obj.wChairID = 0;										//托管玩家
        Obj.cbState = 0;										//是否托管
        return Obj;
    },

    //用户出牌
    CMD_S_OutCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_OutCard"
        Obj.cbLeftCount = 0;									//剩余张数
        Obj.cbCardCount = 0;									//出牌数目
        Obj.wCurrentUser = 0;									//当前玩家
        Obj.wOutCardUser = 0;									//出牌玩家
        Obj.cbLeftMaxCard = 0;									//剩余的最大牌
        Obj.cbCardData = new Array(this.MAX_CARD_COUNT);				//扑克列表
        return Obj;
    },


    //放弃出牌
    CMD_S_PassCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_PassCard"
        Obj.cbNewTurn = 0;										//一轮结束
        Obj.wPassUser = 0;										//放弃玩家
        Obj.wCurrentUser = 0;									//当前玩家
        Obj.cbLeftMaxCard = 0;									//剩余的最大牌
        Obj.llBombScore = new Array(this.GAME_PLAYER);			//炸弹分数
        return Obj;
    },

    //游戏结束
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameEnd"
        Obj.cbSpring = new Array(this.GAME_PLAYER);				//被春天状态
        Obj.cbResult = new Array(this.GAME_PLAYER);				//游戏结果 0：平	1：胜	2：负
        Obj.llScore = new Array(this.GAME_PLAYER);				//游戏积分
        Obj.llBombScore = new Array(this.GAME_PLAYER);			//炸弹分数
        Obj.llSpringScore = new Array(this.GAME_PLAYER);		//春天分数
        Obj.llSpScore = new Array(this.GAME_PLAYER);			//名堂分数
        Obj.cbSpecialCT = new Array(this.GAME_PLAYER);			//特殊牌型
        Obj.cbCardCount = new Array(this.GAME_PLAYER);			//扑克数目
        Obj.cbCardData = new Array(this.GAME_PLAYER);			//扑克列表
        Obj.wWinner = INVALID_CHAIR;							//本局赢家
        Obj.wWinnerJH = INVALID_CHAIR;							//金花赢家
        Obj.cbCardDataJH = new Array(this.GAME_PLAYER);			//扑克列表
        Obj.llScoreJH = new Array(this.GAME_PLAYER);			//游戏积分
        for(var i = 0; i < this.GAME_PLAYER; ++ i) {
            Obj.cbCardData[i] = new Array(this.MAX_CARD_COUNT);
            Obj.cbCardDataJH[i] = new Array(3);
        }
        return Obj;
    },

    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"
        Obj.llTotalScore = new Array(this.GAME_PLAYER);			//输赢总分
        Obj.cbWinCount = new Array(this.GAME_PLAYER);			//赢牌数量
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);			//输牌数量
        return Obj;
    },

    //牌堆扑克
    CMD_S_HeapCard :function() {
        var Obj = new Object();
        Obj._name="CMD_S_HeapCard"
        Obj.wChairID = 0;//
        Obj.Distributing = this.tagDistributing();				//分布信息
        return Obj;
    },

    //用户叫分
    CMD_C_UserCallBanker :function() {
        var Obj = new Object();
        Obj._name="CMD_C_UserCallBanker"
        Obj.cbState = 0;//是否抢庄
        return Obj;
    },

    //用户出牌
    CMD_C_OutCard :function(){
        var Obj = new Object();
       // Obj._name="CMD_C_OutCard"
        Obj.cbCardCount = 0					//扑克数目
        Obj.cbCardData = new Array(this.MAX_CARD_COUNT);//扑克数目
        return Obj;
    },

    //////////////////////////////////////////////////////////////////////////////////
    SetRules: function (dwRules) {
        this.m_dwRules = dwRules;
    },
    //游戏模式
    GetPayMode:function(dwServerRules,dwRulesArr){
        if(dwServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },

    GetBaseScoreStr: function(dwServerRules,dwRulesArr){
        return this.GetBaseScore(dwServerRules,dwRulesArr)
    },
   
    GetBaseScore: function (dwServerRules,dwRulesArr) {
        var cbCount = 1;
        if (dwRulesArr[0] & this.GAME_TYPE_BASE_1) cbCount = 2;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_2) cbCount = 5;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_3) cbCount = 10;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_4) cbCount = 20;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_5) cbCount = 50;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_6) cbCount = 100;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_7) cbCount = 200;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_8) cbCount = 300;
        else if (dwRulesArr[0] & this.GAME_TYPE_BASE_9) cbCount = 500;
        return cbCount;
    },
    
    GetMaxCardCount: function (dwRules) {
        if (dwRules) {
            var cbCount = this.MAX_CARD_COUNT;
            if (dwRules & this.GAME_TYPE_HAND_COUNT_15) cbCount = 15;
            else if (dwRules & this.GAME_TYPE_HAND_COUNT_16) cbCount = 16;
        } else {
            var cbCount = this.MAX_CARD_COUNT;
            if (this.m_dwRules & this.GAME_TYPE_HAND_COUNT_15) cbCount = 15;
            else if (this.m_dwRules & this.GAME_TYPE_HAND_COUNT_16) cbCount = 16;
        }
       
        return cbCount;
    },

    GetPlayerCount:function(dwServerRules,dwRulesArr){
        return this.GameMaxPlayerCount(dwServerRules);
    },

    GameMaxPlayerCount: function (dwRules) {
        var cbCount = this.GAME_PLAYER;
        if (dwRules & this.GAME_TYPE_P_COUNT_0) cbCount = 2;
        if (dwRules & this.GAME_TYPE_P_COUNT_1) cbCount = 3;
        if (dwRules & this.GAME_TYPE_P_COUNT_2) cbCount = 4;
        return cbCount;
    },

    GetGameCount: function (dwServerRules,dwRulesArr) {
        var cnt = 8;
        if (dwServerRules & this.GAME_TYPE_ROUND_0) cnt = 8;
        if (dwServerRules & this.GAME_TYPE_ROUND_1) cnt = 10;
        if (dwServerRules & this.GAME_TYPE_ROUND_2) cnt = 20;
        // if (dwRules & this.GAME_TYPE_ROUND_3) cnt = 16;
        return cnt;
    },

    GetProgress: function (wProgress, dwServerRules, dwRulesArr) {
        var cnt = this.GetGameCount(dwServerRules, dwRulesArr);
        if (wProgress > 0 && cnt > 0) {
            return '第' + wProgress + '/' + cnt + '局';
        } else {
            return '';
        }
    },

    GetAutoTrusteeTime: function (dwRules) {
        var nTime = 0;
        if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_1) nTime = 60;
        if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_2) nTime = 90;
        if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_3) nTime = 120;
        return nTime;
    },

    GetTimeAutoReady: function (dwRules) {
        var nTime = 0;
        if (dwRules & this.GAME_TYPE_AUTO_READY_0) nTime = 8;
        if (dwRules & this.GAME_TYPE_AUTO_READY_1) nTime = 15;
        if (dwRules & this.GAME_TYPE_AUTO_READY_2) nTime = 20;
        return nTime;
    },

    GetRulesStrArray: function (dwServerRules,dwRulesArr) {
        var strArray = new Array();
		strArray.push(this.GetPayMode(dwServerRules, dwRulesArr));
		strArray.push(this.GetGameCount(dwServerRules, dwRulesArr) + '局');
		strArray.push(this.GameMaxPlayerCount(dwServerRules) + '人');
        strArray.push(this.GetMaxCardCount(dwRulesArr[0]) + '张手牌');
        strArray.push(this.GetBaseScore(dwServerRules, dwRulesArr) + '倍率');
		if (dwRulesArr[0] & this.GAME_TYPE_FIRST_CARD_0x33) strArray.push("黑桃3先出");
		else  strArray.push("第二局赢家先出");

		if (dwRulesArr[0] & this.GAME_TYPE_FIRST_CARD_0x33_1) strArray.push("黑桃3必须首出");
		else strArray.push("无要求");

		if (dwRulesArr[0] & this.GAME_TYPE_BOMB_BREAK_NO) strArray.push("炸弹不可拆");
		if (dwRulesArr[0] & this.GAME_TYPE_4_TAKE_3) strArray.push("允许4带3");
		if (dwRulesArr[0] & this.GAME_TYPE_3_TAKE_LITTLE) strArray.push("三张可少带出完");
		if (dwRulesArr[0] & this.GAME_TYPE_3_JOIN_LITTLE) strArray.push("三张可少带接完");
		if (dwRulesArr[0] & this.GAME_TYPE_F_TAKE_LITTLE) strArray.push("飞机可少带出完");
        if (dwRulesArr[0] & this.GAME_TYPE_F_JOIN_LITTLE) strArray.push("飞机可少带接完");

		if (dwRulesArr[0] & this.GAME_TYPE_CARD_COUNT_ON) strArray.push("显示余牌");
		else strArray.push("不显示余牌");
        if (dwRulesArr[0] & this.GAME_TYPE_MUST_OUT_CARD) strArray.push("有大必出");
		else strArray.push("不必出");
        if(this.GetAutoTrusteeTime(dwRulesArr[0]) > 0) strArray.push(this.GetAutoTrusteeTime(dwRulesArr[0]) + '秒自动托管');
        else strArray.push('不托管');

		// if (dwRules & this.GAME_TYPE_4_TAKE_3) strArray.push("可四带三");
		// else strArray.push("不可四带三");
		// if (dwRules & this.GAME_TYPE_BLANK_CARD_TURN1) strArray.push("未出牌可见");
		// else strArray.push("未出牌不可见");
        //strArray.push(this.GetTimeAutoReady(dwRules) + '秒自动准备');
        //if(this.IsIPCheck(dwRules)) strArray.push("IP检测");
        if(this.IsGPSCheck(dwRulesArr[0])) strArray.push("同桌限制");

        return strArray.join(' ');
    },

    GetRulesStr: function (dwServerRules,dwRulesArr) {
        return this.GetRulesStrArray(dwServerRules,dwRulesArr);
    },

    // 特殊牌型
    GetSpecialName: function (cbSpecialCT) {
        var strArray = new Array();
        if (cbSpecialCT & this.SP_CT_ALL_BLACK)    strArray.push("全黑");
        if (cbSpecialCT & this.SP_CT_ALL_RED)      strArray.push("全红");
        if (cbSpecialCT & this.SP_CT_ALL_BIG)      strArray.push("全大");
        if (cbSpecialCT & this.SP_CT_ALL_SMALL)    strArray.push("全小");
        if (cbSpecialCT & this.SP_CT_ALL_SINGLE)   strArray.push("全单");
        if (cbSpecialCT & this.SP_CT_ALL_DOUBLE)   strArray.push("全双");
        if (cbSpecialCT == 0) strArray.push("无名堂牌型");
        return strArray.join(' ');
    },

	GetFourSameCardType: function(dwRules) {
        return this.CT_BOMB_CARD;
    },

    // GPS检测
    IsGPSCheck:function(dwRules) {
        if(!this.GAME_TYPE_GPS_CHECK) return false;
        return (dwRules & this.GAME_TYPE_GPS_CHECK);
    },

    // IP检测
    IsIPCheck: function (dwRules) {
        if(!this.GAME_TYPE_IP_CHECK) return true;
        return ((dwRules & this.GAME_TYPE_IP_CHECK) ? true : false);
    },
    IsNoCheat: function (dwRules){
		return true;
        return ((dwRules[0] & this.GAME_TYPE_GPS_CHECK) ? true : false);
    },
    // 首轮盖牌
    IsBlankFirstTurn: function(dwRules) {
        if(!this.GAME_TYPE_BLANK_TURN1) return false;
        return ((dwRules & this.GAME_TYPE_BLANK_TURN1) ? true : false);
    },

    // 能管必须管
	IsMustOutCard: function(dwRules) {
        if(!this.GAME_TYPE_MUST_OUT_CARD) return true;
		return (dwRules & this.GAME_TYPE_MUST_OUT_CARD) != 0;
    },

    // 必须带首出牌
    IsMustOutFirstCard: function(dwRules) {
        if(!this.GAME_TYPE_FIRST_CARD_0x33) return false;
        return ((dwRules & this.GAME_TYPE_FIRST_CARD_0x33) ? true : false);
    },

    // 自动提示
    IsAllowAutoPrompt: function(dwRules) {
        if (!this.GAME_TYPE_AUTO_PROMPT)return false;
        return ((dwRules & this.GAME_TYPE_AUTO_PROMPT) ? true : false);
    },

    // 显示余牌数量
    IsAllowShowCardCount: function(dwRules) {
        if (!this.GAME_TYPE_CARD_COUNT_ON) return false;
        return ((dwRules & this.GAME_TYPE_CARD_COUNT_ON) ? true : false);
    },

    // 自动托管
    IsAllowAutoTrustee: function(dwRules) {
        if(!this.GAME_TYPE_AUTO_TRUSTEE_0)return false;
        if(dwRules & this.GAME_TYPE_AUTO_TRUSTEE_0) return false;
        return true;
    },

    // 是否允许聊天
    IsAllowChat: function(dwRules) {
        if(!this.GAME_TYPE_CHAT_ON) return true;
        return ((dwRules & this.GAME_TYPE_CHAT_ON) ? true : false);
    },

    IsAllowBombBreak: function(dwRules) {
        if(!this.GAME_TYPE_BOMB_BREAK_NO) return true;
        return ((dwRules & this.GAME_TYPE_BOMB_BREAK_NO) ? false : true);
    },

    IsAllowBomb: function(dwRules) {
        return true;
    },

    // 三A算炸弹
    IsAllowBomb_AAA: function(dwRules) {
        if(!this.GAME_TYPE_BOMB_3A) return false;
        return ((dwRules & this.GAME_TYPE_BOMB_3A) ? true : false);
    },

    // 三A带一单算炸弹
    IsAllowBomb_AAA_Take_1_1: function(dwRules) {
        if(!this.GAME_TYPE_BOMB_3A_TAKE_1) return false;
        return ((dwRules & this.GAME_TYPE_BOMB_3A_TAKE_1) ? true : false);
    },

    // 是否允许偷跑
    IsAllowTakeLittle: function(dwRules) {
        if (!this.GAME_TYPE_TAKE_CARD_LITTLE) return false;
        return ((dwRules & this.GAME_TYPE_TAKE_CARD_LITTLE) ? true : false);
    },
    // 三张可少带出完
    IsAllow_3_TakeLittle: function(dwRules) {
        if (!this.GAME_TYPE_3_TAKE_LITTLE) return false;
        return ((dwRules & this.GAME_TYPE_3_TAKE_LITTLE) ? true : false);
    },
    // 飞机可少带出完
    IsAllow_F_TakeLittle: function(dwRules) {
        if (!this.GAME_TYPE_F_TAKE_LITTLE) return false;
        return ((dwRules & this.GAME_TYPE_F_TAKE_LITTLE) ? true : false);
    },
    // 三张可少带接完
    IsAllow_3_JoinLittle: function(dwRules) {
        if (!this.GAME_TYPE_3_JOIN_LITTLE) return false;
        return ((dwRules & this.GAME_TYPE_3_JOIN_LITTLE) ? true : false);
    },
    // 飞机可少带接完
    IsAllow_F_JoinLittle: function(dwRules) {
        if (!this.GAME_TYPE_F_JOIN_LITTLE) return false;
        return ((dwRules & this.GAME_TYPE_F_JOIN_LITTLE) ? true : false);
    },

    IsAllow_4_Take_3_1: function(dwRules) {
        if (!this.GAME_TYPE_4_TAKE_3) return false;
        return ((dwRules & this.GAME_TYPE_4_TAKE_3) ? true : false);
    },

    IsAllow_4_Take_2: function(dwRules) {
        if (!this.GAME_TYPE_4_TAKE_2) return false;
        return ((dwRules & this.GAME_TYPE_4_TAKE_2) ? true : false);
    },

    IsAllow_4_Take_1_3: function(dwRules) {
        if (!this.GAME_TYPE_4_TAKE_3) return false;
        return ((dwRules & this.GAME_TYPE_4_TAKE_3) ? true : false);
    },

    // 校验带牌
    CheckAllowTakeCard: function(dwRules, cbCardCount, cbTakeCount, cbTakeType, bTouPaoState, cbTurnUser) {
        switch (cbCardCount) {
            case 3: { // 三带N
                switch (cbTakeType) {
                    case 0: { // 不带牌
                        return true;//if(this.IsAllowTakeLittle(dwRules) && bTouPaoState)
                        break;
                    }
                    case 1: { // 带单牌
                        if (cbTakeCount == 1 && bTouPaoState
                                && ((this.IsAllow_3_JoinLittle(dwRules) && cbTurnUser==2) || (cbTurnUser==1 && this.IsAllow_3_TakeLittle(dwRules)))) return true; // 一单 3334
                        if (cbTakeCount == 2) return true; // 二单 33345
                        break;
                    }
                    case 2: { // 带对牌
                        if (cbTakeCount == 1) return true; // 一对 33344
                        break;
                    }
                }
                break;
            }
            case 4: { // 四带N
                switch (cbTakeType) {
                    case 0: { // 不带牌
                        return true;
                        break;
                    }
                    case 1: { // 带单牌
                        // if (cbTakeCount == 1 && bTouPaoState) return true; // 一单 33334
                        // if (cbTakeCount == 2 && bTouPaoState) return true; // 二单 333345
                        if (cbTakeCount == 3 && this.IsAllow_4_Take_3_1(dwRules)) return true; // 三单3333455
                        break;
                    }
                    case 2: { // 带对牌
                        // if (cbTakeCount == 1 && bTouPaoState) return true; // 一对333344
                        break;
                    }
                    case 3: {
                        if (cbTakeCount == 3 && this.IsAllow_4_Take_1_3(dwRules)) return true; // 三张 3333444
                        break;
                    }
                }
                break;
            }
            case 6:{//飞机
                switch (cbTakeType) {
            	    case 0: { // 不带牌
                        if(bTouPaoState) return true;
                        break;
                    }
                    case 1: { // 带单牌
                        if (cbTakeCount == 1 && bTouPaoState && ((this.IsAllow_F_JoinLittle(dwRules) && cbTurnUser==2) || (cbTurnUser==1 && this.IsAllow_F_TakeLittle(dwRules)))) return true; // 一单33344456
			            if (cbTakeCount == 2 && bTouPaoState && ((this.IsAllow_F_JoinLittle(dwRules) && cbTurnUser==2) || (cbTurnUser==1 && this.IsAllow_F_TakeLittle(dwRules)))) return true; // 飞机带2单 33344456
                        if (cbTakeCount == 3 && bTouPaoState && ((this.IsAllow_F_JoinLittle(dwRules) && cbTurnUser==2) || (cbTurnUser==1 && this.IsAllow_F_TakeLittle(dwRules)))) return true; // 三单3333455
			            break;
                    }
		            case 2: { // 带对牌
                        if (cbTakeCount == 1 && bTouPaoState && ((this.IsAllow_F_JoinLittle(dwRules) && cbTurnUser==2) || (cbTurnUser==1 && this.IsAllow_F_TakeLittle(dwRules)))) return true; // 飞机带1对 33344455
                        if (cbTakeCount == 2) return true; //飞机带2对 3334445566
                        break;
                    }
                }
		break;
            }
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

    CardItemName: function(cbCardData) {
        var cbColor = (cbCardData & LOGIC_MASK_COLOR) >> 4;
        var cbValue = cbCardData & LOGIC_MASK_VALUE;
        var strName = '';
        switch(cbColor) {
            case 0: strName+= '方片'; break;
            case 1: strName+= '草花'; break;
            case 2: strName+= '红桃'; break;
            case 3: strName+= '黑桃'; break;
        }
        var strTemp = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        strName += strTemp[cbValue-1];
        return strName;
    },

    GetCardName: function(cbCardData, cbCardCount) {
        var strArray = new Array();
        for(var i = 0; i < cbCardCount; ++ i) {
            strArray.push(this.CardItemName(cbCardData[i]));
        }
        return strArray.join(' ');
    },

    GetCardTypeName: function(cbType) {
        switch(cbType) {
            case this.CT_ERROR:				{ return ("错误类型"); }
            case this.CT_SINGLE:			{ return ("单牌类型"); }
            case this.CT_DOUBLE:			{ return ("对牌类型"); }
            case this.CT_THREE:				{ return ("三张类型"); }
            case this.CT_SINGLE_LINE:		{ return ("单连类型"); }
            case this.CT_DOUBLE_LINE:		{ return ("对连类型"); }
            case this.CT_THREE_LINE:		{ return ("三连类型"); }
            case this.CT_3_TAKE_1_1:		{ return ("三带一单"); }
            case this.CT_3_TAKE_2_1:		{ return ("三带二单"); }
            case this.CT_3_TAKE_1_2:		{ return ("三带一对"); }
            case this.CT_3_TAKE_2_2:		{ return ("三带二对"); }
            case this.CT_4_TAKE_1_1:		{ return ("四带一单"); }
            case this.CT_4_TAKE_1_3:		{ return ("四带一三张"); }
            case this.CT_4_TAKE_2_1:		{ return ("四带二单"); }
            case this.CT_4_TAKE_3_1:		{ return ("四带三单"); }
            case this.CT_4_TAKE_4_1:		{ return ("四带四单"); }
            case this.CT_4_TAKE_1_2:		{ return ("四带一对"); }
            case this.CT_4_TAKE_2_2:		{ return ("四带二对"); }
            case this.CT_AIRPLANE_TAKE_1_1:	{ return ("飞机带一单"); }
            case this.CT_AIRPLANE_TAKE_1_2:	{ return ("飞机带一对"); }
            case this.CT_AIRPLANE_TAKE_2_1:	{ return ("飞机带二单"); }
	        case this.CT_AIRPLANE_TAKE_3_1: { return ("飞机带3单"); }
            case this.CT_AIRPLANE_TAKE_2_2:	{ return ("飞机带二对"); }
            case this.CT_BOMB_CARD:			{ return ("炸弹类型"); }
            case this.CT_MISSILE_CARD:		{ return ("火箭类型"); }
        }
    },
});

GameDef = null;
//////////////////////////////////////////////////////////////////////////////////