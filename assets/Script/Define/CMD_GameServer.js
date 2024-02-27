//CMD_GameServer.js
//////////////////////////////////////////////////////////////////////////////////
//登录命令
MDM_GR_LOGON = 1;   //登录信息

//登录模式
SUB_GR_LOGON_USERID = 1;							//I D 登录
SUB_GR_LOGON_MOBILE = 2;						//手机登录
SUB_GR_LOGON_ACCOUNTS = 3;					//帐户登录

//登录结果
SUB_GR_LOGON_SUCCESS = 100;						//登录成功
SUB_GR_LOGON_ERROR = 101;						//登录失败
SUB_GR_LOGON_FINISH = 102;						//登录完成

//升级提示
SUB_GR_UPDATE_NOTIFY = 200;						//升级提示


//I D 登录
CMD_GR_LogonUserID = cc.Class({
    ctor:function() {
        this.dwPlazaVersion = cc.VERSION_PLAZA;                //广场版本
        this.dwFrameVersion = cc.VERSION_PLAZA;                //框架版本
        this.dwProcessVersion = 16777216;              //进程版本
        this.dwUserID = 0;                       //用户 I D
        this.szPassword = "";                   //登录密码
        this.szServerPasswd = "";              //房间密码
        this.szMachineID = "";	              //机器序列
        this.wKindID = 0;                        //类型索引

        this.len_szPassword = window.LEN_MD5*cc.TCHAR_SIZE;           //登录密码
        this.len_szServerPasswd = 33*cc.TCHAR_SIZE;      //房间密码
        this.len_szMachineID = 33*cc.TCHAR_SIZE;	          //机器序列
    },
});

//登陆失败
CMD_GR_LogonFailure = cc.Class({
    ctor:function() {
        this._name = "CMD_GR_LogonFailure";
        this.lErrorCode = 0;
        this.szErrorDescribe = '';

        this.len_szErrorDescribe = 256;
    },
});


//////////////////////////////////////////////////////////////////////////////////

//配置命令

MDM_GR_CONFIG = 2;								//配置信息

SUB_GR_CONFIG_COLUMN = 100;						//列表配置
SUB_GR_CONFIG_SERVER = 101;						//房间配置
SUB_GR_CONFIG_PROPERTY = 102;					//道具配置
SUB_GR_CONFIG_FINISH = 103;						//配置完成
SUB_GR_CONFIG_USER_RIGHT = 104;					//玩家权限

//房间配置
CMD_GR_ConfigServer = cc.Class({
    ctor:function() {
        //房间属性
        this.wTableCount = 0;					//桌子数目
        this.wChairCount = 0;					//椅子数目
        //房间配置
        this.wServerType = 0;					//房间类型
        this.dwServerRule = 0;				    //房间规则
    },
});

//////////////////////////////////////////////////////////////////////////////////
//用户命令

MDM_GR_USER = 3;									//用户信息

//用户动作
SUB_GR_USER_RULE = 1;								//用户规则
SUB_GR_USER_LOOKON = 2;							//旁观请求
SUB_GR_USER_SITDOWN = 3;							//坐下请求
SUB_GR_USER_STANDUP = 4;							//起立请求
SUB_GR_USER_INVITE = 5;							//用户邀请
SUB_GR_USER_INVITE_REQ = 6;						//邀请请求
SUB_GR_USER_REPULSE_SIT = 7;						//拒绝玩家坐下
SUB_GR_USER_KICK_USER = 8;                      //踢出用户
SUB_GR_USER_INFO_REQ = 9;                       //请求用户信息
SUB_GR_USER_CHAIR_REQ = 10;                     //请求更换位置
SUB_GR_USER_CHAIR_INFO_REQ = 11;               //请求椅子用户信息
SUB_GR_USER_WAIT_DISTRIBUTE = 12;
SUB_GR_USER_ENTER_ROOM		= 13;									//进入房间

//用户状态
SUB_GR_USER_ENTER = 100;						   //用户进入
SUB_GR_USER_SCORE = 101;						   //用户分数
SUB_GR_USER_STATUS = 102;					   //用户状态
SUB_GR_REQUEST_FAILURE = 103;				   //请求失败
SUB_GR_USER_GAME_DATA	=	104;			//用户游戏数据

