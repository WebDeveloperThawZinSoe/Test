//CMD_LogonServer.js
//登录命令
MDM_GP_LOGON = 1;   //广场登录

//登录模式   SUB_GP_LOGON_ACCOUNTS
SUB_GP_LOGON_GAMEID = 1;                        //帐号登录
SUB_GP_LOGON_ACCOUNTS = 2;                      //I D 登录
SUB_GP_REGISTER_ACCOUNTS = 3;                   //注册帐号
SUB_GP_REGISTER_PHONE = 8;                      //注册手机帐号

//登录结果
SUB_GP_LOGON_SUCCESS = 100;                     //登录成功
SUB_GP_LOGON_FAILURE = 101;                     //登录失败
SUB_GP_LOGON_FINISH = 102;                      //登录完成
SUB_GP_VALIDATE_MBCARD = 103;                  //登录失败
SUB_GP_VALIDATE_PASSPORT = 104;                //登录失败
SUB_GP_VERIFY_RESULT = 105;                    //验证结果
SUB_GP_MATCH_SIGNUPINFO = 106;                 //报名信息
SUB_GP_GROWLEVEL_CONFIG = 107;                 //等级配置

SUB_GP_VERIFY_CODE_RESULT	=108;  									//验证结果
SUB_GP_REAL_AUTH_CONFIG		=110;  									//认证配置
SBU_GP_CLUB_SERVER_INFO = 111;                  //俱乐部端口

//升级提示
SUB_GP_UPDATE_NOTIFY = 200;                     //升级提示

CMD_GP_LogonAccounts = cc.Class({
    ctor :function() {
        //this._name = "CMD_GP_LogonAccounts"
        //系统信息
        this.dwPlazaVersion = 0;                //广场版本
        this.szMachineID="";                    //机器序列
        //登录信息
        this.cbValidateFlags=0;			        //校验标识
        this.szPassword="";                         //登录密码
        this.szAccounts="";                         //登录帐号
        this.szPassPortID="";                      //身份证号

        this.len_szMachineID=33*cc.TCHAR_SIZE;
        this.len_szPassword=window.LEN_MD5*cc.TCHAR_SIZE;
        this.len_szAccounts=window.LEN_ACCOUNTS*cc.TCHAR_SIZE;
        this.len_szPassPortID=19*cc.TCHAR_SIZE;
    },

});

//注册帐号
CMD_GP_RegisterAccounts = cc.Class({
    ctor :function() {
        //this._name = 'CMD_GP_RegisterAccounts'
        this.dwPlazaVersion = 0;			    //广场版本
        this.szMachineID = "";	                //机器序列
        this.szPassWord = "";		            //登录帐号
        this.wFaceID = 0;					    //头像标识
        this.cbGender = 0;					    //用户性别
        this.szAccounts = "";		            //登录帐号
        this.szNickName = "";		            //用户姓名
        this.szPassPortID = "";	                //证件号码
        this.szCompellation = "";               //真实名字
        this.cbValidateFlags = 0;			    //校验标识
        this.dwAgentID=0;						//代理标识
        this.dwSpreaderGameID=0;				//推荐标识


        this.len_szMachineID = 33*cc.TCHAR_SIZE;	      //机器序列 66
        this.len_szPassWord = window.LEN_MD5*cc.TCHAR_SIZE;		  //登录密码 66
        this.len_szAccounts = window.LEN_ACCOUNTS*cc.TCHAR_SIZE;		  //登录帐号 64
        this.len_szNickName = window.LEN_NICKNAME*cc.TCHAR_SIZE;		  //用户姓名 64
        this.len_szPassPortID = 19*cc.TCHAR_SIZE;	  //证件号码 38
        this.len_szCompellation = 16*cc.TCHAR_SIZE;   //真实名字 32
    },
});

//登录成功
CMD_GP_LogonSuccess = cc.Class({
    ctor :function() {
        // this._name = "CMD_GP_LogonSuccess";
        this.wFaceID = 0;						        //头像标识
        this.dwUserID = 0;							//用户 I D
        this.dwGameID = 0;							//游戏 I D
        this.dwGroupID = 0;							//社团标识
        this.dwCustomID = 0;							//自定标识
        this.dwExperience = 0;						//经验数值

        //用户成绩
        this.llUserScore = 0;							//用户金币
        this.llUserInsure = 0;						    //用户银行
        this.llUserIngot = 0;							//用户钻石
        this.dUserBeans = 0;							//用户游戏豆

        //用户信息
        this.cbGender = 0;							//用户性别
        this.cbMoorMachine = 0;						//锁定机器

        this.szAccounts = "";		                    //登录帐号
        this.szNickName = "";	                        //用户昵称
        this.szDynamicPass = "";                     //动态密码
        this.szGroupName = "";                       //社团名字
        this.szClientIP = "";                       //ip

        //配置信息
        this.cbInsureEnabled = 0;					//银行使能标识
        this.cbShowServerStatus = 0;                //显示服务器状态
        this.cbIsAgent = 0;
        this.dwPlatformRatio = 1;                   // 平台倍率
        //this.szHeadImgURL = "";                     //微信头像

        this.len_szAccounts = window.LEN_ACCOUNTS*cc.TCHAR_SIZE;
        this.len_szNickName = window.LEN_NICKNAME*cc.TCHAR_SIZE;
        this.len_szDynamicPass = window.LEN_PASSWORD*cc.TCHAR_SIZE;
        this.len_szGroupName = window.LEN_GROUP_NAME*cc.TCHAR_SIZE;
        this.len_szClientIP = window.LEN_IP*cc.TCHAR_SIZE;
    },

});

