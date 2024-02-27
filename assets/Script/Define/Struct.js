
//////////////////////////////////////////////////////////////////////////////////
//游戏列表

//游戏类型
tagGameType = cc.Class({
    ctor :function () {
        this._name = "tagGameType";
        this.wJoinID = 0;       //挂接索引
        this.wSortID = 0;       //排序索引
        this.wTypeID = 0;       //类型索引
        this.szTypeName = "";  //种类名字

        this.len_szTypeName = 64;
    },
});

//游戏种类
tagGameKind = cc.Class({
    ctor :function () {
        this.wTypeID = 0;       //类型索引
        this.wJoinID = 0;       //挂接索引
        this.wSortID = 0;       //排序索引
        this.wKindID = 0;       //类型索引
        this.wGameID = 0;       //模块索引
        this.dwOnLineCount = 0;//在线人数
        this.dwFullCount = 0;  //满员人数
        this.szKindName = "";  //游戏名字
        this.szProcessName = "";  //进程名字
        this.len_szKindName = LEN_KIND*cc.TCHAR_SIZE;  //游戏名字
        this.len_szProcessName = LEN_PROCESS*cc.TCHAR_SIZE;  //进程名字
    },
});

//游戏房间
tagGameServer = cc.Class({
    ctor :function () {
        this.wKindID = 0;       //挂接索引
        this.wNodeID = 0;       //排序索引
        this.wSortID = 0;       //类型索引
        this.wServerID = 0;     //房间索引
        this.wServerKind = 0;   //房间类型
        this.wServerType = 0;   //房间类型
        this.wServerLevel= 0;	//房间等级
        this.wServerPort = 0;   //房间端口
        this.llCellScore = 0;    //单元积分
        this.cbEnterMember= 0; 	//进入会员
        this.llEnterScore = 0;   //进入积分
        this.dwServerRule = 0;  //房间规则
        this.dwOnLineCount = 0; //在线人数
        this.dwAndroidCount = 0;//机器人数
        this.dwFullCount = 0;   //满员人数
        this.szServerAddr = '';  //房间名称
        this.szServerName = '';  //房间名称
	    //私人房添加
	    this.dwSurportType= 0;	//支持类型
	    this.wTableCount= 0;	//桌子数目


        this.len_szServerAddr = cc.TCHAR_SIZE * 32;  //房间名称
        this.len_szServerName = cc.TCHAR_SIZE * 32;  //房间名称
    },
});

//房间属性
tagServerAttribute = cc.Class({
    ctor :function () {
        this.wKindID = 0;           //类型标识
        this.wServerID = 0;         //房间标识
        this.wServerType = 0;       //游戏类型
        this.dwServerRule = 0;      //房间规则
        this.szServerName = 0;      //房间名称
        this.wAVServerPort = 0;     //视频端口
        this.dwAVServerAddr = 0;    //视频地址
        this.wTableCount = 0;       //桌子数目
        this.wChairCount = 0;       //椅子数目
    },
});

//用户信息
tagUserInfoHead = cc.Class({
    ctor :function () {
        //this._name='tagUserInfoHead'
        //用户属性
        this.dwGameID = 0;						//游戏 I D
        this.dwUserID = 0;						//用户 I D
        this.dwGroupID = 0;						//社团 I D

        //头像信息
        this.wFaceID = 0;							//头像索引
        this.dwCustomID = 0;						//自定标识

        //用户属性
        this.bIsAndroid = 0;						//机器标识
        this.cbGender = 0;						//用户性别
        this.cbMemberOrder = 0;					//会员等级
        this.cbMasterOrder = 0;					//管理等级

        //用户状态
        this.wTableID = 0;						//桌子索引
        this.wChairID = 0;						//椅子索引
        this.cbUserStatus = 0;					//用户状态

        //积分信息
        this.llScore = 0;							//用户分数
        this.llGrade = 0;							//用户成绩
        this.llInsure = 0;							//用户银行
        this.llIngot = 0;	                        //用户元宝

        this.dBeans = 0;								//用户游戏豆;

        //游戏信息
        this.dwWinCount = 0;						//胜利盘数
        this.dwLostCount = 0;						//失败盘数
        this.dwDrawCount = 0;						//和局盘数
        this.dwFleeCount = 0;						//逃跑盘数
        this.dwExperience = 0;					    //用户经验

        this.llIntegralCount = 0;						//积分总数(当前房间)

        //代理信息
        this.dwAgentID = 0;							//代理 I D
    },
});
tagTimeInfo = cc.Class({
    ctor :function () {
        this.dwEnterTableTimer = 0;						//进出桌子时间
        this.dwLeaveTableTimer = 0;							//离开桌子时间
        this.dwStartGameTimer = 0;							//开始游戏时间
        this.dwEndGameTimer = 0;								//离开游戏时间
    },
});

