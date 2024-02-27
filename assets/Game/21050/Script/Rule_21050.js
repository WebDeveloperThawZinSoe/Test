cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    // onLoad () {},

    start () {

    },
    OnShowRule:function(dwRules,dwServerRules){
        this.$("BG/LbRule@Label").string = GameDef.GetRulesStr(dwRules, dwServerRules);
    }

    // update (dt) {},
});
