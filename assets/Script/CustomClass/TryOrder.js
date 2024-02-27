
cc.Class({
    extends: cc.Component,

    properties: {
        m_TargetNode: cc.Node,
        m_btReset: cc.Button,
        m_strOrder: cc.String,
    },

    ctor: function() {
        this.m_strInput = '';
        this.m_ButtonArray = new Array();
    },

    onLoad: function() {

        for(var i = 0; i < 100; ++ i){
            this.m_ButtonArray[i] = this.node.getChildByName(''+i);
            if(this.m_ButtonArray[i]) {
                this.m_ButtonArray[i] = this.m_ButtonArray[i].getComponent(cc.Button);
            } else {
                break;
            }
        }


        for(var i = 0; i < this.m_ButtonArray.length; ++ i) {

            if (this.m_ButtonArray[i]) {

                var pHandler = new cc.Component.EventHandler();
                pHandler.target = this.node;
                pHandler.component = "TryOrder";
                pHandler.handler = "OnButtonCliecked";
                pHandler.customEventData = ''+i;
                this.m_ButtonArray[i].clickEvents.push(pHandler);
            }
        }

        if(this.m_btReset) {
            var pHandler = new cc.Component.EventHandler();
            pHandler.target = this.node;
            pHandler.component = "TryOrder";
            pHandler.handler = "OnButtonClieckedReset";
            // pHandler.customEventData = ''+i;
            this.m_btReset.clickEvents.push(pHandler);
        }
    },

    start: function () {
        if(window.LOGIN_SERVER_IP == "192.168.0.234") this.m_strOrder = '0';
        if(cc.sys.isBrowser && !cc.share.IsH5_WX()) {
            this.m_strOrder = '0';
        }
    },

    OnButtonCliecked: function(event, customData) {
        this.m_strInput += customData;
        this.OnFinish();
    },

    OnButtonClieckedReset: function() {
        this.m_strInput = '';
        this.m_TargetNode.active = false;
    },

    OnFinish: function() {
        if(this.m_strInput == this.m_strOrder) {
            if(this.m_TargetNode) this.m_TargetNode.active = true;
        } else {
            this.m_TargetNode.active = false;
        }
    },
});
