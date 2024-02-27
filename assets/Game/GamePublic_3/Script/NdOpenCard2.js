cc.Class({
    extends: cc.BaseClass,

    onLoad:function(){
        this._Poker = this.$('PokerNode@PokerNode');
    },
    SetHook:function(Hook) {
        this._Poker.SetHook(Hook);
    },
    SetCardData :function(cbCardData){
        this._Poker.SetCardData(cbCardData);
    },
});