//登陆失败
CMD_GP_LogonError = cc.Class({
    ctor :function() {
        //this._name = "CMD_GP_LogonError";
        this.lErrorCode = 0;
        this.szErrorDescribe = '';

        this.len_szErrorDescribe = 256;
    },
});

//俱乐部服务器信息
CMD_GP_ClubServerInfo = cc.Class({
    ctor :function() {
        this.wClubPort = 0;
    },
});


//////////////////////////////////////////////////////////////////////////////////
//列表命令

MDM_GP_SERVER_LIST = 2;                          //列表信息

//获取命令
SUB_GP_GET_LIST = 1;                             //获取列表
SUB_GP_GET_SERVER = 2;	                       //获取房间
SUB_GP_GET_ONLINE = 3	;                          //获取在线
SUB_GP_GET_COLLECTION = 4;                     //获取收藏

//列表信息
SUB_GP_LIST_TYPE = 100;                          //类型列表
SUB_GP_LIST_KIND = 101;                          //种类列表
SUB_GP_LIST_NODE = 102;						   //节点列表
SUB_GP_LIST_PAGE = 103;						   //定制列表
SUB_GP_LIST_SERVER = 104;					   //房间列表
SUB_GP_LIST_MATCH = 105;                        //比赛列表
SUB_GP_VIDEO_OPTION = 106;                      //视频配置

//道具信息
SUB_GP_LIST_PROPERTY_TYPE   = 110;									//道具类型
SUB_GP_LIST_PROPERTY_RELAT  = 111;									//道具关系
SUB_GP_LIST_PROPERTY	    = 112;									//道具列表
SUB_GP_LIST_PROPERTY_SUB    = 113;									//子道具列表

//完成信息
SUB_GP_LIST_FINISH = 200;                       //发送完成
SUB_GP_SERVER_FINISH = 201;                     //房间完成
SUB_GP_MATCH_FINISH			=202; 									//比赛完成
SUB_GP_PROPERTY_FINISH		=203; 									//道具完成



MDM_GP_USER = 4;

SUB_GP_REFURBISH = 110;                          //刷新信息
SUB_GP_REFURBISH_RESULT = 111;                  //刷新结果




//////////////////////////////////////////////////////////////////////////////////
//服务命令

MDM_GP_USER_SERVICE				= 3;							//用户服务

//账号服务
SUB_GP_MODIFY_MACHINE			    = 100;							//修改机器
SUB_GP_MODIFY_LOGON_PASS		    = 101;							//修改密码
SUB_GP_MODIFY_INSURE_PASS		= 102;							//修改密码
SUB_GP_MODIFY_UNDER_WRITE		= 103;							//修改签名
SUB_GP_QUERY_PASS_PORT_ID		= 104;							//查询防沉迷验证
SUB_GP_PASS_PORT_ID_RESULT		= 105;							//查询防沉迷验证结果
SUB_GP_CHECK_PASS_PORT_ID		= 106;							//防沉迷验证

//修改头像
SUB_GP_USER_FACE_INFO			    = 120;							//头像信息
SUB_GP_SYSTEM_FACE_INFO			= 122;							//系统头像
SUB_GP_CUSTOM_FACE_INFO			= 123;							//自定头像
SUB_GP_CUSTOM_FACE_CELL_REQUEST	= 124;							//自定头像请求下一个包

//个人资料
SUB_GP_USER_INDIVIDUAL			 = 140;							//个人资料
SUB_GP_QUERY_INDIVIDUAL	         = 141;							//查询信息
SUB_GP_MODIFY_INDIVIDUAL		     = 152;							//修改资料

