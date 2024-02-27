//CMD_Game.js
CMD_GAME_40107 = new cc.Class({ //window.
    ctor:function  () {
       //游戏属性
       this.CARD_TEST = true;
        this.KIND_ID                    =               40107;
        this.GAME_PLAYER                =				3;					//游戏人数
        this.MAX_COUNT                  =				20;					//最大数目
        this.FULL_COUNT                 =				54;					//全牌数目
        this.MYSELF_VIEW_ID             =               1;                  //自己视图ID
        this.BACK_COUNT                 =               3;
        //逻辑数目
        this.NORMAL_COUNT		        =       		17;					//常规数目
        this.CMD_NORMAL_COUNT           =               17;
        this.CMD_MAX_COUNT              =				20;					//最大数目

       
        //逻辑类型
        this.CT_ERROR			    =       		0;					//错误类型
        this.CT_SINGLE			    =       		1;					//单牌类型
        this.CT_DOUBLE			    =       		2;					//对牌类型
        this.CT_THREE			    =       		3;					//三条类型
        this.CT_SINGLE_LINE		    =       		4;					//单连类型
        this.CT_DOUBLE_LINE		    =       		5;					//对连类型
        this.CT_THREE_LINE		    =       		6;					//三连类型
        this.CT_THREE_TAKE_ONE	    =       		7;					//三带一单
        this.CT_THREE_TAKE_TWO	    =       		8;					//三带一对
        this.CT_FOUR_TAKE_ONE	    =       		9;					//四带两单
        this.CT_FOUR_TAKE_TWO	    =       		10;					//四带两对
        this.CT_BOMB_CARD		    =       		11;					//炸弹类型
        this.CT_MISSILE_CARD		=       		12;					//火箭类型
        this.CT_AIRPLANE_ONE		=       		13;					//飞机带单
        this.CT_AIRPLANE_TWO		=       		14;					//飞机带对
        this.CT_SPRING              =               15;
        this.CT_FANSPRING           =               16;

        this.CARD_WIGTH             =               162;
        this.CARD_HEIGHT            =               232;

        this.GAME_TYPE_ROUND_1       	 = 0x00800000							//打8局  服务器规则 23
        this.GAME_TYPE_ROUND_2       	 = 0x01000000							//打16局 服务器规则 24
        this.GAME_TYPE_ROUND_3       	 = 0x02000000							//打24局 服务器规则 25

        this.GAME_TYPE_TRUSTEE_30        = 0x00000001                           //30S托管         0
        this.GAME_TYPE_TRUSTEE_0         = 0x00000002                           //不托管          1

        this.GAME_TYPE_NOSPEAK           = 0x00000004                           //禁言           2

        this.GAME_TYPE_CALL_MODE     	 = 0x00000008							//0:1 2 3  1:叫/抢 3
        this.GAME_TYPE_COMP_CARD     	 = 0x00000010							//比牌确认地主 4
        this.GAME_TYPE_MAX_BOMB_3        = 0x00000020							//3炸封顶 5
        this.GAME_TYPE_MAX_BOMB_4        = 0x00000040							//4炸封顶 6
        this.GAME_TYPE_MAX_BOMB_5        = 0x00000080							//5炸封顶 7
      

        this.GAME_TYPE_GOODCARD_CALL     = 0x00000100							//好牌必叫 8
        this.GAME_TYPE_25_READY          = 0x00000200							//25秒准备 9
        this.GAME_TYPE_90_PASS			 = 0x00000400							//90秒过 10
        this.GAME_TYPE_1_BASE			 = 0x00000800							//底分1 11
        this.GAME_TYPE_ALLVOICE			 = 0x00001000							//实时语音 12
        this.GAME_TYPE_FARMER_KICK		 = 0x00002000							//农民踢 13
        this.GAME_TYPE_ALL_KICK			 = 0x00004000							//全踢踢 14
        this.GAME_TYPE_NONE_KICK		 = 0x00008000							//不带踢 15
        this.GAME_TYPE_NO345		     = 0x00010000							//不带34 16
      
        this.GAME_TYPE_AA				 = 0x00040000							//AA 18
        this.GAME_TYPE_PAY				 = 0x00080000							//房主 19
        this.GAME_TYPE_IP				 = 0x00100000							//IP 20
        this.GAME_TYPE_GPS				 = 0x00200000							//GPS 21
        this.GAME_TYPE_RENSHU_2          = 0x00400000                           //2人 22
        this.GAME_TYPE_RENSHU_3          = 0x00800000                           //3人 23
        this.GAME_TYPE_MAX_BOMB_2        = 0x01000000                           //2炸封顶 24
        this.GAME_TYPE_LETCARD_2         = 0x02000000                           //让2张 25
        this.GAME_TYPE_LETCARD_3         = 0x04000000                           //让3张 26
        this.GAME_TYPE_LETCARD_4         = 0x08000000                           //让4张 27
        this.GAME_TYPE_CALLMAX           = 0x10000000                           //不叫满不能加倍 28
        this.GAME_TYPE_FREECALL          = 0x20000000                           //自由加倍 29
        this.GAME_TYPE_NOCALLNODOUBEL    = 0x40000000                           //不叫不能加倍 30

        this.m_dwGameRule 					= 0;							//创建规则

        
        this.GAME_TYPE_SHOW				 = 0							//明牌 17
    
        //////////////////////////////////////////////////////////////////////////////////
        //状态定义

        this.GAME_SCENE_FREE		=       		0;					//等待开始
        this.GAME_SCENE_PLAY		=       		100;					//游戏进行
        this.GAME_SCENE_CALL		=       		101;					//叫分状态
        this.GAME_SCENE_DOUBLE      =               102;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义

        this.SUB_S_GAME_START	    =           101;					//游戏开始
        this.SUB_S_OUT_CARD			=	        102;					//用户出牌
        this.SUB_S_PASS_CARD		=	        103;					//用户放弃
        this.SUB_S_GAME_END		    =	        104;					//游戏结束

        this.SUB_S_LAND_SCORE		=	        105;					//用户叫分
        this.SUB_S_USER_DOUBLE      =           106;                    //用户加倍
        this.SUB_S_GAME_BANKER		=	        107;					//庄家信息
        this.SUB_S_GAME_OUTCARD		=	        108;					//庄家信息
        this.SUB_S_USER_SHOWCARD	=		    109;					//庄家亮牌
        this.SUB_S_USER_OP_SHOW		=	        110;					//询问庄家是否亮       
        this.SUB_S_USER_LETCARD     =           111;                    //庄家让牌
        this.SUB_S_USER_OP_LET      =           112;                    //询问庄家是否让牌
        this.SUB_S_TRUSTEE          =           115;                  
       

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        this.SUB_C_OUT_CARD		=       		1;					//用户出牌
        this.SUB_C_PASS_CARD	=		        2;					//用户放弃
        this.SUB_C_CALL_SCORE	=       		3;					//用户叫分
        this.SUB_C_DOUBLE		=		        4;					//用户加倍
        this.SUB_C_SHOW_CARD	=               5;					//用户明牌
        this.SUB_C_LET_CARD     =               6;                  //用户让牌
        this.SUB_C_TRUSTEE			=           9;					//玩家托管
    },
    setRule:function( dwRule ){
        this.m_dwGameRule = dwRule;

    },
    GetPlayerCount:function(dwServerRules,dwRules){
        if (dwRules[0] & this.GAME_TYPE_RENSHU_2)
        return 2;
        
    else if (dwRules[0] & this.GAME_TYPE_RENSHU_3)
        return 3;
    else
        return 3;
    },
    GetMaxPlayerCount:function()
    {
        if (this.m_dwGameRule & this.GAME_TYPE_RENSHU_2)
            return 2;
            
        else if (this.m_dwGameRule & this.GAME_TYPE_RENSHU_3)
            return 3;
        else
            return 3;
    },
    // MaxPlayerCount:function(dwRule){
    //     if (dwRule & this.GAME_TYPE_RENSHU_2)
    //     return 2;
        
    // else if (dwRule & this.GAME_TYPE_RENSHU_3)
    //     return 3;
    // else
    //     return 3;
    // },
    GetLetCardCount:function (dwRule){
        if (dwRule & this.GAME_TYPE_LETCARD_2)
        return 2;       
    else if (dwRule & this.GAME_TYPE_LETCARD_3)
        return 3;
    else  (dwRule & this.GAME_TYPE_LETCARD_4)
        return 4;
    
    },
    
    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusFree'
        Obj.llBaseScore = 0;							//基础积分
        Obj.byBankerMode = 0;                          //地主模式
        Obj.dwCountDown = 0;
        return Obj; 		
    },
 
        //叫分状态
    CMD_S_StatusCall:function () {
        var Obj = new Object();
        //时间信息
        Obj._name='CMD_S_StatusCall'
        Obj.llBaseScore = 0;							        //基础积分
        Obj.byBankerMode = 0;						            //0：123分  1：叫/抢地主
        Obj.cbBankerScore = 0;							        //
        Obj.wCurrentUser = 0;						            //当前玩家
        Obj.bLetCount = 0;
        Obj.bScoreInfo = new Array(this.GAME_PLAYER);			    //叫分信息
        
        Obj.bCardData = new Array(this.CMD_NORMAL_COUNT);				//手上扑克 
        Obj.dwCountDown = 0; 
        Obj.bShowOneCard= 0;
        return Obj; 		        
    },
    //叫分状态
    CMD_S_StatusDouble:function () {
        var Obj = new Object();
        //时间信息
        Obj._name='CMD_S_StatusDouble'
        Obj.llBaseScore = 0;							    //基础积分
        Obj.byBankerMode = 0;						        //0：123分  1：叫/抢地主
        Obj.wBankerUser = 0							        //地主玩家
     
        Obj.cbBankerScore = 0;							    //
        Obj.wCurrentUser = 0;						        //当前玩家
        Obj.cbDouble= new Array(this.GAME_PLAYER);				//加倍情况
        Obj.bCardData = new Array(this.CMD_MAX_COUNT);				//手上扑克      
        Obj.bBackCard = new Array(this.BACK_COUNT);				//底牌扑克    
        Obj.bShowStatus = false;
        Obj.bLetStatus = false;
        Obj.dwCountDown = 0;
        Obj.bShowOneCard= 0;
        Obj.bLetCount = 0;
        Obj.bLetCardlTimes = 0;
        return Obj; 		
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
        Obj.bLetCardlTimes = 0;                              //重连用的让牌倍数
        Obj.bLetCount = 0 ;                                  //让牌数
        Obj.cbDouble = new Array(this.GAME_PLAYER);                 //玩家加倍
        
        

        //扑克信息
        Obj.cbBankerCard = new Array(this.BACK_COUNT);				//游戏底牌
        Obj.cbHandCardData = new Array(this.CMD_MAX_COUNT);  			//手上扑克
        Obj.cbHandCardCount = new Array(this.GAME_PLAYER);     		//扑克数目
        Obj.cbBankCard = new Array(this.CMD_MAX_COUNT);
        Obj.bBankShow = false;

        //出牌信息
        Obj.wTurnWiner = 0;							        //胜利玩家
        Obj.cbTurnCardCount = 0;   					        //出牌数目
        Obj.cbTurnCardData = new Array(this.CMD_MAX_COUNT);  	        //出牌数据
        Obj.dwCountDown = 0;
        Obj.bShowOneCard = 0;
        Obj.cbTrustee = new Array(this.GAME_PLAYER);			//玩家托管
        Obj.bDoubelState = 0;
        return Obj; 		
    },

    //发送扑克
    CMD_S_GameStart :function () {	 
        var Obj = new Object();   	
        Obj._name="CMD_S_GameStart"				        //开始玩家
        Obj.llBaseScore = 0;							//基础积分
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.cbCardData = new Array(this.CMD_NORMAL_COUNT);	    //扑克列表
        Obj.bShowOneCard = 0;                       //2人模式亮一张牌先叫地主	
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
        Obj.bLetCardCount = 0;
        return Obj; 		 
    },

    //用户叫分
    CMD_S_Double :function () {
        var Obj = new Object();
        Obj._name="CMD_S_Double"			
        Obj.wCallUser = 0;    					//加倍用户 无效值时表示进入加倍场景
        Obj.bDouble = 0;       				    //是否加倍
        Obj.wNextCallUser = 0;    				//轮到庄踢 
        Obj.cbDouble = new Array(this.GAME_PLAYER);                 //玩家加倍
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

    //用户明牌
    CMD_S_ShowCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_ShowCard"			
        Obj.bCardData = new Array(this.CMD_MAX_COUNT);    		
        Obj.bShow = false;       			
        return Obj; 		
    },
    //用户让牌
    CMD_S_LetCard:function(){
        var Obj = new Object();
        Obj._name="CMD_S_LetCard"	
        Obj.bLet = false;    
        Obj.bLetlTimes = 0;
        Obj.bLetCardCount = 0;		
        return Obj; 				
    },

    //用户出牌
    CMD_S_OutCard :function () {
        var Obj = new Object();
        Obj._name="CMD_S_OutCard"			
        Obj.byLeftCount = 0;		                    //剩余张数
        Obj.cbCardCount = 0;		        			//出牌数目
        Obj.wCurrentUser = 0;      					//当前玩家
        Obj.wOutCardUser = 0;      					//出牌玩家
        Obj.cbCardData = null;      	                //扑克列表
        Obj.cbDouble = new Array(this.GAME_PLAYER);
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
        Obj.bChunTian = 0;                                          //春天标志
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
        //用户叫分
    CMD_C_CallScore :function(){ 
        var Obj = new Object();
        Obj._name="CMD_C_CallScore"		
        Obj.cbCallScore = 0;
        return Obj;
    },
        //用户踢
    CMD_C_UserDouble :function(){ 
        var Obj = new Object();
        Obj._name="CMD_C_UserDouble"		
        Obj.bDouble = 0;						    //是否踢
        return Obj;
    },
    //用户出牌
    CMD_C_OutCard :function(){ 
        var Obj = new Object();
        Obj._name="CMD_C_OutCard"		
        Obj.cbCardCount = 0					//扑克数目
        Obj.cbCardData = new Array();					//扑克数目        
        return Obj;
    },
    //用户明牌
    CMD_C_UserShow :function(){ 
        var Obj = new Object();
        Obj._name="CMD_C_UserShow"		
        Obj.bShow = 0;						    //是否明牌
        return Obj;
    },
    CMD_C_UserLet: function(){
        var Obj = new Object();
        Obj._name="CMD_C_UserLet"
        Obj.bLet = 0;	                        //是否让牌
        return Obj;
    },
    CMD_C_SetCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_C_SetCard";
        Obj.cbCardCount = 0;
        Obj.cbCardData = new Array(this.CMD_MAX_COUNT);
        return Obj;
    },
    GetBaseScore:function(m_dwServerRules, m_dwRules){
        return 1;
    },
    GetPayMode:function(ServerRules, RulesArr){
        if( ServerRules & SERVER_RULES_AA) return 'AA支付';
        return '房主支付';
    },
    GetBaseScoreStr:function(ServerRules, RulesArr){
        return 1;
    },
    GetProgress:function(wProgress, m_dwServerRules,m_dwRules){ 
        var cnt=this.GetGameCount(m_dwServerRules, m_dwRules);
        if(wProgress >= 0 && cnt > 0){
            return '第'+ wProgress+'/'+ cnt+'局';
        }else{
            return '';
        }
    },
    GetGameCount:function(m_dwServerRules, m_dwRules){
        var cnt=0;
        if(m_dwServerRules & this.GAME_TYPE_ROUND_1) cnt = 9;
        if(m_dwServerRules & this.GAME_TYPE_ROUND_2) cnt = 18;
        if(m_dwServerRules & this.GAME_TYPE_ROUND_3) cnt = 27;
        return cnt;
    },
    GetRulesStr:function(m_dwServerRules,m_dwRulesArr){ 
        var rules = m_dwRulesArr[0];
        var str = this.GetGameCount(m_dwServerRules,m_dwRulesArr)+"局";
        // str += ( rules & this.GAME_TYPE_CALL_MODE)?" 叫地主" :" 叫分";
        // if(rules & this.GAME_TYPE_COMP_CARD) str += " 带比牌";
        // if(rules & this.GAME_TYPE_DOUBLE_SCENE) str += " 带踢";
        if (rules & this.GAME_TYPE_AA) str += " AA支付";
        else  str += " 房主支付";

        if (rules & this.GAME_TYPE_ALL_KICK) str += " 农民优先";
        else if (rules & this.GAME_TYPE_FARMER_KICK) str += " 农民踢";
        else if (rules & this.GAME_TYPE_FREECALL) str += " 自由加倍";
        if(rules & this.GAME_TYPE_NOCALLNODOUBEL) str +=' 不叫不能加倍'
        if(rules & this.GAME_TYPE_NONE_KICK) str += " 不加倍";
    
        
        if(rules & this.GAME_TYPE_CALLMAX) str += " 不叫满不能加倍";
        if(rules & this.GAME_TYPE_NO345) str += " 不带34";
        if(rules & this.GAME_TYPE_SHOW) str += " 明牌";
        
        if(rules & this.GAME_TYPE_MAX_BOMB_2) str += " 24分封顶";
        else if(rules & this.GAME_TYPE_MAX_BOMB_3) str += " 48分封顶";
        else if(rules & this.GAME_TYPE_MAX_BOMB_4) str += " 96分封顶";
        else if(rules & this.GAME_TYPE_MAX_BOMB_5)str += " 192分封顶";
        else str += ' 不封顶'
        if(rules & this.GAME_TYPE_RENSHU_2){
        if(rules & this.GAME_TYPE_LETCARD_2)str += " 让2张";
        else if(rules & this.GAME_TYPE_LETCARD_3)str += " 让3张";
        else if(rules & this.GAME_TYPE_LETCARD_4)str += " 让4张";
        else str += ' 不带让牌';
        }
        if(rules & this.GAME_TYPE_TRUSTEE_0) str += " 不托管";
        if(rules & this.GAME_TYPE_TRUSTEE_30) str += " 30秒托管";

        if(rules & this.GAME_TYPE_GOODCARD_CALL) str += " 双王4个二必叫";
        if(rules & this.GAME_TYPE_25_READY) str += " 10秒准备 30秒自动过";
        //if(rules & this.GAME_TYPE_90_PASS) str += " 30秒自动过";
        if(rules & this.GAME_TYPE_1_BASE) str += " 底分1";
        if(rules & this.GAME_TYPE_GPS) str += " GPS";	
        if (rules & this.GAME_TYPE_ALLVOICE) str+=' 实时语音'
        if(rules & this.GAME_TYPE_NOSPEAK) str += ' 禁言'
        return str;
    },

    IsNoCheat:function(m_dwRules){
        return (m_dwRules[0] & this.GAME_TYPE_GPS);
    },
    //实时语音
    IsAllowRealTimeVoice:function(dwServerRules, dwRulesArray){
        return (dwRulesArray[0] & this.GAME_TYPE_ALLVOICE)>0; 
    },
});


GameDef = null;




//////////////////////////////////////////////////////////////////////////////////