//用户信息
tagUserInfo = cc.Class({
    ctor :function () {
        this._name = 'tagUserInfo'
        //基本属性
        this.dwUserID = 0;							//用户 I D
        this.dwGameID = 0;							//游戏 I D
        this.dwGroupID = 0;							//社团 I D
        this.szNickName = "";			//用户昵称
        this.szGroupName = "";		//社团名字
        this.szUnderWrite = "";	//个性签名
        this.szQQ = "";						//QQ号码
        this.szMobilePhone = "";	//手机号码

        //头像信息
        this.wFaceID = 0;						        //头像索引
        this.dwCustomID = 0;							//自定标识

        //用户资料
        this.cbGender = 0;							//用户性别
        this.cbMemberOrder = 0;						//会员等级
        this.cbMasterOrder = 0;						//管理等级

        //用户状态
        this.wTableID = 0;							//桌子索引
        this.wLastTableID = 0;					    //游戏桌子
        this.wChairID = 0;							//椅子索引
        this.cbUserStatus = 0;						//用户状态

        //积分信息
        this.llScore = 0;								//用户分数
        this.llGrade = 0;								//用户成绩
        this.llInsure = 0;							    //用户银行
        this.llIngot = 0;								//用户元宝
        this.dBeans = 0;								//游戏豆
        //私人房添加
        this.lRoomCard;							//钻石数量
        //游戏信息
        this.dwWinCount = 0;							//胜利盘数
        this.dwLostCount = 0;						    //失败盘数
        this.dwDrawCount = 0;						    //和局盘数
        this.dwFleeCount = 0;						    //逃跑盘数
        this.dwExperience = 0;						//用户经验

        this.llIntegralCount = 0;						//积分总数(当前房间)
        this.dwAgentID = 0;							//代理 I D
        this.szClientIP='';
        //时间信息
        this.TimerInfo = new tagTimeInfo();							//时间信息

        this.len_szNickName = window.LEN_NICKNAME*cc.TCHAR_SIZE;			//用户昵称

        this.len_szGroupName = window.LEN_GROUP_NAME*cc.TCHAR_SIZE;		//社团名字
        this.len_szUnderWrite = window.LEN_UNDER_WRITE*cc.TCHAR_SIZE;	//个性签名
        this.len_szQQ = LEN_QQ*cc.TCHAR_SIZE;						//QQ号码
        this.len_szMobilePhone = LEN_MOBILE_PHONE*cc.TCHAR_SIZE;	//手机号码
    },
});

//桌子状态
tagTableStatus = cc.Class({
    ctor:function() {
        //this._name = 'CMD_GR_TableStatus'
        this.cbTableLock = 0;	                                        //锁定标志
        this.cbPlayStatus = 0;                                       //游戏标志
        this.lCellScore = 0;                                         //单元积分
    },
});

//用户状态
tagUserGps = cc.Class({
    ctor :function () {
        //this._name="tagUserGps"
        this.dwUserID = 0;
        this.byHide = 0;
        this.dlatitude = 0;
        this.dlongitude = 0;
        this.szAddress = '';
        this.len_szAddress = 128*cc.TCHAR_SIZE;
    },
});
//用户状态
tagUserStatus = cc.Class({
    ctor :function () {
        this.wTableID = 0;						                   //桌子索引
        this.wChairID = 0;						                   //椅子位置
        this.cbUserStatus = 0;		                               //用户状态
    },
});

//用户积分
tagUserScore = cc.Class({
    ctor :function () {
        //积分信息
        this.llScore = 0;                                               //用户分数
        this.llGrade = 0;                                              //用户成绩
        this.llInsure = 0;                                             //用户银行
        this.llIngot = 0;                                              //用户元宝
        this.dBeans = 0;								                //用户游戏豆
        //输赢信息
        this.dwWinCount = 0;                                           //胜利盘数
        this.dwLostCount = 0;                                          //失败盘数
        this.dwDrawCount = 0;                                          //和局盘数
        this.dwFleeCount = 0;                                          //逃跑盘数
        this.llIntegralCount;						                    //积分总数(当前房间)
        //全局信息
        this.dwExperience = 0;                                         //用户经验
        this.llLoveLiness = 0;                                        //用户魅力
    },
});

//比赛信息
tagGameMatch = cc.Class({
    ctor:function () {
        //基本信息
        this.wServerID = 0;                                           //房间标识
        this.dwMatchID = 0;                                           //比赛标识
        this.dwMatchNO = 0;                                           //比赛场次
        this.cbMatchType = 0;	                                        //比赛类型
        this.szMatchName = "";                                       //比赛名称

        //比赛信息
        this.cbMemberOrder = 0;                                      //会员等级
        this.cbMatchFeeType = 0;                                     //扣费类型
        this.lMatchFee = 0;                                           //比赛费用

        //比赛信息
        this.wStartUserCount = 0;                                   //开赛人数
        this.wMatchPlayCount = 0;                                   //比赛局数

        //比赛奖励
        this.wRewardCount = 0;                                      //奖励人数

        //比赛时间
        this.MatchStartTime = new systemtime();                                    //开始时间
        this.MatchEndTime = new systemtime();                                      //结束时间


        //基本信息
        this.index_wServerID = 0;                                   //房间标识
        this.index_dwMatchID = 2;                                   //比赛标识
        this.index_dwMatchNO = 6;                                   //比赛场次
        this.index_cbMatchType = 10;	                               //比赛类型
        this.index_szMatchName = 11;                                //比赛名称

        //比赛信息
        this.index_cbMemberOrder = 75;                              //会员等级
        this.index_cbMatchFeeType = 76;                             //扣费类型
        this.index_lMatchFee = 77;                                  //比赛费用

        //比赛信息
        this.index_wStartUserCount = 85;                           //开赛人数
        this.index_wMatchPlayCount = 87;                           //比赛局数

        //比赛奖励
        this.index_wRewardCount = 89;                               //奖励人数

        //比赛时间
        this.index_MatchStartTime = 91;                            //开始时间
        this.index_MatchEndTime = 107;                              //结束时间
    },

    getSize :function()
    {
        return 123;
    }
});

//比赛人数
CMD_GR_Match_Num = cc.Class({
    ctor:function() {
        //基本信息
        this.dwWaitting = 0;                                         //房间标识
        this.dwTotal = 0;                                            //比赛标识

        this.index_dwWaitting = 0;                                  //房间标识
        this.index_dwTotal = 4;                                     //比赛标识
    },

    getSize:function()
    {
        return 8;
    }
});