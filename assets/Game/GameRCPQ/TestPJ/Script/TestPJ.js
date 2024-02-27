cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CardPre: cc.Node,
        m_CardNode: cc.Node,
        m_SetNode: cc.Node,
        m_LabNum: cc.Label,
    },

    ctor: function () {
        this.SUB_C_CHEAT = 101; //
        this.SUB_C_CHEATCARD = 102; //

        this.SUB_S_CHEAT = 201; //
        this.SUB_S_CHEATCARD = 202; //

        this.m_CardCount = new Array();
        this.m_CardCtrlItem = new Array();

        this.m_wChairID = INVALID_CHAIR;
        this.m_cbMaxCnt = 0;

        this.m_CardInfo = new Array(
            0x03, 0x05, 0x06, 0x07, 0x08, 0x09
            , 0x15, 0x17, 0x18, 0x19
            , 0x26, 0x27, 0x2A, 0x2B
            , 0x34, 0x36, 0x3A
            , 0x44
            , 0x58
            , 0x62
            , 0x7C
        );
    },

    OnShowView: function () {
    },

    OnHideView: function () {
        this.node.active = false;
    },

    SetGameEngine: function (GameEngine) {
        this.m_GameEngine = GameEngine;
    },

    ShowCardCheatCtrl: function () { // 选中自己 牌页面
        this.SendCheatCard(this.m_GameEngine.GetMeChairID());
    },

    OnEventTestMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case this.SUB_S_CHEATCARD: {
                return this.OnSubUpdateCheatCardInfo(pData, wDataSize);
            }
        }
        return false;
    },

    OnSubUpdateCheatCardInfo: function (pData, wDataSize) {
        let pCheat = this.CMD_S_CheatCard();
        if (wDataSize != gCByte.Bytes2Str(pCheat, pData)) return false;

        this.InitCardCtrl(pCheat.wChairID, pCheat.cbCardCount);

        return true;
    },

    InitCardCtrl: function (wChairID, cbCardCount) {
        for (let idx = 0; idx < 21; idx++) {
            this.m_CardCount[idx] = cbCardCount[idx];

            if (!this.m_CardCtrlItem[idx]) {
                this.m_CardCtrlItem[idx] = this.GetCardPre(this.m_CardInfo[idx]);
                this.m_CardNode.addChild(this.m_CardCtrlItem[idx].node);
            }

            let bShow = (0 < cbCardCount[idx]);
            this.m_CardCtrlItem[idx].node.active = bShow;
            if (!bShow) continue;
            this.m_CardCtrlItem[idx].SetCardCount(cbCardCount[idx]);
        }

        this.m_SetNode.removeAllChildren();

        this.m_wChairID = wChairID;
        this.m_cbMaxCnt = GameDef.MAX_COUNT >= 20 ? 17 : GameDef.MAX_COUNT;

        this.UpdateCardCount();
    },

    getCardIdx: function (CardData) {
        for (let idx = 0; idx < 21; ++idx) {
            if (CardData == this.m_CardInfo[idx]) {
                return idx;
            }
        }

        return 0;
    },

    OnBtSelCard: function (node) {
        if ((this.m_cbMaxCnt) && (this.m_SetNode.childrenCount >= this.m_cbMaxCnt)) return false;

        let CardData = parseInt(node.name);
        let idx = this.getCardIdx(CardData);
        if (0 == this.m_CardCount[idx]) return false;

        this.m_CardCount[idx]--;
        this.m_CardCtrlItem[idx].SetCardCount(this.m_CardCount[idx]);

        let temp = this.GetCardPre(CardData);
        temp.SetCardCount(1);
        temp.SetSelCard(false);
        temp.node.y = 0;
        this.m_SetNode.addChild(temp.node);

        this.UpdateCardCount();
        return true;
    },

    OnBtDelCard: function (node) {
        let CardData = parseInt(node.name);
        let idx = this.getCardIdx(CardData);

        this.m_CardCount[idx]++;
        this.m_CardCtrlItem[idx].SetCardCount(this.m_CardCount[idx]);
        node.parent = null;

        this.UpdateCardCount();
    },

    OnBtSureChangeCard: function (node) {
        if (this.m_SetNode.childrenCount != this.m_cbMaxCnt) {
            this.ShowTips('请选择正确的牌数!');
            return;
        }

        let TempCardArr = new Array();
        for (let idx = 0; idx < this.m_SetNode.childrenCount; idx++) {
            TempCardArr[idx] = this.m_SetNode.children[idx].name;
        }

        this.SendCheatCard(this.m_wChairID, TempCardArr);

        this.HideView();
    },

    OnClickedReset: function () {
        this.SendCheatCard(this.m_wChairID);
    },

    UpdateCardCount: function () {
        this.m_LabNum.string = '' + this.m_SetNode.childrenCount + '/' + this.m_cbMaxCnt;
    },

    GetCardPre: function (cbCardData) {
        let CardCtrl = cc.instantiate(this.m_CardPre).getComponent('TestItemPJ');
        CardCtrl.node.active = true;
        CardCtrl.SetData(cbCardData);
        CardCtrl.m_Hook = this;
        return CardCtrl;
    },

    ////////////////////////////
    SendCheatCard: function (wChairID, CardInfo) {
        let CheatCard = this.CMD_C_CheatCard(wChairID);

        if (!CardInfo) {
            CheatCard.cbCheatCard[0] = 0; // 获取剩余牌数量
        } else {
            for (let idx = 0; idx < GameDef.MAX_COUNT; idx++) {
                CheatCard.cbCheatCard[idx] = CardInfo[idx];
            }
        }

        this.m_GameEngine.SendGameData(this.SUB_C_CHEATCARD, CheatCard);
    },

    CMD_C_CheatCard: function (wChairID) {
        let Obj = new Object();
        //Obj._name="CMD_C_CheatCard"
        Obj.wChairID = wChairID;
        Obj.cbCheatCard = new Array(GameDef.MAX_COUNT); //
        return Obj;
    },

    CMD_Cheat: function () {
        let Obj = new Object();
        //Obj._name="CMD_Cheat"
        Obj.wChairID = 0;
        return Obj;
    },

    CMD_S_CheatCard: function () {
        let Obj = new Object();
        //Obj._name="CMD_S_CheatCard"
        Obj.wChairID = INVALD_CHAIR;
        Obj.cbCardCount = new Array(21); //手上
        return Obj;
    },
});
