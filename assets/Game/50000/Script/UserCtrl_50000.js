cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_HeadNode:cc.Node,
        m_HeadErr:cc.Node,
        m_LabNick:cc.Label,
        m_LabID:cc.Label,
        m_Score:cc.Label,
        m_Saward:cc.Label,
        m_Spunish:cc.Label,
        m_Swin:cc.Label,
        m_Ssum:cc.Label,
        m_Lbg:cc.Node,
    },

    start:function () {
    },

    onLoad:function() {
        this.schedule(this.CheckLoading, 0.5);
    },
    InitPre:function(){
       this.SetUserByID(0);
    },
    SetPreInfo:function(ParaArr){
        this.SetUserByID(ParaArr);
    },
    SetUserByGameID :function(GameID) {
        this.InitUser();
        if(GameID == null || GameID == 0) return;
        this.m_CheckGameID = GameID;
        this.m_CheckUserID = null;
        this.m_CheckCnt = 0;
        this.CheckLoading();
    },
    SetUserByID :function(UserID) {
        this.InitUser();
        if(UserID == null || UserID == 0) return;
        this.m_CheckUserID = UserID;
        this.m_CheckGameID = null;
        this.m_CheckCnt = 0;
        this.CheckLoading();
    },
    GetUserID:function(){ return this.m_UserID;},
    InitUser:function(){
        this.m_UserID = 0;
        this.m_bShowFullID = true;
        if(this.m_LabNick) this.m_LabNick.string = '用户昵称';
        if(this.m_LabID) this.m_LabID.string = '用户ID';
        if(this.m_HeadCtrl) {
            this.m_HeadCtrl.SetHook(this);
            this.m_HeadCtrl.SetUserHead();
        }
        if(this.m_HeadErr) this.m_HeadErr.active = false;
    },
    OnHeadErr:function(){
        if(this.m_HeadErr) this.m_HeadErr.active = true;
    },
    SetShowFullID:function(bShow){
        this.m_bShowFullID=bShow;
        if(this.m_LabID && !this.m_bShowFullID) {
            var temp = (this.m_LabID.string+"").split('');
            temp[2] = '*'
            temp[3] = '*'
            this.m_LabID.string = temp.join('');
        }
    },
    SetUserInfo :function(UserID, Info) {
        //未加载成功
        if(Info == null || Info == 'Loading') return;

        //设置信息
        this.m_UserID = UserID;
        this.m_CheckUserID = null;
        this.m_CheckGameID = null;
        if(this.m_LabNick && Info.NickName != null)this.m_LabNick.string = Info.NickName;
        if(this.m_LabID && Info.GameID != null){
            this.m_LabID.string = Info.GameID;
            if(!this.m_bShowFullID) {
                var temp = (this.m_LabID.string+"").split('');
                temp[2] = '*';
                temp[3] = '*';
                this.m_LabID.string = temp.join('');
            }
        }
        if(this.m_HeadNode && this.m_HeadCtrl == null) this.m_HeadCtrl = this.m_HeadNode.getComponent('HeadPrefab');
        if(this.m_HeadCtrl) this.m_HeadCtrl.SetUserHead(UserID);
    },
    CheckLoading:function() {
        if(this.m_CheckUserID == null && this.m_CheckGameID == null) return;
        if(this.m_CheckUserID) this.GetUserInfo(this.m_CheckUserID);
        if(this.m_CheckGameID) this.GetUserInfo2(this.m_CheckGameID);
    },
    GetUserInfo:function(UserID){
        //等待其他控件加载结果
        if ( g_GlobalUserInfo.m_UserInfoMap[UserID] == 'Loading') return;
        //首次加载
        if( g_GlobalUserInfo.m_UserInfoMap[UserID] == null){
            this.LoadUserInfo(UserID);
        }else {
            this.SetUserInfo(UserID, g_GlobalUserInfo.m_UserInfoMap[UserID]);
        }
    },
    LoadUserInfo:function(UserID, bReload){
        g_GlobalUserInfo.m_UserInfoMap[UserID] = 'Loading';
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=12&dwUserID='+UserID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserInfo = JSON.parse(data);
            if (UserInfo.UserID == null) {
                if(bReload == null)  this.LoadUserInfo(UserID, true);
                else this.m_CheckUserID = null;
            }else{
                g_GlobalUserInfo.SetUserInfo(UserID,UserInfo.NickName,UserInfo.GameID,UserInfo.HeadUrl);
                if(this.m_CheckUserID == UserID) this.SetUserInfo(UserID, g_GlobalUserInfo.m_UserInfoMap[UserID]);
            }
        }.bind(this));
    },
    GetUserInfo2:function(GameID, bReload){
        //等待其他控件加载结果
        if( g_GlobalUserInfo.m_UserGameIDMap[GameID] == 'Loading') return;

        if(g_GlobalUserInfo.m_UserGameIDMap[GameID] == null){
            this.LoadUserInfo2(GameID);
        }else{
            var UserID = g_GlobalUserInfo.m_UserGameIDMap[GameID];
            this.SetUserInfo(UserID, g_GlobalUserInfo.m_UserInfoMap[UserID]);
        }
    },
    LoadUserInfo2:function(GameID, bReload){
        g_GlobalUserInfo.m_UserGameIDMap[GameID] = 'Loading';
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+GameID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserInfo = JSON.parse(data);
            if(UserInfo.UserID == null){
                if(bReload == null) this.LoadUserInfo2(GameID, true);
                else this.m_CheckGameID = null;
            }else{
                g_GlobalUserInfo.SetUserInfo(UserInfo.UserID,UserInfo.NickName,UserInfo.GameID,UserInfo.HeadUrl);
                if(this.m_CheckGameID == GameID)this.SetUserInfo(UserInfo.UserID, g_GlobalUserInfo.m_UserInfoMap[UserInfo.UserID]);
            }
        }.bind(this));
    },
    // update (dt) {},
});
