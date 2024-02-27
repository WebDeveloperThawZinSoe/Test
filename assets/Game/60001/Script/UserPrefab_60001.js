cc.Class({
    extends: cc.Component,

    properties: {
        m_NickName: cc.Label,
        m_UserScore: cc.Label,
        m_BankerNode: cc.Node,
        m_NoQiang:cc.Sprite,
        m_CurrentNode: cc.Node,
        m_Trustee: cc.Sprite
    },
    // use this for initialization
    start: function () {
        this.m_BankerNode.active = false;
        this.m_Trustee.node.active = false;
    },

    Init: function (View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
    },

    SetUserItem: function (pUserItem) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.UpdateUserInfo();
    },

    SetUserID: function(dwUserID) {
        this.node.active = true;
        this.m_dwUserID = dwUserID;
        this.UpdateUserInfo();
    },

    UpdateUserInfo: function() {
        var pUserCtrl = this.node.getComponent('UserCtrl');
        if(pUserCtrl) pUserCtrl.SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        if(this.m_pUserItem) this.SetUserScore(this.m_pUserItem.GetUserScore());
    },

    UserLeave: function (pUserItem) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.m_dwUserID = 0;
            this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },

    SetOffLine:function(bOffLine) {
        this.node.getChildByName('OffLine').active = bOffLine;
    },

    OnBtClickedUser: function () {
        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }

        if (this.m_Hook.m_FaceExCtrl) this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID, this.m_pUserItem.GetUserIP());
    },
    UpdateScore: function (pUserItem) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.SetUserScore(pUserItem.GetUserScore());
        }
    },

    SetUserScore: function (Score) {
        var tScore = Score2Str(Score);
        this.m_UserScore.string = tScore;
    },

    SetBanker: function (bBanker) {
        if (bBanker == null) bBanker = false;
        this.m_BankerNode.active = bBanker;
    },

    SetKickOut: function (bShowBt) {
        var BtNode = this.node.getChildByName('BtKickOut');
        if (BtNode) BtNode.active = bShowBt;
    },
    OnBtClickKickOut: function () {
        this.m_Hook.m_GameClientEngine.OnKickOutUser(this.m_pUserItem.GetChairID());
    },

    ShowCurrent: function (bShow) {
        if (this.m_CurrentNode) this.m_CurrentNode.active = bShow;
    },

    ShowNoQiang: function(bShow) {
        if(!this.m_NoQiang) return;
        this.m_NoQiang.node.active = bShow;
    },

    SetTrustee: function(bTrustee) {
        if(!this.m_Trustee) return;
        this.m_Trustee.node.active = bTrustee;
    },
});
