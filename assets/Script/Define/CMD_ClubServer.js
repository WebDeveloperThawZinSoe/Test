
CLUB_KIND_0 = 0;//普通俱乐部
CLUB_KIND_1 = 1;//一级代俱乐部 - 积分
CLUB_KIND_2 = 2;//无限代俱乐部 - 积分

OPERATE_CODE_APPLY = 1           //申请
OPERATE_CODE_SET = 2           //
OPERATE_CODE_DEL = 3

CLUB_SCORE_LOGON_PSW = 0        //积分密码

UpdateCode_Apply = 0x0001	//申请
UpdateCode_Member = 0x0002	//成员
UpdateCode_Score = 0x0004	//积分


CLUB_LEVEL_OWNER = 9        //部长
CLUB_LEVEL_MANAGER = 8      //管理员
CLUB_LEVEL_PARTNER = 6      //合伙人
CLUB_LEVEL_MEMBER = 3       //成员
CLUB_LEVEL_APPLY = 2        //申请
CLUB_LEVEL_BAN = 1          //禁止
CLUB_LEVEL_NONE = 0         //无


CLUB_GAME_RULE_1 = 0x00000001	//大赢家
CLUB_GAME_RULE_2 = 0x00000002	//赢家
CLUB_GAME_RULE_3 = 0x00000004	//所有人
CLUB_GAME_RULE_4 = 0x00000010	//固定
CLUB_GAME_RULE_5 = 0x00000020	//比例

CLUB_SET_RULE_0 = 0x00000004   //显示排行榜

//////////////////////////////////////////////////////////////////////////////////
//主消息
MDM_GC_GAME = 1;
cc.GAME_HEAD_SIZE = 4;
GameHead = cc.Class({
    ctor:function(){
        this.wMainCmdID = 0;
        this.wSubCmdID = 0;
    }
});
//////////////////////////////////////////////////////////////////////////////////
//主消息
MDM_GC_QUERY = 2;									        //查询信息
SUB_GP_MODIFY_TABLE_RULE   = 11                             //修改桌子规则
SUB_GP_CREATE_CLUB=	33									    //创建俱乐部
SUB_GP_JOIN_CLUB= 34									    //加入俱乐部
SUB_GP_SET_CLUB_USER_LVL= 35								//设置成员等级
SUB_GP_SET_ALL_JOIN= 36									    //全部操作
SUB_GP_SAVE_CLUB_SET= 37									//保存俱乐部设置
SUB_GP_GET_ONLINE_USER= 38									//获取在线用户
SUB_GP_CREAT_ANDROID=		50									//添加机器人
SUB_GP_DELETE_ANDROID=		51									//删除机器人
SUB_GP_ANDROID_LIST=			52									//机器人列表
SUB_GP_CREAT_ANDROID_GROUP=	53									//添加机器人分组
SUB_GP_DELETE_ANDROID_GROUP=	54									//删除机器人分组
SUB_GP_ANDROID_GROUP_LIST=	55									//机器人分组列表
SUB_GP_GET_ANDROID_CNT=	56									//获取机器人数量
SUB_GP_KICK_ROOM_USER=	57									    //踢出用户

