//CMD_Game.js
CMD_GAME_10020 = new cc.Class({ //window.
    ctor:function  () {
        this.GAME_TEST = true;
        this.CARD_TEST = true;
       //游戏属性
        this.KIND_ID                    =               10020;
        this.GAME_PLAYER                =				6;					//游戏人数
        this.MAX_COUNT                  =				3;					//最大数目
        this.MYSELF_VIEW_ID             =               2;
        
        this.CARD_WIGTH                 =               143;
        this.CARD_HEIGHT                =               201;
        this.FULL_COUNT                 =               165;

        this.GAME_TYPE_ROUND_1			= 0x01000000								//打6局
        this.GAME_TYPE_ROUND_2			= 0x02000000								//打12局
        this.GAME_TYPE_ROUND_3			= 0x04000000							//打18局


        this.GAME_TYPE_BASE_1		    = 0x00000008							//
        this.GAME_TYPE_BASE_2			= 0x00000010							//
        this.GAME_TYPE_BASE_3			= 0x00000020							// 5
        this.GAME_TYPE_BASE_4			= 0x00000040							//
        this.GAME_TYPE_BASE_5			= 0x00000080							//
    

        
        this.GAME_TYPE_REVENUE_1		=	0x00001000							//
        this.GAME_TYPE_REVENUE_2		=	0x00002000							//
        this.GAME_TYPE_REVENUE_3		=	0x00004000							//

        this.GAME_TYPE_AUTO_START		= 0x00008000							//满4人自动开始

        this.GAME_TYPE_XI_BAOZI1		=	0x00010000							//豹子喜分
        this.GAME_TYPE_XI_BAOZI2		=	0x00020000							//
        this.GAME_TYPE_XI_BAOZI3		=	0x00040000							//

        this.GAME_TYPE_XI_SHUNJIN1		=0x00080000							//顺金喜分
        this.GAME_TYPE_XI_SHUNJIN2		=0x00100000							//
        this.GAME_TYPE_XI_SHUNJIN3		=0x00200000							//
        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GAME_STATUS_FREE		=       		0;					//等待开始
        this.GAME_STATUS_PLAY		=       		100;					//游戏进行

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义

        this.SUB_S_GAME_START	    =           100;					//游戏开始
        this.SUB_S_ADD_SCORE		=	        101;					//用户出牌
        this.SUB_S_GIVE_UP		    =	        102;					//用户放弃
        this.SUB_S_GAME_END		    =	        103;					//游戏结束
        this.SUB_S_COMPARE_CARD		=	        104;					//用户叫分
        this.SUB_S_LOOK_CARD        =           105;                    //用户加倍
        this.SUB_S_NEXT_READY		=	        106;					//庄家信息
        this.SUB_S_COMPARE_FINISH	=		    107;					//比牌跟注
        this.SUB_S_START_CTRL		=		    108;					//控制开始
        this.SUB_S_USER_READY		=		    109;					//控制开始			
        this.SUB_S_SEND_CARD		=			110;	
        this.SUB_S_CHOOSE_PIAO      =           111;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_ADD_SCORE		=       		1;					//用户下注
        this.SUB_C_GIVE_UP		    =		        2;					//用户放弃
        this.SUB_C_COMPARE_CARD	    =       		3;					//用户比牌
        this.SUB_C_LOOK_CARD		=		        4;					//用户看牌
        this.SUB_C_START			=			    5;					//控制开始
        this.SUB_C_READY			=			    6;					//准备
        this.SUB_C_CHOOSE_PIAO      =               7;
    },

    CMD_S_PIAO:function(){
        var Obj = new Object();
        Obj.wChairID = 0;
        return Obj; 		

    },

    CMD_S_SENDCARD:function(){
        var Obj = new Object();
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);           //玩家状态
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);  		 //手上扑克
        for(var i = 0; i < this.GAME_PLAYER; i++){
            Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        }
        Obj.wFirstUser = 0;
        Obj.cbPiao = 0;
        Obj.cbDice = 0;

        return Obj; 		

    },
    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							//基础积分
        Obj.dwCountDown = 0;
        return Obj; 		
    },

        //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusPlay'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.llCurrentAddScore = 0;						                //当前倍数
        Obj.wTurnIndex = 0;
        Obj.wFirstUser = 0;

        Obj.wBankerUser = 0;   						                //庄家用户
        Obj.wCurrentUser = 0;  						                //当前玩家

        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);           //玩家状态
        Obj.cbGiveUpUser = new Array(this.GAME_PLAYER);           //是否放弃
        Obj.bMingZhu = new Array(this.GAME_PLAYER);               //是否看牌
        Obj.llTableScore = new Array(this.GAME_PLAYER);			 //下注分数
        Obj.dwCountDown = 0;
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);  		 //手上扑克
        for(var i = 0; i < this.GAME_PLAYER; i++){
            Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        }
        Obj.cbCnt = 0;
        Obj.llAddScore = 0;
        Obj.bIsAdd = 0;

        Obj.bIsPiao = 0;
        return Obj; 		
    },


    //发送扑克
    CMD_S_GameStart :function () {	 
        var Obj = new Object();   	
        //Obj._name="CMD_S_GameStart"
        Obj.llBaseScore = 0;						//基础积分
        Obj.wBankerUser = 0;						//庄家用户
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);  		 //手上扑克
        for(var i = 0; i < this.GAME_PLAYER; i++){
            Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        }
        Obj.llUserScore = new Array(this.GAME_PLAYER);
        Obj.llAddScoreCount = 0;                    //下注数目

        return Obj; 		
    },

    //用户叫分
    CMD_S_AddScore :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_AddScore"
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.wAddScoreUser = 0;    					//下注玩家
        Obj.llAddScoreCount = 0;                    //下注数目
        Obj.llCurrentAddScore = 0;       			//当前下注 
        Obj.llUserScore = 0;
        Obj.wTurnIndex = 0;                         //当前手数
        Obj.bIsAdd = 0;
        Obj.cbOpType = 0;
        return Obj; 		 
    },

    //放弃出牌
    CMD_S_GiveUp :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GiveUp"			
        Obj.wGiveUpUser = 0;     					//放弃玩家
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.llCurrentAddScore = 0;       				//跟住倍数
        Obj.wTurnIndex = 0;                         //当前手数
        return Obj; 		
    },
    //用户比牌
    CMD_S_CompareCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_CompareCard"			
        Obj.wCompareUser = new Array(2);      		//比牌玩家
        Obj.wLostUser = 0;       				    //失败玩家
        return Obj; 		
    },
    //用户比牌
    CMD_S_CompareFinish :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_CompareFinish"			
        Obj.wCurrentUser = 0;    					//当前玩家
        Obj.wTurnIndex = 0;
        return Obj; 		
    },
    //看牌数据
    CMD_S_LookCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_LookCard"			
        Obj.wLookCardUser = 0;		                    //当前玩家
        Obj.cbCardData = new Array(this.MAX_COUNT);	//扑克列表
        return Obj; 		
    },


    //游戏结束
    CMD_S_GameEnd :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameEnd"		
        //积分变量
        Obj.llGameScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardValue = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardType = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardData = new Array(this.GAME_PLAYER*this.MAX_COUNT);      		    //扑克列表
        return Obj; 						        
    },
     //准备状态
    CMD_S_ReadyState :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_ReadyState"			
        Obj.cbReadyStatus = new Array(this.GAME_PLAYER);  		 //手上扑克    			
        return Obj; 		
    },
    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameCustomInfo"		
        Obj.lMaxScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.lMinScore = new Array(this.GAME_PLAYER);         		//扑克数目
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);      		    //扑克列表
        Obj.cbWinCount = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.lTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目 
        return Obj;        						        
    },
        //用户叫分
    CMD_C_CallScore :function(){ 
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.llAddScore = 0;
        return Obj;
    },
    //比牌数据包
    CMD_C_CompareCard :function(){ 
        var Obj = new Object();
       // Obj._name="CMD_C_CompareCard"		
        Obj.wCompareUser = 0;	
        return Obj;
    },
    CMD_C_Piao:function(){
        var Obj = new Object();
        Obj.bIsPiao = 0;
        return Obj;
    },


