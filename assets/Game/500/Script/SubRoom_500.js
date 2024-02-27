cc.Class({
    extends: cc.SubRoomRules,

    properties: {},
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间

    OnUpdateCustomView:function(){
        if(this.$('PayWay/1050@Toggle').isChecked) {            //房主支付
            this.$('Game/1020/Label@Label').string = '12局X2';
            this.$('Game/1021/Label@Label').string = '24局X4';
            this.$('Game/1022/Label@Label').string = '48局X8';
        }else if(this.$('PayWay/1000@Toggle').isChecked) {      //AA支付
            this.$('Game/1020/Label@Label').string = '12局X1';
            this.$('Game/1021/Label@Label').string = '24局X1';
            this.$('Game/1022/Label@Label').string = '48局X1';
        }
    },

    //选项标题颜色
    UpdateSubitemTitleColor: function() {
        for(var i in this.node.children) {
            var pNode = this.$('New Node/Label', this.node.children[i]);
            if(pNode) pNode.color = this.m_Color[2];
        }
    },
});
