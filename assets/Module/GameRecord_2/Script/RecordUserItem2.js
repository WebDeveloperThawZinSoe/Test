cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_FontArr:[cc.Font],
    },
    ctor:function(){
    },
    
    InitPre:function(){
        this.$('@UserCtrl').SetUserByID(0);
        this.$('Score@Label').string = '';
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){ 
        this.node.active = true;
        this.$('@UserCtrl').SetUserByID(ParaArr[0]);
        if (ParaArr[1] >= 0) {
            this.$('Score@Label').string = '+' + window.TransitionScore(ParaArr[1]);
            this.$('Score@Label').font = this.m_FontArr[0];
        } else {
            this.$('Score@Label').string = window.TransitionScore(ParaArr[1]);
            this.$('Score@Label').font = this.m_FontArr[1];
        }
    },
});