//修改桌子规则
CMD_GC_ModifyRoom = cc.Class({
    ctor:function(){
        this.dwRoomID = 0;							//房间ID
        //俱乐部规则
        this.cbClubKind =0;							//俱乐部类型
        this.llSitScore =0;							//参与分
        this.llStandScore =0;						//淘汰分

        this.dwBigRevRules = 0;						//大局表情规则
        this.dwBigMinScore = 0;						//大局表情起曾分
        this.dwBigCnt = 0;							//大局百分比或固定数量

        this.dwSmallRevRules = 0;					//小局表情规则
        this.dwSmallMinScore = 0;					//小局表情起曾分
        this.dwSmallCnt = 0;						//小局百分比或固定数量

        this.cbReturnType =0;						//反水类型
        this.bNegativeScore =0;						//反水类型
        this.dwMagnification = 0;					//倍率
        this.szTag = ''//[10];						//标签

        this.len_szTag = 20;
    },
});
//查询俱乐部
CMD_GC_QueryClubList = cc.Class({
    ctro:function(){
        this.dwUserID = 0;						//用户ID
    }
});
//创建俱乐部
CMD_GC_CreateClub = cc.Class({
    ctor: function () {
        this.dwUserID = 0;						//俱乐部ID
        this.szPassWord = '';
        this.dwClubID = 0;
        this.szClubName = '';
        this.wKindID = 0;
        this.dwRules = 0;

        this.len_szPassWord = 32*2;
        this.len_szClubName = 32*2;
    }
});
//加入俱乐部
CMD_GC_JoinClub = cc.Class({
    ctor: function () {
        this.dwUserID = 0;						//用户ID
        this.szPassWord = '';
        this.dwAllianceID = 0;

        this.len_szPassWord = 32*2;
    }
});
//设置成员等级
CMD_GC_SetClubUesrLvl = cc.Class({
    ctor:function(){
        this.dwOperateUserID = 0;
        this.dwTargetUserID = 0;
        this.cbLevel = 0;
        this.dwClubID = 0;
        this.szPassWord = '';//[32];
        
        this.len_szPassWord = 32*2;
    }
});
//一键操作
CMD_GC_SetAllJoin = cc.Class({
    ctor:function(){
        this.dwUserID = 0;
        this.cbLevel = 0;
        this.dwClubID = 0;
        this.szPassWord = '';//[32];
        
        this.len_szPassWord = 32*2;
    }
});
//保存俱乐部设置
CMD_GC_SaveClubSet = cc.Class({
    ctor:function(){
        this.dwUserID = 0;
        this.szPassWord = '';//[32];
        this.dwClubID = 0;			//俱乐部ID
        this.szClubName = '';//[31];		//俱乐部名字
        this.cbJoinLimit = 0;		//
        this.dwRules = 0;			//
        this.szNotice = '';//[256];		//俱乐部公告	
        this.szNotice2 = '';//[256];		//专属公告
        this.cbCloseStatus = 0;

        this.len_szClubName = 31*2;
        this.len_szNotice = 256*2;
        this.len_szNotice2 = 256*2;
        this.len_szPassWord = 32*2;
    }
});

//获取在线用户
CMD_GC_GetOnlineUser = cc.Class({
    ctor:function(){
        this.dwUserID = 0;
        this.dwClubID = 0;			//俱乐部ID
    }
});

//获取机器人数量
CMD_C_GetAndroidCnt = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwClubID = 0;					//俱乐部id
    }
});

//创建机器人
CMD_C_CreatAndroid = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwClubID = 0;					//俱乐部id
        this.wCnt = 0;                      //机器人数量
    }
});

//删除机器人
CMD_C_DeleteAndroid = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.szPassWord = '';
        this.dwClubID = 0;					//俱乐部ID
        this.dwTargetID = 0;					//目标ID

        this.len_szPassWord = 32*2;
    }
});

//机器人配置
CMD_C_AndroidGroupInfo = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwClubID = 0;					//俱乐部id
        this.dwKindID = 0;					//所在游戏类型
        this.dwRoomID = 0;					//房间号
        this.wTotalTimes = 0;				//总消耗桌数
        this.wMaxPlayingTable = 0;			//同时开桌数
        this.wMaxSitCount = 0;				//每桌最大机器人数
    }
});

//删除机器人
CMD_DeleteAndroidGroup = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwClubID = 0;					//俱乐部id
        this.dwGroupID = 0;					//组ID
    },
});

//获取机器人列表
CMD_AndroidGroupList = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwClubID = 0;					//俱乐部id
    },
});

//踢出用户
CMD_KickRoomUser = cc.Class({
    ctor:function(){
        this.dwUserID = 0;					//用户ID
        this.dwTargetID = 0;				//用户ID
        this.dwRoomID = 0;
    },
});

SUB_GP_CREATE_CLUB_RES = 115									//俱乐部列表
SUB_GP_JOIN_CLUB_RES = 116									        //俱乐部列表
SUB_GP_EXIT_CLUB_RES	=		117									//退出俱乐部
SUB_GP_ONLINE_USER_RES	=		118									//在线用户

