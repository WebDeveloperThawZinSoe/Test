cc.Class({
    extends: cc.BaseClass,

    properties: {},

    ctor: function () {

    },
    start: function () {

    },
    onLoad() {},

    InitPre: function () {
        this.node.active = false;
    },

    SetPreInfo: function (Param) {
        this.node.active = true;
        this.SetEndInfo(Param);
    },

    SetEndInfo: function (Info) {
        this.ResetControl();
        this.m_Info = Info;
        // 玩家信息
        if (this.m_UserCtrl) this.m_UserCtrl.SetUserByID(this.m_Info.pGameEnd.dwUserID[this.m_Info.wChairID]);
        if (this.m_UserCtrl) this.m_UserCtrl.SetShowFullName(false, 6);
        // 特殊牌型
        if (this.m_LabCardType) this.m_LabCardType.string = GameDef.GetSpecialName(this.m_Info.pGameEnd.cbSpecialCT[this.m_Info.wChairID]);
        // 牌数据
        this.m_CardCtrl.SetCardData(this.m_Info.pGameEnd.cbCardData[this.m_Info.wChairID], this.m_Info.pGameEnd.cbCardCount[this.m_Info.wChairID]);
        // 剩余牌数
        if (this.m_LabCardCount) this.m_LabCardCount.string = this.m_Info.pGameEnd.cbCardCount[this.m_Info.wChairID] > 0 ? this.m_Info.pGameEnd.cbCardCount[this.m_Info.wChairID] : 0;
        // 炸弹分数
        this.SetLabelScore(this.m_BombScoreWin, this.m_BombScoreLose, this.m_Info.pGameEnd.llBombScore[this.m_Info.wChairID]);
        // 春天分数
        this.SetLabelScore(this.m_SpringScoreWin, this.m_SpringScoreLose, this.m_Info.pGameEnd.llSpringScore[this.m_Info.wChairID]);
        // 名堂分数
        this.SetLabelScore(this.m_SpScoreWin, this.m_SpScoreLose, this.m_Info.pGameEnd.llSpScore[this.m_Info.wChairID]);
        // 总分
        this.SetLabelScore(this.m_TotalScoreWin, this.m_TotalScoreLose, this.m_Info.pGameEnd.llScore[this.m_Info.wChairID]);
    },

    SetLabelScore: function (pLabWin, pLabLose, lScore) {
        if (pLabWin) pLabWin.string = '';
        if (pLabLose) pLabLose.string = '';
        lScore = Score2Str(lScore);
        if (lScore > 0) {
            if (pLabWin) pLabWin.string = '+' + lScore;
        }else {
            if (pLabLose) pLabLose.string = lScore;
        }
    },

    ResetControl: function () {
        if (!this.m_UserCtrl) this.m_UserCtrl = this.$('@UserCtrl');
        
        if (!this.m_CardCtrl) this.m_CardCtrl = this.$('CardCtrl@CardCtrl_60001');
        if (this.m_CardCtrl) {
            this.m_CardCtrl.SetBenchmarkPos(-500, -60, enXLeft)
            this.m_CardCtrl.SetCardDistance(90);
        }

        if (!this.m_LabCardCount) this.m_LabCardCount = this.$('LabCardCount@Label');
        if (this.m_LabCardCount) this.m_LabCardCount.string = '';

        if (!this.m_LabCardType) this.m_LabCardType = this.$('LabCardType@Label');
        if (this.m_LabCardType) this.m_LabCardType.string = '';

        if (!this.m_BombScoreWin) this.m_BombScoreWin = this.$('BombScore/LabWin@Label');
        if (this.m_BombScoreWin) this.m_BombScoreWin.string = '';
        if (!this.m_BombScoreLose) this.m_BombScoreLose = this.$('BombScore/LabLose@Label');
        if (this.m_BombScoreLose) this.m_BombScoreLose.string = '';

        if (!this.m_SpringScoreWin) this.m_SpringScoreWin = this.$('SpringScore/LabWin@Label');
        if (this.m_SpringScoreWin) this.m_SpringScoreWin.string = '';
        if (!this.m_SpringScoreLose) this.m_SpringScoreLose = this.$('SpringScore/LabLose@Label');
        if (this.m_SpringScoreLose) this.m_SpringScoreLose.string = '';

        if (!this.m_SpScoreWin) this.m_SpScoreWin = this.$('SpScore/LabWin@Label');
        if (this.m_SpScoreWin) this.m_SpScoreWin.string = '';
        if (!this.m_SpScoreLose) this.m_SpScoreLose = this.$('SpScore/LabLose@Label');
        if (this.m_SpScoreLose) this.m_SpScoreLose.string = '';

        if (!this.m_TotalScoreWin) this.m_TotalScoreWin = this.$('TotalScore/LabWin@Label');
        if (this.m_TotalScoreWin) this.m_TotalScoreWin.string = '';
        if (!this.m_TotalScoreLose) this.m_TotalScoreLose = this.$('TotalScore/LabLose@Label');
        if (this.m_TotalScoreLose) this.m_TotalScoreLose.string = '';

    },

    // update (dt) {},
});
