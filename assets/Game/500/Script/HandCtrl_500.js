var GameLogic = require('GameLogic_500')

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Atlas: cc.SpriteAtlas,
        m_AtlasType: cc.SpriteAtlas,
        m_nodeLine: cc.Node,
        m_nodeRange: cc.Node,
        m_spCardType: [cc.Sprite],
        m_labScore: [cc.Label],
    },

    // LIFE-CYCLE CALLBACKS:

    ctor: function () {
        this.posLine = new Array();
        this.m_nodeLineCard = new Array();
        this.m_spRangeCard = new Array();
        this.m_llTotal = 0;
        this.m_cbSpecialType = 0;
    },

    onLoad() {
        for (var i = 0; i < GameDef.MAX_COUNT; i++) {
            this.m_nodeLineCard[i] = this.m_nodeLine.getChildByName('Card' + i);
            this.m_spRangeCard[i] = this.m_nodeRange.getChildByName('Card' + i).getComponent(cc.Sprite);
            this.posLine[i] = this.m_nodeLineCard[i].getPosition();
        }
        this.m_nodeSpecial = this.node.getChildByName('Special');
        this.resetView();
    },

    start() {

    },

    sendCard: function () {
        this.m_nodeLine.active = true;
        this.m_nodeRange.active = false;
        this.node.active = true;
        this.resetLine();
        for (var i in this.m_nodeLineCard) {
            this.m_nodeLineCard[i].setPosition(this.posLine[0]);
            this.m_nodeLineCard[i].stopAllActions();
            this.m_nodeLineCard[i].active = true;
            this.m_nodeLineCard[i].runAction(cc.moveTo(0.5, this.posLine[i]));
        }
        this.scheduleOnce(this.showRanging, 0.5);
        return 0.5
    },

    showRanging: function () {
        this.resetLine();
        this.m_nodeLine.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            for (var i in this.m_nodeLineCard) {
                this.m_nodeLineCard[i].runAction(cc.sequence(cc.delayTime(parseInt(i) * 0.1),
                    cc.moveBy(0.2, cc.v2(0, 30)),
                    cc.moveBy(0.2, cc.v2(0, -30))
                ))
            }
        }, this), cc.delayTime(1.4))));

    },

    showRangeView: function () {
        this.resetLine();
        this.m_nodeLine.active = false;
        this.m_nodeRange.active = true;
    },

    setCardData: function (cbCardData) {
        for (var i in cbCardData) {
            this.m_nodeLineCard[i].getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame(this.m_Hook.GetCardSprite(cbCardData[i]));
        }
    },

    resetLine: function () {
        this.m_nodeLine.stopAllActions();
        for (var i in this.m_nodeLineCard) {
            this.m_nodeLineCard[i].stopAllActions();
            this.m_nodeLineCard[i].setPosition(this.posLine[i]);
        }
    },

    showCompare: function (cbCardData, index, score, FinalScore) {
        var spCard = this._getSegmentCard(this.m_spRangeCard, index);
        for (var i in spCard) {
            spCard[i].spriteFrame = this.m_Atlas.getSpriteFrame(this.m_Hook.GetCardSprite(cbCardData[i]));
            spCard[i].node.runAction(cc.sequence(cc.scaleTo(0.2, 1.5), cc.scaleTo(0.2, 1), 
            cc.callFunc(function (tag, data) {
                var type = GameLogic.getInstance().GetCardType(data[1]);
               // cc.gSoundRes.PlayGameSound('type' + type);
                this.m_spCardType[data[0]].spriteFrame = this.m_AtlasType.getSpriteFrame('type'+ type);
                this.m_spCardType[data[0]].node.active = true;

                //颜色转换，输为红，赢为黄
                var LabelOutLineScore = this.m_labScore[data[0]].getComponent(cc.LabelOutline);
                if(score < 0) {
                    this.m_labScore[data[0]].node.color = new cc.Color(222, 68, 0);
                    LabelOutLineScore.color = new cc.Color(222, 68, 0);
                }else{
                    this.m_labScore[data[0]].node.color = new cc.Color(244, 203, 88);
                    LabelOutLineScore.color = new cc.Color(244, 203, 88);
                }

                if(score > 0 ) this.m_labScore[data[0]].string = '+' + Score2Str(score);
                else this.m_labScore[data[0]].string = Score2Str(score);
                this.m_labScore[data[0]].node.active = true;

            }, this, [index, cbCardData, score])))
        }

        return 0.2;
    },

    showAllCompare: function (cbCardData, score, Final) {
        const spCard = this.m_spRangeCard;
        const TypeArr = [];
        for (const i in spCard) {
            spCard[i].spriteFrame = this.m_Atlas.getSpriteFrame(this.m_Hook.GetCardSprite(cbCardData[i]));
            spCard[i].node.runAction(cc.sequence(cc.scaleTo(0.2, 1.5), cc.scaleTo(0.2, 1),
                cc.callFunc(function (tag, data) {
                    for (let SegIndex = 0; SegIndex < 3; SegIndex++) {
                        TypeArr[SegIndex] = GameLogic.getInstance().GetCardType(this._getSegmentCard(cbCardData, SegIndex));
                        // cc.gSoundRes.PlayGameSound('type' + TypeArr[SegIndex]);
                        this.m_spCardType[SegIndex].spriteFrame = this.m_AtlasType.getSpriteFrame('type' + TypeArr[SegIndex]);
                        this.m_spCardType[SegIndex].node.active = true;

                        if (score[SegIndex] > 0) {
                            this.m_labScore[SegIndex].string = '+' +Score2Str(score[SegIndex]) ;
                            this.m_labScore[SegIndex].node.color =  new cc.Color(244, 203, 88);
                        } else {
                            this.m_labScore[SegIndex].string = '' + Score2Str(score[SegIndex]) ;
                            this.m_labScore[SegIndex].node.color = new cc.Color(222, 68, 0);
                        }
                        this.m_labScore[SegIndex].node.active = true;
                    }

                }, this, [cbCardData, score])));

        }
        return 0.2;
    },
    showTotalScore:function(FinalScore){
        this.m_labScore[3].string = Score2Str(FinalScore);
        this.m_labScore[3].node.active = true;
    },
    
    setSpecialType: function(CardType){
        this.m_cbSpecialType = CardType;
    },

    showSpecial: function (cbCardData) {
        this.m_nodeLine.active = true;
        this.m_nodeRange.active = false;
        this.resetLine();
        for (var i in this.m_nodeLineCard) {
            this.m_nodeLineCard[i].getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame(this.m_Hook.GetCardSprite(cbCardData[i]));
        }
    },

    _getSegmentCard: function (cbCardData, index) {
        console.assert(cbCardData.length == GameDef.MAX_COUNT);
        if (index == 0) return cbCardData.slice(0, 3);
        else if (index == 1) return cbCardData.slice(3, 8);
        else return cbCardData.slice(8);
    },

    resetView: function () {
        this.resetLine();
        this.m_nodeLine.active = false;
        this.m_nodeRange.active = false;
        for (var i in this.m_nodeLineCard) {
            this.m_nodeLineCard[i].getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame('255');
            this.m_spRangeCard[i].spriteFrame = this.m_Atlas.getSpriteFrame('255');
        }
        for (var i in this.m_spCardType) {
            this.m_spCardType[i].node.active = false;
        }
        for (var i in this.m_labScore) {
            this.m_labScore[i].node.active = false;
        }
        this.m_llTotal = 0;
        this.m_nodeSpecial.active = false;
    },

    // update (dt) {},
});