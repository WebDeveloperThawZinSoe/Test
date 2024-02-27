
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre: function () {
        if(this.m_userCtrl == null){
            this.m_userCtrl = this.$('@UserCtrl');
            this.m_LbIndex = this.$('LbIndex@Label');
            this.m_LbWinCnt = this.$('LbWinCnt@Label');
            this.m_LbDrawCnt = this.$('LbDrawCnt@Label');
            this.m_LbScore1 = this.$('LbScore1@Label');
            this.m_LbScore2 = this.$('LbScore2@Label');
            this.m_LbScore3 = this.$('LbScore3@Label');
        } 
    },

    SetPreInfo: function (InfoArr) {
        this.m_LbIndex.string = parseInt(InfoArr[0])+1;
        this.m_LbWinCnt.string = InfoArr[1][1];
        this.m_LbDrawCnt.string = InfoArr[1][2];
        this.m_LbScore1.string = Score2Str(InfoArr[1][3]);
        this.m_LbScore2.string = Score2Str(InfoArr[1][4]);
        this.m_LbScore3.string = Score2Str(parseInt(InfoArr[1][5]));
        this.m_userCtrl.SetUserByID(InfoArr[1][0]);
        this._userID = InfoArr[1][0];
    },
    
});
