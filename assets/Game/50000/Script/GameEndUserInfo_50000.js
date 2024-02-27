cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_FontArr:[cc.Font],
        m_BgArr:[cc.Node],
        m_Score:[cc.Label],
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

        // this.m_Score[0].string=Score2Str(EndInfo.llSumWinScore[wChair]);
        // this.m_Score[1].string=Score2Str(EndInfo.llSumLoseScore[wChair]);

        this.m_Score[0].string=(EndInfo.cbWinCount[wChair]);
        this.m_Score[1].string=(EndInfo.cbLoseCount[wChair]);



        var LabScore = this.$('LbScore@Label')  
        if( EndInfo.llTotalScore[wChair] >= 0){
            LabScore.string = '+';
            LabScore.font = this.m_FontArr[0];
            this.m_BgArr[0].active=true;
            this.m_BgArr[1].active=false;
        }else{
            LabScore.string = '';
            LabScore.font = this.m_FontArr[1];
            this.m_BgArr[0].active=false;
            this.m_BgArr[1].active=true;
        }
       // LabScore.string += Score2Str(EndInfo.llTotalScore[wChair]);
        LabScore.string += Score2Str(EndInfo.llTotalScore[wChair]);
    },
});