//银行服务
SUB_GP_USER_ENABLE_INSURE		    = 160;						//开通银行
SUB_GP_USER_SAVE_SCORE			    = 161;						//存款操作
SUB_GP_USER_TAKE_SCORE			    = 162;						//取款操作
SUB_GP_USER_TRANSFER_SCORE		    = 163;						//转账操作
SUB_GP_USER_INSURE_INFO			    = 164;						//银行资料
SUB_GP_QUERY_INSURE_INFO		        = 165;						//查询银行
SUB_GP_USER_INSURE_SUCCESS		    = 166;						//银行成功
SUB_GP_USER_INSURE_FAILURE		    = 167;						//银行失败
SUB_GP_QUERY_USER_INFO_REQUEST	    = 168;						//查询用户
SUB_GP_QUERY_USER_INFO_RESULT	    = 169;						//用户信息
SUB_GP_USER_INSURE_ENABLE_RESULT    = 170;					    //开通结果

//比赛服务
SUB_GP_MATCH_SIGNUP				    = 200;					    //比赛报名
SUB_GP_MATCH_UNSIGNUP			        = 201;						//取消报名
SUB_GP_MATCH_SIGNUP_RESULT		    = 202;						//报名结果

//签到服务
SUB_GP_CHECKIN_QUERY			      = 220;						//查询签到
SUB_GP_CHECKIN_INFO				  = 221;						//签到信息
SUB_GP_CHECKIN_DONE				  = 222;						//执行签到
SUB_GP_CHECKIN_RESULT			      = 223;						//签到结果

//任务服务
SUB_GP_TASK_LOAD				= 240;							    //加载任务
SUB_GP_TASK_TAKE				= 241;							    //领取任务
SUB_GP_TASK_REWARD		    = 242;							    //任务奖励
SUB_GP_TASK_INFO				= 243;							    //任务信息
SUB_GP_TASK_LIST				= 244;							    //任务信息
SUB_GP_TASK_RESULT			= 245;							    //任务结果

//低保服务
SUB_GP_BASEENSURE_LOAD			= 260;							//加载低保
SUB_GP_BASEENSURE_TAKE			= 261;							//领取低保
SUB_GP_BASEENSURE_PARAMETER		= 262;							//低保参数
SUB_GP_BASEENSURE_RESULT		    = 263;							//低保结果

//推广服务
SUB_GP_SPREAD_QUERY				= 280;							//推广奖励
SUB_GP_SPREAD_INFO				= 281;							//奖励参数

//等级服务
SUB_GP_GROWLEVEL_QUERY			= 300;							//查询等级
SUB_GP_GROWLEVEL_PARAMETER		= 301;							//等级参数
SUB_GP_GROWLEVEL_UPGRADE		    = 302;							//等级升级

//兑换服务
SUB_GP_EXCHANGE_QUERY			    = 320;							//兑换参数
SUB_GP_EXCHANGE_PARAMETER		= 321;							//兑换参数
SUB_GP_PURCHASE_MEMBER			= 322;							//购买会员
SUB_GP_PURCHASE_RESULT			= 323;							//购买结果
SUB_GP_EXCHANGE_SCORE			    = 324;							//兑换游戏币
SUB_GP_EXCHANGE_RESULT			= 325;							//兑换结果

//商城服务
SUB_GP_GAME_SHOP_QUERY_TYPE		= 400;							// 商城查询
SUB_GP_GAME_SHOP_QUERY_KIND		= 401;							// 商城查询
SUB_GP_GAME_SHOP_TYPE_INFO		= 410;							// 类型信息
SUB_GP_GAME_SHOP_KIND_INFO		= 420;							// 种类信息
SUB_GP_GAME_SHOP_EXCHANGE		= 440;							// 商城兑换
SUB_GP_GAME_SHOP_SUCCESS		    = 460;							// 商城成功
SUB_GP_GAME_SHOP_FAILURE		    = 480;							// 商城失败

//操作结果
SUB_GP_OPERATE_SUCCESS			= 500;							//操作成功
SUB_GP_OPERATE_FAILURE			= 501;							//操作失败
//获取对战记录
SUB_GP_GET_BATTLERECORD5		= 520;								//获取对战记录
SUB_GP_BATTLERECORD_RESULT5		= 521;								//获取对战记录