SUB_GP_CREAT_ANDROID_RES =		119
SUB_GP_DELETE_ANDROID_RES =		120
SUB_GP_GET_ANDROID_LIST =			121
SUB_GP_CREAT_ANDROID_GROUP_RES =	122
SUB_GP_DELETE_ANDROID_GROUP_RES =	123
SUB_GP_GET_ANDROID_GROUP_LIST =	124
SUB_GP_GET_ANDROID_GROUP_LIST_END =	125
SUB_GP_GET_ANDROID_CNT_INFO =		126
SUB_GP_ONLINE_USER_RES_FINISH=	127									//在线用户
//加入结果
CMD_CS_S_JoinClubRes = cc.Class({
    ctor:function(){
        this.cbRes = 0;
	    this.dwClubID = 0;
    }
});
//退出俱乐部
CMD_CS_S_EixtClubRes = cc.Class({
    ctor:function(){
        this.dwClubID = 0;
	    this.cbDissClub = 0;
    },
});
CMD_CS_S_OnlineUserStatus = cc.Class({
    ctor:function(){
        this.dwUserID=0;
        this.cbInvite = 0;
        this.cbUserStatus = 0;
    },
});
CMD_CS_S_OperateAndroidGroupRes = cc.Class({
    ctor:function(){
        this.cbResCode = 0;
    },
});
//机器人组信息
CMD_CS_S_AndroidGroupInfo = cc.Class({
    ctor:function(){
        this.dwGroupID = 0;					//组ID
        this.dwKindID = 0;					//类型ID
        this.wAndroidCount = 0;				//机器人数量
        this.wTotalTimes = 0;				//总消耗桌数
        this.wMaxPlayingTable = 0;			//同时开桌数
        this.wMaxSitCount = 0;				//每桌最大机器人数
        this.wCompleteCnt = 0;
    },
});
//机器人数量信息
CMD_CS_S_GetAndroidCnt = cc.Class({
    ctor:function(){
        this.wFreeCnt = 0;			 	//空闲机器人
        this.wPlayCnt = 0;				//游戏机器人
    }
});

////////////////////////////////////////////////////////////////////////////////
//俱乐部信息
MDM_GC_CLUB = 3;									        //俱乐部信息

SUB_CS_C_REGISTER_USER = 151								//注册玩家
SUB_CS_C_LOGOFF_USER = 152									//注销玩家
SUB_CS_C_ENTER_CLUB = 153									//进入俱乐部
SUB_CS_C_EXIT_CLUB = 154									//离开俱乐部

SUB_CS_C_USER_INVITE = 161									//用户邀请

//用户登录
CMD_GC_RegisterUser = cc.Class({
    ctor: function () {
        this.dwUserID = 0;							//玩家标识
    }
});
//进入俱乐部
CMD_GC_EnterClub = cc.Class({
    ctor: function () {
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.cbClubLevel = 0;
    }
});

//离开俱乐部
CMD_GC_ExitClub = cc.Class({
    ctor: function () {
        this.dwUserID = 0;
        this.dwClubID = 0;
    }
});


//用户邀请
CMD_GC_InviteUser = cc.Class({
    ctor: function () {
        this.dwClubID = 0;
        this.dwTargetID = 0;
        this.dwUserID = 0;
        this.dwKindID = 0;
        this.dwRoomID = 0;
    }
});




SUB_CS_S_FORCED_OFFLINE	= 272								//被迫下线

SUB_CS_S_UPDATE_CARD = 275									//刷新房卡
SUB_CS_S_UPDATE_SCORE = 276									//刷新积分
SUB_CS_S_USER_INVITE = 277									//用户邀请
SUB_CS_S_ANDROID_LIST = 					288									//机器人列表
SUB_CS_S_ANDROID_LIST_FINISH = 			289									//机器人列表
SUB_CS_S_ANDROID_CREAT_RES =				290									//创建机器人
SUB_CS_S_ANDROID_DEL_RES =				291									//删除机器人
SUB_CS_S_OPERATE_FAILURE = 0								//操作失败

//刷新房卡
CMD_CS_S_UpdateRoomCard = cc.Class({
    ctor: function () {
        this.lRoomCard = 0;
    }
})


//刷新积分
CMD_CS_S_UpdateScore = cc.Class({
    ctor: function () {
        this.dwUserID = 0;
        this.dwTagUserID = 0;
        this.lScore = 0;
        this.cbType = 0;
    }
});

//用户邀请
CMD_CS_S_InviteUser = cc.Class({
    ctor: function () {
        this.dwClubID = 0;
        this.dwUserID = 0;
        this.dwKindID = 0;
        this.dwRoomID = 0;
    }
});

CMD_CS_S_AndroidInfo = cc.Class({
    ctor:function(){
        this.dwKindID = 0;					//类型ID
        this.wAndroidNum = 0;				//机器人数量
        this.wTotalTimes = 0;				//总消耗桌数
        this.wCurrentTimes = 0;				//当前消耗
        this.wMaxPlayingTable = 0;			//同时开桌数
        this.wMaxSitNum = 0;					//每桌最大机器人数
    }
});

