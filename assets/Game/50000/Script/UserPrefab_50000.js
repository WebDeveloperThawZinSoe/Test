cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserScore: cc.Label,
        m_progressbar:cc.Component,
        m_Pass:cc.Node,
        m_king:cc.Node,//托管节点  名字换成别的不好使
        m_warning:cc.Component,
        m_Trustee:cc.Node,
    },

    onLoad: function() {
        this.node.active = false;
        this.m_nodeOffLine = this.node.getChildByName('OffLine');
        this.m_nodeOffLine.active = false;
        this.m_nodeReady = this.node.getChildByName('Ready');
        this.m_nodeReady.active = false;
        this.m_Trustee.active = false;
    },
    // use this for initialization
    start: function () {
        
    },

    Init: function (View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
        //this.m_fuckyou.active = false;
    },


    SetReady:function(show){
        this.m_nodeReady.active = show;
    },

    SetUserItem: function (pUserItem) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false,5);
        
        this.UpdateUserItem(pUserItem);
    },

    UserLeave: function (pUserItem) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.m_dwUserID = 0;
            this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
            this.m_UserScore.string = '';
            this.node.active = false;
        }
    },

    OnBtClickedUser: function () {

        if(this.m_dwUserID == null || this.m_dwUserID == 0) return;

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if (this.m_Hook.m_FaceExCtrl) this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.node.getComponent('UserCtrl').m_LabNick.string,
            '' + this.m_pUserItem.GetUserIP(), pGlobalUserData.llUserIngot, this.m_ChairID);
    },

    UpdateUserItem: function (pUserItem,TableScore) {
        if (pUserItem.GetUserID() == this.m_dwUserID) {
            this.m_pUserItem = pUserItem;
            this.SetUserScore(pUserItem.GetUserScore(),0);
            this._updateStat();
        }
    },

    SetUserScore: function (Score,TableScore) {
        this.m_UserScore.string = Score2Str(Score - TableScore);
        //this.m_UserScore.string = (Score - TableScore);
    },

    SetBanker: function (bBanker) {
        if (bBanker == null) bBanker = false;
        this.m_LandFlag.node.active = bBanker;
    },
    SetTrustee: function(bTrustee) {
        if(!this.m_Trustee) return;
        this.m_Trustee.active = bTrustee;
    },

    setCur: function (bShow) {
        //this.m_nodeCur.active = bShow;
    },

    _updateStat: function () {
        this._hideStat();
        if (this.m_pUserItem.GetUserStatus() == US_READY) {
            this.m_nodeReady.active = true;
        } else if (this.m_pUserItem.GetUserStatus() == US_OFFLINE) {
            this.m_nodeOffLine.active = true;
        } else {
            this._hideStat();
        }
    },

    _hideStat: function () {
        this.m_nodeReady.active = false;
        this.m_nodeOffLine.active = false;
    },

    resetView: function () {
        //console.log( this);
        //this.node.getComponent('addScore').$Label.string = '0';
        //this.node.getChildByName('addScore').getChildByName('_addScore').getComponent(cc.Label).string='0';
        //this._addScore.$Label.string = '0';
       // this.node.getChildByName('_resultScore').active=false;
        //this._resultScore.active = false;
    },

});