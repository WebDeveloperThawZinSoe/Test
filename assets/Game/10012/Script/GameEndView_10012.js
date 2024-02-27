cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_UserInfo = new Array();
    },

    onLoad:function(){
        var _winSize = cc.winSize;

        if (_winSize.width < 1250)
        {
            var scaleX = _winSize.width/1250;
    
            this.node.scaleX = scaleX;
            this.node.scaleY = scaleX;
        }
    },
    
    SetEndInfo:function(pEndInfo){
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var wLoser = INVALID_CHAIR;
        var lWinScore = 0;
        var lLoseScore = 0;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( pEndInfo.llTotalScore[i] > lWinScore){
                lWinScore = pEndInfo.llTotalScore[i];
                wWinner = i;
            }
            if( pEndInfo.llTotalScore[i] < lLoseScore){
                lLoseScore = pEndInfo.llTotalScore[i];
                wLoser = i;
            }
        }
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndUserInfo_'+GameDef.KIND_ID);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        var indexArr = this.SortUserIndexByScore(pEndInfo.llTotalScore);
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(pEndInfo.UserID[indexArr[i]] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [indexArr[i], pEndInfo, wWinner, wLoser]);
        }
    },
    
    SortUserIndexByScore:function(ScoreInfo){
        var indexArr = new Array();
        var scoreArr = new Array();
        var totalCnt = 0;
        for(var i in ScoreInfo){
            if(i == 'Time') continue;
            indexArr[totalCnt] = i;
            scoreArr[totalCnt] = ScoreInfo[i];
            totalCnt++;
        }
        for (var i = 0 ; i < totalCnt - 1 ; i++)
        {
            for (var j = i + 1 ; j < totalCnt ; j++)
            {
                if (scoreArr[i] < scoreArr[j])
                {
                    var score = scoreArr[i];
                    scoreArr[i] = scoreArr[j];
                    scoreArr[j] = score;
                    
                    var index = indexArr[i];
                    indexArr[i] = indexArr[j];
                    indexArr[j] = index;
                }
            }
        }
        return indexArr;
    },

       //分享信息
       GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.m_pEndInfo.UserID[i] == null) continue;
            if(ShareInfo.desc != '') ShareInfo.desc += '/'
            ShareInfo.desc += '【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName+'】';
            ShareInfo.desc += (this.m_pEndInfo.llTotalScore[i] >= 0?'+':'')+this.m_pEndInfo.llTotalScore[i];
        }
        ShareInfo.link = cc.share.MakeLink_GameEnd();
        return ShareInfo;
    },
});
