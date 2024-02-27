/**
 *　　　　　　　 ┏┓　 ┏┓+ +
 *　　　　　　　┏┛┻━━━┛┻┓ + +
 *　　　　　　　┃　　　　　　　┃ 　
 *　　　　　　　┃　　　━　　　┃ ++ + + +
 *　　　　　　 ████━████ ┃+
 *　　　　　　　┃　　　　　　　┃ +
 *　　　　　　　┃　　　┻　　　┃
 *　　　　　　　┃　　　　　　　┃ + +
 *　　　　　　　┗━┓　　　┏━┛
 *　　　　　　　　　┃　　　┃　　　　　　　　　　　
 *　　　　　　　　　┃　　　┃ + + + +
 *　　　　　　　　　┃　　　┃　　　　Code is far away from bug with the animal protecting　　　　　　　
 *　　　　　　　　　┃　　　┃ + 　　　　神兽保佑,代码无bug　　
 *　　　　　　　　　┃　　　┃
 *　　　　　　　　　┃　　　┃　　+　　　　　　　　　
 *　　　　　　　　　┃　 　　┗━━━┓ + +
 *　　　　　　　　　┃ 　　　　　　　┣┓
 *　　　　　　　　　┃ 　　　　　　　┏┛
 *　　　　　　　　　┗┓┓┏━┳┓┏┛ + + + +
 *　　　　　　　　　 ┃┫┫ ┃┫┫
 *　　　　　　　　　 ┗┻┛ ┗┻┛+ + + +
 */

