//customslider.js
cc.Class({
    extends: cc.Slider,

    properties: {
        m_Bar:cc.Mask,
    },

    OnMoveSloder:function() {
        if(this.direction)
            this.m_Bar.node.height = this.node.height * this.progress
        else
            this.m_Bar.node.width = this.node.width * this.progress
    },
    SetProgress:function(value) {
        this.progress = value;
        this.OnMoveSloder();
    }
});