//////////////////////////////////////////////////////////////////////////////////
//修改登录密码
CMD_GP_ModifyLogonPass = cc.Class({
    ctor :function() {
        this.dwUserID = 0;				    // 用户I D
        this.szDesPassword = "";          // 用户密码
        this.szScrPassword = "";      	// 用户密码

        this.index_dwUserID = 0;		    // 用户I D       4
        this.index_szDesPassword = 4;   	// 登录密码      2 * window.LEN_PASSWORD(33)
        this.index_szScrPassword = 70;	// 登录密码      2 * window.LEN_PASSWORD(33)
    },
    getSize :function()
    {
        return 136;
    }
});
//////////////////////////////////////////////////////////////////////////////////
//个人资料
CMD_GP_UserIndividual = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				    // 用户I D
        this.index_dwUserID = 0;		    // 用户I D       4
    },
    getSize :function()
    {
        return 4;
    }
});
//查询信息
CMD_GP_QueryIndividual = cc.Class({
    ctor  :function() {
        this.dwUserID = 0;				    // 用户I D
        this.szPassword = "";             // 用户密码

        this.index_dwUserID = 0;		    // 用户I D       4
        this.index_szPassword = 5;      	// 用户密码      2 * window.LEN_PASSWORD(33)
    },
    getSize :function()
    {
        return 70;
    }
});
//修改资料
CMD_GP_ModifyIndividual = cc.Class({
    ctor:function  () {
        this.cbGender = 0;				    // 用户性别
        this.dwUserID = 0;				    // 用户I D
        this.szPassword = "";             // 用户密码

        this.len_szPassword=window.LEN_PASSWORD*cc.TCHAR_SIZE;      	// 用户密码      2 * window.LEN_PASSWORD(33)
    },
});

//////////////////////////////////////////////////////////////////////////////////
//携带信息 CMD_GP_UserIndividual
DTP_GP_UI_ACCOUNTS			= 1;								//用户账号
DTP_GP_UI_NICKNAME			= 2;								//用户昵称
DTP_GP_UI_USER_NOTE			= 3;								//用户说明
DTP_GP_UI_UNDER_WRITE		    = 4;								//个性签名
DTP_GP_UI_QQ				    = 5;								//Q Q 号码
DTP_GP_UI_EMAIL				= 6;     							//固定电话
DTP_GP_UI_MOBILE_PHONE		= 8;								//移动电话
DTP_GP_UI_COMPELLATION		= 9;								//真实名字
DTP_GP_UI_DWELLING_PLACE	    = 10;								//联系地址
DTP_GP_UI_PASSPORTID    	= 11;									//身份标识
DTP_GP_UI_SPREADER			= 12;									//推广标识
//////////////////////////////////////////////////////////////////////////////////
//开通银行
CMD_GP_UserEnableInsure = cc.Class({
    ctor :function () {
        this.dwUserID = 0;					//用户I D
        this.szLogonPass = "";			//登录密码
        this.szInsurePass = "";			//银行密码
        this.szMachineID = "";		    //机器序列

        this.index_dwUserID = 0;			//用户I D       4
        this.index_szLogonPass = 4;		//登录密码      2 * window.LEN_PASSWORD(33)
        this.index_szInsurePass = 70;    //银行密码      2 * window.LEN_PASSWORD(33)
        this.index_szMachineID = 136;		//机器序列      2 * LEN_MACHINE_ID(33)
    },

    getSize :function()
    {
        return 202;
    }
});

//存入金币
CMD_GP_UserSaveScore = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				//用户I D
        this.lSaveScore = 0;			//存入金币
        this.szMachineID = "";      	//机器序列

        this.index_dwUserID = 0;		    //用户I D       4
        this.index_lSaveScore = 4;		//用户I D       8
        this.index_szMachineID = 12;		//登录密码      2 * LEN_MACHINE_ID(33)
    },

    getSize:function ()
    {
        return 78;
    }
});

//提取金币
CMD_GP_UserTakeScore = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				//用户I D
        this.lTakeScore = 0;			//提取金币
        this.szPassword = "";         // 银行密码
        this.szMachineID = "";      	//机器序列

        this.index_dwUserID = 0;		    //用户I D       4
        this.index_lTakeScore = 4;		//用户I D       8
        this.index_szPassword = 12;		//登录密码      2 * window.LEN_MD5(33)
        this.index_szMachineID = 78;		//登录密码      2 * LEN_MACHINE_ID(33)
    },

    getSize:function ()
    {
        return 144;
    }
});

//修改密码
CMD_GP_ModifyInsurePass = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				    // 用户I D
        this.szDesPassword = "";          // 用户密码
        this.szScrPassword = "";      	// 用户密码

        this.index_dwUserID = 0;		    // 用户I D       4
        this.index_szDesPassword = 4;   	// 登录密码      2 * window.LEN_PASSWORD(33)
        this.index_szScrPassword = 70;	// 登录密码      2 * window.LEN_PASSWORD(33)
    },
    getSize:function ()
    {
        return 136;
    }
});

//开通结果
CMD_GP_UserInsureEnableResult = cc.Class({
    ctor :function () {
        this.cbInsureEnabled = 0;				//用户I D
        this.szDescribeString = "";			//登录密码

        this.index_cbInsureEnabled = 0;		//用户I D       1
        this.index_szDescribeString = 1;		//登录密码      2 * 128
    },

    getSize:function ()
    {
        return 257;
    }
});

