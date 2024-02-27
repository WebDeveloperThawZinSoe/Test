//CMD_Game.js
CMD_GAME_500 = new cc.Class({ //window.
    ctor: function () {
        //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID                       = 500;
        this.GAME_PLAYER                   = 8;            //游戏人数
        this.MAX_COUNT                     = 13;           //手牌数量
        this.FULL_COUNT                    = 108;

        this.FRONT_COUNT                   = 3;            //第一道
        this.MIDDLE_COUNT                  = 5;            //第二道
        this.BACK_COUNT                    = 5;            //第三道
        this.MYSELF_VIEW_ID                = 4;            //自己视图ID

        this.INVALID_TIMES                 = 0xFF;

        // 游戏规则
////////////////////////////////////////////////////////////////////////// ServerRules 16-31
        // 人数
        this.GAME_TYPE_1_PLAYER		     	    =   0x00010000;		   //2人             3
        this.GAME_TYPE_2_PLAYER		    	    =   0x00020000;		   //3人             2        
        this.GAME_TYPE_3_PLAYER		     	    =   0x00040000;		   //4人             
        this.GAME_TYPE_4_PLAYER		    	    =   0x00080000;		   //5人             

        this.GAME_TYPE_CNT_1				    =   0x00100000							//12
        this.GAME_TYPE_CNT_2				    =   0x00200000							//24
        this.GAME_TYPE_CNT_3				    =   0x00400000							//48

        this.GAME_TYPE_5_PLAYER		     	    =   0x01000000;		   //6人             
        this.GAME_TYPE_6_PLAYER		    	    =   0x02000000;		   //7人                    
        
////////////////////////////////////////////////////////////////////////// RULES 0
        this.GAME_TYPE_BASE1				    =   0x00000001							//1
        this.GAME_TYPE_BASE2				    =   0x00000002							//10
        this.GAME_TYPE_BASE3				    =   0x00000004							//20
        this.GAME_TYPE_BASE4				    =   0x00000008							//50
        this.GAME_TYPE_BASE5				    =   0x00000010							//100
        this.GAME_TYPE_BASE6				    =   0x00000020							//150
        this.GAME_TYPE_BASE7				    =   0x00000040							//300
        this.GAME_TYPE_BASE8				    =   0x00000080							//500

        // 牌库
        this.GAME_TYPE_LESS_1	     		    =   0x00000100;		   //少一套方片       8
        this.GAME_TYPE_LESS_2	     	        =   0x00000200;		   //少 2-7的牌      9
        // 马牌
        this.GAME_TYPE_MAPAI_1	     		    =   0x00000800;		   //马牌1  黑K      11
        this.GAME_TYPE_MAPAI_2		     	    =   0x00001000;		   //马牌2  黑5      12
        this.GAME_TYPE_MAPAI_3	     		    =   0x00002000;		   //马牌3  黑10     13
        // 打枪相关
        this.GAME_TYPE_KILLSCOREDOUBLE    	    =   0x00004000;		   //打枪翻倍        14
        this.GAME_TYPE_ENABLEREDWEAVE	        =   0x00008000;		   //红波浪 (全垒打)  15
        // 摆牌模式
        this.GAME_TYPE_PUTCARD_FREE             =   0x00010000;		   //自由摆牌        16
        // 比牌方式
        this.GAME_TYPE_COMPARECOLORFIRST	    =   0x00020000;		   //优先比花色       6
        this.GAME_TYPE_COMPAREVALUEFIRST	    =   0x00040000;		   //优先比大小       7
        this.GAME_TYPE_DOUBELTIMES			    =   0x00080000		   //南宁玩法 特殊牌分数*2 19 
            //自动准备
        this.GAME_TYPE_READY_1				    =   0x00100000							//10秒 20
        this.GAME_TYPE_READY_2				    =   0x00200000							//20秒 21
        this.GAME_TYPE_READY_3				    =   0x00400000							//30秒 22


        //////////////////////////////////////////////////////////////////////////////////
        //状态定义

        this.GAME_SCENE_FREE        = 0;            //等待开始
        this.GAME_SCENE_PLAY        = 100;          //游戏进行

        //////////////////////////////////////////////////////////////////////////////////
        //服务端命令定义
        this.SUB_S_GAME_START       = 101;          //游戏开始
        this.SUB_S_SHOW_CARD        = 102;          //玩家摊牌
        this.SUB_S_COMPARE_CARD     = 103;          //比较扑克
        this.SUB_S_MOBILE_PUTCARD   = 105;          //手机托管牌
        this.SUB_S_GAME_END         = 106;          //游戏结束
        this.SUB_S_USER_READY		= 108;					//准备
	    this.SUB_S_CUT_USER         = 109;
        this.SUB_S_CUT_CARD         = 110;
        this.SUB_S_START_CTRL		= 111;
        this.SUB_S_ROBE_BANK		= 112;
        this.SUB_S_ROBE_RES			= 113;
        this.SUB_S_AUTO_PUT		    = 114;
        this.SUB_S_RE_SET	        = 115;
        //////////////////////////////////////////////////////////////////////////////////
        //客户端命令定义
        this.SUB_C_SHOWCARD         = 1;            //选择娃娃
        this.SUB_C_COMPLETE_COMPARE = 2;            //掷骰子
        this.SUB_C_READY			=			4;									//准备
        this.SUB_C_START			=			5;									//控制开始
        this.SUB_C_CUT_USER         = 6;
        this.SUB_C_CUT_CARD         = 7;
        this.SUB_C_ROBE_BANK		= 8;
        this.SUB_C_AUTO             = 9;
        this.SUB_C_RESET             = 10;
       
        
    },
    
    

    //空闲状态
    CMD_S_StatusFree: function () {
        var Obj = new Object();
        Obj._name = 'CMD_S_StatusFree';
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbTimeStartGame = 0;
        Obj.cbTimeRangeCard = 0;
        Obj.wWaitTime = 0;
        Obj.wFirstUser = INVALID_CHAIR;
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay: function () {
        var Obj = new Object();
        //时间信息
        Obj._name = 'CMD_S_StatusPlay';
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbRobeTimes = new Array(this.GAME_PLAYER);
        Obj.cbTimeRangeCard = 0;
        Obj.cbHandCardData = new Array(this.MAX_COUNT);
        Obj.cbSegmentCard = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.cbSegmentCard[i] = new Array(this.MAX_COUNT);
        }
        Obj.bFinishSegment = new Array(this.GAME_PLAYER);
        Obj.wBanker = INVALID_CHAIR;
        Obj.wCurUser = INVALID_CHAIR;
        Obj.llScoreTimes = new Array (this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.llScoreTimes[i] = new Array(3);
        }
        Obj.cbSpecialType = 0;
        Obj.bCompared = false;
        Obj.wWaitTime = 0;

        return Obj;
    },

    //游戏开始
    CMD_S_GameStart: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameStart";
        Obj.wBanker = 0;
        Obj.bCardData = new Array(this.MAX_COUNT);
        Obj.cbSpecialType = 0;
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        return Obj;
    },
    CMD_S_ReSet: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ReSet";
        Obj.bRoomCard = 0;
        Obj.bCardData = new Array(this.MAX_COUNT);
        Obj.cbSpecialType = 0;
        return Obj;
    },
    //摊牌
    CMD_S_ShowCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ShowCard";
        Obj.wCurrentUser = INVALID_CHAIR;
        Obj.cbFrontCard = new Array(this.FRONT_COUNT);
        Obj.cbMidCard = new Array(this.MIDDLE_COUNT);
        Obj.cbBackCard = new Array(this.BACK_COUNT);

        return Obj;
    },

    //比牌
    CMD_S_CompareCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_CompareCard";
        Obj.wBankUser = 0;
        Obj.bSegmentCard = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.bSegmentCard[i] = new Array (this.MAX_COUNT);
        }
        Obj.llScoreTimes = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.llScoreTimes[i] = new Array(3);
        }
        Obj.cbSpecialType = new Array(this.GAME_PLAYER);
        Obj.llFinalScore = new Array(this.GAME_PLAYER);
        Obj.bGun = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.bGun[i] = new Array(this.GAME_PLAYER);
        }
        Obj.llGunP2P = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.llGunP2P[i] = new Array(this.GAME_PLAYER);
        }
        return Obj;
    },

    //用户操作
    CMD_S_Trustee: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_Trustee";
        Obj.wChairID = 0;
        Obj.bTrustee = 0;
        return Obj;
    },

    //单局分数
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameEnd";
        Obj.llGameScore = new Array(this.GAME_PLAYER);
        Obj.llScoreTimes = new Array(this.GAME_PLAYER);
        Obj.llCompareResult = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.llCompareResult[i] = new Array(3);
        }
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbSpecialType = new Array(this.GAME_PLAYER);
        Obj.cbEndType = 0;
        Obj.bShowBigResult = false;
        return Obj;
    },

    CMD_S_GameCustomInfo: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameCustomInfo";
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        return Obj;
    },
    CMD_S_UserState :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_UserState"		
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;        						        
    },
    CMD_S_HandCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_HandCard";
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.cbSpecialType = 0;
        return Obj;
    },

    CMD_S_CutUser: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_CutUser";
        Obj.wChairID = 0;
        return Obj;
    },

    CMD_S_CutCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_CutCard";
        Obj.wChairID = 0;
        Obj.dValue = 0;
        return Obj;
    },

    CMD_S_AutoPut: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_AutoPut";
        Obj.bSegmentCard = new Array(this.MAX_COUNT);
        return Obj;
    },

    CMD_S_RobeBank: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_RobeBank";
        Obj.wChairID = 0;
        Obj.cbRobeTimes = 0;
        return Obj;
    },

    CMD_S_RobeResult: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_RobeBank";
        Obj.wBanker = 0;
        Obj.wRandUser = new Array(this.GAME_PLAYER);
        Obj.cbRandCnt = 0;
        Obj.cbRandIdx = 0;
        return Obj;
    },
  	
    //摊牌
    CMD_C_ShowCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_ShowCard";
        Obj.cbFrontCard = new Array(this.FRONT_COUNT);
        Obj.cbMidCard = new Array(this.MIDDLE_COUNT);
        Obj.cbBackCard = new Array(this.BACK_COUNT);
        Obj.bSpecial = false;
        return Obj;
    },

    //用户获取路
    CMD_C_Trustee: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_Trustee";
        Obj.bTrustee = false;
        return Obj;
    },

    CMD_C_SetCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_SetCard";
        Obj.cbCardCount = 0;
        Obj.cbCardData = new Array(this.MAX_COUNT);
        return Obj;
    },

    CMD_C_CutCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_CutCard";
        Obj.dValue = 0;
        return Obj;
    },

    CMD_C_RobeBank: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_RobeBank";
        Obj.cbRobeTime = 0;
        return Obj;
    },
    

    //游戏局数
    GetGameCount:function(ServerRules, RulesArr){
        var cnt=0;
        if(ServerRules & this.GAME_TYPE_CNT_1) cnt = 12;
        if(ServerRules & this.GAME_TYPE_CNT_2) cnt = 24;
        if(ServerRules & this.GAME_TYPE_CNT_3) cnt = 48;
        return cnt;
    },

    /**
     * @return {string}
     */
    GetProgress: function (wProgress, ServerRules, RulesArr) {
        return '第'+ wProgress + '/' + this.GetGameCount(ServerRules, RulesArr)+'局';
    },

    IsNoCheat: function (ServerRules, RulesArr) { return true;},

    /**
     * @return {number}
     */
    GetPlayerCount: function (ServerRules, RulesArr) {
        var cnt = this.GAME_PLAYER;
        if (ServerRules & this.GAME_TYPE_2_PLAYER) cnt = 2;
        if (ServerRules & this.GAME_TYPE_1_PLAYER) cnt = 3;
        if (ServerRules & this.GAME_TYPE_3_PLAYER) cnt = 4;
        if (ServerRules & this.GAME_TYPE_4_PLAYER) cnt = 5;
        if (ServerRules & this.GAME_TYPE_5_PLAYER) cnt = 6;
        if (ServerRules & this.GAME_TYPE_6_PLAYER) cnt = 7;
        return cnt;
    },
    GetBaseScoreStr: function(ServerRules, RulesArr){
        return this.GetBaseScore(ServerRules, RulesArr)
    },
    /**
     * @return {number}
     */
    GetBaseScore: function(ServerRules, RulesArr){
        var score=1;
        if(RulesArr[0] & this.GAME_TYPE_BASE1) score=1;
        if(RulesArr[0] & this.GAME_TYPE_BASE2) score=10;
        if(RulesArr[0] & this.GAME_TYPE_BASE3) score=20;
        if(RulesArr[0] & this.GAME_TYPE_BASE4) score=50;
        if(RulesArr[0] & this.GAME_TYPE_BASE5) score=100;
        if(RulesArr[0] & this.GAME_TYPE_BASE6) score=150;
        if(RulesArr[0] & this.GAME_TYPE_BASE7) score=300;
        if(RulesArr[0] & this.GAME_TYPE_BASE8) score=500;
        return score;
    },
    //游戏模式
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    GetReadyTime: function (ServerRules, RulesArr) {
        var cnt = 0;
        if(RulesArr[0] & this.GAME_TYPE_READY_1) cnt=10;
        if(RulesArr[0] & this.GAME_TYPE_READY_2) cnt=20;
        if(RulesArr[0] & this.GAME_TYPE_READY_3) cnt=30;
        return cnt;
    },
    /**
     * @return {string}
     */
    GetRulesStr: function (ServerRules, RulesArr) {
        var str = this.GetGameCount(ServerRules, RulesArr) + "局 ";
        str += "底分" + this.GetBaseScore(ServerRules, RulesArr) + "分 ";
        str += this.GetPlayerCount(ServerRules, RulesArr) + "人 ";
      
        if (RulesArr[0] & this.GAME_TYPE_COMPARECOLORFIRST) str += "先比花色 ";
        if (RulesArr[0] & this.GAME_TYPE_COMPAREVALUEFIRST) str += "先比点数 ";

        /*if (rules & this.GAME_TYPE_LESS_1) str += "去掉方块 ";
        else if (rules & this.GAME_TYPE_LESS_2) str += "去掉2-7 ";
        else str += "整副牌 ";*/
            
        if (RulesArr[0] & this.GAME_TYPE_MAPAI_1) str += "码牌黑桃K ";
        else if (RulesArr[0] & this.GAME_TYPE_MAPAI_2) str += "码牌黑桃5 ";
        else if (RulesArr[0] & this.GAME_TYPE_MAPAI_3) str += "码牌黑桃10 ";
        else str += "不带码 ";
      
        if (RulesArr[0] & this.GAME_TYPE_PUTCARD_FREE) str += "自由摆牌 ";
        else str += "推荐牌型 ";

        if (RulesArr[0] & this.GAME_TYPE_DOUBELTIMES) str += "南宁玩法 ";
        if (RulesArr[0] & this.GAME_TYPE_KILLSCOREDOUBLE) str += "打枪不翻倍 ";

        return str;
    },

});

GameDef = null;



//////////////////////////////////////////////////////////////////////////////////