//聊天命令
SUB_GR_USER_CHAT = 201;						   //聊天消息
SUB_GR_USER_EXPRESSION = 202;				   //表情消息
SUB_GR_WISPER_CHAT = 203;					   //私聊消息
SUB_GR_WISPER_EXPRESSION = 204;				   //私聊表情
SUB_GR_COLLOQUY_CHAT		=205;									//会话消息
SUB_GR_COLLOQUY_EXPRESSION	=206;									//会话表情




//道具命令
SUB_GR_PROPERTY_BUY = 300;					   //购买道具
SUB_GR_PROPERTY_SUCCESS = 301;				   //道具成功
SUB_GR_PROPERTY_FAILURE = 302;				   //道具失败
SUB_GR_PROPERTY_MESSAGE = 303;                 //道具消息
SUB_GR_PROPERTY_EFFECT = 304;                  //道具效应
SUB_GR_PROPERTY_TRUMPET = 305;                 //喇叭消息

SUB_GR_USER_QUEUE_REQ = 400;					   //请求进入等待队列
SUB_GR_USER_QUEUE = 401;						   //进入等待队列
SUB_GR_USER_QUEUE_FIELD = 402;				   //等待队列请求失败
SUB_GR_USER_QUEUE_COM = 404;					   //队列分配完毕
SUB_GR_USER_QUEUE_REQ_AGAIN	= 405;			   //再次请求队列
SUB_GR_USER_CONTINUE_GAME = 406;			   //玩家游戏内继续游戏


//坐下请求
CMD_GR_UserSitDown = cc.Class({
    ctor:function() {
        this.wTableID = 0;							//桌子位置
        this.wChairID = 0;							//椅子位置
        this.szPassword = "";                          //桌子密码
        this.len_szPassword = window.LEN_PASSWORD*cc.TCHAR_SIZE;                          //桌子密码
    },

});

//坐下请求
CMD_GR_UserEnterRoom = cc.Class({
    ctor:function() {
        this.dwRoomID = 0;
        this.dwClubID = 0;
    },
});

//////////////////////////////////////////////////////////////////////////////////
//状态命令

MDM_GR_STATUS = 4;							   //状态信息

SUB_GR_TABLE_INFO = 100;						   //桌子信息
SUB_GR_TABLE_STATUS = 101;					   //桌子状态

//桌子信息
CMD_GR_TableInfo = cc.Class({
    ctor:function() {
        //this._name = 'CMD_GR_TableInfo'
        this.wTableCount = 0;           //桌子数目
        this.TableStatusArray = null; //桌子状态 tagTableStatus array
    },
});

//桌子状态
CMD_GR_TableStatus = cc.Class({
    ctor:function() {
       // this._name = 'CMD_GR_TableStatus'
        this.wTableID = 0;                                           //桌子号码
        this.TableStatus = new tagTableStatus();                          //桌子状态
    },
});
//////////////////////////////////////////////////////////////////////////////////
//银行命令
MDM_GR_INSURE = 5;							   //用户信息

//银行命令
SUB_GR_ENABLE_INSURE_REQUEST = 1									//开通银行
SUB_GR_QUERY_INSURE_INFO = 2;				  //查询银行
SUB_GR_SAVE_SCORE_REQUEST = 3;				  //存款操作
SUB_GR_TAKE_SCORE_REQUEST = 4;				  //取款操作
SUB_GR_TRANSFER_SCORE_REQUEST = 5;			  //取款操作
SUB_GR_QUERY_USER_INFO_REQUEST = 6;		  //查询用户

SUB_GR_USER_INSURE_INFO = 100;          		  //银行资料
SUB_GR_USER_INSURE_SUCCESS = 101;			  //银行成功
SUB_GR_USER_INSURE_FAILURE = 102;             //银行失败
SUB_GR_USER_TRANSFER_USER_INFO = 103;		  //用户资料
SUB_GR_USER_INSURE_ENABLE_RESULT = 104;							//开通结果



//////////////////////////////////////////////////////////////////////////////////
//管理命令

MDM_GR_MANAGE = 9;									//管理命令

SUB_GR_SEND_WARNING = 1;							//发送警告
SUB_GR_SEND_MESSAGE = 2;							//发送消息
SUB_GR_LOOK_USER_IP = 3;							//查看地址
SUB_GR_KILL_USER = 4;								//踢出用户
SUB_GR_LIMIT_ACCOUNS = 5;							//禁用帐户
SUB_GR_SET_USER_RIGHT = 6;							//权限设置