//银行成功
CMD_GP_UserInsureSuccess = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				        //用户 I D
        this.llUserScore = 0;				    //用户金币
        this.llUserInsure = 0;				    //银行金币
        this.szDescribeString = "";			//描述消息

        this.index_dwUserID = 0;		        //用户 I D       4
        this.index_llUserScore = 4;		    //用户金币       8
        this.index_llUserInsure = 12;		    //银行金币       8
        this.index_szDescribeString = 20;	//描述消息       2 * 128
    },

    getSize:function ()
    {
        return 276;
    }
});

//银行失败
CMD_GP_UserInsureFailure = cc.Class({
    ctor :function () {
        this.lResultCode = 0;				    //错误代码
        this.szDescribeString = "";			//描述消息

        this.index_lResultCode = 0;		    //错误代码       1
        this.index_szDescribeString = 4;		//描述消息      2 * 128
    },

    getSize:function ()
    {
        return 264;
    }
});
//////////////////////////////////////////////////////////////////////////////////
//查询签到
CMD_GP_CheckInQueryInfo = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				//用户I D
        this.szPassword = "";      	//登录密码

        this.index_dwUserID = 0;		    //用户I D       4
        this.index_szPassword = 4;		//登录密码      2 * window.LEN_PASSWORD(33)
    },

    getSize:function ()
    {
        return 70;
    }
});

//签到信息
CMD_GP_CheckInInfo = cc.Class({
    ctor :function () {
        this.wSeriesDate = 0;				             // 连续日期
        this.bTodayChecked = true;      	             // 签到标识
        this.lRewardGold = new Array(LEN_WEEK);    	 // 奖励金币

        this.index_wSeriesDate = 0;		     // 连续日期      2
        this.index_bTodayChecked = 2;		     // 签到标识      1
        this.index_lRewardGold = 3;		     // 奖励金币      8 * LEN_WEEK(7)
    },

    getSize :function()
    {
        return 59;
    }
});

//执行签到
CMD_GP_CheckInDone = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				      // 用户I D
        this.szPassword = "";      	      // 签到标识
        this.szMachineID = "";    	      // 奖励金币

        this.index_dwUserID = 0;		      // 用户I D       4
        this.index_szPassword = 4;		  // 签到标识      2 * window.LEN_PASSWORD(33)
        this.index_szMachineID = 70;		  // 奖励金币      2 * LEN_MACHINE_ID(33)
    },

    getSize :function()
    {
        return 136;
    }
});
//签到结果
CMD_GP_CheckInResult = cc.Class({
    ctor :function () {
        this.bSuccessed = 0;				      // 成功标识
        this.lScore = 0;      	                  // 当前金币
        this.szNotifyContent = "";    	      // 提示内容

        this.index_bSuccessed = 0;		      // 成功标识      1
        this.index_lScore = 1;		          // 当前金币      8
        this.index_szNotifyContent = 9;		  // 提示内容      2 * 128
    },

    getSize :function()
    {
        return 265;
    }
});

//////////////////////////////////////////////////////////////////////////////////
//操作成功
CMD_GP_OperateSuccess = cc.Class({
    ctor :function () {
        this.lResultCode = 0;				    //错误代码
        this.szDescribeString = "";			//描述消息

        this.len_szDescribeString = 128 * cc.TCHAR_SIZE;		//描述消息      2 * 128
    },
});
//操作失败
CMD_GP_OperateFailure = cc.Class({
    ctor :function () {
        this.lResultCode = 0;				    //错误代码
        this.szDescribeString = "";			//描述消息

        this.index_lResultCode = 0;		    //错误代码      4
        this.index_szDescribeString = 4;		//描述消息      2 * 128
    },

    getSize:function ()
    {
        return 264;
    }
});

CMD_GP_GetBattleRecord = cc.Class({
    ctor :function () {
        this.dwUserID = 0;				    //用户ID
        this.wKindID = 0;   	    		//游戏类型

        this.index_dwUserID = 0;
        this.index_wKindID = 4;
    },
    getSize :function()
    {
        return 6;
    }
});


//////////////////////////////////////////////////////////////////////////////////
FailStr = new Array();
FailStr[0] = '未找到房间！';
FailStr[1] = '房间已满！';
FailStr[2] = '钻石不足！';
FailStr[3] = '房间正在创建！';
FailStr[4] = '服务器异常';
FailStr[5] = '数量已达到上限！';//联盟
FailStr[6] = '未找到';//联盟
FailStr[7] = '游戏已经开始';
FailStr[8] = '权限不足！';
FailStr[9] = '代理禁止成员创建！';
FailStr[10] = '房间解散了！';
FailStr[11] = '同盟会封停这个同盟会！';
FailStr[12] = '非成员';//联盟
FailStr[13] = '自动创建失败';
FailStr[14] = '游戏中，无法赠送！';
FailStr[15] = '游戏中，无法下分！';
FailStr[16] = '操作成功！';//退出俱乐部
FailStr[17] = '修改桌子规则成功！';//退出俱乐部
FailStr[18] = '您被禁止进入游戏房间，详情请联系管理！';//
FailStr[19] = '房间内有不能和您同时进入游戏的玩家，详情请联系管理！';//
FailStr[20] = '房间数量已达上限，无法继续创建！';//
FailStr[21] = '游戏中，不能修改桌子规则。';//

