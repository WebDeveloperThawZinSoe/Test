
cc.Class({
    extends: cc.Component,

    properties: {
        m_NickName:cc.Label,
        m_UserScore:cc.Label,
        m_LandFlag:cc.Sprite,
        m_Farmer:cc.Sprite,
        m_Trustee:cc.Node,
        m_LabDouble:cc.Node,
    },

    // use this for initialization
    onLoad :function() {
        this.m_LandFlag.node.active = false;
        this.m_Farmer.node.active = false;
        this.m_Trustee.active = false;
        this.m_LabDouble.active = false;
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
    OnBtClickedUser:function(){
        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.node.getComponent('UserCtrl').m_LabNick.string,
            this.m_pUserItem.GetUserIP(),  pGlobalUserData.llUserIngot, this.m_ChairID);
    },
    UpdateScore:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.SetUserScore(pUserItem.GetUserScore());
        }
    },

    SetUserScore:function (Score) {
        this.m_UserScore.string = ''+Score2Str(Score);
    },

    SetBanker:function (bBanker,data) {
        if(bBanker == null) bBanker = false;
        this.m_LandFlag.node.active = bBanker;
        if(bBanker == false && data != 65535) this.m_Farmer.node.active =true;
        else this.m_Farmer.node.active = false;
    },
    SetTrustee:function(bTrustee){
        if(!this.m_Trustee) return;
        this.m_Trustee.active = bTrustee;
    },

    SetKickOut:function (bShowBt) {
       var BtNode = this.node.getChildByName('BtKickOut');
       if(BtNode) BtNode.active = bShowBt;
    },
    OnBtClickKickOut:function () {
        this.m_Hook.m_GameClientEngine.OnKickOutUser(this.m_pUserItem.GetChairID());
    },
    SetDouble:function(bShow,posx){
        this.m_LabDouble.active = bShow;
        this.m_LabDouble.x = posx;
    },
});
