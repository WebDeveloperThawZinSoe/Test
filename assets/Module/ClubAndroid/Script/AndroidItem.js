
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre: function () {
        if(this.m_userCtrl == null){
            this.m_userCtrl = this.$('@UserCtrl');
            this.m_LbIndex = this.$('LbIndex@Label');
            this.m_LbScore = this.$('LbScore@Label');
        } 
    },

    SetPreInfo: function (InfoArr) {
        this.m_LbIndex.string = parseInt(InfoArr[1][2]);
        this.m_LbScore.string = Score2Str(parseInt(InfoArr[1][1]));
        this.m_userCtrl.SetUserByID(InfoArr[1][0]);
        this._userID = InfoArr[1][0];
        this.$('BtSetScore').active = g_ShowClubInfo.wKindID >0;
    },

    OnClicked_Del: function() {
        window.gClubClientKernel.onSendDeleteAndroid(this.m_Hook, g_ShowClubInfo.dwClubID,this._userID);
    },

    OnClicked_SetScore: function() {
        this.m_Hook.onShowClubInput(1,this);
    },
    onSetAndroidScore:function(Score){
        this.m_Hook.onSetAndroidScore(this._userID,Score);
    },

});