///////////////////////////////////////////////////////////
    GetPlayerCount:function(ServerRules, RulesArr){return 6;},

    //游戏模式
    GetGameMode:function(ServerRules, RulesArr){
        var str='翻三皮';
        return str;
    },
    //游戏模式
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    GetBaseScore: function(ServerRules, RulesArr){
        var score=1;
        // if(RulesArr & this.GAME_TYPE_BASE_1) score=1;
        // if(RulesArr & this.GAME_TYPE_BASE_2) score=2;
        if(RulesArr[0] & this.GAME_TYPE_BASE_3) score=3;
        else if(RulesArr[0] & this.GAME_TYPE_BASE_4) score=10;
        else if(RulesArr[0] & this.GAME_TYPE_BASE_5) score=5;

        return score;
    },
    GetBaseScoreStr: function(ServerRules, RulesArr){
        return this.GetBaseScore(ServerRules, RulesArr)
    },
    GetProgress:function(wProgress, ServerRules, RulesArr){ 
        var cnt=this.GetGameCount(ServerRules);
        if(wProgress >= 0 && cnt > 0){
            return '第'+ wProgress+'/'+ cnt+'局';
        }else{
            return '';
        }
    },
    SetProgress:function(wProgress,ServerRules){ 
        var cnt=this.GetGameCount(ServerRules);

        if(wProgress > 0){
            return wProgress+'/'+cnt;
        }else{
            return '';
        }
    },
    GetGameCount:function(dwServerRules,dwRulesArr){
        var cnt=0;
        if(dwServerRules & this.GAME_TYPE_ROUND_1) cnt = 8;
        if(dwServerRules & this.GAME_TYPE_ROUND_2) cnt = 16;
        if(dwServerRules & this.GAME_TYPE_ROUND_3) cnt = 24;

        return cnt;
    },
    GetRulesStr:function(dwServerRules,dwRulesArr){ 
        var str = "";


        return str;
    },
    IsNoCheat: function (rules) { return true; },

    IsShowCardTag: function (dwRulesArr) {
        return (0 != (this.GAME_TYPE_XI_SHUNJIN1 & dwRulesArr[0]));
    },
});


GameDef = null;




//////////////////////////////////////////////////////////////////////////////////