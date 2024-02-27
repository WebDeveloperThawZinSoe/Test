//CMD_Game.js
CMD_GAME_62016 = new cc.Class({ //window.
    ctor:function  () {
       //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID                    =               62016;
        this.GAME_PLAYER                =				5;					//游戏人数
        this.MAX_COUNT                  =				3;					//最大数目
        this.MYSELF_VIEW_ID             =               2;
        this.MAX_ADD_KIND               =               4;
        this.MAX_CARD_KIND              =               3;
        
        this.CARD_WIGTH                 =               143;
        this.CARD_HEIGHT                =               201;

        this.RuleValue0                 = 0x00000001,
        this.RuleValue1                 = 0x00000002,
        this.RuleValue2                 = 0x00000004,
        this.RuleValue3                 = 0x00000008,
        this.RuleValue4                 = 0x00000010,
        this.RuleValue5                 = 0x00000020,
        this.RuleValue6                 = 0x00000040,
        this.RuleValue7                 = 0x00000080,
        this.RuleValue8                 = 0x00000100,
        this.RuleValue9                 = 0x00000200,
        this.RuleValue10                = 0x00000400,
        this.RuleValue11                = 0x00000800,
        this.RuleValue12                = 0x00001000,
        this.RuleValue13                = 0x00002000,
        this.RuleValue14                = 0x00004000,
        this.RuleValue15                = 0x00008000,
        this.RuleValue16                = 0x00010000,
        this.RuleValue17                = 0x00020000,
        this.RuleValue18                = 0x00040000,
        this.RuleValue19                = 0x00080000,
        this.RuleValue20                = 0x00100000,
        this.RuleValue21                = 0x00200000,
        this.RuleValue22                = 0x00400000,
        this.RuleValue23                = 0x00800000,
        this.RuleValue24                = 0x01000000,
        this.RuleValue25                = 0x02000000,
        this.RuleValue26                = 0x04000000,
        this.RuleValue27                = 0x08000000,
        this.RuleValue28                = 0x10000000,
        this.RuleValue29                = 0x20000000,
        this.RuleValue30                = 0x40000000,
        this.RuleValue31                = 0x80000000,

        this.GAME_TYPE_ROUND_1			= (this.RuleValue18)							//打8局
        this.GAME_TYPE_ROUND_2			= (this.RuleValue19)							//打20局
        this.GAME_TYPE_ROUND_3		    = (this.RuleValue20)							//打32局	
        
        // this.GAME_TYPE_AA				= 0x00000001							    //AA支付
        // this.GAME_TYPE_FANGZU			= 0x00000002							    //房主支付
        
        this.GAME_TYPE_LUN_30			= (this.RuleValue0)							    //30轮 
        this.GAME_TYPE_LUN_40			= (this.RuleValue1)							    //40轮 
        this.GAME_TYPE_LUN_50			= (this.RuleValue2)							    //50轮		
        
        this.GAME_TYPE_1T_NOL			= (this.RuleValue3)							    //闷0圈
        this.GAME_TYPE_2T_NOL			= (this.RuleValue4)							    //闷1圈
        this.GAME_TYPE_5T_NOL			= (this.RuleValue5)							    //闷2圈
        
        this.GAME_TYPE_BOTTOM_1			= (this.RuleValue6)							    //底分1
        this.GAME_TYPE_BOTTOM_2			= (this.RuleValue7)							    //底分2
        this.GAME_TYPE_BOTTOM_3			= (this.RuleValue8)							    //底分3
        
        this.GAME_TYPE_DOUBLECOMPARE	= (this.RuleValue9)							    //双倍比牌
        this.GAME_TYPE_GIVEUP_NO		= (this.RuleValue10)							//超时弃牌否

        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GAME_STATUS_FREE		=       		0;					    //等待开始
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
        this.SUB_S_GUZHUYIZHI		=   		110;				    //孤注一掷

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_ADD_SCORE		=       		1;					//用户下注
        this.SUB_C_GIVE_UP		    =		        2;					//用户放弃
        this.SUB_C_COMPARE_CARD	    =       		3;					//用户比牌
        this.SUB_C_LOOK_CARD		=		        4;					//用户看牌
        this.SUB_C_START			=			    5;					//控制开始
        this.SUB_C_READY			=			    6;					//准备

    },

    CMD_AddScoreInfo:function(){
        var Obj = new Object();
        Obj.llCanAddScore = new Array(this.MAX_ADD_KIND);				//可下注分数
        Obj.cbFllowIndex = 0;							                //跟注索引
        return Obj;
    },
    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							        //基础积分
        Obj.dwCountDown = 0;
        return Obj; 		
    },
 
        //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusPlay'
        //游戏变量
        Obj.llBaseScore = 0;							            //基础积分
        Obj.wTurnIndex = 0;
        Obj.wFirstUser = 0;

        Obj.wBankerUser = 0;   						                //庄家用户
        Obj.wCurrentUser = 0;  						                //当前玩家

        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);           //玩家状态
        Obj.cbGiveUpUser = new Array(this.GAME_PLAYER);           //是否放弃
        Obj.bMingZhu = new Array(this.GAME_PLAYER);               //是否看牌
        Obj.llTableScore = new Array(this.GAME_PLAYER);			 //下注分数
        Obj.dwCountDown = 0;
        Obj.cbHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        Obj.cbCardData = new Array(this.MAX_COUNT);  		 //扑克列表
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbCardData[i] = new Array(this.MAX_COUNT);//扑克列表
        Obj.bIsGen = 0; 
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        Obj.bServerType = 0;	
        Obj.AddScoreInfo = this.CMD_AddScoreInfo();
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
        Obj.dwRules = 0;
        Obj.cbCardData = new Array(this.GAME_PLAYER);			
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbCardData[i] = new Array(this.MAX_COUNT);//扑克列表
        Obj.bIsGen = 0;
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        Obj.bServerType = 0;							
        Obj.AddScoreInfo = this.CMD_AddScoreInfo();
        return Obj; 		
    },

    //用户叫分
    CMD_S_AddScore :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_AddScore"
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.wAddScoreUser = 0;    					//下注玩家
        Obj.llAddScoreCount = 0;                    //下注数目
        Obj.wTurnIndex = 0;                         //当前手数
        Obj.bIsGen = 0; 
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        Obj.AddScoreInfo = this.CMD_AddScoreInfo();
        return Obj; 		 
    },

    //放弃出牌
    CMD_S_GiveUp :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GiveUp"			
        Obj.wGiveUpUser = 0;     					//放弃玩家
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.wTurnIndex = 0;                         //当前手数
        Obj.bIsGen = 0;   
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        Obj.AddScoreInfo = this.CMD_AddScoreInfo();
        return Obj; 		
    },
    //用户比牌
    CMD_S_CompareCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_CompareCard"			
        Obj.wCompareUser = new Array(2);      		//比牌玩家
        Obj.wLostUser = 0;       				    //失败玩家
        Obj.cbCardData = new Array(this.GAME_PLAYER);			
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbCardData[i] = new Array(this.MAX_COUNT);//扑克列表
        Obj.cbCardType = new Array(2);      		
        return Obj; 		
    },
    //用户比牌
    CMD_S_CompareFinish :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_CompareFinish"			
        Obj.wCurrentUser = 0;    					//当前玩家
        Obj.wTurnIndex = 0;
        Obj.bIsGen = 0; 
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        Obj.AddScoreInfo = this.CMD_AddScoreInfo();
        return Obj; 		
    },
    //看牌数据
    CMD_S_LookCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_LookCard"			
        Obj.wLookCardUser = 0;		                    //当前玩家
        Obj.cbCardData = new Array(this.MAX_COUNT);	//扑克列表
        Obj.bIsGen = 0;   
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);     	//下注数目
        return Obj; 		
    },

    //孤注一掷
    CMD_S_GuZhuYiZhi:function(){
        var Obj = new Object();
        Obj.wChairID = 0;							//孤注一掷用户
        Obj.wCurrentUser = 0;						//当前用户
        Obj.bWin = 0;								//赢没
        return Obj; 
    },



    //游戏结束
    CMD_S_GameEnd :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_GameEnd"		
        //积分变量
        Obj.llGameScore = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.byCardType = new Array(this.GAME_PLAYER);          		//游戏积分
        Obj.cbCardData = new Array(this.GAME_PLAYER*this.MAX_COUNT);      		    //扑克列表
        Obj.bCompareRelation= new Array(this.GAME_PLAYER);
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.bCompareRelation[i] = new Array(this.GAME_PLAYER);//比牌关系
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


