
cc.Class({
    extends: cc.SubRoomRules,

    properties: {
     
    },
    //100-131 服务器规则  150-199 对应规则
    //100 =>AA付            150 =>房主付
    //101 =>代开            151 =>房主进入
    //102 =>积分房间        103 =>金币房间       152 =>练习房间
    ctor:function(){
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;

        //对立规则 非计算索引需 大于 32
        this.m_CheckMap = new Object();
        this.m_CheckMap[10003] = new Array(
            [3,33],//8/10 人
            [4,34],//倍数牛牛X4/ 牛牛X3
        );
        this.m_CheckMap2 =  new Array(
            [100,150],
            [101,151],
            [102,152],
            [103,152],
        );
    },
 
    SetClubView:function(){
        var NdClub = this.$('ClubNode');
        if(NdClub)NdClub.active = true;
        this.m_bNeedUpdate = true;
    },

    OnUpdateCustomView:function(){
        this.UpdataRoomCard();
    },

    UpdataRoomCard:function(){
        if(this.$("PayWay/1050@Toggle").isChecked){
            this.$("GameCount/1018/Label@Label").string = '8局x1';
            this.$("GameCount/1019/Label@Label").string = '16局x2';
            this.$("GameCount/1020/Label@Label").string = '32局x3';
        }else{
            this.$("GameCount/1018/Label@Label").string = '8局x1';
            this.$("GameCount/1019/Label@Label").string = '16局x1';
            this.$("GameCount/1020/Label@Label").string = '32局x1';
        } 
    },

    UpdateSubitemTitleColor: function() {
        for(var i in this.node.children) {
            var pNode = this.$('Node/Label', this.node.children[i]);
            if(pNode) pNode.color = this.m_Color[2];
        }
    },
});
