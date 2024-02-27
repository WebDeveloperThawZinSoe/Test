cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Card: [cc.Component]
    },

    ctor: function () {

    },

    onLoad: function () {
        this.m_CardPos = this.m_Card[0].node.getPosition();
    },


    SetHook: function (Hook) {
        this.m_Hook = Hook;
        this.m_Card[1].node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan.bind(this), this);
        this.m_Card[1].node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved.bind(this), this);
        this.m_Card[1].node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded.bind(this), this);
        this.m_Card[1].node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded.bind(this), this);
    },

    //触摸事件
    onTouchBegan: function (event) {
        event.stopPropagation();
        //滑动起始点
        this.m_TouchStart = event.touch.getLocation();
        return true;
    },

    onTouchMoved: function (event) {
        var curPos = event.touch.getLocation();
        var pos = cc.v2(curPos.x - this.m_TouchStart.x, curPos.y - this.m_TouchStart.y);
        this.m_Card[1].node.setPosition(this.m_CardPos.add(pos));
        this.m_MoveX = curPos.x - this.m_TouchStart.x;
    },
    
    onTouchEnded: function (event) {
        if (this.m_MoveX >= 100) return this.m_Hook.OnBnClickedShowCard();
        else {
            this.m_Card[1].node.setPosition(this.m_CardPos);
        }
    },
    SetCardData: function (cbCardData) {
        for (var i in cbCardData) {
            this.m_Card[i].SetData(cbCardData[i]);
        }
        this.m_Card[1].node.setPosition(this.m_CardPos);
        this.m_Card[0].node.runAction(cc.rotateTo(0.2, -5));
    },
});