//操作失败
CMD_CS_S_OperateFailure = cc.Class({
    ctor: function () {
        this.cbRrrCode = 0;							//错误码
        this.szDescribeString = "";//[128];				//错误消息

        this.len_szDescribeString = 128 * cc.TCHAR_SIZE;
    }
})



////////////////////////////////////////////////////////////////////////////////
//推送信息
MDM_GC_PUSH =							4							//推送信息
SUB_GP_S_CLUB_LIST_PUSH = 				1							//俱乐部列表推送
SUB_GP_S_APPLY_PUSH = 					2							//申请信息
SUB_GP_S_USER_LEVEL_PUSH = 				3							//用户等级
SUB_GP_S_EXIT_CLUB_PUSH	=				4							//退出俱乐部
SUB_GP_S_CLUB_INFO_PUSH	=				5							//俱乐部信息
SUB_GP_S_ROOM_INFOR		=				6							//房间信息
SUB_GP_S_DIS_ROOM		=				7							//解散房间
SUB_GP_S_USER_GAMESTATUS =              8                           //游戏状态
SUB_GP_S_CHANGE_CLUB_INFO=				9							//修改俱乐部信息
SUB_GP_S_MODIFY_ROOM_INFOR	=			10							//修改房间信息
SUB_GP_S_ONLINE_USER		=			11							//在线用户
SUB_GP_S_OFFLINE_USER=					12							//下线用户
SUB_GP_S_CLUB_USER_SOCRE =				13							//用户积分
SUB_GP_S_CLUB_ROOM_INFO	 =				14							//房间信息
SUB_GP_S_KICK_USER_RES	=			    15							//踢出结果
//用户俱乐部信息
CMD_GP_UserClubInfo = cc.Class({
    ctor:function(){
        this.dwClubID = 0;			//俱乐部ID
        this.dwCreaterID = 0;		//创建ID
        this.wMemberCnt = 0;			//
        this.cbClubLevel = 0;		//
        this.cbClubLv = 0;			//俱乐部等级
        this.szClubName = '';//[31];		//俱乐部名字
        this.wKindID = 0;			//
        this.cbJoinLimit = 0;		//
        this.dwRules = 0;			//
        this.szNotice = '';//[256];		//俱乐部公告	
        this.dwLeagueID = 0;			//
        this.llScore = 0;				//
        this.dwAllianceID = 0;		//
        this.szNotice2 = '';//[256];		//专属公告
        this.cbIsInvite = 0;			//
        this.cbCloseStatus = 0;			//
        this.wTableCount = 0;		//

        this.len_szClubName = 31*2;
        this.len_szNotice = 256*2;
        this.len_szNotice2 = 256*2;
    }
});

//解散俱乐部
CMD_GP_S_DisClub = cc.Class({
    ctor:function(){
        this.dwClubID = 0;
	    this.cbDissClub = 0;
    },
});
//设置成员等级结果
CMD_CS_S_SetMemLevel = cc.Class({
    ctor:function(){
        this.dwUserID = 0;
        this.dwClubID = 0;
        this.cbOldLevel = 0;
        this.cbCurLevel = 0;
    }
});
//解散房间
CMD_CS_S_DisRoom = cc.Class({
    ctor: function () {
        this.dwClubID = 0;
        this.dwUserID = 0;							//用户ID
        this.dwRoomID = 0;							//房间ID
        this.byForce = 0;							//强制执行
    }
});
//在线用户
CMD_CS_S_OnlineUser = cc.Class({
    ctor:function(){
        this.dwUserID = 0;							//用户ID
        this.dwClubID = 0;
        this.cbUserStatus = 0;						//
    }
});
//下线用户
CMD_CS_S_OfflineUser = cc.Class({
    ctor:function(){
        this.dwUserID = 0;							//用户ID
    }
});

//用户积分
CMD_CS_S_ClubUserScore = cc.Class({
    ctor:function(){
        this.dwUserID=0;							//用户ID
        this.dwClubID=0;
        this.llScore=0;
    }
});
//房间信息
CMD_CS_S_ClubRoomInfo = cc.Class({
    ctor:function(){
        this.dwRoomID = 0;							//用户ID
        this.dwClubID = 0;
        this.wProgress =0 ;							//局数
    }
});
//踢出结果
CMD_CS_S_KickUserRes = cc.Class({
    ctor:function(){
        this.bRes = 0; 
    }
});




