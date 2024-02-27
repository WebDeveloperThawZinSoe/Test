cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre:function(){
        this.node.active = false;
        this.$('@UserCtrl').SetUserByID(0);
        this.$('code@Label').string = '';
    },
    SetPreInfo:function(ID){
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=22&OnLineID='+ID;
        WebCenter.GetData(webUrl, 666666, function (data) {
            this.node.active = true;
            var PayInfo = JSON.parse(data);
            this.$('account@Label').string = PayInfo[0];
            this.$('money@Label').string = PayInfo[1];
            this.$('num@Label').string = PayInfo[2];
            if(PayInfo[3]) this.$('@UserCtrl').SetUserByID(PayInfo[3]);
            this.timeText =  this.$('time@Label').string;
            this.$('time@Label').string = PayInfo[5];

            if(PayInfo[4] < 2){
                this.$('state@Label').string = '未支付';
                this.$('state').color = cc.color(250,17,17);
            }else{
                this.$('state@Label').string = '已完成';
                this.$('state').color = cc.color(0,220,126);
            }
        }.bind(this));
    },


    // update (dt) {},
});
