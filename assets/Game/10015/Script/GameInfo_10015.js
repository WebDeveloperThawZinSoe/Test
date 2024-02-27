
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
   
    SetGameData:function (GameRules, ServerRules) {
        //var ServerRules = this.m_Hook.m_GameClientEngine.m_dwServerRules;
        //var GameRules = this.m_Hook.m_GameClientEngine.m_dwRulesArr;
        this.$('LbRules1@Label').string = GameDef.GetGameName(ServerRules, GameRules);
        this.$('LbRules2@Label').string = GameDef.GetBaseScoreStr(ServerRules, GameRules);
        this.$('LbRules3@Label').string = GameDef.GetCardTimesStr(ServerRules, GameRules);
        this.$('LbRules4@Label').string = GameDef.GetRulesStr2(ServerRules, GameRules);
    },
    
});