//房间设置
SUB_GR_QUERY_OPTION = 7;							//查询设置
SUB_GR_OPTION_SERVER = 8;							//房间设置
SUB_GR_OPTION_CURRENT = 9;							//当前设置
SUB_GR_LIMIT_USER_CHAT = 10;						//限制聊天
SUB_GR_KICK_ALL_USER = 11;							//踢出用户
SUB_GR_DISMISSGAME = 12;							//解散游戏

//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//比赛命令

MDM_GR_MATCH = 10;                                     //比赛命令

SUB_GR_MATCH_FEE = 400;								//报名费用
SUB_GR_MATCH_NUM = 401;								//等待人数
SUB_GR_LEAVE_MATCH = 402;							//退出比赛
SUB_GR_MATCH_INFO = 403;								//比赛信息
SUB_GR_MATCH_WAIT_TIP = 404;							//等待提示
SUB_GR_MATCH_RESULT = 405;							//比赛结果
SUB_GR_MATCH_STATUS = 406;							//比赛状态
SUB_GR_MATCH_DESC = 408;								//比赛描述
SUB_GR_MATCH_GOLDUPDATE = 409;						//金币更新
SUB_GR_MATCH_ELIMINATE = 410	;						//比赛淘汰


//////////////////////////////////////////////////////////////////////////////////

//游戏命令

MDM_GF_GAME = 200;								        //游戏命令


//////////////////////////////////////////////////////////////////////////////////
//框架命令

MDM_GF_FRAME = 100;									//框架命令

//用户命令
SUB_GF_GAME_OPTION = 1;								//游戏配置
SUB_GF_USER_READY = 2;								//用户准备
SUB_GF_LOOKON_CONFIG = 3;							//旁观配置

SUB_GF_GPS_INFO_SAVE = 4;									//地理位置
SUB_GF_GPS_INFO_GET = 5;									//地理位置
SUB_GF_LOOKON_SIT = 6;

//聊天命令
SUB_GF_USER_CHAT			= 10									//用户聊天
SUB_GF_USER_EXPRESSION		= 11									//用户表情
SUB_GF_USER_VOICE			= 12									//用户语音


//游戏信息
SUB_GF_GAME_STATUS = 100;									//游戏状态
SUB_GF_GAME_SCENE = 101;								//游戏场景
SUB_GF_LOOKON_STATUS = 102;							//旁观状态
SUB_GF_GPS_GET_RES = 110;									//地理位置
//系统消息
SUB_GF_SYSTEM_MESSAGE = 200;							//系统消息
SUB_GF_ACTION_MESSAGE = 201;							//动作消息

//////////////////////////////////////////////////////////////////////////////////

//钻石框架


MDM_GF_CARDROOM				= 101;									//钻石命令

SUB_GF_CREATER_DISSOLVE		= 1;								   //房主解散
SUB_GF_USER_DISSOLVE		= 2;							   //申请解散
SUB_GF_USER_CHOOSE			= 3	;							   //解散操作

SUB_GF_ROOM_INFO			= 100;								//游戏状态
SUB_GF_ROOM_STATUS			= 101;							//游戏状态
SUB_GF_ROOM_GAME_FINISH     = 102;

SUB_GF_ROOM_DISSOLVE		= 105;								//房主解散
SUB_GF_ROOM_USER_DISSOLVE   = 106                               	//发起解散
SUB_GF_ROOM_DISSOLVE_STATUS	= 107;								//解散状态
SUB_GF_ROOM_USERCHOOSE	    = 108;								//用户投票
SUB_GF_ROOM_DISSOLVE_RES    = 109;                               //投票结果


//游戏配置
CMD_GF_UserChoose = cc.Class({
    ctor:function() {
        this._name = 'CMD_GF_UserChoose'
        this.byChoose = 0;
    },
});

CMD_GF_UserChooseRes = cc.Class({
    ctor:function() {
        this._name = 'CMD_GF_UserChooseRes'
        this.wChairID=0;
        this.byRes=0;
    },
});


