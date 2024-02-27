//CMD_Game.js
CMD_GAME_50000 = new cc.Class({ //window.
    ctor: function () {
        //游戏属性
        this.CARD_TEST = true;
        this.LOGIC_MASK_VALUE                   = 0x0F;                         //数值掩码
        this.LOGIC_MASK_COLOR                   = 0xF0;                         //花色掩码
        this.KIND_ID                            = 50000;
        this.GAME_PLAYER                        = 4;					        //游戏人数
        this.MAX_COUNT                          = 27;					        //最大数目
        this.MYSELF_VIEW_ID                     = 0;
        this.FULL_COUNT                         = 108;                          //最大牌

        
        this.GAME_TYPE_ROUND_5				=0x00010000						//16 打4局
        this.GAME_TYPE_ROUND_8				=0x00020000						//17 打8局

        this.GAME_TYPE_SCORE_1				=0x00000002						//1  底分1分
        this.GAME_TYPE_SCORE_2				=0x00000004						//2  底分2分
        this.GAME_TYPE_SCORE_3				=0x00000008						//3  底分3分

        this.GAME_TYPE_SCORE_5				=0x00000800						//11  底分5分
        this.GAME_TYPE_SCORE_10				=0x00001000						//12  底分10分
        this.GAME_TYPE_SCORE_20				=0x00002000						//13  底分20分
        this.GAME_TYPE_SCORE_30				=0x00004000						//14  底分30分

        this.GAME_TYPE_FENGDING_8			=0x00040000						//18  8封顶
        this.GAME_TYPE_FENGDING_16			=0x00080000						//19  16封顶
        this.GAME_TYPE_FENGDING_32			=0x00100000						//20  32封顶
        this.GAME_TYPE_SIX_GOD				=0x00200000						//21  六王



        this.GAME_TYPE_RULES_2				=0x00000010						//4  癞子等于2
        this.GAME_TYPE_RULES_3				=0x00000020						//5  癞子等于3

        this.GAME_TYPE_OPTION				=0x00000040						//6  先跑可看队友牌

        this.GAME_TYPE_OPTION_1				=0x00000080						//7  强制定位
        this.GAME_TYPE_OPTION_2				=0x00000100						//8  同IP限制
        this.GAME_TYPE_OPTION_3				=0x00000200						//9  禁用表情
        this.GAME_TYPE_OPTION_4				=0x00000400						//10  发言移除打字



        //状态定义
        this.GAME_STATUS_FREE               = 0;					        //等待开始
        this.GAME_STATUS_PLAY               = 100;					        //游戏进行
        this.GAME_STATUS_DIPAI              = 111;
        this.GAME_STATUS_CHAOPAI            = 112;
        this.GAME_SCENT_ALONE               = 110;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义

        this.SUB_S_SEND_SECONDS                         = 100;  //倒计时
        this.SUB_S_GAME_START                           = 101;	//游戏开始
        this.SUB_S_SHOW_ALONE                           = 102;  //玩家独牌
        this.SUB_S_SEND_CARD                            = 103;  //发牌
        this.SUB_S_DIVEDEGROUP                          = 104;  //显示伙伴
        this.SUB_S_SHOWDIRECTION                        = 105;  //显示方向
        this.SUB_S_SHOWCARDOPERATOR                     = 106;  //发送出牌
        this.SUB_S_SENDHINTMESSAGE                      = 107;  //出牌不合规矩
        this.SUB_S_CLEANSHOWCARD                        = 108;  //清空牌堆
        this.SUB_S_SHOW_CARD                            = 109;  //出牌
        this.SUB_S_UPDATEAWARD                          = 110;  //更新奖分
        this.SUB_S_CONTROLLIGHT                         = 111;  //更新奖分
        this.SUB_S_GAME_END                             = 112;							   //游戏结束
        this.SUB_S_HINK_CARD                            = 113;          //提示
        this.SUB_S_GETROOMENDDATA                       = 133;
        this.SUB_S_LIGHTWINSEQUE                        = 115;  //胜利标识
        this.SUB_S_LOOKTEAMCARD                         = 116;  //看队友牌
        this.SUB_S_SHOWCHICKCARD                        = 117;  //显示鸡牌
        this.SUB_S_TRUSTEE					            = 118;	//玩家托管
        ///////////////////////////////////////////////////////////////////////////////

        this.SUB_C_CHOOSEALONE                                = 10;    //独牌选择
        this.SUB_C_SHOWCARDDATA                               = 11;    //出牌
        this.SUB_C_CLICKHINTBUTTON                            = 12;    //点击提示
        this.SUB_C_CLICKPASSBUTTON                            = 13;    //点击不要
        this.SUB_C_CLICKLOOKTEAMCARD                          = 14;    //看隊友牌
        this.SUB_C_TRUSTEE					                  = 15;		//玩家托管

    },

    //////////////////////////////////////////////////////////////////////////////

    
    //发送秒数
    CMD_S_SECONDS: function () {
        var Obj = new Object();
        //Obj._name = "CMD_S_SECONDS"
        Obj.cbSeconds = 0;
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
    //游戏开始
    CMD_S_GameStart: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameStart";
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.wCurrentBanker = INVALID_CHAIR;
        return Obj;
    },
    //发送秒数
    CMD_S_MESSAGE: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_MESSAGE"
        Obj.wChair = INVALID_CHAIR;
        Obj.cbValue = 0;
        Obj.block = 0;
        return Obj;
    },
    //发牌
    CMD_S_SendCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_SendCard"
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.wChairID = INVALID_CHAIR;
        Obj.cbcount = 0;
        Obj.cbChicken = 0;
        Obj.cbAlonecardstate = 0;
        Obj.cbPokerData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.cbPokerData[i] = new Array(this.MAX_COUNT);
        }
        return Obj;
    },

    //分伙
    CMD_S_DivideGroup: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_DivideGroup"
        Obj.bDivideGroup = new Array(this.GAME_PLAYER);
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //出牌
    CMD_S_ShowCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ShowCard"
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.cbCount = 0;
        Obj.wChair = 0;
        Obj.cbRecarddata = new Array(this.MAX_COUNT);
        Obj.cbRecount = 0;
        Obj.cbCardtype = 0;
        Obj.cbSoundtype = 0;
        Obj.wFriend = 0;
        Obj.bLook = 0;
        Obj.cbchicken = 0;
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay: function () {
        var Obj = new Object();
        Obj._name = 'CMD_S_StatusPlay'
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.cbCardCount = new Array(this.GAME_PLAYER);
        Obj.wCurrentUser = INVALID_CHAIR;
        Obj.wBanker = 0;
        Obj.bPublicGroup=0;
        Obj.bDivideGroup = new Array(this.GAME_PLAYER);
        Obj.bAlonecardstate=0;
        Obj.bAlonecard=0;
        Obj.cbShowCard = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.cbShowCard[i] = new Array(this.MAX_COUNT);
        }
        Obj.cbShowCount = new Array(this.GAME_PLAYER);
        Obj.bArrayPassState = new Array(this.GAME_PLAYER);
        Obj.bShowFriendButton=0;
        Obj.cbTrustee =new Array(this.GAME_PLAYER);
        return Obj;
        
    },

    //提示数据
    CMD_S_HintCardData: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_HintCardData"
        Obj.cbHintCard = new Array(this.MAX_COUNT);
        return Obj;
    },

    //更新奖分
    CMD_S_UpdataAward: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UpdataAward"
        Obj.llArrayawardScore = new Array(this.GAME_PLAYER);
        Obj.llArratAddScore = new Array(this.GAME_PLAYER);
        Obj.wChair = INVALID_CHAIR;
        return Obj;
    },


    /////////////////////////////////////////////////////////////////
    //点击选择
    CMD_C_CHOOSE: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_CHOOSE";
        Obj.cbCodeValue = 0;
        return Obj;
    },

    //点击出牌
    CMD_C_ShowCardData: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_ShowCardData"
        Obj.cbCardData = new Array(this.MAX_COUNT);
        Obj.cbCount = 0;
        return Obj;
    },

    //空闲状态
    CMD_S_StatusFree: function () {
        var Obj = new Object();
        Obj._name = 'CMD_S_StatusFree'
        return Obj;
    },
    //游戏结束
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameEnd"
        //积分变量
        Obj.llGameScore = new Array(this.GAME_PLAYER); 
        Obj.llAwardScore = new Array(this.GAME_PLAYER); 
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.cbCardData[i] = new Array(this.MAX_COUNT);
        }
        Obj.cbCardCount = new Array(this.GAME_PLAYER); 
        Obj.wArraywinSeque = new Array(this.GAME_PLAYER); 
        Obj.cbGameEndType = 0; 
        Obj.bDivideGroup = new Array(this.GAME_PLAYER); 
        return Obj;
    },
    
    //大结算
    CMD_S_GameCustomInfo: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameCustomInfo"
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//总积分
        Obj.llSumWinScore = new Array(this.GAME_PLAYER);
        Obj.llSumLoseScore = new Array(this.GAME_PLAYER);
        Obj.cbWinCount = new Array(this.GAME_PLAYER);
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);
        return Obj;
    },

    ///////////////////////////////////////////////////////////////////////////
    GetRulesStr:function(m_dwServerRules,rules){ 
        var str = "";
        if (m_dwServerRules & this.GAME_TYPE_ROUND_5) str+=' 4局';
        if (m_dwServerRules & this.GAME_TYPE_ROUND_8) str+=' 8局';

        if (rules[0] & this.GAME_TYPE_SCORE_1) str+=' 1分';
        if (rules[0] & this.GAME_TYPE_SCORE_2) str+=' 2分';
        if (rules[0] & this.GAME_TYPE_SCORE_3) str+=' 3分';
        if (rules[0] & this.GAME_TYPE_SCORE_5) str+=' 5分';
        if (rules[0] & this.GAME_TYPE_SCORE_10) str+=' 10分';
        if (rules[0] & this.GAME_TYPE_SCORE_20) str+=' 20分';
        if (rules[0] & this.GAME_TYPE_SCORE_30) str+=' 30分';
    

        // if (rules[0] & this.GAME_TYPE_RULES_2) str+=' 癞子等于2';
        // if (rules[0] & this.GAME_TYPE_RULES_3) str+=' 癞子等于3';

        if (rules[0] & this.GAME_TYPE_OPTION) str+=' 先跑可看队友牌';
        if (rules[0] & this.GAME_TYPE_OPTION_1) str+=' 强制定位';
        if (rules[0] & this.GAME_TYPE_OPTION_2) str+=' 同IP限制';
        if (rules[0] & this.GAME_TYPE_OPTION_3) str+=' 禁用表情快捷语';
        if (rules[0] & this.GAME_TYPE_OPTION_4) str+=' 发言移除打字';

        if (rules[0] & this.GAME_TYPE_FENGDING_8) str+=' 8分封顶';
        if (rules[0] & this.GAME_TYPE_FENGDING_16) str+=' 16分封顶';
        if (rules[0] & this.GAME_TYPE_FENGDING_32) str+=' 32分封顶';
        if (rules[0] & this.GAME_TYPE_SIX_DOG) str+=' 六王';
    
        return str;
    },

    GetBaseScore: function (rules) {
        if (rules & this.GAME_TYPE_SCORE_1) return 1;
        if (rules & this.GAME_TYPE_SCORE_2) return 2;
        if (rules & this.GAME_TYPE_SCORE_3) return 3;
        if (rules & this.GAME_TYPE_SCORE_5) return 5;
        if (rules & this.GAME_TYPE_SCORE_10) return 10;
        if (rules & this.GAME_TYPE_SCORE_20) return 20;
        if (rules & this.GAME_TYPE_SCORE_30) return 30;
        return 1;
    },
    GetBaseScoreStr: function (dwServerRules,rules) {
        if (rules[0] & this.GAME_TYPE_SCORE_1) return 1;
        if (rules[0] & this.GAME_TYPE_SCORE_2) return 2;
        if (rules[0] & this.GAME_TYPE_SCORE_3) return 3;
        if (rules[0] & this.GAME_TYPE_SCORE_5) return 5;
        if (rules[0] & this.GAME_TYPE_SCORE_10) return 10;
        if (rules[0] & this.GAME_TYPE_SCORE_20) return 20;
        if (rules[0] & this.GAME_TYPE_SCORE_30) return 30;

        return 1;
    },


    //获取数值
    GetCardValue: function (card) {
        return card & this.LOGIC_MASK_VALUE;
    },

    //获取花色
    GetCardColor: function (card) {
        return card & this.LOGIC_MASK_COLOR;
    },

    GetPlayerCount: function (rules) {
        return this.GAME_PLAYER;
    },

    GetProgress: function (wProgress, rules) {
        if (wProgress > 0) {
            return '第' + wProgress + '局';
        } else {
            return '';
        }
    },
    GetGameCount: function (rules) {
        var cnt = 0;
        if (rules & this.GAME_TYPE_ROUND_5) cnt = 4;
        if (rules & this.GAME_TYPE_ROUND_8) cnt = 8;
        return cnt;
    },


    GetClubStr: function (rules) {

        var water = cc.sys.localStorage.getItem("StaWater");
        var rules = cc.sys.localStorage.getItem("StaRules");
        var score = cc.sys.localStorage.getItem("StaScore");
        var str = " 抽水:" + water + "%" + " 入场限制:" + rules + " 抢庄限制:" + score;
        return str;
    },

    IsNoCheat: function (rules) {
        return true;
        return (rules & this.GAME_TYPE_GPS);
    },
    //游戏模式
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },

});

GameDef = null;




//////////////////////////////////////////////////////////////////////////////////