//查询房间
MDM_GP_GET_SERVER			= 7;

SUB_GP_QUERY_BYTYPE			= 1;									//查询金币场
SUB_GP_QUERY_RELINK			= 2;									//查询重连（通用）
SUB_GP_CREATE_ROOM			= 3;									//创建房间
SUB_GP_JOIN_ROOM			= 4;									//加入房间
SUB_GP_GET_CLUB_ROOM		= 5;									//查询列表
SUB_GP_DISS_CLUB_ROOM		= 6;									//解散房间
SUB_GP_QUERY_W_ROOMCARD     = 7;
SUB_GP_CLUB_SET				= 9;								    //俱乐部设置
SUB_GP_GM_DISS_ROOM			= 10;

SUB_GP_MODIFY_TABLE_RULE	= 11;                                   //修改桌子规则

SUB_GP_GIVE_SCORE		    = 13;									//游戏中锁定财富
SUB_GP_TAKE_SCORE		    = 14;									//游戏中锁定财富
SUB_GP_EXIT_CLUB		    = 15;									//退出俱乐部
SUB_GP_CLUB_ROOM_SET		= 17;									//俱乐部设置
SUB_GP_CLUB_REVENUE_SET		= 18;									//俱乐部设置
SUB_GP_GET_OWN_ROOM         = 19;                                   //拥有房间 代开
SUB_GP_JOIN_ROOM2           = 21;
SUB_GP_GET_ROOMEX		    = 31;									//创建房间

SUB_GP_FAILED               = 100;                  //失败信息
SUB_GP_QUERYRES             = 101;                  //查询结果
SUB_GP_CREATE_SUCCESS       = 102;                  //创建查询结果
SUB_GP_CLUB_ROOM	        = 103;
SUB_GP_CLUB_USER_LIST	    = 104;
SUB_GP_CLUB_DISS_SUC        = 105;
SUB_GP_ROOMCARD             = 106;
SUB_GP_AUTO_ROOM_SUC        = 107;
SUB_GP_CLUB_SET_SUC		    = 108;								//自动创建配置成功
SUB_GP_JOIN_ROOM_RES        = 109;
SUB_GP_OWN_ROOM_INFO        = 110;

SUB_GP_SERVER_TYPE_LIST     = 112;
SUB_GP_CLUB_REVENUE_INFO    = 113;
SUB_GP_GET_ROOMEX_RES		= 114;									//房间列表

SUB_GP_RES_MSG              = 200;
//查询金币场
//查询金币场
CMD_GP_C_Query_ByType = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_Query_ByType";
        this.dwUserID = 0;
        this.wKindID = 0;							//游戏ID
        this.wType = 0; //房间类型
    },
});
//查询重连
CMD_GP_C_Relink = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_Relink";
        this.dwUserID = 0;
    },
});

//查询
CMD_GP_C_Query_UsingCard = cc.Class({
    ctor :function () {
        //this._name="CMD_GP_C_Query_UsingCard";
        this.dwUserID = 0;
    },
});
//俱乐部设置
CMD_GP_C_ClubSet = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ClubSet";
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.dwLeagueID = 0;
        this.bySeeNullRoom = 0;					//成员仅见空房
        this.byMemberCreat = 0;					//成员开房
    },
});
//俱乐部设置
CMD_GP_C_ClubRoomSet = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ClubRoomSet";
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.dwLeagueID = 0;
        this.byNoChat = 0;					//成员仅见空房
    },
});
//俱乐部设置
CMD_GP_C_ClubRevenueSet = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ClubRevenueSet";
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.dwLeagueID = 0;
        this.dwMark = 0;                //抽水模式 0每局 1第一句 2每局赢家 3每局大赢家 4(16)总局赢家 5总局大赢家
        this.dwLimit = 0;               //最低抽水
        this.wRate = 0;                 //千分比
        this.wCnt = 0;	                //大赢家抽水个数
        this.byNoUpdateScore = 0;	    //不即时到账
    },
});
//俱乐部赠送
CMD_GP_C_ClubGive = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ClubGive";
        this.dwUserID = 0;
        this.szPassWord = "";
        this.dwTagUserID = 0;
        this.lScore = 0;					//金额
        this.byType = 0;					//种类
        this.dwClubID1 = 0;
        this.dwClubID2 = 0;
        this.szRemark="";//备注

        this.len_szRemark = cc.TCHAR_SIZE*128;
        this.len_szPassWord = window.LEN_MD5*cc.TCHAR_SIZE;		  //登录密码 66
    },
});

