cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    //点击注册
    SetShowView:function(Card) {
       this.$('Text@Label').string = '恭喜获得'+Card+'颗钻石';
    },
});
