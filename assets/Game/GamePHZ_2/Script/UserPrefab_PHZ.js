cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Atlas: cc.SpriteAtlas,
        m_Progress: cc.ProgressBar,
        m_FntEndScore: [cc.Font],
    },

    onLoad: function () {
        this.TraverseNode(this.node, 'CheckNode', this);
        if (this.onLoad2) this.onLoad2();
    },

    //添加相应节点变量
    CheckNode: function (TagNode) {
        if (TagNode.name == 'CurrentNode') this.m_CurrentNode = TagNode;
        if (TagNode.name == 'BankerNode') this.m_BankerNode = TagNode;
        if (TagNode.name == 'TrusteeNode') this.m_TrusteeNode = TagNode;
        if (TagNode.name == 'NoQiangNode') this.m_NoQiangNode = TagNode;
        if (TagNode.name == 'LabUserScore') this.m_LabUserScore = TagNode.getComponent(cc.Label);
        if (this.CheckNode2) this.CheckNode2(TagNode);
    },

    start: function () {
        if (this.m_BankerNode) this.m_BankerNode.active = false;
        if (this.m_TrusteeNode) this.m_TrusteeNode.active = false;
        if (this.m_LabUserScore) this.m_LabUserScore.string = '';
        this.SetWuFu(false);
        this.SetNoDouble(false);
        this.SetEndScore();
    },

    Init: function (View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
    },

    SetUserItem: function (pUserItem) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.UpdateUserInfo();
    },

    SetUserID: function (dwUserID) {
        this.node.active = true;
        this.m_dwUserID = dwUserID;
        this.UpdateUserInfo();
    },

    UpdateUserInfo: function () {
        var pUserCtrl = this.node.getComponent('UserCtrl');
        if (pUserCtrl) pUserCtrl.SetUserByID(this.m_dwUserID, true);
        if (pUserCtrl) pUserCtrl.SetShowFullName(false, 6);
        if (this.m_pUserItem) this.SetUserScore(this.m_pUserItem.GetUserScore());
    },

    UserLeave: function (pUserItem) {
        if (pUserItem && pUserItem.GetUserID() == this.m_dwUserID) {
            this.m_dwUserID = 0;
            this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
            this.m_LabUserScore.string = '';
            this.node.active = false;
        }
    },

    SetOffLine: function (bOffLine) {
        var pOffLineNode = this.node.getChildByName('OffLine')
        if (pOffLineNode) pOffLineNode.active = bOffLine;
    },

    UpdateScore: function (pUserItem) {
        if (pUserItem && pUserItem.GetUserID() == this.m_dwUserID) {
            this.SetUserScore(pUserItem.GetUserScore());
        }
    },

    SetUserScore: function (Score) {
        if (this.m_LabUserScore) this.m_LabUserScore.string = '总分:' + Score2Str(Score);
    },

    SetBanker: function (bBanker) {
        if (bBanker == null) bBanker = false;
        if (this.m_BankerNode) this.m_BankerNode.active = bBanker;
    },

    SetKickOut: function (bShowBt) {
        var BtNode = this.node.getChildByName('BtKickOut');
        if (BtNode) BtNode.active = bShowBt;
    },

    OnBtClickKickOut: function () {
        this.m_Hook.m_GameClientEngine.OnKickOutUser(this.m_pUserItem.GetChairID());
    },

    ShowCurrent: function (bShow) {
        if (this.m_CurrentNode) this.m_CurrentNode.active = bShow;
    },

    ShowNoQiang: function (bShow) {
        if (!this.m_NoQiangNode) return;
        this.m_NoQiangNode.active = bShow;
    },

    SetTrustee: function (bTrustee) {
        if (!this.m_TrusteeNode) return;
        this.m_TrusteeNode.active = bTrustee;
    },
    //递归遍历子节点
    TraverseNode: function (TagNode, Callfunc, Hook) {
        if (TagNode && TagNode.name[0] != '$') {
            // if(Callfunc) Callfunc._function(TagNode);
            if (Hook && Callfunc) Hook[Callfunc](TagNode);
        }
        // this.CheckNode(TagNode);
        for (var i = 0; i < TagNode.childrenCount; i++) {
            if (TagNode.children[i].name[0] == '$') continue;
            this.TraverseNode(TagNode.children[i], Callfunc, Hook);
        }
        return false;
    },

    //添加相应节点变量
    CheckNode2: function (TagNode) {
        if (TagNode.name == 'EndNode') this.m_EndScoreBG = this.$('@Sprite', TagNode);
        if (TagNode.name == 'FlagWuFu') this.m_FlagWuFu = this.$('@Sprite', TagNode);
        if (TagNode.name == 'FlagNoDouble') this.m_FlagNoDouble = this.$('@Sprite', TagNode);
        if (TagNode.name == 'EndScore') this.m_EndScore = this.$('@Label', TagNode);

    },

    SetWuFu: function(bShow) {
        if(this.m_FlagWuFu) this.m_FlagWuFu.node.active = (bShow ? true : false);
    },

    SetNoDouble: function(bShow) {
        if(this.m_FlagNoDouble) this.m_FlagNoDouble.node.active = (bShow ? true : false);
    },

    ShowClock: function (bShow) {
        this.m_Progress.node.active = bShow;
    },

    SetClockNum: function (CntDown) {
        this.m_Progress.progress = CntDown;
    },

    SetEndScore: function (Score) {
        var lTemp = Number(Score);
        if (isNaN(lTemp)) {
            this.m_EndScoreBG.node.active = false;
        } else {
            this.m_EndScoreBG.node.active = true;
            this.m_EndScore.font = this.m_FntEndScore[lTemp > 0 ? 0 : 1];
            this.m_EndScoreBG.spriteFrame = this.m_Atlas.getSpriteFrame(lTemp > 0 ? 'BGEndWin' : 'BGEndLost');
            this.m_EndScore.string = (lTemp > 0 ? '+' : '') + lTemp;
        }
    },

    SetHuxi: function (cbHuxiCount) {
        this.$('UserInfoBG/LabHuXi@Label').string = cbHuxiCount + '胡息';
        return;
        var pCtrl = this.node.getComponent('CustomPage');
        if (!pCtrl) return;
        pCtrl.SetCustomText([cbHuxiCount + '胡息']);        
    },

    SetWeaveScore: function (lScore) {
        var pCtrl = this.node.getComponent('CustomPage');
        if (!pCtrl) return;
        pCtrl.SetCustomText([lScore > 0 ? "+" + Score2Str(lScore): "" + Score2Str(lScore)]);
    },

    OnBtClickedUser: function () {
        if(!this.m_pUserItem) return;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (this.m_dwUserID == pGlobalUserData.dwUserID) {
           return;
        }
        if (this.m_Hook.m_FaceExCtrl) this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID, this.m_pUserItem.GetUserIP());
    },
});
