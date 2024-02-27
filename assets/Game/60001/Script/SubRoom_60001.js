cc.Class({
    extends: cc.SubRoomRules,

    properties: {},
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间
    OnUpdateCustomView:function(){
        var HeadTitle = 'ScrollView/view/content/';
        var player = 2;
        if(this.$(HeadTitle+'GamePlayer/1017@Toggle').isChecked) player = 3;
        if(this.$(HeadTitle+"PayMode/1050@Toggle").isChecked){
            this.$(HeadTitle+"GameCount/1020/Label@Label").string = '8局x'+ player*1;
            this.$(HeadTitle+"GameCount/1021/Label@Label").string = '10局x'+ player*2;
            this.$(HeadTitle+"GameCount/1022/Label@Label").string = '20局x'+ player*3;
            this.$(HeadTitle+"GameCount/1023/Label@Label").string = '30局x'+ player*4;
        }else{
            this.$(HeadTitle+"GameCount/1020/Label@Label").string = '8局x1';
            this.$(HeadTitle+"GameCount/1021/Label@Label").string = '10局x2';
            this.$(HeadTitle+"GameCount/1022/Label@Label").string = '20局x3';
            this.$(HeadTitle+"GameCount/1023/Label@Label").string = '30局x4';
        } 
    },
    //选项标题颜色
    UpdateSubitemTitleColor: function() {
        for(var i in this.$('ScrollView/view/content').children) {
            var pNode = this.$('New Node/Label', this.$('ScrollView/view/content').children[i]);
            if(pNode) pNode.color = this.m_Color[2];
        }
    },
});
