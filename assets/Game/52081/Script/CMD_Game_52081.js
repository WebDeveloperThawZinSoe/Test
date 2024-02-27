//CMD_Game.js
CMD_GAME_52081 = new cc.Class({ //window.
    ctor:function  () {
        this.CARD_TEST = true;
       //游戏属性
        this.KIND_ID                    =               52081;
        this.GAME_PLAYER                =				8;					//游戏人数
        this.MAX_COUNT                  =				4;					//最大数目
        this.FULL_COUNT					=	            32;
        this.MYSELF_VIEW_ID             =               2;
        this.CARD_WIGTH                 =               177;
        this.CARD_HEIGHT                =               236;

        this.GAME_TYPE_PLAYER_8				=0x00080000

        this.GAME_TYPE_BET_2				=0x00000002							//2dao	1
        this.GAME_TYPE_BET_3				=0x00000004							//3道	2




        this.GAME_TYPE_DI_0				=0x00000008					//60				3							
        this.GAME_TYPE_DI_1				=0x00000010					//80	4
        this.GAME_TYPE_DI_2				=0x00000020					//100	5
        this.GAME_TYPE_DI_3				=0x00000040					//150		6
        this.GAME_TYPE_DI_4				=0x00000080					//200		7



        this.GAME_TYPE_MIN_BET_0			=0x00000100					//10	8
        this.GAME_TYPE_MIN_BET_1			=0x00000200					//20	9
        this.GAME_TYPE_MIN_BET_2			=0x00000400					//30	10
        this.GAME_TYPE_MIN_BET_3			=0x00000800					//50	11
        this.GAME_TYPE_MIN_BET_4			=0x00001000					//100	12
        this.GAME_TYPE_MIN_BET_5			=0x00100000					//60	20
        this.GAME_TYPE_MIN_BET_6			=0x00200000					//70	21




        this.GAME_TYPE_BIG_CARD				=0x00002000							//大牌九		13
        this.GAME_TYPE_SMALL_CARD			=0x00004000							//小牌九		14

        this.GAME_TYPE_BOOM				=0x00008000					//炸弹			15
        this.GAME_TYPE_LAND_MOM			=0x00010000					//地久娘娘			16
        this.GAME_TYPE_GHOST			=0x00020000					//鬼子			17
        this.GAME_TYPE_KING				=0x00040000					//天王			18


        this.GAME_TYPE_All_DAO				=0x00080000					//多道			19

        this.GAME_TYPE_GMAE_PLAYER_4		=0x00080000					//4



        this.GAME_TYPE_BANKER_0				=0x00400000					//抢庄			22
        this.GAME_TYPE_BANKER_1				=0x00800000					//轮庄			23



        this.GAME_TYPE_SUI_GUO					=0x02000000					//60秒开牌			25
        this.GAME_TYPE_BET				=0x04000000					//离线下注			26
        this.GAME_TYPE_TOU_FULL				=0x08000000					//头局下满			27
        this.GAME_TYPE_CUO_PAI              =0x10000000
        
        //////////////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GS_TK_FREE		    =       		0;					//等待开始					//游戏进行
        this.GS_TK_PLAYING		=       		100;					//游戏进行

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_S_GAME_START	    =           100;					//游戏开始
        this.SUB_S_DI_GUO   		=	        101;					//
        this.SUB_S_CALL_BANKER		=	        102;					//选庄
        this.SUB_S_ADD_SCORE	    =	        103;                    //下注
        this.SUB_S_SEND_CARD		=	        104;					//发牌
        this.SUB_S_OPEN_CARD		=	        105;					//开牌
        this.SUB_S_USER_TIMES		=       	106;					//加注结果
        this.SUB_S_QIEGUO       	=       	107;					//切锅
        this.SUB_S_GAME_END		    =	        108;					//游戏结束
        this.SUB_S_NOTIFY_CARD      =           109;                    //提示
        this.SUB_S_START_CTRL		=		    110;					//控制开始
        this.SUB_S_USER_READY		=		    111;					//控制开始
        this.SUB_S_CHEAT_CARD		=       	112;
        this.SUB_S_LITTLE           =            113;
        this.SUB_S_OPERATE           =            114;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_CALL_BANKER		=       		1;					//选庄
        this.SUB_C_ADD_SCORE		=       		2;					//下注
        this.SUB_C_BANK_CHOOSE      =               3;
        this.SUB_C_OPEN_CARD		=       		4;					//开牌
        this.SUB_C_CONTINUE_BANK	=			    5;					//连庄
        this.SUB_C_GIVEUP_BANK		=		        6;					//下庄
        this.SUB_C_THREE_CHOOSE		=       		8;

        this.SUB_C_TIMES			=			    9;					//倍数
        this.SUB_C_START			=			    10					//控制开始
        this.SUB_C_READY			=			    11;					//准备
        this.SUB_C_NOTIFY_CARD      =               12;
        this.SUB_C_QIEGUO			=		        22;
        this.SUB_C_SCORE			=			    21;

    },


    CMD_S_Little_Result:function()
    {
        var Obj = new Object();

        Obj.cbOperatrStatus = 0;					//操作状态
        Obj.wBankUser = 0;
        Obj.ldiGuo = 0;
        Obj.cbCardPai = new Array(16);
    
    
        Obj.cbALLWinCount = new Array(this.GAME_PLAYER);
        Obj.cbALLLoseCount = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        Obj.cbMaxRank = new Array(this.GAME_PLAYER);

        return Obj; 		
    },
    
    
    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							//基础积分
        Obj.dwCountDown = 0;
        Obj.nNumGame = 0;
        Obj.bIsClub = 0;
        Obj.bIsFirst = 0;

        return Obj; 		
    },
    //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        //Obj._name='CMD_S_StatusPlay'
        //游戏变量
        Obj.wBankerUser = 0;
        Obj.cbenOperaStatus = 0;
        Obj.lDiGuo = 0;
        Obj.bIsOpen = new Array(this.GAME_PLAYER);   
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);          
        Obj.nCount = 0;

        Obj.cbHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbOpenHandCardData = new Array(this.MAX_COUNT);  		 //手上扑克
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbOpenHandCardData[i] = new Array(this.MAX_COUNT);
        Obj.cbRobeTimes = new Array(this.GAME_PLAYER);             	 
        Obj.lBetScore = new Array(this.GAME_PLAYER); 
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.lBetScore[i] = new Array(3);
        
        Obj.lBankChoose = new Array(5);	                      
        Obj.bIsYingFen =0;

        Obj.nAllScore = 0;

        Obj.nNumGame = 0;
        Obj.bIsClub = 0;
        Obj.bIsFirst = 0;


        return Obj; 		
    },
    //发送扑克
    CMD_S_GameStart :function () {	 
        var Obj = new Object();   	
        //Obj._name="CMD_S_GameStart"
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //
        Obj.wBankUser = 0;
        Obj.cbOperatrStatus = 0;
        Obj.ldiGuo = 0;
        Obj.nNumGame = 0;
        Obj.cbCardPai = new Array(16);
        Obj.bIsFirst = 0;
        return Obj; 		
    },

   //用户叫分
   CMD_S_UserCall :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_UserCall"
        Obj.bIsRobeOrTimes = 0;						//true:Robe false:UserTimes
        Obj.cbCurTimes = 0;
        Obj.cbUserTimes = new Array(this.GAME_PLAYER);	    
	    Obj.wBankUser = 0;
	    Obj.wTimesUser = 0;
        Obj.cbOperatrStatus = 0;					//操作状态             
        Obj.ldiGuo = 0;    
        return Obj; 		 
    },

    CMD_S_SendCard :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_UserCall"
        Obj.cbDice = new Array(4);
        Obj.wFirstSendUser = 0;
        Obj.bHandCardData = new Array(this.GAME_PLAYER);	 
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.bHandCardData[i] = new Array(4);
        Obj.cbCardPai = new Array(16);
        return Obj; 		 
    },

    CMD_S_DiGuo:function(){
        var Obj = new Object();
        Obj.lDiGuo = 0;
        Obj.cbOperatrStatus = 0;					//操作状态  
        Obj.lChooseScore = new Array(5);

        return Obj;
    },
    //用户叫分
    CMD_S_BankerUser :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_BankerUser"
        Obj.wBankerUser = 0;      					//当前玩家
        Obj.llTimes = 0;    	
        Obj.byTurn1 = 0;		
        Obj.byTurn2 = 0;	
        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);	    //
        Obj.llMaxCall = new Array(this.GAME_PLAYER);	    //
        return Obj; 		 
    },

    //用户叫分
    CMD_S_Open_Card :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_Open_Card"
        Obj.bIsOpen = 0;
        Obj.wOpenUser = 0;
        Obj.bHandCardData = new Array(this.GAME_PLAYER);	 
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.bHandCardData[i] = new Array(4);
        return Obj; 		 
    },

    CMD_S_AddScore :function () {
        var Obj = new Object();
        //Obj._name="CMD_S_AddScore"
        Obj.wAddUser = 0;  	 
        Obj.nlAddScore = new Array(3); 	
        Obj.cbOperatrStatus = 0;					//操作状态            
        Obj.nAllScore = 0;
        return Obj; 		 
    },

    CMD_S_QIEGUO :function () {
        var Obj = new Object();
        Obj.cbenOperatrStatus = 0;  	 
        Obj.wBankUser = 0; 	
        Obj.ldiGuo = 0;					//操作状态  
        Obj.lChooseScore = new Array(5);
        Obj.bIsYingFen =0;
        Obj.nNumGame = 0;
        Obj.cbCardPai = new Array(16);
        
        return Obj; 		 
    },

    CMD_S_NOTIFY:function(){
        var Obj = new Object();
        Obj.cbMaxCard = new Array(2);
        return Obj; 
    },
    //游戏结束
    CMD_S_GameEnd :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameEnd"		
        //积分变量
        Obj.wWinner = 0;
        Obj.nlGameScore = new Array(this.GAME_PLAYER); //游戏积分
        Obj.lTotalScore = new Array(this.GAME_PLAYER);    
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);	 
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbHandCardData[i] = new Array(4);
        Obj.cbRank = new Array(this.GAME_PLAYER);	 
        for(var i=0;i<this.GAME_PLAYER;i++) Obj.cbRank[i] = new Array(2);
        Obj.cbAni = 0;			//特效
        Obj.ldiGuo = 0;	
        return Obj; 						        
    },
    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"	
        Obj.cbWinCount = new Array(this.GAME_PLAYER);
        Obj.cbLoseCount = new Array(this.GAME_PLAYER);
        Obj.cbALLWinCount = new Array(this.GAME_PLAYER);
        Obj.cbALLLoseCount = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目 
        Obj.cbMaxRank = new Array(this.GAME_PLAYER); 
        return Obj;        						        
    },
     //准备状态
    CMD_S_ReadyState :function () {
        var Obj = new Object();
        Obj._name="CMD_S_ReadyState"			
        Obj.cbReadyStatus = new Array(this.GAME_PLAYER);  		 //手上扑克    			
        return Obj; 		
    },
   
    //用户叫分
    CMD_C_AddScore :function(){ 
        var Obj = new Object();
        Obj._name="CMD_C_AddScore"
        Obj.wChairID = 0;		
        Obj.llAddScore = 0;
        return Obj;
    },
    CMD_C_Time :function(){ 
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.cbTimes = 0;
        return Obj;
    },
    //用户叫分
    CMD_C_CallScore :function(){ 
        var Obj = new Object();
        //Obj._name="CMD_C_CallScore"		
        Obj.lAddScore = new Array(3);
        return Obj;
    },
    CMD_C_OPEN : function(){
        var Obj = new Object();
        Obj.cbMaxCard = new Array(2);
        Obj.cbMinCard = new Array(2);
        return Obj;
    },
    CMD_C_Bank_Choose:function(){
        var Obj = new Object();		
        Obj.lChooseDi = 0;  		 //
        return Obj;
    },
    CMD_C_QieGuo:function(){
        var Obj = new Object();		
        Obj.cbScoreTimes = 0;  		 //
        return Obj;
    },
    
