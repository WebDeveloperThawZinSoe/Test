cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_LabHuCount: cc.Label,
        m_LabPaoCount: cc.Label,
        m_LabScore: cc.Label,
        m_LabWinScore: cc.Label,
        m_LabLoseScore: cc.Label,
        m_FlagWinner: cc.Sprite,
        m_FlagPao: cc.Sprite,
    },


    onLoad: function () {

    },

    start: function () {

    },

    InitPre: function () {
        this.node.active = false;
    },

    SetPreInfo: function (ParaArr) {
        this.node.active = true;
        this.SetEndInfo(ParaArr[0], ParaArr[1], ParaArr[2], ParaArr[3], ParaArr[4]);
    },

    SetEndInfo: function (wChairID, EndInfo, wWinner, wPaoWang, dwUserID) {
        this.node.getComponent('UserCtrl').SetUserByID(dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.m_FlagWinner.node.active = (wChairID == wWinner);
        this.m_FlagPao.node.active = wChairID == wPaoWang;

        this.m_LabHuCount.string = EndInfo.cbHuCount[wChairID];
        this.m_LabPaoCount.string = EndInfo.cbPaoCount[wChairID];

        this.m_LabScore.string = EndInfo.lTotalScore[wChairID] > 0 ? '+' + Score2Str(EndInfo.lTotalScore[wChairID]) : Score2Str(EndInfo.lTotalScore[wChairID]);
        this.m_LabScore.node.color = EndInfo.lTotalScore[wChairID] > 0 ? cc.color(242, 3, 35) : cc.color(81, 255, 12);

        this.m_LabWinScore.string = EndInfo.lTotalScore[wChairID] > 0 ? '+' + Score2Str(EndInfo.lTotalScore[wChairID]) : '';
        this.m_LabLoseScore.string = EndInfo.lTotalScore[wChairID] > 0 ? '' : Score2Str(EndInfo.lTotalScore[wChairID]);
    },
});
