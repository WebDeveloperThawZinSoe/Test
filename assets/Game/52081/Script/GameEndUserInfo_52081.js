cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabScore:cc.Label,   
        m_LabWin:cc.Label,  
        m_LabLose:cc.Label, 
        m_FontArr:[cc.Font],
        m_Atlas:cc.SpriteAtlas,
        m_LabAll:cc.Label, 
        m_SpRank:cc.Sprite
    },


    start :function() {
    },

    SetEndInfo:function(wChair, EndInfo, Winner, bSelf) {
        this.node.getComponent('UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        this.m_LabAll.string = EndInfo.cbALLWinCount[wChair]+'/'+EndInfo.cbALLLoseCount[wChair];


        this.m_SpRank.spriteFrame = this.m_Atlas.getSpriteFrame('Img_Rank'+EndInfo.cbMaxRank[wChair]);


        if( EndInfo.llTotalScore[wChair] >= 0){
            this.m_LabScore.string = '+';
            this.m_LabScore.font = this.m_FontArr[0];
        }else{
            this.m_LabScore.string = ''
            this.m_LabScore.font = this.m_FontArr[1];
        }
        this.m_LabScore.string += Score2Str(EndInfo.llTotalScore[wChair]);
    },
});
