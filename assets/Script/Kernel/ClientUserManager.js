var CClientUserItem = cc.Class({
    ctor :function() {
        this.m_UserInfo = new tagUserInfo();
        this.m_CustomFaceInfo = new tagCustomFaceInfo();
    },

    //用户桌子
    GetTableID:function (){
        return this.m_UserInfo.wTableID;
    },

    //用户椅子
    GetChairID:function () {
        return this.m_UserInfo.wChairID;
    },

    //用户状态
    GetUserStatus:function () { 
        return this.m_UserInfo.cbUserStatus;
    },

    //用户状态
    SetUserStatus:function (cbUserStatus) { 
        this.m_UserInfo.cbUserStatus = cbUserStatus;
    },

    //用户标识
    GetUserID :function() {
        return this.m_UserInfo.dwUserID;
    },

    GetNickName :function(){
        return this.m_UserInfo.szNickName;
    },

    //用户信息
    GetUserInfo:function () {
        return this.m_UserInfo;
    },
    
    //积分数值
    GetUserScore:function () {
        return this.m_UserInfo.llScore;
    },

    GetUserRoomCard:function () {
        return this.m_UserInfo.llUserIngot;
    },

    GetGender:function (){
        return this.m_UserInfo.cbGender;
    },
    //游戏ID
    GetGameID :function() {
        return this.m_UserInfo.dwGameID;
    },
    //游戏ID
    GetUserIP :function() {
        return this.m_UserInfo.szClientIP;
    },
    //自定头像
    GetCustomFaceInfo:function () {
        return null;
    },
    
    //微信头像
    GetHeadImgURL:function (){
        return this.m_UserInfo.szHeadImgUrl;
    },
});

var CPlazaUserManager = cc.Class({
    ctor :function () {
        this.m_UserItemActive = new Array();
        this.m_pIUserManagerSink = arguments[0];
    },

    //查找用户
    SearchUserByUserID :function(dwUserID){
        //用户搜索
        for (var i=0,l=this.m_UserItemActive.length;i<l;i++){
            var pClientUserItem=this.m_UserItemActive[i];
            if (pClientUserItem.m_UserInfo.dwUserID==dwUserID) return pClientUserItem;
        }
        return 0;
    },

    //更新积分
    UpdateUserItemScore :function(pIClientUserItem,pUserScore){
          //获取用户
          var pUserInfo=pIClientUserItem.GetUserInfo();

          //以往数据
          var OldScore = new tagUserScore();
          //设置数据
          gCByte.StrSameMemCopy(OldScore, pUserInfo);
          gCByte.StrSameMemCopy(pUserInfo, pUserScore);

        //通知更新
        if (this.m_pIUserManagerSink)
            this.m_pIUserManagerSink.OnUserScoreUpdate(pIClientUserItem, OldScore);

        return true;
    },

    //枚举用户
    EnumUserItem :function(wEnumIndex){
        if (wEnumIndex>=this.m_UserItemActive.length) return 0;
        return this.m_UserItemActive[wEnumIndex];
    },

    //增加用户
    ActiveUserItem :function(UserInfo, CustomFaceInfo) {
        //变量定义
        var pClientUserItem=new CClientUserItem();
        if (pClientUserItem==0) return 0;
    
        pClientUserItem.m_UserInfo = UserInfo;

        //设置数据
        gCByte.StrSameMemCopy(pClientUserItem.m_UserInfo,UserInfo);

        //插入用户
        this.m_UserItemActive.push(pClientUserItem);
        //更新通知
        if (this.m_pIUserManagerSink!=0) this.m_pIUserManagerSink.OnUserItemAcitve(pClientUserItem);

        return pClientUserItem;
    },

    //删除用户
    DeleteUserItem:function (pIClientUserItem) {
        //查找用户
        for (var i in this.m_UserItemActive) {
            if (pIClientUserItem==this.m_UserItemActive[i]){
                //删除用户
                this.m_UserItemActive.splice(i,1);

                //删除通知
                if (this.m_pIUserManagerSink) this.m_pIUserManagerSink.OnUserItemDelete(pIClientUserItem);
            
                //设置数据
                pIClientUserItem.m_UserInfo.dwUserID = 0;
                return true;
            }
        }

        return false;
    },

    //重置用户
    ResetUserItem :function(bValue) {
        if ( bValue ){
            //设置变量
            this.m_UserItemActive.splice(0,this.m_UserItemActive.length);
        } else {
            var TempArr = null;

            for (var i=0; i<this.m_UserItemActive.length; i++){
                if (g_GlobalUserInfo.dwUserID == this.m_UserItemActive[i].GetUserID()){
                TempArr = this.m_UserItemActive.splice(0,1);
                }
            }

            this.m_UserItemActive.splice(0,this.m_UserItemActive.length);
            if ( TempArr ) this.m_UserItemActive = TempArr;
        }

        return true;
    },

    //更新状态
    UpdateUserItemStatus :function (pIClientUserItem,pUserStatus){

        //获取用户
        var pUserInfo = pIClientUserItem.GetUserInfo();

        //以往数据
        var UserStatus = new tagUserStatus();
        UserStatus.wTableID=pUserInfo.wTableID;
        UserStatus.wChairID=pUserInfo.wChairID;
        UserStatus.cbUserStatus=pUserInfo.cbUserStatus;

        //设置数据
        pUserInfo.wTableID=pUserStatus.wTableID;
        pUserInfo.wChairID=pUserStatus.wChairID;
        pUserInfo.cbUserStatus=pUserStatus.cbUserStatus;

        //通知更新
        if (this.m_pIUserManagerSink)
            this.m_pIUserManagerSink.OnUserItemUpdate(pIClientUserItem,UserStatus);

        return true;
    },

    //获得人数
    GetActiveUserCount:function (){
        return this.m_UserItemActive.length;
    }
});