var GameLogic = require('GameLogic_501');
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_HandCard: cc.Component,
        m_TypeCard: [cc.Component],
        m_nodeBtAll: [cc.Node],
        m_labTime: cc.Label,
        m_btSpecial: cc.Button,
        m_SpecialTip:cc.Node,
        m_btBestType:cc.Node,
        m_btBestType:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {

        this.m_CardType = {
            20: '三同花',
            21: '半小',
            22: '半大',
            23: '三顺子',
            24: '六对半',
            25: '6起',
            26: '7起',
            27: '五对三条',
            28: '四套三条',
            29: '全黑',
            30: '全红',
            31: '凑一色',
            32: '全小',
            33: '全大',
            34: '9起',
            35: '凤凰三点头',
            36: '全红一点黑',
            37: '全红一点黑',
            38: '10起',
            39: '三分天下',
            40: '三同花顺',
            41: '十二皇族',
            42: '一条龙',
            43: '一条花龙',
            44: '至尊清龙',
        };
    },

    onLoad() {
        this.node.active = false;
        this.m_cbCardType = 0;
        this.m_SpecialTip.active = false;
        this.m_Color = 0;
    },

    start() {

    },

    OnBtUp: function (tag, data) {
        var cbCard = this.m_HandCard.getShootCard();
        //cc.log(cbCard);
        var cbRealCard = this.m_TypeCard[data].setCardData(cbCard);
        //cc.log(cbRealCard);
        this.m_HandCard.removeCard(cbRealCard);
        this._AutoUp();
        this.updateView();
    },

    setUpCard: function (cbCard) {
        this.resetView();
        this.m_HandCard.removeCard(cbCard);
        this.m_TypeCard[0].setCardData(cbCard.slice(0, 3));
        this.m_TypeCard[1].setCardData(cbCard.slice(3, 8));
        this.m_TypeCard[2].setCardData(cbCard.slice(8));
        this.updateView(cbCard);
    },

    setCheckCard: function (cbFrontCard,cbMidCard,cbBackCard) {
        this.resetView();
        this.m_TypeCard[0].setCardData(cbFrontCard);
        this.m_TypeCard[1].setCardData(cbMidCard);
        this.m_TypeCard[2].setCardData(cbBackCard);
        var cbCard = new Array();
        for(var i =0; i < 3; i++){
            cbCard[i] = cbFrontCard[i];
        }
        for(var i =0; i < 3; i++){
            cbCard[i+3] = cbMidCard[i];
        }
        for(var i =0; i < 3; i++){
            cbCard[i+6] = cbBackCard[i];
        }
    

        this.updateView(cbCard);
        this.m_nodeBtAll[0].active = this.IsAllFull();
        this.m_nodeBtAll[1].active = this.IsAllFull();
    },

    OnBtCard: function (tag, data) {
        var Card = tag.target.getComponent('CardPrefab_500');
        var cbCard = Card.GetData();
        this.m_TypeCard[data].removeCard(cbCard);
        this.m_HandCard.addOneCard(cbCard);
        this.updateView();
    },

    OnBtCancel: function (tag, data) {
        if(this.m_TypeCard[data].m_cbCardData.length!=3) return
        this.m_HandCard.addCard(this.m_TypeCard[data].m_cbCardData);
        this.m_TypeCard[data].removeAllCard();
        this.updateView();
    },

    OnBtCancelAll: function (tag, data) {
        for (var i = 0; i < 3; i++) {
            this.m_HandCard.addCard(this.m_TypeCard[i].m_cbCardData);
            this.m_TypeCard[i].removeAllCard();
        }
        this.updateView();
    },

    OnBtAuto: function () {
        this.m_Hook.m_GameClientEngine.OnMessageAuto();
    },

    OnBtOK: function () {
        this.m_Hook.m_GameClientEngine.OnMessageShowCard(this.m_TypeCard[0].m_cbCardData,
            this.m_TypeCard[1].m_cbCardData, this.m_TypeCard[2].m_cbCardData, false);
    },

    setCardData: function (cbCard, cbCardType) {
        var cbCardData = deepClone(cbCard);
        GameLogic.getInstance().SortCardList(cbCardData, cbCardData.length, 2);
        this.m_HandCard.setCardData(cbCardData);
        this.m_cbHandCard = cbCardData;
        this.m_cbCardType = cbCardType;
    },

    OnBtClickedDaXiao:function(){
        var cbCard = this.m_HandCard.getAllCard();
       // this.m_HandCard.removeCard(cbCard);

        GameLogic.getInstance().SortCardList(cbCard, cbCard.length, this.m_Color);
        if(this.m_Color==0)
            this.m_Color = 2;
        else
            this.m_Color = 0;

        this.m_HandCard.setDaXiaoData(cbCard);
    },

    OnBtGiveUp:function(){
        this.ShowAlert("是否确定弃牌？", Alert_YesNo,
            function (Res) {
                if (Res) {
                    this.m_Hook.m_GameClientEngine.OnMessageGiveUp();
                }
            }.bind(this));
        
    },

    OnShowView: function () {
        this.node.stopAllActions();
        this.node.setPosition(cc.v2(0, 720));
        this.node.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, 0)),
            cc.callFunc(this._SpecialCallBack.bind(this), this)));

        this.unschedule(this._TimeCallBack);
        this.m_labTime.string = this.m_Hook.m_GameClientEngine.m_nTime;
        if(!this.m_Hook.m_GameClientEngine.m_ReplayMode) this.schedule(this._TimeCallBack, 1);
        // console.log('开始：'+new Date().getTime());
    },

    _TimeCallBack: function () {
        var cnt = parseInt(this.m_labTime.string);
        if(cnt > 0)this.m_labTime.string = --cnt;
        // else console.log('定時結束：'+new Date().getTime());
    },

    _SpecialCallBack: function () {
        if(this.m_cbCardType>0) this.OnShowSpecialCard();
    },

    OnShowSpecialCard:function(){
        //this.resetView();
        this.m_SpecialTip.active = true;
        this.$('SpecialTip/CardType@Label').string = this.m_CardType[this.m_cbCardType];
        for(var i = 0; i<this.m_cbHandCard.length;i++){
            var cardP = this.m_SpecialTip.getChildByName('CardNode').getChildByName('CardPrefab_'+i).getComponent('CardPrefab_500');
            if (!this.m_cbHandCard[i]) {
                cardP.node.active = false;
            } else {
                cardP.SetData(this.m_cbHandCard[i]);
                cardP.node.active = true;
            }
        }
        
        this.m_nCountDown = 150;
        this.m_LastTime = new Date().getTime();
        this.m_bNeedUpdate = true;
    },

    update:function(){
        if (this.m_bNeedUpdate) {
            var NowTime = new Date().getTime();
            var Second = parseInt((NowTime - this.m_LastTime) / 1000);
            var nCountDown = this.m_nCountDown - Second;
            if (Second >= this.m_nCountDown) {
                this.m_bNeedUpdate = false;
                this.OnBtSpecialYes();
            }
        }
    },

    OnBtSpecialYes: function(){
        this.m_SpecialTip.active = false;
        var cbCard = this.m_HandCard.getLeftCard();
        this.m_Hook.m_GameClientEngine.OnMessageShowCard(
            cbCard.slice(0, 3),
            cbCard.slice(3, 6),
            cbCard.slice(6, 9), true);
    },

    OnBtSpecialNo: function(){
        this.m_SpecialTip.active = false;
    },

    OnBtPassPutCard: function(){
        // cc.gSoundRes.PlaySound('Button');
        // this.ShowAlert("当前牌型为特殊牌型" + this.m_CardType[this.m_cbCardType] +
        //     ", 是否跳过摆牌?", Alert_YesNo,
        //     function (Res) {
        //         if (Res) {
        //             var cbCard = this.m_HandCard.getLeftCard();
        //             this.m_Hook.m_GameClientEngine.OnMessageShowCard(
        //                 cbCard.slice(0, 3),
        //                 cbCard.slice(3, 6),
        //                 cbCard.slice(6, 9), true);
        //         }
        //     }.bind(this));
    },

    OnHideView: function () {
        this.node.runAction(cc.moveTo(0.5, cc.v2(0, 1280)));
        // console.log('隱藏時間：'+new Date().getTime());
    },

    updateView: function (cbCard) {
        this.m_HandCard.unshootCard();
        var cbFullIdx = new Array();
        for (var i in this.m_TypeCard) {
            if (this.m_TypeCard[i].IsFull()) {
                cbFullIdx.push(i);
            }
        }
        if (cbFullIdx.length == 3) {
            if(cbCard == null){
                this.m_Hook.m_GameClientEngine.OnMessageCheckCard(this.m_TypeCard[0].m_cbCardData,this.m_TypeCard[1].m_cbCardData, this.m_TypeCard[2].m_cbCardData, false);
                return;
            }
        }
        this.m_nodeBtAll[0].active = this.IsAllFull();
        this.m_nodeBtAll[1].active = this.IsAllFull();
            
        
    },

    _AutoUp: function () {
        var cbCard = this.m_HandCard.getLeftCard();
        for (var i in this.m_TypeCard) {
            if (this.m_TypeCard[i].IsEmpty() && this.m_TypeCard[i].m_Cards.length == cbCard.length) {
                this.m_HandCard.removeCard(this.m_TypeCard[i].setCardData(cbCard));
            }
        }
    },

    IsAllFull: function () {
        for (var i in this.m_TypeCard) {
            if (!this.m_TypeCard[i].IsFull()) {
                return false;
            }
        }
        return true;
    },

    CheckError: function () {
        var cbFullIdx = new Array();
        for (var i in this.m_TypeCard) {
            if (this.m_TypeCard[i].IsFull()) {
                cbFullIdx.push(i);
            }
        }
        if (cbFullIdx.length < 2) return false;
        else if (cbFullIdx.length == 2) {
            if (0 > GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[0]].m_cbCardData,
                    this.m_TypeCard[cbFullIdx[1]].m_cbCardData)) {
                        console.log("--------------------------中尾");
                return false;
            }
        } else {
            if (0 > GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[0]].m_cbCardData,
                    this.m_TypeCard[cbFullIdx[1]].m_cbCardData) && 0 > GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[1]].m_cbCardData,
                    this.m_TypeCard[cbFullIdx[2]].m_cbCardData)){
                    return false;
                }
        }

        if(0<GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[0]].m_cbCardData,
            this.m_TypeCard[cbFullIdx[1]].m_cbCardData)){
                console.log("----------中尾"+GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[0]].m_cbCardData,
                    this.m_TypeCard[cbFullIdx[1]].m_cbCardData));
            }
        if(0<GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[1]].m_cbCardData,
                this.m_TypeCard[cbFullIdx[2]].m_cbCardData)>0){
                    console.log("----------中头"+GameLogic.getInstance().CompareCard(this.m_TypeCard[cbFullIdx[1]].m_cbCardData,
                        this.m_TypeCard[cbFullIdx[2]].m_cbCardData));
            }
        return true;
    },

    resetView: function () {
        for (var i in this.m_TypeCard) {
            this.m_TypeCard[i].removeAllCard();
        }
        this.updateView();
    }

    // update (dt) {},
});