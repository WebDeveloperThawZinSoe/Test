cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Layout: cc.Node,
    },

    ctor: function () {
        this.m_MaxChair = 10;   //

        this.SUB_C_CHEAT = 101; //
        this.SUB_C_CHEATCARD = 102; //

        this.SUB_S_CHEAT = 201; //
        this.SUB_S_CHEATCARD = 202; //
    },

    SetGameEngine: function (GameEngine) {
        this.m_GameEngine = GameEngine;
    },

    OnShowView: function () {
        this.InitView();
    },

    OnEventTestMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case this.SUB_S_CHEAT: {
                return this.OnSubUpdateCheatInfo(pData, wDataSize);
            }
            case this.SUB_S_CHEATCARD: {
                return this.OnSubUpdateCheatCardInfo(pData, wDataSize);
            }
        }
        return false;
    },

    ////////////////////////////
    ShowUserCheatCtrl: function () { // 选中自己 用户页面
        if (!this.m_CardCtrl) {
            this.InitView();
            return;
        }

        this.node.getChildByName('ButtonLayout').active = true;
        let Cheat = this.CMD_Cheat();
        Cheat.wChairID = this.m_GameEngine.GetMeChairID();
        this.m_GameEngine.SendGameData(this.SUB_C_CHEAT, Cheat);
    },

    OnSubUpdateCheatInfo: function (pData, wDataSize) { // 选中自己的响应
        let pCheat = this.CMD_Cheat();
        if (wDataSize != gCByte.Bytes2Str(pCheat, pData)) return false;
        this.m_Hook.OnGetCardTestInfo2();
        this.ShowCheckUser(pCheat.wChairID);
        return true;
    },

    ShowCheckUser: function (wChairID) {
        for (let idx = 0; idx < this.m_MaxChair; idx++) {
            let UserID = this.GetUserID(idx);
            this.m_UserArr[idx].SetUserInfo(UserID);
            if (0 == UserID) continue;

            if (wChairID == this.GetChairID(idx)) {
                this.m_UserArr[idx].Check();
            }
        }
    },
    ////////////////////////////
    ShowCardCheatCtrl: function () { // 选中自己 牌页面
        if (!this.m_CardCtrl) {
            this.InitView();
            return;
        }
        this.node.getChildByName('ButtonLayout').active = false;
        this.SendCheatCard(this.m_GameEngine.GetMeChairID());
        this.m_CardCtrl.m_HideHook = true;
    },

    OnClickShowCheatCard: function () {
        for (let idx = 0; idx < this.m_MaxChair; idx++) { // 设置牌
            if (!this.m_UserArr[idx].node.active) continue;
            if (!this.m_UserArr[idx].IsChecked()) continue;

            this.SendCheatCard(this.GetChairID(idx));
            break;
        }
    },

    OnSubUpdateCheatCardInfo: function (pData, wDataSize) {
        let pCheat = this.CMD_S_CheatCard();
        if(GameDef.KIND_ID == 50001)pCheat = this.CMD_S_CheatCard_50001();
        if(GameDef.KIND_ID == 62202)pCheat = this.CMD_S_CheatCard_62202();
        if (wDataSize != gCByte.Bytes2Str(pCheat, pData)) return false;
        this.m_Hook.OnGetCardTestInfo2();
        if (!this.m_CardCtrl) return true;
        this.m_CardCtrl.node.active = true;
        this.m_CardCtrl.InitCardCtrl(pCheat.wChairID, pCheat.cbCardCount);

        return true;
    },

    SendCheatCard: function (wChairID, CardInfo) {
        let CheatCard = this.CMD_C_CheatCard(wChairID);
        if(GameDef.KIND_ID == 63500)CheatCard = this.CMD_C_CheatCard_63500(wChairID);
        
        if (!CardInfo) {
            CheatCard.cbCheatCard[0] = 0; // 获取剩余牌数量
        } else {
            for (let idx = 0; idx < GameDef.MAX_COUNT; idx++) {
                CheatCard.cbCheatCard[idx] = CardInfo[idx];
            }
            if(GameDef.KIND_ID == 63500){
                for (let idx = 0; idx < 5; idx++) {
                    CheatCard.cbCheatCard[idx] = CardInfo[idx];
                }
            }
        }
        if(GameDef.KIND_ID == 21050)
        {
            CheatCard = this.CMD_C_CheatCard_21050(wChairID);
           
            if (!CardInfo) {
                CheatCard.cbCheatCard = 0; // 获取剩余牌数量
            } else {
              
                 CheatCard.cbCheatCard = CardInfo;    
            }
        }
        this.m_GameEngine.SendGameData(this.SUB_C_CHEATCARD, CheatCard);
    },

    GetChairID: function (wViewID) {
        if (!this.m_GameEngine.m_GameClientView.m_pIClientUserItem[wViewID]) return INVALD_CHAIR;
        return this.m_GameEngine.m_GameClientView.m_pIClientUserItem[wViewID].GetChairID();
    },

    GetUserID: function (wViewID) {
        if (!this.m_GameEngine.m_GameClientView.m_pIClientUserItem[wViewID]) return 0;
        return this.m_GameEngine.m_GameClientView.m_pIClientUserItem[wViewID].GetUserID();
    },

    InitView: function () {
        if (!this.m_UserArr) { // key:vid
            this.m_UserArr = new Array();
            for (let idx = 0; idx < this.m_MaxChair; idx++) {
                let node = this.m_Layout.getChildByName(idx.toString());
                if (!node) continue;
                this.m_UserArr[idx] = node.getComponent('UserCheatPre');
            }
        }

        if (!this.m_CardCtrl) {
            this.ShowPrefabDLG('TestPK', this.node, function (Js) {
                this.m_CardCtrl = Js;
                this.m_CardCtrl.node.active = false;
                this.node.active = false;
            }.bind(this));
        } else {
            this.m_CardCtrl.m_HideHook = false;
            this.node.active = false;
        }
    },

    // update (dt) {},



    CMD_C_CheatCard: function (wChairID) {
        let Obj = new Object();
        //Obj._name="CMD_C_CheatCard"
        Obj.wChairID = wChairID;
        Obj.cbCheatCard = new Array(GameDef.MAX_COUNT); //
        return Obj;
    },
    CMD_C_CheatCard_63500: function (wChairID) {
        let Obj = new Object();
        //Obj._name="CMD_C_CheatCard_63500"
        Obj.wChairID = wChairID;
        Obj.cbCheatCard = new Array(5); //
        return Obj;
    },
    
    CMD_C_CheatCard_21050: function (wChairID) {
        let Obj = new Object();
        //Obj._name="CMD_C_CheatCard_21050"
        Obj.wChairID = wChairID;
        Obj.cbCheatCard = 0; //
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
        Obj.cbCardCount = new Array(54); //手上扑克
        return Obj;
    },
    CMD_S_CheatCard_50001: function () {
        let Obj = new Object();
        //Obj._name="CMD_S_CheatCard_50001"
        Obj.wChairID = INVALD_CHAIR;
        Obj.cbCardCount = new Array(40); //手上扑克
        return Obj;
    },
    CMD_S_CheatCard_62202: function () {
        let Obj = new Object();
        //Obj._name="CMD_S_CheatCard_62202"
        Obj.wChairID = INVALD_CHAIR;
        Obj.cbCardCount = new Array(28); //手上扑克
        return Obj;
    },
});
