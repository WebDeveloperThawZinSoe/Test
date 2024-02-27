CMD_GAME_21050 = new cc.Class({
    ctor:function() {
        //游戏属性
        this.CARD_TEST = true;
        this.KIND_ID                    =               21050;
        this.GAME_PLAYER                =				5;					//游戏人数
        this.MAX_COUNT                  =				5;					//最大数目
        this.MYSELF_VIEW_ID             =               2;

        this.MAX_JETTON                 =               100;
        //////////////////////////////////////////////////////////////////////////////////

		this.CT_NO						= 0x00;									//没有类型
		this.CT_T3						= 0x00;									//三条类型
		this.CT_T3KING					= 0x00;									//三条两王
		this.CT_BAO_ZI					= 0x01;									//豹子类型：i.同花三顺子：三张同花色连续的牌，加任意两张牌
		this.CT_LINE_3					= 0x02;									//同花三顺子=豹子：同花三顺子：三张同花色连续的牌，加任意两张牌
		this.CT_LINE_4					= 0x03;									//同花四顺子：四张同花色连续的牌，加任意一张牌
		this.CT_DOUBLE_BAO				= 0x04;									//双豹子：三张同点数牌，加三张组成的同花顺
		this.CT_T4						= 0x05;									//四条（炸弹）：四张同点数的牌，加任意一张牌
		this.CT_LINE_5					= 0x06;									//同花五顺子（五子）：五张同花色连续的牌
		this.CT_T5						= 0x07;									//五条类型

        //////////////////////////////////////////////////////////////////////////////////
        // 游戏规则
        this.GAME_TYPE_ROUND_0			= 0x00010000;							//打30局		
        this.GAME_TYPE_ROUND_1			= 0x00020000;							//打60局		
    //////////////////////////////////////////////////////////////////////////////////
        this.GAME_TYPE_BANKENG_9		= 0x00000004;							//半坑5人9起	2
        this.GAME_TYPE_BANKENG_10		= 0x00000008;							//半坑5人10起	3
        this.GAME_TYPE_BANKENG_J		= 0x00000010;							//半坑4人J起	4
        this.GAME_TYPE_QUANKENG			= 0x00000020;							//全坑			5
        this.GAME_TYPE_TWO_KING			= 0x00000040;							//双王			6
        this.GAME_TYPE_FOUR_KING		= 0x00000080;							//四小王		7
        
        this.GAME_TYPE_ALWAYS_KICK		= 0x00000100;							//把踢			8
        this.GAME_TYPE_END_KICK			= 0x00000200;							//末踢			9
        
        this.GAME_TYPE_SCORE_1_5		= 0x00000400;                           //底注 1-5      10
        this.GAME_TYPE_SCORE_1_10		= 0x00000800;                           //底注 1-10      11
        
        this.GAME_TYPE_PUBLIC_SUIBAO	= 0x00001000;							//公张随豹		12
        this.GAME_TYPE_PUBLIC_SUIDIAN	= 0x00002000;							//公张随点		13
        
        this.GAME_TYPE_LONG_HU_PAO		= 0x00004000;							//龙虎炮		14
        this.GAME_TYPE_A_PAO			= 0x00008000;                           //抓A必炮      15
        this.GAME_TYPE_LANGUO_DOUBLE	= 0x00010000;							//烂锅翻倍		16
        this.GAME_TYPE_END_INFINITE_KICK= 0x00020000;							//末脚踢服		17
        this.GAME_TYPE_END_SHOW_CARD	= 0x00040000;							//结束亮底		18
        this.GAME_TYPE_DOUBLE_LOOK		= 0x40000000;                   //30    = 0x00080000;							//看牌翻倍		19
        
        
        this.GAME_TYPE_TIME_OUT_TRUSTEE_30	= 0x00100000;						//超时托管30		20
        this.GAME_TYPE_TIME_OUT_TRUSTEE_90	= 0x00200000;						//超时托管90		21
        this.GAME_TYPE_NO_TRUSTEE			= 0x00400000;						//不托管		22
        
        this.GAME_TYPE_IP_LIMIT			= 0x00800000;							//IP限制		23
        this.GAME_TYPE_GPS_CHECK		= 0x01000000;							//GPS预警		24
        this.GAME_TYPE_VOICE_TALK		= 0x02000000;							//语音聊天		25
        //this.GAME_TYPE_NO_TALK			= 0x04000000;							//禁言			26

        
        this.GAME_TYPE_CAN_DISS 		= 0x08000000;							//允许解散		27
        this.GAME_TYPE_CAN_LOOKON 		= 0x10000000;							//允许观战		28

        this.GAME_TYPE_XI_1             = 0x00080000;                           //喜分1         19
        this.GAME_TYPE_XI_2			    = 0x04000000;							//喜分2			26
        this.GAME_TYPE_XI_5 	    	= 0x20000000;							//喜分5     	29
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
        this.SUB_S_GAME_START      = 101;					//游戏开始
        this.SUB_S_GAME_END        = 102;					//游戏结束
        this.SUB_S_SEND_START_CARD = 103;					//开始发牌
        this.SUB_S_NEW_TURN        = 104;					//下轮发牌
        this.SUB_S_USER_ACTION     = 105;					//下注动作
        this.SUB_S_LOOK_CARD       = 106;					//用户看牌
        this.SUB_S_OPEN_CARD       = 107;					//游戏开牌
        this.SUB_S_GAME_DRAW       = 108;					//游戏烂锅
        this.SUB_S_OPERATE_TIME_OUT  = 109;					//操作超时
        this.SUB_S_TRUSTEE			 = 110;									//拖管

		//////////////////////////////////////////////////////////////////////////
		//客户端命令
		this.SUB_C_ADD_SCORE = 1;							//用户下注
		this.SUB_C_FOLLOW    = 2;							//用户跟注
		this.SUB_C_KICK      = 3;							//用户踢
		this.SUB_C_KICK_PASS = 4;							//用户不踢
		this.SUB_C_GIVEUP    = 5;							//用户弃牌
		this.SUB_C_LOOK_CARD = 6;							//用户看牌
        this.SUB_C_CANCEL_TRUSTEE = 7;							//取消托管

        
        this.g_GameEngine                   = null;
    },
	//房间数据
    tagRoomStatus :function() {
        var Obj = new Object();
        //Obj._name='tagRoomStatus';
        Obj.llBaseScore = 0;
        //Obj.dwGameRule= 0;
        Obj.llTotalScore = new Array(this.GAME_PLAYER);
        Obj.wBankerUser = INVALID_CHAIR;
        return Obj;
    },

	//本局数据
    tagPlayStatus :function() {
        var Obj = new Object();
        //Obj._name='tagPlayStatus';

		Obj.llTurnBaseScore = 0;
		Obj.llTotalTableScore = 0;
		Obj.llTableScore = new Array(this.GAME_PLAYER);
		Obj.llTurnScore = new Array(this.GAME_PLAYER);
		Obj.bPlayStatus = new Array(this.GAME_PLAYER);
		Obj.bGiveUp = new Array(this.GAME_PLAYER);
		Obj.bLookCard = new Array(this.GAME_PLAYER);
		Obj.bKickable = new Array(this.GAME_PLAYER);
        Obj.cbCardData = new Array(this.GAME_PLAYER);
        for (var i = 0; i < this.GAME_PLAYER; i++){
            Obj.cbCardData[i] = new Array(this.MAX_COUNT)
        }
        Obj.cbCardCount = new Array(this.GAME_PLAYER);
        Obj.bTrustee = new Array(this.GAME_PLAYER);
        //Obj.cbLightCardType = new Array(this.GAME_PLAYER);       //玩家牌型（游戏过程中 明牌的牌型）
        Obj.dwLightCardPoint = new Array (this.GAME_PLAYER);     //玩家点数（游戏过程中 明牌的点数）
        //Obj.cbCardType = new Array(this.GAME_PLAYER);            //玩家牌型（底牌和明牌组成的牌型）
        Obj.dwCardPoint = new Array (this.GAME_PLAYER);          //玩家点数（包括底牌的点数）

        Obj.cbSharedCard = 0;
		Obj.wTurn = 0;
		Obj.wFirstUser = 0;
		Obj.wFirstUserMultiple = 0;
		Obj.wKickUser = 0;
		Obj.wKickTurn = 0;
		Obj.wCurrentMultiple = 0;
		Obj.wCurrentUser = 0;
		Obj.wActionMask = 0;
		Obj.wLastUser = 0;
		Obj.wLastUserAction = 0;
        Obj.wLanGuoCount = 0;
        Obj.bAPao = false;								//抓A必炮
        Obj.bPublic = new Array(this.GAME_PLAYER);				//是否有公张

        for (var i = 0; i < this.GAME_PLAYER; i++) {
            Obj.llTableScore[i] = 0;
            Obj.llTurnScore[i] = 0;
            Obj.bPlayStatus[i] = false;
            Obj.bGiveUp[i] = false;
            Obj.bLookCard[i] = false;
            Obj.bKickable[i] = false;
            Obj.cbCardCount[i] = 0;
            Obj.bPublic[i] = false;
        }

        return Obj;
    },

	//////////////////////////////////////////////////////////////////////////////////
	//服务端消息结构

    //空闲状态
    CMD_S_StatusFree :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusFree'
        Obj.RoomStatus = this.tagRoomStatus();
        Obj.bTrustee = false;
        Obj.dwOperateTime = 0;//操作时间
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay :function () {
        var Obj = new Object();
        Obj._name='CMD_S_StatusPlay'
        Obj.RoomStatus = this.tagRoomStatus();
        Obj.PlayStatus = this.tagPlayStatus();
        Obj.dwOperateTime = 0;//操作时间
	    Obj.cbAllJettonCount = 0;//筹码数
	    Obj.cbAllJetton = new Array(this.MAX_JETTON);//筹码值
        Obj.cbAllMultiple = new Array(this.MAX_JETTON);//倍数
        return Obj;
    },

    //游戏开始
    CMD_S_GameStart :function () {
        var Obj = new Object();
        Obj._name='CMD_S_GameStart'
        Obj.llBaseScore = 0;
        Obj.bPlayStatus = new Array(this.GAME_PLAYER);
        Obj.llTableScore = new Array(this.GAME_PLAYER);
        Obj.llTotalTableScore = 0;
        Obj.wBankerUser = INVALID_CHAIR;
        Obj.bIsLanGuo = false;						//是否烂锅
        Obj.llDiScore = new Array(this.GAME_PLAYER);//底分
        return Obj;
    },

    //游戏结束
    CMD_S_GameEnd :function () {
        var Obj = new Object();
        Obj._name='CMD_S_GameEnd'
        Obj.llGameScore = new Array(this.GAME_PLAYER);
        Obj.dwUserID = new Array(this.GAME_PLAYER);
        return Obj;
    },

    //新一轮下注开始
    CMD_S_NewTurn :function () {
        var Obj = new Object();
        Obj._name='CMD_S_NewTurn'
        Obj.cbCardData = new Array(this.GAME_PLAYER);   //当前扑克
        Obj.cbSharedCard = 0;
        Obj.wCurrentUser = INVALID_CHAIR;
        Obj.wActionMask = 0;
        Obj.cbCardType = new Array(this.GAME_PLAYER);			//玩家牌型
        Obj.dwCardPoint = new Array(this.GAME_PLAYER);			//玩家点数
        Obj.cbAllCardData = new Array(this.GAME_PLAYER);			//所有扑克数据
        Obj.dwMeAllCardPoint = 0;					//自己所有牌点
        for (var i = 0; i < this.MAX_COUNT; i++)
        {
            Obj.cbAllCardData[i] = new Array(this.MAX_COUNT)
        }
        Obj.bAPao = false;								//抓A必炮
        Obj.bPublic = new Array(this.GAME_PLAYER);				//公张

        return Obj;
    },

    //用户动作
    CMD_S_UserAction :function () {
        var Obj = new Object();
        Obj._name='CMD_S_UserAction'
        Obj.wChairID = INVALID_CHAIR;
		Obj.wActionCode = 0;
        Obj.wMultiple = 0;
        Obj.llAddScore = 0;
        Obj.llTurnBaseScore = 0;
        Obj.wCurrentUser = INVALID_CHAIR;
        Obj.wActionMask = 0;
        return Obj;
    },

    //用户看牌
    CMD_S_LookCard :function () {
        var Obj = new Object();
        Obj._name='CMD_S_LookCard'
        Obj.wChairID = INVALID_CHAIR;
        Obj.cbCardData = new Array(2);
		Obj.cbCardType = new Array(this.GAME_PLAYER);
		Obj.dwCardPoint = new Array(this.GAME_PLAYER);
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

    //游戏烂锅
    CMD_S_GameDraw :function () {
        var Obj = new Object();
        Obj._name='CMD_S_GameDraw'
        Obj.llTurnBaseScore = 0;
        return Obj;
    },

    //大结算
    CMD_S_GameCustomInfo :function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"
        Obj.llTotalScore = new Array(this.GAME_PLAYER);         		//扑克数目
        return Obj;
    },
    //玩家拖管
    CMD_S_Trustee:function()
    {
        var Obj = new Object();
        Obj.wChairID = INVALID_CHAIR;
        Obj.bTrustee = false;
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
    GetProgress:function(wProgress,  dwServerRules,dwRulesArr){
        var cnt=this.GetGameCount( dwServerRules,dwRulesArr);
        return '第'+ wProgress+'/'+ cnt+'局';
    },

    setRule:function( dwRule ){
        this.m_dwGameRule = dwRule;
        // this.GAME_PLAYER = this.GetPlayerCount();
    },

    GetPlayerCount:function(rules){
        if(rules & this.GAME_TYPE_BANKENG_J) return 4;
        return 5;
    },

    GetGameCount:function(dwServerRules,dwRulesArr){
        var cnt=30;
        if(dwServerRules & this.GAME_TYPE_ROUND_1) cnt=60;
        return cnt;
    },
  
    GetRulesStr:function(dwServerRules,dwRulesArr){
        var str = '';

        if (dwServerRules & this.GAME_TYPE_ROUND_0)           str += ' 30局';
        if (dwServerRules & this.GAME_TYPE_ROUND_1)           str += ' 60局';

        if (dwRulesArr[0] & this.GAME_TYPE_BANKENG_9)         str += ' 半坑5人9起';
        if (dwRulesArr[0] & this.GAME_TYPE_BANKENG_10)        str += ' 半坑5人10起';
        if (dwRulesArr[0] & this.GAME_TYPE_BANKENG_J)         str += ' 半坑4人J起';
        if (dwRulesArr[0] & this.GAME_TYPE_QUANKENG)          str += ' 全坑';

        if (dwRulesArr[0] & this.GAME_TYPE_TWO_KING)          str += ' 双王';
        if (dwRulesArr[0] & this.GAME_TYPE_FOUR_KING)         str += ' 四小王';
        if (dwRulesArr[0] & this.GAME_TYPE_ALWAYS_KICK)       str += ' 把踢';
        if (dwRulesArr[0] & this.GAME_TYPE_END_KICK)          str += ' 末踢';
        if (dwRulesArr[0] & this.GAME_TYPE_SCORE_1_5)         str += ' 底注 1-5';
        if (dwRulesArr[0] & this.GAME_TYPE_SCORE_1_10)        str += ' 底注 1-10';
        if (dwRulesArr[0] & this.GAME_TYPE_XI_1)              str += ' 喜分1';
        if (dwRulesArr[0] & this.GAME_TYPE_XI_2)              str += ' 喜分2';
        if (dwRulesArr[0] & this.GAME_TYPE_XI_5)              str += ' 喜分5';

        if (dwRulesArr[0] & this.GAME_TYPE_PUBLIC_SUIBAO)     str += ' 公张随豹';
        if (dwRulesArr[0] & this.GAME_TYPE_PUBLIC_SUIDIAN)    str += ' 公张随点';
        if (dwRulesArr[0] & this.GAME_TYPE_LONG_HU_PAO)       str += ' 龙虎炮';
        if (dwRulesArr[0] & this.GAME_TYPE_A_PAO)             str += ' 抓A必炮';
        if (dwRulesArr[0] & this.GAME_TYPE_LANGUO_DOUBLE)     str += ' 烂锅翻倍';
        if (dwRulesArr[0] & this.GAME_TYPE_END_INFINITE_KICK) str += ' 末脚踢服';
        if (dwRulesArr[0] & this.GAME_TYPE_END_SHOW_CARD)     str += ' 结束亮底';
        if (dwRulesArr[0] & this.GAME_TYPE_DOUBLE_LOOK)       str += ' 看牌翻倍';
        if (dwRulesArr[0] & this.GAME_TYPE_TIME_OUT_TRUSTEE_30) str += ' 超时托管30';
        if (dwRulesArr[0] & this.GAME_TYPE_TIME_OUT_TRUSTEE_90) str += ' 超时托管90';
        if (dwRulesArr[0] & this.GAME_TYPE_NO_TRUSTEE)        str += ' 不托管';
        if (dwRulesArr[0] & this.GAME_TYPE_IP_LIMIT)          str += ' IP限制';
        if (dwRulesArr[0] & this.GAME_TYPE_GPS_CHECK)         str += ' GPS预警';
        if (dwRulesArr[0] & this.GAME_TYPE_VOICE_TALK)        str += ' 语音聊天';
        //if (dwRulesArr[0] & this.GAME_TYPE_NO_TALK)           str += ' 禁言';
        if ((dwRulesArr[0] & this.GAME_TYPE_CAN_DISS) == 0)   str += ' 不允许解散';
        
        if (dwServerRules & SERVER_RULES_DK)              str +=' 代开';


        console.log(' 房间规则： ' + dwRulesArr[0] + '    ' + str);
        // return strRuleArray;
        return str;
    },

    IsNoCheat:function(dwGameRule){
        return (dwGameRule & this.GAME_TYPE_GPS_CHECK);
    },
    IsNoVoice:function(rules)
    {
        return (rules & this.GAME_TYPE_VOICE_TALK);
    },
    IsCanDiss:function(rules)
    {
        return (rules & this.GAME_TYPE_CAN_DISS);
    },
    IsQuanKeng:function()
    {
        if(this.m_dwGameRule != null)
        {
            return (this.m_dwGameRule & this.GAME_TYPE_QUANKENG);
        }
        return false;
    },
});

GameDef = null;

