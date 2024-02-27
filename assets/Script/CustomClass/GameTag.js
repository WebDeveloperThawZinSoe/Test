cc.Class({
    extends: cc.BaseClass,

    properties: {
       
    },

    onLoad:function(){
        this._gameName1 = this.$('Background/Label@Label');
        this._gameName2 = this.$('checkmark/Label@Label');
    },

    OnClick_tog:function(){
        this.m_Hook.OnClick_ToggleGame(null,this._KindID);
    },

    InitPre:function(){
        
    },

    SetPreInfo:function(Info){
        this._KindID = Info[0];
        this._gameName1.string = Info[1];
        this._gameName2.string = Info[1];
        if(Info[2]) this.$('@Toggle').check();
    }

});
