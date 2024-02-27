//Alert.js
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_btNode:[cc.Node],
        m_labText:cc.Label,
    },
    /*OnShowView:function(){
        this.$('NoClick').setContentSize(10000, 10000);
        ShowS2N(this.node);
    },*/
    OnHideView:function(){
        //HideN2S(this.node, function(){
            if(this) this.OnDestroy();
        //}.bind(this));
    },
    ShowAlert:function(str,style,Func,Hook){
        this.m_Hook = Hook;
        this.m_callBack = Func;
        this.m_labText.string = str;
        for(var i in this.m_btNode){
            this.m_btNode[i].active = (((1<<i) & style) > 0);
        }
    },

    OnBtClick:function(Tag, Data){
        var res = null;
        if(Data == '1') res = true;
        if(Data == '0') res = false;

        if(this.m_callBack != null){
            if(this.m_Hook == null){
                this.m_callBack(res);
            }else{
                this.m_Hook[this.m_callBack](res);
            }
        }
        this.HideView();
    },

});
