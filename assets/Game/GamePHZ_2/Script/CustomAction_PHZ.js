var IDI_DELAY_SHOW = 100; // 100 ~ 200

cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_Atlas: cc.SpriteAtlas,
        m_ResponseNode: cc.Node,
    },

    ctor: function () {

        this.m_ItemArr = new Array();
        this.m_ItemPool = new cc.NodePool(cc.Sprite);

        this.m_DelayShowArr = new Array();
        this.m_DelayShowPool = new cc.NodePool(cc.Node);
    },

    onLoad: function () {},

    start: function () {

    },

    //////////////////////////////////////////////////////////////////
    //
    SetUserAction: function (cbUserAction, ptPos) {
        // if (cbUserAction & GameDef.ACK_TI) {
        //     return;
        // }
        // if (cbUserAction & GameDef.ACK_WEI) {
        //     return;
        // }

        // var pSprite = this.NewNode(this.node, cc.Sprite).getComponent(cc.Sprite);
        var pNodeArray = this.GetPreFormPool(this.m_ItemPool, null, this.node, cc.Sprite);
        if (!pNodeArray[0]) return;
        var pSprite = pNodeArray[0];
        this.m_ItemArr.push(pSprite);

        if (GameDef.ACK_TI && (cbUserAction & GameDef.ACK_TI)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionTi');
        }
        if (GameDef.ACK_WEI && (cbUserAction & GameDef.ACK_WEI)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionWei');
        }
        if (GameDef.ACK_PAO && (cbUserAction & GameDef.ACK_PAO)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionPao');
        }
        if (GameDef.ACK_CHI && (cbUserAction & GameDef.ACK_CHI)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionChi');
        }
        if (GameDef.ACK_CHI_EX && (cbUserAction & GameDef.ACK_CHI_EX)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionChi');
        }
        if (GameDef.ACK_PENG && (cbUserAction & GameDef.ACK_PENG)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionPeng');
        }
        if (GameDef.ACK_LISTEN_WUFU && (cbUserAction & GameDef.ACK_LISTEN_WUFU)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionPeng');
        }
        if (GameDef.ACK_CHIHU && (cbUserAction & GameDef.ACK_CHIHU)) {
            pSprite.spriteFrame = this.m_Atlas.getSpriteFrame('imgActionHu');
        }
        if (ptPos) pSprite.node.setPosition(ptPos);
        pSprite.node.runAction(this.GetAction());
    },

    GetAction: function () {
        var pScaleTo1 = cc.scaleTo(0.1, 0.1);
        var pScaleTo2 = cc.scaleTo(0.1, 1.2);
        var pScaleTo3 = cc.scaleTo(0.1, 0.8);
        var pScaleTo4 = cc.scaleTo(0.1, 1.0);
        var pSeq = cc.sequence(pScaleTo1, pScaleTo2, pScaleTo3, pScaleTo4, cc.delayTime(1), cc.callFunc(this.ActionEndCallFunc, this, this));
        return pSeq;
    },

    ActionEndCallFunc: function () {
        this.RemoveIntoPoolByID(this.m_ItemArr, this.m_ItemPool, 0);
    },
    //////////////////////////////////////////////////////////////////
    // 延迟显示
    DelayShowNode: function (fDelayT, fFadeInT, fFadeOutT, bRepeat) {
        if (!(this.node instanceof cc.Node)) return;
        if (this.m_ResponseNode instanceof cc.Node) this.m_ResponseNode.active = false;
        else if (this.m_ResponseNode.node instanceof cc.Node) this.m_ResponseNode.node.active = false;
        var seqArray = new Array();
        seqArray.push(cc.delayTime(fDelayT));
        seqArray.push(cc.callFunc(this.OnDelayShowNodeCallback, this, {
            _pResponseNode: this.m_ResponseNode,
            _fTimeFadeIn: fFadeInT,
            _fTimeFadeOut: fFadeOutT,
            _bRepeat: bRepeat,
        }));
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(seqArray));
    },

    OnDelayShowNodeCallback: function (a, b) {
        if (a) {
            // console.log(a);
        }
        if (b) {
            var pNode = null;
            if (b._pResponseNode instanceof cc.Node) pNode = b._pResponseNode;
            else if (b._pResponseNode.node instanceof cc.Node) pNode = b._pResponseNode.node;
            if (!pNode) return;
            pNode.active = true;
            pNode.opacity = 0;
            var seqArray = new Array();
            if (b._fTimeFadeIn) seqArray.push(cc.fadeIn(b._fTimeFadeIn));
            if (b._fTimeFadeOut) seqArray.push(cc.fadeOut(b._fTimeFadeOut));
            if (seqArray.length < 2) seqArray.push(cc.delayTime(1));
            var pSeq = cc.sequence(seqArray);
            if (b._bRepeat) pNode.runAction(cc.repeatForever(pSeq));
            else pNode.runAction(pSeq);
        }
    },

    OnDelayFadeInCallback: function (a, b) {
        if (a) {
            // console.log(a);
        }
        if (b) {
            // console.log(b);
        }
    },
});
