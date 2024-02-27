cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EndScore: cc.Label,
        m_Font: [cc.Font],
        m_CardCtrlPrefab: cc.Prefab,
        m_CardCtrl:cc.Node, 
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    ctor: function() {},
    start: function() {},
    onLoad: function() {
        this.m_EndScore.string = "";
        
        var node = cc.instantiate(this.m_CardCtrlPrefab);
        node.setPosition(cc.v2(0,0));
        this.m_CardCtrl.addChild(node);
        this.m_UserCard = node.getComponent('CardCtrl_33301');
    },
    InitPre:function(){
        this.node.active = false;
    },
    SetPreInfo: function(ParaArr) {
        this.node.active = true;
        this.SetEndInfo(ParaArr[0], ParaArr[1], ParaArr[2], ParaArr[3]);
    },
    SetEndInfo: function(wChair, EndInfo, bBanker, Rule) {
        this.m_dwUserID = EndInfo.dwUserID[wChair];
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        this.node.getComponent('UserCtrl').SetShowFullName(false, 6);
        //填写小结算分数
        var Score = EndInfo.lGameScore[wChair];
        if(Score > 0)
        {
            this.m_EndScore.string = Score2Str(Score);
            this.m_EndScore.font = this.m_Font[0];
   
        }
        else
        {
            this.m_EndScore.string = Score2Str(Score);
            this.m_EndScore.font = this.m_Font[1];

        }

        var cbCardData = EndInfo.cbHandCardData[wChair];
        var wCardCount = EndInfo.cbCardCount[wChair];
        this.m_UserCard.SetCardData(cbCardData,wCardCount);

    },
    // update (dt) {},
});
        