cc.Class({
    extends: cc.BaseClass,
    properties: {
    },
    ctor:function(){
        this.m_bFirstShow = true;
    },
    OnShowView:function(){
        this.m_EndTime = null;
        if(this.m_bFirstShow)this.schedule(this.OnCheck, 1);
        this.SetWorkStr('加载中');
        this.m_bFirstShow = false;
    },
    OnHideView:function(){
        this.m_EndTime = null;
        if(this.node) this.node.active = false;
    },
    SetWorkStr:function(str){
        if(this.m_LbWork == null) this.m_LbWork = this.$('LbWork@Label');
        this.m_strWork = str;
        this.m_PtCnt = 0;
        this.OnCheck();
    },
    SetOverTime:function(time){
        this.m_DelayTime = time;
        if(time == null || time <= 0) return;
        this.m_EndTime = new Date().getTime() + this.m_DelayTime*1000;
    },
    OnCheck:function() {
        if(this.m_EndTime == null) return
        if(this.m_LbWork){
            this.m_LbWork.string = this.m_strWork;
            for(var i=0;i<this.m_PtCnt;i++) this.m_LbWork.string += '.';
            if(this.m_PtCnt++ >= 3) this.m_PtCnt = 0;
        }

        var Now = new Date().getTime();
        if( this.m_EndTime - Now <= 0){
            if(this.m_Hook)this.m_Hook.LoadingOver();
            this.m_EndTime = Now + this.m_DelayTime*1000;
        }
    },
});
