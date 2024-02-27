cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_FontArr:[cc.Font],
    },
    ctor:function(){
    },
    
    InitPre:function(){
        this.$('@UserCtrl').SetUserByID(0);
        this.$('Score@Label').string = '0';
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){//0 UserID  1 Info 2 gamedef 3ID
        this.node.active = true;
        this.m_dwUserID = ParaArr[0];
        this.m_Info = ParaArr[1];
        this.m_RecordID = ParaArr[3];

        this.$('@UserCtrl').SetUserByID(this.m_dwUserID);
        this.$('@UserCtrl').SetShowFullName(false);

        if (this.m_Info[8][this.m_dwUserID][0] >= 0) {
            this.$('Score@Label').string = '+' + window.TransitionScore(this.m_Info[8][this.m_dwUserID][0]) ;
            this.$('Score@Label').font = this.m_FontArr[0];
        } else {
            this.$('Score@Label').string = window.TransitionScore(this.m_Info[8][this.m_dwUserID][0]);
            this.$('Score@Label').font = this.m_FontArr[1];
        }
    },
});
