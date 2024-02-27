//CMD_Game.js
CMD_GAME_33301 = new cc.Class({ //window.
    ctor:function  () {
       //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID						= 33301;						//
        this.GAME_PLAYER					= 3;							//游戏人数
        this.MAX_COUNT						= 16;							//最大数目
        this.FULL_COUNT						= 48;							//全牌数目
        this.MYSELF_VIEW_ID					= 1;							//自己视图ID
        this.BACK_COUNT						= 3;							//
        this.NORMAL_COUNT					= 16;							//常规数目
        this.REDTHREE					    = 3									//红桃3


        //逻辑类型
        this.CT_ERROR						= 0;							//错误类型
        this.CT_SINGLE						= 1;							//单牌类型
        this.CT_DOUBLE						= 2;							//对牌类型
        this.CT_THREE						= 3;							//三条类型
        this.CT_SINGLE_LINE					= 4;							//单连类型
        this.CT_DOUBLE_LINE					= 5;							//对连类型
        this.CT_THREE_LINE					= 6;							//三连类型
        this.CT_THREE_TAKE_ONE				= 7;							//三带一单
        this.CT_THREE_TAKE_DOUBLE			= 8;							//三带一对
        this.CT_FOUR_TAKE_ONE				= 9;							//四带两单
        this.CT_FOUR_TAKE_TWO				= 10;							//四带两对
        this.CT_BOMB_CARD					= 11;							//炸弹类型
        this.CT_MISSILE_CARD				= 12;							//火箭类型
        this.CT_AIRPLANE_ONE				= 13;							//飞机带单
        this.CT_AIRPLANE_TWO				= 14;							//飞机带对

        this.CT_THREE_TAKE_2				= 15;							//三带二单
        this.CT_THREE_TAKE_DOUBLE_2			= 16;							//三带二对

        this.CT_TIANZHA			= 17;							            //天炸类型

////////////////////////////////////////////////////////////////////////// ServerRules 
        this.GAME_TYPE_ROUND_1						=0x00000800							//打8局				11
        this.GAME_TYPE_ROUND_2						=0x00001000							//打16局			12
        this.GAME_TYPE_PLAYNUMBER_2					=0x00002000							//2人				13
        this.GAME_TYPE_PLAYNUMBER_3					=0x00004000							//3人				14
        ////////////////////////////////////////////////////////////////////////// RULES 0
        this.GAME_TYPE_DKBCDA						=0x00000010							//单K必出单A	    4
        this.GAME_TYPE_FJKDD						=0x00000020							//飞机不可带对		5
        this.GAME_TYPE_K2KZD						=0x00000040							//可2可炸弹			6
        this.GAME_TYPE_DKBXCDA						=0x00000080							//对K必须出对A		7
        this.GAME_TYPE_SD2							=0x00000100							//四带二			8
        this.GAME_TYPE_DP							=0x00000200							//带牌				9
        this.GAME_TYPE_DP2							=0x00000400							//带牌2				10
        this.GAME_TYPE_BDSF							=0x00000800							//报单算分			11
        this.GAME_TYPE_RUSE_BAOSHUANG				=0x00001000							//下家报双不可出对	12
        this.GAME_TYPE_AKBC2						=0x00002000							//A可不出2			13
        this.GAME_TYPE_KSBD							=0x00008000							//可三不带			15
        this.GAME_TYPE_XZB							=0x00010000							//需准备			16
        this.GAME_TYPE_Y2KBZ						=0x00020000							//遇2可不炸			17
        this.GAME_TYPE_SKDA							=0x00040000							//三可带A			18

        this.GAME_TYPE_ZHADAN						=0x00080000							//炸弹算分			19
        this.GAME_TYPE_ZHADAN_5						=0x00100000							//炸弹5分			20
        this.GAME_TYPE_TIANZHA						=0x00200000							//天炸算分			21
        this.GAME_TYPE_TIANZHA_10					=0x00400000							//天炸10分			22
        this.GAME_TYPE_KEKONGZHA					=0x00800000							//可空炸			23
        this.GAME_TYPE_KONGZHASUANFEN					=0x01000000							//空炸算分			24


        //////////////////////////////////////////////////////////////////////////////////
        //状态定义

        this.GAME_SCENE_FREE				= 0;							//等待开始
        this.GAME_SCENE_PLAY				= 100;							//游戏进行

  

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_S_GAME_START				= 101;							//游戏开始
        this.SUB_S_OUT_CARD					= 102;							//用户出牌
        this.SUB_S_PASS_CARD				= 103;							//用户放弃
        this.SUB_S_GAME_END					= 104;							//游戏结束
        this.SUB_S_LAND_SCORE				= 105;							//用户叫分
        this.SUB_S_USER_DOUBLE				= 106;							//用户加倍
        this.SUB_S_GAME_BANKER				= 107;							//庄家信息
        this.SUB_S_GAME_OUTCARD				= 108;							//庄家信息  
        this.SUB_S_GAME_TRUSTEE_OUTCARD		= 109;							//托管出牌
        this.SUB_S_TRUSTEESHIP              = 111;                          //托管
        this.SUB_C_TRUSTEESHIP			    = 112;							//用户托管
        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_OUT_CART					= 1;							//用户出牌
        this.SUB_C_PASS_CARD				= 2;							//用户放弃
        this.SUB_C_CALL_SCORE				= 3;							//用户叫分
        this.SUB_C_DOUBLE					= 4;							//用户加倍
    

    },


    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							//基础积分
        Obj.byBankerMode = 0;                          //地主模式
        Obj.dwCountDown = 0;
        Obj.bUserTrustee = new Array(this.GAME_PLAYER);			//玩家托管

        return Obj;
    },
    IsCanDiss:function(rules)
    {
        //return (rules & this.GAME_TYPE_CAN_DISS);
        return true;
    },

        //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusPlay'
        //游戏变量
        Obj.llBaseScore = 0;							        //基础积分
        Obj.byBankerMode = 0;						            //0：123分  1：叫/抢地主
        Obj.cbBombCount = 0;   						        //炸弹次数

        Obj.wBankerUser = 0;   						        //庄家用户
        Obj.cbBankerScore = 0; 						        //庄家叫分
        Obj.wCurrentUser = 0;  						        //当前玩家
        Obj.cbDouble = new Array(this.GAME_PLAYER);                 //玩家加倍

        //扑克信息
        Obj.cbBankerCard = new Array(this.BACK_COUNT);				//游戏底牌
        Obj.cbHandCardData = new Array(this.MAX_COUNT);  			//手上扑克
        Obj.cbHandCardCount = new Array(this.GAME_PLAYER);     		//扑克数目

        //出牌信息
        Obj.wTurnWiner = 0;							        //胜利玩家
        Obj.cbTurnCardCount = 0;   					        //出牌数目
        Obj.cbTurnCardData = new Array(this.MAX_COUNT);  	        //出牌数据
        Obj.dwCountDown = 0;
        Obj.bUserTrustee = new Array(this.GAME_PLAYER);			//玩家托管
        return Obj;
    },
        //房间数据
        tagRoomStatus :function() {
            var Obj = new Object();
            //Obj._name='tagRoomStatus';
            Obj.llBaseScore = 0;
            //Obj.dwGameRule= 0;
            Obj.lTotalScore = new Array(this.GAME_PLAYER);
            Obj.wBankerUser = INVALID_CHAIR;
            return Obj;
        },
    //发送扑克
    CMD_S_GameStart :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameStart"				        //开始玩家
        Obj.llBaseScore = 0;							//基础积分
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.cbCardData = new Array(this.NORMAL_COUNT);	    //扑克列表
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //扑克列表
        return Obj;
    },

    //庄家信息
    CMD_S_BankerInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_BankerInfo"
        Obj.wBankerUser = 0;       					//庄家玩家
        Obj.cbBankerScore = 0;     					//庄家叫分
        Obj.cbBankerCard = new Array(3);   				//庄家扑克
        return Obj;
    },


    //用户叫分
    CMD_S_CallScore :function () {
        var Obj = new Object();
        Obj._name="CMD_S_CallScore"
        Obj.wCallScoreUser = 0;    					//叫分玩家
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.cbUserCallScore = 0;       				//上次叫分
        Obj.cbCurrentScore = 0;    					//当前叫分
        return Obj;
    },

    //用户叫分
    CMD_S_Double :function () {
        var Obj = new Object();
        Obj._name="CMD_S_Double"
        Obj.wCallUser = 0;    					//加倍用户 无效值时表示进入加倍场景
        Obj.bDouble = 0;       				    //是否加倍
        Obj.wNextCallUser = 0;    				//轮到庄踢
        Obj.cbDouble = new Array(this.GAME_PLAYER);	//玩家加倍
        return Obj;
    },

    //用户出牌
    CMD_S_OutCard :function () {
        var Obj = new Object();
      //  Obj._name="CMD_S_OutCard"
        Obj.byLeftCount = 0;		                    //剩余张数
        Obj.cbCardCount = 0;		        			//出牌数目
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.wOutCardUser = 0;      					//出牌玩家
        Obj.cbCardData = null;      	                //扑克列表

        return Obj;
    },
    CMD_S_SENIOR_SET:function()
    {
        var Obj = new Object();
        Obj._name="CMD_S_SENIOR_SET";
        Obj.cbIntoScore = 0;
        Obj.cbOutScore = 0;
        Obj.cbTuoGuanTime = 0;
        Obj.cbBottomScore = 0;
        return Obj;	
    },
    //托管
    CMD_S_Trusteeship:function()
    {
        var Obj = new Object();
        Obj._name="CMD_S_Trusteeship";
        Obj.wChairID = 0;	//托管玩家
        
        return Obj;					
    },
    //放弃出牌
    CMD_S_PassCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_PassCard"
        Obj.cbTurnOver = 0;    						//一轮结束
        Obj.wPassCardUser = 0;     					//放弃玩家
        Obj.wCurrentUser = 0;      					//当前玩家
        return Obj;
    },

    //游戏结束
    CMD_S_GameConclude :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameConclude"
        //积分变量
        Obj.lGameScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardCount = new Array(this.GAME_PLAYER);         		//扑克数目
        Obj.cbCardData = new Array(this.FULL_COUNT);      		    //扑克列表    
        Obj.dwUserID = new Array(this.GAME_PLAYER);
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++)
            Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        return Obj;
    },
    //自动出牌
    CMD_S_TrusteeshipOutCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_TrusteeshipOutCard"
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.cbCardCount = 0;      					//当前玩家
        return Obj;
    },


    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"
        Obj.lMaxScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.bBombCount = new Array(this.GAME_PLAYER);         		//扑克数目
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);      		    //扑克列表
        Obj.cbWinCount = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.lTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目
        return Obj;
    },

      //搜索结果
    tagSearchCardResult :function(){
        var Obj = new Object();
        Obj.cbSearchCount = 0					//扑克数目
        Obj.cbCardCount = new Array();					//扑克数目
        Obj.cbResultCard = new Array();			            //扑克数据
        for(var i=0;i<20;i++){
            Obj.cbResultCard[i] = new Array();
        }
        return Obj;
    },


    CMD_C_UserTrusteeship :function(){
        var Obj = new Object();
        Obj._name="CMD_C_UserTrusteeship"
        Obj.wTrusteeshipUser = 0;						    //托管
        return Obj;
    },

    //用户出牌
    CMD_C_OutCard :function(){
        var Obj = new Object();
       // Obj._name="CMD_C_OutCard"
        Obj.cbCardCount = 0					//扑克数目
        Obj.cbCardData = new Array();					//扑克数目
        Obj.bIsUserAction = 0;
        return Obj;
    },
    //
    CMD_C_PASS_CARD :function(){
        var Obj = new Object();
       // Obj._name="CMD_C_PASS_CARD"
        Obj.bIsUserAction = 0;
        return Obj;
    },
    GetProgress:function(wProgress, dwServerRules,rules){ 
        var cnt = this.GetGameCount(dwServerRules,rules);
        if (wProgress > 0 && cnt > 0) {
            return '第' + wProgress + '/' + cnt + '局';
        } else {
            return '';
        }
    },
    GetPlayerCount:function(dwServerRules)
    {
        if(dwServerRules & this.GAME_TYPE_PLAYNUMBER_2)  return 2;
        return 3;
    },

    GameMaxPlayerCount:function(rules){
        return 3;
    },
    IsNoVoice:function(rules)
    {
        return false;
    },
    setRule:function( dwRule ){
        this.m_dwGameRule = dwRule;
        // this.GAME_PLAYER = this.GetPlayerCount();
    },
    GetGameCount:function(dwServerRules,rules){
        var cnt=0;
        if(dwServerRules & this.GAME_TYPE_ROUND_1) cnt = 8;
        if(dwServerRules & this.GAME_TYPE_ROUND_2) cnt = 16;
      
        return cnt;
    },

    GetRulesStr:function(dwServerRules,rules){
        var str = this.GetGameCount(dwServerRules,rules)+"局";
  
        if(dwServerRules & this.GAME_TYPE_PLAYNUMBER_2) str += " 2人";
        if(dwServerRules & this.GAME_TYPE_PLAYNUMBER_3) str += " 3人";
        if(dwServerRules & SERVER_RULES_AA)
        {
            str += " AA支付";
        } else
        {
            str += " 房主支付";
        }
        if(rules[0] & this.GAME_TYPE_DKBCDA) str += " 单K必出单A";
        if(rules[0] & this.GAME_TYPE_FJKDD) str += " 飞机不可带对";
        if(rules[0] & this.GAME_TYPE_K2KZD) str += " 可2可炸弹";
        if(rules[0] & this.GAME_TYPE_DKBXCDA) str += " 对K必须出对A";
        if(rules[0] & this.GAME_TYPE_SD2) str += " 四带二";
        if(rules[0] & this.GAME_TYPE_DP) str += " 带牌";
        if(rules[0] & this.GAME_TYPE_DP2) str += " 带牌2";
        if(rules[0] & this.GAME_TYPE_BDSF) str += " 报单算分";
        if(rules[0] & this.GAME_TYPE_RUSE_BAOSHUANG) str += " 下家报双不可出对";
        if(rules[0] & this.GAME_TYPE_AKBC2) str += " A可不出2";
        if(rules[0] & this.GAME_TYPE_KSBD) str += " 可三不带";
        if(rules[0] & this.GAME_TYPE_XZB) str += " 需准备";
        if(rules[0] & this.GAME_TYPE_Y2KBZ) str += " 遇2可不炸";
        if(rules[0] & this.GAME_TYPE_SKDA) str += " 三可带A";
        if(rules[0] & this.GAME_TYPE_ZHADAN)
        {
            str += " 炸弹算分";
            if(rules[0] & this.GAME_TYPE_ZHADAN_5)
            {
                str += " 炸弹5分";
            }else
            {
                str += " 炸弹10分";
            } 
        } 
        if(rules[0] & this.GAME_TYPE_TIANZHA)
        {
            str += " 天炸算分";
            if(rules[0] & this.GAME_TYPE_TIANZHA_10)
            {
                str += " 天炸10分";
            }
            else
            {
                str += " 天炸20分";
            } 
        }
        if(rules[0] & this.GAME_TYPE_KEKONGZHA) str += " 可空炸";
        if(rules[0] & this.GAME_TYPE_KONGZHASUANFEN) str += " 空炸算分";
        return str;
    },

    GetBaseScore: function(ServerRules, RulesArr){
        var str = ""; 
        str += (RulesArr[3]/100);
        return str;
    },
    GetGameSprite:function(ServerRules, RulesArr){
        var str='zhuomazi';
        return str;
    },
    //游戏模式
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    IsNoCheat:function(rules){
        return true;
    },
});


GameDef = null;




//////////////////////////////////////////////////////////////////////////////////