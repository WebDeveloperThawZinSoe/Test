cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    InitPre:function(){

    },
    SetPreInfo:function(ID){
        var webUrl = window.PHP_HOME+'/League.php?GetMark=56&ID='+ID[1];
        WebCenter.GetData(webUrl, null, function (data) {
            var Info = JSON.parse(data);
            this.$('Cnt1@Label').string = Score2Str(parseInt(Info[0]));
            this.$('Cnt3@Label').string = Info[2].replace(/ /,'\n');
            this.$('Cnt2@Label').string = (Info[1]==0?'存入':'取出');
            this.$('Cnt2').color = (Info[1]==0?cc.color(55, 153, 23):cc.color(223, 35, 10));
            this.$('Cnt0@Label').string = Score2Str(parseInt(Info[3]));
        }.bind(this));
    },
});
