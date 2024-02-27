// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_nCardLayer: cc.Node,
        m_nOtherCard: cc.Node,
        m_nLeftCard: cc.Node,
        m_labOtherName: [cc.Label],
        m_LeftCardItem: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    //     console.log("onLoad");
    // },
    // start(){
    //     console.log("start");
    // },
    // update(){
    //   console.log("start");
    // },

    ctor: function () {
        this.m_HandCard = new Array();
        this.m_CardControl = new Array();
        this.m_WeaveControl = new Array();

        this.SUB_C_USER_TEST_OVER = 9;
        this.SUB_C_USER_TEST_CARD = 10;
        this.SUB_C_USER_TEST_NEXT = 99;

        this.SUB_S_USER_TEST_OVER = 115;
    },

    SetGameEngine: function (GameEngine) {
        this.m_GameEngine = GameEngine;
    },

    OnBtnClose: function () {
        //清理数据
        for (let i = 0; i < this.m_CardControl.length; i++) {
            this.m_CardControl[i].ResetView();
        }
        for (let i = 0; i < this.m_WeaveControl.length; i++) {
            this.m_WeaveControl[i].ResetData();
        }
        for (let i = 0; i < this.m_labOtherName.length; i++) {
            this.m_labOtherName[i].node.active = false;
            this.m_labOtherName[i].string = "";
        }

        this.m_nLeftCard.removeAllChildren();

        this.m_nCardLayer.active = false;
        this.m_nOtherCard.active = false;
        this.m_nLeftCard.active = false;

        this.node.active = false;
    },

    OnBtnClickCard: function (target, data) {
        let cardItem = target.currentTarget.getComponent("TestCardItem");
        if (!cardItem) return;
        //构造数据
        let WantCard = this.CMD_C_TestCard(cardItem.GetCardData());
        //发送数据
        this.m_GameEngine.SendGameData(this.SUB_C_USER_TEST_CARD, WantCard);
        this.OnBtnClose();
    },

    ShowCardCheatCtrl: function () {
        this.m_GameEngine.SendGameData(this.SUB_C_USER_TEST_OVER, {});
    },

    OnBtnTestNext: function () {
        this.m_GameEngine.SendGameData(this.SUB_C_USER_TEST_NEXT, {});
    },

    OnEventTestMessage:function(wSubCmdID, pData, wDataSize){
        switch (wSubCmdID) {
            case this.SUB_S_USER_TEST_OVER: {
                return this.OnSubUserTestOver(pData, wDataSize);
            }
        }
        return false;
    },

    //底牌
    OnSubUserTestOver: function (pData, wDataSize) {
        let pTestOver = this.CMD_S_TestOver();
        if (wDataSize != gCByte.Bytes2Str(pTestOver, pData)) return false;
        this.ShowLeft(pTestOver);

        return true;
    },
    ShowLeft: function (TestOver) {
        this.node.active = true;
        this.m_nCardLayer.active = true;
        this.m_nOtherCard.active = false;
        this.m_nLeftCard.active = true;

        //摆牌
        let nIndex = 0;
        for (let i = 0; i < 34; i++) {
            if (0 >= TestOver.cbCardIndex[i] > 0) continue;

            let cardItem = cc.instantiate(this.m_LeftCardItem);
            cardItem.active = true;
            cardItem = cardItem.getComponent("TestCardItem");

            let cardData = GameDef.g_GameLogic.SwitchToCardData(i);
            cardItem.SetCardData(cardData);
            cardItem.SetNumber(TestOver.cbCardIndex[i]);
            this.m_nLeftCard.addChild(cardItem.node);

            cardItem.node.x = -440 + (nIndex % 10) * 90;
            cardItem.node.y = 190 - parseInt(nIndex / 10) * 130;

            nIndex++;
        }
    },
    //用户
    CMD_S_TestOver: function () {
        let Obj = new Object();
        Obj.cbCardIndex = new Array(34);		//牌
        return Obj;
    },
    //所有人
    CMD_S_TestOther: function () {
        let Obj = new Object();
        //扑克信息
        Obj.cbCardCount = new Array(4);	//扑克数目
        Obj.cbCardData = new Array(4);	//扑克数据
        Obj.cbWeaveCount = new Array(4);
        Obj.weaveItem = new Array(4);

        for (let i = 0; i < 4; i++) {
            Obj.cbCardData[i] = new Array(14);
            Obj.weaveItem[i] = new Array(4)
            for (let j = 0; j < 4; j++) {
                Obj.weaveItem[i][j] = GameDef.CMD_WeaveItem();
            }
        }
        return Obj;
    },
    // 用户
    CMD_C_TestCard: function (cardData = 0) {
        let Obj = new Object();
        Obj.cbCardData = cardData;							//牌
        return Obj;
    },

});
