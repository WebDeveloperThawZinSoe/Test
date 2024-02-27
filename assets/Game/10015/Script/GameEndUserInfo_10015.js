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
        this.SetEndInfo(ParaArr[0],ParaArr[1]);
    },
    SetEndInfo:function(wChair, EndInfo) {
        this.$('@UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
        
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