var CGameUserManager = cc.Class({
    ctor:function  () {
        //组件接口
        this.m_pIUserManagerSink = arguments[0];
        //用户数据
        this.m_pTableUserItem = new Array(100);
        this.m_UserItemLookon = new Array();
    },

    //重置用户
    ResetUserItem :function(pClientUserItem){
        //存储用户
        for (var i=0;i<MAX_CHAIR;i++){
            if (this.m_pTableUserItem[i]!=null && pClientUserItem.GetUserID()!=this.m_pTableUserItem[i].GetUserID())  {
                this.m_pTableUserItem[i] = null;
            }
        }

        //设置变量
        this.m_UserItemLookon.splice(0,this.m_UserItemLookon.length);

        return true;
    },

    //删除用户
    DeleteUserItem:function(pIClientUserItem){
        //效验状态
        if ((pIClientUserItem==null)) return false;

        //游戏用户
        if (pIClientUserItem.GetUserStatus()!=US_LOOKON){
            //变量定义
            var wChairID=pIClientUserItem.GetChairID();
            var pUserItemRemove=pIClientUserItem;

            var bRemove = false;
            for (var i=0; i<MAX_CHAIR; i++){
                if (this.m_pTableUserItem[i] && (pIClientUserItem.GetUserID() == this.m_pTableUserItem[i].GetUserID())){
                    //删除用户
                    this.m_pTableUserItem[i]=null;
                    bRemove = true;
                }
            }

            if ( !bRemove ) return false;

            //删除通知
            if (this.m_pIUserManagerSink!=0)
                this.m_pIUserManagerSink.OnUserItemDelete(pUserItemRemove);

            return true;
        }

        //旁观用户
        var pUserItemActive=0;
        for (var i=0;i<this.m_UserItemLookon.length;i++) {
            pUserItemActive=this.m_UserItemLookon[i];
            if (pIClientUserItem==pUserItemActive){
                //删除用户
                this.m_UserItemLookon.splice(i,1);

                //删除通知
                if (this.m_pIUserManagerSink!=0)
                    this.m_pIUserManagerSink.OnUserItemDelete(pUserItemActive);

                return true;
            }
        }

        return false;
    },

    //增加用户
    ActiveUserItem :function(UserInfo, CustomFaceInfo){
        //效验状态
        if (UserInfo.wChairID>=MAX_CHAIR) return 0;

        //变量定义
        var pClientUserItem=new CClientUserItem();
        if (pClientUserItem==null) return null;

        //用户信息
        pClientUserItem.m_UserInfo = UserInfo;
        pClientUserItem.m_CustomFaceInfo = CustomFaceInfo;
       
        //设置用户
        if (UserInfo.cbUserStatus==US_LOOKON) {
            var IsHave = false;
            for (var i=0,l=this.m_UserItemLookon.length;i<l;i++){
                if(this.m_UserItemLookon[i].GetUserID() == pClientUserItem.GetUserID()){
                    IsHave = true;
                }
            }
            if( IsHave == false){
                this.m_UserItemLookon.push(pClientUserItem);
            }           
        }
        else this.m_pTableUserItem[UserInfo.wChairID] = pClientUserItem;

        //更新通知
        if (this.m_pIUserManagerSink!=null)
            this.m_pIUserManagerSink.OnUserItemAcitve(pClientUserItem);

        return pClientUserItem;
    },

    //查找用户
    SearchUserByUserID:function (dwUserID){
        //游戏用户
        for (var i=0;i<MAX_CHAIR;i++){
            var pClientUserItem= this.m_pTableUserItem[i];
            if ((pClientUserItem!=0 && pClientUserItem!=null)&&(pClientUserItem.GetUserID()==dwUserID)) return pClientUserItem;
        }

        //旁观用户
        for (var i=0,l=this.m_UserItemLookon.length;i<l;i++){
            pClientUserItem=this.m_UserItemLookon[i];
            if (pClientUserItem.GetUserID()==dwUserID) return pClientUserItem;
        }

        return 0;
    },

    //更新状态
    UpdateUserItemStatus :function(pIClientUserItem, pUserStatus){
        //获取用户
        var pUserInfo=pIClientUserItem.GetUserInfo();

        //以往数据
        var UserStatus = new tagUserStatus();
        UserStatus.wTableID=pUserInfo.wTableID;
        UserStatus.wChairID=pUserInfo.wChairID;
        UserStatus.cbUserStatus=pUserInfo.cbUserStatus;

        //设置数据
        pUserInfo.wTableID=pUserStatus.wTableID;
        pUserInfo.wChairID=pUserStatus.wChairID;
        pUserInfo.cbUserStatus=pUserStatus.cbUserStatus;

        //通知更新
        if (this.m_pIUserManagerSink)
            if (this.m_pIUserManagerSink!=0) this.m_pIUserManagerSink.OnUserItemUpdate(pIClientUserItem,UserStatus);

        return true;
    },

    //游戏用户
    GetTableUserItem:function (wChariID){
        //效验参数
        if (wChariID>=this.m_pTableUserItem.length) return null;
        if(this.m_pTableUserItem[wChariID] && this.m_pTableUserItem[wChariID].GetUserStatus() == US_LOOKON) this.m_pTableUserItem.splice(wChariID, 1)
        return this.m_pTableUserItem[wChariID];
    },
    //游戏用户
    GetTableLookOnUserArr:function (){
        var IDArr = new Array(); 
        //旁观用户
        for (var i=0;i<this.m_UserItemLookon.length;i++){
            if(this.m_UserItemLookon[i].GetUserStatus() == US_LOOKON) IDArr.push(this.m_UserItemLookon[i].GetUserID());
            else this.m_UserItemLookon.splice(i, 1)
        }
        return IDArr;
    },
});