CMD_GF_RoomInfo = cc.Class({
    ctor:function() {
       this._name = 'CMD_GF_RoomInfo'
       this.dwRoomID=0;							//房间ID
       this.dwRoomID2=0;							//房间ID
       this.dwCreaterID=0;						//房主ID
       this.dwRulesArr=new Array(5);							//游戏规则
       this.dwServerRules=0;							//游戏规则
       this.dwClubID=0;
       this.szRoomName='';
       this.len_szRoomName = 16*cc.TCHAR_SIZE;
    },
});
CMD_GF_RoomStatus = cc.Class({
    ctor:function() {
       //this._name = 'CMD_GF_RoomStatus'
       this.wProgress = 0;							//当前局数
       this.bLockArr = null;
    },
});
//申请解散
CMD_GF_UserDissolve = cc.Class({
    ctor:function() {
       this._name = 'CMD_GF_UserDissolve'
       this.dwDisUserID = 0;								//申请玩家ID
       this.dwAllCountDown = 0;
    },
});
//解散状态
CMD_GF_RoomDissolve = cc.Class({
    ctor:function() {
       this._name = 'CMD_GF_RoomDissolve'
       this.dwDisUserID = 0;								//申请玩家ID
       this.dwCountDown = 0;
       this.dwAllCountDown = 0;
       this.byChoose = null;				//玩家选择 0未选 1同意 2否决
    },
});
//解散结果
CMD_GF_DissolveRes = cc.Class({
    ctor:function() {
       this._name = 'CMD_GF_DissolveRes'
       this.bDissolve = 0;									//申请结果
    },
});

//////////////////////////////////////////////////////////////////////////////////

MDM_CM_SYSTEM = 1000;								//系统命令

SUB_CM_SYSTEM_MESSAGE = 1;							//系统消息
SUB_CM_ACTION_MESSAGE = 2;							//动作消息
SUB_CM_DOWN_LOAD_MODULE = 3;						//下载消息


//类型掩码
SMT_CHAT = 0x0001;							             //聊天消息
SMT_EJECT = 0x0002;								         //弹出消息
SMT_GLOBAL = 0x0004;								     //全局消息
SMT_PROMPT = 0x0008;								     //提示消息
SMT_TABLE_ROLL = 0x0010;								 //滚动消息

//控制掩码
SMT_CLOSE_ROOM = 0x0100;								//关闭房间
SMT_CLOSE_GAME = 0x0200;								//关闭游戏
SMT_CLOSE_LINK = 0x0400;								//中断连接


CMD_CM_SystemMessage = cc.Class({
    ctor:function() {
        //this._name = 'CMD_CM_SystemMessage'
        this.wType = 0;								//消息类型
        this.wLength = 0;							//消息长度
        this.szString = '';						    //消息内容

        this.len_szString = 1024;
    },
});
//////////////////////////////////////////////////////////////////////////////////

//心跳命令
MDM_KN_COMMAND = 0
SUB_KN_CLIENT_HEART = 3;


//////////////////////////////////////////////////////////////////////////////////


//用户状态
CMD_GR_UserStatus = cc.Class({
    ctor:function() {
        //this._name='CMD_GR_UserStatus'
        this.dwUserID = 0;							//用户标识
        this.UserStatus = new tagUserStatus();		//用户状态
    },
});

//游戏配置
CMD_GF_GameOption = cc.Class({
    ctor:function() {
       // this._name = "CMD_GF_GameOption"
        this.cbAllowLookon = 0;							      //旁观标志
        this.dwFrameVersion = 0;		                          //框架版本
        this.dwClientVersion = 0;                              //游戏版本
    },
});

//游戏环境
CMD_GF_GameStatus = cc.Class({
    ctor:function() {
        this.bGameStatus = 0;							      //游戏状态
        this.bAllowLookon = 1;		                           //允许旁观
    },
});

//在线信息
SUB_GR_KINE_ONLINE = 300;                       //类型在线
SUB_GR_SERVER_ONLINE = 301;                     //房间在线
SUB_GR_ONLINE_FINISH = 302;                     //在线完成

