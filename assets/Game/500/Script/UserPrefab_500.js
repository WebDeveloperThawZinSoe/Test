cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserScore: cc.Label,
        m_nodeBank: cc.Node,
        m_nodeReady: cc.Node,
        m_nodeRoomOwner: cc.Node,
        m_nodeTimes: [cc.Node],
        m_nodeLight: cc.Node,
    },

    ctor: function () {
        this.m_UserCtrl = null;
    },

    onLoad() {
        this.m_nodeBank.active = false;
        this.m_nodeTimes[2].active = false;
        this.m_UserCtrl = this.node.getComponent('UserCtrl');
    },
    // use this for initialization
    start: function () {},

    Init: function (View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
    },

    SetUserItem: function (pUserItem) {
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        if(!this.m_UserCtrl) this.m_UserCtrl = this.node.getComponent('UserCtrl');
        this.m_UserCtrl.SetUserByID(this.m_dwUserID);
        this.m_UserCtrl.SetShowFullName(false, 5);
        this.SetUserScore(pUserItem.GetUserScore());
        this.node.active = true;
    },

    UserLeave: function (pUserItem) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.m_dwUserID = 0;
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },
    UpdateScore: function (pUserItem) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.SetUserScore(pUserItem.GetUserScore());
        }
    },

    SetUserScore: function (Score) {
        this.m_UserScore.string =Score2Str(Score) ;
    },

    setBank: function (bShow) {
        this.m_nodeBank.active = bShow;
    },

    // update: function (dt) {},

    OnBtClickedUser: function () {
        cc.gSoundRes.PlaySound('Button');
        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        let pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }

        if (this.m_Hook.m_FaceExCtrl)  this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID,this.m_pUserItem.GetUserIP());
    },

    OnUserOffLine: function (bShow) {
        var NdOffLine = this.$('OffLine')
        if(NdOffLine) NdOffLine.active = bOffLine;
    },

    OnUserReady: function (bShow) {
        this.m_nodeReady.active = bShow;
    },

    showTimes: function (cbTimes) {
        // for (var i in this.m_nodeTimes) {
        //     this.m_nodeTimes[i].active = cbTimes == i;
        // }
        this.m_nodeTimes[2].active = cbTimes == 2;
    },

    setLight: function (bShow) {
        this.m_nodeLight.active = bShow;
    },

});