CMD_GP_C_ExitClub = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ExitClub";
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.szPassWord = "";
        this.len_szPassWord = window.LEN_PASSWORD*cc.TCHAR_SIZE;		  //登录密码 66
    },
});
//断线返回
CMD_GP_S_ReturnServer = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_ReturnServer";
        this.wKindID=0; //游戏类型
        this.wServerType=0; //服务器类型
        this.llEnterScore=0; //游戏类型
        this.wServerPort=0;//房间端口
        this.szServerAddr="";//房间地址
        this.byTipsReturn=0;    //是否提示重连
        this.len_szServerAddr = cc.TCHAR_SIZE*32;
    },
});

//断线返回
CMD_GP_S_ReturnRoom = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_ReturnRoom";
        this.wKindID=0; //游戏类型
        this.wServerType=0; //服务器类型
        this.llEnterScore=0; //游戏类型
        this.wServerPort=0;//房间端口
        this.szServerAddr="";//房间地址
        this.dwRoomID=0;    //房间号
        this.dwClubID=0;    //俱乐部
        this.byPartID=0;
        this.len_szServerAddr = cc.TCHAR_SIZE*32;
    },
});

//创建新桌
CMD_GP_C_CreateRoom = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_CreateRoom";
        this.dwUserID=0;
        this.wKindID=0;
        this.dwRules=new Array(5);     //游戏规则
        this.dwServerRules=0; //服务器规则

        this.dwClubID = 0; //俱乐部ID
        this.byPartID = 0; //俱乐部子ID

        this.szRoomName = '';
        this.dwRoomID = 0;
        this.len_szRoomName = 16 * cc.TCHAR_SIZE;
//俱乐部规则
        this.cbClubKind = 0;        //俱乐部类型
        this.llSitScore = 0;        //参与分
        this.llStandScore = 0;      //淘汰分

        this.dwBigRevRules = 0;     //大局表情规则
        this.dwBigMinScore = 0;     //大局表情起曾分
        this.dwBigCnt = 0;          //大局百分比或固定数量

        this.dwSmallRevRules = 0;     //小局表情规则
        this.dwSmallMinScore = 0;     //小局表情起曾分
        this.dwSmallCnt = 0;          //小局百分比或固定数量

        this.cbReturnType = 0;        //反水类型
        this.bNegativeScore = 0;        //反水类型
        this.dwMagnification = 0;       //倍率
        this.szTag = '';                //标签

        this.len_szTag = 10 * cc.TCHAR_SIZE;
    },
});

//修改桌子规则
CMD_GP_C_ModifyTableRule = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_ModifyTableRule";
        this.dwUserID=0;
        this.dwRoomID=0;
//俱乐部规则
        this.llSitScore = 0;        //参与分
        this.llStandScore = 0;      //淘汰分

        this.dwBigRevRules = 0;     //大局表情规则
        this.dwBigMinScore = 0;     //大局表情起曾分
        this.dwBigCnt = 0;          //大局百分比或固定数量

        this.dwSmallRevRules = 0;     //小局表情规则
        this.dwSmallMinScore = 0;     //小局表情起曾分
        this.dwSmallCnt = 0;          //小局百分比或固定数量

        this.cbReturnType = 0;        //反水类型
        this.bNegativeScore = 0;        //反水类型
        this.dwMagnification = 0;       //倍率
        this.szTag = '';                //标签

        this.len_szTag = 10 * cc.TCHAR_SIZE;
    },
});

//创建新桌
CMD_GP_S_CreatSuccess = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_CreatSuccess";
        this.dwRoomID=0;
        this.dwClubID=0;
        this.wKindID=0;
    },
});

//加入房间
CMD_GP_C_GetRoom = cc.Class({
    ctor :function () {
        this._name="CMD_GP_C_GetRoom";
        this.dwUserID=0;
        this.dwRoomID=0;
        this.dwClubID=0;
    },
});

//断线返回
CMD_GP_S_Failed = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_Failed";
        this.byRes = 0;								//0 未找到房间 1 房间已满
    },
});
//断线返回
CMD_GP_S_Msg = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_Msg";
        this.szMsg = '';
        this.len_szMsg = 256*cc.TCHAR_SIZE;
    },
});

