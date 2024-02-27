cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Win: cc.Node,
        m_Creater:cc.Node,
        m_LabWinCount: cc.Label,
        m_LabLoseCount: cc.Label,
        m_LabScoreWin: cc.Label,
        m_LabScoreLose: cc.Label,
        m_atlas:cc.SpriteAtlas
    },

    start: function () {

    },

    InitPre: function () {
        this.node.active = false;
        this.m_LabScoreWin.string = '';
        this.m_LabScoreLose.string = '';
    },

    SetPreInfo: function (ParaArr) {
        this.node.active = true;
        this.SetEndInfo(ParaArr[0], ParaArr[1], ParaArr[2]);
    },

    SetEndInfo: function (wChair, pRoomEnd, dwCreaterID) {
        this.m_dwUserID = pRoomEnd.UserID[wChair];
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.m_Creater.active = (dwCreaterID == this.m_dwUserID);

        var lScore = pRoomEnd.llTotalScore[wChair];
        var MaxScore = 0;
        for (let i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (pRoomEnd.llTotalScore[i] > MaxScore)
                MaxScore = pRoomEnd.llTotalScore[i]
        }

        this.m_Win.active = (MaxScore == lScore && MaxScore > 0);
        // if(this.m_Win.active) this.$('@Sprite').spriteFrame = this.m_atlas.getSpriteFrame('BigWin');
        // else this.$('@Sprite').spriteFrame = this.m_atlas.getSpriteFrame('BigLose');

        lScore = Score2Str(lScore);
        if(lScore > 0) {
            this.m_LabScoreWin.string = '+' + lScore;
        } else {
            this.m_LabScoreLose.string = lScore;
        }

        this.m_LabWinCount.string = '' + pRoomEnd.cbWinCount[wChair];
        this.m_LabLoseCount.string = '' + pRoomEnd.cbLoseCount[wChair];
    },
});
