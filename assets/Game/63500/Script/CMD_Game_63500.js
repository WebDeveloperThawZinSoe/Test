CMD_GAME_63500 = new cc.Class({
    ctor:function() {
        this.CARD_TEST = true;

        //游戏属性
        this.KIND_ID                    =               63500;
        this.GAME_PLAYER                =				8;					//游戏人数
        this.MAX_COUNT                  =				2;					//最大数目
        this.MYSELF_VIEW_ID             =               2;

        this.MAX_JETTON                 =               100;
        //////////////////////////////////////////////////////////////////////////////////

		this.CT_SINGLE					=   1									//单牌类型
        this.CT_ONE_LONG				=   2									//对子类型
        this.CT_TWO_LONG				=   3									//两对类型
        this.CT_THREE_TIAO				=   4									//三条类型
        this.CT_SHUN_ZI					=   5									//顺子类型
        this.CT_TONG_HUA				=   6									//同花类型
        this.CT_HU_LU					=   7									//葫芦类型
        this.CT_TIE_ZHI					=   8									//铁支类型
        this.CT_TONG_HUA_SHUN			=   9									//同花顺型
        this.CT_KING_TONG_HUA_SHUN		=   10									//皇家同花顺

        //////////////////////////////////////////////////////////////////////////////////
        // 游戏规则
    
        this.GAME_TYPE_ROUND_0			=	0x00010000		//16
        this.GAME_TYPE_ROUND_1			=	0x00020000		//17
        this.GAME_TYPE_ROUND_2			=	0x00040000		//18
        this.GAME_TYPE_ROUND_3			=	0x00080000		//19
        this.GAME_TYPE_ROUND_4			=	0x00100000		//20
        this.GAME_TYPE_PLAYER_0			=	0x00000004		//2		1-2

        this.GAME_TYPE_SCORE_0			=	0x00000008		//3			1-2
        this.GAME_TYPE_SCORE_1			=	0x00000010		//4			2-4
        this.GAME_TYPE_SCORE_2			=	0x00000020		//5			5-10
        this.GAME_TYPE_SCORE_3			=	0x00000040		//6			10-20
        this.GAME_TYPE_SCORE_4			=	0x00000080		//7			20-40
        this.GAME_TYPE_SCORE_5			=	0x00000100		//8			50-100

        this.GAME_TYPE_TIME_0			=	0x00000200		//9			15
        this.GAME_TYPE_TIME_1			=	0x00000400		//10		30
        this.GAME_TYPE_TIME_2			=	0x00000800		//11		50
        this.GAME_TYPE_TIME_3			=	0x00001000		//12		70
        //////////////////////////////////////////////////////////////////////////
        //状态定义
        this.GAME_SCENE_FREE		=       		0;					    //等待开始
        this.GAME_SCENE_PLAY		=       		100;					//游戏进行

        //////////////////////////////////////////////////////////////////////////////////
        //动作定义
		this.ACTION_NULL       = 0x0000;
		//以下四种动作作为掩码
		this.ACTION_ADD_SCORE  = 0x0001;
		this.ACTION_FOLLOW     = 0x0002;
		this.ACTION_KICK_ONE   = 0x0004;
		this.ACTION_KICK_TWO   = 0x0008;
		//以下动作不作为掩码
		this.ACTION_KICK_PASS  = 0x0010;
		this.ACTION_GIVEUP     = 0x0020;
        this.ACTION_LOOK_CARD  = 0x0040;

        //////////////////////////////////////////////////////////////////////////////////

        this.CARD_WIGTH             =               174;
        this.CARD_HEIGHT            =               236;

        //////////////////////////////////////////////////////////////////////////////////
        //命令定义
        
        
        this.SUB_S_GAME_START		=101									//游戏开始
        this.SUB_S_ADD_SCORE		=102									//加注结果
        this.SUB_S_GIVE_UP			=103									//放弃跟注	
        this.SUB_S_SEND_CARD		=104									//发牌消息
        this.SUB_S_GAME_END			=105									//游戏结束
        this.SUB_S_LAST_GAME        =106
		//////////////////////////////////////////////////////////////////////////
		//客户端命令
		this.SUB_C_ADD_SCORE = 1;							//用户下注
		this.SUB_C_GIVEUP    = 2;							//用户弃牌
		this.SUB_C_OPEN_CARD = 3;							
        this.SUB_C_LAST_GAME = 4;
        
        this.g_GameEngine                   = null;
    },

	//////////////////////////////////////////////////////////////////////////////////
	//服务端消息结构

    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusFree'
        Obj.wCountDown = 0;

        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusPlay'
        
        Obj.llTurnMaxScore = 0;
        Obj.llTurnLessScore = 0;
        Obj.llFollowScore = 0;
        Obj.llTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);

        Obj.llCenterScore = 0;
        Obj.wCurrentUser = 0;						//当前玩家

        Obj.wMinChipInUser = 0;						//小盲注玩家	
        Obj.wMaxChipInUser = 0;						//大盲注玩家
        Obj.wBankerUser = 0;						//庄家

        Obj.cbPlayStatus = new Array(this.GAME_PLAYER);
        Obj.cbCenterCardData = new Array(5);
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);
        for(var i =0; i < this.GAME_PLAYER;i++){
            Obj.cbHandCardData[i] = new Array(2);
        }
        Obj.wOperaCount = 0;
        Obj.wCountDown = 0;
        Obj.bGiveUp = new Array();
        for(var i =0; i < this.GAME_PLAYER;i++){
            Obj.bGiveUp[i] = 0;
        }
        Obj.bIsGuoPai = false;

        return Obj;
    },

    //游戏开始
    CMD_S_GameStart :function () {
        var Obj = new Object();
        Obj._name='CMD_S_GameStart'
        Obj.wCurrentUser = 0;						//当前玩家
        Obj.wMinChipInUser = 0;						//小盲注玩家	
        Obj.wMaxChipInUser = 0;						//大盲注玩家	
        Obj.wBankerUser = 0;						//庄家
        Obj.llTurnMaxScore = 0;			//最大下注
        Obj.llTurnLessScore = 0;			//最小下注
        Obj.llFollowScore = 0;

        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.llCenterScore = 0;
        Obj.cbHandCardData = new Array(this.GAME_PLAYER);
        for(var i =0; i < this.GAME_PLAYER;i++){
            Obj.cbHandCardData[i] = new Array(2);
        }
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);


        return Obj;
    },

    CMD_S_GiveUp:function(){
        var Obj = new Object();

        Obj.wGiveUpUser = 0;						//放弃用户
        return Obj;

    },

    CMD_S_SendCard:function(){
        var Obj = new Object();
        Obj.wCurrentUser = 0;
        Obj.cbSendCardCount = 0;
        Obj.llTableScore = 0;
        Obj.cbCenterCardData = new Array(5);
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        Obj.cbType = 0;
        Obj.llScore = 0;
        return Obj;

    },
    //游戏结束
    CMD_S_GameEnd :function () {
        var Obj = new Object();
        Obj._name='CMD_S_GameEnd'
        Obj.llGameScore = new Array(this.GAME_PLAYER);
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for(var i =0; i < this.GAME_PLAYER;i++){
            Obj.cbCardData[i] = new Array(2);
        }
        Obj.cbLastCenterCardData = new Array(this.GAME_PLAYER);
        for(var i =0; i < this.GAME_PLAYER;i++){
            Obj.cbLastCenterCardData[i] = new Array(5);
        }
        Obj.llTableScore = 0;
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        Obj.bShow = false;
        Obj.cbCenterCardData = new Array(5);
        Obj.cbEndCardKind = new Array(this.GAME_PLAYER);
        return Obj;
    },

    CMD_S_AddScore:function()
    {
        var Obj = new Object();

        Obj.wCurrentUser = 0;						//当前用户
        Obj.wAddScoreUser = 0;						//加注用户
        Obj.llAddScoreCount = 0;						//加注数目
        Obj.llTableScore = 0;
        Obj.llUserTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalScore = new Array(this.GAME_PLAYER);

        Obj.bIsGuoPai = 0;
        Obj.cbType = 0;
        return Obj;

    },
    //游戏开牌
    CMD_S_OpenCard :function () {
        var Obj = new Object();
        Obj._name='CMD_S_OpenCard'
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.MAX_COUNT; i++){
            Obj.cbCardData[i] = new Array(this.MAX_COUNT)
        }
		Obj.cbCardCount = new Array(this.GAME_PLAYER);
		Obj.cbCardType = new Array(this.GAME_PLAYER);
		Obj.dwCardPoint = new Array(this.GAME_PLAYER);
        Obj.wMaxUser = INVALID_CHAIR;							//最大玩家

        return Obj;
    },


    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目
        return Obj;
    },


    //大结算
    CMD_S_LastGame :function () {
        var Obj = new Object();
        Obj._name="CMD_S_LastGame"
        Obj.cbLastCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++){
            Obj.cbLastCardData[i] = new Array(5);
        }
        Obj.wLastUserID = new Array(this.GAME_PLAYER);
        Obj.bLastGiveUp = new Array(this.GAME_PLAYER);

        return Obj;
    },




	//////////////////////////////////////////////////////////////////////////////////
	//客户端消息结构

	//用户动作
    CMD_C_UserAction :function () {
        var Obj = new Object();
        Obj._name='CMD_C_UserAction'
		Obj.wMultiple = 0;
        return Obj;
    },
    CMD_C_AddScore:function(){
        var Obj = new Object();
        Obj.llScore = 0;
        Obj.cbType = 0;
        return Obj;

    },

    GetProgress:function(wProgress,  dwServerRules,dwRulesArr){
        var cnt=this.GetGameCount( dwServerRules,dwRulesArr);
        return '第'+ wProgress+'/'+ cnt+'局';
    },

    setRule:function( dwRule ){
        this.m_dwGameRule = dwRule;
        // this.GAME_PLAYER = this.GetPlayerCount();
    },

    GetPlayerCount:function(dwServerRules,rules){
        if(rules[0] & this.GAME_TYPE_PLAYER_0) return 8;
        return 6;
    },

    GetGameCount:function(dwServerRules,dwRulesArr){
        var cnt=10;
        if(dwServerRules & this.GAME_TYPE_ROUND_0) cnt=6;
        if(dwServerRules & this.GAME_TYPE_ROUND_1) cnt=8;

        return cnt;
    },
  
    GetRulesStr:function(dwServerRules,dwRulesArr){
        var str = '';

        if (dwServerRules & this.GAME_TYPE_ROUND_0)           str += ' 6局';
        if (dwServerRules & this.GAME_TYPE_ROUND_1)           str += ' 8局';
        if (dwServerRules & this.GAME_TYPE_ROUND_2)           str += ' 10局';

        str += ' 小盲：'+this.GetSmallGold(dwRulesArr[0]);
        str += ' 大盲：'+this.GetBigGold(dwRulesArr);
        str += ' 押注时间：'+this.GetTime(dwRulesArr[0]);

        
        return str;
    },

    GetSmallGold:function(dwRulesArr){

        if(dwRulesArr & this.GAME_TYPE_SCORE_0) return 1;
        if(dwRulesArr & this.GAME_TYPE_SCORE_1) return 2;
        if(dwRulesArr & this.GAME_TYPE_SCORE_2) return 5;
        if(dwRulesArr & this.GAME_TYPE_SCORE_3) return 10;
        if(dwRulesArr & this.GAME_TYPE_SCORE_4) return 20;
        if(dwRulesArr & this.GAME_TYPE_SCORE_5) return 50;
    },
    GetBigGold:function(dwRulesArr){

        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_0) return 2;
        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_1) return 4;
        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_2) return 10;
        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_3) return 20;
        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_4) return 100;
        if(dwRulesArr[0] & this.GAME_TYPE_SCORE_5) return 200;
    },

    GetTime:function(dwRulesArr){
        if(dwRulesArr & this.GAME_TYPE_TIME_0) return 15;
        if(dwRulesArr & this.GAME_TYPE_TIME_1) return 30;
        if(dwRulesArr & this.GAME_TYPE_TIME_2) return 50;
        if(dwRulesArr & this.GAME_TYPE_TIME_3) return 70;
        
    },

    IsNoCheat:function(dwGameRule){
        return true;
    },
    IsNoVoice:function(rules)
    {
        return true;
    },
   
});

GameDef = null;

