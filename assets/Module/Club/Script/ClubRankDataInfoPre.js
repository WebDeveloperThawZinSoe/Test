cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    InitPre:function(){
        if(this.m_userCtrl == null)this.m_userCtrl = this.$('@UserCtrl')
        this.m_userCtrl.SetUserByID(0);
        if(this.m_LbCnt1 == null) this.m_LbCnt1 = this.$('Cnt1@Label');
        if(this.m_LbCnt2 == null) this.m_LbCnt2 = this.$('Cnt2@Label');
        if(this.m_LbCnt3 == null) this.m_LbCnt3 = this.$('Cnt3@Label');
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){//[i+1,Res[i][0],Res[i][1], RandType]);  index userid cnt type
        switch(ParaArr[1][1]){
            case 0:this.OnShowGameInfor(ParaArr[1][0]);return;
            case 1:this.OnShowScoreInfor(ParaArr[1][0]);return;
            case 2:this.OnShowRevenceInfor(ParaArr[1][0]);return;
            case 3:this.OnShowRoomInfor(ParaArr[1][0]);return;
            default:return;
        }
    },
    OnShowGameInfor:function(arr){
        this.m_userCtrl.SetUserByID(arr[0]);
        this.m_LbCnt3.string = arr[1];
        this.node.active = true;
    },
    OnShowScoreInfor:function(arr){
        this.m_userCtrl.SetUserByID(arr[0]);
        this.m_LbCnt3.string = arr[1];
        this.node.active = true;
    },
    OnShowRevenceInfor:function(arr){
        this.m_userCtrl.SetUserByID(arr[0]);
        this.m_LbCnt3.string = Score2Str(parseInt(arr[1]));
        this.node.active = true;
    },
    OnShowRoomInfor:function(arr){
        this.m_userCtrl.SetUserByID(arr[0]);
        this.m_LbCnt3.string = Score2Str(parseInt(arr[1]));
        this.node.active = true;
    },
    // update (dt) {},
});
