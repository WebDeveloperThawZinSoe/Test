//CMD_Game.js
CMD_GAME_501 = new cc.Class({ //window.
    ctor: function () {
        //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID                       = 501;
        this.GAME_PLAYER                   = 6;            //游戏人数
        this.MAX_COUNT                     = 9;           //手牌数量
        this.FULL_COUNT                    = 54;

        this.FRONT_COUNT                   = 3;            //第一道
        this.MIDDLE_COUNT                  = 3;            //第二道
        this.BACK_COUNT                    = 3;            //第三道
        this.MYSELF_VIEW_ID                = 3;            //自己视图ID

        this.INVALID_TIMES                 = 0xFF;

        // 游戏规则
////////////////////////////////////////////////////////////////////////// ServerRules 16-31

        this.GAME_TYPE_ROUND_0			=0x00100000		//1
        this.GAME_TYPE_ROUND_1			=0x00200000		//2
        this.GAME_TYPE_ROUND_2			=0x00400000		//3
        this.GAME_TYPE_ROUND_3			=0x00800000		//4

        this.GAME_NO_KING				=0x00000020		//5
        this.GAME_NO_SMALL_KING			=0x00000040		//6

        this.GAME_TYPE_GPS				=0x00000080
        this.GAME_TYPE_NOVOICE			=0x00000100
        this.GAME_TYPE_NOCHAT			=0x00000200
        this.GAME_TYPE_JOIN				=0x00000400		//10
        this.GAME_TYPE_IP				=0x00000800
        this.GAME_TYPE_ZHONGLU			=0x00001000
        this.GAME_TYPE_BEISHU			=0x00002000

        this.GAME_TYPE_XI				=0x00004000		//14
        this.GAME_TYPE_NOXI				=0x00008000

        this.GAME_TYPE_TUO				=0x00020000		//17
        this.GAME_TYPE_TUO_0			=0x00040000		//18
        this.GAME_TYPE_TUO_1			=0x00080000		//19
        this.GAME_TYPE_TUO_2			=0x00100000		//20






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
        this.SUB_S_START_CTRL       = 107;
        this.SUB_S_USER_READY       = 108;
		this.SUB_S_CUT_USER         = 109;
        this.SUB_S_CUT_CARD         = 110;
        this.SUB_S_OP_ROBE_BANK		= 111;
        this.SUB_S_ROBE_BANK		= 112;
        this.SUB_S_ROBE_RES			= 113;
        this.SUB_S_AUTO_PUT		    = 114;
        this.SUB_S_BI_PIN           =115;
        this.SUB_S_CHECK_CARD       = 116;
        //////////////////////////////////////////////////////////////////////////////////
        //客户端命令定义
        this.SUB_C_SHOWCARD         = 1;            //选择娃娃
        this.SUB_C_COMPLETE_COMPARE = 2;            //掷骰子
        this.SUB_C_TIQIAN           = 4;
        this.SUB_C_READY			= 5;									//准备

        this.SUB_C_CUT_USER         = 6;
        this.SUB_C_CUT_CARD         = 7;
        this.SUB_C_ROBE_BANK		= 8;
        this.SUB_C_AUTO             = 9;
        this.SUB_C_GIVE_UP          = 10;
        this.SUB_C_CHECKCARD        = 11;  
    },
    
    CMD_S_BiPin:function(){
        var Obj = new Object();
        Obj.bIsBiPing = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //空闲状态
    CMD_S_StatusFree: function () {
        var Obj = new Object();
        Obj._name = 'CMD_S_StatusFree';
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);
        Obj.cbTimeStartGame = 0;
        Obj.cbTimeRangeCard = 0;
        Obj.wWaitTime = 0;
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

        Obj.bIsChoose = new Array(this.GAME_PLAYER);
        Obj.bIsBiPing = new Array(this.GAME_PLAYER);
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
        Obj.nTime = 0;
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
        Obj.llXiScore = new Array(this.GAME_PLAYER);
        Obj.llBaseScore = new Array(this.GAME_PLAYER);
        Obj.bIsShowZhong = false;
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
    CMD_S_UserState :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_UserState"		
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);         		//扑克数目 
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
    CMD_S_CheckCard: function () {
        var Obj = new Object();
        Obj.cbFrontCard = new Array(this.FRONT_COUNT);
        Obj.cbMidCard = new Array(this.MIDDLE_COUNT);
        Obj.cbBackCard = new Array(this.BACK_COUNT);
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
        Obj.bValue = 0;
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
        if(ServerRules & this.GAME_TYPE_ROUND_0) cnt = 6;
        if(ServerRules & this.GAME_TYPE_ROUND_1) cnt = 12;
        if(ServerRules & this.GAME_TYPE_ROUND_2) cnt = 18;
        if(ServerRules & this.GAME_TYPE_ROUND_3) cnt = 24;

        return cnt;
    },

    /**
     * @return {string}
     */
    GetProgress: function (wProgress, ServerRules, RulesArr) {
        return  wProgress + '/' + this.GetGameCount(ServerRules, RulesArr);
    },

    IsNoCheat: function (ServerRules, RulesArr) { return true;},

    /**
     * @return {number}
     */
    GetPlayerCount: function (ServerRules, RulesArr) {
        var cnt = this.GAME_PLAYER;
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
        
        return score;
    },
    //游戏模式
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    GetReadyTime: function (ServerRules, RulesArr) {
        var cnt = 0;
        
        
        return cnt;
    },
    /**
     * @return {string}
     */
    GetRulesStr: function (ServerRules, RulesArr) {
        var str = this.GetGameCount(ServerRules, RulesArr) + "局 ";
        
        if(RulesArr[0] & this.GAME_NO_KING) str += ' 不带王';
        if(RulesArr[0] & this.GAME_NO_SMALL_KING) str += ' 不带小王'; 

        if(RulesArr[0] & this.GAME_TYPE_XI) str += ' 有喜'; 
        if(RulesArr[0] & this.GAME_TYPE_NOXI) str += ' 无喜'; 
        if(RulesArr[0] & this.GAME_TYPE_ZHONGLU) str += ' 比拼中路'; 
        if(RulesArr[0] & this.GAME_TYPE_GPS) str += ' GPS'; 
        if(RulesArr[0] & this.GAME_TYPE_NOVOICE) str += ' 禁止语音'; 
        if(RulesArr[0] & this.GAME_TYPE_NOCHAT) str += ' 禁止快捷语'; 
        if(RulesArr[0] & this.GAME_TYPE_JOIN) str += ' 中途加入'; 
        if(RulesArr[0] & this.GAME_TYPE_IP) str += ' 同IP禁入'; 
        if(RulesArr[0] & this.GAME_TYPE_BEISHU) str += ' 当前房间玩家人数*倍数（6*1,5*2,4*3,3*5,2*10）'; 
        if(RulesArr[0] & this.GAME_TYPE_ZHONGLU) str += ' 比拼中路'; 


        return str;
    },

});

GameDef = null;



//////////////////////////////////////////////////////////////////////////////////