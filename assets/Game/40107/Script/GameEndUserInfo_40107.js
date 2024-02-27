cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_WinNode:cc.Node,
        m_LabMaxScore:cc.Label,
        m_LabMaxBomb:cc.Label,
        m_LabWin:cc.Label,
        m_LabLose:cc.Label,
        m_LabScore:cc.Label,
        m_FontArr:[cc.Font],
        m_BGSprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas,
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
    SetEndInfo:function(wChair, EndInfo, Winner, bSelf) {
        this.node.getComponent('UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        var str = 'BGEnd' +(bSelf?'0':'1')
        //this.m_BGSprite.spriteFrame = this.m_atlas.getSpriteFrame(str);
        this.m_WinNode.active = wChair==Winner;
        this.m_LabMaxScore.string = EndInfo.lMaxScore[wChair];
        this.m_LabMaxBomb.string = EndInfo.bBombCount[wChair];
        this.m_LabWin.string = EndInfo.cbWinCount[wChair];
        this.m_LabLose.string = EndInfo.cbLoseCount[wChair];
        this.m_LabScore.string = ''
        if( EndInfo.lTotalScore[wChair] >= 0){
            this.m_LabScore.string = '+';
            this.m_LabScore.font = this.m_FontArr[0];
        }else{
            this.m_LabScore.font = this.m_FontArr[1];
        }
        this.m_LabScore.string +=Score2Str( EndInfo.lTotalScore[wChair]);
    },
});
