//CMD_Game.js
CMD_GAME_60014 = new cc.Class({ //window.
    ctor:function  () {
        //游戏标识
        this.KIND_ID					= 60014;
        //数值定义
        this.GAME_PLAYER				= 3;									//游戏人数
        this.FULL_COUNT					= 80;									//全牌数目
        this.MAX_KING					= 4;									//最大王牌
        this.MAX_WEAVE					= 7;									//最大组合
        this.MAX_INDEX					= 21;									//最大索引
        this.MAX_CARD_COUNT				= 21;									//最大数目
        this.MASK_COLOR					= 0xF0;									//花色掩码
        this.MASK_VALUE					= 0x0F;									//数值掩码
        this.INDEX_KING					= 20;									//王牌索引

        // UI设定
        this.MYSELF_VIEW_ID             = 1;
        this.CARD_WIGTH                 = 84;
        this.CARD_HEIGHT                = 228;
        this.CARD_WIGTH_S               = 84;
        this.CARD_HEIGHT_S              = 84;
        //X 排列方式
        this.enXLeft					= 1;									//左对齐
        this.enXCenter					= 2;									//中对齐
        this.enXRight					= 3;									//右对齐
        //Y 排列方式
        this.enYTop						= 1;									//上对齐
        this.enYCenter					= 2;		                			//中对齐
        this.enYBottom					= 3;                     				//下对齐

        //////////////////////////////////////////////////////////////////////////////////

        //状态定义
        this.GAME_STATUS_FREE  			= 0;									//等待开始
        this.GAME_STATUS_PLAY			= 100;									//游戏进行

        //////////////////////////////////////////////////////////////////////////////////

        this.CHR_TI						= 0x00000001							//提牌
        this.CHR_WEI_TO_TI				= 0x00000002							//偎牌变提
        this.CHR_WEI					= 0x00000004							//偎牌
        this.CHR_PAO					= 0x00000008							//跑牌
        this.CHR_WEI_TO_PAO				= 0x00000010							//偎牌变跑
        this.CHR_PENG_TO_PAO			= 0x00000020							//碰牌变跑
        this.CHR_BLACK					= 0x00000040							//黑胡
        this.CHR_RED					= 0x00000080							//红胡
        this.CHR_RED_1					= 0x00000100							//一点红（点胡）
        this.CHR_RED_B					= 0x00000200							//大红胡
        this.CHR_RED_S					= 0x00000400							//小红胡
        this.CHR_TIAN					= 0x00000800							//小红胡
        this.CHR_DI						= 0x00001000							//天胡
        this.CHR_HAI					= 0x00002000							//地胡
        this.CHR_DOUBLE					= 0x00004000							//对胡（碰碰胡）
        this.CHR_ZI_MO					= 0x00008000							//自摸
        this.CHR_DA_TUAN_YUAN			= 0x00010000;							//大团圆
        this.CHR_HANG_HANG_XI			= 0x00020000;							//行行息
        this.CHR_JIA_HANG_HANG			= 0x00040000;							//假行行
        this.CHR_SI_QI_HONG				= 0x00080000;							//四七红
        this.CHR_YI_KUAI_BIAN			= 0x00100000;							//一块匾
        this.CHR_BEI_KAO_BEI			= 0x00200000;							//背靠背
        this.CHR_TING_HU				= 0x00400000;							//听胡
        this.CHR_HUANG_FAN_X2			= 0x00800000;							//黄番2倍
        this.CHR_17_SMALL				= 0x01000000;							//17小
        this.CHR_18_BIG					= 0x02000000;							//18大
        this.CHR_TIAN_3_LONG			= 0x04000000;							//天胡三隆
        this.CHR_TIAN_5_KAN				= 0x08000000;							//天胡五坎

        //动作定义
		this.ACK_NULL					= 0x0000;								//空
		this.ACK_TI						= 0x0001;								//提
		this.ACK_PAO					= 0x0002;								//跑
		this.ACK_WEI					= 0x0004;								//偎
		this.ACK_CHI					= 0x0008;								//吃
		this.ACK_CHI_EX					= 0x0010;								//吃
		this.ACK_PENG					= 0x0020;								//碰
		this.ACK_CHIHU					= 0x0040;								//胡
		this.ACK_ZHANG					= 0x0080;								//掌
        this.ACK_JIAO					= 0x0100;								//绞
        this.ACK_SHUN					= 0x0200;								//顺
        this.ACK_WEI_CHOU				= 0x0400;								//臭偎

        //吃牌类型
        this.CK_NULL					= 0x00;									//无效类型
        this.CK_XXD						= 0x01;									//小小大搭
        this.CK_XDD						= 0x02;									//小大大搭
        this.CK_2_7_10					= 0x04;									//二七十吃
        this.CK_1_5_10					= 0x08;									//一五十吃
        this.CK_LEFT					= 0x10;									//左吃类型
        this.CK_CENTER					= 0x20;									//中吃类型
        this.CK_RIGHT					= 0x40;									//右吃类型


        // 胡番索引
        this.FanIndex_DaTuanYuan		= 0;									//大团圆
        this.FanIndex_HangHangXi		= 1;									//行行息
        this.FanIndex_JiaHangHang		= 2;									//假行行
        this.FanIndex_SiQiHong			= 3;									//四七红
        this.FanIndex_YiKuaiBian		= 4;									//一块匾
        this.FanIndex_BeiKaoBei			= 5;									//背靠背
        this.FanIndex_TingHu			= 6;									//听胡
        this.FanIndex_HuangFanX2		= 7;									//黄番X2
        this.FanIndex_Hai				= 8;									//海湖（耍猴）
        this.FanIndex_Double			= 9;									//对胡（碰碰胡）
        this.FanIndex_Red				= 10;									//红胡
        this.FanIndex_Black				= 11;									//黑胡
        this.FanIndex_Red_1				= 12;									//一点红
        this.FanIndex_Tian				= 13;									//天胡
        this.FanIndex_Di				= 14;									//地胡
        this.FanIndex_ZiMo				= 15;									//自摸
        this.FanIndex_17S				= 16;									//17小
        this.FanIndex_18B				= 17;									//18大
        this.FanIndex_Tian3Long			= 18;									//天胡三隆
        this.FanIndex_Tian5Kan			= 19;									//天胡五坎

        //////////////////////////////////////////////////////////////////////////////////

		this.RuleValue0 = 0x00000001;
		this.RuleValue1 = 0x00000002;
		this.RuleValue2 = 0x00000004;
		this.RuleValue3 = 0x00000008;
		this.RuleValue4 = 0x00000010;
		this.RuleValue5 = 0x00000020;
		this.RuleValue6 = 0x00000040;
		this.RuleValue7 = 0x00000080;
		this.RuleValue8 = 0x00000100;
		this.RuleValue9 = 0x00000200;
		this.RuleValue10 = 0x00000400;
		this.RuleValue11 = 0x00000800;
		this.RuleValue12 = 0x00001000;
		this.RuleValue13 = 0x00002000;
		this.RuleValue14 = 0x00004000;
		this.RuleValue15 = 0x00008000;
		this.RuleValue16 = 0x00010000;
		this.RuleValue17 = 0x00020000;
		this.RuleValue18 = 0x00040000;
		this.RuleValue19 = 0x00080000;
		this.RuleValue20 = 0x00100000;
		this.RuleValue21 = 0x00200000;
		this.RuleValue22 = 0x00400000;
		this.RuleValue23 = 0x00800000;
		this.RuleValue24 = 0x01000000;
		this.RuleValue25 = 0x02000000;
		this.RuleValue26 = 0x04000000;
		this.RuleValue27 = 0x08000000;
		this.RuleValue28 = 0x10000000;
		this.RuleValue29 = 0x20000000;
		this.RuleValue30 = 0x40000000;
        this.RuleValue31 = 0x80000000;

		this.GAME_TYPE_ROUND_0					= (this.RuleValue18);					// 局数 5局
		this.GAME_TYPE_ROUND_1					= (this.RuleValue19);					// 局数 10局
		this.GAME_TYPE_ROUND_2					= (this.RuleValue20);					// 局数 20局
		this.GAME_TYPE_ROUND_3					= (this.RuleValue3);					// 局数 30局
		this.GAME_TYPE_P_COUNT_0				= (this.RuleValue16);					// 玩家人数 2人
		this.GAME_TYPE_P_COUNT_1				= (this.RuleValue17);					// 玩家人数 3人
		this.GAME_TYPE_LIMIT_XI_10				= (this.RuleValue6);					// 10息起胡
		this.GAME_TYPE_LIMIT_XI_15				= (this.RuleValue7);					// 15息起胡
		this.GAME_TYPE_5XI_1SCORE				= (this.RuleValue8);					// 5胡1子
		this.GAME_TYPE_3XI_1SCORE				= (this.RuleValue9);					// 3胡1子
		this.GAME_TYPE_ZIMO_ADD_1				= (this.RuleValue10);					// 自摸加1
		this.GAME_TYPE_ZIMO_DOUBLE				= (this.RuleValue11);					// 自摸翻倍
		this.GAME_TYPE_DIAN_PAO					= (this.RuleValue12);					// 可点炮 / 不可点炮
		this.GAME_TYPE_FAN_CHONG_XING			= (this.RuleValue13);					// 翻重醒
		this.GAME_TYPE_XING_SHANG				= (this.RuleValue14);					// 上醒
		this.GAME_TYPE_XING_ZHONG				= (this.RuleValue15);					// 中醒
		this.GAME_TYPE_XING_XIA					= (this.RuleValue16);					// 下醒

		// 托管
		this.GAME_TYPE_AUTO_TRUSTEE_0		= (this.RuleValue27);					// 自动托管 不托管
		this.GAME_TYPE_AUTO_TRUSTEE_1		= (this.RuleValue28);					// 自动托管 1分钟托管
		this.GAME_TYPE_AUTO_TRUSTEE_2		= (this.RuleValue29);					// 自动托管 2分钟托管
		this.GAME_TYPE_AUTO_TRUSTEE_3		= (this.RuleValue30);					// 自动托管 3分钟托管
        // IP防作弊
        this.GAME_TYPE_IP_CHECK				= (this.RuleValue31);					// IP防作弊

        //////////////////////////////////////////////////////////////////////////////////

        //服务器命令
        this.SUB_S_GAME_START				= 100;								//游戏开始
        this.SUB_S_USER_TI_CARD				= 101;								//用户提牌
        this.SUB_S_USER_PAO_CARD			= 102;								//用户跑牌
        this.SUB_S_USER_WEI_CARD			= 103;								//用户偎牌
        this.SUB_S_USER_PENG_CARD			= 104;								//用户碰牌
        this.SUB_S_USER_CHI_CARD			= 105;								//用户吃牌
        this.SUB_S_OPERATE_NOTIFY			= 106;								//操作提示
        this.SUB_S_OUT_CARD_NOTIFY			= 107;								//出牌提示
        this.SUB_S_OUT_CARD					= 108;								//用户出牌
        this.SUB_S_SEND_CARD				= 109;								//发牌命令
        this.SUB_S_CHOU_CARD				= 110;								//臭牌列表
        this.SUB_S_DISCARD_CARD				= 111;								//丢弃列表
        this.SUB_S_TRUSTEE					= 112;								//玩家托管
        this.SUB_S_TING_TIP					= 113;								//听牌提示
        this.SUB_S_GAME_END					= 120;								//游戏结束

        this.SUB_S_COMMAND_RESULT			= 200;								//消息结果
        this.SUB_S_HEAP_CARD				= 201;								//牌堆扑克
        this.SUB_S_HAND_CARD				= 202;								//手中扑克

        ////////////////////////////////////////////////////////////////////////////
        //客户端命令
        this.SUB_C_OUT_CARD					= 1;								//出牌命令
        this.SUB_C_OPERATE_CARD				= 2;								//操作扑克
        this.SUB_C_CONTINUE_CARD			= 3;								//继续命令
        this.SUB_C_TRUSTEE					= 4;								//玩家托管
        this.SUB_C_COMMAND					= 100;								//控制命令

        //////////////////////////////////////////////////////////////////////////////////
        //动作类型
        this.ACTION_TIP						= 1;								//提示动作
        this.ACTION_TI_CARD					= 2;								//提牌动作
        this.ACTION_PAO_CARD				= 3;								//跑牌动作
        this.ACTION_WEI_CARD				= 4;								//偎牌动作
        this.ACTION_PENG_CARD				= 5;								//碰牌动作
        this.ACTION_CHI_CARD				= 6;								//吃牌动作
        this.ACTION_OUT_CARD				= 7;								//出牌动作
        this.ACTION_SEND_CARD				= 8;								//发牌动作
        this.ACTION_OPERATE_NOTIFY			= 9;								//发牌动作
        this.ACTION_OUT_CARD_NOTIFY			= 10;								//发牌动作


    },

    //////////////////////////////////////////////////////////////////////////////////


    //动作子项
    tagUserAction: function () {
        var Obj = new Object();
        Obj._name = 'tagUserAction';
        Obj.cbActionKind = 0;						//动作类型
        Obj.cbActionBuffer = new Array(64);	    	//动作内容
        return Obj;
    },
    //提示动作
    tagActionTip: function () {
        var Obj = new Object();
        Obj._name = 'tagActionTip';
        Obj.wChairID = 0;							//用户位置
        Obj.cbActionFlags = 0;						//动作标识
        return Obj;
    },

    //提牌动作
    tagActionTiCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionTiCard';
        Obj.cbIndex = 0;							//索引号码
        Obj.wChairID = 0;							//用户位置
        Obj.cbHuXiCount = 0;						//胡息数目
        Obj.cbRemoveCount = 0;						//删除数目
        Obj.bDisplay = false;						//是否明牌
        return Obj;
    },

    //跑牌动作
    tagActionPaoCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionPaoCard';
        Obj.cbIndex = 0;							//索引号码
        Obj.wChairID = 0;							//用户位置
        Obj.cbHuXiCount = 0;							//胡息数目
        Obj.cbRemoveCount = 0;						//删除数目
        Obj.bDisplay = false;								//是否明牌
        return Obj;
    },

    //偎牌动作
    tagActionWeiCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionWeiCard';
        Obj.cbIndex = 0;							//索引号码
        Obj.wChairID = 0;							//用户位置
        Obj.cbHuXiCount = 0;							//胡息数目
        Obj.bDisplay = false;								//是否明牌
        return Obj;
    },

    //碰牌动作
    tagActionPengCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionPengCard';
        Obj.cbIndex = 0;							//索引号码
        Obj.wChairID = 0;							//用户位置
        Obj.cbHuXiCount = 0;							//胡息数目
        return Obj;
    },

    //吃牌动作
    tagActionChiCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionChiCard';
        Obj.cbIndex = 0;							//索引号码
        Obj.wChairID = 0;							//用户位置
        Obj.cbHuXiCount = 0;							//胡息数目
        Obj.cbActionCard = 0;						//碰牌扑克
        Obj.cbResultCount = 0;						//结果数目
        Obj.cbCardData = new Array(3);				//吃牌组合
        for(var i = 0; i < 3; ++ i) Obj.cbCardData[i] = new Array(3);
        return Obj;
    },

    //出牌动作
    tagActionOutCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionOutCard';
        Obj.wOutCardUser = 0;						//出牌用户
        Obj.cbOutCardData = 0;						//出牌扑克
        return Obj;
    },

    //发牌动作
    tagActionSendCard: function () {
        var Obj = new Object();
        Obj._name = 'tagActionSendCard';
        Obj.wAttachUser = 0;						//绑定用户
        Obj.cbSendCardData = 0;						//发牌扑克
        Obj.bSound = false;
        return Obj;
    },

    //操作提示
    tagActionOperateNotify: function () {
        var Obj = new Object();
        Obj._name = 'tagActionOperateNotify';
        this.wResumeUser = 0;						//还原用户
        this.cbOperateCode = 0;						//操作代码
        this.cbCurrentCard = 0;						//当前扑克
        return Obj;
    },

    //出牌提示
    tagActionOutCardNotify: function () {
        var Obj = new Object();
        Obj._name = 'tagActionOutCardNotify';
        this.bOutCard = false;							//出牌标志
        this.wCurrentUser = 0;						//当前用户
        return Obj;
    },

    //////////////////////////////////////////////////////////////////////////////////

    //组合子项
    tagWeaveItem: function () {
        var Obj = new Object();
        Obj._name = 'tagWeaveItem';
        Obj.wWeaveKind = this.ACK_NULL; //组合类型
        Obj.cbCardCount = 0; //扑克数目
        Obj.cbCenterCard = 0; //中心扑克
        Obj.cbCardList = new Array(4); //扑克列表
        Obj.cbChiKind = 0; //吃牌类型
        Obj.cbHuxi = 0; //胡息数量
        Obj.bDisplay = true; //是否明牌
        return Obj;
    },

    //吃牌信息
    tagChiCardInfo: function () {
        var Obj = new Object();
        Obj._name = 'tagChiCardInfo';
        Obj.bValid = false; // 是否有效
        Obj.cbChiKind = new Array(10); //吃牌类型
        Obj.cbCenterCard = 0; //中心扑克
        Obj.cbResultCount = 0; //结果数目
        Obj.cbCardData = new Array(10); //吃牌组合
        for (var i = 0; i < 10; ++i) {
            Obj.cbChiKind[i] = 0;
            Obj.cbCardData[i] = new Array(3);
        }
        return Obj;
    },

    //分析子项
    tagAnalyseItem: function () {
        var Obj = new Object();
        Obj._name = 'tagAnalyseItem';
        Obj.cbCardEye = 0; //牌眼扑克
        Obj.cbHuXiCount = 0; //胡息数目
        Obj.cbWeaveCount = 0; //组合数目
        Obj.WeaveItemArray = new Array(this.MAX_WEAVE); //组合扑克
        for (var i = 0; i < this.MAX_WEAVE; ++i) {
            Obj.WeaveItemArray[i] = this.tagWeaveItem();
        }
        return Obj;
    },

    //胡牌信息
    tagHuCardInfo: function () {
        var Obj = new Object();
        Obj._name = 'tagAnalyseItem';
        Obj.dwCHR = 0; //胡牌权位
        Obj.cbRedCount = 0; //红牌数量
        Obj.cbBCount = 0; //大牌数量
        Obj.cbSCount = 0; //小牌数量
        Obj.cbTiCount = 0; //提牌数量
        Obj.cbKanCount = 0; //坎牌数量
        Obj.cbCardEye = 0; //牌眼扑克
        Obj.cbCurrentCard = 0;//当前扑克
        Obj.cbHuXiCount = 0; //胡息数目
        Obj.cbKingReplace = new Array(this.MAX_KING);//王牌替换索引
        Obj.cbWeaveCount = 0; //组合数目
        Obj.WeaveItemArray = new Array(this.MAX_WEAVE); //组合扑克
        for (var i = 0; i < this.MAX_WEAVE; ++i) {
            Obj.WeaveItemArray[i] = this.tagWeaveItem();
        }
        Obj.bHuState = new Array(20);						//胡牌状态
        Obj.cbFan = new Array(20);							//胡牌番数
        return Obj;
    },

    //////////////////////////////////////////////////////////////////////////////////
    //游戏状态
    CMD_S_StatusFree: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_StatusFree"
        Obj.lCellScore = 0; //基础积分
        Obj.wBankerUser = 0; //庄家用户
        return Obj;
    },

    //游戏状态
    CMD_S_StatusPlay: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_StatusPlay"
        //游戏信息
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);			//玩家状态
        Obj.cbTrustee = new Array(this.GAME_PLAYER);			//玩家托管
        Obj.lCellScore = 0; //基础积分
        Obj.wBankerUser = 0; //庄家用户
        Obj.wCurrentUser = 0; //当前用户

        //出牌信息
        Obj.bOutCard = false; //出牌标志
        Obj.wOutCardUser = 0; //出牌用户
        Obj.cbOutCardData = 0; //出牌扑克

        //扑克信息
        Obj.cbLeftCardCount = 0; //剩余数目
        Obj.cbCardIndex = new Array(this.MAX_INDEX); //用户扑克
        Obj.cbUserCardCount = new Array(this.GAME_PLAYER); //扑克数目
        Obj.bAbandonCard = new Array(this.GAME_PLAYER);//放弃扑克 臭牌
        for(var i = 0; i < this.GAME_PLAYER; ++ i) Obj.bAbandonCard[i] = new Array(this.MAX_INDEX);

        //组合信息
        Obj.cbWeaveItemCount = new Array(this.GAME_PLAYER); //组合数目
        Obj.WeaveItemArray = new Array(this.GAME_PLAYER); //组合扑克
        for(var i = 0; i < this.GAME_PLAYER; ++ i) {
            Obj.WeaveItemArray[i] = new Array(this.MAX_WEAVE);
            for(var j = 0; j < this.MAX_WEAVE; ++ j){
                Obj.WeaveItemArray[i][j] = this.tagWeaveItem();
            }
        }

        //动作信息
        Obj.bResponse = false; //响应标志
        Obj.cbUserAction = 0; //用户动作
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
        Obj._name = "CMD_S_GameStart"
        Obj.cbUserStatus = new Array(this.GAME_PLAYER);
        Obj.wBankerUser = 0; //庄家用户
        Obj.wCurrentUser = 0; //当前用户
        Obj.cbCardData = new Array(21); //扑克列表
        Obj.cbLeftCardCount = 0;
        return Obj;
    },

    //提牌命令
    CMD_S_UserTiCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserTiCard"
        Obj.wActionUser = 0; //动作用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbRemoveCount = 0; //删除数目
        Obj.cbHuxi = 0; //胡息数量
        Obj.bDisplay = false; //是否明牌
        return Obj;
    },

    //跑牌命令
    CMD_S_UserPaoCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserPaoCard"
        Obj.wActionUser = 0; //动作用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbRemoveCount = 0; //删除数目
        Obj.cbHuxi = 0; //胡息数量
        Obj.bDisplay = true; //是否明牌
        return Obj;
    },

    //偎牌命令
    CMD_S_UserWeiCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserWeiCard"
        Obj.wActionUser = 0; //动作用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbHuxi = 0; //胡息数量
        Obj.bDisplay = false; //是否明牌
        return Obj;
    },

    //碰牌命令
    CMD_S_UserPengCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserPengCard"
        Obj.wActionUser = 0; //动作用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbHuxi = 0; //胡息数量
        return Obj;
    },

    //吃牌命令
    CMD_S_UserChiCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_UserChiCard"
        Obj.wActionUser = 0; //动作用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbResultCount = 0; //结果数目
        Obj.cbHuxi = new Array(3); //胡息数量
        Obj.cbCardData = new Array(3); //吃牌组合
        for(var i = 0;i < 3; ++ i) Obj.cbCardData[i] = new Array(3);
        return Obj;
    },

    //操作提示
    CMD_S_OperateNotify: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_OperateNotify"
        Obj.wResumeUser = 0; //还原用户
        Obj.cbActionCard = 0; //操作扑克
        Obj.cbOperateCode = 0; //操作代码
        return Obj;
    },

    //出牌提示
    CMD_S_OutCardNotify: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_OutCardNotify"
        Obj.bOutCard = 0; //出牌标志
        Obj.wCurrentUser = 0; //当前用户
        return Obj;
    },

    //用户出牌
    CMD_S_OutCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_OutCard"
        Obj.wOutCardUser = 0; //出牌用户
        Obj.cbOutCardData = 0; //出牌扑克
        return Obj;
    },

    //发牌命令
    CMD_S_SendCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_SendCard"
        Obj.cbCardData = 0; //发牌扑克
        Obj.wAttachUser = 0; //绑定用户
        Obj.bSound = false; //是否播报
        return Obj;
    },

    //臭牌列表
    CMD_S_ChouCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_ChouCard"
        Obj.bAbandonCard = new Array(this.GAME_PLAYER); //发牌扑克
        for(var i = 0; i < this.GAME_PLAYER; ++ i) Obj.bAbandonCard[i] = new Array(this.MAX_INDEX);
        return Obj;
    },

    //丢弃列表
    CMD_S_DiscardCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_DiscardCard"
        Obj.cbCardCount = new Array(this.GAME_PLAYER);
        Obj.cbCardData = new Array(this.FULL_COUNT);
        return Obj;
    },

    //游戏结束
    CMD_S_GameEnd: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_GameEnd"
        //结束信息
        Obj.cbReason = 0; //结束原因
        Obj.cbHuCard = 0; //胡牌扑克
        Obj.wWinUser = INVALID_CHAIR; //胜利用户
        Obj.wProvideUser = 0; //放炮用户
        Obj.dwChiHuRight = 0; //胡牌权位
        // Obj.cbProvideCard = 0; //供应扑克
        Obj.bDispatch = false; //派发标志
        // Obj.cbXingCard = 0; //醒牌扑克

        // //成绩变量
        // Obj.lGameTax = 0; //游戏税收
        // Obj.lGameScore = new Array(this.GAME_PLAYER); //游戏积分
        // Obj.lBaseScore = 0;//基本分
        // Obj.lHuScore = 0;//总胡分
        // Obj.cbHuxiCount = 0;//赢家胡息

		//成绩变量
		Obj.lGameTax = 0;							//游戏税收
		Obj.lGameScore = new Array(this.GAME_PLAYER);//游戏积分
		Obj.lBaseScore = 0;							//基本分
		Obj.lHuScore = 0;							//总胡分
		Obj.lXingScore = 0;							//赢家醒分
		Obj.cbHuxiCount = 0;						//赢家胡息
		Obj.cbFan = 0;								//赢家番数
		Obj.cbZimoFan = 0;							//赢家自摸番数

        //扑克变量
        Obj.cbCardCount = new Array(this.GAME_PLAYER); //扑克数目
        Obj.cbCardList = new Array(this.FULL_COUNT); //扑克列表
        Obj.HuCardInfo = this.tagHuCardInfo();//胡牌信息
        Obj.cbCardIndex = new Array(this.GAME_PLAYER); //手牌信息
        for (var i = 0; i < this.GAME_PLAYER; ++i) Obj.cbCardIndex[i] = new Array(this.MAX_INDEX);
        Obj.cbLeftCount = 0; // 剩余数量
        Obj.cbLeftCard = new Array(this.FULL_COUNT); // 剩余扑克
        Obj.cbFXCard = new Array(this.MAX_CARD_COUNT);//翻醒数据
        Obj.cbFXCount = 0;							//翻醒数量
        Obj.cbFirstFX = 0;							//首翻醒牌

        return Obj;
    },
    // 房间结算
    CMD_S_GameCustomInfo: function () {
        var Obj = new Object();
        Obj._name="CMD_S_GameCustomInfo"
        Obj.cbHuCount = new Array(this.GAME_PLAYER); //胡牌次数
        Obj.cbPaoCount = new Array(this.GAME_PLAYER); //点炮次数
        Obj.lTotalScore = new Array(this.GAME_PLAYER); //玩家分数
        Obj.dwUserID = new Array(this.GAME_PLAYER); //玩家ID
        return Obj;
    },

    // 听牌提示头
    CMD_S_TingTipHead: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_TingTip"
        Obj.wCount = 0; //听牌数据数量
        Obj.wItemSize = 0; //听牌数据大小
        Obj.cbCurrentCard = 0; //听牌当前牌
        Obj.bNeedOutCard = 0; //是否需要出牌后听
        return Obj;
    },
    // 听牌提示
    CMD_S_TingTip: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_TingTip"
        Obj.cbTingIndex = 0; //听牌索引
        Obj.cbCardIndex = new Array(this.MAX_INDEX); //胡口索引
        Obj.cbLeftCount = new Array(this.MAX_INDEX); //剩余数量
        return Obj;
    },

