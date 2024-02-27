cc.Class({
    extends: cc.BaseClass,

    properties: {

    },
    ctor:function(){
    },

    InitPre:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubRecordUserItem2', this);
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){//0 Kind  1 RecordID 2 index 3 info
        this.node.active = true;
        this.m_KindID = ParaArr[1][0];
        this.m_RecordID = ParaArr[1][1];
        this.m_GameIndex = ParaArr[1][2];
        this.m_ScoreInfo = ParaArr[1][3];

        this.$('Info/LabTime@Label').string = this.m_ScoreInfo['Time'];
        this.$('Info/LbIndex@Label').string = pad(this.m_GameIndex, 2) ;

        for(var i in this.m_ScoreInfo){
            if(i == 'Time') continue;
            this.m_ListCtrl.InsertListInfo(0, [i, this.m_ScoreInfo[i]]);
        }
    },
    OnClick_RePlayGame:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        //g_Lobby.OnRePlayGame(this.m_RecordID, this.m_KindID, pGlobalUserData, this.m_GameIndex - 1);
		var lookerId = 0;

        for(var i in this.m_ScoreInfo)
        {
            if(i == 'Time') continue;
            lookerId = parseInt(i);
            break;
        }
        for(var i in this.m_ScoreInfo)
        {
            if(i == 'Time') continue;
            if(pGlobalUserData.dwUserID == i)
            {
                lookerId = parseInt(pGlobalUserData.dwUserID);
                break;
            }
        }

        var LookUser = new Object();
        LookUser.dwUserID = lookerId;//pGlobalUserData.dwUserID;
        g_Lobby.OnRePlayGame(this.m_RecordID, this.m_KindID, LookUser, this.m_GameIndex - 1);
    },
    OnAnalysisReplay:function(){
        return
        GameDef = new window['CMD_GAME_'+this.m_KindID]();
        //显示手牌（回放 处理逻辑 )
        try {
            this.m_ReplayEngine = this.node.getComponent('ReplayEngine_'+this.m_KindID);
            if(this.m_ReplayEngine == null) this.m_ReplayEngine = this.node.addComponent('ReplayEngine_'+this.m_KindID);
        } catch (error) {
            if(window.LOG_NET_DATA)console.log(error)
            return false;
        }

        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=1&ID='+this.m_RecordID+'&GameIndex='+(this.m_GameIndex-1);
        WebCenter.GetData(webUrl, 999999, function (data) {
            if(data.length < 50){
               console.log('err 11111 ',webUrl)
                return
            }

            var RecordInfo = JSON.parse(data);
            if(RecordInfo[0] == 0) {
                console.log('err 22222 ',webUrl)
                return
            }
            if(this.m_ReplayEngine){
                this.m_ReplayEngine.SetData(RecordInfo[3], 0, true);

                for(var i in this.m_ReplayEngine.GameData[0].user){
                    var TempUserID = this.m_ReplayEngine.GameData[0].user[i].dwUserID;
                    var TempChairID = this.m_ReplayEngine.GameData[0].user[i].wChairID;
                    var Score,CardData,CardType,Banker,Player,bBanker;
                    Score = this.m_ReplayEngine.GameData.GameEnd.llGameScore[TempChairID];
                    if(this.m_ReplayEngine.GameData.CardData) CardData = this.m_ReplayEngine.GameData.CardData[TempChairID];
                    //牌型
                    if(this.m_ReplayEngine.GameData.OxType) CardType = this.m_ReplayEngine.GameData.OxType[TempChairID];
                    //庄显示
                    if(this.m_ReplayEngine.GameData.lBankerCall) Banker = this.m_ReplayEngine.GameData.lBankerCall[TempChairID];
                    if(Banker == 0xff) Banker='';
                    if(Banker == 0) Banker='不抢';
                    if(Banker > 0 && Banker < 0xff) Banker+='倍';
                    //闲显示
                    if(this.m_ReplayEngine.GameData.lPlayerCall) Player = this.m_ReplayEngine.GameData.lPlayerCall[TempChairID];
                    if(Player == 0) Player='';
                    if(Player > 0 ) Player='X'+Player;

                    bBanker = this.m_ReplayEngine.GameData.wBankerUser == TempChairID;
                    this.m_ListCtrl.InsertListInfo(0, [TempUserID, Score, CardData, this.m_ReplayEngine.GameData.CardCnt, CardType, Banker, Player, bBanker]);//0 UserID  1 Score 2 Card 3 CardCnt 4 Type 5Banker 6Player  7bBanker
                }
            }
        }.bind(this));
    },
});