//+++++++录音和播放需要添加的内容    start++++++
//手机端使用的声音索引结构体
CMD_GF_C_UserVoice = cc.Class({
    ctor:function(){
        this._name = 'CMD_GF_C_UserVoice'
        this.byPlatform = 0;        //0原生 1微信H5
        this.dwTargetUserID = 0;
        this.szVID = '';
        this.len_szVID = 256*cc.TCHAR_SIZE;
	},
});
CMD_GF_S_UserVoice = cc.Class({
    ctor:function(){
        //this._name = 'CMD_GF_S_UserVoice'
        this.byPlatform = 0;
        this.dwSendUserID = 0;
        this.dwTargetUserID = 0;
        this.szVID = '';
        this.len_szVID = 256*cc.TCHAR_SIZE;
	},
});
//+++++++录音和播放需要添加的内容    end++++++
//快捷短语
CMD_GF_C_UserExpression = cc.Class({
	ctor:function(){
        this.wItemIndex = 0;                                        //短语索引
        this.dwTargetUserID = 0;						//目标用户
	},
});
//快捷短语
CMD_GR_S_UserExpression = cc.Class
({
	ctor:function(){
        this._name = "CMD_GR_S_UserExpression"
		this.wItemIndex = 0;                                        //短语索引
        this.dwSendUserID = 0;                                      //发送用户
        this.dwTargetUserID = 0;						//目标用户
	},

});

//用户聊天
CMD_GF_C_UserChat = cc.Class
({
	ctor:function(){
		this.wChatLength = 0;                                       //信息长度
        this.dwChatColor = 0;                                       //信息颜色
        this.dwTargetUserID = 0;						//目标用户
		this.szChatString = '';                                     //聊天信息
		this.len_szChatString = 256;
	},
});

//用户聊天
CMD_GF_S_UserChat = cc.Class({
	ctor:function(){
        this._name = 'CMD_GF_S_UserChat'
		this.wChatLength = 0;                                       //信息长度
		this.dwChatColor = 0;                                       //信息颜色
        this.dwSendUserID = 0;                                      //发送用户
        this.dwTargetUserID = 0;						            //目标用户
        this.szChatString = '';                                     //聊天信息
        this.len_szChatString = 128*cc.TCHAR_SIZE;
	},

});

//////////////////////////////////////////////////////////////////////////////////
//携带信息

//其他信息
DTP_GR_TABLE_PASSWORD = 1;					//桌子密码

//用户属性
DTP_NULL = 0;
DTP_GR_NICK_NAME = 10;						//用户昵称
DTP_GR_GROUP_NAME = 11;						//社团名字
DTP_GR_UNDER_WRITE = 12;					//个性签名

DTP_GR_MOBILE_PHONE	= 		14;									//手机号码
DTP_GR_IP		= 			15;								//IP地址
//附加信息
DTP_GR_USER_NOTE = 20;						//用户备注
DTP_GR_CUSTOM_FACE = 21;						//自定头像
tagDataDescribe = cc.Class({
    ctor :function () {
       // this._name='tagDataDescribe'
        this.wDataSize = 0;
        this.wDataDescribe = 0;
    },
});


SUB_S_TIMER = 300;								//时间命令

//用户分数
CMD_GR_UserScore = cc.Class({
    ctor:function() {
        this._name='CMD_GR_UserScore'
        this.dwUserID = 0;						//用户标识
        this.UserScore = new tagUserScore();	//积分信息
    },
});

//起立请求
CMD_GR_UserStandUp = cc.Class({
    ctor:function() {
        this.wTableID = 0;                              //桌子位置
        this.wChairID = 0;                            //椅子位置
        this.cbForceLeave = 0;                       //强行离开
    },
});

//请求失败
CMD_GR_RequestFailure = cc.Class({
    ctor:function() {
        this.dwNothing = 0;
        this.szDescribeString = "";                          //描述信息
        this.len_szDescribeString = 256*cc.TCHAR_SIZE;                     //描述信息
    },
});

//费用提醒
CMD_GR_Match_Fee = cc.Class({
    ctor:function() {
        this.lMatchFee = 0;                                     //报名费用
        this.szNotifyContent = "";                              //提示内容

        this.index_lMatchFee = 0;
        this.index_szNotifyContent = 4;
    },

    getSize:function()
    {
        return 128*cc.TCHAR_SIZE+4;
    },
});

//金币更新
CMD_GR_MatchGoldUpdate = cc.Class({
    ctor:function() {
        this.lCurrGold = 0;                         //当前金币
        this.lCurrIngot = 0;                        //当前元宝
        this.dwCurrExprience = 0;					                //当前经验

        this.index_lCurrGold = 0;                                    //当前金币
        this.index_lCurrIngot = 8;                                   //当前元宝
        this.index_dwCurrExprience = 16;                             //当前经验
    },

    getSize:function ()
    {
        return 20;
    },
});
CMD_GR_S_LookOnUser = cc.Class({
    ctor:function(){
        this._name = 'LookOnUser'
        this.dwUserChairID = 0;

	},
});
