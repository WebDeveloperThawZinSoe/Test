cc.Class({
    extends: cc.BaseClass,

    properties: {

    },
    InitPre:function () {
        this.$('@UserCtrl').SetUserByID();
        this.m_LabRes = this.$('LabDis@Label');
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){//UserID wChairID StatusArr
        this.$('@UserCtrl').SetUserByID(ParaArr[0]);
        this.node.active = true;
        if(ParaArr[1] != null){
            this.m_LabRes.string = '';
            var byRes = ParaArr[2][ParaArr[1]];
            if(byRes == 1){
                this.m_LabRes.string = '同意';
                this.m_LabRes.node.color = cc.color(76, 187, 40);
            }
            if(byRes == 2){
                this.m_LabRes.string = '拒绝';
                this.m_LabRes.node.color = cc.color(223, 96, 10);
            }
        }
    },
});
