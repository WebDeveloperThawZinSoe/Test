systemtime = cc.Class({
    ctor :function () {
        this.wYear = 0;
        this.wMonth = 0;
        this.wDayOfWeek = 0;
        this.wDay = 0;
        this.wHour = 0;
        this.wMinute = 0;
        this.wSecond = 0;
        this.wMilliseconds = 0;
    },
});

//头像信息
tagCustomFaceInfo = cc.Class({
    ctor :function () {
        this.dwDataSize = 0;               //数据大小
        this.dwCustomFace = 0;             //图片信息
    },
});

//用户信息
tagGlobalUserData = cc.Class({
    ctor :function () {
        //基本资料
        this.dwUserID = 0;							//用户 I D
        this.dwGameID = 0;							//游戏 I D
        this.dwExperience = 0;						//用户经验
        this.szAccounts = "";			                //登录帐号
        this.szNickName = "";			                //用户昵称
        this.szPassword = "";			                //登录密码
        this.szDynamicPass = "";		                //动态密码

        //用户成绩
        this.llUserScore = 0;							//用户游戏币
        this.llUserInsure = 0;						    //用户银行
        this.llUserIngot = 0;							//用户钻石
        this.dUserBeans = 0;							//用户游戏豆

        //扩展资料
        this.cbGender = 0;							//用户性别
        this.cbMoorMachine = 0;						//锁定机器
        this.szUnderWrite = "";	                    //个性签名

        //社团资料
        this.dwGroupID = 0;							//社团索引
        this.szGroupName = "";                       //社团名字
        this.szClientIP = '';

        //会员资料
        this.cbMemberOrder = 0;						//会员等级
        this.MemberOverDate = new systemtime();     //到期时间

        //头像信息
        this.wFaceID = 0;							    //头像索引
        this.dwCustomID = 0;							//自定标识
        this.CustomFaceInfo = new tagCustomFaceInfo();//自定头像

        //配置信息
        this.cbInsureEnabled = 0;					//银行使能

        //登录信息
        this.dwLogonTickCount = 0;					//登录时间

        // 是否签到
        this.bTodayChecked  = false;                 // 是否签到

        //this.szHeadImgURL = "";                      //微信头像

        //基本资料
        this.len_szAccounts = window.LEN_ACCOUNTS*cc.TCHAR_SIZE;                 	//登录帐号
        this.len_szNickName = window.LEN_NICKNAME*cc.TCHAR_SIZE;	//用户昵称
        this.len_szPassword = window.LEN_MD5*cc.TCHAR_SIZE;	//登录密码
        this.len_szDynamicPass = window.LEN_PASSWORD*cc.TCHAR_SIZE; //动态密码
        this.len_szUnderWrite = window.LEN_UNDER_WRITE*cc.TCHAR_SIZE;		        //个性签名
        this.len_szGroupName = window.LEN_GROUP_NAME*cc.TCHAR_SIZE;	//社团名字
        this.len_szClientIP = window.LEN_IP*cc.TCHAR_SIZE;
    },
});

//银行信息
tagUserInsureInfo = cc.Class({
    ctor:function() {
        this.wRevenueTake = 0;					//税收比例
        this.wRevenueTransfer = 0;				//税收比例
        this.wServerID = 0;						//房间标识
        this.llUserScore = 0;						//用户游戏币
        this.llUserInsure = 0;						//银行游戏币
        this.lTransferPrerequisite = 0;			//转账条件
    },
});

CGlobalUserInfo = cc.Class({
    ctor :function () {
        this.m_GlobalUserData = new tagGlobalUserData();
        this.m_UserInsureInfo = new tagUserInsureInfo();
        this.m_UserInfoMap = new Object();
        this.m_UserHeadMap = new Object();
        this.m_UserGameIDMap = new Object();

        this.m_NetImageMap = new Object();
    },
    SetUserInfo:function (dwUserID,NickName,GameID,Url,Gender) {
        if( this.m_UserInfoMap[dwUserID] == null || this.m_UserInfoMap[dwUserID]  == 'Loading' ){
            this.m_UserInfoMap[dwUserID] = new Object();
        }
        this.m_UserGameIDMap[GameID] = dwUserID;
        this.m_UserInfoMap[dwUserID].NickName = NickName;
        this.m_UserInfoMap[dwUserID].GameID = GameID;
        this.m_UserInfoMap[dwUserID].HeadUrl = Url;
        this.m_UserInfoMap[dwUserID].Gender = Gender;
    },
    SetUserAddress: function(dwUserID, szAddr, bError) {
        if (this.m_UserInfoMap[dwUserID] == null || this.m_UserInfoMap[dwUserID] == 'Loading') {
            console.log(' SetUserAddress Error, ['+ dwUserID + '] is ' + typeof(this.m_UserInfoMap[dwUserID]));
            return;
        }
        this.m_UserInfoMap[dwUserID].Address = szAddr;
        this.m_UserInfoMap[dwUserID].cbAddrCode = 1;
        this.m_UserInfoMap[dwUserID].bAddrError = bError;
    },

    GetUserAddress: function(dwUserID) {
        if (!this.m_UserInfoMap[dwUserID]) {
            return {berror: true, code: 3, string:''};
        } else if (this.m_UserInfoMap[dwUserID] == 'Loading') {
            console.log(' GetUserAddress Error, ['+ dwUserID + '] is ' + typeof(this.m_UserInfoMap[dwUserID]));
            return {berror: true, code: 2, string:'玩家信息加载未完成，请稍后再试！'};
        }

        if(this.m_UserInfoMap[dwUserID].cbAddrCode == 1) return {
            berror:this.m_UserInfoMap[dwUserID].bAddrError,
            code: this.m_UserInfoMap[dwUserID].cbAddrCode,
            string: this.m_UserInfoMap[dwUserID].Address
        };
        return {berror: true, code: 0, string: '加载中...'};
    },
    GetGlobalUserData :function(){
        return this.m_GlobalUserData;
    },

    GetUserInsureInfo :function(){
        return this.m_UserInsureInfo;
    },

    GetUserDefaultFace :function(){
      if(this.m_GlobalUserData.cbGender == 0)
       return "plaza_default_face_0.png";
        else if(this.m_GlobalUserData.cbGender == 1)
          return "plaza_default_face_1.png";
    },

    GetUserDefaultFaceByGender:function (gender){
      if(gender == 0)
        return "plaza_default_face_0.png";
        else if(gender == 1)
        return "plaza_default_face_1.png";
    },

});

g_GlobalUserInfo = new CGlobalUserInfo();
