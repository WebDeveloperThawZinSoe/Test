//Alert.js
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabRulse:cc.Label,
    },
    /*OnShowView:function(){
        this.$('NoClick').setContentSize(10000, 10000);
        ShowS2N(this.node);
    },*/
    SetRules:function(rules){
        this.m_LabRulse.string = rules;
    },

});
