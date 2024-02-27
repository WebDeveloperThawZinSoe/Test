
cc.Class({
    extends: cc.Component,

    properties: {
        m_NickName:cc.Label,
        m_UserScore:cc.Label,
        m_LandFlag:cc.Sprite,
        m_Alert:cc.Node,
        
    },

    // use this for initialization
    start :function() {
        this.m_LandFlag.node.active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
    },
    SetUserItem:function(pUserItem) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.SetUserScore(pUserItem.GetUserScore());
    },
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
            this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },
    SetOffLine:function(bOffLine) {
        this.node.getChildByName('OffLine').active = bOffLine;
    },
    SetAlert:function(bAlert) {
        this.m_Alert.active = bAlert;
    },

    
    OnBtClickedUser:function(){
        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if (this.m_Hook.m_FaceExCtrl) this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID,this.m_pUserItem.m_UserInfo.szClientIP);
    },
    UpdateScore:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore());
        }
    },

    SetUserScore:function (Score) {
        this.m_UserScore.string = Score2Str(Score);
    },

    SetBanker:function (bBanker) {
        if(bBanker == null) bBanker = false;
        this.m_LandFlag.node.active = bBanker;
    },
});
