//customswitch.js
cc.Class({
    extends: cc.BaseClass,

    properties: {
        NdClose:cc.Node,
        NdOpen:cc.Node,
        IsChecked:{
            default:true,
            tooltip: "switch statue",
            notify: function (oldValue) {
                if(this.NdOpen)this.NdOpen.active = !oldValue;
                if(this.NdClose)this.NdClose.active = oldValue;
            },
        },
        CheckEvents:[cc.Component.EventHandler],
    },
    start :function() {
        this.node.on(cc.Node.EventType.TOUCH_END,this._onTouchEnded,this);
    },
    _onTouchEnded:function(){
        this.IsChecked = !this.IsChecked;
        for(var i in this.CheckEvents){
            this.CheckEvents[i].emit([this, this.CheckEvents[i].customEventData]);
        }
    },
});
