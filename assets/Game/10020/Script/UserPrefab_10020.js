
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
   
    // use this for initialization
    start :function() {
        this.$('UserInfo/UserBanker').active = false;
        this.$('UserInfo2/UserBanker').active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
        this.m_ViewStr = (this.m_ChairID == 3 || this.m_ChairID == 1)?'UserInfo2':'UserInfo';
        this.$('UserInfo').active = false;
        this.$('UserInfo2').active = false;
        this.$(this.m_ViewStr).active = true;
    },
    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_pUserItem = pUserItem;
        this.m_dwUserID = pUserItem.GetUserID();
        this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
        this.SetUserScore(pUserItem.GetUserScore(), 0);
    },
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
            this.$(this.m_ViewStr+'/Score@Label').string = '';
            this.m_pUserItem = null;
            this.node.active = false;
        }
    },
    SetOffLine:function(bOffLine) {
        this.$(this.m_ViewStr+'/OffLine').active = bOffLine;
    },
    OnClick_Head:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }

        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID);
    },
    UpdateScore:function(pUserItem, TableScore) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore(), 0);
        }
    },

    SetUserScore:function (Score, TableScore) {
        this.$(this.m_ViewStr+'/Score@Label').string = Score2Str(Score);
    },

    SetBanker:function (bBanker) {
        if(bBanker == null) bBanker = false;
        this.$(this.m_ViewStr+'/UserBanker').active = bBanker;
    },
    
});
