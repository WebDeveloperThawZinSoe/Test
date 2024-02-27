cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CardPre: cc.Node,
        m_CardNode: cc.Node,
        m_SetNode: cc.Node,
        m_LabNum: cc.Label,
    },

    ctor: function () {
        this.m_FullCnt = 54;
        this.m_CardArr = new Array(
            0x01, 0x11, 0x21, 0x31, 0x02, 0x12, 0x22, 0x32
            , 0x03, 0x13, 0x23, 0x33, 0x04, 0x14, 0x24, 0x34
            , 0x05, 0x15, 0x25, 0x35, 0x06, 0x16, 0x26, 0x36
            , 0x07, 0x17, 0x27, 0x37, 0x08, 0x18, 0x28, 0x38
            , 0x09, 0x19, 0x29, 0x39, 0x0A, 0x1A, 0x2A, 0x3A
            , 0x0B, 0x1B, 0x2B, 0x3B, 0x0C, 0x1C, 0x2C, 0x3C
            , 0x0D, 0x1D, 0x2D, 0x3D
            , 0x4E, 0x4F
        );

        this.m_CardCount = new Array();
        this.m_CardCtrlArr = new Array();
        this.m_wChairID = INVALID_CHAIR;
        this.m_cbMaxCnt = 0;
        this.m_HideHook = false;
    },

    OnHideView: function () {
        this.node.active = false;

        if (this.m_HideHook) {
            this.m_Hook.HideView();
        }
    },

    InitCardCtrl: function (wChairID, CntArr) {
        if (GameDef.KIND_ID == 50001) {
            this.m_FullCnt = 10;
            this.m_CardArr = new Array(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x15);
        } 
        if (GameDef.KIND_ID == 63504) {
            this.m_FullCnt = 10;
            this.m_CardArr = new Array( 0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A);
        } 
        if (GameDef.KIND_ID == 62202) {
            this.m_FullCnt = 28;
            this.m_CardArr = new Array( 0x01, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,	//方块 A - K
                                        0x11, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,	//梅花 A - K
                                        0x21, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,	//红桃 A - K
                                        0x31, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D	//黑桃 A - K
            );
        } 
        for (let i = 0; i < this.m_FullCnt; i++) {
            if (this.m_CardCtrlArr[i] == null) {
                this.m_CardCtrlArr[i] = this.GetCardPre(this.m_CardArr[i]);
                this.m_CardNode.addChild(this.m_CardCtrlArr[i].node);
            }
            if(GameDef.KIND_ID == 50001)this.m_CardCount[i] = 2;
            else{
                this.m_CardCount[i] = CntArr[i];
            }
     
            this.m_CardCtrlArr[i].SetCardCount(this.m_CardCount[i]);
            this.m_CardCtrlArr[i].node.active = CntArr[i] > 0;
        }

        this.m_SetNode.removeAllChildren();
        this.m_wChairID = wChairID;
  
        this.m_cbMaxCnt = GameDef.MAX_COUNT >= 20 ? 17 : GameDef.MAX_COUNT;   
        if(GameDef.KIND_ID == 50000)this.m_cbMaxCnt =GameDef.MAX_COUNT;
        if(GameDef.KIND_ID == 60001)this.m_cbMaxCnt =GameDef.GetMaxCardCount();
        if(GameDef.KIND_ID == 60002)this.m_cbMaxCnt =GameDef.GetMaxCardCount();
        if(GameDef.KIND_ID == 10011)this.m_cbMaxCnt =GameDef.GetCardCount();
        if(GameDef.KIND_ID == 63500)this.m_cbMaxCnt =5;
        if(GameDef.KIND_ID == 21050)this.m_cbMaxCnt =1;
        this.UpdateCardCount();
    },

    GetCardPre: function (cbCardData) {
        let CardCtrl = cc.instantiate(this.m_CardPre).getComponent('TestPKItem');
        CardCtrl.node.active = true;
        CardCtrl.SetData(cbCardData,GameDef.KIND_ID);
        CardCtrl.m_Hook = this;
        return CardCtrl;
    },

    OnBtSelCard: function (node) {
        if ((this.m_cbMaxCnt) && (this.m_SetNode.childrenCount >= this.m_cbMaxCnt)) return;
        let CardValue = parseInt(node.name);
        for (let i = 0; i < this.m_CardArr.length; i++) {
            if (this.m_CardArr[i] != CardValue) continue;

            if (this.m_CardCount[i] > 0) {
                this.m_CardCount[i]--;
                this.m_CardCtrlArr[i].SetCardCount(this.m_CardCount[i]);
                let temp = this.GetCardPre(this.m_CardArr[i]);
                this.m_SetNode.addChild(temp.node);
                temp.node.y = 0;
            }

            break;
        }

        this.UpdateCardCount();
    },

    OnBtDelCard: function (node) {
        let CardValue = parseInt(node.name);
        for (let idx = 0; idx < this.m_CardArr.length; idx++) {
            if (this.m_CardArr[idx] != CardValue) continue;

            this.m_CardCount[idx]++;
            this.m_CardCtrlArr[idx].SetCardCount(this.m_CardCount[idx]);
            node.parent = null;
            break;
        }

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

        this.m_Hook.SendCheatCard(this.m_wChairID, TempCardArr);

        this.HideView();
    },

    OnClickedReset: function () {
        this.m_Hook.SendCheatCard(this.m_wChairID);
    },

    UpdateCardCount: function () {
        this.m_LabNum.string = '' + this.m_SetNode.childrenCount + '/' + this.m_cbMaxCnt;
    },
});