///////////////////////////////////////////////////////////
    
    //游戏模式
    GetPayMode:function(dwServerRules,dwRulesArr){
        if( dwServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    GetGameLunShu:function(dwServerRules , dwRulesArr)
    {
        if (dwRulesArr[0] & this.GAME_TYPE_LUN_30) {
            return 30;
        }
        if (dwRulesArr[0] & this.GAME_TYPE_LUN_40) {
            return 40;
        }
        return 50;
    },

    GetGameBiMen:function(dwServerRules , dwRulesArr)
    {
        if (dwRulesArr[0] & this.GAME_TYPE_1T_NOL) {
            return 0;
        }
        if (dwRulesArr[0] & this.GAME_TYPE_2T_NOL) {
            return 1;
        }
        return 2;
    },

    GetPlayerCount:function(wProgress, rules){return this.GAME_PLAYER;},

    GetProgress:function(wProgress, dwServerRules , dwRulesArr){ 
        var cnt=this.GetGameCount(dwServerRules , dwRulesArr);
        if(wProgress >= 0 && cnt > 0){
            return '第'+ wProgress+'/'+ cnt+'局';
        }else{
            return '';
        }
    },
    GetBiMen:function(dwServerRules , dwRulesArr){ 
        var str = "";
        if(dwRulesArr[0] & this.GAME_TYPE_1T_NOL) str += " 必闷: 0圈";
        if(dwRulesArr[0] & this.GAME_TYPE_2T_NOL) str += " 必闷: 1圈";
        if(dwRulesArr[0] & this.GAME_TYPE_5T_NOL) str += " 必闷: 2圈";
        return str;
    },
    GetGameCount:function(dwServerRules , dwRulesArr){
        var cnt=0;
        if(dwServerRules & this.GAME_TYPE_ROUND_1) cnt = 8;
        if(dwServerRules & this.GAME_TYPE_ROUND_2) cnt = 16;
        if(dwServerRules & this.GAME_TYPE_ROUND_3) cnt = 32;
        return cnt;
    },
    GetRulesStr:function(dwServerRules , dwRulesArr){ 
        var str = "";
        str += this.GetGameCount(dwServerRules , dwRulesArr)+"局, ";
        str += this.GetGameLunShu(dwServerRules , dwRulesArr)+"轮, ";
        str += "闷"+this.GetGameBiMen(dwServerRules , dwRulesArr)+"圈, ";
        str += this.GetBaseScore(dwServerRules , dwRulesArr)+"底分, ";
   
        if(dwRulesArr[0] & this.GAME_TYPE_GIVEUP_NO) str += " 超时不弃牌";
        if(dwRulesArr[0] & this.GAME_TYPE_DOUBLECOMPARE) str += "双倍比牌,";


        return str;
    },
    GetBaseScore:function(dwServerRules , dwRulesArr){
        if(dwRulesArr[0] & this.GAME_TYPE_BOTTOM_1) return 1;
        if(dwRulesArr[0] & this.GAME_TYPE_BOTTOM_2)  return 2;
        if(dwRulesArr[0] & this.GAME_TYPE_BOTTOM_3)  return 3;
        return 1;
    },
    GetBaseScoreStr:function(dwServerRules,dwRulesArray){
        return this.GetBaseScore(dwServerRules,dwRulesArray);
    },
    IsNoCheat:function(){
        return true;
    },
});


GameDef = null;




//////////////////////////////////////////////////////////////////////////////////