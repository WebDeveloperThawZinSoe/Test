var GameLogic = require('GameLogic_501')

var TIP_DUIZI_1 = 0;
var TIP_DUIZI_2 = 1;
var TIP_TIAO_3 = 2;
var TIP_SHUNZI = 3;
var TIP_TONGHUA = 4;
var TiP_HULU = 5;
var TIP_TIAO_4 = 6;
var TIP_TONGHUASHUN = 7;
var TIP_TIAO_5 = 8;
var TIP_MAX = 9;


cc.Class({
    extends: cc.Component,

    properties: {
        m_Cards: [cc.Component],
        m_Layout: cc.Node,
        m_btType: [cc.Button],
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.m_Tips = new Array(TIP_MAX);
    },

    onLoad() {
        this.m_nXDistance = this.m_Cards[0].GetCardWidth() + this.m_Layout.getComponent(cc.Layout).spacingX;
        this.m_Layout.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded, this);
    },

    //触摸事件
    onTouchBegan: function (event) {
        event.stopPropagation();
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        this._startIdx = this._getTouchIndex(calcX);
        this.m_Cards[this._startIdx].setSelect(true);
    },
    onTouchMoved: function (event) {
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        this._endIdx = this._getTouchIndex(calcX);
        for (var i = 0; i < this.m_Cards.length; i++) {
            if (this._endIdx > this._startIdx && i >= this._startIdx && i <= this._endIdx ||
                this._endIdx <= this._startIdx && i >= this._endIdx && i <= this._startIdx)
                this.m_Cards[i].setSelect(true)
            else
                this.m_Cards[i].setSelect(false);
        }
    },

    onTouchEnded: function (event) {
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        for (var i in this.m_Cards) {
            if (!this.m_Cards[i].node.active) continue;
            if (this.m_Cards[i].selcet) {
                this.m_Cards[i].setCardShoot(!this.m_Cards[i].shoot);
                this.m_Cards[i].setSelect(false);
            }
        }
    },

    _getStratPosX: function () {
        for (var i in this.m_Cards) {
            if (!this.m_Cards[i].node.active) continue;
            return this.m_Cards[i].node.getPosition().x - this.m_Cards[i].GetCardWidth() / 2;
        }
    },

    _getLastOne: function () {
        for (var i = this.m_Cards.length - 1; i >= 0; i--) {
            if (!this.m_Cards[i].node.active) continue;
            return parseInt(i);
        }
    },

    _getTouchIndex: function (posx) {
        var index = 0;
        var x = this._getStratPosX();
        for (var i in this.m_Cards) {
            if (!this.m_Cards[i].node.active) continue;
            index++;
            if (posx < (index * this.m_nXDistance + x)) {
                return parseInt(i);
            }
        }
        return this._getLastOne();
    },

    getShootCard: function () {
        var cbCardData = new Array();
        for (var i in this.m_Cards) {
            if (!this.m_Cards[i].node.active) continue;
            if (this.m_Cards[i].shoot) {
                cbCardData.push(this.m_Cards[i].GetData());
            }
        }
        return cbCardData;
    },

    setCardData: function (cbCardData) {
        for (var i in cbCardData) {
            if (!cbCardData[i]) {
                this.m_Cards[i].node.active = false;
            } else {
                this.m_Cards[i].SetData(cbCardData[i]);
                this.m_Cards[i].node.active = true;
            }
        }
        this.updateTips();
    },

    setDaXiaoData:function(cbCardData){
    

        var bShowArr = new Array();
        for (var i in this.m_Cards) {
            bShowArr[this.m_Cards[i].GetData()] = this.m_Cards[i].node.active;
        }

        for (var i in cbCardData) {
            this.m_Cards[i].SetData(cbCardData[i]);
            this.m_Cards[i].node.active = bShowArr[cbCardData[i]];
        }
    },

    shootCard: function (cbCardData) {
        //cc.log('shootCard ' + cbCardData);
        for (var i in cbCardData) {
            if (!cbCardData[i]) continue;
            for (var j in this.m_Cards) {
                if (!this.m_Cards[j].node.active) continue;
                if (cbCardData[i] == this.m_Cards[j].GetData() && !this.m_Cards[j].shoot) {
                    this.m_Cards[j].setCardShoot(true);
                    break;
                }
            }
        }
    }, 

    removeCard: function (cbCardData) {
        for (var i in cbCardData) {
            if (!cbCardData[i]) continue;
            for (var j in this.m_Cards) {
                if (!this.m_Cards[j].node.active) continue;
                if (cbCardData[i] == this.m_Cards[j].GetData()) {
                    this.m_Cards[j].node.active = false;
                    break
                }
            }
        }
        this.updateTips();
    },

    addCard: function (cbCardData) {
        for (var i in cbCardData) {
            if (!cbCardData[i]) continue;
            for (var j in this.m_Cards) {
                if (!this.m_Cards[j].node.active && cbCardData[i] == this.m_Cards[j].GetData()) {
                    this.m_Cards[j].node.active = true;
                    break;
                }
            }
        }
        this.updateTips();
    },

    addOneCard: function (cbCardData) {
        if (!cbCardData) return;
        for (var j in this.m_Cards) {
            if (!this.m_Cards[j].node.active && cbCardData == this.m_Cards[j].GetData()) {
                this.m_Cards[j].node.active = true;
                break;
            }
        }
        this.updateTips();
    },

    unshootCard: function () {
        for (var i in this.m_Cards) {
            this.m_Cards[i].setCardShoot(false);
            this.m_Cards[i].setSelect(false);
        }
    },

    getLeftCard: function () {
        var cbCard = new Array();
        for (var i in this.m_Cards) {
            if (this.m_Cards[i].node.active) {
                cbCard.push(this.m_Cards[i].GetData());
            }
        }
        return cbCard;
    },

    getAllCard: function () {
        var cbCard = new Array();
        for (var i in this.m_Cards) {
            cbCard.push(this.m_Cards[i].GetData());
        }
        return cbCard;
    },

    updateTips: function () {
        this.hideAllButton();
        var cbCard = this.getLeftCard();
        if (cbCard.length < 2) return;

        this.m_Tips[TIP_DUIZI_1] = GameLogic.getInstance().SearchSameCard(cbCard, cbCard.length, 2);
        this.m_Tips[TIP_DUIZI_2] = GameLogic.getInstance().Search2Double(cbCard, cbCard.length);
        this.m_Tips[TIP_TIAO_3] = GameLogic.getInstance().SearchSameCard(cbCard, cbCard.length, 3);
        this.m_Tips[TIP_SHUNZI] = GameLogic.getInstance().SearchLineCardType(cbCard, cbCard.length, 3);
        this.m_Tips[TIP_TONGHUA] = GameLogic.getInstance().SearchSameColorType(cbCard, cbCard.length, 3);
        this.m_Tips[TiP_HULU] = GameLogic.getInstance().SearchTakeCardType(cbCard, cbCard.length, 3, 2);
        this.m_Tips[TIP_TIAO_4] = GameLogic.getInstance().SearchTakeCardType(cbCard, cbCard.length, 4, 1);
        this.m_Tips[TIP_TONGHUASHUN] = GameLogic.getInstance().SearchSameColorLineType(cbCard, cbCard.length, 3);
        this.m_Tips[TIP_TIAO_5] = GameLogic.getInstance().SearchSameCard(cbCard, cbCard.length, 5)

        for (var i in this.m_btType) {
            this.m_Tips[i].current = 0;
            this.m_btType[i].interactable = this.m_Tips[i].cbSearchCount > 0;
        }
    },

    OnBtCardType: function (tag, data) {
        this.unshootCard();

        this.shootCard(this.m_Tips[data].cbResultCard[this.m_Tips[data].current]);
        this.m_Tips[data].current++;
        if (this.m_Tips[data].current >= this.m_Tips[data].cbSearchCount)
            this.m_Tips[data].current = 0;
    },

    hideAllButton: function () {
        for (var i in this.m_btType) {
            this.m_btType[i].interactable = false;
        }
    },


    resetView: function () {
        for (var i in this.m_Cards) {
            this.m_Cards[i].setCardShoot(false);
            this.m_Cards[i].setSelect(false);
            this.m_Cards[i].node.active = false;
            this.m_Cards[j].SetData(0xff);
        }
        this.node.active = false;
    }

    // update (dt) {},
});