
cc.Class({
    extends: cc.Component,

    properties: {
        m_UserScore:cc.Label,
        m_LandFlag:cc.Sprite,
        m_Progress:cc.ProgressBar,
        m_UserAddScore:cc.Label,
        m_AllBG:cc.Node,
    },

    // use this for initialization
    start :function() {
        this.m_LandFlag.node.active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
    },
    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.m_lUserScore = pUserItem.GetUserScore();
        this.SetUserScore(pUserItem.GetUserScore());
        if(TableScore == null) TableScore=0;
        this.SetTableScore(TableScore);
    },
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },
    SetOffLine:function(bOffLine) {
        this.node.getChildByName('OffLine').active = bOffLine;
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
            this.m_ChairID,
            ''+this.m_pUserItem.GetUserIP());
        //if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID);
    },
    UpdateScore:function(pUserItem, TableScore) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_lUserScore = pUserItem.GetUserScore();
            this.SetUserScore(pUserItem.GetUserScore());
            this.SetTableScore(TableScore);
        }
    },

    SetUserScore:function (Score) {
        var tScore = Score2Str(Score);
        this.m_UserScore.string = '总分:'+tScore;
    },

    SetBanker:function (bBanker) {
        if(bBanker == null) bBanker = false;
        this.m_LandFlag.node.active = bBanker;
    },

    ShowClock:function (bShow) {
        this.m_Progress.node.active = bShow;
    },
    SetClockNum:function (CntDown) {
        this.m_Progress.progress = CntDown;
    },
    SetTableScore:function (Score) {
        var tScore = Score2Str(Score);
        this.m_UserAddScore.string = '下注:'+tScore;
    },
    SetTableAllBG:function () {
        this.m_AllBG.setPosition(-118,-73.9);
    },
    updateTotleScore:function(score){
        this.SetUserScore(this.m_lUserScore-score);
    }
});
