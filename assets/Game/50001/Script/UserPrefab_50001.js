
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
   
    // use this for initialization
    start :function() {
        this.$('UserInfo/UserBanker').active = false;
        this.$('UserInfo/UserCreater').active = false;
        // this.$('UserInfo2/UserBanker').active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
        // this.m_ViewStr = (this.m_ChairID == 3 || this.m_ChairID == 5)?'UserInfo2':'UserInfo';
        this.m_ViewStr = 'UserInfo';
        // this.$('UserInfo').active = false;
        // this.$('UserInfo2').active = false;
        this.$(this.m_ViewStr).active = true;

        if(Chair == 3 || Chair == 4 || Chair == 5 || Chair == 6)
            this.$(this.m_ViewStr+'/UserAdd').setPosition(-121,85);
    },
    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_pUserItem = pUserItem;
        this.m_dwUserID = pUserItem.GetUserID();
        this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
        this.$(this.m_ViewStr+'@UserCtrl').SetShowFullName(false, 6);
        this.SetUserScore(pUserItem.GetUserScore(), 0);
    },
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
            this.$(this.m_ViewStr+'@UserCtrl').SetShowFullName(false, 6);
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
        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID,pGlobalUserData.szClientIP);
    },
    UpdateScore:function(pUserItem, TableScore) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore(), 0);
        }
    },

    SetUserScore:function (Score, TableScore) {
        this.$(this.m_ViewStr+'/Score@Label').string = Score2Str(Score- TableScore);
    },

    SetBanker:function (bBanker) {
        if(bBanker == null) bBanker = false;
        this.$(this.m_ViewStr+'/UserBanker').active = bBanker;
    },
    SetCreater:function (bBanker) {
        if(bBanker == null) bBanker = false;
        this.$(this.m_ViewStr+'/UserCreater').active = bBanker;
    },
    
    SetEndScore:function (Score) {
        Score = Score2Str(Score);
        var str = Score;
        var LbScore =  this.$(this.m_ViewStr+'/EndScore@Label');
        if(Score != ''){
            if(parseInt(Score) > 0){
                str='+'+Score;
                LbScore.node.color = cc.color(255,198,1);
            }else{
                LbScore.node.color = cc.color(255,255,255);
            } 
        }
        LbScore.string = str;  
    },

    SetAddScore:function(Score){
        this.$(this.m_ViewStr+'/UserAdd/score@Label').string = Score;
    },

});
