cc.Class({
    extends: cc.CardCtrlBase_PHZ,

    properties: {
        m_CardPrefab: cc.Prefab,
        m_Atlas: cc.SpriteAtlas
    },

    ctor: function () {
        //王牌替换索引
        this.m_cbKingReplace = new Array();
        this.m_Scale = 1;
    },

    start: function () {},

    InitView: function () {
        if (!this.m_TypeSprite) {
            var pNode = this.$('WeaveType');
            if (pNode) this.m_TypeSprite = this.$('img@Sprite', pNode);
            if (this.m_TypeSprite) this.m_TypeSprite.node.active = false;
        }
        if(!this.m_LbHuxi) {
            this.m_LbHuxi = this.$('HuxiNode/LbHuxi@Label');
        }
        if(this.m_LbHuxi) {
            this.m_LbHuxi.string = '';
        }
    },

    Reset2: function () {
        this.SetCardData(GameDef.tagWeaveItem());
    },

    SetCardData2: function (WeaveItem, cbKingReplace) {
        this.InitView();
        if (this.m_TypeSprite) this.m_TypeSprite.node.active = false;
        this.RemoveIntoPool(this.m_CardArr, this.m_CardPool);
        this.m_WeaveItem = clone(WeaveItem);
        if (cbKingReplace) this.m_cbKingReplace = clone(cbKingReplace);
        else this.m_cbKingReplace.length = 0;
        if(this.m_LbHuxi) this.m_LbHuxi.string = '';

        /* //设置扑克
        switch (WeaveItem.wWeaveKind) {
            case GameDef.ACK_NULL: //空
                {
                    //设置扑克
                    this.m_cbCardCount = 0;
                    this.m_cbCardData.length = this.m_cbCardCount;
                    this.m_cbCardData.fill(0);
                    break;
                }
            case GameDef.ACK_TI: //提
                {
                    //设置扑克
                    this.m_cbCardCount = 4;
                    this.m_cbCardData.length = this.m_cbCardCount;
                    this.m_cbCardData.fill(0);
                    this.m_cbCardData[0] = WeaveItem.cbCardList[0];
                    break;
                }
            case GameDef.ACK_PAO: //跑
                {
                    //设置扑克
                    this.m_cbCardCount = 4;
                    this.m_cbCardData = clone(WeaveItem.cbCardList);
                    this.m_cbCardData.length = this.m_cbCardCount;
                    break;
                }
            case GameDef.ACK_WEI: //偎
                {
                    //设置扑克
                    this.m_cbCardCount = 3;
                    this.m_cbCardData.length = this.m_cbCardCount;
                    this.m_cbCardData.fill(0);
                    if (this.m_bDisplay) {
                        this.m_cbCardData[0] = WeaveItem.cbCardList[0];
                    }
                    break;
                }
            case GameDef.ACK_PENG: //碰
                {
                    //设置扑克
                    this.m_cbCardCount = 3;
                    this.m_cbCardData = clone(WeaveItem.cbCardList);
                    this.m_cbCardData.length = this.m_cbCardCount;
                    break;
                }
            case GameDef.ACK_CHI: //吃
                {
                    //设置扑克
                    this.m_cbCardCount = 3;
                    this.m_cbCardData = clone(WeaveItem.cbCardList);
                    this.m_cbCardData.length = this.m_cbCardCount;

                    if (this.m_cbCardData[0] != WeaveItem.cbCenterCard) {
                        var cbTmpCardData = this.m_cbCardData[0];
                        for (var i = 1; i < this.m_cbCardCount; i++) {
                            if (this.m_cbCardData[i] != WeaveItem.cbCenterCard) continue;
                            this.m_cbCardData[0] = this.m_cbCardData[i];
                            this.m_cbCardData[i] = cbTmpCardData;
                            break;
                        }
                    }
                    break;
                }
            case GameDef.ACK_ZHANG: // 掌
                {
                    //设置扑克
                    this.m_cbCardCount = 2;
                    this.m_cbCardData = clone(WeaveItem.cbCardList);
                    this.m_cbCardData.length = this.m_cbCardCount;
                    break;
                }
            default:
                return false;
        } */

        //设置扑克
        if (WeaveItem.wWeaveKind == GameDef.ACK_NULL) //空
        {
            //设置扑克
            this.m_cbCardCount = 0;
            this.m_cbCardData.length = this.m_cbCardCount;
            this.m_cbCardData.fill(0);
        } else if ((GameDef.ACK_TI) && (WeaveItem.wWeaveKind & GameDef.ACK_TI)) //提
        {
            //设置扑克
            this.m_cbCardCount = 4;
            this.m_cbCardData.length = this.m_cbCardCount;
            this.m_cbCardData.fill(0);
            if (this.m_bDisplay) {
                this.m_cbCardData[0] = WeaveItem.cbCardList[0];
            }
        } else if ((GameDef.ACK_PAO) && (WeaveItem.wWeaveKind & GameDef.ACK_PAO)) //跑
        {
            //设置扑克
            this.m_cbCardCount = 4;
            this.m_cbCardData = clone(WeaveItem.cbCardList);
            this.m_cbCardData.length = this.m_cbCardCount;
        } else if ((GameDef.ACK_WEI) && (WeaveItem.wWeaveKind & GameDef.ACK_WEI)) //偎
        {
            //设置扑克
            this.m_cbCardCount = 3;
            this.m_cbCardData.length = this.m_cbCardCount;
            this.m_cbCardData.fill(0);
            console.log(' !!!!!!!!!!!!!!!!!!!!!! ' + (this.m_bDisplay ? 'TRUE' : 'FALSE'));
            if (this.m_bDisplay) {
                this.m_cbCardData[0] = WeaveItem.cbCardList[0];
            }
        } else if ((GameDef.ACK_WEI) && (WeaveItem.wWeaveKind & GameDef.ACK_WEI)) //臭偎
        {
            //设置扑克
            this.m_cbCardCount = 3;
            this.m_cbCardData.length = this.m_cbCardCount;
            this.m_cbCardData.fill(0);
            this.m_cbCardData[0] = WeaveItem.cbCardList[0];
        } else if (((GameDef.ACK_PENG) && (WeaveItem.wWeaveKind & GameDef.ACK_PENG)) || (GameDef.ACK_JIAO) && (WeaveItem.wWeaveKind & GameDef.ACK_JIAO)) //碰
        {
            //设置扑克
            this.m_cbCardCount = 3;
            this.m_cbCardData = clone(WeaveItem.cbCardList);
            this.m_cbCardData.length = this.m_cbCardCount;
        } else if (((GameDef.ACK_CHI) && (WeaveItem.wWeaveKind & GameDef.ACK_CHI)) || (GameDef.ACK_SHUN) && (WeaveItem.wWeaveKind & GameDef.ACK_SHUN)) //吃
        {
            //设置扑克
            this.m_cbCardCount = 3;
            this.m_cbCardData = clone(WeaveItem.cbCardList);
            this.m_cbCardData.length = this.m_cbCardCount;

            if (this.m_cbCardData[0] != WeaveItem.cbCenterCard) {
                var cbTmpCardData = this.m_cbCardData[0];
                for (var i = 1; i < this.m_cbCardCount; i++) {
                    if (this.m_cbCardData[i] != WeaveItem.cbCenterCard) continue;
                    this.m_cbCardData[0] = this.m_cbCardData[i];
                    this.m_cbCardData[i] = cbTmpCardData;
                    break;
                }
            }
        } else if ((GameDef.ACK_ZHANG) && (WeaveItem.wWeaveKind & GameDef.ACK_ZHANG)) // 掌
        {
            //设置扑克
            this.m_cbCardCount = 2;
            this.m_cbCardData = clone(WeaveItem.cbCardList);
            this.m_cbCardData.length = this.m_cbCardCount;
        } else if ((GameDef.ACK_JIAO) && (WeaveItem.wWeaveKind & GameDef.ACK_JIAO)) //绞
        {
            //设置扑克
            this.m_cbCardCount = 3;
            this.m_cbCardData.length = this.m_cbCardCount;
            this.m_cbCardData.fill(0);
            if (this.m_bDisplay) {
                this.m_cbCardData[0] = WeaveItem.cbCardList[0];
            }
        } else return false;

        this.DrawCard();
        return true;
    },

    //绘画扑克
    DrawCard2: function () {
        var cbCount = this.m_cbCardCount;
        this.m_cbCardCount = 0;

        this.m_cbKingState = [false, false, false, false];

        this.m_CardItemArray = new Array();

        for (var i = 0; i < cbCount; ++i) {
            this.node.active = true;
            // 王牌状态
            var bKing = false;
            if (GameLogic.IsValidCard(this.m_WeaveItem.cbCardList[i])) {
                var cbCardIndex = INVALID_BYTE;
                cbCardIndex = GameLogic.SwitchToCardIndex(this.m_WeaveItem.cbCardList[i]);

                for (var j = 0; j < this.m_cbKingReplace.length; ++j) {
                    if (this.m_cbKingState[j] == false && cbCardIndex == this.m_cbKingReplace[j]) {
                        bKing = true;
                        this.m_cbKingState[j] = true;
                        break;
                    }
                }
            }
            this.m_CardItemArray.push(this.AddCardItem({
                CardArray: this.m_CardArr,
                CardPool: this.m_CardPool,
                // CardPrefab: this.GetGamePrefab('CardPrefab'),
                CardPrefab:cc.instantiate(this.m_CardPrefab).getComponent('CardPrefab_PHZ'),
                ParentNode: this.node,
                Component: 'CardPrefab_PHZ',
                Scale: this.m_Scale,
                Display: this.m_cbCardData[i] > 0,
                cbCardData: this.m_cbCardData[i],
                Index: [this.m_cbCardCount],
                bShowKing: bKing,
            }));
        }
    },
    GetKingState: function () {
        return this.m_cbKingState;
    },
    //扑克数目
    GetCardCount2: function () {
        return this.m_cbCardCount;
    },

    //基准位置
    SetBenchmarkPos3: function () {
        this.node.anchorX = this.m_AnchorPoint.x;
        this.node.anchorY = this.m_AnchorPoint.y;
    },

    //基准位置
    SetScale2: function (scale) {
        this.node.scale = scale;
    },
    //基准位置
    SetCardScale: function (scale) {
       this.m_Scale = scale;
    },

    SetAction: function (cbUserAction) {
        if (cbUserAction == GameDef.ACK_NULL) return;
        // var szComName = this.GPComponentName('CustomActionPrefab', GameDef.KIND_ID);
        // if (!szComName) szComName = 'CustomAction_PHZ';
        var szComName = 'CustomAction_PHZ';
        var pActionCtrl = this.$('ActionNode/ActionCtrl@' + szComName);
        if (!pActionCtrl) return;
        pActionCtrl.SetUserAction(cbUserAction, cc.v2(0, 0));
        pActionCtrl.node.parent.zIndex = 1;
    },

    WeaveGoing: function (ptPosTarget) {
        this.node.setPosition(0, 0);
        this.SetScale2(0.5);
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.spawn(cc.moveTo(0.25, ptPosTarget), cc.scaleTo(0.25, 0.0001))));
    },

    GetWeaveItem: function () {
        return this.m_WeaveItem;
    },

    ShowType: function (WeaveItem, bShow) {
        this.InitView();
        if (!this.m_TypeSprite) return;
        this.m_TypeSprite.node.active = false;
        if(!bShow || !this.m_Atlas) return;
        var pFrame = null;
        if (WeaveItem.wWeaveKind == GameDef.ACK_NULL) {
            return;
        } else if ((GameDef.ACK_TI) && (WeaveItem.wWeaveKind & GameDef.ACK_TI)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeTi');
        } else if ((GameDef.ACK_PAO) && (WeaveItem.wWeaveKind & GameDef.ACK_PAO)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypePao');
        } else if ((GameDef.ACK_WEI) && (WeaveItem.wWeaveKind & GameDef.ACK_WEI)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeWei');
        } else if ((GameDef.ACK_PENG) && (WeaveItem.wWeaveKind & GameDef.ACK_PENG)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypePeng');
        } else if ((GameDef.ACK_CHI) && (WeaveItem.wWeaveKind & GameDef.ACK_CHI)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeChi');
        } else if ((GameDef.ACK_ZHANG) && (WeaveItem.wWeaveKind & GameDef.ACK_ZHANG)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeJiang');
        } else if ((GameDef.ACK_JIAO) && (WeaveItem.wWeaveKind & GameDef.ACK_JIAO)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeJiao');
        } else if ((GameDef.ACK_JIAO) && (WeaveItem.wWeaveKind & GameDef.ACK_SHUN)) {
            pFrame = this.m_Atlas.getSpriteFrame('imgTypeShun');
        } else {
            return;
        }
        this.m_TypeSprite.node.active = true;
        this.m_TypeSprite.spriteFrame = pFrame;

        if (WeaveItem.wWeaveKind == GameDef.ACK_NULL) {
            if(this.m_LbHuxi) {
                this.m_LbHuxi.string = '';
            }
        } else {
            if(this.m_LbHuxi) {
                this.m_LbHuxi.string = this.m_WeaveItem.cbHuxi;
            }
        }
    },

    ShowHu: function(WeaveItem, bShow, cbHuCard, dwCHR){
        this.unschedule(this.OnDelay_ShowHu);
        this.m_cbHuIndex = INVALID_BYTE;
        for(var i in this.m_cbCardData) {
            if(this.m_cbCardData[i] == cbHuCard) {
                this.m_cbHuIndex = i;
                break;
            }
        }
        if(this.m_cbHuIndex == INVALID_BYTE) return;

        if ((GameDef.ACK_TI) && (WeaveItem.wWeaveKind & GameDef.ACK_TI)) {
            if (!(dwCHR & (GameDef.CHR_TI | GameDef.CHR_WEI_TO_TI))) return;
        } else if ((GameDef.ACK_PAO) && (WeaveItem.wWeaveKind & GameDef.ACK_PAO)) {
            if (!(dwCHR & (GameDef.CHR_PAO | GameDef.CHR_WEI_TO_PAO | GameDef.CHR_PENG_TO_PAO))) return;
        } else if ((GameDef.ACK_WEI) && (WeaveItem.wWeaveKind & GameDef.ACK_WEI)) {
            if (!(dwCHR & (GameDef.CHR_WEI))) return;
        } else if ((GameDef.ACK_PENG) && (WeaveItem.wWeaveKind & GameDef.ACK_PENG)) {
        } else if ((GameDef.ACK_CHI) && (WeaveItem.wWeaveKind & GameDef.ACK_CHI)) {
        } else if ((GameDef.ACK_ZHANG) && (WeaveItem.wWeaveKind & GameDef.ACK_ZHANG)) {
        } else if ((GameDef.ACK_JIAO) && (WeaveItem.wWeaveKind & GameDef.ACK_JIAO)) {
        }
        this.m_CardItemArray[this.m_cbHuIndex].SetHu(true);
        this.scheduleOnce(this.OnDelay_ShowHu, 0.2);
    },

    OnDelay_ShowHu: function() {
        this.m_CardItemArray[this.m_cbHuIndex].SetHu(true);
    },

    ShowXing: function(cbFXCard, cbFXCount){
        this.unschedule(this.OnDelay_ShowXing);
        this.m_cbXingIndex = INVALID_BYTE;
        this.m_bShowXing = new Array(this.m_cbCardCount);
        this.m_bShowXing.fill(false);
        for (var i = 0; i < cbFXCount; ++i) {
            for (var j in this.m_cbCardData) {
                if (this.m_cbCardData[j] == cbFXCard[i]) this.m_bShowXing[j] = true;
            }
        }
        // this.m_CardItemArray[this.m_cbHuIndex].SetXing(true);
        this.scheduleOnce(this.OnDelay_ShowXing, 0.01);
    },

    OnDelay_ShowXing: function() {
        for(var i in this.m_bShowXing) {
            if(this.m_bShowXing[i]) this.m_CardItemArray[i].SetXing(true);
        }
    },
});
