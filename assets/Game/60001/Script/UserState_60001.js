cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CountNode: cc.Node,
        m_WarningNode: cc.Node,
        m_clockNode: cc.Node,
        m_stateSprite: cc.Sprite,
        m_atlas: cc.SpriteAtlas,
        m_PokerAtlas: cc.SpriteAtlas
    },

    start: function () {
        this.m_CountNode.active = false;
        this.m_clockNode.active = false;
        this.m_stateSprite.node.active = false;
        this.schedule(this.UpdateView, 1);
        this.RefreshCntBG();
    },

    Init: function () {
        this.HideCnt();
        this.HideState();
        this.ShowClock(false);
        this.m_LabCnt = this.$('Label@Label',this.m_CountNode);
        this.m_LabClock = this.$('Label@Label',this.m_clockNode);
    },

    SetEnableCnt: function (bEnable) {
        this.m_bEnableCnt = bEnable ? true : false;
    },

    ShowCnt: function (Cnt) {
        this.m_CountNode.active = this.m_bEnableCnt;
        if(this.m_LabCnt) this.m_LabCnt.string = Cnt;
    },

    RefreshCntBG: function() {
        var pBGFrame = this.m_PokerAtlas.getSpriteFrame((('255') ));
        if(!pBGFrame) pBGFrame = this.m_PokerAtlas.getSpriteFrame(this.m_cbCardData);
        // var pSp = this.$('@Sprite', this.m_CountNode);
        // if(pSp) pSp.spriteFrame = pBGFrame;
    },

    ShowCntWarning: function(bShow) {
        this.m_WarningNode.active = bShow;
    },

    HideCnt: function () {
        this.m_CountNode.active = false;
    },

    ShowClock: function (bShow) {
        this.m_clockNode.active = bShow;
    },

    SetClockNum: function (Num) {
        this.m_LabClock.string = Num;
    },

    //准备:Ready 抢地主:Rob 要不起:NoHave 踢:Kick 不踢:NoKick 123分:123  不叫:255 不要:Pass
    ShowUserState: function (state, second) {
        this.stateCntDown = second;
        this.m_stateSprite.node.active = true;
        this.m_stateSprite.spriteFrame = this.m_atlas.getSpriteFrame('State' + state);
    },
    
    HideState: function () {
        this.stateCntDown = null;
        this.m_stateSprite.node.active = false;
    },

    UpdateView: function () {
        //状态
        if (this.stateCntDown > 0) {
            this.stateCntDown--;
        } else if (this.stateCntDown == 0) {
            this.HideState();
        }
    },

    //基准位置
    SetBenchmarkPos: function (nXPos, nYPos, Mode) {
        var stateMode = (Mode - 1) / 2; // 1 2 3 => 0 0.5 1
        this.node.setPosition(nXPos, nYPos);
        this.node.anchorX = stateMode;
        this.node.getComponent(cc.Layout).horizontalDirection = stateMode;
    },
});
