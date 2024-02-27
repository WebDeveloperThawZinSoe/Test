
cc.Class({
    extends: cc.CardCtrlBase_PHZ,

    properties: {
        m_CardPrefab: cc.Prefab
    },

    ctor: function () {
        this.m_Content = null;
        this.m_ContentArray = new Array();
    },

    onLoad: function() {
        for(var i = 0; i < 10; ++ i) {
            var pNode = this.node.getChildByName('Layout' + i);
            if(pNode) {
                this.m_ContentArray[i] = pNode.getComponent(cc.Layout);
            }
        }
    },

    start: function () {
    },

    SetCardData2: function (cbCardData, cbCardCount) {
        //效验参数
        // if (cbCardCount > GameDef.MAX_CARD_COUNT) return false;
        this.RemoveIntoPool(this.m_CardArr, this.m_CardPool);
        //扑克数目
        this.m_cbCardCount = 0;
        if(cbCardCount > 0) {
            this.m_Content.node.active = true;
        } else {
            this.m_Content.node.active = false;
        }
        //设置扑克
        for (var i = 0; i < cbCardCount; i++) {
            // this.AddCardItem(cbCardData[i]);
            this.AddCardItem({
                CardArray: this.m_CardArr,
                CardPool: this.m_CardPool,
                // CardPrefab: this.GetGamePrefab('CardPrefab'),
                CardPrefab:cc.instantiate(this.m_CardPrefab).getComponent('CardPrefab_PHZ'),
                ParentNode: this.m_Content.node,
                Component: 'CardPrefab_PHZ',
                Scale: 1,
                Display: true,
                cbCardData: cbCardData[i],
                Index: [this.m_cbCardCount],
            });
        }
        return true;
    },

    AddCard: function(cbCardData) {
        if(!this.m_CardPool) this.InitPool();
        this.AddCardItem({
            CardArray: this.m_CardArr,
            CardPool: this.m_CardPool,
            // CardPrefab: this.GetGamePrefab('CardPrefab'),
            CardPrefab:cc.instantiate(this.m_CardPrefab).getComponent('CardPrefab_PHZ'),
            ParentNode: this.m_Content.node,
            Component: 'CardPrefab_PHZ',
            Scale: 1,
            Display: true,
            cbCardData: cbCardData,
            Index: [this.m_cbCardCount],
        });
        this.m_Content.node.active = true;
    },

    SetAttribute3: function() {
        if(this.m_ContentArray[this.m_Attribute.wViewID]) {
            this.m_Content = this.m_ContentArray[this.m_Attribute.wViewID];
        } else {
            this.m_Content = this.m_ContentArray[0];
        }
        this.m_Content.node.active = true;
    },

    //基准位置
    SetBenchmarkPos3: function () {
        this.node.setPosition(this.m_BenchmarkPos.x, this.m_BenchmarkPos.y);
    },

    SetScale3: function() {
        this.node.scale = this.m_fScaleValue;
    },

    GetNextPosition: function() {
        var ptPos =  cc.v2(this.m_Content.node.getPosition().x, this.m_Content.node.getPosition().y);
        if(this.m_cbCardCount > 0){
            ptPos.x += this.m_CardArr[(this.m_cbCardCount-1)].node.getPosition().x;
            ptPos.y += this.m_CardArr[(this.m_cbCardCount-1)].node.getPosition().y;
        }
        ptPos.x *= this.m_fScaleValue;
        ptPos.y *= this.m_fScaleValue;
        return ptPos;
    },
});
