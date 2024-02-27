
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NickName: cc.Label,
        m_UserScore: cc.Label,
        m_BankerFlag: cc.Node,
        m_DFlag: cc.Node,
        m_XFlag: cc.Node,
        m_Current: cc.Node,

        m_OffLine:cc.Node,
        m_LbGold:cc.Label,
        m_LbEndScore:cc.Label,
        m_atlas:cc.SpriteAtlas,
        m_stateSprite:cc.Sprite,

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

    setTableScore: function(score) {
        this.m_TableScore.string = score;
    },

    SetBanker: function(bBanker) {
        this.m_BankerFlag.active = bBanker;
    },
    SetDUser: function(bBanker) {
        this.m_DFlag.active = bBanker;
    },
    SetXUser: function(bBanker) {
        this.m_XFlag.active = bBanker;
    },
    OnBtClickedUser:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            if(this.m_Hook.m_GameClientEngine.m_bGaming == true) this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(
            this.m_dwUserID,
            this.m_wViewChairID,
            this.m_pUserItem.GetUserIP()
        );
        // if(this.m_dwUserID == null || this.m_dwUserID == 0) return;
        // this.m_Hook.ShowPrefabDLG('PlayerInfo',this.m_Hook.node,function(Js){
        //     Js.SetOtherPlayerInfo(this.m_dwUserID, this.m_pUserItem.GetGender(), this.m_pUserItem.GetUserIP(), this.m_Hook.m_strAddress[this.m_wViewChairID]);
        // }.bind(this));
    },
    
    SetUserTableScore:function(llScore){
        if(llScore == -1){
            this.m_LbGold.string = 'allin';
            return
        }
        this.m_LbGold.string = llScore;
    },

    SetEndScore:function(nScore){
        this.m_LbEndScore.string  = nScore;
    },
    HideEndScore:function(){
        this.m_LbEndScore.string  = "";
    },

    SetUserType:function(type){
        this.m_stateSprite.spriteFrame = this.m_atlas.getSpriteFrame('lb'+type);
        this.m_stateSprite.node.active = true;
    },
    HideUserType:function(){
        this.m_stateSprite.node.active = false;
    },

    ShowCurrent:function(bShow){
        this.m_Current.active = bShow;
    },

    SetUserWin:function(bShow){
        this.$("WIN").active = bShow;
    },
});