//俱乐部房间
CMD_GP_C_ClubRoom = cc.Class({
    ctor :function () {
        //this._name="CMD_GP_C_ClubRoom";
        this.dwClubID = 0;
        this.dwLeagueID = 0;
    },
});
//解散房间
CMD_GP_C_DissClubRoom = cc.Class({
    ctor :function () {
        //this._name="CMD_GP_C_DissClubRoom";
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.dwLeagueID = 0;
        this.dwRoomID = 0;
        this.byForce = 0;
    },
});

ServerRoomUserInfo = cc.Class({
    ctor :function () {
        this.dwUserID = 0;
        this.dwRoomID = 0;
        this.wChairID = 0;
        this.cbUserStatus = 0;
    },
});

ServerRoomInfo = cc.Class({
    ctor :function () {
        this.dwRoomID = 0;
        this.dwClubID = 0;
        this.byPartID = 0;
        this.wKindID = 0;
        this.dwRules = new Array(5);
        this.wMaxChairCount = 0;
        this.dwServerRules = 0;
        this.wProgress = 0;
        this.dwCreateTime = 0;
        this.dwCreaterID = 0;
        this.byPlayerCnt = 0;
        this.szRoomName = '';
        this.len_szRoomName = 16*cc.TCHAR_SIZE;

        //俱乐部规则
        this.llSitScore = 0;        //参与分
        this.llStandScore = 0;      //淘汰分

        this.dwBigRevRules = 0;     //大局表情规则
        this.dwBigMinScore = 0;     //大局表情起曾分
        this.dwBigCnt = 0;          //大局百分比或固定数量

        this.dwSmallRevRules = 0;     //小局表情规则
        this.dwSmallMinScore = 0;     //小局表情起曾分
        this.dwSmallCnt = 0;          //小局百分比或固定数量

        this.cbReturnType = 0;        //反水类型
        this.bNegativeScore = 0;        //反水类型
        this.dwMagnification = 0;       //倍率
        this.szTag = '';                //标签

        this.len_szTag = 10 * cc.TCHAR_SIZE;
    },
});

//房间列表
CMD_GP_S_ClubRevenueInfo = cc.Class({
    ctor :function () {
        this._name="CMD_GP_S_ClubRevenueInfo";
        this.dwClubID = 0;							//房间ID
        this.dwMark = 0;
        this.dwLimit = 0;
        this.wRate = 0;
        this.wCnt = 0;
        this.byNoUpdateScore = 0;
    },
});

//房间列表
CMD_GP_S_ClubRoomInfo = cc.Class({
    ctor :function () {
        //this._name="CMD_GP_S_ClubRoomInfo";
        this.bySeeNull = 0;
        this.byMemberCreat = 0;
        this.byNoChat = 0;
        this.dwClubID = 0;							//房间ID
        this.wRoomCnt = 0;
    },
});
//玩家列表
CMD_GP_S_ClubUserInfo = cc.Class({
    ctor :function () {
        //this._name="CMD_GP_S_ClubUserInfo";
        this.dwClubID = 0;
        this.wPlayerCnt = 0;
        this.UserInfo = null;	//ServerRoomUserInfo
    },
});

CMD_GP_S_UsingCard = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_S_UsingCard";
        this.lUsingCard = 0;
    },
});

CMD_GP_C_GetRoomEx = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_C_GetRoomEx";
        this.dwClubID = new Array(10);
        this.dwRoomID = new Array(40);
    },
});

CMD_GP_C_GetRoomExRes = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_C_GetRoomExRes";
        this.wClubCnt = 0;
        this.wRoomCnt = 0;
        this.dwClubID = new Array(10);
        this.wClubRoomCnt = new Array(10);
        //this.RoomInfo = new Array(50); ServerRoomInfo
    },
});



//查看代开
CMD_GP_C_OwnRoom = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_C_OwnRoom";
        this.dwUserID = 0;
    },
});
OwnRoomInfo = cc.Class({
    ctor :function () {
       // this._name="OwnRoomInfo";
        this.dwRoomID = 0;
        this.wKindID = 0;
        this.dwRules = new Array(5);
        this.dwServerRules = 0;
        this.wProgress = 0;
        this.dwCreatTime = 0;
        this.byPlayerCnt = 0;
        this.dwUserID = new Array(10);
    },
});
//代开房间列表
CMD_GP_S_OwnRoomInfo = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_S_OwnRoomInfo";
        this.wCnt = 0;
        this.RoomInfo = new Array();
        for(var i=0;i<MAX_DK_ROOM;i++) this.RoomInfo[i] = new OwnRoomInfo();
    },
});

//////////////////////////////////////////////////////////////////////////
//
MDM_GP_MANAGER			= 9999;

SUB_GP_WARNING			= 1;									//查询金币场
SUB_GP_DESTROY			= 2;									//查询重连（通用）


CMD_GP_C_Warning = cc.Class({
    ctor :function () {
       // this._name="CMD_GP_C_Warning";
        this.bWarning = 0;
    },
});
