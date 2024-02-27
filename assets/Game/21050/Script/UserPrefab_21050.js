
cc.Class({
    extends: cc.Component,

    properties: {
        m_NickName: cc.Label,
        m_UserScore: cc.Label,
        m_spCurrentHead: cc.Sprite,
        m_BankerFlag: cc.Node,
        m_GameScoreBG: cc.Node,
        m_TableScore: cc.Label,
        m_TurnScore: cc.Label,
        m_InfoLayout: cc.Layout,
        m_LookCard: cc.Sprite,
        m_OffLine:cc.Node,
        m_DisWarningY:cc.Node,
        m_DisWarningR:cc.Node,
        m_CurEffect:cc.Node,
        m_Trustee:cc.Node,
    },

    ctor : function () {
        this.cbEateCard = new Array();
        this.cbEateCount = 0;
    },
    // use this for initialization
    start :function() {
    },

    Init:function(ClientView, wViewChairID) {
        this.m_Hook = ClientView;
        this.m_wViewChairID = wViewChairID;

        if(this.m_wViewChairID <= 2) {
            this.m_InfoLayout.horizontalDirection = 0;
            this.m_InfoLayout.node.setAnchorPoint(0, 0.5);
            this.m_InfoLayout.node.setPosition(-50, -80);
        } else {
            this.m_InfoLayout.horizontalDirection = 1;
            this.m_InfoLayout.node.setAnchorPoint(1, 0.5);
            this.m_InfoLayout.node.setPosition(50, -80);
        }
        this.m_DisWarningY.active = false;
        this.m_DisWarningR.active = false;
        this.m_Trustee.active = false;
    },

    SetUserItem:function(pUserItem) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.SetUserScore(pUserItem.GetUserScore(),0);
    },

    SetLookCard:function(bLook) {
        //this.m_LookCard.node.active =bLook;
    },

    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.m_NickName.string = '';
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },

    UpdateScore:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore(), 0);
        }
    },

    SetOffLine:function(bOffLine) {
        this.m_OffLine.active = bOffLine;
    },

    //设置昵称
    SetNickName :function(szNickName){
        this.m_NickName.string = szNickName;
    },

    SetUserScore:function (score,TableScore) {
        this.m_UserScore.string = Score2Str(score);
    },

    setCurrent : function (bIsMe) {
        //this.m_spCurrentHead.node.active = bIsMe
        this.m_CurEffect.active = bIsMe;
    },

    setTableScore: function(score) {
        this.m_TableScore.string = score;
    },

    setTurnScore: function(score) {
        this.m_TurnScore.string = score;
    },

    SetBanker: function(bBanker) {
        this.m_BankerFlag.active = bBanker;
    },
    OnBtClickedUser:function(){
        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(
            this.m_dwUserID,
            this.m_wViewChairID,
            this.m_pUserItem.GetUserIP()
        );

    },
    
    //距离警报
    SetDisWarning:function(bShow, level)
    {
        this.m_DisWarningY.active = (bShow && level == 1);
        this.m_DisWarningR.active = (bShow && level == 2);
    },
    //托管
    SetTrustee:function(bShow)
    {
        this.m_Trustee.active = bShow;
    },
});
