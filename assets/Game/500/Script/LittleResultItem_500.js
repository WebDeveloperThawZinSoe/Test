cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_spCard: [cc.Sprite],
        m_Atlas: cc.SpriteAtlas,
        m_labLoseScore: cc.Label,
        m_labWinScore: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ctor() {
        this.m_CardType = {
            20: '三顺子',
            21: '三同花',
            22: '六对半',
            23: '五对三条',
            24: '四套三条',
            25: '全黑',
            26: '全红',
            27: '全小',
            28: '全大',
            29: '一条龙',
            30: '三分天下',
            31: '三同花顺',
            32: '十二皇族',
            33: '一条花龙',
            34: '至尊清龙',
        };
    },

    start() {

    },
    //Pre js
    InitPre:function(){
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){
        this.ShowItemView(ParaArr[0], ParaArr[1], ParaArr[2]);
    },
    _setScore: function (llScore) {
        this.m_labLoseScore.node.active = false;
        this.m_labWinScore.node.active = false;
        if (llScore > 0) {
            this.m_labWinScore.string = '+' +Score2Str(llScore) ;
            this.m_labWinScore.node.active = true;
        } else if (llScore < 0) {
            this.m_labLoseScore.string = Score2Str(llScore);
            this.m_labLoseScore.node.active = true;
        } else {
            this.m_labWinScore.string = Score2Str(llScore);
            this.m_labWinScore.node.active = true;
        }
    },

    ShowItemView: function (cmd, wChairID, pGameView) {
        this._setScore(cmd.llGameScore[wChairID]);
        // this.m_labSpecial.string = this.m_CardType[cmd.cbSpecialType[wChairID]];
        // this.m_labSpecial.node.active = cmd.cbSpecialType[wChairID] > 0;
        for (var i in this.m_spCard) {
            this.m_spCard[i].spriteFrame = this.m_Atlas.getSpriteFrame(this.m_Hook.m_Hook.GetCardSprite(cmd.cbCardData[wChairID][i]));
        }
        this.node.active = true;
        this.$('@UserCtrl').SetUserByID(cmd.dwUserID[wChairID]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
    },

    // update (dt) {},
});