/////////////////////////////////////////////////////////////////////////////////
    // 命令结果
    CMD_S_VipCommandResult: function () {
        var Obj = new Object();
        Obj._name="CMD_S_VipCommandResult"
        Obj.wSubID = 0; //命令ID
        Obj.cbResult = 0; //命令结果
        return Obj;
    },

    //扑克索引
    CMD_S_CardIndex: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_CardIndex"
        Obj.cbCardIndex = new Array(this.MAX_INDEX); //扑克索引
        return Obj;
    },

    //扑克索引
    CMD_S_TestSwapCard: function () {
        var Obj = new Object();
        Obj._name = "CMD_S_TestSwapCard";
        Obj.cbCardData = new Array(2);
        return Obj;
    },

/////////////////////////////////////////////////////////////////////////////////

    //出牌命令
    CMD_C_OutCard: function () {
        var Obj = new Object();
        Obj._name="CMD_C_OutCard"
        Obj.cbCardData = 0; //扑克数据
        return Obj;
    },

    //操作命令
    CMD_C_OperateCard: function () {
        var Obj = new Object();
        // Obj._name="CMD_C_OperateCard"
        Obj.cbChiKind = 0; //吃牌类型
        Obj.cbOperateCode = 0; //操作代码
        Obj.cbTakeChiCount = 0;
        Obj.TakeChiWeave = new Array(2);
        for(var i = 0; i < 2; ++ i) {
            Obj.TakeChiWeave[i] = this.tagWeaveItem();
        }
        return Obj;
    },

    //操作命令
    CMD_C_Command :function(){
        var Obj = new Object();
        //Obj._name="CMD_C_Command"
        Obj.wSubID = 0;//命令ID
        Obj.pData = new Object();//携带消息
        return Obj;
    },

    //剩余牌数
    CMD_C_ModifyLeftCount :function(){
        var Obj = new Object();
        //Obj._name="CMD_C_ModifyLeftCount"
        Obj.cbLeftCount;						//剩余牌数
        Obj.dwTest;
        return Obj;
    },

    ///////////////////////////////////////////////////////////

    GetMaxCardCount: function (dwRules) {
        var cbCount = this.MAX_CARD_COUNT;
        return cbCount;
    },

    GetPlayerCount:function(dwRules){
        var cbCount = this.GAME_PLAYER;
        if (dwRules & this.GAME_TYPE_P_COUNT_0) cbCount = 2;
        if (dwRules & this.GAME_TYPE_P_COUNT_1) cbCount = 3;
        return cbCount;
    },

    GetProgress:function(wProgress, dwServerRules, dwRulesArr){
        var cnt = this.GetGameCount(dwServerRules);
        if (cnt > 0) {
            return '第' + wProgress + '/' + cnt + '局';
        } else {
            return '';
        }
    },

    GetProgressInGame: function(wProgress, dwServerRules, dwRulesArr) {
        var cnt=this.GetGameCount(dwServerRules);
        if(wProgress > 0 && cnt > 0){
            return wProgress+'/'+ cnt ;
        }else{
            return '- -';
        }
    },
    GetProgressInRecord: function(wProgress, dwServerRules, dwRulesArr) {
        var cnt=this.GetGameCount(dwServerRules);
        if(wProgress > 0 && cnt > 0){
            return wProgress+'/'+ cnt ;
        }else{
            return '- -';
        }
    },

    GetGameCount:function(dwRules){
        var cnt = 5;
        if (dwRules & this.GAME_TYPE_ROUND_0) cnt = 5;
        if (dwRules & this.GAME_TYPE_ROUND_1) cnt = 10;
        if (dwRules & this.GAME_TYPE_ROUND_2) cnt = 20;
        if (dwRules & this.GAME_TYPE_ROUND_3) cnt = 30;
        return cnt;
    },

    GetCellScore: function(dwRulesArray) {
        if(dwRulesArray) {
            if (dwRulesArray[6] > 0) return dwRulesArray[6];
        }
        return 1;
    },

    GetBaseTimes: function(dwRulesArray) {
        if(dwRulesArray) {
            if (dwRulesArray[5] > 0) return dwRulesArray[5];
        }
        return 1;
    },

    GetRulesStr: function (dwRules, dwServerRules, dwRulesArray) {
        var strArray = new Array();
        strArray.push(this.GetGameCount(dwServerRules) + "局");
        strArray.push(this.GetPlayerCount(dwServerRules) + "人");
        // if(dwRulesArray) {
        //     strArray.push((this.GetBaseTimes(dwRulesArray) > 1 ? ('翻' + this.GetBaseTimes(dwRulesArray) + '倍') : ('不翻倍')));
        //     strArray.push('底分' + this.GetCellScore(dwRulesArray));
        // }

        if (dwRules & this.GAME_TYPE_LIMIT_XI_10) strArray.push("10息起胡");
        if (dwRules & this.GAME_TYPE_LIMIT_XI_15) strArray.push("15息起胡");
        if (dwRules & this.GAME_TYPE_5XI_1SCORE) strArray.push("5胡1子");
        if (dwRules & this.GAME_TYPE_3XI_1SCORE) strArray.push("3胡1子");
        if (dwRules & this.GAME_TYPE_ZIMO_ADD_1) strArray.push("自摸加1");
        if (dwRules & this.GAME_TYPE_ZIMO_DOUBLE) strArray.push("自摸翻倍");
        if (dwRules & this.GAME_TYPE_DIAN_PAO) strArray.push("可点炮");
        else strArray.push("不可点炮");
        if (dwRules & this.GAME_TYPE_FAN_CHONG_XING) {
            strArray.push("翻重醒");
            if (dwRules & this.GAME_TYPE_XING_SHANG) strArray.push("上醒");
            if (dwRules & this.GAME_TYPE_XING_ZHONG) strArray.push("中醒");
            if (dwRules & this.GAME_TYPE_XING_XIA) strArray.push("下醒");
        }

        // if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_0) strArray.push('不自动托管');
        // else if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_1) strArray.push('1分钟自动托管');
        // else if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_2) strArray.push('2分钟自动托管');
        // else if (dwRules & this.GAME_TYPE_AUTO_TRUSTEE_3) strArray.push('3分钟自动托管');
        if(this.IsIPCheck(dwRules)) strArray.push("IP防作弊");
        return strArray.join(' ');
    },

    GetRulesStrInGame: function(dwRules, dwServerRules, dwRulesArray) {
        return this.GetRulesStr(dwRules, dwServerRules, dwRulesArray);
    },

    GetRulesStrInEndView: function(dwRules, dwServerRules, dwRulesArray) {
        return this.GetRulesStr(dwRules, dwServerRules, dwRulesArray);
    },

    GetRulesStrInAgent: function(dwRules, dwServerRules, dwRulesArray) {
        return this.GetRulesStr(dwRules, dwServerRules, dwRulesArray);
    },

    IsGPSCheck: function (dwRules) {
        return true;
    },

    // IP防作弊
    IsIPCheck: function (dwRules) {
        if(!this.GAME_TYPE_IP_CHECK) return true;
        return ((dwRules & this.GAME_TYPE_IP_CHECK) ? true : false);
    },

    // 是否允许聊天
    IsAllowChat: function(dwRules) {
        if(!this.GAME_TYPE_CHAT_ON) return true;
        return ((dwRules & this.GAME_TYPE_CHAT_ON) ? true : false);
    },

	IsAllow1_5_10: function(dwRules) {
        if(!this.GAME_TYPE_1_5_10) return false;
		return (dwRules & this.GAME_TYPE_1_5_10) != 0;
	},

	IsAllowMingWei: function(dwRules) {
        if(!this.GAME_TYPE_MING_WEI) return false;
		return (dwRules & this.GAME_TYPE_MING_WEI) != 0;
	},
    //////////////////////////////////////////////////////////////////////

    CardDataName: function(cbCardData) {
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        var str = ['一','二','三','四','五','六','七','八','九','十','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
        if(cbIndex>= str.length) return '';
        return str[cbIndex];
    },

    ActionName: function(cbOperateCode) {
        if(cbOperateCode == this.ACK_NULL) return '空';
        var strArray = new Array();
        if(cbOperateCode & this.ACK_TI)         strArray.push('提');
        if(cbOperateCode & this.ACK_PAO)        strArray.push('跑');
        if(cbOperateCode & this.ACK_WEI)        strArray.push('偎');
        if(cbOperateCode & this.ACK_CHI)        strArray.push('吃');
        if(cbOperateCode & this.ACK_CHI_EX)     strArray.push('吃');
        if(cbOperateCode & this.ACK_PENG)       strArray.push('碰');
        if(cbOperateCode & this.ACK_CHIHU)      strArray.push('胡');
        if(cbOperateCode & this.ACK_ZHANG)         strArray.push('比');
        return strArray.join(' ');
    },
    ChiKindName: function(cbCode) {
        if(cbCode == this.CK_NULL) return '无效类型';
        var strArray = new Array();
        if(cbOperateCode & this.CK_XXD)         strArray.push('小小大搭');
        if(cbOperateCode & this.CK_XDD)         strArray.push('小大大搭');
        if(cbOperateCode & this.CK_2_7_10)      strArray.push('二七十吃');
        if(cbOperateCode & this.CK_1_5_10)      strArray.push('一五十吃');
        if(cbOperateCode & this.CK_LEFT)        strArray.push('左吃类型');
        if(cbOperateCode & this.CK_CENTER)      strArray.push('中吃类型');
        if(cbOperateCode & this.CK_RIGHT)       strArray.push('右吃类型');
    },

    GetCHRText_EndView: function(dwCHR, dwRulesArray, cbFanArray) {
        var strArray = new Array();
        // if(dwCHR & GameDef.CHR_TI) strArray.push('提胡');
        // if(dwCHR & GameDef.CHR_WEI_TO_TI) strArray.push('提胡');
        // if(dwCHR & GameDef.CHR_WEI) strArray.push('偎胡');
        // if(dwCHR & GameDef.CHR_PAO) strArray.push('跑胡');
        // if(dwCHR & GameDef.CHR_WEI_TO_PAO) strArray.push('跑胡');
        // if(dwCHR & GameDef.CHR_PENG_TO_PAO) strArray.push('跑胡');
        if(dwCHR & GameDef.CHR_ZI_MO) {
            if (dwRulesArray[0] & this.GAME_TYPE_ZIMO_ADD_1) strArray.push("自摸+1");
            if (dwRulesArray[0] & this.GAME_TYPE_ZIMO_DOUBLE) strArray.push("自摸X2");
        }
        if(dwCHR & GameDef.CHR_BLACK) strArray.push('黑胡X' + cbFanArray[this.FanIndex_Black]);
        if(dwCHR & GameDef.CHR_RED) strArray.push('红胡X' + cbFanArray[this.FanIndex_Red]);
        if(dwCHR & GameDef.CHR_RED_1) strArray.push('一点红X' + cbFanArray[this.FanIndex_Red_1]);
        if(dwCHR & GameDef.CHR_TIAN) strArray.push('天胡X' + cbFanArray[this.FanIndex_Tian]);
        if(dwCHR & GameDef.CHR_DI) strArray.push('地胡X' + cbFanArray[this.FanIndex_Di]);
        if(dwCHR & GameDef.CHR_HAI) strArray.push('耍猴X' + cbFanArray[this.FanIndex_Hai]);
        if(dwCHR & GameDef.CHR_DOUBLE) strArray.push('碰碰胡X' + cbFanArray[this.FanIndex_Double]);
        if(dwCHR & GameDef.CHR_DA_TUAN_YUAN) strArray.push('大团圆X' + cbFanArray[this.FanIndex_DaTuanYuan]);
        if(dwCHR & GameDef.CHR_HANG_HANG_XI) strArray.push('行行息X' + cbFanArray[this.FanIndex_HangHangXi]);
        if(dwCHR & GameDef.CHR_JIA_HANG_HANG) strArray.push('假行行X' + cbFanArray[this.FanIndex_JiaHangHang]);
        if(dwCHR & GameDef.CHR_SI_QI_HONG) strArray.push('四七红X' + cbFanArray[this.FanIndex_SiQiHong]);
        if(dwCHR & GameDef.CHR_YI_KUAI_BIAN) strArray.push('一块匾X' + cbFanArray[this.FanIndex_YiKuaiBian]);
        if(dwCHR & GameDef.CHR_BEI_KAO_BEI) strArray.push('背靠背X' + cbFanArray[this.FanIndex_BeiKaoBei]);
        if(dwCHR & GameDef.CHR_TING_HU) strArray.push('听胡X' + cbFanArray[this.FanIndex_TingHu]);
        if(dwCHR & GameDef.CHR_HUANG_FAN_X2) strArray.push('黄番X' + cbFanArray[this.FanIndex_HuangFanX2]);
        if(dwCHR & GameDef.CHR_17_SMALL) strArray.push('十七小X' + cbFanArray[this.FanIndex_17S]);
        if(dwCHR & GameDef.CHR_TIAN_3_LONG) strArray.push('天胡三隆X' + cbFanArray[this.FanIndex_Tian3Long]);
        if(dwCHR & GameDef.CHR_TIAN_5_KAN) strArray.push('天胡五坎X' + cbFanArray[this.FanIndex_Tian5Kan]);
        return strArray.join(' ');
    },
   //禁言
   IsNoTalk:function(){
    return this.m_dwGameRule & this.GAME_RULE_JINYAN;
    },
    IsNoCheat:function(){
        return true;
    },

});

GameDef = null;

//////////////////////////////////////////////////////////////////////////////////