///////////////////////////////////////////////////////////    
    GetPlayerCount:function(dwServerRules, rules){ 
        if(rules[0] & this.GAME_TYPE_GMAE_PLAYER_4)return 4;
        return 8; 
    },
    GetProgress:function(wProgress, rules){ 
        if( wProgress > 0){
            return '第'+wProgress+'局';
        }else{
            return '';
        }
    },
    GetGameCount:function(rules){
        return '';
    },
    
    GetMinBet:function(rules){
        if(rules & this.GAME_TYPE_MIN_BET_0) return 30;
        if(rules & this.GAME_TYPE_MIN_BET_1) return 40;
        if(rules & this.GAME_TYPE_MIN_BET_2) return 50;
        if(rules & this.GAME_TYPE_MIN_BET_3) return 60;
        if(rules & this.GAME_TYPE_MIN_BET_4) return 80;
        if(rules & this.GAME_TYPE_MIN_BET_5) return 100;
        if(rules & this.GAME_TYPE_MIN_BET_6) return 150;

    },
    GetGuoDi:function(rules){
        if(rules & this.GAME_TYPE_DI_0) return 500;
        if(rules & this.GAME_TYPE_DI_1) return 100;
        if(rules & this.GAME_TYPE_DI_2) return 150;
        if(rules & this.GAME_TYPE_DI_3) return 200;
        if(rules & this.GAME_TYPE_DI_4) return 400;

    },

    GetClubRulesStr1:function(rules){
        var str = '';
        if(rules[0] & this.GAME_TYPE_BIG_CARD) str += '大牌九 ';
        if(rules[0] & this.GAME_TYPE_SMALL_CARD) str += '小牌九 ';
        return str;

    },
    
    GetClubRulesStr2:function(rules){
        var str = '';
        if(rules[0] & this.GAME_TYPE_DI_0) str += ' 锅分500 ';
        if(rules[0] & this.GAME_TYPE_DI_1) str += ' 锅分100 ';
        if(rules[0] & this.GAME_TYPE_DI_2) str += ' 锅分150 ';
        if(rules[0] & this.GAME_TYPE_DI_3) str += ' 锅分200 ';
        if(rules[0] & this.GAME_TYPE_DI_4) str += ' 锅分400 ';
        return str;

    },

    GetClubRulesStr3:function(dwServerRules){
        var str = '';
        if(dwServerRules & this.GAME_TYPE_BANKER_1) str += ' 轮庄 ';
        if(dwServerRules & this.GAME_TYPE_BANKER_0) str += ' 抢庄 ';
        return str;

    },

    GetClubRulesSit:function(rules){
       
        if (rules[1] & 0x00000100)
            return 80;
        else if (rules[1] & 0x00000200)
            return 100;
        else if (rules[1] & 0x00000400)
            return 200;
        else if (rules[1] & 0x00000800)
            return 300;
        else if (rules[1] & 0x00001000)
            return 500;
        else if (rules[1] & 0x00002000)
            return 800;
        else if (rules[1] & 0x00004000)
            return 1000;
        else if (rules[1] & 0x00008000)
            return 2000;
       
        return 2000;

    },

    GetRoomRuleStr:function(rules,dwServerRules){ 
        var str = '';
        if(rules[0] & this.GAME_TYPE_BET_2) str += '二道 ';
        if(rules[0] & this.GAME_TYPE_BET_3) str += '三道 ';

        if(rules[0] & this.GAME_TYPE_DI_0) str += '底分：500 ';
        if(rules[0] & this.GAME_TYPE_DI_1) str += '底分：100 ';
        if(rules[0] & this.GAME_TYPE_DI_2) str += '底分：150 ';
        if(rules[0] & this.GAME_TYPE_DI_3) str += '底分：200 ';
        if(rules[0] & this.GAME_TYPE_DI_4) str += '底分：400 ';

        if(rules[0] & this.GAME_TYPE_MIN_BET_0) str += '一道最低下注：30 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_1) str += '一道最低下注：40 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_2) str += '一道最低下注：50 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_3) str += '一道最低下注：60 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_4) str += '一道最低下注：80 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_5) str += '一道最低下注：100 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_6) str += '一道最低下注：150 ';

        if(rules[1] & this.GAME_TYPE_MIN_BET_0) str += '二道最低下注：30 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_1) str += '二道最低下注：40 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_2) str += '二道最低下注：50 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_3) str += '二道最低下注：60 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_4) str += '二道最低下注：80 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_5) str += '二道最低下注：100 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_6) str += '二道最低下注：150 ';
        if(rules[0] & this.GAME_TYPE_BIG_CARD) str += '大牌九 ';
        if(rules[0] & this.GAME_TYPE_SMALL_CARD) str += '小牌九 ';

        if(dwServerRules & this.GAME_TYPE_BANKER_1) str += '轮庄 ';
        if(dwServerRules & this.GAME_TYPE_BANKER_0) str += '抢庄 ';

        if(rules[0] & this.GAME_TYPE_GHOST) str += " 鬼子";
        if(rules[0] & this.GAME_TYPE_BOOM) str += " 炸弹";
        if(rules[0] & this.GAME_TYPE_LAND_MOM) str += " 地九娘娘";
        if(rules[0] & this.GAME_TYPE_KING) str += " 天王九";

        if(rules[0] & this.GAME_TYPE_SUI_GUO) str += " 随锅";
        if(rules[0] & this.GAME_TYPE_BET) str += " 离线下注";
        if(rules[0] & this.GAME_TYPE_TOU_FULL) str += " 头局下满";


        return str;
    },

    GetRulesStr:function(rules,dwServerRules){ 
        var str = '';
        if(rules[0] & this.GAME_TYPE_BET_2) str += '二道 ';
        if(rules[0] & this.GAME_TYPE_BET_3) str += '三道 ';

        if(rules[0] & this.GAME_TYPE_DI_0) str += '底分：500 ';
        if(rules[0] & this.GAME_TYPE_DI_1) str += '底分：100 ';
        if(rules[0] & this.GAME_TYPE_DI_2) str += '底分：150 ';
        if(rules[0] & this.GAME_TYPE_DI_3) str += '底分：200 ';
        if(rules[0] & this.GAME_TYPE_DI_4) str += '底分：400 ';

        if(rules[0] & this.GAME_TYPE_MIN_BET_0) str += '一道最低下注：30 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_1) str += '一道最低下注：40 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_2) str += '一道最低下注：50 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_3) str += '一道最低下注：60 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_4) str += '一道最低下注：80 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_5) str += '一道最低下注：100 ';
        if(rules[0] & this.GAME_TYPE_MIN_BET_6) str += '一道最低下注：150 ';

        if(rules[1] & this.GAME_TYPE_MIN_BET_0) str += '二道最低下注：30 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_1) str += '二道最低下注：40 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_2) str += '二道最低下注：50 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_3) str += '二道最低下注：60 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_4) str += '二道最低下注：80 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_5) str += '二道最低下注：100 ';
        if(rules[1] & this.GAME_TYPE_MIN_BET_6) str += '二道最低下注：150 ';
        if(rules[0] & this.GAME_TYPE_BIG_CARD) str += '大牌九 ';
        if(rules[0] & this.GAME_TYPE_SMALL_CARD) str += '小牌九 ';

        if(dwServerRules & this.GAME_TYPE_BANKER_1) str += '轮庄 ';
        if(dwServerRules & this.GAME_TYPE_BANKER_0) str += '抢庄 ';

        if(rules[0] & this.GAME_TYPE_GHOST) str += " 鬼子";
        if(rules[0] & this.GAME_TYPE_BOOM) str += " 炸弹";
        if(rules[0] & this.GAME_TYPE_LAND_MOM) str += " 地九娘娘";
        if(rules[0] & this.GAME_TYPE_KING) str += " 天王九";

        if(rules[0] & this.GAME_TYPE_SUI_GUO) str += " 随锅";
        if(rules[0] & this.GAME_TYPE_BET) str += " 离线下注";
        if(rules[0] & this.GAME_TYPE_TOU_FULL) str += " 头局下满";


        return str;
    },

    IsDPJ:function(dwRulesArr){
        return dwRulesArr[0] & this.GAME_TYPE_BIG_CARD;

    },

    IsLZ:function(dwServerRules){
        return dwServerRules & this.GAME_TYPE_BANKER_1;

    },

    GetGameMode:function(dwServerRules,dwRulesArr){
        var str='牌九';
        return str;
    },
    GetBaseScoreStr:function(){
        return 0;
    },
    IsNoCheat:function(rules){return true;},
});

GameDef = null;
//////////////////////////////////////////////////////////////////////////////////