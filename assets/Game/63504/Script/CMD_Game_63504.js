//CMD_Game.js
CMD_GAME_63504 = new cc.Class({ //window.
    ctor: function () {
        //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID = 63504;
        this.GAME_PLAYER = 10;					//游戏人数
        /**
         * ID分布： 10人：0，1,2,3,4,5,6,7,8,9
         *          8人：0，10,12,4,5,6,13,11
         *          6人：0，14,4,5,6,15
         */
        this.GAME_VIEW_PLAYER = 16;             //界面人数

        this.MAX_COUNT = 5;					//最大数目
        this.MAX_BET_CNT = 5;
        this.FULL_COUNT = 42;
        this.MYSELF_VIEW_ID = 0;
        this.CARD_WIGTH = 177;
        this.CARD_HEIGHT = 241;
        this.MAX_CARD_KIND = 6;
        this.INVALID_BANKTIMES = 65535;

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
        this.GAME_TYPE_ROUND_0 = (this.RuleValue16)							//	局数 10局
        this.GAME_TYPE_ROUND_1 = (this.RuleValue17)							//	局数 20局
        this.GAME_TYPE_ROUND_2 = (this.RuleValue18)							//	局数 30局

        // 玩家人数
        this.GAME_TYPE_P_COUNT_0 = (this.RuleValue20)							//	玩家人数 6人
        this.GAME_TYPE_P_COUNT_1 = (this.RuleValue21)							//	玩家人数 8人
        this.GAME_TYPE_P_COUNT_2 = (this.RuleValue22)							//	玩家人数 10人

        // 规则数组0
        //玩法
        this.GAME_TYPE_GAME_1 = (this.RuleValue0)							//明牌抢庄
        this.GAME_TYPE_GAME_2 = (this.RuleValue1)							//轮庄模式
        this.GAME_TYPE_GAME_3 = (this.RuleValue2)							//自由抢庄
        this.GAME_TYPE_GAME_4 = (this.RuleValue3)							//固定庄家
        this.GAME_TYPE_GAME_5 = (this.RuleValue4)							//无花抢庄
        this.GAME_TYPE_GAME_6 = (this.RuleValue5)							//明牌通比
        this.GAME_TYPE_GAME_7 = (this.RuleValue30)							//通比牛牛

        //最大抢庄
        this.GAME_TYPE_BANKER_1 = (this.RuleValue6)							//1
        this.GAME_TYPE_BANKER_2 = (this.RuleValue7)							//2
        this.GAME_TYPE_BANKER_3 = (this.RuleValue8)							//3
        this.GAME_TYPE_BANKER_4 = (this.RuleValue9)							//4

        //底分
        this.GAME_TYPE_BASE1 = (this.RuleValue10)							//1
        this.GAME_TYPE_BASE2 = (this.RuleValue11)							//2
        this.GAME_TYPE_BASE3 = (this.RuleValue12)							//3
        this.GAME_TYPE_BASE4 = (this.RuleValue13)							//4
        this.GAME_TYPE_BASE5 = (this.RuleValue14)							//5
        this.GAME_TYPE_BASE6 = (this.RuleValue15)							//10
        this.GAME_TYPE_BASE7 = (this.RuleValue16)							//20
        this.GAME_TYPE_BASE8 = (this.RuleValue17)							//30
        this.GAME_TYPE_BASE9 = (this.RuleValue18)							//40

        //推注
        this.GAME_TYPE_ADD1 = (this.RuleValue19)							//0
        this.GAME_TYPE_ADD2 = (this.RuleValue20)							//5
        this.GAME_TYPE_ADD3 = (this.RuleValue21)							//10
        this.GAME_TYPE_ADD4 = (this.RuleValue22)							//15
        this.GAME_TYPE_ADD5 = (this.RuleValue23)							//20

        //上庄分数
        this.GAME_TYPE_BANKER_S1 = (this.RuleValue24)							//0
        this.GAME_TYPE_BANKER_S2 = (this.RuleValue25)							//100
        this.GAME_TYPE_BANKER_S3 = (this.RuleValue26)							//150
        this.GAME_TYPE_BANKER_S4 = (this.RuleValue27)							//200
        this.GAME_TYPE_BANKER_S5 = (this.RuleValue17)

        this.GAME_TYPE_TURN1 = (this.RuleValue28)							//轮庄
        this.GAME_TYPE_TURN2 = (this.RuleValue29)							//牛牛上庄
        this.GAME_TYPE_TURN3 = (this.RuleValue31)							//没牛下庄

        // 规则数组1
        //开始模式
        this.GAME_TYPE_READY = (this.RuleValue0)			                //准备开始
        this.GAME_TYPE_FIRST_CTRL = (this.RuleValue1)							//首位开始
        this.GAME_TYPE_CTRLSTART2 = (this.RuleValue2)						    //满2人开始
        this.GAME_TYPE_2NSTART = (this.RuleValue3)							//满N-2人开始
        this.GAME_TYPE_1NSTART = (this.RuleValue4)							//满N-1人开始
        this.GAME_TYPE_NSTART = (this.RuleValue5)							//满N人开始

        //牌型倍数
        this.GAME_TYPE_TIMES_1 = (this.RuleValue6)							//牛牛X4 牛9X3 牛8X2 牛7X2
        this.GAME_TYPE_TIMES_2 = (this.RuleValue7)							//牛牛X3 牛9X2 牛8X2 牛7X1
        this.GAME_TYPE_TIMES_3 = (this.RuleValue8)							//牛牛X3 牛9X2 牛8X2 牛7X2
        this.GAME_TYPE_TIMES_4 = (this.RuleValue9)							//牛牛X5 牛9X4 牛8X3 牛7X2
        this.GAME_TYPE_TIMES_5 = (this.RuleValue10)							//1~10

        //特殊牌型
        this.GAME_TYPE_LINE = (this.RuleValue11)							//顺子牛
        this.GAME_TYPE_5F = (this.RuleValue12)							//五花牛
        this.GAME_TYPE_COLOR = (this.RuleValue13)							//同花牛
        this.GAME_TYPE_HL = (this.RuleValue14)							//葫芦牛
        this.GAME_TYPE_BOMB = (this.RuleValue15)							//炸弹牛
        this.GAME_TYPE_SMALL = (this.RuleValue16)							//五小牛
        this.GAME_TYPE_HAPPYX = (this.RuleValue17)							//开心牛/同花顺
        this.GAME_TYPE_FORTY = (this.RuleValue18)							//四十牛

        //额外规则
        this.GAME_TYPE_OTHER1 = (this.RuleValue19)							//24快速开始
        this.GAME_TYPE_OTHER2 = (this.RuleValue20)							//25中途禁入
        this.GAME_TYPE_OTHER3 = (this.RuleValue21)							//26禁止搓牌
        this.GAME_TYPE_OTHER4 = (this.RuleValue22)							//27禁用表情
        this.GAME_TYPE_OTHER5 = (this.RuleValue23)							//28下注限制
        this.GAME_TYPE_OTHER6 = (this.RuleValue24)							//29暗抢庄家
        this.GAME_TYPE_OTHER7 = (this.RuleValue25)							//30下注加倍
        this.GAME_TYPE_OTHER8 = (this.RuleValue26)							//30禁用语音

        this.GAME_TYPE_TONGBIQUAN = (this.RuleValue27)							//通比全比
        
        //王赖
        this.GAME_KING_NO				= (this.RuleValue0)							//无赖
        this.GAME_KING_NORMAL			= (this.RuleValue1)							//经典
        this.GAME_KING_CRAZY			= (this.RuleValue2)							//疯狂
        //玩法
        this.GAME_PLAY_TYPE_0			= (this.RuleValue3)							//无赖
        this.GAME_PLAY_TYPE_1			= (this.RuleValue4)							//经典
        this.GAME_PLAY_TYPE_2			= (this.RuleValue5)							//疯狂
        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GS_TK_FREE = 0;					    //等待开始
        this.GS_TK_CALL_BANKER = 100;					//抢庄状态
        this.GS_TK_BANKER_ANIM = 101;					//抢庄动画
        this.GS_TK_SHOW_BANKER = 102;					//发庄动画
        this.GS_TK_SEND_CARD = 103;					//发牌状态
        this.GS_TK_USER_JETTON = 104;					//下注状态
        this.GS_TK_OPEN_CARD = 105;					//等待开牌
        this.GS_TK_GAME_END = 106;					//游戏结算

        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.PLAYER_STATUS_WAIT = 0;								//空闲等待
        this.PLAYER_STATUS_READY = 1;								//准备
        this.PLAYER_STATUS_PLAY = 2;								//发牌随机庄庄家下注等无操作状态
        this.PLAYER_STATUS_CALL_BANK = 3;								//叫庄
        this.PLAYER_STATUS_CALL_BANK_OVER = 4;								//叫庄完毕
        this.PLAYER_STATUS_BET = 5;								//下注
        this.PLAYER_STATUS_BET_OVER = 6;								//下注完毕
        this.PLAYER_STATUS_OPEN = 7;								//开牌
        this.PLAYER_STATUS_LOOK_CARD = 8;								//翻牌/搓牌
        this.PLAYER_STATUS_HINT = 9;								//提示
        this.PLAYER_STATUS_SHOW_CARD = 10;								//亮牌
        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_S_GAME_START = 100;					//游戏开始
        this.SUB_S_START_CALL = 101;					//开始抢庄
        this.SUB_S_CALL_BANKER = 102;					//抢庄消息
        this.SUB_S_CALL_ANIM = 103;					//抢庄动画
        this.SUB_S_SHOW_BANKER = 104;					//显示庄家
        this.SUB_S_START_JETTON = 105;					//开始下注
        this.SUB_S_USER_JETTON = 106;					//下注消息
        this.SUB_S_SEND_CARD = 107;					//发牌消息
        this.SUB_S_START_OPEN = 108;					//开始翻牌
        this.SUB_S_OPEN_CARD = 109;					//翻牌消息
        this.SUB_S_CUO_CARD = 110;					//搓牌消息
        this.SUB_S_GAME_END = 111;					//游戏结束
        this.SUB_S_START_CTRL = 112;					//控制开始
        this.SUB_S_USER_READY = 113;					//准备
        this.SUB_S_HISTORY = 114;					//历史记录

        this.SUB_S_LOOK_CARD = 115;									//翻牌消息
        this.SUB_S_HINT = 116;									//提示消息
        
        this.SUB_S_JETINFO = 117;									//下注信息
        //this.SUB_S_TEST		        =       	201;					//用户开牌
        this.SUB_S_TESTCARD		    =			202;					//用户

        //阶段节点
        this.SUB_S_CALL_RESULT = 300;
        this.SUB_S_SEND_CARD_RESULT = 301;
        this.SUB_S_JET_RESULT = 302;
        this.SUB_S_OPEN_RESULT = 303;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_CALL_BANKER = 1;					//用户下注
        this.SUB_C_CALL_PLAYER = 2;					//用户下注
        this.SUB_C_OPEN_CARD = 3;					//用户下注

        this.SUB_C_CTRL_OPEN_CARD = 4;									//用户搓牌
        this.SUB_C_START = 5;									//控制开始
        this.SUB_C_READY = 6;									//准备
        this.SUB_C_LOOK_CARD = 7;									//用户翻牌
        this.SUB_C_HINT = 8;									//用户提示
        this.SUB_C_HISTORY = 10;									//历史
        this.SUB_C_CHANGE_JET = 9;									//更改下注

        this.SUB_C_TEST			    =       	101;					//用户开牌
        this.SUB_C_TESTCARD		    =		    102;					//用户加注
        ///////////////////////////////////////////////////////////////////////////////////
        //牌型定义
        this.OX_VALUE_0					=0;									//无牛牌型
        this.OX_VALUE_1					=1;									//牛一牌型
        this.OX_VALUE_2					=2;									//牛二牌型
        this.OX_VALUE_3					=3;									//牛三牌型
        this.OX_VALUE_4					=4;									//牛四牌型
        this.OX_VALUE_5					=5;									//牛五牌型
        this.OX_VALUE_6					=6;									//牛六牌型
        this.OX_VALUE_7					=7;									//牛七牌型
        this.OX_VALUE_8					=8;									//牛八牌型
        this.OX_VALUE_9					=9;									//牛九牌型
        this.OX_VALUE_10				=10;									//牛牛牌型
        this.OX_VALUE_LINE				=11;									//顺牛牌
        this.OX_VALUE_FIVE				=12;									//5花牛牌
        this.OX_VALUE_COLOR				=13;									//同花牛牌
        this.OX_VALUE_3D2				=14;									//葫芦牛牌
        this.OX_VALUE_FORTY				=15;									//四十牛牌
        this.OX_VALUE_BOMB				=16;									//炸弹牛牌
        this.OX_VALUE_SMALL				=17;									//5小牛牌
        this.OX_VALUE_HAPPY				=18;									//开心牛牌

        this.OX_VALUE_FINISH            =100;                               

        
        this.GAME_TYPE_MPQZ				=0;									//明牌抢庄
        this.GAME_TYPE_LZ				=1;									//轮庄模式
        this.GAME_TYPE_ZYQZ				=2;									//自由抢庄
        this.GAME_TYPE_GDZJ				=3;									//固定庄家
        this.GAME_TYPE_WHQZ				=4;									//无花抢庄
        this.GAME_TYPE_MPTB				=5;									//明牌通比
        this.GAME_TYPE_TBNN				=6;									//通比牛牛
    },
    //回放消息
    CMD_S_ShowCallBank: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ShowCallBank"
        Obj.wCurrentUser = new Array(this.GAME_PLAYER);
        Obj.llTimes = new Array(this.GAME_PLAYER);
        return Obj;
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
    CMD_S_StatusPlaying: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusCallBanker'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.dwCountDown = 0;

        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);
        
        Obj.cbMaxCallBanker = 0;

        Obj.wBankerUser = 0;   						                //庄家用户
        Obj.llBankerScore = 0;
        Obj.llBankerTimes = new Array(this.GAME_PLAYER);

        Obj.cbLastWin = new Array(this.GAME_PLAYER);
        Obj.llPlayerTimes = new Array(this.GAME_PLAYER);

        Obj.bIsCanDouble = 0;
        Obj.bIsCanMinBet = 0;

        Obj.bIsCanCuoPai = 0;
        Obj.iSendCardCount = 0;
        
        Obj.cbOxType = new Array(this.GAME_PLAYER);
        Obj.cbTypeTimes = new Array(this.GAME_PLAYER);
        Obj.cbFinalCardIndex = new Array(this.GAME_PLAYER);

        Obj.cbHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        for (var i = 0; i < this.GAME_PLAYER; i++)  Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);

        Obj.cbCuoPaiState = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //游戏状态
    CMD_S_HistoryInfo: function () {
        var Obj = new Object();
        //Obj._name='CMD_S_HistoryInfo'
        //游戏变量
        Obj.wProgress = 0;
        Obj.wBankerUser = 0;
        Obj.dwUserID = new Array(this.GAME_PLAYER);
        Obj.llBankerTimes = new Array(this.GAME_PLAYER);
        Obj.llPlayerTimes = new Array(this.GAME_PLAYER);

        Obj.llGameScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        Obj.bOxType = new Array(this.GAME_PLAYER);

        Obj.cbHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },

    CMD_S_TEST :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_Test"		
        Obj.wChairID = 0;      		
        Obj.cbUserTest = new Array(this.GAME_PLAYER);  		 //手上扑克  
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbUserTest[i] = new Array(30); 		
        return Obj; 		
    },
    //准备状态
    CMD_S_TESTCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_TestCard"	
        Obj.wChairID = 0;    	
        Obj.cbCardCount = new Array(this.FULL_COUNT);  		 //手上扑克  		
        return Obj; 		
    },

    //发送扑克
    CMD_S_GameStart: function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameStart"
        Obj.llBaseScore = 0;						//基础积分
        Obj.llBankerScore = 0;						//基础积分
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //
        Obj.cbLastWin = new Array(this.GAME_PLAYER);	    //
        return Obj;
    },

    //开始抢庄
    CMD_S_StartCall: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_StartCall"
        Obj.dwCountDown = 0;						//时间
        Obj.cbMaxCallBanker = 0;
        return Obj;
    },

    //抢庄消息
    CMD_S_UserCall: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserCall"
        Obj.wCurrentUser = 0;
        Obj.llTimes = 0;
        return Obj;
    },

    //抢庄动画
    CMD_S_BankerAni: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_BankerAni"
        Obj.llTimes = new Array(this.GAME_PLAYER);
        Obj.cbMaxCall = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //显示庄家
    CMD_S_BankerUser: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_BankerUser"
        Obj.wBankerUser = 0;      					//当前玩家
        Obj.llTimes = 0;
        return Obj;
    },

    //发牌
    CMD_S_SendCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_SendCard"
        Obj.dwCountDown = 0;						//时间
        Obj.cbStartIndex = 0;						//发牌开始位置
        Obj.cbCardData = new Array(this.GAME_PLAYER);	    //
        for (var i = 0; i < this.GAME_PLAYER; i++)  Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },

    //开始下注
    CMD_S_StartJetton: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_StartJetton"
        Obj.dwCountDown = 0;						//时间
        Obj.bIsCanDouble = 0;						//加倍
        Obj.bIsCanTuiZhu = new Array(this.GAME_PLAYER);						//推注
        Obj.bIsCanMinBet = 0;						//下最小注
        return Obj;
    },

    //开始下注
    CMD_S_JettonInfo: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_JettonInfo"
        Obj.llBetScore = new Array(this.MAX_BET_CNT);
        Obj.bIsDouble = 0;
        return Obj;
    },
    //抢庄消息
    CMD_S_UserBet: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserBet"
        Obj.wCurrentUser = 0;
        Obj.llTimes = 0;
        Obj.llScore = 0;
        return Obj;
    },

    //开始摊牌
    CMD_S_StartOpen: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_StartOpen"
        Obj.dwCountDown = 0;						//时间
        Obj.bIsCanCuoPai = 0;
        return Obj;
    },

    //用户摊牌
    CMD_S_Open_Card: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_Open_Card"
        Obj.wChairID = 0;      					//当前玩家
        Obj.cbOxType = 0;
        Obj.cbTypeTimes = 0;
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.iShootIndex = this.MAX_COUNT;
        return Obj;
    },

    //用户摊牌
    CMD_S_Ctrl_Open_Card: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_Ctrl_Open_Card"
        Obj.wChairID = 0;      					//当前玩家
        Obj.cbCardData = new Array(this.MAX_COUNT);
        return Obj;
    },

    //游戏结束
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameEnd"
        //积分变量
        Obj.llBankerScore = 0;
        Obj.llGameScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardData = new Array(this.GAME_PLAYER);	    //
        Obj.cbOxType = new Array(this.GAME_PLAYER);
        Obj.cbTypeTimes = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++)  Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbShootIndex = new Array(this.GAME_PLAYER);
        Obj.wWinRandArr = new Array(this.GAME_PLAYER);
        Obj.wWinUserCount = 0;
        return Obj;
    },
    
    CMD_S_StartCtrl: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameEnd"
        Obj.dwCountDown = 0;
        Obj.bIsNeedStart = false;
        Obj.bIsNeedReady = false;
        return Obj;
    },

    CMD_S_UserState: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserState"
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;
    },

    //大结算
    CMD_S_GameCustomInfo: function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameCustomInfo"		
        Obj.wCallCnt = new Array(this.GAME_PLAYER);         		    //抢庄次数
        Obj.wBankerCnt = new Array(this.GAME_PLAYER);         		    //上庄局数
        Obj.wAddCnt = new Array(this.GAME_PLAYER);         		        //推注次数
        Obj.wWinCnt = new Array(this.GAME_PLAYER);         		        //赢次数
        Obj.wLoseCnt = new Array(this.GAME_PLAYER);         		    //输次数
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;
    },

    //用户叫分
    CMD_C_CallScore: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.llScore = 0;
        Obj.iIndex = 0;
        return Obj;
    },
    
    CMD_C_ChangeJetInfo: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_History"		
        Obj.bIsDouble = 0;
        return Obj;
    },

    CMD_C_State: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_State"		
        Obj.bState = 0;
        return Obj;
    },

    CMD_C_History: function () {
        var Obj = new Object();
        //Obj._name="CMD_C_History"		
        Obj.wProgress = 0;
        return Obj;
    },

    CMD_C_Test :function(){ 
        var Obj = new Object();
        //Obj._name="CMD_C_Test"		
        Obj.wChairID = 0;
        Obj.byIndex = 0;
        return Obj;
    },
    CMD_C_TestCard :function(){ 
        var Obj = new Object();
        //Obj._name="CMD_C_TestCard"		
        Obj.wChairID = 0;
        Obj.cbTestCard = new Array(this.MAX_COUNT);  		 //
        return Obj;
    },

    CMD_S_CallResult: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_CallResult"
        Obj.llBankerTimes = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;
    },

    CMD_S_SendCardResult: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_SendCardResult"
        Obj.iSendCardCount = 0;
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++)  Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },

    CMD_S_JetResult: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_JetResult"
        Obj.llPlayerTimes = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;
    },
    
    CMD_S_OpenResult: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_OpenResult"
        Obj.cbOxType = new Array(this.GAME_PLAYER);
        Obj.cbFinalCardIndex = new Array(this.GAME_PLAYER);
        Obj.cbTypeTimes = new Array(this.GAME_PLAYER);
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++)  Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },
    ///////////////////////////////////////////////////////////    
    //游戏模式
    GetPayMode: function (ServerRules, RulesArr) {
        if (ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },

    GetStartMode: function (ServerRules, RulesArr) {
        var PlayerCnt = this.GetPlayerCount(ServerRules, RulesArr);
        if (RulesArr[1] & this.GAME_TYPE_READY) return '准备开始';
        if (RulesArr[1] & this.GAME_TYPE_FIRST_CTRL) return '首位开始';
        if (RulesArr[1] & this.GAME_TYPE_CTRLSTART2) return '满2人开始';
        if (RulesArr[1] & this.GAME_TYPE_2NSTART) return '满' + (PlayerCnt - 2) + '人开始';
        if (RulesArr[1] & this.GAME_TYPE_1NSTART) return '满' + (PlayerCnt - 1) + '人开始';
        if (RulesArr[1] & this.GAME_TYPE_NSTART) return '满' + (PlayerCnt) + '人开始';
        return '';
    },

    //玩家数量
    GetPlayerCount: function (ServerRules, RulesArr) {
        if (ServerRules & this.GAME_TYPE_P_COUNT_0) return 4;
        if (ServerRules & this.GAME_TYPE_P_COUNT_1) return 6;
        if (ServerRules & this.GAME_TYPE_P_COUNT_2) return 8;
        return 6;
    },
    //游戏进度
    GetProgress: function (wProgress, ServerRules, RulesArr) {
        var cnt = this.GetGameCount(ServerRules, RulesArr);

        if (cnt > 0) {
            return '第' + wProgress + '/' + cnt + '局';
        } else {
            return '';
        }
    },
    //游戏局数
    GetGameCount: function (ServerRules, RulesArr) {
        var cnt = 0;
        if (ServerRules & this.GAME_TYPE_ROUND_0) cnt = 10;
        if (ServerRules & this.GAME_TYPE_ROUND_1) cnt = 15;
        if (ServerRules & this.GAME_TYPE_ROUND_2) cnt = 20;
        return cnt;
    },
    //游戏模式
    GetGameMode: function (ServerRules, RulesArr) {
        var str = '';

        // this.GAME_PLAY_TYPE_0			= (this.RuleValue3)							//无赖
        // this.GAME_PLAY_TYPE_1			= (this.RuleValue4)							//经典
        // this.GAME_PLAY_TYPE_2			= (this.RuleValue5)							//疯狂

        if (RulesArr[2] & this.GAME_PLAY_TYPE_0) str = '经典';
        if (RulesArr[2] & this.GAME_PLAY_TYPE_1) str = '经典王赖';
        if (RulesArr[2] & this.GAME_PLAY_TYPE_2) str = '疯狂王赖';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_1) str = '明牌抢庄';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_2) str = '轮庄模式';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_3) str = '自由抢庄';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_4) str = '固定庄家';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_5) str = '无花抢庄';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_6) str = '明牌通比';
        // if (RulesArr[0] & this.GAME_TYPE_GAME_7) str = '通比模式';
        return str;
    },
    //游戏底分
    GetBaseScore: function (ServerRules, RulesArr) {
        var score = 1;
        if (RulesArr[0] & this.GAME_TYPE_BASE1) score = 1;
        if (RulesArr[0] & this.GAME_TYPE_BASE2) score = 2;
        if (RulesArr[0] & this.GAME_TYPE_BASE3) score = 5;
        if (RulesArr[0] & this.GAME_TYPE_BASE4) score = 10;
        if (RulesArr[0] & this.GAME_TYPE_BASE5) score = 20;
        if (RulesArr[0] & this.GAME_TYPE_BASE6) score = 50;
        if (RulesArr[0] & this.GAME_TYPE_BASE7) score = 100;
        if (RulesArr[0] & this.GAME_TYPE_BASE8) score = 40;
        if (RulesArr[0] & this.GAME_TYPE_BASE9) score = 200;

        // if (RulesArr[0] & this.GAME_TYPE_BASE1) score = 2;
        // if (RulesArr[0] & this.GAME_TYPE_BASE2) score = 4;
        // if (RulesArr[0] & this.GAME_TYPE_BASE3) score = 5;
        // if (RulesArr[0] & this.GAME_TYPE_BASE4) score = 10;
        // if (RulesArr[0] & this.GAME_TYPE_BASE5) score = 20;
        // if (RulesArr[0] & this.GAME_TYPE_BASE6) score = 30;
        // if (RulesArr[0] & this.GAME_TYPE_BASE7) score = 40;
        // if (RulesArr[0] & this.GAME_TYPE_BASE8) score = 50;
        // if (RulesArr[0] & this.GAME_TYPE_BASE9) score = 200;
        return score;
    },
    //游戏底分
    GetBaseScoreStr: function (ServerRules, RulesArr) {
        var score = '';
        var BaseScore = this.GetBaseScore(ServerRules, RulesArr);
        score = BaseScore + '-' + BaseScore * 2;

        if (RulesArr[0] & this.GAME_TYPE_GAME_6)
        {
            score = BaseScore + '';
            return score;
        }
        if (RulesArr[0] & this.GAME_TYPE_GAME_7)
        {
            score = BaseScore + '';
            return score;
        }
        if (RulesArr[2] & this.GAME_PLAY_TYPE_0)
        {
             score = BaseScore + '-' + BaseScore * 2+ '-' + BaseScore * 4;
        }
        if (RulesArr[2] & this.GAME_PLAY_TYPE_1)
        {
             score = BaseScore + '-' + BaseScore * 2 + '-' + BaseScore * 4;
        }
        if (RulesArr[2] & this.GAME_PLAY_TYPE_2) 
        {
             score = BaseScore + '-' + BaseScore * 2 + '-' + BaseScore * 10;
        }
        // if(ScoreTimes > 0) score += '-'+BaseScore*ScoreTimes;
        return score;
    },
    //
    GetAddScore: function (ServerRules, RulesArr) {
        var score = 0;
        if (RulesArr[0] & this.GAME_TYPE_ADD1) score = 0;
        if (RulesArr[0] & this.GAME_TYPE_ADD2) score = 2;
        if (RulesArr[0] & this.GAME_TYPE_ADD3) score = 3;
        if (RulesArr[0] & this.GAME_TYPE_ADD4) score = 5;
        if (RulesArr[0] & this.GAME_TYPE_ADD5) score = 10;
        return score;
    },

    //最大抢庄
    GetBankerMaxCall: function (ServerRules, RulesArr) {
        var score = 0;
        if (RulesArr[0] & this.GAME_TYPE_BANKER_1) score = 1;
        if (RulesArr[0] & this.GAME_TYPE_BANKER_2) score = 2;
        if (RulesArr[0] & this.GAME_TYPE_BANKER_3) score = 3;
        if (RulesArr[0] & this.GAME_TYPE_BANKER_4) score = 4;
        return score;
    },
    GetCardTimesStr: function (ServerRules, RulesArr) {
        var str = '';
        if (RulesArr[1] & this.GAME_TYPE_TIMES_1) str = '牛牛X4牛九X3牛八X2牛七X2';//顺子牛X5五花牛X5同花牛X6葫芦牛X7炸弹牛X8五小牛X10同花顺X10
        if (RulesArr[1] & this.GAME_TYPE_TIMES_2) str = '牛牛X3牛九X2牛八X2牛七X1';//顺子牛X5五花牛X5同花牛X6葫芦牛X7炸弹牛X8五小牛X10同花顺X10
        if (RulesArr[1] & this.GAME_TYPE_TIMES_3) str = '牛牛X3牛九X2牛八X2牛七X2';//顺子牛X5五花牛X5同花牛X6葫芦牛X7炸弹牛X8五小牛X10同花顺X10
        if (RulesArr[1] & this.GAME_TYPE_TIMES_4) str = '牛牛X5牛九X4牛八X3牛七X2';//顺子牛X6五花牛X6同花牛X7葫芦牛X8炸弹牛X9五小牛X10同花顺X10
        if (RulesArr[1] & this.GAME_TYPE_TIMES_5) str = '牛一到牛牛分别对应1到10倍';//顺子牛X11五花牛X11同花牛X12葫芦牛X13炸弹牛X14五小牛X15同花顺X15
        return str;
    },
    GetRulesStr: function (ServerRules, RulesArr) {
        var str = this.GetGameMode(ServerRules, RulesArr);
        str += " 底分" + this.GetBaseScoreStr(ServerRules, RulesArr);

        str += " " + this.GetPlayerCount(ServerRules, RulesArr) + "人";
        str += " " + this.GetGameCount(ServerRules, RulesArr) + "局";
        //str += " "+this.GetKingMode(ServerRules, RulesArr);
        str += " " + this.GetStartMode(ServerRules, RulesArr);
        
        if (RulesArr[2] & this.GAME_PLAY_TYPE_0) str += " 经典玩法";
        if (RulesArr[2] & this.GAME_PLAY_TYPE_1) str += " 经典王赖";
        if (RulesArr[2] & this.GAME_PLAY_TYPE_2) str += " 疯狂王赖";

        if (this.GetBankerMaxCall(ServerRules, RulesArr) != 0)
            str += " 最大抢庄:" + this.GetBankerMaxCall(ServerRules, RulesArr);

        var AddTimes = 0, AddTimes2 = 0;//倍数与推注
        // if (RulesArr[1] & this.GAME_TYPE_CRAZY) AddTimes = 4;//红牛
        // if (RulesArr[1] & this.GAME_TYPE_RED) AddTimes = 10;//红牛
        if (RulesArr[0] & this.GAME_TYPE_ADD1) AddTimes2 = 0;
        if (RulesArr[0] & this.GAME_TYPE_ADD2) AddTimes2 = 5;
        if (RulesArr[0] & this.GAME_TYPE_ADD3) AddTimes2 = 10;
        if (RulesArr[0] & this.GAME_TYPE_ADD4) AddTimes2 = 15;
        if (RulesArr[0] & this.GAME_TYPE_ADD5) AddTimes2 = 20;
        if (AddTimes == 0) {
            if (AddTimes2 == -1) str += "";
            else if (AddTimes2 == 0) str += " 无推注";
            else str += " 推注:" + AddTimes2;
        }
        
        if (RulesArr[0] & this.GAME_TYPE_BANKER_S1) str += "";
        if (RulesArr[0] & this.GAME_TYPE_BANKER_S2) str += " 上庄分数：5000";
        if (RulesArr[0] & this.GAME_TYPE_BANKER_S3) str += " 上庄分数：10000";
        if (RulesArr[0] & this.GAME_TYPE_BANKER_S4) str += " 上庄分数：20000";
        if (RulesArr[0] & this.GAME_TYPE_BANKER_S5) str += " 上庄分数：30000";


        if (RulesArr[0] & this.GAME_TYPE_TURN1) str += " 轮流坐庄";
        if (RulesArr[0] & this.GAME_TYPE_TURN2) str += " 牛牛上庄";
        if (RulesArr[0] & this.GAME_TYPE_TURN3) str += " 没牛下庄";

        if (RulesArr[1] & this.GAME_TYPE_TONGBIQUAN) str += " 全比模式";

        if (RulesArr[1] & this.GAME_TYPE_LINE) str += " 顺子牛";
        if (RulesArr[1] & this.GAME_TYPE_5F) str += " 五花牛";
        if (RulesArr[1] & this.GAME_TYPE_COLOR) str += " 同花牛";
        if (RulesArr[1] & this.GAME_TYPE_HL) str += " 葫芦牛";
        if (RulesArr[1] & this.GAME_TYPE_BOMB) str += " 炸弹牛";
        if (RulesArr[1] & this.GAME_TYPE_SMALL) str += " 五小牛";
        if (RulesArr[1] & this.GAME_TYPE_HAPPYX) str += " 同花顺";
        if (RulesArr[1] & this.GAME_TYPE_FORTY) str += " 四十牛";

        if (RulesArr[1] & this.GAME_TYPE_OTHER1) str += " 快速模式";
        if (RulesArr[1] & this.GAME_TYPE_OTHER2) str += " 中途禁入";
        if (RulesArr[1] & this.GAME_TYPE_OTHER3) str += " 禁止搓牌";
        if (RulesArr[1] & this.GAME_TYPE_OTHER4) str += " 禁用表情";
        if (RulesArr[1] & this.GAME_TYPE_OTHER5 && AddTimes != 10) str += " 下注限制";
        if (RulesArr[1] & this.GAME_TYPE_OTHER6) str += " 暗抢庄家";
        if (RulesArr[1] & this.GAME_TYPE_OTHER7 && AddTimes == 0) str += " 下注加倍";
        if (RulesArr[1] & this.GAME_TYPE_OTHER8) str += " 禁用语音";

        return str;
    },

    //////////////////////////////////////////////////////////////////////////RULES 1


    GetRulesStr2: function (ServerRules, RulesArr) {
        var str = this.GetPlayerCount(ServerRules, RulesArr) + "人";
        str += " " + this.GetGameCount(ServerRules, RulesArr) + "局";
        str += " " + this.GetStartMode(ServerRules, RulesArr);
        
        if (RulesArr[2] & this.GAME_PLAY_TYPE_0) str += " 经典玩法";
        if (RulesArr[2] & this.GAME_PLAY_TYPE_1) str += " 疯狂玩法";
        if (RulesArr[2] & this.GAME_PLAY_TYPE_2) str += " 红牛玩法";

        if (RulesArr[2] & this.GAME_KING_NORMAL) str += " 经典王赖";
        if (RulesArr[2] & this.GAME_KING_CRAZY) str += " 疯狂王赖";

        if (this.GetBankerMaxCall(ServerRules, RulesArr) != 0)
            str += " 最大抢庄:" + this.GetBankerMaxCall(ServerRules, RulesArr);

        var AddTimes = 0, AddTimes2 = 0;//倍数与推注
        if (RulesArr[0] & this.GAME_TYPE_ADD1) AddTimes2 = 0;
        if (RulesArr[0] & this.GAME_TYPE_ADD2) AddTimes2 = 5;
        if (RulesArr[0] & this.GAME_TYPE_ADD3) AddTimes2 = 10;
        if (RulesArr[0] & this.GAME_TYPE_ADD4) AddTimes2 = 15;
        if (RulesArr[0] & this.GAME_TYPE_ADD5) AddTimes2 = 20;
        if (AddTimes == 0) {
            if (AddTimes2 == -1) str += "";
            else if (AddTimes2 == 0) str += " 无推注";
            else str += " 推注:" + AddTimes2;
        }

        if (RulesArr[1] & this.GAME_TYPE_LINE) str += " 顺子牛";
        if (RulesArr[1] & this.GAME_TYPE_5F) str += " 五花牛";
        if (RulesArr[1] & this.GAME_TYPE_COLOR) str += " 同花牛";
        if (RulesArr[1] & this.GAME_TYPE_HL) str += " 葫芦牛";
        if (RulesArr[1] & this.GAME_TYPE_BOMB) str += " 炸弹牛";
        if (RulesArr[1] & this.GAME_TYPE_SMALL) str += " 五小牛";
        if (RulesArr[1] & this.GAME_TYPE_HAPPYX) str += " 同花顺";
        if (RulesArr[1] & this.GAME_TYPE_FORTY) str += " 四十牛";

        if (RulesArr[1] & this.GAME_TYPE_OTHER1) str += " 快速模式";
        if (RulesArr[1] & this.GAME_TYPE_OTHER2) str += " 中途禁入";
        if (RulesArr[1] & this.GAME_TYPE_OTHER3) str += " 禁止搓牌";
        if (RulesArr[1] & this.GAME_TYPE_OTHER4) str += " 禁用表情";
        if (RulesArr[1] & this.GAME_TYPE_OTHER5 && AddTimes != 10) str += " 下注限制";
        if (RulesArr[1] & this.GAME_TYPE_OTHER6) str += " 暗抢庄家";
        if (RulesArr[1] & this.GAME_TYPE_OTHER7 && AddTimes == 0) str += " 下注加倍";
        if (RulesArr[1] & this.GAME_TYPE_OTHER8) str += " 禁用语音";

        //if(ServerRules & SERVER_RULES_SCORE) str += " 抢庄分数:"+RulesArr[3];

        return str;
    },

    IsNoCheat: function (rules) { return true; },
});

GameDef = null;
//////////////////////////////////////////////////////////////////////////////////