cc.Class({
    extends: cc.CardCtrlBase_PHZ,

    properties: {
        m_CardCtrlPrefab: cc.Prefab,
    },
    ctor: function () {
        this.m_cbSelLeftCardData = 0;
        this.m_cbSelHandCardData = 0;

        this.m_FullCnt = 54;
        this.m_CardArr = new Array(
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, //  1 ~ 10
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, // 壹 ~ 拾
            0x21, // 王
        );
    },

    onLoad: function () {
        if (!this.m_HandCardNode) this.m_HandCardNode = this.node.getChildByName('HandCardNode');
        if (!this.m_LeftCardNode) this.m_LeftCardNode = this.node.getChildByName('LeftCardNode');
    },

    start: function () {},

    InitCtrl: function (cbHandCardIndex, cbLeftCardIndex) {
        this.m_cbSelLeftCardData = 0;
        this.m_cbSelHandCardData = 0;

        if (!this.m_HandCardNode) this.m_HandCardNode = this.node.getChildByName('HandCardNode');
        if (!this.m_LeftCardNode) this.m_LeftCardNode = this.node.getChildByName('LeftCardNode');

        if (!this.m_cbHandCardIndex) this.m_cbHandCardIndex = new Array();
        this.m_cbHandCardIndex.length = GameDef.MAX_INDEX;
        this.m_cbHandCardIndex.fill(0);
        if(cbHandCardIndex) this.m_cbHandCardIndex = clone(cbHandCardIndex);

        if (!this.m_cbLeftCardIndex) this.m_cbLeftCardIndex = new Array();
        this.m_cbLeftCardIndex.length = GameDef.MAX_INDEX;
        this.m_cbLeftCardIndex.fill(0);
        if(cbLeftCardIndex) this.m_cbLeftCardIndex = clone(cbLeftCardIndex);

        // 手牌控件
        if (!this.m_HandCardControl) {
            //this.m_HandCardControl = this.GetGamePrefab('CardCtrlPrefab');
            this.m_HandCardControl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ');
            this.m_HandCardNode.addChild(this.m_HandCardControl.node);
            this.m_HandCardControl.SetAttribute({
                _ClientEngine: this,
                _ClientView: this,
                bBig: false,
                _OutCardCallback: 'OnHandCardCtrlOutCard'
            });
            this.m_HandCardControl.SetBenchmarkPos(0, -360, GameDef.enXCenter, GameDef.enYBottom);
            this.m_HandCardControl.SetCardDistance(0);
            this.m_HandCardControl.SetScale(1);
            this.m_HandCardControl.SetPositively(true);
            this.m_HandCardControl.SetSelMode(0);
            this.m_HandCardControl.SetName('PHZTestCardCtrl-m_HandCardControl');
        }

        // 已选定控件 - 手牌
        if (!this.m_SelHandCardCtrl) {
            //this.m_SelHandCardCtrl = this.GetGamePrefab('CardCtrlPrefab');
            this.m_SelHandCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ');
            this.m_HandCardNode.addChild(this.m_SelHandCardCtrl.node);
            this.m_SelHandCardCtrl.SetAttribute({
                _ClientEngine: this,
                _ClientView: this,
                bBig: false,
                _ClickCardCallback: 'OnSelHandCardCtrlClicked'
            });
            this.m_SelHandCardCtrl.SetBenchmarkPos(-300, -50, GameDef.enXCenter, GameDef.enYBottom);
            this.m_SelHandCardCtrl.SetCardDistance(0);
            this.m_SelHandCardCtrl.SetScale(1);
            this.m_SelHandCardCtrl.SetPositively(true);
            this.m_SelHandCardCtrl.SetShowFrame(true);
            this.m_SelHandCardCtrl.SetSelMode(0);
            this.m_SelHandCardCtrl.SetName('PHZTestCardCtrl-m_SelHandCardCtrl');
        }

        // 剩余牌控件
        if (!this.m_LeftCardControl) {
            //this.m_LeftCardControl = this.GetGamePrefab('CardCtrlPrefab');
            this.m_LeftCardControl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ');
            this.m_LeftCardNode.addChild(this.m_LeftCardControl.node);
            this.m_LeftCardControl.SetAttribute({
                _ClientEngine: this,
                _ClientView: this,
                bBig: false,
                _OutCardCallback: 'OnLeftCardCtrlOutCard'
            });
            this.m_LeftCardControl.SetBenchmarkPos(0, 100, GameDef.enXCenter, GameDef.enYBottom);
            this.m_LeftCardControl.SetCardDistance(0);
            this.m_LeftCardControl.SetScale(0.75);
            this.m_LeftCardControl.SetPositively(true);
            this.m_LeftCardControl.SetSelMode(0);
            this.m_LeftCardControl.SetName('PHZTestCardCtrl-m_LeftCardControl');
        }

        // 已选定控件 - 剩余牌
        if (!this.m_SelLeftCardCtrl) {
            //this.m_SelLeftCardCtrl = this.GetGamePrefab('CardCtrlPrefab');
            this.m_SelLeftCardCtrl = cc.instantiate(this.m_CardCtrlPrefab).getComponent('CardCtrl_PHZ');
            this.m_LeftCardNode.addChild(this.m_SelLeftCardCtrl.node);
            this.m_SelLeftCardCtrl.SetAttribute({
                _ClientEngine: this,
                _ClientView: this,
                bBig: false,
                _ClickCardCallback: 'OnSelLeftCardCtrlClicked'
            });
            this.m_SelLeftCardCtrl.SetBenchmarkPos(300, -50, GameDef.enXCenter, GameDef.enYBottom);
            this.m_SelLeftCardCtrl.SetCardDistance(0);
            this.m_SelLeftCardCtrl.SetScale(1);
            this.m_SelLeftCardCtrl.SetPositively(true);
            this.m_SelLeftCardCtrl.SetShowFrame(true);
            this.m_SelLeftCardCtrl.SetSelMode(0);
            this.m_SelLeftCardCtrl.SetName('PHZTestCardCtrl-m_SelLeftCardCtrl');
        }

        this.SetControlCardData(this.m_HandCardControl, this.m_cbHandCardIndex, 1);
        this.SetControlCardData(this.m_LeftCardControl, this.m_cbLeftCardIndex, 2);
        this.SetTouchOn();
    },

    UpdateView: function (cbHandCardIndex, cbLeftCardIndex) {
        if(cbHandCardIndex) {
            var cbSelCount = 0;
            if(this.m_cbSelHandCardData != 0) {
                cbSelCount = 1;
                var cbIndex = GameLogic.SwitchToCardIndex(this.m_cbSelHandCardData);
                if(cbHandCardIndex[cbIndex] > 0) cbHandCardIndex[cbIndex]--;
                else {
                    this.m_cbSelHandCardData = 0;
                    cbSelCount = 0;
                }
            }
            this.m_cbHandCardIndex = clone(cbHandCardIndex);
            this.SetControlCardData(this.m_HandCardControl, this.m_cbHandCardIndex, 1, true);
            this.m_SelLeftCardCtrl.SetCardData([
                [this.m_cbSelHandCardData]
            ], cbSelCount, 1, true);
        }

        if(cbLeftCardIndex) {
            var cbSelCount = 0;
            if(this.m_cbSelLeftCardData != 0) {
                cbSelCount = 1;
                var cbIndex = GameLogic.SwitchToCardIndex(this.m_cbSelLeftCardData);
                if(cbLeftCardIndex[cbIndex] > 0) cbLeftCardIndex[cbIndex]--;
                else {
                    this.m_cbSelLeftCardData = 0;
                    cbSelCount = 0;
                }
            }
            this.m_cbLeftCardIndex = clone(cbLeftCardIndex);
            this.SetControlCardData(this.m_LeftCardControl, this.m_cbLeftCardIndex, 2);
            this.m_SelLeftCardCtrl.SetCardData([
                [this.m_cbSelLeftCardData]
            ], cbSelCount, 1, true);
        }
    },

    SetControlCardData: function (pControl, cbCardIndex, cbSortType) {
        if (!pControl || !cbCardIndex) return;
        var cbCardData = new Array(GameDef.FULL_COUNT);
        var cbCardCount = GameLogic.SwitchToCardData1(cbCardIndex, cbCardData, cbCardData.length);
        pControl.SetCardData(cbCardData, cbCardCount, cbSortType, true);
    },

    OnHandCardCtrlOutCard: function (cbCardData) {
        if (this.m_cbSelHandCardData != 0) {
            this.SetControlCardData(this.m_HandCardControl, this.m_cbHandCardIndex, 1);
            return;
        }
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        if (cbIndex >= 0 && cbIndex < GameDef.MAX_INDEX) {
            this.m_cbHandCardIndex[cbIndex]--;
            this.m_cbSelHandCardData = cbCardData;
            this.m_SelHandCardCtrl.SetCardData([
                [cbCardData]
            ], 1, 1, true);
            this.SetControlCardData(this.m_HandCardControl, this.m_cbHandCardIndex, 1);
        }
    },

    OnLeftCardCtrlOutCard: function (cbCardData) {
        if (this.m_cbSelLeftCardData != 0) {
            this.SetControlCardData(this.m_LeftCardControl, this.m_cbLeftCardIndex, 2);
            return;
        }
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        if (cbIndex >= 0 && cbIndex < GameDef.MAX_INDEX) {
            this.m_cbLeftCardIndex[cbIndex]--;
            this.m_cbSelLeftCardData = cbCardData;
            this.m_SelLeftCardCtrl.SetCardData([
                [cbCardData]
            ], 1, 1, true);
            this.SetControlCardData(this.m_LeftCardControl, this.m_cbLeftCardIndex, 2);
        }
    },

    OnSelHandCardCtrlClicked: function (cbCardData) {
        if (this.m_cbSelHandCardData != cbCardData) return;
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        if (cbIndex >= 0 && cbIndex < GameDef.MAX_INDEX) {
            this.m_cbHandCardIndex[cbIndex]++;
            this.m_SelHandCardCtrl.SetCardData(0, 0, 1);
            this.SetControlCardData(this.m_HandCardControl, this.m_cbHandCardIndex, 1);
            this.m_cbSelHandCardData = 0;
        }
    },

    OnSelLeftCardCtrlClicked: function (cbCardData) {
        if (this.m_cbSelLeftCardData != cbCardData) return;
        var cbIndex = GameLogic.SwitchToCardIndex(cbCardData);
        if (cbIndex >= 0 && cbIndex < GameDef.MAX_INDEX) {
            this.m_cbLeftCardIndex[cbIndex]++;
            this.m_SelLeftCardCtrl.SetCardData(0, 0, 1, true);
            this.SetControlCardData(this.m_LeftCardControl, this.m_cbLeftCardIndex, 2);
            this.m_cbSelLeftCardData = 0;
        }
    },

    OnBtSureChangeCard: function () {
        if (this.m_cbSelHandCardData != 0 && this.m_cbSelLeftCardData != 0) {
            if (!this.m_Hook || !this.m_Hook.m_GameClientEngine || !this.m_Hook.m_GameClientEngine.OnMessageCommand) return;
            var pSwapCard = GameDef.CMD_S_TestSwapCard();
            pSwapCard.cbCardData[0] = this.m_cbSelHandCardData;
            pSwapCard.cbCardData[1] = this.m_cbSelLeftCardData;
            this.m_Hook.m_GameClientEngine.OnMessageCommand(4, pSwapCard);
            this.ResetView();
        }
    },

    //触摸事件
    onTouchBegan: function (event) {
        this.m_bHandTouch = this.m_HandCardControl.onTouchBegan(event);
        this.m_bLeftTouch = this.m_LeftCardControl.onTouchBegan(event);
        this.m_bSelHandTouch = this.m_SelHandCardCtrl.onTouchBegan(event);
        this.m_bSelLeftTouch = this.m_SelLeftCardCtrl.onTouchBegan(event);
        return true;
    },

    //触摸事件
    onTouchMove: function (event) {
        if (this.m_bHandTouch) this.m_HandCardControl.onTouchMove(event);
        if (this.m_bLeftTouch) this.m_LeftCardControl.onTouchMove(event);
        // if(this.m_bSelHandTouch) this.m_SelHandCardCtrl.onTouchMove(event);
        // if(this.m_bSelLeftTouch) this.m_SelLeftCardCtrl.onTouchMove(event);
    },

    onTouchEnded: function (event) {
        if (this.m_bHandTouch) this.m_HandCardControl.onTouchEnded(event);
        if (this.m_bLeftTouch) this.m_LeftCardControl.onTouchEnded(event);
        if (this.m_bSelHandTouch) this.m_SelHandCardCtrl.onTouchEnded(event);
        if (this.m_bSelLeftTouch) this.m_SelLeftCardCtrl.onTouchEnded(event);
    },

    HideView: function () {
        this.ResetView();
        if (this.m_Hook && this.m_Hook.m_GameClientEngine && this.m_Hook.m_GameClientEngine.OnMessageCommand) {
            this.m_Hook.m_GameClientEngine.OnMessageCommand(3, null);
        }
        this.node.active = false;
    },

    ResetView: function () {
        // 重置
        this.m_cbSelHandCardData = 0;
        this.m_cbSelLeftCardData = 0;
        this.m_SelHandCardCtrl.SetCardData(0, 0, 1, true);
        this.m_SelLeftCardCtrl.SetCardData(0, 0, 1, true);
    },
});
