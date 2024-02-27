cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_FontArr:[cc.Font],
    },


    start :function() {
    },
    InitPre :function() {
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr) {
        this.node.active = true;
        this.SetEndInfo(ParaArr[0],ParaArr[1],ParaArr[2],ParaArr[3]);
    },
    SetEndInfo:function(wChair, EndInfo, Winner, wLoser) {
        this.$('@UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
        //this.$('spWinner').active = wChair==Winner;
        //this.$('spLoser').active = wChair==wLoser;
        this.$('LbCBanker@Label').string = EndInfo.wCallCnt[wChair];
        this.$('LbBanker@Label').string = EndInfo.wBankerCnt[wChair];
        this.$('LbAdd@Label').string = EndInfo.wAddCnt[wChair];

        this.$('LbWin@Label').string = EndInfo.wWinCnt[wChair];
        this.$('LbLose@Label').string = EndInfo.wLoseCnt[wChair];

        var LabScore = this.$('LbScore@Label')  
        if( EndInfo.llTotalScore[wChair] >= 0){
            LabScore.string = '+';
            LabScore.font = this.m_FontArr[0];
        }else{
            LabScore.string = '';
            LabScore.font = this.m_FontArr[1];
        }
        LabScore.string += EndInfo.llTotalScore[wChair] / window.PLATFORM_RATIO;
    },
});
