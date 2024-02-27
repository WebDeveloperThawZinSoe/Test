cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Label:[cc.Label]
    },

    InitPre:function(){
        
    },
    SetPreInfo:function(ParaArr){
        this.m_Label[0].string = ParaArr[1][0];
        this.m_Label[1].string = ParaArr[1][0];
        this._KindID = ParaArr[1][1];
        if(ParaArr[0] == 0){
            this.$('@Toggle').check();
        }
    },

    OnTogClick:function(){
        // this.m_Hook.OnShowGame();
        this.m_Hook.OnToggleSelGame(null,this._KindID);
    },
});
